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
   - **Relasi Transaksi**: Tabel `transaction` didefinisikan secara manual dengan referensi kunci asing (`user_id`) ke tabel `user`.
4. **Komunikasi Data**:
   - **Astro Actions**: Menggantikan API endpoint tradisional dengan fungsi backend type-safe yang dapat dipanggil langsung dari client-side SolidJS components.

---

## 🗄️ Rancangan Skema Database (Drizzle ORM)
Skema database utama diletakkan di `src/db/schema.ts` dan relasi di `src/db/relations.ts`.

Tabel-tabel autentikasi Better Auth (`user`, `session`, `account`, `verification`) akan digenerate secara otomatis menggunakan perintah CLI Better Auth. Kita mendeklarasikan tabel `user` secara minimal (sebagai referensi relasi) dan mendefinisikan tabel `transaction` secara manual:

### 📄 `src/db/schema.ts` [DONE]
```typescript
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
});

export const transaction = pgTable("transaction", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  date: text("date").notNull(),
  type: text("type").$type<"income" | "expense">().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 📄 `src/db/relations.ts` [DONE]
Menggunakan sintaks Drizzle ORM v2 `defineRelations`:
```typescript
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  user: {
    transactions: r.many.transaction(),
  },
  transaction: {
    user: r.one.user({
      from: r.transaction.userId,
      to: r.user.id,
    }),
  },
}));
```

---

## 🛠️ Tahapan Migrasi

### 📁 FASE 1: Migrasi Aset & Stylesheet [DONE]
- [x] **Pindahkan Aset**:
  - Berkas `account_balance_wallet.svg` dipindahkan secara manual.
- [x] **Pindahkan Stylesheet**:
  - Salin stylesheet kustom `archive/src/css/style.css` ke `src/styles/style.css` dan bersihkan blok `:root` duplikat.
  - Impor pada `src/styles/global.css` di bagian atas:
    ```css
    @import "tailwindcss";
    @import "./style.css";
    ```

### 🗄️ FASE 2: Konfigurasi Database & Drizzle [DONE]
- [x] **Drizzle Config (`drizzle.config.ts`)**: Konfigurasi file kit.
- [x] **Koneksi Database (`src/db/index.ts`)**: Inisialisasi dengan Neon client dan registrasi schema + relations v2.
- [x] **Definisikan Schema & Relations (`src/db/schema.ts` & `src/db/relations.ts`)**: Setup Drizzle PG tables.
- [x] **Environment Variables (`.env` & `.env.example`)**: Setup token `BETTER_AUTH_SECRET` & placeholder `DATABASE_URL`.
- [ ] **Migrasi Awal**:
  - Jalankan `npm run db:generate` dan `npm run db:migrate` (memerlukan `DATABASE_URL` aktif).

### 🔑 FASE 3: Setup Better Auth [DONE]
- [x] **Instalasi**: Menambahkan dependency `better-auth` ke `package.json`.
- [x] **Konfigurasi Server (`src/lib/auth.ts`)**: Setup `betterAuth` dengan adapter `drizzleAdapter` (provider `pg`) dan plugin `emailAndPassword`.
- [x] **Astro Route Handler (`src/pages/api/auth/[...all].ts`)**: Routing catch-all untuk Better Auth API.
- [x] **Better Auth CLI Generation**:
  - Jalankan `npx @better-auth/cli@latest generate --output src/db/auth-schema.ts` di masa mendatang setelah siap sinkronisasi schema auth penuh.

### ⚡ FASE 4: Komunikasi Data dengan Astro Actions [DONE]
- [x] **Astro Actions (`src/actions/index.ts`)**: Menyediakan fungsi server-side:
  - `getTransactions` (Mengambil transaksi user - fallback ke `dev-user` jika belum login).
  - `createTransaction` (Membuat transaksi baru).
  - `updateTransaction` (Memperbarui transaksi).
  - `toggleTransactionType` (Mengubah tipe transaksi Pemasukan <-> Pengeluaran).
  - `deleteTransaction` (Menghapus transaksi).

### 🔤 FASE 5: Konfigurasi Fonts API & Fontsource [DONE]
- [x] **Daftarkan Font "Outfit"**:
  - Konfigurasi Fonts API di `astro.config.mjs` menggunakan provider Fontsource dengan rentang ketebalan 100-900 (variable font).

### 🧩 FASE 6: Dekomposisi Komponen SolidJS (TypeScript) [DONE]
Buat komponen-komponen SolidJS berbasis TypeScript (`.tsx`) di bawah folder `src/component/` dengan struktur modular:
- [x] **`layout/Header.tsx`**: Menampilkan nama profil & tanggal dinamis.
- [x] **`dashboard/Summary.tsx`**: Menampilkan ringkasan keuangan reaktif.
- [x] **`transaction/TransactionForm.tsx`**: Form input transaksi dengan validasi.
- [x] **`transaction/SearchBar.tsx`**: Bar pencarian transaksi.
- [x] **`transaction/TransactionItem.tsx`**: Kartu detail transaksi dengan trigger aksi.
- [x] **`transaction/TransactionList.tsx`**: Container yang memilah arus pemasukan dan pengeluaran.
- [x] **`App.tsx`**: Komponen utama pengelola state lokal dan backend actions.

### 🌐 FASE 7: Struktur Layout & SEO Metadata [DONE]
- [x] **Layout Reusable (`src/layouts/Layout.astro`)**: Membuat shell HTML, SEO tags, dan load Fonts API.
- [x] **Halaman Utama (`src/pages/index.astro`)**: Menghubungkan Layout dengan `<App client:load />`.

### 🧪 FASE 8: Pengujian & Pembersihan
- [ ] Uji integrasi data database Neon menggunakan Astro Actions.
- [ ] Pastikan relasi user-to-transaction bekerja dengan benar di tingkat basis data.
- [ ] Pertahankan semua pengujian otomatis dengan tidak mengubah nilai `data-testid`.
