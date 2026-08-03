import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

// GET ALL PROJECTS
export async function GET() {
  try {
    const rows = await executeQuery("SELECT * FROM projects ORDER BY id DESC");
    
    // Parse JSON columns
    const parsed = rows.map((row: any) => {
      try {
        row.services_used = typeof row.services_used === "string" ? JSON.parse(row.services_used) : row.services_used;
      } catch {
        row.services_used = [];
      }
      try {
        row.images = typeof row.images === "string" ? JSON.parse(row.images) : row.images;
      } catch {
        row.images = [];
      }
      return row;
    });

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("GET projects API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ADD NEW PROJECT
export async function POST(request: Request) {
  try {
    const { title, slug, client_name, location, project_date, services_used, description, images, active } = await request.json();
    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required." }, { status: 400 });
    }

    const servicesStr = JSON.stringify(services_used || []);
    const imagesStr = JSON.stringify(images || []);

    const result = await executeQuery(
      "INSERT INTO projects (title, slug, client_name, location, project_date, services_used, description, images, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title.trim(), slug.trim(), client_name || null, location || null, project_date || null, servicesStr, description || "", imagesStr, active !== undefined ? active : 1]
    );
    const insertId = result.insertId;

    return NextResponse.json({ id: insertId, title, slug, client_name, location, project_date, services_used, description, images, active });
  } catch (err: any) {
    console.error("POST projects API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE PROJECT
export async function PUT(request: Request) {
  try {
    const { id, title, slug, client_name, location, project_date, services_used, description, images, active } = await request.json();
    if (!id || !title || !slug) {
      return NextResponse.json({ error: "ID, title, and slug are required." }, { status: 400 });
    }

    const servicesStr = JSON.stringify(services_used || []);
    const imagesStr = JSON.stringify(images || []);

    await executeQuery(
      "UPDATE projects SET title = ?, slug = ?, client_name = ?, location = ?, project_date = ?, services_used = ?, description = ?, images = ?, active = ? WHERE id = ?",
      [title.trim(), slug.trim(), client_name || null, location || null, project_date || null, servicesStr, description || "", imagesStr, active !== undefined ? active : 1, id]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT projects API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE PROJECT
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    await executeQuery("DELETE FROM projects WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE projects API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
