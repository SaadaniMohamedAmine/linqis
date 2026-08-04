import { describe, test, expect, vi, beforeEach } from "vitest";

const notionCreate = vi.fn();
vi.mock("@notionhq/client", () => ({
  Client: vi.fn().mockImplementation(() => ({
    pages: { create: notionCreate },
  })),
}));

const slackSend = vi.fn();
vi.mock("@slack/webhook", () => ({
  IncomingWebhook: vi.fn().mockImplementation(() => ({
    send: slackSend,
  })),
}));

const sendMail = vi.fn();
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({ sendMail }),
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
  sendMail.mockReset().mockResolvedValue(undefined);
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

    expect(sendMail).toHaveBeenCalledTimes(1);
    const mailOptions = sendMail.mock.calls[0][0];
    expect(mailOptions.to).toBe("stakeholder@example.com");
    expect(mailOptions.subject).toContain("Q3 Planning");
    expect(mailOptions.html).toContain(baseData.summary);
  });
});
