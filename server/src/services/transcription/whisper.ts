import fs from "fs";

const HF_WHISPER_ENDPOINT = "https://api-inference.huggingface.co/models/openai/whisper-large-v3";

export interface TranscriptSegment {
  speaker: string;
  timestamp: string;
  content: string;
}

async function callHuggingFaceWhisper(filePath: string): Promise<string> {
  const audioBuffer = fs.readFileSync(filePath);

  const response = await fetch(HF_WHISPER_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "audio/mpeg",
    },
    body: audioBuffer,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Hugging Face Whisper request failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.text || "";
}

export async function transcribeAudio(filePath: string): Promise<string> {
  return callHuggingFaceWhisper(filePath);
}

// NOTE: the free Hugging Face Inference API for Whisper does not return
// word/segment-level timestamps (unlike OpenAI's Whisper API, which the
// original spec called for). Timestamps below are approximated at 30s per
// sentence purely to keep the UI/reassembly pipeline working - they are not
// accurate. Switching to a provider that returns real timestamps (OpenAI
// Whisper, or a self-hosted faster-whisper) is a known follow-up, not fixed
// here since it changes the cost profile of the app.
export async function transcribeWithTimestamps(filePath: string): Promise<TranscriptSegment[]> {
  const text = await callHuggingFaceWhisper(filePath);

  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const segments: TranscriptSegment[] = sentences.map((sentence: string, index: number) => ({
    speaker: "Speaker",
    timestamp: formatTimestamp(index * 30),
    content: sentence.trim(),
  }));

  return segments;
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
