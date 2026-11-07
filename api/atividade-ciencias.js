/* Atividade de Ciências 8º ano (circuitos elétricos, 4º bimestre): grava as respostas em public.atividade_ciencias_respostas.
   Variáveis na Vercel: SUPABASE_URL, SUPABASE_SERVICE_KEY. O gabarito fica só no servidor. */
const SB = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), KEY = process.env.SUPABASE_SERVICE_KEY || '';
const GABARITO = { 1: 'D', 2: 'C', 3: 'B', 4: 'B', 5: 'B', 6: 'B', 7: 'B' };
const TURMAS = ['8º Ano A', '8º Ano B'];
const ESCOLA = 'E. E. PROFª WANDA MASCAGNI DE SÁ';

function lerCorpo(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return null; }
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(JSON.stringify({ ok: false, erro: 'método não permitido' })); }
  const d = lerCorpo(req);
  if (!d) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, erro: 'corpo inválido' })); }

  const turma = String(d.turma || '');
  const nome = String(d.nome || '').trim().slice(0, 120);
  const chamada = parseInt(d.chamada, 10);
  if (!TURMAS.includes(turma) || !nome || !(chamada >= 1 && chamada <= 60)) {
    res.statusCode = 400; return res.end(JSON.stringify({ ok: false, erro: 'turma, chamada ou nome inválidos' }));
  }

  const respostas = {};
  let acertos = 0;
  for (let q = 1; q <= 7; q++) {
    const r = String((d.respostas || {})[q] || '').slice(0, 1);
    respostas[q] = r;
    if (r && r === GABARITO[q]) acertos++;
  }
  const dissertativas = {};
  for (const q of [8, 9, 10]) dissertativas[q] = String((d.dissertativas || {})[q] || '').slice(0, 2000);

  const linha = { escola: ESCOLA, turma, chamada, nome, respostas, dissertativas, acertos, total_objetivas: 7 };
  try {
    const r = await fetch(SB + '/rest/v1/atividade_ciencias_respostas', {
      method: 'POST',
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(linha)
    });
    if (!r.ok) { res.statusCode = 502; return res.end(JSON.stringify({ ok: false, erro: 'falha ao gravar' })); }
  } catch (e) {
    res.statusCode = 502; return res.end(JSON.stringify({ ok: false, erro: 'falha de conexão' }));
  }
  res.end(JSON.stringify({ ok: true }));
};
