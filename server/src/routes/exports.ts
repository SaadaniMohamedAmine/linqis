import { Router } from "express";
import { getPrisma } from "../db";
import { exportToNotion, exportToSlack, exportToEmail } from "../services/export";
import type { AuthedRequest } from "../middleware/auth";
import { PLAN_LIMITS } from "../lib/plans";
import { webhookUrlError } from "../lib/safe-url";

export const router = Router();

router.post("/notion", async (req: AuthedRequest, res) => {
  try {
    const { meetingId } = req.body;
    const prisma = getPrisma();

    const [meeting, user, workspace] = await Promise.all([
      prisma.meeting.findUnique({ where: { id: meetingId }, include: { actionItems: true, decisions: true } }),
      prisma.user.findUnique({ where: { id: req.userId }, select: { notionApiKey: true, notionDatabaseId: true } }),
      prisma.workspace.findUnique({ where: { id: req.workspaceId }, select: { plan: true } }),
    ]);

    if (!meeting || meeting.workspaceId !== req.workspaceId) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    if (!PLAN_LIMITS[workspace?.plan || "FREE"].exportsEnabled) {
      return res.status(402).json({
        error: "Exports are a Pro feature. Upgrade to export to Notion, Slack, or Email.",
        code: "PLAN_LIMIT_REACHED",
      });
    }

    // Falls back to a global integration if the user hasn't connected their
    // own Notion workspace yet in Settings.
    const apiKey = user?.notionApiKey || process.env.NOTION_API_KEY;
    const databaseId = user?.notionDatabaseId || process.env.NOTION_DATABASE_ID;
    if (!apiKey || !databaseId) {
      return res.status(400).json({ error: "Connect your Notion account in Settings before exporting." });
    }

    const pageId = await exportToNotion(
      {
        meetingId,
        title: meeting.title,
        summary: meeting.summary || "",
        decisions: meeting.decisions,
        actionItems: meeting.actionItems,
      },
      { apiKey, databaseId }
    );

    await prisma.export.create({
      data: {
        meetingId,
        platform: "NOTION",
        target: pageId,
        status: "COMPLETED",
      },
    });

    res.json({ pageId, status: "completed" });
  } catch (error) {
    console.error("Notion export error:", error);
    res.status(500).json({ error: "Export to Notion failed" });
  }
});

router.post("/slack", async (req: AuthedRequest, res) => {
  try {
    const { meetingId, webhookUrl } = req.body;

    // Same SSRF class as webhook registration: this URL is POSTed to
    // server-side (services/export/slack.ts -> IncomingWebhook), so it gets
    // the identical guard rather than being trusted because it came from a
    // logged-in user.
    if (!webhookUrl || typeof webhookUrl !== "string") {
      return res.status(400).json({ error: "webhookUrl is required" });
    }
    const urlError = webhookUrlError(webhookUrl);
    if (urlError) {
      return res.status(400).json({ error: urlError });
    }

    const prisma = getPrisma();

    const [meeting, workspace] = await Promise.all([
      prisma.meeting.findUnique({ where: { id: meetingId }, include: { actionItems: true, decisions: true } }),
      prisma.workspace.findUnique({ where: { id: req.workspaceId }, select: { plan: true } }),
    ]);

    if (!meeting || meeting.workspaceId !== req.workspaceId) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    if (!PLAN_LIMITS[workspace?.plan || "FREE"].exportsEnabled) {
      return res.status(402).json({
        error: "Exports are a Pro feature. Upgrade to export to Notion, Slack, or Email.",
        code: "PLAN_LIMIT_REACHED",
      });
    }

    await exportToSlack({
      meetingId,
      title: meeting.title,
      summary: meeting.summary || "",
      decisions: meeting.decisions,
      actionItems: meeting.actionItems,
      mood: meeting.mood || "NEUTRAL",
      webhookUrl,
    });

    await prisma.export.create({
      data: {
        meetingId,
        platform: "SLACK",
        target: webhookUrl,
        status: "COMPLETED",
      },
    });

    res.json({ status: "completed" });
  } catch (error) {
    console.error("Slack export error:", error);
    res.status(500).json({ error: "Export to Slack failed" });
  }
});

router.post("/email", async (req: AuthedRequest, res) => {
  try {
    const { meetingId, to } = req.body;
    const prisma = getPrisma();

    const [meeting, workspace] = await Promise.all([
      prisma.meeting.findUnique({ where: { id: meetingId }, include: { actionItems: true, decisions: true } }),
      prisma.workspace.findUnique({ where: { id: req.workspaceId }, select: { plan: true } }),
    ]);

    if (!meeting || meeting.workspaceId !== req.workspaceId) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    if (!PLAN_LIMITS[workspace?.plan || "FREE"].exportsEnabled) {
      return res.status(402).json({
        error: "Exports are a Pro feature. Upgrade to export to Notion, Slack, or Email.",
        code: "PLAN_LIMIT_REACHED",
      });
    }

    await exportToEmail({
      meetingId,
      title: meeting.title,
      summary: meeting.summary || "",
      decisions: meeting.decisions,
      actionItems: meeting.actionItems,
      mood: meeting.mood || "NEUTRAL",
      to,
    });

    await prisma.export.create({
      data: {
        meetingId,
        platform: "EMAIL",
        target: to,
        status: "COMPLETED",
      },
    });

    res.json({ status: "completed" });
  } catch (error) {
    console.error("Email export error:", error);
    res.status(500).json({ error: "Export to Email failed" });
  }
});
