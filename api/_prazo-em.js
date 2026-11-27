/* Encerramento de turmas do Ensino Médio. Horário de Brasília (UTC-3). */
const ENCERRAMENTO = {
  // 3ª Série F Noite: reaberta em 27/11/2026 (estava encerrada desde 03/11/2026 às 23h)
};
const MENSAGEM = 'Esta atividade foi encerrada para a 3ª Série F às 23h de 03/11/2026.';
function bloqueada(turma) {
  const t = ENCERRAMENTO[String(turma || '')];
  return typeof t === 'number' && Date.now() >= t;
}
module.exports = { bloqueada, MENSAGEM };
