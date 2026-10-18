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
  // uma questão por vez, estrutura previsível, sem áudio automático, pausa no meio, texto claro e literal, com desafio de maior complexidade
  nicolas: { umPorVez: true, agenda: true, fonte: 1.1, pausaA: 5, gentil: true, semPressa: true, desafio: true },
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

add('9º Ano B', 'NICOLAS PENTEADO', P.nicolas, 'SARESP 2026: Sistema Solar, estrelas, leitura do céu, vida fora da Terra e exploração espacial', [
  /* Estrutura fixa e previsível: 10 fases; cada fase diz o que fazer; exemplos de jogos aparecem sempre com a palavra "Exemplo". */
  OR('Fase 1 de 10 · Origem do Sistema Solar. Coloque as etapas da formação do Sistema Solar na ordem em que aconteceram. Toque no primeiro cartão, depois no segundo, e assim até o último.', ['Uma nuvem de gás e poeira (nebulosa) começa a se contrair pela gravidade', 'A nuvem gira mais rápido e se achata em forma de disco', 'No centro do disco, a matéria se junta e forma o Sol', 'No disco, grãos se juntam em corpos maiores (planetesimais) e formam os planetas'], 'Toque nos cartões na ordem certa.', 'A nebulosa se contrai, gira e vira um disco; o Sol se forma no centro e os planetas se formam no disco.'),
  Object.assign(O('Fase 2 de 10 · Planetas rochosos e gasosos. A tabela mostra dados de quatro planetas. Densidade é a massa dividida pelo volume. A água tem densidade 1,0 g/cm³. Um corpo com densidade menor que a da água flutuaria nela. Qual planeta da tabela flutuaria na água?', ['Júpiter', 'Saturno', 'Terra'], 1, 'Saturno tem densidade 0,69 g/cm³, menor que 1,0. Isso mostra que ele é formado principalmente por gases leves (hidrogênio e hélio) e não tem superfície sólida. Mercúrio e Terra são rochosos e densos; Júpiter (1,33 g/cm³) também é gasoso, mas mais denso que a água.', 'Escolha 1 alternativa.'), { figura: { tipo: 'tabela', titulo: 'Dados de planetas', colunas: ['Planeta', 'Diâmetro (km)', 'Densidade (g/cm³)'], linhas: [['Mercúrio', '4 879', '5,43'], ['Terra', '12 742', '5,51'], ['Júpiter', '139 820', '1,33'], ['Saturno', '116 460', '0,69']] } }),
  DI('Fase 3 de 10 · Geocentrismo e heliocentrismo. Geocentrismo é o modelo com a Terra no centro. Heliocentrismo é o modelo com o Sol no centro. Marte, visto da Terra, às vezes parece andar para trás no céu (movimento retrógrado). Explique por que o modelo heliocêntrico explica esse movimento sem precisar de ideias extras. Cite também uma observação de Galileu que apoiou o heliocentrismo.', 'No heliocentrismo, a Terra e Marte giram em torno do Sol em velocidades diferentes. Quando a Terra, mais rápida e na órbita interna, ultrapassa Marte, ele parece recuar contra as estrelas ao fundo; depois volta a avançar. É um efeito de perspectiva. Galileu observou as luas de Júpiter (astros que giram em torno de outro astro que não é a Terra) e as fases de Vênus, compatíveis com Vênus girando em torno do Sol.', ['a Terra ultrapassa Marte porque a órbita da Terra é interna e mais rápida', 'o recuo de Marte é efeito de perspectiva', 'observação de Galileu (luas de Júpiter ou fases de Vênus)'], 'Responda em até 6 linhas. Use 3 partes: 1) modelo, 2) explicação, 3) observação de Galileu.'),
  AS('Fase 4 de 10 · Ciclo de vida das estrelas. Ligue cada item ao seu destino. Escolha uma opção em cada linha.', ['Estrela com a massa do Sol, no fim da vida', 'Estrela com 10 vezes a massa do Sol, no fim da vida', 'Nuvem de gás e poeira onde estrelas nascem'], ['Nebulosa', 'Gigante vermelha e depois anã branca', 'Supernova (pode deixar estrela de nêutrons ou buraco negro)'], [1, 2, 0], 'Escolha uma opção em cada linha.', 'Estrelas parecidas com o Sol viram gigantes vermelhas e terminam como anãs brancas. Estrelas muito massivas explodem em supernova. As estrelas nascem em nebulosas.'),
  OR('Fase 5 de 10 · Vida do Sol. Coloque as etapas da vida do Sol em ordem, da primeira para a última.', ['Nebulosa', 'Protoestrela', 'Sequência principal (fase atual do Sol, queima hidrogênio)', 'Gigante vermelha', 'Anã branca'], 'Toque nos cartões na ordem certa.', 'Nebulosa → protoestrela → sequência principal → gigante vermelha → anã branca.'),
  O('Fase 6 de 10 · Leitura do céu. Constelações são desenhos que povos imaginam ao ligar estrelas. Um povo vê o desenho de um escorpião em um grupo de estrelas. Outro povo vê, no mesmo grupo, outra figura. O que esse fato mostra?', ['Existe uma única forma certa de ver as constelações', 'As estrelas de uma constelação ficam sempre juntas no espaço', 'As constelações são convenções culturais: cada povo escolhe os padrões e as histórias'], 2, 'Constelações são convenções culturais. As estrelas de uma mesma constelação costumam estar a distâncias muito diferentes da Terra; só parecem próximas no céu.', 'Escolha 1 alternativa.'),
  O('Fase 7 de 10 · Distâncias. Uma estrela está a 4 anos-luz da Terra. Ano-luz é a distância que a luz percorre em 1 ano. Exemplo em jogos online: o atraso (lag) acontece porque o sinal leva tempo para viajar. Com a luz da estrela acontece algo parecido. O que significa observar essa estrela hoje?', ['Vemos a estrela como ela é neste exato momento', 'Vemos a estrela como ela era há 4 anos', 'Vemos a estrela como ela será daqui a 4 anos'], 1, 'A luz leva 4 anos para chegar. Olhar para o céu é olhar para o passado dos astros.', 'Escolha 1 alternativa.'),
  DI('Fase 8 de 10 · Vida fora da Terra. Exemplo: um jogo de exploração espacial tem um mundo com oceano debaixo de uma camada de gelo, parecido com a lua Europa de Júpiter. Escreva 3 condições de que a vida, como a conhecemos, precisa. Depois diga qual dessas condições os cientistas teriam de comprovar primeiro nesse mundo e por quê.', 'Água líquida, fonte de energia (calor ou química) e elementos químicos essenciais (como carbono, hidrogênio, nitrogênio, oxigênio, fósforo e enxofre). Primeiro comprovar água líquida: sem ela, as outras condições de pouco servem. Aceitar outra escolha se for justificada.', ['água líquida', 'fonte de energia', 'elementos químicos essenciais ou outra condição válida', 'escolha uma condição e justifique'], 'Responda em itens: 1), 2), 3) e depois "Primeiro comprovar: ...".'),
  O('Fase 9 de 10 · Exploração espacial. Um jipe-robô em Marte (como o Perseverance) recebe ordens da Terra. O sinal viaja à velocidade da luz e leva entre 3 e 22 minutos para chegar, conforme a posição dos planetas. Exemplo: é como um jogo com ping muito alto. Qual é a consequência para quem controla o jipe?', ['O jipe pode ser controlado em tempo real, como em um joystick', 'O jipe não consegue receber nenhuma ordem da Terra', 'O jipe precisa executar tarefas sozinho entre uma ordem e outra'], 2, 'Com atraso de minutos, o controle em tempo real é impossível. O jipe recebe instruções e executa tarefas com autonomia.', 'Escolha 1 alternativa.'),
  DI('Fase 10 de 10 · Missão final. Monte uma proposta de missão para Marte, Europa (lua de Júpiter) ou Encélado (lua de Saturno). Escreva 4 itens numerados: 1) objetivo científico; 2) condições do local (temperatura, gravidade ou água); 3) riscos para a missão ou para pessoas; 4) uma pergunta que a missão responderia.', 'Resposta aberta: avaliar objetivo claro, uso de dados do local (gravidade, temperatura, água, radiação), riscos reais (radiação, comunicação, suprimentos) e uma pergunta científica (por exemplo, existe água líquida ou vida?).', ['objetivo científico', 'condições do local', 'riscos', 'pergunta científica'], 'Resposta autoral: pode ser longa. Use os 4 itens numerados.'),
], { glossario: [
  { t: 'Nebulosa', d: 'Nuvem de gás e poeira no espaço. É onde as estrelas nascem.' },
  { t: 'Geocentrismo', d: 'Modelo antigo: a Terra no centro e os astros girando em volta dela.' },
  { t: 'Heliocentrismo', d: 'Modelo atual: o Sol no centro e os planetas girando em volta dele.' },
  { t: 'Gigante vermelha', d: 'Fase em que uma estrela como o Sol incha e fica avermelhada, perto do fim da vida.' },
  { t: 'Supernova', d: 'Explosão de uma estrela muito massiva no fim da vida.' },
  { t: 'Ano-luz', d: 'Distância que a luz percorre em 1 ano.' },
  { t: 'Densidade', d: 'Quanta massa existe em cada volume. Massa dividida pelo volume.' },
] });

/* ---------- imagens (Nano Banana / Gemini) ----------
   Cada entrada: início do enunciado -> [descrição da cena em inglês, texto alternativo em português].
   As imagens são geradas uma única vez pelo professor (página /atividade-individual/preparar/) e guardadas no banco.
   Pedimos sempre imagem SEM texto, porque o gerador erra palavras em português. */
const IMGS = {
  'Fase 1 de 10': ['en:Formation and evolution of the Solar System|en:Nebular hypothesis', 'Formação do Sistema Solar a partir de uma nuvem de gás e poeira'],
  'Fase 2 de 10': ['en:Solar System|en:Planet', 'Planetas rochosos e gasosos do Sistema Solar'],
  'Fase 3 de 10': ['en:Apparent retrograde motion|en:Heliocentrism', 'Movimento retrógrado aparente de Marte'],
  'Fase 4 de 10': ['en:Stellar evolution|en:Supernova', 'Ciclo de vida das estrelas'],
  'Fase 5 de 10': ['en:Red giant|en:Sun', 'Sol e a fase de gigante vermelha'],
  'Fase 6 de 10': ['en:Constellation|en:Scorpius', 'Constelação no céu noturno'],
  'Fase 7 de 10': ['en:Light-year|en:Alpha Centauri', 'Estrelas no céu e a distância em anos-luz'],
  'Fase 8 de 10': ['en:Europa (moon)|en:Life on Europa', 'Lua Europa de Júpiter'],
  'Fase 9 de 10': ['en:Perseverance (rover)|en:Mars rover', 'Jipe-robô em Marte'],
  'Fase 10 de 10': ['en:Enceladus|en:Mars', 'Lua Encélado de Saturno'],
  'Ligue cada sentido ao órgão': ['en:Sense|en:Human eye', 'Criança usando visão, audição, olfato, paladar e tato'],
  'Complete o esquema do neurônio': ['en:Neuron', 'Neurônio com dendritos, corpo celular e axônio'],
  'O cérebro e a medula': ['en:Central nervous system', 'Cabeça com cérebro e medula espinhal'],
  'Os ossos e os músculos': ['en:Skeletal muscle|en:Muscle', 'Braço com osso e músculo'],
  'As drogas só afetam': ['en:Human brain', 'Cérebro e estômago'],
  'Dormir bem e evitar': ['en:Sleep', 'Pessoa dormindo à noite'],
  'Quando você encosta a mão': ['en:Reflex|en:Withdrawal reflex', 'Criança puxando a mão de uma panela quente'],
  'Complete as frases com a palavra certa': ['en:Virus', 'Vírus, bactérias e vacina'],
  'Ligue a doença à sua causa': ['en:Bacteria', 'Vírus e bactérias vistos ao microscópio'],
  'Qual destas ações faz parte do saneamento': ['en:Sanitation', 'Rua com cano de água, cano de esgoto e caminhão de lixo'],
  'Uma doença que atinge': ['en:Epidemic', 'Mapa com muitos casos de doença numa região'],
  'Por que tomar vacina': ['en:Vaccination|en:Vaccine', 'Enfermeira vacinando uma criança'],
  'Cite uma ação de saneamento': ['en:Sewage treatment|en:Wastewater treatment', 'Caminhão de coleta de lixo na rua'],
  'Qual ajuda a ficar saudável': ['en:Hand washing|en:Hand sanitizer', 'Mão limpa com sabão e mão suja'],
  'Qual é uma água boa para beber': ['en:Drinking water', 'Copo com água limpa e poça de lama'],
  'Qual protege contra doenças': ['en:Vaccine|en:Vaccination', 'Vacina e pirulito'],
  'Onde o lixo deve ficar': ['en:Waste container|en:Litter', 'Lixeira e lixo no chão da rua'],
  'Como lavar as mãos': ['en:Soap|en:Hand washing', 'Três passos para lavar as mãos'],
  'Como a energia chega até a lâmpada': ['en:Hydroelectricity|en:Hydroelectric power', 'Usina hidrelétrica levando energia até uma casa'],
  'Classifique cada fonte de energia': ['en:Renewable energy|en:Energy development', 'Sol, vento, rio, petróleo, carvão e cana-de-açúcar'],
  'Complete sobre cargas elétricas': ['en:Static electricity', 'Pente atritado no cabelo e ímãs'],
  'Todo ímã tem dois polos': ['en:Magnet|en:Magnetic field', 'Ímã com linhas de campo'],
  'Os polos de mesmo nome': ['en:Magnetism|en:Magnetic field', 'Dois ímãs com polos iguais frente a frente'],
  'Cargas elétricas de mesmo sinal': ['en:Static electricity|en:Balloon', 'Dois balões eletrizados'],
  'Qual objeto o ímã atrai': ['en:Magnet|en:Magnetism', 'Ímã perto de pregos e borracha'],
  'Qual atrai o prego': ['en:Ferromagnetism|en:Magnet', 'Ímã perto de pregos'],
  'A corrente que sai de uma pilha': ['en:Battery (electricity)|en:Electric battery', 'Pilha e tomada'],
  'Por que não devemos usar aparelhos elétricos': ['en:Electric shock|en:Electrical injury', 'Mão molhada perto de uma tomada'],
  'Podemos mexer em tomada': ['en:Electrical injury|en:Electric shock', 'Mão molhada perto de uma tomada'],
  'O que é perigoso com a mão molhada': ['en:AC power plugs and sockets|en:Electric shock', 'Tomada e caderno'],
  'Do início ao fim: como a energia chega ao ventilador': ['en:Electric power transmission|en:Electrical grid', 'Usina, torres de energia e ventilador'],
  'Coloque na ordem: como a energia chega à lâmpada de casa': ['en:Electricity generation|en:Power station', 'Usina, torres de energia e lâmpada'],
  'Para a lâmpada acender, o circuito deve estar': ['en:Electrical network|en:Incandescent light bulb', 'Circuito com pilha, fios e lâmpada acesa'],
  'Para acender a lâmpada, coloque na ordem': ['en:Incandescent light bulb|en:Electric light', 'Circuito com pilha, fios e lâmpada acesa'],
  'Condutor ou isolante': ['en:Electrical conductor|en:Insulator (electricity)', 'Fio de cobre, copo, luva de borracha e prego'],
  'Em um circuito em SÉRIE': ['en:Series and parallel circuits', 'Circuito com lâmpadas em série'],
  'As tomadas de uma casa': ['en:AC power plugs and sockets|en:Electrical wiring', 'Parede com tomadas e aparelhos'],
  'Explique com suas palavras a diferença entre circuito': ['en:Electrical wiring|en:Christmas lights', 'Circuitos em série e em paralelo'],
  'Ligue cada aparelho à energia': ['en:Home appliance|en:Clothes iron', 'Lâmpada, ferro, ventilador e rádio'],
  'Ligue o aparelho à energia': ['en:Clothes iron|en:Mechanical fan', 'Lâmpada, ferro e ventilador'],
  'Quando uma lâmpada acende': ['en:Incandescent light bulb', 'Lâmpada acesa'],
  'Em uma usina hidrelétrica': ['en:Hydroelectricity|en:Itaipu Dam', 'Usina hidrelétrica'],
  'Para que serve a energia elétrica em casa': ['en:Home appliance|en:Electricity', 'Aparelhos elétricos em casa'],
  'Por que dizemos que a energia': ['en:Conservation of energy|en:Pendulum', 'Energia elétrica virando luz e calor'],
  'A energia pode mudar de forma, por exemplo': ['en:Solar cell|en:Hydroelectricity', 'Energia elétrica virando movimento'],
  'A energia pode mudar de forma.': ['en:Flashlight|en:Light bulb', 'Pilha ligada a um rádio'],
  'Polos iguais de dois ímãs': ['en:Magnetism|en:Magnet', 'Dois ímãs com extremidades da mesma cor'],
  'Qual fonte de energia nunca acaba': ['en:Solar power|en:Renewable energy', 'Sol, petróleo e carvão'],
  'Qual fonte de energia pode acabar': ['en:Fossil fuel|en:Coal', 'Vento, Sol e petróleo'],
  'Qual fonte de energia vem do céu': ['en:Sun|en:Solar energy', 'Sol e petróleo'],
  'Coloque os planetas do mais perto': ['en:Solar System', 'Sol e os quatro primeiros planetas'],
  'Complete as frases.': ['en:Earth|en:Moon', 'Sol, Terra e Lua'],
  'Ligue cada astro': ['en:Earth|en:Moon', 'Sol, Terra e Lua'],
  'Muitos povos indígenas observam': ['en:Archaeoastronomy|en:Cultural astronomy|en:Stonehenge', 'Povo indígena observando as estrelas'],
  'Muitos povos indígenas olham': ['en:Milky Way|en:Night sky', 'Povo indígena observando as estrelas'],
  'Para que alguns povos indígenas': ['en:Stonehenge|en:Archaeoastronomy', 'Povo indígena observando as estrelas'],
  'A constelação da Ema': ['en:Emu in the sky|en:Dark cloud constellation|en:Milky Way', 'Constelação indígena da Ema no céu'],
  'Ligue a constelação indígena': ['en:Emu in the sky|en:Dark cloud constellation|en:Milky Way', 'Constelação indígena da Ema no céu'],
  'Cite uma constelação indígena': ['en:Dark cloud constellation|en:Emu in the sky|en:Milky Way', 'Constelação indígena da Ema'],
  'O Sol é uma estrela': ['en:Sun', 'Sol entre outras estrelas'],
  'A Lua produz luz própria': ['en:Moon', 'Lua refletindo a luz do Sol'],
  'Coloque as fases da Lua': ['en:Lunar phase', 'Fases da Lua'],
  'Se você soltar uma bola': ['en:Free fall|en:Bouncing ball', 'Bola caindo da mão de uma criança'],
  'Se soltarmos uma bola': ['en:Bouncing ball|en:Free fall', 'Bola caindo da mão de uma criança'],
  'Quem puxa a bola': ['en:Free fall|en:Galileo Galilei', 'Bola sendo puxada para a Terra'],
  'Na Lua a gravidade': ['en:Apollo program|en:Moon landing', 'Astronauta saltando na Lua'],
  'Ligue cada movimento': ['en:Earth\'s rotation|en:Axial tilt', 'Rotação e translação da Terra'],
  'A gravidade mantém': ['en:Orbit|en:Planet', 'Planetas girando em torno do Sol'],
  'Os eclipses acontecem': ['en:Eclipse', 'Sol, Lua e Terra alinhados'],
  'O eclipse solar ocorre': ['en:Solar eclipse', 'Eclipse solar'],
  'A Lua atrai a água': ['en:Tide', 'Maré causada pela Lua'],
  'As marés são causadas': ['en:Tide|en:Tidal force', 'Maré causada pela Lua'],
  'As marés altas': ['en:Wind wave|en:Sea', 'Mar com vento e Lua'],
  'A Lua orbita': ['en:Natural satellite|en:Orbit of the Moon', 'Lua girando em volta da Terra'],
  'Por que o astronauta flutua': ['en:International Space Station|en:Weightlessness', 'Astronauta flutuando na estação espacial'],
  'Ligue cada figura ao que ela é': ['en:Earth|en:Moon', 'Sol, Lua e Terra'],
  'De dia, vemos no céu': ['en:Daytime|en:Sun', 'Céu de dia e céu de noite'],
  'À noite, vemos no céu': ['en:Night sky|en:Night', 'Terra com lado iluminado e lado escuro'],
  'A Lei da Gravitação': ['en:Newton\'s law of universal gravitation|en:Isaac Newton', 'Dois corpos se atraindo'],
  'A zona habitável': ['en:Circumstellar habitable zone', 'Zona habitável de uma estrela'],
  'Classifique os planetas': ['en:Gas giant|en:Terrestrial planet', 'Planetas rochosos e planetas gasosos'],
  'Relacione a tecnologia': ['en:Satellite|en:Mars rover', 'Satélite e sonda espacial'],
  'Peso = massa': ['en:Mass versus weight|en:Weighing scale', 'Pesar na Terra e na Lua'],
  'Na Lua (g': ['en:Apollo 11|en:Moon landing', 'Astronauta na Lua ao lado de uma balança'],
  'P = m': ['en:Mars', 'Astronauta em Marte'],
  'Essa mesma pessoa em Marte': ['en:Mars rover|en:Curiosity (rover)', 'Astronauta em Marte'],
  'Explique por que a MASSA': ['en:Apollo program|en:Astronaut', 'Astronauta e base lunar'],
  'Monte uma proposta de missão': ['en:Europa (moon)|en:Europa Clipper', 'Nave chegando a Europa, lua de Júpiter'],
  'Cite duas condições': ['en:Habitability|en:Exoplanet', 'Planeta com água e atmosfera'],
  'Escolha um povo indígena': ['en:Zodiac|en:Constellation', 'Céu indígena e constelações do zodíaco'],
};
const crypto = require('crypto');
const chaveImg = p => crypto.createHash('sha1').update(String(p)).digest('hex').slice(0, 12);
const IMG_LISTA = {};   // chave -> {k, p, alt}
ALUNOS.forEach(a => a.itens.forEach(q => {
  const k = Object.keys(IMGS).find(t => q.enunciado.indexOf(t) === 0); if (!k) return;
  const [spec, alt] = IMGS[k], ck = chaveImg(spec); q.ilus = { spec, alt, k: ck }; IMG_LISTA[ck] = { k: ck, cand: spec.split('|'), alt };
}));

/* ---------- consulta ---------- */
function achar(turma, nome, modo) {
  const t = chaveTurma(turma), n = chaveNome(nome);
  const a = ALUNOS.find(x => x.turma === t && chaveNome(x.nome) === n) || null;
  if (!a || modo !== 'simulado') return a;
  const sm = SIMULADO.find(x => x.turma === t && chaveNome(x.nome) === n);
  return sm ? Object.assign({}, a, { desc: sm.desc, itens: sm.itens, simulado: true }) : null;
}
/* nomes de PEI que ainda não aparecem na lista da turma (comparação tolerante) */
function nomesFaltando(turma, nomesExistentes) {
  const t = chaveTurma(turma), tem = new Set((nomesExistentes || []).map(chaveNome));
  return ALUNOS.filter(a => a.turma === t && !tem.has(chaveNome(a.nome))).map(a => a.nome);
}
function turmasExtras() { return [...new Set(ALUNOS.map(a => a.turma))]; }

/* ---------- Zlata (8º A): tudo em russo ---------- */
const RU = require('./_pei-ru.js')({ O, VF, AS, OR, DI });
const FLAGS_RU = { lang: 'ru', voz: true, gentil: true, semPressa: true };   // todas as questões na mesma página, como nos demais alunos
RU.atividade.forEach(q => { if (!q.imgc) return; const ck = chaveImg(q.imgc); q.ilus = { spec: q.imgc, alt: q.imgalt, k: ck }; IMG_LISTA[ck] = { k: ck, cand: q.imgc.split('|'), alt: q.imgalt }; });
ALUNOS.push({ turma: '8A', nome: 'ZLATA EVGENIEVNA SAFOROVA', flags: FLAGS_RU, desc: 'Энергия: превращения, источники и электрические цепи', itens: RU.atividade });

/* ---------- Simulado SARESP adaptado ---------- */
const SIMULADO = require('./_pei-sim.js')({ O, VF, AS, OR, DI }).map(s => ({ turma: chaveTurma(s.turma), nome: s.nome, desc: s.desc, itens: s.itens }));
SIMULADO.push({ turma: '8A', nome: 'ZLATA EVGENIEVNA SAFOROVA', desc: 'SARESP: энергия и электричество', itens: RU.simulado });
SIMULADO.forEach(a => a.itens.forEach(q => {
  const [spec, alt] = [q.imgc, q.imgalt]; if (!spec) return; const ck = chaveImg(spec); q.ilus = { spec, alt, k: ck }; IMG_LISTA[ck] = { k: ck, cand: spec.split('|'), alt };
}));
const AUTO = require('./_img-auto.js');
const candidatos = k => IMG_LISTA[k] ? IMG_LISTA[k].cand : AUTO.candidatos(k);
module.exports = { candidatos, achar, nomesFaltando, turmasExtras, chaveTurma, chaveNome, ALUNOS };
