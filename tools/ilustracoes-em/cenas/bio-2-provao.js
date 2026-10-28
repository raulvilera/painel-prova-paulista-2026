const { Fig, D, COR, fmt } = require('../lib.js');
const B = (id, t, s, d) => new Fig(id, 'bio', t, s, d);
module.exports = {
'bio-2-provao-01'() {
  const f = B('bio-2-provao-01', 'Produtividade em três lagos', 'kg C ha⁻¹ ano⁻¹ · valores ilustrativos', 'Barras de produtividade de produtores e de consumidores primários nos lagos A, B e C, com a proteção da margem de cada um.');
  [['Lago A', 1200, 180, 'margem: proteção total'], ['Lago B', 900, 90, 'margem: sem proteção'], ['Lago C', 1500, 210, 'margem: proteção parcial']].forEach((d, i) => { const x = 14 + i * 247; f.card(x, 70, 235, 250, d[0]);
    f.path(`M${x + 16} 110 q30 -10 60 0 t60 0 t60 0`, { stroke: COR.a, sw: 3 });
    f.hbars(x + 6, 150, 223, [{ label: 'Produtores', v: d[1], c: COR.v, txt: String(d[1]).replace(/(\d)(\d{3})/, '$1 $2') }, { label: 'Consum.', v: d[2], c: COR.l }], { rowH: 52, labelW: 78, max: 1600, size: 12 });
    f.text(x + 117, 294, d[3], { size: 12.5, anchor: 'middle', fill: f.t.mute, w: 700 }); });
  return f; },
'bio-2-provao-02'() {
  const f = B('bio-2-provao-02', 'Monitoramento em um fragmento florestal', 'Quatro anos · valores ilustrativos', 'Três gráficos de barras ao longo de quatro anos: roedores, cobertura vegetal e aves de rapina.');
  [['Roedores (indivíduos)', [80, 110, 170, 165], COR.l, 200], ['Cobertura vegetal (%)', [70, 68, 55, 52], COR.v, 100], ['Aves de rapina (pares)', [12, 8, 4, 4], COR.p, 14]].forEach((d, i) => { const x = 14 + i * 247; f.card(x, 70, 235, 250, d[0]);
    f.vbars(x + 34, 112, 190, 150, d[1].map((v, k) => ({ label: 'Ano ' + (k + 1), bars: [{ v, c: d[2] }] })), { max: d[3], ticks: 4, size: 11 }); });
  return f; },
'bio-2-provao-04'() {
  const f = B('bio-2-provao-04', 'Do gene à proteína', 'Fita molde 3′-TAC CCG AAA ATT-5′ · lida pela RNA-polimerase', 'Fluxo DNA, RNA mensageiro e cadeia polipeptídica, com a fita molde fornecida e espaços para o mRNA e a proteína.');
  const cod = ['TAC', 'CCG', 'AAA', 'ATT'];
  f.text(30, 100, 'DNA (fita molde)', { size: 13, w: 700, fill: f.t.mute }); f.text(30, 124, "3′", { size: 15, w: 700 });
  cod.forEach((c, i) => { f.rect(52 + i * 100, 104, 90, 32, { fill: '#d6efe1', stroke: COR.v, sw: 2, r: 6 }); f.text(97 + i * 100, 127, c, { size: 17, w: 700, anchor: 'middle' }); }); f.text(456, 124, "5′", { size: 15, w: 700 });
  f.arrow(250, 144, 250, 184, { stroke: COR.l }); f.text(262, 170, 'transcrição (RNA-polimerase)', { size: 12.5, w: 700, fill: COR.l });
  f.text(30, 206, 'RNA mensageiro', { size: 13, w: 700, fill: f.t.mute }); [0, 1, 2, 3].forEach(i => f.rect(52 + i * 100, 214, 90, 32, { fill: '#fff', stroke: COR.l, sw: 2, r: 6 })); [0, 1, 2, 3].forEach(i => f.text(97 + i * 100, 237, '?', { size: 17, w: 700, anchor: 'middle', fill: f.t.mute }));
  f.arrow(250, 254, 250, 290, { stroke: COR.p }); f.text(262, 278, 'tradução (ribossomo)', { size: 12.5, w: 700, fill: COR.p });
  [0, 1, 2].forEach(i => { f.circle(97 + i * 100, 308, 18, { fill: '#fff', stroke: COR.p, sw: 2.5 }); f.text(97 + i * 100, 314, '?', { size: 15, w: 700, anchor: 'middle', fill: f.t.mute }); if (i) f.line(97 + (i - 1) * 100 + 18, 308, 97 + i * 100 - 18, 308, { stroke: COR.p, sw: 3 }); });
  f.rect(520, 84, 226, 236, { fill: '#fff', stroke: f.t.line, sw: 2, r: 12 }); f.text(536, 108, 'Lembrete', { size: 13, w: 700, fill: f.t.mute }); f.para(536, 134, 'A RNA-polimerase lê a fita molde e o ribossomo lê o mRNA em códons (trincas). O trecho termina em um códon de parada.', 30, { size: 12.5, lh: 18 });
  return f; },
'bio-2-provao-05'() {
  const f = B('bio-2-provao-05', 'Eletroforese de amplicons (PCR)', 'Três loci · tamanhos em pares de bases (pb)', 'Gel de eletroforese com cinco canaletas: amostra da cena, suspeitos 1, 2 e 3 e controle negativo, e bandas de 120, 180 e 250 pb.');
  f.rect(110, 78, 630, 238, { fill: '#2b3a42', r: 12 });
  const L = [['Amostra da cena', [1, 1, 1]], ['Suspeito 1', [1, 1, 0]], ['Suspeito 2', [1, 1, 1]], ['Suspeito 3', [0, 1, 1]], ['Controle negativo', [0, 0, 0]]];
  const Yb = [250, 180, 120]; // pb: 250 mais próximo do poço
  const ypos = { 250: 140, 180: 190, 120: 240 };
  L.forEach((l, i) => { const x = 150 + i * 118; f.rect(x, 90, 68, 10, { fill: '#10171b', r: 2 }); l[1].forEach((on, k) => { if (on) f.rect(x, [240, 190, 140][k], 68, 9, { fill: '#9fe8ff', r: 3, op: .95 }); }); f.text(x + 34, 308, l[0].replace('Controle negativo', 'Controle (−)').replace('Amostra da cena', 'Cena'), { size: 12, anchor: 'middle', fill: '#fff', w: 700 }); });
  [['250 pb', 144], ['180 pb', 194], ['120 pb', 244]].forEach(d => { f.text(100, d[1] + 4, d[0], { size: 12, anchor: 'end', w: 700 }); f.line(104, d[1], 112, d[1], { stroke: f.t.ink, sw: 2 }); });
  f.text(30, 120, 'poço', { size: 12, fill: f.t.mute }); f.arrow(30, 128, 30, 290, { stroke: f.t.mute, sw: 2 }); f.text(20, 310, 'migração', { size: 11, fill: f.t.mute });
  return f; },
'bio-2-provao-07'() {
  const f = B('bio-2-provao-07', 'Heredograma: condição autossômica recessiva', 'Genótipo aa = afetado · não há penetrância incompleta', 'Casal não afetado com um filho afetado (aa) e uma gestação futura indicada por interrogação.');
  f.rect(240, 100, 50, 50, { fill: '#fff', stroke: COR.k, sw: 3 }); f.circle(520, 125, 25, { fill: '#fff', stroke: COR.k, sw: 3 });
  f.text(265, 92, 'Genitor 1', { size: 12, anchor: 'middle', fill: f.t.mute }); f.text(520, 92, 'Genitor 2', { size: 12, anchor: 'middle', fill: f.t.mute }); f.text(265, 170, 'não afetado', { size: 12.5, anchor: 'middle' }); f.text(520, 170, 'não afetada', { size: 12.5, anchor: 'middle' });
  f.line(290, 125, 495, 125, { stroke: COR.k, sw: 3 }); f.line(392, 125, 392, 215, { stroke: COR.k, sw: 3 });
  f.line(300, 215, 500, 215, { stroke: COR.k, sw: 3 }); f.line(300, 215, 300, 235, { stroke: COR.k, sw: 3 }); f.line(500, 215, 500, 235, { stroke: COR.k, sw: 3 });
  f.rect(275, 235, 50, 50, { fill: COR.k, stroke: COR.k, sw: 3 }); f.text(300, 306, 'filho afetado (aa)', { size: 13, w: 700, anchor: 'middle' });
  f.circle(500, 260, 25, { fill: '#fff', stroke: COR.v, sw: 3, }); f.text(500, 270, '?', { size: 28, w: 700, anchor: 'middle', fill: COR.v }); f.text(500, 306, 'próxima gestação', { size: 13, w: 700, anchor: 'middle' });
  f.text(620, 270, '▇ afetado   □ ○ não afetado', { size: 12, fill: f.t.mute, anchor: 'middle' });
  return f; },
'bio-2-provao-08'() {
  const f = B('bio-2-provao-08', 'Dois relatos hipotéticos', 'Caso I: neuroadaptação · Caso II: resposta a antígenos (esquemas qualitativos)', 'Esquema do caso I com efeito decrescente após exposições repetidas e do caso II com resposta imune mais rápida e intensa na segunda exposição.');
  f.card(14, 70, 360, 250, 'Caso I — exposições repetidas a uma substância'); 
  f.vbars(60, 112, 300, 130, [1, 2, 3, 4].map((k, i) => ({ label: k + 'ª exposição', bars: [{ v: [10, 8, 6, 4][i], c: COR.p, txt: '' }] })), { max: 10, ticks: 0, size: 11 });
  f.text(194, 290, 'efeito (esquema)', { size: 11.5, anchor: 'middle', fill: f.t.mute }); f.text(194, 308, 'dose buscada ↑', { size: 13, w: 700, anchor: 'middle', fill: COR.r });
  f.card(386, 70, 360, 250, 'Caso II — preparação com antígenos');
  f.path('M420 280 L470 280 C490 280 500 260 520 220 S545 280 580 280 L620 280 C640 280 650 200 676 150 S710 280 726 280', { stroke: COR.a, sw: 3.5 });
  f.line(420, 280, 730, 280, { stroke: f.t.mute, sw: 1.5 }); f.text(520, 208, '1ª dose', { size: 12, anchor: 'middle' }); f.text(640, 138, '2ª dose: resposta maior', { size: 12, anchor: 'middle' }); f.text(576, 304, 'tempo →', { size: 11.5, anchor: 'middle', fill: f.t.mute });
  return f; },
'bio-2-provao-10'() {
  const f = B('bio-2-provao-10', 'Curva pós-refeição padronizada', 'Glicose e insulina de dois participantes · valores ilustrativos', 'Gráfico de linhas da glicose em jejum, 30 e 120 minutos, e barras de insulina em jejum e aos 30 minutos para os participantes A e B.');
  f.card(14, 70, 430, 250, 'Glicose (mg/dL)');
  f.lines(66, 106, 350, 150, [{ pts: [[0, 90], [30, 140], [120, 100]], c: COR.a }, { pts: [[0, 95], [30, 220], [120, 190]], c: COR.r }], { xmin: 0, xmax: 120, ymin: 60, ymax: 240, xt: [0, 30, 120], yt: [60, 120, 180, 240], xl: 'tempo (min)' });
  f.legend(280, 92, [{ c: COR.a, label: 'A' }, { c: COR.r, label: 'B' }]);
  f.card(456, 70, 290, 250, 'Insulina (unid.)');
  f.vbars(490, 112, 240, 140, [{ label: 'Jejum', bars: [{ v: 10, c: COR.a }, { v: 11, c: COR.r }] }, { label: '30 min', bars: [{ v: 40, c: COR.a }, { v: 42, c: COR.r }] }], { max: 50, ticks: 5 });
  return f; },
'bio-2-provao-11'() {
  const f = B('bio-2-provao-11', 'Protozooses registradas em três bairros', '% da população · valores ilustrativos', 'Para cada bairro, barras de giardíase e amebíase, com condição de água e esgoto e de manipulação de alimentos.');
  [['Bairro A', 'poço sem tratamento · esgoto incompleto', 7, 5, 'manipulação: falhas frequentes', COR.r], ['Bairro B', 'rede tratada · esgoto regular', 1, 1, 'manipulação: falhas ocasionais', COR.a], ['Bairro C', 'rede tratada · baixa higiene alimentar', 2, 4, 'manipulação: falhas frequentes', COR.l]].forEach((d, i) => { const x = 14 + i * 247; f.card(x, 70, 235, 250, d[0]);
    f.para(x + 14, 112, d[1], 34, { size: 12, fill: f.t.mute }); f.hbars(x + 6, 150, 223, [{ label: 'Giardíase', v: d[2], c: d[5], txt: d[2] + '%' }, { label: 'Amebíase', v: d[3], c: d[5], txt: d[3] + '%' }], { rowH: 48, labelW: 80, max: 8, size: 12 }); f.para(x + 14, 285, d[4], 34, { size: 12, w: 700 }); });
  return f; },
'bio-2-provao-13'() {
  const f = B('bio-2-provao-13', 'Edição de DNA e validação por PCR', 'Fita molde normal: 3′-TAC GGA CTT ACT-5′ · códon CTT trocado por CAT', 'Quatro códons da fita molde com destaque para CTT e CAT, e gel de PCR com banda na linhagem editada e controle negativo sem banda.');
  f.card(14, 70, 732, 124, 'Fita molde');
  [['TAC', 0], ['GGA', 0], ['CTT', 1], ['ACT', 0]].forEach((c, i) => { f.rect(40 + i * 110, 106, 96, 34, { fill: c[1] ? '#fde3c8' : '#d6efe1', stroke: c[1] ? COR.l : COR.v, sw: 2, r: 6 }); f.text(88 + i * 110, 130, c[0], { size: 18, w: 700, anchor: 'middle' }); });
  f.text(88 + 2 * 110, 168, '↓ edição: CAT', { size: 13, w: 700, anchor: 'middle', fill: COR.l });
  f.text(500, 126, 'linhagem normal  →  linhagem editada', { size: 12.5, fill: f.t.mute }); f.text(500, 150, 'só o códon CTT é alterado', { size: 12.5, fill: f.t.mute });
  f.card(14, 204, 732, 120, 'PCR (eletroforese)'); f.rect(300, 232, 300, 84, { fill: '#2b3a42', r: 8 });
  [['Editada', 1], ['Controle (−)', 0]].forEach((l, i) => { const x = 350 + i * 120; f.rect(x, 238, 50, 7, { fill: '#10171b' }); if (l[1]) f.rect(x, 268, 50, 8, { fill: '#9fe8ff', r: 3 }); f.text(x + 25, 307, l[0], { size: 10.5, anchor: 'middle', fill: '#fff', w: 700 }); });
  f.text(40, 270, 'banda no tamanho esperado na', { size: 12.5, fill: f.t.ink }); f.text(40, 290, 'linhagem editada; sem banda no controle', { size: 12.5 });
  return f; },
'bio-2-provao-14'() {
  const f = B('bio-2-provao-14', 'Bairros X e Y: saneamento e alimentação', 'Dados de vigilância agregados · valores ilustrativos', 'Comparação dos bairros X e Y em giardíase, amebíase, consumo de ultraprocessados e indicador glicêmico populacional.');
  const ind = [['Giardíase (%)', 7, 1, 8], ['Amebíase (%)', 5, 1, 8], ['Consumo frequente de ultraprocessados (%)', 22, 25, 30], ['Indicador glicêmico populacional (%)', 8, 9, 12]];
  f.text(14, 82, '', {}); ind.forEach((d, i) => { const x = 14 + (i % 2) * 372, y = 70 + Math.floor(i / 2) * 118; f.card(x, y, 360, 108, d[0]); f.hbars(x + 6, y + 28, 340, [{ label: 'Bairro X', v: d[1], c: COR.l, txt: d[1] + '%' }, { label: 'Bairro Y', v: d[2], c: COR.a, txt: d[2] + '%' }], { rowH: 36, labelW: 86, max: d[3] }); });
  f.text(14, 322, 'X: poços sem tratamento e esgoto incompleto · Y: rede tratada e esgoto regular', { size: 12.5, fill: f.t.mute });
  return f; }
};
