import * as gemini from "./gemini";
import * as groq from "./groq";

type AIProvider = "gemini" | "groq";

const PROVIDER: AIProvider = (process.env.AI_PROVIDER as AIProvider) || "gemini";

const services = { gemini, groq };

export const ai = services[PROVIDER];

export { gemini, groq };
