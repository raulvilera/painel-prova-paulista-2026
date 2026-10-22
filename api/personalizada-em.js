/* Atividade personalizada do Ensino Médio.
   Ponte entre a página do aluno e o Apps Script (ARQUIVO-UNICO.gs), sem expor o endereço da planilha.
     GET  ?turma=…                 → nomes dos alunos da turma (sem questões)
     GET  ?turma=…&nome=…          → as 10 questões do aluno (sem gabarito)
     POST {turma, nome, respostas} → corrige no Apps Script e grava na aba "Personalizada · <turma>"
   Variáveis da Vercel: EM_APPS_SCRIPT_URL (mesma do simulado). */
const NOMES = require('./_personalizada-em.js');

const TEMPO_MS = 25000;

function semAcento(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
}

function achaTurma(t) {
  return Object.prototype.hasOwnProperty.call(NOMES, t) ? t : null;
}

function achaNome(turma, nome) {
  const alvo = semAcento(nome);
  return (NOMES[turma] || []).find(n => semAcento(n) === alvo) || null;
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

  if (req.method === 'GET') {
    const turma = achaTurma(String((req.query && req.query.turma) || ''));
    if (!turma) return res.status(404).json({ ok: false, erro: 'Turma desconhecida.' });
    const nomeQuery = req.query && req.query.nome;
    if (!nomeQuery) return res.status(200).json({ ok: true, turma: turma, alunos: NOMES[turma] });
    const nome = achaNome(turma, nomeQuery);
    if (!nome) return res.status(404).json({ ok: false, erro: 'Aluno sem atividade personalizada nesta turma.' });
    const r = await chamarScript('GET', { api: 'personalizada', turma: turma, nome: nome });
    if (!r.ok) return res.status(r.status).json({ ok: false, erro: r.erro });
    return res.status(200).json({ ok: true, turma: turma, nome: r.dados.nome, componente: r.dados.componente, questoes: r.dados.questoes });
  }

  if (req.method === 'POST') {
    const b = req.body && typeof req.body === 'object' ? req.body : {};
    const turma = achaTurma(String(b.turma || ''));
    if (!turma) return res.status(400).json({ ok: false, erro: 'Turma desconhecida.' });
    const nome = achaNome(turma, b.nome);
    if (!nome) return res.status(400).json({ ok: false, erro: 'Aluno sem atividade personalizada nesta turma.' });
    const respostas = Array.isArray(b.respostas) ? b.respostas : [];
    if (respostas.length !== 10 || !respostas.every(x => x === null || (Number.isInteger(x) && x >= 0 && x <= 4))) {
      return res.status(400).json({ ok: false, erro: 'Responda as 10 questões (A a E) antes de enviar.' });
    }
    const r = await chamarScript('POST', null, { acao: 'enviarPersonalizada', turma: turma, nome: nome, respostas: respostas });
    if (!r.ok) return res.status(r.status).json({ ok: false, erro: r.erro });
    return res.status(200).json({ ok: true, acertos: r.dados.acertos, total: r.dados.total });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, erro: 'Use GET ou POST.' });
};
