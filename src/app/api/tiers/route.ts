import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

// GET ALL TIERS
export async function GET() {
  try {
    const rows = await executeQuery("SELECT * FROM product_tiers ORDER BY id ASC");
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("GET tiers API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ADD NEW TIER
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const result = await executeQuery("INSERT INTO product_tiers (name) VALUES (?)", [name.trim()]);
    const insertId = result.insertId;

    return NextResponse.json({ id: insertId, name: name.trim() });
  } catch (err: any) {
    console.error("POST tiers API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE TIER
export async function PUT(request: Request) {
  try {
    const { id, name } = await request.json();
    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: "ID and name are required." }, { status: 400 });
    }

    await executeQuery("UPDATE product_tiers SET name = ? WHERE id = ?", [name.trim(), id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT tiers API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE TIER
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    await executeQuery("DELETE FROM product_tiers WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE tiers API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
