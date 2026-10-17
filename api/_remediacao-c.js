/* 3ª leva: 6º ano (Terra, células, corpo humano, sistema nervoso, sentidos, locomoção, drogas) */
module.exports = (O, AS, OR, DI) => [
  ['6', 'Reconhecer a formação e transformação da Terra', [
    AS('A Terra tem cerca de 4,6 bilhões de anos e mudou muito.', ['Terra muito quente, com rochas derretidas', 'Primeiros oceanos', 'Primeiros seres vivos'], ['Início da formação do planeta', 'Água líquida se acumulou na superfície', 'Surgiram nos oceanos'], [0, 1, 2]),
    OR('Ordene a história da Terra, do mais antigo ao mais recente.', ['Formação do planeta', 'Formação dos oceanos', 'Primeiros seres vivos', 'Surgimento dos dinossauros', 'Surgimento do ser humano']),
    O('Se a história da Terra coubesse em 24 horas, o ser humano apareceria só nos últimos minutos. O que isso mostra?', ['Que o ser humano é muito antigo', 'Que a espécie humana é muito recente na história do planeta', 'Que a Terra é nova', 'Que os dinossauros eram humanos'], 1, 'A espécie humana é recente em relação à idade da Terra.'),
    DI('Cite duas mudanças que a Terra sofreu ao longo do tempo e o que as causou.', 'A Terra esfriou, formou crosta e oceanos; a atmosfera mudou com a fotossíntese dos primeiros seres vivos; os continentes se moveram por causa das placas tectônicas.', ['primeira mudança correta', 'segunda mudança correta', 'relaciona a uma causa'])]],
  ['6', 'Reconhecer os princípios da teoria celular', [
    AS('A teoria celular tem três ideias principais.', ['Todo ser vivo é formado por células', 'A célula é a unidade básica da vida', 'Toda célula vem de outra célula'], ['Constituição dos seres vivos', 'Estrutura e função', 'Origem das células'], [0, 1, 2]),
    OR('Ordene da menor para a maior estrutura.', ['Célula', 'Tecido', 'Órgão', 'Sistema']),
    O('Uma bactéria é formada por uma só célula; uma árvore por milhões. Pela teoria celular, o que há em comum?', ['Nenhum dos dois tem células', 'Os dois são formados por células', 'Só a árvore tem células', 'Só a bactéria é viva'], 1, 'Todo ser vivo é formado por células.'),
    DI('Explique com suas palavras: "toda célula vem de outra célula".', 'Novas células surgem da divisão de células já existentes; células não surgem do nada.', ['células surgem por divisão', 'de células já existentes', 'não surgem do nada'])]],
  ['6', 'Classificar células procariontes e eucariontes', [
    AS('Procariontes não têm núcleo organizado; eucariontes têm.', ['Bactéria', 'Célula da pele humana', 'Célula de folha'], ['Procarionte', 'Eucarionte animal', 'Eucarionte vegetal'], [0, 1, 2]),
    AS('Ligue a característica ao tipo de célula.', ['Material genético solto no citoplasma', 'Material genético dentro do núcleo', 'Tem cloroplastos e parede celular'], ['Procarionte', 'Eucarionte (animal ou vegetal)', 'Eucarionte vegetal'], [0, 1, 2]),
    O('Uma célula foi observada sem núcleo organizado e sem mitocôndrias. Como é classificada?', ['Eucarionte animal', 'Eucarionte vegetal', 'Procarionte', 'Fungo'], 2, 'Sem núcleo organizado: procarionte.'),
    DI('Qual a principal diferença entre célula procarionte e eucarionte? Dê um exemplo de cada.', 'A eucarionte tem núcleo envolto por membrana; a procarionte não, e o material genético fica solto no citoplasma. Exemplos: bactéria (procarionte); célula humana (eucarionte).', ['eucarionte tem núcleo organizado', 'procarionte não tem', 'exemplo de cada tipo'])]],
  ['6', 'Reconhecer como o desenvolvimento do microscópio', [
    AS('Cada instrumento permitiu ver mais detalhes.', ['Lupa', 'Microscópio óptico', 'Microscópio eletrônico'], ['Aumenta pouco; mostra detalhes de objetos pequenos', 'Mostra células e microrganismos', 'Mostra estruturas muito pequenas, como vírus'], [0, 1, 2]),
    OR('Ordene a evolução do conhecimento sobre a célula.', ['Hooke observa "celas" na cortiça (séc. XVII)', 'Leeuwenhoek vê microrganismos vivos', 'Schleiden e Schwann propõem a teoria celular', 'O microscópio eletrônico mostra as organelas']),
    O('Antes do microscópio, ninguém sabia que seres vivos eram feitos de células. Por quê?', ['Porque as células não existiam', 'Porque as células são pequenas demais para o olho nu', 'Porque as células só existem em laboratório', 'Porque as células são invisíveis à luz'], 1, 'O microscópio tornou visíveis as células.'),
    DI('Como a invenção do microscópio mudou o que sabemos sobre as doenças?', 'Permitiu ver microrganismos (bactérias, protozoários) e relacioná-los a doenças, levando a avanços como higiene, vacinas e antibióticos.', ['permitiu ver microrganismos', 'relaciona a doenças', 'levou a avanços na saúde'])]],
  ['6', 'Reconhecer os principais componentes celulares', [
    AS('A célula tem partes com funções diferentes.', ['Membrana plasmática', 'Citoplasma', 'Núcleo'], ['Controla o que entra e sai', 'Onde ficam as organelas', 'Guarda o material genético'], [0, 1, 2]),
    OR('Ordene de fora para dentro de uma célula animal.', ['Membrana plasmática', 'Citoplasma', 'Núcleo']),
    O('Uma substância tóxica danificou a membrana de uma célula. O que provavelmente falhou?', ['Controle do que entra e sai', 'Guardar o DNA', 'Produzir gás carbônico', 'Fazer fotossíntese'], 0, 'A membrana controla a entrada e a saída.'),
    DI('Compare a célula com uma cidade. O que o núcleo e a membrana seriam?', 'O núcleo seria a prefeitura (controla e guarda as informações); a membrana seria os muros e portões, que controlam o que entra e sai.', ['núcleo controla/guarda informação', 'membrana controla entrada e saída', 'comparação coerente'])]],
  ['6', 'Relacionar as estruturas das organelas celulares', [
    AS('Organelas são como "órgãos" da célula.', ['Mitocôndria', 'Cloroplasto', 'Parede celular'], ['Libera energia na respiração', 'Faz a fotossíntese', 'Dá sustentação à célula vegetal'], [0, 1, 2]),
    AS('Ligue a organela à célula em que ela existe.', ['Cloroplasto', 'Mitocôndria', 'Centríolo'], ['Só em célula vegetal', 'Em célula animal e vegetal', 'Em célula animal'], [0, 1, 2]),
    O('Uma célula de folha tem cloroplastos e parede celular. Uma célula do músculo não. O que isso indica?', ['A célula da folha é animal', 'A da folha é vegetal e a do músculo é animal', 'As duas são vegetais', 'As duas são animais'], 1, 'Cloroplasto e parede celular são típicos de célula vegetal.'),
    DI('Por que células musculares têm muitas mitocôndrias?', 'Porque os músculos gastam muita energia; as mitocôndrias liberam a energia na respiração celular.', ['mitocôndria libera energia', 'músculo gasta muita energia', 'relaciona a respiração celular'])]],
  ['6', 'Analisar o processo de fossilização', [
    AS('Fósseis são restos ou marcas de seres vivos antigos.', ['Concha em rocha', 'Pegada de dinossauro', 'Inseto preso em âmbar'], ['Resto preservado', 'Marca de atividade', 'Corpo preservado na resina'], [0, 1, 2]),
    OR('Ordene a formação de um fóssil.', ['O organismo morre', 'É rapidamente soterrado por sedimentos', 'As partes duras se mineralizam', 'A rocha é exposta pela erosão e o fóssil é encontrado']),
    O('Por que é mais comum encontrar fósseis de ossos e conchas do que de partes moles?', ['Porque partes moles não existem', 'Porque partes duras resistem mais à decomposição', 'Porque ossos são mais novos', 'Porque conchas são vivas'], 1, 'Partes duras se preservam melhor.'),
    DI('Como os fósseis ajudam a contar a história da Terra?', 'Mostram quais seres viveram em cada época, como eram, onde viviam e como o ambiente mudou; a idade das rochas ajuda a datar.', ['mostram seres do passado', 'indicam ambientes antigos', 'ajudam a datar épocas'])]],
  ['6', 'Classificar seres vivos (bactérias, fungos', [
    AS('Cada grupo de microrganismos é diferente.', ['Bactérias', 'Fungos', 'Protozoários'], ['Procariontes, unicelulares', 'Eucariontes; decompõem matéria', 'Eucariontes unicelulares, como a ameba'], [0, 1, 2]),
    AS('Ligue o ser vivo ao papel no ambiente.', ['Cogumelo', 'Bactéria decompositora', 'Levedura'], ['Decompõe matéria orgânica', 'Recicla nutrientes', 'Fermenta açúcar'], [0, 1, 2]),
    O('Um ser unicelular não tem núcleo organizado. Em qual grupo ele está?', ['Protozoário', 'Fungo', 'Bactéria', 'Alga'], 2, 'Sem núcleo organizado: bactéria.'),
    DI('Por que os decompositores (fungos e bactérias) são importantes para o ambiente?', 'Decompõem restos de seres vivos e devolvem nutrientes ao solo, permitindo que as plantas cresçam e a matéria circule.', ['decompõem matéria orgânica', 'devolvem nutrientes', 'ciclo da matéria'])]],
  ['6', 'Associar células, tecidos, órgãos e sistemas', [
    AS('Os seres vivos se organizam em níveis.', ['Célula nervosa', 'Músculo cardíaco', 'Coração'], ['Unidade básica', 'Tecido', 'Órgão'], [0, 1, 2]),
    OR('Ordene do mais simples ao mais complexo.', ['Célula', 'Tecido', 'Órgão', 'Sistema', 'Organismo']),
    O('O estômago, o intestino e o fígado trabalham juntos para digerir o alimento. Como se chama esse conjunto?', ['Tecido', 'Sistema digestório', 'Célula', 'Organela'], 1, 'Órgãos que atuam juntos formam um sistema.'),
    DI('Explique por que dizemos que o organismo é organizado em níveis. Dê um exemplo.', 'Células se agrupam em tecidos; tecidos formam órgãos; órgãos formam sistemas; sistemas formam o organismo. Exemplo: células musculares formam o tecido muscular, que forma o coração.', ['cita os níveis em ordem', 'cada nível forma o próximo', 'exemplo'])]],
  ['6', 'Relacionar os impactos das ações humanas à qualidade', [
    AS('O solo precisa de cuidado.', ['Desmatamento', 'Uso excessivo de agrotóxicos', 'Queimadas'], ['Aumenta a erosão', 'Contamina o solo', 'Empobrecem o solo e matam organismos'], [0, 1, 2]),
    OR('Ordene o processo de erosão do solo desprotegido.', ['A vegetação é retirada', 'A chuva bate direto no solo', 'A água carrega as partículas', 'O solo perde nutrientes e se degrada']),
    O('Duas encostas: uma com mata e outra sem vegetação. Depois da chuva, a água do rio ao lado da segunda ficou barrenta. O que explica?', ['A chuva é diferente', 'Sem plantas, o solo é levado pela água para o rio', 'A mata produz barro', 'O rio mudou de lugar'], 1, 'A vegetação segura o solo e reduz a erosão.'),
    DI('Cite uma prática que protege o solo e explique por quê.', 'Plantar cobertura vegetal ou fazer curvas de nível: reduzem a erosão e mantêm os nutrientes.', ['prática adequada', 'explica o efeito sobre o solo', 'relaciona à erosão ou nutrientes'])]],
  ['6', 'Reconhecer as esferas que estruturam a Terra', [
    AS('A Terra tem esferas.', ['Litosfera', 'Hidrosfera', 'Atmosfera'], ['Rochas e solo', 'Águas', 'Camada de gases'], [0, 1, 2]),
    AS('Ligue o exemplo à esfera.', ['Floresta', 'Oceano', 'Montanha'], ['Biosfera', 'Hidrosfera', 'Litosfera'], [0, 1, 2]),
    O('Uma erupção vulcânica lança cinzas no ar e cobre o solo. Quais esferas foram envolvidas?', ['Só a hidrosfera', 'Litosfera e atmosfera', 'Só a biosfera', 'Nenhuma'], 1, 'O vulcão é da litosfera; as cinzas vão para a atmosfera.'),
    DI('Mostre, com um exemplo, que as esferas da Terra interagem entre si.', 'Chuva (atmosfera) cai em rios (hidrosfera), molha o solo (litosfera) e permite que plantas cresçam (biosfera).', ['cita pelo menos três esferas', 'mostra a ligação', 'exemplo coerente'])]],
  ['6', 'Reconhecer os principais estados físicos da matéria', [
    AS('Matéria muda de estado com calor.', ['Gelo vira água', 'Água vira vapor', 'Vapor vira gotas'], ['Fusão', 'Vaporização', 'Condensação'], [0, 1, 2]),
    OR('Ordene as mudanças ao aquecer um cubo de gelo até virar vapor.', ['Sólido', 'Fusão', 'Líquido', 'Vaporização', 'Gasoso']),
    O('Na tabela, a água a 0 °C é sólida e a 100 °C passa a vapor. Em 50 °C, qual o estado?', ['Sólido', 'Líquido', 'Gasoso', 'Plasma'], 1, 'Entre 0 e 100 °C a água é líquida.'),
    DI('Por que o vidro do banheiro fica embaçado quando tomamos banho quente?', 'O vapor de água quente encontra o vidro frio e se condensa em gotinhas.', ['vapor encontra superfície fria', 'ocorre condensação', 'formam gotas'])]],
  ['6', 'Compreender que o corpo humano é formado por órgãos', [
    AS('Cada sistema tem uma função.', ['Sistema digestório', 'Sistema respiratório', 'Sistema circulatório'], ['Digerir alimentos', 'Trocar gases', 'Levar sangue ao corpo'], [0, 1, 2]),
    AS('Ligue o órgão ao sistema.', ['Pulmão', 'Coração', 'Estômago'], ['Respiratório', 'Circulatório', 'Digestório'], [0, 1, 2]),
    O('Ao correr, o coração bate mais rápido e a respiração acelera. O que isso mostra?', ['Os sistemas atuam em conjunto', 'Os sistemas funcionam isolados', 'Só o coração trabalha', 'A respiração não importa'], 0, 'Circulação e respiração trabalham juntas para levar oxigênio.'),
    DI('Explique por que os sistemas do corpo precisam trabalhar juntos. Use um exemplo.', 'Um sistema depende do outro: o digestório fornece nutrientes, o respiratório oxigênio e o circulatório leva ambos às células.', ['sistemas dependem uns dos outros', 'exemplo concreto', 'circulação distribui'])]],
  ['6', 'Identificar órgãos e estruturas do sistema nervoso', [
    AS('O sistema nervoso tem várias estruturas.', ['Encéfalo', 'Medula espinhal', 'Nervos'], ['Dentro do crânio', 'Dentro da coluna vertebral', 'Levam mensagens pelo corpo'], [0, 1, 2]),
    OR('Ordene o caminho de um estímulo.', ['Receptor percebe o estímulo', 'Nervo leva a mensagem', 'Cérebro interpreta', 'Resposta é enviada aos músculos']),
    O('Qual parte do encéfalo coordena o equilíbrio e os movimentos?', ['Cerebelo', 'Medula', 'Nervos', 'Pele'], 0, 'O cerebelo coordena equilíbrio e movimentos.'),
    DI('Qual a diferença entre sistema nervoso central e periférico?', 'O central é o encéfalo e a medula espinhal, que processam e comandam; o periférico são os nervos que ligam o central ao resto do corpo.', ['central = encéfalo e medula', 'periférico = nervos', 'função de cada um'])]],
  ['6', 'Compreender a estrutura geral do neurônio', [
    AS('O neurônio tem partes especializadas.', ['Dendritos', 'Corpo celular', 'Axônio'], ['Recebem estímulos', 'Contém o núcleo', 'Conduz o impulso para outras células'], [0, 1, 2]),
    OR('Ordene o caminho do impulso nervoso.', ['Dendritos recebem o estímulo', 'Corpo celular', 'Axônio conduz o impulso', 'Sinapse transmite à próxima célula']),
    O('Em qual sentido o impulso nervoso viaja em um neurônio?', ['Do axônio para os dendritos', 'Dos dendritos para o axônio', 'Para os dois lados ao mesmo tempo', 'Não viaja'], 1, 'Dendritos → corpo celular → axônio.'),
    DI('O que é a sinapse e qual sua importância?', 'É o ponto de comunicação entre neurônios (ou com músculos), em que o impulso passa por mediadores químicos; sem ela a mensagem não segue adiante.', ['ponto de contato entre neurônios', 'passagem do impulso', 'importância para a comunicação'])]],
  ['6', 'Reconhecer as principais estruturas do sistema nervoso central', [
    AS('Estruturas do sistema nervoso central.', ['Cérebro', 'Cerebelo', 'Bulbo'], ['Pensar e decidir', 'Equilíbrio e coordenação', 'Controla respiração e batimentos'], [0, 1, 2]),
    AS('Ligue a lesão à consequência.', ['Lesão no cerebelo', 'Lesão no bulbo', 'Lesão no cérebro'], ['Perda de equilíbrio', 'Risco à respiração e ao coração', 'Alteração em memória ou fala'], [0, 1, 2]),
    O('Uma pessoa com lesão na medula espinhal pode perder movimentos nas pernas. Por quê?', ['A medula leva mensagens entre encéfalo e corpo', 'A medula faz a digestão', 'A medula produz os músculos', 'A medula é parte da perna'], 0, 'A medula conduz os impulsos.'),
    DI('Por que o crânio e a coluna vertebral são importantes para o sistema nervoso?', 'Protegem o encéfalo e a medula, órgãos delicados e essenciais.', ['crânio protege o encéfalo', 'coluna protege a medula', 'órgãos delicados'])]],
  ['6', 'Reconhecer as principais funções das estruturas que formam o sistema nervoso periférico', [
    AS('Nervos periféricos.', ['Nervos sensitivos', 'Nervos motores', 'Gânglios'], ['Levam informações ao SNC', 'Levam ordens aos músculos', 'Agrupamentos de corpos de neurônios'], [0, 1, 2]),
    OR('Ordene o reflexo ao encostar em algo quente.', ['Receptor da pele percebe o calor', 'Nervo sensitivo leva à medula', 'Medula envia ordem pelo nervo motor', 'Músculo puxa a mão']),
    O('Qual nervo leva a ordem do cérebro para o músculo se mover?', ['Sensitivo', 'Motor', 'Óptico', 'Gânglio'], 1, 'Nervo motor leva ordens aos músculos.'),
    DI('Por que o reflexo é mais rápido que uma resposta pensada?', 'No reflexo a medula responde sem esperar o cérebro, reduzindo o tempo de resposta e protegendo o corpo.', ['a medula comanda', 'não passa pelo cérebro', 'é mais rápido e protege'])]],
  ['6', 'Explicar a estrutura do olho', [
    AS('Partes do olho.', ['Córnea', 'Pupila', 'Retina'], ['Camada transparente que protege', 'Abertura que regula a luz', 'Onde se forma a imagem'], [0, 1, 2]),
    OR('Ordene o caminho da luz até enxergarmos.', ['A luz entra pela córnea', 'Passa pela pupila', 'O cristalino foca a luz', 'A imagem se forma na retina', 'O nervo óptico leva ao cérebro']),
    O('Em um lugar escuro, a pupila fica maior. Por quê?', ['Para deixar entrar mais luz', 'Para impedir a luz', 'Para esfriar o olho', 'Para focar melhor'], 0, 'A pupila se dilata para captar mais luz.'),
    DI('Por que não enxergamos no escuro total?', 'Sem luz que se reflita nos objetos e chegue à retina, os fotorreceptores não são estimulados e o cérebro não forma imagem.', ['precisa de luz', 'luz chega à retina', 'cérebro forma a imagem'])]],
  ['6', 'Justificar, com simuladores, a resposta do olho', [
    AS('Cones e bastonetes.', ['Cones', 'Bastonetes', 'Pupila'], ['Percebem as cores', 'Permitem ver com pouca luz', 'Regula a quantidade de luz'], [0, 1, 2]),
    OR('Ordene o que acontece quando a luz aumenta.', ['A luz forte chega ao olho', 'A pupila se contrai', 'Entra menos luz', 'A retina é protegida']),
    O('Em um simulador, a luz vermelha estimula mais os cones sensíveis ao vermelho. O que isso explica?', ['Que vemos as cores por tipos de cones', 'Que os bastonetes veem cores', 'Que a pupila vê cores', 'Que o cristalino produz luz'], 0, 'Há cones sensíveis a diferentes comprimentos de onda.'),
    DI('Por que algumas pessoas têm dificuldade de distinguir cores?', 'Porque faltam ou funcionam menos algum tipo de cone na retina (daltonismo).', ['relaciona aos cones', 'falta de um tipo de cone', 'daltonismo'])]],
  ['6', 'Descrever o papel dos quimiorreceptores', [
    AS('Paladar e olfato.', ['Língua', 'Nariz', 'Cérebro'], ['Percebe sabores', 'Percebe odores', 'Interpreta os sinais'], [0, 1, 2]),
    OR('Ordene como sentimos um cheiro.', ['Partículas do odor entram no nariz', 'Receptores do olfato são estimulados', 'O nervo envia o sinal', 'O cérebro identifica o cheiro']),
    O('Com o nariz entupido, a comida parece sem graça. Por quê?', ['O olfato ajuda a perceber o sabor', 'A língua para de funcionar', 'O estômago fica fraco', 'O paladar só usa o nariz'], 0, 'O olfato e o paladar trabalham juntos.'),
    DI('O que são quimiorreceptores e onde estão?', 'Células que percebem substâncias químicas: na língua (sabores) e no nariz (odores).', ['detectam substâncias químicas', 'na língua e no nariz', 'enviam o sinal ao cérebro'])]],
  ['6', 'Descrever o papel da pele e de outros órgãos no tato', [
    AS('Receptores da pele.', ['Receptor de dor', 'Receptor de temperatura', 'Receptor de pressão'], ['Alerta contra lesões', 'Detecta calor e frio', 'Sente toque e aperto'], [0, 1, 2]),
    OR('Ordene o caminho da sensação do toque.', ['Objeto toca a pele', 'Receptores são estimulados', 'Nervos levam o sinal', 'O cérebro percebe o toque']),
    O('As pontas dos dedos são mais sensíveis que as costas. Por quê?', ['Têm mais receptores de tato', 'Têm menos nervos', 'São mais grossas', 'Não têm pele'], 0, 'Há maior densidade de receptores.'),
    DI('Por que a dor é importante para o corpo?', 'A dor alerta que há lesão ou perigo e faz o corpo reagir para se proteger.', ['alerta lesão', 'protege o corpo', 'faz reagir'])]],
  ['6', 'Explicar os mecanismos fisiológicos da audição', [
    AS('Partes da orelha.', ['Tímpano', 'Cóclea', 'Labirinto'], ['Vibra com o som', 'Transforma vibrações em sinais nervosos', 'Ajuda no equilíbrio'], [0, 1, 2]),
    OR('Ordene o caminho do som.', ['O som entra no canal auditivo', 'O tímpano vibra', 'Os ossículos transmitem a vibração', 'A cóclea gera sinais nervosos', 'O cérebro interpreta o som']),
    O('Uma pessoa tem tontura quando o labirinto está inflamado. Por quê?', ['O labirinto controla o equilíbrio', 'Ele produz saliva', 'Ele controla a fome', 'Ele mede a temperatura'], 0, 'O labirinto detecta posição e movimentos da cabeça.'),
    DI('Por que ouvir som muito alto por muito tempo prejudica a audição?', 'O excesso de intensidade lesa as células sensoriais da cóclea, que não se regeneram.', ['som alto lesa a cóclea', 'células não se regeneram', 'perda de audição'])]],
  ['6', 'Descrever o papel dos ossos', [
    AS('Funções dos ossos.', ['Crânio', 'Costelas', 'Fêmur'], ['Protege o encéfalo', 'Protegem pulmões e coração', 'Sustenta o corpo e permite andar'], [0, 1, 2]),
    OR('Ordene como o movimento acontece.', ['O cérebro envia a ordem', 'O músculo se contrai', 'Puxa o osso por um tendão', 'A articulação permite o movimento']),
    O('Quais minerais os ossos armazenam?', ['Cálcio e fósforo', 'Ferro e cobre', 'Sódio e cloro', 'Iodo e flúor'], 0, 'Os ossos são reserva de cálcio e fósforo.'),
    DI('Por que crianças e idosos precisam de alimentos ricos em cálcio?', 'O cálcio forma e mantém os ossos fortes: crianças estão crescendo e idosos perdem massa óssea.', ['cálcio forma e mantém ossos', 'crianças crescem', 'idosos perdem massa óssea'])]],
  ['6', 'Relacionar os diferentes tipos de músculos', [
    AS('Tipos de músculo.', ['Esquelético', 'Cardíaco', 'Liso'], ['Voluntário; move os ossos', 'Involuntário; bate sem parar', 'Involuntário; movimenta os órgãos'], [0, 1, 2]),
    AS('Ligue o músculo ao exemplo.', ['Bíceps', 'Coração', 'Intestino'], ['Esquelético', 'Cardíaco', 'Liso'], [0, 1, 2]),
    O('Qual músculo não podemos controlar com a vontade?', ['Bíceps', 'Músculo cardíaco', 'Quadríceps', 'Músculo da língua'], 1, 'O músculo cardíaco é involuntário.'),
    DI('Explique como um músculo faz um osso se mover.', 'O músculo se contrai e puxa o osso por meio do tendão; como músculos agem em pares, um contrai e o outro relaxa.', ['contração do músculo', 'tendão puxa o osso', 'músculos em pares'])]],
  ['6', 'Construir a base de uma mão biônica', [
    AS('Peças de uma mão.', ['Palma', 'Dedos', 'Fios (tendões)'], ['Base que sustenta as peças', 'Partes que seguram objetos', 'Puxam os dedos'], [0, 1, 2]),
    OR('Ordene a construção da base.', ['Medir e recortar a base', 'Fixar os dedos', 'Passar os fios', 'Testar o movimento']),
    O('Por que as próteses ajudam as pessoas?', ['Substituem funções perdidas', 'Fazem a pessoa esquecer', 'Eliminam a deficiência de todos', 'Não têm utilidade'], 0, 'Próteses devolvem autonomia.'),
    DI('Por que a acessibilidade importa para a vida de pessoas com deficiência?', 'Permite autonomia, participação e direitos iguais na escola, no trabalho e na sociedade.', ['autonomia', 'participação', 'igualdade de direitos'])]],
  ['6', 'Finalizar a mão biônica', [
    AS('Etapas de finalização.', ['Fixar os fios', 'Testar a pegada', 'Ajustar'], ['Dá movimento aos dedos', 'Verifica se segura um objeto', 'Corrige o que falhou'], [0, 1, 2]),
    OR('Ordene a finalização da mão.', ['Prender os fios na palma', 'Puxar os fios', 'Os dedos se dobram', 'Testar segurando um copo']),
    O('A mão não segurou o copo. O que fazer?', ['Ajustar a tensão dos fios e testar de novo', 'Desistir', 'Trocar o copo', 'Rasgar a mão'], 0, 'Ajustar e testar de novo faz parte do processo.'),
    DI('Como a mão biônica se parece com a mão real?', 'Os fios fazem o papel dos tendões e puxam os dedos como os músculos puxam os ossos.', ['fios = tendões', 'puxam os dedos', 'compara com músculos e ossos'])]],
  ['6', 'Associar o consumo de drogas a danos graves', [
    AS('Drogas e danos.', ['Cigarro', 'Álcool', 'Drogas ilícitas'], ['Prejudica pulmões e coração', 'Prejudica fígado e reflexos', 'Dependência e riscos graves'], [0, 1, 2]),
    OR('Ordene o caminho da dependência.', ['Experimentar a droga', 'Passar a usar com frequência', 'Tolerância: precisa de mais', 'Dependência']),
    O('Quem dirige após beber tem maior risco de acidente. Por quê?', ['O álcool prejudica reflexos e atenção', 'O álcool melhora a visão', 'O carro fica mais lento', 'Não há relação'], 0, 'O álcool afeta o sistema nervoso.'),
    DI('Cite dois danos do uso de drogas e uma forma de prevenção.', 'Danos: dependência, problemas de saúde, acidentes, prejuízo na escola e família. Prevenção: informação, diálogo, atividades saudáveis, buscar ajuda.', ['primeiro dano', 'segundo dano', 'forma de prevenção'])]],
  ['6', 'Reconhecer efeitos das substâncias psicoativas', [
    AS('Tipos de efeito.', ['Estimulante', 'Depressor', 'Perturbador'], ['Acelera o sistema nervoso', 'Deixa a atividade nervosa mais lenta', 'Altera a percepção'], [0, 1, 2]),
    OR('Ordene como uma droga afeta o cérebro.', ['A substância chega ao sangue', 'Chega ao cérebro', 'Altera a comunicação entre neurônios', 'Muda comportamento e humor']),
    O('Por que adolescentes são mais vulneráveis às drogas?', ['O cérebro ainda está em desenvolvimento', 'O cérebro está pronto', 'Têm mais músculos', 'Têm menos sangue'], 0, 'O cérebro continua se desenvolvendo.'),
    DI('Que estratégias ajudam a prevenir o uso de drogas?', 'Informação, diálogo na família e na escola, atividades esportivas e culturais, apoio dos amigos e dos serviços de saúde.', ['informação e diálogo', 'atividades saudáveis', 'apoio e ajuda profissional'])]]
];
