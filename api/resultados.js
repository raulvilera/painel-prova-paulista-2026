/* Resultados dos alunos para o dashboard do professor (somente leitura).
   GET /api/resultados?fonte=em|individual  — exige o login do professor (Bearer token do Supabase da plataforma).
   Variáveis na Vercel: SUPABASE_URL, SUPABASE_SERVICE_KEY (as mesmas da atividade individual). */
const CAT = require('./_catalogo-indiv.js');
const META_EM = require('./_meta-em.js');
const META_SIM = require('./_meta-simulado.js');
const ALUNOS_EM = require('./_alunos-em.js');
const META_C8 = require('./_meta-cien8.js');
/* Recuperação semestral da 2ª DS: enunciado, habilidade e gabarito de cada questão para o relatório (o servidor já é do professor) */
const REC2DS = require('../recuperacao-2ds/questoes.js'), REC2DS_GAB = require('./_recuperacao-2ds-gabarito.js');
REC2DS.questoes.forEach(q => { META_EM[q.id] = { tipo: q.tipo, av: REC2DS.id, hab: q.hab, objeto: q.objeto, ae: q.ae, n: q.n,
  enun: (String(q.texto).replace(/<[^>]*>/g, ' ') + ' ' + String(q.comando).replace(/<[^>]*>/g, ' ')).replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 600),
  cor: q.tipo === 'obj' ? 'ABCDE'[REC2DS_GAB.objetivas[q.id].correta] : '', serie: '2', comp: REC2DS.componente, prova: REC2DS.prova }; });
const SB = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), KEY = process.env.SUPABASE_SERVICE_KEY || '';
const LOGIN_URL = process.env.PAINEL_SUPABASE_URL || 'https://ykrjfjepnqeoqlgupsbe.supabase.co', LOGIN_KEY = process.env.PAINEL_SUPABASE_KEY || 'sb_publishable_FbMU5x7WBpxzHmmVzOfh2g_0M1xxAh5';

async function rest(path) {
  const r = await fetch(SB + '/rest/v1/' + path, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
  const t = await r.text(); if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + t.slice(0, 160));
  return t ? JSON.parse(t) : [];
}
async function professor(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (!m) return false;
  const r = await fetch(LOGIN_URL + '/auth/v1/user', { headers: { apikey: LOGIN_KEY, Authorization: 'Bearer ' + m[1] } });
  return r.ok;
}
/* Nome único da turma: "6º ANO C TARDE" (painel) = "6º Ano C" (E.E. Wanda); "6º ANO C MANHÃ" = "6º Ano C (Lydia)" */
const rotuloTurma = t => { const m = /^(\d)º\s*ANO\s*([A-Z])\s*(MANHÃ|MANHA|TARDE)$/i.exec(String(t || '').trim()); return m ? m[1] + 'º Ano ' + m[2] + (/^M/i.test(m[3]) ? ' (Lydia)' : '') : t; };
const TURMAS_EM = { '2a-manha': '2ª Série A Manhã (Des. Sistemas)', '2c-noite': '2ª Série C Noite', '3f-noite': '3ª Série F Noite' };

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
      if (b.fonte === 'em' && b.aval === REC2DS.id) {   // recuperação da 2ª DS: um envio por aluno; apaga o envio para o aluno refazer
        const r = await fetch(SB + '/rest/v1/em_respostas?avaliacao=eq.' + encodeURIComponent(REC2DS.id) + '&turma=eq.' + encodeURIComponent(String(b.turma || '')) + '&nome=eq.' + encodeURIComponent(String(b.nome || '')), { method: 'DELETE', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, Prefer: 'return=representation' } });
        const t = await r.text(); if (!r.ok) return out(502, { ok: false, erro: 'Supabase ' + r.status + ': ' + t.slice(0, 160) });
        return out(200, { ok: true, removidos: (t ? JSON.parse(t) : []).length });
      }
      return out(400, { ok: false, erro: 'Esta avaliação não tem limite de envio.' });
    }
    const fonte = String((req.query && req.query.fonte) || '');
    if (fonte === 'em') {
      const rows = await rest('em_respostas?select=envio_id,criado,avaliacao,turma_id,turma,componente,prova,n,nome,itens,acertos,total_obj,nota_obj,nota_final,status&order=criado.asc&limit=5000');
      const meta = {}; rows.forEach(r => (r.itens || []).forEach(i => { if (META_EM[i.id]) meta[i.id] = META_EM[i.id]; }));
      const roster = {}; Object.keys(ALUNOS_EM).forEach(t => { roster[t] = { turma: TURMAS_EM[t] || t, alunos: ALUNOS_EM[t].map(a => ({ n: a.n, nome: a.nome })) }; });
      return out(200, { ok: true, rows, meta, roster });
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
