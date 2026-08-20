"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { KeyRound, Webhook as WebhookIcon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ApiError,
  getMyWorkspaces,
  ACTIVE_WORKSPACE_KEY,
  getApiKeys,
  createApiKey,
  revokeApiKey,
  getWebhooks,
  createWebhook,
  deleteWebhook,
  type WorkspaceRole,
  type ApiKeySummary,
  type WebhookSubscriptionSummary,
} from "@/lib/api";
import { useDictionary } from "@/lib/i18n/locale-context";
import { developersDictionary } from "@/lib/i18n/dictionaries/developers";

function formatDate(value: string | null, neverLabel: string): string {
  if (!value) return neverLabel;
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/** Minimal modal shell shared by both "Create" flows on this page. */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <Card className="w-full max-w-[480px] bg-surface-high border-border p-0 overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4">{children}</div>
      </Card>
    </div>
  );
}

/** Shown once, right after a key/secret is created. Never persisted, never re-shown after a refresh. */
function RevealBanner({ label, value }: { label: string; value: string }) {
  const t = useDictionary(developersDictionary);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 space-y-2">
      <p className="text-sm font-medium text-warning flex items-center gap-2">
        <Lock size={14} />
        {t.revealCopyNow(label)}
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 min-w-0 truncate text-xs bg-background px-3 py-2 rounded-md border border-border">{value}</code>
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {copied ? t.copied : t.copy}
        </Button>
      </div>
    </div>
  );
}

export default function DevelopersPage() {
  const t = useDictionary(developersDictionary);
  const { data: session } = useSession();
  const [myRole, setMyRole] = useState<WorkspaceRole | null>(null);

  const [keys, setKeys] = useState<ApiKeySummary[]>([]);
  const [hooks, setHooks] = useState<WebhookSubscriptionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const [hookModalOpen, setHookModalOpen] = useState(false);
  const [hookUrl, setHookUrl] = useState("");
  const [creatingHook, setCreatingHook] = useState(false);
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [keyList, hookList, workspaces] = await Promise.all([getApiKeys(), getWebhooks(), getMyWorkspaces()]);
    setKeys(keyList);
    setHooks(hookList);

    const activeId = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
    const active = workspaces.find((w) => w.id === activeId) || workspaces[0];
    setMyRole(active?.role ?? null);
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    load()
      .catch(() => setError(t.errors.loadFailed))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, load]);

  const canManage = myRole === "OWNER" || myRole === "ADMIN";

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreatingKey(true);
    try {
      const { key } = await createApiKey(keyName.trim() || "Untitled key");
      setRevealedKey(key);
      setKeyModalOpen(false);
      setKeyName("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.errors.createKeyFailed);
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    setError("");
    try {
      await revokeApiKey(id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.errors.revokeKeyFailed);
    }
  };

  const handleCreateHook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!hookUrl.trim()) return;
    setCreatingHook(true);
    try {
      const { secret } = await createWebhook(hookUrl.trim());
      setRevealedSecret(secret);
      setHookModalOpen(false);
      setHookUrl("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.errors.createHookFailed);
    } finally {
      setCreatingHook(false);
    }
  };

  const handleDeleteHook = async (id: string) => {
    setError("");
    try {
      await deleteWebhook(id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.errors.deleteHookFailed);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-40%] left-[15%] w-[400px] h-[400px] bg-success/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 py-10 animate-fade-in-up">
          <h1 className="text-3xl font-semibold text-text-primary mb-1">{t.heroTitle}</h1>
          <p className="text-text-secondary">
            {t.heroSubtitle}
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto p-8 flex flex-col gap-12">
        {error && <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">{error}</p>}

        {/* API Keys */}
        <section className="flex flex-col gap-4 animate-fade-in-up [animation-delay:150ms]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <KeyRound size={16} className="text-text-secondary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">{t.apiKeys.title}</h2>
            </div>
            {canManage && (
              <Button variant="primary" size="sm" onClick={() => setKeyModalOpen(true)}>
                {t.apiKeys.createKey}
              </Button>
            )}
          </div>
          <p className="text-sm text-text-secondary -mt-2">
            {t.apiKeys.authHintPrefix} <code className="text-xs">/api/v1</code> {t.apiKeys.authHintWith}{" "}
            <code className="text-xs">Authorization: Bearer &lt;key&gt;</code>.
          </p>

          {revealedKey && <RevealBanner label={t.apiKeyLabel} value={revealedKey} />}

          {loading && <p className="text-sm text-text-secondary">{t.apiKeys.loading}</p>}

          {!loading && keys.length === 0 && (
            <Card className="p-10 flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-full bg-success-bg flex items-center justify-center text-success">
                <KeyRound size={18} />
              </div>
              <p className="text-sm text-text-secondary">{t.apiKeys.empty}</p>
            </Card>
          )}

          {keys.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keys.map((key) => (
                <Card key={key.id} className="p-5 flex flex-col justify-between min-h-[190px] hover:border-border-hover transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-lg bg-success-bg flex items-center justify-center text-success">
                        <KeyRound size={20} />
                      </div>
                      <Badge variant={key.lastUsedAt ? "success" : "neutral"}>
                        {key.lastUsedAt ? t.apiKeys.active : t.apiKeys.unused}
                      </Badge>
                    </div>
                    <h4 className="text-lg font-semibold mb-1 truncate">{key.name}</h4>
                    <p className="text-sm text-text-secondary font-mono mb-2">{key.keyPrefix}••••••••</p>
                    <p className="text-xs text-text-secondary mb-6">
                      {t.apiKeys.createdLastUsed(formatDate(key.createdAt, t.never), formatDate(key.lastUsedAt, t.never))}
                    </p>
                  </div>
                  {canManage && (
                    <Button variant="danger" size="sm" className="w-full" onClick={() => handleRevokeKey(key.id)}>
                      {t.apiKeys.revoke}
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Webhooks */}
        <section className="flex flex-col gap-4 animate-fade-in-up [animation-delay:300ms]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <WebhookIcon size={16} className="text-text-secondary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">{t.webhooks.title}</h2>
            </div>
            {canManage && (
              <Button variant="primary" size="sm" onClick={() => setHookModalOpen(true)}>
                {t.webhooks.createWebhook}
              </Button>
            )}
          </div>
          <p className="text-sm text-text-secondary -mt-2">
            {t.webhooks.hintPrefix} <code className="text-xs">meeting.completed</code> {t.webhooks.hintSuffix}
          </p>

          {revealedSecret && <RevealBanner label={t.signingSecretLabel} value={revealedSecret} />}

          {loading && <p className="text-sm text-text-secondary">{t.webhooks.loading}</p>}

          {!loading && hooks.length === 0 && (
            <Card className="p-10 flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-full bg-info-bg flex items-center justify-center text-info">
                <WebhookIcon size={18} />
              </div>
              <p className="text-sm text-text-secondary">{t.webhooks.empty}</p>
            </Card>
          )}

          {hooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hooks.map((hook) => (
                <Card key={hook.id} className="p-5 flex flex-col justify-between min-h-[190px] hover:border-border-hover transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-lg bg-info-bg flex items-center justify-center text-info">
                        <WebhookIcon size={20} />
                      </div>
                      <Badge variant={hook.active ? "success" : "neutral"}>
                        {hook.active ? t.webhooks.active : t.webhooks.inactive}
                      </Badge>
                    </div>
                    <h4 className="text-lg font-semibold mb-1 truncate" title={hook.url}>{hook.url}</h4>
                    <p className="text-sm text-text-secondary font-mono mb-2">{hook.event}</p>
                    <p className="text-xs text-text-secondary mb-6">{t.webhooks.created(formatDate(hook.createdAt, t.never))}</p>
                  </div>
                  {canManage && (
                    <Button variant="danger" size="sm" className="w-full" onClick={() => handleDeleteHook(hook.id)}>
                      {t.webhooks.remove}
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {keyModalOpen && (
        <Modal title={t.keyModal.title} onClose={() => setKeyModalOpen(false)}>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-text-secondary uppercase tracking-wider">{t.keyModal.nameLabel}</label>
              <Input
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder={t.keyModal.namePlaceholder}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setKeyModalOpen(false)}>
                {t.keyModal.cancel}
              </Button>
              <Button type="submit" variant="primary" disabled={creatingKey}>
                {creatingKey ? t.keyModal.creating : t.keyModal.create}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {hookModalOpen && (
        <Modal title={t.hookModal.title} onClose={() => setHookModalOpen(false)}>
          <form onSubmit={handleCreateHook} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-text-secondary uppercase tracking-wider">{t.hookModal.urlLabel}</label>
              <Input
                type="url"
                value={hookUrl}
                onChange={(e) => setHookUrl(e.target.value)}
                placeholder={t.hookModal.urlPlaceholder}
                required
                autoFocus
              />
              <p className="text-xs text-text-secondary">{t.hookModal.firesOn("meeting.completed")}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setHookModalOpen(false)}>
                {t.hookModal.cancel}
              </Button>
              <Button type="submit" variant="primary" disabled={creatingHook}>
                {creatingHook ? t.hookModal.creating : t.hookModal.create}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
