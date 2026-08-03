import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

// GET all social wall posts
export async function GET() {
  try {
    const rows = await executeQuery(
      "SELECT * FROM social_wall_posts ORDER BY created_at DESC"
    );
    return NextResponse.json(rows || []);
  } catch (err: any) {
    console.error("GET /api/social-wall error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create new social wall post
export async function POST(request: Request) {
  try {
    const { platform, post_url, image_url, caption } = await request.json();

    if (!platform || !post_url) {
      return NextResponse.json(
        { error: "Platform and post URL are required." },
        { status: 400 }
      );
    }

    await executeQuery(
      "INSERT INTO social_wall_posts (platform, post_url, image_url, caption) VALUES (?, ?, ?, ?)",
      [platform, post_url, image_url || null, caption || null]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("POST /api/social-wall error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE a social wall post
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is required." },
        { status: 400 }
      );
    }

    await executeQuery("DELETE FROM social_wall_posts WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/social-wall error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
