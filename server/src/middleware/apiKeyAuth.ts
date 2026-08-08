import { Request, Response, NextFunction } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import { getPrisma } from "../db";
import { hashApiKey } from "../services/api-keys";

// Generic like AuthedRequest (server/src/middleware/auth.ts) so route
// handlers get precise req.params typing (e.g. ApiKeyRequest<{ id: string }>)
// instead of falling back to ParamsDictionary's `string | string[]`.
export interface ApiKeyRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  workspaceId?: string;
}

export async function requireApiKey(req: ApiKeyRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing API key" });
    }

    const key = header.slice("Bearer ".length);
    const prisma = getPrisma();
    const record = await prisma.apiKey.findUnique({ where: { keyHash: hashApiKey(key) } });

    if (!record) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Best-effort bookkeeping -- a key revoked concurrently with this very
    // request (findUnique above already succeeded) makes this update throw
    // P2025 (record not found). That must never take the request down, let
    // alone the whole process: Express 4 doesn't catch rejected promises
    // from async middleware, so an uncaught throw here would crash the
    // server for every in-flight request, reachable by any caller.
    try {
      await prisma.apiKey.update({ where: { id: record.id }, data: { lastUsedAt: new Date() } });
    } catch (err) {
      console.error("Failed to update API key lastUsedAt (non-blocking):", err);
    }

    req.workspaceId = record.workspaceId;
    next();
  } catch (error) {
    console.error("API key auth error:", error);
    res.status(500).json({ error: "Failed to authenticate API key" });
  }
}
