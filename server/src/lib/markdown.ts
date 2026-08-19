/**
 * The AI generates summaries/decisions/action items in standard Markdown
 * (**bold**, etc.), but neither export target understands that syntax:
 * pdfkit's `.text()` has no markup support at all, and Slack's mrkdwn uses a
 * *single* asterisk for bold, not two. Both were showing literal "**word**"
 * to the user. Centralizing the two conversions here instead of duplicating
 * regex in each export route.
 */

// Slack mrkdwn: bold is *text*, not **text**.
export function toSlackMrkdwn(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "*$1*");
}

// pdfkit's basic .text() renders markup characters literally, so bold/italic
// markers would otherwise show up as raw asterisks/underscores in the PDF.
// Strip them for clean plain text instead of building a markdown-to-PDF
// pipeline for what's currently a short summary document.
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, "$1")
    .replace(/_{1,2}(.+?)_{1,2}/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "");
}

interface NotionRichText {
  type: "text";
  text: { content: string };
  annotations?: { bold?: boolean };
}

// Unlike PDF/Slack, Notion's rich_text arrays support real bold via an
// `annotations` object, so this doesn't need to strip/reformat **markers**
// -- it splits on them and marks the enclosed segment bold instead of
// dropping the emphasis entirely.
export function markdownToRichText(text: string): NotionRichText[] {
  const parts = text.split(/(\*\*.+?\*\*)/g).filter((p) => p.length > 0);
  if (parts.length === 0) return [{ type: "text", text: { content: "" } }];
  return parts.map((part) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    return bold
      ? { type: "text", text: { content: bold[1] }, annotations: { bold: true } }
      : { type: "text", text: { content: part } };
  });
}

// Email export HTML: like Notion, HTML supports real bold, so convert
// **markers** into <strong> instead of stripping them like the PDF export
// has to. Escapes the surrounding text first since this gets interpolated
// directly into an HTML string (data.summary etc. are AI-generated, not
// user-authored HTML, but escaping costs nothing and closes the XSS door).
function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function markdownToHtml(text: string): string {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// The Summary *property* is a table column meant for a quick scan across
// rows, but it was receiving the full multi-paragraph executive summary --
// unreadable in the database view. The full text still goes in the page
// body below; this just keeps the property itself glanceable.
export function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars).trimEnd() + "…";
}
