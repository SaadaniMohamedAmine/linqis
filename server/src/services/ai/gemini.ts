import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateExecutiveSummary(transcript: string): Promise<string> {
  const prompt = `Generate a concise executive summary (max 150 words) of this meeting transcript. Focus on key outcomes, main discussions, and overall direction.

Meeting transcript:
${transcript}

Summary:`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function extractDecisions(transcript: string) {
  const prompt = `Extract all decisions made in this meeting. Return a JSON array of objects with: statement, status (confirmed/pending), timestamp, proposer.

Meeting transcript:
${transcript}

Return ONLY valid JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(text);
}

export async function extractActionItems(transcript: string) {
  const prompt = `Extract all action items from this meeting. Return a JSON array of objects with: task, owner, deadline (ISO date or null), priority (high/medium/low).

Meeting transcript:
${transcript}

Return ONLY valid JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(text);
}

export async function detectDisagreements(transcript: string) {
  const prompt = `Identify topics where there was disagreement or tension in this meeting. Return a JSON array of objects with: topic, quote (relevant snippet), severity (low/medium/high).

Meeting transcript:
${transcript}

Return ONLY valid JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(text);
}

export async function detectMood(transcript: string): Promise<"POSITIVE" | "NEUTRAL" | "TENSE"> {
  const prompt = `Analyze the overall mood of this meeting. Return ONLY one word: POSITIVE, NEUTRAL, or TENSE.

Meeting transcript:
${transcript}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const mood = response.text().trim().toUpperCase();
  if (mood.includes("TENSE")) return "TENSE";
  if (mood.includes("POSITIVE")) return "POSITIVE";
  return "NEUTRAL";
}
