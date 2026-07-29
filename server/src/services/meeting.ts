import { ai } from "../services/ai";
import { getPrisma } from "../db";

export async function processMeeting(meetingId: string, transcript: string) {
  const prisma = getPrisma();

  // Generate summary
  const summary = await ai.generateSummary(transcript);

  // Extract decisions
  const decisions = await ai.extractDecisions(transcript);

  // Extract action items
  const actionItems = await ai.extractActionItems(transcript);

  // Detect disagreements
  const disagreements = await ai.detectDisagreements(transcript);

  // Detect mood
  const mood = await ai.detectMood(transcript);

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

  return { summary, decisions, actionItems, disagreements, mood };
}
