/* Gera api/_catalogo-indiv.js a partir de RecompCat.gs (descritores dos bimestres 1–3) e do PLAN do painel (aulas do 4º bimestre cobradas no Saresp). */
const fs = require('fs');
const gs = fs.readFileSync('apps-script/simulado/RecompCat.gs', 'utf8');
const CAT = new Function(gs.replace(/const RECOMP_CAT\s*=/, 'var RECOMP_CAT =') + '; return RECOMP_CAT;')();
const html = fs.readFileSync('index.html', 'utf8');
const PLAN = new Function('return (' + html.match(/const PLAN = (\{[\s\S]*?\});\n/)[1] + ')')();
const out = {};
Object.keys(CAT).forEach(k => { const c = CAT[k]; out[k] = { serie: c.serie, bim: c.bim, desc: c.desc, hab: c.hab, habTxt: c.habTxt, nome: c.nome, concreta: c.concreta, ab: c.ab, b: c.b }; });
['6º ANO', '7º ANO', '8º ANO', '9º ANO'].forEach(se => {
  (PLAN.seq['Ciências|' + se] || []).filter(l => l.s).forEach(l => {
    out['4B|' + se + '|' + l.n] = { serie: se[0], bim: '4', desc: l.o, hab: l.h, habTxt: l.c, nome: l.t, concreta: l.at, ab: '', b: '' };
  });
});
fs.writeFileSync('api/_catalogo-indiv.js', '/* GERADO por tools/gerar-catalogo-indiv.js — não editar à mão */\nmodule.exports = ' + JSON.stringify(out) + ';\n');
console.log(Object.keys(out).length + ' chaves');
