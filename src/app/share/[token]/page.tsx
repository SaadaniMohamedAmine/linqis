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

async function getSharedMeeting(token: string): Promise<SharedMeeting | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${apiUrl}/api/public/meetings/${token}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function SharedMeetingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const meeting = await getSharedMeeting(token);

  if (!meeting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">
        This link is invalid or sharing has been disabled.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 max-w-[720px] mx-auto">
      <p className="text-xs text-success font-medium mb-2">Shared via Linqis</p>
      <h1 className="text-2xl font-semibold text-text-primary mb-4">{meeting.title}</h1>
      <p className="text-text-secondary mb-8">{meeting.summary}</p>

      <h2 className="text-lg font-semibold text-text-primary mb-3">Decisions</h2>
      <ul className="mb-8 flex flex-col gap-2">
        {meeting.decisions.length === 0 && <li className="text-sm text-text-muted">No decisions recorded.</li>}
        {meeting.decisions.map((d, i) => (
          <li key={i} className="text-sm text-text-secondary">• {d.statement}</li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold text-text-primary mb-3">Action items</h2>
      <ul className="flex flex-col gap-2">
        {meeting.actionItems.length === 0 && <li className="text-sm text-text-muted">No action items recorded.</li>}
        {meeting.actionItems.map((a, i) => (
          <li key={i} className="text-sm text-text-secondary">• {a.task} — {a.owner || "Unassigned"}</li>
        ))}
      </ul>
    </div>
  );
}
