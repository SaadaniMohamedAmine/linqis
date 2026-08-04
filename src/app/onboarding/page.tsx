"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "@/lib/api";

const ROLES = ["Product Manager", "Engineering Lead", "Founder / Executive", "Designer", "Other"];
const TEAM_SIZES = ["Just me", "2-10", "11-50", "50+"];
const USE_CASES = [
  { value: "decisions", label: "Track decisions & action items" },
  { value: "async", label: "Keep async teammates in the loop" },
  { value: "clients", label: "Summarize client calls" },
  { value: "compliance", label: "Keep a searchable record" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("");
  const [saving, setSaving] = useState(false);

  const steps = [
    { title: "What's your role?", value: role, setValue: setRole, options: ROLES },
    { title: "How big is your team?", value: teamSize, setValue: setTeamSize, options: TEAM_SIZES },
    {
      title: "What will you use Linqis for?",
      value: useCase,
      setValue: setUseCase,
      options: USE_CASES.map((u) => u.label),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = async () => {
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    setSaving(true);
    const useCaseValue = USE_CASES.find((u) => u.label === useCase)?.value || "decisions";
    await completeOnboarding({ role, teamSize, primaryUseCase: useCaseValue });
    // The JWT still says onboardingCompleted: false until it's refreshed --
    // without this, the middleware would bounce us straight back here.
    await update({ onboardingCompleted: true });
    router.push("/dashboard?tour=start");
  };

  const handleSkip = async () => {
    // Must still mark onboarding as completed -- otherwise the middleware
    // would immediately redirect straight back here from /dashboard.
    await completeOnboarding({ role, teamSize, primaryUseCase: "decisions" });
    await update({ onboardingCompleted: true });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] bg-surface border border-border rounded-xl p-8">
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-success" : "bg-border"}`} />
          ))}
        </div>

        <h1 className="text-xl font-semibold text-text-primary mb-6">{current.title}</h1>

        <div className="flex flex-col gap-3 mb-8">
          {current.options.map((option) => (
            <button
              key={option}
              onClick={() => current.setValue(option)}
              className={`text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                current.value === option
                  ? "border-success bg-success-bg text-text-primary"
                  : "border-border text-text-secondary hover:border-border-hover"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-sm text-text-secondary hover:text-text-primary cursor-pointer"
          >
            Skip
          </button>
          <Button variant="primary" onClick={handleNext} disabled={!current.value || saving}>
            {saving ? "Saving..." : isLast ? "Get started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
