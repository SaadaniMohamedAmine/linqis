import { Router } from "express";
import { meetingQueue, redis } from "../queue/config";

export const router = Router();

// Add job to queue
router.post("/", async (req, res) => {
  const { meetingId, audioUrl } = req.body;
  const job = await meetingQueue.add("process-meeting", {
    meetingId,
    audioUrl,
  });
  res.json({ jobId: job.id, meetingId });
});

// SSE endpoint for real-time progress
router.get("/progress/:jobId", (req, res) => {
  const jobId = req.params.jobId;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  redis.subscribe(`bull:meeting-processing:${jobId}:progress`);

  redis.on("message", (_channel, message) => {
    res.write(`data: ${message}\n\n`);
  });

  req.on("close", () => {
    redis.unsubscribe();
    res.end();
  });
});
