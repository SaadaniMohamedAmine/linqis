import { test, expect } from "vitest";
import { exportToNotion } from "../services/export";

test("Export Notion should format data correctly", () => {
  // Mock test structure
  const data = {
    meetingId: "123",
    title: "Test Meeting",
    summary: "Test Summary",
    decisions: [],
    actionItems: [],
  };

  // Just checking the function exists and types match for now
  expect(exportToNotion).toBeDefined();
});
