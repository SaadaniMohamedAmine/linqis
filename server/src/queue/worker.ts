import { Worker, Job } from "bullmq";
import { redis } from "./config";
import { transcribeWithTimestamps, diarizeSpeakers, reassembleTranscript, mergeTranscripts } from "../services/transcription";
import { ai, detectDisagreements, detectMoodWithAnalysis } from "../services/ai";
import { embedText, chunkText } from "../services/ai/embeddings";
import { getPrisma } from "../db";
import { publishProgress, publishComplete, publishError } from "../services/sse";
import { triggerWebhooks } from "../services/webhooks";

interface MeetingJob {
  meetingId: string;
  audioPath: string;
  chunks?: string[];
}

export const worker = new Worker<MeetingJob>(
  "meeting-processing",
  async (job: Job<MeetingJob>) => {
    const { meetingId, audioPath, chunks } = job.data;
    const prisma = getPrisma();

    await publishProgress(job.id, { status: "transcribing", progress: 10 });

    // Transcribe audio
    const audioFiles = chunks && chunks.length > 0 ? chunks : [audioPath];
    let allSegments: any[] = [];

    for (let i = 0; i < audioFiles.length; i++) {
      const segments = await transcribeWithTimestamps(audioFiles[i]);
      allSegments.push(segments);
      await publishProgress(job.id, {
        status: "transcribing",
        progress: 10 + (i / audioFiles.length) * 30,
        chunk: i + 1,
        total: audioFiles.length,
      });
    }

    // Merge and diarize
    const merged = mergeTranscripts(allSegments);
    const diarized = await diarizeSpeakers(merged);
    const fullTranscript = reassembleTranscript(diarized);

    // Save transcripts
    await prisma.transcript.createMany({
      data: diarized.map((seg) => ({
        meetingId,
        content: seg.content,
        speaker: seg.speaker,
        timestamp: seg.timestamp,
      })),
    });

    // Non-blocking: chat/RAG is a secondary feature -- an embedding failure
    // must never take down the primary summary/decisions/action-items path.
    try {
      const chunks = chunkText(fullTranscript);
      for (const chunk of chunks) {
        const embedding = await embedText(chunk);
        await prisma.meetingEmbedding.create({
          data: { meetingId, chunkText: chunk, embedding },
        });
      }
    } catch (err) {
      console.error("Failed to generate embeddings (non-blocking):", err);
    }

    await publishProgress(job.id, { status: "analyzing", progress: 45 });

    // AI analysis. allSettled rather than all: these 4 calls fire at once, so
    // when Gemini's quota is exhausted they all fall back to Groq at the same
    // moment -- if Groq's own free-tier limit then rejects just one of them,
    // Promise.all would fail the entire meeting over a single secondary
    // enrichment. Each is non-critical on its own (unlike the summary below),
    // so a lone failure degrades to an empty/neutral default instead.
    const [decisionsResult, actionItemsResult, disagreementsResult, moodResult] = await Promise.allSettled([
      ai.extractDecisions(fullTranscript),
      ai.extractActionItems(fullTranscript),
      detectDisagreements(fullTranscript),
      detectMoodWithAnalysis(fullTranscript),
    ]);

    if (decisionsResult.status === "rejected") console.error("extractDecisions failed (non-blocking):", decisionsResult.reason);
    if (actionItemsResult.status === "rejected") console.error("extractActionItems failed (non-blocking):", actionItemsResult.reason);
    if (disagreementsResult.status === "rejected") console.error("detectDisagreements failed (non-blocking):", disagreementsResult.reason);
    if (moodResult.status === "rejected") console.error("detectMoodWithAnalysis failed (non-blocking):", moodResult.reason);

    const decisions = decisionsResult.status === "fulfilled" ? decisionsResult.value : [];
    const actionItems = actionItemsResult.status === "fulfilled" ? actionItemsResult.value : [];
    const disagreements = disagreementsResult.status === "fulfilled" ? disagreementsResult.value : [];
    const moodAnalysis = moodResult.status === "fulfilled" ? moodResult.value : { mood: "NEUTRAL" as const, confidence: 0, indicators: [] };

    await publishProgress(job.id, { status: "saving", progress: 90 });

    // Captured in its own variable (rather than inlined into the update call
    // below) so the webhook trigger further down can reuse the same text
    // without a second AI call or an extra read back from the DB.
    const summaryText = await ai.generateExecutiveSummary(fullTranscript);

    // Update meeting
    await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        status: "DONE",
        summary: summaryText,
        mood: moodAnalysis.mood,
        decisions: {
          create: decisions.map((d: any) => ({
            statement: d.statement,
            status: d.status?.toUpperCase() || "CONFIRMED",
            timestamp: d.timestamp,
            proposer: d.proposer,
          })),
        },
        actionItems: {
          create: actionItems.map((a: any) => ({
            task: a.task,
            owner: a.owner,
            deadline: a.deadline ? new Date(a.deadline) : null,
            priority: a.priority?.toUpperCase() || "MEDIUM",
          })),
        },
        disagreements: {
          create: disagreements.map((d: any) => ({
            topic: d.topic,
            quote: d.quote,
            severity: d.severity?.toUpperCase() || "MEDIUM",
            participants: Array.isArray(d.participants) ? d.participants : [],
          })),
        },
      },
    });

    // Non-blocking: a notification failure should never fail an otherwise-
    // successful processing job.
    try {
      const meetingRecord = await prisma.meeting.findUnique({ where: { id: meetingId }, select: { userId: true, title: true, workspaceId: true } });
      if (meetingRecord) {
        await prisma.notification.create({
          data: {
            userId: meetingRecord.userId,
            type: "SUCCESS",
            title: "Meeting processed",
            message: `"${meetingRecord.title}" is ready. ${(actionItems as any[]).length} action item(s) extracted.`,
            meetingId,
          },
        });

        // Notify any external systems subscribed to this workspace. Wrapped in
        // its own try/catch (rather than letting a throw here skip past the
        // notification above) so a webhook delivery failure never fails an
        // otherwise-successful processing job.
        try {
          await triggerWebhooks(meetingRecord.workspaceId, "meeting.completed", {
            meetingId,
            title: meetingRecord.title,
            summary: summaryText,
          });
        } catch (err) {
          console.error("Webhook trigger failed (non-blocking):", err);
        }
      }
    } catch (err) {
      console.error("Failed to create notification (non-blocking):", err);
    }

    await publishComplete(job.id, {
      status: "completed",
      progress: 100,
      meetingId,
      decisions: decisions.length,
      actionItems: actionItems.length,
      disagreements: disagreements.length,
      mood: moodAnalysis.mood,
    });

    return { meetingId, status: "completed" };
  },
  {
    connection: redis,
    concurrency: 2,
    removeOnComplete: { age: 86400 },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", async (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
  if (job) {
    await publishError(job.id, err.message);

    // Without this, a meeting whose processing job fails stays stuck in
    // PROCESSING forever with no way for the UI to tell the user it failed.
    try {
      const prisma = getPrisma();
      await prisma.meeting.update({
        where: { id: job.data.meetingId },
        data: { status: "FAILED" },
      });
    } catch (updateErr) {
      console.error(`Failed to mark meeting ${job.data.meetingId} as FAILED:`, updateErr);
    }
  }
});
