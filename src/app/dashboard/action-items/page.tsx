import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ActionItemsPage() {
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
          <Link href="/dashboard/meetings" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg transition-all">
            <span></span>
            <span className="font-medium">Recent Meetings</span>
          </Link>
          <Link href="/dashboard/action-items" className="flex items-center gap-3 px-3 py-2 bg-surface text-success rounded-lg transition-all">
            <span></span>
            <span className="font-medium">Action Items</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg transition-all">
            <span></span>
            <span className="font-medium">Archived</span>
          </Link>
        </nav>
        <div className="mt-auto p-4 bg-surface-low rounded-xl border border-border">
          <div className="flex flex-col gap-1">
            <div className="h-1 bg-surface-high rounded-full overflow-hidden">
              <div className="h-full bg-success w-[72%]"></div>
            </div>
            <p className="text-xs text-text-secondary flex justify-between">
              <span>Workspace Storage</span>
              <span>72%</span>
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[260px] p-6">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-5 group hover:border-border-hover transition-all">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-text-secondary">Total Tasks</span>
                <span className="text-success"></span>
              </div>
              <h3 className="text-3xl font-semibold">128</h3>
              <p className="text-xs text-success flex items-center gap-1 mt-2">
                <span></span> +12% this week
              </p>
            </Card>
            <Card className="p-5 group hover:border-border-hover transition-all">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-text-secondary">Todo</span>
                <span className="text-warning"></span>
              </div>
              <h3 className="text-3xl font-semibold">45</h3>
              <p className="text-xs text-text-secondary mt-2">Focus required</p>
            </Card>
            <Card className="p-5 group hover:border-border-hover transition-all">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-text-secondary">Done</span>
                <span className="text-success"></span>
              </div>
              <h3 className="text-3xl font-semibold">67</h3>
              <p className="text-xs text-success mt-2">8 tasks today</p>
            </Card>
            <Card className="p-5 group hover:border-border-hover transition-all">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-text-secondary">Overdue</span>
                <span className="text-danger"></span>
              </div>
              <h3 className="text-3xl font-semibold">16</h3>
              <p className="text-xs text-danger mt-2">Action needed</p>
            </Card>
          </div>

          {/* Table Content Container */}
          <Card className="overflow-hidden relative min-h-[600px]">
            {/* Table Header/Controls */}
            <div className="p-4 border-b border-border flex flex-wrap gap-4 justify-between items-center bg-surface">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-success transition-colors"><span></span></span>
                  <Input placeholder="Search tasks..." className="pl-10 w-[300px]" />
                </div>
                <Button variant="secondary" className="gap-2">
                  <span></span>
                  Filter
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-text-secondary">Showing 1-10 of 45</span>
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button className="p-2 hover:bg-surface-low border-r border-border transition-colors"><span></span></button>
                  <button className="p-2 hover:bg-surface-low transition-colors"><span></span></button>
                </div>
              </div>
            </div>

            {/* The Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-4 w-12"><input type="checkbox" className="rounded bg-transparent border-border text-success focus:ring-success" /></th>
                    <th className="px-4 py-4 font-medium text-text-secondary">Task</th>
                    <th className="px-4 py-4 font-medium text-text-secondary">Owner</th>
                    <th className="px-4 py-4 font-medium text-text-secondary">Meeting</th>
                    <th className="px-4 py-4 font-medium text-text-secondary">Deadline</th>
                    <th className="px-4 py-4 font-medium text-text-secondary">Priority</th>
                    <th className="px-4 py-4 font-medium text-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Task 1 */}
                  <tr className="hover:bg-surface transition-colors bg-surface-low">
                    <td className="px-4 py-4"><input checked type="checkbox" className="rounded bg-transparent border-border text-success focus:ring-success" /></td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-text-primary">Update Q3 Financial Projections</span>
                        <span className="text-sm text-text-secondary">Update Excel sheets and share PDF with stakeholders</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-border">
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeQ3_eKhgwY2KwM9D_KUj-oDgbfmBMKonIPY2fcvNiEToTQrz4h5CiVqEIEckXmNOQo1KSVUnr_7gOxJTMHBEdQDRYSQ6LQ2eEXwXLFyGp4K79E91Iv7A_adUq36S6nXvkcciu56OMRoBu8n67Xbd6dJUGZX6IwlSRVyqW_cn_vdTja-WgOZZa49P8srsMLKznd_DTiI5XHtsagb1ledeaPgsx7YefavHOz7HojDTswbQgPku7vvgH" alt="Alex" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium">Alex Rivera</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-success hover:underline cursor-pointer">Quarterly Strategy</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-primary">Oct 24, 2023</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-danger-bg text-danger rounded-full text-[11px] font-bold tracking-tight">HIGH</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 text-xs text-warning">
                        <span className="w-2 h-2 rounded-full bg-warning"></span>
                        In Progress
                      </span>
                    </td>
                  </tr>
                  {/* Task 2 */}
                  <tr className="hover:bg-surface transition-colors bg-surface-low">
                    <td className="px-4 py-4"><input checked type="checkbox" className="rounded bg-transparent border-border text-success focus:ring-success" /></td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-text-primary">Review Design System PR</span>
                        <span className="text-sm text-text-secondary">Check tokens for contrast accessibility</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-border">
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS2YI-dmSBma-7GiNs4CVxrGvUURZO1XWzeO8WyQF163FqyqHj698PUegJAUADFnvV7ftsA3tIyiLZOcFUdGoaieZ6ofH7JZKnlSjTx8tLpxNHKXnxK95LdyKHXMmrhmruak7lekn0vA7r5QM2OtePGx_lbHBfh5qF_ltpuXpJaRzrzOyCjvvEW7PYNwYq9OzyhMnxqt9pj_XIh0mYD92XwPdxtAq1Klw5VYCJgkhD-SvsrY_W99t2" alt="Sarah" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium">Sarah Chen</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-success hover:underline cursor-pointer">UI/UX Sync</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-danger">Oct 20, 2023</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-surface text-text-secondary rounded-full text-[11px] font-bold tracking-tight">MEDIUM</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 text-xs text-danger">
                        <span className="w-2 h-2 rounded-full bg-danger"></span>
                        Overdue
                      </span>
                    </td>
                  </tr>
                  {/* Task 3 */}
                  <tr className="hover:bg-surface transition-colors bg-surface-low">
                    <td className="px-4 py-4"><input checked type="checkbox" className="rounded bg-transparent border-border text-success focus:ring-success" /></td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-text-primary">Client Onboarding Call</span>
                        <span className="text-sm text-text-secondary">Schedule initial discovery session</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-border">
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGQkNt75R_nbcMcjuw7Sa0ioMuAMNPJaATk9TxGM-VTMaLRG2bXu8-HjT9Md25BRsKaBtocBJ1H0MrFmFU6XL3zsFaZnnAKfnckmeDDGuaiLjS33mQD-wwjnePVOnvuSfov17cfjebt8jeJ4UCnQMty7GDYXxSyKXvgOsRpBpKLeyi4_kwnLXjGHR9iasOLtdFgkmGdd9LCopgpaA2alYFHkG9mfxysmh_JVYkl17VNPgUu1P6GG6S" alt="James" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium">James Miller</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-success hover:underline cursor-pointer">Sales Handoff</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-primary">Oct 26, 2023</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-surface text-text-secondary rounded-full text-[11px] font-bold tracking-tight">LOW</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="w-2 h-2 rounded-full bg-text-secondary opacity-40"></span>
                        To Do
                      </span>
                    </td>
                  </tr>
                  {/* Task 4 */}
                  <tr className="hover:bg-surface transition-colors">
                    <td className="px-4 py-4"><input type="checkbox" className="rounded bg-transparent border-border text-success focus:ring-success" /></td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-text-primary">Backend API Documentation</span>
                        <span className="text-sm text-text-secondary">Update Swagger docs for v2 endpoints</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-border">
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtRhEcI9HeUQMSXaRUhtVhjLVJt--qiTHT6V0KBnVY0YEoNZPJD5KhhIcUOgwhOJFccj_vMggWeXkh84t1DkPMs8vUhuEtHhrWfwQvbntAtYe8f0-EHwqvGWrTQ0JxTWhw35QuIqX-MZTrySABPxOe0y6C8UrjlsI4TJeTmf4ffU1De-TY9mZ_WjX1zDVQNLWiSmHF5NURC2H9g8bI-Q5M9yVQT4AroakyMqzNHQ-FXzLz0gsqELBb" alt="Priya" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium">Priya Sharma</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-success hover:underline cursor-pointer">Engineering Weekly</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-primary">Oct 22, 2023</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-danger-bg text-danger rounded-full text-[11px] font-bold tracking-tight">HIGH</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 text-xs text-success">
                        <span className="w-2 h-2 rounded-full bg-success"></span>
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
