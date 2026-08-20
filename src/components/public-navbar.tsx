"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/command-palette";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useDictionary } from "@/lib/i18n/locale-context";
import { homeDictionary } from "@/lib/i18n/dictionaries/home";

export function PublicNavbar() {
  const { data: session } = useSession();
  const t = useDictionary(homeDictionary).nav;
  const [open, setOpen] = useState(false);

  const navLinks = (
    <>
      <Link href="/#features" className="text-text-secondary hover:text-success transition-colors cursor-pointer">{t.features}</Link>
      <Link href="/#use-cases" className="text-text-secondary hover:text-success transition-colors cursor-pointer">{t.useCases}</Link>
      <Link href="/#security" className="text-text-secondary hover:text-success transition-colors cursor-pointer">{t.security}</Link>
      <Link href="/pricing" className="text-text-secondary hover:text-success transition-colors">{t.pricing}</Link>
    </>
  );

  const authActions = session ? (
    <>
      <Button variant="ghost" size="sm" onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}>
        {t.signOut}
      </Button>
      <Link href="/dashboard" onClick={() => setOpen(false)}>
        <Button variant="primary" size="sm">{t.dashboard}</Button>
      </Link>
    </>
  ) : (
    <>
      <Link href="/sign-in" onClick={() => setOpen(false)}>
        <Button variant="ghost" size="sm">{t.signIn}</Button>
      </Link>
      <Link href="/sign-up" onClick={() => setOpen(false)}>
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

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] text-text-primary hover:bg-surface transition-colors cursor-pointer"
              aria-label={open ? t.closeMenu : t.openMenu}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="md:hidden fixed inset-0 top-16 z-40 bg-background/60 backdrop-blur-sm" />
            <Dialog.Content
              className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background border-b border-border px-6 py-6 flex flex-col gap-6"
              aria-describedby={undefined}
            >
              <Dialog.Title className="sr-only">{t.openMenu}</Dialog.Title>
              <nav className="flex flex-col gap-4 text-base">
                {navLinks}
              </nav>
              <div className="flex items-center gap-4 border-t border-border pt-4">
                <CommandPalette />
                <LanguageSwitcher />
              </div>
              <div className="flex flex-col gap-3">
                {authActions}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
