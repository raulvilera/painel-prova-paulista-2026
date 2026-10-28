const { Fig, D, COR, fmt } = require('../lib.js');
const B = (id, t, s, d) => new Fig(id, 'bio', t, s, d);
module.exports = {
'bio-2-paulista-02'() {
  const f = B('bio-2-paulista-02', 'Hormônios e ovulação: dois grupos comparados', 'Valores da tabela (unidades arbitrárias)', 'Barras comparando FSH inicial, LH máximo e estradiol máximo entre o grupo H (formulação hormonal) e o controle C.');
  const dados = [['FSH inicial', 6, 7, 40], ['LH máximo', 8, 32, 40], ['Estradiol máximo', 90, 230, 250]];
  dados.forEach((d, i) => { const x = 14 + i * 247; f.card(x, 70, 235, 190, d[0]);
    f.hbars(x + 6, 100, 223, [{ label: 'H', v: d[1], c: COR.p }, { label: 'C', v: d[2], c: COR.l }], { rowH: 50, labelW: 36, max: d[3] * 1 }); });
  f.legend(14, 288, [{ c: COR.p, label: 'H — formulação hormonal (marcador de ovulação: ausente)' }, { c: COR.l, label: 'C — controle (marcador: presente)' }], { cw: 7.4 });
  f.text(14, 318, 'O marcador de ovulação é um indicador do protocolo, não um exame clínico.', { size: 12, fill: f.t.mute, it: 1 });
  return f; },
'bio-2-paulista-04'() {
  const f = B('bio-2-paulista-04', 'Álcool, energético e tempo de reação', 'Grupos equivalentes · valores ilustrativos', 'Gráficos de tempo médio de reação e alerta percebido para controle, álcool e álcool com energético.');
  f.card(14, 70, 360, 230, 'Tempo médio de reação (ms) — maior = mais lento');
  f.vbars(50, 110, 310, 150, [{ label: 'Controle', bars: [{ v: 340, c: COR.c }] }, { label: 'Álcool', bars: [{ v: 510, c: COR.r }] }, { label: 'Álcool + energ.', bars: [{ v: 370, c: COR.l }] }], { max: 600, ticks: 3 });
  f.card(386, 70, 360, 230, 'Alerta percebido (0–10), autorreferido');
  f.vbars(420, 110, 310, 150, [{ label: 'Controle', bars: [{ v: 5.2, c: COR.c }] }, { label: 'Álcool', bars: [{ v: 3.1, c: COR.r }] }, { label: 'Álcool + energ.', bars: [{ v: 7.2, c: COR.l }] }], { max: 10, ticks: 5 });
  f.text(380, 322, 'A escala de alerta não mede diretamente a coordenação motora.', { size: 12, anchor: 'middle', fill: f.t.mute, it: 1 });
  return f; },
'bio-2-paulista-05'() {
  const f = B('bio-2-paulista-05', 'Três formas de consumo de nicotina', 'Dispositivos diferem na combustão e na composição do que é inalado', 'Três cartões: cigarro convencional, narguilé e cigarro eletrônico, com combustão e nicotina.');
  const it = [['Cigarro convencional', 'combustão do tabaco', 'nicotina presente'], ['Narguilé', 'combustão do carvão e do tabaco aromatizado', 'nicotina pode estar presente'], ['Cigarro eletrônico', 'aquecimento de líquido (sem combustão)', 'nicotina pode estar presente']];
  it.forEach((d, i) => { const x = 14 + i * 247; f.card(x, 72, 235, 235);
    if (i === 0) { f.rect(x + 40, 130, 130, 14, { fill: '#f1e3c6', stroke: '#b99b62', sw: 2, r: 6 }); f.rect(x + 40, 130, 30, 14, { fill: '#d98c3a', r: 6 }); f.circle(x + 178, 120, 8, { fill: '#cfd8dc' }); f.circle(x + 190, 100, 11, { fill: '#dfe6e9' }); }
    if (i === 1) { f.rect(x + 92, 145, 50, 60, { fill: '#8ecae6', stroke: '#546e7a', sw: 2.5, r: 10 }); f.rect(x + 108, 100, 18, 48, { fill: '#b0bec5', stroke: '#546e7a', sw: 2 }); f.circle(x + 117, 92, 14, { fill: '#8d6e63' }); f.path(`M${x + 142} 175 q40 -10 40 -50`, { stroke: '#546e7a', sw: 3 }); }
    if (i === 2) { f.rect(x + 50, 130, 120, 22, { fill: '#cfd8dc', stroke: '#546e7a', sw: 2.5, r: 11 }); f.rect(x + 50, 130, 40, 22, { fill: '#37474f', r: 11 }); f.circle(x + 178, 122, 8, { fill: '#e3f2fd' }); f.circle(x + 192, 104, 11, { fill: '#e3f2fd' }); }
    f.text(x + 117, 100 + 0, '', {}); f.text(x + 117, 232, d[0], { size: 15, w: 700, anchor: 'middle' });
    f.para(x + 117, 254, d[1], 34, { size: 12, anchor: 'middle', fill: f.t.mute }); f.text(x + 117, 292, d[2], { size: 12.5, w: 700, anchor: 'middle', fill: COR.r }); });
  return f; },
'bio-2-paulista-07'() {
  const f = B('bio-2-paulista-07', 'Teste de carga de glicose: grupos A e B', 'Glicose (mg/dL) e insulina aos 30 min · valores ilustrativos', 'Curvas de glicemia aos 0, 30, 60 e 120 minutos para os grupos A e B e barras de insulina aos 30 minutos.');
  f.card(14, 70, 450, 250, 'Glicose ao longo do teste');
  f.lines(70, 106, 370, 160, [{ pts: [[0, 92], [30, 160], [60, 132], [120, 98]], c: COR.a }, { pts: [[0, 95], [30, 210], [60, 205], [120, 180]], c: COR.r }], { xmin: 0, xmax: 120, ymin: 60, ymax: 220, xt: [0, 30, 60, 120], yt: [60, 100, 140, 180, 220], xl: 'tempo (min)', yl: 'mg/dL' });
  f.legend(300, 92, [{ c: COR.a, label: 'Grupo A' }, { c: COR.r, label: 'Grupo B' }]);
  f.card(476, 70, 270, 250, 'Insulina aos 30 min (u.a.)');
  f.vbars(510, 112, 210, 150, [{ label: 'A', bars: [{ v: 55, c: COR.a }] }, { label: 'B', bars: [{ v: 18, c: COR.r }] }], { max: 60, ticks: 3 });
  return f; },
'bio-2-paulista-08'() {
  const f = B('bio-2-paulista-08', 'Ensaio com enzimas digestivas', 'Açúcares redutores liberados após 20 min (mg) · valores ilustrativos', 'Três tubos com glicose, amido e amido com fibra e gráfico de barras dos açúcares liberados.');
  [['Glicose', '#f6e7a7', 20], ['Amido', '#efe6d2', 18], ['Amido + fibra', '#d6c79c', 11]].forEach((d, i) => { const x = 40 + i * 100; D.tubo(f, x, 85, 44, 150, d[1], .75); f.text(x + 22, 262, d[0], { size: 12, anchor: 'middle', w: 700 }); });
  f.text(165, 290, '+ enzimas digestivas · 20 min', { size: 12, anchor: 'middle', fill: f.t.mute });
  f.card(350, 70, 396, 250, 'Açúcares redutores liberados (mg)');
  f.hbars(358, 100, 380, [{ label: 'Glicose', v: 20, c: COR.y }, { label: 'Amido', v: 18, c: COR.l }, { label: 'Amido + fibra', v: 11, c: COR.v }], { rowH: 56, labelW: 110, max: 24 });
  f.text(548, 300, 'Não representa absorção em uma pessoa.', { size: 12, anchor: 'middle', fill: f.t.mute, it: 1 });
  return f; },
'bio-2-paulista-10'() {
  const f = B('bio-2-paulista-10', 'Protozooses em duas áreas', 'Casos por 1.000 habitantes · valores ilustrativos', 'Comparação de giardíase e amebíase entre a área 1 (sem saneamento regular) e a área 2 (água tratada e coleta de esgoto).');
  [['Área 1', 'água sem tratamento · esgoto irregular', 18, 14, COR.r], ['Área 2', 'água tratada · coleta regular', 5, 4, COR.a]].forEach((d, i) => { const x = 14 + i * 372; f.card(x, 70, 360, 250, d[0]); f.text(x + 14, 42 + 70, '', {});
    f.para(x + 14, 112, d[1], 50, { size: 12.5, fill: f.t.mute });
    f.hbars(x + 6, 130, 340, [{ label: 'Giardíase', v: d[2], c: d[4] }, { label: 'Amebíase', v: d[3], c: d[4] }], { rowH: 52, labelW: 100, max: 20 });
    if (i === 0) { f.path(`M${x + 30} 268 q20 -14 40 0 t40 0 t40 0`, { stroke: '#a1887f', sw: 4 }); f.text(x + 190, 273, 'esgoto a céu aberto', { size: 12, fill: f.t.mute }); }
    else { D.torneira(f, x + 30, 262, '#546e7a'); f.text(x + 100, 285, 'água tratada + rede de esgoto', { size: 12, fill: f.t.mute }); } });
  return f; },
'bio-2-paulista-11'() {
  const f = B('bio-2-paulista-11', 'Casos antes e depois de obras de saneamento', 'Casos notificados e população por bairro · valores ilustrativos', 'Barras de casos antes e depois da intervenção nos bairros A, B e C, com a população de cada período.');
  f.card(14, 70, 520, 250, 'Casos notificados');
  f.vbars(60, 112, 460, 130, [{ label: 'Bairro A', bars: [{ v: 48, c: COR.r }, { v: 30, c: COR.a }] }, { label: 'Bairro B', bars: [{ v: 30, c: COR.r }, { v: 24, c: COR.a }] }, { label: 'Bairro C', bars: [{ v: 20, c: COR.r }, { v: 21, c: COR.a }] }], { max: 50, ticks: 5 });
  f.legend(60, 300, [{ c: COR.r, label: 'Antes' }, { c: COR.a, label: 'Depois' }]);
  f.card(546, 70, 200, 250, 'População (habitantes)');
  [['A', '12.000 → 15.000'], ['B', '10.000 → 8.000'], ['C', '5.000 → 9.000']].forEach((d, i) => { f.text(566, 120 + i * 58, 'Bairro ' + d[0], { size: 13, w: 700 }); f.text(566, 142 + i * 58, d[1], { size: 15, fill: COR.k }); });
  return f; },
'bio-2-paulista-13'() {
  const f = B('bio-2-paulista-13', 'Mensagem em rede social sobre saúde sexual', 'Informação incorreta circula com facilidade; o SUS oferece métodos gratuitamente', 'Celular exibindo uma postagem com afirmação duvidosa e dois ícones: pílula hormonal e preservativo.');
  f.rect(40, 74, 230, 252, { fill: '#263238', r: 26 }); f.rect(52, 94, 206, 212, { fill: '#fff', r: 10 });
  f.circle(74, 118, 12, { fill: COR.c }); f.text(94, 123, '@postagem', { size: 12, w: 700 });
  f.para(64, 148, '“A pílula hormonal protege contra todas as IST; por isso, o preservativo é desnecessário”', 27, { size: 12.5, lh: 17 });
  f.text(64, 262, '♥ 2,3 mil   ↻ 870', { size: 12, fill: f.t.mute }); f.text(155, 292, '⚠ afirmação a verificar', { size: 12, w: 700, fill: COR.r, anchor: 'middle' });
  f.arrow(285, 200, 330, 200, { stroke: f.t.mute });
  f.card(340, 74, 190, 252, 'Pílula hormonal'); f.circle(435, 170, 36, { fill: '#e1bee7', stroke: COR.p, sw: 3 }); f.line(435, 134, 435, 206, { stroke: COR.p, sw: 3 }); f.para(435, 240, 'atua no eixo hormonal e na ovulação', 24, { size: 12.5, anchor: 'middle' });
  f.card(548, 74, 198, 252, 'Preservativo'); f.rect(626, 120, 44, 92, { fill: '#b3e5fc', stroke: COR.a, sw: 3, r: 22 }); f.rect(618, 112, 60, 14, { fill: COR.a, r: 7 }); f.para(647, 240, 'barreira física na exposição a secreções', 24, { size: 12.5, anchor: 'middle' });
  return f; },
'bio-2-paulista-14'() {
  const f = B('bio-2-paulista-14', 'Indicadores comunitários: bairros X e Y', 'Dados agregados · valores ilustrativos', 'Comparação entre os bairros X e Y: água tratada, protozooses, bebidas açucaradas e adesão à alimentação escolar.');
  const ind = [['Água tratada', 98, 62, '%', 100], ['Protozooses (casos/1000)', 4, 18, '', 20], ['Bebidas açucaradas diariamente', 22, 58, '%', 100], ['Adesão à alimentação escolar', 85, 48, '%', 100]];
  ind.forEach((d, i) => { const x = 14 + (i % 2) * 372, y = 70 + Math.floor(i / 2) * 128; f.card(x, y, 360, 118, d[0]);
    f.hbars(x + 6, y + 30, 340, [{ label: 'Bairro X', v: d[1], c: COR.a, txt: d[1] + d[3] }, { label: 'Bairro Y', v: d[2], c: COR.l, txt: d[2] + d[3] }], { rowH: 40, labelW: 86, max: d[4] }); });
  f.text(380, 332, 'Percentuais agregados: não diagnosticam indivíduos nem provam causa única.', { size: 11.5, anchor: 'middle', fill: f.t.mute, it: 1 });
  return f; }
};
