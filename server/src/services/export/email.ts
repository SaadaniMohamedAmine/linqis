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

export interface EmailExport {
  meetingId: string;
  title: string;
  summary: string;
  decisions: any[];
  actionItems: any[];
  mood: string;
  to: string;
}

export async function exportToEmail(data: EmailExport): Promise<void> {
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0A0A0A; font-size: 24px;">${data.title}</h1>
      <p style="color: #666; font-size: 14px;">Linqis • ${new Date().toLocaleDateString()}</p>
      
      <div style="background: #141414; border: 1px solid #1F1F1F; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #FAFAFA; font-size: 18px; margin: 0 0 12px 0;">Executive Summary</h2>
        <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6;">${data.summary}</p>
      </div>
      
      <div style="display: flex; gap: 16px; margin: 20px 0;">
        <div style="background: #22C55E10; padding: 12px; border-radius: 6px;">
          <strong style="color: #22C55E;">Mood</strong><br/>
          <span style="color: #A1A1AA;">${data.mood}</span>
        </div>
        <div style="background: #3B82F610; padding: 12px; border-radius: 6px;">
          <strong style="color: #3B82F6;">Decisions</strong><br/>
          <span style="color: #A1A1AA;">${data.decisions.length}</span>
        </div>
        <div style="background: #EAB30810; padding: 12px; border-radius: 6px;">
          <strong style="color: #EAB308;">Actions</strong><br/>
          <span style="color: #A1A1AA;">${data.actionItems.length}</span>
        </div>
      </div>
      
      <h3 style="color: #FAFAFA; font-size: 16px;">Decisions</h3>
      <ul style="color: #A1A1AA; font-size: 14px;">
        ${data.decisions.map((d: any) => `<li>${d.statement}</li>`).join("")}
      </ul>
      
      <h3 style="color: #FAFAFA; font-size: 16px;">Action Items</h3>
      <ul style="color: #A1A1AA; font-size: 14px;">
        ${data.actionItems.map((a: any) => `<li>${a.task} (${a.owner || "Unassigned"})</li>`).join("")}
      </ul>
    </div>
  `;

  await transporter.sendMail({
    from: `"Linqis" <${process.env.SMTP_FROM || "noreply@linqis.app"}>`,
    to: data.to,
    subject: `Meeting Summary: ${data.title}`,
    html,
  });
}
