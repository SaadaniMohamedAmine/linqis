import nodemailer from "nodemailer";

// Own transporter instance for the Next.js app -- separate deployment
// (Vercel) from the Express server (Railway), so it can't import
// server/src/services/export/email.ts (different deployable, wouldn't
// resolve at runtime). Same SMTP_* env var names as the server's transporter
// by convention, but each deployment configures its own copies.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendPasswordResetEmail(opts: { to: string; resetToken?: string; googleOnly?: boolean }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (opts.googleOnly) {
    await transporter.sendMail({
      from: `"Linqis" <${process.env.SMTP_FROM || "noreply@linqis.app"}>`,
      to: opts.to,
      subject: "About your Linqis account",
      html: `<p>This account uses Google sign-in and doesn't have a password. Use "Continue with Google" on the sign-in page instead.</p>`,
    });
    return;
  }

  await transporter.sendMail({
    from: `"Linqis" <${process.env.SMTP_FROM || "noreply@linqis.app"}>`,
    to: opts.to,
    subject: "Reset your Linqis password",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #0A0A0A; font-size: 20px;">Reset your password</h1>
        <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        <a href="${siteUrl}/reset-password?token=${opts.resetToken}" style="display: inline-block; background: #22C55E; color: #0A0A0A; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Reset password</a>
      </div>
    `,
  });
}
