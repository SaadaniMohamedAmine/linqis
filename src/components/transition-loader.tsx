"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simule un temps de chargement minimal pour la transition

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="loader flex gap-2">
        <div className="bar bg-success animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="bar bg-success animate-bounce" style={{ animationDelay: "0.16s" }} />
        <div className="bar bg-success animate-bounce" style={{ animationDelay: "0.32s" }} />
      </div>
      <style jsx>{`
        .loader {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bar {
          width: 8px;
          height: 24px;
          border-radius: 4px;
          animation: loading-keys-app-loading 0.8s infinite ease-in-out;
        }
        @keyframes loading-keys-app-loading {
          0%, 80%, 100% {
            opacity: 0.75;
            box-shadow: 0 0 var(--color-success);
            height: 24px;
          }
          40% {
            opacity: 1;
            box-shadow: 0 -8px var(--color-success);
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
}
