/* Aula online de 30 min — individualizada pelo desempenho nas três últimas Provas Paulistas (plano do painel). */
const CAT = require('./_catalogo-indiv.js');
const PAINEL = require('./_plano-painel.js');
const ROSTER = require('./_roster.js');
const IMG = require('./_aula30-img.js');
let RU = require('./_aula30-ru.js');
let QFOTO = {}; try { QFOTO = require('./_aula30-qfoto.js'); } catch (e) { QFOTO = {}; }
let DIMG = {}; try { DIMG = require('./_aula30-dimg.js'); } catch (e) { DIMG = {}; }
let QIMG = {}; try { QIMG = require('./_aula30-qimg.js'); } catch (e) { QIMG = {}; }
const crypto = require('crypto');
const SB = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), KEY = process.env.SUPABASE_SERVICE_KEY || '';
const LOGIN_URL = process.env.PAINEL_SUPABASE_URL || 'https://ykrjfjepnqeoqlgupsbe.supabase.co', LOGIN_KEY = process.env.PAINEL_SUPABASE_KEY || 'sb_publishable_FbMU5x7WBpxzHmmVzOfh2g_0M1xxAh5';
async function rest(path, opt) {
  const r = await fetch(SB + '/rest/v1/' + path, Object.assign({ headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' } }, opt || {}));
  const t = await r.text(); if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + t.slice(0, 160));
  return t ? JSON.parse(t) : [];
}
async function professor(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (!m) return false;
  const r = await fetch(LOGIN_URL + '/auth/v1/user', { headers: { apikey: LOGIN_KEY, Authorization: 'Bearer ' + m[1] } });
  return r.ok;
}
let BANCO = {}; try { BANCO = require('./_banco-indiv.js'); } catch (e) { BANCO = {}; }

const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
const ESC = { 0: { ob: [0, 1], db: [0] }, 1: { ob: [1, 2, 3], db: [1, 2] }, 2: { ob: [2, 3, 4], db: [2, 3] }, 3: { ob: [3, 4], db: [3, 4] } };
const NIVEL = {
  0: { nome: 'Construção guiada', estrategia: 'Do concreto ao abstrato: observar a imagem, resolver com apoio e montar a explicação com um banco de palavras.' },
  1: { nome: 'Passo a passo', estrategia: 'Explicar com as próprias palavras, com uma dica à disposição e conferência da explicação por tópicos.' },
  2: { nome: 'Aprofundamento', estrategia: 'Justificar sem apoio: explicar o raciocínio e conferir, ponto a ponto, o que faltou.' },
  3: { nome: 'Desafio', estrategia: 'Argumentar e transferir: explicar com precisão e depois ensinar a ideia a um colega.' }
};
const BLOCOS = 5, MIN_TOTAL = 30;
const serie = t => { const m = /^(\d)/.exec(String(t || '')); return m ? m[1] : ''; };
const pick = (arr, lista, h) => { const L = lista.filter(i => arr[i]); return L.length ? arr[L[h % L.length]] : null; };

function achaAluno(turma, nome) {
  const T = PAINEL[turma]; if (!T) return null;
  const n = Object.keys(T).find(x => norm(x) === norm(nome)); return n ? { nome: n, itens: T[n] } : null;
}
function frequentes(turma) {
  const f = {}; Object.values(PAINEL[turma] || {}).forEach(its => its.forEach(([k]) => { f[k] = (f[k] || 0) + 1; }));
  return Object.keys(f).sort((a, b) => f[b] - f[a]);
}
function montar(turma, nome) {
  const al = achaAluno(turma, nome);
  let itens = al ? al.itens.filter(([k]) => CAT[k] && BANCO[k]).map(([k, v]) => ({ k, niv: Math.max(0, Math.min(3, Number(v) || 0)) })) : [];
  const perfil = !!al; const base = al ? itens.length : 0;
  itens.sort((a, b) => a.niv - b.niv);
  itens = itens.slice(0, BLOCOS);
  const tem = new Set(itens.map(i => i.k));
  for (const k of frequentes(turma)) { if (itens.length >= BLOCOS) break; if (!tem.has(k) && CAT[k] && BANCO[k]) { itens.push({ k, niv: al ? 3 : 1, extra: true }); tem.add(k); } }
  const min = Math.floor(MIN_TOTAL / Math.max(1, itens.length));
  const blocos = itens.map((it, idx) => {
    const c = CAT[it.k], Q = BANCO[it.k], e = ESC[it.niv];
    const objs = Q.filter(q => q.tipo === 'obj'), dis = Q.filter(q => q.tipo === 'dis');
    const h = parseInt(crypto.createHash('sha1').update(norm(nome) + '|' + it.k).digest('hex').slice(0, 6), 16);
    const tier = it.niv <= 1 ? 'A' : 'B', oi = tier === 'A' ? 1 : 3, o = objs[oi] || pick(objs, e.ob, h), d = dis[tier === 'A' ? 1 : 3] || pick(dis, e.db, h + 1);
    return {
      k: it.k, n: idx + 1, niv: it.niv, extra: !!it.extra, min, tema: c.nome, desc: c.desc, hab: c.hab, habTxt: c.habTxt,
      tier, dimg: DIMG[it.k + '|' + tier] ? 'img/d/' + DIMG[it.k + '|' + tier] + '.png' : '', qfoto: QFOTO[it.k + '|' + tier] || null, qimg: QIMG[it.k + '|' + tier] ? 'img/q/' + QIMG[it.k + '|' + tier] + '.png' : '', analogia: c.concreta || '', img: IMG[it.k] ? 'img/' + IMG[it.k] + '.png' : '', obj: o, dis: d
    };
  }).filter(b => b.obj && b.dis);
  const out = { aluno: al ? al.nome : nome, perfil, temas: base, minutos: MIN_TOTAL, niveis: NIVEL, blocos };
  if (RU.alunos.some(x => norm(x) === norm(nome))) {
    out.lang = 'ru'; out.saudacao = RU.saudacao; out.niveis = RU.niveis;
    out.blocos = blocos.map(b => {
      const c = RU.conteudo[b.k]; if (!c) return b;
      return Object.assign({}, b, { tema: c.tema, desc: c.desc, habTxt: c.habTxt, analogia: c.analogia, obj: Object.assign({}, b.obj, c.obj, { svg: null }), dis: Object.assign({}, b.dis, c.dis, { svg: null }) });
    });
  }
  return out;
}

module.exports = async function aula30(req, res) {
  res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const q = req.query || {}, acao = String(q.acao || ''), ok = o => res.status(200).json(Object.assign({ ok: true }, o)), er = (c, m) => res.status(c).json({ ok: false, erro: m });
  try {
    if (req.method === 'POST') {   // o aluno envia o resultado ao concluir a aula
      let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } } b = b || {};
      if (b.acao !== 'enviar') return er(400, 'Ação inválida.');
      if (!SB || !KEY) return er(503, 'Banco não configurado.');
      const t = String(b.turma || ''), al = achaAluno(t, String(b.nome || ''));
      const ro = ROSTER.da(t), nome = al ? al.nome : ((ro || []).find(x => norm(x.nome) === norm(b.nome)) || {}).nome || (Object.keys(PAINEL[t] || {}).find(x => norm(x) === norm(b.nome)));
      if (!PAINEL[t] || !nome) return er(400, 'Aluno não encontrado.');
      const bl = (Array.isArray(b.blocos) ? b.blocos : []).slice(0, 8).filter(x => x && CAT[x.k]).map(x => ({
        k: x.k, tema: CAT[x.k].nome, desc: CAT[x.k].desc, hab: CAT[x.k].hab, niv: Math.max(0, Math.min(3, Number(x.niv) || 0)),
        obj: [0, 0.5, 1].includes(Number(x.obj)) ? Number(x.obj) : 0, conf: Math.max(0, Math.min(1, Number(x.conf) || 0))
      }));
      if (!bl.length) return er(400, 'Nada para gravar.');
      await rest('aula30_resultados', { method: 'POST', body: JSON.stringify({ turma: t, nome, minutos: Math.max(0, Math.min(99, Math.round(Number(b.minutos) || 0))), blocos: bl }) });
      return ok({ gravado: true });
    }
    if (req.method !== 'GET') { res.setHeader('Allow', 'GET, POST'); return er(405, 'Use GET ou POST.'); }
    if (acao === 'relatorio') {   // só o professor
      if (!SB || !KEY) return er(503, 'Banco não configurado.');
      if (!(await professor(req))) return er(401, 'Entre primeiro no painel com o seu login de professor.');
      const rows = await rest('aula30_resultados?select=id,criado,turma,nome,minutos,blocos&order=criado.asc&limit=5000');
      const roster = {}; Object.keys(PAINEL).forEach(t => { roster[t] = Object.keys(PAINEL[t]); });
      return ok({ rows, roster });
    }
    if (acao === 'turmas') {
      const a = String(q.ano || ''); const t = Object.keys(PAINEL).filter(x => serie(x) === a).sort((x, y) => x.localeCompare(y, 'pt'));
      return ok({ turmas: t });
    }
    if (acao === 'nomes') {
      const t = String(q.turma || ''); if (!PAINEL[t]) return er(404, 'Turma não encontrada.');
      const nm = Object.keys(PAINEL[t]); const ro = ROSTER.da(t); if (ro) ro.forEach(x => { if (!nm.some(y => norm(y) === norm(x.nome))) nm.push(x.nome); });
      return ok({ nomes: nm.sort((x, y) => x.localeCompare(y, 'pt')) });
    }
    if (acao === 'aula') {
      const t = String(q.turma || ''), n = String(q.nome || ''); if (!PAINEL[t] || !n) return er(400, 'Informe turma e nome.');
      const a = montar(t, n); if (!a.blocos.length) return er(404, 'Sem conteúdo para esta turma.');
      if (a.lang === 'ru' && Number(q.cv) < 5) return er(409, 'Recarregue a página para continuar · Перезагрузите страницу (обновите её), чтобы продолжить.');
      return ok({ aula: a });
    }
    return er(400, 'Ação inválida.');
  } catch (e) { return er(500, 'Falha: ' + String(e.message || e).slice(0, 120)); }
};
