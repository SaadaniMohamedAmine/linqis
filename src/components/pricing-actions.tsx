"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PricingActionsProps {
  isLoggedIn: boolean;
  currentPlan: "FREE" | "PRO" | null;
}

export function FreeCardAction({ isLoggedIn, currentPlan }: PricingActionsProps) {
  if (isLoggedIn && currentPlan === "FREE") {
    return <Button variant="secondary" disabled className="w-full">Current plan</Button>;
  }
  return (
    <Link href="/sign-up">
      <Button variant="secondary" className="w-full">Get Started</Button>
    </Link>
  );
}

export function ProCardAction({ isLoggedIn, currentPlan }: PricingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoggedIn && currentPlan === "PRO") {
    return <Button variant="secondary" disabled className="w-full font-bold">Current plan</Button>;
  }

  const handleUpgrade = async () => {
    if (!isLoggedIn) {
      router.push("/sign-in?callbackUrl=/pricing");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.url) {
        setError(body.error || "Could not start checkout.");
        setLoading(false);
        return;
      }
      window.location.href = body.url;
    } catch {
      setError("Could not start checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="primary" className="w-full font-bold" onClick={handleUpgrade} disabled={loading}>
        {loading ? "Redirecting..." : "Upgrade to Pro"}
      </Button>
      {error && <p className="text-xs text-danger text-center">{error}</p>}
    </div>
  );
}
