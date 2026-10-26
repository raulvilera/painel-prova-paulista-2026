/* Mini placar ao vivo do Orbit Quiz: ranking da turma à direita, com o nome do aluno que joga em destaque. */
(function () {
  const SB = 'https://oxohpnappygkmwjyowvq.supabase.co', KEY = 'sb_publishable_EjJenZkxMWv_I6vXWTz6aQ_iz9XEU4N';
  const rpc = (fn, args) => fetch(SB + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args) }).then(r => r.ok ? r.json() : null).catch(() => null);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const css = document.createElement('style');
  css.textContent = `
  #placar{position:fixed;left:0;right:0;top:0;z-index:50;background:linear-gradient(180deg,#0b2a44f2,#071525f2);border-bottom:1px solid #6fc9ee66;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.45);font-size:13px;padding:6px 10px}
  body.tem-placar #ui{padding-top:46px}
  #placar .barra{display:flex;align-items:center;gap:8px;overflow-x:auto;white-space:nowrap;scrollbar-width:none}
  #placar .barra::-webkit-scrollbar{display:none}
  #placar .tit{color:#6fc9ee;font-size:11px;letter-spacing:.1em;flex:none}
  #placar .chip{flex:none;display:flex;gap:6px;align-items:center;padding:5px 10px;border-radius:999px;background:#ffffff14}
  #placar .chip.eu{background:linear-gradient(180deg,#5f7a3a,#4a5f2c);border:1px solid #8aa35d;font-weight:700;font-size:14px}
  #placar button{all:unset;cursor:pointer;color:#6fc9ee;flex:none;margin-left:auto;padding:4px 8px}
  #placar ol{list-style:none;margin:8px auto 2px;padding:0;display:flex;flex-direction:column;gap:4px;max-width:520px;max-height:50vh;overflow:auto}
  #placar li{display:grid;grid-template-columns:34px 1fr auto;gap:6px;padding:5px 10px;border-radius:9px;background:#ffffff0f}
  #placar li.eu{background:linear-gradient(180deg,#5f7a3a,#4a5f2c);border:1px solid #8aa35d;font-weight:700}
  #placar li span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #placar .vz{opacity:.7;text-align:center;padding:4px 0}`;
  document.head.appendChild(css);
  const box = document.createElement('aside'); box.id = 'placar'; box.hidden = true; box.setAttribute('aria-label', 'Ranking da turma');
  document.body.appendChild(box);
  let lista = [], ultimo = '', min = true;
  box.addEventListener('click', e => { if (e.target.closest('button')) { min = !min; desenhar(); } });

  function estado() { try { return window.__game && window.__game.getState(); } catch (e) { return null; } }
  const medalha = n => n === 1 ? '🥇' : n === 2 ? '🥈' : n === 3 ? '🥉' : n + 'º';
  function desenhar() {
    const s = estado(); if (!s || !s.student || !s.turma || (s.screen !== 'quiz' && s.screen !== 'results')) { box.hidden = true; document.body.classList.remove('tem-placar'); return; }
    box.hidden = false; document.body.classList.add('tem-placar');
    const pos = lista.findIndex(x => x.nome === s.student), nm = x => esc(x.nome.split(' ')[0]);
    const chips = lista.slice(0, 3).map((x, i) => x.nome === s.student ? '' : '<span class="chip">' + medalha(i + 1) + ' ' + nm(x) + ' <b>' + x.pontos + '</b></span>').join('');
    const eu = '<span class="chip eu">' + (pos >= 0 ? medalha(pos + 1) : '•') + ' ' + esc(s.student.split(' ')[0]) + ' <b>' + s.score + ' pts</b></span>';
    const todos = lista.map((x, i) => '<li class="' + (x.nome === s.student ? 'eu' : '') + '"><b>' + medalha(i + 1) + '</b><span>' + esc(x.nome) + '</span><b>' + (x.nome === s.student ? s.score : x.pontos) + '</b></li>').join('');
    box.innerHTML = '<div class="barra"><span class="tit">🏆 ' + esc(s.turma) + '</span>' + eu + chips + '<button aria-label="Abrir ou fechar o ranking completo">' + (min ? '▼' : '▲') + '</button></div>' +
      (min ? '' : '<ol>' + todos + '</ol><div class="vz">' + (pos >= 0 ? 'Você está em ' + (pos + 1) + 'º de ' + lista.length : 'Responda para entrar no ranking') + ' · ' + s.correct + ' acertos</div>');
  }
  async function enviar(s) {
    const resp = s.questionIndex + (s.answered || s.timedOut ? 1 : 0) + (s.screen === 'results' ? 0 : 0);
    const chave = [s.turma, s.student, s.score, s.correct, resp].join('|'); if (chave === ultimo) return; ultimo = chave;
    await rpc('orbit_registrar', { p_turma: s.turma, p_nome: s.student, p_pontos: s.score, p_acertos: s.correct, p_respondidas: s.screen === 'results' ? 12 : resp });
  }
  /* registra cada resposta (tema, habilidade, acerto) para o relatório de Gamificação do professor */
  /* Cada resposta é capturada NO MOMENTO em que o aluno marca (gancho do jogo), entra numa fila e é reenviada até o servidor confirmar.
     Assim nenhuma resposta se perde se o aluno avançar rápido, a internet oscilar ou a página recarregar logo depois. */
  const fila = []; let enviando = false;
  async function drenar() {
    if (enviando) return; enviando = true;
    while (fila.length) {
      try { const r = await fetch(SB + '/rest/v1/rpc/orbit_responder', { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(fila[0]), keepalive: true }); if (r.ok) { fila.shift(); continue; } } catch (e) { /* tenta de novo */ }
      await new Promise(r => setTimeout(r, 2000));
    }
    enviando = false;
  }
  window.__orbitOnAns = function (s) {
    try {
      const Q = window.__orbitQuestoes; if (!Q || !s || !s.student || !s.turma || !(s.answered || s.timedOut)) return;
      const q = Q[s.questionIndex]; if (!q) return;
      fila.push({ p_turma: s.turma, p_nome: s.student, p_conceito: q.conceito, p_habilidade: q.code, p_eixo: q.eixo, p_correta: !s.timedOut && s.answered === q.correct, p_marcada: s.answered || '', p_ordem: s.questionIndex + 1, p_pontos: 0 });
      drenar();
    } catch (e) { /* nunca atrapalha o jogo */ }
  };
  async function ciclo() {
    const s = estado(); if (s && s.student && s.turma && (s.screen === 'quiz' || s.screen === 'results')) {
      await enviar(s); const r = await rpc('orbit_ranking', { p_turma: s.turma }); if (Array.isArray(r)) lista = r;
    }
    desenhar();
  }
  setInterval(ciclo, 3000); setInterval(desenhar, 700); 
})();
