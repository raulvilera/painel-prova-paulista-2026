/* Mini placar ao vivo do Orbit Quiz: ranking da turma à direita, com o nome do aluno que joga em destaque. */
(function () {
  const SB = 'https://oxohpnappygkmwjyowvq.supabase.co', KEY = 'sb_publishable_EjJenZkxMWv_I6vXWTz6aQ_iz9XEU4N';
  const rpc = (fn, args) => fetch(SB + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args) }).then(r => r.ok ? r.json() : null).catch(() => null);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const css = document.createElement('style');
  css.textContent = `
  #placar{position:fixed;max-height:55vh;overflow:auto;right:14px;bottom:76px;width:230px;z-index:50;background:linear-gradient(180deg,#0f3a5ce6,#071525ee);border:1px solid #6fc9ee66;border-radius:16px;padding:12px;color:#fff;box-shadow:0 10px 24px rgba(0,0,0,.45);font-size:13px}
  #placar h4{margin:0 0 8px;font-size:12px;letter-spacing:.12em;color:#6fc9ee;display:flex;justify-content:space-between;align-items:center}
  #placar button{all:unset;cursor:pointer;color:#6fc9ee}
  #placar ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
  #placar li{display:grid;grid-template-columns:24px 1fr auto;gap:6px;align-items:center;padding:5px 8px;border-radius:9px;background:#ffffff0f}
  #placar li b{font-variant-numeric:tabular-nums}
  #placar li span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #placar li.eu{background:linear-gradient(180deg,#5f7a3a,#4a5f2c);border:1px solid #8aa35d;font-weight:700;font-size:14px;transform:scale(1.03)}
  #placar li.sep{background:none;padding:0;text-align:center;opacity:.6;display:block;line-height:.6}
  #placar .vz{opacity:.7;padding:6px 2px}
  @media(max-width:900px){#placar{bottom:76px;right:10px;left:10px;width:auto;padding:8px 10px}#placar.min ol,#placar.min .vz{display:none}#placar ol{max-height:30vh;overflow:auto}}`;
  document.head.appendChild(css);
  const box = document.createElement('aside'); box.id = 'placar'; box.hidden = true; box.setAttribute('aria-label', 'Ranking da turma');
  document.body.appendChild(box);
  let lista = [], ultimo = '', min = matchMedia('(max-width:900px)').matches;
  box.classList.toggle('min', min);
  box.addEventListener('click', e => { if (e.target.closest('button')) { min = !min; box.classList.toggle('min', min); desenhar(); } });

  function estado() { try { return window.__game && window.__game.getState(); } catch (e) { return null; } }
  function desenhar() {
    const s = estado(); if (!s || !s.student || !s.turma || (s.screen !== 'quiz' && s.screen !== 'results')) { box.hidden = true; return; }
    box.hidden = false;
    const pos = lista.findIndex(x => x.nome === s.student);
    let linhas = lista.slice(0, 6).map((x, i) => [i + 1, x]);
    if (pos >= 6) linhas.push(null, [pos + 1, lista[pos]]);
    if (pos < 0) linhas.push(null, ['–', { nome: s.student, pontos: s.score }]);
    const li = linhas.map(l => l === null ? '<li class="sep">⋮</li>' : '<li class="' + (l[1].nome === s.student ? 'eu' : '') + '"><b>' + (l[0] === 1 ? '🥇' : l[0] === 2 ? '🥈' : l[0] === 3 ? '🥉' : l[0] + 'º') + '</b><span>' + esc(l[1].nome) + '</span><b>' + (l[1].nome === s.student ? s.score : l[1].pontos) + '</b></li>').join('');
    box.innerHTML = '<h4><span>🏆 ' + (min ? (pos >= 0 ? (pos + 1) + 'º lugar' : 'Ranking') + ' · ' + s.score + ' pts' : 'RANKING · ' + esc(s.turma)) + '</span><button aria-label="Recolher ou abrir ranking">' + (min ? '▲' : '▼') + '</button></h4>' + (lista.length ? '<ol>' + li + '</ol>' : '<div class="vz">Você é o primeiro a jogar nesta turma.</div><ol>' + li + '</ol>') + '<div class="vz">' + (pos >= 0 ? 'Você está em ' + (pos + 1) + 'º de ' + lista.length : 'Responda para entrar no ranking') + ' · ' + s.correct + ' acertos</div>';
  }
  async function enviar(s) {
    const resp = s.questionIndex + (s.answered || s.timedOut ? 1 : 0) + (s.screen === 'results' ? 0 : 0);
    const chave = [s.turma, s.student, s.score, s.correct, resp].join('|'); if (chave === ultimo) return; ultimo = chave;
    await rpc('orbit_registrar', { p_turma: s.turma, p_nome: s.student, p_pontos: s.score, p_acertos: s.correct, p_respondidas: s.screen === 'results' ? 12 : resp });
  }
  async function ciclo() {
    const s = estado(); if (s && s.student && s.turma && (s.screen === 'quiz' || s.screen === 'results')) {
      await enviar(s); const r = await rpc('orbit_ranking', { p_turma: s.turma }); if (Array.isArray(r)) lista = r;
    }
    desenhar();
  }
  setInterval(ciclo, 3000); setInterval(desenhar, 700);
})();
