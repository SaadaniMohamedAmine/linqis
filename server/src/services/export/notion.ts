import { Client } from "@notionhq/client";
import { markdownToRichText, truncate } from "../../lib/markdown";

const SUMMARY_PROPERTY_MAX_CHARS = 300;

export interface NotionExport {
  meetingId: string;
  title: string;
  summary: string;
  decisions: any[];
  actionItems: any[];
  pageId?: string;
}

export interface NotionCredentials {
  apiKey: string;
  databaseId: string;
}

export async function exportToNotion(data: NotionExport, credentials: NotionCredentials): Promise<string> {
  const notion = new Client({ auth: credentials.apiKey });
  const response = await notion.pages.create({
    parent: {
      database_id: credentials.databaseId,
    },
    properties: {
      Title: {
        title: [{ text: { content: data.title } }],
      },
      Date: {
        date: { start: new Date().toISOString() },
      },
      // Table column, not the document itself -- the AI summary can run to
      // several paragraphs, which made this cell unreadable in the database
      // view. Trim it to a scannable preview; the full text is in the page
      // body below regardless.
      Summary: {
        rich_text: markdownToRichText(truncate(data.summary, SUMMARY_PROPERTY_MAX_CHARS)),
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
          // Was inserting the raw **bold** markdown as literal text; Notion's
          // rich_text supports real bold via `annotations`, so convert it
          // instead of just stripping it like the PDF export has to.
          rich_text: markdownToRichText(data.summary),
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
          rich_text: markdownToRichText(d.statement),
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
          rich_text: [
            ...markdownToRichText(a.task),
            { type: "text" as const, text: { content: ` (${a.owner || "Unassigned"})` } },
          ],
          checked: false,
        },
      })),
    ],
  });

  return response.id;
}
