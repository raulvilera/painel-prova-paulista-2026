/* Nomes dos alunos da 2ª Série C para a atividade de Química (/atividade-quimica-2c/).
   Lê o painel_dados (id 'main') no servidor, com SUPABASE_SERVICE_KEY, e devolve só nome da turma.
   Nenhum dado de aluno fica no HTML nem no repositório (LGPD). Variáveis na Vercel: PAINEL_SUPABASE_URL (opcional) e PAINEL_SERVICE_KEY. */
/* O painel_dados fica no projeto do painel (o mesmo do login), não no projeto de SUPABASE_URL. */
const SB = (process.env.PAINEL_SUPABASE_URL || 'https://ykrjfjepnqeoqlgupsbe.supabase.co').replace(/\/$/, ''), KEY = process.env.PAINEL_SERVICE_KEY || '';

const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
/* Turma "2ª SÉRIE C" (com ou sem sufixo de período). */
const SERIE_C = /^2\s*[ºª°o]?\s*SERIE\s*C\b/;

module.exports = async function atividadeQuimica(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const ok = o => res.status(200).json(Object.assign({ ok: true }, o)), erro = (c, m) => res.status(c).json({ ok: false, erro: m });
  if (req.method !== 'GET') return erro(405, 'Método não permitido.');
  const q = req.query || {};
  if (q.acao !== 'nomes') return erro(400, 'Ação desconhecida.');
  if (!SB || !KEY) return erro(503, 'Servidor não configurado: falta PAINEL_SERVICE_KEY na Vercel.');

  try {
    const r = await fetch(SB + '/rest/v1/painel_dados?select=dados&id=eq.main', {
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, Accept: 'application/json' }
    });
    if (!r.ok) {
      const corpo = (await r.text()).slice(0, 160).replace(/\s+/g, ' ');
      return erro(502, 'Banco indisponível (HTTP ' + r.status + '): ' + corpo);
    }
    const linhas = await r.json();
    const dados = linhas && linhas[0] && linhas[0].dados;
    if (!dados || !Array.isArray(dados.T) || !Array.isArray(dados.A)) return erro(404, 'Dados não encontrados.');

    const idx = new Set();
    dados.T.forEach((t, i) => { if (SERIE_C.test(norm(t && t.n))) idx.add(i); });
    const nomes = [...new Set(dados.A.filter(a => idx.has(a[0])).map(a => String(a[2] || '').trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'pt'))
      .map(nome => ({ numero: null, nome }));
    if (!nomes.length) {
      // Diagnóstico: só os nomes das turmas (sem dados de alunos), para conferir o nome exato no painel.
      const turmas = [...new Set(dados.T.map(t => String(t && t.n || '')))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt'));
      return res.status(404).json({ ok: false, erro: 'Nenhum aluno da 2ª Série C encontrado. Turmas no painel: ' + turmas.join(' | '), turmas });
    }
    return ok({ nomes });
  } catch (e) {
    return erro(500, 'Falha ao consultar o banco: ' + String(e && e.message || e).slice(0, 160));
  }
};
