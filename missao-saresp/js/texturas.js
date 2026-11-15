/* =========================================================================
   MISSÃO SARESP 3D — Texturas geradas por código (alta qualidade, sem baixar imagens)
   Terra, Lua, Sol, planetas, anéis, casca de árvore, grama, madeira, lava e brilhos.
   Tudo é calculado uma vez e guardado em cache.
   ========================================================================= */
(function () {
  const T = THREE;
  const cache = {};
  const memo = (k, f) => cache[k] || (cache[k] = f());
  /* As texturas grandes já vêm prontas em arquivos (pasta tex/), geradas com ?gerartex=1 a partir destas mesmas funções.
     Assim o aluno só baixa as imagens, sem esperar o cálculo. */
  const GERAR = /[?&]gerartex=1/.test(location.search), CANV = {}, BASE = (document.currentScript && document.currentScript.src || "").replace(/js\/texturas\.js.*$/, "tex/");
  const loader = new T.TextureLoader();
  function opcoes(t, o) { if (!o.dados) t.encoding = T.sRGBEncoding; t.anisotropy = 8; if (o.rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(o.rep[0], o.rep[1]); } if (o.wrapS) t.wrapS = T.RepeatWrapping; return t; }
  function tex(nome, o, gerar) {
    o = o || {};
    if (GERAR) { if (!CANV[nome]) gerar(); return textura(CANV[nome], o); }
    return opcoes(loader.load(BASE + nome + ".webp"), o);
  }
  const ALTA = Math.min(window.devicePixelRatio || 1, 2) > 1 || Math.max(screen.width, screen.height) >= 1200;

  /* ---------- ruído de Perlin 3D ---------- */
  const P = new Uint8Array(512);
  (function () { const p = []; for (let i = 0; i < 256; i++) p[i] = i; let s = 1337; for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) P[i] = p[i & 255]; })();
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10), lerp = (a, b, t) => a + (b - a) * t;
  function grad(h, x, y, z) { const u = (h & 15) < 8 ? x : y, v = (h & 15) < 4 ? y : ((h & 15) === 12 || (h & 15) === 14) ? x : z; return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); }
  function ruido(x, y, z) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = P[X] + Y, AA = P[A] + Z, AB = P[A + 1] + Z, B = P[X + 1] + Y, BA = P[B] + Z, BB = P[B + 1] + Z;
    return lerp(lerp(lerp(grad(P[AA], x, y, z), grad(P[BA], x - 1, y, z), u), lerp(grad(P[AB], x, y - 1, z), grad(P[BB], x - 1, y - 1, z), u), v),
      lerp(lerp(grad(P[AA + 1], x, y, z - 1), grad(P[BA + 1], x - 1, y, z - 1), u), lerp(grad(P[AB + 1], x, y - 1, z - 1), grad(P[BB + 1], x - 1, y - 1, z - 1), u), v), w);
  }
  function fbm(x, y, z, oit, lac, gan) { let s = 0, a = .5, f = 1; for (let i = 0; i < (oit || 5); i++) { s += a * ruido(x * f, y * f, z * f); f *= lac || 2.02; a *= gan || .5; } return s; }
  function cristas(x, y, z, oit) { let s = 0, a = .5, f = 1; for (let i = 0; i < oit; i++) { s += a * (1 - Math.abs(ruido(x * f, y * f, z * f))); f *= 2.1; a *= .5; } return s; }

  /* ---------- utilitários de canvas ---------- */
  function tela(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function textura(c, o) {
    o = o || {};
    const t = new T.CanvasTexture(c);
    if (!o.dados) t.encoding = T.sRGBEncoding;
    t.anisotropy = 8; if (o.rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(o.rep[0], o.rep[1]); }
    if (o.wrapS) t.wrapS = T.RepeatWrapping;
    t.needsUpdate = true; return t;
  }
  // percorre um mapa equirretangular (esfera) chamando f(x, y, z, lat) → [r,g,b] (0..255)
  function esfera(w, h, f, canais) {
    const c = tela(w, h), g = c.getContext("2d"), img = g.createImageData(w, h), d = img.data;
    const extras = (canais || []).map(() => { const cc = tela(w, h); return { c: cc, g: cc.getContext("2d"), img: null }; });
    extras.forEach(e => e.img = e.g.createImageData(w, h));
    for (let j = 0; j < h; j++) {
      const lat = (.5 - (j + .5) / h) * Math.PI, cy = Math.sin(lat), cr = Math.cos(lat);
      for (let i = 0; i < w; i++) {
        const lon = ((i + .5) / w) * Math.PI * 2, x = -Math.cos(lon) * cr, z = Math.sin(lon) * cr;
        const r = f(x, cy, z, lat), k = (j * w + i) * 4;
        d[k] = r[0]; d[k + 1] = r[1]; d[k + 2] = r[2]; d[k + 3] = r[3] ?? 255;
        for (let e = 0; e < extras.length; e++) { const v = r[4 + e]; const ed = extras[e].img.data; ed[k] = ed[k + 1] = ed[k + 2] = v; ed[k + 3] = 255; }
      }
    }
    g.putImageData(img, 0, 0); extras.forEach(e => e.g.putImageData(e.img, 0, 0));
    return [c].concat(extras.map(e => e.c));
  }
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const cl = (v, a, b) => Math.max(a ?? 0, Math.min(b ?? 1, v));
  const hex = h => [(h >> 16) & 255, (h >> 8) & 255, h & 255];
  // rampa de cores: lista de [posição, cor]
  function rampa(paradas, t) { t = cl(t); for (let i = 1; i < paradas.length; i++) if (t <= paradas[i][0]) { const [p0, c0] = paradas[i - 1], [p1, c1] = paradas[i]; return mix(hex(c0), hex(c1), (t - p0) / (p1 - p0 || 1)); } return hex(paradas[paradas.length - 1][1]); }

  /* ---------- TERRA ---------- */
  // elevação do relevo (mesma função usada pela hidrosfera do modelo de camadas)
  function elevTerra(x, y, z) { return fbm(x * 1.6 + 3.1, y * 1.6 - 1.7, z * 1.6 + 0.4, 6) + .18 * cristas(x * 3, y * 3, z * 3, 4) - .12; }
  const MAR = 0.02;
  function terra() {
    return memo("terra", () => {
      const W = ALTA ? 2048 : 1024, H = W / 2;
      const g = () => { const [cor, rug, rel] = esfera(2048, 1024, (x, y, z, lat) => {
        const e = elevTerra(x, y, z), ab = Math.abs(lat) / (Math.PI / 2), um = fbm(x * 2.2 - 5, y * 2.2, z * 2.2 + 7, 4);
        let c, r, b;
        if (e < MAR) { // oceanos: mais claros perto da costa
          const p = cl((MAR - e) / .35); c = rampa([[0, 0x2f8fc7], [.12, 0x1f6fb2], [.45, 0x0f4c8f], [1, 0x082f66]], p); r = 40; b = 0;
        } else {
          const h = cl((e - MAR) / .45);
          const deserto = cl(1 - Math.abs(ab - .27) * 6) * cl(.6 - um * 3);       // faixas de desertos perto dos trópicos
          const floresta = cl(1 - ab * 2.2) * cl(.5 + um * 2);                      // florestas tropicais
          c = rampa([[0, 0x4f8a35], [.35, 0x3d6f2a], [.6, 0x7a6a45], [.82, 0x8f8579], [1, 0xe5e7eb]], h);
          c = mix(c, hex(0x2e5e22), floresta * .7); c = mix(c, hex(0xd2b277), deserto * .85);
          c = mix(c, hex(0x9aa58a), cl((ab - .55) * 3) * .6);                      // tundra
          r = 215; b = 60 + h * 195;
        }
        const gelo = cl((ab - .84 + fbm(x * 6, y * 6, z * 6, 3) * .08) * 14);      // calotas polares
        if (gelo > 0) { c = mix(c, [240, 246, 252], gelo); r = r + (150 - r) * gelo; }
        const ruidoFino = fbm(x * 40, y * 40, z * 40, 2) * 14;
        return [cl(c[0] + ruidoFino, 0, 255), cl(c[1] + ruidoFino, 0, 255), cl(c[2] + ruidoFino, 0, 255), 255, r, b ?? 0];
      }, [1, 2]); CANV.terra_cor = cor; CANV.terra_rug = rug; CANV.terra_rel = rel; };
      return { map: tex("terra_cor", {}, g), roughnessMap: tex("terra_rug", { dados: true }, g), bumpMap: tex("terra_rel", { dados: true }, g) };
    });
  }
  function nuvens() {
    return memo("nuvens", () => {
      const W = ALTA ? 2048 : 1024, H = W / 2;
      return tex("nuvens", {}, () => { const [c] = esfera(2048, 1024, (x, y, z, lat) => {
        const ab = Math.abs(lat) / (Math.PI / 2), faixa = .55 + .45 * Math.cos(lat * 6);
        const n = fbm(x * 3 + 11, y * 5, z * 3 - 4, 6) * 1.4 + .22 * faixa - .1 - ab * .05;
        const a = cl((n - .02) * 2.6) * 235;
        return [255, 255, 255, a];
      }); CANV.nuvens = c; });
    });
  }
  /* ---------- LUA ---------- */
  function lua() {
    return memo("lua", () => {
      const W = ALTA ? 1024 : 512, H = W / 2, R = mulberry(77), cr = [];
      for (let i = 0; i < 160; i++) { const u = R() * 2 - 1, a = R() * Math.PI * 2, s = Math.sqrt(1 - u * u); cr.push([Math.cos(a) * s, u, Math.sin(a) * s, .015 + Math.pow(R(), 3) * .16]); }
      const g = () => { const [c, rel] = esfera(1024, 512, (x, y, z) => {
        const mare = cl((fbm(x * 1.4 + 2, y * 1.4, z * 1.4 - 3, 4) - .05) * 5);
        let v = 168 - mare * 70 + fbm(x * 10, y * 10, z * 10, 4) * 40, b = 128 - mare * 30;
        for (const [cx, cy, cz, rr] of cr) { const d = Math.hypot(x - cx, y - cy, z - cz) / rr; if (d < 1.25) { if (d < .85) { v -= 22 * (1 - d); b -= 70 * (1 - d / .85); } else if (d < 1.15) { v += 26; b += 60 * (1 - Math.abs(d - 1) / .15); } } }
        return [v, v * .985, v * .96, 255, cl(b, 0, 255)];
      }, [1]); CANV.lua_cor = c; CANV.lua_rel = rel; };
      return { map: tex("lua_cor", {}, g), bumpMap: tex("lua_rel", { dados: true }, g) };
    });
  }
  function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- SOL ---------- */
  function sol() {
    return memo("sol", () => {
      return tex("sol", {}, () => { const [c] = esfera(1024, 512, (x, y, z) => {
        const g = fbm(x * 14, y * 14, z * 14, 4), m = fbm(x * 3 + 9, y * 3, z * 3, 4);
        const t = cl(.55 + g * 1.1 + m * .5);
        const cc = rampa([[0, 0xc2410c], [.35, 0xf97316], [.6, 0xfbbf24], [.85, 0xfde68a], [1, 0xfffbeb]], t);
        return [cc[0], cc[1], cc[2]];
      }); CANV.sol = c; });
    });
  }
  function brilho(cor) {
    return memo("brilho" + cor, () => {
      const c = tela(256, 256), g = c.getContext("2d"), [r, gg, b] = hex(cor), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      gr.addColorStop(0, `rgba(${r},${gg},${b},1)`); gr.addColorStop(.2, `rgba(${r},${gg},${b},.55)`); gr.addColorStop(.5, `rgba(${r},${gg},${b},.14)`); gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
      g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return textura(c);
    });
  }

  /* ---------- PLANETAS ---------- */
  const PLAN = {
    mercurio: (x, y, z) => { const v = 120 + fbm(x * 5, y * 5, z * 5, 5) * 90 + (1 - Math.abs(ruido(x * 9, y * 9, z * 9))) * 25; return [v, v * .94, v * .88]; },
    venus: (x, y, z) => { const t = cl(.55 + fbm(x * 2 + y * 3, y * 6, z * 2, 5) * .9); const c = rampa([[0, 0xb7791f], [.5, 0xe8c27a], [1, 0xfff1c9]], t); return c; },
    marte: (x, y, z, lat) => { const e = fbm(x * 2.5, y * 2.5, z * 2.5, 6); let c = rampa([[0, 0x5c2a14], [.4, 0x9a3f1c], [.7, 0xc2622e], [1, 0xe0956a]], cl(.55 + e * 1.3)); const ab = Math.abs(lat) / (Math.PI / 2); if (ab > .86) c = mix(c, [245, 240, 235], cl((ab - .86) * 20)); return c; },
    jupiter: (x, y, z, lat) => { const w = fbm(x * 3, y * 3, z * 3, 4) * .35, b = Math.sin((lat + w * .25) * 15) * .5 + .5, b2 = Math.sin((lat + w * .2) * 37) * .5 + .5;
      let c = rampa([[0, 0x9a5b34], [.35, 0xc98d5c], [.65, 0xe9cfa8], [1, 0xfaf3e6]], cl(b * .75 + b2 * .25));
      const dx = Math.atan2(z, -x) - 1.0, dy = lat + .38, d = Math.hypot(dx * .55, dy * 1.4) / .12; if (d < 1) c = mix(c, hex(0xb5452a), cl((1 - d) * 2.2) * .9); return c; },
    saturno: (x, y, z, lat) => { const w = fbm(x * 3, y * 3, z * 3, 3) * .2, b = Math.sin((lat + w * .1) * 22) * .5 + .5; return rampa([[0, 0xb89a62], [.5, 0xe2c98f], [1, 0xf6e8c4]], b * .8 + .1); },
    urano: (x, y, z, lat) => { const b = Math.sin(lat * 10 + fbm(x * 2, y * 2, z * 2, 3)) * .5 + .5; return rampa([[0, 0x6fc8d6], [1, 0xb8eef2]], b * .4 + .4); },
    netuno: (x, y, z, lat) => { const b = Math.sin(lat * 12 + fbm(x * 3, y * 3, z * 3, 4) * 1.2) * .5 + .5; let c = rampa([[0, 0x1e3a8a], [.6, 0x2f62d6], [1, 0x6c9cf0]], b); const d = Math.hypot(Math.atan2(z, -x) - 2, (lat + .35) * 2) / .15; if (d < 1) c = mix(c, hex(0x0b1c4f), (1 - d) * .8); return c; }
  };
  function planeta(nome) {
    if (nome === "terra") return terra();
    return memo("pl_" + nome, () => ({ map: tex("pl_" + nome, {}, () => { CANV["pl_" + nome] = esfera(1024, 512, PLAN[nome])[0]; }) }));
  }
  function anel() {
    return memo("anel", () => tex("anel", {}, () => {
      const c = tela(1024, 8), g = c.getContext("2d");
      for (let i = 0; i < 1024; i++) {
        const t = i / 1023, faixa = .55 + .45 * Math.sin(t * 90) * Math.sin(t * 23 + 1), divisao = (t > .62 && t < .67) ? .08 : 1, borda = cl(t * 12) * cl((1 - t) * 10);
        const a = cl(faixa * divisao * borda * (t < .2 ? .35 : 1)); const cc = rampa([[0, 0x9c8a6a], [.5, 0xe4d2a7], [1, 0xcbb487]], t);
        g.fillStyle = `rgba(${cc[0] | 0},${cc[1] | 0},${cc[2] | 0},${a.toFixed(3)})`; g.fillRect(i, 0, 1, 8);
      }
      CANV.anel = c;
    }));
  }
  // ajusta as coordenadas de textura de um anel (RingGeometry) para irem do raio interno ao externo
  function uvAnel(geo, rIn, rOut) { const p = geo.attributes.position, uv = geo.attributes.uv, v = new T.Vector3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); uv.setXY(i, (v.length() - rIn) / (rOut - rIn), .5); } return geo; }

  /* ---------- superfícies (texturas que se repetem) ---------- */
  // mapa sem emendas: amostra o ruído num toro 4D aproximado (u, v → círculo duplo)
  function plano(w, h, f, canais) {
    const c = tela(w, h), g = c.getContext("2d"), img = g.createImageData(w, h), d = img.data;
    const ex = (canais || []).map(() => { const cc = tela(w, h); const gg = cc.getContext("2d"); return { c: cc, g: gg, img: gg.createImageData(w, h) }; });
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const u = i / w, v = j / h, r = f(u, v), k = (j * w + i) * 4;
      d[k] = r[0]; d[k + 1] = r[1]; d[k + 2] = r[2]; d[k + 3] = r[3] ?? 255;
      ex.forEach((e, n) => { const q = e.img.data; q[k] = q[k + 1] = q[k + 2] = r[4 + n]; q[k + 3] = 255; });
    }
    g.putImageData(img, 0, 0); ex.forEach(e => e.g.putImageData(e.img, 0, 0));
    return [c].concat(ex.map(e => e.c));
  }
  // ruído periódico em u (volta inteira) e livre em v
  const nU = (u, v, ku, kv, oit) => { const a = u * Math.PI * 2; return fbm(Math.cos(a) * ku, Math.sin(a) * ku, v * kv, oit); };
  const nUV = (u, v, k, oit) => { const a = u * Math.PI * 2, b = v * Math.PI * 2; return fbm(Math.cos(a) * k + 7, Math.sin(a) * k, Math.cos(b) * k + Math.sin(b) * k * .7, oit); };

  function casca(escura) {
    const n = "casca" + (escura ? "_escura" : "_clara");
    return memo(n, () => {
      const g = () => { const [c, rel] = plano(512, 1024, (u, v) => {
        const fissura = Math.pow(Math.abs(Math.sin((u * 26 + nU(u, v, 2.5, 3, 3) * 2.2) * Math.PI)), .35);
        const grao = nU(u, v, 18, 30, 3), liquen = cl((nU(u + .3, v, 6, 9, 4) - .08) * 4);
        let cc = escura ? mix([58, 54, 50], [28, 26, 25], 1 - fissura) : mix([200, 196, 186], [120, 112, 100], 1 - fissura);
        cc = mix(cc, escura ? [20, 20, 22] : [168, 182, 150], escura ? .4 * liquen : .55 * liquen);
        cc = cc.map(x => cl(x + grao * 30, 0, 255));
        return [cc[0], cc[1], cc[2], 255, cl(fissura * 230 + grao * 25, 0, 255)];
      }, [1]); CANV[n] = c; CANV[n + "_rel"] = rel; };
      return { map: tex(n, { wrapS: true }, g), bumpMap: tex(n + "_rel", { dados: true, wrapS: true }, g) };
    });
  }
  function grama() {
    return memo("grama", () => tex("grama", { rep: [5, 5] }, () => {
      const [c] = plano(512, 512, (u, v) => {
        const n = nUV(u, v, 3, 4), fino = nUV(u * 7 % 1, v * 7 % 1, 2, 2), seca = cl((nUV(u + .2, v, 1.4, 3) - .1) * 3);
        let cc = mix([86, 140, 52], [52, 98, 34], cl(.5 + n * 1.4)); cc = mix(cc, [150, 150, 80], seca * .45);
        return cc.map(x => cl(x + fino * 28, 0, 255));
      });
      CANV.grama = c;
    }));
  }
  function madeira() {
    return memo("madeira", () => tex("madeira", {}, () => {
      const [c] = plano(1024, 512, (u, v) => {
        const anel = Math.sin((v * 40 + nUV(u, v, 2, 3) * 6) * Math.PI) * .5 + .5, fibra = nUV(u * 3 % 1, v, 6, 2);
        const cc = mix([158, 110, 66], [118, 76, 42], anel * .8); return cc.map(x => cl(x + fibra * 22, 0, 255));
      });
      CANV.madeira = c;
    }));
  }
  function lava(c1, c2, c3, k) {
    const n = "lava_" + c1.toString(16) + "_" + k;
    return memo(n, () => tex(n, {}, () => {
      CANV[n] = esfera(1024, 512, (x, y, z) => { const t = cl(.5 + fbm(x * k, y * k, z * k, 5) * 1.3 + .25 * cristas(x * k * 2, y * k * 2, z * k * 2, 3) - .25); return rampa([[0, c1], [.55, c2], [1, c3]], t); })[0];
    }));
  }
  // rótulo impresso (pilha): fundo + texto
  function rotuloPilha() {
    return memo("pilha", () => {
      const W = 512, H = 1024, c = tela(W, H), g = c.getContext("2d");   // x = volta do cilindro, y = comprimento (topo = polo +)
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#fbbf24"); gr.addColorStop(.6, "#f97316"); gr.addColorStop(1, "#ea580c");
      g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = "#111827"; g.fillRect(0, H * .7, W, H * .3);
      g.save(); g.translate(W / 2, H * .42); g.rotate(-Math.PI / 2); g.fillStyle = "#fff"; g.font = "bold 120px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("1,5 V", 0, 0); g.restore();
      g.save(); g.translate(W / 2, H * .1); g.rotate(-Math.PI / 2); g.fillStyle = "#7c2d12"; g.font = "bold 130px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("+", 0, 0); g.restore();
      g.save(); g.translate(W / 2, H * .85); g.rotate(-Math.PI / 2); g.fillStyle = "#e5e7eb"; g.font = "bold 150px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("−", 0, 0); g.restore();
      return textura(c);
    });
  }
  function rosaVentos() {
    return memo("rosa", () => tex("rosa", {}, () => {
      const S = 1024, c = tela(S, S), g = c.getContext("2d"), m = S / 2;
      grama(); for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) g.drawImage(CANV.grama, i * S / 2, j * S / 2, S / 2, S / 2);
      g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 6; g.beginPath(); g.arc(m, m, S * .44, 0, 7); g.stroke();
      g.fillStyle = "rgba(255,255,255,.7)"; [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => { g.beginPath(); g.moveTo(m + dx * S * .4, m + dy * S * .4); g.lineTo(m + dy * 18, m - dx * 18); g.lineTo(m - dy * 18, m + dx * 18); g.fill(); });
      CANV.rosa = c;
    }));
  }
  // asa de mariposa salpicada
  function asa(escura) {
    const n = "asa" + (escura ? "_escura" : "_clara");
    return memo(n, () => tex(n, {}, () => {
      CANV[n] = plano(256, 256, (u, v) => { const n = nUV(u, v, 4, 4), p = cl((nUV(u + .5, v, 9, 2) - .15) * 6); let cc = escura ? mix([40, 36, 34], [18, 16, 16], cl(.5 + n)) : mix([238, 234, 224], [205, 198, 182], cl(.5 + n)); cc = mix(cc, escura ? [70, 66, 60] : [70, 66, 60], p * (escura ? .3 : .55)); return cc; })[0];
    }));
  }

  /* ---------- material de atmosfera (brilho na borda, efeito Fresnel) ---------- */
  function materialAtmosfera(cor, forca) {
    return new T.ShaderMaterial({
      uniforms: { cor: { value: new T.Color(cor) }, forca: { value: forca ?? 1 } },
      vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
      fragmentShader: "uniform vec3 cor; uniform float forca; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 2.6) * forca; gl_FragColor = vec4(cor, clamp(f, 0.0, 1.0)); }",
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.FrontSide
    });
  }

  // gera todas as texturas e devolve os nomes (usado só para criar os arquivos da pasta tex/)
  function gerarTudo() { terra(); nuvens(); lua(); sol(); Object.keys(PLAN).forEach(planeta); anel(); casca(false); casca(true); grama(); madeira(); rosaVentos(); asa(false); asa(true);
    [[0xf59e0b, 0xfde047, 0xfffbeb, 3], [0xc2410c, 0xf97316, 0xfacc15, 2.4], [0x7c2d12, 0xc2410c, 0xf97316, 1.6]].forEach(a => lava(...a)); return CANV; }
  window.TEX = { gerarTudo, ruido, fbm, cristas, elevTerra, MAR, terra, nuvens, lua, sol, brilho, planeta, anel, uvAnel, casca, grama, madeira, lava, rotuloPilha, rosaVentos, asa, materialAtmosfera, ALTA };
})();
