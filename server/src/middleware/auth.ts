import { Request, Response, NextFunction } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import jwt from "jsonwebtoken";
import { getPrisma } from "../db";

export type WorkspaceRoleName = "OWNER" | "ADMIN" | "MEMBER";

// Generic like Express's own Request so route handlers can still get
// precise req.params typing (e.g. AuthedRequest<{ id: string }>) instead of
// falling back to ParamsDictionary's `string | string[]`.
export interface AuthedRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: string;
  workspaceId?: string;
  workspaceRole?: WorkspaceRoleName;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, process.env.BACKEND_JWT_SECRET!) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Resolves the workspace the caller is acting in. The frontend advertises it
 * via `X-Workspace-Id`, but that header is never trusted on its own -- we
 * only accept it if the user actually has a membership row for it. With no
 * header we fall back to the personal workspace they own.
 *
 * Returns null when the caller isn't a member of the requested workspace (or
 * has no workspace at all).
 */
export async function resolveWorkspaceMembership(req: AuthedRequest) {
  const requestedId = req.headers["x-workspace-id"] as string | undefined;
  const prisma = getPrisma();

  if (requestedId) {
    return prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: requestedId, userId: req.userId! } },
    });
  }

  // No header: prefer the workspace they own (their personal one), but fall
  // back to any membership so an invited-only user isn't locked out.
  return (
    (await prisma.workspaceMember.findFirst({ where: { userId: req.userId!, role: "OWNER" } })) ??
    (await prisma.workspaceMember.findFirst({
      where: { userId: req.userId! },
      orderBy: { createdAt: "asc" },
    }))
  );
}

/** Must run after requireAuth. Resolves and validates the active workspace. */
export async function requireWorkspace(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const membership = await resolveWorkspaceMembership(req);

    if (!membership) {
      return res.status(403).json({ error: "You are not a member of this workspace" });
    }

    req.workspaceId = membership.workspaceId;
    req.workspaceRole = membership.role;
    next();
  } catch (error) {
    console.error("Workspace resolution error:", error);
    res.status(500).json({ error: "Failed to resolve workspace" });
  }
}

/** Gate for owner/admin-only actions (invite, remove member, billing). */
export function requireWorkspaceAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.workspaceRole !== "OWNER" && req.workspaceRole !== "ADMIN") {
    return res.status(403).json({ error: "Only workspace owners and admins can do this" });
  }
  next();
}
