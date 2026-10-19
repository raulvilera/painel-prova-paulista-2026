/* Indício de uso de IA/cópia numa resposta dissertativa. Combina (1) sinais de digitação enviados pela página (colagem, velocidade, saídas da aba)
   e (2) a estimativa da própria correção por IA (campo "ia", 0–1). É um INDÍCIO para o professor conversar com o aluno, nunca prova: não altera a nota. */
function indicio(texto, sinais, iaTexto) {
  const len = String(texto || '').trim().length, s = sinais && typeof sinais === 'object' ? sinais : null, mot = []; let pts = 0;
  if (len < 40) return null;
  if (s) {
    const cc = Number(s.cc) || 0, c = Number(s.c) || 0, k = Number(s.k) || 0, ms = Number(s.ms) || 0, sai = Number(s.s) || 0;
    if (c > 0 && cc >= Math.min(60, len * 0.6)) { pts += 3; mot.push('texto colado (' + cc + ' de ' + len + ' caracteres, ' + Math.round(Math.min(100, cc / len * 100)) + '%)'); }
    else if (c > 0 && cc >= 25) { pts += 1; mot.push('trecho colado (' + cc + ' caracteres)'); }
    if (len >= 100 && ms > 3000 && len / (ms / 1000) > 12 && cc < len * 0.5) { pts += 2; mot.push('digitação rápida demais (' + Math.round(len / (ms / 1000)) + ' caracteres por segundo)'); }
    if (len >= 150 && k < len * 0.25 && c === 0) { pts += 1; mot.push('quase não digitou (' + k + ' teclas para ' + len + ' caracteres)'); }
    if (sai >= 2 && (c > 0 || pts > 0)) { pts += 1; mot.push('saiu da página ' + sai + ' vez(es) durante a resposta'); }
  }
  const ia = Number(iaTexto && iaTexto.ia);
  if (!isNaN(ia) && ia >= 0.75) { pts += ia >= 0.9 ? 2 : 1; mot.push('o texto tem características de resposta gerada por IA' + (iaTexto.motivo ? ': ' + String(iaTexto.motivo).slice(0, 160) : '')); }
  if (pts < 2) return null;
  return { nivel: pts >= 4 ? 'alto' : 'medio', motivo: mot.join('; ') };
}
module.exports = { indicio };
