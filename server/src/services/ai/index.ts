import * as gemini from "./gemini";
import * as groq from "./groq";
import { detectDisagreements as geminiDetectDisagreements } from "./disagreement";
import { detectMood as geminiDetectMood, detectMoodWithAnalysis as geminiDetectMoodWithAnalysis } from "./mood";

type AIProvider = "gemini" | "groq";

const PROVIDER: AIProvider = (process.env.AI_PROVIDER as AIProvider) || "gemini";

// mood.ts/disagreement.ts predate the provider dispatch below and only ever
// called Gemini directly -- folded in here so every AI call goes through the
// same primary/fallback pair instead of just three of the five.
const services = {
  gemini: {
    ...gemini,
    detectDisagreements: geminiDetectDisagreements,
    detectMood: geminiDetectMood,
    detectMoodWithAnalysis: geminiDetectMoodWithAnalysis,
  },
  groq,
};

const primary = services[PROVIDER];
const secondary = services[PROVIDER === "gemini" ? "groq" : "gemini"];

function isRateLimitError(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { status?: unknown }).status === 429;
}

// A quota-exhausted provider (what actually happened tonight: Gemini's
// free-tier daily cap) shouldn't fail the whole meeting when the other
// provider is perfectly able to serve the same call.
function withFallback<Args extends unknown[], R>(
  primaryFn: (...args: Args) => Promise<R>,
  fallbackFn: (...args: Args) => Promise<R>
): (...args: Args) => Promise<R> {
  return async (...args: Args) => {
    try {
      return await primaryFn(...args);
    } catch (err) {
      if (!isRateLimitError(err)) throw err;
      console.warn(`AI provider rate-limited, falling back to ${PROVIDER === "gemini" ? "groq" : "gemini"}`);
      return fallbackFn(...args);
    }
  };
}

export const ai = {
  generateExecutiveSummary: withFallback(primary.generateExecutiveSummary, secondary.generateExecutiveSummary),
  extractDecisions: withFallback(primary.extractDecisions, secondary.extractDecisions),
  extractActionItems: withFallback(primary.extractActionItems, secondary.extractActionItems),
  // Was missing entirely -- chat.ts calls ai.answerFromContext(...), which
  // was undefined here even though both providers implement it, so every
  // "Ask your meetings" request threw and fell into the generic 500.
  answerFromContext: withFallback(primary.answerFromContext, secondary.answerFromContext),
};

export const detectDisagreements = withFallback(primary.detectDisagreements, secondary.detectDisagreements);
export const detectMood = withFallback(primary.detectMood, secondary.detectMood);
export const detectMoodWithAnalysis = withFallback(primary.detectMoodWithAnalysis, secondary.detectMoodWithAnalysis);

export { gemini, groq };
