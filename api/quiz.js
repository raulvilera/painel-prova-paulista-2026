/* Quiz ao vivo da plataforma (estilo Kahoot), lado do professor. Exige o login do professor (Bearer token do Supabase do painel).
   GET  /api/quiz?turmas=1         → turmas do Fundamental
   GET  /api/quiz?historico=1      → partidas anteriores
   GET  /api/quiz?sessao=<id>      → acompanhamento ao vivo: progresso de cada aluno, placar e acertos por tema
   POST {acao:'criar', turma, n, tempo}  → cria a partida e devolve o PIN (alunos entram e aguardam)
   POST {acao:'duplas', id}              → forma as duplas com níveis diferentes (quem está mais avançado com quem tem mais defasagem)
   POST {acao:'abrir'|'encerrar', id}    → libera o jogo (forma as duplas se ainda não houver; cada aluno avança no próprio ritmo) / encerra
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
/* nível do aluno pelo painel: média dos níveis (0 a 3) nos descritores do plano dele; sem dado = mediana da turma */
function niveis(turma, nomes) {
  const T = PAINEL[turma] || {}, v = {};
  nomes.forEach(n => { const l = T[n]; if (l && l.length) v[n] = l.reduce((a, x) => a + (Number(x[1]) || 0), 0) / l.length; });
  const conh = Object.values(v).sort((a, b) => a - b), med = conh.length ? conh[Math.floor(conh.length / 2)] : 1;
  nomes.forEach(n => { if (v[n] == null) v[n] = med; });
  return v;
}
/* duplas heterogêneas: o 1º mais avançado com o mais distante do esperado, o 2º com o penúltimo…; número ímpar: o do meio entra na dupla com menor nível somado */
function formarDuplas(jog, turma) {
  const nv = niveis(turma, jog.map(j => j.nome));
  const ord = jog.slice().sort((a, b) => nv[b.nome] - nv[a.nome] || a.nome.localeCompare(b.nome, 'pt'));
  const grupos = [];
  for (let i = 0, k = ord.length - 1; i < k; i++, k--) grupos.push([ord[i], ord[k]]);
  if (ord.length % 2) {
    const meio = ord[Math.floor(ord.length / 2)];
    if (!grupos.length) grupos.push([meio]);
    else grupos.slice().sort((a, b) => a.reduce((x, j) => x + nv[j.nome], 0) - b.reduce((x, j) => x + nv[j.nome], 0))[0].push(meio);
  }
  return grupos;
}
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

async function placarDuplas(s, jog, porAluno) {
  if (!jog.some(j => j.grupo != null)) return [];
  const pl = await rest('rpc/quiz_placar_', { method: 'POST', body: JSON.stringify({ p_sessao: s.id }) }) || [];
  const nv = niveis(s.turma, jog.map(j => j.nome));
  return pl.map(g => ({ grupo: g.grupo, pontos: g.pontos, bonus: g.bonus, total: g.total,
    membros: porAluno.filter(a => (jog.find(j => j.id === a.id) || {}).grupo === g.grupo).map(a => Object.assign({ nivel: Math.round(nv[a.nome] * 10) / 10 }, a)) }))
    .sort((a, b) => b.total - a.total || a.grupo - b.grupo);
}
async function gravarDuplas(id, turma, jog) {
  const grupos = formarDuplas(jog, turma);
  await Promise.all(grupos.map((g, i) => rest('quiz_jogador?sessao=eq.' + enc(id) + '&id=in.(' + g.map(j => j.id).join(',') + ')', { method: 'PATCH', body: JSON.stringify({ grupo: i + 1 }), headers: { Prefer: 'return=minimal' } })));
}
async function sessao(id) {
  const s = (await rest('quiz_sessao?select=*&id=eq.' + enc(id)))[0]; if (!s) return null;
  const jog = await rest('quiz_jogador?select=id,nome,pontos,q_atual,grupo,criado&sessao=eq.' + enc(id) + '&order=pontos.desc,criado.asc') || [];
  const resp = await rest('quiz_resposta?select=jogador,q_idx,escolha,ms,certa,pontos&sessao=eq.' + enc(id)) || [];
  // relatório ao vivo: por pergunta (tema) e por aluno; escolha -1 = tempo esgotado sem resposta
  const porQ = s.perguntas.map((p, i) => { const rs = resp.filter(r => r.q_idx === i); return { i, hab: p.hab, bim: p.bim, desc: p.desc, respostas: rs.length, acertos: rs.filter(r => r.certa).length, semResp: rs.filter(r => r.escolha < 0).length, dist: p.alts.map((_, k) => rs.filter(r => r.escolha === k).length), correta: s.gabarito[i], jogada: rs.length > 0 }; });
  const porAluno = jog.map(j => { const rs = resp.filter(r => r.jogador === j.id); return { id: j.id, nome: j.nome, pontos: j.pontos, feitas: Math.min(j.q_atual, s.perguntas.length), respostas: rs.length, acertos: rs.filter(r => r.certa).length, semResp: rs.filter(r => r.escolha < 0).length, erros: rs.filter(r => !r.certa).map(r => s.perguntas[r.q_idx] && s.perguntas[r.q_idx].hab) }; });
  return {
    id: s.id, pin: s.pin, turma: s.turma, serie: s.serie, estado: s.estado, n: s.perguntas.length, tempo: s.tempo, criado: s.criado,
    terminaram: porAluno.filter(a => a.feitas >= s.perguntas.length).length,
    grupos: await placarDuplas(s, jog, porAluno),
    jogadores: jog.map(j => ({ id: j.id, nome: j.nome, pontos: j.pontos })), porQ, porAluno,
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
    if (b.acao === 'duplas' || b.acao === 'abrir') {
      if (s.estado === 'fim') return out(409, { ok: false, erro: 'A partida já foi encerrada.' });
      const jog = await rest('quiz_jogador?select=id,nome,grupo&sessao=eq.' + enc(id)) || [];
      if (b.acao === 'duplas' && s.estado !== 'espera') return out(409, { ok: false, erro: 'As duplas só podem ser refeitas antes de liberar o quiz.' });
      if (b.acao === 'duplas' || (jog.length && jog.every(j => j.grupo == null))) await gravarDuplas(id, (await rest('quiz_sessao?select=turma&id=eq.' + enc(id)))[0].turma, jog);
      if (b.acao === 'abrir') await muda({ estado: 'aberto' });
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
