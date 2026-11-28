// Hearth — small SVG charts, drawn by hand.
//
// Two chart builders, both pure functions of numbers: a grouped bar chart
// for the six-month history, and a donut for the category split. No
// library, no canvas, no network — the markup is inline SVG.

function hearthEscape(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Grouped bars: income (green) beside spending (terracotta) per month.
function hearthBarChart(rows, width, height) {
  const padLeft = 46;
  const padBottom = 26;
  const padTop = 14;
  const chartW = width - padLeft - 8;
  const chartH = height - padTop - padBottom;
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spent))) * 1.08;
  const groupW = chartW / rows.length;
  const barW = Math.min(22, (groupW - 18) / 2);
  let svg = '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Monthly income versus spending bar chart" class="chart-svg">';
  for (let i = 0; i <= 4; i++) {
    const value = (max / 4) * i;
    const y = padTop + chartH - (chartH * value) / max;
    svg += '<line x1="' + padLeft + '" y1="' + y.toFixed(1) + '" x2="' + (padLeft + chartW) + '" y2="' + y.toFixed(1) + '" class="chart-grid"/>';
    svg += '<text x="' + (padLeft - 6) + '" y="' + (y + 4).toFixed(1) + '" class="chart-axis" text-anchor="end">$' + Math.round(value / 1000) + 'k</text>';
  }
  rows.forEach((row, i) => {
    const cx = padLeft + groupW * i + groupW / 2;
    const incomeH = (chartH * row.income) / max;
    const spentH = (chartH * row.spent) / max;
    svg += '<rect x="' + (cx - barW - 2).toFixed(1) + '" y="' + (padTop + chartH - incomeH).toFixed(1) + '" width="' + barW + '" height="' + incomeH.toFixed(1) + '" rx="3" class="chart-bar-income"/>';
    svg += '<rect x="' + (cx + 2).toFixed(1) + '" y="' + (padTop + chartH - spentH).toFixed(1) + '" width="' + barW + '" height="' + spentH.toFixed(1) + '" rx="3" class="chart-bar-spent"/>';
    svg += '<text x="' + cx.toFixed(1) + '" y="' + (height - 8) + '" class="chart-axis" text-anchor="middle">' + hearthEscape(row.month) + '</text>';
  });
  svg += '</svg>';
  return svg;
}

// Donut: one slice per category, with the biggest categories labelled.
function hearthDonut(slices, size) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 8;
  const inner = radius * 0.62;
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  let svg = '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Spending by category donut chart" class="chart-svg">';
  let angle = -Math.PI / 2;
  for (const slice of slices) {
    const frac = slice.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    if (frac <= 0) continue;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + radius * Math.cos(a0);
    const y0 = cy + radius * Math.sin(a0);
    const x1 = cx + radius * Math.cos(a1);
    const y1 = cy + radius * Math.sin(a1);
    const ix0 = cx + inner * Math.cos(a0);
    const iy0 = cy + inner * Math.sin(a0);
    const ix1 = cx + inner * Math.cos(a1);
    const iy1 = cy + inner * Math.sin(a1);
    svg += '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + radius + ' ' + radius + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
      ' L ' + ix1.toFixed(1) + ' ' + iy1.toFixed(1) + ' A ' + inner.toFixed(1) + ' ' + inner.toFixed(1) + ' 0 ' + large + ' 0 ' + ix0.toFixed(1) + ' ' + iy0.toFixed(1) +
      ' Z" fill="' + slice.color + '"/>';
  }
  svg += '<text x="' + cx + '" y="' + (cy - 6) + '" class="donut-center" text-anchor="middle">' + hearthMoneyShort(total) + '</text>';
  svg += '<text x="' + cx + '" y="' + (cy + 16) + '" class="donut-sub" text-anchor="middle">spent in Nov</text>';
  svg += '</svg>';
  return svg;
}

// A single progress ring for the savings rate (0–100%).
function hearthRing(pct, size) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const shown = Math.max(0, Math.min(100, pct));
  const off = circ * (1 - shown / 100);
  return '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Savings rate ' + shown + ' percent" class="chart-svg">' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-track"/>' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-fill" stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/>' +
    '<text x="' + size / 2 + '" y="' + (size / 2 - 2) + '" class="donut-center" text-anchor="middle">' + shown + '%</text>' +
    '<text x="' + size / 2 + '" y="' + (size / 2 + 18) + '" class="donut-sub" text-anchor="middle">saved</text>' +
    '</svg>';
}
