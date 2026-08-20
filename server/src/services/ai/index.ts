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

// Any primary-provider failure (rate limit, 503 overload, timeout, whatever)
// shouldn't fail the whole meeting when the other provider can serve the
// same call -- narrowing this to specific status codes meant a Gemini 503
// (seen in practice, high-demand overload) fell straight through to the user
// instead of failing over to Groq.
//
// `label` exists purely for the logs below -- without it, a failure just
// says "AI provider failed" with no way to tell which of the 7 calls it was
// or whether the fallback itself also failed, which is exactly the question
// live debugging needed an answer to.
function withFallback<Args extends unknown[], R>(
  label: string,
  primaryFn: (...args: Args) => Promise<R>,
  fallbackFn: (...args: Args) => Promise<R>
): (...args: Args) => Promise<R> {
  return async (...args: Args) => {
    try {
      return await primaryFn(...args);
    } catch (primaryErr) {
      console.warn(
        `[ai:${label}] primary (${PROVIDER}) failed, falling back to ${PROVIDER === "gemini" ? "groq" : "gemini"}:`,
        primaryErr instanceof Error ? primaryErr.message : primaryErr
      );
      try {
        return await fallbackFn(...args);
      } catch (fallbackErr) {
        console.error(
          `[ai:${label}] fallback also failed:`,
          fallbackErr instanceof Error ? fallbackErr.message : fallbackErr
        );
        throw fallbackErr;
      }
    }
  };
}

export const ai = {
  generateExecutiveSummary: withFallback("generateExecutiveSummary", primary.generateExecutiveSummary, secondary.generateExecutiveSummary),
  extractDecisions: withFallback("extractDecisions", primary.extractDecisions, secondary.extractDecisions),
  extractActionItems: withFallback("extractActionItems", primary.extractActionItems, secondary.extractActionItems),
  // Was missing entirely -- chat.ts calls ai.answerFromContext(...), which
  // was undefined here even though both providers implement it, so every
  // "Ask your meetings" request threw and fell into the generic 500.
  answerFromContext: withFallback("answerFromContext", primary.answerFromContext, secondary.answerFromContext),
};

export const detectDisagreements = withFallback("detectDisagreements", primary.detectDisagreements, secondary.detectDisagreements);
export const detectMood = withFallback("detectMood", primary.detectMood, secondary.detectMood);
export const detectMoodWithAnalysis = withFallback("detectMoodWithAnalysis", primary.detectMoodWithAnalysis, secondary.detectMoodWithAnalysis);

export { gemini, groq };
