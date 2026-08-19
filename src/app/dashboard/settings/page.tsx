"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, SlidersHorizontal, KeyRound, CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/toast-provider";
import { ACTIVE_WORKSPACE_KEY, getUser, updateUser, type UserProfile } from "@/lib/api";
import { getInitials } from "@/lib/utils";

const SUMMARY_LENGTHS: UserProfile["summaryLength"][] = ["CONCISE", "STANDARD", "DETAILED"];

type TabId = "profile" | "preferences" | "api-keys" | "billing" | "danger";

const TABS: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { id: "api-keys", label: "API Keys", icon: KeyRound },
  { id: "billing", label: "Billing", icon: CreditCard },
];

function SettingsPageContent() {
  const { data: session } = useSession();
  // Integrations page links here with ?tab=api-keys so "Configure in
  // Settings" lands directly on the Notion/Slack fields instead of dumping
  // the user on Profile and making them find the right tab themselves.
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TabId>(
    TABS.some((t) => t.id === requestedTab) ? (requestedTab as TabId) : "profile"
  );
  const [name, setName] = useState("");
  const [summaryLength, setSummaryLength] = useState<UserProfile["summaryLength"]>("STANDARD");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notionApiKey, setNotionApiKey] = useState("");
  const [notionDatabaseId, setNotionDatabaseId] = useState("");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [slackChannelName, setSlackChannelName] = useState("");
  // Last-saved snapshot of the API Keys tab, so handleSave can tell which
  // integration(s) actually changed instead of always announcing "Notion".
  const [savedNotion, setSavedNotion] = useState({ apiKey: "", databaseId: "" });
  const [savedSlack, setSavedSlack] = useState({ webhookUrl: "", channelName: "" });
  const [plan, setPlan] = useState<UserProfile["plan"]>("FREE");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!session?.user?.id) return;
    // Seed from the JWT immediately so the profile card never regresses
    // below what the header already shows, then let the authoritative DB
    // value overwrite it once the backend round-trip resolves.
    setName(session.user.name || "");
    getUser()
      .then((u) => {
        setName(u.name || "");
        setSummaryLength(u.summaryLength);
        setEmailNotifications(u.emailNotifications);
        setNotionApiKey(u.notionApiKey || "");
        setNotionDatabaseId(u.notionDatabaseId || "");
        setSlackWebhookUrl(u.slackWebhookUrl || "");
        setSlackChannelName(u.slackChannelName || "");
        setSavedNotion({ apiKey: u.notionApiKey || "", databaseId: u.notionDatabaseId || "" });
        setSavedSlack({ webhookUrl: u.slackWebhookUrl || "", channelName: u.slackChannelName || "" });
        setPlan(u.plan);
        setSubscriptionStatus(u.subscriptionStatus);
        setCurrentPeriodEnd(u.currentPeriodEnd);
      })
      .catch((err) => {
        console.error("Failed to load user profile:", err);
      });
  }, [session?.user?.id, session?.user?.name]);

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: localStorage.getItem(ACTIVE_WORKSPACE_KEY) }),
      });
      const body = await res.json().catch(() => ({}));
      if (body.url) window.location.href = body.url;
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateUser({
        name,
        summaryLength,
        emailNotifications,
        notionApiKey,
        notionDatabaseId,
        slackWebhookUrl,
        slackChannelName,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      if (activeTab === "api-keys") {
        const notionChanged = notionApiKey !== savedNotion.apiKey || notionDatabaseId !== savedNotion.databaseId;
        const slackChanged = slackWebhookUrl !== savedSlack.webhookUrl || slackChannelName !== savedSlack.channelName;
        if (notionChanged && slackChanged) showToast("Notion and Slack integrations saved.");
        else if (slackChanged) showToast("Slack integration saved.");
        else if (notionChanged) showToast("Notion integration saved.");
        else showToast("Settings saved.");
        setSavedNotion({ apiKey: notionApiKey, databaseId: notionDatabaseId });
        setSavedSlack({ webhookUrl: slackWebhookUrl, channelName: slackChannelName });
      } else {
        showToast("Settings saved.");
      }
    } finally {
      setSaving(false);
    }
  };

  const showSaveBar = activeTab === "profile" || activeTab === "preferences" || activeTab === "api-keys";

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-40%] left-[20%] w-[450px] h-[450px] bg-success/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 py-10 animate-fade-in-up">
          <h1 className="text-3xl font-semibold mb-2">Settings</h1>
          <p className="text-text-secondary max-w-2xl">
            Manage your profile, preferences, API keys, billing, and workspace data.
          </p>
        </div>
      </div>

      {/* Horizontal tab bar */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="max-w-[1440px] mx-auto px-8 flex items-center gap-1 overflow-x-auto animate-fade-in-up [animation-delay:100ms]">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                activeTab === id
                  ? "text-success border-success"
                  : "text-text-secondary border-transparent hover:text-text-primary hover:border-border"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
          <button
            onClick={() => setActiveTab("danger")}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-[0.97] ml-auto border-l border-border pl-6 ${
              activeTab === "danger" ? "text-danger border-b-danger" : "text-danger/70 border-b-transparent hover:text-danger"
            }`}
          >
            <AlertTriangle size={16} />
            Danger Zone
          </button>
        </nav>
      </div>

      {/* Tab panel */}
      <main className="max-w-[800px] mx-auto p-8 lg:p-12">
        <div key={activeTab} className="space-y-6 animate-tab-in">
          {activeTab === "profile" && (
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
                        <div className="w-full h-full bg-success-bg flex items-center justify-center text-sm font-semibold text-success">
                          {getInitials(name || session?.user?.name, session?.user?.email)}
                        </div>
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
          )}

          {activeTab === "preferences" && (
            <section className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold">Preferences</h3>
                <p className="text-text-secondary">Customize your workspace experience.</p>
              </div>
              <Card className="p-0 divide-y divide-border">
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
                        className={`px-4 py-1 font-medium rounded-md capitalize cursor-pointer ${
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
                    className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${emailNotifications ? "bg-success" : "bg-border"}`}
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
          )}

          {activeTab === "api-keys" && (
            <>
              <section className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold">API Keys</h3>
                  <p className="text-text-secondary">Connect your own AI models for custom processing.</p>
                </div>
                <Card className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-text-primary/5 rounded-lg border border-border">
                        <KeyRound size={18} className="text-text-secondary" />
                      </div>
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

              <section className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold">Notion Integration</h3>
                  <p className="text-text-secondary">Export meeting summaries to your own Notion workspace instead of the shared default.</p>
                </div>
                <Card className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs text-text-secondary uppercase tracking-wider">Notion API Key</label>
                    <PasswordInput
                      value={notionApiKey}
                      onChange={(e) => setNotionApiKey(e.target.value)}
                      placeholder="ntn_..."
                    />
                    <p className="text-xs text-text-secondary">
                      <Link
                        href="https://developers.notion.com/docs/create-a-notion-integration"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-success hover:underline"
                      >
                        How to get your Notion API key?
                      </Link>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-secondary uppercase tracking-wider">Notion Database ID</label>
                    <Input
                      value={notionDatabaseId}
                      onChange={(e) => setNotionDatabaseId(e.target.value)}
                      placeholder="3ac0b40b15f58068bd31f9ec426efec5"
                    />
                  </div>
                </Card>
              </section>

              <section className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold">Slack Integration</h3>
                  <p className="text-text-secondary">Save a default webhook so exports pre-fill instead of asking every time.</p>
                </div>
                <Card className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs text-text-secondary uppercase tracking-wider">Slack Webhook URL</label>
                    <PasswordInput
                      value={slackWebhookUrl}
                      onChange={(e) => setSlackWebhookUrl(e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                    />
                    <p className="text-xs text-text-secondary">
                      <Link
                        href="https://api.slack.com/messaging/webhooks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-success hover:underline"
                      >
                        How to create a Slack incoming webhook?
                      </Link>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-secondary uppercase tracking-wider">Channel Name</label>
                    <Input
                      value={slackChannelName}
                      onChange={(e) => setSlackChannelName(e.target.value)}
                      placeholder="#général"
                    />
                    {/* Display-only -- Slack's webhook API returns no channel
                        metadata, so this just labels the saved connection and
                        names the channel in the export confirmation toast. */}
                    <p className="text-xs text-text-secondary">
                      Display only -- the webhook itself is already bound to a channel when you create it in Slack.
                    </p>
                  </div>
                </Card>
              </section>
            </>
          )}

          {activeTab === "billing" && (
            <section className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold">Billing</h3>
                <p className="text-text-secondary">Manage your plan and subscription.</p>
              </div>
              <Card className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-text-primary">
                    {plan === "PRO" ? "Pro plan" : "Free plan"}
                  </p>
                  {plan === "PRO" ? (
                    <p className="text-sm text-text-secondary">
                      {subscriptionStatus === "active" || subscriptionStatus === "trialing"
                        ? currentPeriodEnd
                          ? `Renews on ${new Date(currentPeriodEnd).toLocaleDateString()}`
                          : "Active subscription"
                        : `Status: ${subscriptionStatus || "unknown"}`}
                    </p>
                  ) : (
                    <p className="text-sm text-text-secondary">5 meetings/month, 30 min max, no exports.</p>
                  )}
                </div>
                {plan === "PRO" ? (
                  <Button variant="secondary" onClick={handleManageBilling} disabled={portalLoading}>
                    {portalLoading ? "Loading..." : "Manage billing"}
                  </Button>
                ) : (
                  <Link href="/pricing">
                    <Button variant="primary">Upgrade to Pro</Button>
                  </Link>
                )}
              </Card>
            </section>
          )}

          {activeTab === "danger" && (
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
          )}
        </div>

        {showSaveBar && (
          <div className="flex items-center justify-end gap-4 pt-8 mt-8 border-t border-border">
            {saved && <span className="text-sm text-success">Saved ✓</span>}
            <Button variant="primary" onClick={handleSave} disabled={saving || !session?.user?.id}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageContent />
    </Suspense>
  );
}
