const { Fig, D, COR, fmt } = require('../lib.js');
const B = (id, t, s, d) => new Fig(id, 'bio', t, s, d);
const kt = n => String(n).replace(/(\d)(\d{3})$/, '$1 $2');
module.exports = {
'bio-3-provao-01'() {
  const f = B('bio-3-provao-01', 'Energia disponível em quatro níveis tróficos', 'kJ · valores ilustrativos · E(n+1) = 0,10 × E(n)', 'Pirâmide de energia com produtores, consumidores primários, secundários e terciários e suas energias.');
  [['Produtores', 10000, 560, COR.v], ['Consumidores primários', 1000, 430, COR.y], ['Consumidores secundários', 100, 300, COR.l], ['Consumidores terciários', 10, 170, COR.r]].forEach((d, i) => { const w = d[2], x = 300 - w / 2 + 40, y = 250 - i * 58; f.rect(x, y, w, 48, { fill: d[3], r: 6, op: .9 }); f.text(300 + 40, y + 21, d[0], { size: 13, w: 700, anchor: 'middle', fill: '#fff' }); f.text(300 + 40, y + 39, kt(d[1]) + ' kJ', { size: 13, anchor: 'middle', fill: '#fff' }); });
  f.arrow(640, 290, 640, 90, { stroke: f.t.mute }); f.text(690, 190, 'energia', { size: 13, fill: f.t.mute, anchor: 'middle', rot: 90 });
  f.text(22, 330, 'Os valores não representam biomassa nem a energia total do ecossistema.', { size: 12, fill: f.t.mute, it: 1 }); return f; },
'bio-3-provao-02'() {
  const f = B('bio-3-provao-02', 'Dois trechos de um reservatório', 'Estação chuvosa · valores ilustrativos · O₂ medido ao amanhecer', 'Comparação dos trechos A e B em nitrato, fosfato, cobertura de algas e oxigênio dissolvido.');
  [['Trecho A', '#cfe8f3', 'algas: baixa', 0.2, 0.03, 8.2, COR.a], ['Trecho B', '#b7d9a0', 'algas: alta', 4.8, 0.6, 2.1, COR.v]].forEach((d, i) => { const x = 14 + i * 372; f.card(x, 70, 360, 250, d[0]); f.rect(x + 14, 92, 332, 40, { fill: d[1], r: 8 }); f.text(x + 180, 118, d[2], { size: 14, w: 700, anchor: 'middle', fill: '#1f3a2a' });
    f.hbars(x + 6, 142, 340, [{ label: 'Nitrato (mg/L)', v: d[3], c: d[6], max: 5 }, { label: 'Fosfato (mg/L)', v: d[4], c: d[6] }, { label: 'O₂ (mg/L)', v: d[5], c: COR.t }], { rowH: 52, labelW: 110, max: i ? 8.2 : 8.2, size: 12 }); });
  return f; },
'bio-3-provao-04'() {
  const f = B('bio-3-provao-04', 'Leveduras em três frascos', 'Mesmo volume, temperatura e densidade inicial · valores ilustrativos', 'Três frascos fechados com levedura: A com oxigênio e glicose, B sem oxigênio e com glicose, C sem oxigênio e sem glicose, e gráficos de CO2 e etanol relativos.');
  [['A', 'com O₂ · com glicose', 42, 0, '#f6e7a7'], ['B', 'sem O₂ · com glicose', 38, 18, '#f6e7a7'], ['C', 'sem O₂ · sem glicose', 2, 0, '#e7eef2']].forEach((d, i) => { const x = 14 + i * 247; f.card(x, 70, 235, 250, 'Frasco ' + d[0]); D.frasco(f, x + 18, 96, 70, 90, d[4], { nivel: .45 }); f.para(x + 100, 118, d[1], 14, { size: 12 });
    f.vbars(x + 28, 204, 190, 62, [{ label: 'CO₂', bars: [{ v: d[2], c: COR.a }] }, { label: 'Etanol', bars: [{ v: d[3], c: COR.l }] }], { max: 45, ticks: 0, size: 11 }); });
  return f; },
'bio-3-provao-05'() {
  const f = B('bio-3-provao-05', 'Do gene ao polipeptídeo', 'Fita molde 3′–TAC CGA ATT–5′ · início AUG · parada UAA', 'Fita molde com três códons, espaços para o mRNA e a cadeia polipeptídica, e tabela de premissas.');
  ['TAC', 'CGA', 'ATT'].forEach((c, i) => { f.rect(70 + i * 110, 100, 96, 34, { fill: '#d6efe1', stroke: COR.v, sw: 2, r: 6 }); f.text(118 + i * 110, 124, c, { size: 18, w: 700, anchor: 'middle' }); }); f.text(24, 124, '3′', { size: 15, w: 700 }); f.text(404, 124, '5′', { size: 15, w: 700 }); f.text(24, 92, 'DNA (fita molde)', { size: 13, w: 700, fill: f.t.mute });
  f.arrow(240, 142, 240, 186, { stroke: COR.l }); f.text(254, 170, 'transcrição', { size: 12.5, w: 700, fill: COR.l });
  f.text(24, 208, 'mRNA (lido de 5′ para 3′)', { size: 13, w: 700, fill: f.t.mute }); [0, 1, 2].forEach(i => { f.rect(70 + i * 110, 216, 96, 34, { fill: '#fff', stroke: COR.l, sw: 2, r: 6 }); f.text(118 + i * 110, 240, '?', { size: 18, w: 700, anchor: 'middle', fill: f.t.mute }); });
  f.arrow(240, 258, 240, 292, { stroke: COR.p }); f.text(254, 280, 'tradução', { size: 12.5, w: 700, fill: COR.p });
  f.card(470, 84, 276, 236, 'Premissas'); [['Pareamento', 'complementar, com U no RNA'], ['Leitura do mRNA', '5′ → 3′'], ['AUG', 'inicia a tradução'], ['UAA', 'códon de parada']].forEach((d, i) => { f.text(486, 128 + i * 48, d[0], { size: 12, fill: f.t.mute }); f.text(486, 146 + i * 48, d[1], { size: 14, w: 700 }); });
  return f; },
'bio-3-provao-07'() {
  const f = B('bio-3-provao-07', 'Cladograma (A,(B,(C,D)))', 'Raiz à esquerda · ramos indicam ancestralidade comum, não escala de progresso', 'Árvore filogenética enraizada com A separado primeiro, depois B, e C e D como táxons mais próximos entre si.');
  const L = { stroke: '#37474f', sw: 4 }; f.line(70, 190, 140, 190, L); f.line(140, 110, 140, 260, L); f.line(140, 110, 560, 110, L); f.line(140, 260, 250, 260, L); f.line(250, 190, 250, 300, L); f.line(250, 190, 560, 190, L); f.line(250, 300, 340, 300, L); f.line(340, 250, 340, 320, L); f.line(340, 250, 560, 250, L); f.line(340, 320, 560, 320, L);
  [['A', 110], ['B', 190], ['C', 250], ['D', 320]].forEach(d => { f.circle(570, d[1], 14, { fill: '#d6efe1', stroke: COR.v, sw: 3 }); f.text(570, d[1] + 5, d[0], { size: 15, w: 700, anchor: 'middle' }); });
  f.text(52, 194, 'raiz', { size: 12, fill: f.t.mute, anchor: 'end' }); f.text(640, 190, 'táxons atuais', { size: 12, fill: f.t.mute }); return f; },
'bio-3-provao-08'() {
  const f = B('bio-3-provao-08', 'Do repouso ao exercício intenso', 'Pessoa saudável · valores ilustrativos', 'Barras de frequência cardíaca e ventilação pulmonar em repouso e durante exercício intenso.');
  f.card(14, 70, 360, 250, 'Frequência cardíaca (bpm)'); f.vbars(50, 112, 310, 150, [{ label: 'Repouso', bars: [{ v: 70, c: COR.a }] }, { label: 'Exercício', bars: [{ v: 150, c: COR.r }] }], { max: 160, ticks: 4 });
  f.card(386, 70, 360, 250, 'Ventilação pulmonar (L/min)'); f.vbars(422, 112, 310, 150, [{ label: 'Repouso', bars: [{ v: 6, c: COR.a }] }, { label: 'Exercício', bars: [{ v: 90, c: COR.r }] }], { max: 100, ticks: 5 });
  return f; },
'bio-3-provao-10'() {
  const f = B('bio-3-provao-10', 'Cinco culturas bacterianas em placas com antibiótico', 'Colônias resistentes por placa · valores ilustrativos', 'Cinco placas de Petri com 0, 12, 1, 8 e 0 colônias resistentes, cultivadas antes sem antibiótico.');
  const n = [0, 12, 1, 8, 0]; let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  n.forEach((c, i) => { const x = 14 + i * 148; f.card(x, 74, 140, 190, 'Cultura ' + (i + 1)); f.circle(x + 70, 160, 54, { fill: '#f7efd5', stroke: '#b7a56a', sw: 4 });
    for (let k = 0; k < c; k++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * 40; f.circle(x + 70 + r * Math.cos(a), 160 + r * Math.sin(a), 3.6, { fill: '#c0392b' }); }
    f.text(x + 70, 248, c + (c === 1 ? ' colônia' : ' colônias'), { size: 13, w: 700, anchor: 'middle' }); });
  f.text(380, 296, 'Antes: crescimento sem antibiótico até a mesma densidade; depois: placas com antibiótico.', { size: 12.5, anchor: 'middle', fill: f.t.mute }); f.text(380, 316, 'Placas sem antibiótico: crescimento semelhante.', { size: 12.5, anchor: 'middle', fill: f.t.mute });
  return f; },
'bio-3-provao-11'() {
  const f = B('bio-3-provao-11', 'Vacina × soro: anticorpos e memória', 'Semanas 1 e 4 · níveis relativos (esquema qualitativo)', 'Curvas qualitativas de anticorpos para vacina (baixos na semana 1, altos na 4) e soro (altos na semana 1, baixos na 4) e células de memória.');
  f.card(14, 70, 520, 250, 'Anticorpos'); f.line(70, 270, 510, 270, { stroke: f.t.mute, sw: 2 }); f.line(70, 110, 70, 270, { stroke: f.t.mute, sw: 2 });
  f.path('M110 250 Q250 245 470 130', { stroke: COR.v, sw: 4 }); f.path('M110 140 Q300 190 470 250', { stroke: COR.r, sw: 4 });
  [['semana 1', 110], ['semana 4', 470]].forEach(d => f.text(d[1], 292, d[0], { size: 12.5, anchor: 'middle' })); f.legend(160, 306, [{ c: COR.v, label: 'Vacina' }, { c: COR.r, label: 'Soro' }]);
  f.card(546, 70, 200, 250, 'Células de memória (final)'); f.text(646, 150, 'Vacina', { size: 14, w: 700, anchor: 'middle', fill: COR.v }); f.text(646, 180, 'detectadas', { size: 15, anchor: 'middle' }); D.celula(f, 646, 220, 26, 20, COR.v); f.text(646, 268, 'Soro', { size: 14, w: 700, anchor: 'middle', fill: COR.r }); f.text(646, 294, 'não detectadas', { size: 15, anchor: 'middle' });
  return f; },
'bio-3-provao-13'() {
  const f = B('bio-3-provao-13', 'Área úmida antes e depois da plantação a montante', 'Medidas ao amanhecer · sem trecho-controle · valores ilustrativos', 'Barras antes e após três meses para nitrato, fosfato, cobertura de algas, oxigênio dissolvido e táxons sensíveis.');
  const ind = [['Nitrato (mg/L)', 0.8, 4.6, 5], ['Fosfato (mg/L)', 0.04, 0.41, 0.5], ['Cobertura de algas (%)', 12, 68, 80], ['O₂ dissolvido (mg/L)', 7.4, 2.3, 8], ['Táxons sensíveis', 18, 3, 20]];
  ind.forEach((d, i) => { const x = 14 + (i % 3) * 247, y = 70 + Math.floor(i / 3) * 128; f.card(x, y, 235, 118, d[0]); f.hbars(x + 4, y + 26, 227, [{ label: 'Antes', v: d[1], c: COR.a }, { label: 'Após 3 m', v: d[2], c: COR.r }], { rowH: 40, labelW: 66, max: d[3], size: 12 }); });
  f.rect(508, 198, 238, 118, { fill: '#fff', stroke: f.t.line, sw: 2, r: 12 }); f.para(522, 226, 'Plantação instalada a montante entre as duas medidas; outras condições foram registradas.', 32, { size: 12.5, lh: 18 });
  return f; },
'bio-3-provao-14'() {
  const f = B('bio-3-provao-14', 'Referência × variante: do DNA à proteína', 'Fita codificadora 5′→3′ · mesmo protocolo · valores ilustrativos', 'Tabela visual com DNA, mRNA e trecho proteico de duas amostras, destacando o segundo códon: GAA e GTA.');
  const rows = [['Referência', ['ATG', 'GAA', 'TCC'], ['AUG', 'GAA', 'UCC'], ['Met', 'Glu', 'Ser'], COR.a], ['Variante', ['ATG', 'GTA', 'TCC'], ['AUG', 'GUA', 'UCC'], ['Met', 'Val', 'Ser'], COR.l]];
  rows.forEach((r, i) => { const y = 74 + i * 126; f.card(14, y, 732, 116, r[0]); [[r[1], 'DNA codificador', COR.v], [r[2], 'mRNA', COR.l], [r[3], 'Proteína', COR.p]].forEach((g, k) => { const x = 40 + k * 235; f.text(x, y + 44, g[1], { size: 12, fill: f.t.mute }); g[0].forEach((c, j) => { const hi = j === 1; f.rect(x + j * 66, y + 54, 60, 36, { fill: hi ? '#fde3c8' : '#fff', stroke: hi ? COR.l : g[2], sw: 2, r: 6 }); f.text(x + j * 66 + 30, y + 79, c, { size: 16, w: 700, anchor: 'middle' }); }); }); });
  return f; }
};
