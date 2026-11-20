/* Atividade personalizada do Ensino Médio.
   Ponte entre a página do aluno e o Apps Script (ARQUIVO-UNICO.gs), sem expor o endereço da planilha.
   Exige o login do aluno (RA + dígito + senha): envie "Authorization: Bearer <token>".
     GET  → as 10 questões do próprio aluno (sem gabarito)
     POST {respostas} → corrige no Apps Script e grava na aba "Personalizada · <turma>"
   Turma e nome vêm do login (se houver) ou da escolha do aluno na lista (GET ?lista=1).
   Variáveis da Vercel: EM_APPS_SCRIPT_URL (mesma do simulado), SUPABASE_URL, SUPABASE_SERVICE_KEY. */
const NOMES = require('./_personalizada-em.js');
const { contextosAtividade, BUSCAS } = require('./_contexto-personalizada.js');
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

async function restUma(path) {
  const r = await fetch(SB + '/rest/v1/' + path, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
  const t = await r.text();
  if (!r.ok) throw new Error('Banco ' + r.status);
  return t ? JSON.parse(t) : [];
}
const rest = require('./_paginar')(restUma);   // leituras sem o corte de 1000 linhas do Supabase

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

/* Imagem do Wikimedia Commons para uma busca do catálogo (texto-base das questões).
   Escolhe o primeiro resultado em JPG/PNG/SVG de tamanho razoável e devolve a miniatura, o autor e a licença. */
const IMG_CACHE = new Map();
const semTags = s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
/* Só imagens sem texto em outra língua: descarta arquivos marcados com idioma que não seja o português
   e esquemas/gráficos/mapas (que costumam ter rótulos), a menos que estejam em português. */
const IDIOMA = /[-_ (.](en|es|fr|de|it|tr|ku|ro|pl|ru|ja|zh|ar|eu|ca|nl|sv|uk|he|fa|cs|hu|el|ko|vi|id|fi|da|no|nb|ta|hi|bn|ml|te|kn|th|sr|bg|hr|sk|sl|lt|lv|et|gl|ast|oc|af|sw|ms|tl|hy|ka|az|be|mk|sq|is|ga|cy|ur|mr|gu|pa)([-_ ).]|$)/i;
const ESQUEMA = /diagram|schema|scheme|chart|graph|\bmaps?\b|infographic|poster|\blabel|annot|logo|flowchart|\bcycle\b|stages|\bstructure\b|\btable\b|catalog|\btext\b|\bsign\b|\bcover\b|\bpage\b|\bbook\b|\bad\b|advert|newspaper|leaflet|\bslide|banner|capacity|statistic|accumulated|installed|worldwide|\bvs\b|comparison|infograf|\bopenstax\b|^\d{4} /i;
const PT = /[-_ (]pt([-_ ).]|$)|pt-br|portugu|\b(esquema|diagrama|ciclo|estrutura)\b/i;
function semTextoEstrangeiro(titulo) {
  const t = String(titulo || '').replace(/^File:/, '');
  if (PT.test(t)) return true;
  return !IDIOMA.test(t) && !ESQUEMA.test(t);
}
const LICENCA = { 'Public domain': 'Domínio público', 'No restrictions': 'Sem restrições', 'Attribution': 'Atribuição' };

async function imagemCommons(busca) {
  if (IMG_CACHE.has(busca)) return IMG_CACHE.get(busca);
  const fixo = /^File:/.test(busca);   // arquivo escolhido e conferido: vai direto, sem busca
  const u = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams(Object.assign({
    action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url|mime|size|extmetadata', iiurlwidth: '720', iiextmetadatafilter: 'Artist|LicenseShortName'
  }, fixo ? { titles: busca } : { generator: 'search', gsrsearch: busca, gsrnamespace: '6', gsrlimit: '10' }));
  const r = await fetch(u, { headers: { 'User-Agent': 'PainelProvaPaulista/1.0 (https://painel-prova-paulista-2026.vercel.app; atividade escolar)' } });
  if (!r.ok) throw new Error('Commons ' + r.status);
  const j = await r.json();
  const pags = Object.values((j.query && j.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
  const boa = pags.find(p => { const i = p.imageinfo && p.imageinfo[0]; return i && /image\/(jpeg|png|svg\+xml)/.test(i.mime) && i.width >= 300 && i.height >= 180 && i.thumburl && (fixo || semTextoEstrangeiro(p.title)); });
  let res = null;
  if (boa) {
    const i = boa.imageinfo[0], m = i.extmetadata || {};
    res = { src: i.thumburl, pagina: i.descriptionurl, titulo: boa.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, ''),
      autor: semTags(m.Artist && m.Artist.value).replace(/\(\s*(talk|contribs|discussão)\s*\)/gi, '').replace(/\b(Unknown author|Unknown)\b/gi, 'Autor desconhecido').trim().slice(0, 120), licenca: (l => LICENCA[l] || l)(semTags(m.LicenseShortName && m.LicenseShortName.value)) };
  }
  IMG_CACHE.set(busca, res);
  return res;
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

  const q = req.query || {};
  /* sem login: lista de turmas e nomes para o aluno escolher */
  if (req.method === 'GET' && q.lista) {
    const turmas = Object.keys(NOMES).sort((a, b) => a.localeCompare(b, 'pt'));
    return res.status(200).json({ ok: true, turmas: turmas, nomes: NOMES });
  }

  /* imagem do texto-base (só buscas do catálogo); a CDN guarda a resposta por 30 dias */
  if (req.method === 'GET' && typeof q.img === 'string') {
    if (!BUSCAS.includes(q.img)) return res.status(400).json({ ok: false, erro: 'Busca desconhecida.' });
    try {
      const im = await imagemCommons(q.img);
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800');
      return res.status(200).json({ ok: true, imagem: im });
    } catch (e) { return res.status(502).json({ ok: false, erro: 'Imagem indisponível.' }); }
  }

  if (req.method === 'GET' || req.method === 'POST') {
    let quem = null;
    if (/^Bearer .+/.test(req.headers.authorization || '')) {   // com login (RA + dígito + senha): continua valendo
      try { quem = await alunoLogado(req); } catch (e) { return res.status(502).json({ ok: false, erro: 'Não foi possível confirmar o seu acesso. Tente de novo.' }); }
      if (!quem) return res.status(401).json({ ok: false, erro: 'Entre com seu RA, dígito e senha.' });
    } else {   // sem login: turma e nome escolhidos na lista (só nomes que existem na atividade)
      const src = req.method === 'GET' ? q : (req.body && typeof req.body === 'object' ? req.body : {});
      const turma = String(src.turma || ''), nome = NOMES[turma] ? achaNome(turma, String(src.nome || '')) : null;
      if (!nome) return res.status(400).json({ ok: false, erro: 'Escolha a sua turma e o seu nome na lista.' });
      quem = { turma: turma, nome: nome };
    }

    if (req.method === 'GET') {
      const r = await chamarScript('GET', { api: 'personalizada', turma: quem.turma, nome: quem.nome });
      if (!r.ok) return res.status(r.status).json({ ok: false, erro: r.erro });
      const qs = r.dados.questoes || [], ctxs = contextosAtividade(qs, r.dados.componente);
      const questoes = qs.map((x, i) => Object.assign({}, x, { ctx: ctxs[i] }));
      return res.status(200).json({ ok: true, turma: quem.turma, nome: r.dados.nome, componente: r.dados.componente, questoes: questoes });
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
