"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ListChecks, Clock, CheckCircle2, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getActionItems, updateActionItemStatus, ApiError, type ActionItemWithMeeting } from "@/lib/api";
import { useDictionary } from "@/lib/i18n/locale-context";
import { actionItemsDictionary } from "@/lib/i18n/dictionaries/action-items";

type Filter = "all" | "todo" | "done";

const PRIORITY_BADGE: Record<string, "danger" | "warning" | "neutral"> = {
  HIGH: "danger",
  MEDIUM: "warning",
  LOW: "neutral",
};

const PRIORITY_LABEL_KEY: Record<string, "high" | "medium" | "low"> = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

const FILTERS: Filter[] = ["all", "todo", "done"];

export default function ActionItemsPage() {
  const t = useDictionary(actionItemsDictionary);
  const [items, setItems] = useState<ActionItemWithMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    getActionItems()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : t.loadFailed);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleStatus = async (id: string, current: "TODO" | "DONE") => {
    const next = current === "TODO" ? "DONE" : "TODO";
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: next } : i)));
    try {
      await updateActionItemStatus(id, next);
    } catch {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: current } : i)));
    }
  };

  const stats = useMemo(
    () => ({
      total: items.length,
      todo: items.filter((i) => i.status === "TODO").length,
      done: items.filter((i) => i.status === "DONE").length,
    }),
    [items]
  );

  const filtered = items.filter((item) => {
    if (filter === "todo" && item.status !== "TODO") return false;
    if (filter === "done" && item.status !== "DONE") return false;
    if (search && !item.task.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const STAT_CARDS = [
    { label: t.statLabels.total, value: stats.total, icon: ListChecks, tone: "text-text-primary" },
    { label: t.statLabels.todo, value: stats.todo, icon: Clock, tone: "text-warning" },
    { label: t.statLabels.done, value: stats.done, icon: CheckCircle2, tone: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-40%] right-[10%] w-[400px] h-[400px] bg-success/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-fade-in-up">
          <h1 className="text-3xl font-semibold text-text-primary mb-1">{t.title}</h1>
          <p className="text-text-secondary">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto p-4 sm:p-8 flex flex-col gap-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 animate-fade-in-up [animation-delay:150ms]">
          {STAT_CARDS.map(({ label, value, icon: Icon, tone }) => (
            <Card key={label} className="p-3 sm:p-5 relative overflow-hidden group hover:border-border-hover transition-colors">
              <div className="absolute right-[-20%] top-[-30%] w-32 h-32 bg-success/5 rounded-full blur-2xl group-hover:bg-success/10 transition-colors" />
              <div className="relative z-10 flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-text-secondary mb-1 sm:mb-2 truncate">{label}</p>
                  <p className={`text-xl sm:text-3xl font-semibold ${tone}`}>{value}</p>
                </div>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-success-bg flex items-center justify-center text-success shrink-0">
                  <Icon size={16} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-0 overflow-hidden animate-fade-in-up [animation-delay:300ms]">
          <div className="p-4 border-b border-border flex flex-wrap gap-4 justify-between items-center bg-surface">
            <div className="flex items-center gap-4">
              <Input
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[260px]"
              />
              <div className="flex gap-1">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors cursor-pointer ${
                      filter === f ? "bg-success/10 text-success" : "text-text-secondary hover:bg-surface-low"
                    }`}
                  >
                    {t.filters[f]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center text-text-secondary">{t.loading}</div>
          ) : error ? (
            <div className="p-16 text-center text-danger">{error}</div>
          ) : items.length === 0 ? (
            <div className="relative overflow-hidden p-20 flex flex-col items-center text-center gap-4 bg-gradient-to-br from-success/5 via-transparent to-transparent border-2 border-dashed border-border m-4 rounded-xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-success/10 rounded-full blur-3xl animate-pulse" />
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-success-bg flex items-center justify-center text-success">
                  <ListChecks size={32} />
                </div>
              </div>
              <h2 className="relative text-xl font-semibold text-text-primary">{t.emptyTitle}</h2>
              <p className="relative text-sm text-text-secondary max-w-sm">
                {t.emptyDesc}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-surface-low flex items-center justify-center text-text-secondary">
                <SearchX size={24} />
              </div>
              <p className="text-sm text-text-secondary">{t.noMatch}</p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="text-sm text-success hover:underline cursor-pointer"
              >
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-background/50 transition-colors ${
                    item.status === "DONE" ? "bg-surface-low/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.status === "DONE"}
                      onChange={() => toggleStatus(item.id, item.status)}
                      className="mt-1 rounded bg-transparent border-border text-success focus:ring-success cursor-pointer shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium text-text-primary truncate ${item.status === "DONE" ? "line-through opacity-60" : ""}`}>
                        {item.task}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5 flex-wrap">
                        <span>{item.owner || t.unassigned}</span>
                        <Link href={`/dashboard/meetings/${item.meeting.id}`} className="text-success hover:underline">
                          {item.meeting.title}
                        </Link>
                        {item.deadline && <span>{new Date(item.deadline).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                  <Badge variant={PRIORITY_BADGE[item.priority] || "neutral"} className="shrink-0 ml-8 sm:ml-0 self-start sm:self-auto">
                    {t.priorityLabel[PRIORITY_LABEL_KEY[item.priority] || "low"]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
