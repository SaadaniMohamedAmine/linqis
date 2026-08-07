import { getPrisma } from "@/lib/db";

/**
 * Resolves the workspace a Next.js route handler should bill against.
 *
 * These are Next.js routes, not the Express API, so there's no
 * `X-Workspace-Id` middleware here -- the client passes the active workspace
 * id explicitly and we verify membership before trusting it. With no id we
 * fall back to the caller's personal (owned) workspace.
 *
 * Returns the workspace plus the caller's role, or null if they aren't a
 * member of what they asked for.
 */
export async function resolveWorkspaceForUser(userId: string, requestedId?: string | null) {
  const prisma = getPrisma();

  const membership = requestedId
    ? await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId: requestedId, userId } },
      })
    : ((await prisma.workspaceMember.findFirst({ where: { userId, role: "OWNER" } })) ??
      (await prisma.workspaceMember.findFirst({ where: { userId }, orderBy: { createdAt: "asc" } })));

  if (!membership) return null;

  const workspace = await prisma.workspace.findUnique({ where: { id: membership.workspaceId } });
  if (!workspace) return null;

  return { workspace, role: membership.role };
}

/** Billing is an owner/admin action -- a plain MEMBER can't pay or cancel. */
export function canManageBilling(role: "OWNER" | "ADMIN" | "MEMBER") {
  return role === "OWNER" || role === "ADMIN";
}
