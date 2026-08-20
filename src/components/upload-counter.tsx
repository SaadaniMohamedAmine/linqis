"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useDictionary } from "@/lib/i18n/locale-context";
import { uploadCounterDictionary } from "@/lib/i18n/dictionaries/upload-counter";

export function UploadCounter({
  meetingsThisMonth,
  maxMeetingsPerMonth,
}: {
  meetingsThisMonth: number;
  maxMeetingsPerMonth: number | null;
}) {
  const t = useDictionary(uploadCounterDictionary);

  // null == unlimited (Pro) -- see UserProfile.maxMeetingsPerMonth.
  const isUnlimited = maxMeetingsPerMonth === null;
  const atLimit = !isUnlimited && meetingsThisMonth >= maxMeetingsPerMonth;
  const percent = isUnlimited ? 0 : Math.min(100, Math.round((meetingsThisMonth / maxMeetingsPerMonth) * 100));

  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-4 py-5 text-center transition-colors ${
        atLimit ? "border-danger/50 bg-danger-bg" : "border-success/50 bg-success/5"
      }`}
    >
      <span className="text-3xl font-bold tabular-nums text-text-primary">
        {meetingsThisMonth}
        {!isUnlimited && (
          <span className="text-base font-medium text-text-secondary">/{maxMeetingsPerMonth}</span>
        )}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
        {t.meetingsLabel}
      </span>

      {isUnlimited ? (
        <span className="mt-2 text-xs text-text-secondary">
          {t.unlimitedOn} <span className="font-semibold text-success">Pro</span>
        </span>
      ) : atLimit ? (
        <Link href="/pricing" className="mt-2 flex items-center gap-1 text-xs text-success hover:underline">
          <Sparkles size={12} />
          {t.upgradeForUnlimited}
        </Link>
      ) : (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
          <div className="h-full rounded-full bg-success transition-all" style={{ width: `${percent}%` }} />
        </div>
      )}
    </div>
  );
}
