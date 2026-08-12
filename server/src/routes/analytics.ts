import { Router } from "express";
import { getPrisma } from "../db";
import type { AuthedRequest } from "../middleware/auth";
import { PLAN_LIMITS } from "../lib/plans";

export const router = Router();

router.get("/", async (req: AuthedRequest, res) => {
  try {
    const prisma = getPrisma();
    const workspaceId = req.workspaceId;

    const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId }, select: { plan: true } });
    // Basic usage counts (below) are available on every plan -- only the
    // deeper insights (mood, top owners, weekly trend) are the Pro feature.
    // Used to 402 the whole endpoint, which also blocked the dashboard
    // home's "meetings so far" cards even though those aren't premium.
    const analyticsEnabled = PLAN_LIMITS[workspace?.plan || "FREE"].analyticsEnabled;

    const [totalMeetings, meetings, actionItems, moodCounts] = await Promise.all([
      prisma.meeting.count({ where: { workspaceId } }),
      prisma.meeting.findMany({ where: { workspaceId }, select: { duration: true, createdAt: true } }),
      prisma.actionItem.findMany({ where: { meeting: { workspaceId } }, select: { status: true, owner: true } }),
      analyticsEnabled
        ? prisma.meeting.groupBy({ by: ["mood"], where: { workspaceId, mood: { not: null } }, _count: true })
        : Promise.resolve([]),
    ]);

    const totalMinutes = Math.round(meetings.reduce((sum, m) => sum + (m.duration || 0), 0) / 60);
    const avgDuration = meetings.length > 0 ? Math.round(totalMinutes / meetings.length) : 0;

    const doneCount = actionItems.filter((a) => a.status === "DONE").length;
    const completionRate = actionItems.length > 0 ? Math.round((doneCount / actionItems.length) * 100) : 0;

    const ownerCounts = new Map<string, number>();
    for (const item of actionItems) {
      const owner = item.owner || "Unassigned";
      ownerCounts.set(owner, (ownerCounts.get(owner) || 0) + 1);
    }
    const topOwners = [...ownerCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([owner, count]) => ({ owner, count }));

    // Meetings per week, last 8 weeks
    const weeks: { week: string; count: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i * 7 - start.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      const count = meetings.filter((m) => m.createdAt >= start && m.createdAt < end).length;
      weeks.push({ week: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count });
    }

    res.json({
      totalMeetings,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      avgDurationMinutes: avgDuration,
      completionRate,
      totalActionItems: actionItems.length,
      analyticsEnabled,
      // Withheld (not just hidden client-side) on Free -- these are the
      // actual paid feature, unlike the basic counts above.
      moodDistribution: analyticsEnabled ? moodCounts.map((m) => ({ mood: m.mood, count: m._count })) : [],
      topOwners: analyticsEnabled ? topOwners : [],
      meetingsPerWeek: analyticsEnabled ? weeks : [],
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to compute analytics" });
  }
});
