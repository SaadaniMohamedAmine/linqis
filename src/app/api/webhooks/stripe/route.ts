import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getPrisma } from "@/lib/db";

// This API version moved current_period_end from the subscription itself
// down to each subscription item (to support multiple prices with
// different billing periods per subscription). We only ever create
// single-price subscriptions, so the first item's period is the one that
// matters.
function getPeriodEnd(subscription: Stripe.Subscription): Date | null {
  const end = subscription.items.data[0]?.current_period_end;
  return end ? new Date(end * 1000) : null;
}

// Next.js App Router route handlers receive the raw body via request.text() --
// required here because Stripe verifies the signature on the EXACT payload,
// not a re-serialized one.
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const prisma = getPrisma();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "PRO",
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: getPeriodEnd(subscription),
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const user = await prisma.user.findUnique({ where: { stripeCustomerId: subscription.customer as string } });
      if (user) {
        const isActive = ["active", "trialing"].includes(subscription.status);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: isActive ? "PRO" : "FREE",
            subscriptionStatus: subscription.status,
            currentPeriodEnd: getPeriodEnd(subscription),
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const user = await prisma.user.findUnique({ where: { stripeCustomerId: subscription.customer as string } });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { plan: "FREE", subscriptionStatus: "canceled", stripeSubscriptionId: null },
        });
      }
      break;
    }

    default:
      // Unhandled event, deliberately ignored.
      break;
  }

  return NextResponse.json({ received: true });
}
