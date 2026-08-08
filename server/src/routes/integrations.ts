import { Router } from "express";
import fs from "fs";
import path from "path";
import { getZoomRecordings, downloadZoomRecording } from "../services/integrations/zoom";
import { getGoogleAuthUrl, getGoogleCalendarEvents, exchangeGoogleCode } from "../services/integrations/google-calendar";
import { extractAudio, needsChunking, chunkAudio, getAudioDuration } from "../services/media";
import { meetingQueue } from "../queue/config";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";
import { requireWorkspaceAdmin } from "../middleware/auth";

export const router = Router();

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * downloadZoomRecording sends the account-wide Zoom Server-to-Server OAuth
 * token in an Authorization header, so whatever host the URL names receives
 * that credential -- a key to every recording in the operator's Zoom account.
 * The URL arrives in the request body, so without this check any member of
 * any workspace could aim it at their own server (credential exfiltration) or
 * at an internal host / cloud metadata endpoint (SSRF, with the response
 * written to uploads/). Only https hosts under zoom.us are accepted; the
 * download itself also runs with redirects disabled so a redirect can't carry
 * the header off-domain afterwards.
 */
function isZoomDownloadUrl(rawUrl: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  return parsed.hostname.toLowerCase().endsWith(".zoom.us");
}

// Zoom Routes
//
// Both are requireWorkspaceAdmin, unlike the rest of this router. Zoom
// authenticates once account-wide from env config (there is no per-user or
// per-workspace Zoom credential), so these two routes read and import from
// the operator's single shared recording library rather than from anything
// scoped to the caller's workspace. Hiding the "Browse recordings" button in
// the dashboard is not a boundary on its own -- without this, any member of
// any workspace could still curl these directly. The gate is per-route, not
// on the /api/integrations mount, because the Google Calendar routes below
// are per-user and must stay member-accessible.
router.get("/zoom/recordings", requireWorkspaceAdmin, async (req, res) => {
  try {
    const { from, to } = req.query;
    const recordings = await getZoomRecordings(from as string, to as string);
    res.json(recordings);
  } catch (error) {
    console.error("Zoom recordings error:", error);
    res.status(500).json({ error: "Failed to fetch Zoom recordings" });
  }
});

router.post("/zoom/import", requireWorkspaceAdmin, async (req: AuthedRequest, res) => {
  try {
    const { recordingId, downloadUrl, title, isAudioOnly } = req.body;

    if (!downloadUrl) {
      return res.status(400).json({ error: "downloadUrl is required" });
    }

    if (!isZoomDownloadUrl(downloadUrl)) {
      return res.status(400).json({ error: "downloadUrl must be an https zoom.us URL" });
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
        userId: req.userId!,
        workspaceId: req.workspaceId!,
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

router.post("/google-calendar/exchange", async (req: AuthedRequest, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "code is required" });
    }

    const tokens = await exchangeGoogleCode(code);
    const prisma = getPrisma();
    const userId = req.userId!;

    await prisma.integration.upsert({
      where: { userId_provider: { userId, provider: "google-calendar" } },
      create: {
        userId,
        provider: "google-calendar",
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
      update: {
        accessToken: tokens.access_token!,
        ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    });

    res.json({ status: "connected" });
  } catch (error) {
    console.error("Google Calendar token exchange error:", error);
    res.status(500).json({ error: "Failed to connect Google Calendar" });
  }
});

router.get("/status", async (req: AuthedRequest, res) => {
  try {
    const prisma = getPrisma();
    const integrations = await prisma.integration.findMany({
      where: { userId: req.userId },
      select: { provider: true, createdAt: true },
    });
    res.json(integrations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch integration status" });
  }
});
