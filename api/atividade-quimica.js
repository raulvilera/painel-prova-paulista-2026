/* Nomes dos alunos da 2ª Série C para a atividade de Química (/atividade-quimica-2c/).
   Lê a tabela alunos (chamada e nome) no servidor, com SUPABASE_URL e SUPABASE_SERVICE_KEY, e devolve só a turma pedida.
   Nenhum dado de aluno fica no HTML nem no repositório (LGPD). */
const SB = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), KEY = process.env.SUPABASE_SERVICE_KEY || '';
const TURMA = '2ª Série C';

module.exports = async function atividadeQuimica(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const ok = o => res.status(200).json(Object.assign({ ok: true }, o)), erro = (c, m) => res.status(c).json({ ok: false, erro: m });
  if (req.method !== 'GET') return erro(405, 'Método não permitido.');
  /* A lista pública de nomes foi desligada: o aluno entra com RA + dígito + senha (/api/aluno-login). */
  return erro(410, 'Lista de nomes desativada. Entre com seu RA e senha.');
  if (!SB || !KEY) return erro(503, 'Servidor não configurado (SUPABASE_URL / SUPABASE_SERVICE_KEY).');

  try {
    const url = SB + '/rest/v1/alunos?select=chamada,nome&turma=eq.' + encodeURIComponent(TURMA) + '&order=chamada.asc';
    const r = await fetch(url, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, Accept: 'application/json' } });
    if (!r.ok) {
      const corpo = (await r.text()).slice(0, 160).replace(/\s+/g, ' ');
      return erro(502, 'Banco indisponível (HTTP ' + r.status + '): ' + corpo);
    }
    const linhas = await r.json();
    const nomes = (linhas || [])
      .filter(a => a && a.nome)
      .map(a => ({ numero: a.chamada != null ? a.chamada : null, nome: String(a.nome).trim() }));
    if (!nomes.length) return erro(404, 'Nenhum aluno encontrado para a turma ' + TURMA + '.');
    return ok({ nomes });
  } catch (e) {
    return erro(500, 'Falha ao consultar o banco: ' + String(e && e.message || e).slice(0, 160));
  }
};
