"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { markTourSeen } from "@/lib/api";
import { useDictionary } from "@/lib/i18n/locale-context";
import { productTourDictionary } from "@/lib/i18n/dictionaries/product-tour";

// CSS selectors, one per dictionary step -- not translatable content, kept
// separate from the dictionary and merged with it by index in the component.
const STEP_TARGETS = [
  '[data-tour="upload-button"]',
  '[data-tour="meetings-nav"]',
  '[data-tour="action-items-nav"]',
  '[data-tour="export-button"]',
];

const CARD_WIDTH = 300;
const CARD_HEIGHT_ESTIMATE = 180;
const MARGIN = 16;

// Prefers below the spotlighted element, like a normal tooltip. But targets
// like the meetings sidebar span nearly the full viewport height, which
// pushes "below" off-screen -- fall back to beside it, then above it.
function cardPosition(rect: DOMRect): { top: number; left: number } {
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceRight = window.innerWidth - rect.right;

  if (spaceBelow >= CARD_HEIGHT_ESTIMATE + MARGIN) {
    return {
      top: rect.bottom + MARGIN,
      left: Math.min(rect.left, window.innerWidth - CARD_WIDTH - MARGIN),
    };
  }

  if (spaceRight >= CARD_WIDTH + MARGIN) {
    return {
      top: Math.min(rect.top, window.innerHeight - CARD_HEIGHT_ESTIMATE - MARGIN),
      left: rect.right + MARGIN,
    };
  }

  return {
    top: Math.max(MARGIN, rect.top - CARD_HEIGHT_ESTIMATE - MARGIN),
    left: Math.min(rect.left, window.innerWidth - CARD_WIDTH - MARGIN),
  };
}

export function ProductTour() {
  const t = useDictionary(productTourDictionary);
  const steps = t.steps.map((step, i) => ({ ...step, target: STEP_TARGETS[i] }));
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
    const el = document.querySelector(steps[stepIndex].target);
    if (!el) {
      // Target not present on this page (e.g. export button before landing
      // on a meeting) -- skip ahead to the next step.
      setStepIndex((i) => (i !== null && i < steps.length - 1 ? i + 1 : null));
      return;
    }
    setRect(el.getBoundingClientRect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  if (stepIndex === null || !rect) return null;

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

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
        style={cardPosition(rect)}
      >
        <p className="text-xs text-text-secondary mb-1">{stepIndex + 1} / {steps.length}</p>
        <h3 className="font-semibold text-text-primary mb-2">{step.title}</h3>
        <p className="text-sm text-text-secondary mb-4">{step.description}</p>
        <div className="flex justify-between items-center">
          <button onClick={end} className="text-xs text-text-secondary hover:text-text-primary cursor-pointer">{t.skipTour}</button>
          <Button variant="primary" size="sm" onClick={() => (isLast ? end() : setStepIndex(stepIndex + 1))}>
            {isLast ? t.done : t.next}
          </Button>
        </div>
      </div>
    </div>
  );
}
