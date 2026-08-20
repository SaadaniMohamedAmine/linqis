"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Upload, Trash2, Users, CheckSquare, Video, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMeetings, deleteMeeting, ApiError, type MeetingListItem } from "@/lib/api";
import { formatDuration, formatMeetingDate } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-context";
import { meetingsListDictionary } from "@/lib/i18n/dictionaries/meetings-list";

type Filter = "all" | "PROCESSING" | "DONE" | "FAILED";

export default function MeetingsListPage() {
  const t = useDictionary(meetingsListDictionary);
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let cancelled = false;
    getMeetings()
      .then((data) => {
        if (!cancelled) setMeetings(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : t.loadFailed);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const STATUS_BADGE: Record<string, { variant: "success" | "warning" | "danger"; label: string }> = {
    DONE: { variant: "success", label: t.statusBadge.done },
    PROCESSING: { variant: "warning", label: t.statusBadge.processing },
    FAILED: { variant: "danger", label: t.statusBadge.failed },
  };

  const FILTERS: { value: Filter; label: string }[] = [
    { value: "all", label: t.filters.all },
    { value: "PROCESSING", label: t.filters.processing },
    { value: "DONE", label: t.filters.done },
    { value: "FAILED", label: t.filters.failed },
  ];

  const filtered = meetings.filter(
    (m) => (filter === "all" || m.status === filter) && m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;
    await deleteMeeting(id);
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-40%] left-[10%] w-[400px] h-[400px] bg-success/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary mb-1">{t.title}</h1>
            <p className="text-text-secondary">{t.subtitle}</p>
          </div>
          <Link href="/dashboard/upload">
            <Button variant="primary" className="gap-2 w-full sm:w-auto">
              <Upload size={16} />
              {t.upload}
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto p-4 sm:p-8">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 animate-fade-in-up [animation-delay:150ms]">
          <Input
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-[320px]"
          />
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                  filter === f.value ? "bg-success/10 text-success" : "text-text-secondary hover:bg-surface-low"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <Card className="p-0 overflow-hidden animate-fade-in-up [animation-delay:300ms]">
          {loading ? (
            <div className="p-16 text-center text-text-secondary">{t.loading}</div>
          ) : error ? (
            <div className="p-16 text-center text-danger">{error}</div>
          ) : meetings.length === 0 ? (
            <div className="relative overflow-hidden p-20 flex flex-col items-center text-center gap-4 bg-gradient-to-br from-success/5 via-transparent to-transparent border-2 border-dashed border-border m-4 rounded-xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-success/10 rounded-full blur-3xl animate-pulse" />
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-success-bg flex items-center justify-center text-success">
                  <Video size={32} />
                </div>
              </div>
              <h2 className="relative text-xl font-semibold text-text-primary">{t.emptyTitle}</h2>
              <p className="relative text-sm text-text-secondary max-w-sm">
                {t.emptyDesc}
              </p>
              <Link href="/dashboard/upload" className="relative">
                <Button variant="primary" className="gap-2 mt-2">
                  <Upload size={16} />
                  {t.uploadFirstMeeting}
                </Button>
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-surface-low flex items-center justify-center text-text-secondary">
                <SearchX size={24} />
              </div>
              <p className="text-sm text-text-secondary">{t.noMatchText}</p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="text-sm text-success hover:underline cursor-pointer"
              >
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((meeting) => {
                const badge = STATUS_BADGE[meeting.status] || STATUS_BADGE.PROCESSING;
                return (
                  <div
                    key={meeting.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-background/50 transition-colors group"
                  >
                    <Link href={`/dashboard/meetings/${meeting.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success font-semibold shrink-0">
                        {meeting.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-text-primary truncate group-hover:text-success transition-colors">
                          {meeting.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5 flex-wrap">
                          <span>{formatMeetingDate(meeting.createdAt)} · {formatDuration(meeting.duration)}</span>
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            {meeting.participants.length > 0 ? meeting.participants.length : "—"}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckSquare size={12} />
                            {meeting._count.actionItems}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-14 sm:pl-0 sm:shrink-0">
                      <Badge variant={badge.variant} className="shrink-0">{badge.label}</Badge>
                      <button
                        onClick={() => handleDelete(meeting.id)}
                        className="text-text-secondary hover:text-danger transition-colors shrink-0 p-1 cursor-pointer"
                        aria-label={t.deleteAriaLabel}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
