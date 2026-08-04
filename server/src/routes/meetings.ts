import { Router } from "express";
import { getPrisma } from "../db";

export const router = Router();

router.get("/", async (_req, res) => {
  try {
    const prisma = getPrisma();
    const meetings = await prisma.meeting.findMany({
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
        disagreements: true,
        exports: true,
      },
    });
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.json(meeting);
  } catch (error) {
    console.error("Failed to fetch meeting:", error);
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
    console.error("Failed to create meeting:", error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title is required" });
    }
    const prisma = getPrisma();
    const meeting = await prisma.meeting.update({
      where: { id: req.params.id },
      data: { title },
    });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: "Failed to rename meeting" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const prisma = getPrisma();
    await prisma.meeting.delete({ where: { id: req.params.id } });
    res.json({ message: "Meeting deleted" });
  } catch (error) {
    console.error("Failed to delete meeting:", error);
    res.status(500).json({ error: "Failed to delete meeting" });
  }
});
