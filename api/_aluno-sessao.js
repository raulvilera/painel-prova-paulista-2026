/* Sessão do aluno (RA + dígito + senha). Usado pelas APIs das atividades.
   Variáveis na Vercel: SUPABASE_URL, SUPABASE_SERVICE_KEY (banco da trilha/alunos). */
const crypto = require('crypto');
const SB = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), KEY = process.env.SUPABASE_SERVICE_KEY || '';

const sha = s => crypto.createHash('sha256').update(String(s)).digest('hex');

async function rest(path, opts = {}) {
  const r = await fetch(SB + '/rest/v1/' + path, {
    method: opts.method || 'GET',
    headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', ...(opts.prefer ? { Prefer: opts.prefer } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const t = await r.text();
  if (!r.ok) throw new Error('Banco ' + r.status + ': ' + t.slice(0, 160));
  return t ? JSON.parse(t) : [];
}

/* Devolve { ra, digito } se o Bearer token for uma sessão válida; senão null. */
async function alunoDaSessao(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (!m) return null;
  const hash = sha(m[1]);
  const rows = await rest('aluno_sessao?token_hash=eq.' + hash + '&select=ra,digito,expira_em');
  if (!rows.length) return null;
  if (new Date(rows[0].expira_em).getTime() < Date.now()) return null;
  return { ra: rows[0].ra, digito: rows[0].digito };
}

module.exports = { rest, alunoDaSessao, sha };
