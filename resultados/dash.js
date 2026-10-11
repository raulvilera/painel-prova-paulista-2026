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
  const nf = n => (Math.round(n * 10) / 10).toString().replace('.', ',');
  const S = { filtro: '', status: '', busca: '', open: new Set() };
  let TENT = [], ROSTER = {};

  function msg(html) { $('app').innerHTML = '<div class="card msg">' + html + '</div>'; }

  /* ---------- normalização: cada envio vira {turma, aluno, aval, itens:[{v, ae, desc, bim, rot}]} ---------- */
  function norm(j) {
    const ult = new Map();
    (j.rows || []).forEach(r => {   // só o último envio de cada aluno em cada avaliação
      const turma = CFG.fonte === 'em' ? (r.turma || r.turma_id) : r.turma;
      const aval = CFG.fonte === 'em' ? r.avaliacao : (CFG.fonte === 'simulado' ? 'simulado' : 'atividade');
      ult.set(turma + '|' + r.nome + '|' + aval, { r, turma, aval });
    });
    return [...ult.values()].map(({ r, turma, aval }) => {
      const itens = [];
      (r.itens || []).forEach(i => {
        let v = null;
        if (i.tipo === 'obj') v = i.resp === null || i.resp === undefined || i.resp === '' ? 0 : (i.acerto ? 1 : 0);
        else if (typeof i.nota === 'number') v = Math.max(0, Math.min(1, i.nota));
        if (v === null) return;
        const m = j.meta[CFG.fonte === 'em' ? i.id : i.k] || {};
        if (CFG.fonte === 'em') itens.push({ v, ae: m.ae ? m.ae + (m.hab ? ' · ' + m.hab : '') : (m.hab || 'Mapa do Provão'), desc: m.objeto || '—', bim: '', rot: m.objeto });
        else itens.push({ v, ae: (m.hab ? m.hab + ' · ' : '') + (m.ae || '—'), desc: m.desc || '—', bim: m.bim || '', rot: m.desc });
      });
      const parcial = (r.itens || []).some(i => i.tipo === 'dis' && typeof i.nota !== 'number');
      const rotAval = CFG.fonte === 'em' ? [r.componente, r.prova, (r.avaliacao.split('-')[1] || '') + 'ª série'].filter(Boolean).join(' · ') : (CFG.fonte === 'simulado' ? 'Simulado SARESP' : 'Atividade individual');
      return { turma, aluno: r.nome, aval, rotAval, itens, parcial, nota: itens.length ? media(itens.map(i => i.v)) * 10 : null, criado: r.criado };
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
        const o = al.get(x.aluno) || { n: x.aluno, notas: [], itens: [], feito: false }; o.feito = true;
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
  function graficoAluno(a, tm) {
    if (!a.feito) return '<p class="muted">Este aluno ainda não realizou a atividade.</p>';
    const dim = (chave, ref) => {
      const l = agrega(a.itens, chave), nao = l.filter(x => x.p < .5), ok = l.filter(x => x.p >= .5);
      return (nao.length ? '<h4 class="gn">✗ Não atingidos (' + nao.length + ')</h4>' + barras(nao, ref) : '') + (ok.length ? '<h4 class="ga">✓ Atingidos (' + ok.length + ')</h4>' + barras(ok, ref) : '') || '<p class="muted sm">Sem dados.</p>';
    };
    const refAe = new Map(agrega(tm.itens, 'ae').map(x => [x.k, x.p])), refDs = new Map(agrega(tm.itens, 'desc').map(x => [x.k, x.p]));
    return '<div class="g2"><div><h3>Aprendizagens essenciais / habilidades</h3>' + dim('ae', refAe) + '</div><div><h3>Descritores' + (CFG.fonte === 'em' ? ' / objetos' : '') + '</h3>' + dim('desc', refDs) + '</div></div>' +
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
        '<span>' + (a.feito ? '<span class="st ok">✓ Realizou</span>' : '<span class="st pend">Pendente</span>') + '</span>' +
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
    else if (d.classList.contains('sub')) { if (!lz.innerHTML) { const tm = TURMAS.find(t => t.t === k.split('|')[0]); lz.innerHTML = '<div class="g2"><div><h3>Aprendizagens essenciais / habilidades</h3>' + barras(agrega(tm.itens, 'ae')) + '</div><div><h3>Descritores' + (CFG.fonte === 'em' ? ' / objetos' : '') + '</h3>' + barras(agrega(tm.itens, 'desc')) + '</div></div>'; } }
  }

  async function iniciar() {
    $('fFiltro').onchange = e => { S.filtro = e.target.value; desenha(); };
    $('fStatus').onchange = e => { S.status = e.target.value; desenha(); };
    $('fBusca').oninput = e => { S.busca = e.target.value; desenha(); };
    $('app').addEventListener('toggle', e => { const d = e.target; if (!d.dataset || !d.dataset.k) return; if (d.open) { S.open.add(d.dataset.k); preenche(d); } else S.open.delete(d.dataset.k); }, true);
    if (!window.supabase) return msg('Não foi possível carregar o login. Atualize a página.');
    const sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, detectSessionInUrl: false, flowType: 'implicit' } });
    const { data } = await sb.auth.getSession();
    if (!data || !data.session) return msg('Para ver os resultados, entre primeiro no painel com o seu login de professor.<br><br><a href="/">Abrir o painel</a>');
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
  window.RES_DASH = { iniciar, _norm: norm };
  document.addEventListener('DOMContentLoaded', iniciar);
})();
