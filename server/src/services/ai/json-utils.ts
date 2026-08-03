/**
 * Shared helpers for parsing structured JSON out of LLM text responses.
 *
 * Both AI providers (Gemini, Groq) are prompted to "return ONLY valid JSON",
 * but neither provider guarantees that in practice — models occasionally wrap
 * the payload in markdown fences, add a leading sentence, or emit malformed
 * JSON. Previously this was handled with a bare `JSON.parse()` that threw an
 * opaque `SyntaxError` with no context on failure. This module centralizes
 * cleanup + a best-effort recovery pass, and a typed error so callers can
 * retry or log meaningfully.
 */

export class AIJsonParseError extends Error {
  readonly context: string;
  readonly raw: string;

  constructor(context: string, raw: string, cause?: unknown) {
    const causeMessage = cause instanceof Error ? cause.message : String(cause ?? "");
    super(`Failed to parse JSON from AI response (${context})${causeMessage ? `: ${causeMessage}` : ""}`);
    this.name = "AIJsonParseError";
    this.context = context;
    this.raw = raw;
  }
}

/** Strips ```json ... ``` / ``` ... ``` fences and surrounding whitespace. */
export function stripMarkdownFences(raw: string): string {
  return raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
}

/**
 * Parses `raw` as JSON<T>. Falls back to extracting the first top-level
 * JSON array/object substring if the direct parse fails (handles cases where
 * the model adds a preamble like "Here is the JSON:" before the payload).
 * Throws `AIJsonParseError` (never a raw SyntaxError) if all attempts fail.
 */
export function parseJson<T>(raw: string, context: string): T {
  const cleaned = stripMarkdownFences(raw);

  try {
    return JSON.parse(cleaned) as T;
  } catch (firstError) {
    const match = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch (secondError) {
        throw new AIJsonParseError(context, raw, secondError);
      }
    }
    throw new AIJsonParseError(context, raw, firstError);
  }
}

/**
 * Calls `generate` (a single LLM completion call returning raw text) and
 * parses the result as JSON<T>. If parsing fails, retries once with a
 * corrective instruction appended to the prompt before giving up.
 *
 * @param buildPrompt - given an optional correction hint, returns the prompt to send
 * @param generate - performs the actual model call for a given prompt, returning raw text
 */
export async function generateJsonWithRetry<T>(
  buildPrompt: (correctionHint?: string) => string,
  generate: (prompt: string) => Promise<string>,
  context: string,
  maxAttempts = 2
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const correctionHint =
      attempt === 0
        ? undefined
        : "Your previous response could not be parsed as JSON. Return ONLY valid JSON, no markdown, no explanation, no leading or trailing text.";
    const prompt = buildPrompt(correctionHint);

    const text = await generate(prompt);
    try {
      return parseJson<T>(text, context);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new AIJsonParseError(context, "", lastError);
}
