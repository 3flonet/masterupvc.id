import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";
import { sendEmail } from "@/utils/mailer";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Email tidak valid." },
        { status: 400 }
      );
    }

    // Check user in database
    const rows = await executeQuery("SELECT id, name, email FROM admin_users WHERE email = ?", [email.trim()]);
    if (!Array.isArray(rows) || rows.length === 0) {
      // Return success to avoid user enumeration
      return NextResponse.json({
        success: true,
        message: "Jika email terdaftar, instruksi reset password telah dikirimkan ke email Anda.",
      });
    }

    const user = rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

    // Save token in admin_users
    await executeQuery(
      "UPDATE admin_users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
      [token, expiry.toISOString().slice(0, 19).replace("T", " "), user.id]
    );

    // Build reset link
    const origin = request.headers.get("origin") || request.headers.get("referer") || "http://localhost:3000";
    const resetUrl = `${origin.replace(/\/$/, "")}/admin/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    // Try sending email
    try {
      await sendEmail({
        to: user.email,
        subject: "?? Reset Password Admin - Master UPVC",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #09090b; color: #f4f4f5; border-radius: 12px;">
            <h2 style="color: #06b6d4; text-align: center;">Master UPVC Indonesia</h2>
            <hr style="border-color: #27272a; margin: 20px 0;" />
            <p>Halo <strong>${user.name || "Admin"}</strong>,</p>
            <p>Kami menerima permintaan untuk mereset kata sandi akun Admin Master UPVC Anda.</p>
            <p>Silakan klik tombol di bawah ini untuk membuat kata sandi baru:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #06b6d4; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password Saya</a>
            </div>
            <p style="font-size: 13px; color: #a1a1aa;">Atau salin tautan berikut ke browser Anda:</p>
            <p style="font-size: 12px; color: #06b6d4; word-break: break-all;">${resetUrl}</p>
            <hr style="border-color: #27272a; margin: 20px 0;" />
            <p style="font-size: 12px; color: #71717a;">Tautan ini berlaku selama 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.</p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: "Instruksi reset password telah berhasil dikirim ke email Anda.",
      });
    } catch (mailErr: any) {
      console.error("Mail send error:", mailErr);
      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengirim email: " + mailErr.message + ". Pastikan SMTP sudah dikonfigurasi di Admin Settings.",
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("Forgot password API error:", err);
    return NextResponse.json({ success: false, message: "Server error: " + err.message }, { status: 500 });
  }
}

