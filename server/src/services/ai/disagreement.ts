import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateJsonWithRetry } from "./json-utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
    (correctionHint) => `You are analyzing a real meeting transcript to find genuine interpersonal disagreements -- moments where two or more participants expressed conflicting opinions, pushed back on each other, or showed real tension about a decision or topic.

Do NOT flag any of the following as a disagreement:
- A single speaker presenting, narrating, or explaining a topic -- even if the topic itself is about conflict, arguments, or disagreement in the abstract (e.g. someone explaining how to handle toxic people is not itself a disagreement).
- Hypothetical scenarios, examples, or quotes a speaker uses to illustrate a point.
- Speakers agreeing, building on each other's ideas, or just asking clarifying questions.
- Speaker labels that may be a diarization artifact: this transcript's speaker split is heuristic, so a solo monologue can get mislabeled as "Speaker 1" / "Speaker 2". If the labeled participants don't actually seem to be talking to and disagreeing with each other, don't flag it.

Only flag a disagreement if you can point to an actual back-and-forth where participants took opposing positions. If you're unsure, or there's no genuine disagreement in this transcript, return an empty array -- do not force a result just to have something to report.

Return a JSON array of objects with: topic, quote (the exact exchange showing the disagreement), severity (low/medium/high), participants (speaker names involved).

Meeting transcript:
${transcript}

Return ONLY valid JSON, no markdown.${correctionHint ? `\n\n${correctionHint}` : ""}`,
    complete,
    "disagreement.detectDisagreements"
  );
}
