/* Jogo da Trilha SARESP (Fundamental, 6º ao 9º ano) — só para o professor, projetado em sala.
   GET /api/jogo            → lista de turmas
   GET /api/jogo?turma=…    → temas do SARESP da série da turma, com o peso de cada tema na turma e questões objetivas do banco
   O peso vem do plano de cada aluno derivado do painel (descritores com defasagem), somado por turma: só números agregados,
   nenhum nome de aluno sai daqui. Exige o login do professor (Bearer token do Supabase), porque as questões levam o gabarito. */
const LOGIN_URL = process.env.PAINEL_SUPABASE_URL || 'https://ykrjfjepnqeoqlgupsbe.supabase.co';
const LOGIN_KEY = process.env.PAINEL_SUPABASE_KEY || 'sb_publishable_FbMU5x7WBpxzHmmVzOfh2g_0M1xxAh5';
const PAINEL = require('./_plano-painel.js');
const CAT = require('./_catalogo-indiv.js');
const BANCO = require('./_banco-indiv.js');

const Q_POR_TEMA = 4;

async function professor(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (!m) return false;
  const r = await fetch(LOGIN_URL + '/auth/v1/user', { headers: { apikey: LOGIN_KEY, Authorization: 'Bearer ' + m[1] } });
  return r.ok;
}

const serieDe = t => { const m = /(\d)\s*º/.exec(String(t)); return m ? m[1] : ''; };

function dadosTurma(turma) {
  const T = PAINEL[turma]; if (!T) return null;
  const serie = serieDe(turma);
  const alunos = Object.keys(T), n = alunos.length || 1;
  // conta, por descritor, quantos alunos têm defasagem e o nível médio deles (0 = mais distante do esperado)
  const cont = {}, niv = {};
  alunos.forEach(a => (T[a] || []).forEach(([k, nv]) => { cont[k] = (cont[k] || 0) + 1; niv[k] = (niv[k] || 0) + (Number(nv) || 0); }));
  const temas = Object.keys(CAT).filter(k => CAT[k].serie === serie).map(k => {
    const c = CAT[k], qs = (BANCO[k] || []).filter(q => q.tipo === 'obj' && Array.isArray(q.alts) && Number.isInteger(q.correta)).slice(0, Q_POR_TEMA);
    return {
      k, bim: c.bim, hab: c.hab, desc: c.desc, nome: c.nome,
      defasagem: Math.round((cont[k] || 0) / n * 100),          // % de alunos da turma com defasagem neste tema
      nivelMedio: cont[k] ? Math.round(niv[k] / cont[k] * 10) / 10 : null,
      qs: qs.map(q => ({ enunciado: q.enunciado, comando: q.comando, figura: q.figura || null, svg: q.svg || '', alts: q.alts, correta: q.correta, explicacao: q.explicacao || '' }))
    };
  }).filter(t => t.qs.length);
  temas.sort((a, b) => a.bim.localeCompare(b.bim) || b.defasagem - a.defasagem);
  return { turma, serie, alunos: alunos.length, temas };
}

module.exports = async function jogo(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const out = (c, v) => res.status(c).json(v);
  try {
    if (req.method !== 'GET') return out(405, { ok: false, erro: 'Use GET.' });
    if (!(await professor(req))) return out(401, { ok: false, erro: 'Entre primeiro no painel com o seu login de professor.' });
    const turma = String((req.query && req.query.turma) || '').trim();
    if (!turma) return out(200, { ok: true, turmas: Object.keys(PAINEL).sort((a, b) => a.localeCompare(b, 'pt')) });
    const d = dadosTurma(turma);
    if (!d) return out(404, { ok: false, erro: 'Turma não encontrada.' });
    return out(200, Object.assign({ ok: true }, d));
  } catch (e) {
    return out(500, { ok: false, erro: 'Não foi possível montar o jogo.' });
  }
};
module.exports.dadosTurma = dadosTurma;
