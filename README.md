# Smart-Pabbura System

Platform monitoring kesehatan mulut untuk mencatat nyeri, pH, hidrasi, dan
perkembangan kondisi stomatitis. Aplikasi dibangun dengan Next.js App Router,
React, TypeScript, dan Supabase.

## Struktur proyek

```text
app/                 Halaman dan route aplikasi
components/          Komponen UI, layout, chart, dan provider
hooks/               Custom React hooks
lib/                 Utilitas, penyimpanan lokal, dan klien Supabase
public/              Gambar, ikon, dan aset statis
supabase/schema.sql  Skema database dan kebijakan akses
types/               Definisi tipe TypeScript
```

File hasil build, dependensi, dan file environment lokal tidak perlu di-commit.
Template environment `.env.local.example` boleh di-commit; jangan pernah commit
`.env.local` atau kredensial rahasia.

## Menjalankan secara lokal

Persyaratan: Node.js 20.9 atau lebih baru dan npm.

1. Pasang dependensi:

   ```bash
   npm ci
   ```

2. Salin `.env.local.example` menjadi `.env.local`, lalu isi URL dan anon key
   proyek Supabase. Variabel yang diperlukan:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

   Buka <http://localhost:3000>.

## Deploy ke Vercel

1. Push repository ke GitHub dan impor repository tersebut di Vercel.
2. Tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` pada
   **Project Settings → Environment Variables** untuk environment yang digunakan.
   Nilai `NEXT_PUBLIC_` tersedia di browser; gunakan hanya Supabase anon/publishable
   key, bukan `service_role` key.
3. Jika menggunakan Supabase, jalankan `supabase/schema.sql` melalui SQL Editor
   pada proyek Supabase dan atur URL redirect autentikasi sesuai domain hosting.
4. Deploy. Vercel mendeteksi Next.js dan menjalankan build secara otomatis.

Build produksi lokal dapat diperiksa dengan:

```bash
npm run build
npm start
```

## Push perubahan ke GitHub

Periksa perubahan terlebih dahulu agar file rahasia dan perubahan lokal yang
belum siap tidak ikut terkirim:

```bash
git status
git add README.md .gitignore .env.local.example
git commit -m "Prepare project for hosting"
git push origin main
```

Tambahkan file sumber lain dengan `git add` hanya setelah memeriksanya.
