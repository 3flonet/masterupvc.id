import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { executeQuery } from "@/utils/dbMysql";

export async function POST(request: Request) {
  try {
    const { test_email, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_sender_name, smtp_secure } = await request.json();

    if (!test_email || !test_email.includes("@")) {
      return NextResponse.json({ error: "Email tujuan tes tidak valid." }, { status: 400 });
    }

    let host = smtp_host;
    let port = smtp_port ? Number(smtp_port) : 587;
    let user = smtp_user;
    let pass = smtp_pass;
    let sender = smtp_sender_name || "Master UPVC Official";
    let secure = smtp_secure ? Number(smtp_secure) === 1 : port === 465;

    // If unsaved or partial, fallback to DB
    if (!host || !user) {
      const rows = await executeQuery("SELECT * FROM settings WHERE id = 1 LIMIT 1");
      if (Array.isArray(rows) && rows.length > 0) {
        const s = rows[0];
        if (!host) host = s.smtp_host;
        if (!port) port = Number(s.smtp_port) || 587;
        if (!user) user = s.smtp_user;
        if (!pass) pass = s.smtp_pass;
        if (!sender) sender = s.smtp_sender_name || "Master UPVC Official";
        if (s.smtp_secure !== undefined) secure = Number(s.smtp_secure) === 1 || port === 465;
      }
    }

    if (!host || !user) {
      return NextResponse.json({ error: "Lengkapi Host SMTP dan Username/Email terlebih dahulu." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: secure || port === 465,
      auth: {
        user,
        pass,
      },
    });

    // Verify connection configuration
    await transporter.verify();

    const mailOptions = {
      from: `"${sender}" <${user}>`,
      to: test_email,
      subject: "🧪 Tes Pengiriman Email SMTP - Master UPVC",
      text: "Selamat! Pengaturan email SMTP aplikasi Master UPVC telah berhasil terkonfigurasi dengan baik.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #ea580c; margin: 0; font-size: 24px;">Master UPVC Official</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Sistem Pengujian Email Server SMTP</p>
          </div>
          <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <h3 style="color: #9a3412; margin: 0 0 8px 0; font-size: 16px;">✅ Email Tes Berhasil Terkirim!</h3>
            <p style="color: #475569; font-size: 14px; margin: 0;">
              Jika Anda menerima pesan ini, artinya konfigurasi SMTP Host <strong>${host}:${port}</strong> dengan pengirim <strong>${sender}</strong> sudah berfungsi 100% normal.
            </p>
          </div>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            Fitur <strong>Lupa Password</strong> dan notifikasi sistem kini sudah siap digunakan secara otomatis oleh pengguna dan admin.
          </p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            Sent automatically by Master UPVC Admin Dashboard System
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: `Email tes berhasil dikirim ke ${test_email}! Silakan periksa kotak masuk atau folder spam Anda.`,
    });
  } catch (err: any) {
    console.error("Test email sending error:", err);
    return NextResponse.json({ error: `Gagal mengirim email: ${err.message || "Koneksi SMTP ditolak"}` }, { status: 500 });
  }
}
