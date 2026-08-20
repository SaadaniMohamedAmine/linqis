"use client";

import Link from "next/link";
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

interface DashboardChromeProps {
  children: React.ReactNode;
  meetingsThisMonth: number;
  maxMeetingsPerMonth: number | null;
}

export function DashboardChrome({ children, meetingsThisMonth, maxMeetingsPerMonth }: DashboardChromeProps) {
  const t = useDictionary(dashboardShellDictionary);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <PageLoader />
      {/* TopNavBar */}
      <header className="bg-background border-b border-border h-16 fixed top-0 left-0 right-0 z-50 flex items-center md:pl-[280px]">
        <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto px-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-success">Linqis</Link>
          <div className="flex items-center gap-4">
            <CommandPalette />
            <WorkspaceSwitcher />
            <LanguageSwitcher />
            <NotificationsBell />
            <Link href="/dashboard/upload" data-tour="upload-button">
              <Button variant="primary" size="sm">{t.upload}</Button>
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

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
  );
}
