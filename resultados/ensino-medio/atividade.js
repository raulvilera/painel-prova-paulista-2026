/* Atividade do aluno (Ensino Médio), para o professor: escolhe a turma e o aluno e mostra as questões e como ele respondeu.
   Usa o mesmo login do painel. Somente leitura. */
(function () {
  var SB_URL = 'https://ykrjfjepnqeoqlgupsbe.supabase.co', SB_KEY = 'sb_publishable_FbMU5x7WBpxzHmmVzOfh2g_0M1xxAh5';
  var TURMAS = ['2ª SÉRIE C NOITE', '2ª SÉRIE A MANHÃ (Des. Sistemas)', '3ª SÉRIE F NOITE'];
  var TOKEN = '';
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function msg(h) { $('atvMsg').innerHTML = h; }
  function data(iso) { var d = new Date(iso); return isNaN(d) ? '' : d.toLocaleString('pt-BR'); }

  async function token() {
    if (!window.supabase) return '';
    var sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, detectSessionInUrl: false, flowType: 'implicit' } });
    var s = await sb.auth.getSession();
    return s && s.data && s.data.session ? s.data.session.access_token : '';
  }

  async function nomes() {
    var t = $('atvTurma').value, n = $('atvNome');
    n.innerHTML = '<option value="">Escolha o aluno</option>'; n.disabled = true; $('atvCorpo').innerHTML = '';
    if (!t) return;
    try {
      var j = await (await fetch('/api/personalizada-em?turma=' + encodeURIComponent(t))).json();
      if (!j.ok) { msg(esc(j.erro || 'Não foi possível carregar os alunos.')); return; }
      (j.alunos || []).forEach(function (x) { n.insertAdjacentHTML('beforeend', '<option value="' + esc(x) + '">' + esc(x) + '</option>'); });
      n.disabled = false; msg('Escolha o aluno para ver a atividade.');
    } catch (e) { msg('Não foi possível carregar os alunos. Tente de novo.'); }
  }

  async function abrir() {
    var t = $('atvTurma').value, nm = $('atvNome').value;
    if (!t || !nm) return;
    msg('Carregando a atividade de ' + esc(nm) + '…'); $('atvCorpo').innerHTML = '';
    try {
      var r = await fetch('/api/atividade-professor?turma=' + encodeURIComponent(t) + '&nome=' + encodeURIComponent(nm), { headers: { Authorization: 'Bearer ' + TOKEN } });
      var j = await r.json().catch(function () { return { ok: false, erro: 'resposta inválida (HTTP ' + r.status + ')' }; });
      if (!j.ok) { msg(esc(j.erro)); return; }
      msg(''); desenha(j);
    } catch (e) { msg('Falha de conexão. Tente de novo.'); }
  }

  function desenha(d) {
    var status = d.enviado ? 'Enviado em ' + esc(data(d.enviado)) + ' · acertos ' + esc(d.acertos) : 'Ainda não enviou esta atividade';
    var h = '<h3>' + esc(d.nome) + ' · ' + esc(d.componente) + '</h3><p class="muted sm">' + esc(d.turma) + ' · ' + status + '</p>';
    d.questoes.forEach(function (q) {
      var resp = q.resposta, ok = q.situacao === 'Certo';
      var cls = resp ? (ok ? 'ok' : 'err') : 'vazia';
      h += '<div class="q ' + cls + '"><b>' + q.n + '.</b> ' + esc(q.enunciado) + '<ol type="A">' +
        (q.alts || []).map(function (a, i) {
          var letra = 'ABCDE'.charAt(i), c = [];
          if (letra === q.correta) c.push('cert');
          if (letra === resp && !ok) c.push('marc');
          return '<li' + (c.length ? ' class="' + c.join(' ') + '"' : '') + '>' + esc(a) + '</li>';
        }).join('') + '</ol>' +
        '<p class="sm">Respondeu: <b>' + (resp ? esc(resp) : '—') + '</b> · Correta: <b>' + esc(q.correta) + '</b> · ' +
        (resp ? (ok ? 'certa' : 'errada') : 'não respondeu') + '</p></div>';
    });
    $('atvCorpo').innerHTML = h;
  }

  async function iniciar() {
    TOKEN = await token();
    if (!TOKEN) { msg('Para ver a atividade do aluno, entre primeiro no painel com o seu login de professor. <a href="/">Abrir o painel</a>'); return; }
    $('atvTurma').innerHTML = '<option value="">Escolha a turma</option>' + TURMAS.map(function (t) { return '<option value="' + esc(t) + '">' + esc(t) + '</option>'; }).join('');
    $('atvTurma').addEventListener('change', nomes);
    $('atvNome').addEventListener('change', abrir);
    msg('Escolha a turma e o aluno para ver a atividade.');
  }
  document.addEventListener('DOMContentLoaded', iniciar);
})();
