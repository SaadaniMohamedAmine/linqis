import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getPrisma } from "@/lib/db";
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

  const prisma = getPrisma();

  // The Stripe customer represents the workspace, not the person paying --
  // that's what lets ownership change without losing the subscription.
  let customerId = workspace.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email || undefined,
      metadata: { workspaceId: workspace.id },
    });
    customerId = customer.id;
    await prisma.workspace.update({ where: { id: workspace.id }, data: { stripeCustomerId: customerId } });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${baseUrl}/dashboard/settings?upgraded=1`,
    cancel_url: `${baseUrl}/pricing`,
    metadata: { workspaceId: workspace.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
