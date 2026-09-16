# 📜 Dokumentasi Serah Terima Server (Handover) & Operasional Multi-App VPS

> **Dokumen Resmi Handover & Kredensial Server**
> Dokumen ini disusun untuk diserahkan kepada **Tim Development / System Administrator** sebagai acuan dalam memelihara, memperbarui, dan mengoperasikan server VPS Biznet GIO yang menampung aplikasi **Spy SPSE** dan **Master UPVC Indonesia**.

---

## 📌 1. Ringkasan Informasi Server & Akses SSH

| Parameter | Detail / Nilai |
| :--- | :--- |
| **Provider VPS** | Biznet GIO (NEO Lite MS 4.2) |
| **Spesifikasi Hardware** | 2 vCPU, 4 GB RAM, 60 GB NVMe SSD |
| **Lokasi Region** | West Java (Indonesia) |
| **IP Publik (IPv4)** | `139.190.97.83` |
| **Sistem Operasi** | Ubuntu 22.04 LTS (64-bit) |
| **User SSH Root/Sudo** | `3flo-biznet-key` |
| **Metode Autentikasi** | SSH Key (`3flo-biznet-key.pem`) |
| **Password Sudo SSH** | *Passwordless `sudo`* |
| **Password Web Console / VNC** | `@Eleanor210478_` *(Panel Biznet GIO)* |
| **File Kunci Rahasia** | `3flo-biznet-key.pem` *(Tersimpan di `~/.ssh/3flo-biznet-key.pem`)* |

---

## 🌐 2. Pemetaan Aplikasi & Domain (Multi-App Infrastructure)

| Nama Aplikasi | Stack Teknologi | Port Internal | Database | Domain Resmi & SSL | Web Server / Process |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Spy SPSE** | Python FastAPI + React Vite | `http://127.0.0.1:8000` | PostgreSQL 14 (`spse_db`) | [https://spyspse.com](https://spyspse.com) | Systemd (`spse-backend`, `spse-crawler`) + Nginx |
| **Master UPVC Indonesia** | Next.js 16 + Tailwind CSS | `http://127.0.0.1:3000` | MySQL 8.0 (`masterupvc`) | [https://masterupvc.id](https://masterupvc.id) & [https://www.masterupvc.id](https://www.masterupvc.id) | PM2 (`masterupvc`) + Nginx |

---

## 🔑 3. Cara Login SSH ke Server

### A. Pengguna Windows (PowerShell / Command Prompt):
```powershell
ssh -i C:\Users\Username\.ssh\3flo-biznet-key.pem 3flo-biznet-key@139.190.97.83
```

### B. Pengguna macOS / Linux:
```bash
chmod 400 3flo-biznet-key.pem
ssh -i 3flo-biznet-key.pem 3flo-biznet-key@139.190.97.83
```

---

## 🗄️ 4. Kredensial Database Server & Aplikasi

### A. Database 1: PostgreSQL 14 (Spy SPSE)
- **Host / Port**: `localhost:5432`
- **Nama Database**: `spse_db`
- **User / Password**: `spse_user` / `PasswordKuat123!`

### B. Database 2: MySQL 8.0 (Master UPVC Indonesia)
- **Host / Port**: `localhost:3306`
- **Nama Database**: `masterupvc`
- **User / Password**: `masterupvc_user` / `MasterUPVC2026!`
- **Max Connections**: `500` *(Dioptimalkan untuk connection pool Next.js)*

---

## 👤 5. Akun Super Admin Aplikasi

### A. Spy SPSE (Web Portal)
- **URL Login**: [https://spyspse.com/#/dashboard](https://spyspse.com/#/dashboard)
- **Email Admin**: `admin@spyspse.com`
- **Password Default**: `admin123`

### B. Master UPVC Indonesia (CMS Portal)
- **URL Login**: [https://masterupvc.id/admin/login](https://masterupvc.id/admin/login)
- **Email Admin**: `admin@masterupvc.id`
- **Password Default**: `admin123`

---

## 📂 6. Struktur Direktori Aplikasi di VPS

```text
/var/www/
├── monitoringspse/          # Aplikasi 1: Spy SPSE
│   ├── .env                 # Environment produksi SPSE
│   ├── .venv/               # Virtual environment Python
│   ├── backend/             # Source code FastAPI & Scraper
│   └── frontend/dist/       # Build aset frontend React
└── masterupvc.id/           # Aplikasi 2: Master UPVC Indonesia
    ├── .env                 # Environment produksi Master UPVC
    ├── database_backup.sql  # Dump struktur & data awal MySQL
    ├── ecosystem.config.js  # Konfigurasi PM2 Process Manager
    └── .next/               # Production build Next.js 16
```

---

## ⚙️ 7. Perintah Pengelolaan Service & Monitoring

### A. Aplikasi 1: Spy SPSE (Systemd)
```bash
# Cek status backend & crawler
sudo systemctl status spse-backend spse-crawler

# Restart service SPSE
sudo systemctl restart spse-backend spse-crawler

# Monitoring log real-time
sudo journalctl -u spse-backend -f
```

### B. Aplikasi 2: Master UPVC Indonesia (PM2)
```bash
# Cek status process PM2
pm2 status

# Restart / Reload aplikasi
pm2 restart masterupvc --update-env

# Monitoring log real-time
pm2 logs masterupvc
```

### C. Web Server Nginx & Sertifikat SSL (Let's Encrypt)
- **File Konfigurasi Nginx**:
  - Spy SPSE: `/etc/nginx/sites-available/spyspse`
  - Master UPVC: `/etc/nginx/sites-available/masterupvc.id`
- **Uji Sintaks & Reload**:
  ```bash
  sudo nginx -t
  sudo systemctl reload nginx
  ```
- **Sertifikat SSL (HTTPS)**:
  Auto-renew aktif via Certbot timer untuk `spyspse.com`, `masterupvc.id`, dan `www.masterupvc.id`.

---

## 🔄 8. Panduan Deployment / Update Code Terbaru

### A. Update Aplikasi Master UPVC:
```bash
# 1. Masuk ke VPS
ssh -i C:\Users\Username\.ssh\3flo-biznet-key.pem 3flo-biznet-key@139.190.97.83

# 2. Masuk ke folder proyek & pull update
cd /var/www/masterupvc.id
git pull origin main

# 3. Build & Restart PM2
npm install
npm run build
pm2 restart masterupvc --update-env
```

### B. Update Aplikasi Spy SPSE:
```bash
cd /var/www/monitoringspse
git pull origin main
source .venv/bin/activate
pip install -r requirements.txt
cd frontend && npm run build && cd ..
sudo systemctl restart spse-backend spse-crawler
```

---
*Dokumentasi ini diperbarui secara resmi pada tanggal 17 September 2026 untuk mencakup seluruh infrastruktur multi-app VPS Biznet GIO.*
