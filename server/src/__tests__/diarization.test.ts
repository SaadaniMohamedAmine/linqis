import { describe, test, expect } from "vitest";
import { diarizeSpeakers, type TranscriptSegment } from "../services/transcription/diarization";

function seg(timestamp: string, content: string): TranscriptSegment {
  return { speaker: "Speaker", timestamp, content };
}

describe("diarizeSpeakers", () => {
  test("assigns a speaker label to every segment", async () => {
    const segments = [seg("00:00", "Hello."), seg("00:05", "Hi there.")];
    const result = await diarizeSpeakers(segments);

    expect(result).toHaveLength(2);
    for (const s of result) {
      expect(s.speaker).toMatch(/^Speaker \d$/);
    }
  });

  test("switches speaker after a long pause (>2min gap)", async () => {
    const segments = [seg("00:00", "First statement."), seg("05:00", "Much later statement.")];
    const result = await diarizeSpeakers(segments);

    expect(result[0].speaker).not.toBe(result[1].speaker);
  });

  test("does not switch speaker for consecutive close segments outside rotation/question heuristics", async () => {
    const segments = [seg("00:00", "Continuing the point."), seg("00:02", "Still the same point.")];
    const result = await diarizeSpeakers(segments);

    expect(result[0].speaker).toBe(result[1].speaker);
  });

  test("preserves segment content and timestamp, only overwrites speaker", async () => {
    const segments = [seg("00:00", "Exact content here.")];
    const result = await diarizeSpeakers(segments);

    expect(result[0].content).toBe("Exact content here.");
    expect(result[0].timestamp).toBe("00:00");
  });

  test("handles an empty segment list without throwing", async () => {
    await expect(diarizeSpeakers([])).resolves.toEqual([]);
  });
});
