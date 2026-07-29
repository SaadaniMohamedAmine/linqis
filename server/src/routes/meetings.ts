import { Router } from "express";
import { getPrisma } from "@/lib/db";

export const router = Router();

router.get("/", async (_req, res) => {
  try {
    const prisma = getPrisma();
    const meetings = await prisma.meeting.findMany({
      orderBy: { createdAt: "desc" },
      include: {
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
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const prisma = getPrisma();
    const meeting = await prisma.meeting.findUnique({
      where: { id: req.params.id },
      include: {
        participants: true,
        transcripts: { orderBy: { timestamp: "asc" } },
        actionItems: true,
        decisions: true,
        exports: true,
      },
    });
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meeting" });
  }
});

router.post("/", async (req, res) => {
  try {
    const prisma = getPrisma();
    const { title, userId, audioUrl } = req.body;
    const meeting = await prisma.meeting.create({
      data: {
        title,
        userId,
        audioUrl,
        status: "PROCESSING",
      },
    });
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: "Failed to create meeting" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const prisma = getPrisma();
    await prisma.meeting.delete({ where: { id: req.params.id } });
    res.json({ message: "Meeting deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete meeting" });
  }
});
