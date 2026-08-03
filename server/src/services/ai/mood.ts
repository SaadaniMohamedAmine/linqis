import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateJsonWithRetry } from "./json-utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export type MeetingMood = "POSITIVE" | "NEUTRAL" | "TENSE";

export interface MoodAnalysis {
  mood: MeetingMood;
  confidence: number;
  indicators: string[];
}

async function complete(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function detectMood(transcript: string): Promise<MeetingMood> {
  const prompt = `Analyze the overall mood of this meeting. Consider:
- Tone of voice indicators (if noted)
- Language used (positive/negative words)
- Level of agreement vs disagreement
- Energy level

Return ONLY one word: POSITIVE, NEUTRAL, or TENSE.

Meeting transcript:
${transcript}`;

  const mood = (await complete(prompt)).toUpperCase();
  if (mood.includes("TENSE")) return "TENSE";
  if (mood.includes("POSITIVE")) return "POSITIVE";
  return "NEUTRAL";
}

export async function detectMoodWithAnalysis(transcript: string): Promise<MoodAnalysis> {
  return generateJsonWithRetry(
    (correctionHint) => `Analyze the overall mood of this meeting. Return a JSON object with:
- mood: "POSITIVE", "NEUTRAL", or "TENSE"
- confidence: 0-1 number
- indicators: array of short phrases that support the mood assessment

Meeting transcript:
${transcript}

Return ONLY valid JSON, no markdown.${correctionHint ? `\n\n${correctionHint}` : ""}`,
    complete,
    "mood.detectMoodWithAnalysis"
  );
}
