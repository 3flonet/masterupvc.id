import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

// GET ALL LEADS
export async function GET() {
  try {
    const rows = await executeQuery("SELECT * FROM contact_submissions ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("GET contact-submissions error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST NEW LEAD FROM CHATBOT
export async function POST(request: Request) {
  try {
    const { name, phone, email, message } = await request.json();

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Name, Phone, and Message are required." }, { status: 400 });
    }

    const result = await executeQuery(
      "INSERT INTO contact_submissions (name, phone, email, message, status) VALUES (?, ?, ?, ?, 'new')",
      [name, phone, email || null, message]
    );

    return NextResponse.json({ success: true, insertId: (result as any)?.insertId });
  } catch (err: any) {
    console.error("POST contact-submissions error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE LEAD STATUS
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID and Status are required." }, { status: 400 });
    }

    await executeQuery(
      "UPDATE contact_submissions SET status = ? WHERE id = ?",
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT contact-submissions error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE LEAD
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    await executeQuery("DELETE FROM contact_submissions WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE contact-submissions error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
