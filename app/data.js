// DataNusa data: angka-angka resmi Indonesia, diringkas dari publikasi BPS,
// Bank Indonesia, dan Kementerian Keuangan. Setiap seri mencantumkan sumber
// dan tahunnya; halaman situs menampilkan keduanya di bawah setiap grafik.

const DATANUSA = {
  meta: {
    country: "Indonesia",
    updated: "Januari 2026",
    currency: "Rupiah (Rp)",
  },

  // Indikator utama yang tampil di kartu beranda.
  headline: [
    { key: "penduduk", label: "Penduduk", value: "281,6 jt", change: "+1,0% dari 2023", year: 2024, source: "BPS, Proyeksi Penduduk 2024" },
    { key: "pdb", label: "PDB nominal", value: "Rp22.139 T", change: "US$1.396 miliar", year: 2024, source: "BPS, PDB 2024" },
    { key: "tumbuh", label: "Pertumbuhan ekonomi", value: "5,03%", change: "y-on-y, 2024", year: 2024, source: "BPS, Berita Resmi Statistik" },
    { key: "inflasi", label: "Inflasi", value: "1,57%", change: "y-on-y, Des 2024", year: 2024, source: "BPS, Indeks Harga Konsumen" },
    { key: "tpt", label: "Pengangguran terbuka", value: "4,91%", change: "Agustus 2024", year: 2024, source: "BPS, Sakernas Agustus 2024" },
    { key: "miskin", label: "Penduduk miskin", value: "9,03%", change: "25,22 juta jiwa, Mar 2024", year: 2024, source: "BPS, Kemiskinan Maret 2024" },
  ],

  // Seri tahunan 2019-2024 untuk grafik.
  series: {
    pdbGrowth: {
      title: "Pertumbuhan ekonomi (PDB, % y-on-y)",
      unit: "%",
      source: "BPS — Pertumbuhan Ekonomi 2019–2024",
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      values: [5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
      note: "Kontraksi 2020 adalah dampak pandemi COVID-19; ekonomi pulih di atas 5% sejak 2022.",
    },
    inflation: {
      title: "Inflasi tahunan (%, Desember y-on-y)",
      unit: "%",
      source: "BPS — Indeks Harga Konsumen 2019–2024",
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
      note: "Lonjakan 2022 mengikuti penyesuaian harga BBM bersubsidi; inflasi kembali ke kisaran sasaran 2,5% ±1% pada 2024.",
    },
    unemployment: {
      title: "Tingkat pengangguran terbuka (%, Agustus)",
      unit: "%",
      source: "BPS — Sakernas Agustus 2019–2024",
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      values: [5.23, 7.07, 6.49, 5.86, 5.45, 4.91],
      note: "TPT terendah sejak 2019, di bawah level sebelum pandemi.",
    },
    poverty: {
      title: "Tingkat kemiskinan (%, Maret)",
      unit: "%",
      source: "BPS — Kemiskinan Maret 2019–2024",
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      values: [9.22, 9.78, 9.71, 9.54, 9.36, 9.03],
      note: "Jumlah penduduk miskin Maret 2024: 25,22 juta jiwa, turun 0,68 juta dari Maret 2023.",
    },
    population: {
      title: "Jumlah penduduk (juta jiwa)",
      unit: "juta",
      source: "BPS — Proyeksi Penduduk 2019–2024",
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      values: [266.9, 271.1, 273.9, 275.8, 278.7, 281.6],
      note: "Laju pertumbuhan penduduk sekitar 1% per tahun; Indonesia negara keempat terpadat di dunia.",
    },
    exports: {
      title: "Nilai ekspor (miliar US$)",
      unit: "US$ miliar",
      source: "BPS — Ekspor 2019–2024",
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      values: [167.7, 163.2, 231.6, 291.9, 258.8, 264.7],
      note: "Neraca perdagangan 2024 surplus US$31,04 miliar; ekspor nonmigas didominasi batu bara, CPO, dan nikel olahan.",
    },
  },

  // Struktur PDB menurut lapangan usaha, 2024 (share, %).
  gdpSectors: [
    { name: "Industri pengolahan", share: 18.67 },
    { name: "Perdagangan", share: 12.85 },
    { name: "Pertanian, kehutanan, perikanan", share: 12.53 },
    { name: "Pertambangan", share: 9.85 },
    { name: "Konstruksi", share: 9.88 },
    { name: "Transportasi & pergudangan", share: 5.76 },
    { name: "Informasi & komunikasi", share: 4.17 },
    { name: "Lainnya", share: 26.29 },
  ],

  // Penduduk bekerja menurut lapangan usaha utama, Agustus 2024 (juta jiwa).
  jobsBySector: [
    { name: "Pertanian", workers: 40.83 },
    { name: "Perdagangan", workers: 28.44 },
    { name: "Industri pengolahan", workers: 19.96 },
    { name: "Jasa kemasyarakatan", workers: 16.30 },
    { name: "Konstruksi", workers: 9.05 },
    { name: "Lainnya", workers: 31.32 },
  ],

  // Upah minimum provinsi tertinggi & terendah 2025 (Rp/bulan, dibulatkan).
  wages: [
    { province: "DKI Jakarta", ump: 5396900 },
    { province: "Papua Selatan", ump: 4350000 },
    { province: "Papua Pegunungan", ump: 4280000 },
    { province: "Kalimantan Utara", ump: 3560000 },
    { province: "Jawa Barat", ump: 2080000 },
    { province: "Jawa Tengah", ump: 2015000 },
    { province: "DI Yogyakarta", ump: 2200000 },
    { province: "Jawa Timur", ump: 2200000 },
  ],

  // Provinsi: penduduk 2024 (juta), kepadatan (jiwa/km2), kemiskinan Mar 2024 (%).
  provinces: [
    { name: "Jawa Barat", population: 50.35, density: 1425, poverty: 7.46 },
    { name: "Jawa Timur", population: 41.81, density: 873, poverty: 10.35 },
    { name: "Jawa Tengah", population: 37.89, density: 1155, poverty: 10.47 },
    { name: "Sumatera Utara", population: 15.59, density: 214, poverty: 8.15 },
    { name: "Banten", population: 12.43, density: 1287, poverty: 5.84 },
    { name: "DKI Jakarta", population: 10.68, density: 16113, poverty: 4.30 },
    { name: "Sulawesi Selatan", population: 9.46, density: 203, poverty: 8.48 },
    { name: "Lampung", population: 9.22, density: 266, poverty: 10.69 },
    { name: "Sumatera Selatan", population: 8.84, density: 97, poverty: 11.66 },
    { name: "Riau", population: 6.69, density: 77, poverty: 6.67 },
    { name: "Sumatera Barat", population: 5.76, density: 137, poverty: 5.97 },
    { name: "Kalimantan Barat", population: 5.61, density: 38, poverty: 6.81 },
    { name: "Nusa Tenggara Timur", population: 5.58, density: 115, poverty: 19.02 },
    { name: "Kalimantan Selatan", population: 4.22, density: 109, poverty: 4.19 },
    { name: "Papua", population: 1.30, density: 4, poverty: 30.00 },
  ],

  // Rilis statistik terbaru (judul, tanggal, sumber).
  releases: [
    { date: "5 Feb 2025", title: "Pertumbuhan Ekonomi Indonesia Triwulan IV-2024: 5,02% (y-on-y)", source: "BPS" },
    { date: "2 Jan 2025", title: "Inflasi Desember 2024 sebesar 0,44% (m-to-m); tahunan 1,57%", source: "BPS" },
    { date: "5 Nov 2024", title: "Tingkat Pengangguran Terbuka Agustus 2024: 4,91%", source: "BPS" },
    { date: "15 Jul 2024", title: "Jumlah Penduduk Miskin Maret 2024: 25,22 juta jiwa (9,03%)", source: "BPS" },
    { date: "15 Jan 2025", title: "Ekspor 2024 mencapai US$264,70 miliar; surplus US$31,04 miliar", source: "BPS" },
    { date: "27 Jun 2024", title: "Sensus Penduduk: 56,0% penduduk tinggal di Pulau Jawa", source: "BPS" },
  ],

  // Glosarium singkat istilah statistik.
  glossary: [
    { term: "PDB", def: "Produk Domestik Bruto — nilai seluruh barang dan jasa yang dihasilkan dalam wilayah Indonesia selama setahun." },
    { term: "Inflasi y-on-y", def: "Perubahan Indeks Harga Konsumen dibandingkan bulan yang sama tahun sebelumnya." },
    { term: "TPT", def: "Tingkat Pengangguran Terbuka — penganggur dibagi angkatan kerja, dikali 100%." },
    { term: "Garis kemiskinan", def: "Nilai rupiah minimum kebutuhan makanan dan non-makanan per kapita per bulan; penduduk di bawahnya digolongkan miskin." },
    { term: "Sakernas", def: "Survei Angkatan Kerja Nasional — survei BPS dua kali setahun (Februari dan Agustus)." },
  ],
};
