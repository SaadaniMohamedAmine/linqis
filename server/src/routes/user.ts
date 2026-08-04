import { Router } from "express";
import { getPrisma } from "../db";

export const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: { id: true, name: true, email: true, image: true, summaryLength: true, emailNotifications: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.patch("/:userId", async (req, res) => {
  try {
    const { name, summaryLength, emailNotifications } = req.body;
    const prisma = getPrisma();
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(summaryLength !== undefined && { summaryLength }),
        ...(emailNotifications !== undefined && { emailNotifications }),
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});
