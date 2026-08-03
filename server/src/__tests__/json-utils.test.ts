import { describe, test, expect, vi } from "vitest";
import { parseJson, stripMarkdownFences, generateJsonWithRetry, AIJsonParseError } from "../services/ai/json-utils";

describe("stripMarkdownFences", () => {
  test("removes ```json fences", () => {
    expect(stripMarkdownFences('```json\n{"a":1}\n```')).toBe('{"a":1}');
  });

  test("removes bare ``` fences", () => {
    expect(stripMarkdownFences('```\n{"a":1}\n```')).toBe('{"a":1}');
  });

  test("leaves plain JSON untouched (minus whitespace)", () => {
    expect(stripMarkdownFences('  {"a":1}  ')).toBe('{"a":1}');
  });
});

describe("parseJson", () => {
  test("parses clean JSON", () => {
    expect(parseJson<{ a: number }>('{"a":1}', "test")).toEqual({ a: 1 });
  });

  test("parses JSON wrapped in markdown fences", () => {
    expect(parseJson<{ a: number }>('```json\n{"a":1}\n```', "test")).toEqual({ a: 1 });
  });

  test("recovers JSON preceded by explanatory text", () => {
    const raw = 'Sure, here is the JSON you asked for:\n[{"task":"do thing"}]';
    expect(parseJson<{ task: string }[]>(raw, "test")).toEqual([{ task: "do thing" }]);
  });

  test("throws AIJsonParseError (not a raw SyntaxError) when nothing is parseable", () => {
    expect(() => parseJson("this is not json at all", "test.context")).toThrow(AIJsonParseError);
  });

  test("error message includes the context for debugging", () => {
    try {
      parseJson("not json", "gemini.extractDecisions");
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(AIJsonParseError);
      expect((err as AIJsonParseError).message).toContain("gemini.extractDecisions");
    }
  });
});

describe("generateJsonWithRetry", () => {
  test("returns parsed JSON on the first attempt when the model responds correctly", async () => {
    const generate = vi.fn().mockResolvedValue('{"ok":true}');
    const buildPrompt = vi.fn().mockReturnValue("prompt");

    const result = await generateJsonWithRetry<{ ok: boolean }>(buildPrompt, generate, "test");

    expect(result).toEqual({ ok: true });
    expect(generate).toHaveBeenCalledTimes(1);
  });

  test("retries once with a correction hint if the first response is malformed", async () => {
    const generate = vi
      .fn()
      .mockResolvedValueOnce("not valid json")
      .mockResolvedValueOnce('{"ok":true}');
    const buildPrompt = vi.fn((hint?: string) => (hint ? `prompt + ${hint}` : "prompt"));

    const result = await generateJsonWithRetry<{ ok: boolean }>(buildPrompt, generate, "test");

    expect(result).toEqual({ ok: true });
    expect(generate).toHaveBeenCalledTimes(2);
    // second prompt must include a correction hint, not just repeat the first
    expect(buildPrompt).toHaveBeenNthCalledWith(2, expect.stringContaining("valid JSON"));
  });

  test("gives up after maxAttempts and throws instead of looping forever", async () => {
    const generate = vi.fn().mockResolvedValue("still not json");
    const buildPrompt = vi.fn().mockReturnValue("prompt");

    await expect(generateJsonWithRetry(buildPrompt, generate, "test", 2)).rejects.toThrow(AIJsonParseError);
    expect(generate).toHaveBeenCalledTimes(2);
  });
});
