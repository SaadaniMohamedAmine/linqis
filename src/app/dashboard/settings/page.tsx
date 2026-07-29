import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* SideNav (Settings Categories) */}
      <aside className="hidden md:flex flex-col w-[260px] p-4 gap-2 border-r border-border sticky top-16 h-[calc(100vh-64px)] bg-background">
        <div className="mb-8 px-4 pt-4">
          <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
          <p className="text-sm text-text-secondary">Manage your workspace</p>
        </div>
        <nav className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-3 py-2 bg-surface text-success rounded-lg cursor-pointer active:scale-[0.98] transition-all">
            <span></span>
            <span className="font-medium">Profile</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg cursor-pointer active:scale-[0.98] transition-all">
            <span></span>
            <span className="font-medium">Preferences</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg cursor-pointer active:scale-[0.98] transition-all">
            <span></span>
            <span className="font-medium">API Keys</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg cursor-pointer active:scale-[0.98] transition-all">
            <span></span>
            <span className="font-medium">Billing</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-danger hover:bg-danger-bg rounded-lg cursor-pointer active:scale-[0.98] transition-all mt-8">
            <span></span>
            <span className="font-medium">Danger Zone</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 md:ml-[260px] p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-[800px] mx-auto space-y-16">
          {/* Profile Section */}
          <section className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold">Profile</h3>
              <p className="text-text-secondary">Update your photo and personal details.</p>
            </div>
            <Card className="p-6 space-y-8">
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-success ring-4 ring-background">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzh1K41sYqJIyuqwDYFV3xyFxpSRVCA-mUXA8GbB9bLZIVURWzi6yidIr4C-uTZgJf-wpjWOxSRODUeZut3yf_WdK9F-pGlge-qS7WO-ME2jwv2x7VZnNzH0p5TEkUo7nynao-9GKcLME8VXwPR_YEyoXKrKlLkXRjf_Swh8dCSzSfLz9zvwY98XeBONlGBCPbLRt4iq5u4daKNVKVInZ8GFf-9dXkNXHVp7aWgNRjWdPPCOszhd7c" alt="Alex" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-success text-background p-1 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <span className="text-sm"></span>
                  </button>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Alex Martin</h4>
                  <p className="text-sm text-text-secondary">Product Designer & Meeting Lead</p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="primary" size="sm">Upload New</Button>
                    <Button variant="secondary" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-text-secondary uppercase tracking-wider">Full Name</label>
                  <Input defaultValue="Alex Martin" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-text-secondary uppercase tracking-wider">Email Address</label>
                  <Input defaultValue="alex.martin@lynqis.ai" type="email" />
                </div>
              </div>
            </Card>
          </section>

          {/* API Keys Section */}
          <section className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold">API Keys</h3>
              <p className="text-text-secondary">Connect your own AI models for custom processing.</p>
            </div>
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-text-primary/5 rounded-lg border border-border">
                    <span className="text-success"></span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">OpenAI Key</p>
                    <p className="text-sm text-text-secondary">sk-••••••••••••••••••••••••4jK2</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 hover:text-success transition-colors"><span></span></button>
                  <button className="p-1 hover:text-success transition-colors"><span></span></button>
                  <button className="p-1 hover:text-danger transition-colors"><span></span></button>
                </div>
              </div>
              <Button variant="secondary" className="w-full border-dashed gap-2">
                <span></span>
                Add New Secret Key
              </Button>
            </Card>
          </section>

          {/* Preferences Section */}
          <section className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold">Preferences</h3>
              <p className="text-text-secondary">Customize your workspace experience.</p>
            </div>
            <Card className="divide-y divide-border">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">AI Summary Length</p>
                  <p className="text-sm text-text-secondary">Choose how detailed your automatic summaries should be.</p>
                </div>
                <div className="flex bg-background p-1 rounded-lg border border-border">
                  <button className="px-4 py-1 font-medium rounded-md bg-surface-high text-success shadow-sm">Concise</button>
                  <button className="px-4 py-1 font-medium rounded-md text-text-secondary hover:text-text-primary">Standard</button>
                  <button className="px-4 py-1 font-medium rounded-md text-text-secondary hover:text-text-primary">Detailed</button>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Email Notifications</p>
                  <p className="text-sm text-text-secondary">Receive summaries directly in your inbox after meetings.</p>
                </div>
                <button className="w-12 h-6 bg-success rounded-full relative transition-colors">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-background rounded-full"></span>
                </button>
              </div>
            </Card>
          </section>

          {/* Danger Zone */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-danger">
              <span></span>
              <h3 className="text-2xl font-semibold">Danger Zone</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-danger/30 bg-danger/5 p-6 space-y-4 hover:border-danger transition-colors">
                <h4 className="text-lg font-semibold text-danger">Clear Data</h4>
                <p className="text-sm text-text-secondary">Remove all meeting transcripts and AI summaries from our servers. This action is irreversible.</p>
                <Button variant="danger" className="w-full">Wipe All History</Button>
              </Card>
              <Card className="border-danger/30 bg-danger/5 p-6 space-y-4 hover:border-danger transition-colors">
                <h4 className="text-lg font-semibold text-danger">Delete Account</h4>
                <p className="text-sm text-text-secondary">Permanently deactivate your Lynqis profile and forfeit any remaining subscription balance.</p>
                <Button variant="danger" className="w-full">Delete Permanently</Button>
              </Card>
            </div>
          </section>

          {/* Footer Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t border-border">
            <Button variant="ghost">Discard Changes</Button>
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
