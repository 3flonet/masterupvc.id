import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

// GET ALL PRODUCTS
export async function GET() {
  try {
    const rows = await executeQuery("SELECT * FROM products ORDER BY id ASC");
    // Ensure variants JSON is parsed if returned as string
    const parsedRows = rows.map((item: any) => ({
      id: item.id,
      name: item.name,
      category_id: Number(item.category_id),
      tier: item.tier,
      description: item.description || "",
      dimensions: item.dimensions || "",
      variants: typeof item.variants === "string" ? JSON.parse(item.variants) : (item.variants || []),
    }));
    return NextResponse.json(parsedRows);
  } catch (err: any) {
    console.error("GET products API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ADD NEW PRODUCT
export async function POST(request: Request) {
  try {
    const { name, category_id, tier, description, dimensions, variants } = await request.json();
    if (!name || !category_id || !tier || !variants) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const variantsJson = JSON.stringify(variants);
    const result = await executeQuery(
      "INSERT INTO products (name, category_id, tier, description, dimensions, variants) VALUES (?, ?, ?, ?, ?, ?)",
      [name, category_id, tier, description || null, dimensions || null, variantsJson]
    );

    return NextResponse.json({ id: result.insertId, name, category_id, tier, description, dimensions, variants });
  } catch (err: any) {
    console.error("POST products API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE PRODUCT
export async function PUT(request: Request) {
  try {
    const { id, name, category_id, tier, description, dimensions, variants } = await request.json();
    if (!id || !name || !category_id || !tier || !variants) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const variantsJson = JSON.stringify(variants);
    await executeQuery(
      "UPDATE products SET name = ?, category_id = ?, tier = ?, description = ?, dimensions = ?, variants = ? WHERE id = ?",
      [name, category_id, tier, description || null, dimensions || null, variantsJson, id]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT products API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE PRODUCT
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    await executeQuery("DELETE FROM products WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE products API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
