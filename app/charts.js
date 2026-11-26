// charts.js — pembuat grafik SVG murni untuk DataNusa. Tidak ada pustaka:
// setiap grafik digambar sebagai SVG dari data, lengkap dengan label sumbu,
// nilai, dan judul yang bisa dibaca pembaca layar.

function chartColors() {
  return {
    bar: "#0e5f5c",
    barHi: "#f2b33d",
    line: "#0e5f5c",
    grid: "#d8ddd9",
    text: "#5b6660",
    neg: "#b4432f",
  };
}

function svgOpen(width, height, label) {
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet">`;
}

// Grafik batang vertikal dari satu seri tahunan.
// series: { years, values, unit }, opts: { highlightLast }
function barChart(series, opts) {
  const c = chartColors();
  const W = 640, H = 300, padL = 46, padR = 14, padT = 18, padB = 34;
  const min = Math.min(0, ...series.values);
  const max = Math.max(...series.values);
  const span = (max - min) || 1;
  const iw = W - padL - padR, ih = H - padT - padB;
  const n = series.values.length;
  const slot = iw / n;
  const bw = Math.min(46, slot * 0.58);
  const y = (v) => padT + ih - ((v - min) / span) * ih;
  const zeroY = y(0);
  let s = svgOpen(W, H, series.title);
  s += `<line x1="${padL}" y1="${zeroY}" x2="${W - padR}" y2="${zeroY}" stroke="${c.grid}" stroke-width="1"/>`;
  // garis grid dan label sumbu Y
  for (let g = 0; g <= 4; g++) {
    const v = min + (span * g) / 4;
    const gy = y(v);
    s += `<line x1="${padL}" y1="${gy}" x2="${W - padR}" y2="${gy}" stroke="${c.grid}" stroke-width="0.7" stroke-dasharray="3 4"/>`;
    s += `<text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="${c.text}">${fmtNum(Math.round(v * 10) / 10)}</text>`;
  }
  series.values.forEach((v, i) => {
    const x = padL + slot * i + (slot - bw) / 2;
    const top = Math.min(y(v), zeroY);
    const h = Math.abs(zeroY - y(v));
    const fill = (opts && opts.highlightLast && i === n - 1) ? c.barHi : (v < 0 ? c.neg : c.bar);
    s += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, 2).toFixed(1)}" rx="3" fill="${fill}"><title>${series.years[i]}: ${fmtNum(v)} ${series.unit}</title></rect>`;
    s += `<text x="${(x + bw / 2).toFixed(1)}" y="${(top - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#1d2b27">${fmtNum(v)}</text>`;
    s += `<text x="${(x + bw / 2).toFixed(1)}" y="${H - 12}" text-anchor="middle" font-size="11" fill="${c.text}">${series.years[i]}</text>`;
  });
  return s + "</svg>";
}

// Grafik garis dari satu seri tahunan, dengan titik dan label nilai.
function lineChart(series) {
  const c = chartColors();
  const W = 640, H = 300, padL = 46, padR = 20, padT = 22, padB = 34;
  const min = Math.min(...series.values);
  const max = Math.max(...series.values);
  const lo = min - (max - min) * 0.15, hi = max + (max - min) * 0.15;
  const iw = W - padL - padR, ih = H - padT - padB;
  const n = series.values.length;
  const x = (i) => padL + (iw * i) / (n - 1);
  const y = (v) => padT + ih - ((v - lo) / (hi - lo)) * ih;
  let s = svgOpen(W, H, series.title);
  for (let g = 0; g <= 4; g++) {
    const v = lo + ((hi - lo) * g) / 4;
    const gy = y(v);
    s += `<line x1="${padL}" y1="${gy}" x2="${W - padR}" y2="${gy}" stroke="${c.grid}" stroke-width="0.7" stroke-dasharray="3 4"/>`;
    s += `<text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="${c.text}">${fmtNum(Math.round(v * 10) / 10)}</text>`;
  }
  const pts = series.values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  s += `<polyline points="${pts}" fill="none" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  series.values.forEach((v, i) => {
    s += `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4.5" fill="#ffffff" stroke="${c.line}" stroke-width="2.5"><title>${series.years[i]}: ${fmtNum(v)} ${series.unit}</title></circle>`;
    s += `<text x="${x(i).toFixed(1)}" y="${(y(v) - 11).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#1d2b27">${fmtNum(v)}</text>`;
    s += `<text x="${x(i).toFixed(1)}" y="${H - 12}" text-anchor="middle" font-size="11" fill="${c.text}">${series.years[i]}</text>`;
  });
  return s + "</svg>";
}

// Grafik donat dari daftar { name, share } — dipakai untuk struktur PDB.
function donutChart(items, title) {
  const palette = ["#0e5f5c", "#f2b33d", "#2e8b87", "#c98a1b", "#7fc8c2", "#5b6660", "#e07a4e", "#9db3a8"];
  const total = items.reduce((a, b) => a + b.share, 0);
  const R = 96, r = 58, cx = 120, cy = 120;
  let s = svgOpen(560, 240, title);
  let angle = -Math.PI / 2;
  const arc = (a0, a1, rr) => {
    const x0 = cx + rr * Math.cos(a0), y0 = cy + rr * Math.sin(a0);
    const x1 = cx + rr * Math.cos(a1), y1 = cy + rr * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${rr} ${rr} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  items.forEach((it, i) => {
    const frac = it.share / total;
    const a1 = angle + frac * Math.PI * 2;
    const path = arc(angle, a1, R) + " " + arc(a1, angle, r) + " Z";
    s += `<path d="${path}" fill="${palette[i % palette.length]}"><title>${it.name}: ${fmtNum(it.share)}%</title></path>`;
    angle = a1;
  });
  s += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="700" fill="#1d2b27">PDB 2024</text>`;
  s += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="#5b6660">Rp22.139 triliun</text>`;
  // legenda
  items.forEach((it, i) => {
    const ly = 26 + i * 26;
    s += `<rect x="252" y="${ly - 11}" width="13" height="13" rx="3" fill="${palette[i % palette.length]}"/>`;
    s += `<text x="272" y="${ly}" font-size="12.5" fill="#1d2b27">${it.name} — ${fmtNum(it.share)}%</text>`;
  });
  return s + "</svg>";
}

// Format angka Indonesia: koma desimal, maks 2 angka di belakang koma.
function fmtNum(v) {
  return Number(v).toLocaleString("id-ID", { maximumFractionDigits: 2 });
}
