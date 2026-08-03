import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

// GET ALL SERVICES
export async function GET() {
  try {
    const rows = await executeQuery("SELECT * FROM services ORDER BY id ASC");
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("GET services API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ADD NEW SERVICE
export async function POST(request: Request) {
  try {
    const { title, slug, description, icon, image_url, active } = await request.json();
    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required." }, { status: 400 });
    }

    const result = await executeQuery(
      "INSERT INTO services (title, slug, description, icon, image_url, active) VALUES (?, ?, ?, ?, ?, ?)",
      [title.trim(), slug.trim(), description || "", icon || "Sparkles", image_url || null, active !== undefined ? active : 1]
    );
    const insertId = result.insertId;

    return NextResponse.json({ id: insertId, title, slug, description, icon, image_url, active });
  } catch (err: any) {
    console.error("POST services API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE SERVICE
export async function PUT(request: Request) {
  try {
    const { id, title, slug, description, icon, image_url, active } = await request.json();
    if (!id || !title || !slug) {
      return NextResponse.json({ error: "ID, title, and slug are required." }, { status: 400 });
    }

    await executeQuery(
      "UPDATE services SET title = ?, slug = ?, description = ?, icon = ?, image_url = ?, active = ? WHERE id = ?",
      [title.trim(), slug.trim(), description || "", icon || "Sparkles", image_url || null, active !== undefined ? active : 1, id]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT services API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE SERVICE
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    await executeQuery("DELETE FROM services WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE services API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
