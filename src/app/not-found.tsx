import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col relative overflow-hidden">
      {/* Noise Overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,...')" }} />
      
      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="w-full h-24 bg-gradient-to-b from-transparent via-success/5 to-transparent opacity-10 animate-scanline" />
      </div>

      <main className="relative z-10 flex-grow flex items-center justify-center px-6">
        <div className="max-w-[1440px] w-full flex flex-col items-center text-center">
          {/* 404 Display */}
          <div className="relative mb-12 group">
            <h1 className="text-[180px] leading-none font-extrabold tracking-tighter text-text-primary/90 select-none">
              404
            </h1>
            <div className="absolute w-full h-px bg-success top-1/2 left-0 opacity-70 animate-glitch" />
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
                <span></span>
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg" className="gap-2">
                <span>🏠</span>
                Go Home
              </Button>
            </Link>
          </div>

          {/* Error Log */}
          <div className="mt-24 pt-8 border-t border-border w-full max-w-[200px]">
            <div className="flex items-center justify-center gap-1 text-text-muted/40">
              <span className="text-xs"></span>
              <span className="text-xs uppercase tracking-widest">Error_Log: 0xFD404</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-10 py-4 flex justify-between items-center text-text-muted/50">
        <div className="text-xs">© 2024 Lynqis AI Systems</div>
        <div className="flex gap-6 text-xs">
          <Link href="#" className="hover:text-text-primary transition-colors">Support</Link>
          <Link href="#" className="hover:text-text-primary transition-colors">Status</Link>
        </div>
      </footer>
    </div>
  );
}
