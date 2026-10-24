/* Foto livre da Wikipédia/Wikimedia Commons para um conceito (mesma regra da atividade individual):
   imagem de abertura do artigo, só com licença livre (CC0, CC BY, CC BY-SA, domínio público) e sempre com crédito.
   Cópia isolada das funções de api/individual.js para não mexer na atividade dos alunos. */
const enc = encodeURIComponent;
const UA = { 'User-Agent': 'PainelProvaPaulista/1.0 (escola; contato: raulvilera@gmail.com)' };
const semHtml = h => String(h || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 90);
const JSONF = async u => { const r = await fetch(u, { headers: UA }); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); };
const IMG_RUIM = /flag|bandeira|brasao|coat[_ ]of|escudo|logo|icon|symbol|simbolo|locator|location|mapa|[_-]map[_.-]/i;

async function baixarArquivo(src, rotulo, why) {
  let pth; try { pth = new URL(src).pathname.split('/').filter(Boolean); } catch (e) { why.push(rotulo + ': url inválida'); return null; }
  const arq = decodeURIComponent(pth.includes('thumb') ? pth[pth.length - 2] : pth[pth.length - 1] || ''); if (!arq) { why.push(rotulo + ': sem nome de arquivo'); return null; }
  const md = (((await JSONF('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=' + enc('File:' + arq))).query || {}).pages || {});
  const ii = (Object.values(md)[0] || {}).imageinfo, ex = (ii && ii[0] && ii[0].extmetadata) || {}, lic = semHtml(ex.LicenseShortName && ex.LicenseShortName.value);
  if (!lic) { why.push(rotulo + ': fora do Commons'); return null; }
  if (!/^(CC0|CC[ -]BY|Public domain|PD)/i.test(lic) || /\b(NC|ND)\b/i.test(lic)) { why.push(rotulo + ': licença ' + lic); return null; }
  const url = src.replace(/\/(\d+)px-/, '/480px-');
  let r = await fetch(url, { headers: UA }); if (!r.ok) r = await fetch(src, { headers: UA }); if (!r.ok) { why.push(rotulo + ': download HTTP ' + r.status); return null; }
  const mime = (r.headers.get('content-type') || '').split(';')[0]; if (!/^image\/(jpeg|png|webp)$/.test(mime)) { why.push(rotulo + ': tipo ' + mime); return null; }
  const buf = Buffer.from(await r.arrayBuffer()); if (buf.length < 3000 || buf.length > 900000) { why.push(rotulo + ': tamanho ' + buf.length); return null; }
  return { mime, dados: buf.toString('base64'), credito: 'Foto: ' + (semHtml(ex.Artist && ex.Artist.value) || 'autor desconhecido') + ' · ' + lic + ' · Wikimedia Commons', fonte: 'https://commons.wikimedia.org/wiki/File:' + enc(arq) };
}

/* candidatos no formato 'en:Título'; tenta antes a versão em português do mesmo artigo */
async function comPortugues(cands) {
  const out = [];
  for (const c of cands) {
    const i = c.indexOf(':'), lang = c.slice(0, i), titulo = c.slice(i + 1);
    if (lang === 'en') {
      try {
        const j = await JSONF('https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=langlinks&lllang=pt&titles=' + enc(titulo));
        const pg = Object.values((j.query && j.query.pages) || {})[0], pt = pg && pg.langlinks && pg.langlinks[0] && (pg.langlinks[0]['*'] || pg.langlinks[0].title);
        if (pt) out.push('pt:' + pt);
      } catch (e) { /* segue com o original */ }
    }
    out.push(c);
  }
  return [...new Set(out)];
}

async function wikiImagem(cands0, why) {
  const cands = await comPortugues(cands0);
  for (const c of cands) {
    try {
      const i = c.indexOf(':'), lang = c.slice(0, i), titulo = c.slice(i + 1);
      const sm = await JSONF('https://' + lang + '.wikipedia.org/api/rest_v1/page/summary/' + enc(titulo.replace(/ /g, '_')) + '?redirect=true');
      const src = (sm.thumbnail && sm.thumbnail.source) || (sm.originalimage && sm.originalimage.source) || '';
      if (!src) { why.push(c + ': sem imagem'); continue; }
      if (IMG_RUIM.test(decodeURIComponent(src))) { why.push(c + ': imagem descartada'); continue; }
      const img = await baixarArquivo(src, c, why); if (img) return img;
    } catch (e) { why.push(c + ': ' + String(e.message || e).slice(0, 50)); }
  }
  return null;
}

module.exports = { wikiImagem };
