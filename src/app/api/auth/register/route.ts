import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "name, email and password are required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const prisma = getPrisma();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  // Every account starts with a personal workspace it owns -- meetings are
  // scoped to a workspace, so without one the user couldn't upload anything.
  // (Google accounts are created by the PrismaAdapter, not this route; they
  // get theirs from the `createUser` event in lib/auth.ts.)
  const workspace = await prisma.workspace.create({
    data: { name: `${name}'s Workspace`, ownerId: user.id },
  });
  await prisma.workspaceMember.create({
    data: { workspaceId: workspace.id, userId: user.id, role: "OWNER" },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
