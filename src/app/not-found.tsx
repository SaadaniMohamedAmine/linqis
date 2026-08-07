"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { LayoutDashboard, Home, Terminal, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function NotFound() {
  const glitchLineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Atmospheric "interference" -- the line occasionally flickers as the
  // cursor moves, and the 404 itself jitters a pixel every few seconds.
  useEffect(() => {
    const handleMouseMove = () => {
      if (Math.random() > 0.95 && glitchLineRef.current) {
        glitchLineRef.current.style.opacity = Math.random().toString();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const jitter = setInterval(() => {
      if (!headingRef.current) return;
      headingRef.current.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`;
      setTimeout(() => {
        if (headingRef.current) headingRef.current.style.transform = "translate(0,0)";
      }, 50);
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(jitter);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col relative overflow-hidden">
      <PublicNavbar />

      {/* Noise Overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: NOISE_BG }} />

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="w-full h-24 bg-gradient-to-b from-transparent via-success/5 to-transparent opacity-10 animate-scanline" />
      </div>

      <main className="relative z-10 flex-grow flex items-center justify-center px-6 pt-16">
        <div className="max-w-[1440px] w-full flex flex-col items-center text-center">
          {/* Decorative bento accents */}
          <div className="hidden lg:block absolute top-10 left-10 w-64 h-64 bg-surface/80 backdrop-blur-md border border-border rounded-lg rotate-3 opacity-20 pointer-events-none">
            <div className="p-4 border-b border-border flex justify-between">
              <div className="h-2 w-12 bg-border rounded-full" />
              <div className="h-2 w-2 bg-border rounded-full" />
            </div>
            <div className="p-4 space-y-2">
              <div className="h-1.5 w-full bg-border/50 rounded-full" />
              <div className="h-1.5 w-3/4 bg-border/50 rounded-full" />
              <div className="h-1.5 w-5/6 bg-border/50 rounded-full" />
            </div>
          </div>
          <div className="hidden lg:flex absolute bottom-10 right-10 w-80 h-48 bg-surface/80 backdrop-blur-md border border-border rounded-lg -rotate-6 opacity-20 pointer-events-none items-center justify-center">
            <LineChart size={64} className="text-text-muted" />
          </div>

          {/* 404 Display */}
          <div className="relative mb-12 group">
            <h1
              ref={headingRef}
              className="text-[180px] leading-none font-extrabold tracking-tighter text-text-primary/90 select-none transition-transform"
            >
              404
            </h1>
            <div ref={glitchLineRef} className="absolute w-full h-px bg-success top-1/2 left-0 opacity-70 animate-glitch" />
            <div className="absolute -inset-4 bg-success/5 blur-3xl rounded-full -z-10 animate-pulse" />
          </div>

          {/* Text */}
          <div className="space-y-4 mb-12">
            <h2 className="text-2xl font-semibold">Page not found</h2>
            <p className="text-text-secondary max-w-[420px] mx-auto">
              The AI couldn't find the coordinates for this meeting room. It might have been archived, deleted, or never existed in this timeline.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="gap-2">
                <LayoutDashboard size={18} />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg" className="gap-2">
                <Home size={18} />
                Go Home
              </Button>
            </Link>
          </div>

          {/* Error Log */}
          <div className="mt-24 pt-8 border-t border-border w-full max-w-[200px]">
            <div className="flex items-center justify-center gap-1 text-text-muted/40">
              <Terminal size={14} />
              <span className="text-xs uppercase tracking-widest">Error_Log: 0xFD404</span>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
