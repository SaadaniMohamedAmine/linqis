import { describe, test, expect } from "vitest";
import { mergeTranscripts, reassembleTranscript } from "../services/transcription/reassemble";

describe("mergeTranscripts", () => {
  test("flattens multiple chunk segment arrays into one, sorted by timestamp", () => {
    const chunk1 = [{ speaker: "A", timestamp: "00:10", content: "second" }];
    const chunk2 = [{ speaker: "B", timestamp: "00:00", content: "first" }];

    const merged = mergeTranscripts([chunk1, chunk2]);

    expect(merged.map((s) => s.content)).toEqual(["first", "second"]);
  });

  test("sorts correctly across minute boundaries (not lexicographically)", () => {
    // lexicographic sort would put "02:00" before "10:00" -- numeric sort must not
    const chunk = [
      { speaker: "A", timestamp: "10:00", content: "later" },
      { speaker: "A", timestamp: "02:00", content: "earlier" },
    ];

    const merged = mergeTranscripts([chunk]);

    expect(merged.map((s) => s.content)).toEqual(["earlier", "later"]);
  });

  test("returns an empty array for no input chunks", () => {
    expect(mergeTranscripts([])).toEqual([]);
  });
});

describe("reassembleTranscript", () => {
  test("formats segments as [timestamp] speaker: content lines", () => {
    const segments = [
      { speaker: "Speaker 1", timestamp: "00:00", content: "Hello." },
      { speaker: "Speaker 2", timestamp: "00:05", content: "Hi." },
    ];

    const text = reassembleTranscript(segments);

    expect(text).toBe("[00:00] Speaker 1: Hello.\n[00:05] Speaker 2: Hi.");
  });

  test("returns an empty string for no segments", () => {
    expect(reassembleTranscript([])).toBe("");
  });
});
