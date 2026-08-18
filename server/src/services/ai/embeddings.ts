import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// text-embedding-004 has also been retired by Google; gemini-embedding-001
// replaces it. Embeddings are stored as plain JSON (see MeetingEmbedding in
// schema.prisma), not a fixed-dimension pgvector column, so there's no
// migration to run -- this only matters for new embeddings going forward.
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

export async function embedText(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

/** Splits text into ~maxChars chunks on sentence boundaries. */
export function chunkText(text: string, maxChars = 800): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > maxChars && current) {
      chunks.push(current.trim());
      current = "";
    }
    current += sentence + " ";
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
