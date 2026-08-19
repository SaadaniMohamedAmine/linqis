"use client";

import Link from "next/link";
import { LayoutDashboard, Clock, CheckCircle2, TrendingUp, Upload, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MeetingListItem, ActionItemWithMeeting, AnalyticsData } from "@/lib/api";
import { formatMeetingDate, formatDuration } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-context";
import { dashboardOverviewDictionary, type DashboardOverviewDictionary } from "@/lib/i18n/dictionaries/dashboard-overview";

function greeting(t: DashboardOverviewDictionary): string {
  const hour = new Date().getHours();
  if (hour < 12) return t.greetingMorning;
  if (hour < 18) return t.greetingAfternoon;
  return t.greetingEvening;
}

interface DashboardOverviewProps {
  firstName?: string;
  meetingsCount: number;
  openActionItems: number;
  analytics: AnalyticsData | null;
  recentMeetings: MeetingListItem[];
  dueSoon: ActionItemWithMeeting[];
}

export function DashboardOverview({
  firstName,
  meetingsCount,
  openActionItems,
  analytics,
  recentMeetings,
  dueSoon,
}: DashboardOverviewProps) {
  const t = useDictionary(dashboardOverviewDictionary);

  const statCards = [
    { label: t.statLabels.meetings, value: analytics?.totalMeetings ?? 0, icon: LayoutDashboard },
    { label: t.statLabels.hoursAnalyzed, value: analytics?.totalHours ?? 0, icon: Clock },
    { label: t.statLabels.actionItemsOpen, value: openActionItems, icon: CheckCircle2 },
    { label: t.statLabels.completionRate, value: `${analytics?.completionRate ?? 0}%`, icon: TrendingUp },
  ];

  const statusLabel = (status: MeetingListItem["status"]) =>
    status === "DONE" ? t.statusLabel.done : status === "FAILED" ? t.statusLabel.failed : t.statusLabel.processing;

  return (
    <div className="bg-background text-text-primary">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-success/10 rounded-full blur-[120px]" />
          <div className="absolute top-[-30%] right-[-5%] w-[400px] h-[400px] bg-info/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 py-10 flex flex-wrap items-center justify-between gap-6 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">
              {greeting(t)}{firstName ? `, ${firstName}` : ""} 👋
            </h1>
            <p className="text-text-secondary mt-1">
              {meetingsCount > 0 ? t.meetingsTracked(meetingsCount, openActionItems) : t.noMeetingsSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/upload">
              <Button variant="primary" className="gap-2">
                <Upload size={16} />
                {t.uploadMeetingButton}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto p-8 flex flex-col gap-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up [animation-delay:150ms]">
          {statCards.map(({ label, value, icon: Icon }) => (
            <Card
              key={label}
              className="p-5 relative overflow-hidden group hover:border-border-hover transition-colors"
            >
              <div className="absolute right-[-20%] top-[-30%] w-32 h-32 bg-success/5 rounded-full blur-2xl group-hover:bg-success/10 transition-colors" />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-xs text-text-secondary mb-2">{label}</p>
                  <p className="text-2xl font-semibold text-text-primary">{value}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-success-bg flex items-center justify-center text-success shrink-0">
                  <Icon size={18} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent meetings + Due soon */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up [animation-delay:300ms]">
          <Card className="lg:col-span-2 p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">{t.recentMeetingsTitle}</h2>
              <Link href="/dashboard/meetings" className="text-xs text-success hover:underline">
                {t.viewAll}
              </Link>
            </div>
            {recentMeetings.length === 0 ? (
              <div className="p-10 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center text-success">
                  <Upload size={20} />
                </div>
                <p className="text-sm text-text-secondary max-w-xs">
                  {t.noMeetingsText}
                </p>
                <Link href="/dashboard/upload">
                  <Button variant="primary" size="sm">{t.uploadFirstMeeting}</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentMeetings.map((meeting) => (
                  <Link
                    key={meeting.id}
                    href={`/dashboard/meetings/${meeting.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-background/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-text-primary truncate">{meeting.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {formatMeetingDate(meeting.createdAt)} · {formatDuration(meeting.duration)}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest shrink-0 px-2 py-1 rounded-full ${
                        meeting.status === "DONE"
                          ? "bg-success-bg text-success"
                          : meeting.status === "FAILED"
                            ? "bg-danger-bg text-danger"
                            : "bg-warning-bg text-warning"
                      }`}
                    >
                      {statusLabel(meeting.status)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">{t.dueSoonTitle}</h2>
              <Link href="/dashboard/action-items" className="text-xs text-success hover:underline">
                {t.viewAll}
              </Link>
            </div>
            {dueSoon.length === 0 ? (
              <div className="p-10 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center text-success">
                  <CheckCircle2 size={20} />
                </div>
                <p className="text-sm text-text-secondary">{t.allCaughtUp}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {dueSoon.map((item) => {
                  const overdue = item.deadline ? new Date(item.deadline) < new Date() : false;
                  return (
                    <Link
                      key={item.id}
                      href={`/dashboard/meetings/${item.meeting.id}`}
                      className="flex items-start gap-3 px-6 py-4 hover:bg-background/50 transition-colors"
                    >
                      {overdue ? (
                        <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 size={16} className="text-text-muted shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-text-primary truncate">{item.task}</p>
                        <p className={`text-xs mt-0.5 ${overdue ? "text-danger" : "text-text-secondary"}`}>
                          {item.deadline ? formatMeetingDate(item.deadline) : t.noDeadline}
                          {item.owner ? ` · ${item.owner}` : ""}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up [animation-delay:450ms]">
          <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-success/10 to-transparent border-success/20">
            <div className="w-11 h-11 rounded-lg bg-success-bg flex items-center justify-center text-success shrink-0">
              <Upload size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-primary">{t.quickUploadTitle}</p>
              <p className="text-xs text-text-secondary">{t.quickUploadDesc}</p>
            </div>
            <Link href="/dashboard/upload">
              <Button variant="secondary" size="sm">{t.uploadButton}</Button>
            </Link>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-info-bg flex items-center justify-center text-info shrink-0">
              <MessageCircle size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-primary">{t.askTitle}</p>
              <p className="text-xs text-text-secondary">{t.askDesc}</p>
            </div>
            <span className="text-xs text-text-muted">⌘K</span>
          </Card>
        </div>
      </div>
    </div>
  );
}
