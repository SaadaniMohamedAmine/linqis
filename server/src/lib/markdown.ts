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
