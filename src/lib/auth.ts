import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrisma } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";

// Credentials lives here rather than in auth.config.ts (shared with
// middleware.ts, which runs in the Edge runtime) because bcryptjs + Prisma
// blow well past Vercel's Edge Function size limit. This file only runs in
// the Node.js runtime (API routes, server components), where that's fine.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(getPrisma()),
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.hashedPassword) return null; // Google-only account, no password set

        const valid = await bcrypt.compare(credentials.password as string, user.hashedPassword);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // Overrides authConfig's edge-safe jwt callback with a DB-backed one --
    // fine here since this only runs in the Node.js runtime, on actual
    // sign-in requests, never in middleware.
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.sub = user.id;
        const prisma = getPrisma();
        const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { onboardingCompleted: true } });
        token.onboardingCompleted = dbUser?.onboardingCompleted ?? false;
      }
      // Lets the onboarding page force the token to reflect completion
      // immediately (via useSession().update()) instead of waiting for the
      // next full sign-in, which would otherwise bounce back to /onboarding.
      if (trigger === "update" && session?.onboardingCompleted !== undefined) {
        token.onboardingCompleted = session.onboardingCompleted;
      }
      return token;
    },
  },
});
