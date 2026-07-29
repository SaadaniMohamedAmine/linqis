import { Worker, Job } from "bullmq";
import { redis } from "./config";
import { transcribeWithTimestamps, diarizeSpeakers, reassembleTranscript, mergeTranscripts } from "../services/transcription";
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
    let allSegments: any[] = [];

    for (let i = 0; i < audioFiles.length; i++) {
      const segments = await transcribeWithTimestamps(audioFiles[i]);
      allSegments.push(segments);
      job.progress(10 + (i / audioFiles.length) * 30);
    }

    // Merge and diarize
    const merged = mergeTranscripts(allSegments);
    const diarized = await diarizeSpeakers(merged);

    // Reassemble with corrected timestamps
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

    job.progress(45);
    console.log(`Analyzing meeting ${meetingId}`);

    // Extract decisions
    const decisions = await ai.extractDecisions(fullTranscript);

    job.progress(60);

    // Extract action items
    const actionItems = await ai.extractActionItems(fullTranscript);

    job.progress(75);

    // Detect disagreements
    const disagreements = await ai.detectDisagreements(fullTranscript);

    job.progress(85);

    // Detect mood
    const mood = await ai.detectMood(fullTranscript);

    // Generate summary
    const summary = await ai.generateExecutiveSummary(fullTranscript);

    job.progress(95);

    // Update meeting
    await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        status: "DONE",
        summary,
        mood,
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
      segments: diarized.length,
      decisions: decisions.length,
      actionItems: actionItems.length,
      mood,
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
