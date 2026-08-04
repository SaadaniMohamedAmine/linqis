import NextAuth from "next-auth";
import { NextResponse } from "next/server";
// Deliberately using the Edge-safe authConfig (Google only, no Prisma/bcrypt)
// rather than the full config in @/lib/auth -- this runs in the Edge
// runtime, which has a strict bundle size limit. See auth.config.ts.
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const session = request.auth;
  const { pathname } = request.nextUrl;
  const isDashboard = pathname.startsWith("/dashboard");
  const isOnboarding = pathname.startsWith("/onboarding");

  // If user is logged in and tries to access sign-in or sign-up, redirect to dashboard
  if (session && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not logged in and tries to access dashboard, redirect to sign-in
  if (!session && isDashboard) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Logged in but hasn't finished onboarding yet -- send them there before
  // any dashboard page. onboardingCompleted is already baked into the JWT
  // (see auth.ts), so this is just a token read, no DB call.
  if (session && isDashboard && session.user.onboardingCompleted === false && !isOnboarding) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/sign-in", "/sign-up", "/onboarding/:path*"],
};
