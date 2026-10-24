/* Orbit Quiz: escolha da turma e lista de alunos vinda da planilha (mesmo Apps Script do Simulado). */
(function () {
  const API = 'https://script.google.com/macros/s/AKfycbwUe0WBN_I1u6wDN4OoYJdKuycu_dupRvY-GzoHPNZhL2ft3KpSK7odGF0amqn7Yc7P/exec';
  window.__orbitTurmas = ['6º Ano A', '6º Ano C', '6º Ano A (Lydia)', '6º Ano B (Lydia)', '6º Ano C (Lydia)', '7º Ano A', '7º Ano B', '8º Ano A', '8º Ano B', '9º Ano A', '9º Ano B'];
  window.__orbitAlunos = []; window.__orbitMsg = '';
  const espera = ms => new Promise(r => setTimeout(r, ms));
  async function api(q) {
    let ult;
    for (let k = 0; k < 4; k++) {
      try {
        const r = await fetch(API + '?' + new URLSearchParams(Object.assign({ nc: Date.now() }, q)), { redirect: 'follow', cache: 'no-store', credentials: 'omit' });
        const j = await r.json(); if (!j.ok) throw Object.assign(new Error(j.erro || 'erro'), { srv: true }); return j;
      } catch (e) { ult = e; if (e.srv) throw e; await espera(1500 * (k + 1)); }
    }
    throw ult;
  }
  window.__orbitCarregarAlunos = async function (id) {
    window.__orbitAlunos = []; window.__orbitMsg = '';
    if (!id) return;
    try {
      const d = await api({ api: 'alunos', id }).catch(e => /api desconhecida/.test(e.message) ? api({ api: 'turma', id }) : Promise.reject(e));
      const nomes = (d.alunos || []).map(a => a.nome).filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt'));
      window.__orbitAlunos = nomes;
      if (!nomes.length) window.__orbitMsg = 'Nenhum aluno encontrado nesta turma. Avise o professor.';
    } catch (e) {
      window.__orbitMsg = /carga|liber|bloque/i.test(e.message || '') ? 'A lista desta turma ainda não foi liberada. Avise o professor.' : 'Não consegui carregar os nomes. Verifique a internet e escolha a turma de novo.';
    }
  };
  api({ api: 'turmas' }).catch(() => {});   // acorda o servidor da planilha
})();
