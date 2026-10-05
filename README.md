# 🏥 Smart-Pabbura System
> **Solusi Stomatitis Pintar & Terukur — Terapi Turate Denti Lozenges**

Smart-Pabbura System adalah platform digital healthcare interaktif berbasis Next.js App Router yang dirancang untuk memantau kesehatan mulut, tingkat nyeri (VAS), keasaman (pH), hidrasi mukosa, serta jadwal dosis tablet hisap Turate Denti Lozenges secara real-time.

---

## 📁 Struktur Folder & File Proyek

```text
smart-pabbura/
├── 📁 app/                      # Next.js App Router (Halaman & Navigasi)
│   ├── 📄 page.tsx              # Beranda / Dashboard Utama
│   ├── 📁 monitoring/           # Halaman Form Input Monitoring Harian
│   ├── 📁 dosis/                # Halaman Kontrol & Jadwal Dosis Lozenges
│   ├── 📁 riwayat/              # Halaman Rekap Riwayat & Cetak Laporan PDF
│   ├── 📁 edukasi/              # Halaman Artikel & Modul Edukasi Medis
│   ├── 📁 rekomendasi/          # Halaman Sistem Rekomendasi Terapi
│   ├── 📁 scan/                 # Halaman Pemindai QR Kemasan Lozenges
│   ├── 📁 profil/               # Halaman Profil & Pengaturan Suara Klik
│   ├── 📁 notifikasi/           # Halaman Pusat Pengingat & Notifikasi
│   ├── 📁 login/                # Halaman Autentikasi Masuk
│   ├── 📁 register/             # Halaman Pendaftaran Pengguna Baru
│   ├── 📄 globals.css           # Styling Utama & System Color Palette
│   └── 📄 layout.tsx            # Root Layout (Sound & Toast Providers)
│
├── 📁 components/               # Komponen UI Reusable
│   ├── 📁 layout/               # Header Desktop, Bottom Nav Mobile, Shell
│   ├── 📁 ui/                   # SemiGauge, ProgressRing, MouthIllustration, Toast
│   ├── 📁 charts/               # Grafik Tren Nyeri & Keasaman (Recharts)
│   └── 📁 providers/            # SoundProvider (Global Click Sound Web Audio API)
│
├── 📁 hooks/                    # Custom React Hooks
│   └── 📄 useClickSound.ts      # Hook Suara Interaksi Klik Global
│
├── 📁 lib/                      # Utility Functions & Data Handler
│   ├── 📄 storage.ts            # Penyimpanan Data Lokal (LocalStorage Engine)
│   └── 📄 utils.ts              # Helper Format Tanggal & Matematika UI
│
├── 📁 public/                   # Asset Statis
│   ├── 📁 sounds/               # Sound Effects (click.mp3)
│   └── 📄 mouth-illustration.png# Ilustrasi Anatomi Mulut Digital Presisi
│
├── 📁 types/                    # Definisi Type TypeScript
│   └── 📄 index.ts              # Data Metrics, User, & History Interfaces
│
└── 📁 supabase/                 # Schema Database (Opsional)
    └── 📄 schema.sql            # Tabel Profiles & Monitoring Records
```

---

## 🎨 System Color Palette

- **Primary Navy**: `#102A43` *(Main Heading & Brand Identity)*
- **Secondary Navy Blue**: `#1F4E79` *(Card Header Gradient)*
- **Primary Orange**: `#F28C38` *(Action Buttons, CTA, & Highlights)*
- **Light Orange**: `#FFF1E6` *(Hover & Active State Background)*
- **Background**: `#F6F8FB` *(Canvas Outer Background)*
- **Card White**: `#FFFFFF` *(Container Card)*
- **Medical Blue**: `#2F80B7` *(Indikator pH & Medis)*
- **Health Green**: `#22B573` *(Indikator Status Sehat)*
- **Hydration Cyan**: `#29A9C9` *(Indikator Hidrasi Mukosa)*

---

## ⚡ Cara Menjalankan Proyek di Lokal

1. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

2. **Buka di Browser**:
   Buka `http://localhost:3000` di browser laptop/HP Anda.

---

## 🚀 Cara Mudah Push ke GitHub

Jika Anda ingin melakukan update / push kodingan ke GitHub:

```bash
git add .
git commit -m "Update Smart-Pabbura System"
git push origin main
```
