import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface InviteEmail {
  to: string;
  workspaceName: string;
  token: string;
}

export async function sendInviteEmail({ to, workspaceName, token }: InviteEmail): Promise<void> {
  const siteUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  await transporter.sendMail({
    from: `"Linqis" <${process.env.SMTP_FROM || "noreply@linqis.app"}>`,
    to,
    subject: `You've been invited to join ${workspaceName} on Linqis`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #0A0A0A; font-size: 20px;">Join ${workspaceName} on Linqis</h1>
        <p style="color: #666; font-size: 14px;">You've been invited to collaborate on meeting summaries, decisions, and action items.</p>
        <a href="${siteUrl}/invite/${token}" style="display: inline-block; background: #22C55E; color: #0A0A0A; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Accept invitation</a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">This invite expires in 7 days.</p>
      </div>
    `,
  });
}
