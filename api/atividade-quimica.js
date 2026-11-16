/* Nomes dos alunos para as atividades com lista de turma: Química 2ª C (/atividade-quimica-2c/), Missão Ciências (8º A e B)
   e Missão SARESP 3D (/missao-saresp/, 6º ao 9º ano).
   Lê a tabela alunos (chamada e nome) no servidor, com SUPABASE_URL e SUPABASE_SERVICE_KEY, e devolve só a turma pedida.
   Nenhum dado de aluno fica no HTML nem no repositório (LGPD). */
const SB = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), KEY = process.env.SUPABASE_SERVICE_KEY || '';
const TURMAS_EMAIL = ['2ª Série C', '8º Ano A', '8º Ano B'];   // 2ª C: Química · 8º A e B: Missão Ciências (usam o e-mail)
// Missão SARESP 3D: só nº e nome. Os 6º anos da E.E. Lydia Kitz Moreira (manhã) têm o rótulo "(Lydia)"; sem rótulo = E.E. Wanda.
const TURMAS_FUND = ['6º Ano A (Lydia)', '6º Ano B (Lydia)', '6º Ano C (Lydia)', '6º Ano A', '6º Ano C', '7º Ano A', '7º Ano B', '8º Ano A', '8º Ano B', '9º Ano A', '9º Ano B'];
const APELIDO = { '6º Ano B': '6º Ano B (Lydia)' };   // links antigos
const TURMAS = TURMAS_EMAIL.concat(TURMAS_FUND.filter(t => !TURMAS_EMAIL.includes(t)));

module.exports = async function atividadeQuimica(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const ok = o => res.status(200).json(Object.assign({ ok: true }, o)), erro = (c, m) => res.status(c).json({ ok: false, erro: m });
  if (req.method !== 'GET') return erro(405, 'Método não permitido.');
  const pedida = APELIDO[String((req.query || {}).turma || '')] || String((req.query || {}).turma || '');
  const TURMA = TURMAS.includes(pedida) ? pedida : TURMAS[0];
  const BASE = TURMA.replace(/\s*\(Lydia\)\s*$/, ''), FUND = TURMAS_FUND.includes(TURMA) && /^6/.test(TURMA);
  const ESCOLA = FUND ? (/\(Lydia\)/.test(TURMA) ? 'Lydia' : 'Wanda') : '';
  if (!SB || !KEY) return erro(503, 'Servidor não configurado (SUPABASE_URL / SUPABASE_SERVICE_KEY).');

  try {
    const url = SB + '/rest/v1/alunos?select=chamada,nome,email_institucional&turma=eq.' + encodeURIComponent(BASE) + (ESCOLA ? '&escola=eq.' + ESCOLA : '') + '&order=chamada.asc';
    const r = await fetch(url, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, Accept: 'application/json' } });
    if (!r.ok) {
      const corpo = (await r.text()).slice(0, 160).replace(/\s+/g, ' ');
      return erro(502, 'Banco indisponível (HTTP ' + r.status + '): ' + corpo);
    }
    const linhas = await r.json();
    const nomes = (linhas || [])
      .filter(a => a && a.nome)
      .map(a => Object.assign({ numero: a.chamada != null ? a.chamada : null, nome: String(a.nome).trim() }, TURMAS_EMAIL.includes(TURMA) ? { email: a.email_institucional || '' } : {}));
    if (!nomes.length) return erro(404, 'Nenhum aluno encontrado para a turma ' + TURMA + '.');
    return ok({ nomes });
  } catch (e) {
    return erro(500, 'Falha ao consultar o banco: ' + String(e && e.message || e).slice(0, 160));
  }
};
