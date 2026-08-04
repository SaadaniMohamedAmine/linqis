import { Router } from "express";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";
import { embedText, cosineSimilarity } from "../services/ai/embeddings";
import { ai } from "../services/ai";

export const router = Router();

router.post("/", async (req: AuthedRequest, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "question is required" });
    }

    const prisma = getPrisma();
    const questionEmbedding = await embedText(question);

    // Only load embeddings for THIS user's meetings -- strict isolation.
    const candidates = await prisma.meetingEmbedding.findMany({
      where: { meeting: { userId: req.userId } },
      include: { meeting: { select: { id: true, title: true } } },
    });

    if (candidates.length === 0) {
      return res.json({ answer: "You don't have any processed meetings yet to search through.", sources: [] });
    }

    const scored = candidates
      .map((c) => ({ ...c, score: cosineSimilarity(questionEmbedding, c.embedding as number[]) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

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
