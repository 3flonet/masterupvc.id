import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

let isMigrated = false;
async function ensureTable() {
  if (isMigrated) return;
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS material_comparisons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        feature_name VARCHAR(255) NOT NULL,
        upvc_value VARCHAR(255) NOT NULL,
        wood_value VARCHAR(255) NOT NULL,
        alum_value VARCHAR(255) NOT NULL,
        upvc_status VARCHAR(50) DEFAULT 'positive',
        wood_status VARCHAR(50) DEFAULT 'negative',
        alum_status VARCHAR(50) DEFAULT 'neutral',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const rows: any = await executeQuery("SELECT COUNT(*) as count FROM material_comparisons");
    if (rows[0].count === 0) {
      const defaults = [
        ["Ketahanan Rayap & Hama", "100% Anti Rayap", "Sangat Rentan Keropos", "Tahan Rayap", "positive", "negative", "neutral", 1],
        ["Kedap Suara (Kebisingan)", "Sangat Redam (Hingga 40dB)", "Sedang", "Bising (Transmisi Getar)", "positive", "neutral", "negative", 2],
        ["Ketahanan Api (Safety)", "Mencegah Penyebaran Api", "Sangat Mudah Terbakar", "Memuai / Melengkung", "positive", "negative", "neutral", 3],
        ["Terhadap Cuaca & Korosi", "Bebas Karat & Garansi 10 Tahun", "Lapuk, Muai & Menyusut", "Korosi / Karat Putih", "positive", "negative", "negative", 4]
      ];
      for (const item of defaults) {
        await executeQuery(
          "INSERT INTO material_comparisons (feature_name, upvc_value, wood_value, alum_value, upvc_status, wood_status, alum_status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          item
        );
      }
    }
  } catch (err) {
    console.error("Material comparisons table init error:", err);
  }
  isMigrated = true;
}

export async function GET() {
  try {
    await ensureTable();
    const rows = await executeQuery("SELECT * FROM material_comparisons ORDER BY sort_order ASC, id ASC");
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("GET comparisons error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const { feature_name, upvc_value, wood_value, alum_value, upvc_status, wood_status, alum_status, sort_order } = await request.json();
    if (!feature_name) {
      return NextResponse.json({ error: "Nama Fitur wajib diisi." }, { status: 400 });
    }

    const result = await executeQuery(
      "INSERT INTO material_comparisons (feature_name, upvc_value, wood_value, alum_value, upvc_status, wood_status, alum_status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [feature_name.trim(), upvc_value || "", wood_value || "", alum_value || "", upvc_status || "positive", wood_status || "negative", alum_status || "neutral", sort_order || 0]
    );

    return NextResponse.json({ success: true, id: result.insertId, message: "Fitur perbandingan berhasil ditambahkan." });
  } catch (err: any) {
    console.error("POST comparisons error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureTable();
    const { id, feature_name, upvc_value, wood_value, alum_value, upvc_status, wood_status, alum_status, sort_order } = await request.json();
    if (!id || !feature_name) {
      return NextResponse.json({ error: "ID dan Nama Fitur wajib diisi." }, { status: 400 });
    }

    await executeQuery(
      "UPDATE material_comparisons SET feature_name = ?, upvc_value = ?, wood_value = ?, alum_value = ?, upvc_status = ?, wood_status = ?, alum_status = ?, sort_order = ? WHERE id = ?",
      [feature_name.trim(), upvc_value || "", wood_value || "", alum_value || "", upvc_status || "positive", wood_status || "negative", alum_status || "neutral", sort_order || 0, id]
    );

    return NextResponse.json({ success: true, message: "Fitur perbandingan berhasil diperbarui." });
  } catch (err: any) {
    console.error("PUT comparisons error:", err);
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

    await executeQuery("DELETE FROM material_comparisons WHERE id = ?", [id]);
    return NextResponse.json({ success: true, message: "Fitur perbandingan berhasil dihapus." });
  } catch (err: any) {
    console.error("DELETE comparisons error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
