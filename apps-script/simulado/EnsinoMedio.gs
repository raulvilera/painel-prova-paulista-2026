/* ======================================================================
   AVALIAÇÕES AUTORAIS · ENSINO MÉDIO (Biologia e Química, 2ª e 3ª séries)
   - A página fica em simulado-saresp-ciencias-2026.vercel.app/ensino-medio/.
   - Quem corrige as 12 objetivas é a função /api/corrigir-em (Vercel), que guarda
     o gabarito. Depois de corrigir, ela chama este script (servidor → servidor)
     com a senha EM_SEGREDO e este script grava uma linha na aba da avaliação.
   - Uma aba por avaliação: "EM · bio-2-paulista", "EM · qui-3-provao" etc.
   - Dissertativas: o texto do aluno fica na planilha e o PROFESSOR preenche as notas.
   - Configuração (uma vez): Configurações do projeto → Propriedades do script →
     EM_SEGREDO = uma senha longa (a mesma da variável EM_SEGREDO na Vercel).
   ====================================================================== */
const EM_PREFIXO_ABA = 'EM · ';
const EM_N_OBJ = 12, EM_N_DIS = 2;
const EM_COL = { data: 1, turma: 2, componente: 3, prova: 4, nome: 5, obj: 6 };   // Q1..Q12 em F..Q
const EM_COL_FIM_OBJ = EM_COL.obj + EM_N_OBJ;                                      // R: acertos
const EM_COL_DIS = EM_COL_FIM_OBJ + 2;                                             // T: Q13 resposta, U: Q13 nota, V: Q14 ...
const EM_COL_OBS = EM_COL_DIS + EM_N_DIS * 2;

/* Evita que um texto digitado pelo aluno seja interpretado como fórmula pela planilha. */
function emSeguro_(valor) {
  const s = String(valor == null ? '' : valor);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function emValidar_(p) {
  const segredo = PropertiesService.getScriptProperties().getProperty('EM_SEGREDO');
  if (!segredo) throw new Error('EM_SEGREDO não configurada nas propriedades do script');
  if (String(p.segredo || '') !== segredo) throw new Error('não autorizado');
  if (!/^(bio|qui)-[23]-(paulista|provao)$/.test(String(p.avaliacao || ''))) throw new Error('avaliação inválida');
  if (!/^[A-Za-z0-9-]{8,64}$/.test(String(p.envioId || ''))) throw new Error('envioId inválido');
  const letras = (v) => Array.isArray(v) && v.length === EM_N_OBJ && v.every(x => /^[A-E]$/.test(String(x)));
  if (!letras(p.respostas) || !letras(p.gabarito)) throw new Error('respostas inválidas');
  if (!Array.isArray(p.dissertativas) || p.dissertativas.length !== EM_N_DIS) throw new Error('dissertativas inválidas');
  const nome = String(p.nome || '').trim();
  if (nome.length < 3 || nome.length > 120) throw new Error('nome inválido');
  ['turma', 'componente', 'prova'].forEach(k => { if (!String(p[k] || '').trim() || String(p[k]).length > 80) throw new Error(k + ' inválido'); });
}

/* Chamado por doPost (acao: 'enviarEM'). */
function enviarEM_(p) {
  emValidar_(p);
  const cache = CacheService.getScriptCache(), chave = 'em_' + p.envioId;
  if (cache.get(chave)) return { ok: true, repetido: true };           // reenvio do mesmo envio: não duplica a linha
  const linha = [new Date(), emSeguro_(p.turma), emSeguro_(p.componente), emSeguro_(p.prova), emSeguro_(String(p.nome).trim())]
    .concat(p.respostas.map(String));
  linha.push(Number(p.acertos), Number(p.notaObjetiva));
  p.dissertativas.forEach(texto => linha.push(emSeguro_(String(texto).slice(0, 3000)), ''));   // resposta + nota (professor)
  linha.push('');
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (cache.get(chave)) return { ok: true, repetido: true };
    emAba_(p.avaliacao, p.gabarito).appendRow(linha);
    cache.put(chave, '1', 21600);
  } finally { lock.releaseLock(); }
  return { ok: true };
}

function emAba_(avaliacao, gabarito) {
  const ss = SpreadsheetApp.openById(PLANILHA_ID);
  const nome = EM_PREFIXO_ABA + avaliacao;
  let sh = ss.getSheetByName(nome);
  if (sh) return sh;
  sh = ss.insertSheet(nome);
  const cab = ['Data/hora', 'Turma', 'Componente', 'Prova', 'Nome'], gab = ['GABARITO', '', '', '', ''];
  gabarito.forEach((letra, i) => { cab.push('Q' + (i + 1)); gab.push(letra); });
  cab.push('Acertos objetivas (de ' + EM_N_OBJ + ')', 'Nota objetivas (0–10)');
  gab.push('', '');
  for (let k = 0; k < EM_N_DIS; k++) {
    cab.push('Q' + (EM_N_OBJ + k + 1) + ' resposta', 'Q' + (EM_N_OBJ + k + 1) + ' nota (professor)');
    gab.push('', '');
  }
  cab.push('Observações do professor');
  gab.push('');
  sh.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold').setBackground('#145A32').setFontColor('#FFFFFF').setWrap(true);
  sh.getRange(2, 1, 1, cab.length).setValues([gab]).setFontStyle('italic').setBackground('#EEEEEE');
  sh.setFrozenRows(2); sh.setFrozenColumns(5);
  sh.setColumnWidth(EM_COL.nome, 260);
  for (let k = 0; k < EM_N_DIS; k++) sh.setColumnWidth(EM_COL_DIS + k * 2, 320);
  sh.setColumnWidth(EM_COL_OBS, 260);
  const faixa = sh.getRange(3, EM_COL.obj, 998, EM_N_OBJ), c = 'F';
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(' + c + '3<>"",' + c + '3=' + c + '$2)')
      .setBackground('#1E63B5').setFontColor('#FFFFFF').setBold(true).setRanges([faixa]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(' + c + '3<>"",' + c + '3<>' + c + '$2)')
      .setBackground('#C62828').setFontColor('#FFFFFF').setBold(true).setRanges([faixa]).build()
  ]);
  return sh;
}
