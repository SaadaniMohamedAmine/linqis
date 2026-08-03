"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <main className="p-6">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5">
              <span className="font-medium text-text-secondary">Total Tasks</span>
              <h3 className="text-3xl font-semibold mt-2">{stats.total}</h3>
            </Card>
            <Card className="p-5">
              <span className="font-medium text-text-secondary">Todo</span>
              <h3 className="text-3xl font-semibold mt-2 text-warning">{stats.todo}</h3>
            </Card>
            <Card className="p-5">
              <span className="font-medium text-text-secondary">Done</span>
              <h3 className="text-3xl font-semibold mt-2 text-success">{stats.done}</h3>
            </Card>
          </div>

          <Card className="overflow-hidden relative min-h-[400px]">
            <div className="p-4 border-b border-border flex flex-wrap gap-4 justify-between items-center bg-surface">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[260px]"
                />
                <div className="flex gap-1">
                  {(["all", "todo", "done"] as Filter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${
                        filter === f ? "bg-success/10 text-success" : "text-text-secondary hover:bg-surface-low"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-text-secondary">Loading action items...</div>
              ) : error ? (
                <div className="p-12 text-center text-danger">{error}</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-text-secondary">No action items match this view.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-surface">
                      <th className="px-4 py-4 w-12"></th>
                      <th className="px-4 py-4 font-medium text-text-secondary">Task</th>
                      <th className="px-4 py-4 font-medium text-text-secondary">Owner</th>
                      <th className="px-4 py-4 font-medium text-text-secondary">Meeting</th>
                      <th className="px-4 py-4 font-medium text-text-secondary">Deadline</th>
                      <th className="px-4 py-4 font-medium text-text-secondary">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((item) => (
                      <tr key={item.id} className={`hover:bg-surface transition-colors ${item.status === "DONE" ? "bg-surface-low" : ""}`}>
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={item.status === "DONE"}
                            onChange={() => toggleStatus(item.id, item.status)}
                            className="rounded bg-transparent border-border text-success focus:ring-success cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <span className={`font-medium text-text-primary ${item.status === "DONE" ? "line-through opacity-60" : ""}`}>
                            {item.task}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-text-secondary">{item.owner || "Unassigned"}</td>
                        <td className="px-4 py-4">
                          <Link href={`/dashboard/meetings/${item.meeting.id}`} className="text-sm text-success hover:underline">
                            {item.meeting.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-sm text-text-primary">
                          {item.deadline ? new Date(item.deadline).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={PRIORITY_BADGE[item.priority] || "neutral"}>{item.priority}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
