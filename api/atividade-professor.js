/* Atividade personalizada de um aluno, para o professor: questões e como o aluno respondeu.
   GET /api/atividade-professor?turma=…&nome=…  — exige o login do professor (Bearer token do Supabase).
   Consulta o Apps Script em POST (o segredo vai no corpo, não na URL). Não grava nada.
   Variáveis da Vercel: EM_APPS_SCRIPT_URL, EM_SEGREDO (as mesmas do simulado). */
const LOGIN_URL = process.env.PAINEL_SUPABASE_URL || 'https://ykrjfjepnqeoqlgupsbe.supabase.co';
const LOGIN_KEY = process.env.PAINEL_SUPABASE_KEY || 'sb_publishable_FbMU5x7WBpxzHmmVzOfh2g_0M1xxAh5';

async function professor(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (!m) return false;
  const r = await fetch(LOGIN_URL + '/auth/v1/user', { headers: { apikey: LOGIN_KEY, Authorization: 'Bearer ' + m[1] } });
  return r.ok;
}

module.exports = async function atividadeProfessor(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const out = (c, v) => res.status(c).json(v);
  try {
    if (req.method !== 'GET') return out(405, { ok: false, erro: 'Use GET.' });
    if (!(await professor(req))) return out(401, { ok: false, erro: 'Entre primeiro no painel com o seu login de professor.' });
    const url = process.env.EM_APPS_SCRIPT_URL || '', segredo = process.env.EM_SEGREDO || '';
    if (!url || !segredo) return out(500, { ok: false, erro: 'Planilha não configurada na Vercel (EM_APPS_SCRIPT_URL / EM_SEGREDO).' });
    const turma = String((req.query && req.query.turma) || '').trim(), nome = String((req.query && req.query.nome) || '').trim();
    if (!turma || !nome) return out(400, { ok: false, erro: 'Informe a turma e o aluno.' });
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 25000);
    try {
      const r = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ acao: 'atividadeProf', segredo, turma, nome }), redirect: 'follow', signal: ctl.signal
      });
      const j = await r.json().catch(() => null);
      if (!j) return out(502, { ok: false, erro: 'A planilha respondeu em formato inesperado. Confira se a nova versão do Apps Script foi publicada.' });
      if (!j.ok) return out(400, { ok: false, erro: String(j.erro || 'Não foi possível abrir a atividade.') });
      return out(200, j);
    } finally { clearTimeout(t); }
  } catch (e) {
    return out(502, { ok: false, erro: e && e.name === 'AbortError' ? 'A planilha demorou demais. Tente de novo.' : 'Falha ao falar com a planilha.' });
  }
};
