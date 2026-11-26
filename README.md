[![DataNusa](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/chiidaichii1-boop/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/chiidaichii1-boop/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# DataNusa — Portal Statistik Indonesia

Portal statistik Indonesia yang berjalan sepenuhnya dari berkas statisnya
sendiri: tanpa jaringan, tanpa pelacak, tanpa iklan. Beranda dengan enam
indikator utama (penduduk, PDB, pertumbuhan, inflasi, pengangguran,
kemiskinan), halaman Ekonomi (tab indikator + struktur PDB), Penduduk
(rentang tahun + komposisi), Tenaga Kerja (pengangguran, kemiskinan, upah
minimum), Provinsi (cari, urutkan, klik baris untuk ringkasan, unduh CSV),
serta Tentang & Metodologi dengan glosarium.

Semua angka adalah angka resmi — Badan Pusat Statistik (BPS), Bank
Indonesia, Kementerian Keuangan — dan setiap grafik serta tabel
mencantumkan sumber dan tahunnya. Grafik digambar sebagai SVG oleh
`app/charts.js`; tidak ada pustaka eksternal.

## Menjalankan

```sh
node serve.ts        # http://localhost:8080
```

## Menyerahkan

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke direktori keluaran dan
menulis `dossier.json` dengan pustaka `vendor/makefun-frontend.ts` (salinan
kit, tidak diubah).

## Tangkapan layar

Diambil dari situs yang sedang berjalan dengan Chromium headless
(`shots.sh`): beranda desktop, halaman ekonomi, halaman provinsi, dan
beranda pada lebar ponsel (390×844).
