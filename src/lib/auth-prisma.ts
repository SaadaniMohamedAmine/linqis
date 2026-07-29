import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const nextAuth = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    session: ({ session, token }) => {
      session.user.id = token.sub as string;
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});

export const GET = async (req: Request) => {
  const { PrismaAdapter } = await import("@auth/prisma-adapter");
  const { getPrisma } = await import("@/lib/db");
  const handlers = NextAuth({
    adapter: PrismaAdapter(getPrisma()),
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    pages: {
      signIn: "/signin",
    },
    callbacks: {
      session: ({ session, user }) => {
        session.user.id = user.id;
        return session;
      },
    },
  }).handlers;
  return handlers.GET(req);
};

export const POST = async (req: Request) => {
  const { PrismaAdapter } = await import("@auth/prisma-adapter");
  const { getPrisma } = await import("@/lib/db");
  const handlers = NextAuth({
    adapter: PrismaAdapter(getPrisma()),
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    pages: {
      signIn: "/signin",
    },
    callbacks: {
      session: ({ session, user }) => {
        session.user.id = user.id;
        return session;
      },
    },
  }).handlers;
  return handlers.POST(req);
};

export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
