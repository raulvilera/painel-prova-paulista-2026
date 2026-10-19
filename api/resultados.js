/* Resultados dos alunos para o dashboard do professor (somente leitura).
   GET /api/resultados?fonte=em|individual  — exige o login do professor (Bearer token do Supabase da plataforma).
   Variáveis na Vercel: SUPABASE_URL, SUPABASE_SERVICE_KEY (as mesmas da atividade individual). */
const CAT = require('./_catalogo-indiv.js');
const META_EM = require('./_meta-em.js');
const META_SIM = require('./_meta-simulado.js');
const ALUNOS_EM = require('./_alunos-em.js');
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
    if (req.method !== 'GET') return out(405, { ok: false, erro: 'Use GET.' });
    if (!SB || !KEY) return out(500, { ok: false, erro: 'Banco não configurado na Vercel.' });
    if (!(await professor(req))) return out(401, { ok: false, erro: 'Entre primeiro no painel com o seu login de professor.' });
    const fonte = String((req.query && req.query.fonte) || '');
    if (fonte === 'em') {
      const rows = await rest('em_respostas?select=envio_id,criado,avaliacao,turma_id,turma,componente,prova,n,nome,itens,acertos,total_obj,nota_obj,nota_final,status&order=criado.asc&limit=5000');
      const meta = {}; rows.forEach(r => (r.itens || []).forEach(i => { if (META_EM[i.id]) meta[i.id] = META_EM[i.id]; }));
      const roster = {}; Object.keys(ALUNOS_EM).forEach(t => { roster[t] = { turma: TURMAS_EM[t] || t, alunos: ALUNOS_EM[t].map(a => ({ n: a.n, nome: a.nome })) }; });
      return out(200, { ok: true, rows, meta, roster });
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
