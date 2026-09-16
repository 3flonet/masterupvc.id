import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

export async function POST(request: Request) {
  try {
    const { email, oldPassword, newPassword } = await request.json();

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, password lama, dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    // Verify user & old password
    const rows = await executeQuery(
      "SELECT id FROM admin_users WHERE email = ? AND password = ?",
      [email.trim(), oldPassword]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Password lama tidak sesuai." },
        { status: 401 }
      );
    }

    const userId = rows[0].id;

    // Update password
    await executeQuery("UPDATE admin_users SET password = ? WHERE id = ?", [newPassword, userId]);

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui. Silakan gunakan password baru pada login berikutnya.",
    });
  } catch (err: any) {
    console.error("Change password API error:", err);
    return NextResponse.json(
      { success: false, message: "Server error: " + err.message },
      { status: 500 }
    );
  }
}

