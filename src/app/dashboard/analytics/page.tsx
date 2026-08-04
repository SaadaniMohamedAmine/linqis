"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { getAnalytics, ApiError, type AnalyticsData } from "@/lib/api";

const KPI_CARDS = (data: AnalyticsData) => [
  { label: "Total meetings", value: data.totalMeetings },
  { label: "Hours analyzed", value: data.totalHours },
  { label: "Avg. duration", value: `${data.avgDurationMinutes} min` },
  { label: "Action items done", value: `${data.completionRate}%` },
];

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
      <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-text-secondary">{error}</p>
        {isPlanLimit && (
          <Link href="/pricing">
            <Button variant="primary">Upgrade to Pro</Button>
          </Link>
        )}
      </div>
    );
  }

  if (!data) return <div className="p-8 text-text-secondary">Loading analytics...</div>;

  return (
    <div className="p-8 flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-text-primary">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI_CARDS(data).map((kpi) => (
          <div key={kpi.label} className="bg-surface border border-border rounded-xl p-5">
            <p className="text-xs text-text-secondary mb-1">{kpi.label}</p>
            <p className="text-2xl font-semibold text-text-primary">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Meetings per week</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data.meetingsPerWeek}>
            <CartesianGrid stroke="#1F1F1F" />
            <XAxis dataKey="week" stroke="#A1A1AA" fontSize={12} />
            <YAxis stroke="#A1A1AA" fontSize={12} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#141414", border: "1px solid #1F1F1F" }} />
            <Line type="monotone" dataKey="count" stroke="#22C55E" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Mood distribution</h2>
          <div className="flex flex-col gap-2">
            {data.moodDistribution.map((m) => (
              <div key={m.mood} className="flex justify-between text-sm">
                <span className="text-text-secondary">{m.mood}</span>
                <span className="text-text-primary font-medium">{m.count}</span>
              </div>
            ))}
            {data.moodDistribution.length === 0 && <p className="text-sm text-text-muted">Not enough data yet.</p>}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Top action item owners</h2>
          <div className="flex flex-col gap-2">
            {data.topOwners.map((o) => (
              <div key={o.owner} className="flex justify-between text-sm">
                <span className="text-text-secondary">{o.owner}</span>
                <span className="text-text-primary font-medium">{o.count}</span>
              </div>
            ))}
            {data.topOwners.length === 0 && <p className="text-sm text-text-muted">Not enough data yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
