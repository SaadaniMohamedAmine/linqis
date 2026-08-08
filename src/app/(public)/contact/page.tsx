"use client";

import { useState } from "react";
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

  if (status === "sent") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2">Message sent</h1>
          <p className="text-text-secondary">We'll get back to you within one business day.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-[480px] bg-surface border border-border rounded-xl p-8 flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-text-primary mb-2">Talk to sales</h1>
        <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input type="email" placeholder="Work email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input placeholder="Company (optional)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <textarea
          placeholder="What are you looking to solve?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          rows={4}
          className="bg-background border border-border rounded-lg py-3 px-4 text-sm text-text-primary outline-none resize-none"
        />
        {status === "error" && <p className="text-sm text-danger">Something went wrong. Try again.</p>}
        <Button variant="primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send message"}
        </Button>
      </form>
    </div>
  );
}
