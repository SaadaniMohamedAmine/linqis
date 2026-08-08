import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { token, newPassword } = await request.json();
  if (!token || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const prisma = getPrisma();
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { hashedPassword } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  return NextResponse.json({ message: "Password updated." });
}
