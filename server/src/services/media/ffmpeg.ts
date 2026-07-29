import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const OUTPUT_DIR = path.join(UPLOAD_DIR, "audio");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

export async function extractAudio(videoPath: string): Promise<string> {
  const fileName = path.basename(videoPath, path.extname(videoPath));
  const outputPath = path.join(OUTPUT_DIR, `${fileName}.mp3`);

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .audioCodec("libmp3lame")
      .audioBitrate("128k")
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .save(outputPath);
  });
}

export async function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration || 0);
    });
  });
}

export async function getFileSize(filePath: string): Promise<number> {
  const stats = fs.statSync(filePath);
  return stats.size;
}
