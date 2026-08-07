"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApiError, acceptInvite, setActiveWorkspaceId } from "@/lib/api";

function AcceptInvite() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status } = useSession();
  const token = params.get("token");

  const [error, setError] = useState("");
  // The effect can re-run (session refresh, StrictMode); the invite is
  // single-use, so guard against firing the request twice.
  const submitted = useRef(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!token) {
      setError("This link is missing its invitation token.");
      return;
    }

    if (status === "unauthenticated") {
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(`/invite/accept?token=${token}`)}`);
      return;
    }

    if (!session?.user?.id || submitted.current) return;
    submitted.current = true;

    acceptInvite(token, session.user.id)
      .then(({ workspaceId }) => {
        // Land them straight in the workspace they were invited to.
        setActiveWorkspaceId(workspaceId);
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Failed to accept this invitation.");
      });
  }, [status, session?.user?.id, token, router]);

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center">
      <main className="w-full max-w-[420px] px-4">
        <div className="bg-surface/80 backdrop-blur-md rounded-xl p-6 flex flex-col gap-6 shadow-lg border border-border">
          {error ? (
            <>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Couldn&apos;t join the workspace</h2>
                <p className="text-sm text-text-secondary">{error}</p>
              </div>
              <Link href="/dashboard">
                <Button variant="secondary" className="w-full h-12">Go to my dashboard</Button>
              </Link>
            </>
          ) : (
            <p className="text-sm text-text-secondary">Joining the workspace…</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={null}>
      <AcceptInvite />
    </Suspense>
  );
}
