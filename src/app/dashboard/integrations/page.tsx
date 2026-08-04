"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getIntegrationStatus, getGoogleCalendarAuthUrl, type IntegrationStatus } from "@/lib/api";

export default function IntegrationsPage() {
  const { data: session } = useSession();
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);

  useEffect(() => {
    if (session?.user?.id) getIntegrationStatus().then(setIntegrations);
  }, [session?.user?.id]);

  const isConnected = (provider: string) => integrations.some((i) => i.provider === provider);

  const handleConnectGoogleCalendar = async () => {
    const { authUrl } = await getGoogleCalendarAuthUrl();
    window.location.href = authUrl;
  };

  const zoomConfigured = process.env.NEXT_PUBLIC_ZOOM_ENABLED === "true";

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col w-[260px] border-r border-border p-4 gap-2 sticky top-16 h-[calc(100vh-64px)] bg-background">
        <div className="mb-4 px-2">
          <h2 className="text-lg font-semibold text-text-primary">Meeting List</h2>
          <p className="text-sm text-text-secondary">AI-summarized sessions</p>
        </div>
        <Button variant="primary" className="w-full gap-2 mb-4">
          New Meeting
        </Button>
        <nav className="flex flex-col gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg transition-all">
            <span className="font-medium">Overview</span>
          </Link>
          <Link href="/dashboard/meetings" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg transition-all">
            <span className="font-medium">Recent Meetings</span>
          </Link>
          <Link href="/dashboard/action-items" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface/50 rounded-lg transition-all">
            <span className="font-medium">Action Items</span>
          </Link>
          <Link href="/dashboard/integrations" className="flex items-center gap-3 px-3 py-2 bg-surface text-success rounded-lg transition-all">
            <span className="font-medium">Integrations</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[260px] p-8 max-w-[1440px]">
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
                  <Button variant="primary">View Documentation</Button>
                  <Button variant="secondary">API Keys</Button>
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
    </div>
  );
}
