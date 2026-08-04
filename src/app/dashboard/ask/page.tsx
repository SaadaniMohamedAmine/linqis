"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { askMeetings, ApiError } from "@/lib/api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: { id: string; title: string }[];
  isError?: boolean;
  isPlanLimit?: boolean;
}

export default function AskPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setQuestion("");
    setLoading(true);

    try {
      const { answer, sources } = await askMeetings(q);
      setMessages((prev) => [...prev, { role: "assistant", content: answer, sources }]);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong answering that.";
      const isPlanLimit = err instanceof ApiError && err.status === 402;
      setMessages((prev) => [...prev, { role: "assistant", content: message, isError: true, isPlanLimit }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-4 border-b border-border">
        <h1 className="text-lg font-semibold text-text-primary">Ask your meetings</h1>
        <p className="text-xs text-text-secondary">Ask a question across everything Linqis has transcribed for you.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messages.length === 0 && (
          <p className="text-sm text-text-secondary">
            Try something like &ldquo;What did we decide about the Q3 budget?&rdquo;
          </p>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card
              className={`p-4 max-w-[70%] ${
                m.role === "user" ? "bg-success/10 border-success/30" : m.isError ? "border-danger/30" : ""
              }`}
            >
              <p className={`text-sm whitespace-pre-wrap ${m.isError ? "text-danger" : "text-text-primary"}`}>
                {m.content}
              </p>
              {m.isPlanLimit && (
                <Link href="/pricing" className="text-xs text-success hover:underline">Upgrade to Pro →</Link>
              )}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Sources</p>
                  {m.sources.map((s) => (
                    <Link
                      key={s.id}
                      href={`/dashboard/meetings/${s.id}`}
                      className="text-xs text-success hover:underline"
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <Card className="p-4">
              <p className="text-sm text-text-secondary">Thinking...</p>
            </Card>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-6 border-t border-border flex gap-3">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your meetings..."
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" variant="primary" disabled={loading || !question.trim()}>
          Ask
        </Button>
      </form>
    </div>
  );
}
