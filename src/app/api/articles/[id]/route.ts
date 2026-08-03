import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

function extractYoutubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : url;
}

// GET single article by id (for admin edit)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await executeQuery(
      `SELECT a.*, ac.name AS category_name, ac.slug AS category_slug
       FROM articles a
       LEFT JOIN article_categories ac ON a.category_id = ac.id
       WHERE a.id = ? LIMIT 1`,
      [id]
    );
    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ article: (rows as any[])[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - update article
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, excerpt, content, media_type, media_value, category_id, status } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Judul artikel wajib diisi" }, { status: 400 });
    }

    let finalMediaValue = media_value || null;
    if (media_type === "youtube" && finalMediaValue) {
      finalMediaValue = extractYoutubeId(finalMediaValue);
    }

    const existingRows = await executeQuery(
      "SELECT status, published_at FROM articles WHERE id = ?",
      [id]
    );
    const existing = (existingRows as any[])[0];
    let publishedAt = existing?.published_at || null;
    if (status === "published" && existing?.status !== "published") {
      publishedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    }

    await executeQuery(
      `UPDATE articles 
       SET title = ?, excerpt = ?, content = ?, media_type = ?, media_value = ?,
           category_id = ?, status = ?, published_at = ?
       WHERE id = ?`,
      [
        title.trim(),
        excerpt?.trim() || null,
        content?.trim() || null,
        media_type || "image_url",
        finalMediaValue,
        category_id || null,
        status || "draft",
        publishedAt,
        id,
      ]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - delete article
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await executeQuery("DELETE FROM articles WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
