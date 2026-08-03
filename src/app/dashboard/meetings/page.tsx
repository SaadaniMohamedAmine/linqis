"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMeetings, ApiError, type MeetingListItem } from "@/lib/api";
import { formatDuration, formatMeetingDate } from "@/lib/utils";

const STATUS_BADGE: Record<string, { variant: "success" | "warning" | "danger"; label: string }> = {
  DONE: { variant: "success", label: "Processed" },
  PROCESSING: { variant: "warning", label: "Processing..." },
  FAILED: { variant: "danger", label: "Failed" },
};

export default function MeetingsListPage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    getMeetings()
      .then((data) => {
        if (!cancelled) setMeetings(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load meetings.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = meetings.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <main className="p-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-text-primary mb-1">All Meetings</h1>
              <p className="text-text-secondary">Browse and manage your recorded sessions and AI transcriptions.</p>
            </div>
            <Link href="/dashboard/upload">
              <Button variant="primary" className="gap-2">Upload</Button>
            </Link>
          </div>

          <Card className="overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-border bg-surface">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-text-secondary">Loading meetings...</div>
              ) : error ? (
                <div className="p-12 text-center text-danger">{error}</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center gap-3">
                  <p className="text-text-secondary">
                    {meetings.length === 0 ? "No meetings yet." : "No meetings match your search."}
                  </p>
                  {meetings.length === 0 && (
                    <Link href="/dashboard/upload">
                      <Button variant="primary">Upload your first meeting</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-low border-b border-border">
                      <th className="px-6 py-4 font-medium text-text-secondary">Title</th>
                      <th className="px-6 py-4 font-medium text-text-secondary">Date</th>
                      <th className="px-6 py-4 font-medium text-text-secondary">Duration</th>
                      <th className="px-6 py-4 font-medium text-text-secondary">Participants</th>
                      <th className="px-6 py-4 font-medium text-text-secondary">Action Items</th>
                      <th className="px-6 py-4 font-medium text-text-secondary">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((meeting) => {
                      const badge = STATUS_BADGE[meeting.status] || STATUS_BADGE.PROCESSING;
                      return (
                        <tr key={meeting.id} className="hover:bg-surface transition-colors group">
                          <td className="px-6 py-4">
                            <Link href={`/dashboard/meetings/${meeting.id}`} className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success font-semibold">
                                {meeting.title.charAt(0).toUpperCase()}
                              </div>
                              <p className="font-medium text-text-primary group-hover:text-success transition-colors">
                                {meeting.title}
                              </p>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {formatMeetingDate(meeting.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary">{formatDuration(meeting.duration)}</td>
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {meeting.participants.length > 0 ? meeting.participants.length : "—"}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="neutral">{meeting._count.actionItems} tasks</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
