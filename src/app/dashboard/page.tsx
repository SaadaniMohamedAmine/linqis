import Link from "next/link";
import { LayoutDashboard, Clock, CheckCircle2, TrendingUp, Upload, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getMeetings, getActionItems, getAnalytics, type MeetingListItem, type ActionItemWithMeeting, type AnalyticsData } from "@/lib/api";
import { formatMeetingDate, formatDuration } from "@/lib/utils";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const STAT_CARDS = (analytics: AnalyticsData | null, openActionItems: number) => [
  { label: "Meetings", value: analytics?.totalMeetings ?? 0, icon: LayoutDashboard },
  { label: "Hours analyzed", value: analytics?.totalHours ?? 0, icon: Clock },
  { label: "Action items open", value: openActionItems, icon: CheckCircle2 },
  { label: "Completion rate", value: `${analytics?.completionRate ?? 0}%`, icon: TrendingUp },
];

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0];

  // Every section degrades independently -- one failing call (e.g. analytics
  // hitting a plan limit) shouldn't blank the rest of the overview.
  const [meetings, actionItems, analytics] = await Promise.all([
    getMeetings().catch(() => [] as MeetingListItem[]),
    getActionItems().catch(() => [] as ActionItemWithMeeting[]),
    getAnalytics().catch(() => null as AnalyticsData | null),
  ]);

  const recentMeetings = meetings.slice(0, 5);
  const dueSoon = actionItems
    .filter((item) => item.status === "TODO")
    .sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })
    .slice(0, 5);
  const openActionItems = actionItems.filter((item) => item.status === "TODO").length;

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
              {greeting()}{firstName ? `, ${firstName}` : ""} 👋
            </h1>
            <p className="text-text-secondary mt-1">
              {meetings.length > 0
                ? `${meetings.length} meeting${meetings.length === 1 ? "" : "s"} tracked · ${openActionItems} action item${openActionItems === 1 ? "" : "s"} open`
                : "Upload your first meeting to get a transcript, summary, and action items."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/upload">
              <Button variant="primary" className="gap-2">
                <Upload size={16} />
                Upload meeting
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto p-8 flex flex-col gap-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up [animation-delay:150ms]">
          {STAT_CARDS(analytics, openActionItems).map(({ label, value, icon: Icon }) => (
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
              <h2 className="font-semibold text-text-primary">Recent meetings</h2>
              <Link href="/dashboard/meetings" className="text-xs text-success hover:underline">
                View all
              </Link>
            </div>
            {recentMeetings.length === 0 ? (
              <div className="p-10 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center text-success">
                  <Upload size={20} />
                </div>
                <p className="text-sm text-text-secondary max-w-xs">
                  No meetings yet. Upload a recording to get a transcript, executive summary, decisions, and action items.
                </p>
                <Link href="/dashboard/upload">
                  <Button variant="primary" size="sm">Upload your first meeting</Button>
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
                      {meeting.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">Due soon</h2>
              <Link href="/dashboard/action-items" className="text-xs text-success hover:underline">
                View all
              </Link>
            </div>
            {dueSoon.length === 0 ? (
              <div className="p-10 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center text-success">
                  <CheckCircle2 size={20} />
                </div>
                <p className="text-sm text-text-secondary">Nothing outstanding. You're all caught up.</p>
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
                          {item.deadline ? formatMeetingDate(item.deadline) : "No deadline"}
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
              <p className="font-medium text-text-primary">Upload a meeting</p>
              <p className="text-xs text-text-secondary">Get a transcript and summary in minutes.</p>
            </div>
            <Link href="/dashboard/upload">
              <Button variant="secondary" size="sm">Upload</Button>
            </Link>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-info-bg flex items-center justify-center text-info shrink-0">
              <MessageCircle size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-primary">Ask your meetings</p>
              <p className="text-xs text-text-secondary">Search across everything you've transcribed.</p>
            </div>
            <span className="text-xs text-text-muted">⌘K</span>
          </Card>
        </div>
      </div>
    </div>
  );
}
