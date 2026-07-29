import { Worker, Job } from "bullmq";
import { redis } from "./config";
import { transcribeWithTimestamps } from "../services/transcription";
import { ai } from "../services/ai";
import { getPrisma } from "../db";

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

    job.progress(10);
    console.log(`Transcribing meeting ${meetingId}`);

    // Transcribe audio (chunk by chunk or full file)
    const audioFiles = chunks && chunks.length > 0 ? chunks : [audioPath];
    let fullTranscript = "";
    let allSegments: any[] = [];

    for (let i = 0; i < audioFiles.length; i++) {
      const segments = await transcribeWithTimestamps(audioFiles[i]);
      allSegments = [...allSegments, ...segments];
      fullTranscript += segments.map((s) => s.content).join(" ");
      job.progress(10 + (i / audioFiles.length) * 40);
    }

    // Save transcripts
    await prisma.transcript.createMany({
      data: allSegments.map((seg) => ({
        meetingId,
        content: seg.content,
        speaker: seg.speaker,
        timestamp: seg.timestamp,
      })),
    });

    job.progress(55);
    console.log(`Analyzing meeting ${meetingId}`);

    // AI analysis
    const [summary, decisions, actionItems, disagreements, mood] = await Promise.all([
      ai.generateSummary(fullTranscript),
      ai.extractDecisions(fullTranscript),
      ai.extractActionItems(fullTranscript),
      ai.detectDisagreements(fullTranscript),
      ai.detectMood(fullTranscript),
    ]);

    job.progress(80);

    // Update meeting
    await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        status: "DONE",
        summary,
        mood,
        duration: allSegments.length > 0 ? Math.ceil(allSegments[allSegments.length - 1].timestamp.split(":").reduce((acc: number, t: string, i: number, arr: string[]) => acc + parseInt(t) * Math.pow(60, arr.length - 1 - i), 0) / 60) : 0,
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
      },
    });

    job.progress(100);
    console.log(`Meeting ${meetingId} processed successfully`);

    return {
      meetingId,
      transcriptLength: fullTranscript.length,
      segments: allSegments.length,
      decisions: decisions.length,
      actionItems: actionItems.length,
    };
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

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});
