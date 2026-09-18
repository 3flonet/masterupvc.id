import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

let isMigrated = false;
async function ensureWorkflowTable() {
  if (isMigrated) return;
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS workflow_steps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        step_number VARCHAR(50) NOT NULL DEFAULT 'Step 01',
        icon VARCHAR(50) NOT NULL DEFAULT '??',
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        is_active TINYINT NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const countRes: any = await executeQuery("SELECT COUNT(*) as count FROM workflow_steps");
    if (Array.isArray(countRes) && countRes[0]?.count === 0) {
      const seeds = [
        { step_number: "Step 01", icon: "??", title: "Konsultasi", desc: "Diskusikan model, ukuran kusen, jendela/pintu, dan pilihan warna kustom sesuai kebutuhan ruang Anda.", sort_order: 1, is_active: 1 },
        { step_number: "Step 02", icon: "??", title: "Penawaran Harga", desc: "Dapatkan rincian estimasi biaya transparan, opsi material terbaik, dan proposal penawaran harga resmi.", sort_order: 2, is_active: 1 },
        { step_number: "Step 03", icon: "??", title: "Proses Pemasangan", desc: "Survei pengukuran fisik presisi ke lokasi proyek Anda, diikuti perakitan fabrikasi dan instalasi oleh tim ahli.", sort_order: 3, is_active: 1 },
        { step_number: "Step 04", icon: "???", title: "Finish & Garansi", desc: "Serah terima pekerjaan dengan jaminan kerapian maksimal, garansi ketahanan produk, dan kepuasan pelanggan.", sort_order: 4, is_active: 1 }
      ];
      for (const seed of seeds) {
        await executeQuery(
          "INSERT INTO workflow_steps (step_number, icon, title, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)",
          [seed.step_number, seed.icon, seed.title, seed.desc, seed.sort_order, seed.is_active]
        );
      }
    }
    isMigrated = true;
  } catch (err) {
    console.error("ensureWorkflowTable error:", err);
  }
}

export async function GET() {
  try {
    await ensureWorkflowTable();
    const rows: any = await executeQuery("SELECT * FROM workflow_steps ORDER BY sort_order ASC, id ASC");
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /api/workflow-steps error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureWorkflowTable();
    const body = await req.json();
    const { step_number, icon, title, desc, description, sort_order, is_active } = body;
    const descText = desc !== undefined ? desc : description;

    if (!title || !descText) {
      return NextResponse.json({ error: "Judul dan deskripsi wajib diisi." }, { status: 400 });
    }

    const result: any = await executeQuery(
      "INSERT INTO workflow_steps (step_number, icon, title, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [
        step_number || "Step 01",
        icon || "??",
        title,
        descText,
        sort_order || 0,
        is_active !== undefined ? Number(is_active) : 1
      ]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    console.error("POST /api/workflow-steps error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await ensureWorkflowTable();
    const body = await req.json();
    const { id, step_number, icon, title, desc, description, sort_order, is_active } = body;
    const descText = desc !== undefined ? desc : description;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const fields: string[] = [];
    const values: any[] = [];

    if (step_number !== undefined) { fields.push("step_number = ?"); values.push(step_number); }
    if (icon !== undefined) { fields.push("icon = ?"); values.push(icon); }
    if (title !== undefined) { fields.push("title = ?"); values.push(title); }
    if (descText !== undefined) { fields.push("description = ?"); values.push(descText); }
    if (sort_order !== undefined) { fields.push("sort_order = ?"); values.push(Number(sort_order)); }
    if (is_active !== undefined) { fields.push("is_active = ?"); values.push(Number(is_active)); }

    if (fields.length === 0) {
      return NextResponse.json({ success: true });
    }

    values.push(id);
    await executeQuery(`UPDATE workflow_steps SET ${fields.join(", ")} WHERE id = ?`, values);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT /api/workflow-steps error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureWorkflowTable();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await executeQuery("DELETE FROM workflow_steps WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/workflow-steps error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
