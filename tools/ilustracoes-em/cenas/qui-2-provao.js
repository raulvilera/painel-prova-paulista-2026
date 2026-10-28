const { Fig, D, COR, fmt } = require('../lib.js');
const { fio, volt, eletrodo, ponte, pilha } = require('./_util.js');
const Q = (id, t, s, d) => new Fig(id, 'qui', t, s, d);
module.exports = {
'qui-2-provao-01'() {
  const f = Q('qui-2-provao-01', 'Rapidez inicial de A + B → produtos', 'Mesma temperatura, volume e procedimento · valores ilustrativos', 'Três ensaios com concentrações iniciais de A e B e barras da rapidez inicial medida.');
  const E = [['1', '0,10', '0,10', 2.0], ['2', '0,20', '0,10', 4.0], ['3', '0,10', '0,20', 8.0]];
  E.forEach((d, i) => { const x = 14 + i * 150; f.card(x, 70, 140, 130, 'Ensaio ' + d[0]); D.becker(f, x + 40, 104, 60, 52, '#c9e3f4', { nivel: .6 }); f.text(x + 70, 178, '[A] ' + d[1] + ' · [B] ' + d[2], { size: 11, anchor: 'middle' }); });
  f.text(14, 224, 'Concentrações em mol L⁻¹', { size: 12, fill: f.t.mute });
  f.card(472, 70, 274, 250, 'Rapidez inicial (10⁻³ mol L⁻¹ s⁻¹)'); f.vbars(506, 112, 224, 150, E.map(d => ({ label: 'Ensaio ' + d[0], bars: [{ v: d[3], c: COR.l, txt: fmt(d[3].toFixed(1)) }] })), { max: 10, ticks: 5, size: 11 });
  f.text(14, 262, 'Modelo: r = k[A]ᵐ[B]ⁿ', { size: 16, w: 700, fill: COR.a }); f.text(14, 290, 'Previsão pedida para [A] = 0,20 e [B] = 0,30 mol L⁻¹', { size: 12.5, fill: f.t.mute });
  return f; },
'qui-2-provao-02'() {
  const f = Q('qui-2-provao-02', 'N₂O₄(g) ⇌ 2 NO₂(g) em êmbolo móvel', 'Temperatura constante · compressão instantânea do volume à metade', 'Dois cilindros com êmbolo: equilíbrio original com concentrações 0,20 e 0,40 mol por litro, e o mesmo sistema com volume reduzido à metade.');
  const cil = (x, h, tit, d1, d2) => { f.rect(x, 130 + (170 - h), 200, h, { fill: '#e9f4fb', stroke: '#37474f', sw: 3, r: 4 }); f.rect(x - 10, 118 + (170 - h), 220, 12, { fill: '#78909c', r: 3 }); f.line(x + 100, 70 + (170 - h), x + 100, 118 + (170 - h), { stroke: '#78909c', sw: 6 });
    for (let i = 0; i < 6; i++) D.atomo(f, x + 30 + (i % 3) * 60, 160 + (170 - h) + Math.floor(i / 3) * 34, 9, i < d1 ? '#8e5bb5' : '#e07b39'); f.text(x + 100, 322, tit, { size: 12.5, w: 700, anchor: 'middle' }); };
  cil(60, 170, 'Equilíbrio original', 2, 4); cil(470, 85, 'Logo após reduzir à metade', 2, 4);
  f.arrow(290, 215, 440, 215, { stroke: COR.l }); f.text(365, 205, 'V → V/2', { size: 13, w: 700, anchor: 'middle', fill: COR.l });
  f.text(365, 255, '[N₂O₄] = 0,20 mol L⁻¹', { size: 12.5, w: 700, fill: COR.p, anchor: 'middle' }); f.text(365, 275, '[NO₂] = 0,40 mol L⁻¹', { size: 12.5, w: 700, fill: COR.l, anchor: 'middle' }); f.text(365, 295, '(no equilíbrio original)', { size: 11, fill: f.t.mute, anchor: 'middle' });
  return f; },
'qui-2-provao-04'() {
  const f = Q('qui-2-provao-04', 'Combustão do carbono em duas etapas', 'Valores ilustrativos de ΔH (kJ mol⁻¹)', 'Diagrama de entalpia: C(s) + O2(g), depois CO(g) + 1/2 O2(g) e por fim CO2(g), com as variações de cada etapa e a reação-alvo.');
  f.line(120, 96, 420, 96, { sw: 4, stroke: COR.k }); f.text(430, 101, 'C(s) + O₂(g)', { size: 15, w: 700 });
  f.line(120, 186, 420, 186, { sw: 4, stroke: COR.k }); f.text(430, 191, 'CO(g) + ½ O₂(g)', { size: 15, w: 700 });
  f.line(120, 282, 420, 282, { sw: 4, stroke: COR.k }); f.text(430, 287, 'CO₂(g)', { size: 15, w: 700 });
  f.arrow(200, 98, 200, 184, { stroke: COR.a }); f.text(214, 146, 'Etapa 1: ΔH = −110,5', { size: 13, w: 700, fill: COR.a });
  f.arrow(200, 188, 200, 280, { stroke: COR.l }); f.text(214, 238, 'Etapa 2: ΔH = −283,0', { size: 13, w: 700, fill: COR.l });
  f.path('M105 98 Q70 190 105 280', { stroke: COR.p, sw: 3, dash: '6 5' }); f.arrow(105, 270, 105, 282, { stroke: COR.p }); f.text(24, 196, 'ΔH = ?', { size: 15, w: 700, fill: COR.p });
  f.text(40, 322, 'Alvo: C(s) + O₂(g) → CO₂(g) · níveis fora de escala', { size: 12, fill: f.t.mute, it: 1 });
  return f; },
'qui-2-provao-05'() {
  const f = Q('qui-2-provao-05', 'Pilha galvânica Zn/Cu em condições padrão', 'Eletrodos ligados externamente · ponte salina', 'Pilha com eletrodo de zinco e de cobre, ponte salina e voltímetro, e tabela de potenciais-padrão de redução.');
  pilha(f, { nome: 'Zn', cor: '#b0bec5', liq: '#cfe3f3', ion: 'Zn²⁺' }, { nome: 'Cu', cor: '#c77d4f', liq: '#a9d6e5', ion: 'Cu²⁺' });
  f.card(510, 74, 236, 200, 'E° de redução (V)'); f.text(526, 126, 'Cu²⁺ + 2e⁻ → Cu', { size: 14, w: 700 }); f.text(526, 148, '+0,34 V', { size: 18, w: 700, fill: COR.l }); f.text(526, 196, 'Zn²⁺ + 2e⁻ → Zn', { size: 14, w: 700 }); f.text(526, 218, '−0,76 V', { size: 18, w: 700, fill: COR.a });
  return f; },
'qui-2-provao-07'() {
  const f = Q('qui-2-provao-07', 'Decaimento radioativo de X', 'Meia-vida de 8 dias · atividade inicial de 640 Bq', 'Curva exponencial decrescente da atividade ao longo do tempo, com marcações a cada 8 dias e atividade inicial de 640 becquerels.');
  f.card(14, 70, 520, 250, 'Atividade da amostra × tempo'); f.line(70, 270, 500, 270, { stroke: f.t.mute, sw: 2 }); f.line(70, 110, 70, 270, { stroke: f.t.mute, sw: 2 });
  let d = ''; for (let t = 0; t <= 32; t += 1) { const x = 70 + t * 13.4, y = 270 - 150 * Math.pow(.5, t / 8); d += (t ? ' L' : 'M') + x + ' ' + y; } f.path(d, { stroke: COR.l, sw: 3.5 });
  [0, 8, 16, 24, 32].forEach(t => { f.line(70 + t * 13.4, 270, 70 + t * 13.4, 276, { stroke: f.t.mute, sw: 2 }); f.text(70 + t * 13.4, 292, t, { size: 12, anchor: 'middle' }); f.line(70 + t * 13.4, 120, 70 + t * 13.4, 270, { stroke: '#e3e9f0', sw: 1, dash: '3 4' }); });
  f.text(285, 312, 'tempo (dias)', { size: 12, anchor: 'middle', fill: f.t.mute }); f.circle(70, 120, 6, { fill: COR.l, stroke: '#fff', sw: 2 }); f.text(82, 112, '640 Bq', { size: 14, w: 700, fill: COR.r });
  f.card(546, 70, 200, 250, 'Núcleos'); for (let i = 0; i < 16; i++) D.atomo(f, 576 + (i % 4) * 40, 118 + Math.floor(i / 4) * 40, 12, i < 12 ? COR.l : '#cfd8dc');
  f.para(560, 292, 'esquema: núcleos que se desintegram com o tempo', 28, { size: 11, fill: f.t.mute });
  return f; },
'qui-2-provao-08'() {
  const f = Q('qui-2-provao-08', 'Fórmula estrutural de um aromatizante', 'CH₃–C(=O)–O–CH₂–CH₃', 'Fórmula estrutural condensada desenhada com ligações: carbono carbonílico com oxigênio duplo, oxigênio ligado a um grupo etila.');
  f.card(14, 70, 732, 250, 'Conectividade dos átomos');
  const t = (x, y, s, c = f.t.ink) => f.text(x, y, s, { size: 24, w: 700, anchor: 'middle', fill: c });
  t(100, 230, 'CH₃'); f.line(135, 224, 180, 224, { sw: 3 }); t(200, 230, 'C'); f.line(200, 206, 200, 170, { sw: 3 }); f.line(208, 206, 208, 170, { sw: 3 }); t(204, 158, 'O', COR.r);
  f.line(222, 224, 268, 224, { sw: 3 }); t(288, 230, 'O', COR.r); f.line(308, 224, 352, 224, { sw: 3 }); t(392, 230, 'CH₂'); f.line(428, 224, 470, 224, { sw: 3 }); t(510, 230, 'CH₃');
  f.text(190, 258, 'carbonila', { size: 12, anchor: 'middle', fill: f.t.mute }); f.text(340, 282, 'oxigênio entre dois carbonos', { size: 12, anchor: 'middle', fill: f.t.mute });
  f.rect(574, 110, 160, 150, { fill: '#f6f9fb', stroke: f.t.line, sw: 2, r: 10 }); f.para(586, 134, 'Identificar o composto exige ler como os átomos se ligam, não só a presença de oxigênio.', 21, { size: 12.5, lh: 17 });
  return f; },
'qui-2-provao-10'() {
  const f = Q('qui-2-provao-10', 'Monômero e polímero', 'M: CH₂=CHCl · P: [–CH₂–CHCl–]ₙ · sem eliminação de molécula pequena', 'Esquema de várias moléculas de monômero com dupla ligação se unindo em uma cadeia polimérica longa.');
  [0, 1, 2].forEach(i => { const x = 60, y = 110 + i * 70; f.line(x, y, x + 44, y - 10, { sw: 3 }); f.line(x + 44, y - 10, x + 44 + 8, y - 10, { sw: 0.1 }); f.line(x, y + 4, x + 44, y - 6, { sw: 3 }); f.text(x - 6, y + 28, 'CH₂=CHCl', { size: 13, w: 700 }); });
  f.text(30, 92, 'monômero (M)', { size: 13, w: 700, fill: f.t.mute }); f.arrow(210, 200, 320, 200, { stroke: COR.l }); f.text(265, 186, 'polimerização', { size: 12.5, w: 700, anchor: 'middle', fill: COR.l }); f.text(265, 222, 'por adição', { size: 12, anchor: 'middle', fill: f.t.mute });
  f.text(330, 92, 'polímero (P)', { size: 13, w: 700, fill: f.t.mute }); let x = 340; for (let i = 0; i < 6; i++) { f.circle(x, 200, 15, { fill: '#cfe3f3', stroke: COR.a, sw: 2.5 }); f.text(x, 205, 'C', { size: 13, w: 700, anchor: 'middle' }); if (i < 5) f.line(x + 15, 200, x + 49, 200, { stroke: COR.a, sw: 3 }); if (i % 2) { f.line(x, 215, x, 240, { stroke: COR.v, sw: 2.5 }); f.circle(x, 248, 10, { fill: '#d6efe1', stroke: COR.v, sw: 2 }); f.text(x, 252, 'Cl', { size: 10, anchor: 'middle', w: 700 }); } x += 64; }
  f.text(540, 304, '[–CH₂–CHCl–]ₙ', { size: 20, w: 700, anchor: 'middle' });
  return f; },
'qui-2-provao-11'() {
  const f = Q('qui-2-provao-11', 'Relato de laboratório: H₂ e O₂ com faísca', 'Frasco rígido e fechado · gases incolores antes do evento', 'Frasco com os gases H2 e O2 antes da faísca e o mesmo frasco depois, com gotículas na parede e termômetro indicando aquecimento.');
  const fr = (x, aft) => { D.frasco(f, x, 110, 150, 170, aft ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0)', { nivel: .01 }); if (!aft) { for (let i = 0; i < 4; i++) D.atomo(f, x + 55 + (i % 2) * 40, 215 + Math.floor(i / 2) * 26, 10, COR.a, 'H'); for (let i = 0; i < 2; i++) D.atomo(f, x + 45 + i * 60, 180, 11, COR.r, 'O'); } else { for (let i = 0; i < 5; i++) D.gota(f, x + 40 + i * 18, 238 - (i % 2) * 22, 6, '#5aa9e6'); f.circle(x + 20, 190, 5, { fill: '#5aa9e6' }); } f.text(x + 75, 308, aft ? 'Depois' : 'Antes', { size: 13, w: 700, anchor: 'middle' }); };
  fr(70, 0); fr(390, 1); f.arrow(250, 200, 360, 200, { stroke: COR.l }); f.text(305, 184, 'faísca', { size: 13, w: 700, anchor: 'middle', fill: COR.l }); f.text(305, 222, '⚡', { size: 26, anchor: 'middle' });
  f.rect(580, 110, 14, 120, { fill: '#fff', stroke: '#37474f', sw: 2, r: 7 }); f.rect(584, 160, 6, 70, { fill: COR.r, r: 3 }); f.circle(587, 238, 13, { fill: COR.r }); f.text(612, 164, 'frasco aquece', { size: 12.5, w: 700 }); f.text(612, 262, 'gotículas nas paredes', { size: 12.5, w: 700, fill: COR.a });
  return f; },
'qui-2-provao-13'() {
  const f = Q('qui-2-provao-13', 'Combustíveis: CO₂ produzido e energia liberada', 'Combustões completas · valores ilustrativos · M(CO₂) = 44 g mol⁻¹', 'Cartões do etanol e do metano com o número de mols de CO2 produzidos e a energia liberada por mol de combustível.');
  [['Etanol (C₂H₅OH)', '2 mol', '1367 kJ', COR.l], ['Metano (CH₄)', '1 mol', '890 kJ', COR.a]].forEach((d, i) => { const x = 14 + i * 372; f.card(x, 70, 360, 250, d[0]);
    for (let k = 0; k < 3; k++) f.path(`M${x + 50 + k * 22} 190 q-14 -24 0 -44 q14 24 0 44z`, { fill: d[3], stroke: 'none', op: .85 - k * .15 });
    f.text(x + 150, 128, 'CO₂ produzido por mol', { size: 12, fill: f.t.mute }); f.text(x + 150, 156, d[1], { size: 26, w: 700 }); f.text(x + 150, 200, 'Energia liberada por mol', { size: 12, fill: f.t.mute }); f.text(x + 150, 228, d[2], { size: 26, w: 700, fill: d[3] });
    f.para(x + 30, 284, 'combustão completa do combustível', 40, { size: 12, fill: f.t.mute }); });
  return f; },
'qui-2-provao-14'() {
  const f = Q('qui-2-provao-14', 'Célula galvânica Mg/Ni (modelo de análise)', 'Condições padrão · E°(Mg²⁺/Mg) = −2,37 V · E°(Ni²⁺/Ni) = −0,25 V', 'Esquema de pilha com eletrodos de magnésio e de níquel, ponte salina e voltímetro, com os potenciais-padrão de redução.');
  pilha(f, { nome: 'Mg', cor: '#cfd8dc', liq: '#dcecdc', ion: 'Mg²⁺' }, { nome: 'Ni', cor: '#9aa5ab', liq: '#cfe9dd', ion: 'Ni²⁺' });
  f.card(510, 74, 236, 246, 'E° de redução (V)'); f.text(526, 126, 'Mg²⁺ + 2e⁻ → Mg', { size: 14, w: 700 }); f.text(526, 148, '−2,37 V', { size: 18, w: 700, fill: COR.a }); f.text(526, 196, 'Ni²⁺ + 2e⁻ → Ni', { size: 14, w: 700 }); f.text(526, 218, '−0,25 V', { size: 18, w: 700, fill: COR.l });
  f.para(526, 262, 'Modelo de análise, não procedimento de montagem.', 26, { size: 11.5, fill: f.t.mute });
  return f; }
};
