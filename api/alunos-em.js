/* Lista de alunos da turma (Ensino Médio): Nº de chamada, nome e RA mascarado. O RA completo nunca sai do servidor. */
const ALUNOS = require('./_alunos-em.js');

module.exports = function alunosEM(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, erro: 'Use GET.' });
  }
  const turma = String((req.query && req.query.turma) || '');
  if (!Object.prototype.hasOwnProperty.call(ALUNOS, turma)) return res.status(404).json({ ok: false, erro: 'Turma desconhecida.' });
  return res.status(200).json({
    ok: true,
    alunos: ALUNOS[turma].map(a => ({ n: a.n, nome: a.nome, ra: '•••' + a.ra.slice(-3) }))
  });
};
