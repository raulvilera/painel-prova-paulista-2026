/* Missão SARESP 3D · ligação entre o Simulado SARESP (Fundamental) e os temas/simuladores da Missão.
   Usado por api/quiz.js (painel do professor) e api/individual.js (relatório do aluno, com login RA + senha).
   Nenhum dado de aluno fica aqui. */
const META_SIM = require('./_meta-simulado.js');

/* questão do Simulado (série-índice) -> tema da trilha da Missão SARESP 3D */
const MAPA = {
  '6-0': '6-AE1', '6-1': '6-AE2', '6-2': '6-AE4', '6-3': '6-AE3', '6-4': '6-AE5', '6-5': '6-AE6', '6-6': '6-AE7', '6-7': '6-AE2', '6-8': '6-AE4', '6-9': '6-AE7',
  '7-0': '7-AE3', '7-1': '7-AE2', '7-2': '7-AE4', '7-3': '7-AE1', '7-4': '7-AE10', '7-5': '7-AE7', '7-6': '7-AE11', '7-7': '7-AE8', '7-8': '7-AE2', '7-9': '7-AE10',
  '8-0': '8-AE12', '8-1': '8-AE11', '8-2': '8-AE13', '8-3': '8-AE11', '8-4': '8-AE5', '8-5': '8-AE8', '8-6': '8-AE2', '8-7': '8-AE1', '8-8': '8-AE3', '8-9': '8-AE10',
  '9-0': '9-AE2', '9-1': '9-AE12', '9-2': '9-AE4', '9-3': '9-AE6', '9-4': '9-AE8', '9-5': '9-AE5', '9-6': '9-AE9', '9-7': '9-AE3', '9-8': '9-AE12', '9-9': '9-AE13'
};
/* resumo das questões para a tela (sem enunciado nem gabarito) */
const QUESTOES = {};
Object.keys(MAPA).forEach(k => { const m = META_SIM[k] || {}; QUESTOES[k] = { tema: MAPA[k], n: Number(k.split('-')[1]) + 1, hab: m.hab || '', desc: String(m.desc || '').slice(0, 220), tipo: m.tipo || 'obj' }; });

const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
/* "6º Ano A (Lydia)" -> "6º Ano A" (mesma turma no banco de alunos) */
const turmaBase = t => String(t || '').replace(/\s*\(.*\)\s*$/, '').trim();
/* rótulo com a escola: "6º Ano A (Lydia)" = E.E. Lydia Kitz Moreira; sem rótulo = E.E. Wanda */
const rotulo = t => turmaBase(t) + (/lydia/i.test(String(t || '')) ? ' (Lydia)' : '');

/* Lê as respostas do Simulado SARESP na planilha (Apps Script) e devolve só o necessário:
   [{ turma, nome, criado, itens: [{ k, ok }] }] — ok = true/false (dissertativa: nota ≥ 0,5; sem nota ainda = null). */
async function simuladoEF() {
  const url = process.env.EM_APPS_SCRIPT_URL || '', segredo = process.env.EM_SEGREDO || '';
  if (!url || !segredo) throw new Error('Planilha do Simulado não configurada na Vercel (EM_APPS_SCRIPT_URL / EM_SEGREDO).');
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 25000);
  let j;
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ acao: 'resultadosEF', segredo }), redirect: 'follow', signal: ctl.signal });
    j = await r.json();
  } finally { clearTimeout(t); }
  if (!j || !j.ok) throw new Error('A planilha do Simulado respondeu: ' + String((j && j.erro) || 'erro'));
  return (j.rows || []).map(r => ({
    turma: rotulo(r.turma), nome: String(r.nome || '').trim(), criado: r.criado || '',
    itens: (r.itens || []).filter(i => MAPA[i.k]).map(i => ({ k: i.k, ok: i.tipo === 'dis' ? (i.nota == null ? null : Number(i.nota) >= 0.5) : !!i.acerto }))
  }));
}

module.exports = { MAPA, QUESTOES, simuladoEF, norm, turmaBase, rotulo };
