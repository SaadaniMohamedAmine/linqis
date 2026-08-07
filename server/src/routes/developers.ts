import { Router } from "express";
import { randomBytes } from "crypto";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";
import { requireWorkspaceAdmin } from "../middleware/auth";
import { generateApiKey } from "../services/api-keys";
// Shared with the Slack export sink (routes/exports.ts) -- both take a URL
// from the client and fetch it server-side, so both need the same guard.
import { webhookUrlError } from "../lib/safe-url";

export const router = Router();

// Visible to any workspace member -- knowing a key exists (name, prefix,
// last used) isn't sensitive; only the raw key value is, and that's never
// stored so it can't be returned here.
router.get("/api-keys", async (req: AuthedRequest, res) => {
  try {
    const prisma = getPrisma();
    const keys = await prisma.apiKey.findMany({
      where: { workspaceId: req.workspaceId },
      select: { id: true, name: true, keyPrefix: true, lastUsedAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(keys);
  } catch (error) {
    console.error("Failed to fetch API keys:", error);
    res.status(500).json({ error: "Failed to fetch API keys" });
  }
});

router.post("/api-keys", requireWorkspaceAdmin, async (req: AuthedRequest, res) => {
  try {
    const { name } = req.body as { name?: string };
    const { fullKey, prefix, hash } = generateApiKey();
    const prisma = getPrisma();
    await prisma.apiKey.create({
      data: { workspaceId: req.workspaceId!, name: name || "Untitled key", keyHash: hash, keyPrefix: prefix },
    });
    // The key in cleartext is only ever returned here, once -- never stored anywhere.
    res.status(201).json({ key: fullKey });
  } catch (error) {
    console.error("Failed to create API key:", error);
    res.status(500).json({ error: "Failed to create API key" });
  }
});

router.delete("/api-keys/:id", requireWorkspaceAdmin, async (req: AuthedRequest<{ id: string }>, res) => {
  try {
    const prisma = getPrisma();
    const key = await prisma.apiKey.findUnique({ where: { id: req.params.id } });
    if (!key || key.workspaceId !== req.workspaceId) return res.status(404).json({ error: "Key not found" });
    await prisma.apiKey.delete({ where: { id: key.id } });
    res.json({ status: "revoked" });
  } catch (error) {
    console.error("Failed to revoke API key:", error);
    res.status(500).json({ error: "Failed to revoke API key" });
  }
});

router.get("/webhooks", async (req: AuthedRequest, res) => {
  try {
    const prisma = getPrisma();
    const hooks = await prisma.webhookSubscription.findMany({ where: { workspaceId: req.workspaceId } });
    // The secret is only ever returned at creation time -- never on subsequent reads.
    res.json(hooks.map((h) => ({ ...h, secret: undefined })));
  } catch (error) {
    console.error("Failed to fetch webhooks:", error);
    res.status(500).json({ error: "Failed to fetch webhooks" });
  }
});

router.post("/webhooks", requireWorkspaceAdmin, async (req: AuthedRequest, res) => {
  try {
    const { url } = req.body as { url?: string };
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "url is required" });
    }
    const urlError = webhookUrlError(url);
    if (urlError) {
      return res.status(400).json({ error: urlError });
    }
    const secret = randomBytes(24).toString("hex");
    const prisma = getPrisma();
    const hook = await prisma.webhookSubscription.create({
      data: { workspaceId: req.workspaceId!, url, secret, event: "meeting.completed" },
    });
    res.status(201).json({ id: hook.id, url: hook.url, secret }); // the secret is only shown here
  } catch (error) {
    console.error("Failed to create webhook:", error);
    res.status(500).json({ error: "Failed to create webhook" });
  }
});

router.delete("/webhooks/:id", requireWorkspaceAdmin, async (req: AuthedRequest<{ id: string }>, res) => {
  try {
    const prisma = getPrisma();
    const hook = await prisma.webhookSubscription.findUnique({ where: { id: req.params.id } });
    if (!hook || hook.workspaceId !== req.workspaceId) return res.status(404).json({ error: "Webhook not found" });
    await prisma.webhookSubscription.delete({ where: { id: hook.id } });
    res.json({ status: "removed" });
  } catch (error) {
    console.error("Failed to remove webhook:", error);
    res.status(500).json({ error: "Failed to remove webhook" });
  }
});
