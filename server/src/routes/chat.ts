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
    // Only meetings whose best chunk clears a relevance bar (relative to the
    // top match) earn a guaranteed seat -- otherwise a totally unrelated
    // meeting gets forced into the context (and cited as a "source") just
    // for being the least-bad chunk in an irrelevant meeting.
    const topScore = scoredAll[0]?.score ?? 0;
    const relevanceFloor = topScore * 0.6;

    const bestPerMeeting = new Map<string, (typeof scoredAll)[number]>();
    for (const c of scoredAll) {
      if (c.score < relevanceFloor) continue;
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

    // Tuning the retrieval cutoff (relevance floor, meeting count, etc.) to
    // control what shows up in "Sources" turned out to be unreliable -- it
    // depends on the embedding model's score distribution, which varies by
    // question and isn't something to gamble the UI on. The prompt already
    // asks the model to name which meeting(s) it drew from, so instead of
    // reporting every meeting fed into the context window, only report the
    // ones the model actually named in its answer.
    //
    // No fallback to the fed-in set when nothing was cited: that previously
    // showed all 5 context meetings as "Sources" even on an honest "this
    // isn't in any of your meetings" answer, implying relevance that wasn't
    // there. Zero sources on an unmatched question is correct, not a bug.
    const allContextSources = [...new Map(scored.map((s) => [s.meeting.id, { id: s.meeting.id, title: s.meeting.title }])).values()];
    const citedSources = allContextSources.filter((s) => answer.toLowerCase().includes(s.title.toLowerCase()));

    res.json({ answer, sources: citedSources });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to answer question" });
  }
});
