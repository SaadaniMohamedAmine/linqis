import Groq from "groq-sdk";
import { generateJsonWithRetry } from "./json-utils";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const MODEL = "llama-3.3-70b-versatile";

async function chat(prompt: string): Promise<string> {
  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: MODEL,
    temperature: 0.3,
    max_tokens: 2048,
  });
  return response.choices[0]?.message?.content || "";
}

// Named to match gemini.ts so `ai.generateExecutiveSummary(...)` works
// regardless of which provider AI_PROVIDER selects (see services/ai/index.ts).
export async function generateExecutiveSummary(transcript: string): Promise<string> {
  const prompt = `Generate a concise executive summary (max 150 words) of this meeting transcript:

${transcript}`;

  return chat(prompt);
}

export async function extractDecisions(transcript: string) {
  return generateJsonWithRetry(
    (correctionHint) => `Extract all decisions made in this meeting. Return a JSON array of objects with: statement, status (confirmed/pending), timestamp, proposer.

Meeting transcript:
${transcript}

Return ONLY valid JSON.${correctionHint ? `\n\n${correctionHint}` : ""}`,
    chat,
    "groq.extractDecisions"
  );
}

export async function extractActionItems(transcript: string) {
  return generateJsonWithRetry(
    (correctionHint) => `Extract all action items from this meeting. Return a JSON array of objects with: task, owner, deadline (ISO date or null), priority (high/medium/low).

Meeting transcript:
${transcript}

Return ONLY valid JSON.${correctionHint ? `\n\n${correctionHint}` : ""}`,
    chat,
    "groq.extractActionItems"
  );
}

export async function detectDisagreements(transcript: string) {
  return generateJsonWithRetry(
    (correctionHint) => `Identify topics where there was disagreement or tension in this meeting. Return a JSON array of objects with: topic, quote (relevant snippet), severity (low/medium/high).

Meeting transcript:
${transcript}

Return ONLY valid JSON.${correctionHint ? `\n\n${correctionHint}` : ""}`,
    chat,
    "groq.detectDisagreements"
  );
}

export async function detectMood(transcript: string): Promise<"POSITIVE" | "NEUTRAL" | "TENSE"> {
  const prompt = `Analyze the overall mood of this meeting. Return ONLY one word: POSITIVE, NEUTRAL, or TENSE.

Meeting transcript:
${transcript}`;

  const text = (await chat(prompt)).trim().toUpperCase();
  if (text.includes("TENSE")) return "TENSE";
  if (text.includes("POSITIVE")) return "POSITIVE";
  return "NEUTRAL";
}
