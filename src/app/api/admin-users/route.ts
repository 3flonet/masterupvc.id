import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

// GET ALL ADMIN USERS

let isTableMigrated = false;
async function ensureTableMigrated() {
  if (isTableMigrated) return;
  try {
    await executeQuery("ALTER TABLE admin_users ADD COLUMN name VARCHAR(255) NULL AFTER id");
  } catch (e) {
    // column already exists
  }
  isTableMigrated = true;
}

export async function GET() {
  await ensureTableMigrated();
  try {
    const rows = await executeQuery(
      "SELECT id, name, email, created_at FROM admin_users ORDER BY id ASC"
    );
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("GET admin-users error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// CREATE NEW ADMIN USER
export async function POST(request: Request) {
  await ensureTableMigrated();
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email dan password wajib diisi." }, { status: 400 });
    }

    // Check if email already exists
    const existing = await executeQuery("SELECT id FROM admin_users WHERE email = ?", [email.trim()]);
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ success: false, message: "Email admin sudah terdaftar." }, { status: 400 });
    }

    const userName = name || email.split("@")[0];

    const result = await executeQuery(
      "INSERT INTO admin_users (name, email, password) VALUES (?, ?, ?)",
      [userName, email.trim(), password]
    );

    return NextResponse.json({ success: true, message: "Pengguna admin berhasil ditambahkan.", id: result.insertId });
  } catch (err: any) {
    console.error("POST admin-users error:", err);
    return NextResponse.json({ success: false, message: "Server error: " + err.message }, { status: 500 });
  }
}

// UPDATE ADMIN USER
export async function PUT(request: Request) {
  await ensureTableMigrated();
  try {
    const { id, name, email, password } = await request.json();

    if (!id || !email) {
      return NextResponse.json({ success: false, message: "ID dan email wajib diisi." }, { status: 400 });
    }

    // Check duplicate email for another user
    const existing = await executeQuery("SELECT id FROM admin_users WHERE email = ? AND id != ?", [email.trim(), id]);
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ success: false, message: "Email sudah digunakan oleh akun lain." }, { status: 400 });
    }

    if (password && password.trim() !== "") {
      await executeQuery(
        "UPDATE admin_users SET name = ?, email = ?, password = ? WHERE id = ?",
        [name || email.split("@")[0], email.trim(), password, id]
      );
    } else {
      await executeQuery(
        "UPDATE admin_users SET name = ?, email = ? WHERE id = ?",
        [name || email.split("@")[0], email.trim(), id]
      );
    }

    return NextResponse.json({ success: true, message: "Data admin berhasil diperbarui." });
  } catch (err: any) {
    console.error("PUT admin-users error:", err);
    return NextResponse.json({ success: false, message: "Server error: " + err.message }, { status: 500 });
  }
}

// DELETE ADMIN USER
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID admin wajib disertakan." }, { status: 400 });
    }

    // Check if target admin is the primary admin (ID 1 or first created admin)
    const firstAdmin = await executeQuery("SELECT id FROM admin_users ORDER BY id ASC LIMIT 1");
    if (Array.isArray(firstAdmin) && firstAdmin.length > 0) {
      const primaryId = firstAdmin[0].id;
      if (Number(id) === Number(primaryId) || Number(id) === 1) {
        return NextResponse.json(
          { success: false, message: "Akun Super Admin Utama (ID 1) dilindungi dan tidak dapat dihapus." },
          { status: 400 }
        );
      }
    }

    // Check total admins count (prevent deleting the last admin)
    const countRows = await executeQuery("SELECT COUNT(*) as total FROM admin_users");
    const total = Array.isArray(countRows) && countRows.length > 0 ? countRows[0].total : 0;

    if (total <= 1) {
      return NextResponse.json({ success: false, message: "Tidak dapat menghapus admin terakhir." }, { status: 400 });
    }

    await executeQuery("DELETE FROM admin_users WHERE id = ?", [id]);
    return NextResponse.json({ success: true, message: "Akun admin berhasil dihapus." });
  } catch (err: any) {
    console.error("DELETE admin-users error:", err);
    return NextResponse.json({ success: false, message: "Server error: " + err.message }, { status: 500 });
  }
}

