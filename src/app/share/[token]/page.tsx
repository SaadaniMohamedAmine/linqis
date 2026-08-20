import { ShareView } from "@/components/share-view";

interface SharedMeeting {
  id: string;
  title: string;
  summary: string | null;
  mood: string | null;
  createdAt: string;
  duration: number | null;
  decisions: { statement: string; status: string }[];
  actionItems: { task: string; owner: string | null; priority: string }[];
  participants: { name: string }[];
}

async function getSharedMeeting(token: string): Promise<SharedMeeting | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${apiUrl}/api/public/meetings/${token}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function SharedMeetingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const meeting = await getSharedMeeting(token);

  return <ShareView meeting={meeting} />;
}
