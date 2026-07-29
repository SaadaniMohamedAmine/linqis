import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY! });

export interface NotionExport {
  meetingId: string;
  title: string;
  summary: string;
  decisions: any[];
  actionItems: any[];
  pageId?: string;
}

export async function exportToNotion(data: NotionExport): Promise<string> {
  const response = await notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID!,
    },
    properties: {
      Title: {
        title: [{ text: { content: data.title } }],
      },
      Date: {
        date: { start: new Date().toISOString() },
      },
      Summary: {
        rich_text: [{ text: { content: data.summary } }],
      },
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ text: { content: "Executive Summary" } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ text: { content: data.summary } }],
        },
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ text: { content: "Decisions" } }],
        },
      },
      ...data.decisions.map((d) => ({
        object: "block",
        type: "to_do",
        to_do: {
          rich_text: [{ text: { content: d.statement } }],
          checked: d.status === "CONFIRMED",
        },
      })),
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ text: { content: "Action Items" } }],
        },
      },
      ...data.actionItems.map((a) => ({
        object: "block",
        type: "to_do",
        to_do: {
          rich_text: [{ text: { content: `${a.task} (${a.owner || "Unassigned"})` } }],
          checked: false,
        },
      })),
    ],
  });

  return response.id;
}
