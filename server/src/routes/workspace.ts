import { Router } from "express";
import { randomBytes } from "crypto";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";
import { requireWorkspaceAdmin } from "../middleware/auth";
import { sendInviteEmail } from "../services/email/invite";

export const router = Router();

router.get("/members", async (req: AuthedRequest, res) => {
  try {
    const prisma = getPrisma();
    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId: req.workspaceId },
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json(members);
  } catch (error) {
    console.error("Failed to fetch workspace members:", error);
    res.status(500).json({ error: "Failed to fetch workspace members" });
  }
});

router.post("/invite", requireWorkspaceAdmin, async (req: AuthedRequest, res) => {
  try {
    const { email, role } = req.body as { email?: string; role?: "ADMIN" | "MEMBER" };
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "email is required" });
    }

    // Emails are stored and matched lowercased. Inviting "Teammate@Corp.com"
    // when the account is "teammate@corp.com" would otherwise create an invite
    // that can never be accepted, with no way to recover it.
    const normalizedEmail = email.trim().toLowerCase();

    const prisma = getPrisma();

    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: req.workspaceId,
        user: { email: { equals: normalizedEmail, mode: "insensitive" } },
      },
    });
    if (existingMember) {
      return res.status(409).json({ error: "This person is already a member" });
    }

    const token = randomBytes(32).toString("hex");
    const invite = await prisma.workspaceInvite.create({
      data: {
        workspaceId: req.workspaceId!,
        email: normalizedEmail,
        role: role === "ADMIN" ? "ADMIN" : "MEMBER",
        token,
        invitedById: req.userId!,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: { workspace: { select: { name: true } } },
    });

    await sendInviteEmail({ to: normalizedEmail, workspaceName: invite.workspace.name, token });
    res.status(201).json({ status: "sent" });
  } catch (error) {
    console.error("Invite error:", error);
    res.status(500).json({ error: "Failed to send invite" });
  }
});

router.delete("/members/:userId", requireWorkspaceAdmin, async (req: AuthedRequest<{ userId: string }>, res) => {
  try {
    const prisma = getPrisma();
    const target = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: req.workspaceId!, userId: req.params.userId } },
    });
    if (!target) return res.status(404).json({ error: "Member not found" });
    if (target.role === "OWNER") return res.status(400).json({ error: "Cannot remove the workspace owner" });

    await prisma.workspaceMember.delete({ where: { id: target.id } });
    res.json({ status: "removed" });
  } catch (error) {
    console.error("Failed to remove member:", error);
    res.status(500).json({ error: "Failed to remove member" });
  }
});

// Mounted WITHOUT requireAuth/requireWorkspace: the invite link in the email
// has to work for someone who has no account yet.
export const publicRouter = Router();

// Lets the /invite/[token] landing page name the workspace before the visitor
// signs in. Only the workspace name is exposed, never its contents.
publicRouter.get("/invite/:token", async (req, res) => {
  try {
    const prisma = getPrisma();
    const invite = await prisma.workspaceInvite.findUnique({
      where: { token: req.params.token },
      include: { workspace: { select: { name: true } } },
    });

    if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) {
      return res.status(404).json({ error: "This invite is invalid or has expired" });
    }

    res.json({ workspaceName: invite.workspace.name, email: invite.email, role: invite.role });
  } catch (error) {
    console.error("Failed to load invite:", error);
    res.status(500).json({ error: "Failed to load invite" });
  }
});

/**
 * Accepting an invite is mounted under requireAuth (no requireWorkspace -- the
 * caller is by definition not yet a member of the workspace they're joining).
 *
 * The user id comes from the verified JWT, never the request body. Taking it
 * from the body would let any co-member read a colleague's id out of
 * GET /members and force them into a workspace without their involvement.
 */
export const authedRouter = Router();

authedRouter.post("/accept", async (req: AuthedRequest, res) => {
  try {
    const { token } = req.body as { token: string };
    const userId = req.userId!;
    const prisma = getPrisma();

    const invite = await prisma.workspaceInvite.findUnique({ where: { token } });
    if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) {
      return res.status(400).json({ error: "This invite is invalid or has expired" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    // The invite is bound to the email it was sent to -- forwarding the link
    // to someone else must not let them into the workspace. Compared
    // case-insensitively so a differently-cased invite still resolves.
    if (!user?.email || user.email.toLowerCase() !== invite.email.toLowerCase()) {
      return res.status(403).json({ error: "This invite was sent to a different email address" });
    }

    const alreadyMember = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: invite.workspaceId, userId } },
    });
    if (alreadyMember) {
      await prisma.workspaceInvite.update({ where: { id: invite.id }, data: { acceptedAt: new Date() } });
      return res.json({ workspaceId: invite.workspaceId });
    }

    await prisma.$transaction([
      prisma.workspaceMember.create({
        data: { workspaceId: invite.workspaceId, userId, role: invite.role },
      }),
      prisma.workspaceInvite.update({ where: { id: invite.id }, data: { acceptedAt: new Date() } }),
    ]);

    res.json({ workspaceId: invite.workspaceId });
  } catch (error) {
    console.error("Accept invite error:", error);
    res.status(500).json({ error: "Failed to accept invite" });
  }
});
