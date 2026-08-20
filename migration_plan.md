# Rencana Migrasi: Vanilla JS ke Astro + SolidJS (TypeScript, Neon & Astro Actions)

Dokumen ini berisi rencana langkah demi langkah untuk memigrasikan aplikasi pelacak keuangan **TacticCash** dari versi Vanilla JS ([index.html](file:///D:/01%20Work/01-expense-tracker/archive/index.html) dan [main.js](file:///D:/01%20Work/01-expense-tracker/archive/src/js/main.js)) ke kerangka kerja modern **Astro** dengan **SolidJS** dan **TypeScript** (`.ts`, `.tsx`), menggunakan **Neon Database** dengan **Drizzle ORM** serta **Astro Actions** sebagai penghubung client-server yang type-safe.

---

## 📋 Ringkasan Arsitektur & Teknologi
1. **Frontend**:
   - **Astro**: Menyediakan layout dasar, SEO meta tags, Font Provider API, dan pemuatan stylesheet.
   - **SolidJS**: Menangani komponen interaktif di sisi klien menggunakan TypeScript (`.tsx`).
2. **Backend & Database**:
   - **Neon Database**: PostgreSQL serverless cloud database.
   - **Drizzle ORM**: ORM TypeScript type-safe untuk mengelola schema, migrasi, dan query.
3. **Autentikasi (Masa Depan)**:
   - **Better Auth CLI**: Menggunakan perintah `npx auth@latest generate` untuk menghasilkan tabel autentikasi secara otomatis.
   - **Relasi Transaksi**: Tabel `transaction` akan didefinisikan secara manual dengan referensi kunci asing (`user_id`) ke tabel `user`.
4. **Komunikasi Data**:
   - **Astro Actions**: Menggantikan API endpoint tradisional dengan fungsi backend type-safe yang dapat dipanggil langsung dari client-side SolidJS components.

---

## 🗄️ Rancangan Skema Database (Drizzle ORM)
Skema database utama diletakkan di `src/db/schema.ts`. 

Tabel-tabel autentikasi Better Auth (`user`, `session`, `account`, `verification`) akan digenerate secara otomatis menggunakan perintah CLI Better Auth. Kita hanya perlu mendeklarasikan tabel `user` secara minimal (sebagai referensi relasi) dan mendefinisikan tabel `transaction` secara manual:

```typescript
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

// Deklarasi minimal tabel user (akan diluncurkan penuh oleh CLI Better Auth)
export const user = pgTable("user", {
  id: text("id").primaryKey(),
});

// Skema Transaksi dengan Relasi User
export const transaction = pgTable("transaction", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }), // Relasi transaksi ke user tertentu
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  date: text("date").notNull(), // Menyimpan tanggal berformat YYYY-MM-DD
  type: text("type").$type<"income" | "expense">().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 🛠️ Tahapan Migrasi Terbaru

### 📁 FASE 1: Migrasi Aset & Stylesheet
1. **Pindahkan Aset**:
   - Salin berkas `account_balance_wallet.svg` dari [archive/src/assets](file:///D:/01%20Work/01-expense-tracker/archive/src/assets) ke folder `public/` atau `src/assets/`.
2. **Pindahkan Stylesheet**:
   - Salin stylesheet kustom [style.css](file:///D:/01%20Work/01-expense-tracker/archive/src/css/style.css) ke `src/styles/style.css`.
   - Lakukan impor pada `src/styles/global.css`:
     ```css
     @import "tailwindcss";
     @import "./style.css";
     ```

### 🗄️ FASE 2: Konfigurasi Database & Drizzle
1. **Drizzle Config**:
   - Buat berkas `drizzle.config.ts` di root proyek untuk mendefinisikan lokasi schema dan database connection string.
2. **Koneksi Database**:
   - Buat helper koneksi database menggunakan `@neondatabase/serverless` di `src/db/index.ts`.
3. **Definisikan Schema**:
   - Buat berkas `src/db/schema.ts` dengan tabel `transaction` yang berelasi ke tabel `user`.
4. **Environment Variables**:
   - Siapkan berkas `.env` dengan variabel `DATABASE_URL` (dari Neon DB dashboard).
5. **Migrasi Awal**:
   - Jalankan `npm run db:generate` dan `npm run db:migrate` untuk membuat tabel-tabel di database Neon.

### 🔤 FASE 3: Konfigurasi Fonts API & Fontsource
1. **Daftarkan Font "Outfit"**:
   - Konfigurasi Fonts API di `astro.config.mjs` menggunakan provider Fontsource dengan rentang ketebalan 100-900 (variable font):
     ```javascript
     import { defineConfig, fontProviders } from "astro/config";
     import solidJs from "@astrojs/solid-js";
     import tailwindcss from "@tailwindcss/vite";

     export default defineConfig({
       integrations: [solidJs()],
       vite: {
         plugins: [tailwindcss()],
       },
       fonts: [
         {
           name: "Outfit",
           provider: fontProviders.fontsource({
             name: "outfit",
             weights: ["100 900"],
           }),
         },
       ],
     });
     ```

### 🧩 FASE 4: Dekomposisi Komponen SolidJS (TypeScript)
Buat komponen-komponen SolidJS berbasis TypeScript di bawah folder `src/component/`:

- **`Header.tsx`**: Menampilkan profil user (saat ini mock user ID/name sebelum Better Auth terpasang), judul, dan tanggal hari ini.
- **`Summary.tsx`**: Menghitung secara dinamis saldo saat ini, total pemasukan, dan total pengeluaran dari data transaksi.
- **`TransactionForm.tsx`**: Form untuk mencatat transaksi baru maupun memperbarui transaksi yang ada dengan validasi type-safe.
- **`SearchBar.tsx`**: Input pencarian reaktif untuk menyaring daftar transaksi berdasarkan judul.
- **`TransactionItem.tsx`**: Menampilkan baris transaksi individu dan menangani event aksi (edit, hapus, ubah tipe).
- **`TransactionList.tsx`**: Mengelompokkan transaksi ke dalam kolom Pemasukan dan Pengeluaran.
- **`App.tsx`**: Komponen utama pembungkus state dan antarmuka.

### ⚡ FASE 5: Komunikasi Data dengan Astro Actions
Kita akan mendefinisikan Astro Actions di `src/actions/index.ts` untuk melakukan query database menggunakan Drizzle:
1. **`getTransactions`**: Mengambil daftar transaksi milik user saat ini (sementara menggunakan dummy user ID).
2. **`createTransaction`**: Menambahkan transaksi baru ke database Neon.
3. **`updateTransaction`**: Memperbarui judul, nominal, tanggal, atau tipe transaksi.
4. **`deleteTransaction`**: Menghapus transaksi berdasarkan ID.

Di sisi client (komponen SolidJS), kita cukup mengimpor `actions` dari `astro:actions` dan memanggilnya secara langsung.

### 🌐 FASE 6: Struktur Layout & SEO Metadata
1. **Layout Reusable (`src/layout/Layout.astro`)**:
   - Buat berkas Layout baru untuk menampung seluruh metadata SEO, tag `<head>`, viewport, open graph tags, Twitter cards, tautan CDN (seperti FontAwesome atau Google Material Icons jika diperlukan), serta menyertakan slot (`<slot />`) untuk halaman.
2. **Halaman Utama (`src/pages/index.astro`)**:
   - Import `Layout` dari `../layout/Layout.astro`.
   - Bungkus pemanggilan komponen utama SolidJS `<App client:load />` di dalam `<Layout title="TacticCash | Expense Tracker">`.

### 🧪 FASE 7: Pengujian & Pembersihan
1. Verifikasi integrasi database Neon (data harus masuk ke cloud postgres).
2. Pastikan relasi user-to-transaction bekerja dengan benar di tingkat basis data.
3. Pertahankan semua pengujian otomatis dengan tidak mengubah nilai `data-testid`.
