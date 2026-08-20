"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/locale-context";
import { errorBoundaryDictionary } from "@/lib/i18n/dictionaries/error-boundary";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useDictionary(errorBoundaryDictionary);
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-12 text-center">
      <h2 className="text-xl font-semibold text-text-primary">{t.title}</h2>
      <p className="text-text-secondary max-w-md">
        {error.message || t.globalFallback}
      </p>
      <Button variant="primary" onClick={reset}>{t.tryAgain}</Button>
    </div>
  );
}
