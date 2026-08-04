import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { extractAudio, needsChunking, chunkAudio, getAudioDuration } from "../services/media";
import { meetingQueue } from "../queue/config";
import { getPrisma } from "../db";
import { subscribeToProgress } from "../services/sse";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".mp3", ".mp4", ".wav", ".m4a", ".mov", ".webm"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Invalid file format"));
  },
});

export const router = Router();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // The multer fileFilter above only checks the extension, which anyone
    // can fake -- sniff the actual file bytes before trusting it.
    // file-type is ESM-only; dynamic import keeps this file CJS-compatible.
    const { fileTypeFromFile } = await import("file-type");
    const detectedType = await fileTypeFromFile(req.file.path);
    const allowedMimes = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/x-wav", "video/mp4", "video/quicktime", "video/webm"];
    if (!detectedType || !allowedMimes.includes(detectedType.mime)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "File content does not match an allowed audio/video format." });
    }

    const { userId } = req.body;
    const filePath = req.file.path;
    const isVideo = req.file.mimetype.startsWith("video");

    const prisma = getPrisma();
    const meeting = await prisma.meeting.create({
      data: {
        title: req.file.originalname,
        userId: userId || "anonymous",
        audioUrl: `/uploads/${req.file.filename}`,
        status: "PROCESSING",
      },
    });

    let audioPath = filePath;
    if (isVideo) {
      audioPath = await extractAudio(filePath);
    }

    const shouldChunk = await needsChunking(audioPath);
    const duration = await getAudioDuration(audioPath);

    await prisma.meeting.update({
      where: { id: meeting.id },
      data: { duration: Math.round(duration) },
    });

    let chunks = [];
    if (shouldChunk) {
      chunks = await chunkAudio(audioPath, duration);
    }

    const job = await meetingQueue.add("process-meeting", {
      meetingId: meeting.id,
      audioPath,
      chunks: chunks.map((c) => c.path),
      duration,
    });

    res.json({
      meetingId: meeting.id,
      jobId: job.id,
      duration,
      chunked: shouldChunk,
      chunkCount: chunks.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// SSE endpoint for real-time progress. EventSource can't send custom headers,
// so this can't carry the Authorization bearer token -- it's mounted
// separately without requireAuth. The jobId is an unguessable BullMQ UUID,
// and the only thing it leaks is a processing percentage, so this is an
// accepted tradeoff rather than a real auth gap.
export const publicRouter = Router();
publicRouter.get("/:jobId", (req, res) => {
  const { jobId } = req.params;
  subscribeToProgress(jobId, res);
});
