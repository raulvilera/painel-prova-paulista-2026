/* Jogo da Trilha SARESP (Fundamental, 6º ao 9º ano) — só para o professor, projetado em sala.
   GET /api/jogo            → lista de turmas
   GET /api/jogo?img=<id>   → foto livre (Wikimedia Commons, com crédito) de um conceito da rodada "Imagem e definição"
   GET /api/jogo?turma=…    → temas do SARESP da série da turma, com o peso de cada tema na turma e questões objetivas do banco
   O peso vem do plano de cada aluno derivado do painel (descritores com defasagem), somado por turma: só números agregados,
   nenhum nome de aluno sai daqui. Exige o login do professor (Bearer token do Supabase), porque as questões levam o gabarito. */
const LOGIN_URL = process.env.PAINEL_SUPABASE_URL || 'https://ykrjfjepnqeoqlgupsbe.supabase.co';
const LOGIN_KEY = process.env.PAINEL_SUPABASE_KEY || 'sb_publishable_FbMU5x7WBpxzHmmVzOfh2g_0M1xxAh5';
const PAINEL = require('./_plano-painel.js');
const CAT = require('./_catalogo-indiv.js');
const BANCO = require('./_banco-indiv.js');
const CONCEITOS = require('./_conceitos-jogo.js');
const { wikiImagem } = require('./_wiki-img.js');
/* fotos dos conceitos ficam guardadas no mesmo Supabase da atividade individual (tabela indiv_banco, chave jogoimg:<id>) */
const SB = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), SKEY = process.env.SUPABASE_SERVICE_KEY || '';
async function rest(path, opt) {
  const r = await fetch(SB + '/rest/v1/' + path, Object.assign({ headers: { apikey: SKEY, Authorization: 'Bearer ' + SKEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' } }, opt || {}));
  const t = await r.text(); if (!r.ok) throw new Error('Supabase ' + r.status);
  return t ? JSON.parse(t) : null;
}
const FOTOS = {};   // cache em memória enquanto a função estiver quente
async function fotoConceito(id) {
  const cc = CONCEITOS.find(x => x.id === id); if (!cc) return null;
  if (FOTOS[id]) return FOTOS[id];
  const chave = 'jogoimg:' + id + ':' + cc.wiki.join('|').length;
  if (SB && SKEY) {
    try { const r = await rest('indiv_banco?select=questoes&k=eq.' + encodeURIComponent(chave)); if (r && r[0] && r[0].questoes && r[0].questoes.dados) return (FOTOS[id] = r[0].questoes); } catch (e) { /* segue sem cache */ }
  }
  const why = [], img = await wikiImagem(cc.wiki, why);
  if (!img) return (FOTOS[id] = { semFoto: true });
  if (SB && SKEY) {
    try { await rest('indiv_banco?on_conflict=k', { method: 'POST', headers: { apikey: SKEY, Authorization: 'Bearer ' + SKEY, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ k: chave, questoes: img }) }); } catch (e) { /* sem cache */ }
  }
  return (FOTOS[id] = img);
}

const Q_POR_TEMA = 4;

async function professor(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (!m) return false;
  const r = await fetch(LOGIN_URL + '/auth/v1/user', { headers: { apikey: LOGIN_KEY, Authorization: 'Bearer ' + m[1] } });
  return r.ok;
}

const serieDe = t => { const m = /(\d)\s*º/.exec(String(t)); return m ? m[1] : ''; };

function dadosTurma(turma) {
  const T = PAINEL[turma]; if (!T) return null;
  const serie = serieDe(turma);
  const alunos = Object.keys(T), n = alunos.length || 1;
  // conta, por descritor, quantos alunos têm defasagem e o nível médio deles (0 = mais distante do esperado)
  const cont = {}, niv = {};
  alunos.forEach(a => (T[a] || []).forEach(([k, nv]) => { cont[k] = (cont[k] || 0) + 1; niv[k] = (niv[k] || 0) + (Number(nv) || 0); }));
  const temas = Object.keys(CAT).filter(k => CAT[k].serie === serie).map(k => {
    const c = CAT[k], qs = (BANCO[k] || []).filter(q => q.tipo === 'obj' && Array.isArray(q.alts) && Number.isInteger(q.correta)).slice(0, Q_POR_TEMA);
    return {
      k, bim: c.bim, hab: c.hab, desc: c.desc, nome: c.nome,
      defasagem: Math.round((cont[k] || 0) / n * 100),          // % de alunos da turma com defasagem neste tema
      nivelMedio: cont[k] ? Math.round(niv[k] / cont[k] * 10) / 10 : null,
      qs: qs.map(q => ({ enunciado: q.enunciado, comando: q.comando, figura: q.figura || null, svg: q.svg || '', alts: q.alts, correta: q.correta, explicacao: q.explicacao || '' }))
    };
  }).filter(t => t.qs.length);
  temas.sort((a, b) => a.bim.localeCompare(b.bim) || b.defasagem - a.defasagem);
  const conceitos = CONCEITOS.filter(x => x.serie === serie).map(x => {
    const t = temas.find(tt => tt.desc.includes(x.tema));
    return { id: x.id, nome: x.nome, emoji: x.emoji, def: x.def, k: t ? t.k : '', defasagem: t ? t.defasagem : 0 };
  });
  return { turma, serie, alunos: alunos.length, temas, conceitos };
}

/* Temas de estudo da turma para o Orbit Quiz (aberto aos alunos): só os conceitos de maior defasagem, sem nome de aluno e sem gabarito.
   O nome da turma vem da lista do Simulado ("7º Ano A"); procura a(s) turma(s) do painel com a mesma série e letra e junta os pesos. */
function estudo(nome) {
  const m = /(\d)\s*º\s*ANO\s*([A-Z])?/i.exec(String(nome).normalize('NFC')); if (!m) return null;
  const serie = m[1], letra = (m[2] || '').toUpperCase(), lydia = /lydia/i.test(nome);
  let chaves = Object.keys(PAINEL).filter(k => serieDe(k) === serie && (lydia || !letra || new RegExp('ANO ' + letra + ' ').test(k)));
  if (!chaves.length) chaves = Object.keys(PAINEL).filter(k => serieDe(k) === serie);
  if (!chaves.length) return null;
  const acc = {}; let alunos = 0;
  chaves.forEach(k => { const d = dadosTurma(k); alunos += d.alunos; d.conceitos.forEach(c => { const a = acc[c.id] = acc[c.id] || { id: c.id, nome: c.nome, emoji: c.emoji, def: c.def, soma: 0 }; a.soma += c.defasagem * d.alunos; }); });
  const lista = Object.values(acc).map(a => ({ nome: a.nome, emoji: a.emoji, def: a.def, defasagem: Math.round(a.soma / (alunos || 1)) }))
    .sort((a, b) => b.defasagem - a.defasagem).slice(0, 12);
  return { serie, conceitos: lista };
}

/* Trilha SARESP para os alunos (aberta): dados da turma pelo nome usado no Orbit/Simulado ("7º Ano A"); escolhe a turma do painel de mesma série/letra com mais alunos. */
function dadosAluno(nome) {
  const m = /(\d)\s*º\s*ANO\s*([A-Z])?/i.exec(String(nome).normalize('NFC')); if (!m) return null;
  const serie = m[1], letra = (m[2] || '').toUpperCase(), lydia = /lydia/i.test(nome);
  let ch = Object.keys(PAINEL).filter(k => serieDe(k) === serie && (lydia || !letra || new RegExp('ANO ' + letra + ' ').test(k)));
  if (!ch.length) ch = Object.keys(PAINEL).filter(k => serieDe(k) === serie);
  if (!ch.length) return null;
  ch.sort((a, b) => Object.keys(PAINEL[b]).length - Object.keys(PAINEL[a]).length);
  const d = dadosTurma(ch[0]); d.turma = String(nome); return d;
}

module.exports = async function jogo(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const out = (c, v) => res.status(c).json(v);
  try {
    if (req.method !== 'GET') return out(405, { ok: false, erro: 'Use GET.' });
    const est = String((req.query && req.query.estudo) || '').trim();
    if (est) { const e = estudo(est); if (!e) return out(404, { ok: false, erro: 'Turma não encontrada.' }); res.setHeader('Cache-Control', 'public, max-age=300'); return out(200, Object.assign({ ok: true }, e)); }
    const nomesT = String((req.query && req.query.nomes) || '').trim();   // lista de nomes da turma (Trilha): o servidor busca na planilha, com cache
    if (nomesT) {
      try {
        const ac = new AbortController(), tm = setTimeout(() => ac.abort(), 20000);
        const r = await fetch('https://script.google.com/macros/s/AKfycbwUe0WBN_I1u6wDN4OoYJdKuycu_dupRvY-GzoHPNZhL2ft3KpSK7odGF0amqn7Yc7P/exec?' + new URLSearchParams({ api: 'alunos', id: nomesT }), { redirect: 'follow', signal: ac.signal }).finally(() => clearTimeout(tm));
        const j = await r.json(); if (!j || !j.ok) return out(502, { ok: false, erro: (j && j.erro) || 'Planilha indisponível.' });
        res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
        return out(200, { ok: true, alunos: (j.alunos || []).map(a => ({ nome: a.nome })).filter(a => a.nome) });
      } catch (e) { return out(502, { ok: false, erro: 'Planilha indisponível.' }); }
    }
    const tri = String((req.query && req.query.trilha) || '').trim();
    if (tri) { const d = dadosAluno(tri); if (!d) return out(404, { ok: false, erro: 'Turma não encontrada.' }); res.setHeader('Cache-Control', 'public, max-age=120'); return out(200, Object.assign({ ok: true }, d)); }
    const foto = String((req.query && req.query.foto) || '').trim();
    if (foto) {
      const f = await fotoConceito(foto);
      if (!f) return out(404, { ok: false, erro: 'Conceito não encontrado.' });
      if (f.semFoto) return out(200, { ok: true, semFoto: true });
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return out(200, { ok: true, mime: f.mime, dados: f.dados, credito: f.credito, fonte: f.fonte });
    }
    if (!(await professor(req))) return out(401, { ok: false, erro: 'Entre primeiro no painel com o seu login de professor.' });
    const img = String((req.query && req.query.img) || '').trim();
    if (img) {
      const f = await fotoConceito(img);
      if (!f) return out(404, { ok: false, erro: 'Conceito não encontrado.' });
      if (f.semFoto) return out(200, { ok: true, semFoto: true });
      res.setHeader('Cache-Control', 'private, max-age=86400');
      return out(200, { ok: true, mime: f.mime, dados: f.dados, credito: f.credito, fonte: f.fonte });
    }
    const turma = String((req.query && req.query.turma) || '').trim();
    if (!turma) return out(200, { ok: true, turmas: Object.keys(PAINEL).sort((a, b) => a.localeCompare(b, 'pt')) });
    const d = dadosTurma(turma);
    if (!d) return out(404, { ok: false, erro: 'Turma não encontrada.' });
    return out(200, Object.assign({ ok: true }, d));
  } catch (e) {
    return out(500, { ok: false, erro: 'Não foi possível montar o jogo.' });
  }
};
module.exports.dadosTurma = dadosTurma;
module.exports.estudo = estudo;
module.exports.dadosAluno = dadosAluno;
