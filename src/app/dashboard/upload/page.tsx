"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  uploadMeetingFile,
  subscribeToUploadProgress,
  ApiError,
  type ProcessingProgressEvent,
} from "@/lib/api";

const ACCEPTED_EXTENSIONS = [".mp3", ".mp4", ".wav", ".m4a", ".mov", ".webm"];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // matches the multer limit on the backend

type Stage =
  | { kind: "idle" }
  | { kind: "uploading"; percent: number }
  | { kind: "processing"; label: string; percent: number }
  | { kind: "error"; message: string; isPlanLimit?: boolean }
  | { kind: "done" };

const STAGE_LABELS: Record<string, string> = {
  connected: "Connected to processing pipeline...",
  transcribing: "Transcribing audio...",
  analyzing: "Extracting decisions, action items & mood...",
  saving: "Saving results...",
};

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stage, setStage] = useState<Stage>({ kind: "idle" });

  const validateAndSetFile = useCallback((file: File) => {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setStage({ kind: "error", message: `Unsupported file type "${ext}". Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}` });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setStage({ kind: "error", message: "File exceeds the 100MB limit." });
      return;
    }
    setStage({ kind: "idle" });
    setSelectedFile(file);
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

    setStage({ kind: "uploading", percent: 0 });

    try {
      const { meetingId, jobId } = await uploadMeetingFile(selectedFile, (percent) => {
        setStage({ kind: "uploading", percent });
      });

      setStage({ kind: "processing", label: STAGE_LABELS.connected, percent: 0 });

      const unsubscribe = subscribeToUploadProgress(jobId, (event: ProcessingProgressEvent) => {
        if (event.status === "error") {
          setStage({ kind: "error", message: event.error || "Processing failed." });
          unsubscribe();
          return;
        }
        if (event.status === "completed") {
          setStage({ kind: "done" });
          unsubscribe();
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
      const message = err instanceof ApiError ? err.message : "Upload failed. Is the backend running?";
      const isPlanLimit = err instanceof ApiError && err.status === 402;
      setStage({ kind: "error", message, isPlanLimit });
    }
  }, [selectedFile, router]);

  const handleCancel = () => {
    setSelectedFile(null);
    setStage({ kind: "idle" });
  };

  const isBusy = stage.kind === "uploading" || stage.kind === "processing";

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
            <h1 className="text-3xl font-semibold mb-2">Ingest Meeting Data</h1>
            <p className="text-text-secondary">Upload a recording for AI analysis.</p>
          </div>

          <Card className="p-6 flex flex-col gap-6">
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
              className={`border-2 border-dashed rounded-lg h-56 flex flex-col items-center justify-center gap-3 transition-colors group ${
                isBusy ? "opacity-60 cursor-not-allowed border-border" : "cursor-pointer hover:bg-surface/50 border-border"
              } ${isDragging ? "border-success bg-success/5" : ""}`}
            >
              <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-text-secondary group-hover:bg-success/20 group-hover:text-success transition-all">
                <Upload size={20} />
              </div>
              <div className="text-center">
                <p className="font-medium text-text-primary">
                  {selectedFile ? selectedFile.name : "Drop MP3, MP4, WAV, M4A, MOV or WebM"}
                </p>
                <p className="text-sm text-text-secondary">
                  {selectedFile
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`
                    : "or click to browse from device"}
                </p>
              </div>
              <p className="text-xs text-text-secondary opacity-60">Max file size: 100MB</p>
            </div>

            {stage.kind === "uploading" && (
              <div className="bg-surface-low border border-border rounded-lg p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-text-primary">Uploading...</span>
                  <span className="text-xs text-text-secondary">{stage.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full transition-all" style={{ width: `${stage.percent}%` }} />
                </div>
              </div>
            )}

            {stage.kind === "processing" && (
              <div className="bg-surface-low border border-border rounded-lg p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-text-primary">{stage.label}</span>
                  <span className="text-xs text-text-secondary">{stage.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full transition-all" style={{ width: `${stage.percent}%` }} />
                </div>
                <p className="text-xs text-text-secondary">This can take a few minutes for longer recordings.</p>
              </div>
            )}

            {stage.kind === "error" && (
              <div className="bg-danger-bg border border-danger/30 rounded-lg p-4 flex gap-3">
                <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-danger">{stage.message}</p>
                  {stage.isPlanLimit && (
                    <Link href="/pricing" className="text-sm text-success hover:underline inline-flex items-center gap-1 mt-1">
                      <Sparkles size={14} />
                      Upgrade to Pro
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="border-t border-border/30 pt-6 flex justify-end items-center gap-4">
              <Button variant="secondary" onClick={handleCancel} disabled={isBusy || !selectedFile}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleProcess} disabled={isBusy || !selectedFile}>
                {isBusy ? "Processing..." : "Process Meeting"}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
