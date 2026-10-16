/* Atividades adaptadas (PEI 2026, 4º bimestre) — Fundamental.
   Fica só no servidor: o aluno recebe apenas as questões e as opções de acessibilidade (sem diagnóstico, sem gabarito).
   O aluno abre pelo fluxo normal (turma + nome); quem tem PEI recebe esta versão, sem aparecer em nenhuma lista. */

const sem = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
/* "7º Ano A", "7º ANO A (Lydia)" -> "7A" */
const chaveTurma = t => { const m = /(\d)\s*º?\s*ANO\s*([A-Z])\b/.exec(sem(t)); return m ? m[1] + m[2] : sem(t); };
/* tolera grafias diferentes: primeiro e último nome (sem acentos) */
const chaveNome = n => { const p = sem(n).split(' ').filter(Boolean); return p.length ? p[0] + '|' + p[p.length - 1] : ''; };

/* ---------- construtores de questão ---------- */
const O = (enunciado, alts, correta, explicacao, comando) => ({ tipo: 'obj', enunciado, comando: comando || 'Escolha a resposta certa.', alts, correta, explicacao: explicacao || '' });
const VF = (frase, verdadeira, explicacao) => O(frase, ['Verdadeiro', 'Falso'], verdadeira ? 0 : 1, explicacao, 'Esta frase é verdadeira ou falsa?');
/* ligar / completar: cada item recebe uma opção do banco; correta[i] = índice no banco */
const AS = (enunciado, itens, banco, correta, comando, explicacao) => ({ tipo: 'assoc', enunciado, comando: comando || 'Escolha, para cada linha, a opção certa.', itens, banco, correta, explicacao: explicacao || '' });
/* ordenar: passos dados na ordem CORRETA; a tela mostra embaralhado (rotação fixa) e o aluno toca na ordem */
const OR = (enunciado, passos, comando, explicacao) => {
  const n = passos.length, desloc = Math.max(1, Math.floor(n / 2));
  const mostra = passos.map((_, i) => passos[(i + desloc) % n]);   // posição i da tela mostra o passo (i+desloc)%n
  const correta = passos.map((_, k) => mostra.indexOf(passos[k]));
  return { tipo: 'ordem', enunciado, comando: comando || 'Toque nos cartões na ordem certa.', passos: mostra, correta, explicacao: explicacao || '' };
};
const DI = (enunciado, ref, conceitos, comando) => ({ tipo: 'dis', enunciado, comando: comando || 'Escreva ou fale a sua resposta.', ref, conceitos });

/* ---------- perfis de acessibilidade (o que a tela faz; nunca o motivo) ---------- */
const P = {
  // uma questão por vez, agenda visual, letra grande, leitura em voz alta, retorno acolhedor
  apoio:   { umPorVez: true, agenda: true, fonte: 1.3, voz: true, gentil: true, semPressa: true },
  apoioMais:{ umPorVez: true, agenda: true, fonte: 1.55, voz: true, vozAuto: true, gentil: true, semPressa: true, ajuda: true },
  foco:    { umPorVez: true, agenda: true, fonte: 1.15, pausaA: 4, gentil: true, semPressa: true },
  focoMais:{ umPorVez: true, agenda: true, fonte: 1.35, voz: true, pausaA: 3, gentil: true, semPressa: true, ajuda: true },
  escrito: { fonte: 1.15, semVoz: true, gentil: true, semPressa: true },   // tudo por escrito, sem áudio
  motor:   { umPorVez: true, agenda: true, fonte: 1.2, voz: true, ditado: true, semDigitar: true, gentil: true, semPressa: true },
  tempo:   { umPorVez: true, agenda: true, fonte: 1.15, voz: true, ditado: true, gentil: true, semPressa: true },
  desafio: { agenda: true, fonte: 1, semPressa: true, desafio: true },
};

const ALUNOS = [];
const add = (turma, nome, flags, desc, itens, extra) => ALUNOS.push({ turma: chaveTurma(turma), nome, flags: Object.assign({}, flags, extra || {}), desc, itens });

/* =================== 6º ANO =================== */
add('6º Ano A', 'ANA BÁRBARA SAÚGO DE OLIVEIRA', P.foco, 'Sistema nervoso e órgãos dos sentidos', [
  AS('Ligue cada sentido ao órgão que o faz funcionar.', ['👀 Visão', '👂 Audição', '👃 Olfato', '👅 Paladar', '✋ Tato'], ['olhos', 'orelhas', 'nariz', 'língua', 'pele'], [0, 1, 2, 3, 4], 'Escolha o órgão de cada sentido.', 'Cada sentido tem seu órgão: olhos, orelhas, nariz, língua e pele.'),
  AS('Complete o esquema do neurônio.', ['Recebem a mensagem: ___', 'Levam a mensagem para outro neurônio: ___', 'O espaço entre dois neurônios chama-se ___'], ['dendritos', 'axônio', 'sinapse'], [0, 1, 2], 'Escolha a palavra que completa cada linha.', 'Dendritos recebem, o axônio conduz e a sinapse é a ligação entre neurônios.'),
  VF('O cérebro e a medula fazem parte do sistema nervoso central.', true, 'Cérebro e medula espinhal formam o sistema nervoso central.'),
  VF('Os ossos e os músculos trabalham juntos para o corpo se mover.', true, 'Os músculos puxam os ossos e produzem o movimento.'),
  VF('As drogas só afetam o estômago.', false, 'As drogas afetam principalmente o sistema nervoso.'),
  VF('Dormir bem e evitar drogas ajuda o sistema nervoso.', true, 'Cuidar do sono e evitar drogas protege o sistema nervoso.'),
  DI('Quando você encosta a mão em algo muito quente e a puxa rápido, que partes do corpo trabalham?', 'Receptores da pele percebem o calor, os nervos levam a mensagem à medula e ao cérebro, e os nervos levam a ordem aos músculos, que puxam a mão (reflexo).', ['pele ou receptores percebem', 'nervos levam a mensagem', 'medula ou cérebro', 'músculos movem a mão'], 'Escreva ou fale em 2 ou 3 frases.'),
]);

/* =================== 7º ANO =================== */
add('7º Ano A', 'YASMIM MANGILI SILVA', P.escrito, 'Saúde, vírus e bactérias, vacinas e saneamento', [
  AS('Complete as frases com a palavra certa.', ['A gripe e a dengue são causadas por ___', 'A tuberculose é causada por ___', 'A ___ protege o corpo antes de a pessoa ficar doente.', 'Beber ___ evita muitas doenças.', 'O ___ sem tratamento pode contaminar rios e causar doenças.'], ['vírus', 'bactéria', 'vacina', 'água tratada', 'esgoto'], [0, 1, 2, 3, 4], 'Escolha a palavra de cada frase.', 'Vírus causam gripe e dengue; bactérias causam tuberculose; a vacina protege; água tratada e esgoto bem tratado evitam doenças.'),
  AS('Ligue a doença à sua causa.', ['Gripe', 'Sarampo', 'Tétano', 'Cólera'], ['vírus', 'bactéria'], [0, 0, 1, 1], 'Escolha vírus ou bactéria.', 'Gripe e sarampo são causados por vírus; tétano e cólera, por bactérias.'),
  O('Qual destas ações faz parte do saneamento básico?', ['Coleta de esgoto', 'Comprar sapatos novos', 'Pintar a parede'], 0, 'Saneamento básico inclui água tratada, coleta de esgoto e de lixo.'),
  O('Uma doença que atinge muitas pessoas de uma região ao mesmo tempo é uma…', ['epidemia', 'vacina', 'bactéria'], 0, 'Epidemia é quando a doença atinge muitas pessoas de uma região.'),
  DI('Por que tomar vacina é bom para você e para a comunidade?', 'A vacina prepara o corpo para se defender da doença e, quando muita gente se vacina, a doença circula menos e protege também quem não pôde se vacinar.', ['prepara o corpo para se defender', 'protege a comunidade ou reduz a doença'], 'Escreva uma ou duas frases curtas.'),
  DI('Cite uma ação de saneamento que melhora a saúde do bairro.', 'Água tratada, coleta e tratamento de esgoto ou coleta de lixo.', ['água tratada ou esgoto ou lixo'], 'Escreva uma frase curta.'),
], { glossario: [
  { t: 'Vírus', d: 'Ser muito pequeno que só se multiplica dentro de células.' },
  { t: 'Bactéria', d: 'Ser vivo de uma célula só, sem núcleo.' },
  { t: 'Vacina', d: 'Prepara o corpo para se defender de uma doença.' },
  { t: 'Saneamento', d: 'Água tratada, esgoto e lixo recolhido.' },
  { t: 'Epidemia', d: 'Doença que atinge muitas pessoas de uma região.' } ] });

add('7º Ano A', 'HENRIQUE VIANA LEITE', P.apoioMais, 'Saúde: higiene, vacina e água limpa', [
  O('Qual ajuda a ficar saudável?', ['🧼 Mãos lavadas', '🦠 Mãos sujas'], 0, 'Lavar as mãos tira os germes.', 'Toque na figura certa.'),
  O('Qual é uma água boa para beber?', ['🚰 Água filtrada', '🟤 Água suja de lama'], 0, 'Água limpa e tratada faz bem à saúde.', 'Toque na figura certa.'),
  O('Qual protege contra doenças?', ['💉 Vacina', '🍬 Doce'], 0, 'A vacina ajuda o corpo a se defender.', 'Toque na figura certa.'),
  O('Onde o lixo deve ficar?', ['🗑️ Na lixeira', '🛣️ Na rua'], 0, 'Lixo na lixeira deixa o bairro limpo e saudável.', 'Toque na figura certa.'),
  OR('Como lavar as mãos? Toque na ordem.', ['🧼 Passar sabão', '💦 Enxaguar', '🧻 Secar'], 'Toque nos cartões na ordem certa.', 'Primeiro sabão, depois enxaguar e por fim secar.'),
]);

/* =================== 8º ANO (energia) =================== */
const hidreletrica = OR('Como a energia chega até a lâmpada? Coloque na ordem.', ['A água cai de um lugar alto (movimento)', 'A turbina gira e move o gerador', 'A energia elétrica viaja pelos fios', 'A lâmpada da casa acende'], 'Toque nos cartões na ordem certa.', 'Água em movimento gira a turbina, o gerador produz eletricidade, os fios a levam até a lâmpada.');
const fontes = AS('Classifique cada fonte de energia.', ['☀️ Sol', '🌬️ Vento', '🛢️ Petróleo', '⚫ Carvão mineral', '💧 Água dos rios', '🌾 Biomassa (bagaço de cana)'], ['Renovável', 'Não renovável'], [0, 0, 1, 1, 0, 0], 'Escolha renovável ou não renovável.', 'Sol, vento, água e biomassa se renovam; petróleo e carvão podem acabar.');

add('8º Ano A', 'CARLOS EDUARDO MENEZES MACHADO', P.foco, 'Energia: transformação, fontes e magnetismo', [
  hidreletrica, fontes,
  AS('Complete sobre cargas elétricas e ímãs.', ['Cargas iguais ___', 'Cargas diferentes ___', 'Esfregar um pente no cabelo é eletrização por ___'], ['se repelem', 'se atraem', 'atrito'], [0, 1, 2], 'Escolha a opção de cada linha.', 'Cargas iguais se repelem, diferentes se atraem; o pente no cabelo eletriza por atrito.'),
  O('Todo ímã tem dois polos: norte e…', ['leste', 'sul', 'oeste'], 1, 'Os polos do ímã são norte e sul.'),
  O('A corrente que sai de uma pilha é…', ['contínua', 'alternada'], 0, 'Pilhas e baterias fornecem corrente contínua; a tomada da casa fornece corrente alternada.'),
  DI('Por que não devemos usar aparelhos elétricos com as mãos molhadas?', 'A água conduz eletricidade e diminui a resistência da pele, aumentando o risco de choque elétrico.', ['água conduz eletricidade', 'risco de choque'], 'Escreva ou fale em 2 frases.'),
]);

add('8º Ano A', 'MATHEUS KAUÃ DOS SANTOS NASCIMENTO', P.foco, 'Energia: transformação, circuitos e segurança', [
  OR('Do início ao fim: como a energia chega ao ventilador? Coloque na ordem.', ['A usina gera a energia elétrica', 'Fios de alta tensão transportam a energia', 'A energia chega à tomada da casa', 'O ventilador gira (energia de movimento)'], 'Toque nos cartões na ordem certa.', 'Usina, transporte, tomada e, por fim, o aparelho funcionando.'),
  O('Para a lâmpada acender, o circuito deve estar…', ['aberto', 'fechado'], 1, 'A corrente só passa quando o circuito está fechado.'),
  AS('Condutor ou isolante?', ['Cobre', 'Plástico', 'Borracha', 'Ferro'], ['Condutor', 'Isolante'], [0, 1, 1, 0], 'Escolha uma opção para cada material.', 'Metais conduzem eletricidade; plástico e borracha isolam.'),
  O('Em um circuito em SÉRIE, se uma lâmpada queima…', ['todas apagam', 'só ela apaga', 'nada acontece'], 0, 'Em série há um único caminho: se um ponto abre, a corrente para.'),
  O('As tomadas de uma casa são ligadas em…', ['série', 'paralelo'], 1, 'Em paralelo, cada aparelho funciona de forma independente.'),
  DI('Explique com suas palavras a diferença entre circuito em série e em paralelo. Dê um exemplo.', 'Em série existe um único caminho para a corrente; se um componente falha, todos param. Em paralelo há vários caminhos e cada aparelho funciona de forma independente (ex.: tomadas da casa).', ['série um caminho', 'paralelo vários caminhos', 'exemplo'], 'Pode usar frases curtas ou uma lista.'),
]);

add('8º Ano B', 'CRISTIANO MARQUES BATISTA DE SOUZA', P.motor, 'Energia: transformação, fontes e magnetismo', [
  O('Em uma usina hidrelétrica, a ordem correta é:', ['eletricidade → água → turbina', 'água em movimento → turbina → eletricidade', 'turbina → água → luz'], 1, 'A água em movimento gira a turbina, que gera eletricidade.'),
  O('Quando uma lâmpada acende, a energia elétrica vira principalmente…', ['som', 'luz (e um pouco de calor)', 'cheiro'], 1, 'A lâmpada transforma energia elétrica em luz e calor.'),
  fontes,
  O('Cargas elétricas de mesmo sinal…', ['se atraem', 'se repelem', 'não fazem nada'], 1, 'Cargas iguais se repelem.'),
  O('Os polos de mesmo nome de dois ímãs…', ['se atraem', 'se repelem', 'desaparecem'], 1, 'Polos iguais se repelem; polos diferentes se atraem.'),
  DI('Por que dizemos que a energia “não se perde”, apenas se transforma?', 'A energia pode mudar de forma, mas a quantidade total se mantém (conservação de energia); parte vira calor, que se espalha.', ['muda de forma', 'quantidade total se conserva', 'parte vira calor'], 'Fale a resposta (botão do microfone) ou digite.'),
]);

add('8º Ano B', 'DANIEL RODRIGUES SANTOS DIAS', P.apoio, 'Energia: aparelhos, fontes e ímãs', [
  AS('Ligue cada aparelho à energia que ele produz.', ['💡 Lâmpada', '👕 Ferro de passar', '🌀 Ventilador', '📻 Rádio'], ['Luz', 'Calor', 'Movimento', 'Som'], [0, 1, 2, 3], 'Escolha a energia de cada aparelho.', 'Lâmpada: luz. Ferro: calor. Ventilador: movimento. Rádio: som.'),
  O('Qual fonte de energia nunca acaba (é renovável)?', ['🛢️ Petróleo', '☀️ Sol', '⚫ Carvão mineral'], 1, 'O Sol, o vento e a água são renováveis.'),
  O('Qual fonte de energia pode acabar?', ['🌬️ Vento', '☀️ Sol', '🛢️ Petróleo'], 2, 'O petróleo é não renovável.'),
  O('Qual objeto o ímã atrai?', ['🔩 Prego', '🧽 Borracha', '🪵 Madeira'], 0, 'O ímã atrai objetos de ferro, como o prego.'),
  VF('A energia pode mudar de forma, por exemplo de elétrica para luz.', true, 'A energia se transforma.'),
  VF('Polos iguais de dois ímãs se atraem.', false, 'Polos iguais se repelem.'),
  VF('Podemos mexer em tomada com a mão molhada.', false, 'Mão molhada e tomada dão risco de choque. Nunca faça isso!'),
  OR('Coloque na ordem: como a energia chega à lâmpada de casa.', ['A usina gera energia elétrica', 'Os fios levam a energia', 'A energia chega à tomada', 'A lâmpada acende'], 'Toque nos cartões na ordem certa.', 'Usina, fios, tomada e lâmpada.'),
  DI('Para que serve a energia elétrica em casa? Dê um exemplo.', 'Faz os aparelhos funcionarem, por exemplo a luz, a geladeira ou a TV.', ['faz aparelhos funcionarem', 'exemplo de aparelho'], 'Escreva ou fale uma frase.'),
]);

add('8º Ano B', 'ISAAC BONFIM VIDOTTO', P.focoMais, 'Energia: o que é e para que serve', [
  AS('Ligue o aparelho à energia que ele produz.', ['💡 Lâmpada', '👕 Ferro de passar', '🌀 Ventilador'], ['Luz', 'Calor', 'Movimento'], [0, 1, 2], 'Escolha a energia de cada aparelho.', 'Lâmpada: luz. Ferro: calor. Ventilador: movimento.'),
  O('Qual fonte de energia vem do céu?', ['☀️ Sol', '🛢️ Petróleo'], 0, 'O Sol é uma fonte de energia que não acaba.', 'Toque na figura certa.'),
  O('Qual atrai o prego?', ['🧲 Ímã', '🧽 Borracha'], 0, 'O ímã atrai o ferro.', 'Toque na figura certa.'),
  O('O que é perigoso com a mão molhada?', ['🔌 Tomada', '📓 Caderno'], 0, 'Água e eletricidade juntas dão choque.', 'Toque na figura certa.'),
  OR('Para acender a lâmpada, coloque na ordem.', ['Ligar o fio na pilha', 'Ligar a lâmpada', 'Fechar o circuito', 'A lâmpada acende!'], 'Toque nos cartões na ordem certa.', 'O circuito precisa estar fechado para a lâmpada acender.'),
  VF('A energia pode mudar de forma.', true, 'Por exemplo, a energia elétrica vira luz.'),
]);

/* =================== 9º ANO (astronomia) =================== */
add('9º Ano A', 'YURI GABRIEL DE MORAES PONGOLINO', P.apoio, 'Sistema Solar, Lua, gravidade e constelações indígenas', [
  OR('Coloque os planetas do mais perto ao mais longe do Sol.', ['Mercúrio', 'Vênus', 'Terra', 'Marte'], 'Toque nos cartões na ordem certa.', 'A ordem é Mercúrio, Vênus, Terra e Marte.'),
  AS('Complete as frases.', ['A ___ puxa os objetos para o centro da Terra.', 'A Terra gira em torno de si mesma: é a ___', 'A ___ gira em torno da Terra e causa as marés junto com o Sol.'], ['gravidade', 'rotação', 'Lua', 'translação'], [0, 1, 2], 'Escolha a palavra de cada frase.', 'Gravidade puxa, rotação forma dia e noite, a Lua causa as marés.'),
  O('Muitos povos indígenas observam o céu para saber…', ['a hora de plantar e de colher', 'o preço do pão'], 0, 'As estrelas ajudam a marcar as épocas do ano.'),
  O('A constelação da Ema ajuda a marcar…', ['épocas do ano', 'o horário do ônibus'], 0, 'Povos indígenas usam as constelações como calendário.'),
  VF('O Sol é uma estrela.', true, 'O Sol é a estrela do nosso Sistema Solar.'),
  VF('A Lua produz luz própria.', false, 'A Lua apenas reflete a luz do Sol.'),
  DI('Por que o astronauta flutua na estação espacial?', 'Ele e a estação estão em queda livre ao redor da Terra: a gravidade continua atuando, mas tudo cai junto e ele parece flutuar.', ['queda livre ou cai junto', 'gravidade continua atuando'], 'Escreva ou fale uma frase.'),
]);

add('9º Ano A', 'ESTHER CRISTINE SILVA RIBEIRO', P.apoio, 'Sistema Solar, Lua e gravidade', [
  AS('Ligue cada astro à descrição.', ['☀️ Sol', '🌍 Terra', '🌙 Lua'], ['Estrela que dá luz e calor', 'Planeta onde vivemos', 'Satélite natural da Terra'], [0, 1, 2], 'Escolha a descrição de cada astro.', 'O Sol é uma estrela, a Terra é um planeta e a Lua é satélite natural.'),
  OR('Coloque as fases da Lua na ordem.', ['🌑 Lua nova', '🌓 Quarto crescente', '🌕 Lua cheia', '🌗 Quarto minguante'], 'Toque nos cartões na ordem certa.', 'Nova, quarto crescente, cheia e quarto minguante.'),
  O('Se você soltar uma bola, ela…', ['sobe', 'cai'], 1, 'A gravidade puxa para baixo.'),
  O('Na Lua a gravidade é…', ['maior que na Terra', 'menor que na Terra'], 1, 'A Lua tem gravidade menor, por isso os astronautas davam saltos longos.'),
  AS('Ligue a constelação indígena ao que ela mostra.', ['Ema', 'Homem Velho'], ['Uma ave grande', 'Um homem no céu'], [0, 1], 'Escolha o que cada constelação representa.', 'Povos indígenas veem figuras no céu e usam como calendário.'),
]);

add('9º Ano B', 'DANILO SANTOS DA CONCEIÇÃO', P.apoio, 'Sistema Solar, Terra-Sol-Lua e gravidade', [
  AS('Ligue cada movimento ao que ele forma.', ['Rotação (a Terra gira em torno de si)', 'Translação (a Terra gira em torno do Sol)'], ['dia e noite', 'um ano'], [0, 1], 'Escolha uma opção.', 'A rotação forma dia e noite; a translação dura um ano.'),
  VF('O Sol é uma estrela.', true, 'O Sol é uma estrela.'),
  VF('A Lua produz luz própria.', false, 'A Lua reflete a luz do Sol.'),
  VF('A gravidade mantém os planetas girando em torno do Sol.', true, 'A atração gravitacional do Sol mantém os planetas em órbita.'),
  VF('Os eclipses acontecem quando Sol, Terra e Lua ficam alinhados.', true, 'No eclipse, os três astros ficam alinhados.'),
  O('A Lua atrai a água do mar e causa as…', ['marés', 'erupções', 'chuvas'], 0, 'A gravidade da Lua (e do Sol) causa as marés.'),
  DI('Para que alguns povos indígenas observam as estrelas?', 'Para marcar as épocas do ano (plantar, colher, pescar), se orientar e contar histórias culturais.', ['marcar épocas do ano ou plantar', 'orientação ou cultura'], 'Escreva ou fale uma frase.'),
]);

add('9º Ano B', 'MUNIQUE CRISTINA LUCAS', P.apoioMais, 'Sol, Terra e Lua; dia e noite; gravidade', [
  AS('Ligue cada figura ao que ela é.', ['☀️', '🌙', '🌍'], ['Estrela amarela que dá luz e calor', 'Brilha à noite no céu', 'Planeta onde vivemos'], [0, 1, 2], 'Escolha a descrição de cada figura.', 'O Sol dá luz e calor, a Lua brilha à noite e a Terra é nossa casa.'),
  O('De dia, vemos no céu…', ['☀️ O Sol', '🌙 A Lua'], 0, 'De dia vemos o Sol.', 'Toque na figura certa.'),
  O('À noite, vemos no céu…', ['☀️ O Sol', '🌙 A Lua e as estrelas'], 1, 'À noite vemos a Lua e as estrelas.', 'Toque na figura certa.'),
  O('Se soltarmos uma bola, ela…', ['⬇️ Cai', '⬆️ Sobe'], 0, 'A bola cai por causa da gravidade.', 'Toque na figura certa.'),
  O('Quem puxa a bola para baixo?', ['A gravidade', 'O vento'], 0, 'A gravidade puxa tudo para baixo.'),
  O('Muitos povos indígenas olham o céu e veem…', ['⭐ Estrelas e constelações', '🚗 Carros'], 0, 'Eles veem as estrelas e usam para saber a época de plantar.', 'Toque na figura certa.'),
]);

add('9º Ano B', 'VITÓRIA MENEZES BRANDÃO', P.tempo, 'Gravitação, Sistema Solar, marés e vida fora da Terra', [
  O('A Lei da Gravitação Universal afirma que a força de atração entre dois corpos…', ['depende só da cor dos corpos', 'aumenta com as massas e diminui com a distância', 'só existe na Terra'], 1, 'A atração é maior com mais massa e menor com mais distância.'),
  O('As marés são causadas principalmente…', ['pelo vento', 'pela atração gravitacional da Lua (e do Sol) sobre a água', 'pelo calor da Terra'], 1, 'A gravidade da Lua e do Sol puxa a água dos oceanos.'),
  O('A zona habitável de uma estrela é a região onde pode existir…', ['água líquida na superfície', 'apenas gelo', 'só gás'], 0, 'Na zona habitável a temperatura permite água líquida.'),
  AS('Classifique os planetas.', ['Mercúrio', 'Terra', 'Júpiter', 'Saturno'], ['Rochoso', 'Gasoso'], [0, 0, 1, 1], 'Escolha rochoso ou gasoso.', 'Mercúrio e Terra são rochosos; Júpiter e Saturno são gasosos.'),
  AS('Relacione a tecnologia à sua função.', ['Satélites', 'Sondas espaciais'], ['Comunicação, previsão do tempo e GPS', 'Explorar planetas sem astronautas'], [0, 1], 'Escolha a função de cada uma.', 'Satélites ficam em órbita da Terra; sondas exploram outros astros.'),
  DI('Cite uma constelação indígena e explique para que um povo a usa no dia a dia.', 'Por exemplo, a Ema: sua posição no céu indica épocas do ano, como o período de chuvas e do plantio.', ['cita constelação', 'explica uso como calendário ou plantio'], 'Escreva ou fale a resposta.'),
]);

add('9º Ano B', 'PAULO CELSO DA COSTA JUNIOR', P.foco, 'Sistema Solar, gravidade, Terra-Sol-Lua e vida fora da Terra', [
  AS('Classifique os planetas.', ['Mercúrio', 'Terra', 'Marte', 'Júpiter', 'Saturno', 'Urano'], ['Rochoso', 'Gasoso (gigante)'], [0, 0, 0, 1, 1, 1], 'Escolha uma opção para cada planeta.', 'Mercúrio, Terra e Marte são rochosos; Júpiter, Saturno e Urano são gigantes.'),
  O('Peso = massa × gravidade. Na Terra (g ≈ 10 m/s²), uma pessoa de 50 kg pesa aproximadamente…', ['5 N', '500 N', '50 000 N'], 1, '50 × 10 = 500 N.'),
  O('Na Lua (g ≈ 1,6 m/s²), essa mesma pessoa de 50 kg pesa aproximadamente…', ['80 N', '800 N', '8 N'], 0, '50 × 1,6 = 80 N. A massa continua 50 kg.'),
  VF('O eclipse solar ocorre quando a Lua passa entre o Sol e a Terra.', true, 'A Lua fica entre o Sol e a Terra e cobre o Sol.'),
  VF('As marés altas acontecem por causa do vento.', false, 'As marés são causadas principalmente pela gravidade da Lua e do Sol.'),
  VF('A Lua orbita a Terra.', true, 'A Lua é o satélite natural da Terra.'),
  DI('Cite duas condições importantes para um planeta poder abrigar vida como a conhecemos.', 'Água líquida, temperatura adequada, atmosfera, energia da estrela e elementos químicos essenciais.', ['água líquida', 'outra condição (temperatura, atmosfera, energia)'], 'Escreva em 2 linhas.'),
]);

add('9º Ano B', 'NICOLAS PENTEADO', P.desafio, 'Investigação: do céu cultural à exploração espacial', [
  O('P = m × g. Uma pessoa de 60 kg, na Terra (g ≈ 9,8 m/s²), tem peso de aproximadamente…', ['588 N', '60 N', '6 N'], 0, '60 × 9,8 = 588 N.'),
  O('Essa mesma pessoa em Marte (g ≈ 3,7 m/s²) pesaria aproximadamente…', ['222 N', '600 N', '16 N'], 0, '60 × 3,7 = 222 N. A massa continua 60 kg.'),
  DI('Explique por que a MASSA de um astronauta não muda na Lua, mas o PESO muda. Qual consequência isso tem para saltar e para a estrutura de uma base lunar?', 'Massa é a quantidade de matéria e é constante; peso é a força gravitacional e depende da gravidade do local. Na Lua (g menor) o peso é menor, o salto é mais alto e as estruturas sofrem menos carga, mas a inércia dos corpos continua a mesma.', ['massa constante', 'peso depende da gravidade', 'consequência (salto ou estrutura)'], 'Responda com argumentos, em um parágrafo.'),
  DI('Escolha um povo indígena brasileiro e compare como ele observa o céu com a astronomia tradicional (constelações do zodíaco). O que é semelhante e o que difere?', 'Ambos usam padrões de estrelas para orientação e calendário. As constelações indígenas incluem também as manchas escuras da Via Láctea (ex.: Ema) e se ligam a ciclos de plantio, caça e chuva; o zodíaco ocidental usa figuras de estrelas ligadas à mitologia europeia.', ['semelhança (orientação ou calendário)', 'diferença (figuras, cultura ou manchas escuras)'], 'Responda com argumentos, em um parágrafo.'),
  DI('Monte uma proposta de missão para Marte, Europa ou Encélado: objetivo científico, condições do local, riscos para a vida humana e uma pergunta que a missão responderia.', 'Resposta aberta: avaliar objetivo claro, uso de dados (gravidade, temperatura, água), riscos (radiação, suprimentos) e pergunta científica (por exemplo, existe água líquida ou vida?).', ['objetivo científico', 'condições do local', 'riscos', 'pergunta científica'], 'Resposta autoral: pode ser longa.'),
]);

/* ---------- imagens (Nano Banana / Gemini) ----------
   Cada entrada: início do enunciado -> [descrição da cena em inglês, texto alternativo em português].
   As imagens são geradas uma única vez pelo professor (página /atividade-individual/preparar/) e guardadas no banco.
   Pedimos sempre imagem SEM texto, porque o gerador erra palavras em português. */
const IMGS = {
  'Ligue cada sentido ao órgão': ['a child exploring the five senses in five small scenes: looking through a magnifying glass, listening with a hand behind the ear, smelling a flower, tasting a fruit, touching a soft kitten', 'Criança usando visão, audição, olfato, paladar e tato'],
  'Complete o esquema do neurônio': ['a scientific illustration of one neuron with branching dendrites, a round cell body, a long axon, and a tiny gap (synapse) to a second neuron, clear colors', 'Neurônio com dendritos, corpo celular e axônio'],
  'Quando você encosta a mão': ['a child quickly pulling their hand away from a hot cooking pot on a stove, in a home kitchen', 'Criança puxando a mão de uma panela quente'],
  'Complete as frases com a palavra certa': ['microscope-style view of round viruses with spikes next to rod-shaped bacteria, with a vaccine syringe at the side', 'Vírus, bactérias e vacina'],
  'Ligue a doença à sua causa': ['microscope-style view of round viruses with spikes next to rod-shaped bacteria', 'Vírus e bactérias vistos ao microscópio'],
  'Qual destas ações faz parte do saneamento': ['a Brazilian neighborhood with a treated water pipe, a sewage collection pipe under the street and a garbage collection truck', 'Bairro com água tratada, esgoto e coleta de lixo'],
  'Por que tomar vacina': ['a friendly nurse giving a vaccine to a smiling child at a Brazilian public health clinic', 'Enfermeira vacinando uma criança'],
  'Cite uma ação de saneamento': ['a Brazilian neighborhood with a treated water pipe, a sewage collection pipe under the street and a garbage collection truck', 'Bairro com água tratada, esgoto e coleta de lixo'],
  'Qual ajuda a ficar saudável': ['two hands: left hand clean with soap foam under running water, right hand dirty with mud and germs, side by side, split image', 'Mãos limpas com sabão e mãos sujas'],
  'Qual é uma água boa para beber': ['two scenes side by side: a clear glass of filtered water from a water filter, and a muddy brown puddle', 'Água filtrada e poça de lama'],
  'Qual protege contra doenças': ['a vaccine syringe and vial next to a lollipop candy, side by side on a table', 'Vacina e doce'],
  'Onde o lixo deve ficar': ['a child putting a paper in a green trash bin in a clean street, next to a street littered with trash', 'Lixeira e rua suja'],
  'Como lavar as mãos': ['three panels in order: hands with soap foam, hands rinsing under a tap, hands being dried with a towel', 'Passos para lavar as mãos'],
  'Como a energia chega até a lâmpada': ['a hydroelectric dam with water falling through a turbine, power lines going to a small house where a lamp is lit', 'Usina hidrelétrica levando energia até uma lâmpada'],
  'Classifique cada fonte de energia': ['six energy sources in a row: sun, wind turbine, river with a small dam, oil pumpjack, coal mine cart, sugarcane field', 'Sol, vento, rio, petróleo, carvão e cana-de-açúcar'],
  'Qual fonte de energia nunca acaba': ['a sun shining over solar panels next to an oil rig and a coal pile, three separate scenes', 'Sol, petróleo e carvão'],
  'Qual fonte de energia pode acabar': ['a wind turbine, the sun and an oil pumpjack in three separate scenes', 'Vento, Sol e petróleo'],
  'Qual fonte de energia vem do céu': ['the bright sun shining in a blue sky over a house with solar panels, next to an oil barrel', 'Sol e petróleo'],
  'Complete sobre cargas elétricas': ['a child rubbing a plastic comb on hair so that hair strands lift up, next to two bar magnets attracting', 'Eletrização por atrito e ímãs'],
  'Todo ímã tem dois polos': ['a red and blue horseshoe magnet with iron filings forming field lines around it', 'Ímã e linhas de campo magnético'],
  'Os polos de mesmo nome': ['two bar magnets facing each other with the same colored ends pushing apart, with arrows', 'Dois ímãs se repelindo'],
  'Cargas elétricas de mesmo sinal': ['two balloons rubbed on hair repelling each other when hung from strings', 'Balões eletrizados se repelindo'],
  'Qual objeto o ímã atrai': ['a magnet attracting iron nails and paper clips while a rubber eraser and wooden stick stay still', 'Ímã atraindo pregos e clipes'],
  'Qual atrai o prego': ['a magnet next to an iron nail and a rubber eraser', 'Ímã, prego e borracha'],
  'A corrente que sai de uma pilha': ['an AA battery next to a wall power outlet with a plug', 'Pilha e tomada'],
  'Por que não devemos usar aparelhos elétricos': ['a warning scene: wet hands near an electrical wall outlet with a cartoon caution triangle, no person shown except hands', 'Mãos molhadas perto de uma tomada'],
  'Podemos mexer em tomada': ['a warning scene: wet hands near an electrical wall outlet with a cartoon caution triangle', 'Mãos molhadas perto de uma tomada'],
  'O que é perigoso com a mão molhada': ['a wall power outlet next to a school notebook, two separate items', 'Tomada e caderno'],
  'Do início ao fim: como a energia chega ao ventilador': ['a power plant, high-voltage transmission towers, and a house with a fan spinning in the living room', 'Usina, torres de energia e ventilador em casa'],
  'Coloque na ordem: como a energia chega à lâmpada de casa': ['a power plant, high-voltage transmission towers, and a house with a lit ceiling lamp', 'Usina, torres de energia e lâmpada em casa'],
  'Para a lâmpada acender, o circuito deve estar': ['a simple electric circuit with a battery, two wires and a lit light bulb on a table', 'Circuito simples com pilha, fios e lâmpada'],
  'Para acender a lâmpada, coloque na ordem': ['a simple electric circuit with a battery, two wires and a lit light bulb on a table', 'Circuito simples com pilha, fios e lâmpada'],
  'Condutor ou isolante': ['a copper wire, a plastic cup, a rubber glove and an iron nail laid out on a table', 'Fio de cobre, copo de plástico, luva de borracha e prego'],
  'Em um circuito em SÉRIE': ['two electric circuits side by side: three bulbs in a single loop, and three bulbs on separate parallel branches', 'Circuito em série e circuito em paralelo'],
  'As tomadas de uma casa': ['a wall with three power outlets each with a different appliance plugged in: lamp, fan, phone charger', 'Tomadas com aparelhos ligados'],
  'Explique com suas palavras a diferença entre circuito': ['two electric circuits side by side: three bulbs in a single loop, and three bulbs on separate parallel branches', 'Circuito em série e circuito em paralelo'],
  'Ligue cada aparelho à energia': ['a table with a lit lamp, a steam iron, a spinning desk fan and a small radio', 'Lâmpada, ferro de passar, ventilador e rádio'],
  'Ligue o aparelho à energia': ['a table with a lit lamp, a steam iron and a spinning desk fan', 'Lâmpada, ferro de passar e ventilador'],
  'Quando uma lâmpada acende': ['a lit incandescent light bulb glowing and giving off a little warm heat', 'Lâmpada acesa'],
  'Em uma usina hidrelétrica': ['a hydroelectric dam with water falling through a turbine, power lines going to a small house where a lamp is lit', 'Usina hidrelétrica'],
  'Para que serve a energia elétrica em casa': ['a cozy Brazilian living room with a lit lamp, TV and refrigerator in the kitchen', 'Aparelhos elétricos em casa'],
  'Coloque os planetas do mais perto': ['the Sun at the left and the four inner planets in a row: Mercury, Venus, Earth, Mars, increasing distance, dark space background', 'Sol e os quatro primeiros planetas'],
  'Ligue cada astro': ['the Sun, the Earth and the Moon drawn together in space, friendly educational style', 'Sol, Terra e Lua'],
  'Coloque as fases da Lua': ['four moon phases in a row: new moon, first quarter, full moon, last quarter, on a night-sky background', 'Fases da Lua'],
  'Se você soltar uma bola': ['a child dropping a ball from the hand and the ball falling to the ground, with a motion arrow downward', 'Bola caindo'],
  'Se soltarmos uma bola': ['a child dropping a ball from the hand and the ball falling to the ground, with a motion arrow downward', 'Bola caindo'],
  'Quem puxa a bola': ['a ball falling toward the Earth with an arrow showing gravity pulling down', 'Gravidade puxando a bola'],
  'Na Lua a gravidade': ['an astronaut jumping high on the Moon surface with the blue Earth in the sky', 'Astronauta saltando na Lua'],
  'Ligue a constelação indígena': ['a night sky over the Brazilian countryside with the Emu (Ema) shaped dark constellation along the Milky Way, Guarani sky tradition', 'Constelação indígena da Ema no céu'],
  'A constelação da Ema': ['a night sky over the Brazilian countryside with the Emu (Ema) shaped dark constellation along the Milky Way', 'Constelação indígena da Ema no céu'],
  'Muitos povos indígenas': ['an indigenous family in a Brazilian field at dusk looking at the starry sky with the Milky Way', 'Povo indígena observando as estrelas'],
  'Para que alguns povos indígenas': ['an indigenous family in a Brazilian field at dusk looking at the starry sky with the Milky Way', 'Povo indígena observando as estrelas'],
  'Cite uma constelação indígena': ['a night sky over the Brazilian countryside with the Emu (Ema) shaped dark constellation along the Milky Way', 'Constelação indígena da Ema'],
  'Ligue cada movimento': ['the Earth rotating on its axis with day and night sides, and the Earth orbiting around the Sun, two panels', 'Rotação e translação da Terra'],
  'Os eclipses acontecem': ['a solar eclipse diagram with the Sun, Moon and Earth aligned in a row', 'Eclipse com Sol, Lua e Terra alinhados'],
  'O eclipse solar ocorre': ['a solar eclipse diagram with the Sun, Moon and Earth aligned in a row', 'Eclipse solar'],
  'A Lua atrai a água': ['the Earth with oceans bulging toward the Moon, tides illustration, simple and clear', 'Maré causada pela Lua'],
  'As marés são causadas': ['the Earth with oceans bulging toward the Moon, tides illustration, simple and clear', 'Maré causada pela Lua'],
  'Por que o astronauta flutua': ['an astronaut floating inside the International Space Station with Earth visible through a window', 'Astronauta flutuando na estação espacial'],
  'Ligue cada figura ao que ela é': ['three separate pictures: a bright yellow sun, a crescent moon in the night sky, and the blue planet Earth', 'Sol, Lua e Terra'],
  'De dia, vemos no céu': ['a day sky with the sun and a night sky with the moon and stars, two panels', 'Céu de dia e céu de noite'],
  'À noite, vemos no céu': ['a day sky with the sun and a night sky with the moon and stars, two panels', 'Céu de dia e céu de noite'],
  'A Lei da Gravitação': ['two planets of different sizes attracting each other with arrows, simple physics illustration', 'Atração gravitacional entre corpos'],
  'A zona habitável': ['a star with a ring-shaped habitable zone around it, with a blue Earth-like planet inside the ring and others outside', 'Zona habitável de uma estrela'],
  'Classifique os planetas': ['a row of rocky planets (Mercury, Earth, Mars) next to a row of giant gas planets (Jupiter, Saturn, Uranus)', 'Planetas rochosos e planetas gasosos'],
  'Relacione a tecnologia': ['a satellite orbiting Earth and a rover exploring the surface of Mars', 'Satélite e sonda espacial'],
  'Peso = massa': ['an astronaut standing on Earth and an astronaut standing on the Moon, with a bathroom scale for each', 'Pesar na Terra e na Lua'],
  'Na Lua (g': ['an astronaut standing on the Moon next to a scale', 'Astronauta na Lua'],
  'P = m': ['an astronaut on Mars next to a scale, red rocky landscape', 'Astronauta em Marte'],
  'Essa mesma pessoa em Marte': ['an astronaut on Mars next to a scale, red rocky landscape', 'Astronauta em Marte'],
  'Explique por que a MASSA': ['an astronaut jumping on the Moon surface beside a lunar base module', 'Astronauta e base lunar'],
  'Monte uma proposta de missão': ['a spacecraft approaching the icy moon Europa with Jupiter huge in the background', 'Nave chegando a Europa, lua de Júpiter'],
  'Cite duas condições': ['a blue-green Earth-like planet with clouds, oceans and a glowing star in the distance', 'Planeta com água e atmosfera'],
};
const crypto = require('crypto');
const chaveImg = p => crypto.createHash('sha1').update(String(p)).digest('hex').slice(0, 12);
const IMG_LISTA = {};   // chave -> {k, p, alt}
ALUNOS.forEach(a => a.itens.forEach(q => {
  const k = Object.keys(IMGS).find(t => q.enunciado.indexOf(t) === 0); if (!k) return;
  const [p, alt] = IMGS[k], ck = chaveImg(p); q.img = { k: ck, alt }; IMG_LISTA[ck] = { k: ck, p, alt };
}));
const BUSCA = {"Aparelhos elétricos em casa": ["household appliances kitchen", "refrigerator kitchen"], "Astronauta e base lunar": ["astronaut Moon Apollo", "Apollo 17 astronaut"], "Astronauta em Marte": ["Mars rover surface panorama", "Mars surface"], "Astronauta flutuando na estação espacial": ["astronaut International Space Station weightless", "ISS astronaut floating"], "Astronauta na Lua": ["Apollo astronaut Moon surface", "Buzz Aldrin Moon"], "Astronauta saltando na Lua": ["Apollo 16 astronaut jump salute Moon", "astronaut Moon Earth"], "Atração gravitacional entre corpos": ["gravity Earth Moon orbit diagram", "gravitation diagram"], "Bairro com água tratada, esgoto e coleta de lixo": ["garbage truck street collection", "water treatment plant"], "Balões eletrizados se repelindo": ["static electricity balloon hair", "balloon static electricity"], "Bola caindo": ["ball falling gravity", "falling ball"], "Circuito em série e circuito em paralelo": ["series and parallel circuits diagram", "parallel circuit diagram"], "Circuito simples com pilha, fios e lâmpada": ["simple electric circuit battery bulb", "electric circuit light bulb battery"], "Constelação indígena da Ema": ["Emu in the sky dark constellation", "Milky Way dark constellation emu"], "Constelação indígena da Ema no céu": ["Emu in the sky dark constellation", "Milky Way southern sky"], "Criança puxando a mão de uma panela quente": ["hot pan stove kitchen", "cooking pot stove"], "Criança usando visão, audição, olfato, paladar e tato": ["five senses", "human senses diagram"], "Céu de dia e céu de noite": ["blue sky sun clouds daytime", "sun in the sky"], "Dois ímãs se repelindo": ["magnets repelling", "bar magnets poles"], "Eclipse com Sol, Lua e Terra alinhados": ["solar eclipse diagram", "solar eclipse geometry"], "Eclipse solar": ["total solar eclipse", "solar eclipse corona"], "Eletrização por atrito e ímãs": ["static electricity hair comb", "magnet iron filings"], "Enfermeira vacinando uma criança": ["child vaccination nurse", "vaccination child"], "Fases da Lua": ["Moon phases", "lunar phases"], "Fio de cobre, copo de plástico, luva de borracha e prego": ["copper wire", "rubber gloves"], "Gravidade puxando a bola": ["gravity ball falling", "free fall ball"], "Lixeira e rua suja": ["litter street trash", "garbage bin street"], "Lâmpada acesa": ["incandescent light bulb lit", "light bulb glowing"], "Lâmpada, ferro de passar e ventilador": ["electric iron", "desk fan"], "Lâmpada, ferro de passar, ventilador e rádio": ["electric iron", "desk fan"], "Maré causada pela Lua": ["tides Moon Earth diagram", "tide diagram"], "Mãos limpas com sabão e mãos sujas": ["handwashing soap", "hand washing"], "Mãos molhadas perto de uma tomada": ["electrical outlet wall", "electric socket Brazil"], "Nave chegando a Europa, lua de Júpiter": ["Europa moon Jupiter", "Europa Jupiter moon"], "Neurônio com dendritos, corpo celular e axônio": ["neuron diagram", "neuron structure"], "Passos para lavar as mãos": ["handwashing steps", "washing hands soap"], "Pesar na Terra e na Lua": ["astronaut Moon Apollo", "bathroom scale"], "Pilha e tomada": ["AA battery", "electrical outlet"], "Planeta com água e atmosfera": ["Earth Blue Marble", "Earth from space"], "Planetas rochosos e planetas gasosos": ["planets of the solar system", "terrestrial planets"], "Povo indígena observando as estrelas": ["Milky Way night sky Brazil", "night sky stars Milky Way"], "Rotação e translação da Terra": ["Earth rotation axis diagram", "Earth orbit seasons diagram"], "Satélite e sonda espacial": ["satellite orbiting Earth", "Mars rover Curiosity"], "Sol e os quatro primeiros planetas": ["inner planets solar system", "Mercury Venus Earth Mars"], "Sol e petróleo": ["sun solar panels", "oil pumpjack"], "Sol, Lua e Terra": ["Sun Moon Earth", "Earth Moon Sun space"], "Sol, Terra e Lua": ["Sun Moon Earth", "Earth Moon Sun space"], "Sol, petróleo e carvão": ["solar panels", "coal mine"], "Sol, vento, rio, petróleo, carvão e cana-de-açúcar": ["renewable energy sources", "wind turbine solar panels"], "Tomada e caderno": ["electrical outlet", "school notebook"], "Tomadas com aparelhos ligados": ["power strip plugs", "electrical outlets plugs"], "Usina hidrelétrica": ["hydroelectric dam", "Itaipu dam"], "Usina hidrelétrica levando energia até uma lâmpada": ["hydroelectric power plant", "Itaipu dam"], "Usina, torres de energia e lâmpada em casa": ["electricity transmission tower", "hydroelectric power plant"], "Usina, torres de energia e ventilador em casa": ["electricity transmission tower", "hydroelectric power plant"], "Vacina e doce": ["vaccine syringe", "vaccine vial"], "Vento, Sol e petróleo": ["wind turbine", "solar panels"], "Vírus e bactérias vistos ao microscópio": ["virus bacteria microscope", "bacteria electron microscope"], "Vírus, bactérias e vacina": ["virus bacteria microscope", "vaccine syringe"], "Zona habitável de uma estrela": ["habitable zone diagram", "habitable zone"], "Água filtrada e poça de lama": ["water filter glass of water", "muddy puddle"], "Ímã atraindo pregos e clipes": ["magnet paper clips", "magnet attracting nails"], "Ímã e linhas de campo magnético": ["magnetic field lines iron filings", "iron filings magnet"], "Ímã, prego e borracha": ["magnet iron nail", "bar magnet"]};
const buscaImagem = k => IMG_LISTA[k] ? (BUSCA[IMG_LISTA[k].alt] || []) : [];
const imagens = () => Object.values(IMG_LISTA);
const promptImagem = k => IMG_LISTA[k] ? IMG_LISTA[k].p : null;

/* ---------- consulta ---------- */
function achar(turma, nome) {
  const t = chaveTurma(turma), n = chaveNome(nome);
  return ALUNOS.find(a => a.turma === t && chaveNome(a.nome) === n) || null;
}
/* nomes de PEI que ainda não aparecem na lista da turma (comparação tolerante) */
function nomesFaltando(turma, nomesExistentes) {
  const t = chaveTurma(turma), tem = new Set((nomesExistentes || []).map(chaveNome));
  return ALUNOS.filter(a => a.turma === t && !tem.has(chaveNome(a.nome))).map(a => a.nome);
}
function turmasExtras() { return [...new Set(ALUNOS.map(a => a.turma))]; }

module.exports = { imagens, promptImagem, buscaImagem, achar, nomesFaltando, turmasExtras, chaveTurma, chaveNome, ALUNOS };
