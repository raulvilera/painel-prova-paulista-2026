/* Orbit Quiz: escolha da turma e lista de alunos vinda da planilha (mesmo Apps Script do Simulado). */
(function () {
  const API = 'https://script.google.com/macros/s/AKfycbwUe0WBN_I1u6wDN4OoYJdKuycu_dupRvY-GzoHPNZhL2ft3KpSK7odGF0amqn7Yc7P/exec';
  window.__orbitTurmas = ['6º Ano A', '6º Ano C', '6º Ano A (Lydia)', '6º Ano B (Lydia)', '6º Ano C (Lydia)', '7º Ano A', '7º Ano B', '8º Ano A', '8º Ano B', '9º Ano A', '9º Ano B'];
  window.__orbitAlunos = []; window.__orbitMsg = '';
  const EXTRAS = { '6º Ano A': ['NAOMI PAGES ROJOS'], '9º Ano B': ['DANILO SANTOS CONCEIÇÃO'], '8º Ano A': ['ZLATA EVGENIEVNA SAFOROVA'] };   // alunos ainda fora da planilha (nº 38)
  const espera = ms => new Promise(r => setTimeout(r, ms));
  async function api(q) {
    let ult;
    for (let k = 0; k < 3; k++) {
      try {
        const ac = new AbortController(), tm = setTimeout(() => ac.abort(), 25000);
        const r = await fetch(API + '?' + new URLSearchParams(Object.assign({ nc: Date.now() }, q)), { redirect: 'follow', cache: 'no-store', credentials: 'omit', signal: ac.signal }).finally(() => clearTimeout(tm));
        const j = await r.json(); if (!j.ok) throw Object.assign(new Error(j.erro || 'erro'), { srv: true }); return j;
      } catch (e) { ult = e; if (e.srv) throw e; await espera(1500 * (k + 1)); }
    }
    throw ult;
  }
  const R8A = '1 ALICE CARDOSO DE ALCANTARA|3 ANA LUIZA VALENCA PAIVA|5 BRYAN DINIZ SILVA|6 CARLOS EDUARDO MENEZES MACHADO|7 EVANDRO CUTOLO TEIXEIRA|9 GABRIELA SANTOS COSTA|11 GUILHERME CARMO RODRIGUES|12 GUSTAVO HENRIQUE DA SILVA|13 ISAAC FERNANDES DE ANDRADE|15 KELVIN DUARTE GONCALVES|16 LAURA VITÓRIA ROCHA|18 LETICIA CUSTÓDIO LIMA|19 LUCAS EDUARDO DA SILVA SANTANA|20 MATHEUS KAUÃ DOS SANTOS NASCIMENTO|21 MAYARA CAETANO DE OLIVEIRA PINA|22 MIGUEL LIMA DE MESQUITA|24 NICOLAS ROCHA SILVA|25 PAOLLA MICHELLINE DOS SANTOS MARQUES|27 PEDRO HENRIQUE CORREA DE BRITO|28 PEDRO LEONARDO DE ANDRADE MARQUES|29 RAFAEL HENRIQUE SIQUEIRA BERNARDES ZIA|30 RAPHAEL MATHIAS NUNES MIRANDA|34 SAMUEL ALVES DA COSTA|35 SOFIA AZEREDO CUBAS|36 SOPHIA LACERDA ANDRADE|37 THAYLLA DUANNY VENANCIO SCAQUITO|38 THAYS RODRIGUES DA SILVA|40 MANOELLA DOS ANJOS SANTOS|41 MARIANA CHARRUA GAIA MION SILVA|42 DIOGO DA SILVA VELOSO|43 QUÉZIA DO ESPIRITO SANTO ROBERTI|44 KEMILLYN ANDRADE DE SOUZA SILVA|45 KAUAN HENRIQUE DE ARAUJO SILVA|46 ZLATA EVGENIEVNA SAFOROVA'.split('|').map(l => l.replace(/^\d+ /, ''));   // lista oficial do 8º Ano A (igual à do Simulado)
  window.__orbitTemas = null;
  async function carregarTemas(id) {   // conceitos em que a turma mais errou (só números da turma, sem nomes)
    window.__orbitTemas = null;
    try { const r = await fetch('/api/jogo?estudo=' + encodeURIComponent(id), { cache: 'no-store' }); const j = await r.json(); if (j.ok && j.conceitos && j.conceitos.length >= 4) window.__orbitTemas = j.conceitos; } catch (e) { /* segue com os temas fixos */ }
  }
  window.__orbitCarregarAlunos = async function (id) {
    window.__orbitAlunos = []; window.__orbitMsg = '';
    if (!id) return;
    carregarTemas(id);
    try {
      const d = await api({ api: 'alunos', id }).catch(e => /api desconhecida/.test(e.message) ? api({ api: 'turma', id }) : Promise.reject(e));
      const nomes = (d.alunos || []).map(a => a.nome).filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt'));
      (EXTRAS[id] || []).forEach(x => { if (!nomes.includes(x)) nomes.push(x); }); nomes.sort((a, b) => a.localeCompare(b, 'pt'));
      window.__orbitAlunos = nomes;
      if (!nomes.length) window.__orbitMsg = 'Nenhum aluno encontrado nesta turma. Avise o professor.';
    } catch (e) {
      if (id === '8º Ano A') { window.__orbitAlunos = R8A.concat(EXTRAS[id] || []).filter((x, i, a) => a.indexOf(x) === i).sort((a, b) => a.localeCompare(b, 'pt')); return; }
      window.__orbitMsg = /carga|liber|bloque/i.test(e.message || '') ? 'A lista desta turma ainda não foi liberada. Avise o professor.' : 'Não consegui carregar os nomes. Verifique a internet e escolha a turma de novo.';
    }
  };
  api({ api: 'turmas' }).catch(() => {});   // acorda o servidor da planilha
})();
