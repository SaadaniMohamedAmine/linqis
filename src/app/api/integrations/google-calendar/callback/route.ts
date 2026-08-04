import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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

  // Signed server-side (never sent to the browser) so Express can derive
  // the user the same way it does for every other request, instead of
  // trusting a userId in this server-to-server call's body.
  const token = jwt.sign({ userId: session.user.id }, process.env.BACKEND_JWT_SECRET!, { expiresIn: "5m" });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${apiUrl}/api/integrations/google-calendar/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/dashboard/integrations?error=exchange_failed", request.url));
  }

  return NextResponse.redirect(new URL("/dashboard/integrations?connected=google-calendar", request.url));
}
