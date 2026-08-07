"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ZoomImportModal } from "@/components/zoom-import-modal";
import {
  getIntegrationStatus,
  getGoogleCalendarAuthUrl,
  getMyWorkspaces,
  ACTIVE_WORKSPACE_KEY,
  type IntegrationStatus,
  type WorkspaceRole,
} from "@/lib/api";

export default function IntegrationsPage() {
  const { data: session } = useSession();
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [myRole, setMyRole] = useState<WorkspaceRole | null>(null);

  useEffect(() => {
    if (session?.user?.id) getIntegrationStatus().then(setIntegrations);
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id) return;
    getMyWorkspaces()
      .then((workspaces) => {
        const activeId = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
        const active = workspaces.find((w) => w.id === activeId) || workspaces[0];
        setMyRole(active?.role ?? null);
      })
      .catch(() => setMyRole(null));
  }, [session?.user?.id]);

  const isConnected = (provider: string) => integrations.some((i) => i.provider === provider);

  const handleConnectGoogleCalendar = async () => {
    const { authUrl } = await getGoogleCalendarAuthUrl();
    window.location.href = authUrl;
  };

  const zoomConfigured = process.env.NEXT_PUBLIC_ZOOM_ENABLED === "true";

  // The Zoom integration is a single account-wide Server-to-Server OAuth app
  // configured by the operator -- there is no per-user or per-workspace Zoom
  // credential. Browsing it therefore exposes the operator's entire recording
  // library, so it's gated to owners/admins like the Developers page is,
  // rather than shown to every member of every workspace.
  const canBrowseZoom = myRole === "OWNER" || myRole === "ADMIN";

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <main className="p-8 max-w-[1440px] mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold mb-2">Connected Workspace</h1>
          <p className="text-text-secondary max-w-2xl">Streamline your workflow by connecting your essential productivity tools. AI summaries will automatically sync to your calendar and communication channels.</p>
        </header>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Google Calendar */}
          <Card className="p-5 hover:border-border-hover transition-all flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center">
                  <span className="text-success text-2xl" />
                </div>
                <Badge variant={isConnected("google-calendar") ? "success" : "neutral"}>
                  {isConnected("google-calendar") ? "Active" : "Not Linked"}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-1">Google Calendar</h3>
              <p className="text-sm text-text-secondary mb-6">Automatically fetch meeting details and update schedule statuses.</p>
            </div>
            {isConnected("google-calendar") ? (
              <Button variant="secondary" className="w-full" disabled>Connected</Button>
            ) : (
              <Button variant="primary" className="w-full" onClick={handleConnectGoogleCalendar}>Connect Google Calendar</Button>
            )}
          </Card>

          {/* Zoom */}
          <Card className="p-5 hover:border-border-hover transition-all flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center">
                  <span className="text-info text-2xl" />
                </div>
                <Badge variant={zoomConfigured ? "success" : "neutral"}>
                  {zoomConfigured ? "Configured via environment" : "Not configured"}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-1">Zoom</h3>
              <p className="text-sm text-text-secondary mb-6">Record meetings directly and generate AI transcripts in real-time.</p>
            </div>
            {zoomConfigured && canBrowseZoom && (
              <Button variant="secondary" className="w-full" onClick={() => setZoomModalOpen(true)}>Browse recordings</Button>
            )}
          </Card>

          {/* Notion */}
          <Card className="p-5 hover:border-border-hover transition-all flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center">
                  <span className="text-text-primary text-2xl" />
                </div>
                <Badge variant="neutral">Configured via export</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-1">Notion</h3>
              <p className="text-sm text-text-secondary mb-6">Sync meeting summaries and action items to your workspace databases.</p>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="secondary" className="w-full">Configure in Settings</Button>
            </Link>
          </Card>

          {/* Slack */}
          <Card className="p-5 hover:border-border-hover transition-all flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center">
                  <span className="text-warning text-2xl" />
                </div>
                <Badge variant="neutral">Configured via export</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-1">Slack</h3>
              <p className="text-sm text-text-secondary mb-6">Push summaries to designated channels and tag participants.</p>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="secondary" className="w-full">Configure in Settings</Button>
            </Link>
          </Card>
        </div>

        {/* Developer / API Section */}
        <section className="mt-12 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-4">Custom Webhooks</h2>
                <p className="text-text-secondary mb-8 max-w-lg">Build your own workflows. Send Linqis data to any endpoint using our high-performance REST API and secure webhooks.</p>
                <div className="flex gap-4">
                  <Link href="/dashboard/developers">
                    <Button variant="primary">Manage API Keys</Button>
                  </Link>
                  <Link href="/dashboard/developers">
                    <Button variant="secondary">Webhooks</Button>
                  </Link>
                </div>
              </div>
              <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-success opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity"></div>
            </Card>
            <Card className="lg:col-span-4 p-8 flex flex-col justify-center text-center bg-surface/80 backdrop-blur-md">
              <span className="text-warning text-5xl mb-4 mx-auto"></span>
              <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
              <p className="text-sm text-text-secondary">All integrations use OAuth 2.0 with end-to-end encryption for your workspace data.</p>
            </Card>
          </div>
        </section>
      </main>

      <ZoomImportModal isOpen={zoomModalOpen} onClose={() => setZoomModalOpen(false)} />
    </div>
  );
}
