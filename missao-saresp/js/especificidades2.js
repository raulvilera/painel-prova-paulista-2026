/* =========================================================================
   MISSÃO SARESP 3D — Especificidades (parte 2)
   1) estruturas que faltavam (organelas, níveis, eixo e órbitas…)
   2) D.especSim: quadros dos simuladores interativos
   3) D.especTema: quadros dos temas que não têm modelo 3D próprio
   Formato de cada item: { id, nome, cor, funcao, carac:[], acoes:[], cur }
   ========================================================================= */
(function () {
  const D = window.DADOS, F = D.fichas;
  const add = (id, carac, acoes) => { if (F[id]) { F[id].carac = carac; if (acoes) F[id].acoes = acoes; } };

  /* ---------------- 1) ESTRUTURAS QUE FALTAVAM ---------------- */
  add("eixo_terra", ["Inclinação: ~23,5° em relação à perpendicular da órbita", "Aponta sempre para a mesma região do céu (perto da Estrela Polar)", "Por causa dele, cada hemisfério recebe mais luz em uma época do ano"], ["Calendários agrícolas e de férias acompanham as estações", "Horário de verão foi usado para aproveitar os dias mais longos"]);
  add("orbita_terra", ["Volta completa em ~365 dias e 6 horas", "Formato quase circular (levemente elíptico)", "Distância média do Sol: ~150 milhões de km"], ["O ano bissexto (a cada 4 anos) corrige as 6 horas que sobram"]);
  add("orbita_lua", ["Volta à Terra em ~27,3 dias", "Ciclo das fases: ~29,5 dias", "Órbita inclinada ~5°: por isso não há eclipse todo mês"], ["Calendários lunares (como o islâmico e o chinês)", "Tábuas de marés para pesca e navegação"]);
  add("nucleoide", ["Região do citoplasma onde fica o DNA da bactéria", "Sem membrana em volta (célula procarionte)", "DNA geralmente circular"], ["Biotecnologia: genes inseridos em bactérias produzem insulina humana"]);
  add("capsideo", ["Capa de proteína que protege o material genético do vírus", "Forma geométrica (por exemplo, icosaedro)", "Alguns vírus têm envelope e espículas por fora"], ["Vacinas usam partes do capsídeo ou das espículas para treinar o sistema imunológico"]);
  add("corpo_neuronio", ["Contém o núcleo e a maior parte das organelas", "Junta os sinais que chegam pelos dendritos", "Produz os neurotransmissores"], ["Lesões no cérebro e na medula afetam os corpos dos neurônios"]);
  add("nucleo_n", ["Guarda o DNA do neurônio", "Comanda a produção de proteínas da célula", "Neurônios quase não se dividem depois de formados"]);
  add("eletrosfera", ["Região ao redor do núcleo onde ficam os elétrons", "Organizada em camadas (níveis de energia)", "É muito maior que o núcleo: o átomo é quase todo espaço vazio"], ["Fogos de artifício: elétrons que mudam de camada emitem luz colorida", "Lâmpadas de LED e de neônio funcionam pelo mesmo princípio"]);
  // célula animal
  add("membrana_a", ["Dupla camada de lipídios com proteínas", "Permeabilidade seletiva", "Reconhece outras células e substâncias"], ["Muitos remédios agem em proteínas da membrana"]);
  add("citoplasma_a", ["Líquido gelatinoso (citosol) com as organelas", "Onde acontecem muitas reações químicas", "Tem o citoesqueleto, que dá forma à célula"]);
  add("nucleo_a", ["Envolvido pela carioteca (membrana dupla com poros)", "Guarda o DNA (cromatina)", "Controla as atividades da célula"], ["Teste de DNA (paternidade, investigação criminal)", "Pesquisas em genética e terapias genéticas"]);
  add("nucleolo", ["Fica dentro do núcleo", "Produz os ribossomos"]);
  add("mitocondria", ["Membrana dupla com dobras (cristas)", "Faz a respiração celular e libera energia (ATP)", "Tem DNA próprio, herdado da mãe"], ["Exercícios aumentam o número de mitocôndrias nos músculos", "O DNA mitocondrial ajuda a estudar a origem dos povos"]);
  add("reticulo", ["Rede de membranas pelo citoplasma", "Rugoso: tem ribossomos e produz proteínas", "Liso: produz lipídios e ajuda a desintoxicar"]);
  add("golgi", ["Pilha de bolsas achatadas", "Modifica, empacota e envia substâncias", "Forma vesículas de secreção"]);
  add("ribossomo_a", ["Muito pequenos, sem membrana", "Fabricam as proteínas", "Existem em todas as células, até nas bactérias"], ["Vários antibióticos agem nos ribossomos das bactérias"]);
  add("lisossomo", ["Bolsinhas com enzimas digestivas", "Digerem partículas e organelas velhas", "Típicos das células animais"]);
  // célula vegetal
  add("parede", ["Feita principalmente de celulose", "Rígida: dá forma e sustentação", "Fica por fora da membrana plasmática"], ["Papel, algodão e madeira são feitos de celulose", "Fibras alimentares das verduras ajudam o intestino"]);
  add("membrana_v", ["Fica por dentro da parede celular", "Controla a entrada e a saída de substâncias"]);
  add("cloroplasto", ["Tem clorofila (pigmento verde)", "Faz a fotossíntese: luz + água + CO₂ → glicose + O₂", "Tem membrana dupla e pilhas de tilacoides"], ["Agricultura depende da fotossíntese", "Pesquisas buscam imitar a fotossíntese para produzir combustíveis"]);
  add("vacuolo", ["Grande e central nas células vegetais adultas", "Guarda água, sais, açúcares e pigmentos", "Mantém a célula firme (turgor)"], ["Plantas murcham quando os vacúolos perdem água"]);
  add("nucleo_v", ["Guarda o DNA da planta", "Controla as atividades da célula"], ["Melhoramento genético de plantas (sementes mais produtivas)"]);
  add("mitocondria_v", ["Plantas também fazem respiração celular, dia e noite", "Liberam energia a partir da glicose"]);
  // níveis de organização
  add("n_celula", ["Menor unidade viva", "Ex.: célula muscular cardíaca"], ["Cultura de células em laboratório para pesquisas e vacinas"]);
  add("n_tecido", ["Grupo de células parecidas com a mesma função", "Tecidos básicos: epitelial, conjuntivo, muscular e nervoso"], ["Enxertos de pele em queimaduras", "Bancos de tecidos e de sangue"]);
  add("n_orgao", ["Formado por vários tecidos", "Ex.: coração, estômago, folha"], ["Transplantes de órgãos (doação salva vidas)"]);
  add("n_sistema", ["Conjunto de órgãos que trabalham juntos", "Ex.: sistema cardiovascular"], ["Exames como o eletrocardiograma avaliam um sistema"]);
  add("n_organismo", ["Ser vivo completo", "Todos os sistemas funcionam de forma integrada"], ["Alimentação, sono e exercícios mantêm o organismo saudável"]);

  /* item helper */
  const it = (id, nome, cor, funcao, carac, acoes, cur) => ({ id, nome, cor, funcao, carac, acoes, cur });

  /* ---------------- 2) SIMULADORES ---------------- */
  D.especSim = {
    fases: { em: "🌗", titulo: "Fases da Lua e eclipses", intro: "A Lua não muda de forma: muda a parte iluminada que conseguimos ver da Terra.", itens: [
      it("nova", "Lua nova", "#334155", "A Lua fica entre a Terra e o Sol; a face iluminada está virada para o Sol.", ["Quase invisível no céu", "Nasce e se põe junto com o Sol", "Única fase em que pode ocorrer eclipse solar"], ["Melhor época para observar estrelas (céu mais escuro)"]),
      it("crescente", "Quarto crescente", "#94a3b8", "Vemos metade da face iluminada, que vai aumentando dia a dia.", ["~7 dias depois da lua nova", "No hemisfério Sul, a parte iluminada fica à esquerda (forma de C)", "Visível à tarde e no início da noite"]),
      it("cheia", "Lua cheia", "#f8fafc", "A Terra fica entre o Sol e a Lua; vemos toda a face iluminada.", ["~15 dias depois da lua nova", "Nasce quando o Sol se põe", "Única fase em que pode ocorrer eclipse lunar"], ["Marés mais fortes (marés de sizígia) na lua cheia e na nova"]),
      it("minguante", "Quarto minguante", "#94a3b8", "A parte iluminada diminui até a próxima lua nova.", ["~22 dias depois da lua nova", "No hemisfério Sul, a parte iluminada fica à direita", "Visível de madrugada e pela manhã"]),
      it("eclsol", "Eclipse solar", "#f59e0b", "A sombra da Lua atinge uma região da Terra e esconde o Sol.", ["Sol, Lua e Terra alinhados (lua nova)", "Total só numa faixa estreita da Terra", "Dura poucos minutos"], ["Nunca olhe para o Sol sem filtro próprio: pode cegar", "Cientistas usam eclipses para estudar a coroa solar"]),
      it("eclua", "Eclipse lunar", "#b45309", "A Lua entra na sombra da Terra e fica avermelhada.", ["Sol, Terra e Lua alinhados (lua cheia)", "Visível de todo o lado da Terra que está de noite", "Pode durar mais de 1 hora"], ["Pode ser observado a olho nu, sem perigo"])] },
    estacoes: { em: "🌍", titulo: "Estações do ano", intro: "As estações acontecem porque o eixo da Terra é inclinado, não porque a Terra se afasta do Sol.", itens: [
      it("verao", "Solstício de verão (Sul)", "#f97316", "Por volta de 21 de dezembro: o hemisfério Sul recebe a luz mais direta do Sol.", ["Dia mais longo do ano no hemisfério Sul", "Sol a pino sobre o Trópico de Capricórnio", "Ao mesmo tempo, é inverno no hemisfério Norte"], ["Mais consumo de energia com ventiladores e ar-condicionado", "Período de chuvas de verão em grande parte do Brasil"]),
      it("inverno", "Solstício de inverno (Sul)", "#38bdf8", "Por volta de 21 de junho: o hemisfério Sul recebe a luz mais inclinada.", ["Noite mais longa do ano no hemisfério Sul", "Sol a pino sobre o Trópico de Câncer", "É verão no hemisfério Norte"], ["Campanhas de vacinação contra a gripe antes do inverno"]),
      it("equinocio", "Equinócios", "#22c55e", "Por volta de 21 de março e 23 de setembro: os dois hemisférios recebem a mesma luz.", ["Dia e noite com ~12 horas cada em todo o planeta", "Sol a pino sobre a linha do Equador", "Marcam o início do outono e da primavera"]),
      it("tropicos", "Equador e trópicos", "#a855f7", "Linhas imaginárias que marcam até onde o Sol pode ficar a pino.", ["Equador: divide os hemisférios Norte e Sul", "Trópicos: ~23,5° ao norte (Câncer) e ao sul (Capricórnio)", "Entre os trópicos fica a zona tropical, onde está a maior parte do Brasil"], ["O Trópico de Capricórnio passa pela cidade de São Paulo"]),
      it("eixo", "Eixo inclinado", "#f472b6", "A inclinação de ~23,5° faz a luz chegar mais direta em cada hemisfério em épocas diferentes.", ["Sem inclinação, não haveria estações", "Perto do Equador as estações são pouco marcadas", "Nos polos há meses de dia e meses de noite"])] },
    sombras: { em: "🕒", titulo: "Sombras e pontos cardeais", intro: "O tamanho e a direção da sombra mudam porque a posição aparente do Sol muda ao longo do dia.", itens: [
      it("gnomon", "Gnômon", "#e5e7eb", "Haste vertical usada para observar a sombra do Sol.", ["Um dos instrumentos astronômicos mais antigos", "Sombra comprida de manhã e no fim da tarde", "Sombra mais curta perto do meio-dia"], ["Relógios de sol usam um gnômon", "Povos indígenas e antigos usavam para marcar o tempo e as estações"]),
      it("meiodia", "Sombra do meio-dia", "#facc15", "Ao meio-dia solar, o Sol está mais alto e a sombra fica mais curta.", ["Em São Paulo, a sombra do meio-dia aponta para o sul na maior parte do ano", "No verão, perto do Trópico, a sombra quase some"], ["Arquitetos usam a posição do Sol para planejar janelas e sombras nas construções"]),
      it("cardeais", "Pontos cardeais", "#22d3ee", "Norte, sul, leste e oeste podem ser encontrados pelo Sol.", ["O Sol nasce do lado leste e se põe do lado oeste", "De braços abertos, com o direito para o leste, à frente fica o norte", "Ponto cardeal ≠ ponto colateral (NE, SE, SO, NO)"], ["Bússola e GPS são usados na navegação atual"]),
      it("relogio", "Relógio de sol", "#f97316", "A direção da sombra indica a hora do dia.", ["A sombra gira ao longo do dia", "Não funciona à noite nem em dias nublados"])] },
    estufa: { em: "🌡️", titulo: "Efeito estufa", intro: "Parte do calor que a Terra devolve fica presa pelos gases da atmosfera.", itens: [
      it("luz", "Radiação do Sol", "#fde047", "A luz do Sol atravessa a atmosfera e aquece a superfície.", ["Chega como luz visível e ultravioleta", "Parte é refletida pelas nuvens, gelo e oceanos"], ["Painéis solares aproveitam essa energia"]),
      it("calor", "Calor (infravermelho)", "#ef4444", "A superfície aquecida devolve energia na forma de calor (infravermelho).", ["Não é visível", "Parte escapa para o espaço, parte fica presa"]),
      it("gases", "Gases de efeito estufa", "#a3a3a3", "Gases que retêm o calor na atmosfera.", ["Gás carbônico (CO₂), metano (CH₄), óxido nitroso e vapor de água", "O CO₂ no ar passou de ~280 ppm (antes das indústrias) para mais de 420 ppm hoje"], ["Queima de combustíveis fósseis", "Desmatamento e queimadas", "Pecuária (metano) e lixões"]),
      it("natural", "Efeito estufa natural", "#22c55e", "Mantém a Terra numa temperatura boa para a vida.", ["Sem ele a média seria de ~ −18 °C", "Com ele, a média é de ~15 °C"]),
      it("intensificado", "Efeito estufa intensificado", "#f97316", "Mais gases → mais calor preso → aquecimento global.", ["A Terra já aqueceu ~1,2 °C desde 1850", "Derretimento de geleiras e subida do nível do mar"], ["Energias renováveis, reflorestamento e transporte coletivo reduzem as emissões", "Acordo de Paris"])] },
    selecao: { em: "🦋", titulo: "Seleção natural das mariposas", intro: "Exemplo real: as mariposas de Manchester (Inglaterra) durante a Revolução Industrial.", itens: [
      it("clara", "Mariposa clara", "#e7e5e4", "Camuflada em troncos claros, cobertos de liquens.", ["Mais comum antes da poluição das fábricas", "Fica visível para os pássaros em troncos escuros"]),
      it("escura", "Mariposa escura", "#292524", "Camuflada em troncos escurecidos pela fuligem.", ["Ficou mais comum durante a Revolução Industrial", "Voltou a diminuir quando o ar ficou mais limpo"]),
      it("predador", "Pássaros (predadores)", "#f97316", "Comem as mariposas que conseguem enxergar.", ["São o \"agente\" da seleção", "Quem fica camuflado sobrevive e deixa mais filhotes"]),
      it("ambiente", "Mudança do ambiente", "#64748b", "A poluição mudou a cor dos troncos e mudou qual mariposa era favorecida.", ["Fuligem das fábricas a carvão escureceu os troncos", "Leis de controle da poluição clarearam de novo"], ["Ações humanas alteram ambientes e influenciam a evolução de outras espécies"]),
      it("variacao", "Variação", "#a855f7", "Na população já existiam mariposas claras e escuras.", ["A seleção natural não cria a cor: ela favorece a que já existe", "A cor é herdada dos pais"])] },
    energia: { em: "⚡", titulo: "Consumo de energia", intro: "Consumo (kWh) = potência (kW) × tempo de uso (h).", itens: [
      it("potencia", "Potência", "#ef4444", "Quanto de energia o aparelho usa por unidade de tempo.", ["Medida em watts (W)", "Chuveiro: ~5 000 W; lâmpada LED: ~9 W", "Aparelhos que aquecem têm potência alta"]),
      it("kwh", "Quilowatt-hora (kWh)", "#3b82f6", "Unidade usada na conta de luz.", ["1 kWh = 1 000 W ligados por 1 hora", "Chuveiro de 5 000 W por 30 min/dia ≈ 75 kWh por mês"], ["Conferir a conta de luz em casa e comparar meses"]),
      it("bandeiras", "Bandeiras tarifárias", "#f59e0b", "Avisam quando a energia está mais cara.", ["Verde, amarela e vermelha", "Ficam vermelhas quando há pouca chuva e as termelétricas são ligadas"], ["Economizar mais nos meses de bandeira vermelha"]),
      it("procel", "Selo Procel e etiqueta", "#22c55e", "Indicam os aparelhos mais eficientes.", ["Faixa A = mais econômico", "Mostra o consumo mensal estimado"], ["Escolher aparelhos com selo na hora de comprar"]),
      it("standby", "Modo de espera (stand-by)", "#64748b", "Aparelhos desligados pelo controle continuam gastando um pouco.", ["Luzinha acesa = consumo", "Pode somar alguns kWh por mês"], ["Tirar da tomada aparelhos que ficam muito tempo sem uso"])] },
    biomas: { em: "🌳", titulo: "Biomas brasileiros", intro: "O Brasil tem seis biomas, com clima, solo, plantas e animais diferentes.", itens: [
      it("amazonia", "Amazônia", "#16a34a", "Maior floresta tropical do mundo.", ["~49% do território brasileiro", "Chuva: ~2 300 mm por ano", "Maior biodiversidade do planeta", "Rios voadores levam umidade para outras regiões"], ["Desmatamento para pasto e soja", "Garimpo ilegal contamina rios com mercúrio", "Terras indígenas e Unidades de Conservação ajudam a proteger"]),
      it("cerrado", "Cerrado", "#ca8a04", "Savana brasileira, \"berço das águas\".", ["Árvores tortas, casca grossa e raízes profundas", "Estação seca bem marcada", "Nascentes de grandes rios brasileiros"], ["Expansão da agricultura (soja, milho) e do gado", "Queimadas fora de época"]),
      it("mata", "Mata Atlântica", "#15803d", "Floresta do litoral, muito úmida e rica em espécies.", ["Restam só ~12% da área original", "Muitas espécies endêmicas, como o mico-leão-dourado", "Abriga as maiores cidades do Brasil"], ["Urbanização e desmatamento históricos", "Projetos de reflorestamento e corredores ecológicos"]),
      it("caatinga", "Caatinga", "#d97706", "Único bioma exclusivamente brasileiro, semiárido.", ["Chuva: ~650 mm, concentrada em poucos meses", "Plantas perdem as folhas na seca; cactos guardam água", "Rios temporários"], ["Desertificação por desmatamento e uso intenso do solo", "Cisternas captam água da chuva para as famílias"]),
      it("pantanal", "Pantanal", "#0ea5e9", "Maior planície alagável do mundo.", ["Cheias e secas marcam o ano", "Grande concentração de aves, peixes, jacarés e onças"], ["Grandes incêndios em anos secos", "Turismo ecológico e pesca"]),
      it("pampa", "Pampa", "#65a30d", "Campos do sul do Brasil.", ["Vegetação rasteira (gramíneas)", "Clima com estações bem definidas e invernos frios"], ["Pecuária tradicional", "Substituição dos campos por plantações de soja e eucalipto"])] },
    celulas: { em: "🔬", titulo: "Classifique a célula", intro: "Repare no núcleo, na parede celular e nos cloroplastos para classificar.", itens: [
      it("pro", "Célula procarionte", "#38bdf8", "Célula sem núcleo: o DNA fica solto no citoplasma.", ["Bactérias", "Sem organelas com membrana", "Ribossomos, parede celular e, às vezes, flagelo e plasmídeo"], ["Uso de bactérias na indústria de alimentos e de remédios"]),
      it("ani", "Célula animal", "#f472b6", "Eucarionte sem parede celular e sem cloroplastos.", ["Formato variável", "Lisossomos e centríolos", "Vacúolos pequenos"]),
      it("veg", "Célula vegetal", "#22c55e", "Eucarionte com parede celular, cloroplastos e vacúolo grande.", ["Formato mais regular (parede de celulose)", "Faz fotossíntese", "Vacúolo central grande"], ["Alimentos, papel, tecidos de algodão e madeira vêm de células vegetais"])] }
  };

  /* ---------------- 3) TEMAS SEM MODELO 3D PRÓPRIO ---------------- */
  D.especTema = {
    "6-AE3": { em: "🪨", titulo: "Rochas, solo e fósseis", itens: [
      it("magmatica", "Rochas magmáticas", "#ef4444", "Formadas pelo resfriamento do magma.", ["Ex.: granito (esfria devagar, dentro da crosta) e basalto (esfria rápido, na superfície)"], ["Pias, pisos e paralelepípedos de granito e basalto"]),
      it("sedimentar", "Rochas sedimentares", "#d97706", "Formadas por camadas de sedimentos compactados.", ["Ex.: arenito, calcário, argilito", "Onde mais se encontram fósseis", "Guardam petróleo e gás"], ["Cimento é feito de calcário", "Extração de petróleo"]),
      it("metamorfica", "Rochas metamórficas", "#8b5cf6", "Outras rochas transformadas por calor e pressão.", ["Ex.: mármore (do calcário) e ardósia (da argila)"], ["Mármore em esculturas e pisos"]),
      it("solo", "Solo", "#78350f", "Camada formada pelo intemperismo das rochas e por matéria orgânica.", ["Horizontes: húmus no topo, rocha-mãe embaixo", "Arenoso, argiloso ou humífero"], ["Agricultura, adubação e rotação de culturas", "Erosão e compactação por mau uso"]),
      it("fossil", "Fósseis", "#a8a29e", "Restos ou marcas de seres vivos preservados nas rochas.", ["Ossos, conchas, pegadas, folhas", "Ajudam a contar a história da vida"], ["Paleontólogos escavam sítios fósseis, como os do Cariri (CE)"])] },
    "7-AE1": { em: "🌋", titulo: "Placas tectônicas", itens: [
      it("pangeia", "Pangeia e deriva", "#f59e0b", "Há ~200 milhões de anos os continentes formavam um só bloco.", ["Proposta de Alfred Wegener (1912)", "Evidências: encaixe dos litorais e fósseis iguais em continentes diferentes"]),
      it("convergente", "Placas que se chocam", "#ef4444", "Formam cordilheiras, vulcões e terremotos fortes.", ["Ex.: Andes e Himalaia"], ["Construções resistentes a terremotos no Chile e no Japão"]),
      it("divergente", "Placas que se afastam", "#22c55e", "O magma sobe e forma nova crosta.", ["Ex.: dorsal no meio do Oceano Atlântico", "O Atlântico aumenta ~2 a 3 cm por ano"]),
      it("terremoto", "Terremotos e tsunamis", "#3b82f6", "Liberação brusca de energia nos limites das placas.", ["Medidos por sismógrafos", "Terremotos no mar podem causar tsunamis"], ["Sistemas de alerta de tsunami", "Simulações de evacuação em escolas"])] },
    "7-AE3": { em: "⚙️", titulo: "Máquinas simples", itens: [
      it("alavanca", "Alavanca", "#f59e0b", "Barra que gira em torno de um ponto de apoio.", ["Partes: apoio, força potente e força resistente", "Braço maior = menos força"], ["Gangorra, tesoura, alicate, pé de cabra, carrinho de mão"]),
      it("plano", "Plano inclinado", "#22c55e", "Rampa que reduz a força para subir um objeto.", ["Menos força, caminho mais longo"], ["Rampas de acessibilidade", "Estradas em zigue-zague nas serras"]),
      it("polia", "Polia (roldana)", "#3b82f6", "Roda com corda que muda a direção da força.", ["Fixa: muda a direção", "Móvel: reduz a força pela metade"], ["Guindastes, poços, elevadores"]),
      it("roda", "Roda e eixo", "#a855f7", "Facilita o movimento e reduz o atrito.", ["Maçaneta, volante e manivela"], ["Bicicletas, carros, moinhos"]),
      it("cunha", "Cunha e parafuso", "#64748b", "Cunha corta ou separa; parafuso é um plano inclinado enrolado.", ["Faca e machado são cunhas"], ["Parafusos prendem móveis e estruturas"])] },
    "7-AE11": { em: "💉", titulo: "Vacinas e indicadores de saúde", itens: [
      it("vacina", "Vacina", "#22c55e", "Treina o sistema imunológico antes do contato com a doença.", ["Contém o agente enfraquecido, inativado ou partes dele", "Gera memória imunológica", "Prevenção"], ["Calendário Nacional de Vacinação (SUS)", "Campanhas como a do Zé Gotinha contra a poliomielite"]),
      it("soro", "Soro", "#3b82f6", "Já traz anticorpos prontos.", ["Ação imediata, mas temporária", "Tratamento (não prevenção)"], ["Soro antiofídico (Instituto Butantan, SP)"]),
      it("rebanho", "Imunidade coletiva", "#a855f7", "Quando muita gente se vacina, o agente circula menos.", ["Protege quem não pode se vacinar (bebês, imunossuprimidos)"]),
      it("indicadores", "Indicadores de saúde", "#f59e0b", "Números que mostram a saúde de uma população.", ["Mortalidade infantil", "Expectativa de vida", "Cobertura vacinal", "Acesso a saneamento"], ["Governos usam os indicadores para planejar políticas de saúde"])] },
    "8-AE1": { em: "🧬", titulo: "Puberdade e sistema endócrino", itens: [
      it("hipofise", "Hipófise", "#a855f7", "Glândula \"mestra\" na base do cérebro.", ["Hormônio do crescimento", "Comanda testículos, ovários, tireoide e suprarrenais"]),
      it("tireoide", "Tireoide", "#3b82f6", "Glândula no pescoço que regula o metabolismo.", ["Precisa de iodo para funcionar"], ["Sal de cozinha com iodo no Brasil previne o bócio"]),
      it("pancreas", "Pâncreas", "#f59e0b", "Produz insulina e glucagon.", ["Controla a glicose no sangue"], ["Tratamento do diabetes com insulina"]),
      it("gonadas", "Testículos e ovários", "#ef4444", "Produzem testosterona, estrogênio e progesterona.", ["Iniciam as mudanças da puberdade", "Produzem os gametas"], ["Educação sexual e saúde do adolescente nas UBS"]),
      it("suprarrenal", "Suprarrenais", "#f97316", "Produzem a adrenalina e o cortisol.", ["Reação de \"luta ou fuga\"", "Respostas ao estresse"])] },
    "8-AE5": { em: "🫁", titulo: "Digestão e respiração", itens: [
      it("boca", "Boca e esôfago", "#f472b6", "Início da digestão: mastigação e saliva.", ["A saliva começa a digerir o amido", "Movimentos peristálticos levam o alimento"], ["Escovar os dentes previne cáries"]),
      it("estomago", "Estômago", "#ef4444", "Digestão das proteínas com suco gástrico ácido.", ["pH muito ácido", "Pepsina"], ["Remédios antiácidos; evitar automedicação"]),
      it("intestino", "Intestinos", "#f59e0b", "Delgado absorve nutrientes; grosso absorve água.", ["Vilosidades aumentam a área de absorção", "Bactérias intestinais (microbiota) ajudam"], ["Alimentação rica em fibras", "Exames como a colonoscopia"]),
      it("pulmao", "Pulmões e alvéolos", "#3b82f6", "Troca de gases entre o ar e o sangue.", ["~300 milhões de alvéolos", "Oxigênio entra no sangue; gás carbônico sai"], ["Cigarro e poluição causam doenças respiratórias", "Espirômetro mede a capacidade pulmonar"]),
      it("diafragma", "Diafragma", "#22c55e", "Músculo que faz o ar entrar e sair.", ["Contrai: inspiração", "Relaxa: expiração"])] },
    "8-AE9": { em: "⛅", titulo: "Clima e previsão do tempo", itens: [
      it("tempo", "Tempo × clima", "#3b82f6", "Tempo é o estado da atmosfera agora; clima é o padrão de ~30 anos.", ["Elementos: temperatura, umidade, pressão, vento e chuva"]),
      it("massas", "Massas de ar e frentes", "#64748b", "Grandes porções de ar com temperatura e umidade parecidas.", ["Frente fria: chuva e queda de temperatura", "Massa polar traz o frio para o Sul e Sudeste"]),
      it("correntes", "Correntes marítimas", "#0ea5e9", "Rios dentro do oceano que levam calor ou frio.", ["Corrente do Brasil (quente)", "El Niño: aquecimento do Pacífico que muda as chuvas"]),
      it("instrumentos", "Instrumentos", "#f59e0b", "Medem os elementos do tempo.", ["Termômetro, barômetro, pluviômetro, anemômetro, higrômetro"], ["INMET e satélites meteorológicos fazem a previsão", "Defesa Civil emite alertas por SMS"]),
      it("climasbr", "Climas do Brasil", "#22c55e", "Equatorial, tropical, semiárido, subtropical, tropical de altitude.", ["São Paulo: tropical de altitude/subtropical"], ["Agricultura planeja o plantio pela previsão do clima"])] },
    "8-AE10": { em: "🌡️", titulo: "Mudanças climáticas", itens: [
      it("causas", "Causas", "#ef4444", "Aumento dos gases de efeito estufa pelas atividades humanas.", ["Combustíveis fósseis", "Desmatamento e queimadas", "Pecuária e lixões"]),
      it("efeitos", "Efeitos", "#f97316", "Planeta mais quente e eventos extremos mais frequentes.", ["Ondas de calor, secas e chuvas intensas", "Derretimento de geleiras e subida do mar", "Perda de biodiversidade"]),
      it("mitigacao", "Mitigação", "#22c55e", "Reduzir as emissões.", ["Energias renováveis", "Reflorestamento", "Transporte coletivo e eficiência energética"], ["Acordo de Paris", "Metas de desmatamento zero"]),
      it("adaptacao", "Adaptação", "#3b82f6", "Preparar-se para os efeitos que já acontecem.", ["Obras de drenagem, áreas verdes nas cidades", "Sistemas de alerta da Defesa Civil"])] },
    "9-AE3": { em: "🧊", titulo: "Estados físicos da matéria", itens: [
      it("solido", "Sólido", "#3b82f6", "Partículas organizadas, bem juntas, só vibrando.", ["Forma e volume definidos"], ["Gelo para conservar alimentos"]),
      it("liquido", "Líquido", "#0ea5e9", "Partículas próximas, mas que deslizam umas sobre as outras.", ["Volume definido; forma do recipiente"]),
      it("gasoso", "Gasoso", "#a855f7", "Partículas afastadas e muito agitadas.", ["Sem forma e sem volume próprios", "Pode ser comprimido"], ["Botijão de gás guarda gás comprimido (liquefeito)"]),
      it("mudancas", "Mudanças de estado", "#f59e0b", "Fusão, solidificação, vaporização, condensação e sublimação.", ["Água: funde a 0 °C e ferve a 100 °C (nível do mar)", "Em altitudes maiores a água ferve abaixo de 100 °C"], ["Panela de pressão cozinha mais rápido porque a água ferve acima de 100 °C", "Destilação e secagem de alimentos"])] },
    "9-AE11": { em: "♻️", titulo: "Problemas ambientais e Unidades de Conservação", itens: [
      it("ucs", "Unidades de Conservação", "#22c55e", "Áreas protegidas por lei.", ["Proteção integral (ex.: parques nacionais)", "Uso sustentável (ex.: reservas extrativistas)"], ["Parque Estadual da Serra do Mar (SP)", "Turismo ecológico e pesquisa"]),
      it("bacias", "Bacias hidrográficas", "#0ea5e9", "Área drenada por um rio e seus afluentes.", ["Mata ciliar protege as margens", "Nascentes dependem da vegetação"], ["Comitês de bacia decidem sobre o uso da água", "Recuperação de nascentes"]),
      it("residuos", "Resíduos e consumo", "#f59e0b", "Lixo mal descartado polui solo, água e ar.", ["Plástico demora centenas de anos para se decompor", "3 Rs: reduzir, reutilizar, reciclar"], ["Coleta seletiva e cooperativas de reciclagem", "Compostagem de resíduos orgânicos"]),
      it("poluicao", "Poluição da água", "#64748b", "Esgoto e produtos químicos nos rios.", ["Falta de oxigênio mata os peixes"], ["Estações de tratamento de esgoto", "Despoluição do rio Tietê"])] },
    "9-AE13": { em: "🚀", titulo: "Vida fora da Terra", itens: [
      it("habitavel", "Zona habitável", "#22c55e", "Distância da estrela em que pode existir água líquida.", ["A Terra está na zona habitável do Sol"], ["Telescópios procuram exoplanetas em zonas habitáveis"]),
      it("marte", "Desafios em Marte", "#ef4444", "Frio, radiação, atmosfera fina de CO₂ e pouca água líquida.", ["Gravidade de ~38% da terrestre", "Viagem de ~7 meses"], ["Jipes Curiosity e Perseverance", "Pesquisas para produzir oxigênio em Marte (MOXIE)"]),
      it("iss", "Estação Espacial Internacional", "#3b82f6", "Laboratório em órbita a ~400 km.", ["Astronautas de vários países", "Microgravidade"], ["Pesquisas sobre perda óssea, plantas no espaço e novos materiais"]),
      it("tecnologias", "Tecnologias que vieram do espaço", "#f59e0b", "Muitas invenções do dia a dia surgiram da exploração espacial.", ["Satélites de GPS e de previsão do tempo", "Termômetro de ouvido, filtros de água, espuma viscoelástica"])] }
  };
  /* ---------------- 4) MODELOS 3D DOS TEMAS QUE USAVAM O SOL/TERRA/LUA EMPRESTADO ---------------- */
  (function () {
    const fi = (modelo, hab, aula) => (id, nome, cor, funcao, desc, carac, acoes, curiosidade) => { F[id] = { modelo, nome, cor, hab, aula, funcao, desc, carac, acoes, curiosidade }; };
    D.modelos.push(
      { id: "endocrino", em: "🧬", nome: "Sistema endócrino", sub: "Glândulas e hormônios da puberdade", aula: "8º ano · AE1", intro: "As <b>glândulas endócrinas</b> lançam <b>hormônios</b> no sangue. Na puberdade, a hipófise comanda os testículos e os ovários, que produzem os hormônios das mudanças do corpo. Toque em cada glândula." },
      { id: "digestorio", em: "🫁", nome: "Digestório e respiratório", sub: "Do alimento e do ar até as células", aula: "8º ano · AE5", intro: "O sistema <b>digestório</b> transforma o alimento em nutrientes; o <b>respiratório</b> leva o oxigênio para o sangue. Repare nos pulmões enchendo e no diafragma descendo a cada respiração." },
      { id: "maquinas", em: "⚙️", nome: "Máquinas simples", sub: "Alavanca, plano inclinado, polia, roda, cunha e parafuso", aula: "7º ano · AE3", intro: "Máquinas simples <b>não criam energia</b>: elas diminuem a força necessária ou mudam a direção da força. Observe cada uma funcionando." },
      { id: "vacina", em: "💉", nome: "Vacina e defesa do corpo", sub: "Antígeno, linfócito, anticorpos e memória", aula: "7º ano · AE11", intro: "A <b>vacina</b> apresenta ao corpo um antígeno enfraquecido ou inativado. Os <b>linfócitos</b> produzem <b>anticorpos</b> e guardam <b>células de memória</b>, que reagem rápido se o agente verdadeiro aparecer." });
    const E = fi("endocrino", ["8-AE1"], "8º ano");
    E("hipofise", "Hipófise", "#a855f7", "Glândula \"mestra\": comanda outras glândulas e produz o hormônio do crescimento.", "Pequena, do tamanho de um grão de ervilha, fica na base do encéfalo.", ["Hormônio do crescimento", "Libera hormônios que ativam testículos e ovários na puberdade", "Controla a tireoide e as suprarrenais"], ["Tratamentos com hormônio do crescimento, com acompanhamento médico"], "Ela é controlada pelo hipotálamo, uma região do encéfalo: é a ponte entre o sistema nervoso e o endócrino.");
    E("tireoide", "Tireoide", "#3b82f6", "Regula o metabolismo, a velocidade com que o corpo usa energia.", "Glândula em forma de borboleta, no pescoço.", ["Produz os hormônios T3 e T4", "Precisa de iodo para funcionar"], ["Sal de cozinha com iodo previne o bócio", "Exames de sangue avaliam a tireoide"]);
    E("suprarrenais", "Suprarrenais", "#f97316", "Produzem adrenalina e cortisol, hormônios das situações de estresse.", "Ficam em cima dos rins.", ["Adrenalina: coração acelera, pupilas dilatam (luta ou fuga)", "Cortisol: ajuda o corpo a lidar com o estresse"], ["Injeção de adrenalina em alergias graves (atendimento de emergência)"]);
    E("pancreas", "Pâncreas", "#facc15", "Produz insulina e glucagon, que controlam o açúcar do sangue.", "Fica atrás do estômago; também produz suco digestivo.", ["Insulina: baixa a glicose do sangue", "Glucagon: aumenta a glicose quando ela está baixa"], ["Tratamento do diabetes com insulina", "Alimentação equilibrada e exercícios ajudam a prevenir o diabetes tipo 2"]);
    E("gonadas", "Testículos e ovários", "#ef4444", "Produzem os hormônios sexuais e os gametas.", "Testículos (meninos) produzem testosterona; ovários (meninas) produzem estrogênio e progesterona.", ["Iniciam as mudanças da puberdade", "Testosterona: voz mais grossa, pelos, aumento dos músculos", "Estrogênio e progesterona: mamas, ciclo menstrual"], ["Educação sexual e acompanhamento na UBS", "Vacina contra o HPV para meninas e meninos"]);
    const G = fi("digestorio", ["8-AE5"], "8º ano");
    G("pulmoes", "Pulmões", "#f472b6", "Fazem a troca de gases: entra oxigênio no sangue e sai gás carbônico.", "Dois órgãos esponjosos dentro da caixa torácica, cheios de alvéolos.", ["~300 milhões de alvéolos", "O pulmão esquerdo é um pouco menor (espaço do coração)"], ["Cigarro e poluição causam doenças respiratórias", "Espirometria mede a capacidade pulmonar"]);
    G("traqueia", "Traqueia e brônquios", "#e5e7eb", "Levam o ar até os pulmões.", "Tubo com anéis de cartilagem que se divide em dois brônquios.", ["Cílios e muco seguram poeira e microrganismos", "Os brônquios se ramificam em bronquíolos"], ["Bombinhas de asma dilatam os brônquios"]);
    G("diafragma", "Diafragma", "#dc2626", "Músculo que faz o ar entrar e sair dos pulmões.", "Separa o tórax do abdômen.", ["Contrai e desce: inspiração", "Relaxa e sobe: expiração", "O soluço é uma contração involuntária dele"]);
    G("esofago", "Esôfago", "#fda4af", "Leva o alimento da boca até o estômago.", "Tubo muscular de cerca de 25 cm.", ["Movimentos peristálticos empurram o alimento", "Funciona até de cabeça para baixo"]);
    G("estomago", "Estômago", "#fb7185", "Digere as proteínas com o suco gástrico.", "Bolsa muscular que mistura o alimento com ácido.", ["Suco gástrico muito ácido", "Enzima pepsina"], ["Evitar automedicação com anti-inflamatórios, que irritam o estômago"]);
    G("figado", "Fígado", "#92400e", "Produz a bile, que ajuda a digerir gorduras, e filtra substâncias do sangue.", "Maior glândula do corpo, do lado direito do abdômen.", ["Guarda glicose e vitaminas", "Transforma substâncias tóxicas"], ["O álcool em excesso danifica o fígado", "Vacina contra a hepatite B"]);
    G("intestino_delgado", "Intestino delgado", "#fda4af", "Termina a digestão e absorve os nutrientes para o sangue.", "Tubo enrolado de cerca de 6 a 7 metros.", ["Vilosidades aumentam a área de absorção", "Recebe a bile e o suco pancreático"]);
    G("intestino_grosso", "Intestino grosso", "#d97706", "Absorve água e forma as fezes.", "Tubo mais largo e mais curto (~1,5 m) que contorna o delgado.", ["Abriga bactérias benéficas (microbiota)", "Fibras dos alimentos ajudam o funcionamento"], ["Alimentação rica em fibras e água", "Saneamento básico previne verminoses"]);
    const Q = fi("maquinas", ["7-AE3"], "7º ano");
    Q("alavanca", "Alavanca", "#f59e0b", "Barra rígida que gira em um ponto de apoio e multiplica a força.", "Partes: ponto de apoio, força potente (seta vermelha) e força resistente (a pedra).", ["Quanto maior o braço da força, menor a força necessária", "Interfixa, inter-resistente e interpotente"], ["Gangorra, tesoura, alicate, pé de cabra, carrinho de mão"]);
    G; Q("plano", "Plano inclinado", "#65a30d", "Rampa que permite subir um objeto com menos força.", "A caixa sobe pela rampa em vez de ser erguida na vertical.", ["Menos força, caminho mais longo", "Quanto menos inclinada, menor a força"], ["Rampas de acessibilidade (NBR 9050)", "Estradas em zigue-zague nas serras"]);
    Q("polia", "Polia (roldana)", "#f59e0b", "Roda com corda que muda a direção da força.", "Puxar a corda para baixo levanta o peso.", ["Polia fixa: muda a direção", "Polia móvel: divide a força pela metade", "Talha: várias polias juntas"], ["Guindastes, elevadores, poços, academias"]);
    Q("roda", "Roda e eixo", "#0ea5e9", "Uma roda grande presa a um eixo: girar a roda gira o eixo com mais força.", "A roda maior funciona como uma alavanca que gira.", ["Quanto maior a roda em relação ao eixo, menos força"], ["Volante, maçaneta, manivela, bicicleta"]);
    Q("cunha", "Cunha", "#94a3b8", "Peça em forma de V que divide ou corta materiais.", "Concentra a força em uma área pequena.", ["Quanto mais fina, mais fácil de entrar"], ["Machado, faca, prego, calço de porta"]);
    Q("parafuso", "Parafuso", "#cbd5e1", "Plano inclinado enrolado em um cilindro.", "Cada volta faz o parafuso avançar um pouco.", ["Transforma giro em avanço", "Rosca mais fina = menos força"], ["Parafusos em móveis, tampas de garrafa, macaco de carro"]);
    const V = fi("vacina", ["7-AE11"], "7º ano");
    V("vacina", "Vacina", "#7dd3fc", "Apresenta ao corpo o agente da doença enfraquecido, inativado ou só uma parte dele.", "Pode ser injetável ou oral (gotinha).", ["Prevenção: age antes do contato com a doença", "Gera memória imunológica", "Algumas precisam de reforço"], ["Calendário Nacional de Vacinação do SUS", "Instituto Butantan (SP) produz vacinas e soros"]);
    V("antigeno", "Antígeno", "#86efac", "Parte do agente que o sistema imunológico reconhece.", "Na vacina, ele não causa a doença.", ["Proteínas da superfície do vírus ou da bactéria", "Ativa os linfócitos"]);
    V("linfocito", "Linfócito (célula de defesa)", "#a78bfa", "Glóbulo branco que reconhece o antígeno e produz anticorpos.", "Fica no sangue e nos gânglios linfáticos.", ["Linfócitos B produzem anticorpos", "Linfócitos T ajudam a coordenar a defesa"], ["O hemograma conta os glóbulos brancos"]);
    V("anticorpos", "Anticorpos", "#facc15", "Proteínas em forma de Y que se prendem ao antígeno e o neutralizam.", "Cada anticorpo reconhece um antígeno específico.", ["Marcam o invasor para ser destruído", "Passam da mãe para o bebê pelo leite materno"], ["Soros têm anticorpos prontos (ex.: soro antiofídico)"]);
    V("memoria", "Células de memória", "#5eead4", "Guardam a \"lembrança\" do antígeno por anos.", "Se o agente verdadeiro aparecer, a resposta é rápida e forte.", ["Por isso muitas vacinas protegem por muitos anos", "É a base da imunidade adquirida"], ["Doses de reforço renovam a memória"]);
    // os quatro temas passam a usar o próprio modelo (o simulador externo continua como botão)
    D.trilha.forEach(t => t.itens.forEach(h => {
      if (h.cod === "8-AE1") h.r = { modelo: "endocrino", ext: "corpo" };
      if (h.cod === "8-AE5") h.r = { modelo: "digestorio", ext: "corpo" };
      if (h.cod === "7-AE3") h.r = { modelo: "maquinas", ext: "fisica" };
      if (h.cod === "7-AE11") h.r = { modelo: "vacina", ext: "microvida" };
    }));
    D.modelos.push({ id: "estados", em: "🧊", nome: "Estados físicos da matéria", sub: "Sólido, líquido, gasoso e mudanças de estado", aula: "9º ano · AE3", intro: "Mesma substância, três jeitos de as <b>partículas</b> se organizarem. Quanto mais <b>energia (calor)</b>, mais elas se agitam e se afastam. As setas vermelhas recebem calor; as azuis perdem calor." });
    const S = fi("estados", ["9-AE3"], "9º ano");
    S("solido", "Sólido", "#3b82f6", "Partículas bem juntas e organizadas, só vibrando no lugar.", "Forma e volume definidos.", ["Forças de atração fortes entre as partículas", "Ex.: gelo, ferro, sal"], ["Gelo conserva alimentos", "Metais derretidos e moldados na indústria (fundição)"]);
    S("liquido", "Líquido", "#0ea5e9", "Partículas próximas, mas que deslizam umas sobre as outras.", "Volume definido; forma do recipiente.", ["Ex.: água, óleo, álcool", "Escoa e se espalha"], ["Medidas de remédio em mL", "Tratamento e distribuição de água"]);
    S("gasoso", "Gasoso", "#a855f7", "Partículas afastadas e muito agitadas, ocupando todo o espaço.", "Sem forma e sem volume próprios.", ["Pode ser comprimido", "Ex.: vapor de água, ar, gás de cozinha"], ["Botijão guarda gás comprimido (liquefeito)", "Pneus e balões cheios de ar"]);
    S("mudancas", "Mudanças de estado", "#ef4444", "Fusão, vaporização (setas vermelhas: recebem calor); solidificação e condensação (azuis: perdem calor).", "Sublimação: sólido direto para gasoso (gelo-seco, naftalina).", ["Água: funde a 0 °C e ferve a 100 °C ao nível do mar", "Durante a mudança de estado, a temperatura fica constante"], ["Panela de pressão: a água ferve acima de 100 °C e cozinha mais rápido", "Destilação, secagem de roupas, fabricação de gelo"]);
    D.trilha.forEach(t => t.itens.forEach(h => { if (h.cod === "9-AE3") h.r = { modelo: "estados" }; }));
    ["8-AE1", "8-AE5", "7-AE3", "7-AE11", "9-AE3"].forEach(c => delete D.especTema[c]);
  })();

})();
