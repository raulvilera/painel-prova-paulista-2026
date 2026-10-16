/* Zlata (8º Ano A) — atividade e Simulado inteiros em russo. Cada questão leva o espelho em português (q.pt),
   usado só no servidor: correção pela IA e cópia legível para o professor. */
module.exports = function ({ O, AS, OR, DI }) {
  const esp = q => ({ enunciado: q.enunciado, comando: q.comando, alts: q.alts, itens: q.itens, banco: q.banco, passos: q.passos, ref: q.ref, conceitos: q.conceitos, explicacao: q.explicacao });
  const par = (fn, ru, pt) => Object.assign(fn.apply(null, ru), { pt: esp(fn.apply(null, pt)) });
  const CR = 'Выбери правильный ответ.', CP = 'Escolha a resposta certa.';
  const VFr = (f, v, e) => [f, ['Верно', 'Неверно'], v ? 0 : 1, e, 'Это утверждение верно или неверно?'];
  const VFp = (f, v, e) => [f, ['Verdadeiro', 'Falso'], v ? 0 : 1, e, 'Esta frase é verdadeira ou falsa?'];
  const CD = 'Напиши ответ своими словами (можно по-русски).', CDp = 'Escreva a resposta com suas palavras.';

  const atividade = [
    par(O, ['Какое превращение энергии происходит на гидроэлектростанции?', ['Энергия падающей воды → электрическая энергия', 'Тепловая энергия → световая энергия', 'Химическая энергия → звук'], 0, 'Падающая вода вращает турбину, а генератор превращает движение в электричество.', CR],
           ['Qual transformação de energia acontece em uma usina hidrelétrica?', ['Energia da água em queda → energia elétrica', 'Energia térmica → energia luminosa', 'Energia química → som'], 0, 'A água em queda gira a turbina e o gerador transforma o movimento em eletricidade.', CP]),
    par(AS, ['Какие это источники энергии?', ['☀️ Солнце', '🛢️ Нефть', '💨 Ветер', '⚫ Уголь'], ['Возобновляемый', 'Невозобновляемый'], [0, 1, 0, 1], 'Выбери вариант для каждой строки.', 'Солнце и ветер возобновляемы; нефть и уголь заканчиваются.'],
           ['Que tipo de fonte de energia é cada uma?', ['☀️ Sol', '🛢️ Petróleo', '💨 Vento', '⚫ Carvão'], ['Renovável', 'Não renovável'], [0, 1, 0, 1], 'Escolha uma opção para cada linha.', 'Sol e vento são renováveis; petróleo e carvão se esgotam.']),
    par(O, VFr('Одноимённые электрические заряды притягиваются.', false, 'Одноимённые заряды отталкиваются, а разноимённые притягиваются.'), VFp('Cargas elétricas iguais se atraem.', false, 'Cargas iguais se repelem e cargas diferentes se atraem.')),
    par(O, ['Чтобы лампочка загорелась, электрическая цепь должна быть…', ['разомкнутой', 'замкнутой'], 1, 'Ток идёт только по замкнутой цепи.', CR],
           ['Para a lâmpada acender, o circuito elétrico deve estar…', ['aberto', 'fechado'], 1, 'A corrente só passa em circuito fechado.', CP]),
    par(AS, ['Проводник или изолятор?', ['Медь', 'Пластик', 'Резина', 'Железо'], ['Проводник', 'Изолятор'], [0, 1, 1, 0], 'Выбери вариант для каждого материала.', 'Металлы проводят ток; пластик и резина — изоляторы.'],
           ['Condutor ou isolante?', ['Cobre', 'Plástico', 'Borracha', 'Ferro'], ['Condutor', 'Isolante'], [0, 1, 1, 0], 'Escolha uma opção para cada material.', 'Metais conduzem corrente; plástico e borracha isolam.']),
    par(OR, ['Как энергия попадает к вентилятору? Расставь по порядку.', ['Электростанция вырабатывает электроэнергию', 'Провода высокого напряжения передают энергию', 'Энергия приходит в розетку дома', 'Вентилятор вращается'], 'Нажимай на карточки в правильном порядке.', 'Сначала станция, потом передача, розетка и, наконец, прибор.'],
           ['Como a energia chega ao ventilador? Coloque em ordem.', ['A usina gera a energia elétrica', 'Fios de alta tensão transportam a energia', 'A energia chega à tomada da casa', 'O ventilador gira'], 'Toque nos cartões na ordem certa.', 'Primeiro a usina, depois o transporte, a tomada e por fim o aparelho.']),
    par(O, ['При последовательном соединении, если одна лампочка перегорит…', ['погаснут все', 'погаснет только она', 'ничего не изменится'], 0, 'В последовательной цепи путь один: если он разорван, ток прекращается.', CR],
           ['Em um circuito em série, se uma lâmpada queimar…', ['todas apagam', 'só ela apaga', 'nada muda'], 0, 'Em série há um único caminho: se ele se rompe, a corrente para.', CP]),
    par(DI, ['Почему нельзя пользоваться электроприборами мокрыми руками?', 'Вода проводит электричество и уменьшает сопротивление кожи, поэтому растёт риск удара током.', ['вода проводит ток', 'риск удара током'], CD],
           ['Por que não se deve usar aparelhos elétricos com as mãos molhadas?', 'A água conduz eletricidade e diminui a resistência da pele, aumentando o risco de choque elétrico.', ['água conduz eletricidade', 'risco de choque'], CDp]),
    par(DI, ['Объясни своими словами разницу между последовательным и параллельным соединением. Приведи пример.', 'Em série há um único caminho para a corrente; se um componente falha, todos param. Em paralelo há vários caminhos e cada aparelho funciona de forma independente (ex.: as tomadas da casa).', ['série: um só caminho', 'paralelo: vários caminhos'], CD],
           ['Explique com suas palavras a diferença entre circuito em série e em paralelo. Dê um exemplo.', 'Em série há um único caminho para a corrente; se um componente falha, todos param. Em paralelo há vários caminhos e cada aparelho funciona de forma independente (ex.: as tomadas da casa).', ['série: um só caminho', 'paralelo: vários caminhos'], CDp]),
  ];

  const simulado = [
    par(O, ['У каждого магнита есть два полюса: северный и…', ['восточный', 'южный', 'западный'], 1, 'Полюса магнита — северный и южный.', CR],
           ['Todo ímã tem dois polos: norte e…', ['leste', 'sul', 'oeste'], 1, 'Os polos do ímã são norte e sul.', CP]),
    par(O, ['Какой из этих источников энергии НЕвозобновляемый?', ['солнечный свет', 'ветер', 'уголь'], 2, 'Уголь образуется миллионы лет и когда-нибудь закончится.', CR],
           ['Qual destas fontes de energia NÃO é renovável?', ['luz do Sol', 'vento', 'carvão mineral'], 2, 'O carvão leva milhões de anos para se formar e um dia acaba.', CP]),
    par(AS, ['Во что превращается электрическая энергия в каждом приборе?', ['💡 Лампочка', '🌀 Вентилятор', '🔊 Колонка'], ['Свет', 'Движение', 'Звук'], [0, 1, 2], 'Выбери вариант для каждого прибора.', 'Лампочка даёт свет, вентилятор — движение, колонка — звук.'],
           ['Em que se transforma a energia elétrica em cada aparelho?', ['💡 Lâmpada', '🌀 Ventilador', '🔊 Caixa de som'], ['Luz', 'Movimento', 'Som'], [0, 1, 2], 'Escolha uma opção para cada aparelho.', 'A lâmpada dá luz, o ventilador movimento e a caixa de som, som.']),
    par(O, VFr('Ток от батарейки — постоянный.', true, 'Батарейки дают постоянный ток, а розетка — переменный.'), VFp('A corrente que vem de uma pilha é contínua.', true, 'Pilhas fornecem corrente contínua e a tomada fornece corrente alternada.')),
    par(OR, ['Как работает гидроэлектростанция? Расставь по порядку.', ['Вода падает с плотины', 'Вода вращает турбину', 'Генератор вырабатывает электричество', 'Электричество идёт по проводам в города'], 'Нажимай на карточки в правильном порядке.', 'Вода вращает турбину, генератор делает ток, провода несут его в города.'],
           ['Como funciona uma usina hidrelétrica? Coloque em ordem.', ['A água cai da barragem', 'A água gira a turbina', 'O gerador produz eletricidade', 'A eletricidade segue por fios até as cidades'], 'Toque nos cartões na ordem certa.', 'A água gira a turbina, o gerador produz a corrente e os fios a levam às cidades.']),
    par(DI, ['Назови одно правило безопасности при работе с электричеством и объясни, почему оно важно.', 'Exemplos: não usar aparelhos com as mãos molhadas, não colocar objetos metálicos na tomada, não mexer em fios desencapados; o motivo é evitar choque elétrico, que pode causar queimaduras e ser fatal.', ['uma regra de segurança', 'evitar choque elétrico'], CD],
           ['Cite uma regra de segurança ao lidar com eletricidade e explique por que ela é importante.', 'Exemplos: não usar aparelhos com as mãos molhadas, não colocar objetos metálicos na tomada, não mexer em fios desencapados; o motivo é evitar choque elétrico, que pode causar queimaduras e ser fatal.', ['uma regra de segurança', 'evitar choque elétrico'], CDp]),
  ];
  return { atividade, simulado };
};
