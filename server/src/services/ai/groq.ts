import Groq from "groq-sdk";

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

export async function generateSummary(transcript: string): Promise<string> {
  const prompt = `Generate a concise executive summary (max 150 words) of this meeting transcript:

${transcript}`;

  return chat(prompt);
}

export async function extractDecisions(transcript: string) {
  const prompt = `Extract all decisions made in this meeting. Return a JSON array of objects with: statement, status (confirmed/pending), timestamp, proposer.

Meeting transcript:
${transcript}

Return ONLY valid JSON.`;

  const text = await chat(prompt);
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function extractActionItems(transcript: string) {
  const prompt = `Extract all action items from this meeting. Return a JSON array of objects with: task, owner, deadline (ISO date or null), priority (high/medium/low).

Meeting transcript:
${transcript}

Return ONLY valid JSON.`;

  const text = await chat(prompt);
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function detectDisagreements(transcript: string) {
  const prompt = `Identify topics where there was disagreement or tension in this meeting. Return a JSON array of objects with: topic, quote (relevant snippet), severity (low/medium/high).

Meeting transcript:
${transcript}

Return ONLY valid JSON.`;

  const text = await chat(prompt);
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
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
