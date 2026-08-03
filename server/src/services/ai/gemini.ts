import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateJsonWithRetry } from "./json-utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function complete(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function generateExecutiveSummary(transcript: string): Promise<string> {
  const prompt = `Generate a concise executive summary (max 150 words) of this meeting transcript. Focus on key outcomes, main discussions, and overall direction.

Meeting transcript:
${transcript}

Summary:`;

  return complete(prompt);
}

export async function extractDecisions(transcript: string) {
  return generateJsonWithRetry(
    (correctionHint) => `Extract all decisions made in this meeting. Return a JSON array of objects with: statement, status (confirmed/pending), timestamp, proposer.

Meeting transcript:
${transcript}

Return ONLY valid JSON, no markdown.${correctionHint ? `\n\n${correctionHint}` : ""}`,
    complete,
    "gemini.extractDecisions"
  );
}

export async function extractActionItems(transcript: string) {
  return generateJsonWithRetry(
    (correctionHint) => `Extract all action items from this meeting. Return a JSON array of objects with: task, owner, deadline (ISO date or null), priority (high/medium/low).

Meeting transcript:
${transcript}

Return ONLY valid JSON, no markdown.${correctionHint ? `\n\n${correctionHint}` : ""}`,
    complete,
    "gemini.extractActionItems"
  );
}

export async function detectDisagreements(transcript: string) {
  return generateJsonWithRetry(
    (correctionHint) => `Identify topics where there was disagreement or tension in this meeting. Return a JSON array of objects with: topic, quote (relevant snippet), severity (low/medium/high).

Meeting transcript:
${transcript}

Return ONLY valid JSON, no markdown.${correctionHint ? `\n\n${correctionHint}` : ""}`,
    complete,
    "gemini.detectDisagreements"
  );
}

export async function detectMood(transcript: string): Promise<"POSITIVE" | "NEUTRAL" | "TENSE"> {
  const prompt = `Analyze the overall mood of this meeting. Return ONLY one word: POSITIVE, NEUTRAL, or TENSE.

Meeting transcript:
${transcript}`;

  const mood = (await complete(prompt)).toUpperCase();
  if (mood.includes("TENSE")) return "TENSE";
  if (mood.includes("POSITIVE")) return "POSITIVE";
  return "NEUTRAL";
}
