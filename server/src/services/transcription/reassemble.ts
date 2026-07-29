import fs from "fs";
import path from "path";

export interface ChunkMetadata {
  index: number;
  startOffset: number;
  duration: number;
}

export function reassembleTranscript(
  segments: Array<{ speaker: string; timestamp: string; content: string }>,
  chunks?: ChunkMetadata[]
): string {
  if (!chunks || chunks.length === 0) {
    return segments.map((s) => `[${s.timestamp}] ${s.speaker}: ${s.content}`).join("\n");
  }

  // Reassemble with corrected timestamps across chunks
  const reassembled = segments.map((seg) => {
    const chunkIndex = chunks.findIndex(
      (c) => seg.timestamp >= formatTimestamp(c.startOffset) &&
             seg.timestamp < formatTimestamp(c.startOffset + c.duration)
    );
    const offset = chunkIndex >= 0 ? chunks[chunkIndex].startOffset : 0;
    const correctedTime = correctTimestamp(seg.timestamp, offset);
    return `[${correctedTime}] ${seg.speaker}: ${seg.content}`;
  });

  return reassembled.join("\n");
}

function correctTimestamp(timestamp: string, offsetSeconds: number): string {
  const parts = timestamp.split(":").map(Number);
  const totalSeconds = parts[0] * 60 + parts[1] + offsetSeconds;
  return formatTimestamp(totalSeconds);
}

function formatTimestamp(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function mergeTranscripts(
  transcripts: Array<{ speaker: string; timestamp: string; content: string }>[]
): Array<{ speaker: string; timestamp: string; content: string }> {
  const all = transcripts.flat();
  return all.sort((a, b) => {
    const timeA = parseTimestamp(a.timestamp);
    const timeB = parseTimestamp(b.timestamp);
    return timeA - timeB;
  });
}

function parseTimestamp(timestamp: string): number {
  const parts = timestamp.split(":").map(Number);
  return parts[0] * 60 + parts[1];
}
