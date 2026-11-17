/* =========================================================================
   MISSÃO SARESP 3D — Aplicação (palco 3D, painel, abas, trilha, quiz, simulado e desafio)
   Motor baseado no Microvida 3D
   ========================================================================= */
(function () {
  const T = THREE, D = DADOS, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const carga = $("#carregando"); carga.style.setProperty("--p", .3);

  /* ------------------------------ RENDERIZAÇÃO ------------------------------ */
  const palco = $("#palco");
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  /* qualidade: desenha acima da resolução da tela (supersampling) e reduz sozinho se o computador ficar lento */
  const PR_MAX = Math.min(2, Math.max(1.5, window.devicePixelRatio || 1)), PR_MIN = Math.min(1, window.devicePixelRatio || 1);
  let prAtual = PR_MAX; renderer.setPixelRatio(prAtual);
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.localClippingEnabled = true;
  palco.appendChild(renderer.domElement);
  const cena = new T.Scene();
  const cam = new T.PerspectiveCamera(40, 1, 0.05, 600);
  cam.position.set(0, 2, 20);
  cena.add(new T.HemisphereLight(0xe0f2fe, 0x0b1628, 0.6));
  /* ambiente de estúdio (reflexos suaves nos materiais), gerado por código */
  try {
    const pm = new T.PMREMGenerator(renderer), amb = new T.Scene();
    amb.add(new T.Mesh(new T.BoxGeometry(30, 20, 30), new T.MeshBasicMaterial({ color: 0x3a4a63, side: T.BackSide })));
    const luzAmb = (cor, x, y, z, w, h) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: cor, side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); amb.add(m); };
    luzAmb(new T.Color(5, 5, 5.2), 0, 9.5, 0, 14, 8); luzAmb(new T.Color(2.2, 2.6, 3), -14, 3, 6, 6, 10); luzAmb(new T.Color(2.4, 2.2, 2), 14, 2, -6, 6, 10); luzAmb(new T.Color(1.2, 1.4, 1.6), 0, 2, 14, 12, 4);
    cena.environment = pm.fromScene(amb, 0.04).texture; pm.dispose();
  } catch (e) { }
  const sol = new T.DirectionalLight(0xffffff, 1.0); sol.position.set(8, 14, 10); cena.add(sol);
  const contra = new T.DirectionalLight(0x5eead4, 0.55); contra.position.set(-10, -4, -8); cena.add(contra);
  const realce = new T.DirectionalLight(0xf472b6, 0.25); realce.position.set(10, -6, 4); cena.add(realce);
  const ctl = new T.OrbitControls(cam, renderer.domElement);
  ctl.enableDamping = true; ctl.dampingFactor = 0.18; ctl.autoRotateSpeed = 1.2;
  const plano = new T.Plane(new T.Vector3(0, 0, -1), 0);
  carga.style.setProperty("--p", .6);

  const est = {
    modo: "modelo", modeloId: null, ultimoModelo: "sistema", atual: null, sim: null, simId: null,
    mats: {}, visivel: {}, opac: {}, selecionado: null, rotulos: true, corte: false, raio: 8,
    voo: null, desafio: null, rotEls: []
  };

  function redimensionar() {
    const w = palco.clientWidth, h = palco.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); cam.aspect = w / h; ajustarCentro();
    // se a área 3D mudou de tamanho (ex.: painel fechado no celular) e o usuário não mexeu na câmera, reenquadra
    const ant = est.tamPalco; est.tamPalco = [w, h];
    if (ant && (Math.abs(ant[0] - w) > 40 || Math.abs(ant[1] - h) > 40) && est.vistaAtual && !est.usuarioMoveu) vista(est.vistaAtual, 0);
  }
  function ajustarCentro() {
    const w = palco.clientWidth, h = palco.clientHeight, d = est && est.deslLeg || 0;
    if (d && w && h) cam.setViewOffset(w, h, 0, d, w, h); else cam.clearViewOffset();
    cam.updateProjectionMatrix();
  }
  new ResizeObserver(redimensionar).observe(palco);

  /* ------------------------------ CÂMERA ------------------------------ */
  function voarPara(alvo, pos, dur) {
    if (dur === 0) { est.voo = null; ctl.target.copy(alvo); cam.position.copy(pos); ctl.update(); return; }   // sem animação (sem zoom)
    est.voo = { t: 0, dur: dur ?? 0.9, a0: ctl.target.clone(), p0: cam.position.clone(), a1: alvo.clone(), p1: pos.clone() };
  }
  // afasta a câmera quando o palco é estreito (celular em pé, painel aberto)
  function ajustar(alvo, pos) { const f = Math.max(1, 1.08 / Math.max(cam.aspect, .3)); return pos.clone().sub(alvo).multiplyScalar(f).add(alvo); }
  function vista(v, dur) {
    if (!v) return;
    est.vistaAtual = v; est.usuarioMoveu = false;
    const a = new T.Vector3(...v[2]); let p = ajustar(a, new T.Vector3(...v[1]));
    // vista geral: afasta a câmera até o modelo inteiro caber (deixando margem para os rótulos)
    if (est.modo === "modelo" && est.esfera && MODELOS[est.modeloId].vistas[0] === v && est.modeloId !== "escala" && !MODELOS[est.modeloId].semAjuste) {
      const vf = T.MathUtils.degToRad(cam.fov) / 2, hf = Math.atan(Math.tan(vf) * cam.aspect);
      const precisa = (est.esfera.radius + est.esfera.center.distanceTo(a)) / Math.sin(Math.min(vf, hf)) * (ehEstreita() && MODELOS[est.modeloId].rotulosNumerados ? .8 : .98); // com números não precisa de margem para nomes
      const d = p.distanceTo(a); if (precisa > d) p = p.clone().sub(a).multiplyScalar(precisa / d).add(a);
      const af = cam.aspect < .8 ? (MODELOS[est.modeloId].afastarCelular || 1) : 1; if (af !== 1) p = p.clone().sub(a).multiplyScalar(af).add(a);
    }
    voarPara(a, p, dur);
    if (v[3] && v[3].corte !== undefined) definirCorte(v[3].corte);
  }
  function montarVistas(lista) {
    const g = $("#grupoVistas");
    g.innerHTML = (lista || []).map((v, i) => `<button data-v="${i}">${v[0]}</button>`).join("");
    g.querySelectorAll("button").forEach(b => b.onclick = () => vista(lista[+b.dataset.v]));
  }

  /* ------------------------------ LIMPEZA ------------------------------ */
  function descartar(obj) {
    obj.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
    });
  }
  function limparPalco() {
    if (est.sim && est.sim.destruir) est.sim.destruir();
    if (est.atual) { cena.remove(est.atual.raiz); descartar(est.atual.raiz); }
    est.atual = null; est.sim = null; est.simId = null; est.selecionado = null;
    est.mats = {}; est.visivel = {}; est.opac = {};
    $("#rotulos").innerHTML = ""; est.rotEls = [];
    $("#hud").hidden = true; $("#escalaInfo").hidden = true;
    definirCorte(false, true); popEsconder();
  }

  /* ------------------------------ MODELOS ------------------------------ */
  function carregarModelo(id, semInfo) {
    const def = MODELOS[id];
    if (def.preparar && !def.pronto()) {
      avisar("Carregando o modelo anatômico 3D…"); carga.classList.remove("some"); $("#cargaTxt").textContent = "Montando o corpo humano…"; carga.style.setProperty("--p", .5);
      return def.preparar().then(() => { carga.classList.add("some"); carregarModelo(id, semInfo); }).catch(() => { carga.classList.add("some"); avisar("Não foi possível carregar o modelo anatômico. Verifique a internet."); });
    }
    limparPalco();
    const md = def.construir();
    est.modo = "modelo"; est.modeloId = id; est.ultimoModelo = id; est.atual = md;
    cena.add(md.raiz);
    { const bx = new T.Box3(), b2 = new T.Box3(); md.raiz.updateMatrixWorld(true);
      md.raiz.traverse(o => { if (o.isMesh && !o.userData.semCaixa) { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); b2.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); bx.union(b2); } });
      est.esfera = bx.isEmpty() ? null : bx.getBoundingSphere(new T.Sphere()); }
    Object.entries(md.partes).forEach(([p, meshes]) => {
      const s = new Set(); meshes.forEach(m => (Array.isArray(m.material) ? m.material : [m.material]).forEach(x => s.add(x)));
      est.mats[p] = [...s]; est.mats[p].forEach(x => { x.userData.dw0 = x.depthWrite; x.userData.em0 = x.emissive.getHex(); x.userData.ei0 = x.emissiveIntensity; });
      est.visivel[p] = true; est.opac[p] = 1;
    });
    const caixa = new T.Box3().setFromObject(md.raiz); est.raio = caixa.getSize(new T.Vector3()).length() / 2;
    cam.near = def.near || 0.05; cam.updateProjectionMatrix();
    ctl.minDistance = def.near ? 0.08 : 2; ctl.maxDistance = Math.max(80, est.raio * 6);
    montarVistas(def.vistas); vista(def.vistas[0], 0);
    $$(".mod-btn").forEach(b => b.classList.toggle("ativo", b.dataset.mod === id));
    listarPartes();
    criarRotulos(Object.keys(md.ancoras).map(p => ({ parte: p, txt: D.fichas[p] ? D.fichas[p].nome : p, cor: D.fichas[p] ? D.fichas[p].cor : "#fff", local: md.ancoras[p] })));
    if (def.escala) { $("#escalaInfo").hidden = false; $("#escalaInfo").textContent = def.escala; }
    est.semRotulo = new Set(); montarCamadas(def);
    if (def.camadas) aplicarCamada(def.camadaInicial || 0, true);
    $("#secCorte").hidden = false;
    if (!semInfo) mostrarModeloInfo(id);
    if (!est.desafio) popModelo(id);
  }
  function listarPartes() {
    const box = $("#listaPartes");
    if (est.modo !== "modelo") { box.innerHTML = `<p class="muted mini-txt">Simulação em andamento. Use os controles no painel ao lado. Para voltar aos modelos, escolha um modelo acima.</p>`; return; }
    box.innerHTML = Object.keys(est.mats).map(p => { const f = D.fichas[p] || { nome: p, cor: "#fff" };
      return `<div class="parte ${est.visivel[p] ? "" : "off"}" data-p="${p}" style="--c:${f.cor}"><button class="bol" title="Mostrar/esconder" aria-label="Mostrar ou esconder ${f.nome}"></button><button class="nome">${f.nome}</button><input type="range" min="0" max="100" value="${Math.round(est.opac[p] * 100)}" aria-label="Transparência de ${f.nome}"></div>`; }).join("");
    box.querySelectorAll(".parte").forEach(el => {
      const p = el.dataset.p;
      el.querySelector(".bol").onclick = () => { est.visivel[p] = !est.visivel[p]; aplicarParte(p); el.classList.toggle("off", !est.visivel[p]); };
      el.querySelector(".nome").onclick = () => selecionar(p, true);
      el.querySelector("input").oninput = e => { est.opac[p] = e.target.value / 100; aplicarParte(p); };
    });
  }
  function aplicarParte(p) {
    est.rotSujo = true; est.pinSig = null;
    const op = est.opac[p], vis = est.visivel[p] && op > 0.02;
    est.mats[p].forEach(m => { const o = m.userData.baseOp * op; m.opacity = o; m.transparent = o < 0.999; m.depthWrite = o >= 0.6 ? m.userData.dw0 : false; });
    (est.atual.partes[p] || []).forEach(me => me.visible = vis && !me.userData.oculto);
  }
  function montarCamadas(def) {
    const sec = $("#secCamadas");
    if (!def.camadas) { sec.hidden = true; return; }
    sec.hidden = false;
    $("#listaCamadas").innerHTML = def.camadas.map((c, i) => `<button class="chip" data-camada="${i}">${c.nome}</button>`).join("") +
      (est.atual.sexo ? `<div class="seg-sexo"><button class="chip ativo" data-sexo="fem">Corpo feminino</button><button class="chip" data-sexo="masc">Corpo masculino</button></div>` : "");
    $$("#listaCamadas [data-camada]").forEach(b => b.onclick = () => aplicarCamada(+b.dataset.camada));
    $$("#listaCamadas [data-sexo]").forEach(b => b.onclick = () => { est.atual.sexo(b.dataset.sexo); $$("#listaCamadas [data-sexo]").forEach(x => x.classList.toggle("ativo", x === b)); aplicarParte("pele"); });
  }
  function aplicarCamada(i, silencioso) {
    const def = MODELOS[est.modeloId]; if (!def || !def.camadas) return;
    const c = def.camadas[i]; est.camada = i; est.semRotulo = new Set();
    Object.keys(est.mats).forEach(p => {
      const dentro = c.partes === "*" || c.partes.includes(p), extra = c.extra && c.extra[p] != null;
      est.visivel[p] = dentro || extra;
      est.opac[p] = extra ? c.extra[p] : (c.opac && c.opac[p] != null ? c.opac[p] : 1);
      if (extra && !dentro) est.semRotulo.add(p);
      aplicarParte(p);
    });
    $$("#listaCamadas [data-camada]").forEach(b => b.classList.toggle("ativo", +b.dataset.camada === i));
    listarPartes();
    if (!silencioso) avisar("Mostrando: " + c.nome);
  }
  function mostrarTudo() {
    const def = MODELOS[est.modeloId];
    if (est.modo === "modelo" && def && def.camadas) { const k = def.camadas.findIndex(c => c.partes === "*"); return aplicarCamada(k < 0 ? 0 : k, true); } Object.keys(est.mats).forEach(p => { est.visivel[p] = true; est.opac[p] = 1; aplicarParte(p); }); listarPartes(); }

  /* ------------------------------ CORTE ------------------------------ */
  function definirCorte(on, silencioso) {
    est.corte = !!on; $("#chkCorte").checked = est.corte; $("#corteVal").disabled = !est.corte;
    if (!silencioso || est.atual) atualizarCorte();
  }
  function atualizarCorte() {
    plano.constant = ($("#corteVal").value / 100) * est.raio * 0.6;
    if (!est.atual) return;
    est.atual.raiz.traverse(o => { if (o.material) [].concat(o.material).forEach(m => { const q = est.corte ? [plano] : null; if (m.clippingPlanes !== q) { m.clippingPlanes = q; m.clipShadows = true; m.needsUpdate = true; } }); });
  }
  $("#chkCorte").onchange = e => definirCorte(e.target.checked);
  $("#corteVal").oninput = atualizarCorte;

  /* ------------------------------ RÓTULOS ------------------------------ */
  function corTexto(hex) { // texto escuro em fundo claro, branco em fundo escuro
    const c = new T.Color(hex), l = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
    return l > 0.28 ? "#08111f" : "#ffffff";
  }
  function criarRotulos(lista) {
    const box = $("#rotulos"); box.innerHTML = '<svg class="linhas-rot" aria-hidden="true"></svg>'; est.rotEls = []; est.pinSig = null; est.rotSujo = true; est.rotSigCam = null;
    est.svgRot = box.querySelector("svg");
    lista.forEach(r => {
      const cor = r.cor || "#5eead4", el = document.createElement("div"); el.className = "rot"; el.textContent = r.txt;
      el.style.setProperty("--c", cor); el.style.setProperty("--ct", corTexto(cor));
      if (r.parte) el.onclick = () => selecionar(r.parte, false);
      box.appendChild(el); r.el = el; r.cor = cor; r.tam = null; r.modo = null; est.rotEls.push(r);
    });
  }

  /* ---- Contorno do modelo na tela (retângulo das partes visíveis) ---- */
  const _v = new T.Vector3(), _bx = new T.Box3(), _b2 = new T.Box3(), _cn = new T.Vector3();
  function contornoTela(w, h) {
    if (!est.atual) return null;
    _bx.makeEmpty();
    est.atual.raiz.traverseVisible(o => {
      if (!o.isMesh || o.isInstancedMesh || o.userData.semCaixa) return;
      if (o.material && o.material.opacity < .05) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      _b2.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); _bx.union(_b2);
    });
    if (_bx.isEmpty()) return null;
    // retângulo das quinas da caixa (exagera em perspectiva) ∩ retângulo da esfera envolvente (justo para formas redondas)
    let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
    for (let i = 0; i < 8; i++) {
      _cn.set(i & 1 ? _bx.max.x : _bx.min.x, i & 2 ? _bx.max.y : _bx.min.y, i & 4 ? _bx.max.z : _bx.min.z).project(cam);
      if (_cn.z > 1) return null;
      const x = (_cn.x * .5 + .5) * w, y = (-_cn.y * .5 + .5) * h;
      l = Math.min(l, x); r = Math.max(r, x); t = Math.min(t, y); b = Math.max(b, y);
    }
    const centro = _bx.getCenter(new T.Vector3()), raio = _bx.getSize(new T.Vector3()).length() / 2 * .92;
    const dist = centro.distanceTo(cam.position);
    if (dist > raio * 1.05) {
      const ang = Math.asin(Math.min(1, raio / dist)), escala = Math.tan(ang) / Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * h / 2;
      _cn.copy(centro).project(cam); const sx = (_cn.x * .5 + .5) * w, sy = (-_cn.y * .5 + .5) * h;
      l = Math.max(l, sx - escala); r = Math.min(r, sx + escala); t = Math.max(t, sy - escala); b = Math.min(b, sy + escala);
    }
    return { l: Math.max(0, l), t: Math.max(0, t), r: Math.min(w, r), b: Math.min(h, b) };
  }

  /* =====================================================================
     RÓTULOS — dois modos, ambos estáveis (nada é recalculado enquanto a câmera se move):
     • Telas largas: nomes em colunas fora do modelo, com linhas de chamada. Ao girar, os
       nomes somem suavemente e voltam já organizados quando a câmera para.
     • Telas estreitas (celular): números coloridos presos às estruturas + legenda numerada,
       como num atlas de anatomia. Os números acompanham a estrutura ao girar.
     ===================================================================== */
  const ehEstreita = () => palco.clientWidth < 640;
  function projetarRotulos(w, h) {
    const cand = [];
    est.rotEls.forEach(r => {
      let vis = est.rotulos;
      if (r.parte && est.modo === "modelo") vis = vis && est.visivel[r.parte] && est.opac[r.parte] > .05 && !(est.semRotulo && est.semRotulo.has(r.parte) && r.parte !== est.selecionado);
      if (r.local && est.atual) { _v.copy(r.local); est.atual.raiz.localToWorld(_v); }
      else if (r.obj) { r.obj.getWorldPosition(_v); if (r.dy) _v.y += r.dy; if (!r.obj.visible) vis = false; }
      else if (r.pos) _v.copy(r.pos);
      if (r.oculto) vis = false;
      const wy = _v.y;
      if (vis) { _v.project(cam); if (_v.z > 1 || Math.abs(_v.x) > 1.02 || Math.abs(_v.y) > 1.02) vis = false; }
      if (r.atualizarTxt) { const tx = r.atualizarTxt(); if (tx !== r.txt) { r.txt = tx; r.modo = null; r.tam = null; } }
      r.el.classList.toggle("sel", !!r.parte && r.parte === est.selecionado);
      if (!vis) { r.el.style.display = "none"; return; }
      r.el.style.display = "";
      cand.push({ r, ax: (_v.x * .5 + .5) * w, ay: (-_v.y * .5 + .5) * h, z: _v.z, wy });
    });
    return cand;
  }
  function modoRotulo(r, modo) {
    if (r.modo === modo) return;
    r.modo = modo; r.el.classList.toggle("pino", modo === "pino");
    r.el.textContent = modo === "pino" ? (r.num || "") : r.txt; r.tam = null;
  }
  function atualizarRotulos() {
    const w = palco.clientWidth, h = palco.clientHeight, box = $("#rotulos");
    const cand = projetarRotulos(w, h);
    const pinos = est.modo === "modelo" && ehEstreita() && !!MODELOS[est.modeloId].rotulosNumerados; // só o corpo humano usa números + legenda
    box.classList.toggle("modo-pinos", pinos);
    if (pinos) { box.classList.remove("movendo"); return layoutPinos(cand, w, h); }
    $("#legenda").hidden = true; if (est.deslLeg) { est.deslLeg = 0; ajustarCentro(); }
    cand.forEach(c => modoRotulo(c.r, "nome"));
    if (est.modo === "modelo") {
      // só esconde enquanto o dedo/mouse está girando ou durante a transição de vista
      const agora = performance.now(), mexendo = est.interagindo || est.voo || agora - (est.fimInteracao || 0) < 150;
      if (mexendo) { box.classList.add("movendo"); est.rotSujo = true; return; }
      const sigVis = cand.map(c => c.r.txt + (c.r.parte === est.selecionado ? "*" : "")).join("|") + "|" + w + "x" + h;
      // reorganiza as caixas só se algo mudou ou se alguma estrutura se afastou muito da sua caixa (deslize da câmera)
      const longe = cand.some(c => !c.r.caixa || Math.hypot(c.ax - c.r.caixa.ax, c.ay - c.r.caixa.ay) > 28);
      if (est.rotSujo || sigVis !== est.rotSigVis || longe) { est.rotSigVis = sigVis; est.rotSujo = false; layoutChamadas(cand, w, h); }
      else desenharLinhas(cand); // as linhas e os pontos acompanham a estrutura a cada quadro
      box.classList.remove("movendo");
      return;
    }
    box.classList.remove("movendo");
    layoutLivre(cand, w, h, areasReservadas(), []);
  }
  // áreas do palco cobertas por botões e pelo quadro de informações: os nomes não ficam embaixo delas
  function areasReservadas() {
    const pr = palco.getBoundingClientRect(), out = [];
    ["#palco ~ .mover-cena", ".palco-area .mover-cena", ".palco-area > .pop:not([hidden])"].forEach(sel => document.querySelectorAll(sel).forEach(el => {
      const r = el.getBoundingClientRect(); if (!r.width) return; out.push([r.left - pr.left - 6, r.top - pr.top - 6, r.right - pr.left + 6, r.bottom - pr.top + 6]); }));
    return out;
  }
  function medir(c) { if (!c.r.tam || !c.r.tam[0]) c.r.tam = [c.r.el.offsetWidth, c.r.el.offsetHeight]; c.cw = c.r.tam[0]; c.ch = c.r.tam[1]; }

  /* ---- telas largas: colunas fora do modelo ---- */
  function layoutChamadas(cand, w, h) {
    cand.forEach(medir);
    const M = 8, G = 18, ocup = [], linhas = [], resto = [];
    const R = contornoTela(w, h);
    const ponto = (c, x, y, lado) => { ocup.push([x, y, x + c.cw, y + c.ch]); c.x = x; c.y = y; c.lado = lado; };
    if (R && ((R.r - R.l) < w * .97 || (R.b - R.t) < h * .97)) {
      const cx = (R.l + R.r) / 2, cy = (R.t + R.b) / 2, rw = Math.max(1, R.r - R.l), rh = Math.max(1, R.b - R.t);
      const espaco = { l: R.l - G - M, r: w - R.r - G - M, t: R.t - G - M, b: h - R.b - G - M };
      const grupos = { l: [], r: [], t: [], b: [] };
      cand.forEach(c => {
        const dx = (c.ax - cx) / rw, dy = (c.ay - cy) / rh, H = dx < 0 ? "l" : "r", Vt = dy < 0 ? "t" : "b", H2 = H === "l" ? "r" : "l", V2 = Vt === "t" ? "b" : "t";
        const alto = rh > rw * 1.3, largo = rw > rh * 1.3;
        const pref = alto ? [H, H2, Vt, V2] : largo ? [Vt, V2, H, H2] : Math.abs(dx) >= Math.abs(dy) ? [H, Vt, V2, H2] : [Vt, H, H2, V2];
        const lado = pref.find(s => (s === "l" || s === "r") ? espaco[s] >= c.cw : espaco[s] >= c.ch);
        if (lado) grupos[lado].push(c); else resto.push(c);
      });
      ["t", "b"].forEach(s => {
        const g = grupos[s].sort((a, b) => a.ax - b.ax), fimLinha = [];
        g.forEach(c => {
          const passo = c.ch + 6, nLin = Math.max(1, Math.floor((espaco[s] + 6) / passo));
          for (let k = 0; k < nLin; k++) {
            const x = Math.max(M, Math.min(w - M - c.cw, c.ax - c.cw / 2), (fimLinha[k] ?? -1e9) + 6);
            if (x + c.cw <= w - M) { fimLinha[k] = x + c.cw; return ponto(c, x, s === "t" ? R.t - G - c.ch - k * passo : R.b + G + k * passo, s); }
          }
          const lat = [c.ax < cx ? "l" : "r", c.ax < cx ? "r" : "l"].find(q => espaco[q] >= c.cw);
          if (lat) grupos[lat].push(c); else resto.push(c);
        });
      });
      ["l", "r"].forEach(s => {
        const g = grupos[s].sort((a, b) => a.ay - b.ay); let fim = M - 6;
        g.forEach(c => { c.y = Math.max(c.ay - c.ch / 2, fim + 6); fim = c.y + c.ch; });
        const exc = fim - (h - M); if (exc > 0) g.forEach(c => c.y = Math.max(M, c.y - exc));
        // alinha a coluna inteira pela borda do modelo (aspecto de legenda de atlas)
        g.forEach(c => ponto(c, s === "l" ? Math.max(M, R.l - G - c.cw) : Math.min(w - M - c.cw, R.r + G), c.y, s));
      });
    } else cand.forEach(c => resto.push(c));
    layoutLivre(resto, w, h, ocup, linhas, cand);
  }

  /* ---- posicionamento livre (cenários que ocupam a tela e simulações) ---- */
  function layoutLivre(lista, w, h, ocup, linhas, todos) {
    lista.forEach(medir);
    const bate = (x, y, cw, ch) => ocup.some(o => x < o[2] + 4 && x + cw + 4 > o[0] && y < o[3] + 4 && y + ch + 4 > o[1]);
    lista.sort((a, b) => (b.r.parte === est.selecionado) - (a.r.parte === est.selecionado) || a.z - b.z).forEach(c => {
      const { ax, ay, cw, ch } = c, up = ay - 14 - ch, st = ch + 5;
      const tent = [[ax - cw / 2, up], [ax - cw / 2, up - st], [ax + 12, ay - ch / 2], [ax - cw - 12, ay - ch / 2], [ax - cw / 2, ay + 14],
        [ax - cw / 2, up - 2 * st], [ax + 12, up], [ax - cw - 12, up], [ax + 12, ay + 14], [ax - cw - 12, ay + 14], [ax - cw / 2, ay + 14 + st]];
      // se os lugares de perto estão ocupados, procura mais longe (com linha ligando o nome à estrutura) em vez de esconder o nome
      for (const d of [46, 80, 118, 160, 210, 270]) for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2 + (d / 46) * .3; tent.push([ax + Math.cos(a) * d - cw / 2, ay + Math.sin(a) * d * .8 - ch / 2]); }
      if (c.r.off) tent.unshift([ax + c.r.off[0], ay + c.r.off[1]]); // mantém o lugar anterior se ainda estiver livre (evita pulos)
      for (let [x, y] of tent) { x = Math.max(2, Math.min(w - cw - 2, x)); y = Math.max(2, Math.min(h - ch - 2, y)); if (!bate(x, y, cw, ch)) { ocup.push([x, y, x + cw, y + ch]); c.x = x; c.y = y; c.lado = "livre"; c.r.off = [x - ax, y - ay]; return; } }
      if (c.r.parte === est.selecionado) { c.x = Math.max(2, Math.min(w - cw - 2, ax - cw / 2)); c.y = Math.max(2, up); c.lado = "livre"; return; }
      c.r.el.style.display = "none"; c.r.off = null;
    });
    (todos || lista).forEach(c => {
      if (c.x === undefined) { c.r.caixa = null; return; }
      c.r.el.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px)`;
      c.r.caixa = { x: c.x, y: c.y, cw: c.cw, ch: c.ch, lado: c.lado, ax: c.ax, ay: c.ay };
    });
    desenharLinhas(todos || lista);
  }
  function desenharLinhas(lista) {
    const linhas = [];
    lista.forEach(c => {
      const b = c.r.caixa; if (!b || c.r.el.style.display === "none") return;
      let lx, ly;
      if (b.lado === "l") { lx = b.x + b.cw; ly = b.y + b.ch / 2; }
      else if (b.lado === "r") { lx = b.x; ly = b.y + b.ch / 2; }
      else if (b.lado === "t") { lx = Math.max(b.x + 8, Math.min(b.x + b.cw - 8, c.ax)); ly = b.y + b.ch; }
      else if (b.lado === "b") { lx = Math.max(b.x + 8, Math.min(b.x + b.cw - 8, c.ax)); ly = b.y; }
      else { lx = Math.max(b.x + 6, Math.min(b.x + b.cw - 6, c.ax)); ly = c.ay < b.y ? b.y : c.ay > b.y + b.ch ? b.y + b.ch : b.y + b.ch / 2; }
      const mx = b.lado === "l" ? lx + 10 : b.lado === "r" ? lx - 10 : lx, my = b.lado === "t" ? ly + 6 : b.lado === "b" ? ly - 6 : ly;
      linhas.push(`<polyline points="${c.ax.toFixed(1)},${c.ay.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)} ${lx.toFixed(1)},${ly.toFixed(1)}" stroke="${c.r.cor}"/><circle cx="${c.ax.toFixed(1)}" cy="${c.ay.toFixed(1)}" r="3.6" fill="${c.r.cor}" stroke="#08111f" stroke-width="1"/>`);
    });
    if (est.svgRot) est.svgRot.innerHTML = linhas.join("");
  }

  /* ---- telas estreitas: números + legenda ---- */
  function layoutPinos(cand, w, h) {
    // numeração estável: de cima para baixo no corpo (altura real), refeita só quando muda o conjunto visível
    const sig = cand.map(c => c.r.txt).sort().join("|");
    if (sig !== est.pinSig) {
      est.pinSig = sig;
      cand.slice().sort((a, b) => b.wy - a.wy || a.r.txt.localeCompare(b.r.txt)).forEach((c, i) => { c.r.num = i + 1; c.r.modo = null; });
      montarLegenda(cand);
    }
    cand.forEach(c => modoRotulo(c.r, "pino"));
    const P = cand.map(c => ({ c, x: c.ax, y: c.ay })), D = 22;
    for (let it = 0; it < 6; it++) for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
      const dx = P[j].x - P[i].x, dy = P[j].y - P[i].y, d = Math.hypot(dx, dy) || .01;
      if (d < D) { const k = (D - d) / 2 / d; P[i].x -= dx * k; P[i].y -= dy * k; P[j].x += dx * k; P[j].y += dy * k; }
    }
    const linhas = [];
    P.forEach(p => {
      const x = Math.max(11, Math.min(w - 11, p.x)), y = Math.max(11, Math.min(h - 11, p.y)), c = p.c;
      c.r.el.style.transform = `translate(${(x - 11).toFixed(1)}px, ${(y - 11).toFixed(1)}px)`;
      if (Math.hypot(x - c.ax, y - c.ay) > 4) linhas.push(`<line x1="${c.ax.toFixed(1)}" y1="${c.ay.toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${c.r.cor}"/><circle cx="${c.ax.toFixed(1)}" cy="${c.ay.toFixed(1)}" r="2.6" fill="${c.r.cor}"/>`);
    });
    if (est.svgRot) est.svgRot.innerHTML = linhas.join("");
    const leg = $("#legenda"); leg.hidden = !cand.length;
    // centraliza o modelo no espaço livre acima da legenda
    const desl = leg.hidden ? 0 : Math.round(leg.offsetHeight / 2);
    if (desl !== (est.deslLeg || 0)) { est.deslLeg = desl; ajustarCentro(); }
    leg.querySelectorAll("li").forEach(li => li.classList.toggle("sel", li.dataset.p === est.selecionado));
  }
  function montarLegenda(cand) {
    const leg = $("#legenda"), itens = cand.slice().sort((a, b) => a.r.num - b.r.num);
    leg.innerHTML = `<button class="leg-tit" aria-expanded="${est.legAberta !== false}">Legenda <span>${itens.length}</span><b>${est.legAberta !== false ? "▾" : "▸"}</b></button>
      <ol ${est.legAberta === false ? "hidden" : ""}>${itens.map(c => `<li data-p="${c.r.parte || ""}"><i style="background:${c.r.cor};color:${corTexto(c.r.cor)}">${c.r.num}</i><span>${c.r.txt}</span></li>`).join("")}</ol>`;
    leg.querySelector(".leg-tit").onclick = () => { est.legAberta = est.legAberta === false; montarLegenda(cand); };
    leg.querySelectorAll("li[data-p]").forEach(li => { if (li.dataset.p) li.onclick = () => selecionar(li.dataset.p, true); });
  }

  /* ------------------------------ SELEÇÃO ------------------------------ */
  function realcar(p, cor, int) { (est.mats[p] || []).forEach(m => { m.emissive.setHex(cor); m.emissiveIntensity = int; }); }
  function limparRealce(p) { (est.mats[p] || []).forEach(m => { m.emissive.setHex(m.userData.em0); m.emissiveIntensity = m.userData.ei0; }); }
  function selecionar(p, voar) {
    if (!D.fichas[p]) return;
    const f = D.fichas[p], def = MODELOS[f.modelo];
    if (def.preparar && !def.pronto()) { carregarModelo(f.modelo, true); return def.preparar().then(() => setTimeout(() => selecionar(p, voar), 50)); }
    if (est.modo !== "modelo" || est.modeloId !== f.modelo) carregarModelo(f.modelo, true);
    if (est.desafio) return responderDesafio(p);
    if (est.selecionado) limparRealce(est.selecionado);
    est.selecionado = p; realcar(p, 0xbef264, 0.45);
    if (!est.visivel[p] || est.opac[p] < .3) { est.visivel[p] = true; est.opac[p] = 1; aplicarParte(p); listarPartes(); }
    if (voar) focar(p);
    mostrarInfo(p);
  }
  function focar(p) {
    const a = est.atual && est.atual.ancoras[p]; if (!a) return;
    const alvo = est.atual.raiz.localToWorld(a.clone());
    const dir = cam.position.clone().sub(ctl.target).normalize();
    const dist = Math.max(est.raio * 0.55, (MODELOS[est.modeloId].near ? .3 : 4));
    const dEsc = est.modeloId === "escala" ? ({ virus_escala: .35, bacteria_escala: 4, hemacia: 12 }[p] || 34) : dist;
    voarPara(alvo, alvo.clone().add(dir.multiplyScalar(dEsc)));
  }
  // clique no palco (sem arrastar)
  const ray = new T.Raycaster(), mouse = new T.Vector2(); let baixo = null;
  renderer.domElement.addEventListener("wheel", () => est.usuarioMoveu = true, { passive: true });
  const soltar = () => { if (est.interagindo) { est.interagindo = false; est.fimInteracao = performance.now(); } };
  window.addEventListener("pointerup", soltar); window.addEventListener("pointercancel", soltar);
  renderer.domElement.addEventListener("wheel", () => est.fimInteracao = performance.now(), { passive: true });
  renderer.domElement.addEventListener("pointerdown", e => { est.usuarioMoveu = true; est.interagindo = true; baixo = [e.clientX, e.clientY]; ctl.autoRotate = false; $("#btnGirar").classList.remove("ativo"); $(".ajuda-gestos").classList.add("some"); });
  renderer.domElement.addEventListener("pointerup", e => {
    if (!baixo || Math.hypot(e.clientX - baixo[0], e.clientY - baixo[1]) > 6) return;
    const r = renderer.domElement.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, cam);
    if (!est.atual) return;
    const hits = ray.intersectObject(est.atual.raiz, true).filter(h => {
      let o = h.object, vis = true; while (o) { if (!o.visible) vis = false; o = o.parent; }
      if (!vis) return false;
      if (est.corte && plano.distanceToPoint(h.point) < 0) return false;
      return h.object.userData.parte || h.object.userData.info;
    });
    if (!hits.length) return;
    const o = hits[0].object;
    if (est.modo === "sim") {
      const id = o.userData.parte, info = o.userData.info;
      if (info) avisar(info);
      else if (id && D.fichas[id]) avisar(`${D.fichas[id].nome}: ${D.fichas[id].funcao}`);
      return;
    }
    selecionar(o.userData.parte, false);
  });

  /* ------------------------------ PAINEL: FICHAS ------------------------------ */
  const info = $("#info");
  function nomeModelo(id) { return (D.modelos.find(m => m.id === id) || {}).nome || id; }
  function mostrarInfo(p) {
    if (est.desafio) return;
    popParte(p);
    trocarAba("explorar", true);
    const f = D.fichas[p];
    info.innerHTML = `
      <div class="cartao">
        <div class="etiqueta" style="--c:${f.cor}">${nomeModelo(f.modelo)} · ${f.aula}</div>
        <h2>${f.nome}</h2>
        <h4>Função</h4><p>${f.funcao}</p>
        <h4>Como é</h4><p>${f.desc}</p>
        ${f.carac ? `<h4>Características</h4><ul class="lista-esp">${f.carac.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}
        ${f.acoes ? `<h4>O que o ser humano faz aqui</h4><ul class="lista-esp">${f.acoes.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}
        ${f.curiosidade ? `<div class="destaque curioso"><b>Você sabia?</b> ${f.curiosidade}</div>` : ""}
        ${f.saude ? `<div class="destaque saude"><b>Saúde e prevenção:</b> ${f.saude}</div>` : ""}
        <h4>Na trilha SARESP</h4><div class="chips">${f.hab.map(c => `<button class="chip" data-hab="${c}">${rotHab(c)}</button>`).join("")}</div>
        <div class="acoes">
          <button class="btn prim" id="bFocar">Aproximar</button>
          <button class="btn" id="bOuvir">🔊 Ouvir</button>
          <button class="btn" id="bIsolar">Isolar</button>
          <button class="btn" id="bTudo">Mostrar tudo</button>
        </div>
      </div>
      ${partesIrmas(f.modelo, p)}`;
    $("#bFocar").onclick = () => focar(p);
    $("#bOuvir").onclick = () => falar(`${f.nome}. ${f.funcao} ${f.desc} ${f.curiosidade || ""} ${f.saude || ""}`);
    $("#bIsolar").onclick = () => { Object.keys(est.mats).forEach(x => { est.visivel[x] = x === p; aplicarParte(x); }); listarPartes(); };
    $("#bTudo").onclick = mostrarTudo;
    ligarChips(info);
  }
  /* ---------- POP-UP DE ESPECIFICIDADES dentro do palco ----------
     Fica num canto do simulador, pode ser arrastado para qualquer lugar (a posição fica guardada),
     minimizado ou fechado. Mostra características e ações humanas da estrutura escolhida. */
  const POP = { el: null, fechado: false };
  const listaPop = (t, arr, cls) => arr && arr.length ? `<h5 class="${cls}">${t}</h5><ul>${arr.map(x => `<li>${x}</li>`).join("")}</ul>` : "";
  function popCriar() {
    if (POP.el) return POP.el;
    const el = document.createElement("div"); el.id = "popInfo"; el.className = "pop"; el.hidden = true;
    el.innerHTML = `<div class="pop-barra" title="Arraste para mudar o quadro de lugar"><span class="pop-pega" aria-hidden="true">⠿</span><b class="pop-tit"></b><button class="pop-b" data-a="min" title="Minimizar" aria-label="Minimizar">–</button><button class="pop-b" data-a="x" title="Fechar" aria-label="Fechar">✕</button></div><div class="pop-corpo"></div>`;
    // celular: vira uma "gaveta" presa à tela, por cima da área de texto (abaixo do simulador); computador: dentro do palco
    // celular: o quadro não flutua — entra na área de texto, logo abaixo do simulador (nunca cobre o 3D nem as questões)
    POP.movel = innerWidth <= 860 && !document.body.classList.contains("tela-cheia"); if (POP.movel) el.classList.add("movel"); else $(".palco-area").appendChild(el); POP.el = el;
    el.querySelector('[data-a="min"]').onclick = () => { el.classList.toggle("min"); el.querySelector('[data-a="min"]').textContent = el.classList.contains("min") ? "▢" : "–"; popPos(popLer()); };
    el.querySelector('[data-a="x"]').onclick = () => { el.hidden = true; POP.fechado = true; };
    const barra = el.querySelector(".pop-barra"); let arr = null;
    barra.addEventListener("pointerdown", e => { if (POP.movel || e.target.closest("button")) return; e.preventDefault(); barra.setPointerCapture(e.pointerId); arr = { x: e.clientX - el.offsetLeft, y: e.clientY - el.offsetTop }; el.classList.add("arrastando"); });
    barra.addEventListener("pointermove", e => { if (!arr) return; colocar(e.clientX - arr.x, e.clientY - arr.y); });
    const fim = () => { if (!arr) return; arr = null; el.classList.remove("arrastando"); const a = areaPop(), W = a.x1 - a.x0 - el.offsetWidth, H = a.y1 - a.y0 - el.offsetHeight; try { localStorage.setItem("ms3d_pop" + (POP.movel ? "_m" : ""), JSON.stringify({ x: W > 0 ? (el.offsetLeft - a.x0) / W : 0, y: H > 0 ? (el.offsetTop - a.y0) / H : 0 })); } catch (e) { } };
    barra.addEventListener("pointerup", fim); barra.addEventListener("pointercancel", fim);
    barra.addEventListener("dblclick", () => { try { localStorage.removeItem("ms3d_pop" + (POP.movel ? "_m" : "")); } catch (e) { } popPos(null); });
    window.addEventListener("resize", () => { if (!el.hidden) popPos(popLer()); });
    return el;
  }
  function areaPop() {
    const el = POP.el;
    if (!POP.movel) return { x0: 4, y0: 4, x1: el.parentElement.clientWidth - 4, y1: el.parentElement.clientHeight - 4 };
    const nav = $(".abas-movel"), navH = nav && getComputedStyle(nav).display !== "none" ? nav.offsetHeight : 0, topo = $(".topo");
    return { x0: 6, y0: (topo ? topo.getBoundingClientRect().bottom : 0) + 4, x1: innerWidth - 6, y1: innerHeight - navH - 6 };
  }
  function colocar(x, y) { const el = POP.el, a = areaPop(); el.style.left = Math.max(a.x0, Math.min(a.x1 - el.offsetWidth, x)) + "px"; el.style.top = Math.max(a.y0, Math.min(a.y1 - el.offsetHeight, y)) + "px"; }
  function popLer() { try { return JSON.parse(localStorage.getItem("ms3d_pop" + (POP.movel ? "_m" : "")) || "null"); } catch (e) { return null; } }
  // posição padrão: canto superior direito do palco (computador) ou rodapé da tela, abaixo do simulador (celular)
  // celular: coloca o quadro no topo do conteúdo visível (na sequência, dentro do tema que está na tela)
  function popLugarMovel() {
    const el = POP.el; let alvo = null, antes = null;
    if (SEQ && SEQ.ativo) { const b = document.querySelector("#seqLista .bloco.ativo"); if (b) { alvo = b; antes = b.querySelector(".bloco-sim"); } }
    if (!alvo) { alvo = [...document.querySelectorAll(".conteudo-aba")].find(c => !c.hidden) || $("#painel"); antes = alvo.firstChild; }
    if (el.parentElement !== alvo || el.nextSibling !== antes) alvo.insertBefore(el, antes);
  }
  function popPos(pos) { const el = POP.el;
    if (POP.movel) { popLugarMovel(); return; }
    requestAnimationFrame(() => { const a = areaPop(), W = a.x1 - a.x0 - el.offsetWidth, H = a.y1 - a.y0 - el.offsetHeight;
    if (pos) colocar(a.x0 + pos.x * W, a.y0 + pos.y * H); else if (POP.movel || (innerWidth <= 860 && document.body.classList.contains("tela-cheia"))) colocar(a.x0, a.y1); else colocar(a.x1 - el.offsetWidth - 6, 58); }); }
  function popAbrir(tit, html, minimo) {
    const el = popCriar();
    { const mn = !!minimo && !POP.movel; el.classList.toggle("min", mn); el.querySelector('[data-a="min"]').textContent = mn ? "▢" : "–"; el.querySelector('[data-a="min"]').title = mn ? "Abrir" : "Minimizar"; } if (POP.fechado && !html.forcar) { }
    el.querySelector(".pop-tit").innerHTML = tit; el.querySelector(".pop-corpo").innerHTML = html; el.hidden = false; POP.fechado = false;
    el.querySelectorAll("[data-pp]").forEach(b => b.onclick = () => selecionar(b.dataset.pp, true));
    el.querySelector(".pop-corpo").scrollTop = 0; popPos(popLer());
  }
  // ao entrar/sair da tela cheia no celular, o quadro passa a flutuar dentro do simulador (e volta para o texto ao sair)
  function popModoTela() {
    const el = POP.el; if (!el) return;
    const movel = innerWidth <= 860 && !document.body.classList.contains("tela-cheia");
    POP.movel = movel; el.classList.toggle("movel", movel);
    if (!movel) { if (el.parentElement !== $(".palco-area")) $(".palco-area").appendChild(el); el.style.left = el.style.top = "";
      if (innerWidth <= 860) { el.classList.add("min"); el.querySelector('[data-a="min"]').textContent = "▢"; } } // celular em tela cheia: começa minimizado, no rodapé
    if (movel) { el.classList.remove("min"); el.querySelector('[data-a="min"]').textContent = "–"; }
    if (!el.hidden) popPos(popLer()); else if (movel) popLugarMovel();
  }
  function popEsconder() { if (POP.el) POP.el.hidden = true; }
  function popParte(p) {
    const f = D.fichas[p]; if (!f) return;
    const ps = Object.keys(D.fichas).filter(k => D.fichas[k].modelo === f.modelo), i = ps.indexOf(p), ant = ps[(i - 1 + ps.length) % ps.length], prox = ps[(i + 1) % ps.length];
    popAbrir(`<span class="pop-cor" style="background:${f.cor}"></span>${f.nome}`,
      `<p class="pop-f">${f.funcao}</p>${listaPop("📋 Características", f.carac || [f.desc], "c")}${listaPop("🧑‍🔬 O que o ser humano faz aqui", f.acoes, "h")}${f.curiosidade ? `<p class="pop-cur">💡 ${f.curiosidade}</p>` : ""}
       <div class="pop-nav"><button class="btn" data-pp="${ant}">‹ ${D.fichas[ant].nome}</button><button class="btn" data-pp="${prox}">${D.fichas[prox].nome} ›</button></div>`);
  }
  /* quadros de grupo: simuladores (D.especSim) e temas sem modelo próprio (D.especTema) */
  function popGrupo(g, sel, extra) {
    if (!g) return;
    const its = g.itens, cur = its.find(x => x.id === sel);
    const chips = `<div class="chips">${its.map(x => `<button class="chip ${cur && x.id === cur.id ? "ativo" : ""}" data-pg="${x.id}"><span class="pop-cor" style="background:${x.cor}"></span>${x.nome}</button>`).join("")}</div>`;
    let corpo;
    if (!cur) corpo = `<p class="pop-f">${g.intro || "Escolha um item para ver suas <b>especificidades</b>."}</p>${chips}${extra || ""}`;
    else { const i = its.indexOf(cur), ant = its[(i - 1 + its.length) % its.length], prox = its[(i + 1) % its.length];
      corpo = `<p class="pop-f">${cur.funcao}</p>${listaPop("📋 Características", cur.carac, "c")}${listaPop("🧑‍🔬 O que o ser humano faz", cur.acoes, "h")}${cur.cur ? `<p class="pop-cur">💡 ${cur.cur}</p>` : ""}
        <div class="pop-nav"><button class="btn" data-pg="${ant.id}">‹ ${ant.nome}</button><button class="btn" data-pg="${prox.id}">${prox.nome} ›</button></div><button class="btn link pop-voltar" data-pg="">☰ Todos os itens</button>${extra || ""}`; }
    popAbrir(`${g.em || ""} ${cur ? `<span class="pop-cor" style="background:${cur.color || cur.cor}"></span>${cur.nome}` : g.titulo}`, corpo, !cur);
    POP.el.querySelectorAll("[data-pg]").forEach(b => b.onclick = () => popGrupo(g, b.dataset.pg, extra));
    ligarExtra();
  }
  function ligarExtra() { const b = POP.el && POP.el.querySelector("[data-popsim]"); if (b) b.onclick = () => popSim(b.dataset.popsim); const t = POP.el && POP.el.querySelector("[data-poptema]"); if (t) t.onclick = () => popTema(t.dataset.poptema); }
  function popSim(id, sel) { const g = D.especSim && D.especSim[id]; if (!g) return; const tema = SEQ && SEQ.ativo && SEQ.passos[SEQ.ativoK] && SEQ.passos[SEQ.ativoK].h ? SEQ.passos[SEQ.ativoK].h.cod : null;
    popGrupo(g, sel, tema && D.especTema && D.especTema[tema] ? `<button class="btn pop-extra" data-poptema="${tema}">📚 Sobre o tema: ${D.especTema[tema].titulo}</button>` : ""); }
  function popTema(cod, sel) { const g = D.especTema && D.especTema[cod]; if (!g) return false;
    const simId = est.modo === "sim" && est.simId && D.especSim && D.especSim[est.simId] ? est.simId : null;
    popGrupo(g, sel, simId ? `<button class="btn pop-extra" data-popsim="${simId}">🧊 Sobre o simulador: ${D.especSim[simId].titulo}</button>` : ""); return true; }
  function popModelo(id) {
    const m = D.modelos.find(x => x.id === id); if (!m) return popEsconder();
    const ps = Object.keys(D.fichas).filter(k => D.fichas[k].modelo === id); if (!ps.length) return popEsconder();
    popAbrir(`${m.em} ${m.nome}`, `<p class="pop-f">Toque em uma parte no simulador ou escolha abaixo para ver suas <b>especificidades</b>.</p><div class="chips">${ps.map(k => `<button class="chip" data-pp="${k}"><span class="pop-cor" style="background:${D.fichas[k].cor}"></span>${D.fichas[k].nome}</button>`).join("")}</div>`, true);
  }
  function partesIrmas(modelo, atual) {
    const ps = Object.keys(D.fichas).filter(k => D.fichas[k].modelo === modelo);
    return `<div class="cartao pequeno"><h4 style="margin-top:0">Outras estruturas deste modelo</h4><div class="chips">${ps.map(k => `<button class="chip ${k === atual ? "ativo" : ""}" data-parte="${k}">${D.fichas[k].nome}</button>`).join("")}</div></div>`;
  }
  function ligarChips(box) {
    box.querySelectorAll("[data-parte]").forEach(b => b.onclick = () => selecionar(b.dataset.parte, true));
    box.querySelectorAll("[data-hab]").forEach(b => b.onclick = () => { trocarAba("habilidades"); destacarHab(b.dataset.hab); });
    box.querySelectorAll("[data-mod]").forEach(b => b.onclick = () => { carregarModelo(b.dataset.mod); fecharLateralMovel(); });
    box.querySelectorAll("[data-sim]").forEach(b => b.onclick = () => abrirSim(b.dataset.sim));
  }
  const introModelo = Object.fromEntries(D.modelos.map(m => [m.id, m.intro]));
  const rotHab = c => { const [a, k] = c.split("-"); return a + "º · " + k; };
  function mostrarModeloInfo(id) {
    if (est.desafio) return;
    const m = D.modelos.find(x => x.id === id);
    const camadas = MODELOS[id].camadas ? `<h4>Camadas</h4><div class="chips">${MODELOS[id].camadas.map((c, i) => `<button class="chip ${i === (est.camada || 0) ? "ativo" : ""}" data-cam="${i}">${c.nome}</button>`).join("")}</div>` : "";
    info.innerHTML = `<div class="cartao"><div class="etiqueta" style="--c:var(--acento)">${m.aula}</div><h2>${m.em} ${m.nome}</h2><p>${introModelo[id]}</p>${camadas}
      <p class="muted mini-txt">Clique em uma estrutura no modelo ou em um nome abaixo para abrir a ficha.</p>
      <div class="acoes"><button class="btn" id="bOuvirM">🔊 Ouvir</button>${id === "circuito" ? '<button class="btn prim" id="bLigar">🔌 Ligar/desligar</button>' : ""}${id === "solar" ? '<button class="btn" data-vel="0">⏸</button><button class="btn" data-vel="1">▶ 1×</button><button class="btn" data-vel="5">⏩ 5×</button>' : ""}</div></div>${partesIrmas(id)}`;
    if (id === "circuito") $("#bLigar").onclick = () => avisar(est.atual.ligar() ? "Circuito fechado: a corrente passa e a lâmpada acende." : "Circuito aberto: a corrente para e a lâmpada apaga.");
    info.querySelectorAll("[data-vel]").forEach(b => b.onclick = () => est.atual.velocidade(+b.dataset.vel));
    $("#bOuvirM").onclick = () => falar(introModelo[id].replace(/<[^>]+>/g, ""));
    info.querySelectorAll("[data-cam]").forEach(b => b.onclick = () => { aplicarCamada(+b.dataset.cam); info.querySelectorAll("[data-cam]").forEach(x => x.classList.toggle("ativo", x === b)); });
    ligarChips(info);
  }
  function mostrarBoasVindas() {
    const meuAno = typeof anoAtual === "function" ? anoAtual() : "", minhaTurma = (ALUNO && ALUNO.dados && ALUNO.dados.turma) || (typeof TURMA_LINK !== "undefined" && TURMA_LINK) || (meuAno ? meuAno + "º ano" : "");
    info.innerHTML = `<div class="cartao"><h2>🚀 Bem-vindo à Missão SARESP!</h2>
      ${meuAno ? `<p>Revise em 3D os temas de Ciências do <b>${minhaTurma}</b> que caem no SARESP e na recuperação do 2º semestre.</p>
      <button class="btn prim" id="bMeusTemas" style="width:100%;justify-content:center;font-size:1rem;padding:12px">📚 Ver os temas da minha turma</button>
      <p class="mini-txt muted">Os temas também ficam ${innerWidth <= 900 ? "no menu <b>☰</b>, no canto de cima" : "na coluna da esquerda"}. Toque em um tema para abrir o simulador dele. Você também pode explorar os modelos:</p>`
      : `<p>Revise em 3D os temas de Ciências que caem no SARESP e na recuperação do 2º semestre, do 6º ao 9º ano. Comece pela <b>Trilha</b> do seu ano ou escolha um modelo:</p>
      <div class="linha-btn">${D.trilha.map(t => `<button class="btn" data-ano-ir="${t.ano}">${t.titulo}</button>`).join("")}</div>`}
      <div class="grade-mod">${D.modelos.filter(m => !meuAno || new RegExp(meuAno + "º").test(m.aula)).map(m => `<button data-mod="${m.id}"><span class="em">${m.em}</span><span>${m.nome}</span></button>`).join("")}</div></div>
      <div class="cartao pequeno"><h4 style="margin-top:0">Simulações em 3D</h4><div class="chips">${SIMULACOES.lista.filter(s => !meuAno || new RegExp(meuAno + "º").test(s.hab)).map(s => `<button class="chip" data-sim="${s.id}">${s.em} ${s.titulo}</button>`).join("")}</div>
      <ul class="lista"><li>Na <b>Trilha</b>, veja o que é cobrado no seu ano e vá direto ao recurso.</li><li>Em <b>Quiz</b>, faça o <b>Simulado SARESP</b> ou a revisão da <b>Recuperação</b>.</li><li>Cada acerto vale <b>XP</b>: suba de Recruta a Mentor!</li></ul></div>`;
    if ($("#bMeusTemas")) $("#bMeusTemas").onclick = abrirMeusTemas;
    ligarChips(info); info.querySelectorAll("[data-ano-ir]").forEach(b => b.onclick = () => { trilhaAno = b.dataset.anoIr; montarHabilidades(); trocarAba("habilidades"); });
  }

  /* ------------------------------ VOZ ------------------------------ */
  function falar(txt) {
    if (!("speechSynthesis" in window)) return avisar("Seu navegador não tem leitura em voz alta.");
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt); u.lang = "pt-BR"; u.rate = 1;
    const v = speechSynthesis.getVoices().find(v => /pt[-_]BR/i.test(v.lang)); if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  function avisar(t) { const a = $("#aviso"); a.textContent = t; a.hidden = false; clearTimeout(a._t); a._t = setTimeout(() => a.hidden = true, 5000); }

  /* ------------------------------ SIMULAÇÕES ------------------------------ */
  let verTodos = false;
  function anoFiltro() { return (!verTodos && typeof anoAtual === "function") ? anoAtual() : ""; }
  function doAno(txt, ano) { return !ano || new RegExp(ano + "º").test(txt || ""); }
  function botaoTodos(qtd) { const ano = typeof anoAtual === "function" ? anoAtual() : ""; if (!ano || (!qtd && !verTodos)) return ""; return `<button class="btn link ver-todos" data-ver-todos>${verTodos ? "➖ Mostrar só os do " + ano + "º ano" : "➕ Ver também os de outros anos (" + qtd + ")"}</button>`; }
  function ligarVerTodos(box) { box.querySelectorAll("[data-ver-todos]").forEach(b => b.onclick = () => { verTodos = !verTodos; montarListaModelos(); montarSimular(); }); }
  function montarListaModelos() {
    const ano = anoFiltro(), lista = D.modelos.filter(m => doAno(m.aula, ano)), outros = D.modelos.length - lista.length;
    $("#listaModelos").innerHTML = lista.map(m => `<button class="mod-btn" data-mod="${m.id}"><span class="em">${m.em}</span><span><b>${m.nome}</b><small>${m.sub}</small></span></button>`).join("") + botaoTodos(outros);
    $$("#listaModelos .mod-btn").forEach(b => b.onclick = () => { if (est.desafio) { pararDesafio(); est.rotulos = true; $("#btnRotulos").classList.add("ativo"); } carregarModelo(b.dataset.mod); trocarAba("explorar", true); fecharLateralMovel(); });
    ligarVerTodos($("#listaModelos"));
  }
  function montarSimular() {
    const box = $("#aba-simular");
    box.innerHTML = `<div class="cartao"><h3>🧪 Simulações em 3D</h3><p class="muted">Escolha uma simulação. Ela aparece no palco 3D e os controles ficam aqui.</p></div>` +
      SIMULACOES.lista.filter(s => doAno(s.hab, anoFiltro())).map(s => `<div class="cartao sim"><h3>${s.em} ${s.titulo} <span class="cod">${s.hab}</span></h3><p class="muted">${s.desc}</p><p class="mini-txt muted">${s.aulas}</p><button class="btn prim" data-sim="${s.id}">▶ Abrir no palco 3D</button></div>`).join("");
    box.insertAdjacentHTML("beforeend", botaoTodos(SIMULACOES.lista.length - SIMULACOES.lista.filter(x => doAno(x.hab, anoFiltro())).length)); ligarVerTodos(box);
    box.querySelectorAll("[data-sim]").forEach(b => b.onclick = () => abrirSim(b.dataset.sim));
  }
  function abrirSim(id) {
    if (est.desafio) pararDesafio();
    limparPalco();
    const def = SIMULACOES.lista.find(s => s.id === id);
    est.modo = "sim"; est.simId = id;
    $$(".mod-btn").forEach(b => b.classList.remove("ativo"));
    listarPartes(); $("#secCorte").hidden = true;
    trocarAba("simular", true);
    const box = $("#aba-simular");
    box.innerHTML = `<div class="linha-btn" style="margin:0 0 10px"><button class="btn" id="bVoltarSims">← Todas as simulações</button></div>
      <div class="cartao sim" id="cartaoSim"><h3>${def.em} ${def.titulo} <span class="cod">${def.hab}</span></h3><p class="mini-txt muted">${def.aulas}</p>${def.html}</div>`;
    $("#bVoltarSims").onclick = () => { carregarModelo(est.ultimoModelo, true); mostrarModeloInfo(est.ultimoModelo); montarSimular(); trocarAba("simular", true); };
    const cartao = $("#cartaoSim");
    const ctx = {
      T, G: GEO, cam, ctl, cartao, $: s => cartao.querySelector(s),
      hud: html => { const h = $("#hud"); h.hidden = !html; h.innerHTML = html || ""; },
      avisar, grafico: SIMULACOES.grafico, voar: (a, p) => { const A = new T.Vector3(...a); voarPara(A, ajustar(A, new T.Vector3(...p))); },
      rotulos: lista => criarRotulos(lista)
    };
    const s = def.iniciar(ctx);
    est.sim = s; est.atual = { raiz: s.raiz, partes: {}, ancoras: {} };
    cena.add(s.raiz);
    cam.near = 0.05; cam.updateProjectionMatrix(); ctl.minDistance = 2; ctl.maxDistance = 140;
    const caixa = new T.Box3().setFromObject(s.raiz); est.raio = caixa.getSize(new T.Vector3()).length() / 2;
    montarVistas(s.vistas); vista(s.vistas[0], 0);
    if (!est.desafio) popSim(id);
  }

  /* ------------------------------ HABILIDADES ------------------------------ */
  let trilhaAno = new URLSearchParams(location.search).get("ano") || "6";
  function botoesRec(r) {
    const b = [];
    if (r.modelo) b.push(`<button class="btn" data-mod2="${r.modelo}">🧊 ${nomeModelo(r.modelo)}</button>`);
    if (r.sim) { const sm = SIMULACOES.lista.find(x => x.id === r.sim); b.push(`<button class="btn" data-sim="${r.sim}">${sm.em} ${sm.titulo}</button>`); }
    if (r.ext) { const e = D.externos[r.ext]; b.push(`<a class="btn link" href="${e.url}" target="_blank" rel="noopener">↗ ${e.nome}</a>`); }
    return b.join("");
  }
  function faixa(pc) { return pc < 25 ? ["Abaixo do Básico", "var(--erro)"] : pc < 50 ? ["Básico", "var(--aviso)"] : pc < 75 ? ["Adequado", "var(--acento)"] : ["Avançado", "var(--ok)"]; }
  function montarHabilidades() {
    const box = $("#aba-habilidades"), t = D.trilha.find(x => x.ano === trilhaAno) || D.trilha[0];
    box.innerHTML = `<div class="cartao"><h3>🗺️ Trilha SARESP e Recuperação</h3><p class="muted">Aprendizagens Essenciais e habilidades do Guia Priorizado 2026. As marcadas com <b>♻️</b> fazem parte da recuperação do 2º semestre. A % é o acerto da escola no Mapa SARESP.</p>
      <div class="chips">${D.trilha.map(x => `<button class="chip ${x.ano === t.ano ? "ativo" : ""}" data-tano="${x.ano}">${x.titulo}</button>`).join("")}</div></div>
      ${t.itens.map(h => { const fx = h.pct != null ? faixa(h.pct) : null;
        return `<div class="cartao hab" data-cod="${h.cod}"><div class="hab-top"><span class="codigo">${t.titulo} · ${h.sigla}</span><span class="muted mini-txt">${h.bim}${h.rec ? " · ♻️ recuperação" : ""}</span></div>
        <p>${h.texto}</p><h4>De olho no SARESP</h4><ul class="lista">${h.desc.map(d => `<li>${d}</li>`).join("")}</ul>
        ${fx ? `<div class="destaque" style="border-color:${fx[1]}"><b>${String(h.pct).replace(".", ",")}%</b> de acerto na escola · faixa ${fx[0]}</div>` : ""}
        <div class="acoes">${botoesRec(h.r)}<button class="btn prim" data-qae="${h.cod}">📝 Quiz deste tema</button></div></div>`; }).join("")}
      <div class="cartao so-movel-bloco"><button class="btn" id="bSaibaM">📖 Glossário e referências</button></div>`;
    box.querySelectorAll("[data-tano]").forEach(b => b.onclick = () => { trilhaAno = b.dataset.tano; montarHabilidades(); });
    box.querySelectorAll("[data-mod2]").forEach(b => b.onclick = () => { carregarModelo(b.dataset.mod2); trocarAba("explorar", true); });
    box.querySelectorAll("[data-sim]").forEach(b => b.onclick = () => abrirSim(b.dataset.sim));
    box.querySelectorAll("[data-qae]").forEach(b => b.onclick = () => { trocarAba("quiz"); iniciarQuiz({ ae: b.dataset.qae }); });
    $("#bSaibaM").onclick = () => trocarAba("saiba");
  }
  function destacarHab(cod) { const a = cod.split("-")[0]; if (a !== trilhaAno) { trilhaAno = a; montarHabilidades(); } const c = document.querySelector(`.hab[data-cod="${cod}"]`); if (!c) return; c.scrollIntoView({ behavior: "smooth", block: "center" }); c.classList.add("piscar"); setTimeout(() => c.classList.remove("piscar"), 1500); }
  function executarAcao(a) {
    if (a.modelo) { carregarModelo(a.modelo); trocarAba("explorar", true); }
    if (a.sim) abrirSim(a.sim);
    if (a.aba) trocarAba(a.aba);
  }

  /* ------------------------------ QUIZ ------------------------------ */
  const embaralhar = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const quiz = { lista: [], i: 0, pontos: 0, modo: "", erros: [] };
  const anosQuiz = [["6", "6º ano", ["6"]], ["7", "7º ano", ["7"]], ["8", "8º ano", ["8"]], ["9", "9º ano", ["9"]]];
  let quizAno = (new URLSearchParams(location.search).get("ano") || "6"); if (!["6", "7", "8", "9"].includes(quizAno)) quizAno = "6";
  function montarQuiz() {
    const anos = (anosQuiz.find(x => x[0] === quizAno) || anosQuiz[0])[2], n = D.quiz.filter(q => anos.includes(q.a)).length;
    $("#aba-quiz").innerHTML = `<div class="cartao"><h3>📝 Quiz e Simulado SARESP</h3><p class="muted">Questões no formato SARESP (4 alternativas), ligadas às Aprendizagens Essenciais. Escolha o ano:</p>
      <div class="chips">${anosQuiz.map(a => `<button class="chip ${a[0] === quizAno ? "ativo" : ""}" data-qano="${a[0]}">${a[1]}</button>`).join("")}</div>
      <div class="linha-btn"><button class="btn prim" data-qm="simulado">🎯 Simulado SARESP (todos os bimestres)</button><button class="btn" data-qm="rec">♻️ Recuperação (3º e 4º bimestres)</button></div>
      <p class="mini-txt muted">Banco deste ano: ${n} questões. Cada acerto vale 10 XP.</p></div><div id="quizArea"></div>`;
    $$("#aba-quiz [data-qano]").forEach(b => b.onclick = () => { quizAno = b.dataset.qano; montarQuiz(); });
    if (ALUNO.dados) $$("#aba-quiz [data-qano]").forEach(b => { if (b.dataset.qano !== quizAno) b.hidden = true; });
    $$("#aba-quiz [data-qm]").forEach(b => b.onclick = () => iniciarQuiz({ modo: b.dataset.qm }));
  }
  function iniciarQuiz(o) {
    const anos = (anosQuiz.find(x => x[0] === quizAno) || anosQuiz[0])[2];
    let pool;
    if (o.ae) { pool = D.quiz.filter(q => q.ae === o.ae); quiz.modo = "Quiz do tema"; if (pool.length < 3) pool = pool.concat(embaralhar(D.quiz.filter(q => q.a === o.ae.split("-")[0] && q.ae !== o.ae)).slice(0, 4 - pool.length)); }
    else if (o.modo === "rec") { pool = D.quiz.filter(q => anos.includes(q.a) && q.b >= 3); quiz.modo = "Recuperação"; }
    else { pool = D.quiz.filter(q => anos.includes(q.a)); quiz.modo = "Simulado SARESP"; }
    quiz.lista = embaralhar(pool).slice(0, o.modo === "simulado" ? 12 : 10); quiz.i = 0; quiz.pontos = 0; quiz.erros = [];
    quiz.id = novoId(); quiz.atividade = o.ae ? "tema" : o.modo === "rec" ? "recuperacao" : "simulado"; quiz.tema = o.ae || null; quiz.resp = [];
    questao(); setTimeout(() => { const a = $("#quizArea"); if (a) a.scrollIntoView({ behavior: "smooth" }); }, 50);
  }
  function rotuloAE(cod) { for (const t of D.trilha) { const h = t.itens.find(x => x.cod === cod); if (h) return `${t.titulo} · ${h.sigla}`; } return cod; }
  function questao() {
    const area = $("#quizArea");
    if (quiz.i >= quiz.lista.length) {
      const n = quiz.lista.length, p = quiz.pontos, pc = Math.round(p / n * 100), fx = faixa(pc);
      const rev = [...new Set(quiz.erros)];
      area.innerHTML = `<div class="cartao centro"><small class="muted">${quiz.modo}</small><h2>${p} / ${n}</h2><div class="barra"><span style="width:${pc}%"></span></div>
        <p><b style="color:${fx[1]}">${pc}% · ${fx[0]}</b></p><p class="mini-txt muted">Mesmas faixas do Painel: Abaixo do Básico (&lt;25%), Básico (25–49%), Adequado (50–74%), Avançado (≥75%).</p>
        ${rev.length ? `<h4>Revise na trilha:</h4><div class="chips" style="justify-content:center">${rev.map(c => `<button class="chip" data-hab="${c}">${rotuloAE(c)}</button>`).join("")}</div>` : "<p>🏆 Nenhum erro! Você pode ser Mentor da turma.</p>"}
        <p class="envio" id="qEnvio">${ALUNO.dados ? "⏳ Enviando para o professor…" : "⚠️ Resultado não enviado: entre com sua turma e seu nome para o professor ver suas atividades."}</p>
        <div class="linha-btn" style="justify-content:center"><button class="btn prim" id="qNovo">Fazer outro</button>${ALUNO.dados ? "" : '<button class="btn" id="qEntrar">👤 Entrar com turma e nome</button>'}</div></div>`;
      if ($("#qEntrar")) $("#qEntrar").onclick = abrirEntrada;
      if (ALUNO.dados) ALUNO.fila.then(ok => { const e = $("#qEnvio"); if (e) e.innerHTML = ok ? `✅ Resultado enviado para o professor (${ALUNO.dados.turma} · ${ALUNO.dados.nome}).` : "⚠️ Não foi possível enviar agora. Verifique a internet e tente outro quiz."; });
      area.querySelectorAll("[data-hab]").forEach(b => b.onclick = () => { trocarAba("habilidades"); destacarHab(b.dataset.hab); });
      $("#qNovo").onclick = () => { montarQuiz(); };
      if (pc >= 75) XP.ganhar(20, "Bônus: faixa Avançado");
      return;
    }
    const q = quiz.lista[quiz.i], ordem = embaralhar(q.o.map((t, i) => ({ t, i })));
    area.innerHTML = `<div class="cartao"><div class="hab-top"><span class="muted">${quiz.modo} · questão ${quiz.i + 1} de ${quiz.lista.length}</span><span class="codigo">${rotuloAE(q.ae)}</span></div>
      <div class="barra"><span style="width:${quiz.i / quiz.lista.length * 100}%"></span></div>
      <p class="pergunta">${q.p}</p><div class="opcoes">${ordem.map((o, k) => `<button class="opcao" data-i="${o.i}"><b>${"ABCD"[k]})</b> ${o.t}</button>`).join("")}</div><div id="qFeed"></div></div>`;
    area.querySelectorAll(".opcao").forEach(b => b.onclick = () => {
      const certo = +b.dataset.i === q.c; if (certo) { quiz.pontos++; XP.ganhar(10); } else quiz.erros.push(q.ae);
      quiz.resp.push({ ae: q.ae, ok: certo, p: q.p.slice(0, 90), r: q.o[+b.dataset.i].slice(0, 60) });
      enviarQuiz(quiz.i + 1 >= quiz.lista.length);
      area.querySelectorAll(".opcao").forEach(x => { if (+x.dataset.i === q.c) x.classList.add("certa"); else if (x === b) x.classList.add("errada"); x.disabled = true; });
      $("#qFeed").innerHTML = `<div class="destaque ${certo ? "saude" : "erro"}"><b>${certo ? "Correto! +10 XP" : "Não foi dessa vez."}</b> ${q.e}</div><button class="btn prim" id="qProx">${quiz.i + 1 < quiz.lista.length ? "Próxima" : "Ver resultado"}</button>`;
      $("#qProx").onclick = () => { quiz.i++; questao(); };
    });
  }

  /* ------------------------------ XP E PATENTES ------------------------------ */
  const PATENTES = [[0, "Recruta", "🔰"], [100, "Explorador", "🧭"], [250, "Cientista", "🔬"], [400, "Mentor", "🏅"]];
  const XP = window.XP = {
    total: (() => { try { return +localStorage.getItem("ms3d_xp") || 0; } catch (e) { return 0; } })(),
    patente(x) { let p = PATENTES[0]; PATENTES.forEach(q => { if (x >= q[0]) p = q; }); return p; },
    ganhar(n, motivo) { const antes = this.patente(this.total); this.total += n; try { localStorage.setItem("ms3d_xp", this.total); } catch (e) { } this.mostrar(); const dep = this.patente(this.total);
      if (dep !== antes) avisar(`${dep[2]} Subiu de patente: ${dep[1]}! (${this.total} XP)`); else if (motivo) avisar(`+${n} XP · ${motivo}`); },
    mostrar() { const p = this.patente(this.total), prox = PATENTES.find(q => q[0] > this.total); const el = $("#xpChip"); if (el) { el.innerHTML = `<span>${p[2]}</span> <b class="xp-nome">${p[1]}</b><span class="xp-pts"> · ${this.total} XP</span>${prox ? ` <small>(faltam ${prox[0] - this.total} para ${prox[1]})</small>` : ""}`; el.title = `${p[1]} · ${this.total} XP`; } }
  };

  /* ------------------------------ DESAFIO ------------------------------ */
  function montarDesafio() {
    $("#aba-desafio").innerHTML = `<div class="cartao"><h3>🎯 Desafio: encontre no modelo!</h3>
      <p class="muted">Aparece o nome de uma estrutura e o modelo certo é carregado. Clique nela no palco 3D. Acertar de primeira vale 1 ponto; na segunda tentativa, meio ponto. 10 rodadas.</p>
      <button class="btn prim" id="bIniDes">Começar desafio</button></div><div id="desArea"></div>`;
    $("#bIniDes").onclick = iniciarDesafio;
  }
  function iniciarDesafio() {
    popEsconder();
    const anoD = typeof anoAtual === "function" ? anoAtual() : "", modsAno = D.modelos.filter(m => !anoD || new RegExp(anoD + "º").test(m.aula)).map(m => m.id);
    est.desafio = { fila: embaralhar(D.desafio.filter(id => modsAno.includes(D.fichas[id].modelo))).slice(0, 10), i: 0, pontos: 0, tent: 0, inicio: performance.now(), id: novoId(), resp: [] };
    rodada();
  }
  function pararDesafio() { est.desafio = null; }
  function rodada() {
    const d = est.desafio, area = $("#desArea");
    if (d.i >= d.fila.length) {
      const seg = Math.round((performance.now() - d.inicio) / 1000);
      area.innerHTML = `<div class="cartao centro"><h2>${d.pontos} / ${d.fila.length}</h2><p>Tempo total: ${seg} s</p><p class="envio" id="dEnvio">${ALUNO.dados ? "⏳ Enviando para o professor…" : "⚠️ Entre com sua turma e seu nome para o professor ver este resultado."}</p><button class="btn prim" id="bDesNovo">Jogar de novo</button></div>`;
      if (ALUNO.dados) registrar({ id: d.id, atividade: "desafio", tema: null, acertos: d.pontos, total: d.fila.length, concluido: true, respostas: d.resp }).then(ok => { const e = $("#dEnvio"); if (e) e.textContent = ok ? "✅ Resultado enviado para o professor." : "⚠️ Não foi possível enviar agora."; });
      $("#bDesNovo").onclick = iniciarDesafio; est.desafio = null; return;
    }
    const id = d.fila[d.i], f = D.fichas[id]; d.tent = 0;
    if (MODELOS[f.modelo].preparar && !MODELOS[f.modelo].pronto()) { MODELOS[f.modelo].preparar().then(rodada); return; }
    if (est.modo !== "modelo" || est.modeloId !== f.modelo) { const des = est.desafio; est.desafio = null; carregarModelo(f.modelo, true); est.desafio = des; }
    mostrarTudo();
    est.rotulos = false; $("#btnRotulos").classList.remove("ativo");
    area.innerHTML = `<div class="cartao centro alvo"><small>Rodada ${d.i + 1}/${d.fila.length} · Pontos: ${d.pontos}</small><h2>Clique em: <span>${f.nome}</span></h2>
      <p class="muted">Modelo: ${nomeModelo(f.modelo)} · Dica: use o corte e a transparência se a estrutura estiver escondida.</p><div id="desFeed"></div><button class="btn" id="bPular">Pular / mostrar</button></div>`;
    $("#bPular").onclick = () => { d.resp.push({ p: f.nome.slice(0, 60), ok: false }); realcar(id, 0xbef264, .8); focar(id); setTimeout(() => { limparRealce(id); d.i++; rodada(); }, 1800); };
  }
  function responderDesafio(p) {
    const d = est.desafio, alvo = d.fila[d.i], fb = $("#desFeed");
    if (p === alvo) {
      d.pontos += d.tent === 0 ? 1 : 0.5; d.resp.push({ p: D.fichas[alvo].nome.slice(0, 60), ok: d.tent === 0 });
      realcar(alvo, 0x22ff66, .7); setTimeout(() => limparRealce(alvo), 900);
      fb.innerHTML = `<div class="destaque saude">✔️ Isso mesmo! +5 XP. ${D.fichas[alvo].funcao}</div>`; XP.ganhar(5);
      d.i++; setTimeout(rodada, 1500);
    } else {
      d.tent++; realcar(p, 0xff2222, .6); setTimeout(() => limparRealce(p), 700);
      fb.innerHTML = `<div class="destaque erro">✖️ Isso é: <b>${D.fichas[p].nome}</b>. Tente de novo!</div>`;
    }
  }

  /* ------------------------------ SAIBA MAIS ------------------------------ */
  function montarSaiba() {
        $("#aba-saiba").innerHTML = `
      <div class="cartao"><h3>🧭 Como usar</h3><ul class="lista">
        <li><b>Girar:</b> arraste · <b>Mover:</b> botão direito ou dois dedos · <b>Zoom:</b> roda do mouse ou pinça.</li>
        <li>Clique em uma estrutura para abrir a ficha e use <b>Ouvir</b> para escutar a explicação.</li>
        <li>Na lateral, mostre ou esconda partes e ajuste a transparência. Use o <b>Corte</b> para ver o interior.</li>
        <li>Em <b>Simular</b>: fases da Lua e eclipses, estações do ano, sombras e movimento aparente do Sol, efeito estufa, seleção natural, consumo de energia, biomas e classificação de células.</li><li>Na <b>Trilha</b>, cada aprendizagem leva ao modelo, à simulação e ao quiz do tema. Os simuladores Corpo Humano 3D, Microvida 3D e Física 3D completam a revisão.</li><li>O <b>XP</b> fica salvo neste aparelho. Patentes: Recruta (0), Explorador (100), Cientista (250) e Mentor (400 XP).</li></ul></div>
      <div class="cartao"><h3>👩‍🏫 Para o professor</h3><p class="mini-txt">Links diretos: <code>?ano=6</code> abre a trilha e o quiz do 6º ano; <code>?aba=quiz&amp;ano=8</code> abre o simulado do 8º ano. Os resultados do quiz não são enviados a nenhum servidor.</p></div>
      <div class="cartao"><h3>📖 Glossário</h3><dl class="glossario">${D.glossario.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join("")}</dl></div>
      <div class="cartao"><h3>🔎 Referências</h3><ul class="refs">${D.referencias.map(([t, d, u]) => `<li><b><a href="${u}" target="_blank" rel="noopener">${t}</a></b><br><small class="muted">${d}</small></li>`).join("")}</ul>
      <p class="muted mini-txt">Todos os modelos são didáticos, construídos por código: tamanhos e distâncias não estão em escala. Valores de chuva e temperatura dos biomas são médias aproximadas; o modelo de temperatura do efeito estufa é simplificado (cerca de 3 °C a cada duplicação do gás carbônico).</p></div>`;
  }

  /* ------------------------------ BUSCA ------------------------------ */
  const busca = $("#busca"), sug = $("#sugestoes");
  const semAcento = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  busca.oninput = () => {
    const q = semAcento(busca.value.trim()); if (q.length < 2) { sug.hidden = true; return; }
    const r = [];
    Object.entries(D.fichas).forEach(([k, f]) => { if (semAcento(f.nome).includes(q)) r.push({ t: f.nome, s: nomeModelo(f.modelo), a: () => selecionar(k, true) }); });
    D.modelos.forEach(m => { if (semAcento(m.nome).includes(q)) r.push({ t: m.nome, s: "Modelo 3D", a: () => carregarModelo(m.id) }); });
    SIMULACOES.lista.forEach(s => { if (semAcento(s.titulo + " " + s.desc).includes(q)) r.push({ t: s.titulo, s: "Simulação", a: () => abrirSim(s.id) }); });
    sug.innerHTML = r.slice(0, 8).map((x, i) => `<button class="sug" data-i="${i}">${x.t}<small>${x.s}</small></button>`).join("") || `<div class="sug muted">Nada encontrado</div>`;
    sug.hidden = false;
    sug.querySelectorAll("[data-i]").forEach(b => b.onclick = () => { r[+b.dataset.i].a(); sug.hidden = true; busca.value = ""; });
  };
  busca.onblur = () => setTimeout(() => sug.hidden = true, 200);

  /* ------------------------------ ABAS ------------------------------ */
  function trocarAba(nome, semEfeito) {
    if (nome === "mais") nome = "habilidades";
    if (SEQ && SEQ.ativo && (nome === "explorar" || nome === "simular")) nome = "seq";
    $$(".aba").forEach(b => b.classList.toggle("ativo", b.dataset.aba === nome));
    $$(".abas-movel button").forEach(b => b.classList.toggle("ativo", b.dataset.aba === nome || (b.dataset.aba === "mais" && (nome === "habilidades" || nome === "saiba"))));
    $$(".conteudo-aba").forEach(c => c.hidden = c.id !== "aba-" + nome);
    document.body.classList.remove("painel-fechado");
    if (semEfeito) return;
    if (nome !== "desafio" && est.desafio) { pararDesafio(); est.rotulos = true; $("#btnRotulos").classList.add("ativo"); }
    if (nome === "explorar" && est.modo === "sim") { carregarModelo(est.ultimoModelo); }
    if (nome === "simular" && est.modo !== "sim") montarSimular();
  }
  $$(".aba, .abas-movel button").forEach(b => b.onclick = () => trocarAba(b.dataset.aba));

  /* ------------------------------ FERRAMENTAS ------------------------------ */
  $("#btnRotulos").onclick = e => { est.rotulos = !est.rotulos; e.currentTarget.classList.toggle("ativo", est.rotulos); };
  $("#btnGirar").onclick = e => { ctl.autoRotate = !ctl.autoRotate; e.currentTarget.classList.toggle("ativo", ctl.autoRotate); };
  $("#btnReset").onclick = () => { if (est.modo === "modelo") { mostrarTudo(); definirCorte(false); vista(MODELOS[est.modeloId].vistas[0]); } else if (est.sim) vista(est.sim.vistas[0]); };
  $("#btnFoto").onclick = () => {
    renderer.render(cena, cam);
    const a = document.createElement("a"); a.href = renderer.domElement.toDataURL("image/png"); a.download = "missao-saresp-3d.png"; document.body.appendChild(a); a.click(); a.remove();
  };
  /* tela cheia: usa a tela cheia do navegador quando existe e, sempre, um modo CSS que ocupa a tela toda
     (funciona também no iPhone, onde o navegador não deixa um bloco entrar em tela cheia) */
  function telaCheia(ligar) {
    const b = document.body, ja = b.classList.contains("tela-cheia");
    if (ligar === undefined) ligar = !ja; if (ligar === ja) return;
    b.classList.toggle("tela-cheia", ligar);
    $("#btnTela").classList.toggle("ativo", ligar); $("#btnTela").title = ligar ? "Sair da tela cheia" : "Tela cheia";
    $("#btnTelaF").textContent = ligar ? "✕" : "⛶"; $("#btnTelaF").title = ligar ? "Sair da tela cheia" : "Tela cheia";
    const de = document.documentElement;
    try {
      if (ligar && !document.fullscreenElement) { const f = de.requestFullscreen || de.webkitRequestFullscreen; if (f) { const r = f.call(de); if (r && r.catch) r.catch(() => { }); } }
      if (!ligar && (document.fullscreenElement || document.webkitFullscreenElement)) { const f = document.exitFullscreen || document.webkitExitFullscreen; if (f) { const r = f.call(document); if (r && r.catch) r.catch(() => { }); } }
    } catch (e) { }
    popModoTela(); setTimeout(redimensionar, 60); setTimeout(redimensionar, 350);
  }
  const fsMudou = () => { if (!(document.fullscreenElement || document.webkitFullscreenElement) && document.body.classList.contains("tela-cheia")) telaCheia(false); };
  document.addEventListener("fullscreenchange", fsMudou); document.addEventListener("webkitfullscreenchange", fsMudou);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("tela-cheia")) telaCheia(false); });
  $("#btnTela").onclick = () => telaCheia();
  { // controles que ficam sobre o simulador: tela cheia e mover a cena para cima / para baixo
    const caixa = document.createElement("div"); caixa.className = "mover-cena"; caixa.setAttribute("role", "group"); caixa.setAttribute("aria-label", "Mover a cena");
    caixa.innerHTML = `<button id="btnTelaF" title="Tela cheia" aria-label="Tela cheia">⛶</button><button data-m="1" title="Mover para cima (segure)" aria-label="Mover para cima">▲</button><button data-m="0" title="Centralizar" aria-label="Centralizar">◎</button><button data-m="-1" title="Mover para baixo (segure)" aria-label="Mover para baixo">▼</button>`;
    $(".palco-area").appendChild(caixa);
    $("#btnTelaF").onclick = () => telaCheia();
    caixa.querySelectorAll("[data-m]").forEach(b => {
      const m = +b.dataset.m;
      if (!m) { b.onclick = () => $("#btnReset").click(); return; }
      const parar = () => { est.mover = 0; };
      b.addEventListener("pointerdown", e => { e.preventDefault(); est.mover = m; est.usuarioMoveu = true; est.voo = null; ctl.autoRotate = false; $("#btnGirar").classList.remove("ativo"); try { b.setPointerCapture(e.pointerId); } catch (er) { } });
      b.addEventListener("pointerup", parar); b.addEventListener("pointercancel", parar); b.addEventListener("lostpointercapture", parar);
      b.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); est.passo = m; } });
    });
  }
  $("#btnTema").onclick = () => { const t = document.documentElement.dataset.tema === "claro" ? "escuro" : "claro"; document.documentElement.dataset.tema = t; try { localStorage.setItem("ms3d_tema", t); } catch (e) { } };
  $("#btnLateral").onclick = () => document.body.classList.toggle("lateral-aberta");
  $("#btnFecharPainel").onclick = () => document.body.classList.add("painel-fechado");
  function abrirMeusTemas() {
    if (innerWidth <= 900) document.body.classList.add("lateral-aberta");
    const sec = $("#secTemas"); if (sec) { sec.scrollIntoView({ behavior: "smooth", block: "start" }); sec.classList.add("piscar"); setTimeout(() => sec.classList.remove("piscar"), 1500); }
  }
  function fecharLateralMovel() { document.body.classList.remove("lateral-aberta"); }

  // lista de modelos na lateral: montada em aplicarTurma() (só os do ano da turma, com opção de ver todos)

  /* ------------------------------ LAÇO ------------------------------ */
  const relogio = new T.Clock(); let tempo = 0;
  function laco() {
    { const agora = performance.now(), dtq = agora - (laco._t || agora); laco._t = agora; laco._n = (laco._n || 0) + 1; laco._s = (laco._s || 0) + dtq;
      if (laco._n >= 90) { const media = laco._s / laco._n; laco._n = 0; laco._s = 0;
        if (media > 38 && prAtual > PR_MIN) { prAtual = Math.max(PR_MIN, prAtual - 0.5); renderer.setPixelRatio(prAtual); if (typeof redimensionar === "function") redimensionar(); }
        else if (media < 20 && prAtual < PR_MAX && !document.hidden) { prAtual = Math.min(PR_MAX, prAtual + 0.25); renderer.setPixelRatio(prAtual); if (typeof redimensionar === "function") redimensionar(); } } }
    requestAnimationFrame(laco);
    const dt = Math.min(relogio.getDelta(), 0.05); tempo += dt;
    if (est.voo) {
      const v = est.voo; v.t += dt / v.dur; const k = v.t >= 1 ? 1 : 1 - Math.pow(1 - v.t, 3);
      ctl.target.lerpVectors(v.a0, v.a1, k); cam.position.lerpVectors(v.p0, v.p1, k);
      if (v.t >= 1) est.voo = null;
    }
    if (est.mover || est.passo) { // ▲ / ▼: desloca câmera e alvo juntos, na vertical da tela
      const up = new T.Vector3(0, 1, 0).applyQuaternion(cam.quaternion), dist = cam.position.distanceTo(ctl.target);
      const d = est.passo ? est.passo * dist * 0.12 : est.mover * dist * 0.75 * dt; est.passo = 0;
      up.multiplyScalar(-d); cam.position.add(up); ctl.target.add(up);
    }
    ctl.update();
    if (est.atual && est.atual.atualizar) est.atual.atualizar(dt, tempo);
    if (est.sim && est.sim.atualizar) est.sim.atualizar(dt, tempo);
    renderer.render(cena, cam);
    atualizarRotulos();
  }

  function forcarAtualizacao() { location.replace(location.pathname + "?v=" + Date.now()); }

  /* ------------------------------ TURMA, ALUNO E ENVIO DOS RESULTADOS ------------------------------ */
  const TURMAS = ["6º Ano A (Lydia)", "6º Ano B (Lydia)", "6º Ano C (Lydia)", "6º Ano A", "6º Ano C", "7º Ano A", "7º Ano B", "8º Ano A", "8º Ano B", "9º Ano A", "9º Ano B"];
  const SBG = "https://oxohpnappygkmwjyowvq.supabase.co", KEYG = "sb_publishable_EjJenZkxMWv_I6vXWTz6aQ_iz9XEU4N";
  function novoId() { return crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); }); }
  const ALUNO = { dados: null, fila: Promise.resolve(true) };
  try { const a = JSON.parse(localStorage.getItem("ms3d_aluno") || "null"); if (a && TURMAS.includes(a.turma) && a.nome && Date.now() - a.t < 12 * 3600e3 && (a.v === 2 || a.turma[0] !== "6")) ALUNO.dados = a; /* v2: 6º anos separados por escola */ } catch (e) { }
  /* link da turma: ?turma=7A (opcional &tema=7-AE10) — a turma já vem escolhida e o aluno só seleciona o nome */
  const PARAM = new URLSearchParams(location.search);
  // ?turma=7A · 6º anos da E.E. Lydia Kitz Moreira: ?turma=6AL, 6BL, 6CL (o antigo 6B é da Lydia)
  const TURMA_LINK = (() => { const m = /^([6-9])\s*º?\s*(?:ano)?\s*([A-C])\s*(L|LYDIA)?$/i.exec((PARAM.get("turma") || "").trim()); if (!m) return ""; const L = m[3] || (m[1] === "6" && /b/i.test(m[2])); const t = `${m[1]}º Ano ${m[2].toUpperCase()}${L ? " (Lydia)" : ""}`; return TURMAS.includes(t) ? t : ""; })();
  const TEMA_LINK = (PARAM.get("tema") || "").trim();
  if (TURMA_LINK && ALUNO.dados && ALUNO.dados.turma !== TURMA_LINK) ALUNO.dados = null;   // outra turma neste aparelho: pede o nome de novo
  /* grava (ou atualiza) a tentativa no banco; repete se a rede falhar */
  function registrar(r) {
    if (!ALUNO.dados) return Promise.resolve(false);
    const corpo = JSON.stringify({ p_id: r.id, p_turma: ALUNO.dados.turma, p_nome: ALUNO.dados.nome, p_atividade: r.atividade, p_tema: r.tema, p_acertos: r.acertos, p_total: r.total, p_concluido: !!r.concluido, p_respostas: r.respostas });
    const envia = async () => { for (let k = 0; k < 4; k++) { try { const x = await fetch(SBG + "/rest/v1/rpc/missao3d_registrar", { method: "POST", headers: { apikey: KEYG, Authorization: "Bearer " + KEYG, "Content-Type": "application/json" }, body: corpo, keepalive: true }); if (x.ok) return true; if (x.status === 400) return false; } catch (e) { } await new Promise(z => setTimeout(z, 1200 * (k + 1))); } return false; };
    ALUNO.fila = ALUNO.fila.then(envia, envia); return ALUNO.fila;
  }
  function enviarQuiz(fim) { return registrar({ id: quiz.id, atividade: quiz.atividade, tema: quiz.tema, acertos: quiz.pontos, total: quiz.lista.length, concluido: fim, respostas: quiz.resp }); }

  const sel = $("#eTurma"), selN = $("#eNome");
  sel.innerHTML = `<option value="">Selecione sua turma</option>` + TURMAS.map(t => `<option>${t}</option>`).join("");
  sel.onchange = async () => {
    const t = sel.value; selN.disabled = true; $("#eEntrar").disabled = true; $("#eMsg").textContent = "";
    selN.innerHTML = `<option value="">${t ? "Carregando os nomes…" : "Primeiro selecione a turma"}</option>`; if (!t) return;
    let nomes = [];
    try { const r = await fetch("/api/atividade-quimica?turma=" + encodeURIComponent(t), { cache: "no-store" }); const j = await r.json(); if (j.ok) nomes = j.nomes.map(a => a.nome); } catch (e) { }
    if (sel.value !== t) return;
    nomes.sort((a, b) => a.localeCompare(b, "pt"));
    selN.innerHTML = `<option value="">${nomes.length ? "Selecione seu nome" : "Não foi possível carregar a lista"}</option>` + nomes.map(n => `<option>${n.replace(/</g, "")}</option>`).join("");
    selN.disabled = !nomes.length; if (!nomes.length) $("#eMsg").textContent = "Sem internet ou fora da plataforma: use “Só explorar”.";
  };
  selN.onchange = () => { $("#eEntrar").disabled = !selN.value; };
  function abrirEntrada() {
    $("#entrada").hidden = false;
    const t = TURMA_LINK || (ALUNO.dados && ALUNO.dados.turma) || "";
    if (t && sel.value !== t) { sel.value = t; sel.onchange(); }
    sel.disabled = !!TURMA_LINK && !/^6º Ano [AC]$/.test(TURMA_LINK);   // links antigos de 6º A/C: deixa trocar para a turma da Lydia
    if (/^6º Ano [AC]$/.test(t)) $("#eMsg").textContent = "Estuda na E.E. Lydia Kitz Moreira (manhã)? Escolha a turma com “(Lydia)”.";
    $("#eTit").textContent = TURMA_LINK ? `🚀 Missão SARESP 3D · ${TURMA_LINK}` : "🚀 Missão SARESP 3D";
    setTimeout(() => (TURMA_LINK ? selN : sel).focus(), 80);
  }
  $("#eEntrar").onclick = () => {
    ALUNO.dados = { turma: sel.value, nome: selN.value, t: Date.now(), v: 2 };
    try { localStorage.setItem("ms3d_aluno", JSON.stringify(ALUNO.dados)); } catch (e) { }
    $("#entrada").hidden = true; aplicarTurma();
    if (seqDeveAtivar()) iniciarSeq(TEMA_LINK);
    else if (TEMA_LINK) abrirTemaLink(); else { if (/Bem-vindo à Missão/.test(info.textContent)) mostrarBoasVindas(); abrirMeusTemas(); }
    avisar(`Bem-vindo(a), ${ALUNO.dados.nome.split(" ")[0]}! ${SEQ.ativo ? "Comece pela etapa " + (SEQ.i + 1) + ": use o simulador e responda às questões." : "Toque em um tema para começar."}`);
  };
  $("#eExplorar").onclick = () => { $("#entrada").hidden = true; if (seqDeveAtivar()) iniciarSeq(TEMA_LINK); else abrirTemaLink(); try { sessionStorage.setItem("ms3d_explorar", "1"); } catch (e) { } };
  $("#btnAluno").onclick = abrirEntrada;

  /* abas verticais com os temas do ano da turma: SARESP e Recuperação semestral */
  let temaAtivo = "";
  function anoAtual() { return ALUNO.dados ? ALUNO.dados.turma[0] : TURMA_LINK ? TURMA_LINK[0] : (PARAM.get("ano") || ""); }
  function montarTemasLateral() {
    if (SEQ && SEQ.ativo) return montarSeqLateral();
    const ano = anoAtual(), t = D.trilha.find(x => x.ano === ano), box = $("#listaTemas");
    $("#secTemas").hidden = !t; if (!t) return;
    $("#temasTit").textContent = ALUNO.dados ? `Temas · ${ALUNO.dados.turma}` : `Temas · ${t.titulo}`;
    const aba = h => { const fx = h.pct != null ? faixa(h.pct) : null;
      let r = `<button class="aba-v ${h.cod === temaAtivo ? "ativo" : ""}" data-tema="${h.cod}" style="--c:${fx ? fx[1] : "var(--acento)"}"><span><b>${h.tema}${PLANO.has(h.cod) ? '<span class="estrela" title="No seu plano de estudo">⭐</span>' : ""}</b><small>${h.sigla} · ${h.bim}</small></span>${fx ? `<span class="pct" title="Acerto da escola no Mapa SARESP">${String(h.pct).replace(".", ",")}%</span>` : ""}</button>`;
      if (h.cod === temaAtivo) r += `<div class="recursos-v">${botoesRec(h.r).replace(/class="btn"/g, 'class="btn"').replace(/data-mod2=/g, "data-mod3=")}<button class="btn prim" data-qae2="${h.cod}">📝 Quiz deste tema</button><button class="btn" data-hab="${h.cod}">🗺️ Ver na trilha</button></div>`;
      return r; };
    const rec = t.itens.filter(h => h.rec), sar = t.itens.filter(h => !h.rec);
    box.innerHTML = (sar.length ? `<div class="grupo">🎯 SARESP · 1º e 2º bimestres</div>` + sar.map(aba).join("") : "") +
      (rec.length ? `<div class="grupo">♻️ Recuperação semestral · também cai no SARESP</div>` + rec.map(aba).join("") : "") +
      `<div class="grupo">🏁 Treino geral</div><button class="aba-v" data-geral="simulado"><span><b>🎯 Simulado SARESP</b><small>12 questões de todos os temas</small></span></button><button class="aba-v" data-geral="rec"><span><b>♻️ Revisão da recuperação</b><small>3º e 4º bimestres</small></span></button>`;
    box.querySelectorAll("[data-tema]").forEach(b => b.onclick = () => abrirTema(b.dataset.tema));
    box.querySelectorAll("[data-mod3]").forEach(b => b.onclick = () => { carregarModelo(b.dataset.mod3); trocarAba("explorar", true); fecharLateralMovel(); });
    box.querySelectorAll("[data-sim]").forEach(b => b.onclick = () => { abrirSim(b.dataset.sim); fecharLateralMovel(); });
    box.querySelectorAll("[data-qae2]").forEach(b => b.onclick = () => { trocarAba("quiz"); iniciarQuiz({ ae: b.dataset.qae2 }); fecharLateralMovel(); });
    box.querySelectorAll("[data-hab]").forEach(b => b.onclick = () => { trocarAba("habilidades"); destacarHab(b.dataset.hab); fecharLateralMovel(); });
    box.querySelectorAll("[data-geral]").forEach(b => b.onclick = () => { trocarAba("quiz"); iniciarQuiz({ modo: b.dataset.geral }); fecharLateralMovel(); });
  }
  function abrirTema(cod) {
    temaAtivo = temaAtivo === cod ? "" : cod; montarTemasLateral(); if (!temaAtivo) return;
    let h = null; D.trilha.forEach(t => t.itens.forEach(x => { if (x.cod === cod) h = x; }));
    if (h.r.sim) abrirSim(h.r.sim); else if (h.r.modelo) { carregarModelo(h.r.modelo); trocarAba("explorar", true); } else { trocarAba("habilidades"); destacarHab(cod); }
    popTema(cod);
  }
  function abrirTemaLink() { if (TEMA_LINK && D.trilha.some(t => t.itens.some(x => x.cod === TEMA_LINK)) && TEMA_LINK[0] === anoAtual() && temaAtivo !== TEMA_LINK) abrirTema(TEMA_LINK); }
  function aplicarTurma() {
    const ano = anoAtual();
    if (["6", "7", "8", "9"].includes(ano)) { trilhaAno = ano; quizAno = ano; }
    $("#btnAluno").innerHTML = "👤<span class=\"al-txt\"> " + (ALUNO.dados ? `${ALUNO.dados.turma} · ${ALUNO.dados.nome.split(" ").slice(0, 2).join(" ")}` : "Entrar").replace(/</g, "") + "</span>";
    $("#btnAluno").title = ALUNO.dados ? `${ALUNO.dados.turma} · ${ALUNO.dados.nome} (toque para trocar)` : "Escolher turma e nome";
    montarHabilidades(); montarQuiz(); montarTemasLateral(); montarListaModelos(); montarSimular();
  }

  /* ------------------------------ MEU RELATÓRIO (aluno, com RA e senha) E BOTÃO DO PROFESSOR ------------------------------ */
  let PLANO = new Set(), RELAT = null;
  try { if (Object.keys(localStorage).some(k => /^sb-ykrjfjepnqeoqlgupsbe-auth-token$/.test(k))) { const b = $("#btnProf"); b.hidden = false; b.onclick = e => { e.preventDefault(); location.href = "professor/" + (ALUNO.dados ? "?turma=" + encodeURIComponent(ALUNO.dados.turma) : ""); }; } } catch (e) { }
  function carregarAcesso() {
    if (window.alunoAcesso) return Promise.resolve(window.alunoAcesso);
    return new Promise((ok, falha) => { const sc = document.createElement("script"); sc.src = "/aluno-acesso.js"; sc.onload = () => ok(window.alunoAcesso); sc.onerror = falha; document.head.appendChild(sc); });
  }
  function botaoVoltarLogin() {   // a tela de login da plataforma não tem "voltar": acrescenta um
    const box = document.querySelector("#alunoLogin .box"); if (!box || box.querySelector(".voltar-sim")) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "voltar-sim"; b.textContent = "← Voltar ao simulador sem entrar";
    b.onclick = () => { document.getElementById("alunoLogin").hidden = true; trocarAba("explorar"); }; box.appendChild(b);
  }
  async function abrirRelatorio() {
    trocarAba("relatorio"); const box = $("#aba-relatorio");
    box.innerHTML = `<div class="cartao"><h3>📊 Meu relatório</h3><p class="muted">Para ver suas notas, entre com seu <b>RA, dígito e senha</b> (os mesmos das outras atividades da plataforma). Assim só você vê o seu desempenho.</p><p class="muted mini-txt">Carregando…</p></div>`;
    let acesso; try { acesso = await carregarAcesso(); } catch (e) { box.innerHTML = `<div class="cartao"><h3>📊 Meu relatório</h3><p>O relatório só funciona dentro da plataforma (Painel da escola).</p></div>`; return; }
    const obs = setInterval(botaoVoltarLogin, 300); setTimeout(() => clearInterval(obs), 120000);
    const token = await acesso.exigir(); clearInterval(obs);
    let j; try { const r = await fetch("/api/individual?acao=missao3d", { headers: { Authorization: "Bearer " + token }, cache: "no-store" }); j = await r.json(); } catch (e) { j = { ok: false, erro: "Sem conexão." }; }
    if (!j.ok) { box.innerHTML = `<div class="cartao"><h3>📊 Meu relatório</h3><p>${(j.erro || "Não foi possível carregar.").replace(/</g, "")}</p><button class="btn" id="rSair">Entrar com outro RA</button></div>`; $("#rSair").onclick = () => { acesso.sair(); abrirRelatorio(); }; return; }
    RELAT = j;
    if (TURMAS.includes(j.turma) && (!ALUNO.dados || ALUNO.dados.turma !== j.turma || ALUNO.dados.nome !== j.nome)) { ALUNO.dados = { turma: j.turma, nome: j.nome, t: Date.now(), v: 2 }; try { localStorage.setItem("ms3d_aluno", JSON.stringify(ALUNO.dados)); } catch (e) { } }
    desenharRelatorio(); aplicarTurma();
  }
  function desenharRelatorio() {
    const j = RELAT, box = $("#aba-relatorio"), Q = j.questoes || {}, ITEM = {}; D.trilha.forEach(t => t.itens.forEach(h => ITEM[h.cod] = h));
    const tr = D.trilha.find(x => x.ano === String(j.turma)[0]);
    const sim = j.simulado, val = sim ? sim.itens.filter(i => i.ok !== null) : [], ac = val.filter(i => i.ok).length, pc = val.length ? Math.round(ac / val.length * 100) : null;
    const fracos = []; if (sim) sim.itens.forEach(i => { if (i.ok === false && Q[i.k] && !fracos.includes(Q[i.k].tema)) fracos.push(Q[i.k].tema); });
    const rec = tr ? tr.itens.filter(h => h.rec && !fracos.includes(h.cod)).map(h => h.cod) : [];
    PLANO = new Set(fracos.concat(rec));
    fracos.forEach(c => FOCO.temas.add(c)); if (SEQ && SEQ.ativo) { seqSalvar(); montarSeqLateral(); }
    const feito = c => (j.missao || []).some(x => x.atividade === "tema" && x.tema === c && x.concluido && Number(x.nota) >= 7);
    const item = (c, cor) => `<div class="plano-item"><span><b>${feito(c) ? "✅" : cor} ${ITEM[c] ? ITEM[c].tema : c}</b><small>${ITEM[c] ? ITEM[c].sigla + " · " + ITEM[c].bim : ""}${feito(c) ? " · concluído na Missão" : ""}</small></span><button class="btn prim" data-estudar="${c}">Estudar</button></div>`;
    const fx = pc == null ? null : faixa(pc), feitos = [...PLANO].filter(feito).length;
    const ATV = { simulado: "Simulado SARESP 3D", recuperacao: "Revisão da recuperação", tema: "Quiz do tema", desafio: "Desafio" };
    box.innerHTML = `<div class="cartao"><div class="etiqueta" style="--c:var(--acento)">${j.turma}</div><h2>📊 ${j.nome}</h2>
      <div class="barra"><span style="width:${PLANO.size ? Math.round(feitos / PLANO.size * 100) : 0}%"></span></div><p class="mini-txt muted">Plano de estudo: ${feitos} de ${PLANO.size} temas concluídos (quiz do tema com nota 7 ou mais).</p></div>
      <div class="cartao"><h3>🎯 Simulado SARESP</h3>${sim ? `<p><b style="font-size:1.4rem;color:${fx[1]}">${ac}/${val.length} · ${pc}%</b> · <b style="color:${fx[1]}">${fx[0]}</b></p>
        <details><summary>Ver questão por questão</summary>${sim.itens.map(i => { const q = Q[i.k] || {}; return `<div class="q-sim">${i.ok === null ? "⏳" : i.ok ? '<span class="ok">✔</span>' : '<span class="er">✘</span>'} <b>Q${q.n}</b> · ${ITEM[q.tema] ? ITEM[q.tema].tema : ""}<br><small class="muted">${(q.desc || "").replace(/</g, "")}</small></div>`; }).join("")}</details>`
        : `<p class="muted">${j.erroSimulado ? j.erroSimulado : "Você ainda não fez o Simulado SARESP da plataforma. Seu plano usa os temas da recuperação semestral."}</p>`}</div>
      <div class="cartao"><h3>📚 Meu plano de estudo</h3>${fracos.length ? `<h4>🔴 Reforçar para o SARESP (errei no Simulado)</h4>${fracos.map(c => item(c, "🔴")).join("")}` : sim ? `<div class="destaque saude">🏆 Você acertou todos os temas do Simulado!</div>` : ""}
        <h4>🟠 Recuperação semestral</h4>${rec.map(c => item(c, "🟠")).join("")}<p class="mini-txt muted">Os temas do plano também aparecem com ⭐ na lateral.</p></div>
      <div class="cartao"><h3>🗂️ Minhas atividades na Missão</h3>${(j.missao || []).length ? (j.missao || []).slice(0, 30).map(x => { const f2 = faixa(x.total ? x.acertos / x.total * 100 : 0); return `<div class="plano-item"><span><b>${ATV[x.atividade] || x.atividade}${x.tema && ITEM[x.tema] ? " · " + ITEM[x.tema].tema : ""}</b><small>${new Date(x.atualizado).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} · ${x.concluido ? "concluída" : "incompleta"}</small></span><b style="color:${f2[1]}">${String(x.nota).replace(".", ",")}</b></div>`; }).join("") : `<p class="muted">Você ainda não fez atividades na Missão. Comece pelo primeiro tema do plano!</p>`}
        <div class="linha-btn"><button class="btn" id="rAtu">↻ Atualizar</button><button class="btn" id="rSair2">Sair (RA)</button></div></div>`;
    box.querySelectorAll("[data-estudar]").forEach(b => b.onclick = () => { if (SEQ.ativo) { const k = SEQ.passos.findIndex(p => p.h && p.h.cod === b.dataset.estudar); if (k >= 0) return irPasso(k); } temaAtivo = ""; abrirTema(b.dataset.estudar); });
    $("#rAtu").onclick = abrirRelatorio; $("#rSair2").onclick = () => { if (window.alunoAcesso) window.alunoAcesso.sair(); };
  }
  $("#btnRel").onclick = abrirRelatorio;

  /* ------------------------------ MODO SEQUÊNCIA (link do aluno) ------------------------------
     Cada tema do ano vira uma etapa: o simulador (ou modelo 3D) no palco e, no painel, as questões do tema.
     Termina com o Simulado SARESP. Desliga com ?livre=1. */
  var SEQ = { ativo: false, passos: [], i: 0, feitos: {}, q: null, estado: {} };
  function seqDeveAtivar() { return !PARAM.has("livre") && !!(TURMA_LINK || ALUNO.dados); }
  function seqChave() { return "ms3d_seq_" + (ALUNO.dados ? ALUNO.dados.turma + "|" + ALUNO.dados.nome : TURMA_LINK || anoAtual()); }
  /* salvamento automático: além do tema em que o aluno está e dos temas concluídos, guarda, para cada tema,
     as questões sorteadas, a ordem das alternativas e cada resposta dada — assim ele continua exatamente de onde parou */
  function seqSalvar() { try { localStorage.setItem(seqChave(), JSON.stringify({ i: SEQ.i, feitos: SEQ.feitos, foco: [...FOCO.temas], erros: FOCO.erros.slice(-200), estado: SEQ.estado, rodada: SEQ.rodada || 1, vistas: (SEQ.vistas || []).slice(-600), t: Date.now() })); seqMarcaSalvo(); } catch (e) { } }
  function seqMarcaSalvo() { const e = $("#seqSalvo"); if (!e) return; e.classList.remove("pulsa"); void e.offsetWidth; e.classList.add("pulsa"); }
  /* ---- dificuldades individuais ----
     FOCO.temas: temas em que o aluno precisa de reforço — vêm (1) do link pessoal enviado pelo professor (&foco=),
     (2) do Simulado SARESP do próprio aluno quando ele entra com RA (Meu relatório) e (3) dos temas em que ele tirou menos de 7 aqui.
     FOCO.erros: questões que o aluno errou (voltam primeiro quando ele refaz). */
  var FOCO = { temas: new Set(), erros: [] };
  const N_QUESTOES = 10;          // Simulado SARESP final
  const N_TRILHA = 25;            // questões da trilha inteira (somando todos os temas); o resto do banco vai sendo trocado a cada acesso
  // divide as 25 questões entre os temas: todos com a mesma base e as que sobram vão primeiro para os temas de reforço do aluno
  function cotasTemas(passos) {
    const temas = passos.filter(p => p.tipo === "tema"), n = temas.length, out = {}; if (!n) return out;
    const base = Math.floor(N_TRILHA / n); let resto = N_TRILHA - base * n;
    temas.forEach(p => out[p.h.cod] = base);
    temas.filter(p => FOCO.temas.has(p.h.cod)).concat(temas.filter(p => !FOCO.temas.has(p.h.cod))).forEach(p => { if (resto > 0) { out[p.h.cod]++; resto--; } });
    return out;
  }
  // banco de questões: as que o aluno ainda não viu vêm antes das que ele já respondeu (e, entre estas, as vistas há mais tempo)
  const visto = q => SEQ.vistas ? SEQ.vistas.indexOf(chaveQ(q)) : -1;
  function ordemBanco(lista) { const nov = embaralhar(lista.filter(q => visto(q) < 0)), ja = lista.filter(q => visto(q) >= 0).sort((a, b) => visto(a) - visto(b)); return nov.concat(ja); }
  const chaveQ = q => q.ae + "|" + q.p.slice(0, 60);
  function focoCarregar() {
    let sv = {}; try { sv = JSON.parse(localStorage.getItem(seqChave()) || "{}"); } catch (e) { }
    (sv.foco || []).forEach(c => FOCO.temas.add(c)); FOCO.erros = sv.erros || [];
    (PARAM.get("foco") || "").split(/[.,\s]+/).forEach(c => { if (/^\d-[A-Za-z0-9]+$/.test(c)) FOCO.temas.add(c); });
    if (RELAT && RELAT.simulado) { const Q = RELAT.questoes || {}; RELAT.simulado.itens.forEach(i => { if (i.ok === false && Q[i.k]) FOCO.temas.add(Q[i.k].tema); }); }
  }
  // 10 questões do tema: num tema de reforço, as que o aluno já errou vêm primeiro
  function questoesTema(cod, n) {
    n = n || (SEQ.cotas && SEQ.cotas[cod]) || N_QUESTOES;
    // até 1/3 (no mínimo 1) das questões são revisão do que o aluno errou; o resto vem do banco, primeiro as que ele ainda não viu
    const pool = D.quiz.filter(q => q.ae === cod), err = new Set(FOCO.erros);
    const revisao = embaralhar(pool.filter(q => err.has(chaveQ(q)))).slice(0, Math.max(1, Math.floor(n / 3)));
    return revisao.concat(ordemBanco(pool.filter(q => !revisao.includes(q)))).slice(0, n);
  }

  // Simulado final com 10 questões: cerca de 6 dos temas de reforço do aluno (uma de cada vez, em rodízio) e o resto dos outros temas do ano
  function questoesSimulado() {
    const ano = anoAtual(), noTrilha = new Set((SEQ.blocos || []).filter(Boolean).flatMap(b => b.lista || []).map(chaveQ)),
      pool = ordemBanco(D.quiz.filter(q => q.a === ano && !noTrilha.has(chaveQ(q)))), foco = [...FOCO.temas].filter(c => c[0] === ano);
    const out = [], usa = q => { if (!out.includes(q)) out.push(q); };
    if (foco.length) { const filas = foco.map(c => pool.filter(q => q.ae === c)); for (let r = 0; out.length < 6 && filas.some(f => f.length); r++) filas.forEach(f => { if (out.length < 6 && f.length) usa(f.shift()); }); }
    const porTema = {}; pool.forEach(q => { if (!out.includes(q)) (porTema[q.ae] = porTema[q.ae] || []).push(q); });
    const filas = embaralhar(Object.values(porTema)); while (out.length < N_QUESTOES && filas.some(f => f.length)) filas.forEach(f => { if (out.length < N_QUESTOES && f.length) usa(f.shift()); });
    return embaralhar(out);
  }
  function seqMontarPassos() {
    const t = D.trilha.find(x => x.ano === anoAtual()); if (!t) return [];
    const usa = h => h.r && (h.r.sim || h.r.modelo || h.r.ext);
    const foco = h => FOCO.temas.has(h.cod) ? 0 : 1, pri = (a, b) => foco(a) - foco(b);
    const ordem = t.itens.filter(h => !h.rec && usa(h)).sort(pri).concat(t.itens.filter(h => h.rec && usa(h)).sort(pri));
    return ordem.map(h => ({ tipo: "tema", h })).concat([{ tipo: "simulado" }]);
  }
  /* Sequência contínua: todos os temas um embaixo do outro, cada um com o seu simulador e as suas 10 questões.
     Ao rolar até um tema, o palco 3D troca sozinho para o simulador dele. */
  function iniciarSeq(irPara) {
    focoCarregar(); SEQ.passos = seqMontarPassos(); if (!SEQ.passos.length) return;
    SEQ.ativo = true; document.body.classList.add("seq", "seq-continua");
    let salvo = {}; try { salvo = JSON.parse(localStorage.getItem(seqChave()) || "{}"); } catch (e) { }
    SEQ.feitos = salvo.feitos || {}; SEQ.estado = salvo.estado || {}; SEQ.ativoK = -1; SEQ.blocos = []; SEQ.usados3d = new Set(); SEQ.obsQ = [];
    SEQ.rodada = salvo.rodada || 1; SEQ.vistas = salvo.vistas || []; SEQ.novaRodada = false;
    // trilha concluída num acesso anterior: este acesso começa uma rodada nova, com outras questões do banco
    if (SEQ.passos.every(p => SEQ.feitos[p.tipo === "simulado" ? "simulado" : p.h.cod])) { SEQ.rodada++; SEQ.feitos = {}; SEQ.estado = {}; salvo.i = 0; SEQ.novaRodada = true; }
    SEQ.cotas = cotasTemas(SEQ.passos);
    const box = $("#aba-seq"); box.innerHTML = `<div id="seqCab"></div><div id="seqLista"></div>`;
    const info0 = $("#info"); info0.innerHTML = "";
    $("#seqLista").innerHTML = SEQ.passos.map((p, k) => {
      const simu = p.tipo === "simulado", nome = simu ? "🏁 Simulado SARESP" : p.h.tema, foco = !simu && FOCO.temas.has(p.h.cod);
      return `<section class="bloco" data-k="${k}"><div class="bloco-cab"><h2>${nome}</h2><small>${simu ? `${N_QUESTOES} questões do ${anoAtual()}º ano, no formato da prova` : (SEQ.cotas[p.h.cod] || N_QUESTOES) + " questões · " + p.h.sigla + " · " + (p.h.rec ? "♻️ recuperação" : "🎯 SARESP")}</small>${foco ? `<span class="tag-foco">🎯 Tema de reforço para você</span>` : ""}</div>
        <div class="bloco-sim"><div class="bloco-espera">🧊 O simulador deste tema aparece aqui quando você chega nele.</div></div>
        ${!simu && p.h.r.ext ? `<a class="btn" style="width:100%;justify-content:center;margin:6px 0" href="${D.externos[p.h.r.ext].url}" target="_blank" rel="noopener">↗ Abrir também o ${D.externos[p.h.r.ext].nome}</a>` : ""}
        <div class="bloco-q"></div></section>`;
    }).join("");
    SEQ.passos.forEach((p, k) => blocoQuiz(k));
    seqCabecalho();
    const raizScroll = innerWidth <= 860 ? $("#painel") : $("#painel");
    const obs = new IntersectionObserver(ents => {
      ents.forEach(e => { if (e.isIntersecting) ativarBloco(+e.target.dataset.k); });
    }, { root: raizScroll, rootMargin: "-15% 0px -70% 0px" });
    $$("#seqLista .bloco").forEach(b => obs.observe(b));
    trocarAba("seq", true);
    let ir = typeof salvo.i === "number" ? salvo.i : 0;
    if (irPara) { const k = SEQ.passos.findIndex(p => p.h && p.h.cod === irPara); if (k >= 0) ir = k; }
    ir = Math.min(ir, SEQ.passos.length - 1); ativarBloco(ir);
    const voltou = !irPara && Object.values(SEQ.estado).some(e => e && e.r && Object.keys(e.r).length);
    if (voltou) setTimeout(() => {   // de volta: vai direto à primeira questão que ainda falta neste tema
      const b = $(`#seqLista .bloco[data-k="${ir}"]`), q = b && b.querySelector(".seq-q:not(.respondida)");
      if (q) q.scrollIntoView({ behavior: "smooth", block: "center" }); else irPasso(ir);
      const p = SEQ.passos[ir], nq = q ? +q.dataset.num : 0;
      avisar(`👋 Bem-vindo(a) de volta! Continuando de onde você parou: ${p.tipo === "simulado" ? "Simulado SARESP" : p.h.tema}${nq ? ", questão " + nq : ""}.`);
    }, 600);
    else if (ir > 0) setTimeout(() => irPasso(ir), 300);
    if (SEQ.novaRodada) setTimeout(() => avisar(`🔄 Rodada ${SEQ.rodada}: você já completou a Missão, então agora as questões são outras, tiradas do banco da turma.`), 700);
  }
  function seqCabecalho() {
    const N = SEQ.passos.length, feitos = SEQ.passos.filter(p => SEQ.feitos[p.tipo === "simulado" ? "simulado" : p.h.cod]).length;
    const c = $("#seqCab"); if (!c) return;
    c.innerHTML = `<div class="seq-cab"><b>🚀 Missão ${ALUNO.dados ? ALUNO.dados.turma : (TURMA_LINK || anoAtual() + "º ano")}</b><small>${SEQ.rodada > 1 ? `Rodada ${SEQ.rodada} · ` : ""}${N_TRILHA} questões nos temas + Simulado · ${feitos} de ${N} etapas concluídas · role para baixo para seguir</small><small class="seq-salvo" id="seqSalvo">💾 Progresso salvo automaticamente: se sair, você continua daqui depois</small><div class="seq-barra"><span style="width:${Math.round(feitos / N * 100)}%"></span></div></div>`;
  }
  // leva o simulador (ou o modelo 3D) para o tema que está na tela
  function ativarBloco(k) {
    if (k === SEQ.ativoK || !SEQ.passos[k]) return;
    SEQ.ativoK = k; SEQ.i = k; SEQ.cena3d = null; seqSalvar(); limparCtlSimu();
    { const info0 = $("#info"), casa = $("#aba-explorar"); if (info0 && casa && info0.parentElement !== casa) casa.appendChild(info0); }
    $$("#seqLista .bloco").forEach(b => b.classList.toggle("ativo", +b.dataset.k === k));
    $$("#seqLista .bloco-sim").forEach((d, kk) => { if (kk !== k && !d.querySelector(".bloco-espera")) d.innerHTML = `<div class="bloco-espera">🧊 O simulador deste tema aparece aqui quando você volta para ele.</div>`; });
    const p = SEQ.passos[k], slot = $(`#seqLista .bloco[data-k="${k}"] .bloco-sim`); slot.innerHTML = "";
    const info0 = $("#info");
    if (p.tipo === "simulado") { slot.innerHTML = `<p class="mini-txt muted">Você chegou ao fim da trilha! Faça o Simulado final abaixo${[...FOCO.temas].some(c => c[0] === anoAtual()) ? ", com mais questões dos seus temas de reforço 🎯" : ""}. <b>🧊 O simulador muda a cada questão</b>, mostrando o tema dela.</p>`;
      SEQ.simu3d = null; const pend = document.querySelector(`#seqLista .bloco[data-k="${k}"] .seq-q:not(.respondida)`); simuladoMostrar(k, pend ? +pend.dataset.n : 0); trocarAba("seq", true); return; }
    const r = p.h.r;
    $$("#seqLista #cartaoSim").forEach(c => c.remove());
    if (r.sim) abrirSim(r.sim); else carregarModelo(r.modelo || "sistema", true);
    slot.innerHTML = `<p class="mini-txt muted">🧊 <b>O simulador muda a cada questão</b>: role ou toque em uma questão para ver a estrutura de que ela fala.${r.sim ? " Os controles do simulador aparecem dentro da questão." : ""}</p>`;
    setTimeout(() => { if (SEQ.ativoK !== k) return; const bx = $(`#seqLista .bloco[data-k="${k}"] .bloco-q`), n = bx && questaoNoMeio(bx); if (n != null) mostrarCena(k, n); }, 60);
    popTema(p.h.cod);
    trocarAba("seq", true);
  }
  /* ---- Temas: um 3D diferente para cada questão ----
     Procura, nos modelos do ano, a estrutura de que a questão fala (nome no enunciado, na resposta certa ou na explicação);
     sem correspondência, usa o simulador do tema ou outra estrutura do modelo do tema. Estruturas já usadas (no tema e
     nos outros temas da turma) não se repetem enquanto houver outra opção. */
  const normTx = t => " " + (t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim() + " ";
  const PAL_VAGAS = new Set(["sistema", "camada", "camadas", "celula", "celulas", "energia", "estrutura", "animal", "animais", "planeta", "planetas", "artropodes", "grupo", "forma", "corpo", "parte", "partes", "tempo", "terra", "luz", "vida", "linha", "linhas"]);
  const PARADA = new Set("como para pela pelo pelas pelos entre quando qual quais esta este essa esse isso sobre mais menos muito muita tambem porque sendo seres outro outra outros outras partes parte corpo forma formas tipo tipos todos todas cada onde seus suas dele dela pode podem fazer faz meio maior menor principal principalmente exemplo chamado chamada chamados estrutura estruturas modelo simulador questao aluno alunos ocorre acontece".split(" "));
  // singular simples do português (fósseis→fóssil, órgãos→órgão, animais→animal, flores→flor) e raiz de até 6 letras
  const singular = w => /eis$/.test(w) ? w.slice(0, -3) + "il" : /[oa]es$/.test(w) ? w.slice(0, -3) + "ao" : /ais$|ois$|uis$/.test(w) ? w.slice(0, -2) + "l" : /(r|z|s)es$/.test(w) ? w.slice(0, -2) : /s$/.test(w) && !/ss$/.test(w) ? w.slice(0, -1) : w;
  const raizes = t => { const out = new Set(); normTx(t).trim().split(" ").forEach(w0 => { if (w0.length < 4 || PARADA.has(w0)) return; const w = singular(w0); if (w.length < 4 || PARADA.has(w)) return; out.add(w.slice(0, 6)); }); return out; };
  let CHAVES3D = null;
  function chaves3d() {
    if (CHAVES3D) return CHAVES3D;
    CHAVES3D = Object.keys(D.fichas).filter(k => MODELOS[D.fichas[k].modelo]).map(k => { const f = D.fichas[k];
      return { k, m: f.modelo, hab: f.hab || [], nome: raizes(f.nome.replace(/·/g, " ")), resto: raizes([f.funcao, f.desc, (f.carac || []).join(" ")].join(" ")) }; });
    return CHAVES3D;
  }
  // pontua o quanto a questão fala da estrutura: palavra do nome vale 3 (palavras comuns a quase todas as estruturas do tema valem pouco),
  // palavra da ficha vale 1
  function pontoCena(c, q, comum) { let s = 0, nome = 0; q.forEach(w => { if (c.nome.has(w)) { if (comum.has(w)) s += .5; else { s += 3; nome++; } } else if (c.resto.has(w)) s += 1; }); return nome ? s : (s >= 5 ? s * .6 : 0); }
  function cenasDoTema(h, lista, usados) {
    const proprio = h.r.modelo, ch = chaves3d().filter(c => c.hab.includes(h.cod) || c.m === proprio), local = new Set();
    const df = {}; ch.forEach(c => c.nome.forEach(w => df[w] = (df[w] || 0) + 1));
    const comum = new Set(Object.keys(df).filter(w => ch.length >= 3 && df[w] / ch.length >= .4));
    const vistas = proprio && MODELOS[proprio] ? (MODELOS[proprio].vistas || []).map((v, i) => i) : [];
    let simUsado = false, iv = 0;
    return lista.map(it => {
      const q = raizes(it.p + " " + (it.o[it.c] || "") + " " + (it.e || ""));
      const cand = ch.map(c => ({ c, s: pontoCena(c, q, comum) + (c.m === proprio ? .5 : 0) })).filter(x => x.s >= 3).sort((a, b) => b.s - a.s);
      if (cand.length) {
        // outra estrutura só se ela também for uma boa resposta; senão repete a certa (nunca mostra uma que não tem a ver)
        const best = cand[0], livre = cand.find(x => !local.has(x.c.k) && !usados.has(x.c.k) && x.s >= best.s * .75);
        if (!livre && local.has(best.c.k) && h.r.sim && !simUsado) { simUsado = true; return { sim: h.r.sim }; }   // a certa já apareceu: usa o simulador do tema
        const esc = livre || best; local.add(esc.c.k); usados.add(esc.c.k); return { modelo: esc.c.m, parte: esc.c.k };
      }
      // sem estrutura certa para a questão: simulador do tema ou uma vista do modelo do tema
      if (h.r.sim && (!simUsado || !proprio)) { const c = { sim: h.r.sim }; if (simUsado) c.vista = iv++; simUsado = true; return c; }
      return { modelo: proprio || "sistema", vista: vistas.length ? vistas[iv++ % vistas.length] : 0 };
    });
  }
  function nomeCena(c) {
    if (c.parte) { const f = D.fichas[c.parte], m = D.modelos.find(x => x.id === c.modelo); return `${f.nome}${m ? ` <span class="muted">(${m.nome})</span>` : ""}`; }
    if (c.sim) { const s = SIMULACOES.lista.find(x => x.id === c.sim); return s ? s.titulo : c.sim; }
    const m = D.modelos.find(x => x.id === c.modelo); return m ? m.nome : c.modelo;
  }
  // a questão mais próxima da linha de leitura (35% da altura do painel) é a que manda no 3D
  function questaoNoMeio(box) {
    const pr = $("#painel").getBoundingClientRect(), y = pr.top + pr.height * .35; let best = null, bd = 1e9;
    box.querySelectorAll(".seq-q").forEach(c => { const r = c.getBoundingClientRect(); if (r.bottom < pr.top || r.top > pr.bottom) return; const d = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0; if (d < bd) { bd = d; best = +c.dataset.n; } });
    return best;
  }
  function mostrarCena(k, n) {
    const st = SEQ.blocos[k], c = st && st.cenas && st.cenas[n], card = $(`#seqLista .bloco[data-k="${k}"] .seq-q[data-n="${n}"]`);
    if (!c || !card || SEQ.ativoK !== k) return;
    const chave = k + "|" + n; if (SEQ.cena3d === chave) return; SEQ.cena3d = chave;
    $$("#seqLista .seq-q.q-ativa").forEach(x => x.classList.remove("q-ativa")); card.classList.add("q-ativa");
    $$("#seqLista .q-ctl").forEach(d => d.hidden = true);
    if (c.sim) {
      let cs = document.querySelector("#seqLista #cartaoSim");
      if (!(est.modo === "sim" && est.simId === c.sim && cs)) { $$("#seqLista #cartaoSim").forEach(x => x.remove()); abrirSim(c.sim); cs = $("#cartaoSim"); }
      const d = card.querySelector(".q-ctl"); if (cs && d) { d.appendChild(cs); d.hidden = false; }

    } else {
      if (!(est.modo === "modelo" && est.modeloId === c.modelo)) carregarModelo(c.modelo, true);
      if (c.parte) selecionar(c.parte, false);   // destaca a estrutura e abre a ficha, sem aproximar a câmera
      else { if (est.selecionado) { limparRealce(est.selecionado); est.selecionado = null; } popModelo(c.modelo); }
    }
    trocarAba("seq", true);
  }
  /* ---- Simulado SARESP: cada questão abre o simulador (ou o modelo 3D) do tema dela ---- */
  function temaDe(ae) { for (const t of D.trilha) for (const h of t.itens) if (h.cod === ae) return h; return null; }
  function limparCtlSimu() { $$("#seqLista .q-ctl").forEach(d => { d.hidden = true; const c = d.querySelector("#cartaoSim"); if (c) c.remove(); }); $$("#seqLista .seq-q.q-ativa").forEach(c => c.classList.remove("q-ativa")); }
  function simuladoMostrar(k, n) {
    const st = SEQ.blocos[k], card = $(`#seqLista .bloco[data-k="${k}"] .seq-q[data-n="${n}"]`); if (!st || !card || SEQ.ativoK !== k) return;
    const h = temaDe(st.lista[n].ae), r = h && h.r; if (!r) return;
    const tipo = r.sim ? "sim:" + r.sim : "mod:" + (r.modelo || "sistema"), chave = tipo + "|" + n;
    if (SEQ.simu3d === chave) return; const mesmo = !!SEQ.simu3d && SEQ.simu3d.split("|")[0] === tipo; SEQ.simu3d = chave;
    const ctlAntigo = document.querySelector("#seqLista .q-ctl #cartaoSim");
    if (ctlAntigo && mesmo) ctlAntigo.remove();
    limparCtlSimu(); card.classList.add("q-ativa");
    if (r.sim) {
      if (!mesmo || !ctlAntigo) abrirSim(r.sim);
      const c = mesmo && ctlAntigo ? ctlAntigo : $("#cartaoSim"), d = card.querySelector(".q-ctl"); if (c && d) { d.appendChild(c); d.hidden = false; }
    } else if (!mesmo) carregarModelo(r.modelo || "sistema", true);
    if (!mesmo) popTema(h.cod) || (r.modelo && popModelo(r.modelo));
    trocarAba("seq", true);
  }
  function irPasso(k) { const b = $(`#seqLista .bloco[data-k="${k}"]`); if (b) b.scrollIntoView({ behavior: "smooth", block: "start" }); }
  // as 10 questões do tema, todas abertas na tela, uma embaixo da outra
  function blocoQuiz(k, refazer) {
    const p = SEQ.passos[k], simu = p.tipo === "simulado", tema = simu ? null : p.h.cod, atividade = simu ? "simulado" : "tema", idp = tema || "simulado";
    const box = $(`#seqLista .bloco[data-k="${k}"] .bloco-q`);
    // retoma as mesmas questões, na mesma ordem, se este tema já foi começado
    let ev = refazer ? null : SEQ.estado[idp], lista = null;
    if (ev && Array.isArray(ev.q)) { const mapa = new Map(D.quiz.map(q => [chaveQ(q), q])); lista = ev.q.map(c => mapa.get(c)); if (lista.some(x => !x)) { lista = null; ev = null; } } else ev = null;
    if (!lista) { lista = simu ? questoesSimulado() : questoesTema(tema); ev = SEQ.estado[idp] = { id: novoId(), q: lista.map(chaveQ), o: lista.map(it => embaralhar(it.o.map((t, i) => i))), r: {} }; seqSalvar(); }
    // trilha numerada de 1 a 25, seguindo de um tema para o outro
    const tamBloco = j => { const pj = SEQ.passos[j], id = pj.tipo === "simulado" ? "simulado" : pj.h.cod, e = SEQ.estado[id];
      return pj.tipo === "simulado" ? 0 : (SEQ.blocos[j] && SEQ.blocos[j].lista ? SEQ.blocos[j].lista.length : e && e.q ? e.q.length : (SEQ.cotas[pj.h.cod] || N_QUESTOES)); };
    let numIni = 1; for (let j = 0; j < k; j++) numIni += tamBloco(j);
    let numTot = 0; SEQ.passos.forEach((pj, j) => numTot += j === k ? lista.length : tamBloco(j));
    let cenas = null;
    if (!simu) { const ant = SEQ.blocos[k] && SEQ.blocos[k].cenas; if (ant) ant.forEach(c => c.parte && SEQ.usados3d.delete(c.parte)); cenas = cenasDoTema(p.h, lista, SEQ.usados3d || (SEQ.usados3d = new Set())); }
    const st = { lista, pontos: 0, feitas: 0, id: ev.id, resp: [], cenas }; SEQ.blocos[k] = st;
    const enviar = fim => registrar({ id: st.id, atividade, tema, acertos: st.pontos, total: lista.length, concluido: fim, respostas: st.resp });
    box.innerHTML = lista.map((it, n) => { const ordem = (ev.o[n] && ev.o[n].length === it.o.length ? ev.o[n] : it.o.map((t, i) => i)).map(i => ({ t: it.o[i], i }));
      return `<div class="cartao seq-q" data-n="${n}" data-num="${simu ? n + 1 : numIni + n}"><div class="hab-top"><b>${simu ? `📝 Simulado · questão ${n + 1} de ${lista.length}` : `📝 Questão ${numIni + n} de ${numTot}`}</b>${simu ? `<span class="mini-txt muted">${rotuloAE(it.ae)}</span>` : ""}</div>
        ${simu ? (() => { const th = temaDe(it.ae); return th ? `<div class="q-3d">🧊 No simulador: <b>${th.tema}</b></div>` : ""; })() : `<div class="q-3d">🧊 No simulador: <b>${nomeCena(cenas[n])}</b></div>`}
        <p class="pergunta">${it.p}</p><div class="opcoes">${ordem.map((o, j) => `<button class="opcao" data-i="${o.i}"><b>${"ABCD"[j]})</b> ${o.t}</button>`).join("")}</div><div class="feed"></div><details class="q-ctl" hidden><summary>🎛️ Controles do simulador</summary></details></div>`; }).join("") + `<div class="bloco-fim"></div>`;
    // marca a questão como respondida (na hora ou ao restaurar o que já estava salvo)
    const marcar = (card, it, b, ok, restaurando) => {
      card.classList.add("respondida");
      card.querySelectorAll(".opcao").forEach(x => { x.disabled = true; if (+x.dataset.i === it.c) x.classList.add("certa"); else if (x === b) x.classList.add("errada"); });
      card.querySelector(".feed").innerHTML = `<div class="destaque ${ok ? "saude" : "erro"}"><b>${ok ? (restaurando ? "Correto!" : "Correto! +10 XP") : "Não foi dessa vez."}</b> ${it.e}</div>`;
    };
    box.querySelectorAll(".seq-q").forEach(card => {
      const n = +card.dataset.n, it = lista[n];
      card.querySelectorAll(".opcao").forEach(b => b.onclick = () => {
        if (card.classList.contains("respondida")) return;
        const ok = +b.dataset.i === it.c; if (ok) { st.pontos++; XP.ganhar(10); }
        { const kq = chaveQ(it), ix = FOCO.erros.indexOf(kq); if (!ok && ix < 0) FOCO.erros.push(kq); if (ok && ix >= 0) FOCO.erros.splice(ix, 1); }
        st.feitas++; st.resp.push({ ae: it.ae, ok, p: it.p.slice(0, 90), r: it.o[+b.dataset.i].slice(0, 60) });
        ev.r[n] = +b.dataset.i; { const kq = chaveQ(it), ix = SEQ.vistas.indexOf(kq); if (ix >= 0) SEQ.vistas.splice(ix, 1); SEQ.vistas.push(kq); } seqSalvar(); enviar(st.feitas >= lista.length);
        marcar(card, it, b, ok);
        if (st.feitas >= lista.length) fimBloco(k);
      });
      // resposta já dada antes de sair: volta marcada, sem contar XP de novo nem reenviar
      if (ev.r[n] != null) { const i = +ev.r[n], b = card.querySelector(`.opcao[data-i="${i}"]`), ok = i === it.c;
        if (ok) st.pontos++; st.feitas++; st.resp.push({ ae: it.ae, ok, p: it.p.slice(0, 90), r: (it.o[i] || "").slice(0, 60) }); marcar(card, it, b, ok, true); }
    });
    if (st.feitas >= lista.length) fimBloco(k, true);
    if (!simu) { // cada questão do tema: troca o 3D quando ela chega ao meio da tela (ou quando o aluno toca nela)
      if (SEQ.obsQ[k]) SEQ.obsQ[k].disconnect();
      SEQ.obsQ[k] = new IntersectionObserver(ents => { if (ents.some(e => e.isIntersecting)) { const n = questaoNoMeio(box); if (n != null) mostrarCena(k, n); } }, { root: $("#painel"), rootMargin: "-30% 0px -60% 0px" });
      box.querySelectorAll(".seq-q").forEach(c => { SEQ.obsQ[k].observe(c); c.addEventListener("click", ev => { if (!ev.target.closest(".q-ctl")) setTimeout(() => mostrarCena(k, +c.dataset.n), 0); }); });
    }
    if (simu) { // troca o 3D quando a questão chega ao meio da tela (ou quando o aluno toca nela)
      if (SEQ.obsSimu) SEQ.obsSimu.disconnect();
      SEQ.obsSimu = new IntersectionObserver(ents => { if (ents.some(e => e.isIntersecting)) { const n = questaoNoMeio(box); if (n != null) simuladoMostrar(k, n); } }, { root: $("#painel"), rootMargin: "-30% 0px -60% 0px" });
      box.querySelectorAll(".seq-q").forEach(c => { SEQ.obsSimu.observe(c); c.addEventListener("click", ev => { if (!ev.target.closest(".q-ctl")) setTimeout(() => simuladoMostrar(k, +c.dataset.n), 0); }); });
    }
  }
  function fimBloco(k, restaurando) {
    const p = SEQ.passos[k], st = SEQ.blocos[k], simu = p.tipo === "simulado", tema = simu ? null : p.h.cod, N = st.lista.length;
    const pc = Math.round(st.pontos / N * 100), fx = faixa(pc), idp = tema || "simulado";
    if (tema && pc < 70) FOCO.temas.add(tema);
    if (!tema) st.resp.forEach(r => { if (!r.ok && r.ae) FOCO.temas.add(r.ae); });
    SEQ.feitos[idp] = true; seqSalvar(); seqCabecalho();
    const ult = k >= SEQ.passos.length - 1, fim = $(`#seqLista .bloco[data-k="${k}"] .bloco-fim`);
    fim.innerHTML = `<div class="cartao seq-q centro"><h3>${pc >= 70 ? "🏆" : "📘"} ${st.pontos} de ${N} · <span style="color:${fx[1]}">${fx[0]}</span></h3>
      <p class="envio">${restaurando ? "✅ Atividade concluída e salva." : ALUNO.dados ? "⏳ Enviando para o professor…" : "⚠️ Entre com seu nome (👤) para o professor ver seu resultado."}</p>
      ${pc < 70 && tema ? `<p class="mini-txt">🎯 Este tema ficou como <b>reforço</b> para você. Use o simulador mais um pouco e tente de novo: as questões que você errou aparecem primeiro.</p><button class="btn" data-denovo>↺ Responder de novo</button>` : ""}
      ${ult ? `<p><b>🎉 Missão completa!</b> Veja seu desempenho em <b>📊 Meu relatório</b>.</p><p class="mini-txt">🔄 Na próxima vez que você entrar, a Missão começa uma <b>nova rodada com outras questões</b> do banco.</p><button class="btn" data-rodada>🔄 Começar nova rodada agora</button>` : `<p class="mini-txt muted">⬇️ Role para baixo para o próximo tema.</p>`}</div>`;
    if (ALUNO.dados && !restaurando) ALUNO.fila.then(ok => { const e = fim.querySelector(".envio"); if (e) e.textContent = ok ? "✅ Resultado enviado para o professor." : "⚠️ Não foi possível enviar agora."; });
    const nr = fim.querySelector("[data-rodada]"); if (nr) nr.onclick = () => { seqSalvar(); iniciarSeq(); $("#painel").scrollTop = 0; };
    const dn = fim.querySelector("[data-denovo]"); if (dn) dn.onclick = () => { blocoQuiz(k, true); $(`#seqLista .bloco[data-k="${k}"] .bloco-q`).scrollIntoView({ behavior: "smooth", block: "start" }); };
    if (pc >= 75 && !restaurando) XP.ganhar(20, "Bônus: faixa Avançado");
  }
  function montarSeqLateral() { seqCabecalho(); }
  function seqQuiz(lista, atividade, tema) {
    const box = $("#seqQuiz"); if (!lista.length) { box.innerHTML = ""; return; }
    const st = SEQ.q = { lista, i: 0, pontos: 0, id: novoId(), resp: [], atividade, tema };
    const enviar = fim => registrar({ id: st.id, atividade, tema, acertos: st.pontos, total: lista.length, concluido: fim, respostas: st.resp });
    function q() {
      if (SEQ.q !== st) return;
      if (st.i >= lista.length) {
        const pc = Math.round(st.pontos / lista.length * 100), fx = faixa(pc), idp = tema || "simulado";
        if (tema && pc < 70) FOCO.temas.add(tema);
        if (!tema) st.resp.forEach(r => { if (!r.ok && r.ae) FOCO.temas.add(r.ae); });
        SEQ.feitos[idp] = true; seqSalvar(); montarSeqLateral();
        const ult = SEQ.i >= SEQ.passos.length - 1;
        box.innerHTML = `<div class="cartao seq-q centro"><h3>${pc >= 70 ? "🏆" : "📘"} ${st.pontos} de ${lista.length} · <span style="color:${fx[1]}">${fx[0]}</span></h3>
          <p class="envio" id="sqEnvio">${ALUNO.dados ? "⏳ Enviando para o professor…" : "⚠️ Entre com seu nome (👤) para o professor ver seu resultado."}</p>
          ${pc < 70 && tema ? `<p class="mini-txt">🎯 Este tema ficou como <b>reforço</b> para você. Use o simulador mais um pouco e tente de novo: as questões que você errou aparecem primeiro.</p><button class="btn" id="sqDeNovo">↺ Responder de novo</button>` : ""}
          ${ult ? `<p><b>🎉 Missão completa!</b> Veja seu desempenho em <b>📊 Meu relatório</b>.</p>` : ""}</div>`;
        if (ALUNO.dados) ALUNO.fila.then(ok => { const e = $("#sqEnvio"); if (e) e.textContent = ok ? "✅ Resultado enviado para o professor." : "⚠️ Não foi possível enviar agora."; });
        if ($("#sqDeNovo")) $("#sqDeNovo").onclick = () => seqQuiz(tema ? questoesTema(tema) : embaralhar(lista), atividade, tema);
        const bp = $("#seqProx"); if (bp) { bp.classList.add("prim"); bp.textContent = "Próximo tema ▶"; }
        if (pc >= 75) XP.ganhar(20, "Bônus: faixa Avançado");
        return;
      }
      const it = lista[st.i], ordem = embaralhar(it.o.map((t, i) => ({ t, i })));
      box.innerHTML = `<div class="cartao seq-q"><div class="hab-top"><b>📝 Questão ${st.i + 1} de ${lista.length}</b><span class="mini-txt muted">${atividade === "simulado" ? rotuloAE(it.ae) : "Responda depois de usar o simulador"}</span></div>
        <p class="pergunta">${it.p}</p><div class="opcoes">${ordem.map((o, k) => `<button class="opcao" data-i="${o.i}"><b>${"ABCD"[k]})</b> ${o.t}</button>`).join("")}</div><div id="sqFeed"></div></div>`;
      box.querySelectorAll(".opcao").forEach(b => b.onclick = () => {
        const ok = +b.dataset.i === it.c; if (ok) { st.pontos++; XP.ganhar(10); }
        { const kq = chaveQ(it), ix = FOCO.erros.indexOf(kq); if (!ok && ix < 0) FOCO.erros.push(kq); if (ok && ix >= 0) FOCO.erros.splice(ix, 1); }
        st.resp.push({ ae: it.ae, ok, p: it.p.slice(0, 90), r: it.o[+b.dataset.i].slice(0, 60) }); enviar(st.i + 1 >= lista.length);
        box.querySelectorAll(".opcao").forEach(x => { x.disabled = true; if (+x.dataset.i === it.c) x.classList.add("certa"); else if (x === b) x.classList.add("errada"); });
        $("#sqFeed").innerHTML = `<div class="destaque ${ok ? "saude" : "erro"}"><b>${ok ? "Correto! +10 XP" : "Não foi dessa vez."}</b> ${it.e}</div><button class="btn prim" id="sqProx">${st.i + 1 < lista.length ? "Próxima questão" : "Ver resultado"}</button>`;
        $("#sqProx").onclick = () => { st.i++; q(); };
      });
    }
    q();
  }

  /* ------------------------------ INÍCIO ------------------------------ */
  montarSimular(); montarHabilidades(); montarQuiz(); montarDesafio(); montarSaiba();
  redimensionar();
  carregarModelo("sistema", true); XP.mostrar(); aplicarTurma();
  { let exp = false; try { exp = !!sessionStorage.getItem("ms3d_explorar"); } catch (e) { } if (!ALUNO.dados && (!exp || TURMA_LINK)) abrirEntrada(); else if (seqDeveAtivar()) iniciarSeq(TEMA_LINK); else abrirTemaLink(); }
  mostrarBoasVindas();
  carga.style.setProperty("--p", 1);
  laco();
  setTimeout(() => carga.classList.add("some"), 400);
  { const aba = new URLSearchParams(location.search).get("aba"); if (["simular", "quiz", "desafio", "habilidades", "saiba"].includes(aba)) trocarAba(aba); else if (new URLSearchParams(location.search).get("ano")) trocarAba("habilidades"); }
  setTimeout(() => $(".ajuda-gestos").classList.add("some"), 9000);
  window.APP = { est, carregarModelo, abrirSim, selecionar, trocarAba, cam, ctl, cena, SEQ, FOCO };
})();
