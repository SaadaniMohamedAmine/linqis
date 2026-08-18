import Link from "next/link";
import { Sparkles } from "lucide-react";

export function UploadCounter({
  meetingsThisMonth,
  maxMeetingsPerMonth,
}: {
  meetingsThisMonth: number;
  maxMeetingsPerMonth: number | null;
}) {
  // null == unlimited (Pro) -- see UserProfile.maxMeetingsPerMonth.
  if (maxMeetingsPerMonth === null) {
    return (
      <p className="text-xs text-text-secondary px-1">
        {meetingsThisMonth} meeting{meetingsThisMonth === 1 ? "" : "s"} this month · Unlimited on Pro
      </p>
    );
  }

  const percent = Math.min(100, Math.round((meetingsThisMonth / maxMeetingsPerMonth) * 100));
  const atLimit = meetingsThisMonth >= maxMeetingsPerMonth;

  return (
    <div className="flex flex-col gap-1.5 px-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">
          {meetingsThisMonth}/{maxMeetingsPerMonth} meetings this month
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
          Upgrade to Pro for unlimited
        </Link>
      )}
    </div>
  );
}
