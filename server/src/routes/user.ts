import { Router } from "express";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";
import { resolveWorkspaceMembership } from "../middleware/auth";
import { PLAN_LIMITS } from "../lib/plans";

export const router = Router();

// This router is mounted under requireAuth only -- deliberately no
// requireWorkspace, because /me/workspaces is what the frontend calls to
// discover which workspaces exist before one is active. The handlers that do
// need workspace data resolve it themselves.
router.get("/me", async (req: AuthedRequest, res) => {
  try {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        summaryLength: true,
        emailNotifications: true,
        notionApiKey: true,
        notionDatabaseId: true,
        slackWebhookUrl: true,
        slackChannelName: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Billing now lives on the workspace, but the settings page still reads
    // it off the profile payload -- so surface the active workspace's plan
    // here rather than making the client do a second round-trip.
    const membership = await resolveWorkspaceMembership(req);
    const workspace = membership
      ? await prisma.workspace.findUnique({
          where: { id: membership.workspaceId },
          select: { id: true, name: true, plan: true, subscriptionStatus: true, currentPeriodEnd: true },
        })
      : null;

    // Same monthly window as the upload route's own plan-limit check
    // (server/src/routes/upload.ts) -- kept in sync so the sidebar counter
    // never disagrees with the 402 a user would actually hit.
    const limits = PLAN_LIMITS[workspace?.plan || "FREE"];
    let meetingsThisMonth = 0;
    if (workspace) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      meetingsThisMonth = await prisma.meeting.count({
        where: { workspaceId: workspace.id, createdAt: { gte: startOfMonth } },
      });
    }

    res.json({
      ...user,
      plan: workspace?.plan ?? "FREE",
      subscriptionStatus: workspace?.subscriptionStatus ?? null,
      currentPeriodEnd: workspace?.currentPeriodEnd ?? null,
      workspaceId: workspace?.id ?? null,
      workspaceName: workspace?.name ?? null,
      workspaceRole: membership?.role ?? null,
      meetingsThisMonth,
      // Infinity doesn't survive JSON -- null means unlimited.
      maxMeetingsPerMonth: limits.maxMeetingsPerMonth === Infinity ? null : limits.maxMeetingsPerMonth,
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.get("/me/workspaces", async (req: AuthedRequest, res) => {
  try {
    const prisma = getPrisma();
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: req.userId },
      include: { workspace: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json(memberships.map((m) => ({ id: m.workspace.id, name: m.workspace.name, role: m.role })));
  } catch (error) {
    console.error("Failed to fetch workspaces:", error);
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
});

router.patch("/me", async (req: AuthedRequest, res) => {
  try {
    const {
      name,
      summaryLength,
      emailNotifications,
      notionApiKey,
      notionDatabaseId,
      slackWebhookUrl,
      slackChannelName,
    } = req.body;
    const prisma = getPrisma();
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(summaryLength !== undefined && { summaryLength }),
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(notionApiKey !== undefined && { notionApiKey }),
        ...(notionDatabaseId !== undefined && { notionDatabaseId }),
        ...(slackWebhookUrl !== undefined && { slackWebhookUrl }),
        ...(slackChannelName !== undefined && { slackChannelName }),
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.patch("/me/onboarding", async (req: AuthedRequest, res) => {
  try {
    const { role, teamSize, primaryUseCase } = req.body;
    const prisma = getPrisma();
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { role, teamSize, primaryUseCase, onboardingCompleted: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to complete onboarding" });
  }
});

router.patch("/me/tour-seen", async (req: AuthedRequest, res) => {
  try {
    const prisma = getPrisma();
    await prisma.user.update({ where: { id: req.userId }, data: { tourCompleted: true } });
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});
