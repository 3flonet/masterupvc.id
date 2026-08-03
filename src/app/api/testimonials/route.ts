import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

async function ensureTestimonialsTable() {
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      photo LONGTEXT NULL,
      comment TEXT NOT NULL,
      rating INT NOT NULL DEFAULT 5,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

export async function GET(request: Request) {
  try {
    await ensureTestimonialsTable();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "1";
    const query = activeOnly
      ? "SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC"
      : "SELECT * FROM testimonials ORDER BY created_at DESC";
    const rows = await executeQuery(query);
    return NextResponse.json(rows || []);
  } catch (err: any) {
    console.error("GET /api/testimonials error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTestimonialsTable();
    const { name, photo, comment, rating, is_active } = await request.json();
    if (!name || !comment) {
      return NextResponse.json({ error: "Nama dan komentar wajib diisi." }, { status: 400 });
    }
    const clampedRating = Math.min(5, Math.max(1, Number(rating) || 5));
    await executeQuery(
      "INSERT INTO testimonials (name, photo, comment, rating, is_active) VALUES (?, ?, ?, ?, ?)",
      [name, photo || null, comment, clampedRating, is_active !== undefined ? is_active : 1]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("POST /api/testimonials error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureTestimonialsTable();
    const { id, name, photo, comment, rating, is_active } = await request.json();
    if (!id) return NextResponse.json({ error: "ID wajib disertakan." }, { status: 400 });
    if (!name || !comment) return NextResponse.json({ error: "Nama dan komentar wajib diisi." }, { status: 400 });
    const clampedRating = Math.min(5, Math.max(1, Number(rating) || 5));
    await executeQuery(
      "UPDATE testimonials SET name = ?, photo = ?, comment = ?, rating = ?, is_active = ? WHERE id = ?",
      [name, photo || null, comment, clampedRating, is_active !== undefined ? is_active : 1, id]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT /api/testimonials error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID parameter wajib disertakan." }, { status: 400 });
    await executeQuery("DELETE FROM testimonials WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/testimonials error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
