const { Fig, D, COR, fmt } = require('../lib.js');
const Q = (id, t, s, d) => new Fig(id, 'qui', t, s, d);
const fio = (f, pts, o = {}) => f.path('M' + pts.map(p => p.join(' ')).join(' L'), { stroke: '#37474f', sw: 3, ...o });
const volt = (f, x, y, txt) => { f.circle(x, y, 26, { fill: '#fff', stroke: '#37474f', sw: 3 }); f.text(x, y + 6, txt, { size: 17, w: 700, anchor: 'middle' }); };
const eletrodo = (f, x, y, h, c, lab) => { f.rect(x, y, 14, h, { fill: c, stroke: '#37474f', sw: 1.5, r: 2 }); if (lab) f.text(x + 7, y + h + 18, lab, { size: 13, w: 700, anchor: 'middle' }); };
module.exports = {
'qui-2-paulista-02'() {
  const f = Q('qui-2-paulista-02', 'Escala de potenciais-padrão de redução', 'E°red (V) · valores usados na atividade', 'Reta vertical com Mg, Zn, Cu e Ag posicionados por E°red, e os pares I (Mg/Ag) e II (Zn/Cu).');
  f.card(14, 70, 430, 258, 'Potencial-padrão de redução (V)');
  const Y = v => 118 + (0.8 - v) / 3.17 * 178;
  f.line(100, 100, 100, 300, { stroke: f.t.mute, sw: 2 });
  [['Ag⁺/Ag', .80, COR.c], ['Cu²⁺/Cu', .34, COR.l], ['Zn²⁺/Zn', -.76, COR.a], ['Mg²⁺/Mg', -2.37, COR.v]].forEach(d => { f.circle(100, Y(d[1]), 7, { fill: d[2], stroke: '#fff', sw: 2 }); f.text(116, Y(d[1]) + 5, d[0], { size: 14, w: 700 }); f.text(86, Y(d[1]) + 5, (d[1] > 0 ? '+' : '−') + fmt(Math.abs(d[1]).toFixed(2)), { size: 13, anchor: 'end' }); });
  f.line(100, Y(0), 330, Y(0), { stroke: '#cfd8dc', sw: 1.5, dash: '5 5' }); f.text(336, Y(0) + 4, '0,00', { size: 11, fill: f.t.mute });
  [['Par I', 'Mg²⁺/Mg e Ag⁺/Ag', COR.v], ['Par II', 'Zn²⁺/Zn e Cu²⁺/Cu', COR.a]].forEach((d, i) => { const y = 92 + i * 120; f.card(462, y, 284, 108, d[0]); f.text(478, y + 56, d[1], { size: 16, w: 700, fill: d[2] }); f.text(478, y + 80, 'mesmo critério: maior E°red → cátodo', { size: 11.5, fill: f.t.mute }); });
  return f; },
'qui-2-paulista-04'() {
  const f = Q('qui-2-paulista-04', 'Condutividade de soluções (mesmo aparelho, mesma temperatura)', 'Dados hipotéticos · concentração nominal 0,20 mol·L⁻¹', 'Quatro béqueres com circuito e lâmpada: água destilada, glicose, NaCl e CuSO4 com suas condutividades.');
  [['Água destilada', 'controle', '6 μS·cm⁻¹', '#e6f2fb', .08], ['Glicose(aq)', '0,20 mol·L⁻¹', '25 μS·cm⁻¹', '#eef0e0', .1], ['NaCl(aq)', '0,20 mol·L⁻¹', '18.500 μS·cm⁻¹', '#e6f2fb', .75], ['CuSO₄(aq)', '0,20 mol·L⁻¹', '24.100 μS·cm⁻¹', '#9fd0ea', .9]].forEach((d, i) => { const x = 40 + i * 180;
    f.circle(x + 60, 100, 20, { fill: '#ffe066', op: d[4] + .1, stroke: '#9e8a2f', sw: 2 }); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; f.line(x + 60 + 26 * Math.cos(a), 100 + 26 * Math.sin(a), x + 60 + 34 * Math.cos(a), 100 + 34 * Math.sin(a), { stroke: '#e0b64a', sw: 2 }); }
    fio(f, [[x + 40, 118], [x + 22, 118], [x + 22, 160]], { sw: 2.5 }); fio(f, [[x + 80, 118], [x + 98, 118], [x + 98, 160]], { sw: 2.5 });
    D.becker(f, x, 160, 120, 100, d[3], { nivel: .65 }); f.rect(x + 18, 160, 8, 62, { fill: '#78909c' }); f.rect(x + 94, 160, 8, 62, { fill: '#78909c' });
    f.text(x + 60, 290, d[0], { size: 13.5, w: 700, anchor: 'middle' }); f.text(x + 60, 307, d[1], { size: 11.5, anchor: 'middle', fill: f.t.mute }); f.text(x + 60, 325, d[2], { size: 13, w: 700, anchor: 'middle', fill: COR.r }); });
  return f; },
'qui-2-paulista-05'() {
  const f = Q('qui-2-paulista-05', 'Eletrólise aquosa de CuCl₂ com eletrodos inertes', 'Meta: reduzir 0,30 mol de Cu²⁺ · F = 9,65 × 10⁴ C·mol⁻¹', 'Célula eletrolítica com solução de CuCl2, dois eletrodos inertes ligados a um gerador e dados do problema.');
  D.becker(f, 90, 150, 300, 150, '#b7e0d6', { nivel: .7 }); eletrodo(f, 150, 96, 150, '#546e7a'); eletrodo(f, 320, 96, 150, '#546e7a');
  f.text(240, 232, 'CuCl₂(aq)', { size: 16, w: 700, anchor: 'middle', fill: '#1b5e50' }); f.text(157, 322, 'eletrodo inerte', { size: 12, anchor: 'middle' }); f.text(327, 322, 'eletrodo inerte', { size: 12, anchor: 'middle' });
  fio(f, [[157, 96], [157, 70], [190, 70]]); fio(f, [[327, 96], [327, 70], [290, 70]]);
  f.rect(190, 52, 100, 36, { fill: '#fff', stroke: '#37474f', sw: 3, r: 6 }); f.text(240, 76, 'fonte CC', { size: 14, w: 700, anchor: 'middle' });
  f.card(440, 80, 306, 230, 'Dados do problema');
  [['Quantidade de Cu²⁺', '0,30 mol'], ['Cátodo (modelo)', 'Cu²⁺ + 2e⁻ → Cu'], ['Ânodo (modelo)', 'Cl⁻ descarregado'], ['Constante de Faraday', '9,65 × 10⁴ C·mol⁻¹ de e⁻']].forEach((d, i) => { f.text(456, 122 + i * 44, d[0], { size: 12, fill: f.t.mute }); f.text(456, 140 + i * 44, d[1], { size: 15, w: 700 }); });
  return f; },
'qui-2-paulista-07'() {
  const f = Q('qui-2-paulista-07', 'Corrosão de pregos de aço em sete dias', 'Mesma massa inicial · valores ilustrativos', 'Quatro tubos com pregos em condições diferentes e gráfico da perda de massa em cada um.');
  [['Ar seco', '#f5f5f5', .0, '0,02 g'], ['Água fervida sem ar, sob óleo', '#d7ecf7', 1, '0,01 g'], ['Água de torneira + ar', '#bfe0f2', 1, '0,46 g'], ['Água salgada + ar', '#a9d4ea', 1, '0,82 g']].forEach((d, i) => { const x = 30 + i * 62; D.tubo(f, x, 82, 38, 128, d[1], d[2] ? .6 : .02); if (i === 1) f.rect(x + 2, 82 + 128 * .4 - 7, 34, 7, { fill: '#e0b64a', op: .9 });
    f.rect(x + 16, 98, 6, 90, { fill: i > 1 ? '#a0522d' : '#90a4ae', r: 2 }); });
  f.para(30, 236, 'Ar seco · Água fervida sob óleo · Água de torneira + ar · Água salgada + ar', 38, { size: 11, fill: f.t.mute });
  f.card(290, 70, 456, 250, 'Perda de massa após 7 dias (g)');
  f.hbars(298, 100, 440, [{ label: 'Ar seco', v: .02, c: COR.c }, { label: 'Água fervida s/ ar', v: .01, c: COR.c }, { label: 'Água de torneira + ar', v: .46, c: COR.l }, { label: 'Água salgada + ar', v: .82, c: COR.r }], { rowH: 52, labelW: 150, max: 0.9 });
  return f; },
'qui-2-paulista-08'() {
  const f = Q('qui-2-paulista-08', 'Bateria com resistência interna', 'E em circuito aberto = 1,50 V · sob carga: I = 0,50 A e V = 1,30 V', 'Circuito com bateria de força eletromotriz 1,50 V e resistência interna r, ligada a uma carga, com amperímetro e voltímetro.');
  f.rect(60, 110, 330, 180, { fill: 'none', stroke: '#37474f', sw: 3, r: 14 });
  f.rect(80, 100, 170, 40, { fill: '#fff', stroke: '#2c5f8a', sw: 3, r: 8 }); f.text(190, 126, 'bateria', { size: 14, w: 700, anchor: 'middle' });
  f.text(165, 92, 'E = 1,50 V', { size: 14, w: 700, anchor: 'middle', fill: COR.a }); f.rect(110, 100, 36, 40, { fill: '#fdecc8', stroke: '#b9770e', sw: 2, r: 3 }); f.text(128, 124, 'r', { size: 15, w: 700, anchor: 'middle', fill: '#b9770e' });
  
  f.rect(200, 275, 120, 30, { fill: '#fff', stroke: '#37474f', sw: 3, r: 6 }); f.text(260, 296, 'carga', { size: 14, w: 700, anchor: 'middle' });
  volt(f, 60, 200, 'A'); f.text(95, 204, 'I = 0,50 A', { size: 13, w: 700 });
  volt(f, 390, 200, 'V'); f.text(285, 204, 'V = 1,30 V', { size: 13, w: 700 }); f.text(285, 224, '(nos terminais)', { size: 11.5, fill: f.t.mute });
  f.card(440, 80, 306, 240, 'Modelo adotado'); f.text(456, 128, 'V = E − r·I', { size: 22, w: 700, fill: COR.a }); f.para(456, 164, 'r: resistência interna, considerada constante.', 36, { size: 13 });
  f.para(456, 214, 'Em circuito aberto (I = 0), a tensão medida é E = 1,50 V.', 36, { size: 13, fill: f.t.mute });
  return f; },
'qui-2-paulista-10'() {
  const f = Q('qui-2-paulista-10', 'Duas baterias sob a mesma carga', 'I = 0,60 A · Vterminal = E − r·I · t ideal = capacidade / I', 'Cartões das baterias A e B com força eletromotriz, capacidade e resistência interna, ligadas a um circuito com corrente de 0,60 A.');
  [['Bateria A', '3,70 V', '2,40 Ah', '0,20 Ω', COR.a], ['Bateria B', '3,60 V', '1,80 Ah', '0,05 Ω', COR.v]].forEach((d, i) => { const x = 14 + i * 372; f.card(x, 70, 360, 190, d[0]);
    D.bateria(f, x + 24, 102, 120, 52, { c: d[4] });
    [['E nominal', d[1]], ['Capacidade', d[2]], ['r interna', d[3]]].forEach((r, k) => { f.text(x + 170, 118 + k * 34, r[0], { size: 12, fill: f.t.mute }); f.text(x + 262, 118 + k * 34, r[1], { size: 17, w: 700 }); });
  });
  f.rect(190, 280, 380, 40, { fill: '#fff', stroke: '#37474f', sw: 3, r: 20 }); f.text(380, 306, 'mesma carga: I = 0,60 A', { size: 16, w: 700, anchor: 'middle' });
  return f; },
'qui-2-paulista-11'() {
  const f = Q('qui-2-paulista-11', 'NaCl fundido × NaCl em solução aquosa', 'Eletrólise com eletrodos inertes · compare os produtos catódicos', 'Dois recipientes com eletrodos inertes ligados a geradores: um com NaCl fundido, outro com solução aquosa de NaCl.');
  [['NaCl fundido', '#f3c89a', 'NaCl(ℓ) · alta temperatura', 14], ['NaCl(aq) em solução', '#cfe3f3', 'NaCl(aq) · a água também participa', 386]].forEach((d, i) => { const x = d[3];
    f.card(x, 70, 360, 252); D.becker(f, x + 70, 150, 220, 130, d[1], { nivel: .7 }); eletrodo(f, x + 115, 112, 130, '#546e7a'); eletrodo(f, x + 231, 112, 130, '#546e7a');
    fio(f, [[x + 122, 112], [x + 122, 100], [x + 190, 100]], { sw: 2.5 }); fio(f, [[x + 238, 112], [x + 238, 100], [x + 230, 100]], { sw: 2.5 }); f.rect(x + 190, 86, 40, 28, { fill: '#fff', stroke: '#37474f', sw: 2.5, r: 5 });
    f.text(x + 210, 106, 'CC', { size: 12, w: 700, anchor: 'middle' }); f.text(x + 14, 98, d[0], { size: 14, w: 700 }); f.text(x + 180, 304, d[2], { size: 12, anchor: 'middle', fill: f.t.mute });
    if (i === 1) { D.gota(f, x + 300, 200, 8, '#5aa9e6'); D.gota(f, x + 320, 230, 7, '#5aa9e6'); }
    else { for (let k = 0; k < 3; k++) f.path(`M${x + 90 + k * 20} 150 q6 -9 0 -18`, { stroke: '#e07b39', sw: 2 }); } });
  return f; },
'qui-2-paulista-13'() {
  const f = Q('qui-2-paulista-13', 'Pilha Zn/Cu: dados para a montagem', 'Condições padrão · ponte salina e circuito externo', 'Esquema vazio de pilha com eletrodos de zinco e cobre, ponte salina e voltímetro, com os potenciais-padrão de redução.');
  D.becker(f, 40, 160, 180, 120, '#cfe3f3', { nivel: .6 }); D.becker(f, 300, 160, 180, 120, '#a9d6e5', { nivel: .6 });
  eletrodo(f, 115, 110, 150, '#b0bec5'); eletrodo(f, 375, 110, 150, '#c77d4f');
  f.text(130, 306, 'Zn | Zn²⁺', { size: 13, w: 700, anchor: 'middle' }); f.text(390, 306, 'Cu | Cu²⁺', { size: 13, w: 700, anchor: 'middle' });
  f.path('M190 150 V176 H330 V150', { stroke: '#8d6e63', sw: 12 }); f.path('M190 150 V176 H330 V150', { stroke: '#efe3d0', sw: 6 });
  fio(f, [[122, 110], [122, 88], [225, 88]]); fio(f, [[295, 88], [382, 88], [382, 110]]); volt(f, 260, 88, 'V');
  f.card(510, 74, 236, 246, 'Potenciais-padrão (V)'); f.text(526, 130, 'Zn²⁺ + 2e⁻ → Zn', { size: 14, w: 700 }); f.text(526, 152, 'E°red = −0,76 V', { size: 16, fill: COR.a, w: 700 }); f.text(526, 206, 'Cu²⁺ + 2e⁻ → Cu', { size: 14, w: 700 }); f.text(526, 228, 'E°red = +0,34 V', { size: 16, fill: COR.l, w: 700 });
  f.text(526, 282, 'Operação espontânea', { size: 12.5, fill: f.t.mute, it: 1 }); return f; },
'qui-2-paulista-14'() {
  const f = Q('qui-2-paulista-14', 'Galvanoplastia didática com cobre', 'Solução aquosa de CuSO₄ · I = 2,50 A durante 20,0 min', 'Cuba com solução de sulfato de cobre, peça a revestir e placa de cobre ligadas a uma fonte de corrente contínua.');
  D.becker(f, 90, 150, 300, 150, '#a9d6e5', { nivel: .72 }); f.text(240, 252, 'CuSO₄(aq)', { size: 16, w: 700, anchor: 'middle', fill: '#1d4e6b' });
  f.rect(138, 100, 14, 120, { fill: '#c77d4f', stroke: '#37474f', sw: 1.5 }); f.text(145, 322, 'placa de cobre', { size: 12.5, anchor: 'middle' });
  f.rect(318, 96, 12, 10, { fill: '#37474f' }); f.path('M324 106 L324 170 q-22 8 -22 34 q22 12 44 0 q0 -26 -22 -34', { fill: '#cfd8dc', stroke: '#37474f', sw: 2.5 }); f.text(324, 322, 'peça a revestir', { size: 12.5, anchor: 'middle' });
  fio(f, [[145, 100], [145, 70], [190, 70]]); fio(f, [[324, 96], [324, 70], [290, 70]]); f.rect(190, 52, 100, 36, { fill: '#fff', stroke: '#37474f', sw: 3, r: 6 }); f.text(240, 76, 'fonte CC', { size: 14, w: 700, anchor: 'middle' });
  f.card(440, 80, 306, 230, 'Dados'); [['Corrente', '2,50 A'], ['Tempo', '20,0 min'], ['M(Cu)', '63,5 g·mol⁻¹'], ['F', '9,65 × 10⁴ C·mol⁻¹ de e⁻']].forEach((d, i) => { f.text(456, 122 + i * 44, d[0], { size: 12, fill: f.t.mute }); f.text(456, 140 + i * 44, d[1], { size: 16, w: 700 }); });
  return f; }
};
