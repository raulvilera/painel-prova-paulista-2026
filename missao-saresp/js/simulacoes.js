/* =========================================================================
   MISSÃO SARESP 3D — Simulações em 3D
   Cada simulação: { id, titulo, html, iniciar(ctx) -> { raiz, vistas, atualizar, destruir } }
   ========================================================================= */
(function () {
  const T = THREE;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const lerp = (a, b, k) => a + (b - a) * k;
  const fmt = n => String(n).replace(".", ",");

  /* ---------- gráfico de linhas simples ---------- */
  function grafico(cv, series, o) {
    o = o || {};
    const dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
    if (cv.width !== w * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
    const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
    const cs = getComputedStyle(document.documentElement), muted = cs.getPropertyValue("--muted").trim() || "#93a8c8";
    const L = 30, B = h - 16, A = 10, W = w - L - 8;
    g.strokeStyle = muted; g.globalAlpha = .5; g.beginPath(); g.moveTo(L, A); g.lineTo(L, B); g.lineTo(L + W, B); g.stroke(); g.globalAlpha = 1;
    const max = o.max || Math.max(1, ...series.flatMap(s => s.d));
    const n = Math.max(o.minN || 60, ...series.map(s => s.d.length));
    g.fillStyle = muted; g.font = "10px sans-serif"; g.fillText(Math.round(max), 2, A + 8); g.fillText("0", 18, B); if (o.rotX) g.fillText(o.rotX, L + W - 60, h - 3);
    if (o.linha) { const y = B - o.linha.v / max * (B - A); g.setLineDash([4, 4]); g.strokeStyle = o.linha.cor; g.beginPath(); g.moveTo(L, y); g.lineTo(L + W, y); g.stroke(); g.setLineDash([]); g.fillStyle = o.linha.cor; g.fillText(o.linha.txt, L + 4, y - 3); }
    series.forEach(s => { if (s.d.length < 2) return; g.strokeStyle = s.cor; g.lineWidth = 2.2; g.beginPath();
      s.d.forEach((v, i) => { const x = L + i / (n - 1) * W, y = B - Math.min(v, max) / max * (B - A); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); g.lineWidth = 1; });
  }
  function medidor(id, rot, val) { return `<div><small>${rot}</small><b id="${id}">${val}</b></div>`; }
  function chao(r, cor, op) { const m = GEO.malha(new T.CircleGeometry(r, 64), GEO.mat(cor, { op: op ?? 1, rough: .9 })); m.rotation.x = -Math.PI / 2; return m; }

  const lista = [];

  const basico = (cor, op) => new T.MeshBasicMaterial({ color: cor, transparent: (op ?? 1) < 1, opacity: op ?? 1, side: T.DoubleSide, depthWrite: (op ?? 1) >= .6 });
  // esfera com metade clara voltada para +z (gire o grupo para apontar ao Sol)
  // tex: "terra" ou "lua" → esfera com textura de alta qualidade e uma "capa de noite" no lado oposto ao Sol
  function meiaLuz(r, corDia, corNoite, seg, tex) {
    const g = new T.Group();
    if (tex) {
      const tx = tex === "terra" ? TEX.terra() : TEX.lua();
      const dia = new T.Mesh(new T.SphereGeometry(r, 96, 64), new T.MeshBasicMaterial({ map: tx.map, color: 0xffffff }));
      g.add(dia);
      g.add(new T.Mesh(new T.SphereGeometry(r * 1.006, 96, 64, Math.PI, Math.PI), new T.MeshBasicMaterial({ color: 0x020617, transparent: true, opacity: .8, depthWrite: false })));
      if (tex === "terra") { const at = new T.Mesh(new T.SphereGeometry(r * 1.07, 64, 48), TEX.materialAtmosfera(0x60a5fa, 1)); g.add(at); }
      return g;
    }
    g.add(new T.Mesh(new T.SphereGeometry(r, seg || 40, 28, 0, Math.PI), basico(corDia)));
    g.add(new T.Mesh(new T.SphereGeometry(r * .998, seg || 40, 28, Math.PI, Math.PI), basico(corNoite)));
    return g;
  }
  // Sol com textura e brilho
  function solSim(r, pos) { const s = GEO.solHD(r); GEO.enfeitarSol(s, r, .8); if (pos) s.position.copy(pos); return s; }
  function arvore(G, alt, cor) {
    const g = new T.Group(), mt = G.mat(0x6b4423, { rough: .8 });
    g.add(G.malha(new T.CylinderGeometry(alt * .05, alt * .08, alt * .5, 12), mt, V(0, alt * .25, 0)));
    const mf = G.mat(cor || 0x2f7d32, { rough: .7 });
    [[0, .62, 0, .32], [.14, .75, .08, .24], [-.13, .74, -.06, .25], [0, .9, 0, .2]].forEach(([x, y, z, r]) => g.add(G.malha(G.deformar(new T.SphereGeometry(alt * r, 40, 30), alt * r * .12, 3 / (alt * r)), mf, V(x * alt, y * alt, z * alt))));
    return g;
  }
  function pergunta(id, txt, ops, certa, explica) {
    return `<div class="cartao pequeno" style="margin-top:10px" id="${id}"><b>Pense:</b> ${txt}<div class="opcoes" style="margin-top:8px">${ops.map((o, i) => `<button class="opcao" data-c="${i}">${o}</button>`).join("")}</div><div class="fb"></div></div>`;
  }
  function ligarPergunta(ctx, id, certa, explica) {
    const box = ctx.$("#" + id); if (!box) return;
    box.querySelectorAll(".opcao").forEach(b => b.onclick = () => { const ok = +b.dataset.c === certa;
      box.querySelectorAll(".opcao").forEach(x => { x.disabled = true; if (+x.dataset.c === certa) x.classList.add("certa"); else if (x === b) x.classList.add("errada"); });
      box.querySelector(".fb").innerHTML = `<div class="destaque ${ok ? "saude" : "erro"}">${ok ? "Isso! " : "Ainda não. "}${explica}</div>`;
      if (ok && window.XP) window.XP.ganhar(10, "Pergunta da simulação"); });
  }
  const DEG = Math.PI / 180;

  /* =====================================================================
     1. FASES DA LUA E ECLIPSES
     ===================================================================== */
  lista.push({
    id: "fases", em: "🌗", titulo: "Fases da Lua e eclipses", hab: "6º AE2 · 8º AE8", aulas: "Descritor mais crítico da escola: 25,6% (6º) e 30,2% (8º)",
    desc: "Mova a Lua ao redor da Terra e veja, ao mesmo tempo, como ela aparece no céu do Brasil. Descubra por que não há eclipse todo mês.",
    html: `<div class="linha-btn" id="atalhos"><button class="chip" data-d="0">🌑 Nova</button><button class="chip" data-d="7.4">🌓 Crescente</button><button class="chip" data-d="14.8">🌕 Cheia</button><button class="chip" data-d="22.1">🌗 Minguante</button></div>
      <label class="mini-txt">Dia do ciclo lunar: <b id="dia">0</b> de 29,5</label><input type="range" id="sl" min="0" max="29.5" step="0.1" value="0" style="width:100%">
      <div style="display:flex;gap:12px;align-items:center;margin:8px 0"><canvas id="ceu" width="120" height="120" style="width:120px;height:120px;border-radius:12px;background:#020617"></canvas>
      <div><div class="destaque" id="txt" style="margin:0"></div><small class="muted">Como a Lua aparece para quem está no Hemisfério Sul.</small></div></div>
      <label class="chk"><input type="checkbox" id="incl" checked> Órbita inclinada (5°, exagerada no desenho)</label>
      <div class="linha-btn"><button class="btn" id="mes">⏭ Avançar um mês</button><button class="btn" id="auto">⏯ Automático</button></div>
      <div class="destaque aviso" id="ecl">Sem eclipse.</div>
      <details><summary>Entenda</summary><p>O Sol ilumina sempre metade da Lua. Conforme a Lua gira ao redor da Terra, vemos daqui uma parte maior ou menor dessa metade iluminada: são as <b>fases</b>. A sombra da Terra não causa as fases.</p><p><b>Eclipse solar</b>: Lua nova + alinhamento (a sombra da Lua cai na Terra). <b>Eclipse lunar</b>: Lua cheia + alinhamento (a Lua entra na sombra da Terra). Como a órbita da Lua é inclinada, na maioria dos meses ela passa acima ou abaixo da sombra.</p></details>
      ${pergunta("pF", "Em que fase da Lua pode acontecer um eclipse solar?", ["Lua cheia", "Lua nova", "Quarto crescente", "Em qualquer fase"], 1, "O eclipse solar exige a Lua entre o Sol e a Terra, o que só acontece na Lua nova.")}`,
    iniciar(ctx) {
      const G = ctx.G, raiz = new T.Group();
      const sol = solSim(3, V(-34, 0, 0)); raiz.add(sol); sol.userData.info = "Sol: ilumina sempre metade da Terra e metade da Lua.";
      for (let i = -3; i <= 3; i++) { const r = G.malha(new T.CylinderGeometry(.04, .04, 22, 4), basico(0xfde68a, .35), V(-20, i * 1.4, 0), [0, 0, Math.PI / 2]); raiz.add(r); }
      const terra = meiaLuz(1.6, 0x38bdf8, 0x0f172a, 0, "terra"); terra.rotation.y = -Math.PI / 2; raiz.add(terra); terra.children.forEach(c => c.userData.info = "Terra: metade de dia (voltada para o Sol) e metade de noite.");
      const sombraT = G.malha(new T.CylinderGeometry(1.2, 1.6, 14, 32, 1, true), basico(0x000000, .35), V(7, 0, 0), [0, 0, Math.PI / 2]); raiz.add(sombraT); sombraT.userData.info = "Sombra da Terra: se a Lua entrar aqui, acontece um eclipse lunar.";
      const R = 7, orbita = new T.Mesh(new T.TorusGeometry(R, .03, 4, 160), basico(0xa78bfa, .7)); raiz.add(orbita);
      const lua = meiaLuz(.55, 0xf8fafc, 0x334155, 0, "lua"); lua.rotation.y = -Math.PI / 2; raiz.add(lua); lua.children.forEach(c => c.userData.info = "Lua: a metade clara é a iluminada pelo Sol.");
      const sombraL = G.malha(new T.ConeGeometry(.55, 7.5, 24, 1, true), basico(0x000000, .4)); sombraL.rotation.z = Math.PI / 2; raiz.add(sombraL);
      const mancha = G.malha(new T.CircleGeometry(.35, 24), basico(0x000000, .85)); raiz.add(mancha); mancha.visible = false;
      let d = 0, no = 40 * DEG, auto = false;
      const sl = ctx.$("#sl"), cv = ctx.$("#ceu"), g2 = cv.getContext("2d");
      function nomeFase(d) { const f = d / 29.53; if (f < .03 || f > .97) return "Lua nova"; if (f < .22) return "Crescente (côncava)"; if (f < .28) return "Quarto crescente"; if (f < .47) return "Crescente gibosa"; if (f < .53) return "Lua cheia"; if (f < .72) return "Minguante gibosa"; if (f < .78) return "Quarto minguante"; return "Minguante (côncava)"; }
      function desenhaCeu(th) {
        const w = 120, r = 46, c = w / 2; g2.clearRect(0, 0, w, w); g2.fillStyle = "#020617"; g2.fillRect(0, 0, w, w);
        g2.fillStyle = "#334155"; g2.beginPath(); g2.arc(c, c, r, 0, 7); g2.fill();
        const k = Math.cos(th), cres = Math.sin(th) >= 0; // crescente: lado esquerdo aceso no Hemisfério Sul
        g2.fillStyle = "#f8fafc"; g2.beginPath(); g2.arc(c, c, r, cres ? Math.PI / 2 : -Math.PI / 2, cres ? Math.PI * 1.5 : Math.PI / 2); g2.fill();
        g2.fillStyle = k > 0 ? "#334155" : "#f8fafc"; g2.beginPath(); g2.ellipse(c, c, Math.abs(k) * r + .5, r + .5, 0, 0, 7); g2.fill();
        if (Math.abs(k) < .02) { g2.fillStyle = "#f8fafc"; g2.fillRect(cres ? c - r : c, c - r, r, 2 * r); }
      }
      function atualizar() {
        const th = d / 29.53 * Math.PI * 2, inc = ctx.$("#incl").checked ? 15 * DEG : 0;
        const x = -Math.cos(th) * R, z = Math.sin(th) * R, y = Math.sin(th - no) * R * Math.sin(inc);
        lua.position.set(x, y, z); sombraL.position.set(x + 3.75, y, z); sombraL.visible = Math.cos(th) > .6;
        orbita.rotation.set(Math.PI / 2 + Math.sin(no + Math.PI / 2) * inc, Math.cos(no + Math.PI / 2) * inc, 0);
        ctx.$("#dia").textContent = fmt(d.toFixed(1));
        const lua4 = Math.abs(y) < .9, nova = Math.cos(th) > .985, cheia = Math.cos(th) < -.985;
        let e = "Sem eclipse.", cls = "aviso";
        if (nova && lua4) { e = "☀️🌑 ECLIPSE SOLAR! A sombra da Lua atinge a Terra (Lua nova alinhada)."; cls = "saude"; }
        else if (cheia && lua4) { e = "🌕🔴 ECLIPSE LUNAR! A Lua entrou na sombra da Terra (Lua cheia alinhada)."; cls = "saude"; }
        else if (nova || cheia) e = `Lua ${nova ? "nova" : "cheia"}, mas sem eclipse: a Lua passou ${y > 0 ? "acima" : "abaixo"} da linha Sol–Terra.`;
        const el = ctx.$("#ecl"); el.textContent = e; el.className = "destaque " + cls;
        mancha.visible = nova && lua4; if (mancha.visible) { mancha.position.set(-1.62, y * .2, z * .2); mancha.rotation.y = -Math.PI / 2; }
        lua.children[0].material.color.setHex(cheia && lua4 ? 0xb45309 : 0xf8fafc);
        ctx.$("#txt").innerHTML = `<b>${nomeFase(d)}</b>`;
        desenhaCeu(th);
      }
      sl.oninput = () => { d = +sl.value; atualizar(); };
      ctx.cartao.querySelectorAll("#atalhos [data-d]").forEach(b => b.onclick = () => { d = +b.dataset.d; sl.value = d; atualizar(); });
      ctx.$("#incl").onchange = atualizar;
      ctx.$("#mes").onclick = () => { no += 31 * DEG; atualizar(); ctx.avisar("Um mês depois: a linha onde as órbitas se cruzam mudou de posição em relação ao Sol."); };
      ctx.$("#auto").onclick = () => auto = !auto;
      ligarPergunta(ctx, "pF", 1, "O eclipse solar exige a Lua entre o Sol e a Terra, o que só acontece na Lua nova.");
      ctx.rotulos([{ txt: "Sol", obj: sol, dy: 3.8, cor: "#fbbf24" }, { txt: "Terra", obj: terra, dy: 2.3, cor: "#38bdf8" }, { txt: "Lua", obj: lua, dy: 1, cor: "#e2e8f0" }, { txt: "Sombra da Terra", pos: V(12, 1.9, 0), cor: "#94a3b8" }]);
      atualizar();
      return { raiz, vistas: [["De cima", [0, 28, 9], [0, 0, 0]], ["De lado", [2, 2.5, 22], [0, 0, 0]], ["Com o Sol", [-14, 14, 26], [-10, 0, 0]]],
        atualizar(dt) { if (auto) { d = (d + dt * 2.2) % 29.53; if (d < dt * 2.2) no += 31 * DEG; sl.value = d; atualizar(); } } };
    }
  });

  /* =====================================================================
     2. ESTAÇÕES DO ANO
     ===================================================================== */
  lista.push({
    id: "estacoes", em: "🌞", titulo: "Estações do ano", hab: "6º AE2 · 8º AE8 · 8º AE9", aulas: "Translação + eixo inclinado",
    desc: "Leve a Terra ao redor do Sol mês a mês. Veja qual hemisfério recebe luz mais direta e desmonte o mito da distância.",
    html: `<label class="mini-txt">Mês: <b id="mesT">Dezembro</b></label><input type="range" id="sl" min="0" max="11" step="1" value="11" style="width:100%">
      <div class="medidores">${medidor("mHS", "Hemisfério Sul", "")}${medidor("mHN", "Hemisfério Norte", "")}${medidor("mDia", "Duração do dia em SP", "")}${medidor("mDist", "Distância Terra–Sol", "")}</div>
      <label class="chk"><input type="checkbox" id="semIncl"> Testar: e se o eixo NÃO fosse inclinado?</label>
      <div class="destaque" id="txt"></div>
      ${pergunta("pE", "Em janeiro a Terra está perto do ponto mais próximo do Sol. Por que é inverno no Hemisfério Norte?", ["Porque o Hemisfério Norte está inclinado para longe do Sol", "Porque o Sol esfria em janeiro", "Porque a Lua bloqueia o Sol", "Porque a Terra para de girar"], 0, "É a inclinação do eixo, e não a distância, que causa as estações.")}`,
    iniciar(ctx) {
      const G = ctx.G, raiz = new T.Group();
      const sol = solSim(2.4); raiz.add(sol); sol.userData.info = "Sol";
      const R = 12; raiz.add(new T.Mesh(new T.TorusGeometry(R, .03, 4, 200), basico(0x22d3ee, .6))).rotation.x = Math.PI / 2;
      const terraG = new T.Group(); raiz.add(terraG);
      const luz = meiaLuz(1.5, 0x7dd3fc, 0x0b1a33, 0, "terra"); terraG.add(luz); luz.children.forEach(c => c.userData.info = "Metade iluminada (dia) e metade escura (noite).");
      const incl = new T.Group(); terraG.add(incl);
      const globo = luz.children[0]; luz.remove(globo); incl.add(globo); // a Terra gira no próprio eixo inclinado; a "noite" fica sempre do lado oposto ao Sol
      incl.add(G.malha(new T.CylinderGeometry(.04, .04, 4.4, 6), basico(0xf472b6)));
      const anel = (lat, cor) => { const r = 1.53 * Math.cos(lat * DEG); const a = new T.Mesh(new T.TorusGeometry(r, .022, 8, 128), basico(cor)); a.rotation.x = Math.PI / 2; a.position.y = 1.53 * Math.sin(lat * DEG); incl.add(a); return a; };
      anel(0, 0xfacc15); anel(-23.4, 0xfb923c); anel(23.4, 0xfb923c);
      const sp = G.malha(new T.SphereGeometry(.12, 10, 8), basico(0xef4444)); incl.add(sp);
      const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      const sl = ctx.$("#sl"); let girar = 0;
      function atualizar() {
        const mI = +sl.value, d = mI * 30.4 + 15, th = 2 * Math.PI * (d - 354) / 365, sem = ctx.$("#semIncl").checked;
        terraG.position.set(R * Math.cos(th), 0, -R * Math.sin(th));
        incl.rotation.set(0, 0, sem ? 0 : -23.44 * DEG);
        luz.lookAt(sol.getWorldPosition(new T.Vector3())); // +z da meia-luz aponta para o Sol
        const dec = sem ? 0 : -23.44 * Math.cos(2 * Math.PI * (d + 10) / 365), fi = -23.55;
        const ch = -Math.tan(fi * DEG) * Math.tan(dec * DEG), h = Math.acos(Math.max(-1, Math.min(1, ch))) / Math.PI * 24;
        const est = s => { if (sem) return "Sem estações marcadas"; const sul = [11, 0, 1].includes(mI) ? "Verão" : [2, 3, 4].includes(mI) ? "Outono" : [5, 6, 7].includes(mI) ? "Inverno" : "Primavera"; const inv = { "Verão": "Inverno", "Inverno": "Verão", "Outono": "Primavera", "Primavera": "Outono" }; return s ? sul : inv[sul]; };
        ctx.$("#mesT").textContent = meses[mI]; ctx.$("#mHS").textContent = est(true); ctx.$("#mHN").textContent = est(false);
        ctx.$("#mDia").textContent = Math.floor(h) + "h" + String(Math.round(h % 1 * 60)).padStart(2, "0");
        const dist = 149.6 * (1 - .0167 * Math.cos(2 * Math.PI * (d - 3) / 365.25)); ctx.$("#mDist").textContent = fmt(dist.toFixed(1)) + " mi km";
        ctx.$("#txt").innerHTML = sem ? "Sem inclinação, os dois hemisférios receberiam a mesma luz o ano todo e os dias teriam sempre cerca de 12 horas: quase não haveria estações." :
          (dec < -10 ? "O <b>Hemisfério Sul</b> está inclinado para o Sol: recebe luz mais direta e dias mais longos." : dec > 10 ? "O <b>Hemisfério Norte</b> está inclinado para o Sol. Aqui no Sul, os raios chegam mais inclinados e os dias são mais curtos." : "Perto do <b>equinócio</b>: os dois hemisférios recebem luz parecida, e dia e noite têm cerca de 12 horas.") + " Repare que a distância ao Sol quase não muda.";
      }
      sl.oninput = atualizar; ctx.$("#semIncl").onchange = atualizar;
      ligarPergunta(ctx, "pE", 0, "É a inclinação do eixo, e não a distância, que causa as estações.");
      const pto = (p) => { const o = new T.Object3D(); o.position.copy(p); incl.add(o); return o; }, la = 23.4 * DEG;
      ctx.rotulos([{ txt: "Sol", obj: sol, dy: 3.2, cor: "#fbbf24" }, { txt: "Terra", obj: terraG, dy: 2.6, cor: "#38bdf8" }, { txt: "Trópico de Capricórnio", obj: sp, dy: -.5, cor: "#fb923c" },
        { txt: "Eixo de rotação (inclinado 23,5°)", obj: pto(V(0, 2.2, 0)), cor: "#f472b6" }, { txt: "Linha do Equador", obj: pto(V(1.53, 0, 0)), cor: "#facc15" },
        { txt: "Trópico de Câncer", obj: pto(V(1.53 * Math.cos(la), 1.53 * Math.sin(la), 0)), cor: "#fb923c" }, { txt: "Órbita da Terra", pos: V(R * .71, 0, R * .71), cor: "#22d3ee" }]);
      atualizar();
      return { raiz, vistas: [["Órbita", [0, 26, 36], [0, 0, 0]], ["Perto da Terra", [20, 4, 10], [12, 0, 0]], ["De lado", [0, 2, 38], [0, 0, 0]]],
        atualizar(dt) { girar += dt; globo.rotation.y = girar * .6; const lat = -23.55 * DEG; sp.position.set(1.55 * Math.cos(lat), 1.55 * Math.sin(lat), 0); } };
    }
  });

  /* =====================================================================
     3. DIA, NOITE E SOMBRAS
     ===================================================================== */
  lista.push({
    id: "sombras", em: "🕰️", titulo: "Movimento aparente do Sol e sombras", hab: "6º AE2 · 8º AE8", aulas: "Rotação da Terra · relógio de sol",
    desc: "Mude a hora do dia e acompanhe o Sol 'caminhando' no céu e a sombra de um poste no pátio da escola, em São Paulo.",
    html: `<label class="mini-txt">Hora: <b id="hora">12h00</b></label><input type="range" id="sl" min="5.5" max="18.5" step="0.05" value="8" style="width:100%">
      <div class="linha-btn" id="est"><button class="chip ativo" data-dec="0">Equinócio (mar./set.)</button><button class="chip" data-dec="-23.44">Verão (dez.)</button><button class="chip" data-dec="23.44">Inverno (jun.)</button></div>
      <div class="medidores">${medidor("mAlt", "Altura do Sol", "")}${medidor("mSom", "Sombra do poste de 3 m", "")}</div>
      <div class="linha-btn"><button class="btn" id="auto">⏯ Passar o dia</button></div>
      <div class="destaque" id="txt"></div>
      ${pergunta("pS", "Por que a sombra muda de tamanho e de direção durante o dia?", ["Porque a Terra gira (rotação) e o Sol muda de posição no céu", "Porque o poste se move", "Porque a Lua passa na frente do Sol", "Porque o Sol se aproxima da Terra ao meio-dia"], 0, "O movimento do Sol no céu é aparente: quem gira é a Terra.")}`,
    iniciar(ctx) {
      const G = ctx.G, raiz = new T.Group();
      const piso = new T.Mesh(new T.CircleGeometry(12, 128), G.matT({ map: TEX.rosaVentos(), roughness: .95 })); piso.rotation.x = -Math.PI / 2; raiz.add(piso);
      const borda = G.malha(new T.TorusGeometry(12, .12, 12, 160), G.mat(0x94a3b8, { rough: .5 }), null, [Math.PI / 2, 0, 0]); raiz.add(borda);
      const poste = G.malha(new T.CylinderGeometry(.09, .12, 3, 32), G.mat(0xe5e7eb, { metal: .6, rough: .3 }), V(0, 1.5, 0)); raiz.add(poste); poste.userData.info = "Poste de 3 m (gnômon).";
      raiz.add(G.malha(new T.CylinderGeometry(.45, .55, .12, 40), G.mat(0x64748b, { rough: .5 }), V(0, .06, 0)));
      raiz.add(G.malha(new T.SphereGeometry(.14, 24, 18), G.mat(0xfacc15, { metal: .5, rough: .3 }), V(0, 3.05, 0)));
      [[8.5, -6], [-8, -7.4], [9.6, 5.2], [-9.2, 5.8]].forEach(([x, z], i) => { const a = arvore(G, 3.2 + i * .4, [0x2f7d32, 0x3f8f3a, 0x2c6e2f, 0x4d9a3f][i]); a.position.set(x, 0, z); raiz.add(a); });
      const somb = G.malha(new T.BoxGeometry(1, .02, .22), basico(0x020617, .6)); somb.geometry.translate(.5, 0, 0); somb.position.y = .03; raiz.add(somb);
      const sol = solSim(.9); raiz.add(sol);
      const arco = new T.Line(new T.BufferGeometry(), new T.LineDashedMaterial({ color: 0xfde68a, dashSize: .4, gapSize: .3 })); raiz.add(arco);
      const rotPC = [["N", 0, -11], ["S", 0, 11], ["L (leste)", 11, 0], ["O (oeste)", -11, 0]].map(([t, x, z]) => ({ txt: t, pos: V(x, .3, z), cor: "#5eead4" }));
      let dec = 0, h = 8, auto = false; const sl = ctx.$("#sl"), fi = -23.55 * DEG;
      function dirSol(H, dc) { const d = dc * DEG; const E = -Math.cos(d) * Math.sin(H), N = Math.cos(fi) * Math.sin(d) - Math.sin(fi) * Math.cos(d) * Math.cos(H), U = Math.sin(fi) * Math.sin(d) + Math.cos(fi) * Math.cos(d) * Math.cos(H); return V(E, U, -N); }
      function atualizar() {
        const H = (h - 12) * 15 * DEG, v = dirSol(H, dec), alt = Math.asin(v.y) / DEG;
        sol.position.copy(v.clone().multiplyScalar(14)); sol.visible = v.y > -.02;
        const pts = []; for (let k = 5; k <= 19; k += .25) { const u = dirSol((k - 12) * 15 * DEG, dec); if (u.y > -.02) pts.push(u.multiplyScalar(14)); } arco.geometry.setFromPoints(pts); arco.computeLineDistances();
        ctx.$("#hora").textContent = Math.floor(h) + "h" + String(Math.round(h % 1 * 60)).padStart(2, "0");
        if (v.y > .02) { const L = Math.min(20, 3 / Math.tan(alt * DEG)); somb.visible = true; somb.scale.x = L; somb.rotation.y = Math.atan2(v.z, -v.x) ; ctx.$("#mSom").textContent = L >= 20 ? "muito longa" : fmt(L.toFixed(1)) + " m"; ctx.$("#mAlt").textContent = Math.round(alt) + "°"; }
        else { somb.visible = false; ctx.$("#mSom").textContent = "—"; ctx.$("#mAlt").textContent = "abaixo do horizonte"; }
        ctx.$("#txt").innerHTML = v.y <= .02 ? "🌙 É noite: este lado da Terra está voltado para longe do Sol." : h < 11 ? "De manhã, o Sol está do lado <b>leste</b> e a sombra aponta para o <b>oeste</b>. A sombra é longa porque o Sol está baixo." : h > 13 ? "À tarde, o Sol vai para o <b>oeste</b> e a sombra aponta para o <b>leste</b>, crescendo de novo." : "Perto do meio-dia o Sol está mais alto e a sombra é a <b>menor</b> do dia." + (dec > 0 ? " No inverno o Sol fica mais baixo e a sombra ao meio-dia é maior." : dec < 0 ? " No verão, em SP, o Sol do meio-dia passa quase sobre a cabeça." : "");
      }
      sl.oninput = () => { h = +sl.value; atualizar(); };
      ctx.cartao.querySelectorAll("#est [data-dec]").forEach(b => b.onclick = () => { dec = +b.dataset.dec; ctx.cartao.querySelectorAll("#est .chip").forEach(x => x.classList.toggle("ativo", x === b)); atualizar(); });
      ctx.$("#auto").onclick = () => auto = !auto;
      ligarPergunta(ctx, "pS", 0, "O movimento do Sol no céu é aparente: quem gira é a Terra.");
      const pSomb = new T.Object3D(); pSomb.position.x = .75; somb.add(pSomb);
      const rSomb = { txt: "Sombra do poste", obj: pSomb, cor: "#94a3b8" }, rArco = { txt: "Caminho aparente do Sol", pos: V(0, 14, 0), cor: "#fde68a" };
      const atualizar0 = atualizar; atualizar = function () { atualizar0(); rSomb.oculto = !somb.visible; const n = arco.geometry.attributes.position; if (n && n.count) { const k = n.count * .25 | 0; rArco.pos = V(n.getX(k), n.getY(k), n.getZ(k)); rArco.oculto = false; } else rArco.oculto = true; };
      ctx.rotulos(rotPC.concat([{ txt: "Sol", obj: sol, dy: 1.4, cor: "#fbbf24" }, { txt: "Poste (gnômon)", obj: poste, dy: 1.9, cor: "#e5e7eb" }, rSomb, rArco, { txt: "Árvores", pos: V(8.5, 5, -6), cor: "#4ade80" }]));
      atualizar();
      return { raiz, vistas: [["Pátio", [4, 13, 30], [0, 4, 0]], ["De cima", [0, 34, .1], [0, 0, 0]]],
        atualizar(dt) { if (auto) { h += dt * .9; if (h > 18.5) h = 5.5; sl.value = h; atualizar(); } } };
    }
  });

  /* =====================================================================
     4. EFEITO ESTUFA
     ===================================================================== */
  lista.push({
    id: "estufa", em: "🌡️", titulo: "Efeito estufa e mudanças climáticas", hab: "7º AE2 · 7º AE7 · 8º AE10", aulas: "Atmosfera, efeito estufa e iniciativas",
    desc: "Controle a quantidade de gás carbônico na atmosfera e veja quanto calor fica preso. Teste ações que aumentam e que diminuem as emissões.",
    html: `<label class="mini-txt">Gás carbônico na atmosfera: <b id="ppm">420</b> ppm</label><input type="range" id="sl" min="0" max="1000" step="5" value="420" style="width:100%">
      <div class="linha-btn"><button class="chip" data-v="0">Sem gases de efeito estufa</button><button class="chip" data-v="280">Antes da Revolução Industrial (280)</button><button class="chip" data-v="420">Hoje (~420)</button></div>
      <div class="medidores">${medidor("mT", "Temperatura média (modelo simples)", "")}${medidor("mR", "Calor que volta para a superfície", "")}</div>
      <h4>Ações humanas</h4><div class="linha-btn" id="acoes"><button class="btn" data-a="60">🔥 Queimadas e desmatamento</button><button class="btn" data-a="80">🚗 Mais carros a gasolina</button><button class="btn" data-a="-60">☀️ Energia solar e eólica</button><button class="btn" data-a="-40">🌳 Reflorestar</button></div>
      <div class="destaque" id="txt"></div>
      ${pergunta("pG", "Sobre o efeito estufa, o que é correto?", ["É natural e necessário, mas as atividades humanas o intensificam", "É sempre prejudicial e deveria acabar", "É causado pelo buraco na camada de ozônio", "Só existe dentro de estufas de plantas"], 0, "Sem ele a Terra teria cerca de −18 °C. O problema é o excesso de gases emitidos.")}`,
    iniciar(ctx) {
      const G = ctx.G, raiz = new T.Group();
      const terra = G.terraHD(4); raiz.add(terra); const nuvE = G.enfeitarTerra(terra, 4, .8); terra.userData.info = "Superfície da Terra: absorve a luz do Sol e emite calor (radiação infravermelha).";
      const atm = G.malha(new T.SphereGeometry(6, 48, 32), G.mat(0x7dd3fc, { op: .15, side: T.DoubleSide, dw: false })); raiz.add(atm); atm.userData.info = "Atmosfera: os gases de efeito estufa (gás carbônico, metano, vapor de água) seguram parte do calor.";
      const sol = solSim(1.6, V(-18, 8, 0)); raiz.add(sol);
      const N = 60, raios = []; const gR = new T.SphereGeometry(.14, 16, 12), mA = basico(0xfde047), mV = basico(0xef4444);
      for (let i = 0; i < N; i++) { const m = new T.Mesh(gR, mA); const b = G.brilhoSprite(0xffffff, .9, .7); m.add(b); raiz.add(m); raios.push({ m, f: 0, t: Math.random(), alvo: V(0, 0, 0) }); }
      let ppm = 420; const sl = ctx.$("#sl");
      const fr = () => ppm <= 0 ? 0 : Math.min(.85, .42 + .12 * Math.log2(ppm / 280));
      function atualizar() {
        const T0 = ppm <= 0 ? -18 : 13.7 + 3 * Math.log2(Math.max(ppm, 1) / 280);
        ctx.$("#ppm").textContent = ppm; ctx.$("#mT").textContent = fmt(T0.toFixed(1)) + " °C"; ctx.$("#mR").textContent = Math.round(fr() * 100) + "%";
        atm.material.opacity = .08 + Math.min(.45, ppm / 2000); atm.material.color.setHex(ppm > 600 ? 0xfca5a5 : 0x7dd3fc);
        ctx.$("#txt").innerHTML = ppm <= 0 ? "Sem gases de efeito estufa, quase todo o calor escaparia e a Terra ficaria congelada, com média perto de −18 °C." : ppm < 300 ? "Efeito estufa natural: a Terra fica aquecida o suficiente para ter água líquida e vida." : ppm < 500 ? "Hoje: a queima de combustíveis fósseis, o desmatamento e as queimadas aumentaram o gás carbônico, e mais calor fica preso. A temperatura média global já subiu." : "Muito gás carbônico: mais calor preso, derretimento de geleiras, subida do nível do mar e eventos extremos mais frequentes.";
      }
      sl.oninput = () => { ppm = +sl.value; atualizar(); };
      ctx.cartao.querySelectorAll("[data-v]").forEach(b => b.onclick = () => { ppm = +b.dataset.v; sl.value = ppm; atualizar(); });
      ctx.cartao.querySelectorAll("#acoes [data-a]").forEach(b => b.onclick = () => { ppm = Math.max(280, Math.min(1000, ppm + +b.dataset.a)); sl.value = ppm; atualizar(); ctx.avisar(+b.dataset.a > 0 ? "Mais emissões: o gás carbônico aumentou." : "Menos emissões ou mais captura de carbono: o gás carbônico diminuiu."); });
      ligarPergunta(ctx, "pG", 0, "Sem ele a Terra teria cerca de −18 °C. O problema é o excesso de gases emitidos.");
      ctx.rotulos([{ txt: "Luz do Sol", obj: sol, dy: 2.2, cor: "#fde047" }, { txt: "Atmosfera", pos: V(0, 6.6, 0), cor: "#7dd3fc" }, { txt: "Calor (infravermelho)", pos: V(6.6, -4, 0), cor: "#ef4444" },
        { txt: "Gases de efeito estufa (CO₂, metano, vapor d'água)", pos: V(-4.4, 4.4, 1), cor: "#fca5a5" }, { txt: "Superfície terrestre", pos: V(-2.4, -3.2, 2), cor: "#4ade80" }, { txt: "Nuvens", pos: V(2.8, 2.9, 1.2), cor: "#e2e8f0" }]);
      atualizar();
      const novaDir = () => V(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize();
      return { raiz, vistas: [["Terra", [6, 4, 22], [-2, 1, 0]], ["Atmosfera", [0, 2, 13], [0, 3, 0]]],
        atualizar(dt) { terra.rotation.y += dt * .05; raios.forEach(r => { r.t += dt * .55;
          if (r.f === 0) { const ini = sol.position, fim = r.alvo; if (!r.dir) { r.dir = novaDir(); r.dir.x = -Math.abs(r.dir.x) - .3; r.dir.normalize(); fim.copy(r.dir).multiplyScalar(4); } r.m.position.lerpVectors(ini, fim, Math.min(1, r.t)); if (r.t >= 1) { r.f = 1; r.t = 0; r.m.material = mV; r.out = fim.clone().normalize(); } }
          else if (r.f === 1) { r.m.position.copy(r.out).multiplyScalar(4 + r.t * 2); if (r.t >= 1) { if (Math.random() < fr()) { r.f = 2; r.t = 0; } else { r.f = 3; r.t = 0; } } }
          else if (r.f === 2) { r.m.position.copy(r.out).multiplyScalar(6 - r.t * 2); if (r.t >= 1) { r.f = 1; r.t = 0; r.out = novaDir(); } }
          else { r.m.position.copy(r.out).multiplyScalar(6 + r.t * 8); if (r.t >= 1) { r.f = 0; r.t = Math.random() * -.8; r.dir = null; r.m.material = mA; } } }); } };
    }
  });

  /* =====================================================================
     5. SELEÇÃO NATURAL (mariposas)
     ===================================================================== */
  lista.push({
    id: "selecao", em: "🦋", titulo: "Seleção natural: as mariposas", hab: "9º AE9 · 9º AE10", aulas: "Lamarck × Darwin · evolução",
    desc: "Pássaros caçam as mariposas que eles enxergam melhor. Mude a cor do tronco e passe as gerações: quem sobrevive e se reproduz mais?",
    html: `<div class="linha-btn" id="amb"><button class="chip ativo" data-t="claro">Tronco claro (com liquens)</button><button class="chip" data-t="escuro">Tronco escuro (fuligem)</button></div>
      <div class="medidores">${medidor("mG", "Geração", "0")}${medidor("mC", "Mariposas claras", "")}${medidor("mE", "Mariposas escuras", "")}</div>
      <canvas id="graf" style="width:100%;height:120px"></canvas>
      <div class="linha-btn"><button class="btn prim" id="ger">🐦 Passar uma geração</button><button class="btn" id="dez">⏩ 10 gerações</button><button class="btn" id="rei">↺ Recomeçar</button></div>
      <div class="destaque" id="txt"></div>
      ${pergunta("pN", "Como Darwin explicaria o aumento de mariposas escuras com o tronco escuro?", ["As escuras já existiam, foram menos caçadas e deixaram mais descendentes", "As mariposas escureceram de propósito para se esconder", "A fuligem pintou as mariposas e elas passaram a cor aos filhos", "Os pássaros ensinaram as mariposas a mudar de cor"], 0, "O ambiente seleciona variações que já existem. 'Mudar por necessidade' ou 'herdar o que se adquire' são ideias de Lamarck.")}`,
    iniciar(ctx) {
      const G = ctx.G, raiz = new T.Group(), Rn = Math.random;
      const gTr = new T.CylinderGeometry(3, 3.4, 16, 128, 64, false), pTr = gTr.attributes.position, vTr = new T.Vector3();
      for (let i = 0; i < pTr.count; i++) { vTr.fromBufferAttribute(pTr, i); const a = Math.atan2(vTr.z, vTr.x), k = 1 + .03 * TEX.fbm(Math.cos(a) * 2, Math.sin(a) * 2, vTr.y * .25, 4) + .015 * Math.sin(a * 26 + TEX.fbm(Math.cos(a), Math.sin(a), vTr.y * .2, 3) * 4); pTr.setXYZ(i, vTr.x * k, vTr.y, vTr.z * k); }
      gTr.computeVertexNormals();
      const cascaC = TEX.casca(false), cascaE = TEX.casca(true);
      const mTr = G.matT({ map: cascaC.map, bumpMap: cascaC.bumpMap, bumpScale: .06, roughness: .95 });
      const tronco = new T.Mesh(gTr, mTr); tronco.position.set(0, 2, 0); raiz.add(tronco); tronco.userData.info = "Tronco da árvore.";
      [[1, 8.5, .4, 1.2], [-1, 7, -.6, 1], [.3, 9.6, -1, .8]].forEach(([dx, y, dz, r]) => { const fim = V(dx * 7, y + 4, dz * 6); const gal = G.tubo([V(dx * 2.6, y, dz * 2.2), V(dx * 4.5, y + 1.8, dz * 3.6), fim], r, mTr, false, 40); raiz.add(gal);
        const copa = new T.Group(); copa.position.copy(fim); raiz.add(copa); const R2 = G.rng(y * 10 | 0);
        for (let k = 0; k < 6; k++) copa.add(G.malha(G.deformar(new T.SphereGeometry(1.4 + R2() * .6, 40, 30), .25, 1.2), G.mat([0x3f7a2f, 0x4d8c36, 0x2f6b28][k % 3], { rough: .75 }), V((R2() - .5) * 3, (R2() - .5) * 1.6, (R2() - .5) * 3))); });
      const chaoS = new T.Mesh(new T.CircleGeometry(10, 128), G.matT({ map: TEX.grama(), roughness: .95 })); chaoS.rotation.x = -Math.PI / 2; chaoS.position.y = -6; raiz.add(chaoS);
      const gA = new T.Shape(); gA.moveTo(0, 0); gA.bezierCurveTo(.5, .45, .9, .2, .8, -.3); gA.bezierCurveTo(.5, -.4, .2, -.2, 0, 0); const geoAsa = new T.ShapeGeometry(gA, 8);
      const corC = 0xf5f5f4, corE = 0x1c1917;
      let pop = [], ger = 0, hist = [], amb = "claro";
      const matAsa = { c: new T.MeshStandardMaterial({ map: TEX.asa(false), side: T.DoubleSide, roughness: .8 }), e: new T.MeshStandardMaterial({ map: TEX.asa(true), side: T.DoubleSide, roughness: .8 }) };
      const geoCorpo = new T.CapsuleGeometry(.08, .55, 8, 16);
      function mariposa(escura) { const g = new T.Group(), m = escura ? matAsa.e : matAsa.c; [1, -1].forEach(s => { const a = new T.Mesh(geoAsa, m); a.scale.x = s; a.rotation.y = s * .25; g.add(a); }); const cp = new T.Mesh(geoCorpo, escura ? matAsa.e : matAsa.c); cp.position.set(0, -.05, .05); g.add(cp); g.userData.escura = escura; g.userData.info = escura ? "Mariposa escura" : "Mariposa clara"; g.children.forEach(c => c.userData.info = g.userData.info); return g; }
      function posicionar(g) { const a = Rn() * Math.PI * 2, y = -4 + Rn() * 13, r = 3.4 - (y + 6) / 16 * .4 + .2; g.position.set(Math.cos(a) * r, y, Math.sin(a) * r); g.lookAt(Math.cos(a) * 10, y, Math.sin(a) * 10); g.scale.setScalar(.9); }
      const rotC = { txt: "Mariposa clara", cor: "#f5f5f4" }, rotE = { txt: "Mariposa escura", cor: "#a8a29e" };
      // o nome aponta para uma mariposa de cada cor que esteja do lado de frente da árvore
      const frente = (cor) => pop.filter(p => p.userData.escura === cor).sort((a, b) => b.position.z - a.position.z)[0];
      function montar(lista) { pop.forEach(p => raiz.remove(p)); pop = lista.map(e => { const g = mariposa(e); posicionar(g); raiz.add(g); return g; });
        [[rotC, false], [rotE, true]].forEach(([r, e]) => { const m = frente(e); r.obj = m || tronco; r.oculto = !m; r.dy = m ? .45 : 0; }); }
      function contagem() { const e = pop.filter(p => p.userData.escura).length; return [pop.length - e, e]; }
      function mostrar() { const [c, e] = contagem(); ctx.$("#mG").textContent = ger; ctx.$("#mC").textContent = c; ctx.$("#mE").textContent = e;
        ctx.grafico(ctx.$("#graf"), [{ d: hist.map(h => h[1]), cor: "#a8a29e" }, { d: hist.map(h => h[0]), cor: "#f5f5f4" }], { max: 40, minN: 20, rotX: "gerações" });
        ctx.$("#txt").innerHTML = amb === "claro" ? "No tronco claro, as mariposas <b>escuras</b> aparecem mais e são mais caçadas." : "No tronco escuro, as mariposas <b>claras</b> ficam visíveis e são mais caçadas. Passe várias gerações e acompanhe o gráfico (linha cinza = escuras)."; }
      function geracao() {
        const sobrev = pop.filter(p => { const visivel = (amb === "claro") === p.userData.escura; return Rn() > (visivel ? .7 : .2); });
        const base = sobrev.length ? sobrev : pop.slice(0, 2), filhos = [];
        for (let i = 0; i < 40; i++) { const pai = base[i % base.length].userData.escura; filhos.push(Rn() < .03 ? !pai : pai); }
        montar(filhos); ger++; hist.push(contagem()); mostrar();
      }
      function reiniciar() { ger = 0; const ini = []; for (let i = 0; i < 40; i++) ini.push(i < 4); montar(ini); hist = [contagem()]; mostrar(); }
      ctx.cartao.querySelectorAll("#amb [data-t]").forEach(b => b.onclick = () => { amb = b.dataset.t; { const cc = amb === "claro" ? cascaC : cascaE; tronco.material.map = cc.map; tronco.material.bumpMap = cc.bumpMap; tronco.material.needsUpdate = true; } ctx.cartao.querySelectorAll("#amb .chip").forEach(x => x.classList.toggle("ativo", x === b)); mostrar(); });
      ctx.$("#ger").onclick = geracao; ctx.$("#dez").onclick = () => { for (let i = 0; i < 10; i++) geracao(); }; ctx.$("#rei").onclick = reiniciar;
      ligarPergunta(ctx, "pN", 0, "O ambiente seleciona variações que já existem. 'Mudar por necessidade' ou 'herdar o que se adquire' são ideias de Lamarck.");
      reiniciar();
      ctx.rotulos([{ txt: "Tronco (cor do ambiente)", pos: V(-3.3, 8.5, 1.4), cor: "#d6d3d1" }, { txt: "Copa da árvore", pos: V(-7, 12.5, -5.2), cor: "#4ade80" }, rotC, rotE, { txt: "Solo", pos: V(6, -5.8, 5), cor: "#84cc16" }]);
      return { raiz, vistas: [["Árvore", [0, 5, 26], [0, 3, 0]], ["Perto", [4, 3, 7], [0, 2, 0]]], atualizar() { } };
    }
  });

  /* =====================================================================
     6. CONSUMO DE ENERGIA ELÉTRICA
     ===================================================================== */
  lista.push({
    id: "energia", em: "🔌", titulo: "Consumo de energia em casa", hab: "8º AE11 · 8º AE13", aulas: "Potência × tempo · transformações de energia",
    desc: "Escolha quantas horas por dia cada aparelho fica ligado. As colunas mostram o consumo do mês em kWh.",
    html: `<div id="lista"></div>
      <div class="medidores">${medidor("mTot", "Consumo do mês", "")}${medidor("mRS", "Conta estimada (R$ 0,85/kWh, exemplo)", "")}</div>
      <div class="destaque" id="txt">Consumo (kWh) = potência (kW) × horas por dia × 30 dias.</div>
      ${pergunta("pC", "Um secador de 1.000 W fica ligado 30 minutos por dia. Quanto ele consome em 30 dias?", ["15 kWh", "30 kWh", "1.000 kWh", "0,5 kWh"], 0, "1 kW × 0,5 h × 30 dias = 15 kWh.")}`,
    iniciar(ctx) {
      const G = ctx.G, raiz = new T.Group();
      const ap = [["🚿 Chuveiro elétrico", 5500, .5, "elétrica → térmica"], ["❄️ Geladeira (média)", 60, 24, "elétrica → mecânica (motor) e térmica"], ["📺 TV LED", 100, 4, "elétrica → luminosa e sonora"], ["💡 Lâmpada LED", 9, 5, "elétrica → luminosa"], ["💡 Lâmpada incandescente", 60, 5, "elétrica → luminosa e muita térmica"], ["👕 Ferro de passar", 1000, .3, "elétrica → térmica"], ["🌀 Ventilador", 100, 6, "elétrica → mecânica"], ["📱 Carregador de celular", 10, 3, "elétrica → química (bateria)"]];
      const cores = [0xef4444, 0x38bdf8, 0xa78bfa, 0xfde047, 0xfb923c, 0xf472b6, 0x34d399, 0x94a3b8];
      raiz.add(G.malha(G.caixaRedonda(26.4, 6.4, .5, .2), G.mat(0x1e293b, { rough: .3, metal: .3 }), V(0, -.25, 0), [-Math.PI / 2, 0, 0]));
      const matBarra = c => { const m = new T.MeshPhysicalMaterial({ color: c, roughness: .2, clearcoat: 1, clearcoatRoughness: .1, metalness: .05 }); m.userData.baseOp = 1; return m; };
      const barras = ap.map((a, i) => { const b = G.malha(new T.CylinderGeometry(1.1, 1.1, 1, 64), matBarra(cores[i]), V(-11.2 + i * 3.2, 0, 0)); raiz.add(G.malha(new T.CylinderGeometry(1.25, 1.25, .12, 64), G.mat(0x334155, { metal: .6, rough: .3 }), V(-11.2 + i * 3.2, .06, 0))); b.geometry.translate(0, .5, 0); b.userData.info = `${a[0]}: ${a[1]} W · ${a[3]}`; raiz.add(b); return b; });
      const box = ctx.$("#lista");
      box.innerHTML = ap.map((a, i) => `<div style="margin:6px 0"><small><b>${a[0]}</b> · ${a[1]} W · <span class="muted">${a[3]}</span></small><div style="display:flex;gap:8px;align-items:center"><input type="range" min="0" max="24" step="0.1" value="${a[2]}" data-i="${i}" style="flex:1"><b id="h${i}" style="min-width:56px;text-align:right"></b></div></div>`).join("");
      const kwh = ap.map(a => a[1] / 1000 * a[2] * 30), alt = kwh.map(() => .05);
      function atualizar() {
        let tot = 0; ap.forEach((a, i) => { kwh[i] = a[1] / 1000 * a[2] * 30; tot += kwh[i]; ctx.$("#h" + i).textContent = fmt(a[2].toFixed(1)) + " h"; });
        ctx.$("#mTot").textContent = fmt(tot.toFixed(1)) + " kWh"; ctx.$("#mRS").textContent = "R$ " + fmt((tot * .85).toFixed(2));
        const maior = kwh.indexOf(Math.max(...kwh)); ctx.$("#txt").innerHTML = `Quem mais gasta: <b>${ap[maior][0]}</b> (${fmt(kwh[maior].toFixed(1))} kWh). Aparelhos que transformam energia elétrica em <b>térmica</b> (chuveiro, ferro) costumam ter a maior potência. Trocar a lâmpada incandescente pela LED gasta cerca de 85% menos para a mesma luz.`;
      }
      box.querySelectorAll("input").forEach(inp => inp.oninput = () => { ap[+inp.dataset.i][2] = +inp.value; atualizar(); });
      ligarPergunta(ctx, "pC", 0, "1 kW × 0,5 h × 30 dias = 15 kWh.");
      const topo = barras.map(b => b.position.clone());
      ctx.rotulos(barras.map((b, i) => ({ txt: "", pos: topo[i], cor: "#" + cores[i].toString(16).padStart(6, "0"), atualizarTxt: () => fmt(kwh[i].toFixed(0)) + " kWh" })).concat(ap.map((a, i) => ({ txt: ["Chuveiro", "Geladeira", "TV", "Lâmpada LED", "Incandescente", "Ferro", "Ventilador", "Carregador"][i] || a[0].replace(/^\S+\s/, ""), pos: V(-11.2 + i * 3.2, -.4, 3.4), cor: "#94a3b8" }))));
      atualizar();
      return { raiz, vistas: [["Painel", [0, 14, 42], [0, 5, 0]], ["De lado", [-30, 10, 22], [0, 5, 0]]],
        atualizar(dt) { barras.forEach((b, i) => { alt[i] = lerp(alt[i], Math.max(.05, kwh[i] / 6), Math.min(1, dt * 4)); b.scale.y = alt[i]; topo[i].y = alt[i] + .7; }); } };
    }
  });

  /* =====================================================================
     7. BIOMAS BRASILEIROS
     ===================================================================== */
  lista.push({
    id: "biomas", em: "🌎", titulo: "Biomas brasileiros e conservação", hab: "7º AE10 · 9º AE11", aulas: "Mata Atlântica, Amazônia, Unidades de Conservação",
    desc: "Compare os seis biomas do Brasil pela chuva, temperatura e área. Clique em uma coluna para ver a ficha do bioma. Depois, jogue 'Qual bioma sou eu?'.",
    html: `<div class="linha-btn" id="met"><button class="chip ativo" data-k="chuva">🌧️ Chuva (mm/ano)</button><button class="chip" data-k="temp">🌡️ Temperatura média (°C)</button><button class="chip" data-k="area">🗺️ Área do Brasil (%)</button></div>
      <p class="mini-txt muted">Chuva e temperatura: valores médios aproximados. Área: IBGE.</p>
      <div class="destaque" id="ficha">Clique em uma coluna no palco 3D ou em um bioma:</div><div class="chips" id="nomes"></div>
      <h4>🎲 Qual bioma sou eu?</h4><div id="jogo"></div>
      ${pergunta("pB", "Uma Reserva Extrativista permite que comunidades coletem castanhas sem derrubar a floresta. Ela é uma unidade de conservação de:", ["Uso sustentável", "Proteção integral", "Uso industrial", "Nenhuma das anteriores"], 0, "Uso sustentável concilia conservação com o uso de parte dos recursos. Parques e estações ecológicas são de proteção integral.")}`,
    iniciar(ctx) {
      const G = ctx.G, raiz = new T.Group();
      const B = [
        { n: "Amazônia", cor: 0x15803d, chuva: 2300, temp: 26, area: 49.3, veg: "Floresta tropical densa, com árvores altas e rios enormes.", fauna: "onça-pintada, boto-cor-de-rosa, arara", ameaca: "desmatamento, queimadas, garimpo ilegal", pista: "Sou a maior floresta tropical do mundo e tenho a maior bacia hidrográfica do planeta." },
        { n: "Cerrado", cor: 0xca8a04, chuva: 1500, temp: 22, area: 23.9, veg: "Savana com árvores baixas de troncos tortos e casca grossa, e capim.", fauna: "lobo-guará, tamanduá-bandeira, ema", ameaca: "expansão da agropecuária e queimadas", pista: "Tenho árvores de troncos tortos e casca grossa, e sou chamado de 'berço das águas' do Brasil." },
        { n: "Mata Atlântica", cor: 0x16a34a, chuva: 1600, temp: 21, area: 13.0, veg: "Floresta úmida ao longo do litoral, com muita biodiversidade.", fauna: "mico-leão-dourado, onça, bugio", ameaca: "foi o bioma mais desmatado; urbanização e expansão agrícola", pista: "Fico perto do litoral, já fui quase todo desmatado e estou presente na Serra do Mar paulista." },
        { n: "Caatinga", cor: 0xa16207, chuva: 650, temp: 27, area: 10.1, veg: "Vegetação adaptada à seca: cactos e árvores que perdem as folhas.", fauna: "asa-branca, tatu-bola, preá", ameaca: "desmatamento para lenha e desertificação", pista: "Sou o único bioma exclusivamente brasileiro, tenho clima semiárido e plantas que perdem as folhas na seca." },
        { n: "Pantanal", cor: 0x0891b2, chuva: 1200, temp: 25, area: 1.8, veg: "Maior planície alagável do mundo, com campos, matas e lagoas.", fauna: "jacaré, tuiuiú, capivara", ameaca: "incêndios, secas extremas e poluição dos rios", pista: "Passo parte do ano alagado e sou a maior planície inundável do mundo." },
        { n: "Pampa", cor: 0x65a30d, chuva: 1400, temp: 18, area: 2.1, veg: "Campos com gramíneas, no extremo sul do país.", fauna: "veado-campeiro, ema, quero-quero", ameaca: "monoculturas e pastoreio excessivo", pista: "Sou formado por campos de vegetação rasteira, no Rio Grande do Sul, com invernos frios." }];
      const MAX = { chuva: 2400, temp: 30, area: 50 }, uni = { chuva: " mm", temp: " °C", area: "%" };
      let k = "chuva"; const alt = B.map(() => .1);
      raiz.add(G.malha(G.caixaRedonda(24.4, 7.4, .5, .2), G.mat(0x1e293b, { rough: .3, metal: .3 }), V(0, -.25, 0), [-Math.PI / 2, 0, 0]));
      // mini paisagem de cada bioma na frente da barra
      function paisagem(i, x) {
        const g = new T.Group(); g.position.set(x, 0, 2.1);
        const solo = [0x5b4630, 0xb08b57, 0x5b4630, 0xc2a172, 0x6b8e4e, 0x7aa35a][i];
        g.add(G.malha(new T.CylinderGeometry(1.5, 1.6, .25, 48), G.mat(solo, { rough: .9 }), V(0, .12, 0)));
        const Rr = G.rng(i * 31 + 7);
        if (i === 0 || i === 2) for (let k = 0; k < (i ? 6 : 9); k++) { const a = arvore(G, (i ? 1.1 : 1.5) + Rr() * .6, i ? 0x3f8f3a : 0x1f6b2a); a.position.set((Rr() - .5) * 2.2, .25, (Rr() - .5) * 2.2); g.add(a); }
        if (i === 1) for (let k = 0; k < 4; k++) { const t = new T.Group(); t.add(G.tubo([V(0, 0, 0), V(.12, .35, 0), V(-.05, .7, .05), V(.08, .95, 0)], .05, G.mat(0x5c4033, { rough: .9 }), false, 20)); t.add(G.malha(G.deformar(new T.IcosahedronGeometry(.32, 3), .05, 6), G.mat(0x6b8e23, { rough: .8 }), V(.08, 1.05, 0), null, [1.4, .6, 1.2])); t.position.set((Rr() - .5) * 2.2, .25, (Rr() - .5) * 2.2); g.add(t); }
        if (i === 3) for (let k = 0; k < 4; k++) { const c = new T.Group(), mc = G.mat(0x4d7c3a, { rough: .6 }); c.add(G.malha(new T.CapsuleGeometry(.1, .7, 8, 16), mc, V(0, .45, 0))); c.add(G.malha(new T.CapsuleGeometry(.07, .3, 8, 16), mc, V(.16, .55, 0), [0, 0, -.9])); c.add(G.malha(new T.CapsuleGeometry(.07, .26, 8, 16), mc, V(-.15, .45, 0), [0, 0, .9])); c.position.set((Rr() - .5) * 2.2, .25, (Rr() - .5) * 2.2); g.add(c); }
        if (i === 4) { g.add(G.malha(new T.CircleGeometry(.9, 48), G.mat(0x38bdf8, { rough: .08, metal: .1 }), V(.2, .26, .1), [-Math.PI / 2, 0, 0])); for (let k = 0; k < 3; k++) { const a = arvore(G, .9, 0x4d7c0f); a.position.set(-1 + k * .5, .25, -.9); g.add(a); } }
        if (i >= 4) for (let k = 0; k < 26; k++) g.add(G.malha(new T.ConeGeometry(.05, .3, 5), G.mat(0x84cc16, { rough: .8 }), V((Rr() - .5) * 2.6, .4, (Rr() - .5) * 2.6)));
        raiz.add(g);
      }
      const matB = c => { const m = new T.MeshPhysicalMaterial({ color: c, roughness: .25, clearcoat: .9, clearcoatRoughness: .15 }); m.userData.baseOp = 1; return m; };
      const bar = B.map((b, i) => { const m = G.malha(new T.CylinderGeometry(1.25, 1.25, 1, 64), matB(b.cor), V(-10 + i * 4, 0, -.8)); m.geometry.translate(0, .5, 0); m.userData.info = b.n; m.userData.bioma = i; raiz.add(m); paisagem(i, -10 + i * 4); return m; });
      function ficha(i) { const b = B[i]; ctx.$("#ficha").innerHTML = `<b>${b.n}</b> · ${b.veg}<br><b>Fauna:</b> ${b.fauna}.<br><b>Ameaças:</b> ${b.ameaca}.`; bar.forEach((m, j) => m.material.emissive.setHex(j === i ? 0x334155 : 0)); }
      ctx.$("#nomes").innerHTML = B.map((b, i) => `<button class="chip" data-b="${i}">${b.n}</button>`).join("");
      ctx.cartao.querySelectorAll("[data-b]").forEach(x => x.onclick = () => ficha(+x.dataset.b));
      ctx.cartao.querySelectorAll("#met [data-k]").forEach(x => x.onclick = () => { k = x.dataset.k; ctx.cartao.querySelectorAll("#met .chip").forEach(y => y.classList.toggle("ativo", y === x)); });
      let alvo = 0, pts = 0, rod = 0;
      function jogo() { alvo = Math.random() * B.length | 0; const box = ctx.$("#jogo");
        box.innerHTML = `<div class="cartao pequeno"><p>“${B[alvo].pista}”</p><div class="opcoes">${B.map((b, i) => `<button class="opcao" data-j="${i}">${b.n}</button>`).join("")}</div><small class="muted">Pontos: ${pts} de ${rod}</small></div>`;
        box.querySelectorAll("[data-j]").forEach(x => x.onclick = () => { rod++; const ok = +x.dataset.j === alvo; if (ok) { pts++; if (window.XP) window.XP.ganhar(5, "Qual bioma sou eu?"); } ctx.avisar(ok ? "✔️ Acertou: " + B[alvo].n : "✖️ Era: " + B[alvo].n); ficha(alvo); setTimeout(jogo, 900); }); }
      jogo();
      ligarPergunta(ctx, "pB", 0, "Uso sustentável concilia conservação com o uso de parte dos recursos. Parques e estações ecológicas são de proteção integral.");
      const topoB = bar.map(m => m.position.clone());
      ctx.rotulos(B.map((b, i) => ({ txt: b.n, pos: V(-10 + i * 4, -.4, 3.8), cor: "#" + b.cor.toString(16).padStart(6, "0") })).concat(bar.map((m, i) => ({ txt: "", pos: topoB[i], cor: "#e2e8f0", atualizarTxt: () => fmt(B[i][k]) + uni[k] }))));
      return { raiz, vistas: [["Painel", [0, 13, 38], [0, 4, 0]], ["De lado", [-28, 9, 20], [0, 4, 0]]],
        atualizar(dt) { bar.forEach((m, i) => { alt[i] = lerp(alt[i], Math.max(.1, B[i][k] / MAX[k] * 10), Math.min(1, dt * 4)); m.scale.y = alt[i]; topoB[i].y = alt[i] + .7; }); } };
    }
  });

  /* =====================================================================
     8. CLASSIFIQUE A CÉLULA
     ===================================================================== */
  lista.push({
    id: "celulas", em: "🔬", titulo: "Classifique a célula", hab: "6º AE5 · 7º AE8", aulas: "Procarionte × eucarionte · animal × vegetal",
    desc: "Uma célula aparece no microscópio 3D. Observe (gire, aproxime) e classifique. 8 rodadas.",
    html: `<div class="destaque" id="txt">Observe a célula e escolha a classificação correta.</div>
      <div class="opcoes" id="ops"><button class="opcao" data-t="pro">Procarionte (bactéria)</button><button class="opcao" data-t="ani">Eucarionte animal</button><button class="opcao" data-t="veg">Eucarionte vegetal</button></div>
      <div class="medidores">${medidor("mR", "Rodada", "1/8")}${medidor("mP", "Acertos", "0")}</div>
      <div class="linha-btn"><button class="btn prim" id="prox" hidden>▶ Próxima célula</button><button class="btn" id="dica">💡 Dica</button><button class="btn" id="novo">↺ Recomeçar</button></div>
      <p class="mini-txt muted" id="rotAviso">🏷️ Os nomes das estruturas aparecem depois que você responde.</p>
      <details><summary>Como diferenciar</summary><ul class="lista"><li><b>Procarionte:</b> sem núcleo (DNA solto), pequena, pode ter flagelo.</li><li><b>Animal:</b> núcleo, formato arredondado, sem parede celular e sem cloroplastos.</li><li><b>Vegetal:</b> núcleo, parede celular rígida (formato de caixa), cloroplastos verdes (com pilhas de tilacoides) e vacúolo central grande.</li></ul></details>`,
    iniciar(ctx) {
      const G = ctx.G, raiz = new T.Group(); let atual = null, tipo = "", rod = 0, pts = 0, fila = [], rot = [];
      // marca um ponto da estrutura para o nome (o ponto gira junto com a célula)
      const marca = (g, pos, txt, cor) => { const o = new T.Object3D(); o.position.copy(pos); g.add(o); rot.push({ txt, obj: o, cor, oculto: true }); return o; };
      /* caixa de cantos arredondados (parede celular vegetal) */
      function caixaRedonda(w, h, d, r) {
        const sh = new T.Shape(), x = -w / 2 + r, y = -h / 2 + r, W = w - 2 * r, H = h - 2 * r;
        sh.moveTo(x, y - r); sh.lineTo(x + W, y - r); sh.quadraticCurveTo(x + W + r, y - r, x + W + r, y); sh.lineTo(x + W + r, y + H); sh.quadraticCurveTo(x + W + r, y + H + r, x + W, y + H + r);
        sh.lineTo(x, y + H + r); sh.quadraticCurveTo(x - r, y + H + r, x - r, y + H); sh.lineTo(x - r, y); sh.quadraticCurveTo(x - r, y - r, x, y - r);
        const g = new T.ExtrudeGeometry(sh, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r * .98, bevelSegments: 10, curveSegments: 18 });
        g.translate(0, 0, -(d - 2 * r) / 2); g.computeVertexNormals(); return g;
      }
      /* ribossomos: centenas de pontinhos numa só malha (leve) */
      function pontos(n, raio, cor, dentro) {
        const im = new T.InstancedMesh(new T.SphereGeometry(raio, 8, 6), G.mat(cor, { rough: .6 }), n), d = new T.Object3D(), Rr = G.rng(n * 7 + 3);
        for (let i = 0; i < n; i++) { d.position.copy(dentro(Rr)); d.updateMatrix(); im.setMatrixAt(i, d.matrix); }
        return im;
      }
      function nucleo(g, pos, r, R) {
        const n = new T.Group(); n.position.copy(pos);
        n.add(G.malha(G.deformar(new T.SphereGeometry(r, 64, 48), r * .04, 2.2), G.mat(0xa78bfa, { op: .55, side: T.DoubleSide, dw: false })));
        n.add(G.malha(new T.SphereGeometry(r * .38, 40, 30), G.mat(0x4c1d95, { rough: .4 }), V(r * .25, r * .15, 0)));
        n.add(G.novelo(r * .75, 40, (R() * 1e5) | 0, r * .025, G.mat(0xe879f9, { rough: .45 })));
        const poros = pontos(70, r * .035, 0x312e81, Rr => { const v = V(Rr() - .5, Rr() - .5, Rr() - .5).normalize(); return v.multiplyScalar(r * 1.0); }); n.add(poros);
        g.add(n); return n;
      }
      function mitocondria(pos, rot, esc) {
        const m = new T.Group(); m.position.copy(pos); m.rotation.set(rot[0], rot[1], rot[2]); m.scale.setScalar(esc);
        m.add(G.malha(new T.CapsuleGeometry(.36, 1.0, 12, 24), G.mat(0xfb923c, { op: .7, dw: false })));
        for (let k = -3; k <= 3; k++) m.add(G.malha(new T.TorusGeometry(.24, .045, 8, 24, Math.PI * 1.3), G.mat(0xc2410c, { rough: .45 }), V(0, k * .17, 0), [Math.PI / 2, 0, k % 2 ? 0 : Math.PI]));
        return m;
      }
      function reticulo(g, centro, raio, R, cor) {
        for (let k = 0; k < 4; k++) { const pts = []; for (let a = 0; a <= 10; a++) { const t = a / 10 * Math.PI * 1.1 + k * .5, rr = raio + k * .32 + Math.sin(a * 1.7) * .18; pts.push(V(centro.x + Math.cos(t) * rr, centro.y + Math.sin(t) * rr, centro.z + (R() - .5) * .8)); } g.add(G.tubo(pts, .09, G.mat(cor, { rough: .45 }), false, 80)); }
      }
      function golgi(pos, rot) {
        const gg = new T.Group(); gg.position.copy(pos); gg.rotation.set(rot[0], rot[1], rot[2]);
        for (let k = 0; k < 5; k++) gg.add(G.malha(new T.TorusGeometry(1.1 - k * .08, .1, 10, 40, Math.PI * .9), G.mat(0xfacc15, { rough: .4 }), V(0, k * .24, 0), [0, 0, Math.PI * .05], [1, 1, 1.8]));
        for (let k = 0; k < 5; k++) gg.add(G.malha(new T.SphereGeometry(.12, 14, 10), G.mat(0xfde047), V(1.2 + k * .15, k * .2, (k % 2 - .5) * .4)));
        return gg;
      }
      function construir(t) {
        const g = new T.Group(), R = G.rng(Math.random() * 1e6 | 0); rot = [];
        if (t === "pro") {
          g.add(G.malha(new T.CapsuleGeometry(1.55, 3.8, 24, 48), G.mat(0x7dd3fc, { op: .22, side: T.DoubleSide, dw: false }), null, [0, 0, Math.PI / 2]));   // cápsula
          g.add(G.malha(new T.CapsuleGeometry(1.35, 3.6, 24, 48), G.mat(0x38bdf8, { op: .35, side: T.DoubleSide, dw: false }), null, [0, 0, Math.PI / 2]));   // parede + membrana
          g.add(G.novelo(1.0, 46, (R() * 1e5) | 0, .055, G.mat(0xf472b6, { rough: .4 })));                                                                     // nucleoide (DNA solto)
          g.add(G.malha(new T.TorusGeometry(.32, .04, 10, 40), G.mat(0xfb7185), V(1.6, .5, .3), [1, .4, 0]));                                                 // plasmídeo
          g.add(G.malha(new T.TorusGeometry(.22, .035, 10, 32), G.mat(0xfb7185), V(-1.9, -.4, -.2), [.3, 1, 0]));
          g.add(pontos(260, .06, 0xfef3c7, Rr => { const x = (Rr() - .5) * 6.2, r = Math.sqrt(Rr()) * 1.15; const a = Rr() * 6.283; return V(x, Math.cos(a) * r, Math.sin(a) * r); }));
          const fl = []; for (let k = 0; k <= 14; k++) fl.push(V(3.2 + k * .38, Math.sin(k * .9) * .35, Math.cos(k * .9) * .2)); g.add(G.tubo(fl, .045, G.mat(0xcbd5e1, { rough: .35 }), false, 120)); // flagelo
          for (let k = 0; k < 18; k++) { const x = (R() - .5) * 5.6, a = R() * 6.283, n = V(0, Math.cos(a), Math.sin(a)); const base = V(x, n.y * 1.5, n.z * 1.5); g.add(G.tubo([base, base.clone().add(n.clone().multiplyScalar(.45))], .015, G.mat(0xbae6fd), false, 4)); } // pili
          marca(g, V(-1.2, 1.55, .6), "Cápsula", "#7dd3fc"); marca(g, V(.6, -1.35, .3), "Parede celular e membrana", "#38bdf8");
          marca(g, V(0, .2, .4), "Nucleoide (DNA solto, sem núcleo)", "#f472b6"); marca(g, V(1.6, .5, .3), "Plasmídeo", "#fb7185");
          marca(g, V(-1.6, -.6, .7), "Ribossomos", "#fef3c7"); marca(g, V(7.4, 0, 0), "Flagelo", "#cbd5e1"); marca(g, V(-2.2, 1.7, -.4), "Pili (fímbrias)", "#bae6fd");
          g.scale.setScalar(.85);
        }
        if (t === "ani") {
          g.add(G.malha(G.deformar(new T.SphereGeometry(4.6, 96, 72), .28, .45), G.mat(0xf9a8d4, { op: .28, side: T.DoubleSide, dw: false })));
          nucleo(g, V(-.4, .3, 0), 1.5, R);
          reticulo(g, V(-.4, .3, 0), 1.9, R, 0x60a5fa);
          g.add(golgi(V(1.9, -1.4, .6), [.4, .6, .3]));
          const mitos = [], lisos = [];
          for (let i = 0; i < 7; i++) { const p = V((R() - .5) * 6, (R() - .5) * 5.4, (R() - .5) * 4); if (p.length() < 2.4) p.setLength(2.8); mitos.push(p); g.add(mitocondria(p, [R() * 3, R() * 3, R() * 3], .9 + R() * .3)); }
          for (let i = 0; i < 6; i++) { const p = V((R() - .5) * 6, (R() - .5) * 5, (R() - .5) * 4); if (p.length() < 2.4) p.setLength(3); lisos.push(p); g.add(G.malha(new T.SphereGeometry(.28, 20, 14), G.mat(0x34d399, { rough: .35 }), p)); } // lisossomos
          const ce = new T.Group(); ce.position.set(1.2, 1.9, -.8); ce.add(G.malha(new T.CylinderGeometry(.12, .12, .6, 18), G.mat(0x94a3b8))); ce.add(G.malha(new T.CylinderGeometry(.12, .12, .6, 18), G.mat(0x94a3b8), V(.25, 0, 0), [0, 0, Math.PI / 2])); g.add(ce); // centríolos
          g.add(pontos(420, .05, 0xfef9c3, Rr => { const v = V(Rr() - .5, Rr() - .5, Rr() - .5).normalize().multiplyScalar(2.2 + Rr() * 1.9); return v; }));
          marca(g, V(-.4, .3, 1.5), "Núcleo", "#a78bfa"); marca(g, V(-.02, .52, .3), "Nucléolo", "#7c3aed"); marca(g, V(-2.3, -.6, .2), "Retículo endoplasmático", "#60a5fa");
          marca(g, V(1.9, -1.2, .6), "Complexo golgiense", "#facc15"); marca(g, mitos[0], "Mitocôndria", "#fb923c"); marca(g, lisos[0], "Lisossomo", "#34d399");
          marca(g, V(1.3, 1.9, -.8), "Centríolos", "#94a3b8"); marca(g, V(0, 4.55, 0), "Membrana plasmática", "#f9a8d4"); marca(g, V(2.6, 2.4, 1.2), "Citoplasma e ribossomos", "#fef9c3");
        }
        if (t === "veg") {
          g.add(G.malha(caixaRedonda(9.4, 6.4, 5.2, .7), G.mat(0x84cc16, { op: .3, side: T.DoubleSide, dw: false, rough: .6 })));      // parede celular
          g.add(G.malha(caixaRedonda(8.8, 5.8, 4.6, .6), G.mat(0xbef264, { op: .14, side: T.DoubleSide, dw: false })));                    // membrana
          g.add(G.malha(G.deformar(new T.SphereGeometry(2.2, 72, 54), .12, .9), G.mat(0x7dd3fc, { op: .45, dw: false }), V(1, -.1, 0), null, [1.45, 1.05, .8])); // vacúolo central
          nucleo(g, V(-3, 1.1, .4), .95, R);
          const clor = [];
          for (let i = 0; i < 9; i++) {                                                                                                            // cloroplastos com tilacoides
            const c = new T.Group(); clor.push(c); c.position.set((R() - .5) * 7.4, (R() > .5 ? 1 : -1) * (1.6 + R() * .9), (R() - .5) * 3.2); c.rotation.set(R() * 3, R() * 3, R() * 3);
            c.add(G.malha(new T.SphereGeometry(.62, 32, 24), G.mat(0x4ade80, { op: .6, dw: false }), null, null, [1.25, .55, .8]));
            for (let k = 0; k < 4; k++) for (let h = 0; h < 4; h++) c.add(G.malha(new T.CylinderGeometry(.13, .13, .04, 18), G.mat(0x15803d, { rough: .4 }), V(-.5 + k * .33, -.12 + h * .07, 0)));
            g.add(c);
          }
          const mv = V((R() - .5) * 7, (R() - .5) * 4.6, (R() - .5) * 3);
          for (let i = 0; i < 4; i++) g.add(mitocondria(i ? V((R() - .5) * 7, (R() - .5) * 4.6, (R() - .5) * 3) : mv, [R() * 3, R() * 3, R() * 3], .7));
          g.add(pontos(300, .045, 0xfef9c3, Rr => V((Rr() - .5) * 8.2, (Rr() > .5 ? 1 : -1) * (1.5 + Rr() * 1.2), (Rr() - .5) * 3.8)));
          marca(g, V(-2.2, -3.25, 1.6), "Parede celular", "#84cc16"); marca(g, V(4.4, 2.6, 2.1), "Membrana plasmática", "#bef264");
          marca(g, V(1, -.1, 1.75), "Vacúolo", "#7dd3fc"); marca(g, V(-3, 1.1, 1.35), "Núcleo", "#a78bfa");
          marca(g, clor[0].position, "Cloroplasto", "#4ade80"); marca(g, mv, "Mitocôndria", "#fb923c"); marca(g, V(-1.5, -2.2, 1.6), "Citoplasma e ribossomos", "#fef9c3");
        }
        g.rotation.set(Math.random() * .8, Math.random() * 3, 0); return g;
      }
      function rodada() {
        if (atual) { raiz.remove(atual); }
        if (rod >= 8) { ctx.$("#prox").hidden = true; rot.forEach(r => r.oculto = false); ctx.$("#txt").innerHTML = `<b>Fim!</b> Você acertou ${pts} de 8.`; if (window.XP) window.XP.ganhar(pts * 3, "Classifique a célula"); return; }
        tipo = fila[rod]; atual = construir(tipo); raiz.add(atual); ctx.rotulos(rot); ctx.$("#prox").hidden = true; ctx.$("#mR").textContent = (rod + 1) + "/8"; ctx.$("#txt").textContent = "Observe a célula e escolha a classificação correta.";
        ctx.cartao.querySelectorAll("#ops .opcao").forEach(b => { b.disabled = false; b.classList.remove("certa", "errada"); });
      }
      function novo() { rod = 0; pts = 0; ctx.$("#mP").textContent = 0; fila = []; for (let i = 0; i < 8; i++) fila.push(["pro", "ani", "veg"][Math.random() * 3 | 0]); rodada(); }
      const nomes = { pro: "procarionte (bactéria): não tem núcleo, o DNA fica solto no citoplasma", ani: "eucarionte animal: tem núcleo, não tem parede celular nem cloroplastos", veg: "eucarionte vegetal: tem núcleo, parede celular, cloroplastos e vacúolo grande" };
      ctx.cartao.querySelectorAll("#ops .opcao").forEach(b => b.onclick = () => { const ok = b.dataset.t === tipo; if (ok) pts++; ctx.$("#mP").textContent = pts;
        ctx.cartao.querySelectorAll("#ops .opcao").forEach(x => { x.disabled = true; if (x.dataset.t === tipo) x.classList.add("certa"); else if (x === b) x.classList.add("errada"); });
        ctx.$("#txt").innerHTML = (ok ? "✔️ Certo! " : "✖️ Não. ") + "Esta é uma célula " + nomes[tipo] + ". <b>Veja os nomes das estruturas</b> e toque em Próxima célula.";
        rot.forEach(r => r.oculto = false); rod++; const px = ctx.$("#prox"); px.hidden = false; px.textContent = rod >= 8 ? "🏁 Ver resultado" : "▶ Próxima célula"; });
      ctx.$("#prox").onclick = rodada;
      ctx.$("#dica").onclick = () => ctx.avisar(tipo === "pro" ? "Procure o núcleo... ele existe?" : tipo === "veg" ? "Repare no formato e nas estruturas verdes." : "Tem núcleo, mas tem parede rígida ou estruturas verdes?");
      ctx.$("#novo").onclick = novo;
      novo();
      return { raiz, vistas: [["Microscópio", [0, 3, 15], [0, 0, 0]], ["Perto", [3, 2, 9], [0, 0, 0]]], atualizar(dt) { if (atual) atual.rotation.y += dt * .15; } };
    }
  });

  window.SIMULACOES = { lista, grafico };
})();
