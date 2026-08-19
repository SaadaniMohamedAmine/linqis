import { auth } from "@/lib/auth";
import { getMeetings, getActionItems, getAnalytics, type MeetingListItem, type ActionItemWithMeeting, type AnalyticsData } from "@/lib/api";
import { DashboardOverview } from "@/components/dashboard-overview";

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0];

  // Every section degrades independently -- one failing call (e.g. analytics
  // hitting a plan limit) shouldn't blank the rest of the overview.
  const [meetings, actionItems, analytics] = await Promise.all([
    getMeetings().catch(() => [] as MeetingListItem[]),
    getActionItems().catch(() => [] as ActionItemWithMeeting[]),
    getAnalytics().catch(() => null as AnalyticsData | null),
  ]);

  const recentMeetings = meetings.slice(0, 5);
  const dueSoon = actionItems
    .filter((item) => item.status === "TODO")
    .sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })
    .slice(0, 5);
  const openActionItems = actionItems.filter((item) => item.status === "TODO").length;

  return (
    <DashboardOverview
      firstName={firstName}
      meetingsCount={meetings.length}
      openActionItems={openActionItems}
      analytics={analytics}
      recentMeetings={recentMeetings}
      dueSoon={dueSoon}
    />
  );
}
