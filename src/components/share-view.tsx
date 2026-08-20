"use client";

import { MarkdownSummary } from "@/components/markdown-summary";
import { useDictionary } from "@/lib/i18n/locale-context";
import { shareDictionary } from "@/lib/i18n/dictionaries/share";

interface SharedMeeting {
  id: string;
  title: string;
  summary: string | null;
  mood: string | null;
  createdAt: string;
  duration: number | null;
  decisions: { statement: string; status: string }[];
  actionItems: { task: string; owner: string | null; priority: string }[];
  participants: { name: string }[];
}

export function ShareView({ meeting }: { meeting: SharedMeeting | null }) {
  const t = useDictionary(shareDictionary);

  if (!meeting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">
        {t.linkDisabled}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 max-w-[720px] mx-auto">
      <p className="text-xs text-success font-medium mb-2">{t.sharedVia}</p>
      <h1 className="text-2xl font-semibold text-text-primary mb-4">{meeting.title}</h1>
      {meeting.summary && (
        <div className="mb-8">
          <MarkdownSummary text={meeting.summary} />
        </div>
      )}

      <h2 className="text-lg font-semibold text-text-primary mb-3">{t.decisions}</h2>
      <ul className="mb-8 flex flex-col gap-2">
        {meeting.decisions.length === 0 && <li className="text-sm text-text-muted">{t.noDecisions}</li>}
        {meeting.decisions.map((d, i) => (
          <li key={i} className="text-sm text-text-secondary">• {d.statement}</li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold text-text-primary mb-3">{t.actionItems}</h2>
      <ul className="flex flex-col gap-2">
        {meeting.actionItems.length === 0 && <li className="text-sm text-text-muted">{t.noActionItems}</li>}
        {meeting.actionItems.map((a, i) => (
          <li key={i} className="text-sm text-text-secondary">• {a.task} — {a.owner || t.unassigned}</li>
        ))}
      </ul>
    </div>
  );
}
