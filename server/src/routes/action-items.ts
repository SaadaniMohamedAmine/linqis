import { Router } from "express";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";

export const router = Router();

// Action items aggregated across every meeting in the active workspace, with
// the parent meeting title so the Action Items Manager page can show "which
// meeting this came from" without a second round-trip per row.
router.get("/", async (req: AuthedRequest, res) => {
  try {
    const prisma = getPrisma();
    const actionItems = await prisma.actionItem.findMany({
      where: { meeting: { workspaceId: req.workspaceId } },
      orderBy: [{ status: "asc" }, { deadline: "asc" }],
      include: {
        meeting: {
          select: { id: true, title: true },
        },
      },
    });
    res.json(actionItems);
  } catch (error) {
    console.error("Failed to fetch action items:", error);
    res.status(500).json({ error: "Failed to fetch action items" });
  }
});

router.patch("/:id", async (req: AuthedRequest<{ id: string }>, res) => {
  try {
    const { status } = req.body;
    if (status !== "TODO" && status !== "DONE") {
      return res.status(400).json({ error: "status must be TODO or DONE" });
    }

    const prisma = getPrisma();
    const existing = await prisma.actionItem.findUnique({
      where: { id: req.params.id },
      include: { meeting: { select: { workspaceId: true } } },
    });
    if (!existing || existing.meeting.workspaceId !== req.workspaceId) {
      return res.status(404).json({ error: "Action item not found" });
    }

    const actionItem = await prisma.actionItem.update({ where: { id: req.params.id }, data: { status } });
    res.json(actionItem);
  } catch (error) {
    console.error("Failed to update action item:", error);
    res.status(500).json({ error: "Failed to update action item" });
  }
});
