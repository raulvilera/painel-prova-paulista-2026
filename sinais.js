/* Sinais de digitação das respostas dissertativas (para o professor identificar possível uso de IA/cópia).
   Guarda só contagens — nunca o conteúdo digitado além do que o aluno já envia. Uso: window.SINAIS.coletar() → lista por questão (ou null). */
(function () {
  const S = {}, T = 'textarea[data-q]';
  const g = i => S[i] || (S[i] = { c: 0, cc: 0, k: 0, n: 0, ms: 0, s: 0, ult: 0 });
  let atual = null;
  const alvo = e => (e.target && e.target.matches && e.target.matches(T)) ? +e.target.dataset.q : null;
  document.addEventListener('focusin', e => { const i = alvo(e); if (i !== null) atual = i; });
  document.addEventListener('paste', e => { const i = alvo(e); if (i === null) return; const s = g(i); s.c++; try { s.cc += String((e.clipboardData || window.clipboardData).getData('text') || '').length; } catch (x) { s.cc += 1; } }, true);
  document.addEventListener('drop', e => { const i = alvo(e); if (i === null) return; const s = g(i); s.c++; try { s.cc += String(e.dataTransfer.getData('text') || '').length; } catch (x) { s.cc += 1; } }, true);
  document.addEventListener('keydown', e => { const i = alvo(e); if (i !== null && !e.ctrlKey && !e.metaKey) g(i).k++; }, true);
  document.addEventListener('input', e => {
    const i = alvo(e); if (i === null) return; const s = g(i), agora = Date.now(); s.n++;
    if (s.ult && agora - s.ult < 5000) s.ms += agora - s.ult; s.ult = agora;
  }, true);
  const saiu = () => { if (atual !== null && S[atual] && S[atual].n > 0 || (atual !== null && document.querySelector(T + '[data-q="' + atual + '"]'))) g(atual).s++; };
  document.addEventListener('visibilitychange', () => { if (document.hidden && atual !== null) saiu(); });
  window.SINAIS = {
    coletar() {
      const max = Math.max(-1, ...Object.keys(S).map(Number)); if (max < 0) return null;
      const out = []; for (let i = 0; i <= max; i++) out.push(S[i] ? { c: S[i].c, cc: S[i].cc, k: S[i].k, n: S[i].n, ms: S[i].ms, s: S[i].s } : null);
      return out;
    }
  };
})();
