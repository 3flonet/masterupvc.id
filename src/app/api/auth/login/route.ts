import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    }

    const rows = await executeQuery(
      "SELECT * FROM admin_users WHERE email = ? AND password = ?",
      [email.trim(), password]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({ success: true, email });
    }

    return NextResponse.json({ success: false, message: "Kredensial salah." }, { status: 401 });
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json({ success: false, message: "Server error: " + err.message }, { status: 500 });
  }
}
