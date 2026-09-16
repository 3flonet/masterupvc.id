# 🚀 Panduan Deployment Produksi Multi-App: **Master UPVC** & **Spy SPSE**

> **Dokumen Resmi Deployment & Operational Runbook**
> Panduan ini disusun secara komprehensif untuk deployment dan pemeliharaan aplikasi di server **Biznet GIO VPS (139.190.97.83)**.

---

## 📌 1. Ringkasan Arsitektur Server
- **Server OS**: Ubuntu 22.04 LTS (64-bit)
- **IP Publik**: `139.190.97.83`
- **Web Server Proxy**: Nginx 1.18.0
- **Process Managers**: Systemd (FastAPI & Crawler), PM2 (Next.js 16)
- **Database Engines**: PostgreSQL 14 (Port 5432), MySQL 8.0 (Port 3306)

---

## 🛠️ 2. Langkah-Langkah Deployment Aplikasi Master UPVC (Next.js)

### Step 1: Kloning Repositori & Environment Setup
```bash
sudo mkdir -p /var/www/masterupvc.id
sudo chown -R 3flo-biznet-key:3flo-biznet-key /var/www/masterupvc.id
git clone https://github.com/3flonet/masterupvc.id.git /var/www/masterupvc.id
```

### Step 2: Konfigurasi Database MySQL & Impor Data
```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS masterupvc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'masterupvc_user'@'localhost' IDENTIFIED BY 'MasterUPVC2026!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON masterupvc.* TO 'masterupvc_user'@'localhost'; FLUSH PRIVILEGES;"
sudo mysql -e "SET GLOBAL max_connections = 500;"

mysql -u masterupvc_user -p'MasterUPVC2026!' masterupvc < /var/www/masterupvc.id/database_backup.sql
```

### Step 3: File Environment & Build Production Next.js
Buat file `/var/www/masterupvc.id/.env.production`:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=masterupvc_user
MYSQL_PASSWORD=MasterUPVC2026!
MYSQL_DATABASE=masterupvc
```

Jalankan build:
```bash
cd /var/www/masterupvc.id
npm install
npm run build
```

### Step 4: Konfigurasi PM2 Process Manager
Buat file `/var/www/masterupvc.id/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: "masterupvc",
    script: "node_modules/next/dist/bin/next",
    args: "start -p 3000",
    cwd: "/var/www/masterupvc.id",
    env: {
      NODE_ENV: "production",
      PORT: "3000",
      MYSQL_HOST: "localhost",
      MYSQL_PORT: "3306",
      MYSQL_USER: "masterupvc_user",
      MYSQL_PASSWORD: "MasterUPVC2026!",
      MYSQL_DATABASE: "masterupvc"
    }
  }]
};
```

Jalankan PM2:
```bash
cd /var/www/masterupvc.id
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 5: Nginx Reverse Proxy & SSL (HTTPS)
Buat file `/etc/nginx/sites-available/masterupvc.id`:
```nginx
server {
    listen 80;
    server_name masterupvc.id www.masterupvc.id 139.190.97.83;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan site dan pasang SSL Let's Encrypt:
```bash
sudo ln -sf /etc/nginx/sites-available/masterupvc.id /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

sudo certbot --nginx -d masterupvc.id -d www.masterupvc.id --non-interactive --agree-tos -m admin@masterupvc.id --redirect
```

---
*Dokumentasi Deployment ini diperbarui secara resmi pada tanggal 17 September 2026.*
