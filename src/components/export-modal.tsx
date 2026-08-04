"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { exportToNotion, exportToSlack, exportToEmail, ApiError } from "@/lib/api";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
}

type Target = "notion" | "slack" | "email";
type Status = "idle" | "exporting" | "success" | "error";

export default function ExportModal({ isOpen, onClose, meetingId }: ExportModalProps) {
  const [selectedTarget, setSelectedTarget] = useState<Target>("notion");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(process.env.NEXT_PUBLIC_DEFAULT_SLACK_WEBHOOK || "");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPlanLimit, setIsPlanLimit] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setStatus("idle");
    setError(null);
    setIsPlanLimit(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleExport = async () => {
    setStatus("exporting");
    setError(null);
    setIsPlanLimit(false);
    try {
      if (selectedTarget === "notion") {
        await exportToNotion(meetingId);
      } else if (selectedTarget === "slack") {
        if (!slackWebhookUrl) throw new Error("Enter a Slack webhook URL.");
        await exportToSlack(meetingId, slackWebhookUrl);
      } else {
        if (!email) throw new Error("Enter a recipient email.");
        await exportToEmail(meetingId, email);
      }
      setStatus("success");
      setTimeout(handleClose, 1200);
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError && err.status === 402) {
        setIsPlanLimit(true);
        setError(err.message); // the backend message already invites upgrading
      } else {
        setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Export failed.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-surface-high border border-border rounded-xl shadow-lg flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-1">Export Meeting</h2>
            <p className="text-sm text-text-secondary">Choose your destination.</p>
          </div>
          <button onClick={handleClose} className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input checked={selectedTarget === "notion"} onChange={() => setSelectedTarget("notion")} type="radio" name="export-target" className="w-5 h-5 text-success" />
            <span className="font-medium text-text-primary">Notion</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input checked={selectedTarget === "slack"} onChange={() => setSelectedTarget("slack")} type="radio" name="export-target" className="w-5 h-5 text-success" />
            <span className="font-medium text-text-primary">Slack</span>
          </label>
          {selectedTarget === "slack" && (
            <input
              value={slackWebhookUrl}
              onChange={(e) => setSlackWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="ml-7 w-[calc(100%-1.75rem)] bg-background border border-border rounded-lg py-3 px-4 text-sm text-text-primary outline-none"
            />
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input checked={selectedTarget === "email"} onChange={() => setSelectedTarget("email")} type="radio" name="export-target" className="w-5 h-5 text-success" />
            <span className="font-medium text-text-primary">Email Recap</span>
          </label>
          {selectedTarget === "email" && (
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter recipient email..."
              className="ml-7 w-[calc(100%-1.75rem)] bg-background border border-border rounded-lg py-3 px-4 text-sm text-text-primary outline-none"
            />
          )}

          {status === "error" && (
            <div className="text-sm text-danger">
              <p>{error}</p>
              {isPlanLimit && (
                <Link href="/pricing" className="text-success hover:underline">Upgrade to Pro →</Link>
              )}
            </div>
          )}
          {status === "success" && <p className="text-sm text-success">Exported successfully.</p>}
        </div>

        <div className="p-6 bg-surface-low border-t border-border flex gap-4">
          <Button variant="secondary" className="flex-1" onClick={handleClose} disabled={status === "exporting"}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={handleExport} disabled={status === "exporting"}>
            {status === "exporting" ? "Exporting..." : "Export Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
