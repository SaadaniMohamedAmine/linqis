"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { markTourSeen } from "@/lib/api";

interface TourStep {
  target: string; // CSS selector, e.g. '[data-tour="upload-button"]'
  title: string;
  description: string;
}

const STEPS: TourStep[] = [
  { target: '[data-tour="upload-button"]', title: "Upload a meeting", description: "Drop an audio or video file here. Linqis transcribes it and extracts the summary automatically." },
  { target: '[data-tour="meetings-nav"]', title: "Your meetings", description: "Every processed meeting shows up here, with real-time status while it's being analyzed." },
  { target: '[data-tour="action-items-nav"]', title: "Action items", description: "All action items across every meeting, in one place, so nothing falls through the cracks." },
  { target: '[data-tour="export-button"]', title: "Export anywhere", description: "Send a summary to Notion, Slack, or by email in one click, once a meeting is ready." },
];

export function ProductTour() {
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tour") === "start") {
      setStepIndex(0);
      const url = new URL(window.location.href);
      url.searchParams.delete("tour");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  useEffect(() => {
    if (stepIndex === null) return;
    const el = document.querySelector(STEPS[stepIndex].target);
    if (!el) {
      // Target not present on this page (e.g. export button before landing
      // on a meeting) -- skip ahead to the next step.
      setStepIndex((i) => (i !== null && i < STEPS.length - 1 ? i + 1 : null));
      return;
    }
    setRect(el.getBoundingClientRect());
  }, [stepIndex]);

  if (stepIndex === null || !rect) return null;

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const end = () => {
    setStepIndex(null);
    markTourSeen().catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      <div
        className="fixed rounded-lg pointer-events-none transition-all duration-300"
        style={{
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
          boxShadow: "0 0 0 9999px rgba(10,10,10,0.75)",
          border: "2px solid var(--color-success)",
        }}
      />
      <div
        className="fixed bg-surface border border-border rounded-xl p-5 w-[300px] pointer-events-auto shadow-lg"
        style={{ top: rect.bottom + 16, left: Math.min(rect.left, window.innerWidth - 320) }}
      >
        <p className="text-xs text-text-secondary mb-1">{stepIndex + 1} / {STEPS.length}</p>
        <h3 className="font-semibold text-text-primary mb-2">{step.title}</h3>
        <p className="text-sm text-text-secondary mb-4">{step.description}</p>
        <div className="flex justify-between items-center">
          <button onClick={end} className="text-xs text-text-secondary hover:text-text-primary cursor-pointer">Skip tour</button>
          <Button variant="primary" size="sm" onClick={() => (isLast ? end() : setStepIndex(stepIndex + 1))}>
            {isLast ? "Done" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
