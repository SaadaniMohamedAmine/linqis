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

  await prisma.apiKey.update({ where: { id: record.id }, data: { lastUsedAt: new Date() } });
  req.workspaceId = record.workspaceId;
  next();
}
