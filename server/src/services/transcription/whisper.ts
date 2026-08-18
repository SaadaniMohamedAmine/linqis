import fs from "fs";
import Groq, { toFile } from "groq-sdk";

// Was previously HF's free Inference API (api-inference.huggingface.co),
// which HF has since retired -- every transcription call failed at the
// fetch() with a raw "fetch failed" (DNS no longer resolves). Groq already
// has a configured API key in this project for the chat models, and it
// hosts Whisper directly, so it replaces HF here as both the fix and the
// simpler dependency (one fewer provider).
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export interface TranscriptSegment {
  speaker: string;
  timestamp: string;
  content: string;
}

interface GroqVerboseSegment {
  start: number;
  text: string;
}

async function callGroqWhisper(filePath: string) {
  const transcription = await groq.audio.transcriptions.create({
    file: await toFile(fs.createReadStream(filePath)),
    model: "whisper-large-v3",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
    // Without this, Whisper auto-detects language per segment and can drift
    // onto a random language mid-file on silence/noise/ambiguous audio
    // (observed: real English meetings hallucinating Welsh mid-transcript).
    // Forcing English removes that decision entirely. Revisit if/when the
    // product needs to support non-English meetings.
    language: "en",
  });

  return transcription as unknown as { text: string; segments?: GroqVerboseSegment[] };
}

export async function transcribeAudio(filePath: string): Promise<string> {
  const { text } = await callGroqWhisper(filePath);
  return text || "";
}

// verbose_json gives real segment start times, unlike the old HF free tier
// (which returned plain text only, forcing a 30s-per-sentence approximation).
export async function transcribeWithTimestamps(filePath: string): Promise<TranscriptSegment[]> {
  const { text, segments } = await callGroqWhisper(filePath);

  if (segments?.length) {
    return segments.map((segment) => ({
      speaker: "Speaker",
      timestamp: formatTimestamp(segment.start),
      content: segment.text.trim(),
    }));
  }

  const sentences = text.split(/[.!?]+/).filter(Boolean);
  return sentences.map((sentence: string, index: number) => ({
    speaker: "Speaker",
    timestamp: formatTimestamp(index * 30),
    content: sentence.trim(),
  }));
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
