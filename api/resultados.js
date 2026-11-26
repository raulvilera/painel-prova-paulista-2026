/* Resultados dos alunos para o dashboard do professor (somente leitura).
   GET /api/resultados?fonte=em|individual  — exige o login do professor (Bearer token do Supabase da plataforma).
   Variáveis na Vercel: SUPABASE_URL, SUPABASE_SERVICE_KEY (as mesmas da atividade individual). */
const CAT = require('./_catalogo-indiv.js');
const META_EM = require('./_meta-em.js');
const META_SIM = require('./_meta-simulado.js');
const ALUNOS_EM = require('./_alunos-em.js');
const META_C8 = require('./_meta-cien8.js');
const TEC8 = require('./_quiz-tec8.js');
/* Recuperação semestral da 2ª DS: enunciado, habilidade e gabarito de cada questão para o relatório (o servidor já é do professor) */
const REC2DS = require('../recuperacao-2ds/questoes.js'), REC2DS_GAB = require('./_recuperacao-2ds-gabarito.js');
REC2DS.questoes.forEach(q => { META_EM[q.id] = { tipo: q.tipo, av: REC2DS.id, hab: q.hab, objeto: q.objeto, ae: q.ae, n: q.n,
  enun: (String(q.texto).replace(/<[^>]*>/g, ' ') + ' ' + String(q.comando).replace(/<[^>]*>/g, ' ')).replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 600),
  cor: q.tipo === 'obj' ? 'ABCDE'[REC2DS_GAB.objetivas[q.id].correta] : '', serie: '2', comp: REC2DS.componente, prova: REC2DS.prova }; });
const SB = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), KEY = process.env.SUPABASE_SERVICE_KEY || '';
const LOGIN_URL = process.env.PAINEL_SUPABASE_URL || 'https://ykrjfjepnqeoqlgupsbe.supabase.co', LOGIN_KEY = process.env.PAINEL_SUPABASE_KEY || 'sb_publishable_FbMU5x7WBpxzHmmVzOfh2g_0M1xxAh5';

async function restUma(path) {
  const r = await fetch(SB + '/rest/v1/' + path, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
  const t = await r.text(); if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + t.slice(0, 160));
  return t ? JSON.parse(t) : [];
}
const rest = require('./_paginar')(restUma);   // leituras sem o corte de 1000 linhas do Supabase
async function professor(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (!m) return false;
  const r = await fetch(LOGIN_URL + '/auth/v1/user', { headers: { apikey: LOGIN_KEY, Authorization: 'Bearer ' + m[1] } });
  return r.ok;
}
/* Nome único da turma: "6º ANO C TARDE" (painel) = "6º Ano C" (E.E. Wanda); "6º ANO C MANHÃ" = "6º Ano C (Lydia)" */
const rotuloTurma = t => { const m = /^(\d)º\s*ANO\s*([A-Z])\s*(MANHÃ|MANHA|TARDE)$/i.exec(String(t || '').trim()); return m ? m[1] + 'º Ano ' + m[2] + (/^M/i.test(m[3]) ? ' (Lydia)' : '') : t; };
const TURMAS_EM = { '2a-manha': '2ª Série A Manhã (Des. Sistemas)', '2c-noite': '2ª Série C Noite', '3f-noite': '3ª Série F Noite' };
const PERS_NOMES = require('./_personalizada-em.js');   // alunos com atividade personalizada, por turma
const TURMA_PERS = { '2ª SÉRIE A MANHÃ (Des. Sistemas)': TURMAS_EM['2a-manha'], '2ª SÉRIE C NOITE': TURMAS_EM['2c-noite'], '3ª SÉRIE F NOITE': TURMAS_EM['3f-noite'] };   // turma da atividade personalizada → turma do quadro

/* Quadro de entregas: junta, de todas as fontes, quem fez cada atividade (turma + nome + data), sem notas nem respostas.
   Cada fonte é lida à parte: se uma falhar, o quadro sai com as outras e um aviso. */
const normNome = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
async function quadro() {
  const ent = new Map(), ativ = {}, avisos = [];
  /* nota: 0 a 10 (ou null); pend: nota provisória (dissertativas ainda sem correção). Vale a nota do envio mais recente; "melhor" guarda a maior. */
  const nota10 = v => (typeof v === 'number' && isFinite(v)) ? Math.round(Math.max(0, Math.min(10, v)) * 10) / 10 : null;
  const add = (a, rotulo, grupo, turma, nome, quando, parcial, nota, pend) => {
    if (!turma || !String(nome || '').trim()) return;
    if (!ativ[a]) ativ[a] = { rotulo, grupo };
    const k = a + '|' + turma + '|' + normNome(nome), d = quando ? String(quando) : '', nt = nota10(nota);
    const e = ent.get(k) || { a, t: turma, nome: String(nome).trim(), n: 0, pri: '', ult: '', parcial: true, nota: null, pend: false, melhor: null, _dn: null };
    e.n++; if (!parcial) e.parcial = false;
    if (d && (!e.pri || d < e.pri)) e.pri = d; if (d && d > e.ult) e.ult = d;
    if (nt !== null) {
      if (e._dn === null || d >= e._dn) { e.nota = nt; e.pend = !!pend; e._dn = d; }
      if (e.melhor === null || nt > e.melhor) e.melhor = nt;
    }
    ent.set(k, e);
  };
  const media = l => l.length ? l.reduce((x, y) => x + y, 0) / l.length : null;
  const fonte = async (nome, fn) => { try { await fn(); } catch (e) { avisos.push(nome + ': ' + String(e.message || e).slice(0, 120)); } };
  const turmaEM = r => TURMAS_EM[r.turma_id] || r.turma;
  const roster = {};
  await Promise.all([
    fonte('Listas de chamada', async () => {
      const al = await rest('alunos?select=turma,chamada,nome,escola&order=turma.asc,chamada.asc&limit=5000');
      al.forEach(a => { if (!/º\s*Ano/i.test(a.turma || '') || !a.nome) return;
        const t = String(a.turma).trim() + (/^6/.test(a.turma) && /lydia/i.test(a.escola || '') ? ' (Lydia)' : '');
        (roster[t] = roster[t] || []).push({ n: a.chamada, nome: String(a.nome).trim() }); });
      Object.keys(ALUNOS_EM).forEach(id => { roster[TURMAS_EM[id] || id] = ALUNOS_EM[id].map(a => ({ n: a.n, nome: a.nome })); });
    }),
    fonte('Ensino Médio, Recuperação 2ª DS e Quiz de Tecnologia', async () => {
      (await rest('em_respostas?select=avaliacao,turma_id,turma,componente,prova,nome,criado,nota_obj,nota_final&order=criado.asc&limit=20000'))
        .filter(r => r.avaliacao !== 'bio-2-paulista')   // Biologia · Prova Paulista: substituída no quadro pela Atividade personalizada
        .forEach(r => add(r.avaliacao, (r.componente ? r.componente + ' · ' : '') + (r.prova || r.avaliacao), r.avaliacao === TEC8.AV ? 'Quiz' : 'Avaliação', turmaEM(r), r.nome, r.criado, false,
          r.nota_final != null ? Number(r.nota_final) : r.nota_obj != null ? Number(r.nota_obj) : null, r.nota_final == null && r.nota_obj != null));
    }),
    fonte('Ciências 8º ano', async () => {
      (await rest('atividade_ciencias_respostas?select=turma,nome,criado_em,acertos,total_objetivas&order=criado_em.asc&limit=5000'))
        .forEach(r => add('cien-8-circuitos', 'Ciências · Circuitos elétricos (4º bim.)', 'Atividade', r.turma, r.nome, r.criado_em, false, (Number(r.acertos) || 0) / (Number(r.total_objetivas) || 7) * 10, true));   // só objetivas; dissertativas com o professor
    }),
    fonte('Atividade individual', async () => {
      (await rest('indiv_respostas?select=turma,nome,criado,status,nota,acertos,total_obj&order=criado.asc&limit=10000'))
        .forEach(r => {
          const nt = r.nota != null ? Number(r.nota) : (Number(r.total_obj) > 0 ? (Number(r.acertos) || 0) / Number(r.total_obj) * 10 : null), pend = r.nota == null;
          if (/simulado adaptado/i.test(r.status || '')) add('indiv-simulado', 'Simulado SARESP adaptado (PEI)', 'Avaliação', rotuloTurma(r.turma), r.nome, r.criado, false, nt, pend);
          else add('individual', 'Atividade individual', 'Atividade', rotuloTurma(r.turma), r.nome, r.criado, false, nt, pend);
        });
    }),
    fonte('Aula online de 30 min', async () => {
      (await rest('aula30_resultados?select=turma,nome,criado,blocos&order=criado.asc&limit=10000'))
        .forEach(r => add('aula30', 'Aula online · 30 min', 'Aula', rotuloTurma(r.turma), r.nome, r.criado, false,
          (m => m === null ? null : m * 10)(media((r.blocos || []).map(b => Number(b.obj)).filter(v => isFinite(v))))));   // questões objetivas da aula (acerto de primeira = 1, segunda = 0,5)
    }),
    fonte('Missão Ciências', async () => {
      (await rest('missao_resultado?oculto=eq.false&select=turma,nome,concluido,atualizado,nota&limit=10000'))
        .forEach(r => add('missao', 'Missão Ciências', 'Jogo', rotuloTurma(r.turma), r.nome, r.atualizado, !r.concluido, r.concluido && r.nota != null ? Number(r.nota) : null));
    }),
    fonte('Missão SARESP 3D', async () => {
      /* uma linha por seção: nota do aluno = média da melhor nota das seções concluídas (temas e simulado) */
      const sec = await rest('missao3d_secao?select=turma,nome,atividade,n_tent,n_conc,melhor,ult&limit=20000'), por = {};
      sec.forEach(r => { const k = rotuloTurma(r.turma) + '|' + normNome(r.nome); (por[k] = por[k] || { t: rotuloTurma(r.turma), nome: r.nome, ult: '', conc: false, ns: [] });
        const o = por[k]; if (String(r.ult || '') > o.ult) o.ult = String(r.ult || ''); if (Number(r.n_conc) > 0) { o.conc = true; if ((r.atividade === 'tema' || r.atividade === 'simulado') && r.melhor != null) o.ns.push(Number(r.melhor)); } });
      Object.values(por).forEach(o => add('missao3d', 'Missão SARESP 3D', 'Jogo', o.t, o.nome, o.ult, !o.conc, media(o.ns)));
    }),
    fonte('Orbit Quiz', async () => {
      (await rest('orbit_placar?select=turma,nome,respondidas,acertos,atualizado&limit=5000'))
        .forEach(r => { if (Number(r.respondidas) > 0) add('orbit', 'Orbit Quiz (gamificação)', 'Jogo', rotuloTurma(r.turma), r.nome, r.atualizado, false, (Number(r.acertos) || 0) / Number(r.respondidas) * 10); });   // % de acertos no jogo
    }),
    fonte('Atividade personalizada (planilha)', async () => {
      /* 1º tenta a rota em lote (resultadosPers); se o Apps Script publicado não a tiver, usa a rota já existente
         do painel (atividadeProf), aluno por aluno, com várias consultas ao mesmo tempo. */
      const url = process.env.EM_APPS_SCRIPT_URL || '', segredo = process.env.EM_SEGREDO || '';
      if (!url || !segredo) throw new Error('planilha não configurada');
      const pede = async (corpo, ms) => {
        const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms);
        try {
          const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ segredo }, corpo)), redirect: 'follow', signal: ctl.signal });
          return await r.json();
        } finally { clearTimeout(t); }
      };
      const lanca = x => add('personalizada-em', 'Atividade personalizada', 'Atividade', TURMA_PERS[x.turma] || x.turma, x.nome, x.criado, false,
        x.acertos != null ? Number(x.acertos) / (Number(x.total) || 10) * 10 : null);   // 10 objetivas: nota = acertos
      let lote = null;
      try { lote = await pede({ acao: 'resultadosPers' }, 15000); } catch (e) { lote = null; }
      if (lote && lote.ok) { (lote.rows || []).forEach(lanca); return; }
      const fila = [];
      Object.keys(PERS_NOMES).forEach(turma => PERS_NOMES[turma].forEach(nome => fila.push({ turma, nome })));
      const fim = Date.now() + 40000; let falhas = 0;
      const trabalha = async () => {
        while (fila.length && Date.now() < fim) {
          const a = fila.shift();
          try {
            const j = await pede({ acao: 'atividadeProf', turma: a.turma, nome: a.nome }, Math.max(3000, fim - Date.now()));
            if (!j || !j.ok) { falhas++; continue; }
            if (!j.enviado) continue;
            const qs = j.questoes || [];
            lanca({ turma: a.turma, nome: j.nome || a.nome, criado: String(j.enviado), acertos: qs.filter(q => q.situacao === 'Certo').length, total: qs.length || 10 });
          } catch (e) { falhas++; }
        }
      };
      await Promise.all(Array.from({ length: 15 }, trabalha));
      if (fila.length || falhas) throw new Error((fila.length + falhas) + ' aluno(s) não puderam ser lidos agora; recarregue em instantes');
    }),
    fonte('Simulado SARESP (planilha)', async () => {
      const url = process.env.EM_APPS_SCRIPT_URL || '', segredo = process.env.EM_SEGREDO || '';
      if (!url || !segredo) throw new Error('planilha não configurada');
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 22000);
      try {
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ acao: 'resultadosEF', segredo }), redirect: 'follow', signal: ctl.signal });
        const j = await r.json(); if (!j || !j.ok) throw new Error(String((j && j.erro) || 'sem resposta'));
        (j.rows || []).forEach(x => {   // mesma conta do relatório do Simulado: objetivas (acerto) + dissertativas (nota 0–1); sem nota ainda = provisória
          const it = x.itens || [], v = it.map(i => i.tipo === 'obj' ? (i.acerto ? 1 : 0) : (typeof i.nota === 'number' ? Math.max(0, Math.min(1, i.nota)) : null)).filter(z => z !== null);
          add('simulado-ef', 'Simulado SARESP', 'Avaliação', x.turma, x.nome, x.criado, false, v.length ? media(v) * 10 : null, it.some(i => i.tipo === 'dis' && typeof i.nota !== 'number'));
        });
      } catch (e) { throw new Error(e.name === 'AbortError' ? 'a planilha demorou para responder; recarregue em instantes' : e.message); }
      finally { clearTimeout(t); }
    })
  ]);
  return { ok: true, atividades: ativ, entregas: [...ent.values()].map(e => { delete e._dn; return e; }), roster, avisos };
}

module.exports = async function resultados(req, res) {
  res.setHeader('Cache-Control', 'no-store'); res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const out = (c, v) => res.status(c).json(v);
  try {
    if (req.method !== 'GET' && req.method !== 'POST') return out(405, { ok: false, erro: 'Use GET.' });
    if (!SB || !KEY) return out(500, { ok: false, erro: 'Banco não configurado na Vercel.' });
    if (!(await professor(req))) return out(401, { ok: false, erro: 'Entre primeiro no painel com o seu login de professor.' });
    if (req.method === 'POST') {   // liberar novo envio de um aluno (apaga o envio dele)
      const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      if (b.acao !== 'liberar') return out(400, { ok: false, erro: 'Ação inválida.' });
      if (b.fonte === 'individual') {
        const id = Number(b.id); if (!Number.isInteger(id) || id <= 0) return out(400, { ok: false, erro: 'Envio inválido.' });
        const r = await fetch(SB + '/rest/v1/indiv_respostas?id=eq.' + id, { method: 'DELETE', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, Prefer: 'return=representation' } });
        const t = await r.text(); if (!r.ok) return out(502, { ok: false, erro: 'Supabase ' + r.status + ': ' + t.slice(0, 160) });
        return out(200, { ok: true, removidos: (t ? JSON.parse(t) : []).length });
      }
      if (b.fonte === 'simulado') {
        const url = process.env.EM_APPS_SCRIPT_URL || '', segredo = process.env.EM_SEGREDO || '';
        if (!url || !segredo) return out(500, { ok: false, erro: 'Planilha não configurada na Vercel.' });
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ acao: 'liberarEF', segredo, turma: String(b.turma || ''), nome: String(b.nome || '') }), redirect: 'follow' });
        const j = await r.json().catch(() => null);
        if (!j || !j.ok) return out(502, { ok: false, erro: String((j && j.erro) || 'A planilha não respondeu.') + (/ação desconhecida/.test(String(j && j.erro)) ? ' — cole o Codigo-completo.gs atualizado no Apps Script e crie uma nova versão da implantação.' : '') });
        return out(200, { ok: true, removidos: j.removidos });
      }
      if (b.fonte === 'em' && (b.aval === REC2DS.id || b.aval === TEC8.AV)) {   // recuperação da 2ª DS e quiz de Tecnologia do 8º: um envio por aluno; apaga o envio para o aluno refazer
        const r = await fetch(SB + '/rest/v1/em_respostas?avaliacao=eq.' + encodeURIComponent(b.aval) + '&turma=eq.' + encodeURIComponent(String(b.turma || '')) + '&nome=eq.' + encodeURIComponent(String(b.nome || '')), { method: 'DELETE', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, Prefer: 'return=representation' } });
        const t = await r.text(); if (!r.ok) return out(502, { ok: false, erro: 'Supabase ' + r.status + ': ' + t.slice(0, 160) });
        return out(200, { ok: true, removidos: (t ? JSON.parse(t) : []).length });
      }
      return out(400, { ok: false, erro: 'Esta avaliação não tem limite de envio.' });
    }
    const fonte = String((req.query && req.query.fonte) || '');
    if (fonte === 'em') {
      const rows = await rest('em_respostas?select=envio_id,criado,avaliacao,turma_id,turma,componente,prova,n,nome,itens,acertos,total_obj,nota_obj,nota_final,status&avaliacao=neq.' + TEC8.AV + '&order=criado.asc&limit=5000');
      const meta = {}; rows.forEach(r => (r.itens || []).forEach(i => { if (META_EM[i.id]) meta[i.id] = META_EM[i.id]; }));
      const roster = {}; Object.keys(ALUNOS_EM).forEach(t => { roster[t] = { turma: TURMAS_EM[t] || t, alunos: ALUNOS_EM[t].map(a => ({ n: a.n, nome: a.nome })) }; });
      return out(200, { ok: true, rows, meta, roster });
    }
    if (fonte === 'tecnologia8') {   // Quiz de Tecnologia 8º ano (grafos): mesmo formato do Ensino Médio
      const rows = await rest('em_respostas?select=envio_id,criado,avaliacao,turma_id,turma,componente,prova,n,nome,itens,acertos,total_obj,nota_obj,nota_final,status&avaliacao=eq.' + TEC8.AV + '&order=criado.asc&limit=5000');
      rows.forEach(r => { r.rot_serie = '8º ano'; });
      const al = await rest('alunos?select=turma,chamada,nome&turma=in.(' + encodeURIComponent('"8º Ano A","8º Ano B"') + ')&order=chamada.asc&limit=200');
      const roster = {}; al.forEach(a => { (roster[a.turma] = roster[a.turma] || { turma: a.turma, alunos: [] }).alunos.push({ n: a.chamada, nome: String(a.nome).trim() }); });
      return out(200, { ok: true, rows, meta: TEC8.META, roster });
    }
    if (fonte === 'ciencias8') {   // Atividade de Ciências 8º ano (circuitos): reaproveita o formato do Ensino Médio
      const rs = await rest('atividade_ciencias_respostas?select=id,criado_em,turma,chamada,nome,respostas,dissertativas,acertos,total_objetivas&order=criado_em.asc&limit=5000');
      const rows = rs.map(r => {
        const itens = Object.keys(META_C8).sort().map(id => {
          const m = META_C8[id], resp = (r.respostas || {})[m.n] || '', dis = (r.dissertativas || {})[m.n] || '';
          if (m.tipo === 'obj') return { id, tipo: 'obj', resp, acerto: resp === m.cor, correta: 'ABCDE'.indexOf(m.cor), alts: m.alts };
          return { id, tipo: 'dis', resp: dis };
        });
        const tot = r.total_objetivas || 7;
        return { envio_id: 'cien-8-' + r.id, id: r.id, criado: r.criado_em, avaliacao: 'cien-8-circuitos', turma_id: r.turma, turma: r.turma, componente: 'Ciências', prova: 'Circuitos elétricos (4º bimestre)', rot_serie: '8º ano', n: r.chamada, nome: r.nome, itens, acertos: r.acertos, total_obj: tot, nota_obj: Math.round((r.acertos || 0) / tot * 100) / 10, nota_final: null, status: 'objetivas corrigidas; dissertativas para correção do professor' };
      });
      const al = await rest('alunos?select=turma,chamada,nome&turma=in.(' + encodeURIComponent('"8º Ano A","8º Ano B"') + ')&order=chamada.asc&limit=200');
      const roster = {}; al.forEach(a => { (roster[a.turma] = roster[a.turma] || { turma: a.turma, alunos: [] }).alunos.push({ n: a.chamada, nome: String(a.nome).trim() }); });
      return out(200, { ok: true, rows, meta: META_C8, roster });
    }
    if (fonte === 'quadro') return out(200, await quadro());   // Quadro de entregas: todas as atividades × alunos, por turma
    if (fonte === 'individual') {
      const rows = await rest('indiv_respostas?select=id,criado,turma,nome,itens,acertos,total_obj,nota,status&order=criado.asc&limit=5000');
      rows.forEach(r => { r.turma = rotuloTurma(r.turma); });   // "6º ANO C TARDE" e "6º Ano C" são a mesma turma
      const meta = {}; rows.forEach(r => (r.itens || []).forEach(i => { const c = CAT[i.k]; if (c && !meta[i.k]) meta[i.k] = { serie: c.serie, bim: c.bim, desc: c.desc, hab: c.hab, ae: c.habTxt }; }));
      if (rows.some(r => (r.itens || []).some(i => i.k === 'pei'))) meta.pei = { serie: '', bim: '4', desc: 'Atividade adaptada (PEI)', hab: '', ae: 'Atividade adaptada ao plano individual' };
      const plano = await rest('indiv_plano?select=turma,nome&limit=2000');
      const roster = {}; plano.forEach(p => { const t = rotuloTurma(p.turma); (roster[t] = roster[t] || []).push(p.nome); });
      return out(200, { ok: true, rows, meta, roster });
    }
    if (fonte === 'simulado') {   // Simulado SARESP (Fundamental): lê as abas da planilha pelo Apps Script
      const url = process.env.EM_APPS_SCRIPT_URL || '', segredo = process.env.EM_SEGREDO || '';
      if (!url || !segredo) return out(500, { ok: false, erro: 'Planilha não configurada na Vercel (EM_APPS_SCRIPT_URL / EM_SEGREDO).' });
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 25000);
      let j;
      try {
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ acao: 'resultadosEF', segredo }), redirect: 'follow', signal: ctl.signal });
        j = await r.json();
      } catch (e) { return out(502, { ok: false, erro: 'Não foi possível ler a planilha agora. Confira se o Apps Script foi atualizado e reimplantado.' }); }
      finally { clearTimeout(t); }
      if (!j || !j.ok) return out(502, { ok: false, erro: 'A planilha respondeu: ' + String((j && j.erro) || 'erro') + (/ação desconhecida/.test(String(j && j.erro)) ? ' — cole o ARQUIVO-UNICO.gs atualizado no Apps Script e crie uma nova versão da implantação.' : '') });
      return out(200, { ok: true, rows: j.rows, meta: META_SIM, roster: j.roster });
    }
    return out(400, { ok: false, erro: 'Fonte inválida.' });
  } catch (e) { return out(500, { ok: false, erro: String(e.message || e).slice(0, 200) }); }
};
