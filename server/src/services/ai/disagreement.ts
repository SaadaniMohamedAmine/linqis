import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateJsonWithRetry } from "./json-utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface Disagreement {
  topic: string;
  quote: string;
  severity: "low" | "medium" | "high";
  participants?: string[];
}

async function complete(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function detectDisagreements(transcript: string): Promise<Disagreement[]> {
  return generateJsonWithRetry(
    (correctionHint) => `Identify topics where there was disagreement or tension in this meeting. Return a JSON array of objects with: topic, quote (relevant snippet), severity (low/medium/high), participants (speaker names involved).

Meeting transcript:
${transcript}

Return ONLY valid JSON, no markdown.${correctionHint ? `\n\n${correctionHint}` : ""}`,
    complete,
    "disagreement.detectDisagreements"
  );
}
