import { createHmac } from "crypto";
import { getPrisma } from "../db";

export async function triggerWebhooks(workspaceId: string, event: string, payload: Record<string, unknown>) {
  const prisma = getPrisma();
  const hooks = await prisma.webhookSubscription.findMany({
    where: { workspaceId, event, active: true },
  });

  for (const hook of hooks) {
    const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });
    const signature = createHmac("sha256", hook.secret).update(body).digest("hex");

    // Fire-and-forget, non-blocking -- a webhook that fails to deliver must
    // never fail the meeting processing job itself.
    fetch(hook.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Linqis-Signature": signature },
      body,
    }).catch((err) => console.error(`Webhook delivery failed for ${hook.url}:`, err));
  }
}
