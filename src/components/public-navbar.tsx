"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/command-palette";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useDictionary } from "@/lib/i18n/locale-context";
import { homeDictionary } from "@/lib/i18n/dictionaries/home";

const CLOSE_ANIMATION_MS = 200;

export function PublicNavbar() {
  const { data: session } = useSession();
  const t = useDictionary(homeDictionary).nav;
  const [menuOpen, setMenuOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      setShouldRender(true);
      setClosing(false);
      return;
    }
    if (!shouldRender) return;
    setClosing(true);
    const timer = setTimeout(() => {
      setShouldRender(false);
      setClosing(false);
    }, CLOSE_ANIMATION_MS);
    return () => clearTimeout(timer);
    // shouldRender is only read here to skip the timer when already closed --
    // it must stay out of the deps or the timer would reset on its own change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = (
    <>
      <Link href="/#features" onClick={closeMenu} className="text-text-secondary hover:text-success transition-colors cursor-pointer">{t.features}</Link>
      <Link href="/#use-cases" onClick={closeMenu} className="text-text-secondary hover:text-success transition-colors cursor-pointer">{t.useCases}</Link>
      <Link href="/#security" onClick={closeMenu} className="text-text-secondary hover:text-success transition-colors cursor-pointer">{t.security}</Link>
      <Link href="/pricing" onClick={closeMenu} className="text-text-secondary hover:text-success transition-colors">{t.pricing}</Link>
    </>
  );

  const authActions = session ? (
    <>
      <Link href="/dashboard" onClick={closeMenu}>
        <Button variant="primary" size="sm" className="gap-1.5">
          <LayoutDashboard size={16} />
          {t.dashboard}
        </Button>
      </Link>
      <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => { closeMenu(); signOut({ callbackUrl: "/" }); }}>
        <LogOut size={16} />
        {t.signOut}
      </Button>
    </>
  ) : (
    <>
      <Link href="/sign-in" onClick={closeMenu}>
        <Button variant="ghost" size="sm">{t.signIn}</Button>
      </Link>
      <Link href="/sign-up" onClick={closeMenu}>
        <Button variant="primary" size="sm">{t.getStarted}</Button>
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16">
      <div className="flex justify-between items-center w-full px-6 max-w-[1440px] mx-auto h-full">
        <Link href="/" className="text-xl font-bold tracking-tight text-success">
          Linqis
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <CommandPalette />
          <LanguageSwitcher />
          {authActions}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] text-text-primary hover:bg-surface transition-colors cursor-pointer"
          aria-label={shouldRender ? t.closeMenu : t.openMenu}
        >
          {shouldRender ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {shouldRender && (
        <>
          <div
            className={`md:hidden fixed top-16 inset-x-0 bottom-0 z-40 bg-black/40 ${closing ? "animate-fade-out" : "animate-fade-in"}`}
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            className={`md:hidden fixed top-16 right-0 bottom-0 z-40 w-[80%] max-w-xs bg-background border-l border-border flex flex-col gap-6 px-6 py-6 shadow-2xl overflow-y-auto ${
              closing ? "animate-drawer-out" : "animate-drawer-in"
            }`}
          >
            <nav className="flex flex-col gap-4 text-base">
              {navLinks}
            </nav>
            <div className="flex items-center gap-4 border-t border-border pt-6">
              <CommandPalette />
              <LanguageSwitcher />
            </div>
            <div className="flex flex-col gap-3">
              {authActions}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
