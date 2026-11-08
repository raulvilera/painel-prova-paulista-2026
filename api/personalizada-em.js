/* Atividade personalizada do Ensino Médio.
   Ponte entre a página do aluno e o Apps Script (ARQUIVO-UNICO.gs), sem expor o endereço da planilha.
   Exige o login do aluno (RA + dígito + senha): envie "Authorization: Bearer <token>".
     GET  → as 10 questões do próprio aluno (sem gabarito)
     POST {respostas} → corrige no Apps Script e grava na aba "Personalizada · <turma>"
   Turma e nome vêm sempre do login, nunca do corpo ou da URL; não há mais lista pública de nomes.
   Variáveis da Vercel: EM_APPS_SCRIPT_URL (mesma do simulado), SUPABASE_URL, SUPABASE_SERVICE_KEY. */
const NOMES = require('./_personalizada-em.js');
const { alunoDaSessao } = require('./_aluno-sessao.js');

const TEMPO_MS = 25000;
const SB = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), KEY = process.env.SUPABASE_SERVICE_KEY || '';

// Turma como está no banco de alunos → chave usada pela atividade personalizada
const TURMA_DO_BANCO = {
  '2ª Série A (DS)': '2ª SÉRIE A MANHÃ (Des. Sistemas)',
  '2ª Série C': '2ª SÉRIE C NOITE',
  '3ª Série F': '3ª SÉRIE F NOITE'
};

function semAcento(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
}

function achaNome(turma, nome) {
  const alvo = semAcento(nome);
  return (NOMES[turma] || []).find(n => semAcento(n) === alvo) || null;
}

async function rest(path) {
  const r = await fetch(SB + '/rest/v1/' + path, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
  const t = await r.text();
  if (!r.ok) throw new Error('Banco ' + r.status);
  return t ? JSON.parse(t) : [];
}

/* Identidade do aluno logado: { turma, nome } na grafia da atividade, ou null. */
async function alunoLogado(req) {
  const id = await alunoDaSessao(req);
  if (!id) return null;
  const rows = await rest('alunos?ra=eq.' + encodeURIComponent(id.ra) + '&digito_ra=eq.' + encodeURIComponent(id.digito) + '&select=nome,turma');
  const al = rows[0];
  if (!al) return null;
  const turma = TURMA_DO_BANCO[al.turma];
  if (!turma) return null;
  const nome = achaNome(turma, al.nome);
  return nome ? { turma: turma, nome: nome } : null;
}

async function chamarScript(metodo, query, corpo) {
  const url = process.env.EM_APPS_SCRIPT_URL || '';
  if (!url) return { ok: false, status: 500, erro: 'Planilha não configurada na Vercel (EM_APPS_SCRIPT_URL).' };
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), TEMPO_MS);
  try {
    const alvo = metodo === 'GET' ? url + '?' + new URLSearchParams(query).toString() : url;
    const resposta = await fetch(alvo, {
      method: metodo,
      headers: metodo === 'POST' ? { 'Content-Type': 'text/plain;charset=utf-8' } : undefined,
      body: metodo === 'POST' ? JSON.stringify(corpo) : undefined,
      redirect: 'follow',
      signal: controle.signal
    });
    const texto = await resposta.text();
    let retorno = null;
    try { retorno = JSON.parse(texto); } catch (e) {
      return { ok: false, status: 502, erro: 'A planilha respondeu em formato inesperado (HTTP ' + resposta.status + '). Confira a implantação do Apps Script.' };
    }
    if (!retorno || retorno.ok !== true) return { ok: false, status: 400, erro: String((retorno && retorno.erro) || 'Não foi possível concluir.') };
    return { ok: true, dados: retorno };
  } catch (erro) {
    return { ok: false, status: 502, erro: erro && erro.name === 'AbortError' ? 'A planilha demorou demais. Tente de novo.' : 'Falha ao falar com a planilha.' };
  } finally {
    clearTimeout(relogio);
  }
}

module.exports = async function personalizadaEM(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET' || req.method === 'POST') {
    let quem = null;
    try { quem = await alunoLogado(req); } catch (e) { return res.status(502).json({ ok: false, erro: 'Não foi possível confirmar o seu acesso. Tente de novo.' }); }
    if (!quem) return res.status(401).json({ ok: false, erro: 'Entre com seu RA, dígito e senha.' });

    if (req.method === 'GET') {
      const r = await chamarScript('GET', { api: 'personalizada', turma: quem.turma, nome: quem.nome });
      if (!r.ok) return res.status(r.status).json({ ok: false, erro: r.erro });
      return res.status(200).json({ ok: true, turma: quem.turma, nome: r.dados.nome, componente: r.dados.componente, questoes: r.dados.questoes });
    }

    const b = req.body && typeof req.body === 'object' ? req.body : {};
    const respostas = Array.isArray(b.respostas) ? b.respostas : [];
    if (respostas.length !== 10 || !respostas.every(x => x === null || (Number.isInteger(x) && x >= 0 && x <= 4))) {
      return res.status(400).json({ ok: false, erro: 'Responda as 10 questões (A a E) antes de enviar.' });
    }
    const r = await chamarScript('POST', null, { acao: 'enviarPersonalizada', turma: quem.turma, nome: quem.nome, respostas: respostas });
    if (!r.ok) return res.status(r.status).json({ ok: false, erro: r.erro });
    return res.status(200).json({ ok: true, acertos: r.dados.acertos, total: r.dados.total });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, erro: 'Use GET ou POST.' });
};
