"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { exportToNotion, exportToSlack, exportToEmail, getUser, ApiError } from "@/lib/api";
import { useToast } from "@/components/toast-provider";
import { useDictionary } from "@/lib/i18n/locale-context";
import { exportModalDictionary } from "@/lib/i18n/dictionaries/export-modal";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
}

type Target = "notion" | "slack" | "email";
type Status = "idle" | "exporting" | "success" | "error";

export default function ExportModal({ isOpen, onClose, meetingId }: ExportModalProps) {
  const t = useDictionary(exportModalDictionary);
  const [selectedTarget, setSelectedTarget] = useState<Target>("notion");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(process.env.NEXT_PUBLIC_DEFAULT_SLACK_WEBHOOK || "");
  // Display-only: Slack's webhook API returns no channel metadata, so this
  // isn't used in the export call itself -- it only lets the confirmation
  // toast name the channel instead of saying "exported to Slack" blindly.
  const [slackChannelName, setSlackChannelName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPlanLimit, setIsPlanLimit] = useState(false);
  const { showToast } = useToast();

  // Pre-fill from the saved Settings > API Keys connection instead of
  // always starting blank (or from the env-wide default) -- a saved value
  // takes priority since it's what the user explicitly configured. Still
  // fully editable below for a one-off export to a different channel.
  useEffect(() => {
    getUser()
      .then((u) => {
        if (u.slackWebhookUrl) setSlackWebhookUrl(u.slackWebhookUrl);
        if (u.slackChannelName) setSlackChannelName(u.slackChannelName);
      })
      .catch(() => {
        // Not fatal -- the fields just stay at their existing defaults.
      });
  }, []);

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
        showToast(t.toastNotion);
      } else if (selectedTarget === "slack") {
        if (!slackWebhookUrl) throw new Error(t.enterSlackWebhook);
        await exportToSlack(meetingId, slackWebhookUrl);
        const channel = slackChannelName.trim();
        showToast(
          channel
            ? t.toastSlackWithChannel(channel.startsWith("#") ? channel : `#${channel}`)
            : t.toastSlackNoChannel
        );
      } else {
        if (!email) throw new Error(t.enterRecipientEmail);
        await exportToEmail(meetingId, email);
        showToast(t.toastEmail(email));
      }
      setStatus("success");
      setTimeout(handleClose, 1200);
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError && err.status === 402) {
        setIsPlanLimit(true);
        setError(err.message); // the backend message already invites upgrading
      } else {
        setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : t.exportFailed);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-surface-high border border-border rounded-xl shadow-lg flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-1">{t.title}</h2>
            <p className="text-sm text-text-secondary">{t.subtitle}</p>
          </div>
          <button onClick={handleClose} className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input checked={selectedTarget === "notion"} onChange={() => setSelectedTarget("notion")} type="radio" name="export-target" className="w-5 h-5 text-success" />
            <span className="font-medium text-text-primary">{t.notion}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input checked={selectedTarget === "slack"} onChange={() => setSelectedTarget("slack")} type="radio" name="export-target" className="w-5 h-5 text-success" />
            <span className="font-medium text-text-primary">{t.slack}</span>
          </label>
          {selectedTarget === "slack" && (
            <div className="ml-7 w-[calc(100%-1.75rem)] flex flex-col gap-2">
              <input
                value={slackWebhookUrl}
                onChange={(e) => setSlackWebhookUrl(e.target.value)}
                placeholder={t.slackWebhookPlaceholder}
                className="w-full bg-background border border-border rounded-lg py-3 px-4 text-sm text-text-primary outline-none"
              />
              <input
                value={slackChannelName}
                onChange={(e) => setSlackChannelName(e.target.value)}
                placeholder={t.slackChannelPlaceholder}
                className="w-full bg-background border border-border rounded-lg py-3 px-4 text-sm text-text-primary outline-none"
              />
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input checked={selectedTarget === "email"} onChange={() => setSelectedTarget("email")} type="radio" name="export-target" className="w-5 h-5 text-success" />
            <span className="font-medium text-text-primary">{t.emailRecap}</span>
          </label>
          {selectedTarget === "email" && (
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={t.emailPlaceholder}
              className="ml-7 w-[calc(100%-1.75rem)] bg-background border border-border rounded-lg py-3 px-4 text-sm text-text-primary outline-none"
            />
          )}

          {status === "error" && (
            <div className="text-sm text-danger">
              <p>{error}</p>
              {isPlanLimit && (
                <Link href="/pricing" className="text-success hover:underline">{t.upgradeToPro}</Link>
              )}
            </div>
          )}
          {status === "success" && <p className="text-sm text-success">{t.exportedSuccessfully}</p>}
        </div>

        <div className="p-6 bg-surface-low border-t border-border flex gap-4">
          <Button variant="secondary" className="flex-1" onClick={handleClose} disabled={status === "exporting"}>{t.cancel}</Button>
          <Button variant="primary" className="flex-1" onClick={handleExport} disabled={status === "exporting"}>
            {status === "exporting" ? t.exporting : t.exportNow}
          </Button>
        </div>
      </div>
    </div>
  );
}
