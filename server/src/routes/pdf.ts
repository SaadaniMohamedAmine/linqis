import { Router } from "express";
import PDFDocument from "pdfkit";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";
import { PLAN_LIMITS } from "../lib/plans";

export const router = Router();

router.get("/:id", async (req: AuthedRequest<{ id: string }>, res) => {
  try {
    const prisma = getPrisma();

    const [meeting, user] = await Promise.all([
      prisma.meeting.findUnique({
        where: { id: req.params.id },
        include: { decisions: true, actionItems: true, participants: true },
      }),
      prisma.user.findUnique({ where: { id: req.userId }, select: { plan: true } }),
    ]);

    if (!meeting || meeting.userId !== req.userId) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    if (!PLAN_LIMITS[user?.plan || "FREE"].pdfExportEnabled) {
      return res.status(402).json({
        error: "PDF export is a Pro feature. Upgrade to download meeting PDFs.",
        code: "PLAN_LIMIT_REACHED",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${meeting.title.replace(/[^a-z0-9]/gi, "_")}.pdf"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text(meeting.title, { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#666").text(new Date(meeting.createdAt).toLocaleDateString());
    doc.moveDown(1.5);

    doc.fontSize(14).fillColor("#000").text("Summary");
    doc.fontSize(11).fillColor("#333").text(meeting.summary || "No summary available.");
    doc.moveDown(1.5);

    doc.fontSize(14).fillColor("#000").text("Decisions");
    if (meeting.decisions.length === 0) doc.fontSize(11).fillColor("#333").text("No decisions recorded.");
    for (const d of meeting.decisions) {
      doc.fontSize(11).fillColor("#333").text(`• ${d.statement} (${d.status})`);
    }
    doc.moveDown(1.5);

    doc.fontSize(14).fillColor("#000").text("Action Items");
    if (meeting.actionItems.length === 0) doc.fontSize(11).fillColor("#333").text("No action items recorded.");
    for (const a of meeting.actionItems) {
      doc.fontSize(11).fillColor("#333").text(`• ${a.task} — ${a.owner || "Unassigned"} (${a.priority})`);
    }

    doc.end();
  } catch (error) {
    console.error("PDF export error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});
