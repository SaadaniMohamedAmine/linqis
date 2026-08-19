import { DashboardChrome } from "@/components/dashboard-chrome";
import { ToastProvider } from "@/components/toast-provider";
import { getUser } from "@/lib/api";

// Usage data changes on every upload; never serve a stale build-time snapshot.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Server-rendered so the sidebar has real data on first paint. Falls back
  // to a zero count rather than crashing the whole dashboard shell if the
  // Express API is unreachable (e.g. cold start on Railway).
  let meetingsThisMonth = 0;
  let maxMeetingsPerMonth: number | null = 5;
  try {
    const user = await getUser();
    meetingsThisMonth = user.meetingsThisMonth;
    maxMeetingsPerMonth = user.maxMeetingsPerMonth;
  } catch {
    // keep the FREE-tier fallback above
  }

  return (
    <ToastProvider>
      <DashboardChrome meetingsThisMonth={meetingsThisMonth} maxMeetingsPerMonth={maxMeetingsPerMonth}>
        {children}
      </DashboardChrome>
    </ToastProvider>
  );
}
