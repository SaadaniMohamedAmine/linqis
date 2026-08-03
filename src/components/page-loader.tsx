"use client";

import { useEffect, useState } from "react";

export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center">
      {/* Glow Effect */}
      <div className="absolute w-64 h-64 bg-success/20 rounded-full blur-[100px] animate-pulse" />
      
      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo Icon */}
        <div className="w-20 h-20 rounded-2xl bg-surface border border-success/30 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
          <span className="text-3xl font-bold text-success">L</span>
        </div>
        
        {/* App Name */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-success tracking-tight">Lynqis</h1>
          <p className="text-xs text-text-muted uppercase tracking-[0.2em] mt-2">
            AI Meeting Intelligence
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mt-4">
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-success to-accent rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Loading</span>
            <span className="text-[10px] text-text-muted">{Math.min(Math.round(progress), 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
