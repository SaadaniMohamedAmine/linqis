"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatMeetingDate, formatDuration } from "@/lib/utils";
import type { MeetingListItem } from "@/lib/api";

export function RecentMeetingsNav({ meetings }: { meetings: MeetingListItem[] }) {
  const pathname = usePathname();

  if (meetings.length === 0) {
    return (
      <p className="text-xs text-text-secondary px-3 py-2">
        No meetings yet — upload one to get started.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {meetings.map((meeting) => {
        const href = `/dashboard/meetings/${meeting.id}`;
        const isActive = pathname === href;
        return (
          <Link
            key={meeting.id}
            href={href}
            className={`block rounded-lg p-3 cursor-pointer active:scale-[0.98] transition-all ${
              isActive
                ? "bg-surface text-success border border-success/20"
                : "text-text-secondary hover:bg-surface/50"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium truncate">{meeting.title}</span>
            </div>
            <p className="text-xs text-text-secondary/60">
              {formatMeetingDate(meeting.createdAt)} • {formatDuration(meeting.duration)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
