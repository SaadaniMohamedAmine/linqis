"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Upload as UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/page-loader";
import { UploadCounter } from "@/components/upload-counter";
import { SidebarNav } from "@/components/sidebar-nav";
import { NotificationsBell } from "@/components/notifications-bell";
import { CommandPalette } from "@/components/command-palette";
import { LanguageSwitcher } from "@/components/language-switcher";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { UserMenu } from "@/components/user-menu";
import { AskWidget } from "@/components/ask-widget";
import { ProductTour } from "@/components/product-tour";
import { useDictionary } from "@/lib/i18n/locale-context";
import { dashboardShellDictionary } from "@/lib/i18n/dictionaries/dashboard-shell";
import { getUser } from "@/lib/api";

const CLOSE_ANIMATION_MS = 200;

interface DashboardChromeProps {
  children: React.ReactNode;
  meetingsThisMonth: number;
  maxMeetingsPerMonth: number | null;
}

interface MeetingsCounterState {
  meetingsThisMonth: number;
  maxMeetingsPerMonth: number | null;
  refresh: () => void;
}

// The sidebar's usage counter is server-rendered by dashboard/layout.tsx, but
// client-side navigation (router.refresh() + router.push() right after an
// upload finishes) doesn't reliably re-fetch that server data before the
// counter re-renders -- so it only ever caught up on a full browser reload.
// This context lets any client component re-fetch it directly on demand.
const MeetingsCounterContext = createContext<MeetingsCounterState | null>(null);

export function useMeetingsCounter() {
  const ctx = useContext(MeetingsCounterContext);
  if (!ctx) throw new Error("useMeetingsCounter must be used within DashboardChrome");
  return ctx;
}

export function DashboardChrome({
  children,
  meetingsThisMonth: initialMeetingsThisMonth,
  maxMeetingsPerMonth: initialMaxMeetingsPerMonth,
}: DashboardChromeProps) {
  const t = useDictionary(dashboardShellDictionary);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [closing, setClosing] = useState(false);
  const [meetingsThisMonth, setMeetingsThisMonth] = useState(initialMeetingsThisMonth);
  const [maxMeetingsPerMonth, setMaxMeetingsPerMonth] = useState(initialMaxMeetingsPerMonth);

  // Stays in sync with a fresh server render (e.g. a plain browser reload)
  // whenever the initial props actually change.
  useEffect(() => {
    setMeetingsThisMonth(initialMeetingsThisMonth);
    setMaxMeetingsPerMonth(initialMaxMeetingsPerMonth);
  }, [initialMeetingsThisMonth, initialMaxMeetingsPerMonth]);

  const refreshMeetingsCounter = useCallback(() => {
    getUser()
      .then((user) => {
        setMeetingsThisMonth(user.meetingsThisMonth);
        setMaxMeetingsPerMonth(user.maxMeetingsPerMonth);
      })
      .catch(() => {});
  }, []);

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

  return (
    <MeetingsCounterContext.Provider
      value={{ meetingsThisMonth, maxMeetingsPerMonth, refresh: refreshMeetingsCounter }}
    >
      <div className="min-h-screen bg-background text-text-primary flex flex-col">
        <PageLoader />
        {/* TopNavBar */}
        <header className="bg-background border-b border-border h-16 fixed top-0 left-0 right-0 z-50 flex items-center md:pl-[280px]">
          <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto px-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-success">Linqis</Link>

            <div className="hidden md:flex items-center gap-4">
              <CommandPalette />
              <WorkspaceSwitcher />
              <LanguageSwitcher />
              <NotificationsBell />
              <Link href="/dashboard/upload" data-tour="upload-button">
                <Button variant="primary" size="sm">{t.upload}</Button>
              </Link>
              <UserMenu />
            </div>

            <div className="flex md:hidden items-center gap-2">
              <NotificationsBell />
              <LanguageSwitcher />
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] text-text-primary hover:bg-surface transition-colors cursor-pointer"
                aria-label={shouldRender ? t.closeMenu : t.openMenu}
              >
                {shouldRender ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </header>

        {shouldRender && (
          <>
            <div
              className={`md:hidden fixed top-16 inset-x-0 bottom-0 z-40 bg-black/40 ${closing ? "animate-fade-out" : "animate-fade-in"}`}
              onClick={closeMenu}
              aria-hidden="true"
            />
            <div
              className={`md:hidden fixed top-16 right-0 bottom-0 z-40 w-[80%] max-w-xs bg-background border-l border-border flex flex-col gap-6 px-4 py-6 shadow-2xl overflow-y-auto ${
                closing ? "animate-drawer-out" : "animate-drawer-in"
              }`}
            >
              <div className="flex items-center justify-between px-1">
                <UserMenu />
                <WorkspaceSwitcher />
              </div>

              <Link href="/dashboard/upload" onClick={closeMenu}>
                <Button variant="primary" size="sm" className="w-full gap-1.5">
                  <UploadIcon size={16} />
                  {t.upload}
                </Button>
              </Link>

              <div className="border-t border-border pt-4" onClick={closeMenu}>
                <SidebarNav />
              </div>

              <div className="flex items-center gap-4 border-t border-border pt-4">
                <CommandPalette />
              </div>

              <div className="flex flex-col gap-4 mt-auto">
                <UploadCounter meetingsThisMonth={meetingsThisMonth} maxMeetingsPerMonth={maxMeetingsPerMonth} />
              </div>
            </div>
          </>
        )}

        <div className="flex pt-16 min-h-screen">
          {/* SideNavBar */}
          <aside className="hidden md:flex flex-col w-[280px] border-r border-border p-4 gap-6 overflow-y-auto sticky top-16 h-[calc(100vh-64px)]">
            <SidebarNav />

            <div className="flex flex-col gap-4 pt-4 border-t border-border mt-auto">
              <UploadCounter meetingsThisMonth={meetingsThisMonth} maxMeetingsPerMonth={maxMeetingsPerMonth} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-surface overflow-hidden relative">
            {children}
          </main>
        </div>

        <ProductTour />
        <AskWidget />
      </div>
    </MeetingsCounterContext.Provider>
  );
}
