/* Aplica as questões reescritas do Simulado (arquivos sim-6..9.json numa pasta) em: apps-script ARQUIVO-UNICO.gs e Dados.gs (com gabarito),
   simulado/questoes.js (sem gabarito, mantendo as fotos) e depois rode tools/gerar-meta-simulado.js. Uso: node tools/aplicar-simulado.js <pasta> */
const fs = require('fs'), path = require('path'), dir = process.argv[2], raiz = path.join(__dirname, '..');
const NOVO = {}; ['6', '7', '8', '9'].forEach(s => NOVO[s] = JSON.parse(fs.readFileSync(path.join(dir, 'sim-' + s + '.json'), 'utf8')));
const gs = q => q.tipo === 'obj' ? { tipo: q.tipo, grupo: q.grupo, hab: q.hab, bim: q.bim, saresp: q.saresp, enunciado: q.enunciado, img: q.img, comando: q.comando, alts: q.alts, correta: q.correta }
  : { tipo: q.tipo, grupo: q.grupo, hab: q.hab, bim: q.bim, saresp: q.saresp, enunciado: q.enunciado, img: q.img, comando: q.comando, ref: q.ref, conceitos: q.conceitos };
['apps-script/simulado/ARQUIVO-UNICO.gs', 'apps-script/simulado/Dados.gs'].forEach(f => {
  const p = path.join(raiz, f); let s = fs.readFileSync(p, 'utf8');
  const re = /const QUESTOES = (\{[\s\S]*?\});\s*\n/, m = re.exec(s); if (!m) throw new Error('QUESTOES não encontrado em ' + f);
  const Q = JSON.parse(m[1]); const sp = m[1].indexOf('\n  "') > 0 ? 2 : (m[1].indexOf('\n "') > 0 ? 1 : 0);
  Object.keys(NOVO).forEach(se => { Q[se] = NOVO[se].map(gs); });
  s = s.replace(re, () => 'const QUESTOES = ' + JSON.stringify(Q, null, sp || undefined) + ';\n'); fs.writeFileSync(p, s);
});
const pq = path.join(raiz, 'simulado/questoes.js'); let t = fs.readFileSync(pq, 'utf8');
const w = {}; new Function('window', t)(w); const P = w.QUESTOES_PUB, out = {};
Object.keys(NOVO).forEach(se => out[se] = NOVO[se].map((q, i) => { const o = { tipo: q.tipo, grupo: q.grupo, hab: q.hab, bim: q.bim, saresp: q.saresp, enunciado: q.enunciado, img: q.img, comando: q.comando, alts: q.tipo === 'obj' ? q.alts : [] }; if (P[se][i].foto) o.foto = P[se][i].foto; return o; }));
const hoje = new Date().toISOString().slice(0, 10);
t = t.replace(/^\/\*[^\n]*\*\//, '/* Simulado SARESP 2026 · Ciências. Versão analítica ' + hoje + '. Sem gabarito: correção no Apps Script. */').replace(/window\.QUESTOES_PUB = [\s\S]*$/, 'window.QUESTOES_PUB = ' + JSON.stringify(out, null, 2) + ';\n');
fs.writeFileSync(pq, t); console.log('ok', hoje);
