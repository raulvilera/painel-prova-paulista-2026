/* Estádio 3D da Copa SARESP (three.js r128): campo, gol com rede, goleiro, torcida e cobrança animada.
   Uso: const e = Estadio3D.criar(elemento, { largo: true }); await e.chute({ resultado: 'gol'|'defesa'|'fora', cor: '#e21b3c', corGoleiro: '#1368ce' });
   Visual original (sem marcas de jogos de futebol). Se o aparelho não tiver WebGL, criar() devolve null e a página segue sem 3D. */
(function () {
  const T = window.THREE;
  function suportado() {
    try { const c = document.createElement('canvas'); return !!(T && window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; }
  }
  const GOL_Z = -11, GOL_L = 7.32, GOL_A = 2.44, PROF = 2;

  function texturaCampo() {
    const c = document.createElement('canvas'); c.width = 512; c.height = 512; const g = c.getContext('2d');
    for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#1f6e2a' : '#257d31'; g.fillRect(0, i * 32, 512, 32); }
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(1, 1); return t;
  }
  function texturaBola() {
    const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, 256, 128); g.fillStyle = '#1b1b1b';
    const pent = (x, y, r) => { g.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; g.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); } g.closePath(); g.fill(); };
    [[32, 30], [96, 70], [160, 30], [224, 70], [64, 110], [192, 110], [128, 110], [0, 70], [256, 70]].forEach(([x, y]) => pent(x, y, 15));
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t;
  }
  function linhasCampo(cena) {
    const m = new T.LineBasicMaterial({ color: 0xffffff });
    const seg = pts => { const geo = new T.BufferGeometry().setFromPoints(pts.map(p => new T.Vector3(p[0], 0.02, p[1]))); cena.add(new T.Line(geo, m)); };
    seg([[-34, GOL_Z], [34, GOL_Z]]);                                       // linha de fundo
    seg([[-20.16, GOL_Z], [-20.16, GOL_Z + 16.5], [20.16, GOL_Z + 16.5], [20.16, GOL_Z]]);   // grande área
    seg([[-9.16, GOL_Z], [-9.16, GOL_Z + 5.5], [9.16, GOL_Z + 5.5], [9.16, GOL_Z]]);         // pequena área
    const arco = []; for (let a = 0.93; a <= Math.PI - 0.93; a += 0.05) arco.push([9.15 * Math.cos(a), GOL_Z + 11 + 9.15 * Math.sin(a)]); seg(arco);
    const marca = new T.Mesh(new T.CircleGeometry(0.12, 16), new T.MeshBasicMaterial({ color: 0xffffff })); marca.rotation.x = -Math.PI / 2; marca.position.set(0, 0.02, 0); cena.add(marca);
  }
  function golo(cena) {
    const g = new T.Group(), mat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const trave = (w, h, d, x, y, z) => { const b = new T.Mesh(new T.BoxGeometry(w, h, d), mat); b.position.set(x, y, z); b.castShadow = true; g.add(b); };
    trave(0.12, GOL_A, 0.12, -GOL_L / 2, GOL_A / 2, GOL_Z); trave(0.12, GOL_A, 0.12, GOL_L / 2, GOL_A / 2, GOL_Z); trave(GOL_L + 0.12, 0.12, 0.12, 0, GOL_A, GOL_Z);
    // rede: fundo, teto e laterais em malha (wireframe)
    const rede = new T.Group(), wm = new T.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.45 });
    const fundo = new T.Mesh(new T.PlaneGeometry(GOL_L, GOL_A, 20, 7), wm); fundo.position.set(0, GOL_A / 2, GOL_Z - PROF); rede.add(fundo);
    const teto = new T.Mesh(new T.PlaneGeometry(GOL_L, PROF, 20, 6), wm); teto.rotation.x = Math.PI / 2; teto.position.set(0, GOL_A, GOL_Z - PROF / 2); rede.add(teto);
    [-1, 1].forEach(s => { const l = new T.Mesh(new T.PlaneGeometry(PROF, GOL_A, 6, 7), wm); l.rotation.y = Math.PI / 2; l.position.set(s * GOL_L / 2, GOL_A / 2, GOL_Z - PROF / 2); rede.add(l); });
    g.add(rede); cena.add(g);
    return rede;
  }
  function goleiro(cena) {
    const g = new T.Group();
    const corpoM = new T.MeshStandardMaterial({ color: 0x1368ce, roughness: 0.6 }), pele = new T.MeshStandardMaterial({ color: 0xc68642, roughness: 0.8 }), luva = new T.MeshStandardMaterial({ color: 0xf5f5f5 });
    const corpo = new T.Mesh(new T.CylinderGeometry(0.28, 0.24, 0.85, 12), corpoM); corpo.position.y = 1.2; corpo.castShadow = true; g.add(corpo);
    const cab = new T.Mesh(new T.SphereGeometry(0.17, 16, 12), pele); cab.position.y = 1.78; g.add(cab);
    const pernaG = new T.CylinderGeometry(0.1, 0.09, 0.8, 8), calcao = new T.MeshStandardMaterial({ color: 0x111111 });
    [-0.13, 0.13].forEach(x => { const p = new T.Mesh(pernaG, calcao); p.position.set(x, 0.4, 0); p.castShadow = true; g.add(p); });
    const bracos = [];
    [-1, 1].forEach(s => { const b = new T.Group(); const a = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 0.7, 8), corpoM); a.position.y = -0.35; b.add(a); const l = new T.Mesh(new T.SphereGeometry(0.1, 10, 8), luva); l.position.y = -0.72; b.add(l); b.position.set(s * 0.33, 1.55, 0); b.rotation.z = s * 2.4; g.add(b); bracos.push(b); });
    g.position.set(0, 0, GOL_Z + 0.4); cena.add(g);
    return { g, corpoM, bracos };
  }
  function torcida(cena, n) {
    const geo = new T.BoxGeometry(0.45, 0.6, 0.35), mat = new T.MeshLambertMaterial();
    const inst = new T.InstancedMesh(geo, mat, n), m4 = new T.Matrix4(), cor = new T.Color();
    const cores = [0xe21b3c, 0x1368ce, 0xf2c200, 0x26890c, 0xffffff, 0x864cbf, 0xff7a00];
    for (let i = 0; i < n; i++) {
      const lado = i % 3, fila = Math.floor(Math.random() * 8), x = (Math.random() - 0.5) * (lado === 0 ? 46 : 30);
      if (lado === 0) m4.makeTranslation(x, 1 + fila * 0.75, GOL_Z - 7 - fila * 0.9);
      else m4.makeTranslation((lado === 1 ? -1 : 1) * (24 + fila * 0.9), 1 + fila * 0.75, GOL_Z + 4 + x * 0.6);
      inst.setMatrixAt(i, m4); inst.setColorAt(i, cor.setHex(cores[i % cores.length]));
    }
    cena.add(inst);
    const arq = new T.MeshLambertMaterial({ color: 0x6d7a86 });
    for (let f = 0; f < 8; f++) {
      const d = new T.Mesh(new T.BoxGeometry(50, 0.4, 0.9), arq); d.position.set(0, 0.6 + f * 0.75, GOL_Z - 7 - f * 0.9); cena.add(d);
      [-1, 1].forEach(s => { const l = new T.Mesh(new T.BoxGeometry(0.9, 0.4, 34), arq); l.position.set(s * (24 + f * 0.9), 0.6 + f * 0.75, GOL_Z + 4); cena.add(l); });
    }
    [[-26, -20], [26, -20]].forEach(([x, z]) => { const t = new T.Mesh(new T.BoxGeometry(0.5, 16, 0.5), arq); t.position.set(x, 8, z); cena.add(t); const p = new T.Mesh(new T.BoxGeometry(3, 1.2, 0.4), new T.MeshBasicMaterial({ color: 0xfff6c8 })); p.position.set(x, 16, z + 0.3); cena.add(p); });
    return inst;
  }

  function criar(el, opt) {
    opt = opt || {};
    if (!suportado()) return null;
    const ren = new T.WebGLRenderer({ antialias: true, alpha: false });
    ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, opt.largo ? 1.5 : 1.25));
    ren.shadowMap.enabled = !!opt.largo; ren.outputEncoding = T.sRGBEncoding;
    el.innerHTML = ''; el.appendChild(ren.domElement); ren.domElement.style.display = 'block'; ren.domElement.style.width = '100%'; ren.domElement.style.height = '100%';
    const cena = new T.Scene(); cena.background = new T.Color(0x0d1b2a); cena.fog = new T.Fog(0x0d1b2a, 40, 90);
    const cam = new T.PerspectiveCamera(opt.largo ? 48 : 55, 1, 0.1, 200);
    const base = opt.largo ? new T.Vector3(0, 3.2, 8) : new T.Vector3(0, 1.7, 5.2); cam.position.copy(base); cam.lookAt(0, 1.1, GOL_Z);
    cena.add(new T.HemisphereLight(0xdfefff, 0x2f6b2f, 0.75));
    const sol = new T.DirectionalLight(0xffffff, 0.9); sol.position.set(8, 18, 10); sol.castShadow = !!opt.largo; sol.shadow.mapSize.set(1024, 1024);
    Object.assign(sol.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15 }); cena.add(sol);
    const campo = new T.Mesh(new T.PlaneGeometry(80, 70), new T.MeshLambertMaterial({ map: texturaCampo() })); campo.rotation.x = -Math.PI / 2; campo.position.z = -5; campo.receiveShadow = true; cena.add(campo);
    linhasCampo(cena); const rede = golo(cena); const gk = goleiro(cena); torcida(cena, opt.largo ? 900 : 450);
    const bola = new T.Mesh(new T.SphereGeometry(0.11, 24, 16), new T.MeshStandardMaterial({ map: texturaBola(), roughness: 0.5 })); bola.castShadow = true; cena.add(bola);
    const casa = new T.Vector3(0, 0.11, 0); bola.position.copy(casa);

    let w = 0, h = 0;
    function medir() { const nw = el.clientWidth || 300, nh = el.clientHeight || 200; if (nw === w && nh === h) return; w = nw; h = nh; ren.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    function desenhar() { medir(); ren.render(cena, cam); }
    window.addEventListener('resize', desenhar);
    desenhar();

    let rodando = false;
    function chute(o) {
      o = o || {};
      if (rodando) return Promise.resolve();
      rodando = true;
      if (o.corGoleiro) gk.corpoM.color.set(o.corGoleiro);
      const lado = Math.random() < 0.5 ? -1 : 1, res = o.resultado || 'gol';
      const alvo = res === 'fora' ? new T.Vector3(lado * (GOL_L / 2 + 1.4), GOL_A + 1.2, GOL_Z - 3)
        : new T.Vector3(lado * (1.6 + Math.random() * 1.6), 0.35 + Math.random() * 1.6, GOL_Z - 0.2);
      const mergulho = res === 'defesa' ? lado : (res === 'gol' ? -lado : lado * (Math.random() < 0.5 ? 1 : -1));
      const voo = 900, total = 2300, t0 = performance.now(), ini = casa.clone();
      return new Promise(fim => {
        function quadro(agora) {
          const t = agora - t0, k = Math.min(1, t / voo);
          // bola: parábola até o alvo; na defesa, rebate para o lado
          if (res === 'defesa' && k >= 0.82) {
            const k2 = Math.min(1, (t - voo * 0.82) / 700);
            const pDef = new T.Vector3().lerpVectors(ini, alvo, 0.82); pDef.y += Math.sin(0.82 * Math.PI) * 0.6;
            bola.position.set(pDef.x + lado * 4 * k2, Math.max(0.11, pDef.y + 2 * k2 - 5 * k2 * k2), pDef.z + 3 * k2);
          } else if (res === 'gol' && k >= 1) {
            const k2 = Math.min(1, (t - voo) / 500);
            bola.position.set(alvo.x, Math.max(0.11, alvo.y - alvo.y * k2), alvo.z - 1.4 * Math.sin(k2 * Math.PI / 2));
            rede.position.z = -0.35 * Math.sin(Math.min(1, (t - voo) / 600) * Math.PI) ; rede.position.x = 0;
          } else {
            bola.position.lerpVectors(ini, alvo, k); bola.position.y += Math.sin(k * Math.PI) * (res === 'fora' ? 1.2 : 0.6);
          }
          bola.rotation.x -= 0.35; bola.rotation.y += 0.1;
          // goleiro mergulha a partir de 25% do voo
          const kg = Math.max(0, Math.min(1, (t - voo * 0.25) / (voo * 0.55)));
          gk.g.position.x = mergulho * 2.1 * kg; gk.g.position.y = Math.sin(kg * Math.PI) * 0.35;
          gk.g.rotation.z = -mergulho * 1.25 * kg; gk.bracos.forEach(b => { b.rotation.z = (b.position.x < 0 ? 1 : -1) * (2.4 + 0.5 * kg); });
          // câmera acompanha um pouco
          cam.position.set(base.x + bola.position.x * 0.15, base.y + (k * 0.25), base.z - k * 1.2); cam.lookAt(bola.position.x * 0.35, 1.1, GOL_Z);
          desenhar();
          if (t < total) requestAnimationFrame(quadro);
          else {   // volta tudo para a posição inicial
            bola.position.copy(casa); bola.rotation.set(0, 0, 0); rede.position.set(0, 0, 0);
            gk.g.position.set(0, 0, GOL_Z + 0.4); gk.g.rotation.set(0, 0, 0); cam.position.copy(base); cam.lookAt(0, 1.1, GOL_Z);
            desenhar(); rodando = false; fim();
          }
        }
        requestAnimationFrame(quadro);
      });
    }
    return { chute, desenhar, ocupado: () => rodando };
  }
  /* nomes dos times da Copa SARESP (homenagem a cientistas) e cores das camisas */
  const TIMES = [['Galileu FC', '#e21b3c'], ['Darwin EC', '#1368ce'], ['Curie FC', '#7a4bb3'], ['Newton EC', '#c98a00'], ['Chagas FC', '#26890c'], ['Pasteur EC', '#ff7a00'],
    ['Mendel FC', '#0f8b8d'], ['Kepler EC', '#c2185b'], ['Santos Dumont FC', '#3949ab'], ['Bertha Lutz EC', '#6d4c41'], ['Faraday FC', '#00897b'], ['Lavoisier EC', '#8d6e63'],
    ['Copérnico FC', '#1e88e5'], ['Hipátia EC', '#8e24aa'], ['Vital Brazil FC', '#43a047'], ['Lattes EC', '#f4511e'], ['Bohr FC', '#546e7a'], ['Rosalind EC', '#d81b60']];
  const time = g => { const t = TIMES[((Number(g) || 1) - 1) % TIMES.length]; return { nome: t[0], cor: t[1] }; };
  window.Estadio3D = { criar, suportado, time };
})();
