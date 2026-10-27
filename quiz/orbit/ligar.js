/* Rodada "Ligue o conceito à palavra": o aluno arrasta cada peça (conceito) até a palavra certa.
   Funciona com mouse e com toque. Aparece antes das perguntas 2, 6 e 9. */
(function () {
  const RODADAS = {
    2: [['Movimento de rotação da Terra em torno do próprio eixo', 'Dia e noite'], ['Mudança do lado iluminado da Lua visto da Terra', 'Fases da Lua'], ['Energia que acende uma lâmpada', 'Energia elétrica'], ['Quem produz o próprio alimento e inicia a cadeia', 'Produtor']],
    6: [['Reaproveitar materiais para fazer novos objetos', 'Reciclagem'], ['Ar em movimento, de uma região para outra', 'Vento'], ['Órgão que bombeia o sangue pelo corpo', 'Coração'], ['Vapor de água que vira gotículas líquidas', 'Condensação']],
    9: [['Atrai objetos de ferro', 'Ímã'], ['Crosta, manto e núcleo', 'Camadas da Terra'], ['Plantas usam luz, água e gás carbônico para fazer alimento', 'Fotossíntese'], ['Levantar hipóteses, testar e concluir', 'Investigação científica']]
  };
  const feitas = {};
  const css = document.createElement('style');
  css.textContent = `
  #ligar-ov{position:fixed;inset:0;z-index:99999;background:radial-gradient(ellipse at 50% 20%,#0f3a5c,#071525 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;color:#fff;touch-action:none;user-select:none}
  #ligar-ov h2{margin:0 0 4px;font-size:clamp(20px,3.4vw,34px)}
  #ligar-ov p{margin:0 0 14px;opacity:.85;font-size:clamp(13px,1.8vw,18px);text-align:center}
  .lg-cols{display:grid;grid-template-columns:1fr 1fr;gap:22px;width:min(900px,100%)}
  .lg-col{display:flex;flex-direction:column;gap:12px}
  .lg-peca,.lg-alvo{min-height:64px;border-radius:14px;padding:10px 14px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:clamp(13px,1.9vw,19px);line-height:1.2}
  .lg-peca{cursor:grab;background:linear-gradient(180deg,#14456a,#0b2a44);border:1px solid #6fc9ee99;box-shadow:0 6px 0 #051726,0 8px 14px rgba(0,0,0,.45);touch-action:none}
  .lg-peca.arrasta{position:fixed;z-index:100000;cursor:grabbing;pointer-events:none;transform:rotate(-2deg) scale(1.04);box-shadow:0 14px 26px rgba(0,0,0,.55)}
  .lg-peca.volta{transition:all .25s}
  .lg-peca.erra{background:#a51f24;border-color:#d33a3a}
  .lg-alvo{border:2px dashed #6fc9ee88;background:#0b2a4466;font-weight:700;font-size:clamp(15px,2.2vw,24px);transition:background .15s,border-color .15s}
  .lg-alvo.sobre{background:#14456a;border-color:#6fc9ee}
  .lg-alvo.certo{border-style:solid;background:linear-gradient(180deg,#5f7a3a,#4a5f2c);border-color:#8aa35d;flex-direction:column;gap:4px}
  .lg-alvo.certo small{font-weight:400;font-size:.62em;opacity:.95}
  .lg-rod{margin-top:14px;font-weight:700;font-size:clamp(14px,2vw,20px)}
  #ligar-ov button.seguir{margin-top:14px;padding:12px 28px;font:inherit;font-weight:700;font-size:18px;color:#fff;border:1px solid #8aa35d;border-radius:14px;background:linear-gradient(180deg,#5f7a3a,#4a5f2c);box-shadow:0 6px 0 #2c3a19;cursor:pointer}
  @media(max-width:560px){.lg-cols{gap:10px}}`;
  document.head.appendChild(css);
  const emb = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function porTemas(n) {   // ligar: 1º–4º, 5º–8º e 9º–12º conceitos de maior defasagem da turma
    const T = window.__orbitTemas; if (!T) return null;
    const i = { 2: 0, 6: 4, 9: 8 }[n]; if (i == null) return null;
    const f = T.slice(i, i + 4); return f.length === 4 ? f.map(c => [c.def.split(/\.\s/)[0].replace(/\.$/, ''), c.nome, c.defasagem]) : null;
  }
  function estudar(pares, aoFim) {   // passo de memorização: o aluno lê os conceitos antes de ligar
    const ov = document.createElement('div'); ov.id = 'ligar-ov';
    ov.innerHTML = '<h2>📖 Memorize antes de jogar</h2><p>Estes temas foram os que a sua turma mais errou. Leia com calma.</p><div class="lg-col" style="width:min(900px,100%)">' +
      pares.map(p => '<div class="lg-alvo certo" style="align-items:flex-start;text-align:left"><span>' + p[1] + (p[2] ? ' <small>· ' + p[2] + '% da turma errou</small>' : '') + '</span><small>' + p[0] + '</small></div>').join('') + '</div>';
    const b = document.createElement('button'); b.className = 'seguir'; b.textContent = 'Já li, começar ▶'; b.onclick = () => { ov.remove(); aoFim(); }; ov.appendChild(b);
    document.body.appendChild(ov);
  }
  function abrir(pares, aoFim) {
    const ov = document.createElement('div'); ov.id = 'ligar-ov';
    ov.innerHTML = '<h2>🧩 Ligue o conceito à palavra</h2><p>Arraste cada peça até a palavra certa.</p><div class="lg-cols"><div class="lg-col lg-pecas"></div><div class="lg-col lg-alvos"></div></div><div class="lg-rod"></div>';
    const cp = ov.querySelector('.lg-pecas'), ca = ov.querySelector('.lg-alvos'), rod = ov.querySelector('.lg-rod');
    let ok = 0, jog = 0;
    const placar = () => { rod.textContent = 'Ligados: ' + ok + '/' + pares.length + ' · Tentativas: ' + jog; }; placar();
    emb(pares.map((p, i) => i)).forEach(i => { const a = document.createElement('div'); a.className = 'lg-alvo'; a.dataset.i = i; a.textContent = pares[i][1]; ca.appendChild(a); });
    emb(pares.map((p, i) => i)).forEach(i => {
      const el = document.createElement('div'); el.className = 'lg-peca'; el.dataset.i = i; el.textContent = pares[i][0]; cp.appendChild(el);
      el.addEventListener('pointerdown', ev => {
        if (el.classList.contains('feito')) return; ev.preventDefault();
        const r = el.getBoundingClientRect(), dx = ev.clientX - r.left, dy = ev.clientY - r.top, w = r.width, h = r.height;
        const ph = document.createElement('div'); ph.style.cssText = 'height:' + h + 'px;visibility:hidden'; cp.insertBefore(ph, el);
        el.classList.remove('volta'); el.classList.add('arrasta'); el.style.cssText = 'width:' + w + 'px;left:' + r.left + 'px;top:' + r.top + 'px';
        el.setPointerCapture && el.setPointerCapture(ev.pointerId);
        let alvo = null;
        const sob = (x, y) => { el.style.display = 'none'; const e = document.elementFromPoint(x, y); el.style.display = ''; return e && e.closest && e.closest('.lg-alvo:not(.certo)'); };
        const mv = e => { el.style.left = (e.clientX - dx) + 'px'; el.style.top = (e.clientY - dy) + 'px'; const t = sob(e.clientX, e.clientY); if (t !== alvo) { alvo && alvo.classList.remove('sobre'); alvo = t; alvo && alvo.classList.add('sobre'); } };
        const fim = e => {
          el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', fim); el.removeEventListener('pointercancel', fim);
          const t = sob(e.clientX, e.clientY); alvo && alvo.classList.remove('sobre');
          if (t) {
            jog++;
            if (t.dataset.i === el.dataset.i) {
              t.classList.add('certo'); t.innerHTML = pares[+t.dataset.i][1] + '<small>' + pares[+t.dataset.i][0] + '</small>';
              el.remove(); ph.remove(); ok++;
              if (ok === pares.length) { const s = document.createElement('button'); s.className = 'seguir'; s.textContent = 'Continuar o quiz ▶'; s.onclick = () => { ov.remove(); aoFim && aoFim(); }; ov.appendChild(s); }
            } else { el.classList.add('erra'); setTimeout(() => el.classList.remove('erra'), 700); voltar(); }
          } else voltar();
          placar();
          function voltar() { el.classList.add('volta'); const b = ph.getBoundingClientRect(); el.style.left = b.left + 'px'; el.style.top = b.top + 'px'; setTimeout(() => { el.classList.remove('arrasta', 'volta'); el.style.cssText = ''; ph.replaceWith(el); }, 260); }
        };
        el.addEventListener('pointermove', mv); el.addEventListener('pointerup', fim); el.addEventListener('pointercancel', fim);
      });
    });
    document.body.appendChild(ov);
  }
  function verificar() {
    if (window.__orbitRuLigado && window.__orbitRuLigado()) return;   // versão em russo: sem as rodadas de ligar/cartas (textos em português)
    const ui = document.getElementById('ui'); if (!ui || document.getElementById('ligar-ov') || document.getElementById('cartas-ov')) return;
    const m = /PERGUNTA\s*(\d+)/i.exec(ui.textContent || ''); if (!m) return;
    const n = +m[1]; const T = porTemas(n), R = T || RODADAS[n]; if (R && !feitas[n]) { feitas[n] = true; T ? estudar(R, () => abrir(R)) : abrir(R); }
  }
  (function iniciar() { const ui = document.getElementById('ui'); if (!ui) return setTimeout(iniciar, 300); new MutationObserver(verificar).observe(ui, { childList: true, subtree: true }); })();
  window.__orbitLigar = n => abrir(RODADAS[n] || RODADAS[2]);
})();
