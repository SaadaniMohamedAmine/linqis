import { Router } from "express";
import { getPrisma } from "../db";

export const router = Router();

// Action items aggregated across all meetings, with the parent meeting title
// so the Action Items Manager page can show "which meeting this came from"
// without a second round-trip per row.
router.get("/", async (_req, res) => {
  try {
    const prisma = getPrisma();
    const actionItems = await prisma.actionItem.findMany({
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

router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (status !== "TODO" && status !== "DONE") {
      return res.status(400).json({ error: "status must be TODO or DONE" });
    }

    const prisma = getPrisma();
    const actionItem = await prisma.actionItem.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(actionItem);
  } catch (error) {
    console.error("Failed to update action item:", error);
    res.status(500).json({ error: "Failed to update action item" });
  }
});
