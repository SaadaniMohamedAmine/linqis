"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, ChevronDown, X } from "lucide-react";
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

const CLOSE_ANIMATION_MS = 150;

export function AskWidget() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CLOSE_ANIMATION_MS);
  };

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
    <>
      {(open || closing) && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-[380px] h-[500px] max-h-[70vh] bg-surface border border-border rounded-xl shadow-lg flex flex-col overflow-hidden ${
            closing ? "animate-widget-out" : "animate-widget-in"
          }`}
        >
          <div className="px-4 pt-4 pb-3 border-b border-border flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Ask your meetings</h2>
              <p className="text-xs text-text-secondary">Ask a question across everything Linqis has transcribed for you.</p>
            </div>
            <button
              onClick={close}
              aria-label="Close"
              className="text-text-secondary hover:text-text-primary cursor-pointer shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <p className="text-sm text-text-secondary">
                Try something like &ldquo;What did we decide about the Q3 budget?&rdquo;
              </p>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <Card
                  className={`p-3 max-w-[85%] ${
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
                    <div className="mt-2 pt-2 border-t border-border flex flex-col gap-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Sources</p>
                      {m.sources.map((s) => (
                        <Link
                          key={s.id}
                          href={`/dashboard/meetings/${s.id}`}
                          onClick={close}
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
                <Card className="p-3">
                  <p className="text-sm text-text-secondary">Thinking...</p>
                </Card>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-border flex gap-2">
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
      )}

      {/* Launcher stays visible in the same spot and flips to a collapse
          affordance instead of vanishing behind the panel when it opens. */}
      <button
        onClick={() => (open ? close() : setOpen(true))}
        aria-label={open ? "Close Ask your meetings" : "Ask your meetings"}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-success text-background shadow-lg flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"
      >
        {open ? <ChevronDown size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
