"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ExportModal from "@/components/export-modal";
import {
  getMeeting,
  updateActionItemStatus,
  resolveAudioUrl,
  renameMeeting,
  deleteMeeting,
  ApiError,
  type MeetingDetail,
} from "@/lib/api";

const TABS = ["transcript", "summary", "actions", "analysis"] as const;
type Tab = (typeof TABS)[number];

const MOOD_LABEL: Record<string, { label: string; className: string }> = {
  POSITIVE: { label: "Positive", className: "text-success" },
  NEUTRAL: { label: "Neutral", className: "text-text-secondary" },
  TENSE: { label: "Tense", className: "text-danger" },
};

const SEVERITY_BADGE: Record<string, "danger" | "warning" | "neutral"> = {
  HIGH: "danger",
  MEDIUM: "warning",
  LOW: "neutral",
};

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

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

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
    router.push("/dashboard/meetings");
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

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 flex items-center justify-between border-b border-border">
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
              className="h-8 text-lg font-semibold"
            />
          ) : (
            <h1
              className="text-lg font-semibold text-text-primary cursor-pointer hover:text-success transition-colors"
              onClick={startEditingTitle}
            >
              {meeting.title}
            </h1>
          )}
          {meeting.status === "PROCESSING" && (
            <p className="text-xs text-warning">Still processing — this page will refresh automatically.</p>
          )}
          {meeting.status === "FAILED" && <p className="text-xs text-danger">Processing failed for this meeting.</p>}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setExportModalOpen(true)}>Export</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-border px-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 capitalize ${
              activeTab === tab
                ? "border-success text-success"
                : "border-transparent text-text-secondary hover:text-text-primary"
            } font-medium`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        {activeTab === "transcript" && (
          <div className="space-y-6">
            {meeting.transcripts.length === 0 ? (
              <p className="text-text-secondary">No transcript available yet.</p>
            ) : (
              meeting.transcripts.map((seg) => (
                <div key={seg.id} className="flex items-start gap-4">
                  <div className="bg-surface-high px-2 py-1 rounded-full flex items-center gap-2 border border-border shrink-0 mt-1">
                    <span className="text-xs font-medium text-info">{seg.speaker}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-text-secondary">{seg.timestamp}</span>
                    <p className="text-text-primary">{seg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "summary" && (
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="text-lg font-semibold text-success mb-4">Executive Summary</h3>
              <p className="text-text-primary leading-relaxed">
                {meeting.summary || "Summary not available yet."}
              </p>
            </Card>
            <Card className="p-5">
              <h4 className="font-medium text-warning mb-4">Decisions</h4>
              {meeting.decisions.length === 0 ? (
                <p className="text-sm text-text-secondary">No decisions detected.</p>
              ) : (
                <ul className="space-y-2">
                  {meeting.decisions.map((d) => (
                    <li key={d.id} className="flex items-start gap-3 p-2 bg-background/50 rounded-lg">
                      <span
                        className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                          d.status === "CONFIRMED" ? "bg-success" : "bg-warning"
                        }`}
                      />
                      <div>
                        <span className="text-sm">{d.statement}</span>
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
          <div className="space-y-3">
            {meeting.actionItems.length === 0 ? (
              <p className="text-text-secondary">No action items detected.</p>
            ) : (
              meeting.actionItems.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 flex items-center justify-between hover:border-border-hover transition-all"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={item.status === "DONE"}
                      onChange={() => toggleActionItem(item.id, item.status)}
                      className="w-5 h-5 rounded border-border bg-background text-success focus:ring-success cursor-pointer"
                    />
                    <div className={item.status === "DONE" ? "opacity-50 line-through" : ""}>
                      <p className="font-medium text-text-primary">{item.task}</p>
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
              ))
            )}
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            <Card className="p-5 flex items-center gap-6">
              <div>
                <h4 className="font-medium text-text-secondary mb-2">Meeting Mood</h4>
                <div className={`text-2xl font-bold ${meeting.mood ? MOOD_LABEL[meeting.mood]?.className : "text-text-secondary"}`}>
                  {meeting.mood ? MOOD_LABEL[meeting.mood]?.label : "Not analyzed yet"}
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <h4 className="font-medium text-text-secondary mb-4">Detected Disagreements</h4>
              {meeting.disagreements.length === 0 ? (
                <p className="text-sm text-text-secondary">No disagreements detected in this meeting.</p>
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

      {/* Audio Player (Bottom Persistent) */}
      {audioUrl && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-surface/80 backdrop-blur-md border-t border-border px-6 flex items-center gap-6 z-30">
          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
            onEnded={() => setIsPlaying(false)}
          />
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={togglePlayback}
              className="w-12 h-12 bg-success text-background rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>
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

      <ExportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} meetingId={meeting.id} />
    </div>
  );
}
