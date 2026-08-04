import { Router } from "express";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";

export const router = Router();

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
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.patch("/me", async (req: AuthedRequest, res) => {
  try {
    const { name, summaryLength, emailNotifications, notionApiKey, notionDatabaseId } = req.body;
    const prisma = getPrisma();
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(summaryLength !== undefined && { summaryLength }),
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(notionApiKey !== undefined && { notionApiKey }),
        ...(notionDatabaseId !== undefined && { notionDatabaseId }),
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
