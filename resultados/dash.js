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
  const S = { turma: '', filtro: '', aluno: '', status: '', busca: '' };
  let TENT = [], ROSTER = {};

  function msg(html) { $('app').innerHTML = '<div class="card msg">' + html + '</div>'; }

  /* ---------- normalização: cada envio vira {turma, aluno, aval, itens:[{v, ae, desc, bim, rot}]} ---------- */
  function norm(j) {
    const ult = new Map();
    (j.rows || []).forEach(r => {   // só o último envio de cada aluno em cada avaliação
      const turma = CFG.fonte === 'em' ? (r.turma || r.turma_id) : r.turma;
      const aval = CFG.fonte === 'em' ? r.avaliacao : 'atividade';
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
      const rotAval = CFG.fonte === 'em' ? [r.componente, r.prova, (r.avaliacao.split('-')[1] || '') + 'ª série'].filter(Boolean).join(' · ') : 'Atividade individual';
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
  function filtrar(todasTurmas) {
    let t = TENT.filter(x => todasTurmas || !S.turma || x.turma === S.turma);
    if (S.filtro) {
      if (CFG.fonte === 'em') t = t.filter(x => x.aval === S.filtro);
      else t = t.map(x => Object.assign({}, x, { itens: x.itens.filter(i => i.bim === S.filtro) })).filter(x => x.itens.length).map(x => Object.assign(x, { nota: media(x.itens.map(i => i.v)) * 10 }));
    }
    return t;
  }
  function opcoes(sel, lista, atual, todas) {
    sel.innerHTML = '<option value="">' + todas + '</option>' + lista.map(([v, r]) => '<option value="' + esc(v) + '"' + (v === atual ? ' selected' : '') + '>' + esc(r) + '</option>').join('');
  }


  /* ---------- panorama geral das turmas ---------- */
  function resumoTurma(t, dados) {
    const mine = dados.filter(x => x.turma === t), ros = ROSTER[t] || [];
    const alunos = new Map();
    mine.forEach(x => { const o = alunos.get(x.aluno) || { notas: [], itens: [] }; if (x.nota !== null) o.notas.push(x.nota); o.itens.push(...x.itens); alunos.set(x.aluno, o); });
    const niv = [0, 0, 0, 0], notas = [];
    alunos.forEach(o => { if (o.notas.length) { const n = media(o.notas); notas.push(n); niv[nivel(n / 10)]++; } });
    const total = Math.max(ros.length, alunos.size), itens = [...alunos.values()].flatMap(o => o.itens);
    return { t, total, resp: alunos.size, notas, niv, apr: itens.length ? media(itens.map(i => i.v)) : null };
  }
  function miniNiveis(niv) {
    const tot = niv.reduce((x, y) => x + y, 0);
    if (!tot) return '<span class="muted sm">—</span>';
    return '<div class="mini" role="img" aria-label="' + NIVEIS.map((n, i) => n[0] + ': ' + niv[i]).join(', ') + '">' + niv.map((n, i) => n ? '<i style="flex:' + n + ';background:var(--' + NIVEIS[i][1] + ')" title="' + NIVEIS[i][0] + ': ' + n + ' aluno(s)"></i>' : '').join('') + '</div>';
  }
  function panorama() {
    const dados = filtrar(true);
    const turmas = [...new Set(Object.keys(ROSTER).concat(TENT.map(x => x.turma)))].sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
    const R = turmas.map(t => resumoTurma(t, dados));
    const tot = R.reduce((s, r) => s + r.total, 0), resp = R.reduce((s, r) => s + r.resp, 0);
    const linha = r => {
      const part = r.total ? r.resp / r.total : 0, nm = r.notas.length ? media(r.notas) : null;
      return '<tr class="row' + (r.t === S.turma ? ' sel' : '') + '" data-turma="' + esc(r.t) + '" title="Clique para ver os detalhes da turma">' +
        '<td><b>' + esc(r.t) + '</b></td>' +
        '<td><div class="part"><div class="track"><div class="fill" style="width:' + Math.round(part * 100) + '%;background:var(--accent)"></div></div><span><b>' + r.resp + '</b> de ' + r.total + ' · ' + Math.round(part * 100) + '%</span></div></td>' +
        '<td class="num">' + (nm === null ? '—' : '<b>' + nf(nm) + '</b>') + '</td>' +
        '<td>' + miniNiveis(r.niv) + '</td>' +
        '<td class="num">' + (r.apr === null ? '—' : pct(r.apr)) + '</td>' +
        '<td>' + (nm === null ? '<span class="muted sm">sem envios</span>' : chip(nm)) + '</td></tr>';
    };
    const g = R.flatMap(r => r.notas), gn = [0, 0, 0, 0]; R.forEach(r => r.niv.forEach((n, i) => gn[i] += n));
    return '<section class="card"><h2>Panorama geral das turmas</h2><p class="muted sm">Clique numa turma para ver o detalhamento. Participação = alunos que já realizaram a atividade.</p>' + legenda() +
      '<div class="wrapt" style="max-height:none"><table class="pan"><thead><tr><th>Turma</th><th>Participação</th><th class="num">Nota média</th><th>Alunos por nível</th><th class="num">Aproveitamento</th><th>Nível da turma</th></tr></thead><tbody>' +
      R.map(linha).join('') +
      '</tbody><tfoot><tr><td><b>Geral</b></td><td><div class="part"><div class="track"><div class="fill" style="width:' + (tot ? Math.round(resp / tot * 100) : 0) + '%;background:var(--accent)"></div></div><span><b>' + resp + '</b> de ' + tot + ' · ' + (tot ? Math.round(resp / tot * 100) : 0) + '%</span></div></td><td class="num">' + (g.length ? '<b>' + nf(media(g)) + '</b>' : '—') + '</td><td>' + miniNiveis(gn) + '</td><td class="num">—</td><td>' + (g.length ? chip(media(g)) : '') + '</td></tr></tfoot></table></div></section>';
  }

  /* ---------- lista de alunos, por turma, com situação (realizou / pendente) ---------- */
  function listaAlunos(dados) {
    const porAluno = new Map();
    dados.forEach(x => { const k = x.turma + '|' + x.aluno; const o = porAluno.get(k) || { notas: [], itens: [] }; if (x.nota !== null) o.notas.push(x.nota); o.itens.push(...x.itens); porAluno.set(k, o); });
    const turmas = [...new Set(Object.keys(ROSTER).concat(dados.map(x => x.turma)))].filter(t => !S.turma || t === S.turma).sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
    const q = S.busca.trim().toUpperCase();
    let h = '<section class="card"><h2>Alunos' + (S.turma ? ' · ' + esc(S.turma) : ' por turma') + '</h2><p class="muted sm"><span class="st ok">✓ Realizou</span> a atividade já foi enviada · <span class="st pend">Pendente</span> ainda não enviou. Clique no aluno para ver o detalhamento.</p>';
    let algum = false;
    turmas.forEach(t => {
      const nomes = [...new Set((ROSTER[t] || []).concat(dados.filter(x => x.turma === t).map(x => x.aluno)))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
      const feitos = nomes.filter(n => porAluno.has(t + '|' + n)).length;
      let lin = nomes.map(n => ({ n, o: porAluno.get(t + '|' + n) }));
      if (S.status === 'ok') lin = lin.filter(x => x.o); else if (S.status === 'pend') lin = lin.filter(x => !x.o);
      if (q) lin = lin.filter(x => x.n.toUpperCase().indexOf(q) >= 0);
      if (!lin.length) return; algum = true;
      const abre = S.turma === t || !!q || !!S.status;
      h += '<details class="tg"' + (abre ? ' open' : '') + '><summary><b>' + esc(t) + '</b><span class="muted sm"> · ' + feitos + ' de ' + nomes.length + ' realizaram</span>' +
        '<span class="part sm"><span class="track"><span class="fill" style="width:' + (nomes.length ? Math.round(feitos / nomes.length * 100) : 0) + '%;background:var(--accent)"></span></span></span></summary>' +
        '<div class="wrapt"><table><thead><tr><th style="width:34px">Nº</th><th>Aluno</th><th>Situação</th><th class="num">Nota</th><th>Nível</th><th class="num">Aproveitamento</th></tr></thead><tbody>' +
        lin.map((x, i) => { const nn = x.o && x.o.notas.length ? media(x.o.notas) : null;
          return '<tr class="row' + (x.n === S.aluno && t === S.turma ? ' sel' : '') + (x.o ? '' : ' pendr') + '" data-a="' + esc(x.n) + '" data-t="' + esc(t) + '"><td class="muted">' + (i + 1) + '</td><td>' + esc(x.n) + '</td>' +
            '<td>' + (x.o ? '<span class="st ok">✓ Realizou</span>' : '<span class="st pend">Pendente</span>') + '</td>' +
            '<td class="num">' + (nn === null ? '—' : '<b>' + nf(nn) + '</b>') + '</td><td>' + (nn === null ? '—' : chip(nn)) + '</td><td class="num">' + (x.o && x.o.itens.length ? pct(media(x.o.itens.map(i => i.v))) : '—') + '</td></tr>'; }).join('') +
        '</tbody></table></div></details>';
    });
    if (!algum) h += '<p class="muted">Nenhum aluno encontrado para este filtro.</p>';
    return h + '</section>';
  }

  function desenha() {
    const turmasRoster = Object.keys(ROSTER);
    const turmas = [...new Set(turmasRoster.concat(TENT.map(x => x.turma)))].sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
    opcoes($('fTurma'), turmas.map(t => [t, t]), S.turma, 'Todas as turmas');
    if (CFG.fonte === 'em') {
      const av = new Map(); TENT.forEach(x => av.set(x.aval, x.rotAval));
      opcoes($('fFiltro'), [...av.entries()].sort((a, b) => a[1].localeCompare(b[1], 'pt-BR')), S.filtro, 'Todas as avaliações');
    } else opcoes($('fFiltro'), [['1', '1º bimestre'], ['2', '2º bimestre'], ['3', '3º bimestre'], ['4', '4º bimestre (Saresp)']], S.filtro, 'Todos os bimestres');
    const dados = filtrar();
    const alunosTurma = [...new Set(dados.map(x => x.aluno))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    if (S.aluno && !alunosTurma.includes(S.aluno)) S.aluno = '';
    opcoes($('fAluno'), alunosTurma.map(a => [a, a]), S.aluno, 'Todos os alunos');

    const itensTurma = dados.flatMap(x => x.itens);
    const notas = dados.filter(x => x.nota !== null).map(x => x.nota);
    const niv = [0, 0, 0, 0]; notas.forEach(n => niv[nivel(n / 10)]++);
    const universo = CFG.fonte === 'em'
      ? (S.turma ? ((ROSTER[S.turma] || []).length) : Object.values(ROSTER).reduce((s, a) => s + a.length, 0))
      : (S.turma ? (ROSTER[S.turma] || []).length : Object.values(ROSTER).reduce((s, a) => s + a.length, 0));
    const respondentes = new Set(dados.map(x => x.turma + '|' + x.aluno)).size;

    let h = '<div class="grid">';
    h += '<section class="card"><div class="kpis">' +
      '<div class="kpi"><b>' + respondentes + (universo ? '<span style="font-size:1rem"> / ' + universo + '</span>' : '') + '</b><span>alunos que responderam</span></div>' +
      '<div class="kpi"><b>' + (notas.length ? nf(media(notas)) : '—') + '</b><span>nota média (0–10)</span></div>' +
      '<div class="kpi"><b>' + (itensTurma.length ? pct(media(itensTurma.map(i => i.v))) : '—') + '</b><span>aproveitamento geral</span></div>' +
      '<div class="kpi"><b>' + dados.length + '</b><span>envios considerados</span></div></div></section>';

    h += panorama();

    h += '<section class="card"><h2>Alunos por nível de proficiência' + (S.turma ? ' · ' + esc(S.turma) : '') + '</h2>' + legenda();
    h += notas.length ? '<div class="stack" role="img" aria-label="Distribuição dos alunos por nível">' + niv.map((n, i) => n ? '<div style="flex:' + n + ';background:var(--' + NIVEIS[i][1] + ')" title="' + NIVEIS[i][0] + ': ' + n + ' aluno(s)">' + n + '</div>' : '').join('') + '</div>' : '<p class="muted sm">Ainda não há envios para este filtro.</p>';
    h += '</section>';

    const aeT = agrega(itensTurma, 'ae'), dsT = agrega(itensTurma, 'desc');
    h += '<section class="card half"><h2>Aproveitamento da turma por aprendizagem essencial / habilidade</h2><p class="muted sm">Do menor para o maior aproveitamento.</p>' + legenda() + '<div>' + barras(aeT) + '</div></section>';
    h += '<section class="card half"><h2>Aproveitamento da turma por descritor' + (CFG.fonte === 'em' ? ' / objeto de conhecimento' : '') + '</h2><p class="muted sm">Do menor para o maior aproveitamento.</p>' + legenda() + '<div>' + barras(dsT) + '</div></section>';

    if (S.aluno) {
      const meus = dados.filter(x => x.aluno === S.aluno), mi = meus.flatMap(x => x.itens);
      const refAe = new Map(aeT.map(x => [x.k, x.p])), refDs = new Map(dsT.map(x => [x.k, x.p]));
      const mn = meus.filter(x => x.nota !== null).map(x => x.nota);
      h += '<section class="card"><h2>' + esc(S.aluno) + '</h2><div class="kpis">' +
        '<div class="kpi"><b>' + (mn.length ? nf(media(mn)) : '—') + '</b><span>nota' + (meus.some(x => x.parcial) ? ' (parcial: dissertativa em correção)' : '') + '</span></div>' +
        '<div class="kpi"><b>' + (mi.length ? pct(media(mi.map(i => i.v))) : '—') + '</b><span>aproveitamento do aluno</span></div>' +
        '<div class="kpi"><b>' + (itensTurma.length ? pct(media(itensTurma.map(i => i.v))) : '—') + '</b><span>aproveitamento da turma</span></div>' +
        '<div class="kpi"><b>' + (mn.length ? chip(media(mn)) : '—') + '</b><span>nível</span></div></div>' +
        '<p class="muted sm" style="margin-top:8px">A barra mostra o aluno; o traço preto mostra a média da turma na mesma aprendizagem/descritor.</p></section>';
      h += '<section class="card half"><h2>Aluno · aprendizagem essencial / habilidade</h2>' + legenda() + barras(agrega(mi, 'ae'), refAe) + '</section>';
      h += '<section class="card half"><h2>Aluno · descritor' + (CFG.fonte === 'em' ? ' / objeto' : '') + '</h2>' + legenda() + barras(agrega(mi, 'desc'), refDs) + '</section>';
      h += '<section class="card"><h2>Questões do aluno</h2><div class="items">' + meus.flatMap(x => x.itens.map(i => '<div class="it"><span class="' + (i.v >= .75 ? 'ok' : i.v >= .5 ? '' : 'no') + '">' + (i.v >= .75 ? '✓' : i.v >= .5 ? '◐' : '✗') + '</span><span><b>' + pct(i.v) + '</b> · ' + esc(i.desc) + '</span></div>')).join('') + '</div></section>';
    }

    h += listaAlunos(dados);
    h += '</div>';
    $('app').innerHTML = h;
    $('app').querySelectorAll('tr.row[data-turma]').forEach(tr => tr.onclick = () => { S.turma = tr.dataset.turma; S.aluno = ''; desenha(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    $('app').querySelectorAll('tr.row[data-a]').forEach(tr => tr.onclick = () => { S.turma = tr.dataset.t; S.aluno = tr.dataset.a; desenha(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  async function iniciar() {
    $('fTurma').onchange = e => { S.turma = e.target.value; S.aluno = ''; desenha(); };
    $('fFiltro').onchange = e => { S.filtro = e.target.value; desenha(); };
    $('fAluno').onchange = e => { S.aluno = e.target.value; desenha(); };
    $('fStatus').onchange = e => { S.status = e.target.value; desenha(); };
    $('fBusca').oninput = e => { S.busca = e.target.value; desenha(); };
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
      else ROSTER = j.roster || {};
      TENT = norm(j);
      desenha();
    } catch (e) { msg('Não foi possível carregar: ' + esc(e.message)); }
  }
  window.RES_DASH = { iniciar, _norm: norm };
  document.addEventListener('DOMContentLoaded', iniciar);
})();
