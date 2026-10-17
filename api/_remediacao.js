/* Tarefas de remediação por descritor e por nível do aluno.
   Nível 0: ligar/associar com exemplo guiado · 1: ordenar ou calcular passo a passo · 2: interpretar dados/tabela · 3: explicar/argumentar.
   Escolhidas a partir dos descritores com pior resultado em cada série (painel_dados). Gabarito fica só no servidor. */
const CAT = require('./_catalogo-indiv.js');
const O = (enunciado, alts, correta, explicacao, comando) => ({ tipo: 'obj', enunciado, comando: comando || 'Escolha a resposta certa.', alts, correta, explicacao: explicacao || '' });
const AS = (enunciado, itens, banco, correta, explicacao) => ({ tipo: 'assoc', enunciado, comando: 'Escolha, para cada linha, a opção certa.', itens, banco, correta, explicacao: explicacao || '' });
const OR = (enunciado, passos, explicacao) => {
  const n = passos.length, d = Math.max(1, Math.floor(n / 2)), mostra = passos.map((_, i) => passos[(i + d) % n]);
  return { tipo: 'ordem', enunciado, comando: 'Toque nos cartões na ordem certa.', passos: mostra, correta: passos.map((_, k) => mostra.indexOf(passos[k])), explicacao: explicacao || '' };
};
const DI = (enunciado, ref, conceitos) => ({ tipo: 'dis', enunciado, comando: 'Escreva ou fale a sua resposta.', ref, conceitos });

const DEF = [
  ['6', 'Reconhecer os efeitos da gravidade', [
    AS('A gravidade é a força que puxa os corpos uns para os outros. Exemplo: uma bola solta da mão cai no chão.', ['Uma bola solta da mão', 'A Lua em volta da Terra', 'Os planetas em volta do Sol'], ['Cai em direção ao chão', 'Fica em órbita da Terra', 'Fica em órbita do Sol'], [0, 1, 2]),
    OR('Ordene o que acontece quando você solta uma maçã.', ['Você solta a maçã', 'A gravidade da Terra puxa a maçã para baixo', 'A maçã vai ficando mais rápida na queda', 'A maçã atinge o chão']),
    O('A tabela mostra o peso de um mesmo astronauta: Terra, 700 N; Lua, 115 N; Júpiter, 1 770 N. O que explica a diferença?', ['A massa do astronauta muda em cada astro', 'A gravidade é diferente em cada astro, porque a massa de cada um é diferente', 'O astronauta fica mais alto na Lua', 'Não existe gravidade na Lua'], 1, 'O peso depende da gravidade local; a massa do astronauta é a mesma.'),
    DI('Um colega diz: "Na Lua não tem gravidade, por isso os astronautas flutuam". Você concorda? Explique.', 'Não concordo. A Lua tem gravidade, cerca de um sexto da gravidade da Terra, por isso os astronautas dão saltos longos e lentos, mas não flutuam. A gravidade da Terra também mantém a Lua em órbita.', ['a Lua tem gravidade, menor que a da Terra', 'a gravidade depende da massa do astro', 'a gravidade mantém corpos em órbita'])]],
  ['6', 'Relacionar o movimento de rotação', [
    AS('A Terra gira em torno do próprio eixo. A parte voltada para o Sol está iluminada.', ['Movimento da Terra em torno do próprio eixo', 'Parte da Terra iluminada pelo Sol', 'Parte da Terra sem luz do Sol'], ['É dia', 'É noite', 'Rotação'], [2, 0, 1]),
    OR('Ordene o que acontece em um local da Terra ao longo de um dia.', ['O Sol ilumina o lado da Terra onde você está (dia)', 'A Terra gira e o local sai da região iluminada', 'Anoitece no local', 'A rotação continua e o local volta a ser iluminado', 'Amanhece']),
    O('A Terra dá uma volta completa em torno do eixo em cerca de 24 horas. Em uma cidade o Sol nasce às 6 h. Quanto tempo se passa até o Sol nascer de novo no mesmo local?', ['12 horas', '24 horas', '365 dias', '30 dias'], 1, 'Uma rotação completa leva cerca de 24 horas.'),
    DI('Explique por que, quando é dia no Brasil, é noite no Japão. Use a palavra rotação.', 'A Terra é uma esfera e gira (rotação). O Sol ilumina só metade dela de cada vez: enquanto o Brasil está no lado iluminado, o Japão está no lado oposto, sem luz.', ['a Terra gira (rotação)', 'o Sol ilumina só uma metade da Terra', 'lados opostos têm dia e noite diferentes'])]],
  ['7', 'Reconhecer o funcionamento de máquinas simples', [
    AS('Máquinas simples ajudam a fazer força com menos esforço. Exemplo: uma rampa é um plano inclinado.', ['Rampa de acesso', 'Gangorra', 'Roldana de poço'], ['Plano inclinado', 'Alavanca', 'Roldana (polia)'], [0, 1, 2]),
    OR('Ordene como levantar uma pedra pesada com uma alavanca.', ['Coloque o apoio perto da pedra', 'Encaixe a barra sob a pedra', 'Empurre a outra ponta da barra para baixo', 'A pedra se levanta']),
    O('Para subir o mesmo barril até a mesma altura, Ana usa uma rampa de 4 m e João usa uma rampa de 2 m. Qual afirmação é correta?', ['Ana faz menos força, porque a rampa é mais longa', 'João faz menos força, porque a rampa é mais curta', 'Os dois fazem a mesma força', 'Ana faz mais força, porque o caminho é maior'], 0, 'Rampa mais longa e menos inclinada exige menos força, por um caminho maior.'),
    DI('Uma máquina simples diminui o trabalho total? Explique o que ela realmente facilita e dê um exemplo do dia a dia.', 'Não diminui o trabalho total: ela troca força por distância, ou muda a direção da força, facilitando a tarefa. Exemplo: com a rampa faço menos força, mas percorro um caminho maior.', ['facilita a tarefa (menos força ou muda a direção)', 'o trabalho é o mesmo, troca-se força por distância', 'exemplo correto do cotidiano'])]],
  ['7', 'Reconhecer as características dos microrganismos', [
    AS('Microrganismos são seres vivos muito pequenos. Alguns ajudam, outros causam doenças.', ['Leveduras (fungos)', 'Lactobacilos (bactérias)', 'Bactéria da cólera'], ['Fazem o pão crescer', 'Fazem o iogurte', 'Causam doença'], [0, 1, 2]),
    AS('Ligue cada cuidado ao motivo.', ['Ferver ou filtrar a água', 'Lavar as mãos', 'Tomar vacina'], ['Elimina microrganismos da água', 'Tira microrganismos da pele', 'Prepara o corpo para se defender'], [0, 1, 2]),
    O('Dois potes com leite ficaram 3 dias: o da geladeira não mudou e o que ficou fora azedou. O que o experimento mostra?', ['O frio produz microrganismos', 'Em temperatura mais alta os microrganismos se multiplicam mais rápido', 'O leite azeda sozinho, sem microrganismos', 'Geladeira mata todos os microrganismos'], 1, 'O frio desacelera a multiplicação, mas não mata todos.'),
    DI('Todos os microrganismos fazem mal à saúde? Defenda sua resposta com dois exemplos.', 'Não. Muitos são úteis: leveduras fazem pão e bebidas fermentadas, bactérias fazem iogurte e queijo, decompositores reciclam a matéria no ambiente. Outros causam doenças, como a bactéria da cólera.', ['nem todos fazem mal', 'exemplo de microrganismo útil', 'segundo exemplo ou exemplo de um que causa doença'])]],
  ['7', 'Identificar os componentes e características dos ecossistemas aquáticos', [
    AS('Ecossistemas aquáticos podem ter água doce, salgada ou salobra.', ['Rio e lagoa', 'Mar e oceano', 'Manguezal (rio encontra o mar)'], ['Água doce', 'Água salgada', 'Água salobra'], [0, 1, 2]),
    OR('Ordene a cadeia alimentar de um lago.', ['Algas (fazem fotossíntese)', 'Pequenos crustáceos comem as algas', 'Peixes comem os crustáceos', 'Aves comem os peixes']),
    O('Um rio limpo tem 8 mg/L de oxigênio dissolvido; um rio com esgoto tem 2 mg/L. O que explica a queda?', ['Há mais fotossíntese', 'A matéria orgânica do esgoto é decomposta e consome o oxigênio', 'A água ficou mais pura', 'Os peixes produzem oxigênio'], 1, 'Decompositores gastam o oxigênio ao degradar o esgoto.'),
    DI('Por que o esgoto lançado em uma lagoa pode causar a morte de peixes? Explique a relação com o oxigênio.', 'O esgoto traz muita matéria orgânica; os microrganismos que a decompõem consomem o oxigênio da água, e os peixes morrem por falta de oxigênio.', ['esgoto traz matéria orgânica', 'decomposição consome oxigênio', 'falta de oxigênio mata os peixes'])]],
  ['8', 'Analisar os efeitos do aquecimento global', [
    AS('O aquecimento global está ligado a atividades humanas.', ['Queima de combustíveis', 'Desmatamento', 'Derretimento das geleiras'], ['Emite CO₂ para a atmosfera', 'Reduz a absorção de CO₂ pelas plantas', 'Eleva o nível do mar'], [0, 1, 2]),
    OR('Ordene como o aquecimento global se intensifica.', ['Combustíveis fósseis são queimados', 'CO₂ e outros gases se acumulam na atmosfera', 'Mais calor fica retido (efeito estufa intensificado)', 'A temperatura média do planeta aumenta', 'Geleiras derretem']),
    O('Variação da temperatura média global: 1900, 0,0 °C; 1950, +0,3 °C; 2000, +0,6 °C; 2020, +1,1 °C. O que a tabela mostra?', ['Temperatura estável', 'Aumento ao longo do tempo, mais rápido nas últimas décadas', 'Queda constante', 'Oscilação sem tendência'], 1, 'De 1950 a 2000 subiu 0,3 °C; de 2000 a 2020, 0,5 °C.'),
    DI('Cite duas consequências do aquecimento global e uma ação que ajuda a reduzi-lo.', 'Consequências: derretimento de geleiras e aumento do nível do mar, eventos climáticos extremos, perda de biodiversidade. Ação: reduzir queima de combustíveis fósseis, preservar florestas, usar energia limpa.', ['primeira consequência correta', 'segunda consequência correta', 'ação que reduz emissões'])]],
  ['8', 'Identificar os órgãos do sistema digestório', [
    AS('O alimento passa por vários órgãos, cada um com sua função.', ['Boca', 'Estômago', 'Intestino delgado'], ['Mastigação e início da digestão do amido', 'Mistura com o suco gástrico', 'Absorção dos nutrientes'], [0, 1, 2]),
    OR('Ordene o caminho do alimento no corpo.', ['Boca', 'Esôfago', 'Estômago', 'Intestino delgado', 'Intestino grosso']),
    O('Uma pessoa precisou retirar parte do intestino delgado e agora absorve menos nutrientes. Por quê?', ['Ali ocorre a maior parte da absorção dos nutrientes', 'Ali o alimento é mastigado', 'Ali é guardada a urina', 'Ali é produzida a saliva'], 0, 'O intestino delgado tem vilosidades que absorvem os nutrientes.'),
    DI('Explique a diferença entre digestão e absorção, dizendo onde cada uma acontece.', 'Digestão é quebrar o alimento em partes pequenas (boca, estômago, intestino delgado). Absorção é a passagem dos nutrientes para o sangue, principalmente no intestino delgado.', ['digestão quebra o alimento', 'absorção passa nutrientes ao sangue', 'local correto (intestino delgado)'])]],
  ['8', 'Associar as principais ISTs', [
    AS('Cada IST tem causa e cuidado diferentes.', ['HPV', 'Sífilis', 'HIV/Aids'], ['Existe vacina; pode causar verrugas e câncer de colo do útero', 'Bactéria; tratada com antibiótico', 'Vírus que enfraquece o sistema de defesa'], [0, 1, 2]),
    AS('Ligue a situação à forma de transmissão.', ['Relação sexual sem preservativo', 'Compartilhar seringa', 'Mãe infectada na gravidez ou no parto'], ['Transmissão sexual', 'Transmissão pelo sangue', 'Transmissão vertical'], [0, 1, 2]),
    O('Qual método reduz o risco de transmissão de HIV, sífilis e HPV durante a relação sexual?', ['Preservativo (camisinha)', 'Pílula anticoncepcional', 'Lavar-se depois', 'Nenhum método'], 0, 'O preservativo é a barreira que reduz o risco das três.'),
    DI('Um amigo disse que a pílula anticoncepcional protege contra ISTs. Você concorda? Explique.', 'Não. A pílula evita a gravidez, mas não protege contra ISTs. Só o preservativo, usado corretamente, reduz o risco.', ['pílula evita gravidez, não ISTs', 'preservativo protege', 'conclui que o amigo está errado'])]],
  ['9', 'Identificar substâncias, misturas e transformações', [
    AS('Substância pura tem uma só composição; mistura tem duas ou mais substâncias.', ['Água pura', 'Água do mar', 'Ferro enferrujando'], ['Substância pura', 'Mistura', 'Transformação química'], [0, 1, 2]),
    AS('Ligue a mistura ao método de separação.', ['Areia e água', 'Sal dissolvido em água', 'Limalha de ferro e areia'], ['Filtração', 'Evaporação', 'Separação magnética'], [0, 1, 2]),
    O('O líquido X ferve sempre a 100 °C. O líquido Y começa a ferver a 92 °C e termina a 99 °C. O que se conclui?', ['X e Y são misturas', 'X é substância pura e Y é mistura', 'X é mistura e Y é substância pura', 'X e Y são substâncias puras'], 1, 'Substância pura ferve a temperatura constante.'),
    DI('Como saber se a queima de um papel é transformação física ou química? Justifique.', 'É química: forma novas substâncias (cinzas, gases) e não dá para voltar ao papel. Na transformação física, as substâncias continuam as mesmas.', ['queima forma novas substâncias', 'não volta ao material original', 'diferencia da transformação física'])]],
  ['9', 'Relacionar a evolução biológica', [
    AS('Ligue cada ideia ao seu nome na teoria da evolução.', ['Indivíduos diferentes entre si', 'O ambiente favorece os mais adaptados', 'Características passadas aos filhos'], ['Hereditariedade', 'Seleção natural', 'Variabilidade'], [2, 1, 0]),
    OR('Ordene como bactérias resistentes se tornam comuns.', ['Existem bactérias, algumas já resistentes ao antibiótico', 'O antibiótico mata as sensíveis', 'As resistentes sobrevivem e se reproduzem', 'As resistentes passam a ser a maioria']),
    O('Antes da fuligem, 90% das mariposas eram claras e 10% escuras. Depois que a fuligem escureceu os troncos, 20% eram claras e 80% escuras. Qual a explicação?', ['As mariposas escolheram mudar de cor', 'As escuras ficaram menos visíveis aos predadores e sobreviveram mais', 'A fuligem pintou as mariposas', 'As claras migraram todas'], 1, 'Seleção natural: sobrevive mais quem está mais camuflado.'),
    DI('Explique por que "a girafa esticou o pescoço para alcançar as folhas e passou isso aos filhos" não é a explicação da teoria de Darwin.', 'Para Darwin, havia girafas com pescoços de tamanhos diferentes (variação); as de pescoço maior alcançavam mais comida, sobreviviam e deixavam mais filhotes (seleção natural). Esforço do indivíduo não altera a herança.', ['existe variação entre os indivíduos', 'os mais adaptados sobrevivem e se reproduzem', 'esforço do indivíduo não é herdado'])]],
  ['9', 'Aplicar as Leis Ponderais', [
    AS('Ligue cada lei à sua ideia.', ['Lei de Lavoisier', 'Lei de Proust'], ['Em recipiente fechado, a massa total não muda', 'As massas reagem em proporção fixa'], [0, 1]),
    O('Em um recipiente fechado, 10 g de A reagem com 6 g de B. Qual a massa total do produto formado?', ['4 g', '16 g', '60 g', '10 g'], 1, 'Pela lei de Lavoisier, a massa dos reagentes é igual à dos produtos: 10 + 6 = 16 g.'),
    O('Exp. 1: 2 g de hidrogênio + 16 g de oxigênio → 18 g de água. Exp. 2: 4 g de hidrogênio + x g de oxigênio → 36 g de água. Qual é x?', ['16 g', '32 g', '36 g', '20 g'], 1, 'Proporção 1 : 8 (Proust): 4 g de H pedem 32 g de O.'),
    DI('Uma vela acesa em recipiente aberto diminui de massa. Isso contradiz a lei de Lavoisier? Explique.', 'Não contradiz. Os produtos da queima (gás carbônico e vapor de água) escapam para o ar; em recipiente fechado a massa total se conserva.', ['produtos gasosos escapam', 'em recipiente fechado a massa se conserva', 'conclui que não contradiz'])]],
  ['9', 'Identificar os modelos atômicos', [
    AS('Cada cientista propôs um modelo para o átomo.', ['Dalton', 'Thomson', 'Rutherford', 'Bohr'], ['Esfera maciça e indivisível', 'Esfera positiva com elétrons dentro ("pudim de passas")', 'Núcleo pequeno e denso com elétrons ao redor', 'Elétrons em níveis (camadas) de energia'], [0, 1, 2, 3]),
    OR('Ordene os modelos atômicos do mais antigo ao mais recente.', ['Dalton (1803)', 'Thomson (1897)', 'Rutherford (1911)', 'Bohr (1913)']),
    O('No experimento de Rutherford, quase todas as partículas alfa atravessaram a folha de ouro, poucas desviaram e algumas voltaram. O que isso indica?', ['O átomo é uma esfera maciça', 'O átomo tem muito espaço vazio e um núcleo pequeno, denso e positivo', 'Os elétrons são positivos', 'O átomo não tem núcleo'], 1, 'A maioria passa pelo espaço vazio; as que voltam batem no núcleo.'),
    DI('Por que os modelos atômicos mudaram ao longo do tempo? Dê um exemplo.', 'Porque novos experimentos trouxeram evidências que os modelos antigos não explicavam. Exemplo: o experimento de Rutherford mostrou o núcleo e substituiu o modelo de Thomson.', ['novas evidências/experimentos', 'modelo antigo não explicava', 'exemplo correto'])]]
];

['b', 'c', 'd', 'e', 'f'].forEach(x => { try { DEF.push(...require('./_remediacao-' + x + '.js')(O, AS, OR, DI)); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; } });
const REM = {};
Object.keys(CAT).forEach(k => {
  const c = CAT[k];
  DEF.forEach(([serie, pref, v]) => { if (c.serie === serie && c.desc.startsWith(pref)) REM[k] = v; });
});
module.exports = { REM, achar: (k, niv) => (REM[k] || [])[Math.max(0, Math.min(3, niv))] || null };
