import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Token dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    // Verify token and expiry
    const rows = await executeQuery(
      "SELECT id, reset_token_expiry FROM admin_users WHERE reset_token = ?",
      [token]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Token reset password tidak valid atau sudah kadaluwarsa." },
        { status: 400 }
      );
    }

    const user = rows[0];
    if (user.reset_token_expiry) {
      const expiryDate = new Date(user.reset_token_expiry);
      if (expiryDate < new Date()) {
        return NextResponse.json(
          { success: false, message: "Token reset password telah kadaluwarsa. Silakan ajukan ulang." },
          { status: 400 }
        );
      }
    }

    // Update password and clear token
    await executeQuery(
      "UPDATE admin_users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      [newPassword, user.id]
    );

    return NextResponse.json({
      success: true,
      message: "Password Anda berhasil diperbarui. Silakan login dengan password baru.",
    });
  } catch (err: any) {
    console.error("Reset password API error:", err);
    return NextResponse.json(
      { success: false, message: "Server error: " + err.message },
      { status: 500 }
    );
  }
}

