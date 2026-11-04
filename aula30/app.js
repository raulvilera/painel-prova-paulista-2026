(function () {
  'use strict';
  var app = document.getElementById('app');
  var S = { ano: '', turma: '', nome: '', turmas: [], nomes: [], aula: null, i: 0, passo: 0, t0: 0, tm: null, res: [], b: null };
  var LET = ['A', 'B', 'C', 'D'];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function api(qs) { return fetch('/api/aula30?' + qs, { cache: 'no-store' }).then(function (r) { return r.json(); }); }
  function cab() { return '<p class="escola">Ciências · SARESP</p>'; }
  function embaralha(a) { var b = a.slice(), i, j, t; for (i = b.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = b[i]; b[i] = b[j]; b[j] = t; } return b; }

  function figura(q) {
    if (q.svg) return '<div class="fig">' + q.svg + '</div>';
    var f = q.figura; if (!f) return '';
    var h = '<div class="fig"><b>' + esc(f.titulo || '') + '</b>';
    if (f.tipo === 'tabela') h += '<table><tr>' + f.colunas.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr>' + f.linhas.map(function (l) { return '<tr>' + l.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
    else if (f.tipo === 'barras') h += '<table>' + f.itens.map(function (i) { return '<tr><td>' + esc(i.rotulo) + '</td><td>' + esc(i.valor) + ' ' + esc(f.unidade || '') + '</td></tr>'; }).join('') + '</table>';
    else if (f.tipo === 'etapas') h += '<ol style="text-align:left">' + f.etapas.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ol>';
    return h + '</div>';
  }

  /* ---------- 1. escolha: ano → turma → nome ---------- */
  function escolha() {
    parar();
    var h = cab() + '<h1>Aula online · 30 minutos</h1><p class="sub">Escolha seu ano, sua turma e seu nome. A aula é montada para você, com os temas das últimas provas Paulistas.</p>';
    h += '<div class="card"><h2>1. Seu ano</h2><div class="grade q4">' + ['6', '7', '8', '9'].map(function (a) { return '<button class="opc" data-ano="' + a + '" aria-pressed="' + (S.ano === a) + '">' + a + 'º ano<small>Ensino Fundamental</small></button>'; }).join('') + '</div></div>';
    if (S.ano) {
      h += '<div class="card"><h2>2. Sua turma</h2>';
      if (!S.turmas.length) h += '<p class="muted">Carregando…</p>';
      else h += '<div class="grade">' + S.turmas.map(function (t) { return '<button class="opc" data-turma="' + esc(t) + '" aria-pressed="' + (S.turma === t) + '">' + esc(t.replace(/^\d.\sANO\s/, '')) + '</button>'; }).join('') + '</div>';
      h += '</div>';
    }
    if (S.turma) {
      h += '<div class="card"><h2>3. Seu nome</h2>';
      if (!S.nomes.length) h += '<p class="muted">Carregando…</p>';
      else h += '<select id="nome"><option value="">Selecione seu nome…</option>' + S.nomes.map(function (n) { return '<option' + (S.nome === n ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('') + '</select><button class="btn" id="ir"' + (S.nome ? '' : ' disabled') + '>Ver meu plano de aula</button>';
      h += '</div>';
    }
    app.innerHTML = h;
    Array.prototype.forEach.call(app.querySelectorAll('[data-ano]'), function (b) { b.onclick = function () { S.ano = b.dataset.ano; S.turma = ''; S.nome = ''; S.turmas = []; S.nomes = []; escolha(); api('acao=turmas&ano=' + S.ano).then(function (r) { S.turmas = r.turmas || []; escolha(); }); }; });
    Array.prototype.forEach.call(app.querySelectorAll('[data-turma]'), function (b) { b.onclick = function () { S.turma = b.dataset.turma; S.nome = ''; S.nomes = []; escolha(); api('acao=nomes&turma=' + encodeURIComponent(S.turma)).then(function (r) { S.nomes = r.nomes || []; escolha(); }); }; });
    var sel = document.getElementById('nome'); if (sel) sel.onchange = function () { S.nome = sel.value; document.getElementById('ir').disabled = !S.nome; };
    var ir = document.getElementById('ir'); if (ir) ir.onclick = carregar;
  }

  function carregar() {
    app.innerHTML = cab() + '<div class="card"><p>Montando a sua aula…</p></div>';
    api('acao=aula&turma=' + encodeURIComponent(S.turma) + '&nome=' + encodeURIComponent(S.nome)).then(function (r) {
      if (!r.ok) { app.innerHTML = cab() + '<div class="card"><p>' + esc(r.erro || 'Não foi possível montar a aula.') + '</p><button class="btn sec" id="v">Voltar</button></div>'; document.getElementById('v').onclick = escolha; return; }
      S.aula = r.aula; plano();
    }).catch(function () { app.innerHTML = cab() + '<div class="card"><p>Sem conexão. Tente novamente.</p><button class="btn sec" id="v">Voltar</button></div>'; document.getElementById('v').onclick = escolha; });
  }

  /* ---------- 2. plano individual ---------- */
  function plano() {
    var A = S.aula, nv = {}, ord = [];
    A.blocos.forEach(function (b) { if (!nv[b.niv]) { nv[b.niv] = 1; ord.push(b.niv); } });
    var h = cab() + '<h1>Olá, ' + esc(A.aluno.split(' ')[0]) + '!</h1><p class="sub">' + (A.perfil ? 'Sua aula foi montada com o seu desempenho nas últimas três provas Paulistas: os temas são os mesmos da turma, mas a forma de explicar muda conforme o seu nível.' : 'Não encontramos seu histórico; a aula usa os temas mais importantes da turma.') + '</p>';
    h += '<div class="card"><h2>Seu plano de hoje · ' + A.blocos.length + ' temas · ' + A.minutos + ' min</h2><ul class="plano">' + A.blocos.map(function (b) { return '<li><span>' + b.n + '. ' + esc(b.tema) + '<br><span class="muted">' + esc(b.desc) + '</span></span><span class="badge n' + b.niv + '">' + esc(A.niveis[b.niv].nome) + '</span></li>'; }).join('') + '</ul></div>';
    h += '<div class="card"><h2>Como você vai estudar</h2>' + ord.sort().map(function (n) { return '<p><span class="badge n' + n + '">' + esc(A.niveis[n].nome) + '</span> ' + esc(A.niveis[n].estrategia) + '</p>'; }).join('') + '<p class="muted">Em cada tema: 1) observar, 2) resolver uma questão, 3) explicar com suas palavras e conferir.</p></div>';
    h += '<button class="btn" id="go">Começar a aula (30 min)</button><button class="btn sec" id="v">Trocar de aluno</button>';
    app.innerHTML = h;
    document.getElementById('go').onclick = function () { S.i = 0; S.passo = 0; S.res = []; S.t0 = Date.now(); S.tm = setInterval(tick, 1000); bloco(); };
    document.getElementById('v').onclick = function () { S.nome = ''; escolha(); };
  }

  /* ---------- tempo ---------- */
  function parar() { if (S.tm) { clearInterval(S.tm); S.tm = null; } }
  function restante() { return Math.max(0, S.aula.minutos * 60 - Math.floor((Date.now() - S.t0) / 1000)); }
  function fmt(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function tick() { var el = document.getElementById('tempo'); if (!el) return; var r = restante(); el.textContent = r > 0 ? fmt(r) : 'tempo esgotado'; el.className = 'tempo' + (r === 0 ? ' fim' : ''); }
  function topo() {
    var A = S.aula, pct = Math.round((S.i * 3 + S.passo) / (A.blocos.length * 3) * 100), r = restante();
    return '<div class="topo"><span>Tema <b>' + (S.i + 1) + '/' + A.blocos.length + '</b></span><div class="barra"><i style="width:' + pct + '%"></i></div><span class="tempo' + (r === 0 ? ' fim' : '') + '" id="tempo">' + (r > 0 ? fmt(r) : 'tempo esgotado') + '</span></div>';
  }

  /* ---------- 3. bloco: observar → questão → auto-explicação ---------- */
  function bloco() {
    var A = S.aula, B = A.blocos[S.i]; if (!B) return fim();
    if (S.passo === 0) S.b = { obj: null, tent: 0, acertou: false, conf: 0, texto: '' };
    var h = cab() + topo() + '<span class="badge n' + B.niv + '">' + esc(A.niveis[B.niv].nome) + '</span>';
    if (S.passo === 0) h += passoObservar(B);
    else if (S.passo === 1) h += passoQuestao(B);
    else h += passoExplicar(B);
    app.innerHTML = h; ligar(B);
    window.scrollTo(0, 0);
  }
  function passoObservar(B) {
    return '<h1>' + esc(B.tema) + '</h1><p class="muted">' + esc(B.desc) + ' (' + esc(B.hab) + ')</p><div class="card"><h2>1. Observe</h2>' +
      (B.img ? '<img class="img" src="' + esc(B.img) + '" alt="Ilustração do experimento: ' + esc(B.tema) + '">' : '') +
      '<div class="analogia"><b>Pense nesta situação:</b> ' + esc(B.analogia) + '</div>' +
      '<p><b>Pergunta-guia:</b> o que, nessa situação, representa o fenômeno real que você vai estudar? Pense por alguns segundos antes de continuar.</p></div><button class="btn" id="prox">Continuar</button>';
  }
  function passoQuestao(B) {
    var q = B.obj, st = S.b, fez = st.obj !== null, max = B.niv === 0 ? 2 : 1, done = st.acertou || st.tent >= max;
    var h = '<div class="card"><h2>2. Resolva</h2><p>' + esc(q.enunciado) + '</p>' + figura(q) + '<p><b>' + esc(q.comando) + '</b></p>';
    h += q.alts.map(function (a, i) {
      var cl = 'alt'; if (fez) { if (done && i === q.correta) cl += ' ok'; else if (i === st.obj && i !== q.correta) cl += ' er'; }
      return '<button class="' + cl + '" data-alt="' + i + '"' + (done ? ' disabled' : '') + '><b>' + LET[i] + '</b><span>' + esc(a) + '</span></button>';
    }).join('');
    if (fez) {
      if (st.acertou) h += '<div class="msg ok"><b>Isso mesmo!</b> ' + esc(q.explicacao) + '</div>';
      else if (!done) h += '<div class="msg er"><b>Quase.</b> Releia a imagem e os dados, e tente outra alternativa.</div>';
      else h += '<div class="msg er"><b>A resposta certa é a ' + LET[q.correta] + '.</b> ' + esc(q.explicacao) + '</div>';
    }
    h += '</div><button class="btn" id="prox"' + (done ? '' : ' disabled') + '>Continuar para a auto-explicação</button>';
    return h;
  }
  function passoExplicar(B) {
    var d = B.dis, st = S.b, n = B.niv, rev = !!st.rev;
    var h = '<div class="card"><h2>3. Explique com suas palavras</h2><p>' + esc(d.enunciado) + '</p>' + figura(d) + '<p><b>' + esc(d.comando) + '</b></p>';
    if (n === 0) {
      if (!st.chips) st.chips = embaralha(d.conceitos);
      h += '<div class="msg info"><b>Banco de palavras</b> — use estas ideias na sua explicação:</div><div class="chips">' + st.chips.map(function (c) { return '<span class="chip">' + esc(c) + '</span>'; }).join('') + '</div>';
    } else if (n === 1) {
      h += '<div class="msg info"><button class="btn sec" id="dica" style="margin:0"' + (st.dica ? ' disabled' : '') + '>' + (st.dica ? 'Dica:' : 'Preciso de uma dica') + '</button>' + (st.dica ? '<p>Comece por: <i>' + esc(d.conceitos[0]) + '</i></p>' : '') + '</div>';
    }
    h += '<textarea id="txt" placeholder="Escreva sua explicação aqui…"' + (rev ? ' readonly' : '') + '>' + esc(st.texto) + '</textarea>';
    if (!rev) h += '<button class="btn" id="rev" disabled>Ver a explicação-modelo e conferir</button>';
    else {
      h += '<div class="modelo"><b>Explicação-modelo</b><br>' + esc(d.ref) + '</div><h3>Compare: a sua explicação trouxe cada ideia?</h3>';
      h += d.conceitos.map(function (c, i) { return '<label class="chk"><input type="checkbox" data-c="' + i + '"' + (st.marc && st.marc[i] ? ' checked' : '') + '><span>' + esc(c) + '</span></label>'; }).join('');
      if (n === 3) h += '<h3>Desafio final</h3><p>Explique a mesma ideia em duas linhas, como se ensinasse a um colega do ano anterior:</p><textarea id="par" style="min-height:70px">' + esc(st.par || '') + '</textarea>';
      h += '<p class="muted">Marque com honestidade: o que ficou de fora é o que vale rever.</p>';
    }
    h += '</div>';
    if (rev) h += '<button class="btn" id="fimb">' + (S.i + 1 < S.aula.blocos.length ? 'Concluir tema e seguir' : 'Concluir a aula') + '</button>';
    return h;
  }

  function ligar(B) {
    var st = S.b, prox = document.getElementById('prox');
    if (prox) prox.onclick = function () { S.passo++; bloco(); };
    Array.prototype.forEach.call(app.querySelectorAll('[data-alt]'), function (b) {
      b.onclick = function () {
        var i = +b.dataset.alt, max = B.niv === 0 ? 2 : 1; st.tent++; st.obj = i;
        if (i === B.obj.correta) { st.acertou = true; st.ponto = st.tent === 1 ? 1 : 0.5; }
        else if (st.tent >= max) st.ponto = 0;
        bloco();
      };
    });
    var t = document.getElementById('txt'), rv = document.getElementById('rev');
    if (t && rv) t.oninput = function () { st.texto = t.value; rv.disabled = t.value.trim().length < 15; };
    if (t && rv) rv.disabled = (t.value.trim().length < 15);
    if (rv) rv.onclick = function () { st.texto = t.value; st.rev = true; bloco(); };
    var dica = document.getElementById('dica'); if (dica) dica.onclick = function () { st.texto = t ? t.value : st.texto; st.dica = true; bloco(); };
    Array.prototype.forEach.call(app.querySelectorAll('[data-c]'), function (c) { c.onchange = function () { st.marc = st.marc || {}; st.marc[c.dataset.c] = c.checked; }; });
    var par = document.getElementById('par'); if (par) par.oninput = function () { st.par = par.value; };
    var fb = document.getElementById('fimb');
    if (fb) fb.onclick = function () {
      var n = B.dis.conceitos.length, ok = 0, k; for (k = 0; k < n; k++) if (st.marc && st.marc[k]) ok++;
      S.res.push({ b: B, obj: st.ponto || 0, conf: n ? ok / n : 0, faltou: B.dis.conceitos.filter(function (c, i) { return !(st.marc && st.marc[i]); }) });
      S.i++; S.passo = 0; bloco();
    };
  }

  /* ---------- 4. relatório ---------- */
  function fim() {
    parar();
    var A = S.aula, gasto = Math.min(99, Math.round((Date.now() - S.t0) / 60000));
    fetch('/api/aula30', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ acao: 'enviar', turma: S.turma, nome: S.nome, minutos: gasto, blocos: S.res.map(function (r) { return { k: r.b.k, niv: r.b.niv, obj: r.obj, conf: r.conf }; }) }) })
      .then(function (x) { return x.json(); }).then(function (j) { var el = document.getElementById('env'); if (el) el.textContent = j.ok ? 'Resultado enviado ao professor.' : 'Não foi possível enviar o resultado ao professor.'; })
      .catch(function () { var el = document.getElementById('env'); if (el) el.textContent = 'Não foi possível enviar o resultado ao professor.'; });
    var h = cab() + '<h1>Aula concluída!</h1><p class="sub">' + esc(A.aluno) + ' · ' + esc(S.turma) + ' · ' + gasto + ' min</p><div class="card"><h2>Seu resumo</h2>';
    h += S.res.map(function (r) {
      var s = (r.obj + r.conf) / 2, tag = s >= 0.75 ? 'Dominei' : s >= 0.45 ? 'Quase lá' : 'Rever';
      return '<div class="res"><span><b>' + esc(r.b.tema) + '</b><br><span class="muted">Questão: ' + (r.obj === 1 ? 'acertou de primeira' : r.obj > 0 ? 'acertou na 2ª tentativa' : 'errou') + ' · Explicação: ' + Math.round(r.conf * 100) + '% das ideias' + (r.faltou.length ? '<br>Rever: ' + esc(r.faltou.slice(0, 2).join('; ')) : '') + '</span></span><span class="badge n' + (s >= 0.75 ? 2 : s >= 0.45 ? 1 : 0) + '">' + tag + '</span></div>';
    }).join('');
    h += '</div><p class="muted">A conferência das ideias é feita por você mesmo. <span id="env">Enviando o resultado…</span></p><button class="btn" id="novo">Fazer de novo com outro aluno</button>';
    app.innerHTML = h; document.getElementById('novo').onclick = function () { S.nome = ''; S.aula = null; escolha(); };
  }

  escolha();
})();
