import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/page-loader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <PageLoader />
      {/* TopNavBar */}
      <header className="bg-background border-b border-border h-16 fixed top-0 left-0 right-0 z-50 flex items-center px-6">
        <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-success">Lynqis</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-success border-b-2 border-success pb-1 font-medium">Dashboard</Link>
              <Link href="/dashboard/meetings" className="text-text-secondary hover:text-success transition-colors">Meetings</Link>
              <Link href="/dashboard/action-items" className="text-text-secondary hover:text-success transition-colors">Action Items</Link>
              <Link href="/dashboard/integrations" className="text-text-secondary hover:text-success transition-colors">Integrations</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <span></span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <span></span>
            </Button>
            <div className="w-8 h-8 rounded-full bg-surface border border-border overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD9nMg1r9_VY5g413ges5b6x8FYIawgTZ6u9wW2usVqRrlcACSMHLrZl8JYH-NFBcBS9gegloBTI1dEpoB9AAWttDUlVg7K1U1bXhNoLjNcIdKUvOJoUnA7ZSL6-9wSJ0C6PCUnIoSV_U3FNUPEA-BtHOS3lzVvCVUikRCJf0c9xuiGPekx60dcsuyHUyALrHa8f_TOuBk3F3vVZpgKhIlQpRB83hGJjYWo_bqtz6V4WbXOipgejum" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        {/* SideNavBar */}
        <aside className="hidden md:flex flex-col w-[280px] border-r border-border p-4 gap-4 overflow-y-auto sticky top-16 h-[calc(100vh-64px)]">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Meeting List</h2>
              <span className="text-success cursor-pointer"></span>
            </div>
            <p className="text-sm text-text-secondary">AI-summarized sessions</p>
          </div>
          <Button variant="primary" className="w-full gap-2">
            <span></span>
            New Meeting
          </Button>
          <div className="space-y-2">
            <Link href="/dashboard" className="block bg-surface text-success rounded-lg p-3 cursor-pointer active:scale-[0.98] transition-all border border-success/20">
              <div className="flex items-center gap-2 mb-1">
                <span></span>
                <span className="font-medium">Q3 Product Strategy</span>
              </div>
              <p className="text-xs text-text-secondary">24 mins ago • Today</p>
            </Link>
            <Link href="#" className="block text-text-secondary hover:bg-surface/50 rounded-lg p-3 cursor-pointer active:scale-[0.98] transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span></span>
                <span className="font-medium">Weekly Sync: Engineering</span>
              </div>
              <p className="text-xs text-text-secondary/60">Yesterday • 45m</p>
            </Link>
            <Link href="#" className="block text-text-secondary hover:bg-surface/50 rounded-lg p-3 cursor-pointer active:scale-[0.98] transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span></span>
                <span className="font-medium">Design Review: Home</span>
              </div>
              <p className="text-xs text-text-secondary/60">Oct 12 • 32m</p>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-surface overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}
