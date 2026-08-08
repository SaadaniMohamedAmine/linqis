"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Calendar, Video, FileText, MessageSquare, Webhook, ShieldCheck } from "lucide-react";
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
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-40%] left-[20%] w-[450px] h-[450px] bg-success/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 py-10 animate-fade-in-up">
          <h1 className="text-3xl font-semibold mb-2">Connected Workspace</h1>
          <p className="text-text-secondary max-w-2xl">
            Streamline your workflow by connecting your essential productivity tools. AI summaries will automatically sync to your calendar and communication channels.
          </p>
        </div>
      </div>

      <main className="p-8 max-w-[1440px] mx-auto">
        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up [animation-delay:150ms]">
          {/* Google Calendar */}
          <Card className="p-5 relative overflow-hidden group hover:border-border-hover transition-all flex flex-col justify-between min-h-[220px]">
            <div className="absolute right-[-20%] top-[-30%] w-32 h-32 bg-success/5 rounded-full blur-2xl group-hover:bg-success/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-success-bg flex items-center justify-center text-success">
                  <Calendar size={22} />
                </div>
                <Badge variant={isConnected("google-calendar") ? "success" : "neutral"}>
                  {isConnected("google-calendar") ? "Active" : "Not Linked"}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-1">Google Calendar</h3>
              <p className="text-sm text-text-secondary mb-6">Automatically fetch meeting details and update schedule statuses.</p>
            </div>
            {isConnected("google-calendar") ? (
              <Button variant="secondary" className="relative z-10 w-full" disabled>Connected</Button>
            ) : (
              <Button variant="primary" className="relative z-10 w-full" onClick={handleConnectGoogleCalendar}>Connect Google Calendar</Button>
            )}
          </Card>

          {/* Zoom */}
          <Card className="p-5 relative overflow-hidden group hover:border-border-hover transition-all flex flex-col justify-between min-h-[220px]">
            <div className="absolute right-[-20%] top-[-30%] w-32 h-32 bg-info/5 rounded-full blur-2xl group-hover:bg-info/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-info-bg flex items-center justify-center text-info">
                  <Video size={22} />
                </div>
                <Badge variant={zoomConfigured ? "success" : "neutral"}>
                  {zoomConfigured ? "Configured via environment" : "Not configured"}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-1">Zoom</h3>
              <p className="text-sm text-text-secondary mb-6">Record meetings directly and generate AI transcripts in real-time.</p>
            </div>
            {zoomConfigured && canBrowseZoom && (
              <Button variant="secondary" className="relative z-10 w-full" onClick={() => setZoomModalOpen(true)}>Browse recordings</Button>
            )}
          </Card>

          {/* Notion */}
          <Card className="p-5 relative overflow-hidden group hover:border-border-hover transition-all flex flex-col justify-between min-h-[220px]">
            <div className="absolute right-[-20%] top-[-30%] w-32 h-32 bg-text-primary/5 rounded-full blur-2xl group-hover:bg-text-primary/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-surface-high flex items-center justify-center text-text-primary">
                  <FileText size={22} />
                </div>
                <Badge variant="neutral">Configured via export</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-1">Notion</h3>
              <p className="text-sm text-text-secondary mb-6">Sync meeting summaries and action items to your workspace databases.</p>
            </div>
            <Link href="/dashboard/settings" className="relative z-10">
              <Button variant="secondary" className="w-full">Configure in Settings</Button>
            </Link>
          </Card>

          {/* Slack */}
          <Card className="p-5 relative overflow-hidden group hover:border-border-hover transition-all flex flex-col justify-between min-h-[220px]">
            <div className="absolute right-[-20%] top-[-30%] w-32 h-32 bg-warning/5 rounded-full blur-2xl group-hover:bg-warning/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-warning-bg flex items-center justify-center text-warning">
                  <MessageSquare size={22} />
                </div>
                <Badge variant="neutral">Configured via export</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-1">Slack</h3>
              <p className="text-sm text-text-secondary mb-6">Push summaries to designated channels and tag participants.</p>
            </div>
            <Link href="/dashboard/settings" className="relative z-10">
              <Button variant="secondary" className="w-full">Configure in Settings</Button>
            </Link>
          </Card>
        </div>

        {/* Developer / API Section */}
        <section className="mt-12 mb-8 animate-fade-in-up [animation-delay:300ms]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-lg bg-success-bg flex items-center justify-center text-success mb-4">
                  <Webhook size={20} />
                </div>
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
            <Card className="lg:col-span-4 p-8 flex flex-col items-center justify-center text-center bg-surface/80 backdrop-blur-md">
              <div className="w-14 h-14 rounded-full bg-warning-bg flex items-center justify-center text-warning mb-4">
                <ShieldCheck size={26} />
              </div>
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
