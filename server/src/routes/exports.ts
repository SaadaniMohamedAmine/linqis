import { Router } from "express";
import { getPrisma } from "../db";
import { exportToNotion, exportToSlack, exportToEmail } from "../services/export";

export const router = Router();

router.post("/notion", async (req, res) => {
  try {
    const { meetingId } = req.body;
    const prisma = getPrisma();

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        actionItems: true,
        decisions: true,
      },
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    const pageId = await exportToNotion({
      meetingId,
      title: meeting.title,
      summary: meeting.summary || "",
      decisions: meeting.decisions,
      actionItems: meeting.actionItems,
    });

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

router.post("/slack", async (req, res) => {
  try {
    const { meetingId, webhookUrl } = req.body;
    const prisma = getPrisma();

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        actionItems: true,
        decisions: true,
      },
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
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

router.post("/email", async (req, res) => {
  try {
    const { meetingId, to } = req.body;
    const prisma = getPrisma();

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        actionItems: true,
        decisions: true,
      },
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
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
