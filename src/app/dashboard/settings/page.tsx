"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, SlidersHorizontal, KeyRound, CreditCard, AlertTriangle } from "lucide-react";
import { SiNotion } from "react-icons/si";
import { FaSlack } from "react-icons/fa";
import { RiOpenaiFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/toast-provider";
import { ACTIVE_WORKSPACE_KEY, getUser, updateUser, type UserProfile } from "@/lib/api";
import { getInitials } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-context";
import { settingsDictionary } from "@/lib/i18n/dictionaries/settings";

const SUMMARY_LENGTHS: UserProfile["summaryLength"][] = ["CONCISE", "STANDARD", "DETAILED"];

type TabId = "profile" | "preferences" | "api-keys" | "billing" | "danger";

function SettingsPageContent() {
  const t = useDictionary(settingsDictionary);
  const TABS: { id: TabId; label: string; icon: typeof User }[] = [
    { id: "profile", label: t.tabs.profile, icon: User },
    { id: "preferences", label: t.tabs.preferences, icon: SlidersHorizontal },
    { id: "api-keys", label: t.tabs.apiKeys, icon: KeyRound },
    { id: "billing", label: t.tabs.billing, icon: CreditCard },
  ];
  const { data: session } = useSession();
  // Integrations page links here with ?tab=api-keys so "Configure in
  // Settings" lands directly on the Notion/Slack fields instead of dumping
  // the user on Profile and making them find the right tab themselves.
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TabId>(
    TABS.some((tab) => tab.id === requestedTab) ? (requestedTab as TabId) : "profile"
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
  // Which API Keys card's setup modal is open, if any -- each card now
  // configures its own integration instead of one big always-visible form.
  const [activeModal, setActiveModal] = useState<"notion" | "slack" | null>(null);
  const [notionSaving, setNotionSaving] = useState(false);
  const [slackSaving, setSlackSaving] = useState(false);
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
      await updateUser({ name, summaryLength, emailNotifications });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      showToast(t.toasts.settingsSaved);
    } finally {
      setSaving(false);
    }
  };

  // Each API Keys card now saves itself from its own modal instead of
  // sharing the bottom Save bar, so its payload only ever touches its own
  // fields -- opening Notion's modal can no longer clobber an unsaved Slack
  // edit sitting in the other field, and vice versa.
  const closeNotionModal = () => {
    setNotionApiKey(savedNotion.apiKey);
    setNotionDatabaseId(savedNotion.databaseId);
    setActiveModal(null);
  };
  const closeSlackModal = () => {
    setSlackWebhookUrl(savedSlack.webhookUrl);
    setSlackChannelName(savedSlack.channelName);
    setActiveModal(null);
  };

  const handleSaveNotion = async () => {
    if (!session?.user?.id) return;
    setNotionSaving(true);
    try {
      await updateUser({ notionApiKey, notionDatabaseId });
      setSavedNotion({ apiKey: notionApiKey, databaseId: notionDatabaseId });
      showToast(t.toasts.notionSaved);
      setActiveModal(null);
    } finally {
      setNotionSaving(false);
    }
  };

  const handleSaveSlack = async () => {
    if (!session?.user?.id) return;
    setSlackSaving(true);
    try {
      await updateUser({ slackWebhookUrl, slackChannelName });
      setSavedSlack({ webhookUrl: slackWebhookUrl, channelName: slackChannelName });
      showToast(t.toasts.slackSaved);
      setActiveModal(null);
    } finally {
      setSlackSaving(false);
    }
  };

  const notionConnected = !!savedNotion.apiKey && !!savedNotion.databaseId;
  const slackConnected = !!savedSlack.webhookUrl;

  const showSaveBar = activeTab === "profile" || activeTab === "preferences";

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-40%] left-[20%] w-[450px] h-[450px] bg-success/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-fade-in-up">
          <h1 className="text-3xl font-semibold mb-2">{t.heroTitle}</h1>
          <p className="text-text-secondary max-w-2xl">
            {t.heroSubtitle}
          </p>
        </div>
      </div>

      {/* Horizontal tab bar */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center gap-1 overflow-x-auto animate-fade-in-up [animation-delay:100ms]">
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
            {t.tabs.dangerZone}
          </button>
        </nav>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent sm:hidden" />
      </div>

      {/* Tab panel */}
      {/* API Keys renders a card grid like the Integrations page, which
          needs real room to breathe -- the other tabs are narrow forms and
          stay at the original width. */}
      <main className={`mx-auto p-4 sm:p-8 lg:p-12 ${activeTab === "api-keys" ? "max-w-[1100px]" : "max-w-[800px]"}`}>
        <div key={activeTab} className="space-y-6 animate-tab-in">
          {activeTab === "profile" && (
            <section className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold">{t.profile.title}</h3>
                <p className="text-text-secondary">{t.profile.subtitle}</p>
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
                    <h4 className="text-lg font-semibold">{name || t.profile.noName}</h4>
                    <p className="text-sm text-text-secondary">{session?.user?.email}</p>
                    <div className="mt-4 flex gap-2">
                      <Button variant="primary" size="sm">{t.profile.uploadNew}</Button>
                      <Button variant="secondary" size="sm">{t.profile.remove}</Button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-text-secondary uppercase tracking-wider">{t.profile.fullNameLabel}</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-secondary uppercase tracking-wider">{t.profile.emailLabel}</label>
                    <Input value={session?.user?.email || ""} type="email" disabled />
                  </div>
                </div>
              </Card>
            </section>
          )}

          {activeTab === "preferences" && (
            <section className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold">{t.preferences.title}</h3>
                <p className="text-text-secondary">{t.preferences.subtitle}</p>
              </div>
              <Card className="p-0 divide-y divide-border">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{t.preferences.summaryLengthTitle}</p>
                    <p className="text-sm text-text-secondary">{t.preferences.summaryLengthDesc}</p>
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
                        {t.preferences.summaryOptions[length.toLowerCase() as "concise" | "standard" | "detailed"]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{t.preferences.emailNotifTitle}</p>
                    <p className="text-sm text-text-secondary">{t.preferences.emailNotifDesc}</p>
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
            <section className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold">{t.apiKeys.title}</h3>
                <p className="text-text-secondary">{t.apiKeys.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* OpenAI -- not wired to a real field yet, shown for parity
                    with the Integrations page but intentionally inert. */}
                <Card className="p-5 flex flex-col justify-between min-h-[220px] opacity-60">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-lg bg-text-primary/5 flex items-center justify-center text-text-secondary">
                        <RiOpenaiFill size={22} />
                      </div>
                      <Badge variant="neutral">{t.apiKeys.notConfigured}</Badge>
                    </div>
                    <h4 className="text-lg font-semibold mb-1">{t.apiKeys.openaiTitle}</h4>
                    <p className="text-sm text-text-secondary mb-6">{t.apiKeys.openaiDesc}</p>
                  </div>
                  <Button variant="secondary" className="w-full" disabled>{t.apiKeys.comingSoon}</Button>
                </Card>

                {/* Notion */}
                <Card className="p-5 flex flex-col justify-between min-h-[220px] hover:border-border-hover transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-high flex items-center justify-center text-text-primary">
                        <SiNotion size={20} />
                      </div>
                      <Badge variant={notionConnected ? "success" : "neutral"}>
                        {notionConnected ? t.apiKeys.connected : t.apiKeys.notConfigured}
                      </Badge>
                    </div>
                    <h4 className="text-lg font-semibold mb-1">{t.apiKeys.notionTitle}</h4>
                    <p className="text-sm text-text-secondary mb-6">{t.apiKeys.notionDesc}</p>
                  </div>
                  <Button variant="secondary" className="w-full" onClick={() => setActiveModal("notion")}>
                    {notionConnected ? t.apiKeys.updateConnection : t.apiKeys.setupIntegration}
                  </Button>
                </Card>

                {/* Slack */}
                <Card className="p-5 flex flex-col justify-between min-h-[220px] hover:border-border-hover transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-lg bg-warning-bg flex items-center justify-center text-warning">
                        <FaSlack size={20} />
                      </div>
                      <Badge variant={slackConnected ? "success" : "neutral"}>
                        {slackConnected
                          ? `${t.apiKeys.connected}${savedSlack.channelName ? ` · ${savedSlack.channelName.startsWith("#") ? savedSlack.channelName : `#${savedSlack.channelName}`}` : ""}`
                          : t.apiKeys.notConfigured}
                      </Badge>
                    </div>
                    <h4 className="text-lg font-semibold mb-1">{t.apiKeys.slackTitle}</h4>
                    <p className="text-sm text-text-secondary mb-6">{t.apiKeys.slackDesc}</p>
                  </div>
                  <Button variant="secondary" className="w-full" onClick={() => setActiveModal("slack")}>
                    {slackConnected ? t.apiKeys.updateConnection : t.apiKeys.setupIntegration}
                  </Button>
                </Card>
              </div>
            </section>
          )}

          {activeTab === "billing" && (
            <section className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold">{t.billing.title}</h3>
                <p className="text-text-secondary">{t.billing.subtitle}</p>
              </div>
              <Card className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-text-primary">
                    {plan === "PRO" ? t.billing.proPlan : t.billing.freePlan}
                  </p>
                  {plan === "PRO" ? (
                    <p className="text-sm text-text-secondary">
                      {subscriptionStatus === "active" || subscriptionStatus === "trialing"
                        ? currentPeriodEnd
                          ? t.billing.renewsOn(new Date(currentPeriodEnd).toLocaleDateString())
                          : t.billing.activeSubscription
                        : t.billing.statusLabel(subscriptionStatus || t.billing.unknownStatus)}
                    </p>
                  ) : (
                    <p className="text-sm text-text-secondary">{t.billing.freeLimits}</p>
                  )}
                </div>
                {plan === "PRO" ? (
                  <Button variant="secondary" onClick={handleManageBilling} disabled={portalLoading}>
                    {portalLoading ? t.billing.loading : t.billing.manageBilling}
                  </Button>
                ) : (
                  <Link href="/pricing">
                    <Button variant="primary">{t.billing.upgradeToPro}</Button>
                  </Link>
                )}
              </Card>
            </section>
          )}

          {activeTab === "danger" && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-danger">
                <h3 className="text-2xl font-semibold">{t.danger.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-danger/30 bg-danger/5 p-6 space-y-4 hover:border-danger transition-colors">
                  <h4 className="text-lg font-semibold text-danger">{t.danger.clearDataTitle}</h4>
                  <p className="text-sm text-text-secondary">{t.danger.clearDataDesc}</p>
                  <Button variant="danger" className="w-full">{t.danger.wipeButton}</Button>
                </Card>
                <Card className="border-danger/30 bg-danger/5 p-6 space-y-4 hover:border-danger transition-colors">
                  <h4 className="text-lg font-semibold text-danger">{t.danger.deleteAccountTitle}</h4>
                  <p className="text-sm text-text-secondary">{t.danger.deleteAccountDesc}</p>
                  <Button variant="danger" className="w-full">{t.danger.deleteButton}</Button>
                </Card>
              </div>
            </section>
          )}
        </div>

        {showSaveBar && (
          <div className="flex items-center justify-end gap-4 pt-8 mt-8 border-t border-border">
            {saved && <span className="text-sm text-success">{t.saveBar.saved}</span>}
            <Button variant="primary" onClick={handleSave} disabled={saving || !session?.user?.id}>
              {saving ? t.saveBar.saving : t.saveBar.saveChanges}
            </Button>
          </div>
        )}
      </main>

      {activeModal === "notion" && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-surface-high border border-border rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-1">{t.notionModal.title}</h2>
                <p className="text-sm text-text-secondary">{t.notionModal.description}</p>
              </div>
              <button onClick={closeNotionModal} className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer">✕</button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-xs text-text-secondary uppercase tracking-wider">{t.notionModal.apiKeyLabel}</label>
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
                    {t.notionModal.apiKeyHelp}
                  </Link>
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-text-secondary uppercase tracking-wider">{t.notionModal.databaseIdLabel}</label>
                <Input
                  value={notionDatabaseId}
                  onChange={(e) => setNotionDatabaseId(e.target.value)}
                  placeholder="3ac0b40b15f58068bd31f9ec426efec5"
                />
              </div>
            </div>
            <div className="p-6 bg-surface-low border-t border-border flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={closeNotionModal} disabled={notionSaving}>{t.notionModal.cancel}</Button>
              <Button variant="primary" className="flex-1" onClick={handleSaveNotion} disabled={notionSaving}>
                {notionSaving ? t.saveBar.saving : t.saveBar.saveChanges}
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "slack" && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-surface-high border border-border rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-1">{t.slackModal.title}</h2>
                <p className="text-sm text-text-secondary">{t.slackModal.description}</p>
              </div>
              <button onClick={closeSlackModal} className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer">✕</button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-xs text-text-secondary uppercase tracking-wider">{t.slackModal.webhookLabel}</label>
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
                    {t.slackModal.webhookHelp}
                  </Link>
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-text-secondary uppercase tracking-wider">{t.slackModal.channelLabel}</label>
                <Input
                  value={slackChannelName}
                  onChange={(e) => setSlackChannelName(e.target.value)}
                  placeholder="#général"
                />
                {/* Display-only -- Slack's webhook API returns no channel
                    metadata, so this just labels the saved connection and
                    names the channel in the export confirmation toast. */}
                <p className="text-xs text-text-secondary">
                  {t.slackModal.channelHelpText}
                </p>
              </div>
            </div>
            <div className="p-6 bg-surface-low border-t border-border flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={closeSlackModal} disabled={slackSaving}>{t.slackModal.cancel}</Button>
              <Button variant="primary" className="flex-1" onClick={handleSaveSlack} disabled={slackSaving}>
                {slackSaving ? t.saveBar.saving : t.saveBar.saveChanges}
              </Button>
            </div>
          </div>
        </div>
      )}
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
