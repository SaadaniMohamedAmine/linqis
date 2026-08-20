import { Request, Response } from "express";
import { redis } from "../queue/config";

const SSE_CLIENTS = new Map<string, Response>();

export function subscribeToProgress(jobId: string, res: Response) {
  SSE_CLIENTS.set(jobId, res);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ status: "connected", jobId })}\n\n`);

  // Cleanup on close
  res.on("close", () => {
    SSE_CLIENTS.delete(jobId);
  });
}

// jobId is string | undefined because BullMQ's Job.id has that type (a job
// only gets an id once it's actually been added to the queue) -- callers in
// worker.ts pass job.id directly, so these guard with an early return instead
// of forcing every call site to assert non-null.
export async function publishProgress(jobId: string | undefined, data: any) {
  if (!jobId) return;
  const clients = SSE_CLIENTS.get(jobId);
  if (clients && !clients.writableEnded) {
    clients.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

export async function publishComplete(jobId: string | undefined, data: any) {
  if (!jobId) return;
  const clients = SSE_CLIENTS.get(jobId);
  if (clients && !clients.writableEnded) {
    clients.write(`data: ${JSON.stringify({ ...data, status: "completed" })}\n\n`);
    clients.end();
    SSE_CLIENTS.delete(jobId);
  }
}

export async function publishError(jobId: string | undefined, error: string) {
  if (!jobId) return;
  const clients = SSE_CLIENTS.get(jobId);
  if (clients && !clients.writableEnded) {
    clients.write(`data: ${JSON.stringify({ status: "error", error })}\n\n`);
    clients.end();
    SSE_CLIENTS.delete(jobId);
  }
}
