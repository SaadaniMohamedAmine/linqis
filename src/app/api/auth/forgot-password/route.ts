import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { getPrisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always the same response whether or not the account exists -- avoids
  // account enumeration.
  const genericResponse = NextResponse.json({ message: "If that email exists, we've sent a reset link." });

  if (!user) return genericResponse;

  if (!user.hashedPassword) {
    // Google-only account: no password to reset. We inform them honestly by
    // email instead of leaving them wondering, without revealing this in the
    // HTTP response (same anti-enumeration logic).
    await sendPasswordResetEmail({ to: email, googleOnly: true });
    return genericResponse;
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 60 * 60 * 1000) }, // 1h
  });

  await sendPasswordResetEmail({ to: email, resetToken: rawToken });
  return genericResponse;
}
