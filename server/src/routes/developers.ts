import { Router } from "express";
import { randomBytes } from "crypto";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";
import { requireWorkspaceAdmin } from "../middleware/auth";
import { generateApiKey } from "../services/api-keys";

export const router = Router();

/** True for the IPv4 loopback/private/link-local/unspecified ranges. */
function isBlockedIpv4(a: number, b: number): boolean {
  const isLoopback = a === 127;
  const isPrivate10 = a === 10;
  const isPrivate172 = a === 172 && b >= 16 && b <= 31;
  const isPrivate192 = a === 192 && b === 168;
  const isLinkLocal = a === 169 && b === 254; // covers cloud metadata endpoints (169.254.169.254)
  const isUnspecified = a === 0;
  return isLoopback || isPrivate10 || isPrivate172 || isPrivate192 || isLinkLocal || isUnspecified;
}

/**
 * True for IPv6 loopback (::1), unspecified (::), link-local (fe80::/10),
 * unique-local (fc00::/7), and IPv4-mapped addresses (::ffff:a.b.c.d, in
 * either dotted or the compressed-hex form the WHATWG URL parser actually
 * produces, e.g. "::ffff:7f00:1" for 127.0.0.1) whose embedded IPv4 address
 * is itself blocked. `address` must already have any URL "[...]" brackets
 * stripped.
 */
function isBlockedIpv6(address: string): boolean {
  const addr = address.toLowerCase();

  if (addr === "::1" || addr === "0:0:0:0:0:0:0:1") return true;
  if (addr === "::" || addr === "0:0:0:0:0:0:0:0") return true;

  // fe80::/10 -- link-local. The third hex character has to be 8/9/a/b for
  // the address to fall in that /10 (fe80..febf), not just start with "fe".
  if (/^fe[89ab]/.test(addr)) return true;

  // fc00::/7 -- unique-local. Covers both the fc00:: and fd00:: halves.
  if (/^f[cd]/.test(addr)) return true;

  // IPv4-mapped, dotted form: ::ffff:a.b.c.d
  const dotted = addr.match(/^::ffff:(\d{1,3})\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/);
  if (dotted && isBlockedIpv4(Number(dotted[1]), Number(dotted[2]))) return true;

  // IPv4-mapped, compressed hex form: ::ffff:XXXX:XXXX (what `new URL()`
  // actually normalizes ::ffff:127.0.0.1 to -- ::ffff:7f00:1).
  const hex = addr.match(/^::ffff:([0-9a-f]{1,4}):[0-9a-f]{1,4}$/);
  if (hex) {
    const highGroup = parseInt(hex[1], 16);
    const a = (highGroup >> 8) & 0xff;
    const b = highGroup & 0xff;
    if (isBlockedIpv4(a, b)) return true;
  }

  return false;
}

/**
 * Blocks the obvious SSRF targets at registration time: this URL gets
 * fetched server-side, from inside the network, every time a meeting
 * completes (see services/webhooks.ts), and the response is discarded --
 * so a bad URL here is a blind request primitive any workspace admin could
 * otherwise point at cloud metadata endpoints, localhost services, or
 * internal-only hosts. Doesn't attempt DNS-rebinding protection (no
 * resolve-then-recheck-on-every-delivery) -- just rejects the clearly
 * dangerous literals at creation time.
 */
function webhookUrlError(rawUrl: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return "url must be a valid URL";
  }

  if (parsed.protocol !== "https:") {
    return "url must use https";
  }

  const rawHost = parsed.hostname.toLowerCase();
  if (rawHost === "localhost") {
    return "url cannot point to a local address";
  }

  // The WHATWG URL parser always wraps IPv6 literals in brackets in
  // `.hostname` (e.g. "[::1]") -- domain names and IPv4 literals never have
  // them, so this is a reliable way to tell IPv6 apart before validating it.
  const isBracketedIpv6 = rawHost.startsWith("[") && rawHost.endsWith("]");
  const host = isBracketedIpv6 ? rawHost.slice(1, -1) : rawHost;

  if (isBracketedIpv6) {
    if (isBlockedIpv6(host)) {
      return "url cannot point to a private or internal address";
    }
    return null;
  }

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4 && isBlockedIpv4(Number(ipv4[1]), Number(ipv4[2]))) {
    return "url cannot point to a private or internal address";
  }

  return null;
}

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
