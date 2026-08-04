import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/integrations?error=missing_code", request.url));
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${apiUrl}/api/integrations/google-calendar/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, userId: session.user.id }),
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/dashboard/integrations?error=exchange_failed", request.url));
  }

  return NextResponse.redirect(new URL("/dashboard/integrations?connected=google-calendar", request.url));
}
