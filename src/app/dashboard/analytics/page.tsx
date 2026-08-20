"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Video, Clock, Timer, CheckCircle2, Sparkles, TrendingUp, Smile, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAnalytics, ApiError, type AnalyticsData } from "@/lib/api";
import { useDictionary } from "@/lib/i18n/locale-context";
import { analyticsDictionary, type AnalyticsDictionary } from "@/lib/i18n/dictionaries/analytics";

function kpiCards(data: AnalyticsData, t: AnalyticsDictionary) {
  return [
    { label: t.kpiLabels.totalMeetings, value: data.totalMeetings, icon: Video },
    { label: t.kpiLabels.hoursAnalyzed, value: data.totalHours, icon: Clock },
    { label: t.kpiLabels.avgDuration, value: `${data.avgDurationMinutes} min`, icon: Timer },
    { label: t.kpiLabels.actionItemsDone, value: `${data.completionRate}%`, icon: CheckCircle2 },
  ];
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-40%] right-[15%] w-[450px] h-[450px] bg-success/10 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-[1440px] mx-auto px-8 py-10 animate-fade-in-up">
        <h1 className="text-3xl font-semibold text-text-primary mb-1">{title}</h1>
        <p className="text-text-secondary">{subtitle}</p>
      </div>
    </div>
  );
}

// Shown in place of the trend chart / mood / top owners sections -- the
// actual Pro-gated content -- instead of blocking the whole page like before.
function UpgradePrompt() {
  const t = useDictionary(analyticsDictionary);
  return (
    <Card className="relative overflow-hidden p-16 flex flex-col items-center text-center gap-4 bg-gradient-to-br from-success/10 via-transparent to-transparent border-success/20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-success/10 rounded-full blur-3xl animate-pulse" />
      <div className="relative w-16 h-16 rounded-full bg-success-bg flex items-center justify-center text-success">
        <Sparkles size={28} />
      </div>
      <h2 className="relative text-xl font-semibold text-text-primary">{t.upgradePromptTitle}</h2>
      <p className="relative text-sm text-text-secondary max-w-sm">
        {t.upgradePromptDesc}
      </p>
      <Link href="/pricing" className="relative">
        <Button variant="primary" className="gap-2 mt-2">
          <Sparkles size={16} />
          {t.upgradeToPro}
        </Button>
      </Link>
    </Card>
  );
}

function moodLabel(mood: string, t: AnalyticsDictionary): string {
  if (mood === "POSITIVE") return t.moodLabel.positive;
  if (mood === "TENSE") return t.moodLabel.tense;
  if (mood === "NEUTRAL") return t.moodLabel.neutral;
  return mood;
}

export default function AnalyticsPage() {
  const t = useDictionary(analyticsDictionary);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : t.loadFailed);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-text-primary">
        <Header title={t.title} subtitle={t.subtitle} />
        <div className="max-w-[1440px] mx-auto p-8">
          <Card className="p-16 text-center text-danger animate-fade-in-up [animation-delay:150ms]">{error}</Card>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-text-primary">
        <Header title={t.title} subtitle={t.subtitle} />
        <div className="max-w-[1440px] mx-auto p-8 text-text-secondary">{t.loading}</div>
      </div>
    );
  }

  const maxMood = Math.max(1, ...data.moodDistribution.map((m) => m.count));
  const maxOwner = Math.max(1, ...data.topOwners.map((o) => o.count));

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header title={t.title} subtitle={t.subtitle} />

      <div className="max-w-[1440px] mx-auto p-8 flex flex-col gap-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up [animation-delay:150ms]">
          {kpiCards(data, t).map(({ label, value, icon: Icon }) => (
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

        {data.analyticsEnabled ? (
          <>
            {/* Meetings per week */}
            <Card className="p-6 animate-fade-in-up [animation-delay:300ms]">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-success" />
                <h2 className="text-sm font-semibold text-text-primary">{t.meetingsPerWeek}</h2>
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
                  <h2 className="text-sm font-semibold text-text-primary">{t.moodDistribution}</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {data.moodDistribution.map((m) => (
                    <div key={m.mood} className="flex flex-col gap-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">{moodLabel(m.mood, t)}</span>
                        <span className="text-text-primary font-medium">{m.count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-success rounded-full transition-all" style={{ width: `${(m.count / maxMood) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                  {data.moodDistribution.length === 0 && <p className="text-sm text-text-muted">{t.notEnoughData}</p>}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={16} className="text-success" />
                  <h2 className="text-sm font-semibold text-text-primary">{t.topOwners}</h2>
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
                  {data.topOwners.length === 0 && <p className="text-sm text-text-muted">{t.notEnoughData}</p>}
                </div>
              </Card>
            </div>
          </>
        ) : (
          <UpgradePrompt />
        )}
      </div>
    </div>
  );
}
