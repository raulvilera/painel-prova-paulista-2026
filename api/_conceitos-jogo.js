/* Conceitos do SARESP para a rodada "Imagem e definição" da Trilha SARESP.
   Cada conceito: série, tema (trecho da descrição no catálogo, para ligar ao tema e ao peso da turma), nome, emoji (reserva se a foto
   não carregar), definição curta para o 6º ao 9º ano e artigos da Wikipédia de onde vem a foto (licença livre, com crédito). */
const L = [];
const c = (serie, tema, nome, emoji, def, ...wiki) => L.push({ serie, tema, nome, emoji, def, wiki });

/* ---------------- 6º ano ---------------- */
c('6', 'rotação terrestre', 'Rotação da Terra', '🌍', 'Movimento da Terra girando em torno do próprio eixo; uma volta leva cerca de 24 horas e causa o dia e a noite.', "en:Earth's rotation", 'en:Day');
c('6', 'efeitos da gravidade', 'Gravidade', '🍎', 'Força de atração entre corpos com massa: mantém os planetas em órbita do Sol e faz os objetos caírem em direção ao chão.', 'en:Free fall', 'en:Gravity');
c('6', 'fases da Lua', 'Fases da Lua', '🌓', 'Diferentes aparências da parte iluminada da Lua vista da Terra, que se repetem a cada 29,5 dias, aproximadamente.', 'en:Lunar phase');
c('6', 'fases da Lua', 'Eclipse solar', '🌑', 'Acontece quando a Lua passa entre o Sol e a Terra e a sombra dela encobre o Sol para quem está em uma região da Terra.', 'en:Solar eclipse');
c('6', 'estações do ano', 'Translação', '🔄', 'Movimento da Terra ao redor do Sol, que leva cerca de 365 dias; junto com a inclinação do eixo, origina as estações do ano.', "en:Earth's orbit", 'en:Season');
c('6', 'corpos celestes', 'Planeta', '🪐', 'Corpo celeste que gira ao redor de uma estrela, tem forma quase esférica e não produz luz própria.', 'en:Jupiter', 'en:Planet');
c('6', 'tipos de rochas', 'Rocha sedimentar', '🪨', 'Rocha formada pelo acúmulo e compactação de camadas de sedimentos, como areia e restos de seres vivos, ao longo de muito tempo.', 'en:Sedimentary rock', 'en:Sandstone');
c('6', 'tipos de rochas', 'Rocha magmática', '🌋', 'Rocha formada pelo resfriamento e endurecimento do magma ou da lava, como o granito e o basalto.', 'en:Granite', 'en:Igneous rock');
c('6', 'fossilização', 'Fóssil', '🐚', 'Resto ou vestígio de um ser vivo de muito tempo atrás, preservado nas rochas.', 'en:Ammonoidea', 'en:Fossil');
c('6', 'teoria celular', 'Célula', '🔬', 'Menor unidade que forma os seres vivos e realiza as funções vitais; todo ser vivo é formado por uma ou mais células.', 'en:Cell (biology)');
c('6', 'microscópio', 'Microscópio', '🔬', 'Instrumento com lentes que amplia a imagem de objetos muito pequenos e permitiu observar as células.', 'en:Optical microscope', 'en:Microscope');
c('6', 'componentes celulares', 'Núcleo celular', '🟣', 'Estrutura das células eucariontes, envolvida por membrana, que guarda o material genético e controla as atividades da célula.', 'en:Cell nucleus');
c('6', 'bactérias, fungos', 'Bactéria', '🦠', 'Ser vivo de uma só célula, sem núcleo organizado (procarionte); algumas causam doenças e muitas são úteis, como as decompositoras.', 'en:Escherichia coli', 'en:Bacteria');
c('6', 'bactérias, fungos', 'Fungo', '🍄', 'Ser vivo que não faz fotossíntese e se alimenta absorvendo nutrientes do ambiente; inclui cogumelos, bolores e leveduras.', 'en:Mushroom', 'en:Fungus');
c('6', 'estados físicos da matéria', 'Fusão', '🧊', 'Passagem do estado sólido para o líquido quando o material recebe calor, como o gelo derretendo.', 'en:Melting', 'en:Ice');
c('6', 'qualidade e à saúde do solo', 'Erosão', '🏜️', 'Desgaste e transporte do solo pela água da chuva, pelo vento ou pela ação humana; aumenta quando a vegetação é retirada.', 'en:Soil erosion', 'en:Erosion');
c('6', 'estrutura geral do neurônio', 'Neurônio', '🧠', 'Célula do sistema nervoso que recebe e transmite os impulsos nervosos.', 'en:Neuron');
c('6', 'estrutura do olho', 'Pupila', '👁️', 'Abertura no centro da íris por onde a luz entra no olho; fica menor com muita luz e maior com pouca luz.', 'en:Pupil', 'en:Human eye');
c('6', 'papel dos ossos', 'Esqueleto', '🦴', 'Conjunto de ossos que sustenta e protege o corpo, guarda cálcio e, junto com os músculos, permite os movimentos.', 'en:Human skeleton');

/* ---------------- 7º ano ---------------- */
c('7', 'máquinas simples', 'Alavanca', '⚖️', 'Máquina simples formada por uma barra rígida que gira em torno de um ponto de apoio e facilita levantar ou mover objetos.', 'en:Seesaw', 'en:Lever');
c('7', 'máquinas simples', 'Plano inclinado', '📐', 'Máquina simples em forma de rampa: diminui a força necessária para elevar um objeto, aumentando a distância percorrida.', 'en:Wheelchair ramp', 'en:Inclined plane');
c('7', 'efeito estufa', 'Efeito estufa', '🌡️', 'Fenômeno natural em que gases da atmosfera retêm parte do calor e mantêm a Terra aquecida; é intensificado pela queima de combustíveis fósseis.', 'en:Greenhouse effect', 'en:Greenhouse');
c('7', 'placas tectônicas', 'Placas tectônicas', '🧩', 'Grandes blocos rochosos que formam a camada externa da Terra e se movem lentamente sobre o manto.', 'en:Plate tectonics');
c('7', 'vulcanismo', 'Vulcão', '🌋', 'Abertura na crosta terrestre por onde saem lava, gases e cinzas vindos do interior da Terra.', 'en:Volcano');
c('7', 'vulcanismo', 'Tsunami', '🌊', 'Sequência de ondas enormes provocada por terremotos ou erupções no fundo do mar.', 'en:Tsunami');
c('7', 'qualidade do ar', 'Poluição do ar', '🏭', 'Excesso de gases e partículas no ar, como os liberados por fábricas e veículos, que faz mal à saúde e ao ambiente.', 'en:Smog', 'en:Air pollution');
c('7', 'invertebrados e vertebrados', 'Vertebrados', '🐟', 'Animais com coluna vertebral e crânio: peixes, anfíbios, répteis, aves e mamíferos.', 'en:Vertebrate');
c('7', 'invertebrados e vertebrados', 'Invertebrados', '🐞', 'Animais sem coluna vertebral, como insetos, aranhas, minhocas e caramujos; são a maioria das espécies animais.', 'en:Insect', 'en:Invertebrate');
c('7', 'ecossistemas aquáticos', 'Manguezal', '🌿', 'Ecossistema entre o rio e o mar, com água salobra, que serve de berçário para muitos peixes e crustáceos.', 'en:Mangrove');
c('7', 'biomas brasileiros', 'Bioma', '🌳', 'Grande conjunto de ecossistemas com clima, vegetação e animais parecidos, como a Amazônia, o Cerrado e a Caatinga.', 'en:Cerrado', 'en:Amazon rainforest');
c('7', 'Unidades de Conservação', 'Unidade de Conservação', '🏞️', 'Área protegida por lei para preservar a natureza; pode ser de proteção integral ou de uso sustentável.', 'en:Iguazu National Park', 'en:National park');
c('7', 'replicação dos vírus', 'Vírus', '🦠', 'Estrutura sem célula, formada por material genético e proteínas, que só se multiplica dentro de células de outros seres vivos.', 'en:Virus');
c('7', 'Reconhecer a vacinação como ação', 'Vacina', '💉', 'Preparado que estimula o sistema imune a produzir defesas contra um agente causador de doença, sem provocar a doença.', 'en:Vaccination', 'en:Vaccine');
c('7', 'características do saneamento básico', 'Saneamento básico', '🚰', 'Serviços de água tratada, coleta e tratamento de esgoto, coleta de lixo e drenagem da chuva, que previnem doenças.', 'en:Sewage treatment', 'en:Sanitation');
c('7', 'pandemia, epidemia', 'Pandemia', '🌐', 'Doença infecciosa que se espalha ao mesmo tempo por vários países e continentes.', 'en:Pandemic');

/* ---------------- 8º ano ---------------- */
c('8', 'órgãos do sistema respiratório', 'Pulmões', '🫁', 'Órgãos onde acontecem as trocas gasosas: o oxigênio passa para o sangue e o gás carbônico sai dele.', 'en:Lung');
c('8', 'órgãos do sistema digestório', 'Estômago', '🍽️', 'Órgão do sistema digestório que mistura o alimento com o suco gástrico, ácido, e inicia a digestão das proteínas.', 'en:Stomach');
c('8', 'órgãos do sistema digestório', 'Intestino delgado', '🌀', 'Parte mais longa do tubo digestório, onde termina a digestão e a maioria dos nutrientes passa para o sangue.', 'en:Small intestine');
c('8', 'reprodutivos das plantas', 'Polinização', '🐝', 'Transporte do pólen da parte masculina para a parte feminina da flor, feito pelo vento, pela água ou por animais como as abelhas.', 'en:Pollination');
c('8', 'assexuada e sexuada', 'Reprodução assexuada', '🌱', 'Um único indivíduo origina descendentes geneticamente iguais a ele, como no brotamento e na muda de plantas.', 'en:Budding', 'en:Asexual reproduction');
c('8', 'eclipses solar e lunar', 'Eclipse lunar', '🌕', 'Acontece quando a Terra fica entre o Sol e a Lua e a sombra da Terra cobre a Lua, que pode ficar avermelhada.', 'en:Lunar eclipse');
c('8', 'movimentos da Lua', 'Marés', '🌊', 'Subida e descida periódica do nível do mar, causada principalmente pela atração gravitacional da Lua.', 'en:Tide');
c('8', 'inclinação do eixo de rotação', 'Inclinação do eixo', '🌐', 'O eixo da Terra é inclinado cerca de 23,5°; por isso cada hemisfério recebe mais ou menos luz do Sol ao longo do ano.', 'en:Axial tilt');
c('8', 'variáveis meteorológicas', 'Pluviômetro', '🌧️', 'Instrumento que mede a quantidade de chuva que cai em um local, em milímetros.', 'en:Rain gauge');
c('8', 'variáveis meteorológicas', 'Anemômetro', '🌬️', 'Instrumento que mede a velocidade do vento.', 'en:Anemometer');
c('8', 'efeitos do aquecimento global', 'Aquecimento global', '🔥', 'Aumento da temperatura média do planeta, ligado principalmente à maior emissão de gases de efeito estufa pelas atividades humanas.', 'en:Retreat of glaciers since 1850', 'en:Global warming');
c('8', 'renováveis e não renováveis', 'Combustível fóssil', '🛢️', 'Fonte de energia não renovável formada há milhões de anos a partir de restos de seres vivos: petróleo, carvão mineral e gás natural.', 'en:Coal', 'en:Fossil fuel');
c('8', 'importância das energias renováveis', 'Energia eólica', '💨', 'Energia elétrica gerada pelo vento, que gira as pás dos aerogeradores; é uma fonte renovável.', 'en:Wind turbine', 'en:Wind power');
c('8', 'matriz energética', 'Usina hidrelétrica', '🏗️', 'Transforma a energia do movimento da água represada em energia elétrica; usa fonte renovável, mas alaga grandes áreas.', 'en:Itaipu Dam', 'en:Hydroelectricity');
c('8', 'condutores e isolantes', 'Condutor elétrico', '🔌', 'Material que deixa a corrente elétrica passar com facilidade, como o cobre dos fios.', 'en:Copper', 'en:Electrical conductor');
c('8', 'condutores e isolantes', 'Isolante elétrico', '🧤', 'Material que dificulta a passagem da corrente elétrica, como a borracha e o plástico que encapam os fios.', 'en:Insulator (electricity)');
c('8', 'principais componentes de um circuito', 'Circuito elétrico', '💡', 'Caminho fechado por onde passa a corrente elétrica, com fonte de energia, fios, interruptor e aparelhos.', 'en:Electronic circuit', 'en:Electrical network');

/* ---------------- 9º ano ---------------- */
c('9', 'substâncias, misturas', 'Mistura heterogênea', '🫗', 'Mistura em que dá para ver mais de uma fase, como água e óleo.', 'en:Emulsion', 'en:Mixture');
c('9', 'modelos atômicos', 'Modelo de Rutherford-Bohr', '⚛️', 'Modelo em que o átomo tem um núcleo pequeno, com prótons e nêutrons, e os elétrons se movem em camadas ao redor.', 'en:Bohr model');
c('9', 'ondas mecânicas e eletromagnéticas', 'Onda eletromagnética', '📡', 'Onda que se propaga até no vácuo, como a luz, as ondas de rádio e os raios X.', 'en:Electromagnetic spectrum');
c('9', 'ondas mecânicas e eletromagnéticas', 'Onda mecânica', '🔊', 'Onda que precisa de um meio material, como ar, água ou sólido, para se propagar; o som é um exemplo.', 'en:Loudspeaker', 'en:Sound');
c('9', 'estrutura do DNA', 'DNA', '🧬', 'Molécula em forma de dupla hélice que guarda as informações genéticas e é passada dos pais para os filhos.', 'en:DNA');
c('9', 'mitose e da meiose', 'Mitose', '🔁', 'Divisão celular que forma duas células iguais à original; acontece no crescimento e na regeneração dos tecidos.', 'en:Mitosis');
c('9', 'hereditariedade', 'Alelo dominante', '🫛', 'Versão de um gene que se manifesta mesmo quando o indivíduo recebe só uma cópia dela, como nas ervilhas estudadas por Mendel.', 'en:Gregor Mendel', 'en:Pea');
c('9', 'evolução biológica', 'Seleção natural', '🐦', 'Indivíduos com características mais favoráveis ao ambiente sobrevivem e se reproduzem mais, e passam essas características adiante.', "en:Darwin's finches", 'en:Natural selection');
c('9', 'especiação', 'Especiação', '🐿️', 'Formação de novas espécies quando populações isoladas acumulam diferenças até não conseguirem mais se reproduzir entre si.', 'en:Speciation');
c('9', 'tratamento de água e esgoto', 'Tratamento de água', '🚰', 'Etapas como floculação, decantação, filtração e cloração que tornam a água do rio própria para beber.', 'en:Water treatment', 'en:Water purification');
c('9', 'resíduos sólidos', 'Reciclagem', '♻️', 'Transformação de materiais descartados, como papel, plástico e metal, em matéria-prima para novos produtos.', 'en:Recycling');
c('9', 'resíduos sólidos', 'Aterro sanitário', '🚛', 'Local com o solo impermeabilizado e tratamento do chorume, onde o lixo é depositado e coberto com camadas de terra.', 'en:Landfill');
c('9', 'radiações ionizantes', 'Radiografia (raios X)', '☢️', 'Exame de imagem feito com radiação ionizante; em excesso essa radiação danifica as células, por isso exige proteção.', 'en:Radiography', 'en:X-ray');
c('9', 'geocentrismo ao heliocentrismo', 'Heliocentrismo', '☀️', 'Modelo em que o Sol está no centro e a Terra e os outros planetas giram ao redor dele, defendido por Copérnico e Galileu.', 'en:Heliocentrism', 'en:Nicolaus Copernicus');
c('9', 'ciclo de vida de uma estrela', 'Nebulosa', '🌌', 'Nuvem de gás e poeira no espaço onde as estrelas se formam.', 'en:Orion Nebula', 'en:Nebula');
c('9', 'constelações como convenções', 'Constelação', '✨', 'Grupo de estrelas que, visto da Terra, forma uma figura imaginada por um povo, como o Cruzeiro do Sul.', 'en:Crux', 'en:Constellation');
c('9', 'planetas rochosos', 'Planeta rochoso', '🔴', 'Planeta formado principalmente por rochas e metais, com superfície sólida: Mercúrio, Vênus, Terra e Marte.', 'en:Mars', 'en:Terrestrial planet');
c('9', 'exploração espacial', 'Satélite artificial', '🛰️', 'Equipamento lançado pelo ser humano para girar ao redor da Terra; é usado em comunicação, previsão do tempo e GPS.', 'en:Satellite');

L.forEach((x, i) => { x.id = x.serie + '-' + i; });
module.exports = L;
