import * as gemini from "./gemini";
import * as groq from "./groq";
import { detectDisagreements } from "./disagreement";
import { detectMood, detectMoodWithAnalysis } from "./mood";

type AIProvider = "gemini" | "groq";

const PROVIDER: AIProvider = (process.env.AI_PROVIDER as AIProvider) || "gemini";

const services = { gemini, groq };

export const ai = services[PROVIDER];
export { detectDisagreements };
export { detectMood, detectMoodWithAnalysis };
export { gemini, groq };
