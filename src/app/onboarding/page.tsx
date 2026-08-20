"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "@/lib/api";
import { useDictionary } from "@/lib/i18n/locale-context";
import { onboardingDictionary } from "@/lib/i18n/dictionaries/onboarding";

// Selection is tracked by a stable id (independent of locale) and mapped
// back to a canonical English value here before it's sent to the backend --
// role/teamSize are free-text profile fields, so this keeps that data
// consistent in English regardless of which language the user onboarded in.
const ROLE_VALUES: Record<string, string> = {
  "product-manager": "Product Manager",
  "engineering-lead": "Engineering Lead",
  "founder-executive": "Founder / Executive",
  designer: "Designer",
  other: "Other",
};

const TEAM_SIZE_VALUES: Record<string, string> = {
  "just-me": "Just me",
  "2-10": "2-10",
  "11-50": "11-50",
  "50-plus": "50+",
};

export default function OnboardingPage() {
  const t = useDictionary(onboardingDictionary);
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("");
  const [saving, setSaving] = useState(false);

  const steps = [
    { title: t.stepTitles.role, value: role, setValue: setRole, options: t.roles },
    { title: t.stepTitles.teamSize, value: teamSize, setValue: setTeamSize, options: t.teamSizes },
    { title: t.stepTitles.useCase, value: useCase, setValue: setUseCase, options: t.useCases },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = async () => {
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    setSaving(true);
    await completeOnboarding({
      role: ROLE_VALUES[role] || role,
      teamSize: TEAM_SIZE_VALUES[teamSize] || teamSize,
      primaryUseCase: useCase || "decisions",
    });
    // The JWT still says onboardingCompleted: false until it's refreshed --
    // without this, the middleware would bounce us straight back here.
    await update({ onboardingCompleted: true });
    router.push("/dashboard?tour=start");
  };

  const handleSkip = async () => {
    // Must still mark onboarding as completed -- otherwise the middleware
    // would immediately redirect straight back here from /dashboard.
    await completeOnboarding({
      role: ROLE_VALUES[role] || role,
      teamSize: TEAM_SIZE_VALUES[teamSize] || teamSize,
      primaryUseCase: "decisions",
    });
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
              key={option.id}
              onClick={() => current.setValue(option.id)}
              className={`text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                current.value === option.id
                  ? "border-success bg-success-bg text-text-primary"
                  : "border-border text-text-secondary hover:border-border-hover"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-sm text-text-secondary hover:text-text-primary cursor-pointer"
          >
            {t.skip}
          </button>
          <Button variant="primary" onClick={handleNext} disabled={!current.value || saving}>
            {saving ? t.saving : isLast ? t.getStarted : t.next}
          </Button>
        </div>
      </div>
    </div>
  );
}
