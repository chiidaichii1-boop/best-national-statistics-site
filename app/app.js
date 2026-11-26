// app.js — router dan tampilan DataNusa. Semua halaman dirender dari data.js;
// tidak ada permintaan jaringan: grafik digambar sebagai SVG oleh charts.js.

const view = document.getElementById("view");
const themeBtn = document.getElementById("themeToggle");

// ---------- tema gelap / terang ----------
function applyTheme(dark) {
  document.documentElement.classList.toggle("dark", dark);
  themeBtn.textContent = dark ? "Mode terang" : "Mode gelap";
  themeBtn.setAttribute("aria-pressed", String(dark));
  try { localStorage.setItem("datanusa-theme", dark ? "dark" : "light"); } catch (e) { /* abaikan */ }
}
let savedTheme = "light";
try { savedTheme = localStorage.getItem("datanusa-theme") || "light"; } catch (e) { /* abaikan */ }
applyTheme(savedTheme === "dark");
themeBtn.addEventListener("click", () => {
  applyTheme(!document.documentElement.classList.contains("dark"));
});

// ---------- potongan HTML bersama ----------
function sourceLine(source) {
  return `<p class="source">Sumber: ${source}</p>`;
}
function noteLine(note) {
  return `<p class="note">${note}</p>`;
}
function card(item) {
  return `<article class="kpi">
    <h3>${item.label}</h3>
    <p class="kpi-value">${item.value}</p>
    <p class="kpi-change">${item.change}</p>
    <p class="kpi-meta">${item.year} · ${item.source}</p>
  </article>`;
}
function chartBlock(title, svg, source, note) {
  return `<section class="panel"><h2>${title}</h2><div class="chart">${svg}</div>${sourceLine(source)}${note ? noteLine(note) : ""}</section>`;
}
function hbarList(items, valueKey, unit, maxLabel) {
  const max = Math.max(...items.map((i) => i[valueKey]));
  return `<ul class="hbars">` + items.map((it) =>
    `<li><span class="hbar-label">${it.name}</span><span class="hbar-track"><span class="hbar-fill" style="width:${(it[valueKey] / max * 100).toFixed(1)}%"></span></span><span class="hbar-value">${fmtNum(it[valueKey])} ${unit}</span></li>`
  ).join("") + `</ul><p class="note">Nilai tertinggi: ${maxLabel}.</p>`;
}

// ---------- halaman ----------
function pageHome() {
  const gdp = DATANUSA.series.pdbGrowth;
  const inf = DATANUSA.series.inflation;
  return `
  <section class="hero">
    <h1>Angka Indonesia, <span>jelas dan bisa dipercaya.</span></h1>
    <p class="hero-lead">Penduduk, ekonomi, lapangan kerja, dan perdagangan Indonesia — diringkas dari publikasi resmi BPS, Bank Indonesia, dan Kementerian Keuangan, lengkap dengan sumber dan tahunnya.</p>
    <p class="hero-cta"><a class="btn" href="#/ekonomi">Lihat ekonomi</a> <a class="btn btn-ghost" href="#/provinsi">Jelajahi provinsi</a></p>
  </section>
  <section class="kpis" aria-label="Indikator utama">
    ${DATANUSA.headline.map(card).join("")}
  </section>
  <div class="grid-2">
    ${chartBlock(gdp.title, barChart(gdp, { highlightLast: true }), gdp.source, gdp.note)}
    ${chartBlock(inf.title, lineChart(inf), inf.source, inf.note)}
  </div>
  <section class="panel">
    <h2>Rilis terbaru</h2>
    <ul class="releases">
      ${DATANUSA.releases.map((r) => `<li><time>${r.date}</time><span>${r.title}</span><em>${r.source}</em></li>`).join("")}
    </ul>
    <p class="note">Rilis lengkap tersedia di situs Badan Pusat Statistik (bps.go.id). DataNusa hanya meringkas angka-angkanya.</p>
  </section>`;
}

function pageEconomy() {
  return `
  <section class="page-head">
    <h1>Ekonomi Indonesia</h1>
    <p>Pertumbuhan, harga, dan perdagangan luar negeri. Pilih indikator untuk mengganti grafik dan penjelasannya.</p>
  </section>
  <section class="panel">
    <div class="tabs" role="tablist" aria-label="Pilih indikator ekonomi">
      <button type="button" role="tab" data-set="pdbGrowth" class="tab active" aria-selected="true">Pertumbuhan PDB</button>
      <button type="button" role="tab" data-set="inflation" class="tab" aria-selected="false">Inflasi</button>
      <button type="button" role="tab" data-set="exports" class="tab" aria-selected="false">Ekspor</button>
    </div>
    <div id="econChart"></div>
  </section>
  <section class="panel">
    <h2>Struktur PDB menurut lapangan usaha, 2024</h2>
    <div class="chart">${donutChart(DATANUSA.gdpSectors, "Struktur PDB 2024")}</div>
    ${sourceLine("BPS — PDB menurut Lapangan Usaha 2024")}
    ${noteLine("Industri pengolahan tetap menjadi kontributor terbesar, diikuti perdagangan dan pertanian.")}
  </section>
  <section class="panel">
    <h2>Angka kunci 2024</h2>
    <table class="data-table">
      <thead><tr><th>Indikator</th><th>Nilai</th><th>Sumber</th></tr></thead>
      <tbody>
        <tr><td>PDB nominal</td><td>Rp22.139 triliun</td><td>BPS</td></tr>
        <tr><td>PDB per kapita</td><td>Rp78,6 juta (US$4.960)</td><td>BPS</td></tr>
        <tr><td>Pertumbuhan ekonomi</td><td>5,03%</td><td>BPS</td></tr>
        <tr><td>Inflasi (Des, y-on-y)</td><td>1,57%</td><td>BPS</td></tr>
        <tr><td>Ekspor</td><td>US$264,70 miliar</td><td>BPS</td></tr>
        <tr><td>Impor</td><td>US$233,66 miliar</td><td>BPS</td></tr>
        <tr><td>Neraca perdagangan</td><td>Surplus US$31,04 miliar</td><td>BPS</td></tr>
        <tr><td>Cadangan devisa (Des)</td><td>US$155,7 miliar</td><td>Bank Indonesia</td></tr>
      </tbody>
    </table>
    ${sourceLine("BPS dan Bank Indonesia, 2024")}
  </section>`;
}

function pagePopulation() {
  const pop = DATANUSA.series.population;
  return `
  <section class="page-head">
    <h1>Penduduk Indonesia</h1>
    <p>281,6 juta jiwa pada 2024 — negara keempat terpadat di dunia. Lebih dari separuh penduduk tinggal di Pulau Jawa.</p>
  </section>
  <section class="panel">
    <h2>Jumlah penduduk 2019–2024</h2>
    <div class="range" role="group" aria-label="Rentang tahun">
      <button type="button" data-range="all" class="range-btn active">2019–2024</button>
      <button type="button" data-range="early" class="range-btn">2019–2021</button>
      <button type="button" data-range="late" class="range-btn">2022–2024</button>
    </div>
    <div id="popChart" class="chart"></div>
    ${sourceLine(pop.source)}
    ${noteLine(pop.note)}
  </section>
  <section class="panel">
    <h2>Komposisi penduduk, 2024</h2>
    <ul class="facts">
      <li><strong>50,5%</strong> laki-laki · <strong>49,5%</strong> perempuan</li>
      <li><strong>68,2%</strong> penduduk usia produktif (15–64 tahun)</li>
      <li><strong>58,5%</strong> tinggal di perkotaan</li>
      <li><strong>56,0%</strong> tinggal di Pulau Jawa</li>
      <li>Usia harapan hidup: <strong>74,07 tahun</strong></li>
      <li>Jumlah provinsi: <strong>38</strong></li>
    </ul>
    ${sourceLine("BPS — Proyeksi Penduduk dan Sensus Penduduk 2024")}
  </section>
  <section class="panel">
    <h2>Provinsi terpadat</h2>
    <p>Sepuluh provinsi dengan penduduk terbanyak — tabel lengkap beserta pencarian ada di halaman <a href="#/provinsi">Provinsi</a>.</p>
    ${hbarList(DATANUSA.provinces.slice(0, 8), "population", "jt jiwa", "Jawa Barat, 50,35 juta jiwa")}
    ${sourceLine("BPS — Proyeksi Penduduk 2024")}
  </section>`;
}

function pageLabour() {
  const tpt = DATANUSA.series.unemployment;
  const pov = DATANUSA.series.poverty;
  return `
  <section class="page-head">
    <h1>Tenaga Kerja &amp; Kesejahteraan</h1>
    <p>Pengangguran di titik terendah sejak 2019, upah minimum naik, dan kemiskinan terus menurun.</p>
  </section>
  <div class="grid-2">
    ${chartBlock(tpt.title, lineChart(tpt), tpt.source, tpt.note)}
    ${chartBlock(pov.title, barChart(pov, { highlightLast: true }), pov.source, pov.note)}
  </div>
  <section class="panel">
    <h2>Penduduk bekerja menurut lapangan usaha, Agustus 2024</h2>
    ${hbarList(DATANUSA.jobsBySector, "workers", "jt orang", "Pertanian, 40,83 juta orang")}
    ${sourceLine("BPS — Sakernas Agustus 2024 (total bekerja 145,90 juta orang)")}
  </section>
  <section class="panel">
    <h2>Upah minimum provinsi (UMP) 2025 — pilihan</h2>
    <table class="data-table">
      <thead><tr><th>Provinsi</th><th>UMP 2025 (Rp/bulan)</th></tr></thead>
      <tbody>
        ${DATANUSA.wages.map((w) => `<tr><td>${w.province}</td><td>${w.ump.toLocaleString("id-ID")}</td></tr>`).join("")}
      </tbody>
    </table>
    ${sourceLine("Keputusan gubernur masing-masing provinsi, 2025 (angka dibulatkan)")}
    ${noteLine("UMP tertinggi di DKI Jakarta (Rp5.396.900) dan terendah di Jawa Tengah (Rp2.015.000) di antara provinsi yang ditampilkan.")}
  </section>`;
}

function provinceRows(list) {
  return list.map((p) => `<tr data-name="${p.name}">
    <td>${p.name}</td>
    <td class="num">${fmtNum(p.population)}</td>
    <td class="num">${p.density.toLocaleString("id-ID")}</td>
    <td class="num">${fmtNum(p.poverty)}%</td>
  </tr>`).join("");
}

function pageProvinces() {
  return `
  <section class="page-head">
    <h1>Provinsi</h1>
    <p>Perbandingan 15 provinsi menurut penduduk, kepadatan, dan tingkat kemiskinan. Cari nama provinsi, urutkan kolomnya, atau klik baris untuk melihat ringkasannya.</p>
  </section>
  <section class="panel">
    <div class="toolbar">
      <label class="search">Cari provinsi
        <input id="provSearch" type="search" placeholder="cth: Jawa, Papua, Kalimantan…" autocomplete="off">
      </label>
      <div class="sort-group" role="group" aria-label="Urutkan tabel">
        <button type="button" data-sort="population" class="sort-btn">Penduduk ↓</button>
        <button type="button" data-sort="density" class="sort-btn">Kepadatan ↓</button>
        <button type="button" data-sort="poverty" class="sort-btn">Kemiskinan ↓</button>
      </div>
      <button type="button" id="csvBtn" class="btn btn-small">Unduh CSV</button>
    </div>
    <div class="table-wrap">
      <table class="data-table" id="provTable">
        <thead><tr><th>Provinsi</th><th>Penduduk 2024 (jt)</th><th>Kepadatan (jiwa/km²)</th><th>Kemiskinan Mar 2024 (%)</th></tr></thead>
        <tbody>${provinceRows(DATANUSA.provinces)}</tbody>
      </table>
    </div>
    <p id="provCount" class="note">Menampilkan 15 dari 15 provinsi.</p>
    <div id="provDetail" class="detail" hidden></div>
    ${sourceLine("BPS — Proyeksi Penduduk 2024 dan Kemiskinan Maret 2024")}
  </section>
  <section class="panel">
    <h2>Yang perlu diketahui</h2>
    <ul class="facts">
      <li>Kemiskinan tertinggi di antara provinsi yang ditampilkan: <strong>Papua, 30,00%</strong>; terendah: <strong>Kalimantan Selatan, 4,19%</strong>.</li>
      <li>Kepadatan tertinggi: <strong>DKI Jakarta, 16.113 jiwa/km²</strong>; terendah: <strong>Papua, 4 jiwa/km²</strong>.</li>
      <li>Tiga provinsi terpadat — Jawa Barat, Jawa Timur, Jawa Tengah — menampung <strong>46%</strong> penduduk Indonesia.</li>
    </ul>
  </section>`;
}

function pageAbout() {
  return `
  <section class="page-head">
    <h1>Tentang &amp; Metodologi</h1>
    <p>Bagaimana DataNusa bekerja, dari mana angkanya berasal, dan apa arti istilah-istilahnya.</p>
  </section>
  <section class="panel">
    <h2>Apa itu DataNusa?</h2>
    <p>DataNusa adalah portal statistik yang menyajikan angka-angka resmi Indonesia dalam format yang mudah dibaca di komputer maupun ponsel. Situs ini berjalan sepenuhnya dari berkasnya sendiri — tanpa pelacak, tanpa iklan, dan tanpa memuat apa pun dari internet.</p>
    <p>DataNusa <strong>bukan</strong> situs resmi Badan Pusat Statistik. Angka-angka di sini diringkas dari publikasi resmi dan setiap grafik serta tabel mencantumkan sumber dan tahunnya. Untuk angka terbaru, selalu rujuk publikasi asli di bps.go.id.</p>
  </section>
  <section class="panel">
    <h2>Metodologi</h2>
    <ul class="facts">
      <li>Angka tahunan memakai tahun kalender yang sama dengan publikasi sumbernya (misalnya PDB 2024 dari Berita Resmi Statistik BPS).</li>
      <li>Inflasi yang ditampilkan adalah inflasi tahunan Desember (y-on-y), sesuai rilis IHK BPS.</li>
      <li>Tingkat pengangguran memakai hasil Sakernas Agustus; tingkat kemiskinan memakai hasil Maret.</li>
      <li>Angka dibulatkan ke dua desimal; pembulatan dapat membuat jumlah komponen tidak persis 100%.</li>
    </ul>
  </section>
  <section class="panel">
    <h2>Glosarium</h2>
    <dl class="glossary">
      ${DATANUSA.glossary.map((g) => `<dt>${g.term}</dt><dd>${g.def}</dd>`).join("")}
    </dl>
  </section>`;
}

// ---------- interaksi per halaman ----------
function wireEconomy() {
  const holder = document.getElementById("econChart");
  function render(key) {
    const s = DATANUSA.series[key];
    const svg = key === "inflation" ? lineChart(s) : barChart(s, { highlightLast: true });
    holder.innerHTML = `<h3 class="chart-title">${s.title}</h3><div class="chart">${svg}</div>${sourceLine(s.source)}${noteLine(s.note)}`;
  }
  render("pdbGrowth");
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      render(btn.dataset.set);
    });
  });
}

function wirePopulation() {
  const holder = document.getElementById("popChart");
  const pop = DATANUSA.series.population;
  function render(range) {
    let years = pop.years, values = pop.values;
    if (range === "early") { years = pop.years.slice(0, 3); values = pop.values.slice(0, 3); }
    if (range === "late") { years = pop.years.slice(3); values = pop.values.slice(3); }
    holder.innerHTML = barChart({ ...pop, years, values }, { highlightLast: true });
  }
  render("all");
  document.querySelectorAll(".range-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".range-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.range);
    });
  });
}

function wireProvinces() {
  const input = document.getElementById("provSearch");
  const tbody = document.querySelector("#provTable tbody");
  const count = document.getElementById("provCount");
  const detail = document.getElementById("provDetail");
  let list = [...DATANUSA.provinces];
  let sortKey = null, sortDir = -1;

  function render() {
    let rows = list;
    const q = input.value.trim().toLowerCase();
    if (q) rows = rows.filter((p) => p.name.toLowerCase().includes(q));
    if (sortKey) rows = [...rows].sort((a, b) => (a[sortKey] - b[sortKey]) * sortDir);
    tbody.innerHTML = rows.length
      ? provinceRows(rows)
      : `<tr><td colspan="4">Tidak ada provinsi yang cocok dengan “${input.value.trim()}”.</td></tr>`;
    count.textContent = `Menampilkan ${rows.length} dari ${DATANUSA.provinces.length} provinsi.`;
  }
  input.addEventListener("input", () => { detail.hidden = true; render(); });
  document.querySelectorAll(".sort-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.sort;
      if (sortKey === key) sortDir = -sortDir; else { sortKey = key; sortDir = -1; }
      document.querySelectorAll(".sort-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      btn.textContent = btn.textContent.replace(/ [↑↓]$/, "") + (sortDir === -1 ? " ↓" : " ↑");
      render();
    });
  });
  tbody.addEventListener("click", (ev) => {
    const row = ev.target.closest("tr[data-name]");
    if (!row) return;
    const p = DATANUSA.provinces.find((x) => x.name === row.dataset.name);
    if (!p) return;
    const share = (p.population / 281.6 * 100).toFixed(1);
    detail.hidden = false;
    detail.innerHTML = `<h3>${p.name}</h3>
      <p><strong>${fmtNum(p.population)} juta jiwa</strong> (${share}% penduduk Indonesia) · kepadatan <strong>${p.density.toLocaleString("id-ID")} jiwa/km²</strong> · kemiskinan <strong>${fmtNum(p.poverty)}%</strong> (Maret 2024).</p>
      <p class="note">Sumber: BPS — Proyeksi Penduduk 2024 dan Kemiskinan Maret 2024.</p>`;
    detail.scrollIntoView({ block: "nearest" });
  });
  document.getElementById("csvBtn").addEventListener("click", () => {
    const head = "Provinsi,Penduduk 2024 (juta),Kepadatan (jiwa/km2),Kemiskinan Mar 2024 (%)\n";
    const body = DATANUSA.provinces.map((p) => `${p.name},${p.population},${p.density},${p.poverty}`).join("\n");
    const url = URL.createObjectURL(new Blob([head + body], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "datanusa-provinsi.csv"; a.click();
    URL.revokeObjectURL(url);
  });
}

// ---------- router ----------
const ROUTES = {
  "/": { title: "Beranda", render: pageHome },
  "/ekonomi": { title: "Ekonomi", render: pageEconomy, wire: wireEconomy },
  "/penduduk": { title: "Penduduk", render: pagePopulation, wire: wirePopulation },
  "/tenaga-kerja": { title: "Tenaga Kerja", render: pageLabour },
  "/provinsi": { title: "Provinsi", render: pageProvinces, wire: wireProvinces },
  "/tentang": { title: "Tentang", render: pageAbout },
};

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const page = ROUTES[hash] || ROUTES["/"];
  document.title = `DataNusa — ${page.title} | Portal Statistik Indonesia`;
  view.innerHTML = page.render();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const key = a.dataset.nav;
    const active = (hash === "/" && key === "home") || hash === "/" + key;
    a.classList.toggle("active", active);
    if (active) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  if (page.wire) page.wire();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
