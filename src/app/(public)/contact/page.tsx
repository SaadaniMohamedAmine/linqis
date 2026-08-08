"use client";

import { useState } from "react";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden p-4">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-success/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-info/5 rounded-full blur-[160px]" />
      </div>

      <main className="z-10 w-full max-w-[480px]">
        {status === "sent" ? (
          <div className="bg-surface/80 backdrop-blur-md rounded-xl p-10 flex flex-col items-center text-center gap-3 shadow-lg border border-border">
            <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center text-success">
              <CheckCircle2 size={22} />
            </div>
            <h1 className="text-xl font-semibold text-text-primary">Message sent</h1>
            <p className="text-sm text-text-secondary">We&apos;ll get back to you within one business day.</p>
          </div>
        ) : (
          <div className="bg-surface/80 backdrop-blur-md rounded-xl p-6 flex flex-col gap-6 shadow-lg border border-border">
            <div className="flex flex-col gap-1">
              <div className="w-10 h-10 rounded-lg bg-success-bg flex items-center justify-center text-success mb-2">
                <MessageCircle size={18} />
              </div>
              <h1 className="text-lg font-semibold text-text-primary">Get in touch</h1>
              <p className="text-sm text-text-secondary">
                Questions about your workspace, billing, or an integration? Tell us what&apos;s going on — we usually reply within one business day.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary px-1">Full name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary px-1">Work email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary px-1">Company (optional)</label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary px-1">What are you looking to solve?</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  className="bg-background border border-border rounded-lg py-3 px-4 text-sm text-text-primary outline-none resize-none"
                />
              </div>
              {status === "error" && <p className="text-xs text-danger bg-danger/10 p-2 rounded">Something went wrong. Try again.</p>}
              <Button variant="primary" className="w-full h-12 mt-2" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send message"}
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
