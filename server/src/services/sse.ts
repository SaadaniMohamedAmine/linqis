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

export async function publishProgress(jobId: string, data: any) {
  const clients = SSE_CLIENTS.get(jobId);
  if (clients && !clients.writableEnded) {
    clients.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

export async function publishComplete(jobId: string, data: any) {
  const clients = SSE_CLIENTS.get(jobId);
  if (clients && !clients.writableEnded) {
    clients.write(`data: ${JSON.stringify({ ...data, status: "completed" })}\n\n`);
    clients.end();
    SSE_CLIENTS.delete(jobId);
  }
}

export async function publishError(jobId: string, error: string) {
  const clients = SSE_CLIENTS.get(jobId);
  if (clients && !clients.writableEnded) {
    clients.write(`data: ${JSON.stringify({ status: "error", error })}\n\n`);
    clients.end();
    SSE_CLIENTS.delete(jobId);
  }
}
