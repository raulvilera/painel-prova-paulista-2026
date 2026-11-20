/* Texto-base e imagem para as questões da atividade personalizada (Ensino Médio).
   As questões vêm do Apps Script e não mudam (o gabarito depende da ordem das alternativas);
   aqui só acrescentamos um contexto antes do enunciado e a busca de uma imagem no Wikimedia Commons.
   ESPEC: situações e substâncias citadas no enunciado (imagem e, às vezes, texto próprios).
   TEMAS: conteúdo da questão (texto-base e imagem padrão). Vale o primeiro que casar. */

const normal = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const ESPEC = [
  // ---------- Biologia ----------
  { re: /dolly/, img: 'Dolly the sheep National Museum of Scotland', leg: 'Dolly, a ovelha clonada em 1996, exposta no Museu Nacional da Escócia.',
    t: 'Em 1996, no Instituto Roslin (Escócia), nasceu Dolly: o núcleo de uma célula da glândula mamária de uma ovelha adulta foi transferido para um óvulo sem núcleo, e o embrião foi implantado em uma "mãe de aluguel". Foi a primeira vez que um mamífero foi clonado a partir de uma célula adulta, o que abriu um grande debate científico e ético.' },
  { re: /cachorro|pet shop|animais de estimacao/, img: 'cloned dogs Sooam', leg: 'Cães clonados: a clonagem reprodutiva gera um animal inteiro, com o mesmo DNA nuclear do doador.' },
  { re: /cobra|antiofidico|veneno/, img: 'Instituto Butantan snake venom extraction', leg: 'Extração de veneno de serpente no Instituto Butantan, etapa da produção do soro antiofídico.',
    t: 'O Instituto Butantan, em São Paulo, produz soros desde 1901. Pequenas doses de veneno são injetadas em cavalos, que produzem anticorpos; esses anticorpos são purificados do sangue do animal e viram o soro aplicado em quem foi picado. O soro age na hora, mas a proteção dura pouco, porque o organismo não produziu os próprios anticorpos.' },
  { re: /antitetanico|tetano/, img: 'tetanus antitoxin vial', leg: 'Frasco de soro antitetânico: anticorpos prontos, de ação imediata e passageira.' },
  { re: /leite materno|amamenta/, img: 'breastfeeding mother baby', leg: 'O leite materno transfere anticorpos da mãe para o bebê.',
    t: 'O leite materno, especialmente o colostro dos primeiros dias, é rico em anticorpos (IgA). Por isso o Ministério da Saúde recomenda amamentação exclusiva até os 6 meses: o bebê recebe proteção pronta enquanto o próprio sistema imune ainda amadurece.' },
  { re: /hpv/, img: 'HPV vaccine vaccination', leg: 'Vacinação contra o HPV, oferecida pelo SUS a adolescentes.' },
  { re: /sarampo/, img: 'measles vaccine vaccination child', leg: 'Vacinação infantil: a tríplice viral protege contra sarampo, caxumba e rubéola.' },
  { re: /catapora/, img: 'chickenpox varicella child', leg: 'Catapora (varicela): quem teve a doença costuma ficar protegido pela memória imunológica.' },
  { re: /febre/, img: 'clinical thermometer fever', leg: 'A febre é uma resposta inespecífica do organismo a infecções.' },
  { re: /corte na mao|ralar o joelho|ferimento|coagula/, img: 'skin wound scab healing', leg: 'A pele íntegra e a coagulação são as primeiras barreiras contra micro-organismos.' },
  { re: /pele e as mucosas|barreiras fisicas|a pele e as mucosas/, img: 'human skin cross section diagram', leg: 'Camadas da pele: uma barreira física da imunidade inata.' },
  { re: /linfocitos? b|anticorpos especificos/, img: 'B lymphocyte antibody diagram', leg: 'Linfócitos B produzem anticorpos que reconhecem antígenos específicos.' },
  { re: /mrna|covid/, img: 'mRNA vaccine COVID-19 vial', leg: 'Vacinas de mRNA levam a "receita" de uma proteína do vírus, não o vírus.' },
  { re: /vacina/, img: 'Brazil vaccination campaign Ze Gotinha', leg: 'Campanha de vacinação do SUS: o Programa Nacional de Imunizações existe desde 1973.' },
  { re: /celulas-tronco|celula-tronco/, img: 'human embryonic stem cells microscope', leg: 'Colônia de células-tronco vista ao microscópio.',
    t: 'Células-tronco podem se dividir muitas vezes e se transformar em diferentes tipos de células. Na clonagem terapêutica, elas são cultivadas para formar tecidos (pele para queimados, músculo cardíaco para testes de remédios), sem que nenhum embrião seja implantado em um útero. No Brasil, a Lei de Biossegurança (2005) regula essas pesquisas.' },
  { re: /pericia|forense|perfil genetico|marcadores|laudo de dna/, img: 'DNA profiling gel electrophoresis forensic', leg: 'Comparação de perfis de DNA em gel: cada banda corresponde a um fragmento.' },
  { re: /pcr/, img: 'PCR thermal cycler laboratory', leg: 'Termociclador: o aparelho que faz a PCR, copiando milhões de vezes um trecho de DNA.' },
  { re: /crispr/, img: 'CRISPR Cas9 diagram', leg: 'CRISPR-Cas9: um RNA-guia leva a enzima Cas9 ao ponto exato do DNA a ser cortado.' },
  { re: /insulina|glicemia|glicose|diabetes/, img: 'blood glucose meter test', leg: 'Medidor de glicose no sangue, usado no acompanhamento do diabetes.' },
  { re: /droga|neuroadapta/, img: 'chemical synapse diagram', leg: 'Sinapse química: drogas alteram a liberação e a recepção de neurotransmissores.' },
  { re: /giardiase|amebiase/, img: 'Giardia lamblia microscope', leg: 'Giardia lamblia ao microscópio: transmitida por água e alimentos contaminados.' },
  { re: /atum|aves marinhas|mercurio/, img: 'mercury biomagnification food chain diagram', leg: 'Na cadeia alimentar, o mercúrio se acumula e aumenta de concentração a cada nível.' },
  { re: /garca|garcas/, img: 'heron catching fish', leg: 'Garças e outras aves predadoras ficam no topo das cadeias aquáticas.' },
  { re: /ostra|mexilh|molusco/, img: 'mussels bed rocks', leg: 'Mexilhões e ostras filtram grandes volumes de água e acumulam o que há nela.' },
  { re: /alga de um|uma alga/, img: 'green algae microscope', leg: 'Algas absorvem substâncias da água e podem acumulá-las.' },
  { re: /eutrofiza|crescimento excessivo de algas/, img: 'eutrophication algal bloom lake', leg: 'Floração de algas em um lago com excesso de nutrientes (eutrofização).' },
  { re: /bioindicador/, img: 'lichen bioindicator tree bark', leg: 'Liquens e outros bioindicadores revelam a qualidade do ambiente.' },
  { re: /pesticida|inseticida|corante|metal pesado/, img: 'pesticide spraying crop field', leg: 'Pulverização de agrotóxicos: parte da substância chega a rios e lagos.' },
  { re: /dengue/, img: 'Aedes aegypti mosquito', leg: 'O mosquito Aedes aegypti transmite o vírus da dengue.' },
  { re: /hiv/, img: 'HIV budding lymphocyte electron micrograph', leg: 'Micrografia eletrônica: partículas de HIV saindo de um linfócito.' },
  { re: /antibiotico/, img: 'antibiotic tablets', leg: 'Antibióticos atacam estruturas de bactérias, que os vírus não têm.' },
  { re: /gripe|influenza/, img: 'influenza virus electron micrograph', leg: 'Vírus da gripe (influenza) vistos ao microscópio eletrônico.' },
  { re: /capsideo|ilustracao de um virus|desenha um virus/, img: 'virus structure diagram capsid', leg: 'Estrutura de um vírus: capsídeo de proteínas envolvendo o material genético.' },
  { re: /contem ogm|rotulo de um pacote/, img: 'transgenic food label Brazil T symbol', leg: 'O "T" amarelo indica, no rótulo, alimento com ingrediente transgênico.' },
  { re: /algodao/, img: 'cotton field boll', leg: 'Lavoura de algodão: no Brasil há variedades transgênicas resistentes a lagartas.' },
  { re: /milho/, img: 'maize corn field Brazil', leg: 'Lavoura de milho: grande parte do milho plantado no Brasil é transgênico.' },
  { re: /soja/, img: 'soybean field harvest Brazil', leg: 'Plantação de soja: o Brasil é o maior produtor mundial do grão.' },
  { re: /castanha/, img: 'Brazil nut harvest Amazon', leg: 'Coleta de castanha-do-pará na Amazônia, exemplo de extrativismo sustentável.' },
  { re: /acai/, img: 'acai palm harvest Amazon', leg: 'Coleta de açaí: o manejo mantém as palmeiras produzindo por anos.' },
  { re: /defeso|pescadores/, img: 'artisanal fishermen Brazil', leg: 'Pesca artesanal: o defeso protege a reprodução dos peixes.' },
  { re: /mata atlantica/, img: 'Atlantic Forest Brazil Serra do Mar', leg: 'Mata Atlântica na Serra do Mar: restam cerca de 12% da cobertura original.' },
  { re: /parque estadual|protecao integral|proibe visitas|sem visitacao/, img: 'Parque Estadual Serra do Mar', leg: 'Unidades de proteção integral preservam a natureza com o mínimo de interferência humana.' },
  { re: /coelho|raposa/, img: 'red fox hunting rabbit', leg: 'Raposas se alimentam de herbívoros como coelhos.' },
  { re: /disputam a mesma luz|competicao/, img: 'forest canopy competition light', leg: 'No dossel da floresta, as plantas competem por luz.' },
  { re: /capacidade de suporte|logistic/, img: 'logistic growth curve population', leg: 'Curva de crescimento logístico: a população se estabiliza na capacidade de suporte.' },
  { re: /produtividade primaria|10% dessa energia/, img: 'ecological pyramid energy', leg: 'Pirâmide de energia: só cerca de 10% passa de um nível trófico para o seguinte.' },
  { re: /heterozigot|cruzamento|diibrid/, img: 'Punnett square', leg: 'Quadro de Punnett: ferramenta para prever as combinações de alelos.' },
  { re: /figado e do cerebro|expressao genica/, img: 'gene expression differentiation cell types', leg: 'Todas as células têm o mesmo DNA, mas cada tipo ativa genes diferentes.' },
  // ---------- Química ----------
  { re: /alcool 70|higieniza as maos/, img: 'hand sanitizer alcohol gel', leg: 'Álcool 70%: o etanol desnatura proteínas de micro-organismos.' },
  { re: /removedor de esmalte|acetona/, img: 'acetone nail polish remover bottle', leg: 'Removedor de esmalte à base de acetona (propanona).' },
  { re: /odor de peixe|metilamina/, img: 'fish market fresh fish ice', leg: 'O cheiro de peixe deteriorado vem de aminas, como a metilamina.' },
  { re: /removedor de tinta|diclorometano/, img: 'paint stripper', leg: 'Removedores de tinta podem conter solventes clorados, como o diclorometano.' },
  { re: /botijao|gas de cozinha/, img: 'LPG gas cylinder Brazil', leg: 'Botijão de GLP: mistura de propano e butano.' },
  { re: /isqueiro/, img: 'butane lighter', leg: 'Isqueiros usam butano liquefeito sob pressão.' },
  { re: /amadurecer frutas|ch2=ch2/, img: 'bananas ripening', leg: 'O eteno (etileno) é um hormônio vegetal que acelera o amadurecimento.' },
  { re: /polipropileno|propeno|produzao de plasticos|producao de plasticos/, img: 'polypropylene plastic containers', leg: 'Potes e embalagens de polipropileno, polímero feito a partir do propeno.' },
  { re: /polietileno/, img: 'polyethylene plastic bags', leg: 'Sacolas plásticas de polietileno, polímero formado a partir do eteno.' },
  { re: /cicloexano/, img: 'cyclohexane chair conformation 3D', leg: 'Modelo 3D do cicloexano: seis carbonos em anel.' },
  { re: /benzeno/, img: 'benzene 3D ball model', leg: 'Modelo da molécula de benzeno, com anel de seis carbonos.' },
  { re: /dietil-eter|anestesico/, img: 'ether anaesthesia historical 1846', leg: 'Em 1846, o éter foi usado como anestésico em uma cirurgia pública em Boston.' },
  { re: /acetileno|soldas/, img: 'oxyacetylene welding torch', leg: 'Maçarico oxiacetilênico: a chama do acetileno passa de 3000 °C.' },
  { re: /vinagre|acido acetico|ch3–cooh|ch3-cooh/, img: 'vinegar bottle', leg: 'O vinagre é uma solução de ácido acético (4% a 6%).' },
  { re: /formol|metanal/, img: 'biological specimens jars formalin museum', leg: 'Peças conservadas em formol, solução aquosa de metanal.' },
  { re: /manteiga ranc|butanoico/, img: 'butter block', leg: 'A manteiga rançosa libera ácido butanoico, de cheiro forte.' },
  { re: /formiga|acido formico|metanoico/, img: 'ant macro formica', leg: 'Formigas injetam ácido metanoico (fórmico) na picada.' },
  { re: /banana artificial|aroma de frutas|aromas de frutas/, img: 'banana flavoring ester', leg: 'Ésteres dão aroma a frutas e a essências artificiais.' },
  { re: /acetato de etila|colas e tintas/, img: 'glue tube', leg: 'O acetato de etila é solvente de colas, tintas e removedores.' },
  { re: /metanol/, img: 'methanol fuel', leg: 'Metanol: combustível e solvente, tóxico se ingerido.' },
  { re: /butanal|aromatizantes/, img: 'food flavoring bottles', leg: 'Aldeídos estão entre as moléculas usadas em aromatizantes.' },
  { re: /etanol/, img: 'ethanol fuel pump Brazil', leg: 'Bomba de etanol: o Brasil produz o álcool combustível a partir da cana.' },
  { re: /amonia|fertilizante|n2 \+ 3 h2|haber/, img: 'Haber process ammonia plant', leg: 'Fábrica de amônia: o processo Haber-Bosch abastece a produção de fertilizantes.',
    t: 'Cerca de metade dos alimentos produzidos no mundo depende de fertilizantes nitrogenados feitos a partir da amônia. No processo Haber-Bosch, N₂ do ar e H₂ reagem a cerca de 450 °C e 200 atm, com catalisador de ferro. Como a reação é reversível, a indústria escolhe pressão e temperatura para obter o máximo de amônia no menor tempo.' },
  { re: /refrigerante|co2\(g\)|co₂\(g\)/, img: 'soda bottle opening bubbles', leg: 'Ao abrir a garrafa, a pressão cai e o CO₂ escapa em bolhas.' },
  { re: /n2o4|n₂o₄|no2|no₂/, img: 'nitrogen dioxide equilibrium tubes hot cold', leg: 'NO₂ (castanho) e N₂O₄ (incolor): a cor muda com a temperatura.' },
  { re: /conversores? catalitico/, img: 'catalytic converter cutaway', leg: 'Corte de um conversor catalítico: metais como platina e paládio aceleram as reações.' },
  { re: /antiacido|efervescente/, img: 'effervescent tablet water glass', leg: 'Comprimido efervescente reagindo na água.' },
  { re: /padaria|fermenta/, img: 'bread dough rising', leg: 'Massa de pão crescendo: enzimas do fermento aceleram as reações.' },
  { re: /agua oxigenada/, img: 'hydrogen peroxide bottle', leg: 'Água oxigenada (H₂O₂) se decompõe em água e oxigênio.' },
  { re: /zinco/, img: 'zinc hydrochloric acid reaction', leg: 'Zinco reagindo com ácido clorídrico e liberando gás hidrogênio.' },
  { re: /agua quente|amolecimento de alimentos/, img: 'boiling water pot', leg: 'Em água quente, as moléculas se movem mais e reagem mais depressa.' },
  { re: /sulfato de bario|baso4|baso₄|radiografia/, img: 'barium swallow X-ray', leg: 'Radiografia com contraste de sulfato de bário.' },
  { re: /repolho roxo/, img: 'red cabbage pH indicator', leg: 'Extrato de repolho roxo muda de cor conforme o pH.' },
  { re: /limao/, img: 'lemon slices', leg: 'O suco de limão é ácido por causa do ácido cítrico.' },
  { re: /produto de limpeza|ceramica/, img: 'cleaning products bottles', leg: 'Produtos de limpeza costumam ser básicos (pH acima de 7).' },
  { re: /meia-vida|radioativ|particula alfa|isotopo/, img: 'nuclear medicine scan', leg: 'Na medicina nuclear, a meia-vida dos radioisótopos define doses e exames.' },
  { re: /pilha|eletrodo|anodo|catodo/, img: 'Daniell cell', leg: 'Pilha de Daniell: oxidação no ânodo (zinco) e redução no cátodo (cobre).' },
  { re: /combustao|combustivel libera/, img: 'gas stove flame', leg: 'A combustão libera energia em forma de calor e luz.' },
  { re: /proteinas sao polimeros|aminoacidos/, img: 'protein structure ribbon', leg: 'Proteínas são longas cadeias de aminoácidos.' },
  { re: /condensacao/, img: 'nylon rope', leg: 'Náilon e PET são polímeros de condensação.' }
];

const TEMAS = [
  // ---------- Biologia ----------
  { re: /imun|vacina|soro|anticorp|defesa|linfocit|barreira/, img: 'vaccination Brazil SUS',
    t: 'O sistema imune combina defesas inatas (pele, mucosas, febre, inflamação), que agem logo e sem distinguir o invasor, e defesas adquiridas, feitas por linfócitos que produzem anticorpos específicos e guardam memória. Vacinas ensinam o corpo a produzir a própria proteção (imunidade ativa); soros e o leite materno trazem anticorpos prontos (imunidade passiva).' },
  { re: /clon/, img: 'Dolly the sheep',
    t: 'Na clonagem reprodutiva, o núcleo de uma célula do doador é colocado em um óvulo sem núcleo, e o embrião é implantado em um útero: nasce um indivíduo com o mesmo DNA nuclear do doador. Na clonagem terapêutica, as células são cultivadas apenas para formar tecidos, sem gerar um novo organismo.' },
  { re: /transcri|tradu|codon|anticodon|ribossomo|rna polimerase|rna transportador|sintese de proteinas|producao de proteinas/, img: 'protein synthesis transcription translation diagram',
    t: 'Para fabricar uma proteína, a célula primeiro copia um gene do DNA em RNA mensageiro, no núcleo (transcrição). Depois, nos ribossomos, o mRNA é lido de três em três bases (códons), e cada RNA transportador traz o aminoácido correspondente (tradução). É assim que a informação genética vira as proteínas que formam e fazem funcionar o corpo.' },
  { re: /\bdna\b|\brna\b|uracila|timina|dupla helice|fita|desoxirribose|ribose/, img: 'DNA double helix structure',
    t: 'DNA e RNA são ácidos nucleicos, formados por nucleotídeos (açúcar, fosfato e base nitrogenada). O DNA tem fita dupla, açúcar desoxirribose e as bases A, T, C e G, pareadas sempre A–T e C–G; o RNA geralmente tem fita simples, açúcar ribose e uracila (U) no lugar da timina. Essa estrutura, descrita em 1953, explica como a informação genética é copiada.' },
  { re: /transgen|ogm|engenharia genetica|biosseguranca|geneticamente modificad|transgenia/, img: 'genetically modified crops field',
    t: 'Organismos geneticamente modificados (OGM) têm o DNA alterado em laboratório; quando recebem um gene de outra espécie, são chamados transgênicos. No Brasil, a CTNBio avalia a segurança de cada OGM, e os alimentos com mais de 1% de ingrediente transgênico devem trazer no rótulo um "T" em um triângulo amarelo.' },
  { re: /biomagnifica|bioconcentra|cadeia alimentar|nivel trofico/, img: 'biomagnification food chain diagram',
    t: 'Substâncias que o organismo não consegue eliminar, como mercúrio, chumbo e alguns pesticidas, ficam guardadas nos tecidos. Quando um ser vivo absorve a substância direto do ambiente, fala-se em bioconcentração; quando ela passa de presa para predador e a concentração aumenta a cada nível da cadeia, fala-se em biomagnificação. Por isso grandes predadores, e quem come peixes, são os mais expostos.' },
  { re: /virus|acelular|hospedeir/, img: 'virus structure diagram',
    t: 'Vírus são partículas acelulares: têm material genético (DNA ou RNA) dentro de uma capa de proteínas, o capsídeo, mas não têm citoplasma, ribossomos nem metabolismo próprio. Só se multiplicam dentro de uma célula hospedeira, usando a maquinaria dela; por isso antibióticos, que atacam estruturas de bactérias, não funcionam contra vírus.' },
  { re: /conservacao|preserva|sustentav|extrativis|manejo|desmat|biodiversidade/, img: 'Amazon rainforest Brazil',
    t: 'O Sistema Nacional de Unidades de Conservação (Lei 9.985/2000) divide as áreas protegidas em dois grupos: as de proteção integral, em que só se admite uso indireto (pesquisa, educação), e as de uso sustentável, que permitem extrair recursos de forma planejada, como nas reservas extrativistas de castanha, açaí e borracha.' },
  { re: /populacao|competicao|predad|ecossistema|ecologic/, img: 'food web ecosystem',
    t: 'Em um ecossistema, as populações interagem entre si e com o ambiente: competem por recursos, servem de alimento umas às outras e são limitadas pela quantidade de água, luz, espaço e comida disponível. A energia flui dos produtores para os consumidores, e boa parte dela se perde como calor a cada passagem.' },
  { re: /saneamento|esgoto|agua tratada|giardi|ameb/, img: 'sewage treatment plant',
    t: 'Segundo o Instituto Trata Brasil, cerca de 100 milhões de brasileiros não têm coleta de esgoto. Doenças de transmissão fecal-oral, como giardíase, amebíase e hepatite A, são mais comuns onde falta água tratada e esgoto, o que mostra a ligação entre saúde, infraestrutura e políticas públicas.' },
  { re: /alelo|heterozigot|homozigot|genotip|fenotip|cruzamento/, img: 'Punnett square genetics',
    t: 'Na herança mendeliana, cada característica depende de um par de alelos, um vindo de cada genitor. O quadro de Punnett organiza as combinações possíveis e permite calcular probabilidades, como na genética de doenças hereditárias acompanhada em aconselhamento genético.' },
  { re: /droga|sistema nervoso|neuro/, img: 'neuron synapse diagram',
    t: 'Os neurônios se comunicam nas sinapses por meio de neurotransmissores. Drogas psicoativas aumentam, imitam ou bloqueiam esses sinais; com o uso repetido, o cérebro se adapta (tolerância), o que leva ao aumento da dose e à dependência.' },
  { re: /glicose|glicemia|insulina|diabetes/, img: 'insulin glucose regulation diagram',
    t: 'A insulina, produzida pelo pâncreas, faz as células absorverem a glicose do sangue. No diabetes tipo 1 falta insulina; no tipo 2, as células respondem mal a ela (resistência). O Brasil tem mais de 16 milhões de adultos com diabetes, e a alimentação e a atividade física pesam muito na prevenção.' },
  { re: /pcr|forense|pericia|perfil genetico|crispr|sequenciamento/, img: 'DNA laboratory forensic',
    t: 'A biotecnologia usa ferramentas que leem, copiam e editam o DNA: a PCR multiplica um trecho específico, a eletroforese separa fragmentos por tamanho e o CRISPR-Cas9 corta o DNA em um ponto escolhido. Essas técnicas são usadas em perícias, diagnósticos e pesquisas médicas.' },
  // ---------- Química ----------
  { q: 1, re: /equilibrio|le chatelier|⇌|kc\b|constante de equilibrio/, img: 'chemical equilibrium',
    t: 'Em uma reação reversível em sistema fechado, reagentes viram produtos e produtos voltam a ser reagentes ao mesmo tempo. No equilíbrio, as duas velocidades se igualam e as concentrações param de mudar. Pelo princípio de Le Chatelier (1884), se alguém altera concentração, pressão ou temperatura, o sistema se desloca no sentido que reduz essa alteração; só a temperatura muda o valor de Kc.' },
  { q: 1, re: /velocidade|catalisador|superficie de contato|energia de ativacao|mais rapid|acelerar|ordem/, img: 'reaction rate collision theory',
    t: 'Pela teoria das colisões, uma reação acontece quando partículas se chocam com energia suficiente (a energia de ativação) e na orientação certa. Aumentar a temperatura, a concentração ou a superfície de contato torna esses choques mais frequentes ou mais eficazes; um catalisador abre um caminho com menor energia de ativação e não é consumido.' },
  { q: 1, re: /entalpia|δh|exoterm|endoterm|libera energia|libera calor/, img: 'exothermic endothermic energy diagram',
    t: 'Toda reação química troca energia com o ambiente. Quando libera calor (combustão, respiração celular), é exotérmica e tem ΔH negativo; quando absorve calor (cozimento, fotossíntese), é endotérmica e tem ΔH positivo.' },
  { q: 1, re: /kps|solubilidade|saturada|ion comum/, img: 'precipitate test tube',
    t: 'Sais pouco solúveis formam soluções saturadas em contato com o sólido. O produto de solubilidade (Kps) indica quanto do sal se dissolve; ao adicionar um íon que já existe na solução (efeito do íon comum), a solubilidade diminui.' },
  { q: 1, re: /radioativ|meia-vida|alfa|beta|nucle/, img: 'radioactive decay half-life',
    t: 'Núcleos instáveis emitem radiação até se tornarem estáveis. A meia-vida é o tempo para metade da amostra se desintegrar; ela é usada na datação de fósseis (carbono-14), em exames e tratamentos da medicina nuclear e no planejamento do armazenamento do lixo radioativo.' },
  { q: 1, re: /pilha|oxidacao|reducao|eletrodo|anodo|catodo/, img: 'battery electrochemistry',
    t: 'Pilhas e baterias transformam energia química em elétrica: no ânodo ocorre oxidação (perda de elétrons) e no cátodo, redução (ganho de elétrons). Celulares, carros elétricos e marca-passos dependem dessas reações.' },
  { q: 1, re: /polimer|monomero|plastic|proteina/, img: 'plastic polymers products',
    t: 'Polímeros são moléculas gigantes formadas pela repetição de unidades menores, os monômeros. Podem ser naturais (proteínas, amido, celulose) ou sintéticos (plásticos). Na polimerização por adição, os monômeros se somam; na por condensação, cada ligação libera uma molécula pequena, geralmente água.' },
  { q: 1, re: /alcool|cetona|aldeido|cooh|acido (acetico|butanoico|formico|metanoico|carboxilico)|ch3–co|\bester|\beter\b|\bamina|carboxil|funcao organica|funcoes organicas|hidroxila|carbonila|haleto/, img: 'organic functional groups',
    t: 'Os compostos orgânicos são agrupados em funções, conforme o grupo de átomos que define suas propriedades: álcool (–OH em carbono saturado), aldeído (C=O na ponta da cadeia), cetona (C=O entre carbonos), ácido carboxílico (–COOH), éster (–COO– entre carbonos), éter (–O– entre carbonos) e amina (nitrogênio ligado a carbono). Essas funções aparecem em remédios, combustíveis, cosméticos e alimentos.' },
  { q: 1, re: /cadeia|iupac|nome oficial|carbonos|hidrocarboneto|ligacao dupla|ligacao tripla|alcano|alceno|alcino/, img: 'hydrocarbon molecular models',
    t: 'O carbono faz quatro ligações e forma cadeias que podem ser abertas ou fechadas (em anel), normais ou ramificadas, homogêneas (só carbonos) ou heterogêneas (com outro átomo, como O, N ou S, entre carbonos), saturadas ou insaturadas. A IUPAC dá nome a cada composto a partir do número de carbonos da cadeia principal (met, et, prop, but, pent…), do tipo de ligação (ano, eno, ino) e dos ramos.' },
  { q: 1, re: /\bph\b|poh|indicador|repolho|limao|h\+|h⁺/, img: 'pH scale everyday substances',
    t: 'A escala de pH vai de 0 a 14 a 25 °C: abaixo de 7 o meio é ácido, acima de 7 é básico. Cada unidade de pH corresponde a uma variação de 10 vezes na concentração de H⁺. O pH importa na digestão, no sangue (cerca de 7,4), na agricultura e nos produtos de limpeza.' },
];

const GERAL = {
  Biologia: { img: 'biology laboratory microscope students', t: 'A Biologia ajuda a entender a saúde, os alimentos, o ambiente e as tecnologias do dia a dia. Leia a situação com atenção e relacione-a ao conceito pedido.' },
  'Química': { img: 'chemistry laboratory glassware', t: 'A Química está nos alimentos, nos combustíveis, nos remédios e nos produtos de limpeza. Leia a situação com atenção e relacione-a ao conceito pedido.' }
};

function contexto(enunciado, componente) {
  const e = normal(enunciado);
  const esp = ESPEC.find(x => x.re.test(e)), tema = TEMAS.find(x => !!x.q === (componente === 'Química') && x.re.test(e)), ger = GERAL[componente] || GERAL.Biologia;
  return {
    texto: (esp && esp.t) || (tema && tema.t) || ger.t,
    img: (esp && esp.img) || (tema && tema.img) || ger.img,
    legenda: (esp && esp.leg) || '',
    casou: !!(esp || tema)
  };
}

/* todas as buscas de imagem do catálogo (para conferir) */
const BUSCAS = [...new Set([...ESPEC, ...TEMAS, ...Object.values(GERAL)].map(x => x.img))];

module.exports = { contexto, normal, BUSCAS };
