const { D } = require('../lib.js');
const fio = (f, pts, o = {}) => f.path('M' + pts.map(p => p.join(' ')).join(' L'), { stroke: '#37474f', sw: 3, ...o });
const volt = (f, x, y, txt) => { f.circle(x, y, 26, { fill: '#fff', stroke: '#37474f', sw: 3 }); f.text(x, y + 6, txt, { size: 17, w: 700, anchor: 'middle' }); };
const eletrodo = (f, x, y, h, c, lab) => { f.rect(x, y, 14, h, { fill: c, stroke: '#37474f', sw: 1.5, r: 2 }); if (lab) f.text(x + 7, y + h + 18, lab, { size: 13, w: 700, anchor: 'middle' }); };
const ponte = (f, x1, x2, y) => { f.path(`M${x1} ${y - 26} V${y} H${x2} V${y - 26}`, { stroke: '#8d6e63', sw: 12 }); f.path(`M${x1} ${y - 26} V${y} H${x2} V${y - 26}`, { stroke: '#efe3d0', sw: 6 }); };
const pilha = (f, a, b) => { // a,b = {nome, cor, liq, ion}
  D.becker(f, 40, 160, 180, 120, a.liq, { nivel: .6 }); D.becker(f, 300, 160, 180, 120, b.liq, { nivel: .6 });
  eletrodo(f, 115, 110, 150, a.cor); eletrodo(f, 375, 110, 150, b.cor);
  f.text(130, 306, a.nome + ' | ' + a.ion, { size: 13, w: 700, anchor: 'middle' }); f.text(390, 306, b.nome + ' | ' + b.ion, { size: 13, w: 700, anchor: 'middle' });
  ponte(f, 190, 330, 176); fio(f, [[122, 110], [122, 88], [225, 88]]); fio(f, [[295, 88], [382, 88], [382, 110]]); volt(f, 260, 88, 'V'); };
module.exports = { fio, volt, eletrodo, ponte, pilha };
