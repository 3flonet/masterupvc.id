-- SQL Database Setup Script for Master UPVC Indonesia
-- Import this file inside phpMyAdmin (Database: masterupvc)

CREATE DATABASE IF NOT EXISTS `masterupvc` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `masterupvc`;

-- 1. Table `categories`
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) UNIQUE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table `products`
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `category_id` INT NOT NULL,
  `tier` VARCHAR(50) NOT NULL,
  `description` TEXT NULL,
  `dimensions` VARCHAR(50) NULL,
  `variants` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table `admin_users`
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table `settings`
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `seo_title` VARCHAR(255) NOT NULL,
  `seo_description` TEXT NULL,
  `seo_keywords` VARCHAR(255) NULL,
  `favicon` LONGTEXT NULL,
  `logo` LONGTEXT NULL,
  `contact_address` TEXT NULL,
  `contact_whatsapp` VARCHAR(50) NULL,
  `contact_website` VARCHAR(255) NULL,
  `contact_email` VARCHAR(255) NULL,
  `contact_description` TEXT NULL,
  `contact_maps_url` TEXT NULL,
  `ai_knowledge` JSON NOT NULL,
  `schema_json` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. Table `article_categories`
CREATE TABLE IF NOT EXISTS `article_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table `articles`
CREATE TABLE IF NOT EXISTS `articles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) UNIQUE NOT NULL,
  `excerpt` TEXT NULL COMMENT 'Ringkasan artikel (max 160 karakter, dipakai untuk meta description)',
  `content` LONGTEXT NULL COMMENT 'Isi artikel (HTML)',
  `media_type` ENUM('image_url','image_upload','youtube') NOT NULL DEFAULT 'image_url',
  `media_value` LONGTEXT NULL COMMENT 'URL gambar, base64 upload, atau YouTube URL/ID',
  `category_id` INT NULL,
  `status` ENUM('draft','published') NOT NULL DEFAULT 'draft',
  `published_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `article_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- SEED DATA INSERTS
-- ==========================================

-- Seed Categories
INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Pintu'),
(2, 'Jendela')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Seed Admin User (email: admin@masterupvc.id, password: admin123)
INSERT INTO `admin_users` (`email`, `password`) VALUES
('admin@masterupvc.id', 'admin123')
ON DUPLICATE KEY UPDATE `password`=VALUES(`password`);

-- Seed Settings (SEO, AI, Branding & Contact Info)
INSERT INTO `settings` (
  `id`, 
  `seo_title`, 
  `seo_description`, 
  `seo_keywords`, 
  `favicon`,
  `logo`,
  `contact_address`,
  `contact_whatsapp`,
  `contact_website`,
  `contact_email`,
  `contact_description`,
  `contact_maps_url`,
  `ai_knowledge`, 
  `schema_json`
) VALUES (
  1, 
  'Master UPVC Indonesia - Jendela & Pintu UPVC Premium', 
  'Produsen terpercaya kusen, pintu, dan jendela UPVC berkualitas tinggi di Indonesia. Tahan cuaca, kedap suara, anti rayap, dan bergaransi resmi.', 
  'master upvc, pintu upvc, jendela upvc, kusen upvc, upvc premium, master upvc indonesia', 
  NULL,
  NULL,
  'Curug, Kec. Gn. Sindur, Kabupaten Bogor, Jawa Barat 15315',
  '+62 812-3456-7890',
  'WWW.MASTERUPVC.ID',
  'info@masterupvc.id',
  'Kunjungi pabrik produksi kami atau diskusikan kebutuhan ukuran, varian warna, dan penawaran khusus langsung dengan tim teknis kami.',
  'Curug, Gn. Sindur, Bogor',
  '[
    {
      "question": "Apa keunggulan utama bahan UPVC dibanding aluminium atau kayu?",
      "answer": "Bahan UPVC kami memiliki 8 pilar keunggulan: ramah lingkungan, tahan api, kedap suara hingga 40dB, anti bocor air, hemat energi (insulasi termal), tahan cuaca ekstrim, anti rayap, dan dilengkapi penguncian ganda (multipoint lock) untuk keamanan maksimal."
    },
    {
      "question": "Apakah pintu dan jendela Master UPVC bergaransi?",
      "answer": "Ya, kami memberikan garansi resmi profil UPVC selama 10 tahun untuk menjamin kekuatan struktural dan warna agar tidak memudar atau retak."
    },
    {
      "question": "Di mana lokasi workshop dan cakupan layanan Master UPVC?",
      "answer": "Workshop utama kami berlokasi di Jakarta dengan jangkauan pengiriman dan instalasi ke seluruh kota besar di wilayah Indonesia."
    }
  ]', 
  '{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Master UPVC Indonesia",
    "description": "Pabrikasi kusen, jendela, dan pintu UPVC premium terbaik di Indonesia.",
    "telephone": "+62-812-3456-7890",
    "email": "info@masterupvc.id",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Utama Master UPVC No. 88",
      "addressLocality": "Jakarta",
      "addressRegion": "DKI Jakarta",
      "postalCode": "12345",
      "addressCountry": "ID"
    },
    "url": "https://masterupvc.id"
  }'
)
ON DUPLICATE KEY UPDATE 
  `seo_title`=VALUES(`seo_title`), 
  `seo_description`=VALUES(`seo_description`),
  `contact_address`=VALUES(`contact_address`),
  `contact_whatsapp`=VALUES(`contact_whatsapp`),
  `contact_website`=VALUES(`contact_website`),
  `contact_email`=VALUES(`contact_email`),
  `contact_description`=VALUES(`contact_description`),
  `contact_maps_url`=VALUES(`contact_maps_url`);

-- Seed Products
INSERT INTO `products` (`name`, `category_id`, `tier`, `description`, `dimensions`, `variants`) VALUES
-- Pintu Hemat (70CM X 200CM)
('Ivy Doors', 1, 'Hemat', 'Pintu UPVC hemat', '70CM X 200CM', '[
  {"color": "Putih", "price": 3480000.00, "image_url": null},
  {"color": "Hitam", "price": 3900500.00, "image_url": null}
]'),
('Hedge Doors', 1, 'Hemat', 'Pintu UPVC hemat', '70CM X 200CM', '[
  {"color": "Putih", "price": 3753750.00, "image_url": null},
  {"color": "Hitam", "price": 4196250.00, "image_url": null}
]'),
('Mewdaw Doors', 1, 'Hemat', 'Pintu UPVC hemat', '70CM X 200CM', '[
  {"color": "Putih", "price": 3136000.00, "image_url": null},
  {"color": "Hitam", "price": 3489500.00, "image_url": null}
]'),
('Laura Hill', 1, 'Hemat', 'Pintu UPVC hemat', '70CM X 200CM', '[
  {"color": "Putih", "price": 3474500.00, "image_url": null},
  {"color": "Hitam", "price": 3889000.00, "image_url": null}
]'),
('Pine Doors', 1, 'Hemat', 'Pintu UPVC hemat', '70CM X 200CM', '[
  {"color": "Putih", "price": 3276400.00, "image_url": null},
  {"color": "Hitam", "price": 3783500.00, "image_url": null}
]'),
('River Doors', 1, 'Hemat', 'Pintu UPVC hemat', '70CM X 200CM', '[
  {"color": "Putih", "price": 3347000.00, "image_url": null},
  {"color": "Hitam", "price": 3787500.00, "image_url": null}
]'),
('Seaglass Doors', 1, 'Hemat', 'Pintu UPVC hemat', '70CM X 200CM', '[
  {"color": "Putih", "price": 3259000.00, "image_url": null},
  {"color": "Hitam", "price": 3653500.00, "image_url": null}
]'),
('Seaside Doors', 1, 'Hemat', 'Pintu UPVC hemat', '70CM X 200CM', '[
  {"color": "Putih", "price": 3589500.00, "image_url": null},
  {"color": "Hitam", "price": 4008500.00, "image_url": null}
]'),
('Holly Doors', 1, 'Hemat', 'Pintu UPVC hemat', '70CM X 200CM', '[
  {"color": "Putih", "price": 3291000.00, "image_url": null},
  {"color": "Hitam", "price": 3704500.00, "image_url": null}
]'),

-- Pintu Premium (80CM X 210CM)
('Ivy Doors', 1, 'Premium', 'Pintu UPVC premium', '80CM X 210CM', '[
  {"color": "Putih", "price": 4789000.00, "image_url": null},
  {"color": "Hitam", "price": 5515666.67, "image_url": null},
  {"color": "Coklat", "price": 5515666.67, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6722333.33, "image_url": null}
]'),
('Hedge Doors', 1, 'Premium', 'Pintu UPVC premium', '80CM X 210CM', '[
  {"color": "Putih", "price": 4813000.00, "image_url": null},
  {"color": "Hitam", "price": 5542333.33, "image_url": null},
  {"color": "Coklat", "price": 5542333.33, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6791666.67, "image_url": null}
]'),
('Mewdaw Doors', 1, 'Premium', 'Pintu UPVC premium', '80CM X 210CM', '[
  {"color": "Putih", "price": 4404000.00, "image_url": null},
  {"color": "Hitam", "price": 5037000.00, "image_url": null},
  {"color": "Coklat", "price": 5037000.00, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6150000.00, "image_url": null}
]'),
('Laura Hill', 1, 'Premium', 'Pintu UPVC premium', '80CM X 210CM', '[
  {"color": "Putih", "price": 4807000.00, "image_url": null},
  {"color": "Hitam", "price": 5536333.33, "image_url": null},
  {"color": "Coklat", "price": 5536333.33, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6771666.67, "image_url": null}
]'),
('Pine Doors', 1, 'Premium', 'Pintu UPVC premium', '80CM X 210CM', '[
  {"color": "Putih", "price": 4492600.00, "image_url": null},
  {"color": "Hitam", "price": 5360333.33, "image_url": null},
  {"color": "Coklat", "price": 5360333.33, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6619666.67, "image_url": null}
]'),
('River Doors', 1, 'Premium', 'Pintu UPVC premium', '80CM X 210CM', '[
  {"color": "Putih", "price": 4642000.00, "image_url": null},
  {"color": "Hitam", "price": 5419000.00, "image_url": null},
  {"color": "Coklat", "price": 5419000.00, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6721000.00, "image_url": null}
]'),
('Seaglass Doors', 1, 'Premium', 'Pintu UPVC premium', '80CM X 210CM', '[
  {"color": "Putih", "price": 4536000.00, "image_url": null},
  {"color": "Hitam", "price": 5213000.00, "image_url": null},
  {"color": "Coklat", "price": 5213000.00, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6414000.00, "image_url": null}
]'),
('Seaside Doors', 1, 'Premium', 'Pintu UPVC premium', '80CM X 210CM', '[
  {"color": "Putih", "price": 4924000.00, "image_url": null},
  {"color": "Hitam", "price": 5652166.67, "image_url": null},
  {"color": "Coklat", "price": 5652166.67, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6860333.33, "image_url": null}
]'),
('Holly Doors', 1, 'Premium', 'Pintu UPVC premium', '80CM X 210CM', '[
  {"color": "Putih", "price": 4524000.00, "image_url": null},
  {"color": "Hitam", "price": 5203666.67, "image_url": null},
  {"color": "Coklat", "price": 5203666.67, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6363333.33, "image_url": null}
]'),

-- Jendela Standar (100CM X 120CM)
('Double Sliding', 2, 'Standar', 'Jendela UPVC', '100CM X 120CM', '[
  {"color": "Putih", "price": 4486000.00, "image_url": null},
  {"color": "Hitam", "price": 5142000.00, "image_url": null},
  {"color": "Coklat", "price": 5142000.00, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6308000.00, "image_url": null}
]'),
('Double Swing', 2, 'Standar', 'Jendela UPVC', '100CM X 120CM', '[
  {"color": "Putih", "price": 4534000.00, "image_url": null},
  {"color": "Hitam", "price": 5208000.00, "image_url": null},
  {"color": "Coklat", "price": 5208000.00, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6422000.00, "image_url": null}
]'),
('Swing+Fixed', 2, 'Standar', 'Jendela UPVC', '100CM X 120CM', '[
  {"color": "Putih", "price": 3434000.00, "image_url": null},
  {"color": "Hitam", "price": 3928000.00, "image_url": null},
  {"color": "Coklat", "price": 3928000.00, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 4802000.00, "image_url": null}
]'),
('Double Jungkit', 2, 'Standar', 'Jendela UPVC', '100CM X 120CM', '[
  {"color": "Putih", "price": 4374000.00, "image_url": null},
  {"color": "Hitam", "price": 5038000.00, "image_url": null},
  {"color": "Coklat", "price": 5038000.00, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 6252000.00, "image_url": null}
]'),
('Jungkit+Fixed', 2, 'Standar', 'Jendela UPVC', '100CM X 120CM', '[
  {"color": "Putih", "price": 3354000.00, "image_url": null},
  {"color": "Hitam", "price": 3843000.00, "image_url": null},
  {"color": "Coklat", "price": 3843000.00, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 4717000.00, "image_url": null}
]'),
('Single Swing', 2, 'Standar', 'Jendela UPVC', '100CM X 120CM', '[
  {"color": "Putih", "price": 2459000.00, "image_url": null},
  {"color": "Hitam", "price": 2826000.00, "image_url": null},
  {"color": "Coklat", "price": 2826000.00, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 3523000.00, "image_url": null}
]'),
('Double Fixed', 2, 'Standar', 'Jendela UPVC', '100CM X 120CM', '[
  {"color": "Putih", "price": 2390000.00, "image_url": null},
  {"color": "Hitam", "price": 2604000.00, "image_url": null},
  {"color": "Coklat", "price": 2604000.00, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 3138000.00, "image_url": null}
]'),
('Single Jungkit', 2, 'Standar', 'Jendela UPVC', '100CM X 120CM', '[
  {"color": "Putih", "price": 2379000.00, "image_url": null},
  {"color": "Hitam", "price": 2741000.00, "image_url": null},
  {"color": "Coklat", "price": 2741000.00, "image_url": null},
  {"color": "Serat Kayu Golden Oak", "price": 3438000.00, "image_url": null}
]');

-- 7. Table `services`
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `description` TEXT NULL,
  `icon` VARCHAR(50) NOT NULL DEFAULT 'Sparkles',
  `image_url` LONGTEXT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Services
INSERT INTO `services` (`id`, `title`, `slug`, `description`, `icon`, `image_url`, `active`) VALUES
(1, 'Pintu UPVC', 'pintu-upvc', 'Pintu premium dengan material UPVC kokoh, dilengkapi double-lock system dan tahan cuaca.', 'DoorClosed', '/images/services/pintu-upvc.png', 1),
(2, 'Jendela UPVC', 'jendela-upvc', 'Jendela swing, sliding, dan jungkit UPVC kedap suara hingga 40dB dengan desain modern.', 'Grid', '/images/services/jendela-upvc.png', 1),
(3, 'Plafon & Kanopi UPVC', 'plafon-kanopi-upvc', 'Solusi kanopi & plafon UPVC anti bocor, tahan panas matahari ekstrem, dan berestetika tinggi.', 'Layers', '/images/services/plafon-kanopi-upvc.png', 1),
(4, 'Kitchen Set UPVC', 'kitchen-set-upvc', 'Kitchen set kustom berbahan UPVC premium yang anti air, anti lembab, dan anti rayap 100%.', 'Utensils', '/images/services/kitchen-set-upvc.png', 1),
(5, 'Shower Box', 'shower-box', 'Pemasangan shower box kaca tempered dengan kusen UPVC minimalis tahan karat untuk kamar mandi mewah.', 'ShowerHead', '/images/services/shower-box.png', 1)
ON DUPLICATE KEY UPDATE `description`=VALUES(`description`), `icon`=VALUES(`icon`), `image_url`=VALUES(`image_url`), `active`=VALUES(`active`);

-- 8. Table `projects`
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `client_name` VARCHAR(255) NULL,
  `location` VARCHAR(255) NULL,
  `project_date` DATE NULL,
  `services_used` JSON NULL,
  `description` TEXT NULL,
  `images` JSON NULL,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Projects
INSERT INTO `projects` (`id`, `title`, `slug`, `client_name`, `location`, `project_date`, `services_used`, `description`, `images`, `active`) VALUES
(1, 'Pintu & Jendela Villa Sentul', 'pintu-jendela-villa-sentul', 'Bpk. Budi', 'Sentul, Bogor', '2026-05-15', '["Pintu UPVC", "Jendela UPVC"]', 'Pemasangan pintu kombinasi kaca tempered dan jendela sliding di villa Sentul. Menghasilkan pencahayaan alami yang indah serta peredaman suara luar biasa terhadap kebisingan hutan tropis sekitar.', '["/images/projects/villa-sentul.png", "/images/projects/villa-sentul-2.png"]', 1),
(2, 'Kitchen Set & Shower Box Apartemen Sudirman', 'kitchen-set-shower-box-apartemen-sudirman', 'Ibu Linda', 'Jakarta Pusat', '2026-06-20', '["Kitchen Set UPVC", "Shower Box"]', 'Desain kitchen set modern minimalis berbahan UPVC dengan finishing putih glossy yang anti rayap dan anti lembab 100%. Dilengkapi pemasangan shower box kaca tempered minimalis di kamar mandi utama.', '["/images/projects/apt-sudirman.png", "/images/projects/apt-sudirman-2.png"]', 1),
(3, 'Kanopi & Plafon Rumah Kebayoran', 'kanopi-plafon-rumah-kebayoran', 'Bpk. Roni', 'Kebayoran Baru, Jakarta Selatan', '2026-07-10', '["Plafon & Kanopi UPVC"]', 'Pemasangan kanopi louvers UPVC premium di area patio luar rumah Kebayoran Baru, dipadukan dengan plafon UPVC bermotif serat kayu alami yang tahan cuaca panas ekstrim dan anti bocor air hujan.', '["/images/projects/rumah-kebayoran.png"]', 1)
ON DUPLICATE KEY UPDATE `client_name`=VALUES(`client_name`), `location`=VALUES(`location`), `project_date`=VALUES(`project_date`), `services_used`=VALUES(`services_used`), `description`=VALUES(`description`), `images`=VALUES(`images`), `active`=VALUES(`active`);


