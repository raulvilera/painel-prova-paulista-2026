const { Fig, D, COR, fmt } = require('../lib.js');
const { fio, volt, eletrodo, ponte, pilha } = require('./_util.js');
const Q = (id, t, s, d) => new Fig(id, 'qui', t, s, d);
module.exports = {
'qui-3-provao-01'() {
  const f = Q('qui-3-provao-01', 'Mistura de limalha, areia, sal e água', 'A 25 °C · recuperar cada componente sem transformação química', 'Béquer com a mistura e cartões com a propriedade de cada componente: ferro atraído por ímã, areia insolúvel, sal dissolvido e água mais volátil.');
  D.becker(f, 40, 110, 150, 150, '#cfe3f3', { nivel: .6 }); for (let i = 0; i < 6; i++) f.circle(70 + i * 17, 236 - (i % 2) * 6, 4, { fill: '#c9b27c' }); for (let i = 0; i < 4; i++) f.rect(66 + i * 22, 246, 8, 3, { fill: '#546e7a', r: 1 }); f.text(115, 290, 'ferro + areia + NaCl + água', { size: 12.5, anchor: 'middle', w: 700 });
  [['Ferro', 'atraído por ímã', '#546e7a'], ['Areia', 'insolúvel em água', '#c9b27c'], ['NaCl', 'permanece dissolvido', COR.a], ['Água', 'ebulição antes do NaCl', COR.t]].forEach((d, i) => { const y = 78 + i * 62; f.card(250, y, 496, 54); f.circle(278, y + 27, 12, { fill: d[2] }); f.text(304, y + 24, d[0], { size: 15, w: 700 }); f.text(304, y + 44, d[1], { size: 13, fill: f.t.mute }); }); return f; },
'qui-3-provao-02'() {
  const f = Q('qui-3-provao-02', 'Redução do óxido de ferro em escala didática', 'Fe₂O₃(s) + 3 CO(g) → 2 Fe(s) + 3 CO₂(g)', 'Lote de 200 g com 160 g de Fe2O3 e 40 g de inerte, 84 g de CO e rendimento de 80%.');
  f.card(14, 70, 360, 250, 'Lote de minério: 200 g'); f.rect(34, 104, 320, 44, { fill: '#fff', stroke: f.t.line, sw: 2, r: 6 }); f.rect(34, 104, 256, 44, { fill: '#c77d4f', r: 6 }); f.rect(290, 104, 64, 44, { fill: '#b0bec5', r: 6 }); f.text(162, 132, 'Fe₂O₃: 160 g (1,00 mol)', { size: 13, w: 700, anchor: 'middle', fill: '#fff' }); f.text(322, 132, '40 g inerte', { size: 11, w: 700, anchor: 'middle' });
  f.rect(34, 176, 320, 44, { fill: '#fff', stroke: f.t.line, sw: 2, r: 6 }); f.rect(34, 176, 320, 44, { fill: '#b7e0d6', r: 6 }); f.text(194, 204, 'CO: 84 g (3,00 mol)', { size: 13, w: 700, anchor: 'middle' });
  f.text(34, 262, 'M: Fe₂O₃ = 160 · CO = 28 · Fe = 56 g/mol', { size: 12.5, fill: f.t.mute }); f.text(34, 288, 'Rendimento: 80% do Fe teórico', { size: 15, w: 700, fill: COR.a });
  f.card(386, 70, 360, 250, 'Alto-forno (esquema)'); f.path('M520 100 L610 100 L630 190 L610 300 L520 300 L500 190 Z', { fill: '#e8e0d6', stroke: '#8d6e63', sw: 4 }); f.path('M530 270 L600 270', { stroke: COR.r, sw: 6 }); f.text(565, 242, 'Fe₂O₃ + CO', { size: 12, anchor: 'middle', w: 700 }); f.arrow(440, 250, 500, 250, { stroke: COR.v }); f.text(440, 238, 'CO', { size: 12, w: 700, anchor: 'middle' }); f.arrow(630, 160, 700, 130, { stroke: COR.k }); f.text(700, 120, 'CO₂', { size: 12, w: 700, anchor: 'middle' }); f.arrow(570, 300, 570, 316, { stroke: COR.l });
  return f; },
'qui-3-provao-04'() {
  const f = Q('qui-3-provao-04', 'Sequência de decaimento do urânio-238', 'Uma emissão alfa seguida de uma emissão beta menos (β⁻)', 'Esquema com núcleo de urânio-238, seta de emissão alfa, núcleo intermediário desconhecido, seta de emissão beta e núcleo final desconhecido.');
  const nu = (x, a, z, nome, q) => { f.circle(x, 190, 52, { fill: q ? '#fff' : '#d6e6f4', stroke: COR.a, sw: 4 }); f.text(x - 36, 168, a || '?', { size: 15, w: 700, anchor: 'middle' }); f.text(x - 36, 192, z || '?', { size: 15, w: 700, anchor: 'middle' }); f.text(x + 6, 202, nome, { size: 28, w: 700, anchor: 'middle', fill: q ? f.t.mute : f.t.ink }); };
  nu(110, '238', '92', 'U'); nu(380, '', '', '?', 1); nu(650, '', '', '?', 1);
  f.arrow(172, 190, 318, 190, { stroke: COR.l }); f.text(245, 172, 'emissão α', { size: 13, w: 700, anchor: 'middle', fill: COR.l }); f.text(245, 214, 'A − 4 · Z − 2', { size: 12, anchor: 'middle', fill: f.t.mute });
  f.arrow(442, 190, 588, 190, { stroke: COR.p }); f.text(515, 172, 'emissão β⁻', { size: 13, w: 700, anchor: 'middle', fill: COR.p }); f.text(515, 214, 'A igual · Z + 1', { size: 12, anchor: 'middle', fill: f.t.mute });
  f.text(380, 300, 'Número de massa (A) sobre o número atômico (Z)', { size: 12, anchor: 'middle', fill: f.t.mute, it: 1 }); return f; },
'qui-3-provao-05'() {
  const f = Q('qui-3-provao-05', 'Três amostras puras', 'Evidências de cada amostra', 'Três cartões: A sólido quebradiço de alto ponto de fusão que conduz só fundido, B metal maleável condutor, C líquido molecular com grupo OH miscível em água e não condutor.');
  [['A', 'Sólido quebradiço', 'alto ponto de fusão', 'conduz somente fundida', COR.a], ['B', 'Sólido maleável', 'conduz no sólido e no líquido', '', COR.l], ['C', 'Líquido molecular', 'miscível em água · grupo O–H', 'não condutora', COR.v]].forEach((d, i) => { const x = 14 + i * 247; f.card(x, 70, 235, 250); f.circle(x + 30, 104, 16, { fill: d[4] }); f.text(x + 30, 110, d[0], { size: 17, w: 700, anchor: 'middle', fill: '#fff' });
    if (i === 0) { for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) D.atomo(f, x + 60 + c * 36, 140 + r * 34, 12, (r + c) % 2 ? '#e07b39' : COR.a); }
    if (i === 1) { for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { f.circle(x + 60 + c * 36, 140 + r * 34, 12, { fill: '#c5ced3', stroke: '#78909c', sw: 2 }); } for (let k = 0; k < 6; k++) f.circle(x + 78 + k * 28, 123 + (k % 3) * 34, 3.5, { fill: COR.y }); }
    if (i === 2) { for (let c = 0; c < 3; c++) { f.circle(x + 70 + c * 70, 152, 11, { fill: COR.r }); f.circle(x + 70 + c * 70 + 20, 136, 7, { fill: '#fff', stroke: '#78909c', sw: 2 }); f.circle(x + 70 + c * 70 - 20, 136, 7, { fill: '#fff', stroke: '#78909c', sw: 2 }); } }
    f.text(x + 117, 242, d[1], { size: 14, w: 700, anchor: 'middle' }); f.para(x + 117, 262, d[2], 30, { size: 12, anchor: 'middle', fill: f.t.mute }); f.text(x + 117, 296, d[3], { size: 12.5, anchor: 'middle', w: 700, fill: COR.r }); });
  return f; },
'qui-3-provao-07'() {
  const f = Q('qui-3-provao-07', 'Velocidade inicial de A → produtos', 'Temperatura constante · mesmo volume · valores ilustrativos', 'Barras da velocidade inicial em quatro ensaios com diferentes concentrações de A, com e sem catalisador.');
  f.card(14, 70, 732, 250, 'v₀ (10⁻³ mol L⁻¹ s⁻¹)'); f.vbars(60, 112, 650, 140, [['0,10', 2, 0], ['0,20', 8, 0], ['0,30', 18, 0], ['0,20', 16, 1]].map((d, i) => ({ label: 'Ensaio ' + (i + 1), bars: [{ v: d[1], c: d[2] ? COR.v : COR.a, txt: fmt(d[1].toFixed(1)) }] })), { max: 20, ticks: 4, size: 11.5 });
  [['0,10', 0], ['0,20', 0], ['0,30', 0], ['0,20', 1]].forEach((d, i) => f.text(60 + 650 / 4 * (i + .5), 296, '[A] ' + d[0] + ' mol/L · ' + (d[1] ? 'com catalisador' : 'sem catalisador'), { size: 11.5, anchor: 'middle', fill: f.t.mute }));
  return f; },
'qui-3-provao-08'() {
  const f = Q('qui-3-provao-08', 'N₂O₄(g) ⇌ 2 NO₂(g) a 298 K', 'Equilíbrio inicial e perturbação: + 0,20 mol/L de N₂O₄ (T constante)', 'Concentrações no equilíbrio inicial de N2O4 e NO2 e seta indicando a adição de N2O4 ao recipiente fechado.');
  f.card(14, 70, 440, 250, 'Equilíbrio inicial (mol/L)'); f.vbars(60, 112, 370, 140, [{ label: '[N₂O₄]', bars: [{ v: .5, c: COR.p, txt: '0,50' }] }, { label: '[NO₂]', bars: [{ v: .1, c: COR.l, txt: '0,10' }] }], { max: .6, ticks: 3 });
  f.card(466, 70, 280, 250, 'Perturbação'); D.becker(f, 540, 140, 130, 120, '#e9f4fb', { nivel: .9 }); f.arrow(605, 92, 605, 138, { stroke: COR.p }); f.text(605, 108, '+ N₂O₄', { size: 14, w: 700, anchor: 'middle', fill: COR.p });
  f.text(606, 304, 'Kc (298 K) = 0,020', { size: 14, w: 700, anchor: 'middle' }); return f; },
'qui-3-provao-10'() {
  const f = Q('qui-3-provao-10', 'Pilha Mg/Cu em condições padrão', 'Circuito externo e ponte salina', 'Pilha com eletrodos de magnésio e de cobre, ponte salina e voltímetro, e potenciais-padrão de redução.');
  pilha(f, { nome: 'Mg', cor: '#cfd8dc', liq: '#dcecdc', ion: 'Mg²⁺' }, { nome: 'Cu', cor: '#c77d4f', liq: '#a9d6e5', ion: 'Cu²⁺' });
  f.card(510, 74, 236, 200, 'E° de redução (V)'); f.text(526, 126, 'Cu²⁺ + 2e⁻ → Cu', { size: 14, w: 700 }); f.text(526, 148, '+0,34 V', { size: 18, w: 700, fill: COR.l }); f.text(526, 196, 'Mg²⁺ + 2e⁻ → Mg', { size: 14, w: 700 }); f.text(526, 218, '−2,37 V', { size: 18, w: 700, fill: COR.a }); return f; },
'qui-3-provao-11'() {
  const f = Q('qui-3-provao-11', 'Eletrólise de Cu²⁺(aq)', 'Semirreação catódica: Cu²⁺ + 2e⁻ → Cu(s) · rendimento de corrente de 100%', 'Célula eletrolítica com solução de íons cobre ligada a uma fonte, com corrente de 1,93 A durante 1000 s.');
  D.becker(f, 90, 150, 300, 150, '#a9d6e5', { nivel: .72 }); f.text(240, 252, 'Cu²⁺(aq)', { size: 16, w: 700, anchor: 'middle', fill: '#1d4e6b' });
  eletrodo(f, 150, 96, 150, '#9aa5ab'); eletrodo(f, 320, 96, 150, '#9aa5ab'); fio(f, [[157, 96], [157, 70], [190, 70]]); fio(f, [[327, 96], [327, 70], [290, 70]]); f.rect(190, 52, 100, 36, { fill: '#fff', stroke: '#37474f', sw: 3, r: 6 }); f.text(240, 76, 'fonte CC', { size: 14, w: 700, anchor: 'middle' });
  f.card(440, 80, 306, 230, 'Dados'); [['Corrente', '1,93 A'], ['Tempo', '1.000 s'], ['M(Cu)', '63,5 g/mol'], ['F', '9,65 × 10⁴ C/mol de e⁻']].forEach((d, i) => { f.text(456, 122 + i * 44, d[0], { size: 12, fill: f.t.mute }); f.text(456, 140 + i * 44, d[1], { size: 16, w: 700 }); }); return f; },
'qui-3-provao-13'() {
  const f = Q('qui-3-provao-13', 'Córrego monitorado após chuva intensa', 'Ponto de captação × 2 h após a chuva · valores ilustrativos', 'Barras de pH, nitrato e turbidez no ponto de captação e duas horas após a chuva.');
  [['pH', 6.8, 5.0, 8, ''], ['Nitrato (mg/L)', 2, 48, 50, ''], ['Turbidez (NTU)', 4, 42, 50, '']].forEach((d, i) => { const x = 14 + i * 247; f.card(x, 70, 235, 250, d[0]); f.vbars(x + 34, 112, 190, 150, [{ label: 'Captação', bars: [{ v: d[1], c: COR.a, txt: fmt(d[1]) }] }, { label: '2 h após', bars: [{ v: d[2], c: COR.r, txt: fmt(d[2]) }] }], { max: d[3], ticks: 4, size: 11.5 }); });
  f.text(380, 332, 'Não se deve inferir a origem única dos poluentes apenas pela tabela.', { size: 11.5, anchor: 'middle', fill: f.t.mute, it: 1 }); return f; },
'qui-3-provao-14'() {
  const f = Q('qui-3-provao-14', 'Dois materiais para embalagens', 'Propriedades são condições do estudo, não generalização', 'Cartões com os monômeros e observações de P (de CH2=CHCl, persiste) e Q (de ácido lático, ligações éster, libera água, hidrólise rápida em compostagem).');
  [['Material P', 'CH₂=CHCl → [–CH₂–CHCl–]ₙ', ['sem molécula pequena detectada', 'persiste no ambiente'], COR.a], ['Material Q', 'HO–CH(CH₃)–COOH · ligações éster', ['libera H₂O a cada etapa', 'hidrólise mais rápida em compostagem industrial'], COR.v]].forEach((d, i) => { const x = 14 + i * 372; f.card(x, 70, 360, 250); f.rect(x + 14, 90, 332, 40, { fill: d[3], r: 8 }); f.text(x + 30, 116, d[0], { size: 17, w: 700, fill: '#fff' });
    f.text(x + 180, 168, d[1], { size: i ? 13.5 : 15, w: 700, anchor: 'middle' });
    let cx = x + 50; for (let k = 0; k < 5; k++) { f.circle(cx, 214, 11, { fill: '#fff', stroke: d[3], sw: 3 }); if (k < 4) f.line(cx + 11, 214, cx + 43, 214, { stroke: d[3], sw: 3 }); cx += 54; }
    d[2].forEach((t, k) => f.text(x + 24, 262 + k * 24, '• ' + t, { size: 13 })); });
  return f; }
};
