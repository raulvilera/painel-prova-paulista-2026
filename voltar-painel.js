/* Botão fixo "← Painel" para voltar à tela inicial da plataforma. Nas telas só do professor aparece sempre (data-sempre);
   nas telas que os alunos também usam (ex.: Orbit Quiz) só aparece se este navegador tiver o login do professor. */
(function () {
  if (window.top !== window.self) return; /* dentro do visor do painel já existe a barra "← Painel" */
  const me = document.currentScript;
  let prof = false;
  try { prof = Object.keys(localStorage).some(k => /^sb-ykrjfjepnqeoqlgupsbe-auth-token$/.test(k)); } catch (e) { /* sem acesso ao armazenamento */ }
  if (!(me && me.hasAttribute('data-sempre')) && !prof) return;
  const st = document.createElement('style');
  st.textContent = '#voltar-painel{position:fixed;left:12px;bottom:12px;z-index:2147483000;display:inline-flex;align-items:center;gap:6px;padding:10px 16px;border-radius:999px;background:#0f6e7a;color:#fff;font:700 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.35);border:1px solid #ffffff55}#voltar-painel:hover,#voltar-painel:focus-visible{background:#0b5760;outline:2px solid #fff}@media print{#voltar-painel{display:none}}';
  document.head.appendChild(st);
  const a = document.createElement('a'); a.id = 'voltar-painel'; a.href = '/'; a.textContent = '← Painel'; a.setAttribute('aria-label', 'Voltar à tela inicial do painel');
  document.body.appendChild(a);
})();
