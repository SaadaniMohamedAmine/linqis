"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

export type StepStatus = "complete" | "active" | "upcoming" | "error";

export interface UploadStep {
  label: string;
  icon: LucideIcon;
  status: StepStatus;
}

const CIRCLE_STYLES: Record<StepStatus, string> = {
  complete: "border-success bg-success text-background",
  active: "border-success bg-success/10 text-success shadow-[0_0_0_4px_rgba(34,197,94,0.15)] scale-110",
  error: "border-danger bg-danger-bg text-danger",
  upcoming: "border-border bg-surface text-text-secondary",
};

const LABEL_STYLES: Record<StepStatus, string> = {
  complete: "text-text-primary",
  active: "text-success",
  error: "text-danger",
  upcoming: "text-text-secondary",
};

/**
 * Visual progress indicator for the upload -> process -> done pipeline.
 * Purely presentational and driven by the caller's derived step statuses --
 * the pipeline itself is automatic (no manual "Next" navigation), so this
 * only ever moves forward on its own as the upload/processing state changes.
 */
export function UploadStepper({ steps }: { steps: UploadStep[] }) {
  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === steps.length - 1;
        const connectorFilled = step.status === "complete";

        return (
          <div key={step.label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${CIRCLE_STYLES[step.status]}`}
              >
                {step.status === "complete" ? <Check size={18} /> : <Icon size={18} />}
              </div>
              <span className={`whitespace-nowrap text-xs font-medium transition-colors duration-300 ${LABEL_STYLES[step.status]}`}>
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="mx-2 h-0.5 flex-1 -mt-6 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500 ease-out"
                  style={{ width: connectorFilled ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
