"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Play,
  Pause,
  Headphones,
  ChevronDown,
  Clock,
  Users,
  FileText,
  MessageSquareOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ListChecks,
  Smile,
  Meh,
  Frown,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ExportModal from "@/components/export-modal";
import { MarkdownSummary, InlineMarkdown } from "@/components/markdown-summary";
import { formatDuration, formatMeetingDate } from "@/lib/utils";
import {
  getMeeting,
  updateActionItemStatus,
  resolveAudioUrl,
  renameMeeting,
  deleteMeeting,
  toggleMeetingShare,
  downloadMeetingPdf,
  ApiError,
  type MeetingDetail,
} from "@/lib/api";

const TABS = ["transcript", "summary", "actions", "analysis"] as const;
type Tab = (typeof TABS)[number];

const MOOD_STYLE: Record<string, { label: string; text: string; bg: string; percent: number; icon: LucideIcon }> = {
  POSITIVE: { label: "Positive", text: "text-success", bg: "bg-success", percent: 85, icon: Smile },
  NEUTRAL: { label: "Neutral", text: "text-text-secondary", bg: "bg-text-secondary", percent: 50, icon: Meh },
  TENSE: { label: "Tense", text: "text-danger", bg: "bg-danger", percent: 20, icon: Frown },
};

const SEVERITY_BADGE: Record<string, "danger" | "warning" | "neutral"> = {
  HIGH: "danger",
  MEDIUM: "warning",
  LOW: "neutral",
};

// Deterministic per-speaker color so the same speaker always gets the same
// avatar tint across the transcript (and across reloads).
const SPEAKER_PALETTE = ["#22C55E", "#3B82F6", "#EAB308", "#EC4899", "#8B5CF6", "#F97316"];

function speakerColor(speaker: string): string {
  let hash = 0;
  for (let i = 0; i < speaker.length; i++) hash = (hash * 31 + speaker.charCodeAt(i)) | 0;
  return SPEAKER_PALETTE[Math.abs(hash) % SPEAKER_PALETTE.length];
}

function speakerInitials(speaker: string): string {
  const parts = speaker.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function EmptyState({ icon: Icon, label, compact }: { icon: LucideIcon; label: string; compact?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 text-center ${compact ? "py-6" : "py-16"}`}>
      <Icon size={compact ? 20 : 28} className="text-text-muted" />
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}

function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function MeetingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const meetingId = params.id;

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("transcript");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfIsPlanLimit, setPdfIsPlanLimit] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playerOpen, setPlayerOpen] = useState(false);

  const load = useCallback(() => {
    if (!meetingId) return;
    setLoading(true);
    getMeeting(meetingId)
      .then(setMeeting)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load meeting."))
      .finally(() => setLoading(false));
  }, [meetingId]);

  useEffect(() => {
    load();
  }, [load]);

  // A meeting still being processed by the worker has no transcript/summary
  // yet -- poll every 5s until it flips to DONE/FAILED instead of showing a
  // permanently empty page.
  useEffect(() => {
    if (meeting?.status !== "PROCESSING") return;
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [meeting?.status, load]);

  const toggleActionItem = async (id: string, current: "TODO" | "DONE") => {
    const next = current === "TODO" ? "DONE" : "TODO";
    // optimistic update
    setMeeting((prev) =>
      prev
        ? { ...prev, actionItems: prev.actionItems.map((a) => (a.id === id ? { ...a, status: next } : a)) }
        : prev
    );
    try {
      await updateActionItemStatus(id, next);
    } catch {
      // revert on failure
      setMeeting((prev) =>
        prev
          ? { ...prev, actionItems: prev.actionItems.map((a) => (a.id === id ? { ...a, status: current } : a)) }
          : prev
      );
    }
  };

  const startEditingTitle = () => {
    if (!meeting) return;
    setTitleDraft(meeting.title);
    setIsEditingTitle(true);
  };

  const commitTitleEdit = async () => {
    setIsEditingTitle(false);
    if (!meeting || !titleDraft.trim() || titleDraft === meeting.title) return;
    const previousTitle = meeting.title;
    setMeeting((prev) => (prev ? { ...prev, title: titleDraft } : prev));
    try {
      await renameMeeting(meeting.id, titleDraft);
    } catch {
      setMeeting((prev) => (prev ? { ...prev, title: previousTitle } : prev));
    }
  };

  const handleDelete = async () => {
    if (!meeting) return;
    if (!confirm("Delete this meeting? This cannot be undone.")) return;
    await deleteMeeting(meeting.id);
    router.refresh();
    router.push("/dashboard/meetings");
  };

  const handleToggleShare = async () => {
    if (!meeting) return;
    setShareLoading(true);
    try {
      const result = await toggleMeetingShare(meeting.id, !meeting.isPublic);
      setMeeting((prev) => (prev ? { ...prev, isPublic: result.isPublic, shareToken: result.shareToken } : prev));
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyShareLink = async () => {
    if (!meeting?.shareToken) return;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    await navigator.clipboard.writeText(`${siteUrl}/share/${meeting.shareToken}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!meeting) return;
    setPdfLoading(true);
    setPdfError(null);
    setPdfIsPlanLimit(false);
    try {
      await downloadMeetingPdf(meeting.id, meeting.title);
    } catch (err) {
      setPdfError(err instanceof ApiError ? err.message : "Failed to download PDF.");
      setPdfIsPlanLimit(err instanceof ApiError && err.status === 402);
    } finally {
      setPdfLoading(false);
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
  };

  if (loading) {
    return <div className="p-12 text-center text-text-secondary">Loading meeting...</div>;
  }

  if (error || !meeting) {
    return <div className="p-12 text-center text-danger">{error || "Meeting not found."}</div>;
  }

  const audioUrl = resolveAudioUrl(meeting.audioUrl);
  const progressPercent = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;
  const speakerCount =
    meeting.participants.length > 0
      ? meeting.participants.length
      : new Set(meeting.transcripts.map((t) => t.speaker)).size;

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-3 flex items-center justify-between border-b border-border">
        <div>
          {isEditingTitle ? (
            <Input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitleEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTitleEdit();
                if (e.key === "Escape") setIsEditingTitle(false);
              }}
              className="h-10 text-2xl font-semibold font-geist"
            />
          ) : (
            <h1
              className="text-2xl font-semibold font-geist tracking-tight text-text-primary cursor-pointer hover:text-success transition-colors"
              onClick={startEditingTitle}
            >
              {meeting.title}
            </h1>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatDuration(meeting.duration)}
            </span>
            {speakerCount > 0 && (
              <span className="flex items-center gap-1">
                <Users size={12} />
                {speakerCount} speaker{speakerCount === 1 ? "" : "s"}
              </span>
            )}
            <span>{formatMeetingDate(meeting.createdAt)}</span>
          </div>
          {meeting.status === "PROCESSING" && (
            <p className="text-xs text-warning mt-1">Still processing — this page will refresh automatically.</p>
          )}
          {meeting.status === "FAILED" && <p className="text-xs text-danger mt-1">Processing failed for this meeting.</p>}
        </div>
        <div className="flex items-center gap-3 relative">
          <Button variant="secondary" onClick={() => setShareOpen((o) => !o)}>Share</Button>
          {shareOpen && (
            <div className="absolute top-full right-0 mt-2 w-[320px] bg-surface-high border border-border rounded-xl shadow-lg p-4 z-20 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">Public link</span>
                <button
                  onClick={handleToggleShare}
                  disabled={shareLoading}
                  className={`w-11 h-6 rounded-full relative transition-colors ${meeting.isPublic ? "bg-success" : "bg-border"}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-all ${
                      meeting.isPublic ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
              {meeting.isPublic && meeting.shareToken && (
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "")}/share/${meeting.shareToken}`}
                    className="text-xs h-9"
                  />
                  <Button variant="secondary" size="sm" onClick={handleCopyShareLink}>
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              )}
              {!meeting.isPublic && (
                <p className="text-xs text-text-secondary">Anyone with the link can view the summary, decisions and action items -- no login required.</p>
              )}
            </div>
          )}
          <Button variant="secondary" data-tour="export-button" onClick={() => setExportModalOpen(true)}>Export</Button>
          <Button variant="secondary" onClick={handleDownloadPdf} disabled={pdfLoading}>
            {pdfLoading ? "Generating..." : "Download PDF"}
          </Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>
      {pdfError && (
        <div className="px-6 py-2 flex items-center gap-2">
          <p className="text-xs text-danger">{pdfError}</p>
          {pdfIsPlanLimit && <Link href="/pricing" className="text-xs text-success hover:underline">Upgrade to Pro →</Link>}
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex items-center gap-1 border-b border-border px-6 py-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md capitalize text-sm transition-colors font-medium font-geist cursor-pointer ${
              activeTab === tab
                ? "bg-surface-high text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Content Area */}
      <div key={activeTab} className="flex-1 overflow-y-auto p-6 animate-tab-in">
        {activeTab === "transcript" && (
          <div className="space-y-5 max-w-3xl">
            {meeting.transcripts.length === 0 ? (
              <EmptyState icon={FileText} label="No transcript available yet." />
            ) : (
              meeting.transcripts.map((seg) => {
                const color = speakerColor(seg.speaker);
                return (
                  <div key={seg.id} className="flex items-start gap-3 group">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold font-geist"
                      style={{ backgroundColor: `${color}26`, color }}
                    >
                      {speakerInitials(seg.speaker)}
                    </div>
                    <div className="flex flex-col gap-0.5 rounded-lg -mx-2 px-2 py-1 group-hover:bg-surface transition-colors">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-medium font-geist" style={{ color }}>
                          {seg.speaker}
                        </span>
                        <span className="text-[11px] text-text-muted">{seg.timestamp}</span>
                      </div>
                      <p className="text-text-primary leading-relaxed">{seg.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "summary" && (
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold font-geist uppercase tracking-wide text-success mb-4">
                <Sparkles size={14} />
                Executive Summary
              </h3>
              {meeting.summary ? (
                <MarkdownSummary text={meeting.summary} />
              ) : (
                <p className="text-text-primary leading-relaxed">Summary not available yet.</p>
              )}
            </Card>
            <Card className="p-5">
              <h4 className="flex items-center gap-2 text-sm font-semibold font-geist uppercase tracking-wide text-warning mb-4">
                <CheckCircle2 size={14} />
                Decisions
              </h4>
              {meeting.decisions.length === 0 ? (
                <EmptyState icon={FileText} label="No decisions detected." compact />
              ) : (
                <ul className="space-y-2">
                  {meeting.decisions.map((d) => (
                    <li key={d.id} className="flex items-start gap-3 p-3 bg-surface-low rounded-lg">
                      <span
                        className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                          d.status === "CONFIRMED" ? "bg-success" : "bg-warning"
                        }`}
                      />
                      <div>
                        <span className="text-sm"><InlineMarkdown text={d.statement} /></span>
                        {d.proposer && <span className="text-xs text-text-secondary block">— {d.proposer}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        )}

        {activeTab === "actions" && (
          <div className="space-y-2.5">
            {meeting.actionItems.length > 0 && (
              <h4 className="flex items-center gap-2 text-sm font-semibold font-geist uppercase tracking-wide text-text-secondary mb-1">
                <ListChecks size={14} />
                Action Items · {meeting.actionItems.length}
              </h4>
            )}
            {meeting.actionItems.length === 0 ? (
              <EmptyState icon={FileText} label="No action items detected." />
            ) : (
              meeting.actionItems.map((item) => {
                const priorityColor =
                  item.priority === "HIGH" ? "border-l-danger" : item.priority === "MEDIUM" ? "border-l-warning" : "border-l-border-hover";
                return (
                  <Card
                    key={item.id}
                    className={`p-4 flex items-center justify-between border-l-2 ${priorityColor} hover:border-border-hover transition-all`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={item.status === "DONE"}
                        onChange={() => toggleActionItem(item.id, item.status)}
                        className="w-5 h-5 rounded border-border bg-background text-success focus:ring-success cursor-pointer"
                      />
                      <div className={item.status === "DONE" ? "opacity-50 line-through" : ""}>
                        <p className="font-medium text-text-primary"><InlineMarkdown text={item.task} /></p>
                        <p className="text-xs text-text-secondary">
                          {item.deadline ? new Date(item.deadline).toLocaleDateString() : "No deadline"}
                          {item.owner ? ` • ${item.owner}` : ""}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={item.priority === "HIGH" ? "danger" : item.priority === "MEDIUM" ? "warning" : "neutral"}
                    >
                      {item.priority}
                    </Badge>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            <Card className="p-5">
              <h4 className="text-sm font-semibold font-geist uppercase tracking-wide text-text-secondary mb-4">Meeting Mood</h4>
              {meeting.mood ? (
                (() => {
                  const MoodIcon = MOOD_STYLE[meeting.mood].icon;
                  return (
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1.5 ${MOOD_STYLE[meeting.mood].text}`}>
                        <MoodIcon size={18} />
                        <span className="font-medium font-geist">{MOOD_STYLE[meeting.mood].label}</span>
                      </div>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden max-w-xs">
                        <div
                          className={`h-full rounded-full transition-all ${MOOD_STYLE[meeting.mood].bg}`}
                          style={{ width: `${MOOD_STYLE[meeting.mood].percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p className="text-sm text-text-secondary">Not analyzed yet.</p>
              )}
            </Card>
            <Card className="p-5">
              <h4 className="flex items-center gap-2 text-sm font-semibold font-geist uppercase tracking-wide text-text-secondary mb-4">
                <AlertTriangle size={14} />
                Detected Disagreements
              </h4>
              {meeting.disagreements.length === 0 ? (
                <EmptyState icon={MessageSquareOff} label="No disagreements detected in this meeting." compact />
              ) : (
                <div className="space-y-4">
                  {meeting.disagreements.map((d) => (
                    <div key={d.id} className="flex flex-col gap-1 bg-surface-low p-4 rounded-lg border-l-2 border-warning">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-text-primary">{d.topic}</span>
                        <Badge variant={SEVERITY_BADGE[d.severity] || "neutral"}>{d.severity}</Badge>
                      </div>
                      <p className="text-text-secondary italic text-sm">&ldquo;{d.quote}&rdquo;</p>
                      {d.participants.length > 0 && (
                        <p className="text-xs text-text-secondary">{d.participants.join(", ")}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Audio Player (Floating) */}
      {audioUrl && (
        <>
          {/* Mounted regardless of panel visibility so playback survives close/scroll. */}
          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
            onEnded={() => setIsPlaying(false)}
          />

          {playerOpen && (
            <div className="fixed bottom-44 right-6 z-40 w-80 bg-surface border border-border rounded-xl shadow-lg p-4 flex items-center gap-4 animate-widget-in">
              <button
                onClick={togglePlayback}
                className="w-12 h-12 shrink-0 bg-success text-background rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
              <div className="flex-1 flex flex-col gap-1">
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-success transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-text-secondary">
                  <span>{formatClock(currentTime)}</span>
                  <span>{formatClock(audioDuration)}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setPlayerOpen((v) => !v)}
            aria-label={playerOpen ? "Close audio player" : "Open audio player"}
            className="fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full bg-success text-background shadow-lg flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"
          >
            {playerOpen ? <ChevronDown size={24} /> : <Headphones size={24} />}
          </button>
        </>
      )}

      <ExportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} meetingId={meeting.id} />
    </div>
  );
}
