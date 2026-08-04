import { Router } from "express";
import { randomUUID } from "crypto";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";

export const router = Router();

router.get("/", async (req: AuthedRequest, res) => {
  try {
    const prisma = getPrisma();
    const meetings = await prisma.meeting.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      include: {
        participants: true,
        _count: {
          select: {
            actionItems: true,
            transcripts: true,
          },
        },
      },
    });
    res.json(meetings);
  } catch (error) {
    console.error("Failed to fetch meetings:", error);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
});

router.get("/:id", async (req: AuthedRequest<{ id: string }>, res) => {
  try {
    const prisma = getPrisma();
    const meeting = await prisma.meeting.findUnique({
      where: { id: req.params.id },
      include: {
        participants: true,
        transcripts: { orderBy: { timestamp: "asc" } },
        actionItems: true,
        decisions: true,
        disagreements: true,
        exports: true,
      },
    });
    // 404 (not 403) whether the meeting doesn't exist or just isn't the
    // caller's -- never reveal that an id belongs to someone else.
    if (!meeting || meeting.userId !== req.userId) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.json(meeting);
  } catch (error) {
    console.error("Failed to fetch meeting:", error);
    res.status(500).json({ error: "Failed to fetch meeting" });
  }
});

router.post("/", async (req: AuthedRequest, res) => {
  try {
    const prisma = getPrisma();
    const { title, audioUrl } = req.body;
    const meeting = await prisma.meeting.create({
      data: { title, userId: req.userId!, audioUrl, status: "PROCESSING" },
    });
    res.status(201).json(meeting);
  } catch (error) {
    console.error("Failed to create meeting:", error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
});

router.patch("/:id", async (req: AuthedRequest<{ id: string }>, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title is required" });
    }
    const prisma = getPrisma();
    const existing = await prisma.meeting.findUnique({ where: { id: req.params.id }, select: { userId: true } });
    if (!existing || existing.userId !== req.userId) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    const meeting = await prisma.meeting.update({ where: { id: req.params.id }, data: { title } });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: "Failed to rename meeting" });
  }
});

router.patch("/:id/share", async (req: AuthedRequest<{ id: string }>, res) => {
  try {
    const prisma = getPrisma();
    const existing = await prisma.meeting.findUnique({ where: { id: req.params.id }, select: { userId: true, shareToken: true } });
    if (!existing || existing.userId !== req.userId) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    const { enabled } = req.body as { enabled: boolean };
    const shareToken = enabled ? (existing.shareToken || randomUUID()) : existing.shareToken;

    const meeting = await prisma.meeting.update({
      where: { id: req.params.id },
      data: { isPublic: enabled, shareToken },
    });
    res.json({ isPublic: meeting.isPublic, shareToken: meeting.shareToken });
  } catch (error) {
    res.status(500).json({ error: "Failed to update sharing" });
  }
});

router.delete("/:id", async (req: AuthedRequest<{ id: string }>, res) => {
  try {
    const prisma = getPrisma();
    const existing = await prisma.meeting.findUnique({ where: { id: req.params.id }, select: { userId: true } });
    if (!existing || existing.userId !== req.userId) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    await prisma.meeting.delete({ where: { id: req.params.id } });
    res.json({ message: "Meeting deleted" });
  } catch (error) {
    console.error("Failed to delete meeting:", error);
    res.status(500).json({ error: "Failed to delete meeting" });
  }
});
