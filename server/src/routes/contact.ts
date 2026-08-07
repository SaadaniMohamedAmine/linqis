import { Router } from "express";
import nodemailer from "nodemailer";

export const router = Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

router.post("/", async (req, res) => {
  try {
    const { name, email, company, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email and message are required" });
    }

    await transporter.sendMail({
      from: `"Linqis Contact Form" <${process.env.SMTP_FROM || "noreply@linqis.app"}>`,
      to: process.env.SALES_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `New contact form submission from ${name}${company ? ` (${company})` : ""}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Company:</strong> ${company || "—"}</p><p>${message}</p>`,
    });

    res.json({ status: "sent" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send your message. Try again in a moment." });
  }
});
