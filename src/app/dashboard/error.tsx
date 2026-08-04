"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-12 text-center">
      <h2 className="text-xl font-semibold text-text-primary">Something went wrong</h2>
      <p className="text-text-secondary max-w-md">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <Button variant="primary" onClick={reset}>Try again</Button>
    </div>
  );
}
