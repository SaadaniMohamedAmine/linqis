import { Router } from "express";
import fs from "fs";
import path from "path";
import { getZoomRecordings, downloadZoomRecording } from "../services/integrations/zoom";
import { getGoogleAuthUrl, getGoogleCalendarEvents } from "../services/integrations/google-calendar";
import { extractAudio, needsChunking, chunkAudio, getAudioDuration } from "../services/media";
import { meetingQueue } from "../queue/config";
import { getPrisma } from "../db";

export const router = Router();

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Zoom Routes
router.get("/zoom/recordings", async (req, res) => {
  try {
    const { from, to } = req.query;
    const recordings = await getZoomRecordings(from as string, to as string);
    res.json(recordings);
  } catch (error) {
    console.error("Zoom recordings error:", error);
    res.status(500).json({ error: "Failed to fetch Zoom recordings" });
  }
});

router.post("/zoom/import", async (req, res) => {
  try {
    const { recordingId, downloadUrl, title, userId, isAudioOnly } = req.body;

    if (!downloadUrl) {
      return res.status(400).json({ error: "downloadUrl is required" });
    }

    const prisma = getPrisma();

    // Download the recording from Zoom's cloud storage
    const buffer = await downloadZoomRecording(downloadUrl);

    // Zoom cloud recordings are .mp4 (video) by default, or .m4a when the
    // recording_type is "audio_only". The caller (frontend) knows which
    // recording_file it picked, so it passes isAudioOnly explicitly.
    const ext = isAudioOnly ? ".m4a" : ".mp4";
    const fileName = `zoom-${recordingId || Date.now()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    const meeting = await prisma.meeting.create({
      data: {
        title: title || `Zoom recording ${recordingId ?? ""}`.trim(),
        userId: userId || "anonymous",
        audioUrl: `/uploads/${fileName}`,
        status: "PROCESSING",
      },
    });

    // Same pipeline as the direct upload route: extract audio if needed,
    // chunk if >24MB, then hand off to the BullMQ worker.
    let audioPath = filePath;
    if (!isAudioOnly) {
      audioPath = await extractAudio(filePath);
    }

    const duration = await getAudioDuration(audioPath);
    const shouldChunk = await needsChunking(audioPath);
    const chunks = shouldChunk ? await chunkAudio(audioPath, duration) : [];

    await prisma.meeting.update({
      where: { id: meeting.id },
      data: { duration: Math.round(duration) },
    });

    const job = await meetingQueue.add("process-meeting", {
      meetingId: meeting.id,
      audioPath,
      chunks: chunks.map((c) => c.path),
      duration,
    });

    res.json({
      status: "imported",
      meetingId: meeting.id,
      jobId: job.id,
      recordingId,
      duration,
      chunked: shouldChunk,
      chunkCount: chunks.length,
    });
  } catch (error) {
    console.error("Zoom import error:", error);
    res.status(500).json({ error: "Failed to import Zoom recording" });
  }
});

// Google Calendar Routes
router.get("/google-calendar/auth-url", (req, res) => {
  try {
    const authUrl = getGoogleAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error("Google Calendar auth URL error:", error);
    res.status(500).json({ error: "Failed to generate auth URL" });
  }
});

router.get("/google-calendar/events", async (req, res) => {
  try {
    const { accessToken, timeMin, timeMax } = req.query;
    if (!accessToken) {
      return res.status(400).json({ error: "Access token required" });
    }

    const events = await getGoogleCalendarEvents(
      accessToken as string,
      timeMin as string,
      timeMax as string
    );
    res.json(events);
  } catch (error) {
    console.error("Google Calendar events error:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});
