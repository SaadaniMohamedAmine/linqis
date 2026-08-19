import { auth } from "@/lib/auth";
import { resolveWorkspaceForUser } from "@/lib/workspace";
import { PricingView } from "@/components/pricing-view";

export default async function PricingPage() {
  const session = await auth();
  let currentPlan: "FREE" | "PRO" | null = null;
  if (session?.user?.id) {
    // Plans belong to workspaces now. Server-rendered, so there's no
    // localStorage to read the active one from -- fall back to the personal
    // workspace, which is the right answer for the common single-team case.
    const resolved = await resolveWorkspaceForUser(session.user.id);
    currentPlan = resolved?.workspace.plan ?? "FREE";
  }
  const isLoggedIn = !!session?.user?.id;

  return <PricingView isLoggedIn={isLoggedIn} currentPlan={currentPlan} />;
}
