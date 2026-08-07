"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getInvitePreview, type InvitePreview } from "@/lib/api";

/**
 * Landing page for the link in an invitation email. Public on purpose -- the
 * invited person usually has no account yet. Once they're signed in we hand
 * off to /invite/accept, which does the actual join.
 */
export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [invite, setInvite] = useState<InvitePreview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getInvitePreview(token)
      .then(setInvite)
      .catch(() => setError("This invitation is invalid, has expired, or was already used."));
  }, [token]);

  // Already signed in: skip the sign-in prompt entirely.
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id && invite) {
      router.replace(`/invite/accept?token=${encodeURIComponent(token)}`);
    }
  }, [status, session?.user?.id, invite, router, token]);

  const callbackUrl = `/invite/accept?token=${encodeURIComponent(token)}`;

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-success/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-warning/5 rounded-full blur-[160px]" />
      </div>

      <main className="z-10 w-full max-w-[420px] px-4">
        <div className="bg-surface/80 backdrop-blur-md rounded-xl p-6 flex flex-col gap-6 shadow-lg border border-border">
          {error ? (
            <>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Invitation unavailable</h2>
                <p className="text-sm text-text-secondary">{error}</p>
              </div>
              <Link href="/">
                <Button variant="secondary" className="w-full h-12">Back to Linqis</Button>
              </Link>
            </>
          ) : !invite ? (
            <p className="text-sm text-text-secondary">Loading invitation…</p>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">
                  You&apos;ve been invited to join {invite.workspaceName}
                </h2>
                <p className="text-sm text-text-secondary">
                  Collaborate on meeting summaries, decisions and action items as a{" "}
                  {invite.role.toLowerCase()}. Sign in with <span className="text-text-primary">{invite.email}</span> to
                  accept.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                  <Button variant="primary" className="w-full h-12">Create an account</Button>
                </Link>
                <Link href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                  <Button variant="secondary" className="w-full h-12">I already have an account</Button>
                </Link>
              </div>

              <p className="text-xs text-text-secondary text-center">This invitation expires 7 days after it was sent.</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
