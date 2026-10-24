/* Dashboard de resultados dos alunos (somente leitura). Cada página define window.RES_CFG = { fonte:'em'|'individual', titulo, ... }.
   Login: reaproveita a sessão do professor feita no painel (mesmo endereço). Nada é gravado aqui. */
(function () {
  const CFG = window.RES_CFG, $ = id => document.getElementById(id);
  const SB_URL = 'https://ykrjfjepnqeoqlgupsbe.supabase.co', SB_KEY = 'sb_publishable_FbMU5x7WBpxzHmmVzOfh2g_0M1xxAh5';
  const NIVEIS = [['Abaixo do Básico', 'lv0', '<25%'], ['Básico', 'lv1', '25–49%'], ['Adequado', 'lv2', '50–74%'], ['Avançado', 'lv3', '≥75%']];
  const nivel = p => p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pct = v => Math.round(v * 100) + '%';
  const media = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  /* data e hora (horário de Brasília) em que o aluno enviou a atividade */
  const fmtData = d => { if (!d) return ''; const t = new Date(d); if (isNaN(t)) return ''; try { return t.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às'); } catch (e) { return ''; } };
  const nf = n => (Math.round(n * 10) / 10).toString().replace('.', ',');
  const S = { filtro: '', status: '', busca: '', open: new Set() };
  let TENT = [], ROSTER = {};

  function msg(html) { $('app').innerHTML = '<div class="card msg">' + html + '</div>'; }

  /* ---------- normalização: cada envio vira {turma, aluno, aval, itens:[{v, ae, desc, bim, rot}]} ---------- */
  const REV = {};   // envio bruto de cada aluno (simulado), para a revisão
  function norm(j) {
    const ult = new Map();
    (j.rows || []).forEach(r => {   // só o último envio de cada aluno em cada avaliação
      const turma = CFG.fonte === 'em' ? (r.turma || r.turma_id) : r.turma;
      const aval = CFG.fonte === 'em' ? r.avaliacao : (CFG.fonte === 'simulado' ? 'simulado' : 'atividade');
      ult.set(turma + '|' + r.nome + '|' + aval, { r, turma, aval });
    });
    return [...ult.values()].map(({ r, turma, aval }) => {
      const itens = [];
      (r.itens || []).forEach((i, ix) => {
        let v = null;
        if (i.tipo === 'obj') v = i.resp === null || i.resp === undefined || i.resp === '' ? 0 : (i.acerto ? 1 : 0);
        else if (typeof i.nota === 'number') v = Math.max(0, Math.min(1, i.nota));
        else if (typeof i.parcial === 'number') v = Math.max(0, Math.min(1, i.parcial));   // ligar/ordenar (atividade adaptada): acerto parcial vale
        const m = j.meta[CFG.fonte === 'em' ? i.id : i.k] || {};
        const q = { ia: i.ia && i.ia.nivel ? i.ia : null, n: m.n || ix + 1, tipo: i.tipo, enun: i.enun || m.enun || '', enunCompleto: !!i.enun, alts: Array.isArray(i.alts) && i.alts.length ? i.alts : null, correta: typeof i.correta === 'number' ? i.correta : null, marcIdx: typeof i.resp === 'number' ? i.resp : (/^[A-E]$/.test(String(i.resp || '').trim().toUpperCase()) ? 'ABCDE'.indexOf(String(i.resp).trim().toUpperCase()) : null), tResp: i.textoResp || '', tCor: i.textoCorreta || '', cor: m.cor || '', coment: i.comentario || '', nota: typeof i.nota === 'number' ? i.nota : null,
          marcou: i.tipo === 'obj' ? (typeof i.resp === 'number' ? 'ABCDE'[i.resp] : (i.resp || '')) : '', texto: i.tipo === 'dis' ? String(i.resp || i.resposta || '') : '' };
        if (v === null) return;   // dissertativa ainda sem nota: entra assim que for corrigida
        if (CFG.fonte === 'em') itens.push({ v, q, ae: m.ae ? m.ae + (m.hab ? ' · ' + m.hab : '') : (m.hab || 'Mapa do Provão'), desc: m.objeto || '—', bim: '', rot: m.objeto });
        else itens.push({ v, q, ae: (m.hab ? m.hab + ' · ' : '') + (m.ae || '—'), desc: m.desc || '—', bim: m.bim || '', rot: m.desc });
      });
      const parcial = (r.itens || []).some(i => i.tipo === 'dis' && typeof i.nota !== 'number');
      const rotAval = CFG.fonte === 'em' ? [r.componente, r.prova, (r.avaliacao.split('-')[1] || '') + 'ª série'].filter(Boolean).join(' · ') : (CFG.fonte === 'simulado' ? 'Simulado SARESP' : 'Atividade individual');
      return { turma, aluno: r.nome, id: r.id, aval, rotAval, itens, parcial, raw: r, nota: itens.length ? media(itens.map(i => i.v)) * 10 : null, criado: r.criado };
    });
  }

  /* ---------- agregação por dimensão (aprendizagem essencial / descritor) ---------- */
  function agrega(itens, chave) {
    const m = new Map();
    itens.forEach(i => { const k = i[chave]; if (!m.has(k)) m.set(k, []); m.get(k).push(i.v); });
    return [...m.entries()].map(([k, a]) => ({ k, p: media(a), n: a.length })).sort((x, y) => x.p - y.p);
  }
  function barras(lista, ref) {
    if (!lista.length) return '<p class="muted sm">Sem dados ainda.</p>';
    return lista.map(x => {
      const lv = nivel(x.p), r = ref && ref.get(x.k);
      return '<div class="bar" title="' + esc(x.k) + ' — ' + pct(x.p) + ' (' + NIVEIS[lv][0] + '), ' + x.n + ' questão(ões)' + (r != null ? '; turma: ' + pct(r) : '') + '">' +
        '<div class="nm">' + esc(x.k) + '<small>' + x.n + ' questão(ões)</small></div>' +
        '<div class="track"><div class="fill" style="width:' + Math.max(2, x.p * 100) + '%;background:var(--' + NIVEIS[lv][1] + ')"></div>' + (r != null ? '<div class="tick" style="left:calc(' + r * 100 + '% - 1px)"></div>' : '') + '</div>' +
        '<div class="val"><b>' + pct(x.p) + '</b><br><span class="muted" style="font-size:.72rem">' + NIVEIS[lv][0] + '</span></div></div>';
    }).join('');
  }
  const legenda = () => '<div class="legend">' + NIVEIS.map(n => '<span><i style="background:var(--' + n[1] + ')"></i>' + n[0] + ' (' + n[2] + ')</span>').join('') + '</div>';
  const chip = n => { const lv = nivel(n / 10); return '<span class="chip ' + NIVEIS[lv][1] + '"><i style="background:var(--' + NIVEIS[lv][1] + ')"></i>' + NIVEIS[lv][0] + '</span>'; };

  /* ---------- filtros ---------- */
  function filtrar() {
    let t = TENT;
    if (S.filtro) {
      if (CFG.fonte === 'em') t = t.filter(x => x.aval === S.filtro);
      else t = t.map(x => Object.assign({}, x, { itens: x.itens.filter(i => i.bim === S.filtro) })).filter(x => x.itens.length).map(x => Object.assign(x, { nota: media(x.itens.map(i => i.v)) * 10 }));
    }
    return t;
  }
  function opcoes(sel, lista, atual, todas) {
    sel.innerHTML = '<option value="">' + todas + '</option>' + lista.map(([v, r]) => '<option value="' + esc(v) + '"' + (v === atual ? ' selected' : '') + '>' + esc(r) + '</option>').join('');
  }
  const ordem = (a, b) => a.localeCompare(b, 'pt-BR', { numeric: true });
  const miniNiveis = niv => {
    const tot = niv.reduce((x, y) => x + y, 0);
    if (!tot) return '<span class="muted sm">—</span>';
    return '<div class="mini" role="img" aria-label="' + NIVEIS.map((n, i) => n[0] + ': ' + niv[i]).join(', ') + '">' + niv.map((n, i) => n ? '<i style="flex:' + n + ';background:var(--' + NIVEIS[i][1] + ')" title="' + NIVEIS[i][0] + ': ' + n + ' aluno(s)"></i>' : '').join('') + '</div>';
  };
  const partBar = (r, t) => { const p = t ? Math.round(r / t * 100) : 0; return '<div class="part"><div class="track"><div class="fill" style="width:' + p + '%;background:var(--accent)"></div></div><span><b>' + r + '</b>/' + t + ' · ' + p + '%</span></div>'; };

  /* agrupa por turma -> alunos (último envio de cada avaliação já considerado em TENT) */
  function montaTurmas(dados) {
    const nomes = new Set(Object.keys(ROSTER).concat(dados.map(x => x.turma)));
    return [...nomes].sort(ordem).map(t => {
      const al = new Map();
      (ROSTER[t] || []).forEach(n => al.set(n, { n, notas: [], itens: [], feito: false }));
      dados.filter(x => x.turma === t).forEach(x => {
        const o = al.get(x.aluno) || { n: x.aluno, notas: [], itens: [], feito: false }; o.feito = true; o.id = x.id; o.turma = t; if (x.raw && (!o.raw || !o.criado || new Date(x.criado) >= new Date(o.criado))) o.raw = x.raw; if (x.criado && (!o.criado || new Date(x.criado) > new Date(o.criado))) o.criado = x.criado;
        if (x.nota !== null) o.notas.push(x.nota); o.itens.push(...x.itens); o.parcial = o.parcial || x.parcial; al.set(x.aluno, o);
      });
      const alunos = [...al.values()].sort((a, b) => a.n.localeCompare(b.n, 'pt-BR'));
      alunos.forEach(a => { a.nota = a.notas.length ? media(a.notas) : null; a.apr = a.itens.length ? media(a.itens.map(i => i.v)) : null; });
      const niv = [0, 0, 0, 0]; alunos.forEach(a => { if (a.nota !== null) niv[nivel(a.nota / 10)]++; });
      const notas = alunos.filter(a => a.nota !== null).map(a => a.nota), itens = alunos.flatMap(a => a.itens);
      return { t, alunos, resp: alunos.filter(a => a.feito).length, total: alunos.length, niv, nota: notas.length ? media(notas) : null, apr: itens.length ? media(itens.map(i => i.v)) : null, itens };
    });
  }

  /* gráfico do aluno: descritores/aprendizagens atingidos (≥50%) e não atingidos (<50%), com a média da turma como referência */
  /* questões do aluno: acertou/errou, o que respondeu, descritor e aprendizagem essencial */
  function questoes(a) {
    const L = a.itens.filter(i => i.q).slice().sort((x, y) => x.q.n - y.q.n);
    if (!L.length) return '';
    const linha = linhaQ;
    const ac = L.filter(i => i.v >= .5).length;
    return '<details class="qs"><summary>Questões respondidas · ' + ac + ' acerto(s) e ' + (L.length - ac) + ' erro(s)</summary>' + L.map(linha).join('') + '</details>';
  }

  /* ---------- mapeamento das defasagens e como abordá-las (aluno e turma) ---------- */
  const ESTR = [
    { t: 'Retomada intensiva do conceito-base', l: ['Reapresentar o conceito do zero, com exemplo concreto, modelo, imagem ou experimento curto (ensino explícito, 1 ideia por vez).', 'Atender em pequeno grupo ou tutoria de 10–15 min, com exemplo resolvido em voz alta e depois o aluno refaz com apoio.', 'Usar questões de entrada mais simples (reconhecer, nomear, relacionar) antes de pedir explicações ou aplicações.'] },
    { t: 'Prática guiada', l: ['Partir do erro: pedir que o aluno explique por que escolheu aquela resposta e corrigir a ideia, não só o resultado.', 'Atividade em dupla com um colega Avançado nesse descritor (tutoria entre pares), com roteiro de perguntas.', 'Contextualizar com situação do cotidiano ou da turma antes de voltar ao formato da prova.'] },
    { t: 'Consolidação', l: ['Propor situações-problema no formato SARESP e pedir justificativa da alternativa escolhida e do porquê das outras estarem erradas.', 'Variar o contexto do mesmo descritor (outro exemplo, outro gráfico/tabela) para garantir transferência.'] },
    { t: 'Aprofundamento', l: ['Convidar para monitoria: explicar o conceito ao colega do grupo de apoio.', 'Desafios de maior complexidade: interpretar gráfico/experimento novo e propor hipótese.'] }
  ];
  const porTipo = tipos => {
    const o = [];
    if (tipos.has('dis')) o.push('Nas dissertativas: estrutura de resposta em 3 passos (afirmação → evidência/dado → explicação) com modelo e frase de apoio.');
    if (tipos.has('assoc') || tipos.has('ordem')) o.push('Nas de ligar/ordenar: usar cartões físicos para montar a relação ou a sequência antes de registrar.');
    if (tipos.has('obj')) o.push('Nas objetivas: analisar os distratores (por que cada alternativa errada atrai) e treinar a leitura do comando.');
    return o;
  };
  const rotNivel = lv => ['Abaixo do Básico', 'Básico', 'Adequado', 'Avançado'][lv];

  /* ---------- gráficos de pizza 3D (SVG, sem biblioteca): fatias = níveis de proficiência; clicar numa fatia amplia e mostra as questões e respostas ---------- */
  const G = {}; let GID = 0;
  function pizza3d(fat, W, titulo, o) {
    o = o || {}; const tot = fat.reduce((s, f) => s + f.v, 0); W = W || 200;
    if (!tot) return '<p class="muted sm">Sem dados.</p>';
    const gid = o.g || ++GID; if (!o.g) G[gid] = { fat, titulo };
    const cx = W / 2, rx = W * .4, ry = W * .23, h = W * .08, cy = ry + 4 + (o.sel != null ? W * .05 : 0), H = cy + ry + h + 8 + (o.sel != null ? W * .05 : 0), P = Math.PI;
    const pt = (a, dy) => (cx + rx * Math.cos(a)).toFixed(1) + ',' + (cy + ry * Math.sin(a) + (dy || 0)).toFixed(1);
    let ang = -P / 2; const f2 = [];
    fat.forEach((f, ix) => { if (f.v > 0) { const a0 = ang; ang += f.v / tot * 2 * P; f2.push({ f, ix, a0, a1: f2.length === 0 && f.v === tot ? a0 + 2 * P - .0001 : ang }); } });
    f2.sort((x, y) => (x.ix === o.sel) - (y.ix === o.sel) || Math.sin((x.a0 + x.a1) / 2) - Math.sin((y.a0 + y.a1) / 2));
    let gs = '', lbl = '';
    f2.forEach(({ f, ix, a0, a1 }) => {
      const m = (a0 + a1) / 2, ex = ix === o.sel ? W * .06 : 0, tr = ex ? ' transform="translate(' + (ex * Math.cos(m)).toFixed(1) + ',' + (ex * .6 * Math.sin(m)).toFixed(1) + ')"' : '';
      const parte = (x0, x1) => { const s = Math.max(x0, 0), e = Math.min(x1, P); return e > s ? [s, e] : null; };
      const vis = [parte(a0, a1), parte(a0 - 2 * P, a1 - 2 * P), parte(a0 + 2 * P, a1 + 2 * P)].filter(Boolean);
      let w = '';
      vis.forEach(([s, e]) => { const d = 'M' + pt(s) + ' A' + rx + ' ' + ry + ' 0 ' + (e - s > P ? 1 : 0) + ' 1 ' + pt(e) + ' L' + pt(e, h) + ' A' + rx + ' ' + ry + ' 0 ' + (e - s > P ? 1 : 0) + ' 0 ' + pt(s, h) + ' Z'; w += '<path d="' + d + '" style="fill:' + f.c + '"/><path d="' + d + '" fill="#000" opacity=".32"/>'; });
      const at = ' class="fatia" data-g="' + gid + '" data-i="' + ix + '" tabindex="0" role="button" aria-label="' + esc(f.r + ': ' + f.v + ' — clique para ver as questões') + '"';
      const top = f2.length === 1 ? '<ellipse' + at + ' cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" style="fill:' + f.c + '" stroke="#fff" stroke-width="1"><title>' + esc(f.r) + ': ' + f.v + ' (' + Math.round(f.v / tot * 100) + '%) — clique para ver as questões</title></ellipse>'
        : '<path' + at + ' d="M' + cx + ',' + cy + ' L' + pt(a0) + ' A' + rx + ' ' + ry + ' 0 ' + (a1 - a0 > P ? 1 : 0) + ' 1 ' + pt(a1) + ' Z" style="fill:' + f.c + '" stroke="#fff" stroke-width="1"><title>' + esc(f.r) + ': ' + f.v + ' (' + Math.round(f.v / tot * 100) + '%) — clique para ver as questões</title></path>';
      gs += '<g' + tr + '>' + w + top;
      if (f.v / tot >= .08) gs += '<text x="' + (cx + rx * .6 * Math.cos(m)).toFixed(1) + '" y="' + (cy + ry * .6 * Math.sin(m) + 4).toFixed(1) + '" text-anchor="middle" font-size="' + Math.round(W * .06) + '" font-weight="800" fill="#fff" stroke="#000" stroke-width=".6" paint-order="stroke" pointer-events="none">' + f.v + '</text>';
      gs += '</g>';
    });
    const leg = fat.map((f, ix) => '<li class="' + (f.v ? 'pzli' : '') + (ix === o.sel ? ' sel' : '') + '" data-g="' + gid + '" data-i="' + ix + '"><i style="background:' + f.c + '"></i>' + esc(f.r) + ': <b>' + f.v + '</b> (' + Math.round(f.v / tot * 100) + '%)</li>').join('');
    return '<figure class="pz"><svg viewBox="0 0 ' + W + ' ' + H.toFixed(0) + '" width="' + W + '" role="group" aria-label="' + esc(titulo || 'Gráfico de pizza') + '">' + gs + '</svg><ul class="pzl">' + leg + '</ul></figure>';
  }
  /* janela ampliada: fatia destacada + detalhes (questões e respostas) */
  function abrePizza(gid, ix) {
    const g = G[gid]; if (!g || !g.fat[ix] || !g.fat[ix].v) return;
    let m = $('pzModal');
    if (!m) { m = document.createElement('div'); m.id = 'pzModal'; m.className = 'pzm'; m.innerHTML = '<div class="pzbox" role="dialog" aria-modal="true"><button type="button" class="pzx" aria-label="Fechar">✕</button><h3 class="pzh"></h3><div class="pzb"><div class="pzbig"></div><div class="pzd"></div></div></div>'; document.body.appendChild(m);
      m.addEventListener('click', e => { if (e.target === m || e.target.closest('.pzx')) fechaPizza(); }); }
    const f = g.fat[ix];
    m.querySelector('.pzh').textContent = (g.titulo || '') + ' · ' + f.r + ' (' + f.v + ')';
    m.querySelector('.pzbig').innerHTML = pizza3d(g.fat, 300, g.titulo, { g: gid, sel: ix });
    m.querySelector('.pzd').innerHTML = f.det ? f.det() : '<p class="muted">Sem detalhes.</p>';
    m.hidden = false; document.body.style.overflow = 'hidden'; m.querySelector('.pzx').focus();
  }
  function fechaPizza() { const m = $('pzModal'); if (m) m.hidden = true; document.body.style.overflow = ''; }
  document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('.fatia, .pzli'); if (t) abrePizza(+t.dataset.g, +t.dataset.i); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fechaPizza(); else if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('fatia')) { e.preventDefault(); abrePizza(+e.target.dataset.g, +e.target.dataset.i); } });

  const NV = NIVEIS.map(n => n[0]);
  const contaNiv = lista => { const c = [0, 0, 0, 0]; lista.forEach(x => c[nivel(x.p)]++); return c; };
  /* fatias por nível; det(L) devolve o HTML do detalhe do nível L */
  const fatNiv = (niv, det) => NIVEIS.map((n, i) => ({ r: n[0], v: niv[i] || 0, c: 'var(--' + n[1] + ')', det: det ? () => det(i) : null }));
  const pzCard = (t, sub, svg) => '<div class="pzc"><h4>' + esc(t) + '</h4>' + (sub ? '<div class="muted sm">' + esc(sub) + '</div>' : '') + svg + '</div>';
  const nomeCurto = n => n;
  /* blocos de detalhe */
  const qHtml = its => its.length ? its.slice().sort((x, y) => x.q.n - y.q.n).map(linhaQ).join('') : '<p class="muted sm">Sem questões.</p>';
  const blocoTema = (rot, p, its) => '<details class="qs" open><summary>' + esc(rot) + ' · ' + pct(p) + ' (' + NV[nivel(p)] + ')</summary>' + qHtml(its) + '</details>';
  /* aluno: fatia de descritores/aprendizagens de um nível → cada tema com as suas questões e respostas */
  const detTemasAluno = (a, chave, L) => () => { const l = agrega(a.itens, chave).filter(x => nivel(x.p) === L); return l.length ? l.map(x => blocoTema(x.k, x.p, a.itens.filter(i => i[chave] === x.k))).join('') : '<p class="muted">Nenhum item neste nível.</p>'; };
  function pizzasAluno(a) {
    if (!a.feito || !a.itens.length) return '';
    const ds = agrega(a.itens, 'desc'), as = agrega(a.itens, 'ae'), it = a.itens;
    const fq = [[i => i.v >= .7, 'Acertou (≥70%)', 'var(--lv3)'], [i => i.v >= .3 && i.v < .7, 'Parcial (30–69%)', 'var(--lv1)'], [i => i.v < .3, 'Errou (<30%)', 'var(--lv0)']].map(([fn, r, c]) => ({ r, v: it.filter(fn).length, c, det: () => qHtml(it.filter(fn)) }));
    return '<div class="plano"><h3>Gráficos de pizza 3D do aluno <span class="muted sm">· clique numa fatia para ampliar e ver as questões e as respostas</span></h3><div class="pzg">' +
      pzCard('Descritores por nível', ds.length + ' descritor(es)', pizza3d(NIVEIS.map((n, L) => ({ r: n[0], v: contaNiv(ds)[L], c: 'var(--' + n[1] + ')', det: detTemasAluno(a, 'desc', L) })), 190, 'Descritores · ' + a.n)) +
      pzCard('Aprendizagens essenciais por nível', as.length + ' aprendizagem(ns)', pizza3d(NIVEIS.map((n, L) => ({ r: n[0], v: contaNiv(as)[L], c: 'var(--' + n[1] + ')', det: detTemasAluno(a, 'ae', L) })), 190, 'Aprendizagens · ' + a.n)) +
      pzCard('Questões', it.length + ' questão(ões)', pizza3d(fq, 190, 'Questões · ' + a.n)) + '</div></div>';
  }
  function pizzasTurma(tm) {
    const al = tm.alunos.filter(a => a.feito && a.itens.length);
    if (!al.length) return '';
    const ds = agrega(tm.itens, 'desc'), as = agrega(tm.itens, 'ae');
    const nivTema = (a, chave, k) => { const x = agrega(a.itens, chave).find(z => z.k === k); return x ? nivel(x.p) : -1; };
    /* alunos que responderam um tema, com as suas questões; L = só os que estão no nível L */
    const alunosTema = (chave, k, L) => { const l = al.filter(a => a.itens.some(i => i[chave] === k) && (L == null || nivTema(a, chave, k) === L)); return l.length ? l.map(a => { const its = a.itens.filter(i => i[chave] === k), p = media(its.map(i => i.v)); return '<details class="qs"' + (l.length <= 3 ? ' open' : '') + '><summary><b>' + esc(a.n) + '</b> · ' + pct(p) + ' (' + NV[nivel(p)] + ')' + (a.criado ? ' · ' + esc(fmtData(a.criado)) : '') + '</summary>' + qHtml(its) + '</details>'; }).join('') : '<p class="muted">Nenhum aluno neste nível.</p>'; };
    const por = chave => {
      const m = new Map();
      al.forEach(a => agrega(a.itens, chave).forEach(x => { if (!m.has(x.k)) m.set(x.k, [0, 0, 0, 0]); m.get(x.k)[nivel(x.p)]++; }));
      return [...m.entries()].map(([k, c]) => ({ k, c, n: c.reduce((x, y) => x + y, 0), pior: (c[0] + c[1]) / c.reduce((x, y) => x + y, 0) })).sort((x, y) => y.pior - x.pior);
    };
    const gal = (l, chave, rot) => '<div class="pzg pzs">' + l.map(x => '<div class="pzc"><h4>' + esc(x.k) + '</h4><div class="muted sm">' + x.n + ' aluno(s) avaliado(s) neste ' + rot + '</div>' + pizza3d(fatNiv(x.c, L => alunosTema(chave, x.k, L)), 150, x.k) + '</div>').join('') + '</div>';
    /* turma: fatia de alunos por nível → cada aluno com todas as questões */
    const detAlunos = L => al.filter(a => a.nota !== null && nivel(a.nota / 10) === L).map(a => '<details class="qs"><summary><b>' + esc(a.n) + '</b> · nota ' + nf(a.nota) + ' · aproveitamento ' + pct(a.apr) + (a.criado ? ' · ' + esc(fmtData(a.criado)) : '') + '</summary>' + qHtml(a.itens) + '</details>').join('') || '<p class="muted">Nenhum aluno neste nível.</p>';
    /* turma: fatia de aprendizagens/descritores por nível → cada tema com as respostas de todos os alunos */
    const detTemasTurma = (lista, chave) => L => { const l = lista.filter(x => nivel(x.p) === L); return l.length ? l.map(x => '<h4 class="gn" style="color:var(--fg)">' + esc(x.k) + ' · turma ' + pct(x.p) + '</h4>' + alunosTema(chave, x.k, null)).join('') : '<p class="muted">Nenhum item neste nível.</p>'; };
    return '<div class="plano"><h3>Gráficos de pizza 3D da turma <span class="muted sm">· clique numa fatia para ampliar e ver as questões e as respostas dos alunos</span></h3><div class="pzg">' +
      pzCard('Alunos por nível', al.length + ' aluno(s) com atividade', pizza3d(fatNiv(tm.niv, detAlunos), 200, 'Alunos por nível')) +
      pzCard('Aprendizagens essenciais por nível', as.length + ' aprendizagem(ns), média da turma', pizza3d(fatNiv(contaNiv(as), detTemasTurma(as, 'ae')), 200, 'Aprendizagens por nível')) +
      pzCard('Descritores por nível', ds.length + ' descritor(es), média da turma', pizza3d(fatNiv(contaNiv(ds), detTemasTurma(ds, 'desc')), 200, 'Descritores por nível')) + '</div>' +
      '<details class="qs"><summary>Por aprendizagem essencial: como os alunos se distribuem em cada uma (' + por('ae').length + ')</summary>' + gal(por('ae'), 'ae', 'tema') + '</details>' +
      '<details class="qs"><summary>Por descritor: como os alunos se distribuem em cada um (' + por('desc').length + ')</summary>' + gal(por('desc'), 'desc', 'descritor') + '</details></div>';
  }
    /* alternativas completas: a marcada pelo aluno e a correta (quando o envio guardou as alternativas) */
  function altsHtml(q, i) {
    var corIdx = q.correta != null ? q.correta : (q.tCor ? q.alts.findIndex(function (x) { return String(x).trim() === String(q.tCor).trim(); }) : -1);
    return '<ol type="A" class="alts">' + q.alts.map(function (a, k) {
      var c = [];
      if (k === corIdx) c.push('cert');
      if (k === q.marcIdx && k !== corIdx) c.push('marc');
      return '<li' + (c.length ? ' class="' + c.join(' ') + '"' : '') + '>' + esc(a) + '</li>';
    }).join('') + '</ol>';
  }
  function linhaQ(i) {
      const q = i.q; let st, tx;
      if (q.tipo === 'obj') {
        const ok = i.v === 1; st = ok ? 'ok' : 'er';
        tx = !q.marcou ? 'Não respondeu' : 'Marcou <b>' + esc(q.marcou) + '</b>' + (q.tResp ? ' (' + esc(q.tResp) + ')' : '') + (q.cor ? ' · Correta <b>' + esc(q.cor) + '</b>' : '') + (q.tCor ? ' (' + esc(q.tCor) + ')' : '');
      } else if (q.tipo === 'assoc' || q.tipo === 'ordem') {
        st = i.v >= 1 ? 'ok' : i.v > 0 ? 'pa' : 'er';
        tx = (q.tipo === 'ordem' ? 'Ordenar' : 'Ligar') + ' · <b>' + Math.round(i.v * 100) + '%</b> certo' + (q.tResp ? '<br>Aluno: ' + esc(q.tResp) : '') + (q.tCor && i.v < 1 ? '<br>Correto: ' + esc(q.tCor) : '');
      } else {
        st = i.v >= .7 ? 'ok' : i.v >= .4 ? 'pa' : 'er';
        tx = 'Dissertativa · nota <b>' + nf(i.v) + '</b> de 1' + (q.texto ? '' : ' · sem resposta');
      }
      return '<div class="qr"><span class="qb ' + st + '" title="' + (st === 'ok' ? 'Acertou' : st === 'pa' ? 'Parcial' : 'Errou') + '">' + (st === 'ok' ? '✓' : st === 'pa' ? '~' : '✗') + '</span><div class="qc">' +
        '<div><b>Questão ' + q.n + '</b> <span class="muted">· ' + tx + '</span></div>' +
        '<div class="qd"><b>Aprendizagem/habilidade:</b> ' + esc(i.ae) + '</div><div class="qd"><b>Descritor:</b> ' + esc(i.desc) + '</div>' +
        (q.enun ? '<div class="qe">' + esc(q.enun) + (q.enun.length >= 255 && !q.enunCompleto ? '…' : '') + '</div>' : '') +
        (q.alts ? altsHtml(q, i) : '') +
        (q.ia ? '<div class="iaw ' + esc(q.ia.nivel) + '"><b>⚠ Possível uso de IA (' + (q.ia.nivel === 'alto' ? 'indício forte' : 'indício moderado') + ')</b> — ' + esc(q.ia.motivo || '') + (q.ia.zerada ? '<br><b>Nota zerada pelo critério</b>' + (q.ia.notaOriginal != null ? ' (nota original da correção: ' + nf(q.ia.notaOriginal) + ')' : '') : '') + '<br><span class="muted">É um indício, não uma prova: converse com o aluno e peça que explique a resposta com as próprias palavras.</span></div>' : '') + (q.texto ? '<blockquote class="qt">' + esc(q.texto) + '</blockquote>' : '') + (q.coment ? '<div class="qd muted"><b>Comentário da correção:</b> ' + esc(q.coment) + '</div>' : '') + '</div></div>';
  }
  function planoAluno(a, tm) {
    const l = agrega(a.itens, 'desc').filter(x => x.p < .5);
    if (!a.feito) return '';
    if (!l.length) return '<div class="plano"><h3>Como trabalhar com este aluno</h3><p class="sm">Sem defasagens nos descritores avaliados. ' + ESTR[3].l.join(' ') + '</p></div>';
    const cards = l.map(x => {
      const lv = nivel(x.p), it = a.itens.filter(i => i.desc === x.k), tipos = new Set(it.map(i => i.q && i.q.tipo)), ae = it[0].ae;
      const col = tm.alunos.filter(b => b !== a && b.itens.some(i => i.desc === x.k)).map(b => ({ n: b.n, p: media(b.itens.filter(i => i.desc === x.k).map(i => i.v)) })).filter(b => b.p >= .75).slice(0, 2).map(b => b.n.split(' ').slice(0, 2).join(' '));
      const e = ESTR[lv];
      return '<div class="pc"><div class="ph"><span class="chip ' + NIVEIS[lv][1] + '"><i style="background:var(--' + NIVEIS[lv][1] + ')"></i>' + rotNivel(lv) + ' · ' + pct(x.p) + '</span> <b>' + esc(x.k) + '</b></div>' +
        '<div class="qd"><b>Aprendizagem/habilidade:</b> ' + esc(ae) + '</div><div class="qd"><b>Abordagem sugerida · ' + e.t + '</b></div><ul>' + e.l.map(z => '<li>' + esc(z) + '</li>').join('') + porTipo(tipos).map(z => '<li>' + esc(z) + '</li>').join('') +
        (lv <= 1 && col.length ? '<li>Sugestão de dupla: ' + esc(col.join(' ou ')) + ' (bom desempenho neste descritor).</li>' : '') + '</ul></div>';
    });
    return '<div class="plano"><h3>Mapeamento das defasagens e como abordar (' + l.length + ')</h3><p class="muted sm">Em ordem da maior para a menor defasagem; a abordagem muda conforme o nível e o tipo de questão em que o aluno errou.</p>' + cards.join('') + '</div>';
  }
  function planoTurma(tm) {
    const m = new Map();
    tm.alunos.filter(a => a.feito).forEach(a => agrega(a.itens, 'desc').forEach(x => { if (!m.has(x.k)) m.set(x.k, { k: x.k, ae: a.itens.find(i => i.desc === x.k).ae, al: [] }); m.get(x.k).al.push({ n: a.n, p: x.p }); }));
    const L = [...m.values()].map(d => { d.p = media(d.al.map(z => z.p)); d.baixo = d.al.filter(z => z.p < .5).length; d.sh = d.baixo / d.al.length; return d; }).filter(d => d.p < .5 || d.sh >= .4).sort((x, y) => y.sh - x.sh || x.p - y.p);
    if (!L.length) return '<div class="plano"><h3>Plano de intervenção da turma</h3><p class="sm">Nenhum descritor com defasagem relevante na turma (nada abaixo de 50% na média e menos de 40% dos alunos abaixo de 50%).</p></div>';
    const prim = n => n.split(' ').slice(0, 2).join(' ');
    const cards = L.map((d, ix) => {
      const lv = nivel(d.p), ab = d.al.filter(z => z.p < .25).map(z => prim(z.n)), ap = d.al.filter(z => z.p >= .25 && z.p < .5).map(z => prim(z.n)), mo = d.al.filter(z => z.p >= .75).map(z => prim(z.n));
      const acao = d.sh >= .5 ? 'Metade ou mais da turma não atingiu: reensinar com a turma toda (aula dialogada com exemplo/experimento + prática guiada), depois fechar com as questões da prova.' :
        d.sh >= .25 ? 'Parte da turma não atingiu: formar grupos de intervenção (rotação por estações) enquanto os demais consolidam.' : 'Poucos alunos abaixo: atender em tutoria individual ou em pequenos grupos, sem parar a turma.';
      const lst = (r, a) => a.length ? '<div class="qd"><b>' + r + ':</b> ' + esc(a.join(', ')) + '</div>' : '';
      return '<div class="pc"><div class="ph"><span class="chip ' + NIVEIS[lv][1] + '"><i style="background:var(--' + NIVEIS[lv][1] + ')"></i>Prioridade ' + (ix + 1) + ' · ' + pct(d.p) + '</span> <b>' + esc(d.k) + '</b></div>' +
        '<div class="qd"><b>Aprendizagem/habilidade:</b> ' + esc(d.ae) + '</div><div class="qd"><b>' + d.baixo + ' de ' + d.al.length + ' alunos (' + pct(d.sh) + ') abaixo de 50%.</b> ' + esc(acao) + '</div>' +
        lst('Retomada intensiva (abaixo de 25%)', ab) + lst('Prática guiada (25–49%)', ap) + lst('Possíveis monitores (75% ou mais)', mo) + '</div>';
    });
    return '<div class="plano"><h3>Plano de intervenção da turma — descritores prioritários (' + L.length + ')</h3><p class="muted sm">Ordenados pela parcela de alunos abaixo de 50%. Nomes por descritor para formar grupos e duplas de apoio.</p>' + cards.join('') + '</div>';
  }
  const podeLiberar = () => CFG.fonte === 'individual' || CFG.fonte === 'simulado';
  let TOKEN = '';
  async function liberar(btn) {
    const t = btn.dataset.t, n = btn.dataset.a, id = btn.dataset.id;
    if (!confirm('Liberar novo envio para ' + n + ' (' + t + ')?\n\nO envio atual será APAGADO dos relatórios e o aluno poderá refazer a atividade. Isso não pode ser desfeito.')) return;
    btn.disabled = true; btn.textContent = 'Liberando…';
    try {
      const r = await fetch('/api/resultados', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + TOKEN }, body: JSON.stringify({ acao: 'liberar', fonte: CFG.fonte, id: id ? Number(id) : undefined, turma: t, nome: n }) });
      const j = await r.json().catch(() => ({ ok: false, erro: 'resposta inválida (HTTP ' + r.status + ')' }));
      if (!j.ok) throw new Error(j.erro || 'Erro ao liberar.');
      TENT = TENT.filter(x => !(x.turma === t && x.aluno === n));
      alert(n + ' está liberado(a): já pode enviar de novo.'); desenha();
    } catch (e) { btn.disabled = false; btn.textContent = '🔓 Liberar novo envio'; alert('Não foi possível liberar: ' + e.message); }
  }
  function graficoAluno(a, tm) {
    if (!a.feito) return '<p class="muted">Este aluno ainda não realizou a atividade.</p>';
    const dim = (chave, ref) => {
      const l = agrega(a.itens, chave), nao = l.filter(x => x.p < .5), ok = l.filter(x => x.p >= .5);
      return (nao.length ? '<h4 class="gn">✗ Não atingidos (' + nao.length + ')</h4>' + barras(nao, ref) : '') + (ok.length ? '<h4 class="ga">✓ Atingidos (' + ok.length + ')</h4>' + barras(ok, ref) : '') || '<p class="muted sm">Sem dados.</p>';
    };
    const refAe = new Map(agrega(tm.itens, 'ae').map(x => [x.k, x.p])), refDs = new Map(agrega(tm.itens, 'desc').map(x => [x.k, x.p]));
    return (a.criado ? '<p class="muted sm" style="margin:0 0 8px">📅 Atividade realizada em <b>' + esc(fmtData(a.criado)) + '</b></p>' : '') +
      (CFG.fonte === 'simulado' && a.raw ? (REV[tm.t + '|' + a.n] = a.raw, '<p class="lib"><button class="revb" data-k="' + esc(tm.t + '|' + a.n) + '">📄 Ver a atividade como o aluno fez</button><span class="muted sm"> Abre a prova do jeito que o aluno viu, com as respostas dele marcadas.</span></p>') : '') +
      (podeLiberar() ? '<p class="lib"><button class="libb" data-t="' + esc(tm.t) + '" data-a="' + esc(a.n) + '" data-id="' + esc(a.id == null ? '' : a.id) + '">🔓 Liberar novo envio</button><span class="muted sm"> Use se o aluno diz que não fez e aparece “já enviou”. O envio atual é apagado.</span></p>' : '') + questoes(a) + planoAluno(a, tm) + pizzasAluno(a) + '<div class="g2"><div><h3>Aprendizagens essenciais / habilidades</h3>' + dim('ae', refAe) + '</div><div><h3>Descritores' + (CFG.fonte === 'em' ? ' / objetos' : '') + '</h3>' + dim('desc', refDs) + '</div></div>' +
      '<p class="muted sm">Barra = aproveitamento do aluno; traço preto = média da turma. Atingido: aproveitamento a partir de 50% (Adequado ou Avançado).' + (a.parcial ? ' Nota parcial: dissertativa ainda em correção.' : '') + '</p>';
  }
  function corpoTurma(tm) {
    const q = S.busca.trim().toUpperCase();
    let lin = tm.alunos;
    if (S.status === 'ok') lin = lin.filter(a => a.feito); else if (S.status === 'pend') lin = lin.filter(a => !a.feito);
    if (q) lin = lin.filter(a => a.n.toUpperCase().indexOf(q) >= 0);
    const vis = '<details class="sub" data-k="' + esc(tm.t) + '|#turma"' + (S.open.has(tm.t + '|#turma') ? ' open' : '') + '><summary>Desempenho da turma por aprendizagem essencial e descritor</summary><div class="lz"></div></details>';
    const cab = '<div class="arow head"><span>Nº</span><span>Aluno</span><span>Situação</span><span class="num">Nota</span><span>Nível</span><span class="num">Aproveit.</span></div>';
    return vis + '<div class="alist">' + cab + (lin.length ? lin.map((a, i) => {
      const k = tm.t + '|' + a.n;
      return '<details class="al' + (a.feito ? '' : ' pendr') + '" data-k="' + esc(k) + '" data-t="' + esc(tm.t) + '" data-a="' + esc(a.n) + '"' + (S.open.has(k) ? ' open' : '') + '><summary class="arow"><span class="muted">' + (tm.alunos.indexOf(a) + 1) + '</span><span class="nmal">' + esc(a.n) + '</span>' +
        '<span>' + (a.feito ? '<span class="st ok">✓ Realizou</span>' + (a.criado ? '<br><span class="muted" style="font-size:.72rem">' + esc(fmtData(a.criado)) + '</span>' : '') : '<span class="st pend">Pendente</span>') + '</span>' +
        '<span class="num">' + (a.nota === null ? '—' : '<b>' + nf(a.nota) + '</b>') + '</span><span>' + (a.nota === null ? '—' : chip(a.nota)) + '</span><span class="num">' + (a.apr === null ? '—' : pct(a.apr)) + '</span></summary><div class="lz"></div></details>';
    }).join('') : '<p class="muted sm" style="padding:8px">Nenhum aluno para este filtro.</p>') + '</div>';
  }

  let TURMAS = [];
  function desenha() {
    const dados = filtrar();
    TURMAS = montaTurmas(dados);
    const q = S.busca.trim().toUpperCase();
    let lista = TURMAS;
    if (q) lista = lista.filter(t => t.alunos.some(a => a.n.toUpperCase().indexOf(q) >= 0));
    if (S.status === 'ok') lista = lista.filter(t => t.resp > 0); else if (S.status === 'pend') lista = lista.filter(t => t.resp < t.total);
    const tot = TURMAS.reduce((s, t) => s + t.total, 0), resp = TURMAS.reduce((s, t) => s + t.resp, 0), gn = [0, 0, 0, 0];
    TURMAS.forEach(t => t.niv.forEach((n, i) => gn[i] += n));
    const notas = TURMAS.flatMap(t => t.alunos.filter(a => a.nota !== null).map(a => a.nota)), itens = TURMAS.flatMap(t => t.itens);
    let h = '<section class="card"><div class="kpis">' +
      '<div class="kpi"><b>' + resp + '<span style="font-size:1rem"> / ' + tot + '</span></b><span>alunos que realizaram</span></div>' +
      '<div class="kpi"><b>' + (notas.length ? nf(media(notas)) : '—') + '</b><span>nota média (0–10)</span></div>' +
      '<div class="kpi"><b>' + (itens.length ? pct(media(itens.map(i => i.v))) : '—') + '</b><span>aproveitamento geral</span></div>' +
      '<div class="kpi"><div style="margin:6px 0 4px">' + miniNiveis(gn) + '</div><span>alunos por nível</span></div></div>' + legenda() + '</section>';
    h += '<section class="card"><div class="tools"><h2>Turmas</h2><span class="muted sm">Clique na seta da turma para ver os alunos e no nome do aluno para ver o gráfico de desempenho.</span><button class="lk" id="bRecolher">Recolher tudo</button></div>' +
      '<div class="trow head"><span></span><span>Turma</span><span>Participação</span><span class="num">Nota média</span><span>Alunos por nível</span><span class="num">Aproveit.</span><span>Nível</span></div>' +
      (lista.length ? lista.map(t => '<details class="tg" data-k="' + esc(t.t) + '"' + (S.open.has(t.t) || q ? ' open' : '') + '><summary class="trow"><span class="seta"></span><b>' + esc(t.t) + '</b>' + partBar(t.resp, t.total) +
        '<span class="num">' + (t.nota === null ? '—' : '<b>' + nf(t.nota) + '</b>') + '</span><span>' + miniNiveis(t.niv) + '</span><span class="num">' + (t.apr === null ? '—' : pct(t.apr)) + '</span><span>' + (t.nota === null ? '<span class="muted sm">sem envios</span>' : chip(t.nota)) + '</span></summary><div class="lz"></div></details>').join('') : '<p class="muted">Nenhuma turma para este filtro.</p>') + '</section>';
    $('app').innerHTML = h;
    $('app').querySelectorAll('details[open]').forEach(preenche);
    $('bRecolher').onclick = () => { S.open.clear(); desenha(); };
  }

  /* conteúdo pesado só é montado quando a seta é aberta */
  function preenche(d) {
    const lz = d.querySelector(':scope > .lz'), k = d.dataset.k;
    if (d.classList.contains('tg')) { if (!lz.innerHTML) lz.innerHTML = corpoTurma(TURMAS.find(t => t.t === k)); lz.querySelectorAll('details[open]').forEach(preenche); }
    else if (d.classList.contains('al')) { if (!lz.innerHTML) { const tm = TURMAS.find(t => t.t === d.dataset.t); lz.innerHTML = graficoAluno(tm.alunos.find(a => a.n === d.dataset.a), tm); } }
    else if (d.classList.contains('sub')) { if (!lz.innerHTML) { const tm = TURMAS.find(t => t.t === k.split('|')[0]); lz.innerHTML = planoTurma(tm) + pizzasTurma(tm) + '<div class="g2"><div><h3>Aprendizagens essenciais / habilidades</h3>' + barras(agrega(tm.itens, 'ae')) + '</div><div><h3>Descritores' + (CFG.fonte === 'em' ? ' / objetos' : '') + '</h3>' + barras(agrega(tm.itens, 'desc')) + '</div></div>'; } }
  }

  async function iniciar() {
    $('fFiltro').onchange = e => { S.filtro = e.target.value; desenha(); };
    $('fStatus').onchange = e => { S.status = e.target.value; desenha(); };
    $('fBusca').oninput = e => { S.busca = e.target.value; desenha(); };
    $('app').addEventListener('click', e => { const b = e.target.closest && e.target.closest('.libb'); if (b) { e.preventDefault(); liberar(b); } });
    $('app').addEventListener('click', e => {   // revisão: abre a página do simulado com as respostas do aluno
      const b = e.target.closest && e.target.closest('.revb'); if (!b) return; e.preventDefault();
      const r = REV[b.dataset.k]; if (!r) return;
      try { localStorage.setItem('revisao_simulado', JSON.stringify({ turma: r.turma, nome: r.nome, criado: r.criado, itens: r.itens })); } catch (x) { alert('O navegador bloqueou o armazenamento local; não foi possível abrir a revisão.'); return; }
      window.open('/simulado/?revisao=1', '_blank');
    });
    $('app').addEventListener('toggle', e => { const d = e.target; if (!d.dataset || !d.dataset.k) return; if (d.open) { S.open.add(d.dataset.k); preenche(d); } else S.open.delete(d.dataset.k); }, true);
    if (!window.supabase) return msg('Não foi possível carregar o login. Atualize a página.');
    const sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, detectSessionInUrl: false, flowType: 'implicit' } });
    const { data } = await sb.auth.getSession();
    if (!data || !data.session) return msg('Para ver os resultados, entre primeiro no painel com o seu login de professor.<br><br><a href="/">Abrir o painel</a>');
    TOKEN = data.session.access_token;
    msg('Carregando os resultados…');
    try {
      const r = await fetch('/api/resultados?fonte=' + CFG.fonte, { headers: { Authorization: 'Bearer ' + data.session.access_token } });
      const j = await r.json().catch(() => ({ ok: false, erro: 'resposta inválida (HTTP ' + r.status + ')' }));
      if (!j.ok) return msg(esc(j.erro || 'Erro ao carregar.') + (r.status === 401 ? '<br><br><a href="/">Abrir o painel</a>' : ''));
      ROSTER = {};
      if (CFG.fonte === 'em') Object.values(j.roster || {}).forEach(t => ROSTER[t.turma] = t.alunos.map(a => a.nome));
      else ROSTER = j.roster || {};   // individual e simulado: {turma:[nomes]}
      TENT = norm(j);
      if (CFG.fonte === 'em') { const av = new Map(); TENT.forEach(x => av.set(x.aval, x.rotAval)); opcoes($('fFiltro'), [...av.entries()].sort((a, b) => a[1].localeCompare(b[1], 'pt-BR')), S.filtro, 'Todas as avaliações'); }
      else opcoes($('fFiltro'), [['1', '1º bimestre'], ['2', '2º bimestre'], ['3', '3º bimestre'], ['4', '4º bimestre (Saresp)']], S.filtro, 'Todos os bimestres');
      desenha();
    } catch (e) { msg('Não foi possível carregar: ' + esc(e.message)); }
  }
  window.RES_DASH = { iniciar, _norm: norm, _plano: { pizza3d, pizzasTurma, pizzasAluno, planoAluno, planoTurma, montaTurmas, setRoster: r => { ROSTER = r; } } };
  document.addEventListener('DOMContentLoaded', iniciar);
})();
