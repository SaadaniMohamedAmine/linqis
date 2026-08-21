import { describe, test, expect, vi, beforeEach } from "vitest";

// Plain arrow-function mockImplementations here previously made `new Client()`
// / `new IncomingWebhook()` throw "is not a constructor" (arrow functions have
// no [[Construct]]) -- classes work as real constructors instead.
const notionCreate = vi.fn();
vi.mock("@notionhq/client", () => ({
  Client: class {
    pages = { create: notionCreate };
  },
}));

const slackSend = vi.fn();
vi.mock("@slack/webhook", () => ({
  IncomingWebhook: class {
    send = slackSend;
  },
}));

// email.ts constructs `new Resend(...)` at module load time (not lazily,
// unlike notion.ts/slack.ts's clients), which runs before a plain top-level
// `const emailsSend = vi.fn()` below would -- ESM hoists this file's imports
// (and everything they trigger) above its own non-import statements.
// vi.hoisted() makes emailsSend exist before that constructor call.
const { emailsSend } = vi.hoisted(() => ({ emailsSend: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: emailsSend };
  },
}));

import { exportToNotion } from "../services/export/notion";
import { exportToSlack } from "../services/export/slack";
import { exportToEmail } from "../services/export/email";

const baseData = {
  meetingId: "meeting-1",
  title: "Q3 Planning",
  summary: "We decided to ship the async pipeline.",
  decisions: [{ statement: "Ship async pipeline", status: "CONFIRMED" }],
  actionItems: [{ task: "Update docs", owner: "Alex" }],
};

beforeEach(() => {
  notionCreate.mockReset().mockResolvedValue({ id: "notion-page-123" });
  slackSend.mockReset().mockResolvedValue(undefined);
  emailsSend.mockReset().mockResolvedValue({ data: { id: "email-1" }, error: null });
});

const notionCredentials = { apiKey: "test-key", databaseId: "test-db" };

describe("exportToNotion", () => {
  test("returns the created page id", async () => {
    const pageId = await exportToNotion(baseData, notionCredentials);
    expect(pageId).toBe("notion-page-123");
  });

  test("sends the meeting title and decisions as to_do blocks with the right checked state", async () => {
    await exportToNotion(baseData, notionCredentials);

    const payload = notionCreate.mock.calls[0][0];
    expect(payload.properties.Title.title[0].text.content).toBe("Q3 Planning");

    const decisionBlock = payload.children.find(
      (b: any) => b.type === "to_do" && b.to_do.rich_text[0].text.content === "Ship async pipeline"
    );
    expect(decisionBlock.to_do.checked).toBe(true); // CONFIRMED -> checked
  });

  test("labels action items as unassigned when no owner is given", async () => {
    await exportToNotion({ ...baseData, actionItems: [{ task: "Follow up" }] }, notionCredentials);

    const payload = notionCreate.mock.calls[0][0];
    const actionBlock = payload.children.find((b: any) => b.type === "to_do" && b.to_do.rich_text[0].text.content.startsWith("Follow up"));
    expect(actionBlock.to_do.rich_text[0].text.content).toBe("Follow up (Unassigned)");
  });
});

describe("exportToSlack", () => {
  test("sends a block payload including the summary and item counts", async () => {
    await exportToSlack({ ...baseData, mood: "POSITIVE", webhookUrl: "https://hooks.slack.test/abc" });

    expect(slackSend).toHaveBeenCalledTimes(1);
    const { blocks } = slackSend.mock.calls[0][0];
    const summaryBlock = blocks.find((b: any) => b.text?.text?.includes("Summary"));
    expect(summaryBlock.text.text).toContain(baseData.summary);
  });
});

describe("exportToEmail", () => {
  test("sends HTML mail with the meeting title in the subject", async () => {
    await exportToEmail({ ...baseData, mood: "NEUTRAL", to: "stakeholder@example.com" });

    expect(emailsSend).toHaveBeenCalledTimes(1);
    const mailOptions = emailsSend.mock.calls[0][0];
    expect(mailOptions.to).toBe("stakeholder@example.com");
    expect(mailOptions.subject).toContain("Q3 Planning");
    expect(mailOptions.html).toContain(baseData.summary);
  });

  test("throws when Resend reports an error instead of silently succeeding", async () => {
    emailsSend.mockResolvedValue({ data: null, error: { message: "Invalid `from` address" } });

    await expect(
      exportToEmail({ ...baseData, mood: "NEUTRAL", to: "stakeholder@example.com" })
    ).rejects.toThrow("Invalid `from` address");
  });
});
