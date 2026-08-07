import { Router } from "express";
import { getPrisma } from "../db";
import { requireApiKey, type ApiKeyRequest } from "../middleware/apiKeyAuth";

export const router = Router();
router.use(requireApiKey);

router.get("/meetings", async (req: ApiKeyRequest, res) => {
  try {
    // req.workspaceId is typed optional -- requireApiKey always sets it before
    // calling next() today, but that's a control-flow invariant, not a
    // structural guarantee. Prisma silently drops `where` keys whose value is
    // undefined, so a future refactor that broke that invariant would turn
    // this into "return every workspace's meetings" instead of an error. This
    // is the entire authorization boundary for the public API, so it's
    // guarded explicitly rather than trusted.
    const workspaceId = req.workspaceId;
    if (!workspaceId) {
      return res.status(401).json({ error: "Missing API key" });
    }

    const prisma = getPrisma();
    const meetings = await prisma.meeting.findMany({
      where: { workspaceId },
      select: { id: true, title: true, status: true, summary: true, duration: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ data: meetings });
  } catch (error) {
    console.error("Public API: failed to list meetings:", error);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
});

router.get("/meetings/:id", async (req: ApiKeyRequest<{ id: string }>, res) => {
  try {
    const workspaceId = req.workspaceId;
    if (!workspaceId) {
      return res.status(401).json({ error: "Missing API key" });
    }

    const prisma = getPrisma();
    const meeting = await prisma.meeting.findUnique({
      where: { id: req.params.id },
      include: { decisions: true, actionItems: true },
    });
    if (!meeting || meeting.workspaceId !== workspaceId) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.json({ data: meeting });
  } catch (error) {
    console.error("Public API: failed to fetch meeting:", error);
    res.status(500).json({ error: "Failed to fetch meeting" });
  }
});
