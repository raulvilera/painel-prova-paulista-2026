/**
 * Atividades com imagens das aulas — Painel Prova Paulista 2026
 * E.E. PROFª WANDA MASCAGNI DE SÁ · Prof. Raul
 *
 * Script VINCULADO à planilha de respostas (Extensões > Apps Script).
 * - doPost: chamado pelo painel (com token) para extrair imagens dos slides e publicar atividades.
 * - doGet:  página da atividade para os alunos (Turma → Nome → Nº).
 * - enviar: grava as respostas na aba da atividade, com azul (correta) e vermelho (incorreta).
 *
 * Primeira vez: rode a função configurar() no editor e copie o TOKEN que aparece no registro.
 */

const ESCOLA = 'E.E. PROFª WANDA MASCAGNI DE SÁ';
const AZUL = '#1E63B5', VERMELHO = '#C62828';
const P = PropertiesService.getScriptProperties();

/* ---------- configuração (rodar uma vez no editor) ---------- */
function configurar() {
  let tok = P.getProperty('TOKEN');
  if (!tok) { tok = Utilities.getUuid().replace(/-/g, ''); P.setProperty('TOKEN', tok); }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  P.setProperty('PLANILHA', ss.getId());
  if (!P.getProperty('PASTA')) {
    const f = DriveApp.createFolder('Atividades com imagens - Painel PP 2026');
    P.setProperty('PASTA', f.getId());
  }
  const s0 = ss.getSheets()[0];
  if (!ss.getSheetByName('Atividades') && s0.getRange(1, 1).getValue() === 'ID') s0.setName('Atividades');
  aba_('Atividades', ['ID', 'Criada em', 'Turma(s)', 'Componente', 'Aula', 'Título', 'Link para os alunos', 'Respostas']);
  Logger.log('TOKEN (cole no painel): ' + tok);
  Logger.log('Pasta das imagens: https://drive.google.com/drive/folders/' + P.getProperty('PASTA'));
  return tok;
}

/* ---------- utilidades ---------- */
function ss_() { return SpreadsheetApp.openById(P.getProperty('PLANILHA')); }
function pasta_() { return DriveApp.getFolderById(P.getProperty('PASTA')); }
function aba_(nome, cab) {
  const ss = P.getProperty('PLANILHA') ? ss_() : SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(nome);
  if (!sh) {
    sh = ss.insertSheet(nome);
    if (cab) { sh.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold').setBackground('#E8F0E8'); sh.setFrozenRows(1); }
  }
  return sh;
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function salvarJson_(nome, obj) {
  const pa = pasta_(), it = pa.getFilesByName(nome);
  const txt = JSON.stringify(obj);
  if (it.hasNext()) { const f = it.next(); f.setContent(txt); return f.getId(); }
  return pa.createFile(nome, txt, 'application/json').getId();
}
function lerJson_(nome) {
  const it = pasta_().getFilesByName(nome);
  return it.hasNext() ? JSON.parse(it.next().getBlob().getDataAsString()) : null;
}

/* ---------- API do painel ---------- */
function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents || '{}');
    if (!b.token || b.token !== P.getProperty('TOKEN')) return json_({ ok: false, erro: 'Token inválido. Confira o token no painel.' });
    if (b.acao === 'ping') return json_({ ok: true, escola: ESCOLA, planilha: ss_().getUrl() });
    if (b.acao === 'extrair') return json_(extrair_(b.deckId, !!b.refazer));
    if (b.acao === 'img') return json_({ ok: true, id: b.id, src: imagemB64_(b.id, b.sz || 360) });
    if (b.acao === 'publicar') return json_(publicar_(b.atividade));
    if (b.acao === 'lista') return json_(lista_());
    return json_({ ok: false, erro: 'Ação desconhecida' });
  } catch (err) {
    return json_({ ok: false, erro: String(err && err.message || err) });
  }
}

/* Converte o .pptx da aula em Google Apresentações (uma vez) e extrai imagens + textos de cada slide. */
function extrair_(deckId, refazer) {
  const cacheNome = 'slides_' + deckId + '.json';
  if (!refazer) { const c = lerJson_(cacheNome); if (c) return c; }
  let presId = P.getProperty('conv_' + deckId);
  if (!presId || refazer) {
    const orig = DriveApp.getFileById(deckId);
    const copia = Drive.Files.copy(
      { name: '[conv] ' + orig.getName(), mimeType: 'application/vnd.google-apps.presentation', parents: [P.getProperty('PASTA')] },
      deckId, { supportsAllDrives: true });
    presId = copia.id; P.setProperty('conv_' + deckId, presId);
  }
  const pres = SlidesApp.openById(presId), slides = pres.getSlides();
  const vistos = {}, brutos = [];
  slides.forEach((sl, i) => {
    const textos = [];
    sl.getShapes().forEach(sh => { try { const t = sh.getText().asString().trim(); if (t) textos.push(t); } catch (x) {} });
    sl.getTables().forEach(tb => { for (let r = 0; r < tb.getNumRows(); r++) for (let c = 0; c < tb.getNumColumns(); c++) { const t = tb.getCell(r, c).getText().asString().trim(); if (t) textos.push(t); } });
    let nota = '';
    try { nota = sl.getNotesPage().getSpeakerNotesShape().getText().asString().trim(); } catch (x) {}
    sl.getImages().forEach((im, k) => {
      const w = im.getWidth(), h = im.getHeight();
      if (w < 90 || h < 60) return;                       // ícones e logotipos pequenos
      let blob; try { blob = im.getBlob(); } catch (x) { return; }
      const bytes = blob.getBytes(); if (bytes.length < 9000) return;
      const md5 = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, bytes));
      vistos[md5] = (vistos[md5] || 0) + 1;
      brutos.push({ slide: i + 1, k: k, md5: md5, blob: blob, w: Math.round(w), h: Math.round(h), textos: textos, nota: nota.slice(0, 600) });
    });
  });
  // remove imagens repetidas em vários slides (fundo, marca, mascote)
  const pa = pasta_(), out = [], usados = {};
  brutos.forEach(b => {
    if (vistos[b.md5] > 2 || usados[b.md5]) return; usados[b.md5] = 1;
    const ext = (b.blob.getContentType() || 'image/png').split('/')[1].replace('jpeg', 'jpg');
    const f = pa.createFile(b.blob.setName(deckId.slice(0, 8) + '_s' + b.slide + '_' + b.k + '.' + ext));
    out.push({ fid: f.getId(), slide: b.slide, w: b.w, h: b.h, textos: b.textos, nota: b.nota });
  });
  const res = { ok: true, deckId: deckId, presId: presId, total: slides.length, itens: out };
  salvarJson_(cacheNome, res);
  return res;
}

/* Imagem reduzida em base64 (via miniatura do Drive; cai para o original se a miniatura ainda não existir). */
function imagemB64_(fid, sz) {
  try {
    const m = Drive.Files.get(fid, { fields: 'thumbnailLink,mimeType,size' });
    if (m.thumbnailLink) {
      const u = m.thumbnailLink.replace(/=s\d+$/, '') + '=s' + sz;
      const r = UrlFetchApp.fetch(u, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true });
      if (r.getResponseCode() === 200) { const bl = r.getBlob(); return 'data:' + (bl.getContentType() || 'image/png') + ';base64,' + Utilities.base64Encode(bl.getBytes()); }
    }
  } catch (x) {}
  const bl = DriveApp.getFileById(fid).getBlob();
  return 'data:' + bl.getContentType() + ';base64,' + Utilities.base64Encode(bl.getBytes());
}

/* Publica a atividade montada no painel. O gabarito fica só no servidor. */
function publicar_(a) {
  if (!a || !a.questoes || !a.questoes.length) return { ok: false, erro: 'Atividade vazia' };
  const id = 'A' + Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyMMddHHmmss');
  a.id = id; a.criada = new Date().toISOString();
  salvarJson_('atividade_' + id + '.json', a);
  const cab = ['Data/hora', 'Turma', 'Nº', 'Nome'];
  a.questoes.forEach((q, i) => cab.push('Q' + (i + 1) + (q.tipo === 'obj' ? ' (obj.)' : ' (diss.)')));
  cab.push('Acertos (objetivas)');
  const sh = aba_('R_' + id, cab);
  sh.getRange(2, 1, 1, cab.length).setValues([cab.map((c, i) => i === 3 ? 'GABARITO' : i < 4 ? '' : (a.questoes[i - 4] ? (a.questoes[i - 4].tipo === 'obj' ? 'ABCDE'[a.questoes[i - 4].correta] : '—') : ''))]).setFontStyle('italic').setBackground('#F1F1F1');
  const link = ScriptApp.getService().getUrl() + '?a=' + id;
  aba_('Atividades').appendRow([id, new Date(), (a.turmas || []).map(t => t.turma).join(', '), a.comp, a.aula, a.titulo, link, 0]);
  return { ok: true, id: id, link: link, planilha: ss_().getUrl() + '#gid=' + sh.getSheetId() };
}

function lista_() {
  const sh = aba_('Atividades'), v = sh.getDataRange().getValues().slice(1);
  return { ok: true, itens: v.map(r => ({ id: r[0], criada: r[1], turmas: r[2], comp: r[3], aula: r[4], titulo: r[5], link: r[6], resp: r[7] })) };
}

/* ---------- página do aluno ---------- */
function doGet(e) {
  const id = e && e.parameter && e.parameter.a;
  const a = id ? lerJson_('atividade_' + id + '.json') : null;
  if (!a) return HtmlService.createHtmlOutput('<p style="font-family:sans-serif;padding:24px">Atividade não encontrada. Confira o link com o professor.</p>');
  const t = HtmlService.createTemplateFromFile('Atividade');
  t.escola = ESCOLA;
  t.dados = JSON.stringify(publicavel_(a)).replace(/</g, '\\u003c');
  return t.evaluate().setTitle(a.titulo || 'Atividade').addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function publicavel_(a) { // sem gabarito
  return {
    id: a.id, titulo: a.titulo, comp: a.comp, serie: a.serie, aula: a.aula, tema: a.tema, turmas: a.turmas,
    questoes: a.questoes.map(q => ({ tipo: q.tipo, grupo: q.grupo, hab: q.hab, enunciado: q.enunciado, comando: q.comando, alts: q.alts || [], temImg: !!q.img }))
  };
}
/* chamada pela página do aluno: só devolve imagens que pertencem à atividade */
function imagemQuestao(id, i) {
  const a = lerJson_('atividade_' + id + '.json'); if (!a) return '';
  const q = a.questoes[i]; if (!q || !q.img) return '';
  const k = 'img_' + q.img, c = CacheService.getScriptCache().get(k); if (c) return c;
  const src = imagemB64_(q.img, 900);
  if (src.length < 95000) CacheService.getScriptCache().put(k, src, 21600);
  return src;
}
function enviar(p) {
  const a = lerJson_('atividade_' + p.id + '.json'); if (!a) throw new Error('Atividade não encontrada');
  const tu = (a.turmas || []).find(t => t.turma === p.turma); if (!tu) throw new Error('Turma inválida');
  const al = tu.alunos.find(x => String(x.n) === String(p.n) && x.nome === p.nome); if (!al) throw new Error('Aluno não encontrado na turma');
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const sh = aba_('R_' + a.id);
    const linha = [new Date(), p.turma, al.n, al.nome], cores = [null, null, null, null], fontes = [null, null, null, null];
    let ac = 0, tot = 0;
    a.questoes.forEach((q, i) => {
      const r = p.respostas[i];
      if (q.tipo === 'obj') {
        tot++; const certo = r === q.correta; if (certo) ac++;
        linha.push(r == null || r === '' ? '' : 'ABCDE'[r]);
        cores.push(r == null || r === '' ? null : (certo ? AZUL : VERMELHO)); fontes.push(r == null || r === '' ? null : '#FFFFFF');
      } else { linha.push(String(r || '').slice(0, 2000)); cores.push(null); fontes.push(null); }
    });
    linha.push(ac + '/' + tot); cores.push(null); fontes.push(null);
    sh.appendRow(linha);
    const row = sh.getLastRow(), rg = sh.getRange(row, 1, 1, linha.length);
    rg.setBackgrounds([cores]); rg.setFontColors([fontes.map(f => f || '#000000')]);
    rg.offset(0, 4, 1, a.questoes.length).setFontWeight('bold');
    // contador na aba Atividades
    const at = aba_('Atividades'), ids = at.getRange(1, 1, at.getLastRow(), 1).getValues();
    for (let k = 0; k < ids.length; k++) if (ids[k][0] === a.id) { const c = at.getRange(k + 1, 8); c.setValue((+c.getValue() || 0) + 1); break; }
    return { ok: true, acertos: ac, total: tot };
  } finally { lock.releaseLock(); }
}
