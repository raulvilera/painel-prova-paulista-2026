/* Troca o campo foto das questões que têm img/<id>.svg autoral (legenda = <title> do SVG). Só altera "foto". */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'simulado', 'ensino-medio'), qp = path.join(dir, 'questoes.js');
let src = fs.readFileSync(qp, 'utf8'), n = 0;
for (const f of fs.readdirSync(path.join(dir, 'img')).filter(x => x.endsWith('.svg'))) {
  const id = f.replace('.svg', ''); const svg = fs.readFileSync(path.join(dir, 'img', f), 'utf8');
  const leg = (svg.match(/<title>([^<]*)<\/title>/) || [])[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  const re = new RegExp('("id": "' + id + '",\\s*\\n\\s*)"foto": \\{[^}]*\\}');
  if (!re.test(src)) continue; if (/"foto": \{"src":"img\//.test(src.match(new RegExp('"id": "' + id + '",\\s*\\n\\s*"foto": [^\\n]*'))[0])) continue;
  src = src.replace(re, (m, a) => a + '"foto": ' + JSON.stringify({ src: 'img/' + f, leg, cred: 'Ilustração autoral', ilustracao: true })); n++;
}
fs.writeFileSync(qp, src); console.log(n + ' fotos trocadas');
