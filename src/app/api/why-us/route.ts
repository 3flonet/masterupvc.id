import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

let isMigrated = false;
async function ensureTable() {
  if (isMigrated) return;
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS why_us (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(100) DEFAULT 'ShieldCheck',
        sort_order INT DEFAULT 0,
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const rows: any = await executeQuery("SELECT COUNT(*) as count FROM why_us");
    if (rows[0].count === 0) {
      const defaults = [
        ["Garansi Resmi 10 Tahun", "Jaminan penuh bahwa profil UPVC kami tidak akan retak, melengkung, maupun memudar warnanya akibat paparan cuaca ekstrim tropis.", "ShieldCheck", 1],
        ["Pabrikasi Langsung", "Diproduksi langsung di workshop utama kami, menjamin biaya efisien tanpa perantara serta kontrol kualitas berlapis yang ketat.", "Factory", 2],
        ["Presisi Milimeter & Rapih", "Pemasangan presisi tinggi oleh tim pemasang profesional tersertifikasi untuk menjamin peredaman suara dan anti-bocor air yang sempurna.", "Ruler", 3],
        ["Custom Desain Bebas", "Sesuaikan bentuk, ukuran, tipe bukaan (ayun, geser, lipat) serta aksen warna profil dengan gaya arsitektur rumah impian Anda.", "Palette", 4],
        ["Multipoint Lock System", "Dilengkapi dengan sistem penguncian ganda di beberapa titik untuk memberikan tingkat keamanan ekstra bagi seluruh anggota keluarga.", "Lock", 5],
        ["Gratis Konsultasi & Survei", "Dapatkan layanan konsultasi estimasi biaya serta survei pengukuran fisik ke lokasi proyek Anda secara cuma-cuma (wilayah Jabodetabek).", "Headphones", 6]
      ];
      for (const item of defaults) {
        await executeQuery(
          "INSERT INTO why_us (title, description, icon, sort_order) VALUES (?, ?, ?, ?)",
          item
        );
      }
    }
  } catch (err) {
    console.error("Why US table init error:", err);
  }
  isMigrated = true;
}

export async function GET() {
  try {
    await ensureTable();
    const rows = await executeQuery("SELECT * FROM why_us ORDER BY sort_order ASC, id ASC");
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("GET why_us error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const { title, description, icon, sort_order, active } = await request.json();
    if (!title) {
      return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
    }

    const result = await executeQuery(
      "INSERT INTO why_us (title, description, icon, sort_order, active) VALUES (?, ?, ?, ?, ?)",
      [title.trim(), description || "", icon || "ShieldCheck", sort_order || 0, active !== undefined ? active : 1]
    );

    return NextResponse.json({ success: true, id: result.insertId, message: "Poin Mengapa Kami berhasil ditambahkan." });
  } catch (err: any) {
    console.error("POST why_us error:", err);
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
      "UPDATE why_us SET title = ?, description = ?, icon = ?, sort_order = ?, active = ? WHERE id = ?",
      [title.trim(), description || "", icon || "ShieldCheck", sort_order || 0, active !== undefined ? active : 1, id]
    );

    return NextResponse.json({ success: true, message: "Poin Mengapa Kami berhasil diperbarui." });
  } catch (err: any) {
    console.error("PUT why_us error:", err);
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

    await executeQuery("DELETE FROM why_us WHERE id = ?", [id]);
    return NextResponse.json({ success: true, message: "Poin Mengapa Kami berhasil dihapus." });
  } catch (err: any) {
    console.error("DELETE why_us error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
