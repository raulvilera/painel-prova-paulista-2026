/* Gera simulado/ensino-medio/img/<id>.svg a partir de tools/ilustracoes-em/cenas/*.js */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'ilustracoes-em', 'cenas'), out = path.join(__dirname, '..', 'simulado', 'ensino-medio', 'img');
let n = 0;
for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.js'))) {
  const cenas = require(path.join(dir, f));
  for (const id in cenas) { fs.writeFileSync(path.join(out, id + '.svg'), cenas[id]().svg()); n++; }
}
console.log(n + ' SVGs gerados');
