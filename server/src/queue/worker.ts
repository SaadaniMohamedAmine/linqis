import { Worker, Job } from "bullmq";
import { redis } from "./config";
import { processMeeting } from "../services/meeting";

interface MeetingJob {
  meetingId: string;
  transcript: string;
}

export const worker = new Worker<MeetingJob>(
  "meeting-processing",
  async (job: Job<MeetingJob>) => {
    const { meetingId, transcript } = job.data;

    job.progress(10);
    console.log(`Processing meeting ${meetingId}`);

    job.progress(25);
    console.log("Generating summary...");

    job.progress(50);
    const result = await processMeeting(meetingId, transcript);

    job.progress(100);
    console.log(`Meeting ${meetingId} processed successfully`);

    return result;
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
