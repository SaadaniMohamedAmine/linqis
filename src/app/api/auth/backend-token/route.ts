import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const token = jwt.sign(
    { userId: session.user.id },
    process.env.BACKEND_JWT_SECRET!,
    { expiresIn: "15m" }
  );

  return NextResponse.json({ token, expiresIn: 900 });
}
