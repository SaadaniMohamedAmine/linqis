"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/command-palette";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useDictionary } from "@/lib/i18n/locale-context";
import { homeDictionary } from "@/lib/i18n/dictionaries/home";

export function PublicNavbar() {
  const { data: session } = useSession();
  const t = useDictionary(homeDictionary).nav;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16">
      <div className="flex justify-between items-center w-full px-6 max-w-[1440px] mx-auto h-full">
        <Link href="/" className="text-xl font-bold tracking-tight text-success">
          Linqis
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-text-secondary hover:text-success transition-colors cursor-pointer">{t.features}</Link>
          <Link href="/#use-cases" className="text-text-secondary hover:text-success transition-colors cursor-pointer">{t.useCases}</Link>
          <Link href="/#security" className="text-text-secondary hover:text-success transition-colors cursor-pointer">{t.security}</Link>
          <Link href="/pricing" className="text-text-secondary hover:text-success transition-colors">{t.pricing}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <CommandPalette />
          <LanguageSwitcher />
          {session ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                {t.signOut}
              </Button>
              <Link href="/dashboard">
                <Button variant="primary" size="sm">{t.dashboard}</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">{t.signIn}</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="primary" size="sm">{t.getStarted}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
