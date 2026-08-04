import { Worker, Job } from "bullmq";
import { redis } from "./config";
import { transcribeWithTimestamps, diarizeSpeakers, reassembleTranscript, mergeTranscripts } from "../services/transcription";
import { ai, detectDisagreements, detectMoodWithAnalysis } from "../services/ai";
import { embedText, chunkText } from "../services/ai/embeddings";
import { getPrisma } from "../db";
import { publishProgress, publishComplete, publishError } from "../services/sse";

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

    // AI analysis
    const [decisions, actionItems, disagreements, moodAnalysis] = await Promise.all([
      ai.extractDecisions(fullTranscript),
      ai.extractActionItems(fullTranscript),
      detectDisagreements(fullTranscript),
      detectMoodWithAnalysis(fullTranscript),
    ]);

    await publishProgress(job.id, { status: "saving", progress: 90 });

    // Update meeting
    await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        status: "DONE",
        summary: await ai.generateExecutiveSummary(fullTranscript),
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
      const meetingRecord = await prisma.meeting.findUnique({ where: { id: meetingId }, select: { userId: true, title: true } });
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
