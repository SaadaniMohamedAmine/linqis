"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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

function formatDate(value: string | null): string {
  if (!value) return "Never";
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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 space-y-2">
      <p className="text-sm font-medium text-warning">Copy this {label} now -- you won&apos;t see it again.</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 min-w-0 truncate text-xs bg-background px-3 py-2 rounded-md border border-border">{value}</code>
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

export default function DevelopersPage() {
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
      .catch(() => setError("Could not load your developer settings."))
      .finally(() => setLoading(false));
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
      setError(err instanceof ApiError ? err.message : "Failed to create the API key.");
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
      setError(err instanceof ApiError ? err.message : "Failed to revoke this key.");
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
      setError(err instanceof ApiError ? err.message : "Failed to create the webhook.");
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
      setError(err instanceof ApiError ? err.message : "Failed to remove this webhook.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <section className="p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-[800px] mx-auto space-y-16">
          <div>
            <h3 className="text-2xl font-semibold">Developers</h3>
            <p className="text-text-secondary">
              Read-only REST API and outbound webhooks for building your own integrations on top of Linqis.
            </p>
          </div>

          {error && <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">{error}</p>}

          {/* API Keys */}
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold">API Keys</h4>
                <p className="text-sm text-text-secondary">
                  Authenticate requests to <code className="text-xs">/api/v1</code> with{" "}
                  <code className="text-xs">Authorization: Bearer &lt;key&gt;</code>.
                </p>
              </div>
              {canManage && (
                <Button variant="primary" size="sm" onClick={() => setKeyModalOpen(true)}>
                  Create key
                </Button>
              )}
            </div>

            {revealedKey && <RevealBanner label="API key" value={revealedKey} />}

            <Card className="divide-y divide-border">
              {loading && <p className="p-6 text-sm text-text-secondary">Loading keys…</p>}
              {!loading && keys.length === 0 && <p className="p-6 text-sm text-text-secondary">No API keys yet.</p>}
              {keys.map((key) => (
                <div key={key.id} className="p-6 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{key.name}</p>
                    <p className="text-sm text-text-secondary font-mono">
                      {key.keyPrefix}••••••••
                    </p>
                    <p className="text-xs text-text-secondary">
                      Created {formatDate(key.createdAt)} · Last used {formatDate(key.lastUsedAt)}
                    </p>
                  </div>
                  {canManage && (
                    <Button variant="danger" size="sm" onClick={() => handleRevokeKey(key.id)}>
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </Card>
          </section>

          {/* Webhooks */}
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold">Webhooks</h4>
                <p className="text-sm text-text-secondary">
                  Get a signed <code className="text-xs">meeting.completed</code> POST whenever a meeting finishes processing.
                </p>
              </div>
              {canManage && (
                <Button variant="primary" size="sm" onClick={() => setHookModalOpen(true)}>
                  Create webhook
                </Button>
              )}
            </div>

            {revealedSecret && <RevealBanner label="signing secret" value={revealedSecret} />}

            <Card className="divide-y divide-border">
              {loading && <p className="p-6 text-sm text-text-secondary">Loading webhooks…</p>}
              {!loading && hooks.length === 0 && <p className="p-6 text-sm text-text-secondary">No webhooks yet.</p>}
              {hooks.map((hook) => (
                <div key={hook.id} className="p-6 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{hook.url}</p>
                    <p className="text-xs text-text-secondary">
                      {hook.event} · {hook.active ? "Active" : "Inactive"} · Created {formatDate(hook.createdAt)}
                    </p>
                  </div>
                  {canManage && (
                    <Button variant="danger" size="sm" onClick={() => handleDeleteHook(hook.id)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </Card>
          </section>
        </div>
      </section>

      {keyModalOpen && (
        <Modal title="Create API key" onClose={() => setKeyModalOpen(false)}>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-text-secondary uppercase tracking-wider">Name</label>
              <Input
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. CI pipeline"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setKeyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={creatingKey}>
                {creatingKey ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {hookModalOpen && (
        <Modal title="Create webhook" onClose={() => setHookModalOpen(false)}>
          <form onSubmit={handleCreateHook} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-text-secondary uppercase tracking-wider">Endpoint URL</label>
              <Input
                type="url"
                value={hookUrl}
                onChange={(e) => setHookUrl(e.target.value)}
                placeholder="https://example.com/webhooks/linqis"
                required
                autoFocus
              />
              <p className="text-xs text-text-secondary">Fires on {"meeting.completed"}.</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setHookModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={creatingHook}>
                {creatingHook ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
