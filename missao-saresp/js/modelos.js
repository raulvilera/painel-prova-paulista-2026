/* =========================================================================
   MISSÃO SARESP 3D — Modelos 3D procedurais (three.js)
   Todos os modelos são construídos por código, sem arquivos externos.
   Cada modelo devolve: raiz (Group), partes {id: [meshes]}, ancoras {id: Vector3}
   e, opcionalmente, atualizar(dt, t).
   ========================================================================= */
(function () {
  const T = THREE;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  if (T.ColorManagement) T.ColorManagement.legacyMode = false; // cores hexadecimais tratadas como sRGB

  /* ---------- utilitários ---------- */
  function mat(cor, o) {
    o = o || {};
    const vidro = (o.op ?? 1) < 1;
    const m = new (vidro ? T.MeshPhysicalMaterial : T.MeshStandardMaterial)({
      color: cor, roughness: o.rough ?? (vidro ? 0.3 : 0.5), metalness: o.metal ?? 0.04,
      transparent: (o.op ?? 1) < 1, opacity: o.op ?? 1, side: o.side || T.FrontSide,
      emissive: o.emis || 0x000000, emissiveIntensity: o.ei ?? 1, flatShading: !!o.flat,
      depthWrite: o.dw ?? ((o.op ?? 1) >= 0.6)
    });
    if (vidro) { m.clearcoat = 0.7; m.clearcoatRoughness = 0.25; m.sheen = 0.3; m.sheenColor = new T.Color(0xffffff); }
    m.userData.baseOp = o.op ?? 1;
    return m;
  }
  function malha(geo, m, pos, rot, esc) {
    const me = new T.Mesh(geo, m);
    if (pos) me.position.copy(pos);
    if (rot) me.rotation.set(rot[0], rot[1], rot[2]);
    if (esc) { if (typeof esc === "number") me.scale.setScalar(esc); else me.scale.set(esc[0], esc[1], esc[2]); }
    return me;
  }
  // gerador pseudoaleatório com semente (modelos iguais a cada carregamento)
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  // pontos bem distribuídos sobre uma esfera
  function fibonacci(n) {
    const pts = [], g = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = g * i; pts.push(V(Math.cos(th) * r, y, Math.sin(th) * r)); }
    return pts;
  }
  function orientar(obj, normal) { obj.quaternion.setFromUnitVectors(V(0, 1, 0), normal.clone().normalize()); }
  function ruido(p, k) { return Math.sin(p.x * k + 1.3) * Math.sin(p.y * k * 1.1 + 0.7) * Math.sin(p.z * k * 0.9 + 2.1); }
  function deformar(geo, amp, k) {
    const pos = geo.attributes.position, v = new T.Vector3();
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); const n = v.clone().normalize(); v.addScaledVector(n, ruido(v, k) * amp); pos.setXYZ(i, v.x, v.y, v.z); }
    geo.computeVertexNormals(); return geo;
  }
  function tubo(pontos, raio, m, fechado, seg) {
    const c = new T.CatmullRomCurve3(pontos, !!fechado);
    return new T.Mesh(new T.TubeGeometry(c, seg || pontos.length * 8, raio, 8, !!fechado), m);
  }
  // fio enovelado (material genético) dentro de uma esfera de raio r
  function novelo(r, n, seed, raio, m, fechado) {
    const R = rng(seed), pts = []; let p = V(0, 0, 0);
    for (let i = 0; i < n; i++) {
      p = p.clone().add(V(R() - .5, R() - .5, R() - .5).multiplyScalar(r * 0.9));
      if (p.length() > r) p.setLength(r * (0.55 + R() * 0.3));
      pts.push(p);
    }
    return tubo(pts, raio, m, fechado, n * 10);
  }
  function hélice(raio, passo, voltas, raioTubo, m, eixo) {
    const pts = [];
    for (let i = 0; i <= voltas * 24; i++) { const a = i / 24 * Math.PI * 2; pts.push(V(Math.cos(a) * raio, i / 24 * passo, Math.sin(a) * raio)); }
    const me = tubo(pts, raioTubo, m, false, voltas * 40);
    return me;
  }
  function vírusMini(r, cor) { // vírus pequeno com espículas (usado em vários modelos e simulações)
    const g = new T.Group();
    const corpo = malha(deformar(new T.IcosahedronGeometry(r, 6), r * .03, 4 / r), mat(cor, { rough: .35 }));
    g.add(corpo);
    const me = mat(0xfb923c, { rough: .35 });
    const geoE = new T.CylinderGeometry(r * .06, r * .09, r * .45, 12), geoC = new T.SphereGeometry(r * .16, 20, 14);
    fibonacci(42).forEach(n => { const h = malha(geoE, me); h.position.copy(n.clone().multiplyScalar(r * 1.15)); orientar(h, n); g.add(h);
      const c = malha(geoC, me); c.position.copy(n.clone().multiplyScalar(r * 1.42)); g.add(c); });
    return g;
  }
  function anticorpoGeo(esc, m) { // forma em Y
    const g = new T.Group();
    const cap = (r, l) => new T.CapsuleGeometry(r, l, 4, 10);
    const tronco = malha(cap(.32 * esc, 2 * esc), m); tronco.position.y = -1.3 * esc; g.add(tronco);
    [-1, 1].forEach(s => {
      const b = malha(cap(.3 * esc, 2 * esc), m); b.position.set(s * .95 * esc, 0.75 * esc, 0); b.rotation.z = -s * 0.75; g.add(b);
      const l = malha(cap(.2 * esc, 1.4 * esc), m); l.position.set(s * 1.55 * esc, 0.45 * esc, .25 * esc); l.rotation.z = -s * 0.75; g.add(l);
    });
    return g;
  }
  function celulaBola(r, cor, corNuc, nucR, nucPos, op) {
    const g = new T.Group();
    const geo = deformar(new T.IcosahedronGeometry(r, 4), r * .04, 1.6 / r);
    g.add(malha(geo, mat(cor, { op: op ?? .55, rough: .35, side: T.DoubleSide })));
    const n = malha(deformar(new T.IcosahedronGeometry(nucR, 3), nucR * .05, 2 / nucR), mat(corNuc, { rough: .6 }));
    if (nucPos) n.position.copy(nucPos); g.add(n);
    return g;
  }

  /* ---------- registro das partes ---------- */
  function novoModelo() {
    const raiz = new T.Group(), partes = {}, ancoras = {};
    function parte(id, obj, ancora) {
      if (!obj.parent) raiz.add(obj);
      obj.traverse(o => { if (o.isMesh) { o.userData.parte = id; (partes[id] = partes[id] || []).push(o); } });
      if (ancora) ancoras[id] = ancora;
      return obj;
    }
    return { raiz, partes, ancoras, parte };
  }


  /* ---------- alta qualidade: astros com textura, brilhos e organelas detalhadas ---------- */
  const TX = window.TEX;
  function matT(o) { const m = new T.MeshStandardMaterial(Object.assign({ roughness: .7, metalness: 0 }, o)); m.userData.baseOp = o.opacity ?? 1; return m; }
  function esferaTex(r, tex, o) { o = o || {}; return new T.Mesh(new T.SphereGeometry(r, o.seg || 96, (o.seg || 96) * .66 | 0), matT(Object.assign({ map: tex.map, bumpMap: tex.bumpMap || null, bumpScale: o.bump ?? .03, roughnessMap: tex.roughnessMap || null, roughness: o.rough ?? (tex.roughnessMap ? 1 : .85) }, o.mat || {}))); }
  function terraHD(r) { const t = TX.terra(); const me = esferaTex(r, t, { bump: r * .025, rough: 1 }); me.material.metalness = .02; return me; }
  // nuvens + brilho azul da atmosfera (chamar depois de registrar a parte)
  function enfeitarTerra(me, r, forca) {
    const nv = new T.Mesh(new T.SphereGeometry(r * 1.012, 96, 64), new T.MeshStandardMaterial({ map: TX.nuvens(), transparent: true, depthWrite: false, roughness: 1 }));
    nv.userData.semCaixa = true; nv.userData.nuvens = true; nv.raycast = () => { }; me.add(nv);
    const at = new T.Mesh(new T.SphereGeometry(r * 1.06, 64, 48), TX.materialAtmosfera(0x60a5fa, forca ?? 1.1)); at.userData.semCaixa = true; at.raycast = () => { }; me.add(at);
    return nv;
  }
  function luaHD(r) { return esferaTex(r, TX.lua(), { bump: r * .04, rough: .95, seg: 64 }); }
  function solHD(r) {
    const tx = TX.sol();
    const me = new T.Mesh(new T.SphereGeometry(r, 72, 48), matT({ map: tx, emissiveMap: tx, emissive: 0xffffff, emissiveIntensity: 1.25, color: 0x000000, roughness: 1 }));
    return me;
  }
  function enfeitarSol(me, r, k) {
    k = k ?? 1;
    [[0xfde68a, 3.2, .95], [0xf59e0b, 5.6, .5]].forEach(([cor, esc, op]) => { const sp = new T.Sprite(new T.SpriteMaterial({ map: TX.brilho(cor), color: 0xffffff, transparent: true, opacity: op, depthWrite: false, blending: T.AdditiveBlending })); sp.scale.setScalar(r * esc * k); sp.userData.semCaixa = true; sp.raycast = () => { }; me.add(sp); });
  }
  function brilhoSprite(cor, tam, op) { const sp = new T.Sprite(new T.SpriteMaterial({ map: TX.brilho(cor), transparent: true, opacity: op ?? .9, depthWrite: false, blending: T.AdditiveBlending })); sp.scale.setScalar(tam); sp.userData.semCaixa = true; sp.raycast = () => { }; return sp; }
  function planetaHD(nome, r) { return esferaTex(r, TX.planeta(nome), { seg: 64, rough: nome === "venus" ? .9 : .8 }); }
  function anelSaturno(rIn, rOut) { const g = TX.uvAnel(new T.RingGeometry(rIn, rOut, 128, 4), rIn, rOut); const m = matT({ map: TX.anel(), transparent: true, opacity: 1, side: T.DoubleSide, roughness: .9, depthWrite: false }); m.userData.baseOp = 1; return new T.Mesh(g, m); }

  function caixaRedonda(w, h, d, r) {
    const sh = new T.Shape(), x = -w / 2 + r, y = -h / 2 + r, W = w - 2 * r, H = h - 2 * r;
    sh.moveTo(x, y - r); sh.lineTo(x + W, y - r); sh.quadraticCurveTo(x + W + r, y - r, x + W + r, y); sh.lineTo(x + W + r, y + H); sh.quadraticCurveTo(x + W + r, y + H + r, x + W, y + H + r);
    sh.lineTo(x, y + H + r); sh.quadraticCurveTo(x - r, y + H + r, x - r, y + H); sh.lineTo(x - r, y); sh.quadraticCurveTo(x - r, y - r, x, y - r);
    const g = new T.ExtrudeGeometry(sh, { depth: Math.max(.01, d - 2 * r), bevelEnabled: true, bevelThickness: r, bevelSize: r * .98, bevelSegments: 10, curveSegments: 18 });
    g.translate(0, 0, -(d - 2 * r) / 2); g.computeVertexNormals(); return g;
  }
  // muitos pontinhos numa só malha (ribossomos etc.)
  function pontos(n, raio, cor, dentro, seed) {
    const im = new T.InstancedMesh(new T.SphereGeometry(raio, 8, 6), mat(cor, { rough: .55 }), n), d = new T.Object3D(), Rr = rng(seed || n * 7 + 3);
    for (let i = 0; i < n; i++) { d.position.copy(dentro(Rr)); d.updateMatrix(); im.setMatrixAt(i, d.matrix); }
    return im;
  }
  function nucleoHD(r, seed) {
    const n = new T.Group(), R = rng(seed || 5);
    n.add(malha(deformar(new T.SphereGeometry(r, 72, 54), r * .04, 2.2 / r), mat(0xa78bfa, { op: .55, side: T.DoubleSide, dw: false })));
    n.add(malha(new T.SphereGeometry(r * .38, 40, 30), mat(0x6d28d9, { rough: .4 }), V(r * .25, r * .15, 0)));
    n.add(novelo(r * .75, 44, (R() * 1e5) | 0, r * .022, mat(0xe879f9, { rough: .45 })));
    n.add(pontos(80, r * .035, 0x312e81, Rr => V(Rr() - .5, Rr() - .5, Rr() - .5).normalize().multiplyScalar(r)));
    return n;
  }
  function mitocondriaHD(esc) {
    const m = new T.Group(); m.scale.setScalar(esc || 1);
    m.add(malha(new T.CapsuleGeometry(.36, 1.0, 14, 28), mat(0xfb923c, { op: .72, dw: false })));
    for (let k = -3; k <= 3; k++) m.add(malha(new T.TorusGeometry(.24, .045, 8, 28, Math.PI * 1.3), mat(0xc2410c, { rough: .45 }), V(0, k * .17, 0), [Math.PI / 2, 0, k % 2 ? 0 : Math.PI]));
    return m;
  }
  function golgiHD(cor) {
    const gg = new T.Group();
    for (let k = 0; k < 6; k++) gg.add(malha(new T.TorusGeometry(1.1 - k * .08, .1, 12, 48, Math.PI * .9), mat(cor || 0xfacc15, { rough: .38 }), V(0, k * .24, 0), null, [1, 1, 1.8]));
    for (let k = 0; k < 6; k++) gg.add(malha(new T.SphereGeometry(.12, 16, 12), mat(cor || 0xfde047, { rough: .35 }), V(1.2 + k * .15, k * .2, (k % 2 - .5) * .4)));
    return gg;
  }
  function cloroplastoHD() {
    const c = new T.Group();
    c.add(malha(new T.SphereGeometry(.62, 40, 30), mat(0x4ade80, { op: .6, dw: false }), null, null, [1.25, .55, .8]));
    for (let k = 0; k < 4; k++) for (let h = 0; h < 4; h++) c.add(malha(new T.CylinderGeometry(.13, .13, .04, 20), mat(0x15803d, { rough: .4 }), V(-.5 + k * .33, -.12 + h * .07, 0)));
    for (let k = 0; k < 3; k++) c.add(malha(new T.CylinderGeometry(.015, .015, .33, 6), mat(0x166534), V(-.335 + k * .33, 0, 0), [0, 0, Math.PI / 2]));
    return c;
  }

  const M = {};

  /* =================== SOL, TERRA E LUA =================== */
  M.sistema = {
    vistas: [["Geral", [0, 10, 26], [0, 0, 0]], ["Terra e Lua", [9, 3, 9], [6, 0, 0]], ["Eixo", [6, 1, 6], [6, 0, 0]]],
    construir() {
      const m = novoModelo(), anc = m.ancoras;
      const sol = solHD(3);
      m.parte("sol", sol, V(0, 3.6, 0)); enfeitarSol(sol, 3);
      const luz = new T.PointLight(0xfff3c4, 2.2, 80, 1.2); m.raiz.add(luz);
      const R = 9;
      const orb = new T.Mesh(new T.TorusGeometry(R, .04, 6, 160), mat(0x22d3ee, { op: .7, emis: 0x0891b2, ei: .6 })); orb.rotation.x = Math.PI / 2;
      m.parte("orbita_terra", orb, V(-R * .7, 0, R * .7));
      const piv = new T.Group(); m.raiz.add(piv);
      const terraG = new T.Group(); terraG.position.set(R, 0, 0); piv.add(terraG);
      const incl = new T.Group(); incl.rotation.z = -23.5 * Math.PI / 180; terraG.add(incl);
      const terra = terraHD(1.1); incl.add(terra); m.parte("terra", terra, null); const nuvS = enfeitarTerra(terra, 1.1);
      const eixo = malha(new T.CylinderGeometry(.05, .05, 3.6, 8), mat(0xf472b6, { emis: 0xdb2777, ei: .6 })); incl.add(eixo); m.parte("eixo_terra", eixo, null);
      const orbL = new T.Mesh(new T.TorusGeometry(2.6, .025, 6, 120), mat(0xa78bfa, { op: .75, emis: 0x7c3aed, ei: .6 })); orbL.rotation.x = Math.PI / 2 + 5 * Math.PI / 180; terraG.add(orbL); m.parte("orbita_lua", orbL, null);
      const lPiv = new T.Group(); lPiv.rotation.x = 5 * Math.PI / 180; terraG.add(lPiv);
      const lua = luaHD(.38); lua.position.set(2.6, 0, 0); lPiv.add(lua); m.parte("lua", lua, null);
      anc.terra = V(); anc.eixo_terra = V(); anc.lua = V(); anc.orbita_lua = V();
      const w = new T.Vector3(), inv = new T.Matrix4();
      function ancorar() {
        m.raiz.updateMatrixWorld(true); inv.copy(m.raiz.matrixWorld).invert();
        terra.getWorldPosition(w); anc.terra.copy(w.applyMatrix4(inv)).add(V(0, -1.4, 0));
        eixo.localToWorld(w.set(0, 1.8, 0)); anc.eixo_terra.copy(w.applyMatrix4(inv));
        lua.getWorldPosition(w); anc.lua.copy(w.applyMatrix4(inv)).add(V(0, .55, 0));
        terraG.localToWorld(w.set(-1.9, 0, 1.9)); anc.orbita_lua.copy(w.applyMatrix4(inv));
      }
      ancorar();
      let ang = .35, angL = 0;
      return Object.assign(m, { atualizar(dt) { ang += dt * .05; angL += dt * .6; piv.rotation.y = ang; terraG.rotation.y = -ang; terra.rotation.y += dt * 1.2; nuvS.rotation.y += dt * .05; lPiv.rotation.y = angL; ancorar(); } });
    }
  };

  /* =================== CAMADAS DA TERRA =================== */
  M.terra = {
    vistas: [["Frente", [0, 3, 34], [0, 0, 0]], ["Por dentro", [12, 5, 20], [0, 0, 0], { corte: true }], ["Atmosfera", [6, 8, 9], [0, 4, 0]]],
    construir() {
      const m = novoModelo();
      const camada = (r, tx, ei, o) => malha(new T.SphereGeometry(r, 96, 64), matT(Object.assign({ map: tx, emissiveMap: tx, emissive: 0xffffff, emissiveIntensity: ei, roughness: .8, side: T.DoubleSide }, o || {})));
      m.parte("nucleo_interno", camada(2, TX.lava(0xf59e0b, 0xfde047, 0xfffbeb, 3), .9), V(.6, .8, 1.2));
      m.parte("nucleo_externo", camada(3.6, TX.lava(0xc2410c, 0xf97316, 0xfacc15, 2.4), .7), V(2.4, 1.4, 1.6));
      m.parte("manto", camada(5.8, TX.lava(0x7c2d12, 0xc2410c, 0xf97316, 1.6), .45), V(3.8, 2.6, 2.6));
      // crosta com o relevo dos continentes (mesma textura da Terra) e fundo dos oceanos
      const crosta = terraHD(6.2); crosta.material.side = T.DoubleSide; m.parte("crosta", crosta, V(-4.4, 3.4, 2.6));
      // hidrosfera: casca de água só onde o relevo fica abaixo do nível do mar
      const gH = new T.SphereGeometry(6.24, 160, 110), idx = [], pH = gH.attributes.position, ind = gH.index.array, v = new T.Vector3();
      for (let i = 0; i < ind.length; i += 3) { let s = 0; for (let k = 0; k < 3; k++) { v.fromBufferAttribute(pH, ind[i + k]).normalize(); s += TX.elevTerra(v.x, v.y, v.z); } if (s / 3 < TX.MAR) idx.push(ind[i], ind[i + 1], ind[i + 2]); }
      gH.setIndex(idx); gH.computeVertexNormals();
      m.parte("hidrosfera", malha(gH, mat(0x1d5fb0, { op: .55, rough: .12, metal: .05, side: T.DoubleSide, dw: false })), V(-2.6, -4.6, 3.6));
      const atm = malha(new T.SphereGeometry(7.1, 72, 54), mat(0x7dd3fc, { op: .12, side: T.DoubleSide, dw: false }));
      m.parte("atmosfera", atm, V(1.5, 6.8, 1));
      const brilhoAtm = new T.Mesh(new T.SphereGeometry(7.15, 64, 48), TX.materialAtmosfera(0x60a5fa, 1.2)); brilhoAtm.userData.semCaixa = true; brilhoAtm.raycast = () => { }; atm.add(brilhoAtm);
      const nv = new T.Mesh(new T.SphereGeometry(6.6, 96, 64), new T.MeshStandardMaterial({ map: TX.nuvens(), transparent: true, depthWrite: false, roughness: 1, side: T.DoubleSide })); nv.userData.semCaixa = true; nv.raycast = () => { }; atm.add(nv);
      return Object.assign(m, { atualizar(dt) { nv.rotation.y += dt * .02; } });
    }
  };

  /* =================== CÉLULA ANIMAL =================== */
  M.animal = {
    vistas: [["Frente", [0, 6, 48], [0, 0, 0]], ["Por dentro", [5, 7, 22], [0, 0, 0], { corte: true }], ["Núcleo", [2, 3, 8], [0, .5, 0], { corte: true }]],
    construir() {
      const m = novoModelo(), R = rng(11);
      m.parte("membrana_a", malha(deformar(new T.SphereGeometry(8, 160, 120), .38, .32), mat(0xf9a8d4, { op: .26, side: T.DoubleSide, rough: .25, dw: false })), V(-5.6, 5.2, 2));
      m.parte("citoplasma_a", malha(deformar(new T.SphereGeometry(7.75, 96, 72), .32, .32), mat(0xfde68a, { op: .08, side: T.DoubleSide, dw: false })), V(5.4, -5, 2));
      // núcleo: envoltório com poros e cromatina
      const nuc = new T.Group(); nuc.position.set(0, .4, 0);
      nuc.add(malha(deformar(new T.SphereGeometry(2.4, 96, 72), .06, 1.2), mat(0x8b5cf6, { op: .5, rough: .3, side: T.DoubleSide, dw: false })));
      nuc.add(novelo(1.9, 70, 17, .045, mat(0xc4b5fd, { rough: .45 })));
      nuc.add(pontos(140, .07, 0x4c1d95, Rr => V(Rr() - .5, Rr() - .5, Rr() - .5).normalize().multiplyScalar(2.42), 31));
      m.parte("nucleo_a", nuc, V(-1.4, 2.6, 1));
      m.parte("nucleolo", malha(deformar(new T.SphereGeometry(.8, 48, 36), .05, 3), mat(0xc026d3, { rough: .4 }), V(.5, .8, .3)), V(1.2, 1.4, .5));
      // retículo endoplasmático: membranas onduladas ao redor do núcleo, com ribossomos (rugoso)
      const ret = new T.Group(), mr = mat(0x38bdf8, { rough: .35 });
      for (let k = 0; k < 7; k++) { const pts = []; const r0 = 3 + k * .42; for (let i = 0; i <= 40; i++) { const a = -1.3 + i / 40 * 2.8; pts.push(V(Math.cos(a) * r0, Math.sin(i * .7 + k) * .35 - .4 + k * .18, Math.sin(a) * r0)); } ret.add(tubo(pts, .12, mr, false, 200)); }
      ret.add(pontos(260, .06, 0x1e3a8a, Rr => { const a = -1.3 + Rr() * 2.8, r0 = 3 + (Rr() * 7 | 0) * .42 + .14; return V(Math.cos(a) * r0, -.4 + Rr() * 1.4, Math.sin(a) * r0); }, 41));
      m.parte("reticulo", ret, V(3.6, -.2, 2.6));
      m.parte("ribossomo_a", pontos(700, .1, 0xfb7185, Rr => V(Rr() - .5, Rr() - .5, Rr() - .5).normalize().multiplyScalar(3 + Rr() * 4.4), 13), V(-5.2, -2.4, 3.4));
      // mitocôndrias com cristas
      const mit = new T.Group();
      [[-4.5, -2, 2], [4, 3.6, -1], [-2.4, -4.6, -2], [1.5, -3.4, 3.8], [-4.8, 2.8, -2.6], [4.6, -2.2, -2.4], [-1.2, 4.8, -3]].forEach(([x, y, z]) => { const g = mitocondriaHD(1.7); g.position.set(x, y, z); g.rotation.set(R() * 3, R() * 3, R() * 3); mit.add(g); });
      m.parte("mitocondria", mit, V(-4.5, -2, 2.6));
      // complexo golgiense
      const gol = golgiHD(0x34d399); gol.scale.setScalar(1.3); gol.position.set(3.6, 2.4, 2.2); gol.rotation.set(.4, .8, .3); m.parte("golgi", gol, V(3.8, 4.2, 2.6));
      const lis = new T.Group(), ml = mat(0xa3e635, { rough: .3 });
      [[-1, -5.4, 1.6], [5.2, -1, 1.4], [-5.6, .4, 1], [2.6, -5.2, -1.6]].forEach(p => { const l = malha(new T.SphereGeometry(.55, 36, 28), ml, V(...p)); l.add(pontos(16, .08, 0x3f6212, Rr => V(Rr() - .5, Rr() - .5, Rr() - .5).multiplyScalar(.7), p[0] * 10 | 0)); lis.add(l); });
      m.parte("lisossomo", lis, V(-1, -6.2, 1.8));
      return m;
    }
  };

  /* =================== CÉLULA VEGETAL =================== */
  M.vegetal = {
    vistas: [["Frente", [0, 6, 36], [0, 0, 0]], ["Por dentro", [7, 9, 20], [0, 0, 0], { corte: true }]],
    construir() {
      const m = novoModelo(), R = rng(3);
      m.parte("parede", malha(caixaRedonda(16, 11, 9, 1.4), mat(0x65a30d, { op: .3, side: T.DoubleSide, rough: .65, dw: false })), V(-7, 5, 3));
      m.parte("membrana_v", malha(caixaRedonda(15.1, 10.1, 8.1, 1.2), mat(0xf9a8d4, { op: .16, side: T.DoubleSide, dw: false })), V(7, -4.6, 3));
      m.parte("vacuolo", malha(deformar(new T.SphereGeometry(3.6, 96, 72), .18, .55), mat(0x60a5fa, { op: .45, rough: .1 }), V(1.4, 0, 0), null, [1.5, 1, .9]), V(2, 3.2, 2));
      const nuc = nucleoHD(1.6, 9); nuc.position.set(-5, 1.2, .4); m.parte("nucleo_v", nuc, V(-5.4, 3, 1));
      const clo = new T.Group();
      [[-5.5, -3, 2], [-3, 3.6, -2.4], [5.6, -3.4, 2.4], [6, 3.4, -1], [-1, -4, -2.6], [3, -4, 1.8], [-6.2, -.6, -2.6], [.5, 4, 2.6], [-2.6, -3.8, 3], [6.2, -.4, -3]].forEach(([x, y, z]) => { const g = cloroplastoHD(); g.scale.setScalar(1.6); g.position.set(x, y, z); g.rotation.set(R() * 3, R() * 3, R() * 3); clo.add(g); });
      m.parte("cloroplasto", clo, V(-5.5, -3.6, 2.6));
      const mit = new T.Group();
      [[-2.6, -1.4, 2.6], [6.4, .2, 2], [-6.4, 2.8, -1.6], [2.4, 4, -2.6]].forEach(([x, y, z]) => { const g = mitocondriaHD(1.15); g.position.set(x, y, z); g.rotation.set(R() * 3, R() * 3, R() * 3); mit.add(g); });
      m.parte("mitocondria_v", mit, V(-2.6, -1.4, 3.2));
      m.raiz.add(pontos(500, .07, 0xfef3c7, Rr => V((Rr() - .5) * 14, (Rr() > .5 ? 1 : -1) * (3.4 + Rr() * 1.4), (Rr() - .5) * 7.4), 23));
      return m;
    }
  };

  /* =================== MICRORGANISMOS =================== */
  M.micro = {
    vistas: [["Todos", [0, 4, 30], [0, 0, 0]], ["Bactéria", [-7, 3, 9], [-7, 0, 0], { corte: true }], ["Vírus", [7, 3, 7], [7, 2, 0]], ["Fungo", [-7, 1, -1], [-6, -5, -8]], ["Protozoário", [8, -2, 0], [7, -5, -7]]],
    construir() {
      const m = novoModelo(), R = rng(9);
      // bactéria (bacilo) com parede, nucleoide e flagelo
      const bac = new T.Group(); bac.position.set(-7, 0, 0);
      bac.add(malha(new T.CapsuleGeometry(1.8, 4.7, 32, 64), mat(0x7dd3fc, { op: .2, side: T.DoubleSide, rough: .2, dw: false }), null, [0, 0, Math.PI / 2]));
      bac.add(malha(new T.CapsuleGeometry(1.6, 4.6, 32, 64), mat(0x38bdf8, { op: .38, side: T.DoubleSide, rough: .25, dw: false }), null, [0, 0, Math.PI / 2]));
      bac.add(pontos(320, .085, 0xfb923c, Rr => { const x = (Rr() - .5) * 5.6, a = Rr() * 6.283, rr = Math.sqrt(Rr()) * 1.35; return V(x, Math.cos(a) * rr, Math.sin(a) * rr); }, 61));
      bac.add(malha(new T.TorusGeometry(.35, .045, 12, 48), mat(0xfb7185, { rough: .35 }), V(1.8, .6, .4), [1, .4, 0]));
      const fl = []; for (let k = 0; k <= 24; k++) fl.push(V(3.9 + k * .36, Math.sin(k * .8) * .45, Math.cos(k * .8) * .25)); bac.add(tubo(fl, .06, mat(0x94a3b8, { rough: .3 }), false, 240));
      for (let k = 0; k < 30; k++) { const x = (R() - .5) * 5, a = R() * 6.283, n = V(0, Math.cos(a), Math.sin(a)); const b0 = V(x, n.y * 1.75, n.z * 1.75); bac.add(tubo([b0, b0.clone().add(n.clone().multiplyScalar(.55))], .022, mat(0xbae6fd), false, 4)); }
      m.parte("bacteria", bac, V(-10, 2.6, 0));
      const nuc = novelo(1.1, 60, 5, .06, mat(0xf472b6, { emis: 0xbe185d, ei: .4, rough: .35 })); nuc.position.set(-7, 0, 0); m.parte("nucleoide", nuc, V(-6, -1.8, .6));
      // vírus
      const vir = vírusMini(1.6, 0xfacc15); vir.position.set(7, 2, 0); m.parte("virus", vir, V(8.6, 4.6, 0));
      const cap = malha(new T.IcosahedronGeometry(1.1, 0), mat(0xa78bfa, { op: .55, flat: true, side: T.DoubleSide, dw: false }), V(7, 2, 0)); cap.add(novelo(.7, 30, 8, .05, mat(0xf472b6, { rough: .35 }))); m.parte("capsideo", cap, V(5, 3.4, 1));
      // fungo: levedura brotando + hifas
      const fun = new T.Group(), mf = mat(0xfb923c, { rough: .5 }); fun.position.set(-6, -5, -8);
      fun.add(malha(deformar(new T.SphereGeometry(1.2, 64, 48), .03, 3), mat(0xfb923c, { op: .8, rough: .35 }), V(0, 0, 0), null, [1, .85, .85]));
      fun.add(malha(new T.SphereGeometry(.48, 24, 18), mat(0x9a3412), V(-.2, .1, .2)));
      fun.add(malha(deformar(new T.SphereGeometry(.6, 48, 36), .02, 4), mf, V(1.4, .6, 0)));
      const mh = mat(0xfdba74, { rough: .45 });
      for (let k = 0; k < 6; k++) { const pts = [V(-1, 0, 0)]; let p = V(-1, 0, 0); for (let i = 0; i < 7; i++) { p = p.clone().add(V(-.7 - R() * .5, (R() - .5) * 1.2, (R() - .5) * 1.2)); pts.push(p); } fun.add(tubo(pts, .12, mh, false, 90));
        const q = pts[4]; const ram = [q, q.clone().add(V(-.5, .8 + R() * .5, (R() - .5)))]; fun.add(tubo(ram, .07, mh, false, 12)); const esp = malha(new T.SphereGeometry(.22, 24, 18), mat(0x57534e, { rough: .7 }), ram[1]); fun.add(esp);
        for (let e = 0; e < 8; e++) fun.add(malha(new T.SphereGeometry(.05, 8, 6), mat(0x292524), ram[1].clone().add(V(R() - .5, R() - .5, R() - .5).normalize().multiplyScalar(.24)))); }
      m.parte("fungo", fun, V(-6, -2.8, -8));
      // protozoário (ameba com pseudópodes e núcleo)
      const pro = new T.Group(); pro.position.set(7, -5, -7);
      const gA = new T.SphereGeometry(2, 48, 32), q = gA.attributes.position, v = new T.Vector3();
      for (let i = 0; i < q.count; i++) { v.fromBufferAttribute(q, i); const n = v.clone().normalize(); const k = 1 + .45 * Math.max(0, Math.sin(n.x * 3.2 + 1) * Math.cos(n.z * 2.6)) + .1 * ruido(v, 2); q.setXYZ(i, v.x * k, v.y * k * .55, v.z * k); }
      gA.computeVertexNormals();
      pro.add(malha(gA, mat(0x34d399, { op: .5, side: T.DoubleSide, rough: .3, dw: false })));
      pro.add(malha(new T.SphereGeometry(.6, 32, 24), mat(0x7c3aed, { rough: .4 }), V(.3, .1, .2)));
      [[-.9, .1, .6, .32], [1.2, .05, -.6, .25], [-.4, 0, -1.1, .2]].forEach(([x, y, z, r]) => pro.add(malha(new T.SphereGeometry(r, 24, 18), mat(0xd9f99d, { op: .7, rough: .2 }), V(x, y, z))));
      pro.add(pontos(160, .04, 0x065f46, Rr => V((Rr() - .5) * 3.2, (Rr() - .5) * .6, (Rr() - .5) * 3.2), 71));
      m.parte("protozoario", pro, V(9.6, -3.6, -7));
      return Object.assign(m, { atualizar(dt, t) { vir.rotation.y = t * .3; cap.rotation.y = t * .3; } });
    }
  };

  /* =================== NÍVEIS DE ORGANIZAÇÃO =================== */
  M.niveis = {
    vistas: [["Escada", [0, 5, 28], [0, 1, 0]], ["Célula e tecido", [-8, 2, 10], [-7, 0, 0]], ["Órgão e sistema", [3, 3, 12], [2, 1, 0]]],
    construir() {
      const m = novoModelo();
      const xs = [-11, -6, 0, 6, 11.5];
      xs.forEach((x, i) => { const b = malha(new T.CylinderGeometry(2.3, 2.5, .4, 72), mat(0x1e293b, { rough: .35, metal: .2 }), V(x, -3.2 + i * .6, 0)); m.raiz.add(b); b.add(malha(new T.TorusGeometry(2.3, .05, 8, 96), mat(0x5eead4, { emis: 0x0f766e, ei: .6 }), V(0, .2, 0), [Math.PI / 2, 0, 0])); });
      // coração em 3D a partir do contorno clássico, com volume arredondado
      const coracaoGeo = (esc) => { const sh = new T.Shape(); for (let i = 0; i <= 120; i++) { const t = i / 120 * Math.PI * 2, x = 16 * Math.sin(t) ** 3, y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); i ? sh.lineTo(x * esc, y * esc) : sh.moveTo(x * esc, y * esc); }
        const g = new T.ExtrudeGeometry(sh, { depth: esc * 6, bevelEnabled: true, bevelThickness: esc * 6, bevelSize: esc * 4, bevelSegments: 16, curveSegments: 120 }); g.center(); g.computeVertexNormals(); return g; };
      // 1 célula muscular cardíaca (cilindro ramificado com estrias)
      const cel = new T.Group(); cel.position.set(xs[0], -1, 0);
      cel.add(malha(new T.CapsuleGeometry(.55, 2.6, 16, 40), mat(0xf472b6, { op: .85, rough: .3 }), null, [0, 0, Math.PI / 2]));
      for (let k = -6; k <= 6; k++) cel.add(malha(new T.TorusGeometry(.56, .025, 8, 40), mat(0xbe185d, { rough: .4 }), V(k * .2, 0, 0), [0, Math.PI / 2, 0]));
      cel.add(malha(new T.CapsuleGeometry(.3, .9, 8, 16), mat(0xf472b6, { op: .85, rough: .3 }), V(1.2, .5, 0), [0, 0, -.6]));
      cel.add(malha(new T.SphereGeometry(.26, 24, 18), mat(0x7c3aed, { rough: .35 }), V(0, .1, .3), null, [1.5, 1, 1]));
      m.parte("n_celula", cel, V(xs[0], 1, 0));
      // 2 tecido (várias células lado a lado)
      const tec = new T.Group(); tec.position.set(xs[1], -1.6, 0);
      const mtc = mat(0xfb923c, { rough: .35 }), mtn = mat(0x7c2d12, { rough: .4 });
      for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) { const pc = V((c - 1) * 1.15 + (r % 2) * .5, r * .62, 0); tec.add(malha(new T.CapsuleGeometry(.28, 1.4, 12, 24), mtc, pc, [0, 0, Math.PI / 2])); tec.add(malha(new T.SphereGeometry(.12, 16, 12), mtn, pc.clone().add(V(0, 0, .26)), null, [1.6, 1, 1])); for (let k = -3; k <= 3; k++) tec.add(malha(new T.TorusGeometry(.285, .012, 6, 24), mat(0xc2410c), pc.clone().add(V(k * .2, 0, 0)), [0, Math.PI / 2, 0])); }
      m.parte("n_tecido", tec, V(xs[1], 2.4, 0));
      // 3 órgão: coração estilizado
      const cor = new T.Group(); cor.position.set(xs[2], .2, 0);
      const mh = mat(0xef4444, { rough: .45 });
      const mhc = mat(0xd9363e, { rough: .3 }); mhc.clearcoat = .6;
      cor.add(malha(coracaoGeo(.09), mhc, V(0, -.2, 0)));
      cor.add(tubo([V(.15, .8, 0), V(.3, 1.9, 0), V(1, 2.4, 0), V(1.6, 2, 0)], .3, mat(0xb91c1c, { rough: .35 }), false, 60));
      cor.add(tubo([V(-.5, .8, -.2), V(-.6, 1.8, -.3), V(-1.2, 2.1, -.3)], .24, mat(0x2563eb, { rough: .35 }), false, 40));
      for (let k = 0; k < 3; k++) cor.add(tubo([V(-.6 + k * .5, .6, .7), V(-.4 + k * .4, -.3, .9), V(-.1 + k * .2, -1.2, .6)], .05, mat(0x7f1d1d), false, 30));
      m.parte("n_orgao", cor, V(xs[2], 3.4, 0));
      // 4 sistema: coração + vasos
      const sis = new T.Group(); sis.position.set(xs[3], .8, 0);
      sis.add(malha(coracaoGeo(.045), mhc));
      const ver = mat(0xef4444, { rough: .35 }), azu = mat(0x3b82f6, { rough: .35 });
      [[V(0, .5, 0), V(.3, 2, 0), V(1.4, 2.6, 0), V(1.6, 1, .3), V(1.5, -1.8, .2)], [V(0, -.5, 0), V(-.6, -1.8, .2), V(-1, -3, 0)], [V(-.4, .3, 0), V(-1.5, 1.6, 0), V(-1.8, -1, -.2)]].forEach((p, i) => sis.add(tubo(p, .12, i === 2 ? azu : ver, false, 60)));
      [[1.5, -1.8, .2, 1], [-1, -3, 0, 1], [-1.8, -1, -.2, 0]].forEach(([x, y, z, v]) => { for (let k = 0; k < 3; k++) sis.add(tubo([V(x, y, z), V(x + (k - 1) * .4, y - .5, z + .2)], .05, v ? ver : azu, false, 8)); });
      m.parte("n_sistema", sis, V(xs[3], 4, 0));
      // 5 organismo: figura humana simples
      const org = new T.Group(); org.position.set(xs[4], .4, 0); const mo = mat(0x38bdf8, { rough: .3 }); mo.clearcoat = .5;
      // tronco por revolução (ombros, cintura e quadril)
      const perfil = [[0, -.35], [.5, -.3], [.62, .1], [.55, .55], [.5, .9], [.72, 1.35], [.66, 1.6], [.25, 1.75], [.18, 1.95], [0, 1.95]].map(([x, y]) => new T.Vector2(x, y));
      org.add(malha(new T.LatheGeometry(perfil, 48), mo, V(0, 0, 0), null, [1, 1, .62]));
      org.add(malha(new T.SphereGeometry(.42, 40, 30), mo, V(0, 2.35, 0), null, [.9, 1.08, 1]));
      [-1, 1].forEach(s => { org.add(malha(new T.CapsuleGeometry(.15, 1.5, 10, 20), mo, V(s * .86, .85, 0), [0, 0, s * .16])); org.add(malha(new T.SphereGeometry(.16, 16, 12), mo, V(s * .99, .02, 0)));
        org.add(malha(new T.CapsuleGeometry(.21, 1.7, 10, 20), mo, V(s * .3, -1.25, 0))); org.add(malha(new T.CapsuleGeometry(.13, .35, 8, 16), mo, V(s * .3, -2.25, .14), [Math.PI / 2, 0, 0])); });
      m.parte("n_organismo", org, V(xs[4], 3.6, 0));
      // setas
      for (let i = 0; i < 4; i++) { const a = malha(new T.ConeGeometry(.25, .7, 12), mat(0x5eead4, { emis: 0x0f766e, ei: .5 }), V((xs[i] + xs[i + 1]) / 2, -1.5 + i * .6, 0), [0, 0, -Math.PI / 2]); a.userData.semCaixa = true; m.raiz.add(a); }
      return Object.assign(m, { atualizar(dt, t) { const b = 1 + Math.sin(t * 6) * .04; cor.scale.setScalar(b); } });
    }
  };

  /* =================== NEURÔNIO =================== */
  M.neuronio = {
    vistas: [["Inteiro", [0, 3, 30], [1, 0, 0]], ["Corpo celular", [-7, 3, 9], [-7, 0, 0], { corte: true }], ["Sinapse", [13, 2, 7], [12, 0, 0]]],
    construir() {
      const m = novoModelo(), R = rng(21);
      const corpo = malha(deformar(new T.SphereGeometry(2, 96, 72), .28, 1.1), mat(0xa78bfa, { op: .72, rough: .3, side: T.DoubleSide, dw: false }), V(-7, 0, 0));
      corpo.add(pontos(220, .05, 0x5b21b6, Rr => V(Rr() - .5, Rr() - .5, Rr() - .5).normalize().multiplyScalar(1 + Rr() * .7), 5));
      m.parte("corpo_neuronio", corpo, V(-7, 2.6, 0));
      const nN = malha(new T.SphereGeometry(.8, 48, 36), mat(0xf472b6, { rough: .35 }), V(-7, 0, 0)); nN.add(malha(new T.SphereGeometry(.28, 24, 18), mat(0x9d174d), V(.2, .15, .3))); m.parte("nucleo_n", nN, V(-6.2, .4, 1.6));
      const den = new T.Group(), md = mat(0x22d3ee, { rough: .35 });
      // ramos que se dividem em ramos cada vez mais finos (afinando)
      function galho(ini, dir, comp, raio, nivel) {
        const pts = [ini.clone()]; let p = ini.clone(); const n = 5;
        for (let i = 0; i < n; i++) { p = p.clone().addScaledVector(dir, comp / n).add(V((R() - .5) * .25, (R() - .5) * .25, (R() - .5) * .25)); pts.push(p); }
        const c = new T.CatmullRomCurve3(pts), g = new T.TubeGeometry(c, 40, raio, 12, false), pos = g.attributes.position, vv = new T.Vector3(), pc = new T.Vector3();
        for (let i = 0; i < pos.count; i++) { const t = Math.floor(i / 13) / 40; c.getPoint(t, pc); vv.fromBufferAttribute(pos, i).sub(pc).multiplyScalar(1 - t * .55).add(pc); pos.setXYZ(i, vv.x, vv.y, vv.z); }
        g.computeVertexNormals(); den.add(new T.Mesh(g, md));
        if (nivel < 3) for (let j = 0; j < 2; j++) { const d2 = dir.clone().add(V((R() - .5) * 1.3, (R() - .5) * 1.3, (R() - .5) * 1)).normalize(); galho(p, d2, comp * .62, raio * .5, nivel + 1); }
        else den.add(malha(new T.SphereGeometry(raio * 1.2, 8, 6), md, p));
      }
      for (let k = 0; k < 7; k++) { const a = Math.PI * .55 + k / 6 * Math.PI * .9, dir = V(Math.cos(a), Math.sin(a), (R() - .5) * .8).normalize(); galho(V(-7, 0, 0).addScaledVector(dir, 1.6), dir, 3, .26, 1); }
      m.parte("dendritos", den, V(-11, 3.4, 0));
      const ax = tubo([V(-5, 0, 0), V(0, .3, 0), V(6, -.2, 0), V(11, 0, 0)], .22, mat(0xfacc15, { rough: .35 }), false, 200); ax.geometry = new T.TubeGeometry(new T.CatmullRomCurve3([V(-5, 0, 0), V(0, .3, 0), V(6, -.2, 0), V(11, 0, 0)]), 200, .22, 16, false);
      m.parte("axonio", ax, V(2.5, -1.4, 0));
      const mie = new T.Group(), mmi = mat(0xe2e8f0, { rough: .6 });
      const curvaAx = new T.CatmullRomCurve3([V(-5, 0, 0), V(0, .3, 0), V(6, -.2, 0), V(11, 0, 0)]);
      for (let i = 0; i < 7; i++) { const t = .1 + i * .12, p = curvaAx.getPoint(t), tg = curvaAx.getTangent(t); const b = malha(new T.CapsuleGeometry(.5, 1.25, 16, 40), mmi); b.position.copy(p); b.quaternion.setFromUnitVectors(V(0, 1, 0), tg); mie.add(b);
        for (let k = -2; k <= 2; k++) { const r = malha(new T.TorusGeometry(.5, .02, 6, 40), mat(0xcbd5e1)); r.position.copy(p).addScaledVector(tg, k * .25); r.quaternion.setFromUnitVectors(V(0, 0, 1), tg); mie.add(r); } }
      m.parte("mielina", mie, V(0, 1.2, 0));
      const ter = new T.Group(), mt = mat(0x4ade80, { emis: 0x15803d, ei: .4 });
      for (let k = 0; k < 5; k++) { const a = (k - 2) * .45, mid = V(11.8 + Math.cos(a) * .9, Math.sin(a) * .9, (R() - .5) * .5), fim = V(11 + Math.cos(a) * 2.2, Math.sin(a) * 2.2, (R() - .5)); ter.add(tubo([V(11, 0, 0), mid, fim], .09, mt, false, 30)); const bt = malha(new T.SphereGeometry(.34, 32, 24), mat(0x4ade80, { op: .8, rough: .25, emis: 0x15803d, ei: .3 }), fim, null, [1, 1, 1]); ter.add(bt); bt.add(pontos(10, .06, 0xfef08a, Rr => V(Rr() - .5, Rr() - .5, Rr() - .5).multiplyScalar(.4), k + 3)); }
      m.parte("terminal", ter, V(13.4, 2.2, 0));
      // pulsos do impulso nervoso
      const pul = []; for (let i = 0; i < 3; i++) { const s = malha(new T.SphereGeometry(.3, 20, 14), mat(0xffffff, { emis: 0xfef08a, ei: 2 })); s.userData.semCaixa = true; s.add(brilhoSprite(0xfde047, 2.2, .9)); m.raiz.add(s); pul.push(s); }
      const curva = new T.CatmullRomCurve3([V(-7, 0, 0), V(-5, 0, 0), V(0, .3, 0), V(6, -.2, 0), V(11, 0, 0)]);
      return Object.assign(m, { atualizar(dt, t) { pul.forEach((s, i) => { s.position.copy(curva.getPoint(((t * .25) + i / 3) % 1)); }); } });
    }
  };

  /* =================== CIRCUITO ELÉTRICO =================== */
  M.circuito = {
    vistas: [["Circuito", [0, 10, 18], [0, 0, 0]], ["Lâmpada", [5, 4, 6], [4, 1.5, 0]], ["Pilha", [-6, 3, 5], [-5, 0, 0]]],
    construir() {
      const m = novoModelo();
      const tMad = TX.madeira().clone(); tMad.needsUpdate = true; tMad.wrapS = tMad.wrapT = T.RepeatWrapping; tMad.repeat.set(1 / 16, 1 / 10); tMad.offset.set(.5, .5);
      m.raiz.add(malha(caixaRedonda(16, 10, .5, .2), matT({ map: tMad, roughness: .55 }), V(0, -1.3, 0), [-Math.PI / 2, 0, 0]));
      const pil = new T.Group(); pil.position.set(-5, 0, 0);
      const mPil = matT({ map: TX.rotuloPilha(), roughness: .3, metalness: .1 }), mMet = mat(0xd1d5db, { metal: .9, rough: .22 });
      const corpoP = malha(new T.CylinderGeometry(.9, .9, 3.6, 64, 1, true, Math.PI), mPil, null, [0, 0, -Math.PI / 2]); pil.add(corpoP);
      pil.add(malha(new T.CylinderGeometry(.9, .9, .08, 64), mMet, V(-1.82, 0, 0), [0, 0, Math.PI / 2]));
      pil.add(malha(new T.CylinderGeometry(.9, .9, .08, 64), mMet, V(1.82, 0, 0), [0, 0, Math.PI / 2]));
      pil.add(malha(new T.CylinderGeometry(.3, .32, .3, 32), mMet, V(1.98, 0, 0), [0, 0, Math.PI / 2]));
      [-1.6, 1.98].forEach(x => pil.add(malha(new T.BoxGeometry(.25, .5, .9), mat(0x9ca3af, { metal: .8, rough: .3 }), V(x + (x < 0 ? -.4 : .3), -.75, 0))));
      m.parte("pilha", pil, V(-5, 1.6, 0));
      const caminho = [V(-3, 0, 0), V(-1, 0, -3.5), V(4, 0, -3.5), V(4, 0, 0), V(4, 0, 3.5), V(-1, 0, 3.5), V(-7, 0, 3.5), V(-7, 0, 0)];
      const fio = tubo(caminho, .13, mat(0xb45309, { metal: .85, rough: .28 }), false, 400); fio.geometry = new T.TubeGeometry(new T.CatmullRomCurve3(caminho), 400, .13, 16, false);
      const capa = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(caminho), 400, .2, 16, false), mat(0xef4444, { op: .35, rough: .3, dw: false })); fio.add(capa);
      m.parte("fio", fio, V(1.5, .4, -3.8));
      const intr = new T.Group(); intr.position.set(-1, .1, 3.5);
      intr.add(malha(caixaRedonda(1.9, 1.1, .35, .12), mat(0x334155, { rough: .35 }), V(0, 0, 0), [-Math.PI / 2, 0, 0]));
      [-.75, .75].forEach(x => intr.add(malha(new T.CylinderGeometry(.12, .12, .2, 20), mat(0xd1d5db, { metal: .9, rough: .25 }), V(x, .2, 0))));
      const alav = malha(new T.BoxGeometry(1.6, .12, .25), mat(0xe5e7eb, { metal: .7, rough: .3 }), V(0, .3, 0)); alav.geometry.translate(.8, 0, 0); alav.position.x = -.8; intr.add(alav);
      m.parte("interruptor", intr, V(-1, 1, 4.4));
      const lamp = new T.Group(); lamp.position.set(4, 0, 0);
      lamp.add(malha(new T.CylinderGeometry(.75, .85, .35, 48), mat(0x1f2937, { rough: .4 }), V(0, .05, 0)));
      lamp.add(malha(new T.CylinderGeometry(.5, .45, .8, 48), mat(0x9ca3af, { metal: .9, rough: .25 }), V(0, .55, 0)));
      for (let k = 0; k < 5; k++) lamp.add(malha(new T.TorusGeometry(.5, .05, 10, 48), mat(0xcbd5e1, { metal: .9, rough: .2 }), V(0, .25 + k * .15, 0), [Math.PI / 2, 0, 0]));
      const perfilL = []; for (let i = 0; i <= 40; i++) { const t = i / 40, y = t * 2.4, r = t < .25 ? .45 + t * .9 : Math.sqrt(Math.max(0, 1 - ((y - 1.55) / .9) ** 2)) * 1.15; perfilL.push(new T.Vector2(Math.max(.001, r), y)); }
      const vidro = malha(new T.LatheGeometry(perfilL, 64), mat(0xfef9c3, { op: .35, emis: 0xfde047, ei: 0, rough: .05, side: T.DoubleSide }), V(0, .95, 0)); lamp.add(vidro);
      vidro.add(brilhoSprite(0xfde047, 0.01, .0)); const halo = vidro.children[0]; halo.position.set(0, 1.5, 0);
      const fil = tubo([V(-.25, 1.6, 0), V(-.2, 2.5, 0), V(-.07, 2.35, 0), V(.07, 2.5, 0), V(.2, 2.35, 0), V(.25, 1.6, 0)], .04, mat(0xf59e0b, { emis: 0xf59e0b, ei: 0 })); lamp.add(fil);
      const luz = new T.PointLight(0xfff1a8, 0, 18); luz.position.set(0, 2.5, 0); lamp.add(luz);
      m.parte("lampada", lamp, V(4, 4.1, 0));
      const cur = new T.CatmullRomCurve3(caminho), els = new T.Group(), me = mat(0x60a5fa, { emis: 0x2563eb, ei: 1.2 });
      for (let i = 0; i < 22; i++) els.add(malha(new T.SphereGeometry(.16, 20, 14), me));
      m.parte("eletrons", els, V(-4, .6, 3.8));
      let ligado = true, s = 0;
      m.ligar = v => { ligado = v === undefined ? !ligado : v; return ligado; };
      return Object.assign(m, { atualizar(dt, t) {
        alav.rotation.z = ligado ? 0 : .6; const b = ligado ? 1 : 0; vidro.material.emissiveIntensity += (b * 1.4 - vidro.material.emissiveIntensity) * .15; fil.material.emissiveIntensity = vidro.material.emissiveIntensity * 1.5; luz.intensity = vidro.material.emissiveIntensity * 1.6;
        halo.material.opacity = vidro.material.emissiveIntensity / 1.4 * .85; halo.scale.setScalar(6 * vidro.material.emissiveIntensity / 1.4 + .01);
        if (ligado) s += dt * .06; els.children.forEach((e, i) => { e.position.copy(cur.getPoint((s + i / 22) % 1)); e.position.y += .05; }); } });
    }
  };

  /* =================== SISTEMA SOLAR =================== */
  M.solar = {
    vistas: [["Geral", [0, 26, 44], [0, 0, 0]], ["Rochosos", [0, 9, 16], [0, 0, 0]], ["Gigantes", [10, 14, 34], [0, 0, 6]]],
    construir() {
      const m = novoModelo(), anc = m.ancoras;
      const solS = solHD(2.6); m.parte("sol_s", solS, V(0, 3.4, 0)); enfeitarSol(solS, 2.6);
      m.raiz.add(new T.PointLight(0xfff3c4, 2.4, 140, 1));
      const P = [["mercurio", 4.2, .3, 0xa8a29e, 4.1], ["venus", 5.6, .5, 0xfcd34d, 1.6], ["terra_s", 7.2, .55, 0x38bdf8, 1], ["marte", 8.8, .4, 0xef4444, .53], ["jupiter", 13, 1.5, 0xfdba74, .084], ["saturno", 17, 1.25, 0xfde68a, .034], ["urano", 20.6, .9, 0x67e8f9, .012], ["netuno", 23.8, .88, 0x3b82f6, .006]];
      const corpos = [];
      P.forEach(([id, r, rad, cor, vel], i) => {
        const orb = new T.Mesh(new T.TorusGeometry(r, .02, 4, 160), new T.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: .45 })); orb.rotation.x = Math.PI / 2; orb.userData.semCaixa = true; m.raiz.add(orb);
        const g = new T.Group(); const nomeTex = { mercurio: "mercurio", venus: "venus", terra_s: "terra", marte: "marte", jupiter: "jupiter", saturno: "saturno", urano: "urano", netuno: "netuno" }[id];
        const pl = nomeTex === "terra" ? terraHD(rad) : planetaHD(nomeTex, rad); g.add(pl);
        if (id === "saturno") { const an = anelSaturno(rad * 1.25, rad * 2.4); an.rotation.x = Math.PI / 2.4; g.add(an); }
        if (id === "urano") { const an = anelSaturno(rad * 1.5, rad * 1.7); an.material.opacity = .4; an.material.userData.baseOp = .4; an.rotation.x = .2; g.add(an); }
        m.parte(id, g, null); anc[id] = V(); corpos.push({ id, g, r, rad, vel, a: i * 1.7 });
      });
      const ast = new T.Group(), R = rng(4), ma = mat(0x8a817c, { rough: .95 }), ge = deformar(new T.IcosahedronGeometry(.1, 2), .025, 30);
      const imA = new T.InstancedMesh(ge, ma, 420), dA = new T.Object3D();
      for (let i = 0; i < 420; i++) { const a = R() * Math.PI * 2, r = 10.2 + R() * 1.6; dA.position.set(Math.cos(a) * r, (R() - .5) * .5, Math.sin(a) * r); dA.rotation.set(R() * 3, R() * 3, R() * 3); dA.scale.set(.5 + R() * 1.5, .5 + R(), .5 + R() * 1.2); dA.updateMatrix(); imA.setMatrixAt(i, dA.matrix); }
      ast.add(imA);
      m.parte("asteroides", ast, V(-7.6, .6, 7.6));
      let vel = 1;
      m.velocidade = v => vel = v;
      function pos() { corpos.forEach(c => { c.g.position.set(Math.cos(c.a) * c.r, 0, Math.sin(c.a) * c.r); anc[c.id].copy(c.g.position).add(V(0, c.rad + .7, 0)); }); }
      pos();
      corpos.forEach(c => { if (c.id === "terra_s") enfeitarTerra(c.g.children[0], c.rad, .9); });
      return Object.assign(m, { atualizar(dt) { corpos.forEach(c => { c.a += dt * c.vel * .35 * vel; c.g.children[0].rotation.y += dt; }); ast.rotation.y += dt * .02 * vel; pos(); } });
    }
  };

  /* =================== MODELO ATÔMICO =================== */
  M.atomo = {
    vistas: [["Átomo", [0, 6, 20], [0, 0, 0]], ["Núcleo", [1.5, 1.2, 3], [0, 0, 0]]],
    construir() {
      const m = novoModelo();
      const pr = new T.Group(), ne = new T.Group(), mp = mat(0xef4444, { rough: .25 }), mn = mat(0x94a3b8, { rough: .25 }), g = new T.SphereGeometry(.42, 48, 36); mp.metalness = mn.metalness = .15;
      fibonacci(12).forEach((n, i) => (i % 2 ? ne : pr).add(malha(g, i % 2 ? mn : mp, n.clone().multiplyScalar(.62))));
      m.parte("protons", pr, V(-.9, .9, .6)); m.parte("neutrons", ne, V(.9, -.9, .6));
      const cam = new T.Group(), el = new T.Group(), me = mat(0x60a5fa, { emis: 0x2563eb, ei: 1 });
      const camadas = [[3.2, 2], [6, 4]], eletrons = [];
      camadas.forEach(([r, n], k) => {
        const anel = new T.Mesh(new T.TorusGeometry(r, .035, 10, 240), mat(0xa78bfa, { op: .7, emis: 0x7c3aed, ei: .5 })); anel.rotation.x = Math.PI / 2 + k * .25; cam.add(anel);
        const nuvem = new T.Mesh(new T.SphereGeometry(r, 64, 48), mat(0x93c5fd, { op: .05, dw: false, side: T.DoubleSide })); cam.add(nuvem);
        for (let i = 0; i < n; i++) { const e = malha(new T.SphereGeometry(.24, 32, 24), me); el.add(e); eletrons.push({ e, r, a: i / n * Math.PI * 2, inc: k * .25, v: 1.4 - k * .5 }); }
      });
      m.parte("eletrosfera", cam, V(-4.4, 3.4, 0)); m.parte("eletrons", el, V(6.6, .6, 0));
      el.children.forEach(e => e.add(brilhoSprite(0x60a5fa, 1.6, .8))); pr.add(brilhoSprite(0xfca5a5, 4.2, .25));
      return Object.assign(m, { atualizar(dt) { eletrons.forEach(o => { o.a += dt * o.v; const x = Math.cos(o.a) * o.r, z = Math.sin(o.a) * o.r; o.e.position.set(x, -z * Math.sin(o.inc), z * Math.cos(o.inc)); }); } });
    }
  };

  window.MODELOS = M;
  window.GEO = { mat, malha, rng, fibonacci, orientar, deformar, tubo, novelo, hélice, vírusMini, anticorpoGeo, celulaBola, ruido, V, matT, terraHD, enfeitarTerra, luaHD, solHD, enfeitarSol, brilhoSprite, planetaHD, anelSaturno, caixaRedonda, pontos, nucleoHD, mitocondriaHD, golgiHD, cloroplastoHD };
})();
