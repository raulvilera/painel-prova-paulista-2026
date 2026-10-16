/* Simulado SARESP adaptado (Fundamental) para alunos com PEI. Só no servidor.
   Mesmas habilidades do Simulado SARESP de cada série, em linguagem simples, com formatos que o PEI de cada aluno permite.
   As opções de acessibilidade (voz, fonte, pausas…) são as mesmas da atividade adaptada do aluno. */
module.exports = function ({ O, VF, AS, OR, DI }) {
  const I = (q, spec, alt) => Object.assign(q, { imgc: spec, imgalt: alt });   // imgc: artigos da Wikipédia (ver _pei.js)
  const L = [];
  const add = (turma, nome, desc, itens) => L.push({ turma, nome, desc, itens });

  /* ---------------- 6º ano ---------------- */
  add('6º Ano A', 'ANA BÁRBARA SAÚGO DE OLIVEIRA', 'Terra, rochas, célula, sistema nervoso e visão', [
    I(AS('Ligue cada camada da Terra ao que ela é.', ['Crosta', 'Manto', 'Núcleo'], ['camada mais fina, onde vivemos', 'camada de rochas quentes e magma', 'parte central e muito quente'], [0, 1, 2], 'Escolha a descrição de cada camada.', 'A crosta é a camada externa; o manto fica abaixo dela; o núcleo está no centro.'), 'en:Structure of Earth|en:Earth', 'Camadas da Terra'),
    I(O('A Terra gira em torno de si mesma. O que isso faz acontecer?', ['o dia e a noite', 'o inverno e o verão', 'os eclipses'], 0, 'A rotação da Terra faz o dia e a noite.'), 'en:Sunrise|en:Daytime', 'Amanhecer'),
    I(AS('Ligue cada tipo de rocha a como ela se forma.', ['Ígnea (magmática)', 'Sedimentar', 'Metamórfica'], ['vem do magma que esfria', 'forma-se por camadas de sedimentos', 'muda por calor e pressão'], [0, 1, 2], 'Escolha como cada rocha se forma.', 'Ígnea vem do magma; sedimentar de camadas de sedimentos; metamórfica muda por calor e pressão.'), 'en:Rock (geology)|en:Granite', 'Rochas'),
    I(AS('Complete com a parte da célula.', ['Controla a célula: ___', 'Envolve e protege a célula: ___', 'Parte gelatinosa onde ocorrem reações: ___'], ['núcleo', 'membrana plasmática', 'citoplasma'], [0, 1, 2], 'Escolha a palavra de cada linha.', 'O núcleo controla; a membrana protege; o citoplasma abriga as reações.'), 'en:Cell (biology)|en:Eukaryote', 'Célula'),
    I(VF('O sistema nervoso central é formado pelo encéfalo e pela medula espinhal.', true, 'Encéfalo e medula espinhal formam o sistema nervoso central.'), 'en:Spinal cord|en:Human brain', 'Encéfalo e medula'),
    I(DI('Explique com suas palavras como conseguimos enxergar um objeto.', 'A luz bate no objeto e chega aos olhos; atravessa a córnea e a pupila, o cristalino foca a imagem na retina e o nervo óptico leva a informação ao cérebro, que interpreta.', ['luz chega aos olhos', 'retina ou nervo óptico', 'cérebro interpreta a imagem']), 'en:Human eye|en:Eye', 'Olho humano'),
  ]);

  /* ---------------- 7º ano ---------------- */
  add('7º Ano A', 'YASMIM MANGILI SILVA', 'Ar, calor, placas tectônicas, efeito estufa, vacinação e fotossíntese', [
    I(AS('Complete sobre o ar que nos envolve.', ['Gás mais abundante no ar: ___', 'Gás que respiramos para viver: ___', 'Gás que as plantas usam na fotossíntese: ___'], ['nitrogênio', 'oxigênio', 'gás carbônico'], [0, 1, 2], 'Escolha o gás de cada linha.', 'O ar tem cerca de 78% de nitrogênio e 21% de oxigênio; as plantas usam gás carbônico.'), 'en:Atmosphere of Earth', 'Atmosfera'),
    I(O('Ao colocar uma colher de metal numa panela quente, o cabo também esquenta. Esse calor se propaga por…', ['condução', 'convecção', 'irradiação'], 0, 'No metal o calor passa de partícula a partícula: é condução.'), 'en:Thermal conduction|en:Heat transfer', 'Calor passando pelo metal'),
    I(VF('Terremotos e vulcões acontecem com mais frequência nas bordas das placas tectônicas.', true, 'É nas bordas das placas que elas se chocam, se afastam ou deslizam.'), 'en:Plate tectonics', 'Placas tectônicas'),
    I(O('Qual ação humana aumenta o efeito estufa?', ['queimar combustíveis fósseis', 'plantar árvores', 'usar energia solar'], 0, 'Queimar combustíveis lança gás carbônico, que reforça o efeito estufa.'), 'en:Greenhouse effect|en:Air pollution', 'Poluição e efeito estufa'),
    I(O('Por que a vacinação de muitas pessoas protege toda a comunidade?', ['porque diminui a circulação do agente da doença', 'porque cura quem já está doente na hora', 'porque substitui a higiene'], 0, 'Com muita gente imunizada, o agente da doença circula menos.'), 'en:Herd immunity|en:Vaccination', 'Vacinação'),
    I(DI('Por que a fotossíntese é importante para os seres vivos?', 'Produz o alimento das plantas (glicose) e libera oxigênio, que muitos seres vivos usam para respirar; é a base das cadeias alimentares.', ['produz alimento ou glicose', 'libera oxigênio']), 'en:Photosynthesis|en:Leaf', 'Fotossíntese'),
  ]);
  add('7º Ano A', 'HENRIQUE VIANA LEITE', 'Ar, calor, plantas, vacina e poluição', [
    I(O('Qual gás precisamos respirar para viver?', ['oxigênio', 'fumaça', 'poeira'], 0, 'Respiramos oxigênio.'), 'en:Oxygen|en:Breathing', 'Respiração'),
    I(O('De onde vem o calor que aquece a Terra?', ['do Sol', 'da Lua', 'das nuvens'], 0, 'O calor e a luz chegam do Sol.'), 'en:Sun|en:Sunlight', 'Sol'),
    I(O('O que a planta precisa para fazer o seu alimento?', ['luz do sol, água e ar', 'só terra', 'só sombra'], 0, 'A planta usa luz, água e gás carbônico do ar.'), 'en:Photosynthesis|en:Plant', 'Planta'),
    I(O('A vacina serve para…', ['proteger contra doenças', 'dar sono', 'crescer mais rápido'], 0, 'A vacina protege contra doenças.'), 'en:Vaccination|en:Vaccine', 'Vacina'),
    I(O('O que ajuda a diminuir a poluição do ar?', ['andar a pé ou de bicicleta', 'queimar lixo', 'deixar o carro ligado parado'], 0, 'Andar a pé ou de bicicleta não solta fumaça.'), 'en:Bicycle|en:Air pollution', 'Bicicleta'),
  ]);

  /* ---------------- 8º ano ---------------- */
  const circuito = () => I(AS('Ligue cada parte do circuito elétrico à sua função.', ['Pilha', 'Fio', 'Lâmpada', 'Interruptor'], ['fornece a energia', 'leva a corrente elétrica', 'acende quando passa corrente', 'liga e desliga o circuito'], [0, 1, 2, 3], 'Escolha a função de cada parte.', 'A pilha fornece energia, o fio conduz, a lâmpada transforma em luz e o interruptor abre ou fecha o circuito.'), 'en:Electrical network|en:Electronic circuit', 'Circuito elétrico');
  const equip = () => I(AS('Ligue cada aparelho à energia que ele produz.', ['Chuveiro elétrico', 'Ventilador', 'Lâmpada', 'Rádio'], ['calor', 'movimento', 'luz', 'som'], [0, 1, 2, 3], 'Escolha a energia de cada aparelho.', 'Chuveiro: calor; ventilador: movimento; lâmpada: luz; rádio: som.'), 'en:Home appliance', 'Aparelhos elétricos');
  const consumo = () => I(O('Um aparelho de 1000 W (1 kW) fica ligado 2 horas. Quanta energia ele consome?', ['2 kWh', '1 kWh', '0,5 kWh'], 0, 'Energia = potência × tempo: 1 kW × 2 h = 2 kWh.'), 'en:Kilowatt hour|en:Electricity meter', 'Medidor de energia');
  const fontes = () => I(AS('Classifique cada fonte de energia.', ['Sol', 'Carvão mineral', 'Vento', 'Petróleo'], ['renovável', 'não renovável'], [0, 1, 0, 1], 'Escolha: renovável ou não renovável.', 'Sol e vento se renovam; carvão e petróleo levam milhões de anos para se formar.'), 'en:Renewable energy|en:Wind power', 'Fontes de energia');
  const digestao = () => I(OR('Coloque na ordem o caminho do alimento no corpo.', ['Boca (mastigação)', 'Esôfago', 'Estômago', 'Intestino delgado', 'Intestino grosso']), 'en:Human digestive system|en:Digestion', 'Sistema digestório');
  const lua = () => I(O('Quando vemos a Lua toda iluminada da Terra, ela está na fase…', ['cheia', 'nova', 'quarto crescente'], 0, 'Na lua cheia vemos toda a face iluminada.'), 'en:Full moon|en:Lunar phase', 'Lua cheia');
  const clima = () => I(DI('Cite uma ação que ajuda a diminuir as mudanças climáticas.', 'Plantar árvores, evitar queimadas, usar menos combustíveis fósseis, usar transporte coletivo ou bicicleta, reciclar e usar energia renovável.', ['uma ação que reduz emissões ou protege florestas']), 'en:Climate change mitigation|en:Reforestation', 'Ação pelo clima');

  add('8º Ano A', 'CARLOS EDUARDO MENEZES MACHADO', 'Circuito, aparelhos, consumo, fontes de energia, Lua e clima', [circuito(), equip(), fontes(), consumo(), lua(), clima()]);
  add('8º Ano A', 'MATHEUS KAUÃ DOS SANTOS NASCIMENTO', 'Circuito, aparelhos, consumo, digestão, Lua e clima', [circuito(), equip(), consumo(), digestao(), lua(), clima()]);
  add('8º Ano B', 'CRISTIANO MARQUES BATISTA DE SOUZA', 'Aparelhos, fontes, circuito, Lua, consumo e clima', [equip(), fontes(), circuito(), lua(), consumo(), clima()]);
  add('8º Ano B', 'DANIEL RODRIGUES SANTOS DIAS', 'Aparelhos, fontes, Lua e clima', [
    I(O('Qual aparelho transforma energia elétrica em luz?', ['lâmpada', 'ventilador', 'rádio'], 0, 'A lâmpada produz luz.'), 'en:Light bulb|en:LED lamp', 'Lâmpada'),
    I(AS('Classifique cada fonte de energia.', ['Sol', 'Vento', 'Petróleo'], ['renovável', 'não renovável'], [0, 0, 1], 'Escolha: renovável ou não renovável.', 'Sol e vento se renovam; o petróleo pode acabar.'), 'en:Solar power|en:Wind power', 'Sol e vento'),
    I(O('Para a lâmpada acender, o circuito deve estar…', ['fechado', 'aberto', 'molhado'], 0, 'Com o circuito fechado a corrente passa.'), 'en:Electrical network|en:Electronic circuit', 'Circuito'),
    lua(),
    I(O('O que ajuda o planeta a ter menos poluição?', ['plantar árvores', 'queimar lixo', 'jogar lixo no rio'], 0, 'As árvores ajudam a limpar o ar.'), 'en:Tree|en:Reforestation', 'Árvores'),
  ]);
  add('8º Ano B', 'ISAAC BONFIM VIDOTTO', 'Luz, fontes de energia, pilha e Lua', [
    I(O('Qual aparelho produz luz?', ['lâmpada', 'ventilador', 'geladeira'], 0, 'A lâmpada produz luz.'), 'en:Electric light|en:Light bulb', 'Lâmpada acesa'),
    I(O('Qual fonte de energia nunca acaba?', ['o Sol', 'o petróleo', 'o carvão'], 0, 'O Sol é renovável.'), 'en:Sun|en:Solar energy', 'Sol'),
    I(O('Em um circuito, a pilha serve para…', ['dar energia', 'cortar o fio', 'esfriar a lâmpada'], 0, 'A pilha fornece a energia.'), 'en:Battery (electricity)|en:Electric battery', 'Pilha'),
    I(O('Quando a Lua aparece toda redonda e clara, ela está…', ['cheia', 'nova', 'escondida'], 0, 'É a lua cheia.'), 'en:Full moon', 'Lua cheia'),
    I(O('Plantar árvores ajuda o planeta?', ['sim', 'não', 'só de noite'], 0, 'As árvores ajudam a limpar o ar e a esfriar o ambiente.'), 'en:Tree|en:Forest', 'Floresta'),
  ]);

  /* ---------------- 9º ano ---------------- */
  const sol = () => I(AS('Complete sobre o Sistema Solar.', ['Planeta mais perto do Sol: ___', 'Planeta conhecido pelos anéis: ___', 'Planeta onde vivemos: ___', 'Planeta vermelho: ___'], ['Mercúrio', 'Saturno', 'Terra', 'Marte'], [0, 1, 2, 3], 'Escolha o planeta de cada linha.', 'Mercúrio é o mais próximo do Sol; Saturno tem anéis; vivemos na Terra; Marte é o planeta vermelho.'), 'en:Solar System', 'Sistema Solar');
  const estados = () => I(AS('Ligue a mudança de estado ao seu nome.', ['Gelo derretendo', 'Água fervendo', 'Vapor virando gotas'], ['fusão', 'vaporização', 'condensação'], [0, 1, 2], 'Escolha o nome de cada mudança.', 'Gelo→água: fusão; água→vapor: vaporização; vapor→líquido: condensação.'), 'en:Phase transition|en:State of matter', 'Estados da matéria');
  const cores = () => I(O('As três cores primárias da luz são…', ['vermelho, verde e azul', 'vermelho, amarelo e azul', 'preto, branco e cinza'], 0, 'Na luz, as primárias são vermelho, verde e azul (RGB).'), 'en:RGB color model|en:Additive color', 'Cores da luz');
  const helio = () => I(O('No modelo heliocêntrico, quem fica no centro?', ['o Sol', 'a Terra', 'a Lua'], 0, 'Heliocêntrico: o Sol no centro. Geocêntrico: a Terra.'), 'en:Heliocentrism|en:Nicolaus Copernicus', 'Modelo heliocêntrico');
  const atomo = () => I(O('Qual partícula do átomo tem carga elétrica negativa?', ['elétron', 'próton', 'nêutron'], 0, 'O elétron é negativo; o próton é positivo; o nêutron é neutro.'), 'en:Atom|en:Electron', 'Átomo');
  const mendel = () => I(O('Quem estudou ervilhas e criou as leis da hereditariedade?', ['Gregor Mendel', 'Charles Darwin', 'Isaac Newton'], 0, 'Mendel cruzou ervilhas e descobriu as leis da herança.'), 'en:Gregor Mendel|en:Pea', 'Gregor Mendel');
  const darwin = () => I(VF('Para Darwin, os seres mais adaptados ao ambiente costumam sobreviver e deixar mais descendentes.', true, 'É a ideia de seleção natural.'), 'en:Charles Darwin|en:Natural selection', 'Charles Darwin');
  const marte = (n) => I(DI(n === 1 ? 'Cite uma dificuldade para as pessoas viverem em Marte.' : 'Cite duas dificuldades para as pessoas viverem em Marte.', 'Atmosfera sem oxigênio para respirar, frio extremo, pouca água líquida, radiação intensa e gravidade menor que a da Terra.', n === 1 ? ['uma dificuldade correta'] : ['primeira dificuldade correta', 'segunda dificuldade correta']), 'en:Colonization of Mars|en:Mars', 'Marte');
  const reacao = () => I(O('Em uma reação química feita num recipiente fechado, a massa total antes e depois…', ['se conserva', 'aumenta', 'desaparece'], 0, 'Lei de Lavoisier: a massa total se conserva.'), 'en:Antoine Lavoisier|en:Chemical reaction', 'Reação química');
  const radiacao = () => I(O('Qual radiação eletromagnética nos permite ver as cores?', ['a luz visível', 'os raios gama', 'as ondas de rádio'], 0, 'A luz visível é a parte do espectro que enxergamos.'), 'en:Electromagnetic spectrum|en:Rainbow', 'Espectro eletromagnético');

  add('9º Ano A', 'YURI GABRIEL DE MORAES PONGOLINO', 'Sistema Solar, estados da matéria, luz, modelos do universo e vida fora da Terra', [sol(), estados(), cores(), helio(), mendel(), marte(1)]);
  add('9º Ano A', 'ESTHER CRISTINE SILVA RIBEIRO', 'Sistema Solar, estados da matéria, átomo, luz e Darwin', [sol(), estados(), atomo(), cores(), darwin(), helio()]);
  add('9º Ano B', 'DANILO SANTOS DA CONCEIÇÃO', 'Sistema Solar, modelos do universo, estados da matéria e luz', [sol(), helio(), estados(), radiacao(), darwin(), marte(1)]);
  add('9º Ano B', 'MUNIQUE CRISTINA LUCAS', 'Planeta Terra, Sistema Solar, água e luz', [
    I(O('Em qual planeta nós vivemos?', ['Terra', 'Marte', 'Júpiter'], 0, 'Vivemos no planeta Terra.'), 'en:Earth', 'Planeta Terra'),
    I(O('O que fica no centro do Sistema Solar?', ['o Sol', 'a Lua', 'a Terra'], 0, 'O Sol fica no centro.'), 'en:Sun|en:Solar System', 'O Sol'),
    I(O('A água vira gelo quando fica…', ['muito fria', 'muito quente', 'parada na panela'], 0, 'A água congela quando esfria bastante.'), 'en:Ice|en:Freezing', 'Gelo'),
    I(O('No arco-íris, a luz do Sol aparece com…', ['muitas cores', 'uma só cor', 'nenhuma cor'], 0, 'A luz branca se separa em várias cores.'), 'en:Rainbow', 'Arco-íris'),
    I(O('Para viver em Marte, uma pessoa precisaria levar…', ['ar para respirar e roupa especial', 'apenas um casaco', 'nada'], 0, 'Em Marte não há ar respirável nem calor suficiente.'), 'en:Mars|en:Space suit', 'Marte'),
  ]);
  add('9º Ano B', 'VITÓRIA MENEZES BRANDÃO', 'Átomo, reações, hereditariedade, luz, modelos do universo e vida fora da Terra', [atomo(), reacao(), mendel(), radiacao(), helio(), marte(2)]);
  add('9º Ano B', 'PAULO CELSO DA COSTA JUNIOR', 'Átomo, reações, luz, radiações, estados da matéria e vida fora da Terra', [atomo(), reacao(), cores(), radiacao(), estados(), marte(2)]);
  add('9º Ano B', 'NICOLAS PENTEADO', 'Investigação: reações, hereditariedade, radiações, modelos do universo e vida fora da Terra', [
    I(O('Na reação 2 H₂ + O₂ → 2 H₂O, se 4 g de hidrogênio reagem com 32 g de oxigênio, qual é a massa de água formada?', ['36 g', '28 g', '18 g'], 0, 'Lavoisier: 4 g + 32 g = 36 g de água.'), 'en:Law of conservation of mass|en:Antoine Lavoisier', 'Conservação da massa'),
    I(O('No cruzamento Aa × Aa (A dominante), qual é a proporção esperada entre descendentes com a característica dominante e a recessiva?', ['3 : 1', '1 : 1', '1 : 3'], 0, 'AA, Aa, Aa mostram o dominante (3) e aa o recessivo (1).'), 'en:Punnett square|en:Gregor Mendel', 'Quadro de Punnett'),
    I(O('Entre estas radiações eletromagnéticas, qual tem MAIOR energia?', ['raios gama', 'luz visível', 'ondas de rádio'], 0, 'Quanto maior a frequência, maior a energia: gama > visível > rádio.'), 'en:Gamma ray|en:Electromagnetic spectrum', 'Radiações'),
    I(DI('Compare os modelos geocêntrico e heliocêntrico: qual evidência ajudou a sustentar o segundo?', 'No geocêntrico a Terra é o centro; no heliocêntrico o Sol é o centro. Galileu observou com a luneta as luas de Júpiter e as fases de Vênus, que indicam astros girando em torno do Sol.', ['define geocêntrico e heliocêntrico', 'cita uma evidência (Galileu, fases de Vênus, luas de Júpiter)']), 'en:Galileo Galilei|en:Heliocentrism', 'Galileu'),
    I(DI('Monte um argumento a favor OU contra a vida humana permanente em Marte, usando pelo menos duas condições do planeta.', 'Contra: atmosfera fina sem oxigênio, frio extremo, radiação e pouca água líquida exigem tecnologia cara. A favor: há água congelada e solo para estudo; com abrigos, oxigênio produzido e proteção contra radiação seria possível, mas difícil.', ['posição clara', 'pelo menos duas condições de Marte', 'argumento coerente']), 'en:Mars|en:Colonization of Mars', 'Marte'),
  ]);
  return L;
};
