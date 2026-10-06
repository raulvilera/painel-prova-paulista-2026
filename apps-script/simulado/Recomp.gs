/* ======================================================================
   ATIVIDADES DE RECOMPOSIÇÃO (link de cada aula de recomposição do painel)
   - 10 questões por atividade: 5 objetivas + 5 dissertativas.
   - As questões são criadas UMA vez pela IA (Gemini) a partir do descritor e
     da atividade do painel, e ficam guardadas na aba "Banco" da planilha de
     recomposição: todos os alunos recebem as mesmas questões. Você pode
     conferir/editar o JSON da aba Banco antes de aplicar.
   - Respostas: uma aba por turma, ex.: "6ºAno A (LKM)" e "7ºAno B (WMS)".
     Objetivas: azul = certa, vermelho = errada. Dissertativas corrigidas pela IA.
   - Para gerar todas antes da aula: rode gerarTodasRecomp() (pode rodar mais
     de uma vez; ele continua de onde parou).
   ====================================================================== */
const RECOMP_PLANILHA_ID = '1ZuOpy2Bqf2uowI9TrapOqqNQXjYM9iy6jCX2uE52khI';
const RECOMP_N_OBJ = 5, RECOMP_N_DIS = 5;

function recompCat_(k) { const c = RECOMP_CAT[k]; if (!c) throw new Error('Atividade não encontrada'); return c; }

/* "6º Ano A (Lydia)" -> "6ºAno A (LKM)" ; "7º Ano B" -> "7ºAno B (WMS)" */
function recompAba_(turmaId) {
  const lyd = /\(Lydia\)/.test(turmaId);
  return turmaId.replace(/\s*\(Lydia\)/, '').replace('º Ano', 'ºAno') + (lyd ? ' (LKM)' : ' (WMS)');
}

function recompBanco_() {
  const ss = SpreadsheetApp.openById(RECOMP_PLANILHA_ID);
  let sh = ss.getSheetByName('Banco');
  if (!sh) {
    sh = ss.insertSheet('Banco', 0);
    sh.getRange(1, 1, 1, 5).setValues([['Chave da atividade', 'Atividade', 'Questões (JSON — pode editar com cuidado)', 'Gerado em', 'Origem']])
      .setFontWeight('bold').setBackground('#145A32').setFontColor('#FFFFFF');
    sh.setFrozenRows(1); sh.setColumnWidth(1, 320); sh.setColumnWidth(2, 200); sh.setColumnWidth(3, 500);
  }
  return sh;
}

/* Questões completas (com gabarito) — só no servidor. */
function recompQuestoes_(k, gerarSeFaltar) {
  const cache = CacheService.getScriptCache(), ck = 'rq_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, k));
  const c = cache.get(ck); if (c) return JSON.parse(c);
  const sh = recompBanco_(), vals = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues() : [];
  const row = vals.find(r => r[0] === k);
  let Q = null;
  if (row) { try { Q = JSON.parse(row[2]); } catch (e) { throw new Error('JSON da aba Banco inválido para esta atividade'); } }
  if (!Q && gerarSeFaltar) {
    const lock = LockService.getScriptLock(); lock.waitLock(60000);
    try {
      const v2 = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues() : [];
      const r2 = v2.find(r => r[0] === k);
      if (r2) Q = JSON.parse(r2[2]);
      else { Q = gerarRecompIA_(k); sh.appendRow([k, recompCat_(k).nome, JSON.stringify(Q), new Date(), 'IA (' + MODELO_IA + ')']); }
    } finally { lock.releaseLock(); }
  }
  if (!Q) return null;
  cache.put(ck, JSON.stringify(Q), 1800);
  return Q;
}

function gerarRecompIA_(k) {
  const c = recompCat_(k);
  const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!key) throw new Error('GEMINI_API_KEY não configurada nas propriedades do script');
  const prompt =
    'Você é especialista em avaliação de Ciências do Ensino Fundamental (SEDUC-SP, Guia Priorizado 2026, SARESP).\n' +
    'Crie uma ATIVIDADE DE RECOMPOSIÇÃO para alunos do ' + c.serie + 'º ano com exatamente 10 questões: ' +
    'as 5 primeiras OBJETIVAS (4 alternativas, só 1 correta, distratores com erros conceituais típicos de alunos) e ' +
    'as 5 últimas DISSERTATIVAS (resposta curta, com o que se espera da resposta).\n' +
    'Progressão: questões 1–2 e 6–7 de reconhecer/identificar (alunos Abaixo do Básico); 3–4 e 8 de aplicar/relacionar; 5, 9 e 10 de analisar/justificar.\n' +
    'Use contextos do cotidiano de alunos de escola pública paulista. Linguagem simples, enunciados com no máximo 3 linhas. ' +
    'Não use imagens: tudo deve ser respondível só com o texto.\n\n' +
    'DESCRITOR A RECOMPOR (Prova Paulista): ' + c.desc + '\n' +
    'HABILIDADE: ' + c.hab + ' — ' + c.habTxt + '\n' +
    'ATIVIDADE DE SALA JÁ PLANEJADA: "' + c.nome + '". ' + c.concreta + '\n' +
    'Para Abaixo do Básico: ' + c.ab + '\nPara Básico: ' + c.b + '\n\n' +
    'Responda APENAS em JSON neste formato:\n' +
    '{"questoes":[{"tipo":"obj","enunciado":"...","comando":"...","alts":["...","...","...","..."],"correta":0,"explicacao":"..."},' +
    '{"tipo":"dis","enunciado":"...","comando":"...","ref":"resposta esperada","conceitos":["...","..."]}]}\n' +
    'Regras: "correta" é o índice (0 a 3) da alternativa certa; varie a posição da correta entre as questões; não escreva letras (A, B...) dentro das alternativas.';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODELO_IA + ':generateContent?key=' + encodeURIComponent(key);
  const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.5, responseMimeType: 'application/json' } };
  let ult = '';
  for (let tent = 0; tent < 3; tent++) {
    const r = UrlFetchApp.fetch(url, { method: 'post', contentType: 'application/json', payload: JSON.stringify(body), muteHttpExceptions: true });
    if (r.getResponseCode() !== 200) { ult = 'IA respondeu ' + r.getResponseCode(); Utilities.sleep(2000 * (tent + 1)); continue; }
    try {
      const j = JSON.parse(r.getContentText());
      const txt = j.candidates[0].content.parts.map(x => x.text || '').join('');
      const o = JSON.parse(txt.match(/\{[\s\S]*\}/)[0]);
      return validarRecomp_(o.questoes, c);
    } catch (e) { ult = String(e.message || e); }
  }
  throw new Error('Não foi possível gerar as questões: ' + ult);
}

function validarRecomp_(Q, c) {
  if (!Array.isArray(Q)) throw new Error('formato inválido');
  const obj = Q.filter(q => q && q.tipo === 'obj'), dis = Q.filter(q => q && q.tipo === 'dis');
  if (obj.length < RECOMP_N_OBJ || dis.length < RECOMP_N_DIS) throw new Error('faltam questões (' + obj.length + ' obj, ' + dis.length + ' dis)');
  const limpa = s => String(s || '').replace(/^\s*[A-Da-d][\)\.]\s+/, '').trim();
  const O = obj.slice(0, RECOMP_N_OBJ).map(q => {
    const alts = (q.alts || []).slice(0, 4).map(limpa);
    const cor = Number(q.correta);
    if (alts.length !== 4 || !(cor >= 0 && cor <= 3) || !q.enunciado) throw new Error('objetiva incompleta');
    return { tipo: 'obj', enunciado: String(q.enunciado), comando: String(q.comando || ''), alts, correta: cor, explicacao: String(q.explicacao || '') };
  });
  const D = dis.slice(0, RECOMP_N_DIS).map(q => {
    if (!q.enunciado) throw new Error('dissertativa incompleta');
    return { tipo: 'dis', enunciado: String(q.enunciado), comando: String(q.comando || ''), ref: String(q.ref || ''), conceitos: (q.conceitos || []).map(String).slice(0, 4) };
  });
  return O.concat(D).map(q => Object.assign(q, { hab: c.hab, saresp: c.desc }));
}

/* GET ?api=recomp&k=... -> dados públicos (sem gabarito) */
function recompPub_(k) {
  const c = recompCat_(k), Q = recompQuestoes_(k, true);
  return {
    ok: true, nome: c.nome, desc: c.desc, serie: c.serie, hab: c.hab, bim: c.bim,
    turmas: TURMAS_CFG.filter(t => t.serie === c.serie).map(t => ({ id: t.id, escola: t.escola })),
    questoes: Q.map(q => ({ tipo: q.tipo, enunciado: q.enunciado, comando: q.comando, alts: q.tipo === 'obj' ? q.alts : [] }))
  };
}

/* POST {acao:'enviarRecomp', k, turma, nome, ra, respostas} */
function enviarRecomp_(p) {
  const c = recompCat_(p.k), t = cfg_(p.turma);
  if (t.serie !== c.serie) throw new Error('Esta atividade é de outra série');
  const a = alunos_(p.turma).find(x => x.nome === p.nome);
  if (!a) throw new Error('Aluno não encontrado nesta turma');
  if (!Array.isArray(p.respostas)) throw new Error('Respostas inválidas');
  const Q = recompQuestoes_(p.k, false); if (!Q) throw new Error('Atividade ainda não preparada');
  let ac = 0; const obj = [], dis = [];
  Q.forEach((q, i) => {
    const r = p.respostas[i];
    if (q.tipo === 'obj') {
      if (r === null || r === undefined || r === '') { obj.push(''); return; }
      const ok = Number(r) === q.correta; if (ok) ac++;
      obj.push('ABCD'[Number(r)] + (ok ? ' ✓' : ' ✗'));
    } else dis.push({ q, texto: String(r || '').trim().slice(0, 3000) });
  });
  let status = 'corrigido pela IA';
  const corr = dis.map(d => {
    if (!d.texto) return { nota: 0, comentario: 'Sem resposta.' };
    try { return corrigirIA_(d.q, d.texto); } catch (e) { status = 'pendente: ' + String(e.message || e).slice(0, 120); return { nota: '', comentario: '' }; }
  });
  const notaDis = corr.every(x => x.nota !== '') ? Math.round(corr.reduce((s, x) => s + Number(x.nota), 0) * 10) / 10 : '';
  const notaFinal = notaDis === '' ? '' : Math.round((ac + notaDis) * 10) / 10;          // 5 + 5 = 10
  const linha = [new Date(), c.nome, c.desc, a.n, a.nome, a.ra || String(p.ra || '').replace(/[^\dXx-]/g, '').slice(0, 14)].concat(obj);
  dis.forEach((d, i) => linha.push(d.texto, corr[i].nota, corr[i].comentario));
  linha.push(ac + '/' + RECOMP_N_OBJ, notaDis, notaFinal, status, p.k);
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { recompAbaTurma_(p.turma).appendRow(linha); } finally { lock.releaseLock(); }
  return { ok: true, acertos: ac, total: RECOMP_N_OBJ, notasDis: corr.map(x => x.nota), notaFinal,
    gabarito: Q.filter(q => q.tipo === 'obj').map(q => ({ correta: q.correta, explicacao: q.explicacao })) };
}

function recompAbaTurma_(turmaId) {
  const ss = SpreadsheetApp.openById(RECOMP_PLANILHA_ID), nome = recompAba_(turmaId);
  let sh = ss.getSheetByName(nome); if (sh) return sh;
  sh = ss.insertSheet(nome);
  const cab = ['Data/hora', 'Atividade', 'Descritor', 'Nº', 'Nome', 'RA'];
  for (let i = 1; i <= RECOMP_N_OBJ; i++) cab.push('Q' + i);
  for (let i = RECOMP_N_OBJ + 1; i <= RECOMP_N_OBJ + RECOMP_N_DIS; i++) cab.push('Q' + i + ' resposta', 'Q' + i + ' nota IA (0–1)', 'Q' + i + ' comentário IA');
  cab.push('Acertos objetivas', 'Nota dissertativas (0–5)', 'Nota final (0–10)', 'Correção IA', 'Chave');
  sh.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold').setBackground('#145A32').setFontColor('#FFFFFF').setWrap(true);
  sh.setFrozenRows(1); sh.setFrozenColumns(5); sh.setColumnWidth(2, 180); sh.setColumnWidth(3, 260); sh.setColumnWidth(5, 260);
  const o1 = 7, d1 = o1 + RECOMP_N_OBJ;
  const rgObj = sh.getRange(2, o1, 999, RECOMP_N_OBJ);
  const notas = []; for (let k = 0; k < RECOMP_N_DIS; k++) { notas.push(sh.getRange(2, d1 + k * 3 + 1, 999, 1)); sh.setColumnWidth(d1 + k * 3, 240); sh.setColumnWidth(d1 + k * 3 + 2, 240); }
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('✓').setBackground('#1E63B5').setFontColor('#FFFFFF').setBold(true).setRanges([rgObj]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('✗').setBackground('#C62828').setFontColor('#FFFFFF').setBold(true).setRanges([rgObj]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThanOrEqualTo(0.7).setBackground('#1E63B5').setFontColor('#FFFFFF').setBold(true).setRanges(notas).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberBetween(0.4, 0.69).setBackground('#F9A825').setBold(true).setRanges(notas).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberLessThanOrEqualTo(0.3).setBackground('#C62828').setFontColor('#FFFFFF').setBold(true).setRanges(notas).build()
  ]);
  return sh;
}

/* Rode no editor: cria as abas das 11 turmas e gera (aos poucos) as questões de todas as atividades. */
function gerarTodasRecomp() {
  TURMAS_CFG.forEach(t => recompAbaTurma_(t.id));
  const ini = Date.now(); let n = 0, falhas = 0;
  for (const k of Object.keys(RECOMP_CAT)) {
    if (Date.now() - ini > 4.5 * 60 * 1000) { Logger.log('Tempo esgotado: rode de novo para continuar.'); break; }
    try { if (recompQuestoes_(k, false)) continue; recompQuestoes_(k, true); n++; Logger.log('OK: ' + RECOMP_CAT[k].nome); }
    catch (e) { falhas++; Logger.log('Falhou: ' + RECOMP_CAT[k].nome + ' — ' + e.message); }
  }
  Logger.log(n + ' atividades geradas agora; ' + falhas + ' falhas; total no catálogo: ' + Object.keys(RECOMP_CAT).length);
}
