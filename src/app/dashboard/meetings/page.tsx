import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MeetingsListPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col w-[260px] border-r border-border p-4 gap-2 sticky top-16 h-[calc(100vh-64px)] bg-background">
        <div className="mb-4 px-2">
          <h2 className="text-lg font-semibold text-text-primary">Meeting List</h2>
          <p className="text-sm text-text-secondary">AI-summarized sessions</p>
        </div>
        <Button variant="primary" className="w-full gap-2 mb-4">
          <span></span>
          New Meeting
        </Button>
        <nav className="flex flex-col gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg transition-all">
            <span></span>
            <span className="font-medium">Overview</span>
          </Link>
          <Link href="/dashboard/meetings" className="flex items-center gap-3 px-3 py-2 bg-surface text-success rounded-lg transition-all">
            <span></span>
            <span className="font-medium">Recent Meetings</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg transition-all">
            <span></span>
            <span className="font-medium">Shared with Me</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg transition-all">
            <span></span>
            <span className="font-medium">Archived</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1440px] mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-text-primary mb-1">All Meetings</h1>
              <p className="text-text-secondary">Browse and manage your recorded sessions and AI transcriptions.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex p-1 bg-surface rounded-lg border border-border">
                <button className="px-3 py-1 rounded-md bg-surface-high text-success flex items-center gap-2">
                  <span></span>
                  <span className="text-sm font-medium">List</span>
                </button>
                <button className="px-3 py-1 rounded-md text-text-secondary hover:bg-surface-low flex items-center gap-2">
                  <span></span>
                  <span className="text-sm font-medium">Grid</span>
                </button>
              </div>
              <Link href="/dashboard/upload">
                <Button variant="secondary" className="gap-2">
                  <span></span>
                  Upload
                </Button>
              </Link>
            </div>
          </div>

          {/* Table Container */}
          <Card className="overflow-hidden">
            {/* Search & Filters */}
            <div className="p-4 flex items-center gap-4 border-b border-border bg-surface">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"><span></span></span>
                <Input placeholder="Search by title, participant, or project..." className="pl-10" />
              </div>
              <Button variant="secondary" className="gap-2">
                <span></span>
                Filter
              </Button>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-low border-b border-border">
                    <th className="px-6 py-4 font-medium text-text-secondary">Title</th>
                    <th className="px-6 py-4 font-medium text-text-secondary">Date</th>
                    <th className="px-6 py-4 font-medium text-text-secondary">Duration</th>
                    <th className="px-6 py-4 font-medium text-text-secondary">Participants</th>
                    <th className="px-6 py-4 font-medium text-text-secondary">Action Items</th>
                    <th className="px-6 py-4 font-medium text-text-secondary">Status</th>
                    <th className="px-6 py-4 font-medium text-text-secondary">Project</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Row 1 */}
                  <tr className="hover:bg-surface transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                          <span></span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">Product Sync: Q4 Roadmap</p>
                          <p className="text-sm text-text-secondary">Weekly status check</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">Oct 12, 2023</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">45 min</td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-high overflow-hidden">
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4poEmkTz5HbHh21smvpzgcgt4HF53jRG5WoPmNdHJ4UJgviGeXLwjfX2occBS6RQdPB7gfAR8VvfJBdgVLzkeinC_7r_dv5J5wCDz2IQG967cvF_aNxbr1rVgRLzEErZBzqg1GWnPgnyZYXf8IPgZ34D-8lihBzVjWQgcaWMrpCChQQ04bbT1cJGgaS7CgbtTM3EISemt3Pznd64TaDWL6FkFowvBznYzql3NOcBHsY9rL7hkwMjv" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-high overflow-hidden">
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdf5QD0Rv9tGaRbBJoiLnRLzq9frh7FXea5AjtD6q6AQbLbowLkDZnuc8v9zImyFnf7Lj8cpzj7nWqYJ7I-TkEqZ3Fa2yI-9_hWdWM38OUNm20DjbsVMDfc4Rc1vKaf18S4PW-xQ10SEZTxiVu8qFK2oDzmBajC_GzZR3gos4anAdVM5A1dMo1Lln2HgNNTTwgCdCqakLzcqqA7S63_6xqcTEZSHf6BCFLGzBoPcjoJuhVOWsMZF7-" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-high flex items-center justify-center text-xs font-bold bg-surface-high text-text-secondary">+3</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="neutral" className="gap-1">
                        <span></span>
                        12 tasks
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">Processed</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">Core App</td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="hover:bg-surface transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                          <span></span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">Client Discovery: Acme Corp</p>
                          <p className="text-sm text-text-secondary">Requirements gathering</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">Oct 11, 2023</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">1h 12m</td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-high overflow-hidden">
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_u24fs6_BkS43cxcfz76vpyaelysynjgUqggdMhh2KtW84z9jJ_cTsNG8YVELCFHDSCNSMvTRHBzqdQCKmAaVCXRqa2w5h9ZWBqS_cJo-MW4MBa8Vy9eh_PDvaUlb6ndAr-dpZVVEa_dDMiNHOmrYWObiYLO-6zpK0Cy2sdfCC572MsuVxFUnlHXUjONX19mKBUpJ4YdJN-jiRTSdwMFAr04D4D4GNI6-9Cz_HpjLteqypfcyH-Sn" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-high flex items-center justify-center text-xs font-bold bg-surface-high text-text-secondary">+1</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="neutral" className="gap-1">
                        <span></span>
                        4 tasks
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="warning">Processing...</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">Sales</td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="hover:bg-surface transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-high flex items-center justify-center text-text-secondary">
                          <span></span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">Daily Standup</p>
                          <p className="text-sm text-text-secondary">Engineering daily sync</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">Oct 11, 2023</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">15 min</td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-high overflow-hidden">
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt5e08D_nr67LRaoHLgas7-hZkpHQYgZ35VBdZ3G4A7qMqiwmeSguu80W42dh9r6V9aTJ-Yn2tVheAvilB-B8gDbTEvB76z27oRxBK0VA4xjrjiOBy6Kosp_d8yV2tquCX4QkBPjspddTP1uKDsulif0reqGP22bsGb4r7H4KUsmxHb4GJ-hMEpIkHmfkk8uNZGKyi0uVkvq2nhQLhOgbvCDemcQ-U4QzGrWi61smVclxrx1omfITX" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-high flex items-center justify-center text-xs font-bold bg-surface-high text-text-secondary">+8</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="neutral" className="gap-1">
                        <span></span>
                        2 tasks
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">Processed</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">Engineering</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-border flex items-center justify-between bg-surface-low">
              <p className="text-sm text-text-secondary">Showing <span className="text-text-primary font-semibold">1-10</span> of <span className="text-text-primary font-semibold">256</span> meetings</p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" disabled><span></span></Button>
                <div className="flex gap-1">
                  <Button variant="primary" size="sm">1</Button>
                  <Button variant="ghost" size="sm">2</Button>
                  <Button variant="ghost" size="sm">3</Button>
                  <span className="w-8 h-8 flex items-center justify-center text-text-secondary">...</span>
                  <Button variant="ghost" size="sm">24</Button>
                </div>
                <Button variant="secondary" size="sm"><span></span></Button>
              </div>
            </div>
          </Card>

          {/* AI Insight Spotlight */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="col-span-12 lg:col-span-8 p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-success/20 to-info/20 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 opacity-40 mix-blend-overlay"></div>
                  <span className="text-5xl text-success"></span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary mb-2">AI Insight Spotlight</h3>
                <p className="text-text-secondary mb-4">Across your last 10 meetings, the topic of <strong className="text-success">"API Integration"</strong> has increased in frequency by 40%. The consensus lean is <strong className="text-warning">positive</strong> but noted as a high-risk timeline factor.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="neutral">#api-economy</Badge>
                  <Badge variant="neutral">#scalability</Badge>
                  <Badge variant="neutral">#q4-planning</Badge>
                </div>
              </div>
            </Card>
            <Card className="col-span-12 lg:col-span-4 p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-medium text-text-secondary uppercase tracking-wider mb-4">Weekly Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-primary">Total Meeting Time</span>
                    <span className="font-medium text-success">12h 45m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-primary">Action Items Closed</span>
                    <span className="font-medium text-text-primary">84%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-primary">AI Processing Time</span>
                    <span className="font-medium text-text-primary">2.4m avg</span>
                  </div>
                </div>
              </div>
              <Button variant="secondary" className="mt-4 w-full">View Detailed Report</Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
