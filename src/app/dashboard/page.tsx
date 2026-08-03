import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getMeetings } from "@/lib/api";

export default async function DashboardPage() {
  // The dashboard "overview" is really just the most recent meeting's detail
  // view. Redirect there if one exists so returning users land somewhere
  // useful instead of an empty tab shell.
  let meetings: Awaited<ReturnType<typeof getMeetings>> = [];
  try {
    meetings = await getMeetings();
  } catch {
    meetings = [];
  }

  if (meetings.length > 0) {
    redirect(`/dashboard/meetings/${meetings[0].id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-12 text-center gap-4">
      <h1 className="text-2xl font-semibold text-text-primary">No meetings yet</h1>
      <p className="text-text-secondary max-w-md">
        Upload a recording to get a transcript, executive summary, decisions and action items.
      </p>
      <Link href="/dashboard/upload">
        <Button variant="primary">Upload your first meeting</Button>
      </Link>
    </div>
  );
}
