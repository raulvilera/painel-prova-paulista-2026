/* Quadro de entregas (painel do professor): devolve, de todas as abas 'Personalizada · <turma>',
   quem enviou a atividade personalizada, quando e quantas acertou. Exige a senha EM_SEGREDO. Não altera nada.

   COMO INSTALAR no Apps Script (arquivo único, o que já tem PERSONALIZADAS_EM):
   1. No doPost, junto das outras linhas "if (p.acao === ...)", acrescente:
        if (p.acao === 'resultadosPers') return json_(resultadosPers_(p));   // quadro de entregas (somente leitura)
   2. Cole a função abaixo no FINAL do arquivo.
   3. Implantar → Gerenciar implantações → lápis → Nova versão → Implantar. */
function resultadosPers_(p) {
  const segredo = PropertiesService.getScriptProperties().getProperty('EM_SEGREDO');
  if (!segredo || String(p.segredo || '') !== segredo) throw new Error('não autorizado');
  const prefixo = 'Personalizada · ', n = 10, rows = [];
  SpreadsheetApp.openById(PLANILHA_ID).getSheets().forEach(function (sh) {
    const aba = sh.getName();
    if (aba.indexOf(prefixo) !== 0 || sh.getLastRow() < 2) return;
    sh.getRange(2, 1, sh.getLastRow() - 1, 4 + n * 2).getValues().forEach(function (r) {
      if (!r[2]) return;   // colunas: Data/hora, Turma, Nome, Componente, depois "resposta" e "situação" de cada questão
      let ac = 0;
      for (let i = 0; i < n; i++) if (String(r[5 + i * 2]) === 'Certo') ac++;
      rows.push({ criado: r[0] instanceof Date ? r[0].toISOString() : String(r[0] || ''), turma: String(r[1] || aba.slice(prefixo.length)),
        nome: String(r[2]), componente: String(r[3] || ''), acertos: ac, total: n });
    });
  });
  return { ok: true, rows: rows };
}
