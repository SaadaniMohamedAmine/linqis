import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const CHUNK_DIR = path.join(process.cwd(), "uploads", "chunks");
const CHUNK_MAX_SIZE = 24 * 1024 * 1024; // 24MB (under 25MB limit)
const CHUNK_DURATION = 10 * 60; // 10 minutes per chunk

if (!fs.existsSync(CHUNK_DIR)) {
  fs.mkdirSync(CHUNK_DIR, { recursive: true });
}

export interface ChunkInfo {
  path: string;
  index: number;
  start: number;
  duration: number;
}

export async function chunkAudio(
  filePath: string,
  maxDuration: number
): Promise<ChunkInfo[]> {
  const fileName = path.basename(filePath, path.extname(filePath));
  const chunks: ChunkInfo[] = [];
  let currentTime = 0;
  let chunkIndex = 0;

  while (currentTime < maxDuration) {
    const chunkPath = path.join(CHUNK_DIR, `${fileName}_chunk_${chunkIndex}.mp3`);
    const duration = Math.min(CHUNK_DURATION, maxDuration - currentTime);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(filePath)
        .setStartTime(currentTime)
        .setDuration(duration)
        .audioCodec("libmp3lame")
        .audioBitrate("128k")
        .on("end", () => resolve())
        .on("error", reject)
        .save(chunkPath);
    });

    chunks.push({
      path: chunkPath,
      index: chunkIndex,
      start: currentTime,
      duration,
    });

    currentTime += duration;
    chunkIndex++;
  }

  return chunks;
}

export async function needsChunking(filePath: string): Promise<boolean> {
  const stats = fs.statSync(filePath);
  return stats.size > CHUNK_MAX_SIZE;
}

export function cleanupChunks(chunks: ChunkInfo[]): void {
  chunks.forEach((chunk) => {
    if (fs.existsSync(chunk.path)) {
      fs.unlinkSync(chunk.path);
    }
  });
}
