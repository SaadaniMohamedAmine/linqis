import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-safe on purpose: middleware.ts runs this config in the Edge runtime,
// which has a strict bundle size limit. The Credentials provider (bcryptjs +
// Prisma) lives only in auth.ts, which runs in the Node.js runtime -- adding
// it here previously pushed the middleware bundle over Vercel's 1MB Edge
// Function limit and broke every deploy.
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.sub = user.id;
      return token;
    },
    // Edge-safe: just reads fields already baked into the token, no DB call.
    // onboardingCompleted is populated once at actual sign-in by auth.ts's
    // own jwt callback (Node runtime only) and persists in the signed token
    // from then on, so middleware can read it here without touching Prisma.
    session: ({ session, token }) => {
      if (token.sub) session.user.id = token.sub;
      session.user.onboardingCompleted = (token.onboardingCompleted as boolean) ?? false;
      return session;
    },
  },
} satisfies NextAuthConfig;
