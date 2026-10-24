/* Rodada "Cartas de imagem": jogo da memória que aparece entre as perguntas do Orbit Quiz.
   Vira duas cartas: uma de imagem e uma de palavra. Se combinam, ficam abertas. Entra quando a tela mostra PERGUNTA 4, 7 e 10. */
(function () {
  const A = './assets/';
  const RODADAS = {
    4: [['q01-day-night-D-c4SU6l.webp', 'Dia e noite'], ['q02-moon-phases-Bsjsdxca.webp', 'Fases da Lua'], ['q03-energy-lamp-CSDVXWRy.webp', 'Energia elétrica'], ['q04-food-chain-DiMaEDP_.webp', 'Cadeia alimentar']],
    7: [['q05-recycling-DTsfHUbh.webp', 'Reciclagem'], ['q06-wind-DxMISwho.webp', 'Vento'], ['q07-heart-DvMaYsNb.webp', 'Coração'], ['q08-condensation-Sd3O82f5.webp', 'Condensação']],
    10: [['q09-magnet-BBpxklRr.webp', 'Ímã'], ['q10-earth-layers-Ct7uFzDx.webp', 'Camadas da Terra'], ['q11-photosynthesis-D8HA1vgb.webp', 'Fotossíntese'], ['q12-investigation-qfVZ82hB.webp', 'Investigação científica']]
  };
  const feitas = {};
  const css = document.createElement('style');
  css.textContent = `
  #cartas-ov{position:fixed;inset:0;z-index:99999;background:radial-gradient(ellipse at 50% 20%,#0f3a5c,#071525 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;color:#fff;font-family:inherit}
  #cartas-ov h2{margin:0 0 4px;font-size:clamp(20px,3.4vw,34px)}
  #cartas-ov p{margin:0 0 14px;opacity:.85;font-size:clamp(13px,1.8vw,18px)}
  .cartas-grade{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;width:min(900px,100%)}
  .carta{aspect-ratio:1/1.05;perspective:700px;border:0;background:none;padding:0;cursor:pointer}
  .carta-in{position:relative;width:100%;height:100%;transition:transform .45s;transform-style:preserve-3d}
  .carta.aberta .carta-in,.carta.par .carta-in{transform:rotateY(180deg)}
  .carta-f,.carta-v{position:absolute;inset:0;backface-visibility:hidden;border-radius:14px;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 6px 0 #051726,0 8px 14px rgba(0,0,0,.45)}
  .carta-f{background:linear-gradient(180deg,#14456a,#0b2a44);border:1px solid #6fc9ee66;font-size:clamp(28px,5vw,54px)}
  .carta-v{transform:rotateY(180deg);background:#10304a;border:2px solid #6fc9ee;padding:6px}
  .carta-v img{width:100%;height:100%;object-fit:cover;border-radius:10px}
  .carta-v b{color:#fff;font-size:clamp(14px,2.2vw,26px);text-align:center;line-height:1.15}
  .carta.par .carta-v{background:linear-gradient(180deg,#5f7a3a,#4a5f2c);border-color:#8aa35d}
  .carta.erro .carta-v{background:#a51f24;border-color:#d33a3a}
  #cartas-ov .cartas-rod{margin-top:14px;font-weight:700;font-size:clamp(14px,2vw,20px)}
  #cartas-ov button.seguir{margin-top:14px;padding:12px 28px;font:inherit;font-weight:700;font-size:18px;color:#fff;border:1px solid #8aa35d;border-radius:14px;background:linear-gradient(180deg,#5f7a3a,#4a5f2c);box-shadow:0 6px 0 #2c3a19;cursor:pointer}
  @media(max-width:520px){.cartas-grade{grid-template-columns:repeat(3,1fr);gap:8px}}`;
  document.head.appendChild(css);

  function embaralhar(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function porTemas(n) {   // 4 conceitos de maior defasagem da turma: n=4 → 1º ao 4º, 7 → 5º ao 8º, 10 → 9º ao 12º
    const T = window.__orbitTemas; if (!T) return null;
    const i = { 4: 0, 7: 4, 10: 8 }[n]; if (i == null) return null;
    const f = T.slice(i, i + 4); return f.length === 4 ? f.map(c => [null, c.nome, c.emoji]) : null;
  }
  function abrir(pares, aoFim) {
    const cartas = embaralhar(pares.flatMap(([img, nome, emoji], i) => [{ id: i, tipo: 'img', img, nome, emoji }, { id: i, tipo: 'txt', nome }]));
    const ov = document.createElement('div'); ov.id = 'cartas-ov';
    ov.innerHTML = '<h2>🃏 Rodada das cartas</h2><p>Vire duas cartas: combine cada figura com a palavra dela.</p><div class="cartas-grade"></div><div class="cartas-rod"></div>';
    const grade = ov.querySelector('.cartas-grade'), rod = ov.querySelector('.cartas-rod');
    let aberta = [], trava = false, acertos = 0, jogadas = 0;
    const placar = () => { rod.textContent = 'Pares: ' + acertos + '/' + pares.length + ' · Jogadas: ' + jogadas; };
    placar();
    cartas.forEach(c => {
      const b = document.createElement('button'); b.className = 'carta'; b.type = 'button'; b.setAttribute('aria-label', 'Carta virada para baixo');
      b.innerHTML = '<div class="carta-in"><div class="carta-f">❓</div><div class="carta-v">' + (c.tipo === 'img' ? (c.img ? '<img alt="' + c.nome + '" src="' + A + c.img + '">' : '<span style="font-size:clamp(34px,6vw,64px)" aria-label="' + c.nome + '">' + c.emoji + '</span>') : '<b>' + c.nome + '</b>') + '</div></div>';
      b.onclick = () => {
        if (trava || b.classList.contains('aberta') || b.classList.contains('par')) return;
        b.classList.add('aberta'); aberta.push({ c, b });
        if (aberta.length < 2) return;
        jogadas++; trava = true;
        const [x, y] = aberta; aberta = [];
        if (x.c.id === y.c.id && x.c.tipo !== y.c.tipo) {
          x.b.classList.replace('aberta', 'par'); y.b.classList.replace('aberta', 'par'); acertos++; trava = false; placar();
          if (acertos === pares.length) {
            const s = document.createElement('button'); s.className = 'seguir'; s.textContent = 'Continuar o quiz ▶'; s.onclick = () => { ov.remove(); aoFim && aoFim(); };
            ov.appendChild(s);
          }
        } else {
          x.b.classList.add('erro'); y.b.classList.add('erro');
          setTimeout(() => { [x.b, y.b].forEach(k => k.classList.remove('aberta', 'erro')); trava = false; placar(); }, 1100);
        }
      };
      grade.appendChild(b);
    });
    document.body.appendChild(ov);
  }

  function verificar() {
    const ui = document.getElementById('ui'); if (!ui || document.getElementById('cartas-ov')) return;
    const m = /PERGUNTA\s*(\d+)/i.exec(ui.textContent || ''); if (!m) return;
    const n = +m[1];
    const R = porTemas(n) || RODADAS[n]; if (R && !feitas[n]) { feitas[n] = true; abrir(R); }
  }
  function iniciar() {
    const ui = document.getElementById('ui'); if (!ui) return setTimeout(iniciar, 300);
    new MutationObserver(verificar).observe(ui, { childList: true, subtree: true });
  }
  iniciar();
  window.__orbitCartas = (n) => abrir(RODADAS[n] || RODADAS[4]);
})();
