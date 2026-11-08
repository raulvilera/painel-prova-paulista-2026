/* Acesso do aluno (RA + dígito + senha) para as atividades.
   Uso: <script src="/aluno-acesso.js" defer></script>
   Marque os campos do cabeçalho com data-aluno="nome" | "chamada" | "email" | "turma" | "escola".
   Ao entrar (ou ao abrir com o login já guardado), eles são preenchidos sozinhos.
   O login fica guardado neste aparelho por 12 horas e vale em todas as atividades. */
(function () {
  const CHAVE = 'aluno_token_v1';
  let dados = null;

  const api = (body, token) => fetch('/api/aluno-login', {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
    body: JSON.stringify(body), cache: 'no-store'
  }).then(async r => ({ status: r.status, j: await r.json().catch(() => ({})) }));

  function preencher(a) {
    document.querySelectorAll('[data-aluno]').forEach(el => {
      const v = a[el.dataset.aluno] == null ? '' : String(a[el.dataset.aluno]);
      if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') el.value = v;
      else el.textContent = v;
    });
    window.dispatchEvent(new CustomEvent('aluno:logado', { detail: a }));
  }

  const css = `
  #alunoLogin{position:fixed;inset:0;background:radial-gradient(ellipse at 50% 0,#0f3a5c,#071525 65%);display:flex;align-items:center;justify-content:center;padding:18px;z-index:9999;font-family:system-ui,sans-serif;color:#fff}
  #alunoLogin .box{width:min(420px,100%);background:#ffffff10;border:1px solid #6fc9ee33;border-radius:16px;padding:22px}
  #alunoLogin h2{margin:0 0 6px;font-size:22px}
  #alunoLogin p{margin:0 0 14px;opacity:.8;font-size:14px}
  #alunoLogin label{display:block;font-size:13px;opacity:.85;margin:10px 0 4px}
  #alunoLogin input{width:100%;font:inherit;color:#fff;background:#0b2a44;border:1px solid #6fc9ee88;border-radius:10px;padding:10px 12px}
  #alunoLogin button{width:100%;font:inherit;font-weight:700;margin-top:14px;padding:12px;border:0;border-radius:12px;background:#5fc9d6;color:#06202a;cursor:pointer}
  #alunoLogin button.sec{background:none;color:#6fc9ee;font-weight:600;padding:8px}
  #alunoLogin .erro{background:#3b1d1d;color:#ffb4b4;border-radius:10px;padding:10px;margin-bottom:8px;font-size:14px}
  #alunoLogin .ok{background:#17402a;color:#b8f5cb;border-radius:10px;padding:10px;margin-bottom:8px;font-size:14px}
  #alunoLogin [hidden]{display:none!important}`;

  function montarTela() {
    if (document.getElementById('alunoLogin')) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const d = document.createElement('div'); d.id = 'alunoLogin'; d.setAttribute('role', 'dialog');
    d.innerHTML = `
      <div class="box">
        <h2 id="alunoTitulo">Entrar na atividade</h2>
        <p>Use o seu RA e o dígito. Se ainda não criou a sua senha, use a senha padrão da turma.</p>
        <div id="alunoMsg" class="erro" hidden></div>
        <form id="alunoFormEntrar" novalidate>
          <label for="alunoRa">RA (só números)</label><input id="alunoRa" inputmode="numeric" autocomplete="username">
          <label for="alunoDig">Dígito</label><input id="alunoDig" maxlength="2" autocomplete="off">
          <label for="alunoSenha">Senha</label><input id="alunoSenha" type="password" autocomplete="current-password">
          <button type="submit" id="alunoBEntrar">Entrar</button>
          <button type="button" class="sec" id="alunoBCriar">Criar minha senha</button>
        </form>
        <form id="alunoFormCriar" novalidate hidden>
          <label for="alunoRa2">RA (só números)</label><input id="alunoRa2" inputmode="numeric">
          <label for="alunoDig2">Dígito</label><input id="alunoDig2" maxlength="2" autocomplete="off">
          <label for="alunoSenhaAtual">Senha atual (ou a padrão)</label><input id="alunoSenhaAtual" type="password">
          <label for="alunoSenhaNova">Nova senha (mínimo de 6 caracteres)</label><input id="alunoSenhaNova" type="password" autocomplete="new-password">
          <label for="alunoSenhaNova2">Repita a nova senha</label><input id="alunoSenhaNova2" type="password" autocomplete="new-password">
          <button type="submit" id="alunoBSalvar">Salvar minha senha</button>
          <button type="button" class="sec" id="alunoBVoltar">Voltar para entrar</button>
        </form>
      </div>`;
    document.body.appendChild(d);

    const msg = (t, tipo) => { const m = document.getElementById('alunoMsg'); m.textContent = t; m.className = tipo === 'ok' ? 'ok' : 'erro'; m.hidden = !t; };
    const alternar = criar => {
      document.getElementById('alunoFormEntrar').hidden = criar;
      document.getElementById('alunoFormCriar').hidden = !criar;
      document.getElementById('alunoTitulo').textContent = criar ? 'Criar minha senha' : 'Entrar na atividade';
      msg('');
    };

    document.getElementById('alunoFormEntrar').addEventListener('submit', async e => {
      e.preventDefault(); msg('');
      const ra = document.getElementById('alunoRa').value, digito = document.getElementById('alunoDig').value, senha = document.getElementById('alunoSenha').value;
      const btn = document.getElementById('alunoBEntrar'); btn.disabled = true;
      const { j } = await api({ acao: 'entrar', ra, digito, senha });
      btn.disabled = false;
      if (!j.ok) return msg(j.erro || 'Não foi possível entrar.');
      localStorage.setItem(CHAVE, j.token); dados = j.aluno;
      d.hidden = true; preencher(j.aluno);
    });

    document.getElementById('alunoBCriar').addEventListener('click', () => alternar(true));
    document.getElementById('alunoBVoltar').addEventListener('click', () => alternar(false));

    document.getElementById('alunoFormCriar').addEventListener('submit', async e => {
      e.preventDefault(); msg('');
      const nova = document.getElementById('alunoSenhaNova').value;
      if (nova !== document.getElementById('alunoSenhaNova2').value) return msg('As duas senhas novas não são iguais.');
      const btn = document.getElementById('alunoBSalvar'); btn.disabled = true;
      const { j } = await api({
        acao: 'trocar', ra: document.getElementById('alunoRa2').value, digito: document.getElementById('alunoDig2').value,
        senha_atual: document.getElementById('alunoSenhaAtual').value, senha_nova: nova
      });
      btn.disabled = false;
      if (!j.ok) return msg(j.erro || 'Não foi possível salvar a senha.');
      alternar(false);
      document.getElementById('alunoRa').value = document.getElementById('alunoRa2').value;
      document.getElementById('alunoDig').value = document.getElementById('alunoDig2').value;
      document.getElementById('alunoSenha').value = '';
      msg('Senha criada. Agora entre com a sua nova senha.', 'ok');
    });
  }

  function mostrarLogin() {
    montarTela();
    document.getElementById('alunoLogin').hidden = false;
    setTimeout(() => document.getElementById('alunoRa').focus(), 50);
  }

  let marcarPronto;
  const pronto = new Promise(r => { marcarPronto = r; });

  async function iniciar() {
    const token = localStorage.getItem(CHAVE);
    if (token) {
      const { j } = await api({ acao: 'eu' }, token);
      if (j.ok) { dados = j.aluno; montarTela(); document.getElementById('alunoLogin').hidden = true; preencher(j.aluno); marcarPronto(); return; }
      localStorage.removeItem(CHAVE);
    }
    mostrarLogin();
    marcarPronto();
  }

  /* Espera o aluno entrar (abre a tela de login se preciso) e devolve o token. */
  let esperando = [];
  function exigir() {
    return pronto.then(() => {
      const t = localStorage.getItem(CHAVE);
      if (t && dados) return t;
      return new Promise(resolve => {
        esperando.push(resolve);
        const tela = document.getElementById('alunoLogin');
        if (!tela || tela.hidden) mostrarLogin();
      });
    });
  }
  window.addEventListener('aluno:logado', () => {
    const t = localStorage.getItem(CHAVE);
    esperando.splice(0).forEach(r => r(t));
  });

  window.alunoAcesso = {
    token: () => localStorage.getItem(CHAVE),
    dados: () => dados,
    exigir,
    sair() { localStorage.removeItem(CHAVE); dados = null; mostrarLogin(); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
