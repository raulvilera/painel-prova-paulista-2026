/* Encerramento de turmas do Ensino Médio. Horário de Brasília (UTC-3). */
const ENCERRAMENTO = {
  '3f-noite': Date.parse('2026-11-03T23:00:00-03:00')   // 3ª Série F Noite: bloqueada a partir das 23h de 03/11/2026
};
const MENSAGEM = 'Esta atividade foi encerrada para a 3ª Série F às 23h de 03/11/2026.';
function bloqueada(turma) {
  const t = ENCERRAMENTO[String(turma || '')];
  return typeof t === 'number' && Date.now() >= t;
}
module.exports = { bloqueada, MENSAGEM };
