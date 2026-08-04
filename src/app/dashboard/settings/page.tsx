"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getUser, updateUser, type UserProfile } from "@/lib/api";

const SUMMARY_LENGTHS: UserProfile["summaryLength"][] = ["CONCISE", "STANDARD", "DETAILED"];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [summaryLength, setSummaryLength] = useState<UserProfile["summaryLength"]>("STANDARD");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    getUser(session.user.id).then((u) => {
      setName(u.name || "");
      setSummaryLength(u.summaryLength);
      setEmailNotifications(u.emailNotifications);
    });
  }, [session?.user?.id]);

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateUser(session.user.id, { name, summaryLength, emailNotifications });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

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
            <span className="font-medium">Profile</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg cursor-pointer active:scale-[0.98] transition-all">
            <span className="font-medium">Preferences</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg cursor-pointer active:scale-[0.98] transition-all">
            <span className="font-medium">API Keys</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg cursor-pointer active:scale-[0.98] transition-all">
            <span className="font-medium">Billing</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-danger hover:bg-danger-bg rounded-lg cursor-pointer active:scale-[0.98] transition-all mt-8">
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
                    {session?.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={session.user.image} alt={session.user.name || "Profile"} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-surface-high flex items-center justify-center text-text-secondary">?</div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{name || "—"}</h4>
                  <p className="text-sm text-text-secondary">{session?.user?.email}</p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="primary" size="sm">Upload New</Button>
                    <Button variant="secondary" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-text-secondary uppercase tracking-wider">Full Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-text-secondary uppercase tracking-wider">Email Address</label>
                  <Input value={session?.user?.email || ""} type="email" disabled />
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
                  <div className="w-10 h-10 flex items-center justify-center bg-text-primary/5 rounded-lg border border-border" />
                  <div>
                    <p className="font-medium text-text-primary">OpenAI Key</p>
                    <p className="text-sm text-text-secondary">sk-••••••••••••••••••••••••4jK2</p>
                  </div>
                </div>
              </div>
              <Button variant="secondary" className="w-full border-dashed gap-2">
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
                  {SUMMARY_LENGTHS.map((length) => (
                    <button
                      key={length}
                      onClick={() => setSummaryLength(length)}
                      className={`px-4 py-1 font-medium rounded-md capitalize ${
                        summaryLength === length
                          ? "bg-surface-high text-success shadow-sm"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {length.charAt(0) + length.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Email Notifications</p>
                  <p className="text-sm text-text-secondary">Receive summaries directly in your inbox after meetings.</p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${emailNotifications ? "bg-success" : "bg-border"}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-all ${
                      emailNotifications ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </Card>
          </section>

          {/* Danger Zone */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-danger">
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
                <p className="text-sm text-text-secondary">Permanently deactivate your Linqis profile and forfeit any remaining subscription balance.</p>
                <Button variant="danger" className="w-full">Delete Permanently</Button>
              </Card>
            </div>
          </section>

          {/* Footer Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t border-border">
            {saved && <span className="text-sm text-success">Saved ✓</span>}
            <Button variant="primary" onClick={handleSave} disabled={saving || !session?.user?.id}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
