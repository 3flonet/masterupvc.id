let isSettingsMigrated = false;
import { NextResponse } from "next/server";
import { executeQuery } from "@/utils/dbMysql";

// Helper function to auto-migrate/create new columns if they do not exist in MySQL
async function ensureSettingsColumnsExist() {
  if (isSettingsMigrated) return;
  try {
    const columns = await executeQuery("SHOW COLUMNS FROM settings");
    if (Array.isArray(columns)) {
      const columnNames = columns.map((col: any) => col.Field.toLowerCase());
      
      const missingColumns: string[] = [];
      if (!columnNames.includes("favicon")) missingColumns.push("favicon LONGTEXT NULL");
      if (!columnNames.includes("logo")) missingColumns.push("logo LONGTEXT NULL");
      if (!columnNames.includes("contact_address")) missingColumns.push("contact_address TEXT NULL");
      if (!columnNames.includes("contact_whatsapp")) missingColumns.push("contact_whatsapp VARCHAR(50) NULL");
      if (!columnNames.includes("contact_website")) missingColumns.push("contact_website VARCHAR(255) NULL");
      if (!columnNames.includes("contact_email")) missingColumns.push("contact_email VARCHAR(255) NULL");
      if (!columnNames.includes("contact_description")) missingColumns.push("contact_description TEXT NULL");
      if (!columnNames.includes("contact_maps_url")) missingColumns.push("contact_maps_url TEXT NULL");
      // Social media columns
      if (!columnNames.includes("social_instagram")) missingColumns.push("social_instagram VARCHAR(255) NULL");
      if (!columnNames.includes("social_facebook")) missingColumns.push("social_facebook VARCHAR(255) NULL");
      if (!columnNames.includes("social_tiktok")) missingColumns.push("social_tiktok VARCHAR(255) NULL");
      if (!columnNames.includes("social_youtube")) missingColumns.push("social_youtube VARCHAR(255) NULL");
      if (!columnNames.includes("social_twitter")) missingColumns.push("social_twitter VARCHAR(255) NULL");
      if (!columnNames.includes("analytics_script")) missingColumns.push("analytics_script TEXT NULL");
      if (!columnNames.includes("chatbot_active")) missingColumns.push("chatbot_active TINYINT(1) DEFAULT 0");
      if (!columnNames.includes("chatbot_name")) missingColumns.push("chatbot_name VARCHAR(255) DEFAULT 'Nadia'");
      if (!columnNames.includes("chatbot_avatar")) missingColumns.push("chatbot_avatar LONGTEXT NULL");
      if (!columnNames.includes("chatbot_initial_greeting")) missingColumns.push("chatbot_initial_greeting TEXT NULL");
      if (!columnNames.includes("chatbot_ask_name_message")) missingColumns.push("chatbot_ask_name_message TEXT NULL");
      if (!columnNames.includes("chatbot_ask_phone_message")) missingColumns.push("chatbot_ask_phone_message TEXT NULL");
      if (!columnNames.includes("chatbot_ask_email_message")) missingColumns.push("chatbot_ask_email_message TEXT NULL");
      if (!columnNames.includes("chatbot_ask_reason_message")) missingColumns.push("chatbot_ask_reason_message TEXT NULL");
      if (!columnNames.includes("chatbot_final_message")) missingColumns.push("chatbot_final_message TEXT NULL");
      if (!columnNames.includes("company_profile_pdf")) missingColumns.push("company_profile_pdf LONGTEXT NULL");
      if (!columnNames.includes("profile_image_hero")) missingColumns.push("profile_image_hero LONGTEXT NULL");
      if (!columnNames.includes("profile_image_about")) missingColumns.push("profile_image_about LONGTEXT NULL");
      if (!columnNames.includes("profile_image_mission")) missingColumns.push("profile_image_mission LONGTEXT NULL");
      if (!columnNames.includes("social_wall_active")) missingColumns.push("social_wall_active INT DEFAULT 0");
      if (!columnNames.includes("social_wall_embed_code")) missingColumns.push("social_wall_embed_code TEXT NULL");
      if (!columnNames.includes("color_image_putih")) missingColumns.push("color_image_putih LONGTEXT NULL");
      if (!columnNames.includes("color_image_hitam")) missingColumns.push("color_image_hitam LONGTEXT NULL");
      if (!columnNames.includes("color_image_coklat")) missingColumns.push("color_image_coklat LONGTEXT NULL");
      if (!columnNames.includes("color_image_golden_oak")) missingColumns.push("color_image_golden_oak LONGTEXT NULL");
      if (!columnNames.includes("color_image_orange")) missingColumns.push("color_image_orange LONGTEXT NULL");
      if (!columnNames.includes("google_maps_review_url")) missingColumns.push("google_maps_review_url TEXT NULL");
      if (!columnNames.includes("smtp_host")) missingColumns.push("smtp_host VARCHAR(255) NULL");
      if (!columnNames.includes("smtp_port")) missingColumns.push("smtp_port INT NULL");
      if (!columnNames.includes("smtp_user")) missingColumns.push("smtp_user VARCHAR(255) NULL");
      if (!columnNames.includes("smtp_pass")) missingColumns.push("smtp_pass VARCHAR(255) NULL");
      isSettingsMigrated = true;
      if (!columnNames.includes("smtp_sender_name")) missingColumns.push("smtp_sender_name VARCHAR(255) NULL");
      if (!columnNames.includes("smtp_secure")) missingColumns.push("smtp_secure TINYINT(1) DEFAULT 0");
      if (!columnNames.includes("hero_badge")) missingColumns.push("hero_badge VARCHAR(255) NULL");
      if (!columnNames.includes("hero_title")) missingColumns.push("hero_title TEXT NULL");
      if (!columnNames.includes("hero_description")) missingColumns.push("hero_description TEXT NULL");
      if (!columnNames.includes("hero_bg_image")) missingColumns.push("hero_bg_image LONGTEXT NULL");

      if (missingColumns.length > 0) {
        console.log("Migrating database settings table, adding missing columns:", missingColumns);
        await executeQuery(`ALTER TABLE settings ${missingColumns.map(col => `ADD COLUMN ${col}`).join(", ")}`);
      }
    }
  } catch (err) {
    console.error("Auto-migration of settings table failed:", err);
  }
}

// GET SETTINGS

let isAboutMigrated = false;
async function ensureAboutColumns() {
  if (isAboutMigrated) return;
  try {
    const columns = [
      "about_badge VARCHAR(255) NULL",
      "about_title VARCHAR(255) NULL",
      "about_desc1 TEXT NULL",
      "about_desc2 TEXT NULL",
      "about_quote TEXT NULL",
      "about_team_title VARCHAR(255) NULL"
    ];
    for (const col of columns) {
      try {
        await executeQuery(`ALTER TABLE settings ADD COLUMN ${col}`);
      } catch (e) {
        // ignore if exists
      }
    }
  } catch (err) {
    console.error("ensureAboutColumns error:", err);
  }
  isAboutMigrated = true;
}

export async function GET() {
  await ensureAboutColumns();
  try {
    await ensureSettingsColumnsExist();
    const rows = await executeQuery("SELECT * FROM settings ORDER BY id ASC LIMIT 1");
    if (Array.isArray(rows) && rows.length > 0) {
      const item = rows[0];
      return NextResponse.json({
        id: item.id,
        seo_title: item.seo_title,
        seo_description: item.seo_description || "",
        seo_keywords: item.seo_keywords || "",
        catalog_title: item.catalog_title || "Pilihan Kusen, Jendela & Pintu UPVC Premium",
        catalog_description: item.catalog_description || "Jelajahi berbagai tipe produk UPVC terbaik kami mulai dari tipe sliding, folding, swing, hingga kaca mati dengan varian warna serat kayu jati, hitam, putih, dan abu-abu.",
        hero_badge: item.hero_badge || "Best Production in Town",
        hero_title: item.hero_title || "Transformasi Estetika & Ketahanan Bersama [Master UPVC]",
        hero_description: item.hero_description || "Produsen terpercaya kusen, pintu, dan jendela UPVC berkualitas tinggi di Indonesia.",
        hero_bg_image: item.hero_bg_image || null,
        favicon: item.favicon || null,
        logo: item.logo || null,
        contact_address: item.contact_address || "",
        contact_whatsapp: item.contact_whatsapp || "",
        contact_website: item.contact_website || "",
        contact_email: item.contact_email || "",
        contact_description: item.contact_description || "",
        contact_maps_url: item.contact_maps_url || "",
        social_instagram: item.social_instagram || "",
        social_facebook: item.social_facebook || "",
        social_tiktok: item.social_tiktok || "",
        social_youtube: item.social_youtube || "",
        social_twitter: item.social_twitter || "",
        ai_knowledge: typeof item.ai_knowledge === "string" ? JSON.parse(item.ai_knowledge) : (item.ai_knowledge || []),
        schema_json: (() => {
          let parsed: any = {};
          if (typeof item.schema_json === "string" && item.schema_json.trim()) {
            try { parsed = JSON.parse(item.schema_json); } catch {}
          } else if (typeof item.schema_json === "object" && item.schema_json !== null) {
            parsed = item.schema_json;
          }
          return {
            "@context": parsed["@context"] || "https://schema.org",
            "@type": parsed["@type"] || "LocalBusiness",
            name: parsed.name || item.seo_title || "Master UPVC Indonesia",
            telephone: parsed.telephone || item.contact_whatsapp || "+62 812-3456-7890",
            email: parsed.email || item.contact_email || "info@masterupvc.id",
            url: parsed.url || item.contact_website || "https://masterupvc.id",
            description: parsed.description || item.seo_description || "Produsen terpercaya kusen, pintu, dan jendela UPVC berkualitas tinggi di Indonesia."
          };
        })(),
        analytics_script: item.analytics_script || "",
        chatbot_active: item.chatbot_active !== undefined ? item.chatbot_active : 0,
        chatbot_name: item.chatbot_name || "Nadia",
        chatbot_avatar: item.chatbot_avatar || null,
        chatbot_initial_greeting: item.chatbot_initial_greeting || "Halo! Saya Nadia, asisten virtual Master UPVC. Ada yang bisa saya bantu hari ini?",
        chatbot_ask_name_message: item.chatbot_ask_name_message || "Boleh tahu siapa nama Anda?",
        chatbot_ask_phone_message: item.chatbot_ask_phone_message || "Boleh minta nomor WhatsApp Anda yang aktif? (Contoh: 08123456789)",
        chatbot_ask_email_message: item.chatbot_ask_email_message || "Bisa infokan juga alamat email Anda?",
        chatbot_ask_reason_message: item.chatbot_ask_reason_message || "Terima kasih! Silakan ceritakan apa yang ingin Anda konsultasikan atau tanyakan mengenai pintu & jendela UPVC?",
        chatbot_final_message: item.chatbot_final_message || "Terima kasih! Informasi Anda sudah kami simpan. Silakan klik tombol di bawah untuk langsung terhubung dengan tim teknis kami di WhatsApp. Tim kami akan segera membantu Anda!",
        company_profile_pdf: item.company_profile_pdf || null,
        profile_image_hero: item.profile_image_hero || null,
        profile_image_about: item.profile_image_about || null,
        profile_image_mission: item.profile_image_mission || null,
        social_wall_active: item.social_wall_active !== undefined ? item.social_wall_active : 0,
        social_wall_embed_code: item.social_wall_embed_code || null,
        color_image_putih: item.color_image_putih || null,
        color_image_hitam: item.color_image_hitam || null,
        color_image_coklat: item.color_image_coklat || null,
        color_image_golden_oak: item.color_image_golden_oak || null,
        color_image_orange: item.color_image_orange || null,
        google_maps_review_url: item.google_maps_review_url || null,
        smtp_host: item.smtp_host || "",
        smtp_port: item.smtp_port ? Number(item.smtp_port) : 587,
        smtp_user: item.smtp_user || "",
        smtp_pass: item.smtp_pass || "",
        smtp_sender_name: item.smtp_sender_name || "Master UPVC Support",
        smtp_secure: item.smtp_secure !== undefined && item.smtp_secure !== null ? Number(item.smtp_secure) : 0
      });
    }

    // Default Fallback Settings if table is completely empty
    const defaultSettings = {
      seo_title: "Master UPVC Indonesia - Jendela & Pintu UPVC Premium",
      seo_description: "Produsen terpercaya kusen, pintu, dan jendela UPVC berkualitas tinggi di Indonesia.",
      seo_keywords: "master upvc, pintu upvc, jendela upvc",
      favicon: null,
      logo: null,
      contact_address: "Curug, Kec. Gn. Sindur, Kabupaten Bogor, Jawa Barat 15315",
      contact_whatsapp: "+62 812-3456-7890",
      contact_website: "WWW.MASTERUPVC.ID",
      contact_email: "info@masterupvc.id",
      contact_description: "Kunjungi pabrik produksi kami atau diskusikan kebutuhan ukuran, varian warna, dan penawaran khusus langsung dengan tim teknis kami.",
      contact_maps_url: "Curug, Gn. Sindur, Bogor",
      social_instagram: "",
      social_facebook: "",
      social_tiktok: "",
      social_youtube: "",
      social_twitter: "",
      ai_knowledge: [
        { question: "Apa keunggulan bahan UPVC?", answer: "Bahan UPVC kami kedap suara, anti air, dan tahan api." }
      ],
      schema_json: { "@context": "https://schema.org", "@type": "LocalBusiness", "name": "Master UPVC" },
      smtp_host: "",
      smtp_port: 587,
      smtp_user: "",
      smtp_pass: "",
      smtp_sender_name: "Master UPVC Support",
      smtp_secure: 0
    };
    return NextResponse.json(defaultSettings);
  } catch (err: any) {
    console.error("GET settings API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE OR SAVE SETTINGS
export async function POST(request: Request) {
  await ensureAboutColumns();
  try {
    await ensureSettingsColumnsExist();
    const { 
      seo_title, 
      seo_description, 
      seo_keywords,
      catalog_title,
      catalog_description,
      hero_badge,
      hero_title,
      hero_description,
      hero_bg_image, 
      favicon, 
      logo, 
      contact_address, 
      contact_whatsapp, 
      contact_website, 
      contact_email, 
      contact_description, 
      contact_maps_url,
      social_instagram,
      social_facebook,
      social_tiktok,
      social_youtube,
      social_twitter,
      ai_knowledge, 
      schema_json,
      analytics_script,
      chatbot_active,
      chatbot_name,
      chatbot_avatar,
      chatbot_initial_greeting,
      chatbot_ask_name_message,
      chatbot_ask_phone_message,
      chatbot_ask_email_message,
      chatbot_ask_reason_message,
      chatbot_final_message,
      company_profile_pdf,
      profile_image_hero,
      profile_image_about,
      profile_image_mission,
      social_wall_active,
      social_wall_embed_code,
      color_image_putih,
      color_image_hitam,
      color_image_coklat,
      color_image_golden_oak,
      color_image_orange,
      google_maps_review_url,
      smtp_host,
      smtp_port,
      smtp_user,
      smtp_pass,
      smtp_sender_name,
      smtp_secure,
      about_badge,
      about_title,
      about_desc1,
      about_desc2,
      about_quote,
      about_team_title
    } = await request.json();
    
    if (!seo_title) {
      return NextResponse.json({ error: "SEO Title is required." }, { status: 400 });
    }

    const aiKnowledgeJson = JSON.stringify(ai_knowledge || []);
    const schemaJsonString = JSON.stringify(schema_json || {});

    const rows = await executeQuery("SELECT id FROM settings WHERE id = 1");
    if (Array.isArray(rows) && rows.length > 0) {
            await executeQuery(
        `UPDATE settings SET 
          seo_title = ?, 
          seo_description = ?, 
          seo_keywords = ?,
          catalog_title = ?,
          catalog_description = ?,
          hero_badge = ?,
          hero_title = ?,
          hero_description = ?,
          hero_bg_image = ?, 
          favicon = ?, 
          logo = ?, 
          contact_address = ?, 
          contact_whatsapp = ?, 
          contact_website = ?, 
          contact_email = ?, 
          contact_description = ?, 
          contact_maps_url = ?,
          social_instagram = ?,
          social_facebook = ?,
          social_tiktok = ?,
          social_youtube = ?,
          social_twitter = ?,
          ai_knowledge = ?, 
          schema_json = ?,
          analytics_script = ?,
          chatbot_active = ?,
          chatbot_name = ?,
          chatbot_avatar = ?,
          chatbot_initial_greeting = ?,
          chatbot_ask_name_message = ?,
          chatbot_ask_phone_message = ?,
          chatbot_ask_email_message = ?,
          chatbot_ask_reason_message = ?,
          chatbot_final_message = ?,
          company_profile_pdf = ?,
          profile_image_hero = ?,
          profile_image_about = ?,
          profile_image_mission = ?,
          social_wall_active = ?,
          social_wall_embed_code = ?,
          color_image_putih = ?,
          color_image_hitam = ?,
          color_image_coklat = ?,
          color_image_golden_oak = ?,
          color_image_orange = ?,
          google_maps_review_url = ?,
          smtp_host = ?,
          smtp_port = ?,
          smtp_user = ?,
          smtp_pass = ?,
          smtp_sender_name = ?,
          smtp_secure = ?,
          about_badge = ?,
          about_title = ?,
          about_desc1 = ?,
          about_desc2 = ?,
          about_quote = ?,
          about_team_title = ?
         WHERE id = 1`,
        [
          seo_title, 
          seo_description || null, 
          seo_keywords || null,
          catalog_title || null,
          catalog_description || null,
          hero_badge || null,
          hero_title || null,
          hero_description || null,
          hero_bg_image || null, 
          favicon || null, 
          logo || null, 
          contact_address || null, 
          contact_whatsapp || null, 
          contact_website || null, 
          contact_email || null, 
          contact_description || null, 
          contact_maps_url || null,
          social_instagram || null,
          social_facebook || null,
          social_tiktok || null,
          social_youtube || null,
          social_twitter || null,
          aiKnowledgeJson, 
          schemaJsonString,
          analytics_script || null,
          chatbot_active !== undefined ? chatbot_active : 0,
          chatbot_name || "Nadia",
          chatbot_avatar || null,
          chatbot_initial_greeting || null,
          chatbot_ask_name_message || null,
          chatbot_ask_phone_message || null,
          chatbot_ask_email_message || null,
          chatbot_ask_reason_message || null,
          chatbot_final_message || null,
          company_profile_pdf || null,
          profile_image_hero || null,
          profile_image_about || null,
          profile_image_mission || null,
          social_wall_active !== undefined ? social_wall_active : 0,
          social_wall_embed_code || null,
          color_image_putih || null,
          color_image_hitam || null,
          color_image_coklat || null,
          color_image_golden_oak || null,
          color_image_orange || null,
          google_maps_review_url || null,
          smtp_host || null,
          smtp_port ? Number(smtp_port) : 587,
          smtp_user || null,
          smtp_pass || null,
          smtp_sender_name || null,
          smtp_secure !== undefined && smtp_secure !== null ? Number(smtp_secure) : 0,
          about_badge || null,
          about_title || null,
          about_desc1 || null,
          about_desc2 || null,
          about_quote || null,
          about_team_title || null
        ]
      );
    } else {
      await executeQuery(
        `INSERT INTO settings (
          id, seo_title, seo_description, seo_keywords, favicon, logo,
          contact_address, contact_whatsapp, contact_website, contact_email,
          contact_description, contact_maps_url,
          social_instagram, social_facebook, social_tiktok, social_youtube, social_twitter,
          ai_knowledge, schema_json, analytics_script,
          chatbot_active, chatbot_name, chatbot_avatar, chatbot_initial_greeting,
          chatbot_ask_name_message, chatbot_ask_phone_message, chatbot_ask_email_message,
          chatbot_ask_reason_message, chatbot_final_message, company_profile_pdf,
          profile_image_hero, profile_image_about, profile_image_mission,
          social_wall_active, social_wall_embed_code,
          color_image_putih, color_image_hitam, color_image_coklat, color_image_golden_oak, color_image_orange, google_maps_review_url,
          smtp_host, smtp_port, smtp_user, smtp_pass, smtp_sender_name, smtp_secure
         ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
        [
          seo_title, 
          seo_description || null, 
          seo_keywords || null, 
          favicon || null, 
          logo || null, 
          contact_address || null, 
          contact_whatsapp || null, 
          contact_website || null, 
          contact_email || null, 
          contact_description || null, 
          contact_maps_url || null,
          social_instagram || null,
          social_facebook || null,
          social_tiktok || null,
          social_youtube || null,
          social_twitter || null,
          aiKnowledgeJson, 
          schemaJsonString,
          analytics_script || null,
          chatbot_active !== undefined ? chatbot_active : 0,
          chatbot_name || "Nadia",
          chatbot_avatar || null,
          chatbot_initial_greeting || null,
          chatbot_ask_name_message || null,
          chatbot_ask_phone_message || null,
          chatbot_ask_email_message || null,
          chatbot_ask_reason_message || null,
          chatbot_final_message || null,
          company_profile_pdf || null,
          profile_image_hero || null,
          profile_image_about || null,
          profile_image_mission || null,
          social_wall_active !== undefined ? social_wall_active : 0,
          social_wall_embed_code || null,
          color_image_putih || null,
          color_image_hitam || null,
          color_image_coklat || null,
          color_image_golden_oak || null,
          color_image_orange || null,
          google_maps_review_url || null,
          smtp_host || null,
          smtp_port ? Number(smtp_port) : 587,
          smtp_user || null,
          smtp_pass || null,
          smtp_sender_name || null,
          smtp_secure !== undefined && smtp_secure !== null ? Number(smtp_secure) : 0
        ]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("POST settings API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
