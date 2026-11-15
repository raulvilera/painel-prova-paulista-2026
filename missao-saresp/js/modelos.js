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
    const m = new T.MeshStandardMaterial({
      color: cor, roughness: o.rough ?? 0.55, metalness: o.metal ?? 0.05,
      transparent: (o.op ?? 1) < 1, opacity: o.op ?? 1, side: o.side || T.FrontSide,
      emissive: o.emis || 0x000000, emissiveIntensity: o.ei ?? 1, flatShading: !!o.flat,
      depthWrite: o.dw ?? ((o.op ?? 1) >= 0.6)
    });
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
    const corpo = malha(new T.IcosahedronGeometry(r, 2), mat(cor, { rough: .4 }));
    g.add(corpo);
    const me = mat(0xfb923c, { rough: .4 });
    const geoE = new T.CylinderGeometry(r * .08, r * .08, r * .45, 5), geoC = new T.SphereGeometry(r * .16, 8, 6);
    fibonacci(18).forEach(n => { const h = malha(geoE, me); h.position.copy(n.clone().multiplyScalar(r * 1.15)); orientar(h, n); g.add(h);
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

  const M = {};

  /* =================== SOL, TERRA E LUA =================== */
  M.sistema = {
    vistas: [["Geral", [0, 10, 26], [0, 0, 0]], ["Terra e Lua", [9, 3, 9], [6, 0, 0]], ["Eixo", [6, 1, 6], [6, 0, 0]]],
    construir() {
      const m = novoModelo(), anc = m.ancoras;
      const sol = malha(new T.SphereGeometry(3, 48, 32), mat(0xfbbf24, { emis: 0xf59e0b, ei: 1.2, rough: .9 }));
      m.parte("sol", sol, V(0, 3.6, 0));
      const halo = malha(new T.SphereGeometry(3.6, 32, 24), mat(0xfde68a, { op: .18, emis: 0xfbbf24, ei: 1 })); halo.userData.semCaixa = true; sol.add(halo);
      const luz = new T.PointLight(0xfff3c4, 2.2, 80, 1.2); m.raiz.add(luz);
      const R = 9;
      const orb = new T.Mesh(new T.TorusGeometry(R, .04, 6, 160), mat(0x22d3ee, { op: .7, emis: 0x0891b2, ei: .6 })); orb.rotation.x = Math.PI / 2;
      m.parte("orbita_terra", orb, V(-R * .7, 0, R * .7));
      const piv = new T.Group(); m.raiz.add(piv);
      const terraG = new T.Group(); terraG.position.set(R, 0, 0); piv.add(terraG);
      const incl = new T.Group(); incl.rotation.z = -23.5 * Math.PI / 180; terraG.add(incl);
      // terra com "continentes" coloridos por vértice
      const gT = new T.SphereGeometry(1.1, 48, 32), cores = [], p = gT.attributes.position, v = new T.Vector3();
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = ruido(v, 2.6) + .35 * ruido(v, 5); const c = Math.abs(v.y) > 1.0 ? new T.Color(0xf1f5f9) : n > .12 ? new T.Color(0x4d7c0f) : new T.Color(0x1d4ed8); cores.push(c.r, c.g, c.b); }
      gT.setAttribute("color", new T.Float32BufferAttribute(cores, 3));
      const mT = mat(0xffffff, { rough: .7 }); mT.vertexColors = true;
      const terra = malha(gT, mT); incl.add(terra); m.parte("terra", terra, null);
      const eixo = malha(new T.CylinderGeometry(.05, .05, 3.6, 8), mat(0xf472b6, { emis: 0xdb2777, ei: .6 })); incl.add(eixo); m.parte("eixo_terra", eixo, null);
      const orbL = new T.Mesh(new T.TorusGeometry(2.6, .025, 6, 120), mat(0xa78bfa, { op: .75, emis: 0x7c3aed, ei: .6 })); orbL.rotation.x = Math.PI / 2 + 5 * Math.PI / 180; terraG.add(orbL); m.parte("orbita_lua", orbL, null);
      const lPiv = new T.Group(); lPiv.rotation.x = 5 * Math.PI / 180; terraG.add(lPiv);
      const lua = malha(deformar(new T.SphereGeometry(.38, 32, 24), .012, 9), mat(0xd6d3d1, { rough: .95 })); lua.position.set(2.6, 0, 0); lPiv.add(lua); m.parte("lua", lua, null);
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
      return Object.assign(m, { atualizar(dt) { ang += dt * .05; angL += dt * .6; piv.rotation.y = ang; terraG.rotation.y = -ang; terra.rotation.y += dt * 1.2; lPiv.rotation.y = angL; ancorar(); } });
    }
  };

  /* =================== CAMADAS DA TERRA =================== */
  M.terra = {
    vistas: [["Frente", [0, 3, 34], [0, 0, 0]], ["Por dentro", [12, 5, 20], [0, 0, 0], { corte: true }], ["Atmosfera", [6, 8, 9], [0, 4, 0]]],
    construir() {
      const m = novoModelo();
      m.parte("nucleo_interno", malha(new T.SphereGeometry(2, 40, 30), mat(0xfacc15, { emis: 0xf59e0b, ei: .7 })), V(.6, .8, 1.2));
      m.parte("nucleo_externo", malha(new T.SphereGeometry(3.6, 48, 36), mat(0xf97316, { emis: 0xc2410c, ei: .5, side: T.DoubleSide })), V(2.4, 1.4, 1.6));
      m.parte("manto", malha(new T.SphereGeometry(5.8, 56, 40), mat(0xea580c, { emis: 0x7c2d12, ei: .4, side: T.DoubleSide, rough: .8 })), V(3.8, 2.6, 2.6));
      const gC = new T.SphereGeometry(6.2, 72, 52), cores = [], p = gC.attributes.position, v = new T.Vector3();
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = ruido(v, .5) + .4 * ruido(v, 1.3); const c = n > .05 ? new T.Color(0x65a30d).lerp(new T.Color(0xa16207), Math.min(1, n * 2)) : new T.Color(0x78350f); cores.push(c.r, c.g, c.b); }
      gC.setAttribute("color", new T.Float32BufferAttribute(cores, 3));
      const mC = mat(0xffffff, { rough: .9, side: T.DoubleSide }); mC.vertexColors = true;
      m.parte("crosta", malha(gC, mC), V(-4.4, 3.4, 2.6));
      // hidrosfera: oceanos (casca azul só onde o ruído é baixo)
      const gH = new T.SphereGeometry(6.26, 72, 52), idx = [], pH = gH.attributes.position, ind = gH.index.array;
      for (let i = 0; i < ind.length; i += 3) { let s = 0; for (let k = 0; k < 3; k++) { v.fromBufferAttribute(pH, ind[i + k]); s += ruido(v, .5) + .4 * ruido(v, 1.3); } if (s / 3 <= .05) idx.push(ind[i], ind[i + 1], ind[i + 2]); }
      gH.setIndex(idx);
      m.parte("hidrosfera", malha(gH, mat(0x2563eb, { rough: .25, metal: .1, side: T.DoubleSide })), V(-2.6, -4.6, 3.6));
      m.parte("atmosfera", malha(new T.SphereGeometry(7.1, 56, 40), mat(0x7dd3fc, { op: .16, side: T.DoubleSide, dw: false })), V(1.5, 6.8, 1));
      return m;
    }
  };

  /* =================== CÉLULA ANIMAL =================== */
  M.animal = {
    vistas: [["Frente", [0, 6, 48], [0, 0, 0]], ["Por dentro", [5, 7, 22], [0, 0, 0], { corte: true }], ["Núcleo", [2, 3, 8], [0, .5, 0], { corte: true }]],
    construir() {
      const m = novoModelo(), R = rng(11);
      m.parte("membrana_a", malha(deformar(new T.SphereGeometry(8, 64, 48), .35, .35), mat(0xf9a8d4, { op: .28, side: T.DoubleSide, rough: .3, dw: false })), V(-5.6, 5.2, 2));
      m.parte("citoplasma_a", malha(deformar(new T.SphereGeometry(7.75, 48, 36), .3, .35), mat(0xfde68a, { op: .1, side: T.DoubleSide, dw: false })), V(5.4, -5, 2));
      m.parte("nucleo_a", malha(new T.SphereGeometry(2.4, 48, 36), mat(0x8b5cf6, { op: .65, rough: .4, side: T.DoubleSide })), V(-1.4, 2.6, 1));
      m.parte("nucleolo", malha(new T.SphereGeometry(.8, 24, 18), mat(0xc026d3, { rough: .5 }), V(.5, .4, .3)), V(1.2, 1.4, .5));
      // retículo: tubos ondulados ao redor do núcleo
      const ret = new T.Group(), mr = mat(0x38bdf8, { rough: .4 });
      for (let k = 0; k < 6; k++) { const pts = []; const r0 = 3 + k * .45; for (let i = 0; i <= 26; i++) { const a = -1.2 + i / 26 * 2.6; pts.push(V(Math.cos(a) * r0, Math.sin(i * .9) * .35 - .6 + k * .2, Math.sin(a) * r0)); } ret.add(tubo(pts, .13, mr)); }
      m.parte("reticulo", ret, V(3.6, -.2, 2.6));
      // ribossomos
      const rib = new T.Group(), mrb = mat(0xfb7185), gR = new T.SphereGeometry(.12, 8, 6);
      for (let i = 0; i < 160; i++) { const p = V(R() - .5, R() - .5, R() - .5).normalize().multiplyScalar(3 + R() * 4); rib.add(malha(gR, mrb, p)); }
      m.parte("ribossomo_a", rib, V(-5.2, -2.4, 3.4));
      // mitocôndrias
      const mit = new T.Group(), mm = mat(0xf97316, { rough: .4 }), mi = mat(0xfed7aa);
      [[-4.5, -2, 2], [4, 3.6, -1], [-2.4, -4.6, -2], [1.5, -3.4, 3.8], [-4.8, 2.8, -2.6]].forEach(([x, y, z], i) => { const g = new T.Group(); g.add(malha(new T.CapsuleGeometry(.6, 1.6, 8, 16), mm)); for (let k = -2; k <= 2; k++) g.add(malha(new T.BoxGeometry(.9, .06, .5), mi, V(0, k * .35, 0))); g.position.set(x, y, z); g.rotation.set(R() * 3, R() * 3, R() * 3); mit.add(g); });
      m.parte("mitocondria", mit, V(-4.5, -2, 2.6));
      // complexo golgiense: pilha de discos curvos
      const gol = new T.Group(), mg = mat(0x34d399, { rough: .4 });
      for (let k = 0; k < 5; k++) { const d = malha(new T.TorusGeometry(1.3 - k * .08, .16, 8, 24, Math.PI * 1.1), mg, V(0, k * .38, 0), [Math.PI / 2, 0, 0]); gol.add(d); }
      gol.position.set(3.6, 2.6, 2.2); gol.rotation.set(.4, .8, .3); m.parte("golgi", gol, V(3.8, 4.2, 2.6));
      const lis = new T.Group(), ml = mat(0xa3e635, { rough: .4 });
      [[-1, -5.4, 1.6], [5.2, -1, 1.4], [-5.6, .4, 1]].forEach(p => lis.add(malha(new T.SphereGeometry(.55, 20, 16), ml, V(...p))));
      m.parte("lisossomo", lis, V(-1, -6.2, 1.8));
      return m;
    }
  };

  /* =================== CÉLULA VEGETAL =================== */
  M.vegetal = {
    vistas: [["Frente", [0, 6, 36], [0, 0, 0]], ["Por dentro", [7, 9, 20], [0, 0, 0], { corte: true }]],
    construir() {
      const m = novoModelo(), R = rng(3);
      const caixa = (l, a, p, r) => { const g = new T.BoxGeometry(l, a, p, 6, 6, 6), q = g.attributes.position, v = new T.Vector3(); for (let i = 0; i < q.count; i++) { v.fromBufferAttribute(q, i); const k = 1 - r * .12 * (Math.abs(v.x / l * 2) ** 4 + Math.abs(v.y / a * 2) ** 4 + Math.abs(v.z / p * 2) ** 4) / 3; q.setXYZ(i, v.x * k, v.y * k, v.z * k); } g.computeVertexNormals(); return g; };
      m.parte("parede", malha(caixa(16, 11, 9, 1), mat(0x65a30d, { op: .32, side: T.DoubleSide, rough: .8, dw: false })), V(-7, 5, 3));
      m.parte("membrana_v", malha(caixa(15.2, 10.2, 8.2, 1), mat(0xf9a8d4, { op: .2, side: T.DoubleSide, dw: false })), V(7, -4.6, 3));
      m.parte("vacuolo", malha(deformar(new T.SphereGeometry(3.6, 40, 30), .2, .6), mat(0x60a5fa, { op: .55, rough: .2 }), V(1.4, 0, 0), null, [1.5, 1, .9]), V(2, 3.2, 2));
      m.parte("nucleo_v", malha(new T.SphereGeometry(1.6, 36, 28), mat(0x8b5cf6, { rough: .4 }), V(-5, 1.2, .4)), V(-5.4, 3, 1));
      const clo = new T.Group(), mc = mat(0x22c55e, { rough: .45 }), mt = mat(0x14532d);
      [[-5.5, -3, 2], [-3, 3.6, -2.4], [5.6, -3.4, 2.4], [6, 3.4, -1], [-1, -4, -2.6], [3, -4, 1.8], [-6.2, -.6, -2.6], [.5, 4, 2.6]].forEach(([x, y, z]) => { const g = new T.Group(); g.add(malha(new T.SphereGeometry(1, 24, 16), mc, null, null, [1.2, .55, .8])); for (let k = -1; k <= 1; k++) g.add(malha(new T.CylinderGeometry(.32, .32, .12, 14), mt, V(k * .55, 0, 0))); g.position.set(x, y, z); g.rotation.set(R() * 3, R() * 3, R() * 3); clo.add(g); });
      m.parte("cloroplasto", clo, V(-5.5, -3.6, 2.6));
      const mit = new T.Group(), mm = mat(0xf97316, { rough: .4 });
      [[-2.6, -1.4, 2.6], [6.4, .2, 2], [-6.4, 2.8, -1.6]].forEach(([x, y, z]) => { const s = malha(new T.CapsuleGeometry(.4, 1, 6, 12), mm, V(x, y, z)); s.rotation.set(R() * 3, R() * 3, R() * 3); mit.add(s); });
      m.parte("mitocondria_v", mit, V(-2.6, -1.4, 3.2));
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
      bac.add(malha(new T.CapsuleGeometry(1.6, 4.6, 16, 32), mat(0x38bdf8, { op: .45, side: T.DoubleSide, rough: .3, dw: false }), null, [0, 0, Math.PI / 2]));
      const rb = mat(0xfb923c), gR = new T.SphereGeometry(.1, 6, 4);
      for (let i = 0; i < 60; i++) bac.add(malha(gR, rb, V((R() - .5) * 5.4, (R() - .5) * 2, (R() - .5) * 2)));
      bac.add(tubo([V(3.8, 0, 0), V(4.8, .6, .2), V(5.8, -.4, -.2), V(6.8, .5, .2), V(7.8, -.3, 0)], .06, mat(0x94a3b8)));
      m.parte("bacteria", bac, V(-10, 2.6, 0));
      const nuc = novelo(1, 34, 5, .07, mat(0xf472b6, { emis: 0xbe185d, ei: .6 })); nuc.position.set(-7, 0, 0); m.parte("nucleoide", nuc, V(-6, -1.8, .6));
      // vírus
      const vir = vírusMini(1.6, 0xfacc15); vir.position.set(7, 2, 0); m.parte("virus", vir, V(8.6, 4.6, 0));
      const cap = malha(new T.IcosahedronGeometry(1.1, 0), mat(0xa78bfa, { op: .6, flat: true, side: T.DoubleSide }), V(7, 2, 0)); m.parte("capsideo", cap, V(5, 3.4, 1));
      // fungo: levedura brotando + hifas
      const fun = new T.Group(), mf = mat(0xfb923c, { rough: .5 }); fun.position.set(-6, -5, -8);
      fun.add(malha(new T.SphereGeometry(1.2, 28, 20), mf, V(0, 0, 0), null, [1, .85, .85]));
      fun.add(malha(new T.SphereGeometry(.6, 20, 14), mf, V(1.4, .6, 0)));
      for (let k = 0; k < 5; k++) { const pts = [V(-1, 0, 0)]; let p = V(-1, 0, 0); for (let i = 0; i < 6; i++) { p = p.clone().add(V(-.8 - R() * .5, (R() - .5) * 1.4, (R() - .5) * 1.4)); pts.push(p); } fun.add(tubo(pts, .14, mat(0xfdba74))); }
      m.parte("fungo", fun, V(-6, -2.8, -8));
      // protozoário (ameba com pseudópodes e núcleo)
      const pro = new T.Group(); pro.position.set(7, -5, -7);
      const gA = new T.SphereGeometry(2, 48, 32), q = gA.attributes.position, v = new T.Vector3();
      for (let i = 0; i < q.count; i++) { v.fromBufferAttribute(q, i); const n = v.clone().normalize(); const k = 1 + .45 * Math.max(0, Math.sin(n.x * 3.2 + 1) * Math.cos(n.z * 2.6)) + .1 * ruido(v, 2); q.setXYZ(i, v.x * k, v.y * k * .55, v.z * k); }
      gA.computeVertexNormals();
      pro.add(malha(gA, mat(0x34d399, { op: .5, side: T.DoubleSide, rough: .3, dw: false })));
      pro.add(malha(new T.SphereGeometry(.6, 20, 14), mat(0x7c3aed), V(.3, .1, .2)));
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
      xs.forEach((x, i) => m.raiz.add(malha(new T.CylinderGeometry(2.3, 2.5, .4, 40), mat(0x1e293b, { rough: .8 }), V(x, -3.2 + i * .6, 0))));
      // 1 célula muscular cardíaca (cilindro ramificado com estrias)
      const cel = new T.Group(); cel.position.set(xs[0], -1, 0);
      cel.add(malha(new T.CapsuleGeometry(.55, 2.6, 8, 16), mat(0xf472b6, { rough: .4 }), null, [0, 0, Math.PI / 2]));
      cel.add(malha(new T.SphereGeometry(.3, 16, 12), mat(0x7c3aed), V(0, .15, .35)));
      m.parte("n_celula", cel, V(xs[0], 1, 0));
      // 2 tecido (várias células lado a lado)
      const tec = new T.Group(); tec.position.set(xs[1], -1.6, 0);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { tec.add(malha(new T.CapsuleGeometry(.35, 1.4, 6, 12), mat(0xfb923c, { rough: .4 }), V((c - 1) * 1.15 + (r % 2) * .5, r * .8, 0), [0, 0, Math.PI / 2])); }
      m.parte("n_tecido", tec, V(xs[1], 2.4, 0));
      // 3 órgão: coração estilizado
      const cor = new T.Group(); cor.position.set(xs[2], .2, 0);
      const mh = mat(0xef4444, { rough: .45 });
      cor.add(malha(new T.SphereGeometry(1, 32, 24), mh, V(-.55, .3, 0)), malha(new T.SphereGeometry(1, 32, 24), mh, V(.55, .3, 0)));
      cor.add(malha(new T.ConeGeometry(1.45, 2.2, 32), mh, V(0, -1.05, 0), [Math.PI, 0, 0]));
      cor.add(tubo([V(.2, 1, 0), V(.4, 2, 0), V(1.2, 2.3, 0)], .28, mat(0xdc2626)));
      m.parte("n_orgao", cor, V(xs[2], 3.4, 0));
      // 4 sistema: coração + vasos
      const sis = new T.Group(); sis.position.set(xs[3], .8, 0);
      sis.add(malha(new T.SphereGeometry(.7, 24, 18), mh));
      const ver = mat(0xef4444), azu = mat(0x3b82f6);
      [[V(0, .5, 0), V(.3, 2, 0), V(1.4, 2.6, 0), V(1.6, 1, .3), V(1.5, -1.8, .2)], [V(0, -.5, 0), V(-.6, -1.8, .2), V(-1, -3, 0)], [V(-.4, .3, 0), V(-1.5, 1.6, 0), V(-1.8, -1, -.2)]].forEach((p, i) => sis.add(tubo(p, .12, i === 2 ? azu : ver)));
      m.parte("n_sistema", sis, V(xs[3], 4, 0));
      // 5 organismo: figura humana simples
      const org = new T.Group(); org.position.set(xs[4], .4, 0); const mo = mat(0x38bdf8, { rough: .5 });
      org.add(malha(new T.SphereGeometry(.55, 24, 18), mo, V(0, 2.4, 0)), malha(new T.CapsuleGeometry(.65, 1.6, 8, 16), mo, V(0, .8, 0)));
      [-1, 1].forEach(s => { org.add(malha(new T.CapsuleGeometry(.2, 1.5, 6, 10), mo, V(s * .95, .9, 0), [0, 0, s * .25])); org.add(malha(new T.CapsuleGeometry(.24, 1.6, 6, 10), mo, V(s * .35, -1.2, 0))); });
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
      const corpo = malha(deformar(new T.SphereGeometry(2, 40, 30), .25, 1.2), mat(0xa78bfa, { op: .7, rough: .4, side: T.DoubleSide }), V(-7, 0, 0));
      m.parte("corpo_neuronio", corpo, V(-7, 2.6, 0));
      m.parte("nucleo_n", malha(new T.SphereGeometry(.8, 24, 18), mat(0xf472b6), V(-7, 0, 0)), V(-6.2, .4, 1.6));
      const den = new T.Group(), md = mat(0x22d3ee, { rough: .4 });
      for (let k = 0; k < 7; k++) { const a = Math.PI * .55 + k / 6 * Math.PI * .9, dir = V(Math.cos(a), Math.sin(a), (R() - .5) * .8).normalize(); let p = V(-7, 0, 0).addScaledVector(dir, 1.6); const pts = [p.clone()];
        for (let i = 0; i < 4; i++) { p = p.clone().addScaledVector(dir, 1.1).add(V((R() - .5) * .6, (R() - .5) * .6, (R() - .5) * .6)); pts.push(p); }
        den.add(tubo(pts, .16, md)); const q = pts[pts.length - 1]; for (let j = 0; j < 2; j++) den.add(tubo([q, q.clone().add(V((R() - .5) * 2, (R() - .5) * 2, (R() - .5) * 1))], .07, md)); }
      m.parte("dendritos", den, V(-11, 3.4, 0));
      const ax = tubo([V(-5, 0, 0), V(0, .3, 0), V(6, -.2, 0), V(11, 0, 0)], .22, mat(0xfacc15, { rough: .4 }));
      m.parte("axonio", ax, V(2.5, -1.4, 0));
      const mie = new T.Group(), mmi = mat(0xe2e8f0, { rough: .6 });
      for (let i = 0; i < 6; i++) { const x = -3.4 + i * 2.25; mie.add(malha(new T.CapsuleGeometry(.5, 1.3, 6, 16), mmi, V(x, .05 * Math.sin(x), 0), [0, 0, Math.PI / 2])); }
      m.parte("mielina", mie, V(0, 1.2, 0));
      const ter = new T.Group(), mt = mat(0x4ade80, { emis: 0x15803d, ei: .4 });
      for (let k = 0; k < 4; k++) { const a = (k - 1.5) * .5, fim = V(11 + Math.cos(a) * 2, Math.sin(a) * 2, (R() - .5)); ter.add(tubo([V(11, 0, 0), fim], .1, mt)); ter.add(malha(new T.SphereGeometry(.32, 16, 12), mt, fim)); }
      m.parte("terminal", ter, V(13.4, 2.2, 0));
      // pulsos do impulso nervoso
      const pul = []; for (let i = 0; i < 3; i++) { const s = malha(new T.SphereGeometry(.32, 14, 10), mat(0xffffff, { emis: 0xfef08a, ei: 2 })); s.userData.semCaixa = true; m.raiz.add(s); pul.push(s); }
      const curva = new T.CatmullRomCurve3([V(-7, 0, 0), V(-5, 0, 0), V(0, .3, 0), V(6, -.2, 0), V(11, 0, 0)]);
      return Object.assign(m, { atualizar(dt, t) { pul.forEach((s, i) => { s.position.copy(curva.getPoint(((t * .25) + i / 3) % 1)); }); } });
    }
  };

  /* =================== CIRCUITO ELÉTRICO =================== */
  M.circuito = {
    vistas: [["Circuito", [0, 10, 18], [0, 0, 0]], ["Lâmpada", [5, 4, 6], [4, 1.5, 0]], ["Pilha", [-6, 3, 5], [-5, 0, 0]]],
    construir() {
      const m = novoModelo();
      m.raiz.add(malha(new T.BoxGeometry(16, .3, 10), mat(0x334155, { rough: .9 }), V(0, -1.2, 0)));
      const pil = new T.Group(); pil.position.set(-5, 0, 0);
      pil.add(malha(new T.CylinderGeometry(.9, .9, 3.6, 32), mat(0xf97316, { rough: .4 }), null, [0, 0, Math.PI / 2]));
      pil.add(malha(new T.CylinderGeometry(.92, .92, 1.2, 32), mat(0x1f2937), V(-1.2, 0, 0), [0, 0, Math.PI / 2]));
      pil.add(malha(new T.CylinderGeometry(.3, .3, .3, 16), mat(0xd1d5db, { metal: .8, rough: .3 }), V(1.95, 0, 0), [0, 0, Math.PI / 2]));
      m.parte("pilha", pil, V(-5, 1.6, 0));
      const caminho = [V(-3, 0, 0), V(-1, 0, -3.5), V(4, 0, -3.5), V(4, 0, 0), V(4, 0, 3.5), V(-1, 0, 3.5), V(-7, 0, 3.5), V(-7, 0, 0)];
      const fio = tubo(caminho, .12, mat(0xeab308, { metal: .6, rough: .35 }), false, 200); m.parte("fio", fio, V(1.5, .4, -3.8));
      const intr = new T.Group(); intr.position.set(-1, .1, 3.5);
      intr.add(malha(new T.BoxGeometry(1.8, .3, 1), mat(0x64748b)));
      const alav = malha(new T.BoxGeometry(1.6, .12, .25), mat(0xe5e7eb, { metal: .7, rough: .3 }), V(0, .3, 0)); alav.geometry.translate(.8, 0, 0); alav.position.x = -.8; intr.add(alav);
      m.parte("interruptor", intr, V(-1, 1, 4.4));
      const lamp = new T.Group(); lamp.position.set(4, 0, 0);
      lamp.add(malha(new T.CylinderGeometry(.5, .5, .8, 24), mat(0x9ca3af, { metal: .7, rough: .3 }), V(0, .4, 0)));
      const vidro = malha(new T.SphereGeometry(1.2, 32, 24), mat(0xfef9c3, { op: .45, emis: 0xfde047, ei: 0, rough: .1 }), V(0, 1.9, 0)); lamp.add(vidro);
      const fil = tubo([V(-.3, 1.2, 0), V(-.2, 2, 0), V(0, 1.8, 0), V(.2, 2, 0), V(.3, 1.2, 0)], .04, mat(0xf59e0b, { emis: 0xf59e0b, ei: 0 })); lamp.add(fil);
      const luz = new T.PointLight(0xfff1a8, 0, 18); luz.position.set(0, 2, 0); lamp.add(luz);
      m.parte("lampada", lamp, V(4, 3.6, 0));
      const cur = new T.CatmullRomCurve3(caminho), els = new T.Group(), me = mat(0x60a5fa, { emis: 0x2563eb, ei: 1.2 });
      for (let i = 0; i < 22; i++) els.add(malha(new T.SphereGeometry(.16, 10, 8), me));
      m.parte("eletrons", els, V(-4, .6, 3.8));
      let ligado = true, s = 0;
      m.ligar = v => { ligado = v === undefined ? !ligado : v; return ligado; };
      return Object.assign(m, { atualizar(dt, t) {
        alav.rotation.z = ligado ? 0 : .6; const b = ligado ? 1 : 0; vidro.material.emissiveIntensity += (b * 1.4 - vidro.material.emissiveIntensity) * .15; fil.material.emissiveIntensity = vidro.material.emissiveIntensity * 1.5; luz.intensity = vidro.material.emissiveIntensity * 1.6;
        if (ligado) s += dt * .06; els.children.forEach((e, i) => { e.position.copy(cur.getPoint((s + i / 22) % 1)); e.position.y += .05; }); } });
    }
  };

  /* =================== SISTEMA SOLAR =================== */
  M.solar = {
    vistas: [["Geral", [0, 26, 44], [0, 0, 0]], ["Rochosos", [0, 9, 16], [0, 0, 0]], ["Gigantes", [10, 14, 34], [0, 0, 6]]],
    construir() {
      const m = novoModelo(), anc = m.ancoras;
      m.parte("sol_s", malha(new T.SphereGeometry(2.6, 48, 32), mat(0xfbbf24, { emis: 0xf59e0b, ei: 1.3, rough: .9 })), V(0, 3.4, 0));
      m.raiz.add(new T.PointLight(0xfff3c4, 2.4, 140, 1));
      const P = [["mercurio", 4.2, .3, 0xa8a29e, 4.1], ["venus", 5.6, .5, 0xfcd34d, 1.6], ["terra_s", 7.2, .55, 0x38bdf8, 1], ["marte", 8.8, .4, 0xef4444, .53], ["jupiter", 13, 1.5, 0xfdba74, .084], ["saturno", 17, 1.25, 0xfde68a, .034], ["urano", 20.6, .9, 0x67e8f9, .012], ["netuno", 23.8, .88, 0x3b82f6, .006]];
      const corpos = [];
      P.forEach(([id, r, rad, cor, vel], i) => {
        const orb = new T.Mesh(new T.TorusGeometry(r, .02, 4, 160), new T.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: .45 })); orb.rotation.x = Math.PI / 2; orb.userData.semCaixa = true; m.raiz.add(orb);
        const g = new T.Group(); const pl = malha(new T.SphereGeometry(rad, 32, 24), mat(cor, { rough: .7 })); g.add(pl);
        if (id === "saturno") g.add(malha(new T.RingGeometry(rad * 1.4, rad * 2.3, 64), mat(0xe7d3a1, { op: .7, side: T.DoubleSide }), null, [Math.PI / 2.4, 0, 0]));
        if (id === "jupiter") for (let k = -2; k <= 2; k++) g.add(malha(new T.TorusGeometry(rad * Math.cos(k * .3) * 1.002, .05, 4, 48), mat(0xc2410c, { rough: .8 }), V(0, rad * Math.sin(k * .3), 0), [Math.PI / 2, 0, 0]));
        m.parte(id, g, null); anc[id] = V(); corpos.push({ id, g, r, rad, vel, a: i * 1.7 });
      });
      const ast = new T.Group(), R = rng(4), ma = mat(0x78716c, { rough: 1, flat: true }), ge = new T.IcosahedronGeometry(.1, 0);
      for (let i = 0; i < 260; i++) { const a = R() * Math.PI * 2, r = 10.3 + R() * 1.4; ast.add(malha(ge, ma, V(Math.cos(a) * r, (R() - .5) * .5, Math.sin(a) * r), null, .6 + R() * 1.4)); }
      m.parte("asteroides", ast, V(-7.6, .6, 7.6));
      let vel = 1;
      m.velocidade = v => vel = v;
      function pos() { corpos.forEach(c => { c.g.position.set(Math.cos(c.a) * c.r, 0, Math.sin(c.a) * c.r); anc[c.id].copy(c.g.position).add(V(0, c.rad + .7, 0)); }); }
      pos();
      return Object.assign(m, { atualizar(dt) { corpos.forEach(c => { c.a += dt * c.vel * .35 * vel; c.g.rotation.y += dt; }); ast.rotation.y += dt * .02 * vel; pos(); } });
    }
  };

  /* =================== MODELO ATÔMICO =================== */
  M.atomo = {
    vistas: [["Átomo", [0, 6, 20], [0, 0, 0]], ["Núcleo", [1.5, 1.2, 3], [0, 0, 0]]],
    construir() {
      const m = novoModelo();
      const pr = new T.Group(), ne = new T.Group(), mp = mat(0xef4444, { rough: .35 }), mn = mat(0x94a3b8, { rough: .35 }), g = new T.SphereGeometry(.42, 24, 18);
      fibonacci(12).forEach((n, i) => (i % 2 ? ne : pr).add(malha(g, i % 2 ? mn : mp, n.clone().multiplyScalar(.62))));
      m.parte("protons", pr, V(-.9, .9, .6)); m.parte("neutrons", ne, V(.9, -.9, .6));
      const cam = new T.Group(), el = new T.Group(), me = mat(0x60a5fa, { emis: 0x2563eb, ei: 1 });
      const camadas = [[3.2, 2], [6, 4]], eletrons = [];
      camadas.forEach(([r, n], k) => {
        const anel = new T.Mesh(new T.TorusGeometry(r, .04, 6, 140), mat(0xa78bfa, { op: .7, emis: 0x7c3aed, ei: .5 })); anel.rotation.x = Math.PI / 2 + k * .25; cam.add(anel);
        for (let i = 0; i < n; i++) { const e = malha(new T.SphereGeometry(.26, 16, 12), me); el.add(e); eletrons.push({ e, r, a: i / n * Math.PI * 2, inc: k * .25, v: 1.4 - k * .5 }); }
      });
      m.parte("eletrosfera", cam, V(-4.4, 3.4, 0)); m.parte("eletrons", el, V(6.6, .6, 0));
      return Object.assign(m, { atualizar(dt) { eletrons.forEach(o => { o.a += dt * o.v; const x = Math.cos(o.a) * o.r, z = Math.sin(o.a) * o.r; o.e.position.set(x, -z * Math.sin(o.inc), z * Math.cos(o.inc)); }); } });
    }
  };

  window.MODELOS = M;
  window.GEO = { mat, malha, rng, fibonacci, orientar, deformar, tubo, novelo, hélice, vírusMini, anticorpoGeo, celulaBola, ruido, V };
})();
