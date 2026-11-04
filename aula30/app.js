(function () {
  'use strict';
  const DADOS = window.AULA30, TOTAL_S = 30 * 60, POR_BLOCO_S = 3 * 60;
  const app = document.getElementById('app');
  const S = { ano: null, i: 0, res: [], tent: 0, errados: [], t0: 0, timer: null, concluido: false, tFim: 0 };
  const L = 'ABCD';

  const mmss = s => { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  const el = (html) => { const d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; };
  const topo = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  function cabecalho() {
    return '<p class="escola">E.E. Profª Wanda Mascagni de Sá</p><h1>Aula online de Ciências · 30 minutos</h1>';
  }

  /* ---------- tela inicial ---------- */
  function inicio() {
    pararTimer();
    S.concluido = false;
    app.innerHTML = cabecalho() +
      '<p class="sub">Atividade autoexplicativa baseada no Guia Priorizado de Ciências 2026 e nos descritores do SARESP.</p>' +
      '<section class="card"><h2>1. Escolha o seu ano</h2><div class="anos" role="group" aria-label="Ano">' +
      [6, 7, 8, 9].map(a => '<button class="ano" data-a="' + a + '" aria-pressed="' + (S.ano === a) + '">' + a + 'º ano<small>' + DADOS[a].faixa + '</small></button>').join('') + '</div>' +
      '<div id="apr" class="sub" style="margin:6px 0 0">' + (S.ano ? DADOS[S.ano].apresentacao : 'Cada ano tem 10 blocos, um para cada descritor cobrado no SARESP.') + '</div>' +
      '<button class="btn" id="comecar"' + (S.ano ? '' : ' disabled') + '>Começar a atividade</button></section>' +
      '<section class="card"><h2>Como funciona (30 minutos)</h2><ul class="plano">' +
      '<li><b>10 blocos</b><span>cerca de 3 minutos em cada um</span></li>' +
      '<li><b>① Ideia</b><span>leia a explicação curta do tema</span></li>' +
      '<li><b>② Observe</b><span>veja a tabela, o esquema ou o gráfico</span></li>' +
      '<li><b>③ Analise</b><span>responda usando a ideia e o que observou</span></li>' +
      '<li><b>④ Confira</b><span>a devolutiva explica o porquê, inclusive dos erros. Se errar, você pode tentar de novo (vale meio ponto).</span></li>' +
      '</ul></section>';
    app.querySelectorAll('.ano').forEach(b => b.addEventListener('click', () => { S.ano = +b.dataset.a; inicio(); }));
    const c = document.getElementById('comecar');
    if (c) c.addEventListener('click', comecar);
  }

  function comecar() {
    S.i = 0; S.res = new Array(DADOS[S.ano].blocos.length).fill(null); S.errados = []; S.tent = 0; S.t0 = Date.now(); S.concluido = false;
    iniciarTimer(); bloco();
  }

  /* ---------- cronômetro ---------- */
  function decorrido() { return S.concluido ? S.tFim : (Date.now() - S.t0) / 1000; }
  function pararTimer() { if (S.timer) { clearInterval(S.timer); S.timer = null; } }
  function iniciarTimer() { pararTimer(); S.timer = setInterval(atualizaTempo, 1000); }
  function atualizaTempo() {
    const t = document.getElementById('tempo'); if (!t) return;
    const dec = decorrido(), rest = TOTAL_S - dec;
    t.textContent = rest >= 0 ? '⏱ ' + mmss(rest) : '⏱ +' + mmss(-rest);
    t.className = 'tempo' + (rest < 0 ? ' fim' : (dec > (S.i + 1) * POR_BLOCO_S ? ' atraso' : ''));
    t.title = rest < 0 ? 'O tempo da aula acabou: termine o bloco atual com calma.' : (dec > (S.i + 1) * POR_BLOCO_S ? 'Você está um pouco atrás do ritmo (3 min por bloco).' : 'Ritmo ideal: 3 minutos por bloco.');
  }

  /* ---------- um bloco ---------- */
  function pontos() {
    return '<div class="pontos" aria-hidden="true">' + S.res.map((r, k) => '<i class="' + (k === S.i ? 'at ' : '') + (r === 1 ? 'c1' : r === 2 ? 'c2' : r === 0 ? 'c0' : '') + '"></i>').join('') + '</div>';
  }

  function bloco() {
    const B = DADOS[S.ano].blocos, b = B[S.i];
    S.tent = 0; S.errados = [];
    app.innerHTML =
      '<div class="topo"><div class="linha"><span><b>' + S.ano + 'º ano</b> · bloco ' + (S.i + 1) + ' de ' + B.length + '</span><span class="tempo" id="tempo"></span></div>' + pontos() + '</div>' +
      '<section class="card">' +
      '<span class="chip">' + b.tema + '</span><span class="chip">' + b.hab + '</span>' +
      '<p class="desc"><b>Descritor:</b> ' + b.d + '</p>' +
      '<div class="passo">① Ideia-chave</div><p class="ideia">' + b.ideia + '</p>' +
      '<div class="passo">② Observe</div><div class="fig">' + b.fig + '</div>' +
      '<div class="passo">③ Analise</div><p class="pergunta">' + b.p + '</p>' +
      '<div class="alts" id="alts">' + b.alts.map((a, k) => '<button class="alt" data-k="' + k + '"><span class="l">' + L[k] + ')</span><span>' + a + '</span></button>').join('') + '</div>' +
      '<div id="dev"></div></section>';
    app.querySelectorAll('.alt').forEach(btn => btn.addEventListener('click', () => responder(+btn.dataset.k)));
    atualizaTempo(); topo();
  }

  function responder(k) {
    const b = DADOS[S.ano].blocos[S.i], dev = document.getElementById('dev');
    const botoes = app.querySelectorAll('.alt');
    S.tent++;
    if (k === b.c) {
      S.res[S.i] = S.tent === 1 ? 1 : 2;
      botoes.forEach(x => { x.disabled = true; });
      botoes[k].classList.add('certa');
      dev.innerHTML = '<div class="dev ok"><p><b>' + (S.tent === 1 ? '✔ Correto!' : '✔ Agora acertou!') + '</b> ' + b.ok + '</p><p class="dica"><b>Como o SARESP cobra:</b> ' + b.saresp + '</p></div>' + proximo();
    } else if (S.tent === 1) {
      botoes[k].classList.add('errada'); botoes[k].disabled = true; S.errados.push(k);
      dev.innerHTML = '<div class="dev no"><p><b>✖ Ainda não.</b> ' + b.er[k] + '</p><p>Releia a <b>ideia-chave</b> e a figura, e tente de novo (vale meio ponto).</p></div>';
    } else {
      S.res[S.i] = 0;
      botoes.forEach(x => { x.disabled = true; });
      botoes[k].classList.add('errada'); botoes[b.c].classList.add('certa');
      dev.innerHTML = '<div class="dev rev"><p><b>Vamos entender juntos.</b> A resposta certa é a <b>' + L[b.c] + ')</b>. ' + b.ok + '</p><p>' + b.er[k] + '</p><p class="dica"><b>Como o SARESP cobra:</b> ' + b.saresp + '</p></div>' + proximo();
    }
    const topoEl = app.querySelector('.topo'); if (topoEl) { const p = topoEl.querySelector('.pontos'); if (p) p.outerHTML = pontos(); }
    const n = document.getElementById('prox'); if (n) { n.addEventListener('click', avancar); n.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }
  function proximo() { return '<button class="btn" id="prox">' + (S.i === DADOS[S.ano].blocos.length - 1 ? 'Ver meu resultado' : 'Próximo bloco →') + '</button>'; }
  function avancar() { if (S.i < DADOS[S.ano].blocos.length - 1) { S.i++; bloco(); } else fim(); }

  /* ---------- resultado ---------- */
  function fim() {
    S.concluido = true; S.tFim = (Date.now() - S.t0) / 1000; pararTimer();
    const B = DADOS[S.ano].blocos, pts = S.res.reduce((s, r) => s + (r === 1 ? 1 : r === 2 ? 0.5 : 0), 0);
    const msg = pts >= 8 ? 'Excelente! Você domina a maior parte dos descritores.' : pts >= 5 ? 'Bom caminho! Revise os blocos marcados e tente novamente.' : 'Você já deu o primeiro passo. Releia as ideias-chave dos blocos marcados e refaça a atividade.';
    app.innerHTML = cabecalho() +
      '<section class="card"><p class="sub" style="margin:0">' + S.ano + 'º ano · tempo usado: <b>' + mmss(S.tFim) + '</b></p><p class="res-grande">' + String(pts).replace('.', ',') + ' / ' + B.length + '</p><p>' + msg + '</p>' +
      '<div class="leg"><span>✅ acertou de primeira (1 ponto)</span><span>🟨 acertou na 2ª tentativa (0,5)</span><span>🔁 revisar</span></div>' +
      '<ul class="lista-res">' + B.map((b, k) => '<li><div class="t">' + (S.res[k] === 1 ? '✅' : S.res[k] === 2 ? '🟨' : '🔁') + ' ' + (k + 1) + '. ' + b.tema + ' <span class="chip">' + b.hab + '</span></div>' +
        (S.res[k] === 1 ? '' : '<div class="s"><b>Para revisar:</b> ' + b.ideia + '</div>') + '</li>').join('') + '</ul>' +
      '<button class="btn" id="refazer">Refazer a atividade</button><button class="btn sec" id="outro">Escolher outro ano</button></section>';
    document.getElementById('refazer').addEventListener('click', comecar);
    document.getElementById('outro').addEventListener('click', inicio);
    topo();
  }

  inicio();
})();
