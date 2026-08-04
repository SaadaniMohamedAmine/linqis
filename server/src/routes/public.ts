import { Router } from "express";
import { getPrisma } from "../db";

export const router = Router();

router.get("/meetings/:token", async (req, res) => {
  try {
    const prisma = getPrisma();
    const meeting = await prisma.meeting.findUnique({
      where: { shareToken: req.params.token },
      select: {
        id: true, title: true, summary: true, mood: true, createdAt: true, duration: true,
        isPublic: true,
        decisions: { select: { statement: true, status: true } },
        actionItems: { select: { task: true, owner: true, priority: true } },
        participants: { select: { name: true } },
      },
    });

    if (!meeting || !meeting.isPublic) {
      return res.status(404).json({ error: "This share link is invalid or has been disabled." });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: "Failed to load shared meeting" });
  }
});
