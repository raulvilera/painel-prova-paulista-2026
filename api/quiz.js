/* Quiz ao vivo da plataforma (estilo Kahoot), lado do professor. Exige o login do professor (Bearer token do Supabase do painel).
   GET  /api/quiz?turmas=1         → turmas do Fundamental
   GET  /api/quiz?historico=1      → partidas anteriores
   GET  /api/quiz?sessao=<id>      → estado ao vivo: pergunta atual (com gabarito), jogadores, respostas e relatório
   POST {acao:'criar', turma, n, tempo}         → cria a partida e devolve o PIN
   POST {acao:'liberar'|'mostrar'|'encerrar', id} → controla a partida
   POST {acao:'remover', id, jogador}           → tira um aluno (ele pode entrar de novo)
   Os alunos usam as funções quiz_* do Supabase (PIN + token), que nunca devolvem o gabarito antes da hora.
   Variáveis da Vercel: SUPABASE_URL, SUPABASE_SERVICE_KEY (as mesmas da atividade individual). */
const LOGIN_URL = process.env.PAINEL_SUPABASE_URL || 'https://ykrjfjepnqeoqlgupsbe.supabase.co';
const LOGIN_KEY = process.env.PAINEL_SUPABASE_KEY || 'sb_publishable_FbMU5x7WBpxzHmmVzOfh2g_0M1xxAh5';
const SB = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), KEY = process.env.SUPABASE_SERVICE_KEY || '';
const PAINEL = require('./_plano-painel.js');
const ROSTER = require('./_roster.js');
const { dadosTurma } = require('./jogo.js');
const enc = encodeURIComponent;

async function professor(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (!m) return false;
  const r = await fetch(LOGIN_URL + '/auth/v1/user', { headers: { apikey: LOGIN_KEY, Authorization: 'Bearer ' + m[1] } });
  return r.ok;
}
async function rest(path, opt) {
  const o = Object.assign({}, opt || {});
  o.headers = Object.assign({ apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' }, o.headers || {});
  const r = await fetch(SB + '/rest/v1/' + path, o);
  const t = await r.text(); if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + t.slice(0, 160));
  return t ? JSON.parse(t) : null;
}
const embaralhar = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const nomesTurma = turma => { const ro = ROSTER.da(turma); return (ro ? ro.map(x => x.nome) : Object.keys(PAINEL[turma] || {})).sort((a, b) => a.localeCompare(b, 'pt')); };

async function criar(b) {
  const turma = String(b.turma || ''); if (!PAINEL[turma]) throw Object.assign(new Error('Turma não encontrada.'), { cod: 404 });
  const n = Math.max(3, Math.min(30, Number(b.n) || 12)), tempo = [20, 30, 45, 60, 90, 120].includes(Number(b.tempo)) ? Number(b.tempo) : 60;
  const d = dadosTurma(turma);
  // temas com mais defasagem na turma têm prioridade, com um pouco de sorte para variar entre partidas
  const temas = d.temas.map(t => ({ t, p: (t.bim === '4' ? 35 : t.defasagem) + Math.random() * 35 })).sort((x, y) => y.p - x.p).slice(0, n).map(x => x.t)
    .sort((x, y) => x.bim.localeCompare(y.bim));
  const perguntas = [], gabarito = [];
  temas.forEach(t => {
    const q = t.qs[Math.floor(Math.random() * t.qs.length)];
    perguntas.push({ k: t.k, bim: t.bim, hab: t.hab, desc: t.desc, enunciado: q.enunciado, comando: q.comando, figura: q.figura, svg: q.svg, alts: q.alts, explicacao: q.explicacao });
    gabarito.push(q.correta);
  });
  let pin = '', row = null;
  for (let i = 0; i < 6 && !row; i++) {
    pin = String(100000 + Math.floor(Math.random() * 900000));
    try { row = (await rest('quiz_sessao', { method: 'POST', body: JSON.stringify({ pin, turma, serie: d.serie, tempo, perguntas, gabarito, nomes: nomesTurma(turma) }) }))[0]; }
    catch (e) { if (!/23505|duplicate/.test(e.message)) throw e; }   // PIN repetido em outra partida aberta: sorteia outro
  }
  if (!row) throw new Error('Não foi possível gerar o PIN. Tente de novo.');
  return { id: row.id, pin };
}

async function sessao(id) {
  const s = (await rest('quiz_sessao?select=*&id=eq.' + enc(id)))[0]; if (!s) return null;
  const jog = await rest('quiz_jogador?select=id,nome,pontos,criado&sessao=eq.' + enc(id) + '&order=pontos.desc,criado.asc') || [];
  const resp = await rest('quiz_resposta?select=jogador,q_idx,escolha,ms,certa,pontos&sessao=eq.' + enc(id)) || [];
  const restante = s.estado === 'pergunta' && s.q_inicio ? Math.max(0, s.tempo * 1000 - (Date.now() - Date.parse(s.q_inicio))) : 0;
  const atual = s.q_idx >= 0 ? s.perguntas[s.q_idx] : null;
  const daAtual = resp.filter(r => r.q_idx === s.q_idx);
  const dist = atual ? atual.alts.map((_, i) => daAtual.filter(r => r.escolha === i).length) : [];
  // relatório: por pergunta (tema) e por aluno, com o que já foi jogado
  const porQ = s.perguntas.map((p, i) => { const rs = resp.filter(r => r.q_idx === i); return { i, hab: p.hab, bim: p.bim, desc: p.desc, respostas: rs.length, acertos: rs.filter(r => r.certa).length, jogada: i <= s.q_idx }; });
  const porAluno = jog.map(j => { const rs = resp.filter(r => r.jogador === j.id); return { id: j.id, nome: j.nome, pontos: j.pontos, respostas: rs.length, acertos: rs.filter(r => r.certa).length, erros: rs.filter(r => !r.certa).map(r => s.perguntas[r.q_idx] && s.perguntas[r.q_idx].hab) }; });
  return {
    id: s.id, pin: s.pin, turma: s.turma, serie: s.serie, estado: s.estado, q: s.q_idx, n: s.perguntas.length, tempo: s.tempo, restante, criado: s.criado,
    pergunta: atual ? Object.assign({}, atual, { correta: s.gabarito[s.q_idx] }) : null,
    respondidos: daAtual.length, dist, jogadores: jog.map(j => ({ id: j.id, nome: j.nome, pontos: j.pontos })), porQ, porAluno,
    faltam: (s.nomes || []).filter(n => !jog.some(j => j.nome === n)).length
  };
}

module.exports = async function quiz(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const out = (c, v) => res.status(c).json(v);
  try {
    if (!(await professor(req))) return out(401, { ok: false, erro: 'Entre primeiro no painel com o seu login de professor.' });
    if (!SB || !KEY) return out(503, { ok: false, erro: 'Servidor não configurado (SUPABASE_URL / SUPABASE_SERVICE_KEY).' });
    const q = req.query || {};
    if (req.method === 'GET') {
      if (q.turmas) return out(200, { ok: true, turmas: Object.keys(PAINEL).sort((a, b) => a.localeCompare(b, 'pt')) });
      if (q.historico) {
        const ss = await rest('quiz_sessao?select=id,pin,turma,estado,criado,perguntas&turma=not.like.TESTE*&order=criado.desc&limit=30') || [];
        return out(200, { ok: true, partidas: ss.map(s => ({ id: s.id, turma: s.turma, estado: s.estado, criado: s.criado, n: (s.perguntas || []).length })) });
      }
      if (q.sessao) { const s = await sessao(String(q.sessao)); return s ? out(200, Object.assign({ ok: true }, s)) : out(404, { ok: false, erro: 'Partida não encontrada.' }); }
      return out(400, { ok: false, erro: 'Pedido inválido.' });
    }
    if (req.method !== 'POST') return out(405, { ok: false, erro: 'Use GET ou POST.' });
    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (b.acao === 'criar') return out(200, Object.assign({ ok: true }, await criar(b)));
    const id = String(b.id || ''); const s = (await rest('quiz_sessao?select=id,estado,q_idx,perguntas&id=eq.' + enc(id)))[0];
    if (!s) return out(404, { ok: false, erro: 'Partida não encontrada.' });
    const muda = campos => rest('quiz_sessao?id=eq.' + enc(id), { method: 'PATCH', body: JSON.stringify(campos), headers: { Prefer: 'return=minimal' } });
    if (b.acao === 'liberar') {
      if (s.estado === 'fim') return out(409, { ok: false, erro: 'A partida já foi encerrada.' });
      if (s.q_idx + 1 >= s.perguntas.length) return out(409, { ok: false, erro: 'Não há mais perguntas.' });
      await muda({ estado: 'pergunta', q_idx: s.q_idx + 1, q_inicio: new Date().toISOString() });
    } else if (b.acao === 'mostrar') {
      if (s.estado === 'pergunta') await muda({ estado: 'resultado' });
    } else if (b.acao === 'encerrar') {
      await muda({ estado: 'fim', encerrado: new Date().toISOString() });
    } else if (b.acao === 'remover') {
      await rest('quiz_jogador?sessao=eq.' + enc(id) + '&id=eq.' + enc(String(b.jogador || '')), { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
    } else return out(400, { ok: false, erro: 'Ação desconhecida.' });
    return out(200, Object.assign({ ok: true }, await sessao(id)));
  } catch (e) {
    return out(e.cod || 500, { ok: false, erro: e.cod ? e.message : 'Falha no servidor do quiz.' });
  }
};
