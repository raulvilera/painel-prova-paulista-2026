/* Gera api/_plano-painel.js: plano individual por aluno a partir do painel (descritores fracos da turma × nível do aluno em cada bimestre).
   Entrada (exportada de painel_dados): a.txt "ti|nome|p1|p2|p3", d.txt "ti|bim|idxDescritor|pct;…", dt.txt "idx=md5(desc)[0:8],…". Uso: node tools/gerar-plano-painel.js a.txt d.txt dt.txt */
const fs = require('fs'), crypto = require('crypto'), CAT = require('../api/_catalogo-indiv.js');
const T = ['6º ANO A MANHÃ', '6º ANO A TARDE', '6º ANO B MANHÃ', '6º ANO C MANHÃ', '6º ANO C TARDE', '7º ANO A TARDE', '7º ANO B TARDE', '8º ANO A TARDE', '8º ANO B TARDE', '9º ANO A TARDE', '9º ANO B TARDE'];
const [fa, fd, fdt] = process.argv.slice(2), md5 = s => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);
const porHash = {}; Object.keys(CAT).forEach(k => { (porHash[md5(CAT[k].desc)] = porHash[md5(CAT[k].desc)] || []).push(k); });
const idx2h = {}; fs.readFileSync(fdt, 'utf8').trim().split(',').forEach(x => { const [i, h] = x.split('='); idx2h[i] = h; });
const D = {};   // D[ti][bim] = [{k, pct}]
fs.readFileSync(fd, 'utf8').trim().split(';').forEach(x => {
  const [ti, bim, di, pct] = x.split('|').map(Number), serie = T[ti][0], ks = (porHash[idx2h[di]] || []).filter(k => CAT[k].serie === serie && Number(CAT[k].bim) === bim);
  if (!ks.length) return; ((D[ti] = D[ti] || {})[bim] = D[ti][bim] || []).push({ k: ks[0], pct: pct / 1000 });
});
Object.values(D).forEach(o => Object.values(o).forEach(a => a.sort((x, y) => x.pct - y.pct)));
const lv = v => v == null ? -1 : v < .25 ? 0 : v < .5 ? 1 : v < .75 ? 2 : 3;
const out = {}; let sem = 0, tot = 0;
fs.readFileSync(fa, 'utf8').trim().split('\n').forEach(l => {
  const [ti, nome, ...p] = l.split('|'); const turma = T[Number(ti)], sc = p.map(v => v === '' ? null : Number(v) / 1000);
  const cand = [];   // [prioridade, k, niv]
  [1, 2, 3].forEach(b => {
    const l0 = lv(sc[b - 1]), nivel = l0 < 0 ? 1 : l0, lista = (D[ti] || {})[b] || [];
    if (nivel <= 1) lista.slice(0, 3).forEach((d, i) => cand.push([nivel * 10 + i, d.k, nivel]));
    else lista.slice(0, 1).filter(d => d.pct < .5).forEach(d => cand.push([20 + b, d.k, nivel]));
  });
  cand.sort((x, y) => x[0] - y[0]);
  const itens = [], vistos = {}; cand.forEach(c => { if (!vistos[c[1]] && itens.length < 5) { vistos[c[1]] = 1; itens.push([c[1], c[2]]); } });
  tot++; if (!itens.length) sem++;
  (out[turma] = out[turma] || {})[nome] = itens;
});
fs.writeFileSync(__dirname + '/../api/_plano-painel.js', '/* GERADO por tools/gerar-plano-painel.js a partir do painel — não editar à mão */\nmodule.exports = ' + JSON.stringify(out) + ';\n');
console.log('alunos', tot, 'sem itens', sem, 'turmas', Object.keys(out).length);
