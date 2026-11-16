/* Missão SARESP 3D — modelos próprios dos temas que não tinham 3D (ou usavam um emprestado):
   rochas, misturas, placas, calor, reprodução, ISTs, tempo, reações, radiações, cores e Mendel. */
(function () {
  const T = THREE, M = window.MODELOS, G = window.GEO;
  const { novoModelo, mat, malha, rng, deformar, tubo, hélice, vírusMini, celulaBola, caixaRedonda, brilhoSprite, V } = G;
  const vidro = (cor) => mat(cor || 0xe0f2fe, { op: .2, rough: .05, side: T.DoubleSide, dw: false });
  const cil = (rt, rb, h, s, ...r) => new T.CylinderGeometry(rt, rb, h, s || 48, ...r);
  const decor = (o) => { o.traverse(x => { x.raycast = () => { }; x.userData.semCaixa = true; }); return o; }; // enfeite: não é clicável
  // texto em 3D (sprite) — letras dos alelos, fórmulas etc.
  function texto(txt, cor, alt, fundo) {
    const c = document.createElement("canvas"), k = c.getContext("2d"); k.font = "bold 96px Lexend, Arial, sans-serif";
    const w = Math.ceil(k.measureText(txt).width) + 48; c.width = w; c.height = 140;
    const g = c.getContext("2d"); g.font = "bold 96px Lexend, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    if (fundo) { g.fillStyle = fundo; g.beginPath(); g.roundRect ? g.roundRect(4, 8, w - 8, 124, 30) : g.rect(4, 8, w - 8, 124); g.fill(); }
    g.lineWidth = 10; g.strokeStyle = "rgba(15,23,42,.85)"; if (!fundo) g.strokeText(txt, w / 2, 74); g.fillStyle = cor || "#fff"; g.fillText(txt, w / 2, 74);
    const tx = new T.CanvasTexture(c); tx.anisotropy = 4; if (T.sRGBEncoding) tx.encoding = T.sRGBEncoding;
    const sp = new T.Sprite(new T.SpriteMaterial({ map: tx, transparent: true, depthWrite: false }));
    const h = alt || .8; sp.scale.set(h * w / 140, h, 1); return decor(sp);
  }
  // seta curva (tubo + ponta)
  function seta(pts, cor, r) { const g = new T.Group(), m = mat(cor, { emis: cor, ei: .35 }); r = r || .07;
    g.add(tubo(pts, r, m, false, pts.length * 14)); const a = pts[pts.length - 1], b = pts[pts.length - 2], dir = a.clone().sub(b).normalize();
    const p = malha(new T.ConeGeometry(r * 2.6, r * 6, 18), m); p.position.copy(a); p.quaternion.setFromUnitVectors(V(0, 1, 0), dir); g.add(p); return g; }
  // béquer de vidro com líquido
  function bequer(r, h, corLiq, nivel) { const g = new T.Group();
    g.add(malha(cil(r, r, h, 48).translate(0, h / 2, 0), vidro())); g.add(malha(new T.TorusGeometry(r, .03, 8, 48), vidro(0xffffff), V(0, h, 0), [Math.PI / 2, 0, 0]));
    if (corLiq != null) g.add(malha(cil(r * .95, r * .95, h * nivel, 48).translate(0, h * nivel / 2 + .01, 0), mat(corLiq, { op: .6, rough: .1, dw: false })));
    return g; }
  function chama(esc) { const g = new T.Group();
    g.add(malha(new T.ConeGeometry(.22 * esc, .8 * esc, 24).translate(0, .4 * esc, 0), mat(0x60a5fa, { op: .75, emis: 0x2563eb, ei: 1.2, dw: false })));
    g.add(malha(new T.ConeGeometry(.12 * esc, .5 * esc, 24).translate(0, .3 * esc, 0), mat(0xfde68a, { emis: 0xfbbf24, ei: 1.5 })));
    return g; }
  function bico(x, z) { const g = new T.Group(); g.position.set(x, 0, z); // bico de Bunsen
    g.add(malha(cil(.45, .55, .15), mat(0x334155, { metal: .6, rough: .3 }), V(0, .08, 0))); g.add(malha(cil(.12, .12, 1.1), mat(0x94a3b8, { metal: .8, rough: .25 }), V(0, .7, 0)));
    const c = chama(1); c.position.y = 1.25; g.add(c); g.userData.chama = c; return g; }

  /* =================== 6º · ROCHAS, SOLO E FÓSSEIS =================== */
  M.rochas = {
    vistas: [["Ciclo das rochas", [0, 7, 21], [0, 1.5, 0]], ["Fóssil", [-1.5, 2.5, 7], [-1.5, 1.5, 0]], ["Solo", [8, 3, 8], [8, 1.5, 0]]],
    construir() {
      const m = novoModelo(), R = rng(31);
      m.raiz.add(decor(malha(caixaRedonda(26, 10, .4, .18), mat(0x57534e, { rough: .9 }), V(0, -.25, 0), [-Math.PI / 2, 0, 0])));
      // magmática: vulcão + granito
      const mag = new T.Group(); mag.position.set(-8, 0, -1);
      const gV = new T.LatheGeometry([V(.01, 3.2), V(.7, 3.1), V(.9, 2.6), V(2, 1), V(3.2, 0), V(3.3, -.02)].map(p => new T.Vector2(p.x, p.y)), 64);
      mag.add(malha(deformar(gV, .08, 3), mat(0x44403c, { rough: .85 })));
      const lava = malha(cil(.62, .72, .2, 32), mat(0xf97316, { emis: 0xea580c, ei: 1.4 }), V(0, 3.08, 0)); mag.add(lava);
      const rioLava = tubo([V(.4, 3, .5), V(1, 2.2, 1.4), V(1.6, 1.2, 2.2), V(2.2, .3, 2.6)], .14, mat(0xfb923c, { emis: 0xf97316, ei: 1.2 }), false, 40); mag.add(rioLava);
      const gran = malha(deformar(new T.IcosahedronGeometry(.8, 4), .1, 2.5), mat(0xd6c4c0, { rough: .7 }), V(2.7, .6, 2.6)); mag.add(gran);
      m.parte("r_magmatica", mag, V(-8, 4.2, -1));
      // sedimentar com camadas e fóssil
      const sed = new T.Group(); sed.position.set(-1.5, 0, 0);
      const cores = [0xd6b88d, 0xb08968, 0xe9d8a6, 0x9c6644, 0xc2a878, 0xa98467];
      cores.forEach((c, i) => { const gl = new T.BoxGeometry(4.6, .5, 3, 24, 1, 12); const p = gl.attributes.position; for (let k = 0; k < p.count; k++) p.setY(k, p.getY(k) + Math.sin(p.getX(k) * .9 + i) * .04); gl.computeVertexNormals();
        sed.add(malha(gl, mat(c, { rough: .95 }), V(0, .25 + i * .5, 0))); });
      m.parte("r_sedimentar", sed, V(-1.5, 3.6, 0));
      const fos = new T.Group(); fos.position.set(-2.2, 1.25, 1.52);
      { const pts = []; for (let i = 0; i <= 140; i++) { const a = i / 140 * Math.PI * 5, r = .05 + .11 * a / Math.PI; pts.push(V(Math.cos(a) * r, Math.sin(a) * r, 0)); } fos.add(tubo(pts, .07, mat(0xf5f5f4, { rough: .5 }), false, 300)); }
      for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 4.2 + 1; fos.add(malha(new T.BoxGeometry(.03, .16, .06), mat(0xe7e5e4), V(Math.cos(a) * (.05 + .11 * a / Math.PI), Math.sin(a) * (.05 + .11 * a / Math.PI), .03), [0, 0, a])); }
      m.parte("r_fossil", fos, V(-2.2, 1.9, 2));
      // metamórfica: faixas dobradas pela pressão
      const met = new T.Group(); met.position.set(4, 0, -1);
      for (let i = 0; i < 9; i++) { const gl = new T.BoxGeometry(3, .26, 2.4, 40, 1, 1), p = gl.attributes.position; for (let k = 0; k < p.count; k++) p.setY(k, p.getY(k) + Math.sin(p.getX(k) * 2.1) * .32); gl.computeVertexNormals();
        met.add(malha(gl, mat(i % 2 ? 0x64748b : 0xe2e8f0, { rough: .4, metal: .15 }), V(0, .45 + i * .26, 0))); }
      [-1, 1].forEach(s => { met.add(seta([V(s * 3.1, 1.6, 0), V(s * 2.2, 1.6, 0)], 0xef4444, .09)); });
      m.parte("r_metamorfica", met, V(4, 4.2, -1));
      // perfil de solo (horizontes)
      const solo = new T.Group(); solo.position.set(9.5, 0, 0);
      [[0x78716c, 1.3], [0xb45309, 1], [0x92400e, .9], [0x3f2a1d, .7]].reduce((y, [c, h]) => { solo.add(malha(deformar(new T.BoxGeometry(2.4, h, 2.4, 6, 4, 6), .05, 3), mat(c, { rough: .95 }), V(0, y + h / 2, 0))); return y + h; }, 0);
      for (let i = 0; i < 70; i++) solo.add(malha(new T.ConeGeometry(.04, .35 + R() * .3, 5), mat(0x4d7c0f), V((R() - .5) * 2.2, 4.05, (R() - .5) * 2.2)));
      for (let i = 0; i < 8; i++) solo.add(malha(deformar(new T.IcosahedronGeometry(.2 + R() * .15, 2), .04, 4), mat(0x6b7280), V((R() - .5) * 1.8, .4 + R() * .6, 1.15)));
      m.parte("r_solo", solo, V(9.5, 5, 0));
      // ciclo das rochas
      const ciclo = new T.Group();
      ciclo.add(seta([V(-5.6, 3.6, 1), V(-4, 4.4, 1), V(-2.6, 3.4, 1)], 0x38bdf8), seta([V(.8, 3.4, 1), V(1.6, 4.1, 1), V(2.6, 3.6, 1)], 0xf59e0b), seta([V(4, -.1, 2.2), V(-2, -.1, 3.4), V(-6.6, -.1, 2.6)], 0xef4444));
      m.parte("r_ciclo", ciclo, V(-1.5, 5.2, 1));
      let t = 0;
      return Object.assign(m, { atualizar(dt) { t += dt; lava.material.emissiveIntensity = 1.2 + .5 * Math.sin(t * 3); rioLava.material.emissiveIntensity = 1 + .4 * Math.sin(t * 2.4 + 1); } });
    }
  };

  /* =================== 6º · MISTURAS E TRANSFORMAÇÕES =================== */
  M.misturas = {
    vistas: [["Bancada", [0, 6, 17], [0, 1.6, 0]], ["Separação", [-4, 3.5, 9], [-4, 1.6, 0]], ["Transformação", [7, 3, 7], [7, 1.4, 0]]],
    construir() {
      const m = novoModelo(), R = rng(17), gotas = [], bolhas = [], vapor = [];
      m.raiz.add(decor(malha(caixaRedonda(24, 9, .4, .18), mat(0xe7e5e4, { rough: .5 }), V(0, -.25, 0), [-Math.PI / 2, 0, 0])));
      // filtração
      const fil = new T.Group(); fil.position.set(-9, 0, 0);
      fil.add(bequer(.9, 2, 0x7dd3fc, .25));
      fil.add(malha(new T.ConeGeometry(.9, 1.1, 40, 1, true).rotateX(Math.PI).translate(0, 3, 0), vidro()));
      fil.add(malha(new T.ConeGeometry(.82, .95, 40, 1, true).rotateX(Math.PI).translate(0, 3.05, 0), mat(0xfafaf9, { rough: .9, side: T.DoubleSide })));
      fil.add(malha(cil(.12, .08, 1).translate(0, 2.1, 0), vidro()));
      fil.add(malha(cil(.7, .55, .25).translate(0, 3.25, 0), mat(0x92400e, { rough: 1 })));   // areia retida
      for (let i = 0; i < 4; i++) { const g = malha(new T.SphereGeometry(.07, 12, 8), mat(0x38bdf8, { op: .8 })); fil.add(g); gotas.push({ g, f: i / 4 }); }
      m.parte("m_filtracao", fil, V(-9, 4.2, 0));
      // decantação: água + óleo
      const dec = new T.Group(); dec.position.set(-5, 0, 0);
      dec.add(bequer(1, 2.6, null)); dec.add(malha(cil(.95, .95, 1.3).translate(0, .66, 0), mat(0x38bdf8, { op: .55, rough: .1, dw: false })));
      dec.add(malha(cil(.95, .95, .7).translate(0, 1.66, 0), mat(0xfacc15, { op: .7, rough: .1, dw: false })));
      m.parte("m_decantacao", dec, V(-5, 3.6, 0));
      // evaporação: cápsula aquecida, sal cristalizando
      const eva = new T.Group(); eva.position.set(-1, 0, 0); const b1 = bico(0, 0); eva.add(b1);
      eva.add(malha(new T.TorusGeometry(.7, .04, 8, 40), mat(0x475569, { metal: .7 }), V(0, 1.95, 0), [Math.PI / 2, 0, 0]));
      [0, 2.1, 4.2].forEach(a => eva.add(malha(cil(.03, .03, 1.95), mat(0x475569, { metal: .7 }), V(Math.cos(a) * .7, .98, Math.sin(a) * .7))));
      eva.add(malha(new T.SphereGeometry(.85, 40, 16, 0, Math.PI * 2, Math.PI * .62, Math.PI * .38).translate(0, 2.65, 0), mat(0xf5f5f4, { rough: .3, side: T.DoubleSide })));
      for (let i = 0; i < 26; i++) eva.add(malha(new T.BoxGeometry(.08, .08, .08), mat(0xffffff, { rough: .2 }), V((R() - .5) * .9, 2.02 + R() * .05, (R() - .5) * .9), [R(), R(), R()]));
      for (let i = 0; i < 10; i++) { const v = decor(malha(new T.SphereGeometry(.12, 12, 8), mat(0xffffff, { op: .35, dw: false }))); eva.add(v); vapor.push({ v, f: i / 10, x: (R() - .5) * .6 }); }
      m.parte("m_evaporacao", eva, V(-1, 4.3, 0));
      // destilação simples
      const des = new T.Group(); des.position.set(3, 0, 0); des.add(bico(0, 0));
      des.add(malha(new T.SphereGeometry(.7, 40, 30).translate(0, 2.3, 0), vidro())); des.add(malha(new T.SphereGeometry(.66, 40, 30, 0, Math.PI * 2, Math.PI * .55, Math.PI * .45).translate(0, 2.3, 0), mat(0x9333ea, { op: .55, dw: false })));
      des.add(malha(cil(.15, .15, .8).translate(0, 3.2, 0), vidro()));
      des.add(tubo([V(0, 3.5, 0), V(.8, 3.4, 0), V(2.2, 2.4, 0), V(2.6, 2, 0)], .09, vidro(), false, 40));
      des.add(malha(cil(.28, .28, 1.9), mat(0x93c5fd, { op: .35, dw: false }), V(1.5, 2.85, 0), [0, 0, -Math.PI / 3.6]));   // condensador
      const bq = bequer(.55, 1.2, 0x7dd3fc, .3); bq.position.set(2.7, 0, 0); des.add(bq);
      m.parte("m_destilacao", des, V(3.6, 4.5, 0));
      // transformação química: efervescência e mudança de cor
      const tra = new T.Group(); tra.position.set(7.5, 0, 0);
      tra.add(bequer(1, 2.4, null)); const liq = malha(cil(.95, .95, 1.6).translate(0, .82, 0), mat(0xf472b6, { op: .65, rough: .1, dw: false })); tra.add(liq);
      tra.add(malha(cil(.35, .35, .12), mat(0xffffff, { rough: .8 }), V(.2, .1, 0)));
      for (let i = 0; i < 26; i++) { const b = decor(malha(new T.SphereGeometry(.05 + R() * .05, 10, 8), mat(0xffffff, { op: .6, dw: false }))); tra.add(b); bolhas.push({ b, f: R(), x: (R() - .5) * 1.4, z: (R() - .5) * 1.4 }); }
      m.parte("m_transformacao", tra, V(7.5, 3.4, 0));
      let t = 0; const c1 = new T.Color(0xf472b6), c2 = new T.Color(0x8b5cf6);
      return Object.assign(m, { atualizar(dt) { t += dt;
        gotas.forEach(o => { const f = (t * .5 + o.f) % 1; o.g.position.set(0, 1.55 - f * 1.0, 0); o.g.visible = f < .95; });
        vapor.forEach(o => { const f = (t * .35 + o.f) % 1; o.v.position.set(o.x + Math.sin(t + o.f * 9) * .15, 2.3 + f * 2, 0); o.v.scale.setScalar(.6 + f * 1.6); o.v.material.opacity = .4 * (1 - f); });
        bolhas.forEach(o => { const f = (t * .45 + o.f) % 1; o.b.position.set(o.x * (1 - f * .2), .2 + f * 1.5, o.z * .6); });
        liq.material.color.lerpColors(c1, c2, (Math.sin(t * .4) + 1) / 2); } });
    }
  };

  /* =================== 7º · PLACAS TECTÔNICAS =================== */
  M.placas = {
    vistas: [["Corte da crosta", [0, 7, 20], [0, 0, 0]], ["Zona de choque", [-5, 3, 9], [-5, .5, 0]], ["Dorsal oceânica", [6, 3, 9], [6, 0, 0]]],
    construir() {
      const m = novoModelo(), pontosM = [], ondas = [];
      // manto e correntes de convecção
      const manto = new T.Group();
      manto.add(malha(new T.BoxGeometry(24, 3.2, 6), mat(0xea580c, { rough: .7, emis: 0x9a3412, ei: .5 }), V(0, -3.4, 0)));
      [[-5, 1], [5.5, -1]].forEach(([cx, s]) => { const pts = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2; pts.push(V(cx + Math.cos(a) * 3.2, -3.4 + Math.sin(a) * 1, 3.05)); }
        manto.add(tubo(pts, .05, mat(0xfde68a, { emis: 0xfbbf24, ei: .8 }), true, 100));
        for (let k = 0; k < 6; k++) { const p = decor(malha(new T.ConeGeometry(.16, .4, 12), mat(0xfef3c7, { emis: 0xfde68a, ei: 1 }))); manto.add(p); pontosM.push({ p, cx, s, f: k / 6 }); } });
      m.parte("p_manto", manto, V(0, -3, 3));
      // convergente: placa oceânica mergulhando sob a continental, com vulcão
      const conv = new T.Group();
      conv.add(malha(new T.BoxGeometry(9, 1.4, 6), mat(0x78716c, { rough: .9 }), V(-7.5, -.9, 0)));              // continental
      for (let i = 0; i < 4; i++) conv.add(malha(deformar(new T.ConeGeometry(1 + i * .2, 1.6 + i * .3, 24), .12, 2), mat(0x57534e, { rough: .9 }), V(-6.2 - i * 1.5, .4 + i * .1, -1.6 + (i % 2) * 1.2)));
      const vul = malha(new T.ConeGeometry(1.3, 2.2, 32, 1, true), mat(0x44403c, { rough: .85, side: T.DoubleSide }), V(-4.4, 1, .8)); conv.add(vul);
      const lav = malha(new T.SphereGeometry(.35, 20, 14), mat(0xf97316, { emis: 0xea580c, ei: 1.5 }), V(-4.4, 2.05, .8)); conv.add(lav);
      const oce = malha(new T.BoxGeometry(6, .8, 6), mat(0x475569, { rough: .8 }), V(-1.5, -1.6, 0), [0, 0, .32]); conv.add(oce);
      m.parte("p_convergente", conv, V(-4.4, 3.2, .8));
      // oceano e divergente (dorsal) com magma subindo
      const div = new T.Group();
      [[2.6, -1], [9.4, 1]].forEach(([x]) => div.add(malha(new T.BoxGeometry(5.4, .9, 6), mat(0x475569, { rough: .8 }), V(x, -1.25, 0))));
      const mag = malha(new T.BoxGeometry(1.2, 2.6, 6), mat(0xf97316, { emis: 0xea580c, ei: 1.3 }), V(6, -1.9, 0)); div.add(mag);
      [-1, 1].forEach(s => div.add(seta([V(6 + s * 1.2, -.5, 3.2), V(6 + s * 3.2, -.5, 3.2)], 0xef4444, .1)));
      m.parte("p_divergente", div, V(6, .6, 2));
      const mar = decor(malha(new T.BoxGeometry(12.2, 1.2, 6), mat(0x0ea5e9, { op: .45, rough: .05, dw: false }), V(5.9, -.2, 0))); m.raiz.add(mar);
      // terremoto: ondas a partir do epicentro
      const ter = new T.Group(); ter.position.set(-9.5, -.18, 1.5);
      ter.add(malha(new T.SphereGeometry(.22, 20, 14), mat(0xdc2626, { emis: 0xdc2626, ei: .8 })));
      for (let i = 0; i < 3; i++) { const o = decor(malha(new T.TorusGeometry(1, .04, 8, 64), mat(0xfca5a5, { op: .8, dw: false }), null, [Math.PI / 2, 0, 0])); ter.add(o); ondas.push({ o, f: i / 3 }); }
      m.parte("p_terremoto", ter, V(-9.5, 1.5, 1.5));
      // tsunami
      const tsu = new T.Group(); const gO = new T.PlaneGeometry(6, 5.8, 60, 1); const onda = malha(gO, mat(0x38bdf8, { op: .85, rough: .1, side: T.DoubleSide }), V(5.9, .42, 0), [-Math.PI / 2, 0, 0]); tsu.add(onda);
      m.parte("p_tsunami", tsu, V(9.5, 2.2, 0));
      let t = 0; const pos = gO.attributes.position, x0 = Float32Array.from(pos.array);
      return Object.assign(m, { atualizar(dt) { t += dt;
        pontosM.forEach(o => { const a = (t * .25 * o.s + o.f) * Math.PI * 2; o.p.position.set(o.cx + Math.cos(a) * 3.2, -3.4 + Math.sin(a), 3.08); o.p.rotation.z = a + (o.s > 0 ? 0 : Math.PI); });
        ondas.forEach(o => { const f = (t * .5 + o.f) % 1; o.o.scale.setScalar(.3 + f * 2.6); o.o.material.opacity = .9 * (1 - f); });
        lav.material.emissiveIntensity = 1.2 + .6 * Math.sin(t * 4);
        const c = 3 - ((t * 1.3) % 6); for (let i = 0; i < pos.count; i++) { const x = x0[i * 3]; pos.setZ(i, .55 * Math.exp(-((x - c) ** 2) * 1.4)); } pos.needsUpdate = true; gO.computeVertexNormals(); } });
    }
  };

  /* =================== 7º · CALOR E TEMPERATURA =================== */
  M.calor = {
    vistas: [["Calor em ação", [0, 6, 17], [0, 1.8, 0]], ["Condução", [-7, 3, 7], [-7, 1.8, 0]], ["Convecção", [0, 3, 7], [0, 1.8, 0]]],
    construir() {
      const m = novoModelo(), R = rng(5), part = [], raios = [];
      m.raiz.add(decor(malha(caixaRedonda(24, 9, .4, .18), mat(0x334155, { rough: .6 }), V(0, -.25, 0), [-Math.PI / 2, 0, 0])));
      // condução: barra de metal esquentando a partir da chama
      const con = new T.Group(); con.position.set(-7.5, 0, 0); con.add(bico(-2, 0));
      con.add(malha(new T.BoxGeometry(.3, 1.6, .3), mat(0x52525b), V(2.2, .8, 0)));
      const seg = []; for (let i = 0; i < 14; i++) { const s = malha(cil(.12, .12, .34, 20), mat(0x9ca3af, { metal: .8, rough: .3, emis: 0xef4444, ei: 0 }), V(-2 + i * .34, 1.75, 0), [0, 0, Math.PI / 2]); con.add(s); seg.push(s); }
      m.parte("c_conducao", con, V(-7.5, 3.4, 0));
      // convecção: panela com água circulando
      const cv = new T.Group(); cv.position.set(0, 0, 0); cv.add(bico(0, 0));
      cv.add(malha(cil(1.4, 1.3, 1.8, 48, 1, true).translate(0, 2.4, 0), mat(0x94a3b8, { metal: .85, rough: .25, side: T.DoubleSide })));
      cv.add(malha(cil(1.3, 1.3, .06).translate(0, 1.5, 0), mat(0x94a3b8, { metal: .85, rough: .25 })));
      cv.add(malha(cil(1.32, 1.32, 1.5).translate(0, 2.3, 0), mat(0x38bdf8, { op: .35, dw: false })));
      for (let i = 0; i < 22; i++) { const p = decor(malha(new T.SphereGeometry(.07, 10, 8), mat(0xffffff, { emis: 0xffffff, ei: .2 }))); cv.add(p); part.push({ p, f: R(), s: R() < .5 ? -1 : 1, z: (R() - .5) * 1 }); }
      m.parte("c_conveccao", cv, V(0, 4, 0));
      // irradiação: aquecedor emitindo ondas até o objeto
      const ir = new T.Group(); ir.position.set(5.5, 0, 0);
      ir.add(malha(caixaRedonda(1.6, 2.6, .6, .1), mat(0x1f2937, { metal: .4 }), V(-1.6, 1.3, 0)));
      for (let i = 0; i < 4; i++) ir.add(malha(cil(.06, .06, 1.2), mat(0xf97316, { emis: 0xef4444, ei: 1.6 }), V(-1.6, .6 + i * .55, .32), [0, 0, Math.PI / 2]));
      ir.add(malha(caixaRedonda(1.2, 1.2, 1.2, .15), mat(0x60a5fa, { rough: .4, emis: 0xef4444, ei: .25 }), V(2.4, .6, 0)));
      for (let k = 0; k < 3; k++) { const pts = []; for (let i = 0; i <= 60; i++) { const x = -.6 + i / 60 * 2.2; pts.push(V(x, 1.6 + (k - 1) * .5 + Math.sin(x * 9) * .12, .1)); } const r = decor(tubo(pts, .03, mat(0xfca5a5, { emis: 0xf87171, ei: 1, op: .9 }), false, 120)); ir.add(r); raios.push(r); }
      m.parte("c_irradiacao", ir, V(5.5, 3.8, 0));
      // isolante: garrafa térmica cortada
      const iso = new T.Group(); iso.position.set(10, 0, 0);
      iso.add(malha(cil(.75, .75, 3, 48, 1, true, 0, Math.PI * 1.5).translate(0, 1.5, 0), mat(0xdc2626, { rough: .4, side: T.DoubleSide })));
      iso.add(malha(cil(.6, .6, 2.7, 48, 1, true, 0, Math.PI * 1.5).translate(0, 1.5, 0), mat(0xe5e7eb, { metal: 1, rough: .08, side: T.DoubleSide })));
      iso.add(malha(cil(.55, .55, 2.3, 48).translate(0, 1.35, 0), mat(0x92400e, { op: .85 })));
      iso.add(malha(cil(.5, .55, .5).translate(0, 3.2, 0), mat(0x1f2937)));
      m.parte("c_isolante", iso, V(10, 4.2, 0));
      // termômetro
      const tm = new T.Group(); tm.position.set(-3, 0, 2.4);
      tm.add(malha(new T.CapsuleGeometry(.14, 2.6, 6, 16).translate(0, 1.8, 0), vidro())); tm.add(malha(new T.SphereGeometry(.24, 20, 14), mat(0xdc2626), V(0, .35, 0)));
      const col = malha(cil(.06, .06, 1).translate(0, .5, 0), mat(0xdc2626, { emis: 0x991b1b, ei: .3 }), V(0, .45, 0)); tm.add(col);
      for (let i = 0; i < 8; i++) tm.add(malha(new T.BoxGeometry(.16, .02, .02), mat(0x0f172a), V(.15, .8 + i * .32, 0)));
      m.parte("c_termometro", tm, V(-3, 3.6, 2.4));
      let t = 0;
      return Object.assign(m, { atualizar(dt) { t += dt; const ciclo = (t * .12) % 1;
        seg.forEach((s, i) => { const q = Math.max(0, Math.min(1, ciclo * 1.6 - i / 14)); s.material.emissiveIntensity = q * 1.4; });
        part.forEach(o => { const a = (t * .5 * o.s + o.f) * Math.PI * 2; o.p.position.set(o.s * (.6 + Math.cos(a) * .5), 2.3 + Math.sin(a) * .6, o.z); });
        raios.forEach((r, i) => { r.position.x = ((t * .8 + i * .3) % 1) * .4; r.material.opacity = .5 + .4 * Math.sin(t * 4 + i); });
        col.scale.y = .6 + 1.5 * (Math.sin(t * .5) + 1) / 2; } });
    }
  };

  /* =================== 8º · REPRODUÇÃO =================== */
  M.reproducao = {
    vistas: [["Vegetais e animais", [0, 6, 18], [0, 2, 0]], ["Flor", [-7, 4, 7], [-7, 2.8, 0]], ["Fecundação", [6, 3, 7], [6, 2, 0]]],
    construir() {
      const m = novoModelo(), R = rng(8), polens = [], esperm = [];
      m.raiz.add(decor(malha(caixaRedonda(26, 9, .4, .18), mat(0x65a30d, { rough: .9 }), V(0, -.25, 0), [-Math.PI / 2, 0, 0])));
      // flor (reprodução sexuada nas plantas)
      const flor = new T.Group(); flor.position.set(-7.5, 0, 0);
      flor.add(malha(cil(.08, .1, 2.8).translate(0, 1.4, 0), mat(0x15803d)));
      for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; const s = malha(new T.SphereGeometry(.5, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x4d7c0f, { side: T.DoubleSide }), V(Math.cos(a) * .35, 2.75, Math.sin(a) * .35), [0, -a, -1.2]); s.scale.set(1, .25, .55); flor.add(s); }
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + .3; const p = malha(new T.SphereGeometry(.85, 28, 16), mat(0xf472b6, { rough: .45 }), V(Math.cos(a) * .85, 3.05, Math.sin(a) * .85), [0, -a, .25]); p.scale.set(1, .12, .5); flor.add(p); }
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; flor.add(malha(cil(.02, .02, .8).translate(0, .4, 0), mat(0xfef9c3), V(Math.cos(a) * .3, 3, Math.sin(a) * .3), [Math.sin(a) * .35, 0, -Math.cos(a) * .35])); flor.add(malha(new T.CapsuleGeometry(.06, .12, 4, 8), mat(0xfacc15), V(Math.cos(a) * .58, 3.75, Math.sin(a) * .58))); }
      flor.add(malha(new T.LatheGeometry([[0, 0], [.22, .05], [.25, .3], [.08, .55], [.06, 1], [.14, 1.1], [0, 1.15]].map(([x, y]) => new T.Vector2(x, y)), 24), mat(0x84cc16), V(0, 2.95, 0)));
      m.parte("rp_flor", flor, V(-7.5, 4.6, 0));
      // abelha polinizando
      const abe = new T.Group(); abe.add(malha(new T.CapsuleGeometry(.14, .22, 6, 12), mat(0xfacc15), null, [0, 0, Math.PI / 2]));
      [-.08, .06].forEach(x => abe.add(malha(cil(.15, .15, .05, 16), mat(0x1c1917), V(x, 0, 0), [0, 0, Math.PI / 2])));
      [-1, 1].forEach(s => abe.add(malha(new T.SphereGeometry(.16, 12, 8), mat(0xe0f2fe, { op: .6, dw: false }), V(0, .14, s * .12), null, [1, .2, .6])));
      for (let i = 0; i < 10; i++) { const p = decor(malha(new T.SphereGeometry(.035, 8, 6), mat(0xfacc15, { emis: 0xfacc15, ei: .4 }))); flor.add(p); polens.push({ p, f: R() }); }
      m.parte("rp_polinizacao", abe, V(-5.4, 4.4, .6)); flor.add(abe);
      // semente germinando
      const sem = new T.Group(); sem.position.set(-2.5, 0, 0);
      sem.add(malha(new T.SphereGeometry(.5, 24, 16), mat(0xa16207, { rough: .7 }), V(0, .35, 0), null, [1.3, .75, 1]));
      const broto = tubo([V(0, .6, 0), V(.1, 1.1, 0), V(-.05, 1.6, 0), V(.05, 2, 0)], .05, mat(0x22c55e), false, 30); sem.add(broto);
      [-1, 1].forEach(s => { const f = malha(new T.SphereGeometry(.35, 16, 10), mat(0x4ade80), V(s * .3, 2.05, 0), [0, 0, s * .6]); f.scale.set(1, .2, .55); sem.add(f); });
      for (let i = 0; i < 6; i++) sem.add(tubo([V(0, .2, 0), V((R() - .5) * .5, -.05, (R() - .5) * .5), V((R() - .5) * .9, -.15, (R() - .5) * .9)], .015, mat(0xfef3c7), false, 16));
      m.parte("rp_semente", sem, V(-2.5, 3, 0));
      // reprodução assexuada: morango com estolão
      const mor = new T.Group(); mor.position.set(1.5, 0, 0);
      const planta = (x, e) => { const g = new T.Group(); g.position.x = x; for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; const f = malha(new T.SphereGeometry(.4 * e, 16, 10), mat(0x16a34a, { rough: .6 }), V(Math.cos(a) * .35 * e, .35 * e, Math.sin(a) * .35 * e), [0, -a, .5]); f.scale.set(1, .15, .7); g.add(f); } return g; };
      mor.add(planta(-.8, 1)); mor.add(planta(1.6, .7)); mor.add(tubo([V(-.6, .2, 0), V(.3, .5, .2), V(1.4, .15, 0)], .03, mat(0x65a30d), false, 30));
      mor.add(malha(new T.ConeGeometry(.2, .35, 16), mat(0xdc2626, { rough: .4 }), V(-.5, .2, .55), [Math.PI, 0, 0]));
      m.parte("rp_assexuada", mor, V(2, 2, 0));
      // brotamento (hidra)
      const hid = new T.Group(); hid.position.set(5.5, 0, -1.6);
      hid.add(tubo([V(0, 0, 0), V(0, .8, 0), V(.05, 1.6, 0), V(0, 2.2, 0)], .22, mat(0x86efac, { rough: .5 }), false, 30));
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; hid.add(tubo([V(0, 2.2, 0), V(Math.cos(a) * .4, 2.6, Math.sin(a) * .4), V(Math.cos(a) * .7, 2.5, Math.sin(a) * .7)], .04, mat(0x86efac), false, 20)); }
      const broto2 = new T.Group(); broto2.position.set(.2, 1.1, 0); broto2.add(tubo([V(0, 0, 0), V(.4, .3, 0), V(.6, .7, 0)], .1, mat(0xbbf7d0), false, 20)); hid.add(broto2);
      m.parte("rp_brotamento", hid, V(5.5, 3.3, -1.6));
      // fecundação: óvulo e espermatozoides
      const fec = new T.Group(); fec.position.set(9, 1.8, .8);
      fec.add(malha(new T.SphereGeometry(1.1, 40, 30), mat(0xfde68a, { op: .75, rough: .3 })));
      fec.add(malha(new T.SphereGeometry(1.25, 40, 30), mat(0xfef3c7, { op: .22, dw: false })));
      fec.add(malha(new T.SphereGeometry(.35, 24, 16), mat(0xf59e0b), V(.2, .1, .3)));
      for (let i = 0; i < 6; i++) { const s = new T.Group(); s.add(malha(new T.SphereGeometry(.12, 14, 10), mat(0xe0e7ff), null, null, [1.4, 1, 1]));
        s.add(tubo([V(-.12, 0, 0), V(-.5, .08, 0), V(-.9, -.08, 0), V(-1.3, .05, 0)], .02, mat(0xe0e7ff), false, 24)); fec.add(s); esperm.push({ s, a: i / 6 * Math.PI * 2, f: R() }); }
      m.parte("rp_fecundacao", fec, V(9, 3.6, .8));
      let t = 0;
      return Object.assign(m, { atualizar(dt) { t += dt;
        abe.position.set(1.6 + Math.cos(t * .8) * 1.3, 3.6 + Math.sin(t * 1.6) * .3, .8 + Math.sin(t * .8) * 1.3); abe.rotation.y = -t * .8;
        polens.forEach(o => { const f = (t * .3 + o.f) % 1; o.p.position.set(abe.position.x * (1 - f) + .55 * f, abe.position.y * (1 - f) + 3.9 * f, abe.position.z * (1 - f)); });
        broto2.scale.setScalar(.4 + .6 * ((t * .15) % 1));
        esperm.forEach(o => { const f = (t * .2 + o.f) % 1, d = 3.4 - f * 2.1; o.s.position.set(Math.cos(o.a) * d, Math.sin(o.a) * d * .7, .3); o.s.rotation.z = o.a + Math.PI; o.s.children[1].rotation.x = Math.sin(t * 12 + o.a) * .4; }); } });
    }
  };

  /* =================== 8º · ISTs E PREVENÇÃO =================== */
  M.ists = {
    vistas: [["Geral", [0, 4, 18], [0, 1.5, 0]], ["HIV e linfócito", [-4, 2, 8], [-4, 1.5, 0]]],
    construir() {
      const m = novoModelo(), R = rng(13);
      // HIV detalhado
      const hiv = new T.Group(); hiv.position.set(-7.5, 1.8, 0);
      hiv.add(malha(new T.SphereGeometry(1.2, 48, 36), mat(0xa78bfa, { op: .45, rough: .3, dw: false })));
      hiv.add(malha(new T.ConeGeometry(.45, 1.3, 32).rotateZ(.4), mat(0xf59e0b, { rough: .4 })));
      for (const n of G.fibonacci(30)) { const k = new T.Group(); k.add(malha(cil(.05, .05, .3, 8).translate(0, .15, 0), mat(0x7c3aed))); k.add(malha(new T.IcosahedronGeometry(.13, 1), mat(0x22d3ee, { rough: .4 }), V(0, .35, 0))); k.position.copy(n.clone().multiplyScalar(1.15)); k.quaternion.setFromUnitVectors(V(0, 1, 0), n); hiv.add(k); }
      m.parte("i_hiv", hiv, V(-7.5, 3.5, 0));
      // linfócito T CD4 com receptores e vírus chegando
      const lin = celulaBola(1.6, 0xe2e8f0, 0x6d28d9, 1.05, V(.2, .1, .2), .6); lin.position.set(-2.5, 1.8, 0);
      for (const n of G.fibonacci(40)) { const r = malha(new T.CapsuleGeometry(.05, .2, 4, 8), mat(0x0ea5e9), n.clone().multiplyScalar(1.68)); r.quaternion.setFromUnitVectors(V(0, 1, 0), n); lin.add(r); }
      const vc = vírusMini(.3, 0xc4b5fd); vc.position.set(-1.9, .2, 0); lin.add(vc);
      m.parte("i_linfocito", lin, V(-2.5, 4, 0));
      // sífilis (bactéria espiralada)
      const tre = new T.Group(); tre.position.set(1.8, 1.8, 0);
      { const pts = []; for (let i = 0; i <= 160; i++) { const x = -1.8 + i / 160 * 3.6, a = i / 160 * Math.PI * 12; pts.push(V(x, Math.cos(a) * .22, Math.sin(a) * .22)); } tre.add(tubo(pts, .08, mat(0xf472b6, { rough: .4 }), false, 400)); }
      m.parte("i_sifilis", tre, V(1.8, 3, 0));
      // HPV (vírus pequeno, sem envelope) — prevenido pela vacina
      const hpv = new T.Group(); hpv.position.set(5.2, 1.8, 0);
      hpv.add(malha(new T.IcosahedronGeometry(.75, 1), mat(0x34d399, { rough: .5, flat: true })));
      for (const n of G.fibonacci(72)) hpv.add(malha(new T.CylinderGeometry(.09, .09, .1, 5), mat(0x10b981), n.clone().multiplyScalar(.74), null));
      m.parte("i_hpv", hpv, V(5.2, 3.2, 0));
      // testagem: teste rápido
      const tst = new T.Group(); tst.position.set(9, 1.5, 0); tst.rotation.x = -.5;
      tst.add(malha(caixaRedonda(1.3, 3.2, .25, .1), mat(0xf8fafc, { rough: .4 })));
      tst.add(malha(new T.BoxGeometry(.7, 1.1, .05), mat(0xfefce8), V(0, .5, .13)));
      [.75, .3].forEach((y, i) => tst.add(malha(new T.BoxGeometry(.6, .07, .06), mat(i ? 0xdc2626 : 0xb91c1c, { emis: 0x7f1d1d, ei: .2 }), V(0, y, .15))));
      tst.add(malha(cil(.22, .22, .06, 32), mat(0xe2e8f0), V(0, -.9, .13), [Math.PI / 2, 0, 0]));
      m.parte("i_testagem", tst, V(9, 3.6, 0));
      // escudo da prevenção
      const esc = new T.Group(); esc.position.set(0, -1.6, 2.5);
      const sh = new T.Shape(); sh.moveTo(0, .9); sh.quadraticCurveTo(.8, .9, .9, .6); sh.quadraticCurveTo(.9, -.4, 0, -1); sh.quadraticCurveTo(-.9, -.4, -.9, .6); sh.quadraticCurveTo(-.8, .9, 0, .9);
      esc.add(malha(new T.ExtrudeGeometry(sh, { depth: .2, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 4 }), mat(0x14b8a6, { metal: .4, rough: .3 })));
      esc.add(tubo([V(-.35, 0, .32), V(-.08, -.3, .32), V(.4, .35, .32)], .07, mat(0xffffff), false, 20));
      m.parte("i_prevencao", esc, V(0, -.2, 2.5));
      let t = 0;
      return Object.assign(m, { atualizar(dt) { t += dt; hiv.rotation.y = t * .3; hpv.rotation.y = -t * .4; tre.rotation.x = t * 2; vc.position.x = -1.9 - Math.max(0, Math.sin(t * .8)) * .9; esc.rotation.y = Math.sin(t * .7) * .4; } });
    }
  };

  /* =================== 8º · CLIMA E PREVISÃO DO TEMPO =================== */
  M.tempo = {
    vistas: [["Estação meteorológica", [0, 6, 18], [0, 2.5, 0]], ["Instrumentos", [-3, 3.5, 9], [-3, 2, 0]]],
    construir() {
      const m = novoModelo(), R = rng(21), chuva = [];
      m.raiz.add(decor(malha(new T.CylinderGeometry(12, 12, .4, 64), mat(0x4d7c0f, { rough: 1 }), V(0, -.2, 0))));
      const branco = () => mat(0xf8fafc, { rough: .45 });
      // abrigo meteorológico (termômetro e higrômetro)
      const abr = new T.Group(); abr.position.set(-7, 0, 0);
      [[-.8, -.6], [.8, -.6], [-.8, .6], [.8, .6]].forEach(([x, z]) => abr.add(malha(new T.BoxGeometry(.12, 2, .12), branco(), V(x, 1, z))));
      abr.add(malha(new T.BoxGeometry(2, 1.6, 1.6), branco(), V(0, 2.8, 0)));
      for (let i = 0; i < 6; i++) abr.add(malha(new T.BoxGeometry(2.02, .06, .2), mat(0xe2e8f0), V(0, 2.1 + i * .26, .82), [-.5, 0, 0]));
      abr.add(malha(new T.BoxGeometry(2.3, .12, 1.9), branco(), V(0, 3.68, 0), [0, 0, .06]));
      m.parte("t_termometro", abr, V(-7, 4.4, 0));
      // pluviômetro com nível de água
      const plu = new T.Group(); plu.position.set(-3.2, 0, 1);
      plu.add(malha(new T.BoxGeometry(.1, 1.5, .1), mat(0x64748b), V(0, .75, 0)));
      plu.add(malha(cil(.45, .45, 1.6, 40, 1, true).translate(0, 2.3, 0), vidro())); plu.add(malha(cil(.45, .45, .04).translate(0, 1.5, 0), vidro()));
      const nivel = malha(cil(.42, .42, 1).translate(0, .5, 0), mat(0x38bdf8, { op: .65, dw: false }), V(0, 1.52, 0)); plu.add(nivel);
      for (let i = 0; i < 8; i++) plu.add(malha(new T.BoxGeometry(.14, .02, .02), mat(0x0f172a), V(.46, 1.6 + i * .18, 0)));
      plu.add(malha(new T.ConeGeometry(.6, .5, 40, 1, true).rotateX(Math.PI).translate(0, 3.3, 0), mat(0x94a3b8, { metal: .7, rough: .3, side: T.DoubleSide })));
      m.parte("t_pluviometro", plu, V(-3.2, 4.2, 1));
      // anemômetro
      const ane = new T.Group(); ane.position.set(1, 0, -1); ane.add(malha(cil(.06, .08, 4.4).translate(0, 2.2, 0), mat(0x94a3b8, { metal: .8, rough: .3 })));
      const gir = new T.Group(); gir.position.y = 4.5; ane.add(gir);
      for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; gir.add(malha(cil(.025, .025, .9), mat(0x94a3b8, { metal: .8 }), V(Math.cos(a) * .45, 0, Math.sin(a) * .45), [0, -a, Math.PI / 2]));
        gir.add(malha(new T.SphereGeometry(.22, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xef4444, { side: T.DoubleSide }), V(Math.cos(a) * .9, 0, Math.sin(a) * .9), [0, -a, Math.PI / 2])); }
      m.parte("t_anemometro", ane, V(1, 5.3, -1));
      // biruta (direção do vento)
      const bir = new T.Group(); bir.position.set(4.5, 0, 1); bir.add(malha(cil(.05, .06, 3.6).translate(0, 1.8, 0), mat(0x64748b, { metal: .6 })));
      const manga = new T.Group(); manga.position.y = 3.5; bir.add(manga);
      for (let i = 0; i < 5; i++) manga.add(malha(cil(.32 - i * .05, .27 - i * .05, .4, 24, 1, true), mat(i % 2 ? 0xffffff : 0xf97316, { side: T.DoubleSide }), V(.25 + i * .4, 0, 0), [0, 0, Math.PI / 2]));
      m.parte("t_biruta", bir, V(5.5, 4.3, 1));
      // barômetro
      const bar = new T.Group(); bar.position.set(8, 0, -1); bar.add(malha(new T.BoxGeometry(.18, 2, .18), mat(0x92400e), V(0, 1, 0)));
      bar.add(malha(cil(.85, .85, .22, 48), mat(0xb45309, { metal: .5, rough: .3 }), V(0, 2.6, 0), [Math.PI / 2, 0, 0]));
      bar.add(malha(cil(.72, .72, .02, 48), mat(0xfefce8), V(0, 2.6, .12), [Math.PI / 2, 0, 0]));
      for (let i = 0; i < 11; i++) { const a = -2.2 + i * .44; bar.add(malha(new T.BoxGeometry(.03, .12, .01), mat(0x0f172a), V(Math.sin(a) * .6, 2.6 + Math.cos(a) * .6, .14), [0, 0, -a])); }
      const pont = malha(new T.BoxGeometry(.04, .55, .02), mat(0xdc2626), null); pont.geometry.translate(0, .25, 0); pont.position.set(0, 2.6, .16); bar.add(pont);
      m.parte("t_barometro", bar, V(8, 3.9, -1));
      // nuvem com chuva
      const nuv = new T.Group(); nuv.position.set(-3.2, 7.2, 1);
      [[0, 0, 0, 1], [.9, -.15, .1, .75], [-.9, -.2, 0, .7], [.4, .45, -.1, .7], [-.4, .35, .2, .65]].forEach(([x, y, z, r]) => nuv.add(malha(new T.SphereGeometry(r, 24, 16), mat(0x94a3b8, { rough: .9 }), V(x, y, z))));
      for (let i = 0; i < 18; i++) { const d = decor(malha(new T.CapsuleGeometry(.025, .18, 3, 6), mat(0x60a5fa, { op: .8, dw: false }))); nuv.add(d); chuva.push({ d, f: R(), x: (R() - .5) * 1.6, z: (R() - .5) * .8 }); }
      m.parte("t_nuvem", nuv, V(-3.2, 8.4, 1));
      let t = 0;
      return Object.assign(m, { atualizar(dt) { t += dt; gir.rotation.y -= dt * 4; manga.rotation.y = .6 + Math.sin(t * .5) * .5; manga.rotation.z = Math.sin(t * 3) * .05;
        pont.rotation.z = -.4 + Math.sin(t * .3) * .9; nivel.scale.y = .2 + ((t * .05) % 1) * 1.3;
        chuva.forEach(o => { const f = (t * .9 + o.f) % 1; o.d.position.set(o.x, -.6 - f * 3.4, o.z); }); } });
    }
  };

  /* =================== 9º · REAÇÕES QUÍMICAS (conservação da massa) =================== */
  M.reacao = {
    vistas: [["Balança", [0, 5, 16], [0, 2.8, 0]], ["Reagentes", [-4, 4, 7], [-4, 3.3, 0]], ["Produtos", [4, 4, 7], [4, 3.3, 0]]],
    construir() {
      const m = novoModelo();
      const H = () => mat(0xf8fafc, { rough: .3 }), O = () => mat(0xef4444, { rough: .3 });
      const lig = (a, b, g) => { const d = b.clone().sub(a), c = malha(cil(.06, .06, d.length(), 12), mat(0xcbd5e1), a.clone().add(b).multiplyScalar(.5)); c.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); g.add(c); };
      const h2 = (p) => { const g = new T.Group(); g.position.copy(p); g.add(malha(new T.SphereGeometry(.28, 24, 16), H(), V(-.25, 0, 0)), malha(new T.SphereGeometry(.28, 24, 16), H(), V(.25, 0, 0))); return g; };
      const o2 = (p) => { const g = new T.Group(); g.position.copy(p); g.add(malha(new T.SphereGeometry(.42, 24, 16), O(), V(-.36, 0, 0)), malha(new T.SphereGeometry(.42, 24, 16), O(), V(.36, 0, 0))); return g; };
      const agua = (p) => { const g = new T.Group(); g.position.copy(p); g.add(malha(new T.SphereGeometry(.42, 24, 16), O())); g.add(malha(new T.SphereGeometry(.28, 24, 16), H(), V(-.45, .32, 0)), malha(new T.SphereGeometry(.28, 24, 16), H(), V(.45, .32, 0))); return g; };
      // balança de pratos
      const bal = new T.Group();
      bal.add(malha(caixaRedonda(4, .4, 2, .12), mat(0x334155, { metal: .5, rough: .4 }), V(0, .2, 0), [-Math.PI / 2, 0, 0]));
      bal.add(malha(cil(.15, .2, 3.4), mat(0x94a3b8, { metal: .85, rough: .25 }), V(0, 2, 0)));
      const braco = new T.Group(); braco.position.y = 3.7; bal.add(braco);
      braco.add(malha(new T.BoxGeometry(8.4, .14, .14), mat(0x94a3b8, { metal: .85, rough: .25 })));
      braco.add(malha(new T.ConeGeometry(.12, .5, 12), mat(0xdc2626), V(0, .35, 0)));
      m.parte("q_balanca", bal, V(0, 5, 0));
      const prato = (x) => { const g = new T.Group(); g.position.set(x, 3.7, 0); [0, 2.1, 4.2].forEach(a => g.add(malha(cil(.015, .015, 1.6), mat(0xcbd5e1), V(Math.cos(a) * .7, -.8, Math.sin(a) * .7), [Math.sin(a) * .4, 0, -Math.cos(a) * .4])));
        g.add(malha(new T.SphereGeometry(1.6, 40, 12, 0, Math.PI * 2, Math.PI * .8, Math.PI * .2).translate(0, -.2, 0), mat(0xd4d4d8, { metal: .8, rough: .25, side: T.DoubleSide }))); return g; };
      const pE = prato(-4), pD = prato(4); m.raiz.add(decor(pE)); m.raiz.add(decor(pD));
      const reag = new T.Group(); reag.position.set(-4, 2.4, 0); reag.add(h2(V(-.6, .3, .3)), h2(V(.6, .3, .3)), o2(V(0, .9, -.3)));
      m.parte("q_reagentes", reag, V(-4, 4.4, 0));
      const prod = new T.Group(); prod.position.set(4, 2.4, 0); prod.add(agua(V(-.6, .3, 0)), agua(V(.6, .5, .1)));
      m.parte("q_produtos", prod, V(4, 4.4, 0));
      const eq = new T.Group(); eq.position.set(0, 6.4, 0);
      eq.add(seta([V(-1, 0, 0), V(1, 0, 0)], 0xf59e0b, .08));
      eq.add(texto("2 H₂ + O₂", "#fde68a", .6).translateX(-3.2)); eq.add(texto("2 H₂O", "#bae6fd", .6).translateX(2.8));
      m.parte("q_equacao", eq, V(0, 7.1, 0));
      const lbl = texto("Massa antes = massa depois", "#fff", .45, "rgba(13,148,136,.92)"); lbl.position.set(0, -.4, 2); m.raiz.add(lbl);
      let t = 0;
      return Object.assign(m, { atualizar(dt) { t += dt; reag.rotation.y = Math.sin(t * .6) * .4; prod.rotation.y = -Math.sin(t * .6) * .4; braco.rotation.z = Math.sin(t * 1.4) * .012; } });
    }
  };

  /* =================== 9º · RADIAÇÕES ELETROMAGNÉTICAS =================== */
  M.espectro = {
    vistas: [["Espectro", [0, 4, 20], [0, 1.6, 0]], ["Ondas longas", [-7, 3, 9], [-7, 1.6, 0]], ["Ondas curtas", [7, 3, 9], [7, 1.6, 0]]],
    construir() {
      const m = novoModelo();
      // onda que encurta da esquerda (rádio) para a direita (gama)
      const n = 900, pts = []; let fase = 0;
      for (let i = 0; i <= n; i++) { const x = -12 + i / n * 24, f = .35 + Math.pow(i / n, 2.4) * 9; fase += f * (24 / n); pts.push(V(x, Math.sin(fase) * .55, 0)); }
      const geo = new T.TubeGeometry(new T.CatmullRomCurve3(pts), 2400, .05, 6, false), cor = [], c = new T.Color(), pa = geo.attributes.position;
      for (let i = 0; i < pa.count; i++) { const u = (pa.getX(i) + 12) / 24; c.setHSL(.75 - u * .75, .85, .6); cor.push(c.r, c.g, c.b); }
      geo.setAttribute("color", new T.Float32BufferAttribute(cor, 3));
      m.raiz.add(decor(new T.Mesh(geo, new T.MeshBasicMaterial({ vertexColors: true }))));
      const pulso = brilhoSprite("#ffffff", 1.2, .9); m.raiz.add(pulso);
      const base = (x) => { const g = new T.Group(); g.position.set(x, 2, 0); return g; };
      // rádio: torre
      const rad = base(-10); for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + .78; rad.add(malha(cil(.03, .03, 3.2), mat(0xef4444, { metal: .5 }), V(Math.cos(a) * .3, 1.6, Math.sin(a) * .3), [Math.sin(a) * .09, 0, -Math.cos(a) * .09])); }
      for (let i = 0; i < 6; i++) rad.add(malha(new T.TorusGeometry(.32 - i * .045, .02, 6, 4), mat(0xf8fafc), V(0, .3 + i * .5, 0), [Math.PI / 2, 0, Math.PI / 4]));
      rad.add(malha(new T.SphereGeometry(.12, 12, 8), mat(0xef4444, { emis: 0xef4444, ei: 1.5 }), V(0, 3.3, 0)));
      m.parte("e_radio", rad, V(-10, 6, 0));
      // micro-ondas
      const mic = base(-5.8); mic.add(malha(caixaRedonda(2, 1.2, 1.2, .1), mat(0xe5e7eb, { metal: .3, rough: .4 }), V(0, .6, 0)));
      mic.add(malha(new T.BoxGeometry(1.2, .8, .02), mat(0x0f172a, { op: .8 }), V(-.25, .6, .61)));
      for (let i = 0; i < 4; i++) mic.add(malha(cil(.05, .05, .04, 16), mat(0x334155), V(.7, .9 - i * .22, .61), [Math.PI / 2, 0, 0]));
      const luzMic = malha(new T.BoxGeometry(1.1, .7, .01), mat(0xfde68a, { emis: 0xfbbf24, ei: .5, op: .4 }), V(-.25, .6, .58)); mic.add(luzMic);
      m.parte("e_micro", mic, V(-5.8, 3.8, 0));
      // celular
      const cel = base(-2.6); cel.add(malha(caixaRedonda(.7, 1.4, .12, .1), mat(0x1e293b, { metal: .5, rough: .3 }), V(0, .7, 0)));
      cel.add(malha(new T.PlaneGeometry(.6, 1.2), mat(0x38bdf8, { emis: 0x0ea5e9, ei: .7 }), V(0, .7, .065)));
      for (let i = 0; i < 3; i++) cel.add(malha(new T.TorusGeometry(.25 + i * .18, .025, 6, 24, Math.PI / 2), mat(0x38bdf8, { emis: 0x0ea5e9, ei: .6 }), V(0, 1.5, 0), [0, 0, Math.PI / 4]));
      m.parte("e_celular", cel, V(-2.6, 4, 0));
      // infravermelho: controle remoto e calor
      const inf = base(.3); inf.add(malha(caixaRedonda(.45, 1.5, .25, .1), mat(0x27272a), V(0, .75, 0), [-.3, 0, 0]));
      inf.add(malha(new T.SphereGeometry(.07, 12, 8), mat(0xef4444, { emis: 0xdc2626, ei: 2 }), V(0, 1.5, .25)));
      m.parte("e_infra", inf, V(.3, 3.8, 0));
      // luz visível: prisma com arco-íris
      const vis = base(3.4); const pri = new T.CylinderGeometry(.7, .7, 1, 3); vis.add(malha(pri, vidro(0xffffff), V(0, .8, 0), [Math.PI / 2, 0, 0]));
      [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x3b82f6, 0x8b5cf6].forEach((c, i) => vis.add(malha(new T.BoxGeometry(1.4, .05, .05), mat(c, { emis: c, ei: 1 }), V(1.1, .95 - i * .09, 0), [0, 0, -.2 - i * .05])));
      m.parte("e_visivel", vis, V(3.4, 3.6, 0));
      // ultravioleta: sol e protetor
      const uv = base(6.3); uv.add(malha(new T.SphereGeometry(.55, 32, 20), mat(0xfacc15, { emis: 0xf59e0b, ei: 1.2 }), V(0, 1.3, 0)));
      for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; uv.add(malha(new T.ConeGeometry(.08, .35, 8), mat(0xa855f7, { emis: 0x9333ea, ei: 1 }), V(Math.cos(a) * .85, 1.3 + Math.sin(a) * .85, 0), [0, 0, a - Math.PI / 2])); }
      uv.add(malha(caixaRedonda(.45, .8, .2, .08), mat(0xfb923c), V(.75, .2, .3)));
      m.parte("e_uv", uv, V(6.3, 3.8, 0));
      // raio X: chapa com ossos
      const rx = base(9); rx.add(malha(new T.BoxGeometry(1.3, 1.7, .05), mat(0x0f172a, { emis: 0x1e3a8a, ei: .4 }), V(0, .9, 0)));
      [[-.3, .9, 0], [.3, .9, 0]].forEach(([x, y]) => rx.add(malha(cil(.08, .08, 1.1), mat(0xe0f2fe, { emis: 0xbae6fd, ei: .6 }), V(x, y, .04))));
      rx.add(malha(new T.SphereGeometry(.17, 16, 10), mat(0xe0f2fe, { emis: 0xbae6fd, ei: .6 }), V(0, 1.5, .04), null, [2, 1, .5]));
      m.parte("e_raiox", rx, V(9, 3.6, 0));
      // gama: fonte radioativa (uso médico)
      const gam = base(11.4); gam.add(malha(cil(.35, .35, .8), mat(0x334155, { metal: .8, rough: .3 }), V(0, .4, 0)));
      gam.add(malha(new T.SphereGeometry(.18, 16, 10), mat(0x84cc16, { emis: 0x65a30d, ei: 2 }), V(0, .95, 0)));
      m.parte("e_gama", gam, V(11.4, 3.3, 0));
      const l1 = texto("onda longa · menos energia", "#c4b5fd", .4); l1.position.set(-8, -1.3, 0); m.raiz.add(l1);
      const l2 = texto("onda curta · mais energia", "#fca5a5", .4); l2.position.set(8, -1.3, 0); m.raiz.add(l2);
      let t = 0;
      return Object.assign(m, { atualizar(dt) { t += dt; const u = (t * .12) % 1, i = Math.floor(u * n); pulso.position.copy(pts[i]); luzMic.material.opacity = .25 + .25 * Math.sin(t * 3); } });
    }
  };

  /* =================== 9º · LUZ E CORES =================== */
  M.cores = {
    vistas: [["Mistura de luzes", [0, 3, 16], [0, 2.5, -1]], ["Prisma", [7, 3, 8], [7, 2, 0]]],
    construir() {
      const m = novoModelo();
      // tela escura onde as luzes se somam
      const tela = new T.Group(); tela.position.set(-2, 3, -3);
      tela.add(malha(caixaRedonda(9, 6, .3, .1), mat(0x111827, { rough: .9 })));
      const disco = (c, x, y) => { const d = decor(malha(new T.CircleGeometry(1.6, 64), new T.MeshBasicMaterial({ color: c, blending: T.AdditiveBlending, transparent: true, depthWrite: false }), V(x, y, .2))); return d; };
      const dR = disco(0xff0000, -.8, .5), dG = disco(0x00ff00, .8, .5), dB = disco(0x0000ff, 0, -.85);
      m.parte("co_mistura", tela, V(-2, 6.3, -3)); tela.add(dR, dG, dB);
      // três refletores
      const luzes = new T.Group();
      const refl = (c, x, y, alvo) => { const g = new T.Group(); g.position.set(x, y, 3.5); g.add(malha(cil(.35, .5, .9, 32, 1, true), mat(0x334155, { metal: .7, side: T.DoubleSide }), null, [Math.PI / 2, 0, 0]));
        g.add(malha(new T.CircleGeometry(.36, 32), mat(c, { emis: c, ei: 2 }), V(0, 0, -.45), [Math.PI, 0, 0])); g.lookAt(alvo); return g; };
      luzes.add(refl(0xff3b3b, -4.5, 4.8, V(-2.8, 3.5, -3)), refl(0x22ff55, .5, 4.8, V(-1.2, 3.5, -3)), refl(0x3b6bff, -2, .6, V(-2, 2.1, -3)));
      m.parte("co_rgb", luzes, V(-2, 6, 3.5));
      // prisma decompondo a luz branca
      const pri = new T.Group(); pri.position.set(7, 0, 0);
      pri.add(malha(new T.BoxGeometry(2.4, .3, 2), mat(0x475569, { metal: .3 }), V(0, .15, 0)));
      pri.add(malha(new T.CylinderGeometry(.9, .9, 1.6, 3), mat(0xe0f2fe, { op: .35, rough: .02, side: T.DoubleSide, dw: false }), V(0, 1.1, 0), [Math.PI / 2, 0, 0]));
      m.parte("co_prisma", pri, V(7, 3, 0));
      pri.add(decor(malha(cil(.06, .06, 3.2), new T.MeshBasicMaterial({ color: 0xffffff }), V(-2.2, 1.2, 0), [0, 0, Math.PI / 2 - .2])));
      [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0080ff, 0x4b0082, 0x8b00ff].forEach((c, i) => { const r = decor(malha(new T.BoxGeometry(3, .06, .06), new T.MeshBasicMaterial({ color: c }), V(2, 1.05 - i * .12, 0), [0, 0, -.15 - i * .07])); pri.add(r); });
      // objeto colorido: maçã vermelha reflete só o vermelho
      const mac = new T.Group(); mac.position.set(3.2, 0, 2);
      mac.add(malha(new T.SphereGeometry(.8, 40, 30), mat(0xdc2626, { rough: .25 }), V(0, .85, 0), null, [1, .92, 1]));
      mac.add(malha(cil(.04, .05, .45), mat(0x78350f), V(0, 1.75, 0))); { const f = malha(new T.SphereGeometry(.25, 16, 10), mat(0x16a34a), V(.2, 1.8, 0), [0, 0, -.6]); f.scale.set(1, .25, .55); mac.add(f); }
      m.parte("co_objeto", mac, V(3.2, 2.6, 2));
      let t = 0;
      return Object.assign(m, { atualizar(dt) { t += dt; const k = .9 + .1 * Math.sin(t);
        dR.position.x = -.8 + Math.sin(t * .5) * .3; dG.position.x = .8 - Math.sin(t * .5) * .3; dB.position.y = -.85 + Math.sin(t * .5) * .25; dR.material.opacity = dG.material.opacity = dB.material.opacity = k; } });
    }
  };

  /* =================== 9º · HEREDITARIEDADE (MENDEL) =================== */
  M.mendel = {
    vistas: [["Cruzamento Aa × Aa", [0, 5, 16], [0, 2.5, 0]], ["Quadro de Punnett", [2, 4, 8], [2, 2.5, 0]]],
    construir() {
      const m = novoModelo();
      const amarela = () => mat(0xfacc15, { rough: .35 }), verde = () => mat(0x4ade80, { rough: .35 });
      const ervilha = (cor, p, r) => malha(deformar(new T.SphereGeometry(r || .35, 28, 20), .015, 6), cor, p);
      // pais: duas plantas de ervilha com vagem
      const pais = new T.Group();
      [-7.5, -4.5].forEach(x => { const g = new T.Group(); g.position.set(x, 0, 0);
        g.add(malha(new T.CylinderGeometry(.6, .45, .8, 32), mat(0xb45309, { rough: .8 }), V(0, .4, 0)));
        g.add(tubo([V(0, .8, 0), V(.2, 2, 0), V(-.1, 3.2, 0), V(.1, 4, 0)], .05, mat(0x16a34a), false, 30));
        [[.3, 2.2, 1], [-.35, 3, -1]].forEach(([fx, fy, s]) => { const f = malha(new T.SphereGeometry(.4, 16, 10), mat(0x22c55e), V(fx, fy, 0), [0, 0, s * .8]); f.scale.set(1, .2, .6); g.add(f); });
        const vag = malha(new T.CapsuleGeometry(.2, .9, 6, 16), mat(0x65a30d, { rough: .5 }), V(.45, 3.4, .1), [0, 0, -1]); g.add(vag);
        g.add(ervilha(amarela(), V(0, 4.3, 0), .28)); pais.add(g); });
      m.parte("g_pais", pais, V(-6, 5.2, 0));
      const x = texto("Aa  ×  Aa", "#fde68a", .7); x.position.set(-6, 5.2, 0);
      // cromossomos homólogos com o gene (alelos A e a)
      const cro = new T.Group(); cro.position.set(-6, 1.6, 2.4);
      [-.5, .5].forEach((dx, i) => { const g = new T.Group(); g.position.x = dx;
        [-1, 1].forEach(s => g.add(malha(new T.CapsuleGeometry(.14, 1.4, 6, 16), mat(0x8b5cf6, { rough: .4 }), V(s * .14, 0, 0), [0, 0, s * .12])));
        g.add(malha(cil(.32, .32, .14, 24), mat(i ? 0x22c55e : 0xfacc15, { emis: i ? 0x16a34a : 0xca8a04, ei: .4 }), V(0, .35, 0))); cro.add(g); });
      m.parte("g_cromossomo", cro, V(-6, 3, 2.4));
      // gametas
      const gam = new T.Group(); gam.position.set(-1.6, 2.6, 0);
      [["A", 0xfacc15, 1], ["a", 0x4ade80, -1]].forEach(([l, c, s]) => { const b = malha(new T.SphereGeometry(.45, 28, 20), mat(c, { op: .55, dw: false }), V(0, s * .9, 0)); gam.add(b); });
      m.parte("g_gametas", gam, V(-1.6, 4.2, 0));
      // quadro de Punnett 2×2
      const pun = new T.Group(); pun.position.set(2.6, 2.6, 0);
      pun.add(malha(caixaRedonda(4.6, 4.6, .2, .08), mat(0x1e293b), V(0, 0, -.15)));
      [[-1, 1, "AA", 1], [1, 1, "Aa", 1], [-1, -1, "Aa", 1], [1, -1, "aa", 0]].forEach(([cx, cy, g, dom]) => {
        pun.add(malha(caixaRedonda(2, 2, .1, .08), mat(0x334155), V(cx * 1.08, cy * 1.08, 0)));
        const e = ervilha(dom ? amarela() : verde(), V(cx * 1.08, cy * 1.08 + .2, .45), .42); e.userData.dom = dom; pun.add(e);
        const tx = texto(g, dom ? "#fde68a" : "#86efac", .45); tx.position.set(cx * 1.08, cy * 1.08 - .62, .3); pun.add(tx); });
      m.parte("g_punnett", pun, V(2.6, 5.4, 0));
      ["A", "a"].forEach((l, i) => { const a = texto(l, "#fff", .55); a.position.set(2.6 + (i ? 1.08 : -1.08), 5.3, 0); m.raiz.add(a); const b = texto(l, "#fff", .55); b.position.set(-.1, 2.6 + (i ? -1.08 : 1.08), 0); m.raiz.add(b); });
      ["A", "a"].forEach((l, i) => { const a = texto(l, "#0f172a", .5); a.position.set(-1.6, 2.6 + (i ? -.9 : .9), .5); m.raiz.add(a); });
      m.raiz.add(x);
      // resultado 3:1
      const res = new T.Group(); res.position.set(8, 1, 0);
      for (let i = 0; i < 3; i++) res.add(ervilha(amarela(), V(-.6 + i * .6, 1.2, 0), .28));
      res.add(ervilha(verde(), V(0, .4, 0), .28));
      m.parte("g_proporcao", res, V(8, 3.2, 0));
      const pr = texto("3 amarelas : 1 verde", "#e2e8f0", .4); pr.position.set(8, 0, 0); m.raiz.add(pr);
      let t = 0;
      return Object.assign(m, { atualizar(dt) { t += dt; gam.rotation.y = t * .6; cro.rotation.y = Math.sin(t * .5) * .5; res.rotation.y = Math.sin(t * .4) * .3; } });
    }
  };
})();
