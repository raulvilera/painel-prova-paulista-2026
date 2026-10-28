/* Biblioteca de desenho das ilustrações autorais do Ensino Médio (SVG 760×340). Uso: node tools/gerar-ilustracoes-em.js */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const TH = {
  bio: { head: '#1f6f4a', sub: '#d8efe2', bg: '#eef6f1', card: '#ffffff', line: '#b9d3c3', ink: '#25402f', mute: '#5d7a69' },
  qui: { head: '#2c5f8a', sub: '#d6e6f4', bg: '#eef4fa', card: '#ffffff', line: '#b4cadf', ink: '#1f3347', mute: '#5a7186' }
};
const COR = { v: '#2e8b57', l: '#e07b39', a: '#3b82c4', r: '#c0392b', p: '#8e5bb5', y: '#e0b64a', c: '#9aa5ab', k: '#37474f', t: '#17a2a2', m: '#a0522d' };
const fmt = n => String(n).replace('.', ',');

class Fig {
  constructor(id, tema, title, sub, desc) { this.id = id; this.t = TH[tema]; this.title = title; this.sub = sub; this.desc = desc; this.p = []; this.uid = 0; }
  add(...s) { this.p.push(...s); return this; }
  nid() { return 'g' + (++this.uid); }
  text(x, y, s, o = {}) {
    const { size = 14, w = 400, fill = this.t.ink, anchor = 'start', rot, it } = o;
    const tr = rot ? ` transform="rotate(${rot} ${x} ${y})"` : '';
    return this.add(`<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}"${it ? ' font-style="italic"' : ''}${tr}>${esc(s)}</text>`);
  }
  /* texto com quebra automática (largura aproximada por caractere) */
  para(x, y, s, max, o = {}) {
    const { size = 13, lh = size + 4, anchor = 'start' } = o; const words = String(s).split(' '); let line = '', yy = y;
    for (const w of words) { if ((line + ' ' + w).trim().length > max) { this.text(x, yy, line, { ...o, size }); yy += lh; line = w; } else line = (line + ' ' + w).trim(); }
    if (line) this.text(x, yy, line, { ...o, size }); return yy;
  }
  rect(x, y, w, h, o = {}) { const { fill = '#fff', stroke = 'none', sw = 1, r = 0, op } = o; return this.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${op ? ` opacity="${op}"` : ''}/>`); }
  line(x1, y1, x2, y2, o = {}) { const { stroke = this.t.ink, sw = 2, dash, cap = 'round' } = o; return this.add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="${cap}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`); }
  circle(x, y, r, o = {}) { const { fill = '#fff', stroke = 'none', sw = 1, op } = o; return this.add(`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${op ? ` opacity="${op}"` : ''}/>`); }
  path(d, o = {}) { const { fill = 'none', stroke = this.t.ink, sw = 2, op, join = 'round', dash } = o; return this.add(`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="${join}" stroke-linecap="round"${op ? ` opacity="${op}"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`); }
  card(x, y, w, h, titulo) { this.rect(x, y, w, h, { fill: this.t.card, stroke: this.t.line, sw: 2, r: 12 }); if (titulo) this.text(x + 14, y + 22, titulo, { size: 13, w: 700, fill: this.t.mute }); return this; }
  arrow(x1, y1, x2, y2, o = {}) {
    const { stroke = this.t.ink, sw = 2.5 } = o, a = Math.atan2(y2 - y1, x2 - x1), L = 10;
    this.line(x1, y1, x2, y2, { stroke, sw });
    return this.add(`<path d="M${x2} ${y2} L${x2 - L * Math.cos(a - 0.45)} ${y2 - L * Math.sin(a - 0.45)} L${x2 - L * Math.cos(a + 0.45)} ${y2 - L * Math.sin(a + 0.45)} Z" fill="${stroke}"/>`);
  }
  /* barras horizontais: items [{label, v, c, txt}] */
  hbars(x, y, w, items, o = {}) {
    const { rowH = 34, labelW = 150, max = Math.max(...items.map(i => i.v)), unit = '', size = 13 } = o, bw = w - labelW - 70;
    items.forEach((it, i) => {
      const yy = y + i * rowH, len = Math.max(2, it.v / max * bw);
      this.text(x + labelW - 8, yy + rowH / 2 + 4, it.label, { size, anchor: 'end' });
      this.rect(x + labelW, yy + 5, len, rowH - 12, { fill: it.c || COR.v, r: 4 });
      this.text(x + labelW + len + 6, yy + rowH / 2 + 4, it.txt || (fmt(it.v) + unit), { size, w: 700 });
    });
    return this;
  }
  /* barras verticais agrupadas: groups [{label, bars:[{v,c,txt}]}] */
  vbars(x, y, w, h, groups, o = {}) {
    const { max = Math.max(...groups.flatMap(g => g.bars.map(b => b.v))), ticks = 4, unit = '', size = 12, base = 0, tickFmt } = o;
    this.line(x, y + h, x + w, y + h, { stroke: this.t.mute, sw: 1.5 });
    for (let k = 0; k <= ticks; k++) { const v = base + (max - base) * k / ticks, yy = y + h - h * k / ticks; this.line(x, yy, x + w, yy, { stroke: '#e3ebe6', sw: 1 }); this.text(x - 6, yy + 4, tickFmt ? tickFmt(v) : fmt(Math.round(v * 10) / 10), { size: 11, anchor: 'end', fill: this.t.mute }); }
    const gw = w / groups.length;
    groups.forEach((g, i) => {
      const n = g.bars.length, bw = Math.min(46, (gw - 22) / n), x0 = x + i * gw + (gw - bw * n) / 2;
      g.bars.forEach((b, j) => { const bh = Math.max(1.5, (b.v - base) / (max - base) * h); this.rect(x0 + j * bw + 2, y + h - bh, bw - 4, bh, { fill: b.c || COR.v, r: 3 }); this.text(x0 + j * bw + bw / 2, y + h - bh - 5, b.txt || (fmt(b.v) + unit), { size: 11, w: 700, anchor: 'middle' }); });
      this.text(x + i * gw + gw / 2, y + h + 17, g.label, { size, anchor: 'middle' });
    });
    return this;
  }
  /* legenda horizontal: [{c,label}] */
  legend(x, y, items, o = {}) { let xx = x; items.forEach(it => { this.rect(xx, y - 10, 12, 12, { fill: it.c, r: 3 }); this.text(xx + 17, y, it.label, { size: o.size || 12 }); xx += 28 + it.label.length * (o.cw || 6.4); }); return this; }
  /* gráfico de linhas: series [{pts:[[x,y]],c,label}], escala linear entre xmin..xmax e ymin..ymax */
  lines(x, y, w, h, series, o = {}) {
    const { xmin, xmax, ymin = 0, ymax, xt = [], yt = [], xl = '', yl = '' } = o, X = v => x + (v - xmin) / (xmax - xmin) * w, Y = v => y + h - (v - ymin) / (ymax - ymin) * h;
    this.line(x, y + h, x + w, y + h, { stroke: this.t.mute, sw: 1.5 }); this.line(x, y, x, y + h, { stroke: this.t.mute, sw: 1.5 });
    yt.forEach(v => { this.line(x, Y(v), x + w, Y(v), { stroke: '#e3ebe6', sw: 1 }); this.text(x - 6, Y(v) + 4, fmt(v), { size: 11, anchor: 'end', fill: this.t.mute }); });
    xt.forEach(v => { this.text(X(v), y + h + 16, fmt(v), { size: 11, anchor: 'middle', fill: this.t.mute }); });
    if (xl) this.text(x + w / 2, y + h + 34, xl, { size: 12, anchor: 'middle', fill: this.t.mute });
    if (yl) this.text(x - 38, y + h / 2, yl, { size: 12, anchor: 'middle', fill: this.t.mute, rot: -90 });
    series.forEach(s => { this.path('M' + s.pts.map(p => X(p[0]) + ' ' + Y(p[1])).join(' L'), { stroke: s.c, sw: 3 }); s.pts.forEach(p => this.circle(X(p[0]), Y(p[1]), 4.5, { fill: s.c, stroke: '#fff', sw: 1.5 })); });
    return this;
  }
  /* cabeçalho + moldura */
  svg() {
    const t = this.t;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 340" role="img" font-family="Segoe UI,Arial,sans-serif">\n<title>${esc(this.title)}</title>\n<desc>${esc(this.desc || this.title)}</desc>\n<rect width="760" height="340" fill="${t.bg}"/>\n` +
      `<rect x="10" y="8" width="740" height="50" rx="12" fill="${t.head}"/><text x="28" y="31" font-size="19" font-weight="700" fill="#fff">${esc(this.title)}</text><text x="28" y="49" font-size="12.5" fill="${t.sub}">${esc(this.sub || '')}</text>\n` +
      this.p.join('\n') + '\n</svg>\n';
  }
}

/* ---------- desenhos reutilizáveis (retornam via f.add) ---------- */
const D = {
  becker(f, x, y, w, h, liq, o = {}) { // béquer com líquido; (x,y) canto sup. esquerdo
    const { nivel = 0.6, label } = o; const ly = y + h * (1 - nivel);
    f.rect(x + 2, ly, w - 4, y + h - ly - 2, { fill: liq, op: .75 });
    f.path(`M${x} ${y} V${y + h - 8} Q${x} ${y + h} ${x + 8} ${y + h} H${x + w - 8} Q${x + w} ${y + h} ${x + w} ${y + h - 8} V${y}`, { stroke: '#546e7a', sw: 3 });
    if (label) f.text(x + w / 2, y + h + 18, label, { size: 13, w: 700, anchor: 'middle' });
  },
  bateria(f, x, y, w, h, o = {}) { // pilha cilíndrica horizontal com polo +
    const { c = '#37474f', label } = o; f.rect(x, y, w, h, { fill: '#fff', stroke: c, sw: 3, r: 8 }); f.rect(x + w, y + h * .3, 9, h * .4, { fill: c, r: 2 });
    f.rect(x + 8, y + 8, w * .45, h - 16, { fill: '#7bc47f', r: 4 }); f.text(x + w - 18, y + h / 2 + 6, '+', { size: 20, w: 700, fill: c, anchor: 'middle' });
    if (label) f.text(x + w / 2, y + h + 18, label, { size: 12.5, anchor: 'middle' });
  },
  gota(f, x, y, s, c) { f.path(`M${x} ${y - s} C${x + s * .9} ${y - s * .1} ${x + s * .7} ${y + s * .8} ${x} ${y + s * .8} C${x - s * .7} ${y + s * .8} ${x - s * .9} ${y - s * .1} ${x} ${y - s}Z`, { fill: c, stroke: 'none' }); },
  atomo(f, x, y, r, c, label, tc = '#fff') { f.circle(x, y, r, { fill: c, stroke: 'rgba(0,0,0,.25)', sw: 1.5 }); if (label) f.text(x, y + r * .35, label, { size: Math.max(11, r * .95), w: 700, fill: tc, anchor: 'middle' }); },
  predio(f, x, y, w, h, c) { f.rect(x, y, w, h, { fill: c, r: 3 }); for (let i = 0; i < Math.floor(h / 22); i++) for (let j = 0; j < Math.floor(w / 18); j++) f.rect(x + 6 + j * 18, y + 8 + i * 22, 9, 11, { fill: 'rgba(255,255,255,.55)', r: 1 }); },
  casa(f, x, y, s, c, o = {}) { f.rect(x, y, s, s * .6, { fill: c, r: 2 }); f.path(`M${x - 4} ${y} L${x + s / 2} ${y - s * .42} L${x + s + 4} ${y}Z`, { fill: o.roof || '#a0522d', stroke: 'none' }); f.rect(x + s * .4, y + s * .22, s * .2, s * .38, { fill: 'rgba(255,255,255,.7)', r: 1 }); },
  torneira(f, x, y, c = '#546e7a', agua = true) { f.path(`M${x} ${y} h26 q10 0 10 10 v8`, { stroke: c, sw: 6 }); if (agua) { this.gota(f, x + 36, y + 30, 6, '#5aa9e6'); this.gota(f, x + 36, y + 48, 5, '#5aa9e6'); } },
  celula(f, x, y, rx, ry, c, nucleo = true) { f.add(`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>`); if (nucleo) f.circle(x + rx * .1, y, Math.min(rx, ry) * .42, { fill: 'rgba(0,0,0,.25)' }); },
  frasco(f, x, y, w, h, liq, o = {}) { // erlenmeyer
    const { label, nivel = .55 } = o; const nx = w * .3; f.path(`M${x + nx} ${y} V${y + h * .35} L${x} ${y + h - 6} Q${x - 2} ${y + h} ${x + 8} ${y + h} H${x + w - 8} Q${x + w + 2} ${y + h} ${x + w} ${y + h - 6} L${x + w - nx} ${y + h * .35} V${y}`, { stroke: '#546e7a', sw: 3, fill: 'rgba(255,255,255,.6)' });
    const ly = y + h * (1 - nivel), k = (ly - (y + h * .35)) / (h * .65 - 6), ex = Math.max(0, k) * (w / 2 - nx);
    f.path(`M${x + nx - ex} ${ly} H${x + w - nx + ex} L${x + w - 5} ${y + h - 6} Q${x + w + 1} ${y + h - 2} ${x + w - 8} ${y + h - 2} H${x + 8} Q${x - 1} ${y + h - 2} ${x + 5} ${y + h - 6}Z`, { fill: liq, stroke: 'none', op: .8 });
    if (label) f.text(x + w / 2, y + h + 18, label, { size: 13, w: 700, anchor: 'middle' });
  },
  tubo(f, x, y, w, h, liq, nivel = .7) { f.path(`M${x} ${y} V${y + h - w / 2} A${w / 2} ${w / 2} 0 0 0 ${x + w} ${y + h - w / 2} V${y}`, { stroke: '#546e7a', sw: 3 }); const ly = y + h * (1 - nivel); f.path(`M${x + 1.5} ${ly} V${y + h - w / 2} A${w / 2 - 1.5} ${w / 2 - 1.5} 0 0 0 ${x + w - 1.5} ${y + h - w / 2} V${ly}Z`, { fill: liq, stroke: 'none', op: .85 }); },
  helice(f, x, y, h, c1 = '#2e8b57', c2 = '#e07b39') { // trecho de DNA vertical
    const n = 7; for (let i = 0; i < n; i++) { const yy = y + i * h / (n - 1), dx = 22 * Math.cos(i * 0.95); f.line(x - dx, yy, x + dx, yy, { stroke: '#9aa5ab', sw: 3 }); f.circle(x - dx, yy, 5.5, { fill: c1 }); f.circle(x + dx, yy, 5.5, { fill: c2 }); }
  }
};
module.exports = { Fig, D, COR, TH, esc, fmt };
