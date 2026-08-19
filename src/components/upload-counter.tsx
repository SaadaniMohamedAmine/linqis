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
  if (maxMeetingsPerMonth === null) {
    return (
      <p className="text-xs text-text-secondary px-1">
        {t.unlimitedStatus(meetingsThisMonth)}
      </p>
    );
  }

  const percent = Math.min(100, Math.round((meetingsThisMonth / maxMeetingsPerMonth) * 100));
  const atLimit = meetingsThisMonth >= maxMeetingsPerMonth;

  return (
    <div className="flex flex-col gap-1.5 px-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">
          {t.limitedStatus(meetingsThisMonth, maxMeetingsPerMonth)}
        </span>
      </div>
      <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${atLimit ? "bg-danger" : "bg-success"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {atLimit && (
        <Link href="/pricing" className="flex items-center gap-1 text-xs text-success hover:underline">
          <Sparkles size={12} />
          {t.upgradeForUnlimited}
        </Link>
      )}
    </div>
  );
}
