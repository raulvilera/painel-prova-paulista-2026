/* Gera api/_meta-simulado.js: habilidade/bimestre/descritor de cada questão do simulado do Fundamental (sem gabarito).
   Uso: node tools/gerar-meta-simulado.js */
const fs = require('fs');
const s = fs.readFileSync(__dirname + '/../apps-script/simulado/ARQUIVO-UNICO.gs', 'utf8');
const m = /const QUESTOES = (\{[\s\S]*?\});\s*\n/.exec(s);
const Q = JSON.parse(m[1]);
const CAT = require('../api/_catalogo-indiv.js'), txt = {};
Object.values(CAT).forEach(c => { if (c.hab && c.habTxt) txt[c.hab] = c.habTxt; });
const out = {};
Object.keys(Q).forEach(serie => Q[serie].forEach((q, i) => {
  out[serie + '-' + i] = { serie, bim: String(parseInt(q.bim, 10)), hab: q.hab, ae: txt[q.hab] || '', desc: q.saresp || '', tipo: q.tipo, n: i + 1, enun: String(q.enunciado || '').slice(0, 260), cor: q.tipo === 'obj' ? 'ABCDE'[q.correta] : '' };
}));
fs.writeFileSync(__dirname + '/../api/_meta-simulado.js', '/* GERADO por tools/gerar-meta-simulado.js — não editar à mão */\nmodule.exports = ' + JSON.stringify(out) + ';\n');
console.log(Object.keys(out).length + ' questões');
