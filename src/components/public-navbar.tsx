"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16">
      <div className="flex justify-between items-center w-full px-6 max-w-[1440px] mx-auto h-full">
        <Link href="/" className="text-xl font-bold tracking-tight text-success">
          Lynqis
        </Link>
        
        {isHome ? (
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-text-secondary hover:text-success transition-colors cursor-pointer">Features</a>
            <a href="#steps" className="text-text-secondary hover:text-success transition-colors cursor-pointer">Steps</a>
            <a href="#cta" className="text-text-secondary hover:text-success transition-colors cursor-pointer">Action</a>
            <Link href="/pricing" className="text-text-secondary hover:text-success transition-colors">Pricing</Link>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-text-secondary hover:text-success transition-colors">Dashboard</Link>
            <Link href="/pricing" className="text-text-secondary hover:text-success transition-colors">Pricing</Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
