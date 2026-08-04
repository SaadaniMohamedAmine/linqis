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
    session: ({ session, token }) => {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
} satisfies NextAuthConfig;
