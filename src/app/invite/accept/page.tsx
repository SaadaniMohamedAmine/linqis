"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApiError, acceptInvite, setActiveWorkspaceId } from "@/lib/api";
import { useDictionary } from "@/lib/i18n/locale-context";
import { inviteAcceptDictionary } from "@/lib/i18n/dictionaries/invite-accept";

function AcceptInvite() {
  const t = useDictionary(inviteAcceptDictionary);
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
      setError(t.missingToken);
      return;
    }

    if (status === "unauthenticated") {
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(`/invite/accept?token=${token}`)}`);
      return;
    }

    if (!session?.user?.id || submitted.current) return;
    submitted.current = true;

    acceptInvite(token)
      .then(({ workspaceId }) => {
        // Land them straight in the workspace they were invited to.
        setActiveWorkspaceId(workspaceId);
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : t.acceptFailed);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.id, token, router]);

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center">
      <main className="w-full max-w-[420px] px-4">
        <div className="bg-surface/80 backdrop-blur-md rounded-xl p-6 flex flex-col gap-6 shadow-lg border border-border">
          {error ? (
            <>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{t.couldNotJoin}</h2>
                <p className="text-sm text-text-secondary">{error}</p>
              </div>
              <Link href="/dashboard">
                <Button variant="secondary" className="w-full h-12">{t.goToDashboard}</Button>
              </Link>
            </>
          ) : (
            <p className="text-sm text-text-secondary">{t.joining}</p>
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
