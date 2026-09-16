import nodemailer from "nodemailer";
import { executeQuery } from "./dbMysql";

export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
  let smtpHost = process.env.SMTP_HOST || "";
  let smtpPort = Number(process.env.SMTP_PORT) || 587;
  let smtpUser = process.env.SMTP_USER || "";
  let smtpPass = process.env.SMTP_PASS || "";
  let smtpSender = process.env.SMTP_SENDER_NAME || "Master UPVC";
  let smtpSecure = process.env.SMTP_SECURE === "true";

  try {
    const rows = await executeQuery("SELECT * FROM settings WHERE id = 1 LIMIT 1");
    if (Array.isArray(rows) && rows.length > 0) {
      const s = rows[0];
      if (s.smtp_host) smtpHost = s.smtp_host;
      if (s.smtp_port) smtpPort = Number(s.smtp_port);
      if (s.smtp_user) smtpUser = s.smtp_user;
      if (s.smtp_pass) smtpPass = s.smtp_pass;
      if (s.smtp_sender_name) smtpSender = s.smtp_sender_name;
      if (s.smtp_secure !== undefined && s.smtp_secure !== null) smtpSecure = Number(s.smtp_secure) === 1;
    }
  } catch (e) {
    console.error("Error fetching SMTP settings from DB:", e);
  }

  if (!smtpHost || !smtpUser) {
    throw new Error("Pengaturan SMTP Email belum dikonfigurasi di Admin Settings.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure || smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: `"${smtpSender}" <${smtpUser}>`,
    to,
    subject,
    text: text || subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
}

