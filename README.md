# TacticCash

TacticCash adalah aplikasi pelacak keuangan (_expense tracker_) berbasis web yang dirancang agar praktis dan responsif untuk mengelola keuangan pribadi. Dilengkapi dengan ringkasan saldo secara _real-time_, penyimpanan data otomatis dan aman melalui _Local Storage_, hingga pencarian dan pengelolaan transaksi yang interaktif, aplikasi ini dirancang untuk memudahkan Anda dalam mengambil kendali penuh atas pemasukan dan pengeluaran harian.

## Table of Content

- [Features](#features)
- [Demo](#demo)
- [Run Locally](#run-locally)
- [AI Collaborations](#ai-collaborations)
- [Authors](#authors)
- [Acknowledgements](#acknowledgements)

## Features

- **Pencatatan Transaksi (Add Transaction):** Pengguna dapat menambahkan transaksi baru berupa pemasukan (income) maupun pengeluaran (expense) dengan menyertakan keterangan, nominal, dan tanggal.
- **Ringkasan Keuangan (Summary Dashboard):** Aplikasi secara otomatis menghitung dan menampilkan total saldo saat ini, total pemasukan, dan total pengeluaran.
- **Riwayat Transaksi (Transaction History):** Menampilkan daftar transaksi yang terbagi dalam arus pemasukan dan arus pengeluaran secara visual.
- **Pencarian Transaksi (Search):** Pengguna dapat mencari transaksi tertentu berdasarkan keterangan/judul.
- **Edit & Hapus Transaksi (Edit & Delete):** Pengguna dapat memperbarui atau menghapus transaksi yang sudah dicatat.
- **Ubah Tipe Transaksi (Quick Type Toggle):** Memungkinkan pengubahan tipe transaksi (pemasukan <-> pengeluaran) dengan cepat melalui satu tombol.
- **Penyimpanan Lokal (Local Storage Data Persistence):** Data transaksi disimpan dengan aman di `localStorage` browser, sehingga tidak akan hilang ketika halaman dimuat ulang.
- **Validasi Form (Form Validation):** Terdapat validasi input otomatis untuk menghindari entri data yang tidak sesuai.

## Demo

Live demo:

https://tactic-cash.vercel.app/

Screenshoot:

[TacticCash Dashboard](./src/assets/screenshot.png)

## Run Locally

**Clone Repository:**

```bash
  git clone https://github.com/ahmad-fajari/expense-tracker-app.git
```

**Masuk ke dalam direktori proyek:**

```bash
  cd expense-tracker-app
```

**Jalankan aplikasi:**

Karena proyek ini murni menggunakan **Vanilla HTML, CSS, dan JavaScript** tanpa _dependency_ eksternal (Node.js/NPM), Anda cukup membuka file `index.html` langsung dengan _browser_ Anda.

Sebagai alternatif, Anda juga bisa menggunakan ekstensi **Live Server** di Visual Studio Code untuk menjalankan aplikasi.

## AI Collaborations

Proyek ini memanfaatkan **Antigravity (powered by Gemini AI)** sebagai _pair-programmer agent_. Pemanfaatan AI ini diimplementasikan untuk melakukan otomatisasi pada pengelolaan _version control_, mengoptimalkan _SEO metadata_, serta ekstraksi fungsionalitas _codebase_ untuk men-_generate_ dokumentasi teknis yang sesuai dengan _best practices_.

Berikut adalah detail terkait penggunaan AI dalam proyek ini:

- **Optimasi SEO & Meta Tags**: Menulis dan melengkapi elemen _SEO Meta Tags_, _Open Graph (OG) Tags_, dan _Twitter Card_ pada file `index.html` untuk meningkatkan kualitas metadata situs.
- **Otomatisasi Version Control**: Memeriksa perubahan kode (_staged changes_) dan membuat pesan _commit_ otomatis yang terstruktur serta mematuhi aturan _Conventional Commits_.
- **Penyusunan Dokumentasi (README)**: Mengeksplorasi kode _source code_ untuk mengidentifikasi fungsi utama aplikasi, lalu merangkum dan menuliskannya secara mendetail pada README, meliputi penyusunan fitur unggulan (_Features_), tata cara instalasi (_Run Locally_), terjemahan ke Bahasa Indonesia, hingga merapikan daftar referensi (_Acknowledgements_).

## Authors

[Ahmad Fajari](https://github.com/ahmad-fajari)

## Acknowledgements

**Font:**

- [Outfit](https://fonts.google.com/specimen/Outfit) (oleh Google Fonts)

**Icons:**

- [FontAwesome](https://fontawesome.com/) (tombol Edit, Ubah Tipe, dan Hapus)
- [Google Material Icons](https://fonts.google.com/icons) (ikon Saldo, Pemasukan, dan Pengeluaran)

**Design Tools:**

- [HTML Color Codes - Color Wheel](https://htmlcolorcodes.com/color-wheel/) (digunakan untuk membuat _color palette_)
- [Josh W. Comeau - Shadow Palette](https://www.joshwcomeau.com/shadow-palette/) (digunakan untuk membuat _realistic shadow_)
- [UI Colors Generator by Sajid](https://www.iamsajid.com/ui-colors/) (digunakan untuk membuat background, teks, dan border _color_ berdasarkan _primary color_)
