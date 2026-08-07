"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Always the generic success message, whether or not the account exists --
  // the API response is identical either way, so the UI can't (and shouldn't)
  // distinguish between them.
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-success/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-warning/5 rounded-full blur-[160px]" />
      </div>

      <main className="z-10 w-full max-w-[420px] px-4">
        {/* Auth Card */}
        <div className="bg-surface/80 backdrop-blur-md rounded-xl p-6 flex flex-col gap-6 shadow-lg border border-border">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Reset your password</h2>
            <p className="text-sm text-text-secondary">
              Enter the email address on your account and we'll send you a link to reset your password.
            </p>
          </div>

          {submitted ? (
            <p className="text-sm text-text-secondary bg-success/10 border border-success/20 rounded p-3">
              If that email exists, we've sent a reset link. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary px-1">Email address</label>
                <Input
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button variant="primary" className="w-full h-12 mt-2" type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-secondary">
            Remembered your password?{" "}
            <Link href="/sign-in" className="text-success font-medium hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
