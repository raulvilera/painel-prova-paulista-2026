/* Divide as chaves do banco em 10 lotes (questoes-N.json) para os agentes desenharem as ilustrações.
   Cada lote: { "<chave>": [ {i, tipo, enunciado, comando, alts, correta, ref} x10 ] }. Uso: node tools/banco/svg/preparar.js */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..');
const BANCO = {};
fs.readdirSync(dir).filter(f => /^saida2-\d+\.json$/.test(f)).forEach(f => Object.assign(BANCO, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))));
const chaves = Object.keys(BANCO).sort();
const N = 10, por = Math.ceil(chaves.length / N);
for (let n = 0; n < N; n++) {
  const lote = {};
  chaves.slice(n * por, (n + 1) * por).forEach(k => {
    lote[k] = BANCO[k].map((q, i) => ({ i, tipo: q.tipo, enunciado: q.enunciado, comando: q.comando, alts: q.alts, correta: q.correta, ref: q.ref }));
  });
  fs.writeFileSync(path.join(__dirname, 'questoes-' + n + '.json'), JSON.stringify(lote, null, 1));
  console.log('lote', n, Object.keys(lote).length, 'chaves');
}
