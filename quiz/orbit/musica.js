/* Trilha sonora do Orbit Quiz: músicas de game originais, geradas no próprio navegador (Web Audio), sem arquivos de áudio
   e sem direitos autorais de terceiros. Cada pergunta tem a sua própria música (12 faixas diferentes); na tela final toca uma vinheta.
   Começa no primeiro toque do aluno (os navegadores só liberam som depois de um toque). Botão 🔊/🔇 no canto para desligar. */
(function () {
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  const CHAVE = 'orbit_musica_ligada';
  let ligado = true; try { ligado = localStorage.getItem(CHAVE) !== '0'; } catch (e) {}
  let ctx = null, mestre = null, faixa = -1, proxNota = 0, passo = 0, timer = null, atual = null;

  const nota = n => 440 * Math.pow(2, (n - 69) / 12);   // número MIDI → Hz
  // acordes como notas MIDI (fundamental, terça, quinta)
  const A = { Am: [57, 60, 64], F: [53, 57, 60], C: [48, 52, 55], G: [55, 59, 62], Dm: [50, 53, 57], Bb: [46, 50, 53], Em: [52, 55, 59], D: [50, 54, 57], Cm: [48, 51, 55], Ab: [44, 48, 51], Eb: [51, 55, 58], Gm: [55, 58, 62],
    E: [52, 56, 59], A: [57, 61, 64], Bm: [59, 62, 66], Fm: [53, 56, 60], Db: [49, 53, 56], Bbm: [46, 49, 53], Gb: [54, 58, 61], Fsm: [54, 57, 61], B: [59, 63, 66], Csm: [49, 52, 56] };
  /* uma faixa diferente para cada pergunta (12). bat: estilo da bateria; oit: oitava do arpejo; lo: onda da melodia */
  const FAIXAS = [
    { nome: 'Órbita',        bpm: 118, acordes: ['Am', 'F', 'C', 'G'],    arp: [0, 1, 2, 1, 0, 2, 1, 2], lead: [12, -1, 14, 12, -1, 16, 14, -1, 12, -1, 11, -1, 12, -1, -1, -1], onda: 'square', bat: 'pop' },
    { nome: 'Nebulosa',      bpm: 92,  acordes: ['Dm', 'Bb', 'F', 'C'],   arp: [0, 2, 1, 2, 0, 2, 1, 2], lead: [14, -1, -1, 12, -1, -1, 9, -1, 10, -1, -1, 9, -1, 7, -1, -1], onda: 'triangle', bat: 'leve' },
    { nome: 'Propulsão',     bpm: 140, acordes: ['Em', 'C', 'G', 'D'],    arp: [0, 1, 2, 0, 1, 2, 0, 2], lead: [12, 12, -1, 14, -1, 15, 14, -1, 12, -1, 10, -1, 12, -1, -1, -1], onda: 'square', bat: 'rapida' },
    { nome: 'Gravidade',     bpm: 104, acordes: ['Cm', 'Ab', 'Eb', 'Bb'], arp: [0, 2, 1, 0, 2, 1, 0, 1], lead: [12, -1, 15, -1, 14, -1, 12, -1, 10, -1, 12, -1, -1, 7, -1, -1], onda: 'sawtooth', bat: 'meia' },
    { nome: 'Cometa',        bpm: 128, acordes: ['A', 'E', 'Fsm', 'D'],   arp: [0, 1, 2, 1, 2, 1, 0, 1], lead: [16, -1, 14, -1, 12, -1, 14, 16, -1, -1, 19, -1, 16, -1, -1, -1], onda: 'square', bat: 'pop', oit: 24 },
    { nome: 'Eclipse',       bpm: 84,  acordes: ['Fm', 'Db', 'Ab', 'Eb'], arp: [0, 1, 2, 2, 1, 0, 1, 2], lead: [12, -1, -1, -1, 15, -1, 13, -1, 12, -1, -1, -1, 8, -1, -1, -1], onda: 'triangle', bat: 'leve', lo: 'triangle' },
    { nome: 'Supernova',     bpm: 150, acordes: ['Bm', 'G', 'D', 'A'],    arp: [0, 2, 0, 2, 1, 2, 1, 2], lead: [12, 14, 15, 14, 12, -1, 10, -1, 12, 14, 15, 17, 15, -1, 14, -1], onda: 'sawtooth', bat: 'rapida' },
    { nome: 'Satélite',      bpm: 112, acordes: ['G', 'Em', 'C', 'D'],    arp: [0, 1, 2, 1, 0, 1, 2, 1], lead: [12, -1, 16, -1, 19, -1, 16, -1, 17, -1, 16, -1, 14, -1, 12, -1], onda: 'square', bat: 'quebrada' },
    { nome: 'Buraco Negro',  bpm: 96,  acordes: ['Gm', 'Eb', 'Bb', 'D'],  arp: [0, 0, 2, 0, 1, 0, 2, 1], lead: [12, -1, -1, 10, -1, -1, 12, -1, 15, -1, -1, 14, -1, -1, 12, -1], onda: 'sawtooth', bat: 'meia', oit: 0 },
    { nome: 'Aurora',        bpm: 122, acordes: ['D', 'A', 'Bm', 'G'],    arp: [0, 2, 1, 2, 0, 2, 1, 2], lead: [14, -1, 12, -1, 9, -1, 12, -1, 14, -1, 16, -1, 14, -1, -1, -1], onda: 'triangle', bat: 'pop', lo: 'triangle' },
    { nome: 'Asteroides',    bpm: 146, acordes: ['Csm', 'A', 'E', 'B'],   arp: [0, 1, 2, 1, 0, 1, 2, 1], lead: [12, -1, 12, 15, -1, 12, 19, -1, 17, -1, 15, -1, 12, -1, -1, -1], onda: 'square', bat: 'quebrada', oit: 24 },
    { nome: 'Via Láctea',    bpm: 100, acordes: ['Bbm', 'Gb', 'Db', 'Ab'], arp: [0, 1, 2, 1, 2, 1, 0, 1], lead: [12, -1, -1, 15, -1, -1, 17, -1, 15, -1, -1, 12, -1, -1, 10, -1], onda: 'triangle', bat: 'leve' }
  ];
  const FINAL = { nome: 'Missão cumprida', bpm: 124, acordes: ['C', 'G', 'Am', 'F'], arp: [0, 1, 2, 1, 0, 1, 2, 1], lead: [12, -1, 14, -1, 16, -1, 19, -1, 17, -1, 16, -1, 14, -1, 12, -1], onda: 'square' };

  function tom(freq, t, dur, tipo, vol, destino) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(destino || mestre); o.start(t); o.stop(t + dur + 0.02);
  }
  let ruidoBuf = null;
  function ruido(t, dur, vol, corte) {
    if (!ruidoBuf) { ruidoBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate); const d = ruidoBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = ruidoBuf; f.type = 'highpass'; f.frequency.value = corte;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(mestre); s.start(t); s.stop(t + dur + 0.02);
  }
  function bumbo(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g); g.connect(mestre); o.start(t); o.stop(t + 0.2);
  }

  /* cada passo = semicolcheia; 16 passos por compasso; 1 acorde por compasso */
  function tocarPasso(F, p, t) {
    const sc = 60 / F.bpm / 4, ac = A[F.acordes[Math.floor(p / 16) % F.acordes.length]], i = p % 16, oit = F.oit == null ? 12 : F.oit;
    if (i % 2 === 0) tom(nota(ac[F.arp[(i / 2) % 8]] + oit), t, sc * 1.8, F.onda, 0.045);   // arpejo
    if (i % 4 === 0) tom(nota(ac[0] - 12), t, sc * 3.6, 'triangle', 0.16);              // baixo
    const l = F.lead[i]; if (l >= 0 && Math.floor(p / 16) % 2 === 1) tom(nota(ac[0] + l), t, sc * 1.9, F.lo || 'square', 0.035);   // melodia (compassos alternados)
    const b = F.bat || 'pop';                                                              // bateria de cada faixa
    if (b === 'pop') { if (i % 8 === 0) bumbo(t); if (i % 8 === 4) ruido(t, 0.12, 0.18, 1800); if (i % 2 === 1) ruido(t, 0.03, 0.06, 7000); }
    else if (b === 'leve') { if (i === 0 || i === 10) bumbo(t); if (i === 8) ruido(t, 0.1, 0.1, 2500); if (i % 4 === 2) ruido(t, 0.03, 0.04, 8000); }
    else if (b === 'rapida') { if (i % 4 === 0) bumbo(t); if (i % 8 === 4) ruido(t, 0.12, 0.2, 1600); ruido(t, 0.02, 0.045, 8000); }
    else if (b === 'meia') { if (i === 0 || i === 6) bumbo(t); if (i === 8) ruido(t, 0.16, 0.2, 1400); if (i % 2 === 0) ruido(t, 0.03, 0.05, 7000); }
    else if (b === 'quebrada') { if (i === 0 || i === 3 || i === 10) bumbo(t); if (i === 4 || i === 12) ruido(t, 0.12, 0.18, 1800); if (i % 2 === 1) ruido(t, 0.03, 0.06, 7000); }
  }
  function agendar() {
    if (!atual) return;
    const sc = 60 / atual.bpm / 4;
    while (proxNota < ctx.currentTime + 0.12) { tocarPasso(atual, passo, proxNota); proxNota += sc; passo++; }
  }
  function iniciar(F) {
    if (!ctx || !ligado) { atual = F; return; }
    const t = ctx.currentTime;
    mestre.gain.cancelScheduledValues(t); mestre.gain.setValueAtTime(mestre.gain.value, t);
    mestre.gain.linearRampToValueAtTime(0.0001, t + 0.25);                               // troca suave entre faixas
    setTimeout(() => {
      atual = F; passo = 0; proxNota = ctx.currentTime + 0.05;
      mestre.gain.cancelScheduledValues(ctx.currentTime); mestre.gain.setValueAtTime(0.0001, ctx.currentTime); mestre.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.4);
      if (!timer) timer = setInterval(agendar, 25);
    }, 280);
  }
  function parar() { atual = null; if (timer) { clearInterval(timer); timer = null; } if (mestre && ctx) { mestre.gain.cancelScheduledValues(ctx.currentTime); mestre.gain.setValueAtTime(0.0001, ctx.currentTime); } }

  /* qual tela está aberta: pergunta N, resultado final ou outra (abertura/sala) */
  function telaAtual() {
    const ui = document.getElementById('ui'); if (!ui) return { tipo: 'outra' };
    if (ui.querySelector('.results-layout, .results-card, .result-score')) return { tipo: 'final' };
    if (ui.querySelector('.answer-option')) {
      const m = /PERGUNTA\s*(\d+)/i.exec(ui.textContent || ''); return { tipo: 'pergunta', n: m ? +m[1] : 1 };
    }
    return { tipo: 'outra' };
  }
  let ultimaTela = '';
  function verificar() {
    const t = telaAtual(), chave = t.tipo + (t.n || '');
    if (chave === ultimaTela) return; ultimaTela = chave;
    if (t.tipo === 'pergunta') { faixa = (t.n - 1) % FAIXAS.length; iniciar(FAIXAS[faixa]); }
    else if (t.tipo === 'final') iniciar(FINAL);
    else parar();
  }

  function destravar() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    ctx = new AC(); mestre = ctx.createGain(); mestre.gain.value = 0.0001;
    const comp = ctx.createDynamicsCompressor(); mestre.connect(comp); comp.connect(ctx.destination);
    ultimaTela = ''; verificar();
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, destravar, { passive: true }));

  // botão de ligar/desligar a música
  function botao() {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', 'Ligar ou desligar a música');
    b.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:9999;width:46px;height:46px;border-radius:50%;border:1px solid #9ed1e966;background:#0b2a44e6;color:#fff;font-size:20px;cursor:pointer;box-shadow:0 4px 0 #051726,0 6px 14px rgba(0,0,0,.4)';
    const pinta = () => { b.textContent = ligado ? '🔊' : '🔇'; b.title = ligado ? 'Desligar música' : 'Ligar música'; };
    b.onclick = e => { e.stopPropagation(); ligado = !ligado; try { localStorage.setItem(CHAVE, ligado ? '1' : '0'); } catch (x) {} pinta(); destravar(); if (ligado) { ultimaTela = ''; verificar(); } else parar(); };
    pinta(); document.body.appendChild(b);
  }
  function comecar() {
    botao();
    const ui = document.getElementById('ui');
    if (ui) new MutationObserver(() => { if (ctx) verificar(); }).observe(ui, { childList: true, subtree: true });
    document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else if (ligado) ctx.resume(); });
  }
  window.__orbitMusica = () => ({ ligado, faixa: atual ? atual.nome : null, estado: ctx ? ctx.state : 'sem-som' });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', comecar); else comecar();
})();
