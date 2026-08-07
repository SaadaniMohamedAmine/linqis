import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/page-loader";
import { RecentMeetingsNav } from "@/components/recent-meetings-nav";
import { SidebarNav } from "@/components/sidebar-nav";
import { NotificationsBell } from "@/components/notifications-bell";
import { SearchBar } from "@/components/search-bar";
import { UserMenu } from "@/components/user-menu";
import { AskWidget } from "@/components/ask-widget";
import { ProductTour } from "@/components/product-tour";
import { getMeetings, type MeetingListItem } from "@/lib/api";

// Meeting data changes on every upload; never serve a stale build-time snapshot.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Server-rendered so the sidebar has real data on first paint. Falls back
  // to an empty list rather than crashing the whole dashboard shell if the
  // Express API is unreachable (e.g. cold start on Railway).
  let recentMeetings: MeetingListItem[] = [];
  try {
    recentMeetings = (await getMeetings()).slice(0, 6);
  } catch {
    recentMeetings = [];
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <PageLoader />
      {/* TopNavBar */}
      <header className="bg-background border-b border-border h-16 fixed top-0 left-0 right-0 z-50 flex items-center px-6">
        <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto">
          <Link href="/" className="text-xl font-bold tracking-tight text-success">Linqis</Link>
          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationsBell />
            <Link href="/dashboard/upload" data-tour="upload-button">
              <Button variant="primary" size="sm">Upload</Button>
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
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Meeting List</h2>
              <p className="text-sm text-text-secondary">AI-summarized sessions</p>
            </div>
            <Link href="/dashboard/upload">
              <Button variant="primary" className="w-full gap-2">New Meeting</Button>
            </Link>
            <RecentMeetingsNav meetings={recentMeetings} />
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
