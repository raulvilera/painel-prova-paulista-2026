/* Painel ao vivo da Trilha SARESP (somente professor).
   GET /api/trilha-painel — exige o login do professor (Bearer token do Supabase do painel) e só para o e-mail institucional.
   O banco da trilha (oxohp) não aceita mais leitura pública: esta função lê com a chave de serviço, no servidor.
   Variáveis na Vercel: SUPABASE_URL, SUPABASE_SERVICE_KEY (as mesmas da atividade individual). */
const SB = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), KEY = process.env.SUPABASE_SERVICE_KEY || '';
const LOGIN_URL = process.env.PAINEL_SUPABASE_URL || 'https://ykrjfjepnqeoqlgupsbe.supabase.co', LOGIN_KEY = process.env.PAINEL_SUPABASE_KEY || 'sb_publishable_FbMU5x7WBpxzHmmVzOfh2g_0M1xxAh5';
const EMAIL_OK = 'vilera@prof.educacao.sp.gov.br';

async function professor(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (!m) return false;
  const r = await fetch(LOGIN_URL + '/auth/v1/user', { headers: { apikey: LOGIN_KEY, Authorization: 'Bearer ' + m[1] } });
  if (!r.ok) return false;
  const u = await r.json();
  return String(u.email || '').toLowerCase() === EMAIL_OK;
}

module.exports = async function trilhaPainel(req, res) {
  res.setHeader('Cache-Control', 'no-store'); res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const out = (c, v) => res.status(c).json(v);
  try {
    if (req.method !== 'GET') return out(405, { ok: false, erro: 'Use GET.' });
    if (!SB || !KEY) return out(500, { ok: false, erro: 'Banco da trilha não configurado na Vercel.' });
    if (!(await professor(req))) return out(401, { ok: false, erro: 'Entre primeiro no painel com a sua biometria.' });
    const r = await fetch(SB + '/rest/v1/rpc/trilha_painel', { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: '{}' });
    const t = await r.text();
    if (!r.ok) return out(502, { ok: false, erro: 'Banco da trilha respondeu ' + r.status + ': ' + t.slice(0, 160) });
    return out(200, JSON.parse(t));
  } catch (e) {
    return out(500, { ok: false, erro: 'Falha ao carregar o painel: ' + e.message });
  }
};
