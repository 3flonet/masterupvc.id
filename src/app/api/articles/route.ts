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

function extractYoutubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : url;
}

// GET - list articles (with optional filters)
// Query params: ?category=slug&status=published&limit=9&page=1&slug=article-slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const status = searchParams.get("status") || "published";
    const limit = parseInt(searchParams.get("limit") || "9");
    const page = parseInt(searchParams.get("page") || "1");
    const slug = searchParams.get("slug");
    const offset = (page - 1) * limit;

    // Single article by slug
    if (slug) {
      const rows = await executeQuery(
        `SELECT a.*, ac.name AS category_name, ac.slug AS category_slug
         FROM articles a
         LEFT JOIN article_categories ac ON a.category_id = ac.id
         WHERE a.slug = ?
         LIMIT 1`,
        [slug]
      );
      if ((rows as any[]).length === 0) {
        return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json({ article: (rows as any[])[0] });
    }

    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];

    if (status !== "all") {
      conditions.push("a.status = ?");
      params.push(status);
    }
    if (categorySlug && categorySlug !== "semua") {
      conditions.push("ac.slug = ?");
      params.push(categorySlug);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count total
    const countRows = await executeQuery(
      `SELECT COUNT(*) AS total FROM articles a
       LEFT JOIN article_categories ac ON a.category_id = ac.id
       ${whereClause}`,
      params
    );
    const total = (countRows as any[])[0].total;

    // Fetch articles
    const rows = await executeQuery(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.media_type, a.media_value,
              a.status, a.published_at, a.created_at,
              ac.name AS category_name, ac.slug AS category_slug
       FROM articles a
       LEFT JOIN article_categories ac ON a.category_id = ac.id
       ${whereClause}
       ORDER BY a.published_at DESC, a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      articles: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - create article
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, media_type, media_value, category_id, status } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Judul artikel wajib diisi" }, { status: 400 });
    }

    // Auto-generate unique slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await executeQuery("SELECT id FROM articles WHERE slug = ?", [slug]);
      if ((existing as any[]).length === 0) break;
      slug = `${baseSlug}-${counter++}`;
    }

    // Normalize youtube value to ID only
    let finalMediaValue = media_value || null;
    if (media_type === "youtube" && finalMediaValue) {
      finalMediaValue = extractYoutubeId(finalMediaValue);
    }

    const publishedAt = status === "published" ? new Date().toISOString().slice(0, 19).replace("T", " ") : null;

    await executeQuery(
      `INSERT INTO articles (title, slug, excerpt, content, media_type, media_value, category_id, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        slug,
        excerpt?.trim() || null,
        content?.trim() || null,
        media_type || "image_url",
        finalMediaValue,
        category_id || null,
        status || "draft",
        publishedAt,
      ]
    );

    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
