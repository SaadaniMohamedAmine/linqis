"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Video, Clock, Timer, CheckCircle2, Sparkles, TrendingUp, Smile, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAnalytics, ApiError, type AnalyticsData } from "@/lib/api";

const KPI_CARDS = (data: AnalyticsData) => [
  { label: "Total meetings", value: data.totalMeetings, icon: Video },
  { label: "Hours analyzed", value: data.totalHours, icon: Clock },
  { label: "Avg. duration", value: `${data.avgDurationMinutes} min`, icon: Timer },
  { label: "Action items done", value: `${data.completionRate}%`, icon: CheckCircle2 },
];

function Header({ subtitle }: { subtitle: string }) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-40%] right-[15%] w-[450px] h-[450px] bg-success/10 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-[1440px] mx-auto px-8 py-10 animate-fade-in-up">
        <h1 className="text-3xl font-semibold text-text-primary mb-1">Analytics</h1>
        <p className="text-text-secondary">{subtitle}</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlanLimit, setIsPlanLimit] = useState(false);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Failed to load analytics.");
        setIsPlanLimit(err instanceof ApiError && err.status === 402);
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-text-primary">
        <Header subtitle="Track trends across every meeting your team runs." />
        <div className="max-w-[1440px] mx-auto p-8">
          {isPlanLimit ? (
            <Card className="relative overflow-hidden p-16 flex flex-col items-center text-center gap-4 bg-gradient-to-br from-success/10 via-transparent to-transparent border-success/20 animate-fade-in-up [animation-delay:150ms]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-success/10 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-success-bg flex items-center justify-center text-success">
                <Sparkles size={28} />
              </div>
              <h2 className="relative text-xl font-semibold text-text-primary">Analytics is a Pro feature</h2>
              <p className="relative text-sm text-text-secondary max-w-sm">
                Upgrade to see meeting trends, mood insights, and team performance at a glance.
              </p>
              <Link href="/pricing" className="relative">
                <Button variant="primary" className="gap-2 mt-2">
                  <Sparkles size={16} />
                  Upgrade to Pro
                </Button>
              </Link>
            </Card>
          ) : (
            <Card className="p-16 text-center text-danger animate-fade-in-up [animation-delay:150ms]">{error}</Card>
          )}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-text-primary">
        <Header subtitle="Track trends across every meeting your team runs." />
        <div className="max-w-[1440px] mx-auto p-8 text-text-secondary">Loading analytics...</div>
      </div>
    );
  }

  const maxMood = Math.max(1, ...data.moodDistribution.map((m) => m.count));
  const maxOwner = Math.max(1, ...data.topOwners.map((o) => o.count));

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header subtitle="Track trends across every meeting your team runs." />

      <div className="max-w-[1440px] mx-auto p-8 flex flex-col gap-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up [animation-delay:150ms]">
          {KPI_CARDS(data).map(({ label, value, icon: Icon }) => (
            <Card key={label} className="p-5 relative overflow-hidden group hover:border-border-hover transition-colors">
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

        {/* Meetings per week */}
        <Card className="p-6 animate-fade-in-up [animation-delay:300ms]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-success" />
            <h2 className="text-sm font-semibold text-text-primary">Meetings per week</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.meetingsPerWeek}>
              <CartesianGrid stroke="#1F1F1F" />
              <XAxis dataKey="week" stroke="#A1A1AA" fontSize={12} />
              <YAxis stroke="#A1A1AA" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#141414", border: "1px solid #1F1F1F", borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" stroke="#22C55E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Mood + Top owners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up [animation-delay:450ms]">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Smile size={16} className="text-success" />
              <h2 className="text-sm font-semibold text-text-primary">Mood distribution</h2>
            </div>
            <div className="flex flex-col gap-3">
              {data.moodDistribution.map((m) => (
                <div key={m.mood} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{m.mood}</span>
                    <span className="text-text-primary font-medium">{m.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full transition-all" style={{ width: `${(m.count / maxMood) * 100}%` }} />
                  </div>
                </div>
              ))}
              {data.moodDistribution.length === 0 && <p className="text-sm text-text-muted">Not enough data yet.</p>}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-success" />
              <h2 className="text-sm font-semibold text-text-primary">Top action item owners</h2>
            </div>
            <div className="flex flex-col gap-3">
              {data.topOwners.map((o) => (
                <div key={o.owner} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{o.owner}</span>
                    <span className="text-text-primary font-medium">{o.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full transition-all" style={{ width: `${(o.count / maxOwner) * 100}%` }} />
                  </div>
                </div>
              ))}
              {data.topOwners.length === 0 && <p className="text-sm text-text-muted">Not enough data yet.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
