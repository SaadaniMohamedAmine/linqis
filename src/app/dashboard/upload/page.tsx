"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, AlertCircle, Sparkles, CalendarClock, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UploadStepper, type StepStatus } from "@/components/upload-stepper";
import {
  uploadMeetingFile,
  subscribeToUploadProgress,
  getUpcomingCalendarEvents,
  ApiError,
  type ProcessingProgressEvent,
  type CalendarEventSummary,
} from "@/lib/api";
import { useDictionary } from "@/lib/i18n/locale-context";
import { uploadDictionary } from "@/lib/i18n/dictionaries/upload";

/**
 * Picks the event most likely to be "the meeting you're about to upload":
 * one currently in progress, or failing that the soonest upcoming one within
 * the next 30 minutes. Anything further out isn't a confident enough guess,
 * so the field is left blank rather than pre-selecting the wrong meeting.
 */
function guessCurrentEvent(events: CalendarEventSummary[]): string | null {
  const now = Date.now();
  const ongoing = events.find((e) => new Date(e.start).getTime() <= now && now <= new Date(e.end).getTime());
  if (ongoing) return ongoing.id;
  const soon = events
    .filter((e) => new Date(e.start).getTime() > now && new Date(e.start).getTime() - now <= 30 * 60 * 1000)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  return soon[0]?.id ?? null;
}

const ACCEPTED_EXTENSIONS = [".mp3", ".mp4", ".wav", ".m4a", ".mov", ".webm"];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // matches the multer limit on the backend

type Stage =
  | { kind: "idle" }
  | { kind: "uploading"; percent: number }
  | { kind: "processing"; label: string; percent: number }
  | { kind: "error"; message: string; isPlanLimit?: boolean }
  | { kind: "done" };

/**
 * Derives the 4-step progress indicator's status from the current stage.
 * The pipeline is fully automatic (no manual "Next"), so this only ever
 * reflects state that already happened -- it never drives navigation itself.
 * `hasAttemptedProcess` disambiguates the error case: a rejected file (bad
 * extension/too large) fails before a file is ever accepted, while an
 * upload/processing failure happens after steps 1-2 are already done.
 */
function getStepStatuses(stage: Stage, hasFile: boolean, hasAttemptedProcess: boolean): [StepStatus, StepStatus, StepStatus, StepStatus] {
  if (stage.kind === "done") return ["complete", "complete", "complete", "complete"];
  if (stage.kind === "uploading" || stage.kind === "processing") return ["complete", "complete", "active", "upcoming"];
  if (stage.kind === "error") {
    if (hasAttemptedProcess) return ["complete", "complete", "error", "upcoming"];
    if (hasFile) return ["complete", "error", "upcoming", "upcoming"];
    return ["error", "upcoming", "upcoming", "upcoming"];
  }
  // idle
  return hasFile ? ["complete", "active", "upcoming", "upcoming"] : ["active", "upcoming", "upcoming", "upcoming"];
}

export default function UploadPage() {
  const t = useDictionary(uploadDictionary);
  const STAGE_LABELS: Record<string, string> = t.stageLabels;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventSummary[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [hasAttemptedProcess, setHasAttemptedProcess] = useState(false);

  // Silently no-ops when Google Calendar isn't connected (404) -- this picker
  // just doesn't appear rather than showing an error for an optional feature.
  useEffect(() => {
    getUpcomingCalendarEvents()
      .then((events) => {
        setCalendarEvents(events);
        const guess = guessCurrentEvent(events);
        if (guess) setSelectedEventId(guess);
      })
      .catch(() => {});
  }, []);

  const validateAndSetFile = useCallback((file: File) => {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setStage({ kind: "error", message: t.unsupportedFileType(ext, ACCEPTED_EXTENSIONS.join(", ")) });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setStage({ kind: "error", message: t.fileTooLarge });
      return;
    }
    setStage({ kind: "idle" });
    setSelectedFile(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  const handleProcess = useCallback(async () => {
    if (!selectedFile) return;

    setHasAttemptedProcess(true);
    setStage({ kind: "uploading", percent: 0 });

    const linkedEvent = calendarEvents.find((e) => e.id === selectedEventId);
    const calendarLink = linkedEvent ? { eventId: linkedEvent.id, title: linkedEvent.summary } : undefined;

    try {
      const { meetingId, jobId } = await uploadMeetingFile(
        selectedFile,
        (percent) => {
          setStage({ kind: "uploading", percent });
        },
        calendarLink
      );

      setStage({ kind: "processing", label: STAGE_LABELS.connected, percent: 0 });

      const unsubscribe = subscribeToUploadProgress(jobId, (event: ProcessingProgressEvent) => {
        if (event.status === "error") {
          setStage({ kind: "error", message: event.error || t.processingFailed });
          unsubscribe();
          return;
        }
        if (event.status === "completed") {
          setStage({ kind: "done" });
          unsubscribe();
          // The sidebar's meeting list and the dashboard's stats are fetched
          // by the shared layout Server Component -- router.push alone
          // reuses that cached render across client-side navigation, so
          // without this they'd keep showing pre-upload data indefinitely.
          router.refresh();
          router.push(`/dashboard/meetings/${meetingId}`);
          return;
        }
        setStage({
          kind: "processing",
          label: STAGE_LABELS[event.status] || event.status,
          percent: Math.round(event.progress ?? 0),
        });
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t.uploadFailed;
      const isPlanLimit = err instanceof ApiError && err.status === 402;
      setStage({ kind: "error", message, isPlanLimit });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, router, calendarEvents, selectedEventId]);

  const handleCancel = () => {
    setSelectedFile(null);
    setStage({ kind: "idle" });
    setHasAttemptedProcess(false);
  };

  const isBusy = stage.kind === "uploading" || stage.kind === "processing";
  const stepStatuses = getStepStatuses(stage, !!selectedFile, hasAttemptedProcess);
  const steps = [
    { label: t.stepSelect, icon: Upload, status: stepStatuses[0] },
    { label: t.stepLink, icon: CalendarClock, status: stepStatuses[1] },
    { label: t.stepProcess, icon: Sparkles, status: stepStatuses[2] },
    { label: t.stepDone, icon: CheckCircle2, status: stepStatuses[3] },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden py-12">
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-success/30 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-warning/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="container max-w-[720px] px-6 z-10 animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-text-primary to-text-primary/70 bg-clip-text">{t.title}</h1>
            <p className="text-text-secondary">{t.subtitle}</p>
          </div>

          <div className="mb-8 px-2">
            <UploadStepper steps={steps} />
          </div>

          <Card className="p-8 flex flex-col gap-8 border-border/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.35)]">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(",")}
              className="hidden"
              onChange={handleFileInputChange}
              disabled={isBusy}
            />

            <div
              onClick={() => !isBusy && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                if (!isBusy) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={isBusy ? undefined : handleDrop}
              className={`group flex h-60 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                isBusy
                  ? "cursor-not-allowed border-border/60 opacity-60"
                  : "cursor-pointer border-border/60 hover:border-success/50 hover:bg-success/[0.03]"
              } ${isDragging ? "border-success bg-success/[0.06] shadow-[0_0_0_4px_rgba(34,197,94,0.1)]" : ""}`}
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-105 group-hover:border-success/40 group-hover:bg-success/15 group-hover:text-success ${
                  isDragging || selectedFile
                    ? "border-success/40 bg-success/15 text-success"
                    : "border-success/15 bg-success/5 text-success/80"
                }`}
              >
                <Upload size={24} />
              </div>
              <div className="text-center px-6">
                <p className="font-semibold text-text-primary">
                  {selectedFile ? selectedFile.name : t.dropZoneHint}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  {selectedFile
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`
                    : t.clickToBrowse}
                </p>
              </div>
              <Badge variant="neutral" className="text-[11px]">{t.maxFileSize}</Badge>
            </div>

            {calendarEvents.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarClock size={12} />
                  {t.linkCalendarLabel}
                </label>
                <div className="relative">
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    disabled={isBusy}
                    className="w-full appearance-none rounded-[var(--radius-sm)] border border-border bg-background py-3 pl-3 pr-10 text-sm text-text-primary outline-none transition-colors focus-visible:border-success focus-visible:ring-1 focus-visible:ring-success disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">{t.none}</option>
                    {calendarEvents.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.summary} — {new Date(event.start).toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" })}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                </div>
                <p className="text-xs text-text-secondary">
                  {t.linkCalendarHint}
                </p>
              </div>
            )}

            {stage.kind === "uploading" && (
              <div className="bg-surface-low border border-border rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-text-primary">{t.uploading}</span>
                  <span className="text-xs text-text-secondary">{stage.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full transition-all" style={{ width: `${stage.percent}%` }} />
                </div>
              </div>
            )}

            {stage.kind === "processing" && (
              <div className="bg-surface-low border border-border rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-text-primary">{stage.label}</span>
                  <span className="text-xs text-text-secondary">{stage.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full transition-all" style={{ width: `${stage.percent}%` }} />
                </div>
                <p className="text-xs text-text-secondary">{t.processingHint}</p>
              </div>
            )}

            {stage.kind === "error" && (
              <div className="bg-danger-bg border border-danger/30 rounded-xl p-4 flex gap-3">
                <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-danger">{stage.message}</p>
                  {stage.isPlanLimit && (
                    <Link href="/pricing" className="text-sm text-success hover:underline inline-flex items-center gap-1 mt-1">
                      <Sparkles size={14} />
                      {t.upgradeToPro}
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="border-t border-border/40 pt-6 flex justify-end items-center gap-3">
              <Button variant="ghost" onClick={handleCancel} disabled={isBusy || !selectedFile}>
                {t.cancel}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleProcess}
                disabled={isBusy || !selectedFile}
                className="gap-2 shadow-[0_8px_24px_-8px_rgba(34,197,94,0.5)]"
              >
                {!isBusy && <Sparkles size={16} />}
                {isBusy ? t.processing : t.processMeeting}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
