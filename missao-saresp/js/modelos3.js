/* Missão SARESP 3D — modelos que tiram repetições de simulador entre temas da mesma turma
   (usinas, evolução, zona habitável) e o tema novo do 7º ano: grupos de invertebrados (modelo + jogo de classificação). */
(function () {
  const T = THREE, M = window.MODELOS, G = window.GEO;
  const { novoModelo, mat, malha, rng, deformar, tubo, caixaRedonda, V } = G;
  const cil = (rt, rb, h, s, ...r) => new T.CylinderGeometry(rt, rb, h, s || 40, ...r);
  const decor = (o) => { o.traverse(x => { x.raycast = () => { }; x.userData.semCaixa = true; }); return o; };
  const pernas = (g, n, base, comp, cor, esp) => { for (let i = 0; i < n; i++) { const s = i % 2 ? 1 : -1, k = Math.floor(i / 2), z = (k - (n / 4 - .5)) * esp;
      g.add(tubo([V(base.x, base.y, z), V(s * comp * .55, base.y + .35, z * 1.2), V(s * comp, -.25, z * 1.5)], .045, mat(cor, { rough: .5 }), false, 20)); } };

  /* ===== construtores dos invertebrados (usados pelo modelo e pelo jogo) ===== */
  const INV = {
    porifero() { const g = new T.Group(), R = rng(3);
      const lat = new T.LatheGeometry([[.5, 0], [.7, .4], [.85, 1.4], [.8, 2.3], [.6, 2.8], [.5, 2.8], [.62, 2.2], [.62, .9], [.3, .3], [0, .3]].map(([x, y]) => new T.Vector2(x, y)), 48);
      g.add(malha(deformar(lat, .05, 3), mat(0xf59e0b, { rough: .9 })));
      for (let i = 0; i < 46; i++) { const a = R() * 6.283, y = .3 + R() * 2.3, r = .62 + .2 * Math.sin(y * 1.2); g.add(malha(new T.SphereGeometry(.06, 8, 6), mat(0x7c2d12), V(Math.cos(a) * r, y, Math.sin(a) * r))); }
      g.position.y = -.5; return g; },
    cnidario() { const g = new T.Group(), tent = [];
      g.add(malha(new T.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xc084fc, { op: .55, rough: .2, side: T.DoubleSide, dw: false }), V(0, 1.2, 0)));
      g.add(malha(new T.TorusGeometry(.45, .08, 10, 40), mat(0xf0abfc, { emis: 0xd946ef, ei: .4 }), V(0, 1.45, 0), [Math.PI / 2, 0, 0]));
      for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283, r = .85, pts = []; for (let k = 0; k <= 10; k++) pts.push(V(Math.cos(a) * r * (1 - k * .03), 1.2 - k * .22, Math.sin(a) * r * (1 - k * .03)));
        const t = tubo(pts, .022, mat(0xe9d5ff, { op: .8, dw: false }), false, 30); g.add(t); tent.push(t); }
      g.userData.anima = (tt) => { g.position.y = Math.sin(tt * 1.4) * .15; tent.forEach((t, i) => t.rotation.y = Math.sin(tt * 2 + i) * .05); }; return g; },
    platelminto() { const g = new T.Group();
      const c = malha(new T.SphereGeometry(1, 48, 24), mat(0x92400e, { rough: .6 }), null, null, [1.7, .12, .55]); g.add(c);
      const cab = malha(new T.ConeGeometry(.45, .7, 24), mat(0x92400e, { rough: .6 }), V(1.75, 0, 0), [0, 0, -Math.PI / 2], [1, .25, 1]); g.add(cab);
      [-1, 1].forEach(s => { g.add(malha(new T.SphereGeometry(.07, 10, 8), mat(0xffffff), V(1.7, .1, s * .15))); g.add(malha(new T.SphereGeometry(.035, 8, 6), mat(0x000000), V(1.72, .14, s * .15))); });
      g.position.y = -.3; return g; },
    nematelminto() { const g = new T.Group(), pts = []; for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push(V(-2 + t * 4, Math.sin(t * 6) * .25, Math.cos(t * 4) * .5)); }
      const tb = new T.TubeGeometry(new T.CatmullRomCurve3(pts), 200, .16, 20), p = tb.attributes.position, c = new T.Vector3();
      const cvN = new T.CatmullRomCurve3(pts);
      for (let i = 0; i < p.count; i++) { const u = Math.floor(i / 21) / 200, k = .35 + .65 * Math.sin(Math.PI * u) ** .5; const ce = cvN.getPointAt(Math.min(1, u)); c.fromBufferAttribute(p, i).sub(ce).multiplyScalar(k).add(ce); p.setXYZ(i, c.x, c.y, c.z); }
      tb.computeVertexNormals(); g.add(malha(tb, mat(0xfde2e4, { rough: .35 }))); return g; },
    anelideo() { const g = new T.Group(), pts = []; for (let i = 0; i <= 36; i++) { const t = i / 36; pts.push(V(-2.2 + t * 4.4, Math.sin(t * 5) * .18, Math.sin(t * 7) * .35)); }
      const cv = new T.CatmullRomCurve3(pts);
      for (let i = 0; i <= 44; i++) { const u = i / 44, q = cv.getPointAt(u), tg = cv.getTangentAt(u), r = .2 * (.5 + .5 * Math.sin(Math.PI * Math.min(1, u * 1.1 + .05)) ** .4), cl = u > .25 && u < .36;
        const s = malha(new T.TorusGeometry(r * .75, r * .42, 10, 24), mat(cl ? 0xf472b6 : 0xb45309, { rough: .45 }), q); s.quaternion.setFromUnitVectors(V(0, 0, 1), tg); g.add(s); }
      return g; },
    molusco() { const g = new T.Group(), pts = [];
      for (let i = 0; i <= 200; i++) { const a = i / 200 * Math.PI * 5.2, r = .06 + .1 * a; pts.push(V(Math.cos(a) * r * .9, Math.sin(a) * r * .9, -a * .045)); }
      const cv = new T.CatmullRomCurve3(pts.reverse()), tb = new T.TubeGeometry(cv, 300, 1, 24), p = tb.attributes.position, c = new T.Vector3();
      for (let i = 0; i < p.count; i++) { const u = Math.floor(i / 25) / 300, ce = cv.getPointAt(Math.min(1, u)), k = .05 + .32 * (1 - u); c.fromBufferAttribute(p, i).sub(ce).multiplyScalar(k).add(ce); p.setXYZ(i, c.x, c.y, c.z); }
      tb.computeVertexNormals(); const casca = malha(tb, mat(0xd97706, { rough: .35 }), V(0, 1.25, 0), [0, Math.PI / 2, 0]); g.add(casca);
      const pe = tubo([V(-1.5, .15, 0), V(-.4, .2, 0), V(.8, .25, 0), V(1.5, .45, 0)], .3, mat(0xa8a29e, { rough: .3 }), false, 30); g.add(pe);
      [-1, 1].forEach(s => { g.add(tubo([V(1.4, .55, s * .1), V(1.75, 1.1, s * .25)], .045, mat(0xa8a29e), false, 10)); g.add(malha(new T.SphereGeometry(.07, 10, 8), mat(0x1c1917), V(1.75, 1.12, s * .25))); });
      return g; },
    inseto() { const g = new T.Group(), m = () => mat(0x1d4ed8, { metal: .5, rough: .25 });
      g.add(malha(new T.SphereGeometry(.42, 28, 20), m(), V(-.9, .5, 0), null, [1.5, .8, .9])); g.add(malha(new T.SphereGeometry(.3, 24, 18), m(), V(.1, .55, 0))); g.add(malha(new T.SphereGeometry(.26, 24, 18), m(), V(.6, .6, 0)));
      pernas(g, 6, V(.1, .4, 0), 1.1, 0x1e293b, .26);
      [-1, 1].forEach(s => { g.add(tubo([V(.78, .75, s * .1), V(1.2, 1.2, s * .35), V(1.5, 1.3, s * .6)], .025, mat(0x1e293b), false, 12));
        const asa = malha(new T.SphereGeometry(.6, 20, 12), mat(0xe0f2fe, { op: .45, dw: false }), V(-.4, .95, s * .5), [0, 0, .1], [1.4, .08, .7]); g.add(asa); });
      return g; },
    aracnideo() { const g = new T.Group(), m = () => mat(0x3f3f46, { rough: .5 });
      g.add(malha(new T.SphereGeometry(.6, 28, 20), m(), V(-.6, .55, 0), null, [1.2, .9, 1])); g.add(malha(new T.SphereGeometry(.38, 24, 18), m(), V(.35, .45, 0)));
      for (let i = 0; i < 8; i++) { const s = i % 2 ? 1 : -1, k = Math.floor(i / 2), a = -.9 + k * .6; g.add(tubo([V(.35, .45, 0), V(.35 + Math.cos(a) * .9, 1.1, s * (.5 + Math.sin(a) * .2 + .2)), V(.35 + Math.cos(a) * 1.6, -.3, s * (1.2 + k * .05))], .04, m(), false, 20)); }
      for (let i = 0; i < 4; i++) g.add(malha(new T.SphereGeometry(.05, 8, 6), mat(0xef4444, { emis: 0x7f1d1d, ei: .3 }), V(.68, .6, (i - 1.5) * .09)));
      return g; },
    crustaceo() { const g = new T.Group(), m = () => mat(0xdc2626, { rough: .4 });
      g.add(malha(deformar(new T.SphereGeometry(.9, 40, 24), .03, 4), m(), V(0, .5, 0), null, [1.3, .45, 1]));
      for (let i = 0; i < 8; i++) { const s = i % 2 ? 1 : -1, k = Math.floor(i / 2); g.add(tubo([V(-.5 + k * .3, .4, s * .6), V(-.7 + k * .35, .7, s * 1.3), V(-.9 + k * .4, -.2, s * 1.7)], .05, m(), false, 20)); }
      [-1, 1].forEach(s => { g.add(tubo([V(.8, .5, s * .5), V(1.4, .7, s * .8)], .09, m(), false, 10)); g.add(malha(new T.SphereGeometry(.3, 20, 14), m(), V(1.65, .75, s * .85), null, [1.3, .7, .8]));
        g.add(tubo([V(.95, .7, s * .2), V(1.15, 1.05, s * .25)], .03, m(), false, 8)); g.add(malha(new T.SphereGeometry(.07, 10, 8), mat(0x111827), V(1.15, 1.08, s * .25))); });
      return g; },
    equinodermo() { const g = new T.Group(), sh = new T.Shape();
      for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI * 2 + Math.PI / 2, r = i % 2 ? .55 : 1.8; const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
      const ge = new T.ExtrudeGeometry(sh, { depth: .25, bevelEnabled: true, bevelSize: .18, bevelThickness: .18, bevelSegments: 6, curveSegments: 4 }); ge.rotateX(-Math.PI / 2);
      g.add(malha(ge, mat(0xf97316, { rough: .7 }))); const R = rng(9);
      for (let i = 0; i < 60; i++) { const a = R() * 6.283, d = R(); const k = Math.round(a / (Math.PI * 2 / 5)) * (Math.PI * 2 / 5) + Math.PI / 2 - Math.PI / 2; g.add(malha(new T.SphereGeometry(.05, 8, 6), mat(0xfed7aa), V(Math.cos(a) * d * 1.3, .45, -Math.sin(a) * d * 1.3))); }
      return g; }
  };
  window.INVERT = INV;
  const GRUPOS = [["porifero", "iv_porifero", "Poríferos"], ["cnidario", "iv_cnidario", "Cnidários"], ["platelminto", "iv_platelminto", "Platelmintos"], ["nematelminto", "iv_nematelminto", "Nematelmintos"], ["anelideo", "iv_anelideo", "Anelídeos"],
    ["molusco", "iv_molusco", "Moluscos"], ["inseto", "iv_inseto", "Artrópodes · insetos"], ["aracnideo", "iv_aracnideo", "Artrópodes · aracnídeos"], ["crustaceo", "iv_crustaceo", "Artrópodes · crustáceos"], ["equinodermo", "iv_equinodermo", "Equinodermos"]];

  /* =================== 7º · GRUPOS DE INVERTEBRADOS =================== */
  M.invertebrados = {
    vistas: [["Todos os grupos", [0, 10, 24], [0, 0, 0]], ["Corpo mole", [-5, 5, 10], [-5, 0, -3]], ["Artrópodes", [5, 5, 10], [4, 0, 3]]],
    construir() {
      const m = novoModelo(), anim = [];
      m.raiz.add(decor(malha(caixaRedonda(26, 16, .4, .2), mat(0xd6c7a1, { rough: 1 }), V(0, -1.2, 0), [-Math.PI / 2, 0, 0])));
      m.raiz.add(decor(malha(new T.CircleGeometry(4.2, 64), mat(0x0ea5e9, { op: .5, rough: .1, dw: false }), V(-7.5, -.98, -3.5), [-Math.PI / 2, 0, 0])));
      GRUPOS.forEach(([fn, id], i) => { const g0 = INV[fn](), g = new T.Group(), col = i % 5, lin = Math.floor(i / 5); g.add(g0); if (g0.userData.anima) g.userData.anima = g0.userData.anima; g.scale.setScalar(1.45); g.position.set(-10 + col * 5, 0, -3.5 + lin * 7); if (g.userData.anima) anim.push(g);
        const topo = new T.Box3().setFromObject(g).max.y; m.parte(id, g, V(g.position.x, topo + .4, g.position.z)); });
      let t = 0; return Object.assign(m, { atualizar(dt) { t += dt; anim.forEach(g => g.userData.anima(t)); } });
    }
  };

  /* =================== 8º · USINAS E FONTES DE ENERGIA =================== */
  M.usinas = {
    vistas: [["Fontes de energia", [0, 9, 24], [0, 1.5, 0]], ["Renováveis", [-5, 5, 12], [-5, 1.5, 0]]],
    construir() {
      const m = novoModelo(), pas = [], fumaca = [], agua = [], R = rng(4);
      m.raiz.add(decor(malha(caixaRedonda(30, 12, .4, .2), mat(0x65a30d, { rough: 1 }), V(0, -.25, 0), [-Math.PI / 2, 0, 0])));
      // hidrelétrica
      const hid = new T.Group(); hid.position.set(-11, 0, 0);
      hid.add(malha(new T.BoxGeometry(4, 3.4, 1.2), mat(0xcbd5e1, { rough: .7 }), V(0, 1.7, 0)));
      hid.add(malha(new T.BoxGeometry(4, 2.8, 3), mat(0x0284c7, { op: .7, rough: .1 }), V(0, 1.4, -2.1)));
      for (let i = 0; i < 12; i++) { const a = decor(malha(new T.SphereGeometry(.12, 10, 8), mat(0x7dd3fc, { op: .8, dw: false }))); hid.add(a); agua.push({ a, f: R(), x: (R() - .5) * 2 }); }
      m.parte("u_hidreletrica", hid, V(-11, 4, 0));
      // eólica
      const eol = new T.Group(); eol.position.set(-5.5, 0, 0);
      [[0, 0], [1.8, -1.5]].forEach(([x, z]) => { eol.add(malha(cil(.08, .16, 5), mat(0xf8fafc, { rough: .4 }), V(x, 2.5, z))); const cub = new T.Group(); cub.position.set(x, 5, z + .2); eol.add(cub);
        cub.add(malha(new T.SphereGeometry(.18, 16, 12), mat(0xf8fafc)));
        for (let k = 0; k < 3; k++) { const p = malha(new T.BoxGeometry(.18, 2, .05), mat(0xf8fafc, { rough: .4 }), V(0, 1, 0)); const piv = new T.Group(); piv.rotation.z = k * 2.094; piv.add(p); cub.add(piv); } pas.push(cub); });
      m.parte("u_eolica", eol, V(-5, 6.8, 0));
      // solar
      const sol = new T.Group(); sol.position.set(0, 0, 1);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const pn = new T.Group(); pn.position.set(-1.2 + i * 1.2, .7, j * 1.4); pn.rotation.x = -.6; sol.add(pn);
        pn.add(malha(new T.BoxGeometry(1.05, .06, 1.2), mat(0x1e3a8a, { metal: .6, rough: .15 }))); pn.add(malha(cil(.04, .04, .7), mat(0x94a3b8), V(0, -.35, 0))); }
      m.parte("u_solar", sol, V(0, 2.4, 1.6));
      // termelétrica (combustíveis fósseis)
      const ter = new T.Group(); ter.position.set(5.5, 0, 0);
      ter.add(malha(new T.BoxGeometry(2.6, 1.8, 2), mat(0x78716c, { rough: .8 }), V(0, .9, 0)));
      [[-.6], [.6]].forEach(([x]) => ter.add(malha(cil(.25, .35, 3.4), mat(0xa8a29e), V(x, 3.4, -.3))));
      for (let i = 0; i < 16; i++) { const f = decor(malha(new T.SphereGeometry(.3, 12, 10), mat(0x6b7280, { op: .6, dw: false }))); ter.add(f); fumaca.push({ f, k: R(), x: i % 2 ? .6 : -.6 }); }
      m.parte("u_termeletrica", ter, V(5.5, 5.6, 0));
      // nuclear
      const nuc = new T.Group(); nuc.position.set(11, 0, 0);
      nuc.add(malha(new T.LatheGeometry([[1.4, 0], [1, 1.6], [.85, 2.6], [1.05, 3.4]].map(([x, y]) => new T.Vector2(x, y)), 48), mat(0xe2e8f0, { rough: .6, side: T.DoubleSide })));
      nuc.add(malha(new T.SphereGeometry(.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xf1f5f9), V(2.2, 1.2, 0))); nuc.add(malha(cil(.9, .9, 1.2), mat(0xf1f5f9), V(2.2, .6, 0)));
      m.parte("u_nuclear", nuc, V(11.5, 4.2, 0));
      // linhas de transmissão
      const lin = new T.Group(); lin.position.set(0, 0, 4.5);
      [-8, -2.5, 3, 8.5].forEach(x => { lin.add(malha(cil(.06, .1, 3.2), mat(0x64748b, { metal: .6 }), V(x, 1.6, 0))); lin.add(malha(new T.BoxGeometry(1, .06, .06), mat(0x64748b), V(x, 3.1, 0))); });
      [-.4, .4].forEach(x0 => lin.add(tubo([[-8, 3.05], [-5.25, 2.7], [-2.5, 3.05], [.25, 2.7], [3, 3.05], [5.75, 2.7], [8.5, 3.05]].map(([x, y]) => V(x + x0, y, 0)), .02, mat(0x0f172a), false, 80)));
      m.parte("u_transmissao", lin, V(-2.5, 3.8, 4.5));
      let t = 0;
      return Object.assign(m, { atualizar(dt) { t += dt; pas.forEach(c => c.rotation.z -= dt * 2.5);
        fumaca.forEach(o => { const f = (t * .25 + o.k) % 1; o.f.position.set(o.x + f * .8, 5.2 + f * 3, -.3); o.f.scale.setScalar(.5 + f * 1.8); o.f.material.opacity = .55 * (1 - f); });
        agua.forEach(o => { const f = (t * .8 + o.f) % 1; o.a.position.set(o.x, 2.8 - f * 2.6, .7 + f * 1.4); }); } });
    }
  };

  /* =================== 9º · EVOLUÇÃO E BIODIVERSIDADE =================== */
  M.evolucao = {
    vistas: [["Evolução", [0, 7, 22], [0, 2.5, 0]], ["Tentilhões", [-6, 4, 9], [-6, 2.5, 0]], ["Árvore da vida", [6, 5, 10], [6, 3, 0]]],
    construir() {
      const m = novoModelo();
      m.raiz.add(decor(malha(caixaRedonda(26, 10, .4, .2), mat(0xe7e5e4, { rough: .8 }), V(0, -.25, 0), [-Math.PI / 2, 0, 0])));
      // tentilhões de Darwin: bicos diferentes para alimentos diferentes
      const ten = new T.Group(); ten.position.set(-7, 0, 0);
      [[-2.2, 0xa16207, [.35, .5, .35], "semente"], [0, 0x78716c, [.15, .9, .15], "inseto"], [2.2, 0x57534e, [.25, .7, .25], "cacto"]].forEach(([x, cor, b]) => { const p = new T.Group(); p.position.set(x, 1.6, 0);
        p.add(malha(new T.SphereGeometry(.6, 28, 20), mat(cor, { rough: .7 }), null, null, [1.3, 1, 1])); p.add(malha(new T.SphereGeometry(.42, 24, 18), mat(cor, { rough: .7 }), V(.65, .45, 0)));
        p.add(malha(new T.ConeGeometry(b[0], b[1], 18), mat(0x292524), V(.95 + b[1] / 2, .4, 0), [0, 0, -Math.PI / 2])); p.add(malha(new T.SphereGeometry(.06, 8, 6), mat(0x000000), V(.88, .58, .3)));
        p.add(malha(cil(.04, .04, .9), mat(0x44403c), V(0, -.9, .15))); p.add(malha(cil(.04, .04, .9), mat(0x44403c), V(0, -.9, -.15))); ten.add(p); });
      ten.add(malha(cil(.12, .14, 7.2), mat(0x713f12), V(0, .55, 0), [0, 0, Math.PI / 2]));
      m.parte("ev_tentilhoes", ten, V(-7, 3.4, 0));
      // registro fóssil em camadas
      const fos = new T.Group(); fos.position.set(-.5, 0, 0);
      [0xd6b88d, 0xb08968, 0xe9d8a6, 0x9c6644].forEach((c, i) => fos.add(malha(new T.BoxGeometry(3, .8, 2.4), mat(c, { rough: .95 }), V(0, .4 + i * .8, 0))));
      [[.6, .9], [-.7, 1.7], [.4, 2.5]].forEach(([x, y], i) => { const o = new T.Group(); o.position.set(x, y, 1.22); for (let k = 0; k < 5 + i * 2; k++) o.add(malha(cil(.04, .04, .35), mat(0xf5f5f4), V(k * .14 - .3, Math.sin(k) * .05, 0), [0, 0, Math.PI / 2 + .2 * Math.sin(k)])); o.add(malha(new T.SphereGeometry(.13, 12, 8), mat(0xf5f5f4), V(.6 + i * .2, 0, 0))); fos.add(o); });
      m.parte("ev_fosseis", fos, V(-.5, 3.8, 0));
      // árvore filogenética (ancestral comum)
      const arv = new T.Group(); arv.position.set(6.5, 0, 0);
      const ram = (a, b, c) => arv.add(tubo([a, b], .07, mat(c, { rough: .4 }), false, 4));
      const raiz0 = V(0, .3, 0), n1 = V(0, 1.6, 0), n2 = V(-1.4, 3, 0), n3 = V(1.4, 3, 0);
      ram(raiz0, n1, 0x8b5cf6); ram(n1, n2, 0x8b5cf6); ram(n1, n3, 0x8b5cf6);
      [[n2, V(-2.2, 4.8, 0), 0x22c55e], [n2, V(-.7, 4.8, 0), 0x16a34a], [n3, V(.7, 4.8, 0), 0xf97316], [n3, V(2.2, 4.8, 0), 0xef4444]].forEach(([a, b, c]) => { ram(a, b, c); arv.add(malha(new T.SphereGeometry(.28, 20, 14), mat(c), b)); });
      arv.add(malha(new T.SphereGeometry(.3, 20, 14), mat(0xfacc15, { emis: 0xca8a04, ei: .4 }), n1));
      m.parte("ev_arvore", arv, V(6.5, 5.6, 0));
      // variação dentro da espécie: besouros de cores diferentes
      const var_ = new T.Group(); var_.position.set(11, 0, 1);
      [0x16a34a, 0x65a30d, 0x854d0e, 0x15803d, 0x92400e].forEach((c, i) => { const b = new T.Group(); b.position.set((i % 3) * .9 - .9, .35, Math.floor(i / 3) * 1 - .4);
        b.add(malha(new T.SphereGeometry(.3, 20, 14), mat(c, { metal: .3, rough: .3 }), null, null, [1.3, .6, 1])); b.add(malha(new T.SphereGeometry(.14, 12, 8), mat(0x1c1917), V(.38, 0, 0))); var_.add(b); });
      m.parte("ev_variacao", var_, V(11, 1.6, 1));
      return Object.assign(m, { atualizar() { } });
    }
  };

  /* =================== 9º · VIDA FORA DA TERRA (zona habitável) =================== */
  M.habitavel = {
    vistas: [["Zona habitável", [0, 16, 20], [2, 0, 0]], ["Marte", [9, 3, 6], [9, 1, 0]]],
    construir() {
      const m = novoModelo(), orb = [];
      const est = new T.Group(); est.add(malha(new T.SphereGeometry(1.6, 48, 32), mat(0xfde047, { emis: 0xf59e0b, ei: 1.6 }))); est.add(G.brilhoSprite(0xfbbf24, 6, .7));
      m.parte("h_estrela", est, V(0, 2.4, 0));
      const zona = new T.Group(); zona.add(malha(new T.RingGeometry(5.2, 8.4, 96), mat(0x22c55e, { op: .25, side: T.DoubleSide, dw: false, emis: 0x16a34a, ei: .3 }), null, [-Math.PI / 2, 0, 0]));
      zona.add(malha(new T.RingGeometry(1.9, 5.2, 96), mat(0xef4444, { op: .12, side: T.DoubleSide, dw: false }), null, [-Math.PI / 2, 0, 0]));
      zona.add(malha(new T.RingGeometry(8.4, 12, 96), mat(0x60a5fa, { op: .1, side: T.DoubleSide, dw: false }), null, [-Math.PI / 2, 0, 0]));
      m.parte("h_zona", zona, V(0, .5, 6.8));
      const pl = (r, rr, cor, id, ang) => { const g = new T.Group(); g.add(malha(new T.SphereGeometry(rr, 40, 28), mat(cor, { rough: .6 }))); const piv = new T.Group(); piv.rotation.y = ang; g.position.x = r; piv.add(g); m.raiz.add(piv); orb.push({ piv, v: 1 / Math.sqrt(r) });
        m.parte(id, g, V(r * Math.cos(-ang), rr + .6, r * Math.sin(-ang))); return g; };
      pl(3.4, .45, 0xb45309, "h_quente", .5);
      const terra = pl(6.6, .6, 0x2563eb, "h_terra", 2.2); terra.add(malha(new T.SphereGeometry(.62, 32, 20), mat(0x22c55e, { op: .55, dw: false })));
      pl(10, .5, 0xc2410c, "h_marte", 4.1);
      const fria = pl(13.5, .7, 0xbae6fd, "h_gelado", 5.4); fria.add(malha(new T.SphereGeometry(.72, 32, 20), mat(0xffffff, { op: .35, dw: false })));
      // telescópio espacial
      const tel = new T.Group(); tel.position.set(-6, 3.5, -6); tel.add(malha(cil(.5, .5, 2.2), mat(0xd4d4d8, { metal: .7, rough: .25 }), null, [0, 0, Math.PI / 2]));
      [-1, 1].forEach(s => tel.add(malha(new T.BoxGeometry(.05, 1.6, .9), mat(0x1e3a8a, { metal: .5, rough: .2 }), V(0, 0, s * 1))));
      m.parte("h_telescopio", tel, V(-6, 4.8, -6));
      for (let k = 0; k < 4; k++) m.raiz.add(decor(malha(new T.TorusGeometry([3.4, 6.6, 10, 13.5][k], .02, 4, 160), mat(0x94a3b8, { op: .5, dw: false }), null, [Math.PI / 2, 0, 0])));
      return Object.assign(m, { atualizar(dt) { orb.forEach(o => o.piv.rotation.y += dt * .15 * o.v); } });
    }
  };

  /* =================== JOGO: CLASSIFIQUE O INVERTEBRADO =================== */
  if (window.SIMULACOES) window.SIMULACOES.lista.push({
    id: "invertebrados", em: "🐌", titulo: "Classifique o invertebrado", hab: "7º · Invertebrados", aulas: "Poríferos, cnidários, vermes, anelídeos, moluscos, artrópodes e equinodermos",
    desc: "Um invertebrado aparece no palco 3D. Observe o corpo (gire e aproxime) e escolha o grupo. 8 rodadas.",
    html: `<div class="destaque" id="txt">Observe o animal e escolha o grupo correto.</div>
      <div class="opcoes" id="ops" style="grid-template-columns:1fr 1fr">${["Poríferos", "Cnidários", "Platelmintos", "Nematelmintos", "Anelídeos", "Moluscos", "Artrópodes", "Equinodermos"].map(n => `<button class="opcao" data-g="${n}">${n}</button>`).join("")}</div>
      <div class="medidores"><div><small>Rodada</small><b id="mR">1/8</b></div><div><small>Acertos</small><b id="mP">0</b></div></div>
      <div class="linha-btn"><button class="btn prim" id="prox" hidden>▶ Próximo animal</button><button class="btn" id="dica">💡 Dica</button><button class="btn" id="novo">↺ Recomeçar</button></div>
      <details><summary>Como diferenciar</summary><ul class="lista"><li><b>Poríferos:</b> corpo cheio de poros, sem órgãos (esponjas).</li><li><b>Cnidários:</b> tentáculos com células urticantes (água-viva, coral).</li><li><b>Platelmintos:</b> vermes achatados (planária, tênia).</li><li><b>Nematelmintos:</b> vermes cilíndricos, sem anéis (lombriga).</li><li><b>Anelídeos:</b> corpo dividido em anéis (minhoca, sanguessuga).</li><li><b>Moluscos:</b> corpo mole, muitos com concha (caracol, polvo).</li><li><b>Artrópodes:</b> exoesqueleto e patas articuladas (insetos, aranhas, crustáceos).</li><li><b>Equinodermos:</b> marinhos, simetria em 5 partes, pele com espinhos (estrela-do-mar).</li></ul></details>`,
    iniciar(ctx) {
      const raiz = new T.Group(); let atual = null, alvo = null, rod = 0, pts = 0, fila = [], t = 0;
      const TIPOS = [["porifero", "Poríferos", "Esponja: corpo com poros por onde a água entra; não tem órgãos nem tecidos verdadeiros."], ["cnidario", "Cnidários", "Água-viva: tentáculos com células urticantes (cnidócitos)."],
        ["platelminto", "Platelmintos", "Planária: verme de corpo achatado."], ["nematelminto", "Nematelmintos", "Lombriga: verme cilíndrico, liso, sem anéis."], ["anelideo", "Anelídeos", "Minhoca: corpo dividido em anéis; a faixa rosada é o clitelo."],
        ["molusco", "Moluscos", "Caracol: corpo mole, pé musculoso e concha."], ["inseto", "Artrópodes", "Inseto: 3 partes no corpo, 6 patas articuladas e antenas."], ["aracnideo", "Artrópodes", "Aranha: 2 partes no corpo e 8 patas, sem antenas."],
        ["crustaceo", "Artrópodes", "Caranguejo: carapaça dura, quelas (pinças) e 2 pares de antenas."], ["equinodermo", "Equinodermos", "Estrela-do-mar: simetria em 5 braços e pele com espinhos."]];
      const DICA = { Poríferos: "Repare nos furinhos por todo o corpo.", Cnidários: "Tem tentáculos ao redor da boca?", Platelmintos: "O corpo é achatado como uma fita?", Nematelmintos: "É um verme liso e cilíndrico, sem anéis?", Anelídeos: "Conte: o corpo tem anéis?", Moluscos: "Corpo mole... e uma concha?", Artrópodes: "As patas são articuladas (dobram em juntas)?", Equinodermos: "Quantos braços? Vive no mar?" };
      function rodada() {
        if (atual) raiz.remove(atual);
        if (rod >= 8) { ctx.$("#prox").hidden = true; ctx.$("#txt").innerHTML = `<b>Fim!</b> Você acertou ${pts} de 8.`; if (window.XP) window.XP.ganhar(pts * 3, "Classifique o invertebrado"); return; }
        alvo = fila[rod]; atual = INV[alvo[0]](); const caixa = new T.Box3().setFromObject(atual), c = caixa.getCenter(new T.Vector3()); atual.position.sub(c); const s = 4 / Math.max(...caixa.getSize(new T.Vector3()).toArray()); const g = new T.Group(); g.add(atual); g.scale.setScalar(s); atual = g; raiz.add(atual);
        ctx.$("#mR").textContent = (rod + 1) + "/8"; ctx.$("#txt").textContent = "Observe o animal e escolha o grupo correto."; ctx.$("#prox").hidden = true;
        ctx.cartao.querySelectorAll("#ops .opcao").forEach(b => { b.disabled = false; b.classList.remove("certa", "errada"); });
        ctx.rotulos([{ txt: "?", obj: atual, dy: 2.6, cor: "#94a3b8", oculto: true }]);
      }
      function novo() { rod = 0; pts = 0; ctx.$("#mP").textContent = 0; const emb = TIPOS.slice().sort(() => Math.random() - .5); fila = emb.slice(0, 8); rodada(); }
      ctx.cartao.querySelectorAll("#ops .opcao").forEach(b => b.onclick = () => { const ok = b.dataset.g === alvo[1]; if (ok) pts++; ctx.$("#mP").textContent = pts;
        ctx.cartao.querySelectorAll("#ops .opcao").forEach(x => { x.disabled = true; if (x.dataset.g === alvo[1]) x.classList.add("certa"); else if (x === b) x.classList.add("errada"); });
        ctx.$("#txt").innerHTML = (ok ? "✔️ Certo! " : "✖️ Não. ") + `<b>${alvo[1]}</b> — ${alvo[2]}`;
        ctx.rotulos([{ txt: alvo[1], obj: atual, dy: 2.6, cor: "#5eead4" }]);
        rod++; const px = ctx.$("#prox"); px.hidden = false; px.textContent = rod >= 8 ? "🏁 Ver resultado" : "▶ Próximo animal"; });
      ctx.$("#prox").onclick = rodada; ctx.$("#novo").onclick = novo; ctx.$("#dica").onclick = () => ctx.avisar(DICA[alvo[1]]);
      novo();
      return { raiz, vistas: [["Lupa", [0, 3, 11], [0, 0, 0]], ["De cima", [0, 10, 3], [0, 0, 0]]], atualizar(dt) { t += dt; if (atual) { atual.rotation.y += dt * .35; atual.traverse(o => o.userData.anima && o.userData.anima(t)); } } };
    }
  });
})();
