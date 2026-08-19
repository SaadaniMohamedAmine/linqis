import { IncomingWebhook } from "@slack/webhook";
import { toSlackMrkdwn } from "../../lib/markdown";

export interface SlackExport {
  meetingId: string;
  title: string;
  summary: string;
  decisions: any[];
  actionItems: any[];
  mood: string;
  webhookUrl: string;
}

export async function exportToSlack(data: SlackExport): Promise<void> {
  const webhook = new IncomingWebhook(data.webhookUrl);

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `📋 ${data.title}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Summary*\n${toSlackMrkdwn(data.summary)}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Mood*\n${data.mood}`,
        },
        {
          type: "mrkdwn",
          text: `*Decisions*\n${data.decisions.length}`,
        },
        {
          type: "mrkdwn",
          text: `*Action Items*\n${data.actionItems.length}`,
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Decisions*\n${data.decisions.map((d: any) => `• ${toSlackMrkdwn(d.statement)}`).join("\n")}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Action Items*\n${data.actionItems.map((a: any) => `• ${toSlackMrkdwn(a.task)} (${a.owner || "Unassigned"})`).join("\n")}`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "plain_text",
          text: `Linqis • ${new Date().toLocaleDateString()}`,
        },
      ],
    },
  ];

  await webhook.send({ blocks });
}
