import { Router } from "express";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";

export const router = Router();

router.get("/", async (req: AuthedRequest, res) => {
  try {
    const q = ((req.query.q as string) || "").trim();
    if (!q) return res.json([]);

    const prisma = getPrisma();

    // Searches meeting title + summary and transcript text, ranked by
    // relevance via ts_rank. workspaceId is filtered first so a meeting from
    // another workspace is never exposed.
    const results = await prisma.$queryRaw<
      { id: string; title: string; snippet: string; rank: number }[]
    >`
      SELECT DISTINCT ON (m.id)
        m.id,
        m.title,
        ts_headline('english', COALESCE(t.content, m.summary, ''), plainto_tsquery('english', ${q}), 'MaxWords=25,MinWords=15') as snippet,
        ts_rank(
          to_tsvector('english', COALESCE(m.title, '') || ' ' || COALESCE(m.summary, '') || ' ' || COALESCE(t.content, '')),
          plainto_tsquery('english', ${q})
        ) as rank
      FROM "Meeting" m
      LEFT JOIN "Transcript" t ON t."meetingId" = m.id
      WHERE m."workspaceId" = ${req.workspaceId}
        AND to_tsvector('english', COALESCE(m.title, '') || ' ' || COALESCE(m.summary, '') || ' ' || COALESCE(t.content, ''))
            @@ plainto_tsquery('english', ${q})
      ORDER BY m.id, rank DESC
      LIMIT 20;
    `;

    res.json(results.sort((a, b) => b.rank - a.rank));
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});
