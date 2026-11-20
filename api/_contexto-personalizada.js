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
  { re: /cachorro|pet shop|animais de estimacao/, img: 'Intracytoplasmic sperm injection', leg: 'Micromanipulação de óvulos: técnica usada na transferência de núcleo da clonagem.' },
  { re: /cobra|antiofidico|veneno/, img: 'snake venom extraction', leg: 'Extração de veneno de serpente no Instituto Butantan, etapa da produção do soro antiofídico.',
    t: 'O Instituto Butantan, em São Paulo, produz soros desde 1901. Pequenas doses de veneno são injetadas em cavalos, que produzem anticorpos; esses anticorpos são purificados do sangue do animal e viram o soro aplicado em quem foi picado. O soro age na hora, mas a proteção dura pouco, porque o organismo não produziu os próprios anticorpos.' },
  { re: /antitetanico|tetano/, img: 'Nurse giving vaccine', leg: 'Aplicação de soro ou vacina: o soro antitetânico traz anticorpos prontos, de ação imediata e passageira.' },
  { re: /leite materno|amamenta/, img: 'Breastfeeding baby', leg: 'O leite materno transfere anticorpos da mãe para o bebê.',
    t: 'O leite materno, especialmente o colostro dos primeiros dias, é rico em anticorpos (IgA). Por isso o Ministério da Saúde recomenda amamentação exclusiva até os 6 meses: o bebê recebe proteção pronta enquanto o próprio sistema imune ainda amadurece.' },
  { re: /hpv/, img: 'Vaccine syringe', leg: 'Vacinação contra o HPV, oferecida pelo SUS a meninas e meninos de 9 a 14 anos.' },
  { re: /sarampo/, img: 'Oral polio vaccine drops', leg: 'Vacinação infantil: a tríplice viral protege contra sarampo, caxumba e rubéola.' },
  { re: /catapora/, img: 'chickenpox varicella child', leg: 'Catapora (varicela): quem teve a doença costuma ficar protegido pela memória imunológica.' },
  { re: /febre/, img: 'clinical thermometer fever', leg: 'A febre é uma resposta inespecífica do organismo a infecções.' },
  { re: /corte na mao|ralar o joelho|ferimento|coagula/, img: 'scraped knee', leg: 'A pele íntegra e a coagulação são as primeiras barreiras contra micro-organismos.' },
  { re: /pele e as mucosas|barreiras fisicas|a pele e as mucosas/, img: 'Layers of epidermis no labels', leg: 'Camadas da pele: uma barreira física da imunidade inata.' },
  { re: /linfocitos? b|anticorpos especificos/, img: 'Blood smear', leg: 'Esfregaço de sangue ao microscópio: os glóbulos brancos incluem os linfócitos B, que produzem anticorpos.' },
  { re: /mrna|covid/, img: 'Syringe needle', leg: 'Frascos de vacina: as vacinas de mRNA levam a "receita" de uma proteína do vírus, não o vírus.' },
  { re: /vacina/, img: 'Brazil vaccination campaign Ze Gotinha', leg: 'Campanha de vacinação do SUS: o Programa Nacional de Imunizações existe desde 1973.' },
  { re: /celulas-tronco|celula-tronco/, img: 'Human embryonic stem cells', leg: 'Colônia de células-tronco vista ao microscópio.',
    t: 'Células-tronco podem se dividir muitas vezes e se transformar em diferentes tipos de células. Na clonagem terapêutica, elas são cultivadas para formar tecidos (pele para queimados, músculo cardíaco para testes de remédios), sem que nenhum embrião seja implantado em um útero. No Brasil, a Lei de Biossegurança (2005) regula essas pesquisas.' },
  { re: /pericia|forense|perfil genetico|marcadores|laudo de dna/, img: 'Gel electrophoresis DNA', leg: 'Gel de eletroforese: cada faixa é um fragmento de DNA; o padrão de faixas forma o perfil genético.' },
  { re: /pcr/, img: 'PCR thermal cycler laboratory', leg: 'Termociclador: o aparelho que faz a PCR, copiando milhões de vezes um trecho de DNA.' },
  { re: /crispr/, img: 'Laboratory micropipette', leg: 'Micropipeta: instrumento usado para manipular pequenos volumes de DNA e reagentes na edição gênica.' },
  { re: /insulina|glicemia|glicose|diabetes/, img: 'Glucometer', leg: 'Glicosímetro: aparelho que mede a glicose no sangue, usado no acompanhamento do diabetes.' },
  { re: /droga|neuroadapta/, img: 'Neurons micrograph', leg: 'Neurônios ao microscópio: as drogas agem nas sinapses, os pontos de comunicação entre eles.' },
  { re: /giardiase|amebiase/, img: 'Giardia lamblia microscope', leg: 'Giardia lamblia ao microscópio: transmitida por água e alimentos contaminados.' },
  { re: /atum|aves marinhas|mercurio/, img: 'Gold mining Amazon', leg: 'Garimpo de ouro: o mercúrio usado para separar o ouro contamina rios e peixes.' },
  { re: /garca|garcas/, img: 'heron catching fish', leg: 'Garças e outras aves predadoras ficam no topo das cadeias aquáticas.' },
  { re: /\bostras?\b|mexilh|molusco/, img: 'mussels bed rocks', leg: 'Mexilhões e ostras filtram grandes volumes de água e acumulam o que há nela.' },
  { re: /alga de um|uma alga/, img: 'green algae microscope', leg: 'Algas absorvem substâncias da água e podem acumulá-las.' },
  { re: /eutrofiza|crescimento excessivo de algas|crescimento de algas/, img: 'eutrophication algal bloom lake', leg: 'Floração de algas em um lago com excesso de nutrientes (eutrofização).' },
  { re: /bioindicador/, img: 'Lichen on tree bark', leg: 'Liquens e outros bioindicadores revelam a qualidade do ambiente.' },
  { re: /pesticida|inseticida|corante|metal pesado/, img: 'pesticide spraying crop field', leg: 'Pulverização de agrotóxicos: parte da substância chega a rios e lagos.' },
  { re: /dengue/, img: 'Aedes aegypti mosquito', leg: 'O mosquito Aedes aegypti transmite o vírus da dengue.' },
  { re: /hiv/, img: 'HIV budding lymphocyte electron micrograph', leg: 'Micrografia eletrônica: partículas de HIV saindo de um linfócito.' },
  { re: /antibiotico/, img: 'Amoxicillin capsules', leg: 'Antibióticos atacam estruturas de bactérias, que os vírus não têm.' },
  { re: /gripe|influenza/, img: 'influenza virus electron micrograph', leg: 'Vírus da gripe (influenza) vistos ao microscópio eletrônico.' },
  { re: /capsideo|ilustracao de um virus|desenha um virus/, img: 'Bacteriophage electron micrograph', leg: 'Vírus vistos ao microscópio eletrônico: material genético dentro de uma capa de proteínas (capsídeo).' },
  { re: /contem ogm|rotulo de um pacote/, img: 'Golden rice', leg: 'O "T" amarelo indica, no rótulo, alimento com ingrediente transgênico.' },
  { re: /algodao/, img: 'cotton field boll', leg: 'Lavoura de algodão: no Brasil há variedades transgênicas resistentes a lagartas.' },
  { re: /\bmilho\b/, img: 'maize corn field Brazil', leg: 'Lavoura de milho: grande parte do milho plantado no Brasil é transgênico.' },
  { re: /\bsoja\b/, img: 'Soybean field', leg: 'Plantação de soja: o Brasil é o maior produtor mundial do grão.' },
  { re: /castanha/, img: 'Brazil nut', leg: 'Coleta de castanha-do-pará na Amazônia, exemplo de extrativismo sustentável.' },
  { re: /\bacai\b/, img: 'Acai palm', leg: 'Coleta de açaí: o manejo mantém as palmeiras produzindo por anos.' },
  { re: /defeso|pescadores/, img: 'Artisanal fishing Brazil', leg: 'Pesca artesanal: o defeso protege a reprodução dos peixes.' },
  { re: /mata atlantica/, img: 'Atlantic Forest Brazil Serra do Mar', leg: 'Mata Atlântica na Serra do Mar: restam cerca de 12% da cobertura original.' },
  { re: /parque estadual|protecao integral|proibe visitas|sem visitacao/, img: 'Itatiaia National Park', leg: 'Unidades de proteção integral preservam a natureza com o mínimo de interferência humana.' },
  { re: /coelho|raposa/, img: 'Red fox', leg: 'Raposas se alimentam de herbívoros como coelhos.' },
  { re: /disputam a mesma luz|competicao/, img: 'forest canopy competition light', leg: 'No dossel da floresta, as plantas competem por luz.' },
  { re: /capacidade de suporte|logistic/, img: 'Rabbits', leg: 'Coelhos: a população cresce rápido até esbarrar no limite de alimento e espaço do ambiente.' },
  { re: /produtividade primaria|10% dessa energia|10% de transferencia|fixam 10/, img: 'Capybaras grazing', leg: 'Capivaras pastando: herbívoros aproveitam só cerca de 10% da energia das plantas que comem.' },
  { re: /heterozigot|cruzamento|diibrid/, img: 'Pisum sativum flowers', leg: 'Flores de ervilha: foi com essa planta que Gregor Mendel descobriu as leis da herança (1865).' },
  { re: /figado e do cerebro|expressao genica/, img: 'Human brain model', leg: 'O cérebro e o fígado têm o mesmo DNA, mas cada órgão ativa genes diferentes.' },
  { re: /mariposa/, img: 'Biston betularia', leg: 'Mariposas Biston betularia clara e escura: na Inglaterra industrial, a forma escura passou a predominar.',
    t: 'Durante a Revolução Industrial, a fuligem escureceu os troncos das árvores perto de Manchester. As mariposas claras ficaram visíveis para as aves e eram mais caçadas, enquanto as escuras sobreviviam e deixavam mais descendentes. Com o controle da poluição no século XX, a forma clara voltou a ser comum: um exemplo clássico de seleção natural observada.' },
  { re: /mare vermelha/, img: 'Red tide', leg: 'Maré vermelha: proliferação de algas microscópicas (dinoflagelados) que pode produzir toxinas.',
    t: 'A maré vermelha é a multiplicação explosiva de algas microscópicas, favorecida por água quente e excesso de nutrientes vindos de esgoto e fertilizantes. Algumas dessas algas produzem toxinas que matam peixes e se acumulam em mariscos, por isso a Vigilância Sanitária pode proibir a coleta e a venda de frutos do mar no período.' },
  { re: /chagas|barbeiro/, img: 'Triatoma infestans', leg: 'O barbeiro (Triatoma infestans), inseto que transmite o protozoário causador da doença de Chagas.',
    t: 'A doença de Chagas, descrita em 1909 pelo médico brasileiro Carlos Chagas, é causada pelo protozoário Trypanosoma cruzi. O inseto barbeiro se esconde em frestas de casas de pau a pique e, ao picar, elimina fezes com o parasita; hoje também há transmissão por alimentos contaminados, como caldo de cana e açaí mal higienizados.' },
  { re: /panspermia|meteorito|vindos do espaco/, img: 'Murchison meteorite', leg: 'Fragmento do meteorito Murchison, que contém aminoácidos formados no espaço.' },
  { re: /biogenese|abiogenese|materia inanimada|geracao espontanea/, img: 'Pasteur swan neck flask', leg: 'Frasco "pescoço de cisne" usado por Pasteur para derrubar a ideia de geração espontânea.' },
  { re: /evolucao quimica|condicoes primitivas|primeiras moleculas organicas/, img: 'Hydrothermal vent', leg: 'Fonte hidrotermal no fundo do mar: ambiente onde as primeiras moléculas orgânicas podem ter se formado.' },
  { re: /grupo controle|variavel|hipotese|metodo cientifico|primeira etapa do metodo/, img: 'Petri dish bacteria', leg: 'Placas de Petri em laboratório: experimentos comparam o grupo testado com um grupo controle.' },
  { re: /ciclo do carbono|combustiveis fosseis libera co/, img: 'Coal power plant', leg: 'Usina termelétrica a carvão: a queima devolve à atmosfera carbono guardado há milhões de anos.' },
  { re: /ciclo do nitrogenio/, img: 'Root nodules', leg: 'Nódulos nas raízes de leguminosas: bactérias que vivem ali fixam o nitrogênio do ar.' },
  { re: /ancestral comum|clado/, img: 'Fossil fish', leg: 'Peixe fóssil: os fósseis ajudam a reconstruir os ancestrais comuns dos grupos atuais.' },
  { re: /coracao|veia pulmonar|atrio|ventriculo/, img: 'Pig heart', leg: 'Coração de porco, muito parecido com o humano: quatro cavidades e duas circulações.' },
  { re: /radioterapia|radiacao ionizante|tumor/, img: 'Radiation therapy', leg: 'Radioterapia: feixes de radiação atingem o tumor, cujas células se dividem rapidamente.' },
  { re: /meiose/, img: 'Human karyotype', leg: 'Cromossomos humanos organizados em pares: na meiose, cada gameta recebe um de cada par.' },
  { re: /mitose|regenera|divisao de suas celulas/, img: 'Onion root tip mitosis', leg: 'Ponta de raiz de cebola ao microscópio: várias células em diferentes fases da mitose.' },
  { re: /sem nucleo organizado|procariont/, img: 'Escherichia coli', leg: 'Bactéria Escherichia coli ao microscópio eletrônico: célula procarionte, sem núcleo organizado.' },
  { re: /olhos/, img: 'Human eye', leg: 'A cor dos olhos depende de vários genes; em exercícios, usa-se o modelo simplificado de um gene.' },
  { re: /pragas|elimina os predadores/, img: 'Ladybird eating aphids', leg: 'Joaninha comendo pulgões: predadores naturais controlam pragas nas lavouras.' },
  { re: /fitoplancton/, img: 'Diatoms', leg: 'Fitoplâncton: algas microscópicas que produzem matéria orgânica pela fotossíntese.' },
  // ---------- Química ----------
  { re: /alcool 70|higieniza as maos/, img: 'Hand sanitizing', leg: 'Álcool 70%: o etanol desnatura proteínas de micro-organismos.' },
  { re: /removedor de esmalte|acetona/, img: 'Nail polish', leg: 'Esmaltes: a acetona (propanona) dos removedores dissolve a película do esmalte.' },
  { re: /odor de peixe|metilamina/, img: 'Fish on ice', leg: 'O cheiro de peixe deteriorado vem de aminas, como a metilamina.' },
  { re: /removedor de tinta|diclorometano/, img: 'paint stripper', leg: 'Removedores de tinta podem conter solventes clorados, como o diclorometano.' },
  { re: /botijao|gas de cozinha/, img: 'LPG cylinder', leg: 'Botijão de GLP: mistura de propano e butano.' },
  { re: /isqueiro/, img: 'butane lighter', leg: 'Isqueiros usam butano liquefeito sob pressão.' },
  { re: /amadurecer frutas|ch2=ch2/, img: 'bananas ripening', leg: 'O eteno (etileno) é um hormônio vegetal que acelera o amadurecimento.' },
  { re: /polipropileno|propeno|produzao de plasticos|producao de plasticos/, img: 'Polypropylene pellets', leg: 'Grânulos de polipropileno, matéria-prima de potes e embalagens, feito a partir do propeno.' },
  { re: /polietileno/, img: 'Plastic bags', leg: 'Sacolas plásticas de polietileno, polímero formado a partir do eteno.' },
  { re: /cicloexano/, img: 'cyclohexane chair conformation 3D', leg: 'Modelo 3D do cicloexano: seis carbonos em anel.' },
  { re: /benzeno/, img: 'benzene 3D ball model', leg: 'Modelo da molécula de benzeno, com anel de seis carbonos.' },
  { re: /dietil-eter|anestesico/, img: 'Ether Day', leg: 'Em 1846, o éter foi usado como anestésico em uma cirurgia pública em Boston.' },
  { re: /acetileno|soldas/, img: 'Oxyacetylene', leg: 'Maçarico oxiacetilênico: a chama do acetileno passa de 3000 °C.' },
  { re: /vinagre|acido acetico|ch3–cooh|ch3-cooh/, img: 'Vinegar cruet', leg: 'O vinagre é uma solução de ácido acético (4% a 6%).' },
  { re: /formol|metanal/, img: 'biological specimens jars formalin museum', leg: 'Peças conservadas em formol, solução aquosa de metanal.' },
  { re: /manteiga ranc|butanoico/, img: 'butter block', leg: 'A manteiga rançosa libera ácido butanoico, de cheiro forte.' },
  { re: /formiga|acido formico|metanoico/, img: 'ant macro formica', leg: 'Formigas injetam ácido metanoico (fórmico) na picada.' },
  { re: /banana artificial|aroma de frutas|aromas de frutas/, img: 'Isoamyl acetate', leg: 'Ésteres dão aroma a frutas e a essências artificiais.' },
  { re: /acetato de etila|colas e tintas/, img: 'Gluing wood', leg: 'O acetato de etila é solvente de colas, tintas e removedores.' },
  { re: /metanol/, img: 'Methanol 3D', leg: 'Modelo da molécula de metanol: combustível e solvente, tóxico se ingerido.' },
  { re: /butanal|aromatizantes/, img: 'Butyraldehyde', leg: 'Aldeídos estão entre as moléculas usadas em aromatizantes.' },
  { re: /etanol/, img: 'ethanol fuel pump Brazil', leg: 'Bomba de etanol: o Brasil produz o álcool combustível a partir da cana.' },
  { re: /amonia|fertilizante|n2 \+ 3 h2|haber/, img: 'Ammonia production plant', leg: 'Fábrica de amônia: o processo Haber-Bosch abastece a produção de fertilizantes.',
    t: 'Cerca de metade dos alimentos produzidos no mundo depende de fertilizantes nitrogenados feitos a partir da amônia. No processo Haber-Bosch, N₂ do ar e H₂ reagem a cerca de 450 °C e 200 atm, com catalisador de ferro. Como a reação é reversível, a indústria escolhe pressão e temperatura para obter o máximo de amônia no menor tempo.' },
  { re: /refrigerante|co2\(g\)|co₂\(g\)/, img: 'Carbonated water', leg: 'Ao abrir a garrafa, a pressão cai e o CO₂ escapa em bolhas.' },
  { re: /n2o4|n₂o₄|no2|no₂/, img: 'Nitrogen dioxide', leg: 'NO₂ (castanho) e N₂O₄ (incolor): a cor muda com a temperatura.' },
  { re: /conversores? catalitico/, img: 'Catalytic converter', leg: 'Corte de um conversor catalítico: metais como platina e paládio aceleram as reações.' },
  { re: /antiacido|efervescente/, img: 'effervescent tablet water glass', leg: 'Comprimido efervescente reagindo na água.' },
  { re: /padaria|fermenta/, img: 'bread dough rising', leg: 'Massa de pão crescendo: enzimas do fermento aceleram as reações.' },
  { re: /agua oxigenada/, img: 'Elephant toothpaste', leg: 'Decomposição acelerada da água oxigenada: o catalisador libera oxigênio e forma espuma.' },
  { re: /zinco/, img: 'Zinc hydrochloric acid', leg: 'Zinco reagindo com ácido clorídrico e liberando gás hidrogênio.' },
  { re: /agua quente|amolecimento de alimentos/, img: 'Water boiling in a pot', leg: 'Em água quente, as moléculas se movem mais e reagem mais depressa.' },
  { re: /sulfato de bario|baso4|baso₄|radiografia/, img: 'barium swallow X-ray', leg: 'Radiografia com contraste de sulfato de bário.' },
  { re: /repolho roxo/, img: 'red cabbage pH indicator', leg: 'Extrato de repolho roxo muda de cor conforme o pH.' },
  { re: /limao/, img: 'lemon slices', leg: 'O suco de limão é ácido por causa do ácido cítrico.' },
  { re: /produto de limpeza|ceramica/, img: 'Dish soap', leg: 'Detergentes têm caráter levemente básico e removem gordura.' },
  { re: /meia-vida|radioativ|particula alfa|isotopo/, img: 'PET-CT scanner', leg: 'Aparelho de PET-CT: a medicina nuclear usa radioisótopos de meia-vida curta.' },
  { re: /\bpilha|eletrodo|anodo|catodo/, img: 'Daniell cell', leg: 'Pilha de Daniell: oxidação no ânodo (zinco) e redução no cátodo (cobre).' },
  { re: /combustao|combustivel libera/, img: 'gas stove flame', leg: 'A combustão libera energia em forma de calor e luz.' },
  { re: /proteinas sao polimeros|aminoacidos/, img: 'protein structure ribbon', leg: 'Proteínas são longas cadeias de aminoácidos.' },
  { re: /condensacao/, img: 'nylon rope', leg: 'Náilon e PET são polímeros de condensação.' },
  { re: /chuva acida|enxofre/, img: 'Acid rain damage', leg: 'Estátua corroída pela chuva ácida, formada por óxidos de enxofre e de nitrogênio.' },
  { re: /transporte publico|veiculos eletricos/, img: 'Electric bus Sao Paulo', leg: 'Ônibus elétrico em São Paulo: menos queima de diesel e menos poluição local.' },
  { re: /carvao mineral/, img: 'Anthracite coal', leg: 'Carvão mineral: combustível fóssil de alto teor de carbono.' },
  { re: /gas natural/, img: 'Natural gas flame', leg: 'Chama de gás natural (metano), combustível fóssil que emite menos CO₂ que o carvão.' },
  { re: /petroleo|gasolina/, img: 'Oil refinery', leg: 'Refinaria de petróleo: a destilação fracionada separa gasolina, diesel e outros derivados.' },
  { re: /poder calorifico|renovavel|efeito estufa|aquecimento global/, img: 'Brazil sugarcane ethanol', leg: 'Canavial: o etanol de cana é um combustível renovável.' },
  { re: /dureza|ca²⁺ e mg²⁺|ca2\+/, img: 'Limescale', leg: 'Calcário depositado por água dura, rica em íons cálcio e magnésio.' },
  { re: /areia, sal e agua|filtracao|evapora/, img: 'Filtration', leg: 'Filtração separa o sólido não dissolvido; a evaporação recupera o sal dissolvido.' },
  { re: /2 h₂ \+ o₂|2 h2 \+ o2|mols de agua/, img: 'Space Shuttle main engine', leg: 'Os motores do ônibus espacial queimavam hidrogênio e oxigênio, formando água.' },
  { re: /\bpolar\b|ponto de ebulicao|ligacao de hidrogenio|ponte de hidrogenio/, img: 'Hydrogen bonds water', leg: 'Ligações de hidrogênio entre moléculas de água.' },
  { re: /fenolftaleina/, img: 'Phenolphthalein', leg: 'A fenolftaleína fica incolor em meio ácido ou neutro e rosa em meio básico.' },
  { re: /tornassol/, img: 'Litmus paper', leg: 'Papel de tornassol: azul em meio básico, vermelho em meio ácido.' },
  { re: /suco gastrico/, img: 'Endoscopy stomach', leg: 'O estômago produz suco gástrico com ácido clorídrico (pH perto de 2).' },
  { re: /sabao|detergente/, img: 'Soap bar', leg: 'Sabões e detergentes têm caráter básico e removem gordura.' },
  { re: /hidroxido de sodio|hidroxido de potassio/, img: 'Sodium hydroxide pellets', leg: 'Hidróxido de sódio (soda cáustica), base forte usada em desentupidores e na fabricação de sabão.' },
  { re: /tampao|bicarbonato no sangue/, img: 'Blood sample tubes', leg: 'O sangue é tamponado: seu pH fica perto de 7,4.' },
  { re: /acido cloridrico/, img: 'Hydrochloric acid', leg: 'Ácido clorídrico, ácido forte presente também no suco gástrico.' },
  { re: /suco de laranja/, img: 'Orange juice', leg: 'Sucos de frutas cítricas são ácidos.' }
];


/* Temas: cada um tem várias combinações de texto-base e imagem (com legenda em português).
   Na atividade de um aluno, nenhuma combinação, texto ou imagem se repete. */
const V = (img, leg, t, k) => ({ img, leg, t, k });
const TEMAS = [
  // ---------- Biologia ----------
  { re: /imun|vacina|soro|anticorp|defesa|linfocit|barreira/, v: [
    V('Brazil vaccination campaign Ze Gotinha', 'Zé Gotinha, símbolo das campanhas de vacinação do SUS desde 1986.', 'O Programa Nacional de Imunizações, criado em 1973, oferece gratuitamente pelo SUS mais de 40 imunobiológicos. As vacinas apresentam ao corpo um antígeno inofensivo; o organismo produz anticorpos e células de memória e, se o agente verdadeiro aparecer, responde rápido. Isso é imunidade ativa artificial.', /vacina/),
    V('snake venom extraction', 'Extração de veneno de serpente: o primeiro passo para produzir soro antiofídico.', 'O Instituto Butantan produz soros desde 1901: o veneno é aplicado em pequenas doses em cavalos, que fabricam anticorpos; esses anticorpos, purificados, formam o soro. Quem recebe o soro ganha anticorpos prontos, com efeito imediato, mas a proteção some em semanas, porque o próprio corpo não aprendeu a produzi-los (imunidade passiva).', /soro|cobra|antiofid|antitetan|anticorpos prontos|passiva artificial/),
    V('Breastfeeding infant', 'O leite materno transfere anticorpos da mãe para o bebê.', 'Durante a gestação, anticorpos da mãe atravessam a placenta, e depois do parto chegam ao bebê pelo leite, especialmente pelo colostro. É uma imunidade passiva natural: protege o recém-nascido enquanto o seu sistema imune amadurece. Por isso o Ministério da Saúde recomenda amamentação exclusiva até os 6 meses.', /leite|mae|materno|placenta|passiva natural/),
    V('clinical thermometer fever', 'Termômetro clínico: a febre é uma resposta de defesa inespecífica.', 'A primeira linha de defesa do corpo não escolhe o invasor: pele, mucosas, saliva, lágrimas, a inflamação e a febre agem do mesmo jeito contra qualquer agente. Essa é a imunidade inata, presente desde o nascimento e sem memória. Já a imunidade adquirida reconhece cada invasor de forma específica e guarda memória.', /febre|inata|inespecific|primeira linha/),
    V('Blood smear', 'Esfregaço de sangue ao microscópio: os glóbulos brancos incluem os linfócitos.', 'Os linfócitos B produzem anticorpos que se encaixam em um antígeno específico, como uma chave na fechadura; os linfócitos T coordenam a resposta e destroem células infectadas. Depois da primeira infecção, algumas dessas células viram células de memória, que explicam por que muitas doenças, como a catapora, não se repetem.', /linfocit|memoria|catapora|anticorpos especificos|adquirida ativa natural|infeccao natural/),
    V('scraped knee', 'Ferimento na pele: a barreira foi rompida e a defesa inata entra em ação.', 'Quando a pele se rompe, a coagulação fecha o ferimento e células de defesa chegam pelo sangue, causando vermelhidão, calor e inchaço: é a inflamação. Esses mecanismos agem em minutos e da mesma forma contra qualquer micróbio; se não bastarem, entra em cena a imunidade adquirida, mais lenta na primeira vez, mas específica.', /pele|mucosa|barreira|ferimento|corte|ralar|coagula/)
  ] },
  { re: /clon|celulas-tronco/, v: [
    V('Dolly the sheep National Museum of Scotland', 'Dolly, a ovelha clonada em 1996, exposta no Museu Nacional da Escócia.', 'Na clonagem reprodutiva, o núcleo de uma célula do doador é colocado em um óvulo sem núcleo; o embrião formado é implantado em um útero e nasce um indivíduo com o mesmo DNA nuclear do doador. Foi assim que nasceu Dolly, em 1996, na Escócia.'),
    V('Human embryonic stem cells', 'Colônia de células-tronco vista ao microscópio.', 'Na clonagem terapêutica, as células obtidas são cultivadas em laboratório para formar tecidos, como pele para queimados ou músculo cardíaco para testes de remédios, sem que nenhum embrião seja implantado em um útero. No Brasil, a Lei de Biossegurança (2005) regula essas pesquisas.'),
    V('Intracytoplasmic sperm injection', 'Micromanipulação de óvulos: técnica usada na transferência de núcleo.', 'A transferência de núcleo é feita com agulhas finíssimas, sob o microscópio: retira-se o núcleo do óvulo e coloca-se o núcleo de uma célula do doador. A diferença entre clonagem reprodutiva e terapêutica está no destino: gerar um organismo inteiro ou apenas células e tecidos.')
  ] },
  { re: /transcri|tradu|codon|anticodon|ribossomo|rna polimerase|rna transportador|sintese de proteinas|producao de proteinas|expressao/, v: [
    V('Insulin pen', 'Caneta de insulina: desde 1982 a insulina humana é produzida por bactérias modificadas.', 'Para fabricar uma proteína, a célula copia o gene do DNA em RNA mensageiro (transcrição) e depois o ribossomo lê esse RNA de três em três bases, os códons, encadeando aminoácidos (tradução). Bactérias que recebem o gene humano da insulina fazem exatamente isso e hoje produzem a insulina usada por milhões de pessoas com diabetes.', /insulina|bacteria|transcricao seguida|ordem correta/),
    V('Ribosome ribbon', 'Modelo de um ribossomo, a estrutura que lê o RNA mensageiro e monta a proteína.', 'O ribossomo percorre o RNA mensageiro e, a cada códon, um RNA transportador traz o aminoácido correspondente, encaixando seu anticódon no códon. A sequência de bases do gene determina, assim, a sequência de aminoácidos da proteína; uma única troca de base pode mudar um aminoácido ou criar um códon de parada.', /codon|anticodon|trna|transportador|traducao|ribossomo|trincas/),
    V('Silkworm cocoon', 'Casulo do bicho-da-seda: a seda é uma proteína (fibroína) fabricada a partir de um gene.', 'Cabelo, seda, enzimas digestivas e anticorpos são proteínas, e todas são montadas a partir das instruções de genes. No núcleo, o gene é transcrito em RNA mensageiro pela enzima RNA polimerase; no citoplasma, os ribossomos traduzem esse RNA em proteína.', /rna polimerase|transcri|nucleo|molde|enzima/),
    V('Rough endoplasmic reticulum TEM', 'Retículo endoplasmático com ribossomos, visto ao microscópio eletrônico.', 'Células que produzem muitas proteínas, como as do pâncreas, são repletas de ribossomos. Todas as células do corpo têm o mesmo DNA, mas cada tipo celular transcreve e traduz só uma parte dos genes: é a expressão gênica que torna um neurônio diferente de uma célula do fígado.', /expressao|figado|cerebro|tipo celular|mesmo dna/)
  ] },
  { re: /\bdna\b|\brna\b|uracila|timina|dupla helice|fita|desoxirribose|ribose|nucleotideo/, v: [
    V('DNA sculpture', 'Escultura da dupla hélice do DNA: duas fitas enroladas, ligadas pelas bases.', 'O DNA é formado por duas fitas de nucleotídeos (açúcar desoxirribose, fosfato e base) enroladas em dupla hélice. As bases pareiam sempre do mesmo jeito: adenina com timina e citosina com guanina. Por isso, conhecendo uma fita, é possível escrever a fita complementar, e a célula consegue copiar seu DNA antes de se dividir.', /complementar|sequencia|a-t|pareamento/),
    V('Strawberry DNA extraction', 'Extração caseira de DNA de morango: o DNA aparece como fios esbranquiçados.', 'Com detergente, sal e álcool é possível extrair DNA de frutas na escola: o detergente rompe as membranas e o DNA, insolúvel no álcool, se junta em fios visíveis. Essa molécula, de fita dupla e com timina, guarda a informação genética; o RNA, de fita simples, com ribose e uracila, ajuda a usá-la.', /fita dupla|desoxirribose|timina|informacao genetica/),
    V('Gel electrophoresis DNA', 'Gel de eletroforese: fragmentos de DNA separados por tamanho.', 'DNA e RNA são ácidos nucleicos, mas diferem em três pontos: o DNA tem fita dupla, desoxirribose e timina; o RNA geralmente tem fita simples, ribose e uracila no lugar da timina. Na transcrição, a uracila do RNA pareia com a adenina do DNA.', /uracila|ribose|fita simples|\brna\b/),
    V('Laboratory micropipette', 'Micropipeta: usada para manipular pequenos volumes de DNA e reagentes.', 'Em 1953, Watson e Crick propuseram o modelo da dupla hélice, com base nas imagens de raios X obtidas por Rosalind Franklin. O modelo mostrou como a regra de pareamento (A–T, C–G) permite copiar o DNA, e abriu caminho para a genética moderna, dos testes de paternidade às vacinas.', /dupla helice|estrutura|descri/)
  ] },
  { re: /transgen|ogm|engenharia genetica|biosseguranca|geneticamente modificad|transgenia|gene de outra especie/, v: [
    V('maize corn field Brazil', 'Lavoura de milho: a maior parte do milho plantado no Brasil é transgênica.', 'Organismos geneticamente modificados (OGM) têm o DNA alterado em laboratório; os transgênicos são os OGM que receberam um gene de outra espécie. O milho Bt, por exemplo, recebeu um gene de bactéria que produz uma proteína tóxica para lagartas que atacam a lavoura.', /milho|lagarta|bacteria|algodao/),
    V('Soybean field', 'Plantação de soja: o Brasil é o maior produtor mundial do grão.', 'No Brasil, a CTNBio (Comissão Técnica Nacional de Biossegurança) avalia cada OGM antes de liberar seu cultivo, considerando riscos à saúde e ao ambiente. Alimentos com mais de 1% de ingrediente transgênico precisam trazer no rótulo um "T" dentro de um triângulo amarelo.', /rotulo|ogm|soja|consumidor/),
    V('Golden rice', 'Arrozal: o arroz dourado é uma variedade transgênica que produz betacaroteno (pró-vitamina A).', 'O arroz dourado recebeu genes de outras espécies para produzir betacaroteno nos grãos, com o objetivo de combater a falta de vitamina A em países pobres. O caso mostra o potencial da transgenia e também os debates sobre biossegurança, patentes e acesso dos agricultores às sementes.', /definicao|termo|inserir|insercao|processo/),
    V('cotton field boll', 'Algodão: no Brasil há variedades transgênicas resistentes a lagartas.', 'A biossegurança reúne normas para que pesquisas e cultivos de organismos modificados não tragam riscos às pessoas e ao ambiente, como o cruzamento com espécies nativas ou o surgimento de pragas resistentes. A Lei de Biossegurança brasileira é de 2005.', /biosseguranca|norma|risco|fiscaliza/)
  ] },
  { re: /biomagnifica|bioconcentra|cadeia alimentar|nivel trofico|contaminante|poluente/, v: [
    V('heron catching fish', 'Garça capturando peixe: predadores do topo acumulam mais contaminantes.', 'Substâncias que o organismo não elimina, como mercúrio e alguns pesticidas, ficam guardadas na gordura e nos tecidos. Quando passam de presa para predador, a concentração aumenta a cada nível da cadeia alimentar: é a biomagnificação. Por isso aves e peixes predadores têm níveis muito maiores que o plâncton.', /aves|predador|nivel|cadeia|biomagnifica/),
    V('mussels bed rocks', 'Mexilhões filtram grandes volumes de água e acumulam o que há nela.', 'Quando um organismo absorve uma substância direto da água, em concentração maior que a do meio, sem tê-la recebido pela alimentação, ocorre a bioconcentração. Mexilhões e ostras são usados para monitorar a poluição de baías justamente por isso.', /bioconcentra|filtra|molusco|ostra|mexilh|alga|corante/),
    V('Gold mining Amazon', 'Garimpo de ouro: o mercúrio usado para separar o ouro contamina rios e peixes.', 'No garimpo, o mercúrio se liga ao ouro e depois é evaporado, contaminando o ar, os rios e os peixes. Estudos da Fiocruz encontraram níveis altos de mercúrio em povos indígenas que comem peixes predadores, um exemplo de como a biomagnificação afeta a saúde humana.', /mercurio|metal/),
    V('pesticide spraying crop field', 'Pulverização de agrotóxicos: parte da substância chega a rios e lagos.', 'O Brasil está entre os maiores consumidores de agrotóxicos do mundo. Parte deles escorre para rios e lagos, onde é absorvida por algas e pequenos animais e passa pelas cadeias alimentares, acumulando-se nos animais do topo.', /pesticida|inseticida|agrotox/)
  ] },
  { re: /virus|acelular|hospedeir/, v: [
    V('influenza virus electron micrograph', 'Vírus da gripe (influenza) ao microscópio eletrônico.', 'Vírus são partículas acelulares: têm material genético (DNA ou RNA) dentro de uma capa de proteínas, o capsídeo, mas não têm citoplasma, ribossomos nem metabolismo próprio. Fora de uma célula, ficam inertes; dentro dela, usam a maquinaria celular para produzir novas cópias.', /capsideo|acelular|celula|metabolismo|nucleo/),
    V('HIV budding lymphocyte electron micrograph', 'Partículas de HIV saindo de um linfócito, vistas ao microscópio eletrônico.', 'O HIV infecta linfócitos T, células de defesa. Como todo vírus, ele é um parasita intracelular obrigatório: só se replica dentro de uma célula hospedeira. Antibióticos não agem sobre vírus, porque atacam estruturas de bactérias, como a parede celular, que os vírus não têm.', /hiv|antibiotico|defesa/),
    V('Aedes aegypti mosquito', 'O mosquito Aedes aegypti transmite os vírus da dengue, zika e chikungunya.', 'O vírus da dengue precisa das células do mosquito e das células humanas para se multiplicar. Como não tem metabolismo próprio, não se reproduz no ambiente: o controle da doença depende de eliminar os criadouros do mosquito e, agora, também da vacina oferecida pelo SUS.', /dengue/),
    V('Bacteriophage electron micrograph', 'Bacteriófagos, vírus que infectam bactérias, ao microscópio eletrônico.', 'Por não terem células, os vírus estão na fronteira entre o vivo e o não vivo: têm material genético e evoluem, mas só se reproduzem dentro de outras células. Bacteriófagos, por exemplo, injetam seu DNA em bactérias e as transformam em fábricas de novos vírus.', /parasita|hospedeir|intracelular|replica/)
  ] },
  { re: /conservacao|preserva|sustentav|extrativis|manejo|desmat|biodiversidade|recuperad|fragmento de mata|parque|unidade de|reserva/, v: [
    V('Atlantic Forest Brazil Serra do Mar', 'Mata Atlântica na Serra do Mar: restam cerca de 12% da cobertura original.', 'O Sistema Nacional de Unidades de Conservação (Lei 9.985/2000) divide as áreas protegidas em dois grupos: proteção integral, que só admite usos indiretos como pesquisa e educação, e uso sustentável, que permite explorar recursos de forma planejada.'),
    V('Brazil nut', 'Castanha-do-pará: coletada de árvores nativas sem derrubar a floresta.', 'Nas reservas extrativistas, criadas após a luta dos seringueiros liderados por Chico Mendes, as comunidades coletam castanha, látex e frutos mantendo a floresta em pé. É um exemplo de uso sustentável: a extração respeita o ritmo de reposição da natureza.'),
    V('Amazon rainforest Brazil', 'Floresta Amazônica: a maior floresta tropical do mundo.', 'A biodiversidade brasileira é uma das maiores do planeta. Preservar significa proteger áreas sem exploração; conservar com uso sustentável significa usar os recursos sem esgotá-los; recuperar significa replantar espécies nativas em áreas degradadas.'),
    V('Itatiaia National Park', 'Parque Nacional do Itatiaia (RJ/MG), o primeiro parque nacional do Brasil, criado em 1937.', 'Parques nacionais e estaduais são unidades de proteção integral: protegem fauna, flora e nascentes, e permitem visitação controlada e pesquisa, mas não a extração de recursos. Já as reservas de desenvolvimento sustentável conciliam conservação e sustento das comunidades locais.'),
    V('Acai palm', 'Açaizeiro: o manejo mantém as palmeiras produzindo por anos.', 'O manejo sustentável planeja a coleta para que a população de plantas ou animais se mantenha: respeitar o período de defeso da pesca, o tamanho mínimo dos peixes e a quantidade colhida de frutos garante renda hoje sem esgotar o recurso amanhã.')
  ] },
  { re: /origem da vida|biogenese|abiogenese|panspermia|evolucao quimica|materia inanimada|primeiras moleculas|geracao espontanea/, v: [
    V('Pasteur swan neck flask', 'Frasco "pescoço de cisne", usado por Pasteur contra a geração espontânea.', 'Por séculos se acreditou que seres vivos surgiam da matéria inanimada (abiogênese). Em 1862, Louis Pasteur ferveu caldo nutritivo em frascos com gargalo curvo: o ar entrava, mas os micróbios ficavam presos no gargalo, e o caldo não estragava. A conclusão foi a biogênese: todo ser vivo vem de outro ser vivo.'),
    V('Hydrothermal vent', 'Fonte hidrotermal no fundo do mar: ambiente onde moléculas orgânicas podem ter surgido.', 'A hipótese da evolução química propõe que, na Terra primitiva, gases simples, sob descargas elétricas e calor, formaram moléculas orgânicas, como aminoácidos. Em 1953, Stanley Miller e Harold Urey reproduziram essas condições em laboratório e obtiveram aminoácidos.'),
    V('Murchison meteorite', 'Meteorito Murchison, que caiu na Austrália em 1969 e contém aminoácidos.', 'A panspermia sugere que moléculas orgânicas ou micro-organismos chegaram à Terra trazidos por meteoritos e cometas. Meteoritos como o Murchison contêm aminoácidos formados no espaço, mas a hipótese não explica como a vida surgiu, apenas desloca a questão para outro lugar.'),
    V('Stromatolites', 'Estromatólitos: estruturas formadas por bactérias, com registros de mais de 3 bilhões de anos.', 'Os registros mais antigos de vida são de micro-organismos de cerca de 3,5 bilhões de anos. As hipóteses sobre a origem da vida (evolução química, panspermia) tentam explicar como se passou de moléculas simples às primeiras células, enquanto a biogênese explica como a vida se mantém.')
  ] },
  { re: /experimento|grupo controle|variavel|hipotese|metodo cientifico/, v: [
    V('Petri dish bacteria', 'Placas de Petri: o grupo controle permite comparar os resultados.', 'Em 1928, Alexander Fleming notou que um fungo impedia o crescimento de bactérias em uma placa: dali surgiu a penicilina. A ciência avança assim: observação, pergunta, hipótese testável, experimento e conclusão.'),
    V('Plant growth experiment', 'Experimento com plantas: só uma condição muda entre os grupos.', 'Em um experimento controlado, só uma variável é alterada (variável independente) e mede-se o efeito sobre outra (variável dependente). O grupo controle recebe o mesmo tratamento, menos a alteração; sem ele, não dá para saber se o resultado foi causado pela variável testada.'),
    V('Laboratory experiment students', 'Caderno de laboratório: registrar tudo permite repetir e conferir o experimento.', 'Uma investigação científica começa com a observação de um problema e a formulação de uma hipótese, uma explicação provisória que possa ser testada. Os resultados precisam ser registrados e repetidos por outros pesquisadores para serem aceitos.')
  ] },
  { re: /ciclo do carbono|ciclo do nitrogenio|combustiveis fosseis|ciclos? biogeoquimic/, v: [
    V('Coal power plant', 'Usina termelétrica a carvão: a queima devolve carbono fóssil à atmosfera.', 'No ciclo do carbono, a fotossíntese retira CO₂ do ar e a respiração e a decomposição o devolvem. Queimar petróleo, carvão e gás libera carbono que estava guardado há milhões de anos, aumentando o CO₂ no ar e intensificando o efeito estufa.'),
    V('Root nodules', 'Nódulos em raízes de leguminosas: bactérias fixam o nitrogênio do ar.', 'O ar tem 78% de nitrogênio, mas plantas e animais não conseguem usá-lo diretamente. Bactérias de vida livre ou que vivem em nódulos das raízes de leguminosas, como o feijão e a soja, transformam o N₂ em compostos que as plantas absorvem; decompositores e outras bactérias devolvem o nitrogênio ao solo e ao ar.'),
    V('Amazon deforestation fire', 'Queimada na Amazônia: a floresta queimada libera o carbono que armazenava.', 'Florestas guardam enormes quantidades de carbono na madeira e no solo. Desmatamento e queimadas são, no Brasil, a principal fonte de emissão de gases de efeito estufa, à frente da queima de combustíveis.')
  ] },
  { re: /meiose|mitose|divisao celular|regenera/, v: [
    V('Onion root tip mitosis', 'Ponta de raiz de cebola: células em diferentes fases da mitose.', 'Na mitose, uma célula duplica seu DNA e se divide em duas células-filhas idênticas. É ela que permite o crescimento, a cicatrização de ferimentos e a renovação constante da pele e do sangue.'),
    V('Human karyotype', 'Cromossomos humanos organizados em pares: na meiose, cada gameta recebe um de cada par.', 'Na meiose, uma célula diploide passa por duas divisões e origina quatro células haploides, com metade dos cromossomos e geneticamente diferentes. É assim que se formam os gametas; a troca de trechos entre cromossomos (crossing-over) aumenta a variabilidade dos descendentes.'),
    V('Scab on knee', 'Cicatrização: a mitose repõe as células perdidas no ferimento.', 'Tecidos se regeneram graças à mitose das células vizinhas à lesão. Algumas células se dividem muito (pele, medula óssea), outras quase nunca (neurônios), o que explica por que certos tecidos se recuperam melhor que outros.')
  ] },
  { re: /radioterapia|radiacao|tumor|cancer/, v: [
    V('Radiation therapy', 'Radioterapia: feixes de radiação direcionados ao tumor.', 'Radiações ionizantes têm energia para danificar o DNA. Células de tumor se dividem muito e são mais sensíveis a esse dano; por isso a radioterapia, com doses planejadas e feixes direcionados, destrói o tumor poupando o máximo possível dos tecidos saudáveis.'),
    V('X-ray hand', 'Radiografia: os raios X atravessam os tecidos moles e são barrados pelos ossos.', 'Na medicina, a radiação é usada em diagnóstico (raios X, tomografia, medicina nuclear) e em tratamento (radioterapia). Como pode danificar o DNA, seu uso exige doses controladas e proteção dos profissionais, como aventais de chumbo.')
  ] },
  { re: /chagas|protozo|parasit|vetor|giardi|ameb|saneamento|esgoto|agua tratada/, v: [
    V('Wastewater treatment plant', 'Estação de tratamento de esgoto.', 'Segundo o Instituto Trata Brasil, cerca de 90 milhões de brasileiros não têm coleta de esgoto. Doenças de transmissão fecal-oral, como giardíase, amebíase e hepatite A, são mais comuns onde falta água tratada e esgoto: saneamento é uma das medidas de saúde mais eficientes.'),
    V('Triatoma infestans', 'O barbeiro, inseto que transmite o protozoário da doença de Chagas.', 'Descrita em 1909 pelo brasileiro Carlos Chagas, a doença é causada pelo Trypanosoma cruzi. O barbeiro vive em frestas de casas de pau a pique e, ao picar, elimina fezes com o parasita; melhorar as moradias e controlar o vetor reduziu muito os casos.'),
    V('Clay water filter', 'Filtro de barro: tecnologia brasileira simples que melhora a qualidade da água.', 'Protozoários como a Giardia e a ameba formam cistos resistentes que contaminam água e alimentos. Filtrar e ferver a água, lavar bem os alimentos e lavar as mãos são medidas individuais; rede de água tratada e esgoto são as medidas coletivas.')
  ] },
  { re: /selecao natural|evolu|ancestral|clado|especiacao|mariposa/, v: [
    V('Biston betularia', 'Mariposa Biston betularia: a forma escura predominou na Inglaterra industrial.', 'Indivíduos com características mais vantajosas em um ambiente sobrevivem e se reproduzem mais: é a seleção natural, proposta por Darwin e Wallace em 1858. Na Inglaterra industrial, mariposas escuras ficaram camufladas nos troncos sujos de fuligem e passaram a predominar.'),
    V('Fossil fish', 'Peixe fóssil: os fósseis ajudam a reconstruir os ancestrais comuns.', 'As espécies atuais descendem de ancestrais comuns. Árvores filogenéticas (cladogramas) representam esse parentesco; um clado é um grupo formado por um ancestral e todos os seus descendentes, reconhecido por características compartilhadas.'),
    V('Galapagos finches', 'Tentilhões das Galápagos: bicos diferentes para alimentos diferentes.', 'Darwin observou nas Ilhas Galápagos tentilhões com bicos adaptados a sementes, insetos ou flores. Populações isoladas em ambientes diferentes acumulam diferenças até formarem novas espécies: é a especiação.')
  ] },
  { re: /coracao|circulacao|veia|arteria|atrio|ventriculo/, v: [
    V('Pig heart', 'Coração de porco, muito parecido com o humano: quatro cavidades e duas circulações.', 'Nos mamíferos, a circulação é dupla e completa: o lado direito do coração envia sangue pobre em oxigênio aos pulmões; o sangue oxigenado volta pelas veias pulmonares ao átrio esquerdo e sai pelo ventrículo esquerdo para todo o corpo, sem mistura entre os dois lados.'),
    V('Stethoscope', 'Estetoscópio: os sons do coração vêm do fechamento das válvulas.', 'As válvulas do coração impedem o refluxo do sangue entre átrios e ventrículos. O coração bate cerca de 100 mil vezes por dia, e doenças cardiovasculares são a principal causa de morte no Brasil, ligadas a sedentarismo, tabagismo e má alimentação.')
  ] },
  { re: /populacao|competicao|predad|ecossistema|ecologic|fitoplancton|praga|produtor|consumidor/, v: [
    V('Red fox', 'Raposa: consumidora que se alimenta de outros animais.', 'Em uma cadeia alimentar, os produtores (plantas e algas) fazem fotossíntese; herbívoros são consumidores primários, e quem come herbívoros é consumidor secundário. A cada passagem, cerca de 90% da energia se perde como calor, por isso as cadeias têm poucos níveis.'),
    V('forest canopy competition light', 'Dossel da floresta: as árvores competem por luz.', 'Quando indivíduos de espécies diferentes disputam o mesmo recurso, como luz, água ou alimento, há competição interespecífica; entre indivíduos da mesma espécie, competição intraespecífica. A competição limita o crescimento das populações.'),
    V('Rabbits', 'Coelhos: a população cresce até esbarrar no limite do ambiente.', 'Sem limites, uma população cresceria de forma exponencial. Na natureza, falta de alimento, espaço, predadores e doenças freiam o crescimento, e a população se estabiliza na capacidade de suporte do ambiente: é o crescimento logístico.'),
    V('Ladybird eating aphids', 'Joaninha comendo pulgões: controle biológico de pragas.', 'Predadores mantêm as populações de suas presas sob controle. Quando um agricultor elimina os predadores, as pragas podem explodir; o controle biológico usa justamente inimigos naturais, como joaninhas e vespas, no lugar de agrotóxicos.')
  ] },
  { re: /alelo|heterozigot|homozigot|genotip|fenotip|cruzamento|dominante|recessiv|diibrid/, v: [
    V('Pisum sativum flowers', 'Flores de ervilha: foi com essa planta que Mendel descobriu as leis da herança.', 'Gregor Mendel cruzou ervilhas por oito anos e publicou em 1865 que cada característica depende de um par de fatores (hoje, alelos), um de cada genitor. Do cruzamento de dois heterozigotos (Aa × Aa) espera-se 1/4 AA, 1/2 Aa e 1/4 aa, ou seja, 3 dominantes para 1 recessivo.'),
    V('Human eye', 'Íris humana: a cor dos olhos é um exemplo usado em exercícios de herança.', 'Em exercícios de genética, usa-se o modelo simplificado em que um alelo dominante (A) se manifesta mesmo em dose única, e o recessivo (a) só aparece em homozigose (aa). As probabilidades de eventos independentes se multiplicam: a chance de dois filhos aa seguidos é 1/4 × 1/4.')
  ] },
  { re: /droga|sistema nervoso|neuro|doses cada vez maiores|substancia psico|ansiedade/, v: [
    V('Neurons micrograph', 'Neurônios: as drogas agem nas sinapses, os pontos de comunicação entre eles.', 'Os neurônios se comunicam nas sinapses por meio de neurotransmissores, como a dopamina e a serotonina. Drogas psicoativas aumentam, imitam ou bloqueiam esses sinais; com o uso repetido, os receptores se ajustam (neuroadaptação), surge a tolerância e são necessárias doses cada vez maiores.'),
    V('Brain MRI', 'Ressonância magnética do encéfalo.', 'Medicamentos que agem no sistema nervoso, como ansiolíticos, precisam de receita controlada porque podem causar tolerância e dependência. A dependência envolve mudanças no circuito de recompensa do cérebro e é tratada pelo SUS nos Centros de Atenção Psicossocial (CAPS).')
  ] },
  { re: /glicose|glicemia|insulina|diabetes/, v: [
    V('Glucometer', 'Glicosímetro: mede a glicose no sangue.', 'A insulina, produzida pelo pâncreas, faz as células absorverem a glicose do sangue. No diabetes tipo 1 falta insulina; no tipo 2, as células respondem mal a ela (resistência à insulina). O Brasil tem mais de 16 milhões de adultos com diabetes.'),
    V('Fruits and vegetables', 'Frutas e verduras: alimentação equilibrada ajuda a prevenir o diabetes tipo 2.', 'Depois de uma refeição, a glicose do sangue sobe e o pâncreas libera insulina para baixá-la; em jejum, o glucagon libera glicose do fígado. Quando a curva de glicose demora a voltar ao normal, é sinal de que a insulina não está agindo bem.')
  ] },
  { re: /pcr|forense|pericia|perfil genetico|crispr|sequenciamento|marcadores/, v: [
    V('PCR thermal cycler laboratory', 'Termociclador: o aparelho que faz a PCR.', 'A PCR (reação em cadeia da polimerase) copia milhões de vezes um trecho escolhido de DNA, a partir de quantidades mínimas, como uma gota de sangue ou um fio de cabelo. É usada em perícias, testes de paternidade e diagnósticos, como o teste de covid-19.'),
    V('Gel electrophoresis DNA', 'Gel de eletroforese: o padrão de faixas forma o perfil genético.', 'Na perícia, comparam-se vários marcadores do DNA da amostra com os do suspeito. Coincidência em todos é um indício muito forte, mas a força da prova depende de quão raro aquele perfil é na população: por isso os laudos falam em probabilidade, não em certeza absoluta.'),
    V('Laboratory micropipette', 'Micropipeta: instrumento básico dos laboratórios de biologia molecular.', 'O CRISPR-Cas9, que rendeu o Nobel de Química de 2020 a Emmanuelle Charpentier e Jennifer Doudna, usa um RNA-guia para levar uma enzima a um ponto exato do DNA e cortá-lo. Depois da edição, o trecho é sequenciado ou amplificado por PCR para confirmar a mudança.')
  ] },
  { re: /celula|organela|nucleo|mutacao|codon de parada|procariont/, v: [
    V('Onion epidermis cells microscope', 'Células da epiderme de cebola ao microscópio: os núcleos aparecem como pontos.', 'A célula é a unidade básica dos seres vivos. Células eucariontes, como as de plantas e animais, têm núcleo e organelas; o DNA fica dentro do núcleo, onde também ocorre a transcrição.'),
    V('Escherichia coli', 'Bactéria Escherichia coli: célula procarionte, sem núcleo organizado.', 'Bactérias são procariontes: têm DNA, ribossomos e membrana, mas o material genético fica disperso no citoplasma, sem envoltório nuclear. Vírus, por sua vez, nem chegam a ser células.')
  ] },
  // ---------- Química ----------
  { q: 1, re: /equilibrio|le chatelier|⇌|kc\b|constante de equilibrio|quociente/, v: [
    V('Ammonia production plant', 'Fábrica de amônia: a base da produção de fertilizantes nitrogenados.', 'No processo Haber-Bosch, N₂ e H₂ reagem formando amônia em uma reação reversível e exotérmica. Pelo princípio de Le Chatelier, alta pressão favorece a amônia (lado com menos mols de gás) e temperatura baixa também, mas deixaria a reação lenta; a indústria usa cerca de 450 °C, 200 atm e catalisador de ferro.', /amonia|haber|fertiliz|pressao|mols de gas|volume/),
    V('Carbonated water', 'Água com gás: o CO₂ dissolvido sai em bolhas quando a pressão cai.', 'Em um refrigerante fechado, o CO₂ dissolvido e o CO₂ gasoso estão em equilíbrio. Ao abrir a garrafa, a pressão cai e o sistema se desloca no sentido de liberar gás. Pelo princípio de Le Chatelier, todo sistema em equilíbrio perturbado se desloca para reduzir a perturbação.', /refrigerante|co₂|co2|garrafa|gas carbonico/),
    V('Nitrogen dioxide', 'Dióxido de nitrogênio (NO₂), gás castanho em equilíbrio com o N₂O₄, incolor.', 'O equilíbrio 2 NO₂ ⇌ N₂O₄ muda de cor com a temperatura: aquecido, fica mais castanho; resfriado, mais claro. Só a temperatura altera o valor da constante Kc; mudanças de concentração e pressão deslocam o equilíbrio, mas o Kc continua o mesmo.', /no₂|n₂o₄|temperatura|aquec|resfri|exoterm|endoterm|kc depende|kc muda/),
    V('Gruta do Lago Azul', 'Gruta do Lago Azul, em Bonito (MS): estalactites formadas por equilíbrios do carbonato de cálcio.', 'Nas cavernas, água com CO₂ dissolve o calcário; quando a gota pinga e perde CO₂ para o ar, o equilíbrio se desloca e o carbonato de cálcio volta a se depositar, formando estalactites ao longo de milhares de anos. Em equilíbrio, as reações direta e inversa continuam ocorrendo, com a mesma velocidade.', /velocidades|direta e inversa|dinamic|deixam de mudar/),
    V('Coral reef', 'Recife de coral: o aumento de CO₂ no mar desloca equilíbrios e dificulta a formação do esqueleto.', 'Os oceanos absorvem parte do CO₂ emitido; o gás reage com a água e desloca equilíbrios que reduzem os íons carbonato disponíveis para corais e conchas. Um Kc grande indica equilíbrio com muito produto; um Kc pequeno, com predominância de reagentes.', /kc =|kc muito|kc alto|kc baixo|kc pequeno|kc grande|composicao|interpret|expressao/),
    V('Mountain climbers altitude', 'Em grandes altitudes há menos oxigênio, e o equilíbrio hemoglobina–O₂ se desloca.', 'No sangue, a hemoglobina se liga ao oxigênio em um equilíbrio. Em grandes altitudes, a pressão de O₂ é menor, o equilíbrio se desloca e menos oxigênio chega aos tecidos; com o tempo, o corpo produz mais hemácias. Aumentar a concentração de um reagente desloca o equilíbrio para os produtos, e vice-versa.', /concentracao|reagente|produto|adicion/)
  ] },
  { q: 1, re: /velocidade|rapidez|acelera|catalisador|superficie de contato|energia de ativacao|mais rapid|ordem|mais lent/, v: [
    V('effervescent tablet water glass', 'Comprimido efervescente: inteiro ou triturado, quente ou frio, a rapidez muda.', 'Pela teoria das colisões, uma reação ocorre quando partículas se chocam com energia suficiente (a energia de ativação) e na orientação certa. Triturar um comprimido aumenta a superfície de contato; aquecer a água aumenta a energia das partículas; nos dois casos a reação fica mais rápida.', /comprimido|antiacido|superficie|triturad|efervesc|po\b|pedaco/),
    V('Refrigerator food', 'Geladeira: a baixa temperatura deixa mais lentas as reações que estragam os alimentos.', 'Guardar alimentos na geladeira diminui a velocidade das reações químicas e da ação de micro-organismos. Em temperatura menor, menos partículas têm energia para superar a energia de ativação, e as colisões efetivas ficam mais raras.', /temperatura diminui|resfri|reduz|lent|diminui/),
    V('Catalytic converter', 'Conversores catalíticos: metais como platina e paládio aceleram reações dos gases do escapamento.', 'Catalisadores oferecem um caminho de reação com menor energia de ativação e não são consumidos. Nos carros, transformam CO, NO e hidrocarbonetos em CO₂, N₂ e água. Em um equilíbrio, o catalisador acelera ida e volta igualmente: o equilíbrio é atingido antes, sem se deslocar.', /catalisador|energia de ativacao/),
    V('bread dough rising', 'Massa de pão crescendo: as enzimas do fermento são catalisadores biológicos.', 'Enzimas são catalisadores das reações dos seres vivos, como as do fermento que produzem gás e fazem a massa crescer. A velocidade de uma reação depende da concentração dos reagentes; na lei de velocidade v = k[A]ⁿ, o expoente n é a ordem da reação.', /ordem|v = k|enzima|fermento|lei de velocidade/),
    V('Rusty iron', 'Ferro enferrujado: a corrosão é uma reação lenta, que leva meses.', 'Há reações lentíssimas, como a ferrugem, e rapidíssimas, como uma explosão. Em uma reação de primeira ordem, dobrar a concentração dobra a velocidade; em segunda ordem, quadruplica; em ordem zero, a velocidade não depende da concentração.', /ordem zero|primeira ordem|segunda ordem|dobr|quadrupl|triplic|\[a\]/),
    V('Fireworks', 'Fogos de artifício: reações muito rápidas que liberam energia, luz e cor.', 'A velocidade de uma reação aumenta com a temperatura, a concentração dos reagentes, a superfície de contato e a presença de catalisador. Em fogos de artifício, pós finos misturados (grande superfície de contato) reagem quase instantaneamente.', /concentracao|aumenta|temperatura aumenta|mais rapid/)
  ] },
  { q: 1, re: /entalpia|δh|exoterm|endoterm|libera energia|libera calor|absorve calor/, v: [
    V('gas stove flame', 'Chama do fogão: a combustão é um processo exotérmico.', 'Toda reação troca energia com o ambiente. Quando libera calor, como na combustão, é exotérmica e tem ΔH negativo; quando absorve calor, como no cozimento dos alimentos ou na fotossíntese, é endotérmica e tem ΔH positivo.'),
    V('Ice pack injury', 'Bolsa de gelo instantâneo: a dissolução do sal absorve calor do ambiente.', 'Bolsas térmicas usadas em lesões esportivas funcionam com processos endotérmicos: ao romper o lacre, um sal se dissolve na água e absorve calor, esfriando a bolsa. As bolsas quentes usam o processo inverso, exotérmico.')
  ] },
  { q: 1, re: /combustive|petroleo|carvao|gas natural|poder calorifico|renovavel|efeito estufa|chuva acida|energia/, v: [
    V('Brazil sugarcane ethanol', 'Colheita de cana em Piracicaba (SP): matéria-prima do etanol.', 'Quase metade da energia usada no Brasil vem de fontes renováveis, bem acima da média mundial de cerca de 15%. O etanol de cana é renovável: o CO₂ liberado na queima é reabsorvido pela próxima safra na fotossíntese.'),
    V('Oil refinery', 'Refinaria: a destilação fracionada separa gasolina, diesel e outros derivados.', 'Petróleo, carvão e gás natural são combustíveis fósseis: levaram milhões de anos para se formar e não se repõem na escala da vida humana. Ao queimar, liberam CO₂ que estava guardado no subsolo, intensificando o efeito estufa.'),
    V('Anthracite coal', 'Carvão mineral: combustível fóssil rico em carbono e, muitas vezes, em enxofre.', 'O poder calorífico indica quanta energia um combustível libera por quilograma queimado. O carvão libera muita energia, mas também mais CO₂ por unidade de energia, além de óxidos de enxofre que formam a chuva ácida.'),
    V('Parque eólico', 'Parque eólico: o Brasil produz muita energia eólica, principalmente no Nordeste.', 'O Brasil é um dos maiores produtores de energia eólica do mundo, com parques concentrados no Nordeste. Trocar combustíveis fósseis por fontes renováveis e por transporte público e elétrico reduz a emissão de gases de efeito estufa e a poluição das cidades.'),
    V('Natural gas flame', 'Chama de gás natural (metano).', 'Entre os fósseis, o gás natural emite menos CO₂ e quase nenhum enxofre por unidade de energia, por isso é chamado de combustível de transição. Ainda assim, não é renovável.')
  ] },
  { q: 1, re: /mistura|filtracao|evapora|dureza|separa|destila|decanta/, v: [
    V('Filtration', 'Filtração: o papel retém o sólido não dissolvido.', 'Para separar misturas, aproveitam-se diferenças entre os componentes: tamanho das partículas (filtração), solubilidade (dissolução), ponto de ebulição (evaporação e destilação), densidade (decantação).'),
    V('Salt evaporation ponds', 'Salinas: a água do mar evapora ao sol e o sal fica.', 'Nas salinas do Rio Grande do Norte, responsável por mais de 90% do sal brasileiro, a água do mar é levada a tanques rasos; o sol evapora a água e o sal cristaliza. É a mesma ideia de separar o sal da água aquecendo a solução.'),
    V('Limescale', 'Crosta de calcário deixada por água dura em uma chaleira.', 'Água dura tem muitos íons cálcio e magnésio, que formam crostas em chaleiras e canos e atrapalham a ação do sabão. Eles podem ser removidos por resinas de troca iônica ou por precipitação.')
  ] },
  { q: 1, re: /\bmols?\b|estequiometr|rendimento|massa molar/, v: [
    V('Space Shuttle main engine', 'Motor do ônibus espacial: queimava hidrogênio e oxigênio líquidos, formando água.', 'As equações químicas mostram em que proporção as substâncias reagem: em 2 H₂ + O₂ → 2 H₂O, 2 mols de hidrogênio formam 2 mols de água. Com essas proporções, a indústria calcula quanto reagente usar e quanto produto vai obter.'),
    V('Cake ingredients', 'Bolo: a receita usa ingredientes em proporções certas, como uma reação química.', 'Assim como uma receita, uma reação usa os reagentes em proporções fixas. Se um reagente sobra (excesso), o outro limita a quantidade de produto; o rendimento compara o produto obtido com o teoricamente esperado.')
  ] },
  { q: 1, re: /polar|interac|ligacao de hidrogenio|ebulicao/, v: [
    V('Hydrogen bonds water', 'Modelo de moléculas de água unidas por ligações de hidrogênio.', 'A água é polar e forma ligações de hidrogênio, interações fortes entre as moléculas. Por isso ferve a 100 °C, muito acima do esperado para uma molécula tão pequena, e é líquida na maior parte da Terra.'),
    V('Water strider', 'Inseto caminhando sobre a água: a tensão superficial vem das ligações de hidrogênio.', 'As interações entre moléculas explicam pontos de fusão e ebulição, solubilidade e tensão superficial. Substâncias polares tendem a se dissolver em solventes polares, como a água; apolares, em apolares, como a gasolina.')
  ] },
  { q: 1, re: /kps|solubilidade|saturada|ion comum|pouco soluvel|limite de dissolucao/, v: [
    V('barium swallow X-ray', 'Radiografia com contraste de sulfato de bário.', 'O sulfato de bário é tóxico se dissolvido, mas é tão pouco solúvel que pode ser engolido como contraste em radiografias. O produto de solubilidade (Kps) mede essa solubilidade; adicionar um íon que já existe na solução diminui ainda mais a dissolução (efeito do íon comum).'),
    V('Kidney stones', 'Cálculos renais: sais pouco solúveis que precipitam na urina.', 'Pedras nos rins se formam quando sais pouco solúveis, como o oxalato de cálcio, ultrapassam o limite de solubilidade e precipitam. Beber água dilui a urina e reduz esse risco.')
  ] },
  { q: 1, re: /radioativ|meia-vida|alfa|beta|isotopo|nuclear/, v: [
    V('PET-CT scanner', 'Aparelho de PET-CT: a medicina nuclear usa radioisótopos de meia-vida curta.', 'Núcleos instáveis emitem radiação até se tornarem estáveis. A meia-vida é o tempo para metade da amostra se desintegrar: depois de duas meias-vidas resta 1/4; depois de três, 1/8. Radioisótopos de meia-vida curta são usados em exames porque deixam o corpo rapidamente.'),
    V('Geiger counter', 'Contador Geiger: detecta e mede a radiação.', 'Na emissão alfa, o núcleo perde 2 prótons e 2 nêutrons: o número atômico cai 2 e o de massa cai 4. Em 1987, em Goiânia, uma cápsula de césio-137 abandonada causou o maior acidente radiológico do Brasil, o que mostra a importância do descarte correto.'),
    V('Angra nuclear power plant', 'Usinas nucleares de Angra dos Reis (RJ).', 'Nas usinas nucleares, a fissão do urânio libera energia sem emitir CO₂, mas gera rejeitos radioativos de meia-vida longa, que precisam ficar isolados por muito tempo. O carbono-14, com meia-vida de cerca de 5.730 anos, é usado para datar fósseis e objetos arqueológicos.')
  ] },
  { q: 1, re: /pilha|oxidacao|reducao|eletrodo|anodo|catodo/, v: [
    V('Daniell cell', 'Pilha de Daniell: oxidação no zinco (ânodo) e redução no cobre (cátodo).', 'Pilhas transformam energia química em elétrica: no ânodo ocorre oxidação (perda de elétrons) e no cátodo, redução (ganho de elétrons). Os elétrons passam pelo fio externo e fazem funcionar o aparelho.'),
    V('Lemon battery', 'Pilha de limão: dois metais diferentes e uma solução ácida geram corrente.', 'Com um limão, uma placa de zinco e outra de cobre é possível montar uma pilha. Celulares e carros elétricos usam baterias de lítio, e as pilhas usadas devem ir para pontos de coleta, pois contêm metais que contaminam o solo.')
  ] },
  { q: 1, re: /polimer|monomero|plastic|proteina|condensacao/, v: [
    V('Plastic recycling', 'Reciclagem de plásticos: polímeros sintéticos levam séculos para se decompor.', 'Polímeros são moléculas gigantes formadas por muitas unidades repetidas, os monômeros. O polietileno das sacolas vem do eteno, por polimerização por adição; o PET das garrafas e o náilon se formam por condensação, liberando água a cada ligação.'),
    V('Natural rubber latex', 'Extração de látex da seringueira: a borracha natural é um polímero.', 'A borracha natural, extraída da seringueira, foi a base do ciclo da borracha na Amazônia (1879–1912). Proteínas, amido e celulose também são polímeros naturais: as proteínas, por exemplo, são cadeias de aminoácidos.')
  ] },
  { q: 1, re: /alcool|cetona|aldeido|cooh|–cho\b|-cho\b|–nh₂|cloro ligado|acido carboxilico|ch3–co|\bester|\beter\b|\bamina|carboxil|funcao organica|funcoes organicas|hidroxila|carbonila|haleto/, v: [
    V('ethanol fuel pump Brazil', 'Bomba de etanol: o Brasil produz álcool combustível a partir da cana.', 'Os compostos orgânicos são agrupados em funções conforme o grupo de átomos que define suas propriedades. Nos álcoois, como o etanol, há um –OH ligado a carbono saturado; nos ácidos carboxílicos, como o acético do vinagre, há o grupo –COOH.', /alcool|etanol|metanol|hidroxila|–oh\b|-oh\b|carboxil|cooh|acido/),
    V('Isoamyl acetate', 'Modelo do acetato de isoamila, o éster com aroma de banana.', 'Ésteres, com o grupo –COO– entre carbonos, dão aroma a frutas e essências artificiais. Éteres têm um oxigênio entre dois carbonos (–O–); aminas têm nitrogênio ligado a carbono, como as que dão o cheiro de peixe.', /amina|nh₂|nitrogenio|\beter\b|\bester|acetato|oxigenio entre/),
    V('Nail polish', 'Esmaltes: a acetona dos removedores é uma cetona.', 'Na carbonila (C=O), a posição define a função: entre dois carbonos, é uma cetona, como a propanona (acetona); na ponta da cadeia, ligada a um hidrogênio, é um aldeído, como o metanal (formol).', /carbonila|cetona|aldeido|acetona|propanona|metanal|formol|butanal|cho\b/),
    V('Pineapple', 'Abacaxi: seu aroma vem de ésteres naturais.', 'Muitos aromas de frutas são ésteres, formados pela reação entre um ácido carboxílico e um álcool. A química orgânica está nos alimentos, nos perfumes, nos remédios e nos combustíveis.', /aroma|fruta|banana/),
    V('Perfume', 'Perfumes: misturas de ésteres, álcoois, aldeídos e cetonas.', 'Perfumes combinam substâncias de várias funções orgânicas: álcoois (–OH), aldeídos (–CHO na ponta), cetonas (C=O no meio da cadeia) e ésteres (–COO–). Haletos orgânicos, com cloro ou bromo ligado a carbono, aparecem em solventes e, no passado, nos gases que destruíam a camada de ozônio.', /haleto|cloro|bromo|clorad/)
  ] },
  { q: 1, re: /cadeia|iupac|nome oficial|carbonos|hidrocarboneto|ligacao dupla|ligacao tripla|alcano|alceno|alcino|anel/, v: [
    V('LPG cylinder', 'Botijão de gás de cozinha (GLP): propano e butano.', 'O carbono faz quatro ligações e forma cadeias abertas ou fechadas, normais ou ramificadas, homogêneas (só carbonos) ou heterogêneas (com O, N ou S entre carbonos), saturadas ou insaturadas. O propano e o butano do gás de cozinha são alcanos de cadeia aberta e saturada.', /botijao|propano|butano|saturad|aberta|heterogen|homogen/),
    V('benzene 3D ball model', 'Modelo da molécula de benzeno: seis carbonos em anel.', 'A IUPAC dá nome aos compostos pelo número de carbonos da cadeia principal (met, et, prop, but, pent…), pelo tipo de ligação (ano para simples, eno para dupla, ino para tripla) e pelos ramos. O benzeno forma uma cadeia fechada e homogênea, chamada aromática.', /iupac|nome oficial|benzeno|aromat|anel|fechad|cicl/),
    V('bananas ripening', 'Bananas amadurecendo: o eteno é um hormônio vegetal.', 'O eteno (CH₂=CH₂), o alceno mais simples, é liberado pelas próprias frutas e acelera o amadurecimento; centros de distribuição o usam para amadurecer bananas. Também é a matéria-prima do polietileno.', /eteno|ch₂=ch|amadurec|dupla/),
    V('butane lighter', 'Isqueiro: butano liquefeito sob pressão.', 'Para nomear uma cadeia ramificada, escolhe-se a cadeia principal mais longa e numeram-se os carbonos a partir da ponta mais próxima do ramo: CH₃–CH(CH₃)–CH₃ é o 2-metilpropano, isômero do butano.', /ramific|ramo|metil|isqueiro|normal|linear/),
    V('Diethyl-ether-3D-balls', 'Modelo do éter dietílico: um oxigênio entre dois grupos de carbono.', 'Quando um átomo diferente do carbono, como oxigênio, nitrogênio ou enxofre, fica entre dois carbonos, a cadeia é heterogênea. O éter dietílico (CH₃–CH₂–O–CH₂–CH₃), usado no passado como anestésico, tem cadeia aberta, saturada e heterogênea.', /heterogen|oxigenio entre|enxofre|\beter\b|nitrogenio entre/),
    V('Cyclopentane 3D', 'Modelo de uma molécula em anel: cadeia fechada.', 'Cadeias fechadas, ou cíclicas, formam anéis. O cicloexano (C₆H₁₂), solvente industrial, tem seis carbonos em anel só com ligações simples: cadeia fechada, homogênea e saturada. Se o anel tiver um oxigênio, como no tetra-hidrofurano, a cadeia fechada passa a ser heterogênea.', /anel|fechad|cicl/),
    V('Oxyacetylene', 'Maçarico de acetileno: a chama passa de 3.000 °C.', 'O acetileno (etino, C₂H₂) tem uma ligação tripla entre os carbonos e é um alcino. Cadeias com ligações duplas ou triplas são insaturadas; cadeias só com ligações simples são saturadas.', /tripla|acetileno|etino|insatur|alcino/)
  ] },
  { q: 1, re: /\bph\b|poh|indicador|repolho|limao|acid|base|\bka\b|ioniza|tornassol|fenolftaleina|tampao|sabao|detergente|suco gastrico|hidroxido|h\+|h⁺/, v: [
    V('red cabbage pH indicator', 'Extrato de repolho roxo: muda de cor conforme o pH.', 'A escala de pH vai de 0 a 14 a 25 °C: abaixo de 7 é ácido, 7 é neutro, acima de 7 é básico. Cada unidade equivale a 10 vezes mais ou menos íons H⁺: uma solução de pH 2 tem 100 vezes mais H⁺ que uma de pH 4.', /ph \d|escala|repolho|mais acid|menos acid|mais basic|ph menor|ph maior/),
    V('Litmus paper', 'Papel de tornassol: azul em meio básico, vermelho em meio ácido.', 'Indicadores ácido-base mudam de cor conforme o pH. O tornassol fica vermelho em meio ácido e azul em meio básico; a fenolftaleína fica incolor em meio ácido ou neutro e rosa em meio básico.', /tornassol|fenolftaleina|indicador/),
    V('lemon slices', 'Limões: o suco é ácido por causa do ácido cítrico.', 'Ácidos liberam H⁺ em água. Os fortes, como o clorídrico, ionizam quase totalmente e têm Ka alto; os fracos, como o acético e o cítrico, ionizam pouco e têm Ka pequeno. Por isso, na mesma concentração, o ácido forte tem pH menor.', /forte|fraco|forca|\bka\b|ioniza|limao|cloridrico/),
    V('Blood sample tubes', 'Amostras de sangue: o pH do sangue fica perto de 7,4.', 'Soluções-tampão resistem a mudanças de pH quando recebem pequenas quantidades de ácido ou base. O sangue é tamponado pelo par ácido carbônico/bicarbonato; uma variação de poucos décimos no pH já é grave para o organismo.', /tampao|sangue|bicarbonato/),
    V('Hydrangea flowers', 'Hortênsias: a cor das flores depende do pH do solo.', 'Na agricultura, o pH do solo decide quais nutrientes as plantas absorvem; solos ácidos, comuns no Cerrado, são corrigidos com calcário (calagem). As hortênsias dão flores azuis em solo ácido e rosadas em solo básico.', /solo|agricult|calcario/),
    V('Soap bar', 'Sabões e detergentes: produtos de caráter básico.', 'Bases liberam OH⁻ em água; as fortes, como o hidróxido de sódio, dissociam-se totalmente. Produtos de limpeza costumam ser básicos (pH acima de 7), enquanto o suco gástrico é fortemente ácido (pH perto de 2). Ácido e base reagem formando sal e água: é a neutralização.', /base|hidroxido|sabao|detergente|neutraliz|suco gastrico/)
  ] }
];

const GERAL = {
  Biologia: [
    V('Microscope', 'Microscópio óptico, ferramenta básica da biologia.', 'A Biologia ajuda a entender a saúde, os alimentos, o ambiente e as tecnologias do dia a dia. Leia a situação com atenção e relacione-a ao conceito pedido.'),
    V('Fiocruz castle', 'Castelo da Fiocruz, no Rio de Janeiro: instituição de pesquisa em saúde desde 1900.', 'A ciência brasileira tem papel importante na saúde pública: a Fiocruz e o Butantan pesquisam doenças, produzem vacinas e medicamentos e formam cientistas. Muitos conceitos da Biologia aparecem nessas pesquisas.'),
    V('Jaguar Pantanal', 'Onça-pintada no Pantanal: o Brasil abriga cerca de 20% das espécies do planeta.', 'O Brasil é o país com a maior biodiversidade do mundo, distribuída em seis biomas: Amazônia, Cerrado, Mata Atlântica, Caatinga, Pampa e Pantanal. Conhecer a Biologia é o primeiro passo para conservar essa riqueza.')
  ],
  'Química': [
    V('chemistry laboratory glassware', 'Vidrarias de laboratório de química.', 'A Química está nos alimentos, nos combustíveis, nos remédios e nos produtos de limpeza. Leia a situação com atenção e relacione-a ao conceito pedido.'),
    V('Water treatment plant', 'Estação de tratamento de água: coagulação, decantação, filtração e cloração.', 'No tratamento da água que chega às casas, a química está em cada etapa: substâncias que agrupam a sujeira, decantação, filtração, cloro para eliminar micróbios e ajuste do pH. Muitos conceitos de Química aparecem nesse processo.'),
    V('Fertilizer granules', 'Fertilizantes: a química garante nutrientes para as lavouras.', 'A agricultura brasileira depende da química: fertilizantes repõem nitrogênio, fósforo e potássio do solo, e o calcário corrige a acidez. Usar a dose certa evita desperdício e a contaminação de rios.'),
    V('Kitchen cooking', 'Cozinhar é fazer química: o calor transforma as substâncias dos alimentos.', 'Ao cozinhar, o calor acelera reações que mudam cor, sabor e textura dos alimentos; o fermento libera gás, o vinagre e o limão mudam o pH. Muitos conceitos de Química aparecem na cozinha.'),
    V('Pills tablets', 'Comprimidos: cada remédio é uma substância química com dose e reação controladas.', 'Os medicamentos são resultado da química: sua estrutura define como agem no corpo, sua estabilidade define o prazo de validade e sua reação com o organismo define a dose.')
  ]
};

const hash = e => { let h = 0; for (let i = 0; i < e.length; i++) h = (h * 31 + e.charCodeAt(i)) >>> 0; return h; };
const gira = (arr, n) => arr.length ? arr.slice(n % arr.length).concat(arr.slice(0, n % arr.length)) : arr;

/* Candidatos (texto, imagem, legenda) para uma questão, do mais específico ao mais geral */
function candidatos(enunciado, componente) {
  const e = normal(enunciado), qui = componente === 'Química', h = hash(e);
  const esp = ESPEC.find(x => x.re.test(e));
  const temas = TEMAS.filter(x => !!x.q === qui && x.re.test(e));
  // primeiro os textos que mais se parecem com o enunciado (radicais de 5 letras); empates: ordem do tema, variando por questão
  const rad = x => new Set((normal(x).match(/[a-z]{5,}/g) || []).map(w => w.slice(0, 5)));
  const pal = rad(e), nota = v => (v.k && v.k.test(e) ? 10 : 0) + [...rad(v.t)].reduce((a, w) => a + (pal.has(w) ? 1 : 0), 0);
  const varTema = temas.flatMap((t, k) => gira(t.v, k === 0 ? h : 0)).map((v, i) => ({ v, i, n: nota(v) })).sort((a, b) => b.n - a.n || a.i - b.i).map(x => Object.assign({ n: x.n }, x.v));
  const ger = gira(GERAL[componente] || GERAL.Biologia, h);
  const lista = [];
  if (esp) {
    if (esp.t) lista.push({ t: esp.t, img: esp.img, leg: esp.leg, n: 30 });
    varTema.forEach(v => lista.push({ t: v.t, img: esp.img, leg: esp.leg, n: (v.n || 0) + 1 }));
    if (!varTema.length && !esp.t) ger.forEach(v => lista.push({ t: v.t, img: esp.img, leg: esp.leg }));
  }
  varTema.forEach(v => lista.push(v));
  ger.forEach(v => lista.push(v));
  // último recurso: contextos de outros temas do mesmo componente (nunca repetir texto ou imagem)
  gira(TEMAS.filter(x => !!x.q === qui && !temas.includes(x)).flatMap(t => t.v), h).forEach(v => lista.push(v));
  return { lista, casou: !!(esp || temas.length) };
}

/* Contextos de uma atividade inteira: nenhum texto-base e nenhuma imagem se repetem */
function contextosAtividade(questoes, componente) {
  const usT = new Set(), usI = new Set(), cands = questoes.map(q => candidatos(q.enunciado, componente)), res = [];
  const livre = c => !usT.has(c.t) && !usI.has(c.img);
  const usa = (k, c) => { res[k] = { texto: c.t, img: c.img, legenda: c.leg, casou: cands[k].casou }; if (c.t) usT.add(c.t); if (c.img) usI.add(c.img); };
  // 1) primeiro os encaixes mais fortes (situação citada no enunciado, palavras-chave), de qualquer questão
  const pares = [];
  cands.forEach((c, k) => c.lista.forEach((x, j) => { if ((x.n || 0) > 0) pares.push({ k, j, x }); }));
  pares.sort((a, b) => b.x.n - a.x.n || a.j - b.j || a.k - b.k);
  pares.forEach(p => { if (!res[p.k] && livre(p.x)) usa(p.k, p.x); });
  // 2) o resto, na ordem dos candidatos (tema, gerais, outros temas), sem repetir texto nem imagem
  cands.forEach((c, k) => {
    if (res[k]) return;
    let x = c.lista.find(livre);
    if (!x) { const t = c.lista.find(y => !usT.has(y.t)), i = c.lista.find(y => !usI.has(y.img)); x = { t: t ? t.t : '', img: i ? i.img : null, leg: i ? i.leg : '' }; }
    usa(k, x);
  });
  return res;
}

/* compatibilidade: contexto de uma questão isolada */
function contexto(enunciado, componente) { return contextosAtividade([{ enunciado }], componente)[0]; }

const BUSCAS = [...new Set([...ESPEC.map(x => x.img), ...TEMAS.flatMap(t => t.v.map(v => v.img)), ...Object.values(GERAL).flatMap(g => g.map(v => v.img))])];

module.exports = { contexto, contextosAtividade, normal, BUSCAS };
