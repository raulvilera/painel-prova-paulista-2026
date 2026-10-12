/* Gera api/_meta-em.js: para cada questão do Ensino Médio, habilidade/objeto/AE (sem gabarito). Uso: node tools/gerar-meta-em.js */
const fs = require('fs');
global.window = {}; require('../simulado/ensino-medio/questoes.js');
const src = fs.readFileSync(__dirname + '/../api/corrigir-em.js', 'utf8');
const GAB = new Function('return ' + src.slice(src.indexOf('const GABARITO = ') + 17, src.indexOf('\n};') + 2))();
const cor = {}; Object.values(GAB).forEach(l => l.forEach(g => { cor[g.id] = 'ABCDE'[g.correta]; }));
const out = {};
Object.values(window.AVALIACOES_EM).forEach(av => av.questoes.forEach((q, idx) => {
  const ae = (/\(AE(\d+)\)/.exec(q.referencia || '') || [])[1];
  out[q.id] = { tipo: q.tipo, av: av.id, hab: q.hab || '', objeto: q.objeto || '', ae: ae ? 'AE' + ae : '', n: idx + 1, enun: String(q.enunciado || '').slice(0, 260), cor: cor[q.id] || '', serie: av.serie, comp: av.componente, prova: av.prova };
}));
fs.writeFileSync(__dirname + '/../api/_meta-em.js', '/* GERADO por tools/gerar-meta-em.js — não editar à mão */\nmodule.exports = ' + JSON.stringify(out) + ';\n');
console.log(Object.keys(out).length + ' questões');
