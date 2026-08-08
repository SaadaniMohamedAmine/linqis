import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { canManageBilling, resolveWorkspaceForUser } from "@/lib/workspace";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const resolved = await resolveWorkspaceForUser(session.user.id, body?.workspaceId);
  if (!resolved) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const { workspace, role } = resolved;
  if (!canManageBilling(role)) {
    return NextResponse.json({ error: "Only workspace owners and admins can manage billing" }, { status: 403 });
  }

  if (!workspace.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account found" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: workspace.stripeCustomerId,
    return_url: `${baseUrl}/dashboard/settings`,
  });

  return NextResponse.json({ url: portalSession.url });
}
