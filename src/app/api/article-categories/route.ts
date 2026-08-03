import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET - list all article categories
export async function GET() {
  try {
    const rows = await executeQuery(
      "SELECT * FROM article_categories ORDER BY name ASC"
    );
    return NextResponse.json({ categories: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - create category
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 });
    }
    const slug = slugify(name);
    await executeQuery(
      "INSERT INTO article_categories (name, slug) VALUES (?, ?)",
      [name.trim(), slug]
    );
    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - update category
export async function PUT(request: Request) {
  try {
    const { id, name } = await request.json();
    if (!id || !name?.trim()) {
      return NextResponse.json({ error: "ID dan nama wajib diisi" }, { status: 400 });
    }
    const slug = slugify(name);
    await executeQuery(
      "UPDATE article_categories SET name = ?, slug = ? WHERE id = ?",
      [name.trim(), slug, id]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - delete category
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    }
    await executeQuery("DELETE FROM article_categories WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
