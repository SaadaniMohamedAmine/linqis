import { Router } from "express";
import { getPrisma } from "../db";

export const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const prisma = getPrisma();
    const notifications = await prisma.notification.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.patch("/:userId/read-all", async (req, res) => {
  try {
    const prisma = getPrisma();
    await prisma.notification.updateMany({
      where: { userId: req.params.userId, read: false },
      data: { read: true },
    });
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
});
