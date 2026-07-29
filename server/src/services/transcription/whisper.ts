import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface TranscriptSegment {
  speaker: string;
  timestamp: string;
  content: string;
}

export async function transcribeAudio(filePath: string): Promise<string> {
  const audioFile = fs.createReadStream(filePath);

  const response = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  return response.text || "";
}

export async function transcribeWithTimestamps(filePath: string): Promise<TranscriptSegment[]> {
  const audioFile = fs.createReadStream(filePath);

  const response = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  const segments: TranscriptSegment[] = (response.segments || []).map((seg) => ({
    speaker: "Speaker",
    timestamp: formatTimestamp(seg.start || 0),
    content: seg.text.trim(),
  }));

  return segments;
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
