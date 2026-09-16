import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

let isMigrated = false;
async function ensureTable() {
  if (isMigrated) return;
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS advantages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(100) DEFAULT 'Sparkles',
        sort_order INT DEFAULT 0,
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    
    // Seed default advantages if empty
    const rows: any = await executeQuery("SELECT COUNT(*) as count FROM advantages");
    if (rows[0].count === 0) {
      const defaults = [
        ["Kedap Suara", "Sistem double-sealing meredam kebisingan luar hingga 40dB, menciptakan ketenangan maksimal.", "Volume2", 1],
        ["Hemat Energi", "Konduktivitas termal yang rendah menjaga suhu ruangan tetap stabil dan menghemat penggunaan AC.", "Zap", 2],
        ["Tahan Air & Hujan", "Profil dirancang khusus dengan saluran pembuangan air terintegrasi, bebas bocor saat hujan deras.", "Droplet", 3],
        ["Tahan Cuaca Ekstrem", "Formula anti-UV berkualitas tinggi mencegah keretakan, kelapukan, dan perubahan warna akibat sinar matahari.", "SunDim", 4],
        ["Tahan Polusi", "Material solid yang kebal terhadap korosi asam akibat hujan asam dan udara perkotaan yang pekat.", "Wind", 5],
        ["Perawatan Mudah", "Permukaan halus yang tidak memerlukan pengecatan ulang. Cukup dibersihkan dengan kain basah.", "Sparkles", 6],
        ["Anti Rayap", "100% bebas dari ancaman rayap dan serangga perusak kayu lainnya sepanjang masa.", "ShieldAlert", 7],
        ["Anti Debu", "Kerapatan presisi tinggi mencegah partikel debu halus menyelinap masuk ke dalam rumah.", "ShieldCheck", 8]
      ];
      for (const item of defaults) {
        await executeQuery(
          "INSERT INTO advantages (title, description, icon, sort_order) VALUES (?, ?, ?, ?)",
          item
        );
      }
    }
  } catch (err) {
    console.error("Advantages table init error:", err);
  }
  isMigrated = true;
}

export async function GET() {
  try {
    await ensureTable();
    const rows = await executeQuery("SELECT * FROM advantages ORDER BY sort_order ASC, id ASC");
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("GET advantages error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const { title, description, icon, sort_order, active } = await request.json();
    if (!title) {
      return NextResponse.json({ error: "Judul keunggulan wajib diisi." }, { status: 400 });
    }

    const result = await executeQuery(
      "INSERT INTO advantages (title, description, icon, sort_order, active) VALUES (?, ?, ?, ?, ?)",
      [title.trim(), description || "", icon || "Sparkles", sort_order || 0, active !== undefined ? active : 1]
    );

    return NextResponse.json({ success: true, id: result.insertId, message: "Keunggulan berhasil ditambahkan." });
  } catch (err: any) {
    console.error("POST advantages error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureTable();
    const { id, title, description, icon, sort_order, active } = await request.json();
    if (!id || !title) {
      return NextResponse.json({ error: "ID dan Judul wajib diisi." }, { status: 400 });
    }

    await executeQuery(
      "UPDATE advantages SET title = ?, description = ?, icon = ?, sort_order = ?, active = ? WHERE id = ?",
      [title.trim(), description || "", icon || "Sparkles", sort_order || 0, active !== undefined ? active : 1, id]
    );

    return NextResponse.json({ success: true, message: "Keunggulan berhasil diperbarui." });
  } catch (err: any) {
    console.error("PUT advantages error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
    }

    await executeQuery("DELETE FROM advantages WHERE id = ?", [id]);
    return NextResponse.json({ success: true, message: "Keunggulan berhasil dihapus." });
  } catch (err: any) {
    console.error("DELETE advantages error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
