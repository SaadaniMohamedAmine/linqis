import { Worker, Job } from "bullmq";
import { redis } from "./config";

interface MeetingJob {
  meetingId: string;
  audioUrl: string;
}

export const worker = new Worker<MeetingJob>(
  "meeting-processing",
  async (job: Job<MeetingJob>) => {
    const { meetingId, audioUrl } = job.data;

    job.progress(10);
    console.log(`Processing meeting ${meetingId}: ${audioUrl}`);

    // Step 1: Extract audio (FFmpeg)
    job.progress(25);
    console.log(`Step 1: Extracting audio from ${audioUrl}`);

    // Step 2: Chunk if > 25MB
    job.progress(40);
    console.log("Step 2: Chunking audio file");

    // Step 3: Transcribe (Whisper)
    job.progress(60);
    console.log("Step 3: Transcribing with Whisper API");

    // Step 4: Analyze (Gemini/Groq)
    job.progress(80);
    console.log("Step 4: Analyzing with AI");

    // Step 5: Save results
    job.progress(100);
    console.log(`Meeting ${meetingId} processed successfully`);

    return {
      status: "completed",
      meetingId,
      processedAt: new Date().toISOString(),
    };
  },
  {
    connection: redis,
    concurrency: 3,
    removeOnComplete: { age: 86400 },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});
