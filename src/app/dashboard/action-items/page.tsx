"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ListChecks, Clock, CheckCircle2, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getActionItems, updateActionItemStatus, ApiError, type ActionItemWithMeeting } from "@/lib/api";

type Filter = "all" | "todo" | "done";

const PRIORITY_BADGE: Record<string, "danger" | "warning" | "neutral"> = {
  HIGH: "danger",
  MEDIUM: "warning",
  LOW: "neutral",
};

const FILTERS: Filter[] = ["all", "todo", "done"];

export default function ActionItemsPage() {
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
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load action items.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
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
    { label: "Total Tasks", value: stats.total, icon: ListChecks, tone: "text-text-primary" },
    { label: "Todo", value: stats.todo, icon: Clock, tone: "text-warning" },
    { label: "Done", value: stats.done, icon: CheckCircle2, tone: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-40%] right-[10%] w-[400px] h-[400px] bg-success/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 py-10 animate-fade-in-up">
          <h1 className="text-3xl font-semibold text-text-primary mb-1">Action Items</h1>
          <p className="text-text-secondary">Every task extracted from your meetings, in one place.</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto p-8 flex flex-col gap-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up [animation-delay:150ms]">
          {STAT_CARDS.map(({ label, value, icon: Icon, tone }) => (
            <Card key={label} className="p-5 relative overflow-hidden group hover:border-border-hover transition-colors">
              <div className="absolute right-[-20%] top-[-30%] w-32 h-32 bg-success/5 rounded-full blur-2xl group-hover:bg-success/10 transition-colors" />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-2">{label}</p>
                  <p className={`text-3xl font-semibold ${tone}`}>{value}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-success-bg flex items-center justify-center text-success shrink-0">
                  <Icon size={18} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-0 overflow-hidden animate-fade-in-up [animation-delay:300ms]">
          <div className="p-4 border-b border-border flex flex-wrap gap-4 justify-between items-center bg-surface">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search tasks..."
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
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center text-text-secondary">Loading action items...</div>
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
              <h2 className="relative text-xl font-semibold text-text-primary">No action items yet</h2>
              <p className="relative text-sm text-text-secondary max-w-sm">
                Once a meeting is processed, every decision and task the AI finds shows up here automatically.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-surface-low flex items-center justify-center text-text-secondary">
                <SearchX size={24} />
              </div>
              <p className="text-sm text-text-secondary">No action items match this view.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="text-sm text-success hover:underline cursor-pointer"
              >
                Clear search & filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 px-6 py-4 hover:bg-background/50 transition-colors ${
                    item.status === "DONE" ? "bg-surface-low/50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.status === "DONE"}
                    onChange={() => toggleStatus(item.id, item.status)}
                    className="rounded bg-transparent border-border text-success focus:ring-success cursor-pointer shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium text-text-primary truncate ${item.status === "DONE" ? "line-through opacity-60" : ""}`}>
                      {item.task}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5">
                      <span>{item.owner || "Unassigned"}</span>
                      <Link href={`/dashboard/meetings/${item.meeting.id}`} className="text-success hover:underline">
                        {item.meeting.title}
                      </Link>
                      {item.deadline && <span>{new Date(item.deadline).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <Badge variant={PRIORITY_BADGE[item.priority] || "neutral"} className="shrink-0">
                    {item.priority}
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
