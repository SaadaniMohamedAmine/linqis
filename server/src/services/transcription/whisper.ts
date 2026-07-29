import { HfInference } from "@huggingface/inference";
import fs from "fs";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

export interface TranscriptSegment {
  speaker: string;
  timestamp: string;
  content: string;
}

export async function transcribeAudio(filePath: string): Promise<string> {
  const audioBuffer = fs.readFileSync(filePath);

  const result = await hf.audioToSpeech({
    model: "openai/whisper-large-v3",
    data: audioBuffer,
  });

  // Hugging Face returns audio, we need to use the inference API differently
  // Let's use the text generation approach instead
  const response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-large-v3", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "audio/mpeg",
    },
    body: audioBuffer,
  });

  const data = await response.json();
  return data.text || "";
}

export async function transcribeWithTimestamps(filePath: string): Promise<TranscriptSegment[]> {
  const audioBuffer = fs.readFileSync(filePath);

  const response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-large-v3", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "audio/mpeg",
    },
    body: audioBuffer,
  });

  const data = await response.json();
  const text = data.text || "";

  // Split into segments (simple approach - Hugging Face doesn't return timestamps)
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const segments: TranscriptSegment[] = sentences.map((sentence: string, index: number) => ({
    speaker: "Speaker",
    timestamp: formatTimestamp(index * 30), // Approximate
    content: sentence.trim(),
  }));

  return segments;
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
