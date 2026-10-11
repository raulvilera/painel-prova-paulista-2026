/* ======================================================================
   ATIVIDADE INDIVIDUAL (Ensino Fundamental)
   - O painel calcula, para cada aluno, até 3 descritores prioritários (a partir
     dos níveis dos bimestres 1, 2 e 3) e gera linhas para a aba "Plano individual"
     desta planilha (privada: o plano NÃO fica no site público).
   - A página do aluno (/atividade-individual/) pede só turma e nome e recebe
     as questões desses descritores, tiradas da aba "Banco" (as mesmas das
     atividades de recomposição). Só entram descritores LIBERADOS por você:
     na aba Banco, coluna F "Liberada", escreva sim (ou rode liberarBancoIndiv()
     depois de conferir tudo).
   - O que o aluno recebe NUNCA inclui o nível dele nem o gabarito.
   - Respostas: aba "Atividades individuais".
   Passo a passo no editor:
     1) cole as linhas do painel na aba "Plano individual" (A1)
     2) rode gerarBancoPlano()  (gera as questões que faltam; rode de novo se parar)
     3) confira a aba Banco; rode liberarBancoIndiv() (ou marque "sim" na coluna F)
   ====================================================================== */
const ABA_PLANO = 'Plano individual', ABA_INDIV = 'Atividades individuais';
// Plano individual: A Turma | B Nome | C Chave1 | D Nível1 | E Chave2 | F Nível2 | G Chave3 | H Nível3 | I Resumo (só para o professor)

function normNome_(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase(); }

function planoAba_() {
  const ss = SpreadsheetApp.openById(RECOMP_PLANILHA_ID);
  let sh = ss.getSheetByName(ABA_PLANO);
  if (!sh) {
    sh = ss.insertSheet(ABA_PLANO);
    sh.getRange(1, 1, 1, 9).setValues([['Turma', 'Nome', 'Descritor 1 (chave)', 'Nível 1', 'Descritor 2 (chave)', 'Nível 2', 'Descritor 3 (chave)', 'Nível 3', 'Resumo (só professor)']])
      .setFontWeight('bold').setBackground('#145A32').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  }
  return sh;
}

function planoDe_(turma, nome) {
  const cache = CacheService.getScriptCache(), ck = 'pl_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, turma + '|' + normNome_(nome)));
  const c = cache.get(ck); if (c) return JSON.parse(c);
  const sh = planoAba_(); if (sh.getLastRow() < 2) return [];
  const alvo = normNome_(nome), v = sh.getRange(2, 1, sh.getLastRow() - 1, 8).getValues();
  const r = v.find(x => String(x[0]).trim() === turma && normNome_(x[1]) === alvo);
  const out = [];
  if (r) for (let i = 0; i < 3; i++) if (r[2 + i * 2]) out.push({ k: String(r[2 + i * 2]).trim(), nivel: Math.max(0, Math.min(3, Number(r[3 + i * 2]) || 0)) });
  cache.put(ck, JSON.stringify(out), 600);
  return out;
}

function bancoLiberado_() {
  const sh = recompBanco_();
  if (sh.getLastRow() < 2) return {};
  if (!String(sh.getRange(1, 6).getValue())) sh.getRange(1, 6).setValue('Liberada (sim) p/ atividade individual').setFontWeight('bold').setBackground('#145A32').setFontColor('#FFFFFF');
  const v = sh.getRange(2, 1, sh.getLastRow() - 1, 6).getValues(), o = {};
  v.forEach(r => { o[r[0]] = /^\s*sim\s*$/i.test(String(r[5])); });
  return o;
}

/* Quais questões cada nível recebe: 0 = reconhecer; 1 = aplicar; 2–3 = analisar. */
const INDIV_ESCOLHA = { 0: { obj: [0, 1], dis: [0] }, 1: { obj: [2, 3], dis: [2] }, 2: { obj: [3, 4], dis: [3] }, 3: { obj: [3, 4], dis: [4] } };

/* Itens completos (com gabarito) — só no servidor. */
function indivItens_(turma, nome) {
  const plano = planoDe_(turma, nome); if (!plano.length) return { plano: false, itens: [] };
  const lib = bancoLiberado_(), itens = [];
  plano.forEach(p => {
    if (!RECOMP_CAT[p.k] || !lib[p.k]) return;
    const Q = recompQuestoes_(p.k, false); if (!Q) return;
    const objs = Q.filter(q => q.tipo === 'obj'), diss = Q.filter(q => q.tipo === 'dis'), e = INDIV_ESCOLHA[p.nivel] || INDIV_ESCOLHA[0];
    e.obj.forEach(i => { if (objs[i]) itens.push({ k: p.k, desc: RECOMP_CAT[p.k].desc, q: objs[i] }); });
    e.dis.forEach(i => { if (diss[i]) itens.push({ k: p.k, desc: RECOMP_CAT[p.k].desc, q: diss[i] }); });
  });
  return { plano: true, itens };
}

/* GET ?api=meuplano&id=<turma>&nome=<nome> */
function indivPub_(turma, nome) {
  cfg_(turma);
  const a = alunos_(turma).find(x => normNome_(x.nome) === normNome_(nome));
  if (!a) throw new Error('Aluno não encontrado nesta turma');
  const r = indivItens_(turma, a.nome);
  let aviso = '';
  if (!r.plano) aviso = 'Ainda não há atividade individual para você. Fale com o professor.';
  else if (!r.itens.length) aviso = 'Sua atividade individual ainda não foi liberada pelo professor.';
  return { ok: true, nome: a.nome, aviso, itens: r.itens.map(it => ({
    desc: it.desc, tipo: it.q.tipo, enunciado: it.q.enunciado, comando: it.q.comando, alts: it.q.tipo === 'obj' ? it.q.alts : [] })) };
}

/* POST {acao:'enviarIndiv', turma, nome, respostas:[...]} */
function enviarIndiv_(p) {
  cfg_(p.turma);
  const a = alunos_(p.turma).find(x => normNome_(x.nome) === normNome_(p.nome));
  if (!a) throw new Error('Aluno não encontrado nesta turma');
  if (!Array.isArray(p.respostas)) throw new Error('Respostas inválidas');
  const r = indivItens_(p.turma, a.nome); if (!r.itens.length) throw new Error('Atividade ainda não liberada');
  let ac = 0, nObj = 0, soma = 0; const det = [], gab = [], notas = []; let status = 'corrigido pela IA';
  r.itens.forEach((it, i) => {
    const q = it.q, x = p.respostas[i];
    if (q.tipo === 'obj') {
      nObj++;
      if (x === null || x === undefined || x === '') { det.push('Q' + (i + 1) + ': —'); gab.push({ correta: q.correta, explicacao: q.explicacao }); return; }
      const ok = Number(x) === q.correta; if (ok) { ac++; soma += 1; }
      det.push('Q' + (i + 1) + ': ' + 'ABCD'[Number(x)] + (ok ? ' ✓' : ' ✗'));
      gab.push({ correta: q.correta, explicacao: q.explicacao });
    } else {
      const t = String(x || '').trim().slice(0, 3000);
      let c;
      if (!t) c = { nota: 0, comentario: 'Sem resposta.' };
      else { try { c = corrigirIA_(q, t); } catch (e) { status = 'pendente: ' + String(e.message || e).slice(0, 100); c = { nota: '', comentario: '' }; } }
      if (c.nota !== '') soma += Number(c.nota);
      notas.push(c.nota);
      det.push('Q' + (i + 1) + ' (dissertativa): ' + t + ' → nota IA ' + c.nota + ' · ' + c.comentario);
    }
  });
  const nota = status === 'corrigido pela IA' ? Math.round(soma / r.itens.length * 100) / 10 : '';
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.openById(RECOMP_PLANILHA_ID);
    let sh = ss.getSheetByName(ABA_INDIV);
    if (!sh) {
      sh = ss.insertSheet(ABA_INDIV);
      sh.getRange(1, 1, 1, 9).setValues([['Data/hora', 'Turma', 'Nº', 'Nome', 'Descritores trabalhados', 'Acertos objetivas', 'Nota final (0–10)', 'Correção IA', 'Respostas e comentários']])
        .setFontWeight('bold').setBackground('#145A32').setFontColor('#FFFFFF');
      sh.setFrozenRows(1); sh.setColumnWidth(5, 300); sh.setColumnWidth(9, 500);
    }
    const descr = []; r.itens.forEach(it => { if (descr.indexOf(it.desc) < 0) descr.push(it.desc); });
    sh.appendRow([new Date(), p.turma, a.n, a.nome, descr.join(' | '), ac + '/' + nObj, nota, status, det.join('\n')]);
  } finally { lock.releaseLock(); }
  return { ok: true, acertos: ac, total: nObj, notasDis: notas, notaFinal: nota, gabarito: gab };
}

/* ---- rotinas para o professor (rodar no editor) ---- */
function chavesDoPlano_() {
  const sh = planoAba_(); if (sh.getLastRow() < 2) return [];
  const v = sh.getRange(2, 1, sh.getLastRow() - 1, 8).getValues(), s = {};
  v.forEach(r => [2, 4, 6].forEach(c => { if (r[c] && RECOMP_CAT[String(r[c]).trim()]) s[String(r[c]).trim()] = 1; }));
  return Object.keys(s);
}

function gerarBancoPlano() {
  const ks = chavesDoPlano_(), ini = Date.now(); let n = 0, falhas = 0;
  for (const k of ks) {
    if (Date.now() - ini > 4.5 * 60 * 1000) { Logger.log('Tempo esgotado: rode de novo para continuar.'); break; }
    try { if (recompQuestoes_(k, false)) continue; recompQuestoes_(k, true); n++; } catch (e) { falhas++; Logger.log('Falhou: ' + RECOMP_CAT[k].nome + ' — ' + e.message); }
  }
  Logger.log(ks.length + ' descritores no plano; ' + n + ' gerados agora; ' + falhas + ' falhas. Confira a aba Banco e rode liberarBancoIndiv().');
}

/* Marca "sim" na coluna F do Banco para os descritores do plano (depois da sua conferência). */
function liberarBancoIndiv() {
  const ks = {}; chavesDoPlano_().forEach(k => ks[k] = 1);
  const sh = recompBanco_(); if (sh.getLastRow() < 2) return;
  bancoLiberado_();
  const ch = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
  let n = 0;
  ch.forEach((r, i) => { if (ks[r[0]]) { sh.getRange(i + 2, 6).setValue('sim'); n++; } });
  Logger.log(n + ' descritores liberados para a atividade individual.');
}
