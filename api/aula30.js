/* Aula online de 30 min — individualizada pelo desempenho nas três últimas Provas Paulistas (plano do painel). */
const CAT = require('./_catalogo-indiv.js');
const PAINEL = require('./_plano-painel.js');
const ROSTER = require('./_roster.js');
const IMG = require('./_aula30-img.js');
const crypto = require('crypto');
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
    const o = pick(objs, e.ob, h), d = pick(dis, e.db, h + 1);
    return {
      k: it.k, n: idx + 1, niv: it.niv, extra: !!it.extra, min, tema: c.nome, desc: c.desc, hab: c.hab, habTxt: c.habTxt,
      analogia: c.concreta || '', img: IMG[it.k] ? 'img/' + IMG[it.k] + '.png' : '', obj: o, dis: d
    };
  }).filter(b => b.obj && b.dis);
  return { aluno: al ? al.nome : nome, perfil, temas: base, minutos: MIN_TOTAL, niveis: NIVEL, blocos };
}

module.exports = function aula30(req, res) {
  res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ ok: false, erro: 'Use GET.' }); }
  const q = req.query || {}, acao = String(q.acao || ''), ok = o => res.status(200).json(Object.assign({ ok: true }, o));
  try {
    if (acao === 'turmas') {
      const a = String(q.ano || ''); const t = Object.keys(PAINEL).filter(x => serie(x) === a).sort((x, y) => x.localeCompare(y, 'pt'));
      return ok({ turmas: t });
    }
    if (acao === 'nomes') {
      const t = String(q.turma || ''); if (!PAINEL[t]) return res.status(404).json({ ok: false, erro: 'Turma não encontrada.' });
      const nm = Object.keys(PAINEL[t]); const ro = ROSTER.da(t); if (ro) ro.forEach(x => { if (!nm.some(y => norm(y) === norm(x.nome))) nm.push(x.nome); });
      return ok({ nomes: nm.sort((x, y) => x.localeCompare(y, 'pt')) });
    }
    if (acao === 'aula') {
      const t = String(q.turma || ''), n = String(q.nome || ''); if (!PAINEL[t] || !n) return res.status(400).json({ ok: false, erro: 'Informe turma e nome.' });
      const a = montar(t, n); if (!a.blocos.length) return res.status(404).json({ ok: false, erro: 'Sem conteúdo para esta turma.' });
      return ok({ aula: a });
    }
    return res.status(400).json({ ok: false, erro: 'Ação inválida.' });
  } catch (e) { return res.status(500).json({ ok: false, erro: 'Falha ao montar a aula.' }); }
};
