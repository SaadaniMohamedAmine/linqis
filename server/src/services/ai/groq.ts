import Groq from "groq-sdk";
import { generateJsonWithRetry } from "./json-utils";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

// llama-3.3-70b-versatile was deprecated by Groq on 2026-06-17 and now
// 404s on every call. gpt-oss-120b is Groq's recommended replacement and
// handles the structured JSON extraction here (decisions/action items/mood)
// at least as reliably.
const MODEL = "openai/gpt-oss-120b";

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

// Named to match mood.ts's MoodAnalysis shape so the AI_PROVIDER dispatch
// (and its rate-limit fallback, see services/ai/index.ts) can swap this in
// for the Gemini version.
export interface MoodAnalysis {
  mood: "POSITIVE" | "NEUTRAL" | "TENSE";
  confidence: number;
  indicators: string[];
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
    chat,
    "groq.detectMoodWithAnalysis"
  );
}

export async function answerFromContext(question: string, context: string): Promise<string> {
  const prompt = `You are a helpful assistant answering questions about the user's past meetings, using ONLY the context below. If the answer isn't in the context, say so honestly instead of guessing.

Context from the user's meetings:
${context}

Question: ${question}

Answer concisely, and mention which meeting(s) the information comes from:`;

  return chat(prompt);
}
