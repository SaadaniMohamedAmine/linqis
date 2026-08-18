import { Router } from "express";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";
import { embedText, cosineSimilarity } from "../services/ai/embeddings";
import { ai } from "../services/ai";
import { PLAN_LIMITS } from "../lib/plans";

export const router = Router();

router.post("/", async (req: AuthedRequest, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "question is required" });
    }

    const prisma = getPrisma();

    const workspace = await prisma.workspace.findUnique({ where: { id: req.workspaceId }, select: { plan: true } });
    if (!PLAN_LIMITS[workspace?.plan || "FREE"].chatEnabled) {
      return res.status(402).json({
        error: "Asking your meetings is a Pro feature. Upgrade to chat across your meetings.",
        code: "PLAN_LIMIT_REACHED",
      });
    }

    const questionEmbedding = await embedText(question);

    // Only load embeddings for the active workspace's meetings -- strict isolation.
    const candidates = await prisma.meetingEmbedding.findMany({
      where: { meeting: { workspaceId: req.workspaceId } },
      include: { meeting: { select: { id: true, title: true } } },
    });

    if (candidates.length === 0) {
      return res.json({ answer: "This workspace doesn't have any processed meetings yet to search through.", sources: [] });
    }

    const scoredAll = candidates
      .map((c) => ({ ...c, score: cosineSimilarity(questionEmbedding, c.embedding as number[]) }))
      .sort((a, b) => b.score - a.score);

    // Plain top-K over all chunks pooled across meetings lets one meeting's
    // very on-topic chunks fill every slot, starving other relevant meetings
    // out of the context entirely (confirmed: a question spanning 2 meetings
    // only ever cited 1, even though the other meeting's embeddings existed).
    // Guarantee a diversity floor -- each meeting's single best-scoring chunk
    // gets a seat first -- then fill the rest of the budget by raw score.
    const bestPerMeeting = new Map<string, (typeof scoredAll)[number]>();
    for (const c of scoredAll) {
      if (!bestPerMeeting.has(c.meeting.id)) bestPerMeeting.set(c.meeting.id, c);
    }
    const diverseFloor = [...bestPerMeeting.values()].sort((a, b) => b.score - a.score).slice(0, 6);
    const floorIds = new Set(diverseFloor.map((c) => c.id));
    const backfill = scoredAll.filter((c) => !floorIds.has(c.id));
    const scored = [...diverseFloor, ...backfill].slice(0, 8);

    const context = scored
      .map((c) => `[Meeting: "${c.meeting.title}"]\n${c.chunkText}`)
      .join("\n\n---\n\n");

    const answer = await ai.answerFromContext(question, context);

    res.json({
      answer,
      sources: [...new Map(scored.map((s) => [s.meeting.id, { id: s.meeting.id, title: s.meeting.title }])).values()],
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to answer question" });
  }
});
