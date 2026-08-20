"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useDictionary } from "@/lib/i18n/locale-context";
import { resetPasswordDictionary } from "@/lib/i18n/dictionaries/reset-password";

function ResetPasswordForm() {
  const t = useDictionary(resetPasswordDictionary);
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError(t.invalidOrExpired);
      return;
    }
    if (password.length < 8) {
      setError(t.passwordTooShort);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.passwordsDontMatch);
      return;
    }

    setIsLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });
    setIsLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || t.invalidOrExpired);
      return;
    }

    router.push("/sign-in?reset=success");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center relative overflow-hidden py-12">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-success/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-warning/5 rounded-full blur-[160px]" />
      </div>

      <main className="z-10 w-full max-w-[420px] px-4">
        {/* Auth Card */}
        <div className="bg-surface/80 backdrop-blur-md rounded-xl p-6 flex flex-col gap-6 shadow-lg border border-border">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">{t.title}</h2>
            <p className="text-sm text-text-secondary">{t.subtitle}</p>
          </div>

          {!token ? (
            <p className="text-xs text-danger bg-danger/10 p-2 rounded">
              {t.noTokenPrefix}{" "}
              <Link href="/forgot-password" className="underline">
                {t.forgotPasswordLink}
              </Link>
              {t.noTokenSuffix}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <p className="text-xs text-danger bg-danger/10 p-2 rounded">{error}</p>}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary px-1">{t.newPasswordLabel}</label>
                <PasswordInput
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  showLabel={t.showPassword}
                  hideLabel={t.hidePassword}
                />
                <div className="flex gap-1 mt-2 px-1">
                  <div className={`h-1 flex-1 rounded ${password.length >= 8 ? 'bg-success' : 'bg-border'}`} />
                  <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(password) ? 'bg-success' : 'bg-border'}`} />
                  <div className={`h-1 flex-1 rounded ${/[0-9]/.test(password) ? 'bg-success' : 'bg-border'}`} />
                  <div className={`h-1 flex-1 rounded ${/[^A-Za-z0-9]/.test(password) ? 'bg-success' : 'bg-border'}`} />
                </div>
                <p className="text-xs text-text-secondary mt-1 ml-1">{t.passwordHint}</p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary px-1">{t.confirmPasswordLabel}</label>
                <PasswordInput
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  showLabel={t.showPassword}
                  hideLabel={t.hidePassword}
                />
              </div>
              <Button variant="primary" className="w-full h-12 mt-2" type="submit" disabled={isLoading}>
                {isLoading ? t.updating : t.updateButton}
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-secondary">
            {t.rememberedPassword}{" "}
            <Link href="/sign-in" className="text-success font-medium hover:underline ml-1">
              {t.signInLink}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

// useSearchParams needs a Suspense boundary to keep the page prerenderable.
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
