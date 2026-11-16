/* =========================================================================
   MISSÃO SARESP 3D — Especificidades de cada estrutura
   carac = características (números e fatos principais)
   acoes = o que o ser humano faz / usa / desenvolve ali
   Também cria o modelo "Camadas da atmosfera".
   ========================================================================= */
(function () {
  const D = window.DADOS, F = D.fichas;
  const add = (id, carac, acoes) => { if (F[id]) { F[id].carac = carac; if (acoes) F[id].acoes = acoes; } };

  /* ---------------- CAMADAS DA ATMOSFERA (modelo novo) ---------------- */
  D.modelos.splice(2, 0, { id: "atmosfera", em: "🌤️", nome: "Camadas da atmosfera", sub: "Troposfera, estratosfera, ozônio, mesosfera, termosfera e exosfera", aula: "6º, 7º e 8º anos",
    intro: "A atmosfera é dividida em <b>camadas</b> pela forma como a <b>temperatura</b> muda com a altitude. Toque em cada camada para ver suas <b>características</b> e o que o <b>ser humano faz</b> nela. As espessuras foram aumentadas para caber na tela: na realidade, a troposfera tem só cerca de 12 km." });
  const A = { modelo: "atmosfera", hab: ["7-AE2", "6-AE1", "8-AE9"], aula: "6º, 7º e 8º anos" };
  Object.assign(F, {
    troposfera: Object.assign({}, A, { nome: "Troposfera", cor: "#7dd3fc",
      funcao: "Camada onde vivemos e respiramos. É nela que acontecem as chuvas, os ventos, as nuvens e quase todos os fenômenos do tempo.",
      desc: "Vai do solo até cerca de 12 km (7 km nos polos e 17 km no equador). Quanto mais alto, mais frio: a temperatura cai cerca de 6,5 °C a cada quilômetro.",
      curiosidade: "Cerca de 75% de toda a massa de ar da atmosfera está na troposfera.",
      carac: ["Altitude: 0 a ~12 km", "Temperatura: de ~15 °C (média no solo) até ~ −55 °C no topo", "Tem quase todo o vapor de água: nuvens, chuva, neve, granizo e raios", "Ar mais denso: concentra ~75% da massa da atmosfera", "Gases: 78% nitrogênio, 21% oxigênio, 1% outros (argônio, CO₂…)"],
      acoes: ["Respiramos, plantamos e vivemos nela", "Aviões comerciais voam no alto dela (~10 a 12 km)", "Balões e estações meteorológicas medem o tempo", "Poluição de carros, fábricas e queimadas fica concentrada aqui", "Usinas eólicas aproveitam os ventos"] }),
    estratosfera: Object.assign({}, A, { nome: "Estratosfera", cor: "#60a5fa",
      funcao: "Camada estável, quase sem nuvens e sem chuva, que abriga a camada de ozônio.",
      desc: "Fica entre ~12 e 50 km. Aqui a temperatura AUMENTA com a altitude, porque o ozônio absorve a radiação ultravioleta do Sol e esquenta o ar.",
      curiosidade: "Aviões a jato preferem voar perto da base da estratosfera porque lá há menos turbulência.",
      carac: ["Altitude: ~12 a 50 km", "Temperatura: sobe de ~ −55 °C até ~0 °C no topo", "Ar seco e estável, com poucas nuvens", "Contém a camada de ozônio (~20 a 35 km)", "Ventos horizontais fortes (correntes de jato na base)"],
      acoes: ["Rotas de aviões a jato na parte de baixo", "Balões meteorológicos e científicos sobem até ~35 km", "Gases CFC (antigos aerossóis e geladeiras) destruíram parte do ozônio", "Protocolo de Montreal (1987) proibiu os CFC e o ozônio está se recuperando"] }),
    ozonio: Object.assign({}, A, { nome: "Camada de ozônio", cor: "#f59e0b",
      funcao: "Filtro natural que absorve a maior parte da radiação ultravioleta (UV) do Sol, protegendo os seres vivos.",
      desc: "Faixa da estratosfera, entre ~20 e 35 km, com maior concentração de gás ozônio (O₃).",
      curiosidade: "Se todo o ozônio fosse trazido para o nível do mar, formaria uma camada de apenas 3 milímetros!",
      carac: ["Altitude: ~20 a 35 km (dentro da estratosfera)", "Gás ozônio: O₃ (três átomos de oxigênio)", "Bloqueia a maior parte do UV-B e quase todo o UV-C", "Aquece a estratosfera ao absorver o UV"],
      acoes: ["Os gases CFC abriram o \"buraco\" na camada sobre a Antártida", "O Protocolo de Montreal (1987) proibiu os CFC", "Satélites medem a espessura da camada todos os dias", "Protetor solar e chapéu nos protegem do UV que passa"] }),
    mesosfera: Object.assign({}, A, { nome: "Mesosfera", cor: "#818cf8",
      funcao: "Camada onde a maioria dos meteoros queima ao entrar na atmosfera, protegendo a superfície.",
      desc: "Fica entre ~50 e 85 km. A temperatura volta a cair e chega à mais fria de toda a atmosfera, perto de −90 °C.",
      curiosidade: "As \"estrelas cadentes\" são pequenos meteoros que se queimam na mesosfera por causa do atrito com o ar.",
      carac: ["Altitude: ~50 a 85 km", "Temperatura: cai até ~ −90 °C (a mais fria da atmosfera)", "Ar muito rarefeito", "Meteoros queimam aqui (estrelas cadentes)", "Nuvens noctilucentes, brilhantes, podem aparecer no verão polar"],
      acoes: ["É difícil de estudar: alta demais para balões e baixa demais para satélites", "Foguetes de sondagem atravessam a camada para fazer medições", "Naves que voltam do espaço começam a esquentar aqui (reentrada)"] }),
    termosfera: Object.assign({}, A, { nome: "Termosfera", cor: "#a855f7",
      funcao: "Camada que absorve raios X e ultravioleta muito fortes do Sol; é onde aparecem as auroras e onde orbita a Estação Espacial Internacional.",
      desc: "Fica entre ~85 e 600 km. O ar é tão rarefeito que, apesar de as partículas chegarem a mais de 1000 °C, não sentiríamos calor. Inclui a ionosfera.",
      curiosidade: "A Estação Espacial Internacional (ISS) orbita a cerca de 400 km de altitude e dá uma volta na Terra a cada 90 minutos.",
      carac: ["Altitude: ~85 a 600 km", "Temperatura: sobe muito, podendo passar de 1000 °C", "Ar extremamente rarefeito", "Ionosfera: gases eletricamente carregados", "Auroras polares (boreal e austral)"],
      acoes: ["Estação Espacial Internacional (~400 km)", "Satélites de órbita baixa (observação da Terra, internet)", "A ionosfera reflete ondas de rádio AM e de radioamador", "Turismo espacial suborbital chega ao início desta camada"] }),
    exosfera: Object.assign({}, A, { nome: "Exosfera", cor: "#4338ca",
      funcao: "Camada mais externa: faz a transição entre a atmosfera e o espaço.",
      desc: "Começa a ~600 km e vai se perdendo no espaço até ~10 000 km. Tem principalmente hidrogênio e hélio, que podem escapar para o espaço.",
      curiosidade: "As partículas da exosfera ficam tão afastadas que quase nunca se chocam umas com as outras.",
      carac: ["Altitude: ~600 até ~10 000 km", "Gases muito leves: hidrogênio e hélio", "Partículas podem escapar para o espaço", "Não tem limite superior bem definido"],
      acoes: ["Satélites de GPS, de comunicação e meteorológicos orbitam nela ou acima dela", "Telescópios espaciais", "Lixo espacial: restos de satélites e foguetes, um problema crescente"] }),
    perfil_temp: Object.assign({}, A, { nome: "Curva da temperatura", cor: "#ef4444",
      funcao: "Mostra como a temperatura muda com a altitude. É essa mudança que define onde começa e termina cada camada.",
      desc: "Esfria na troposfera, esquenta na estratosfera (ozônio), esfria na mesosfera e esquenta muito na termosfera.",
      curiosidade: "Os limites entre as camadas se chamam tropopausa, estratopausa e mesopausa.",
      carac: ["Troposfera: esfria com a altura", "Estratosfera: esquenta (o ozônio absorve UV)", "Mesosfera: esfria até ~ −90 °C", "Termosfera: esquenta até mais de 1000 °C"],
      acoes: ["Balões meteorológicos medem a temperatura a cada subida, duas vezes por dia, em várias cidades do mundo", "Esses dados alimentam a previsão do tempo"] })
  });
  // o tema "Atmosfera e qualidade do ar" passa a usar o modelo das camadas
  D.trilha.forEach(t => t.itens.forEach(h => { if (h.cod === "7-AE2") h.r = { modelo: "atmosfera" }; }));

  /* ---------------- CAMADAS DA TERRA ---------------- */
  add("crosta", ["Espessura: 5 a 10 km nos oceanos e 30 a 70 km nos continentes", "Sólida, formada por rochas e solo", "Dividida em placas tectônicas", "Mais fina de todas as camadas"],
    ["Agricultura, cidades e estradas", "Mineração (ferro, ouro, bauxita)", "Extração de petróleo do pré-sal (até ~7 km de profundidade)", "O poço mais fundo já perfurado chegou a ~12 km"]);
  add("manto", ["Espessura: ~2 900 km", "Temperatura: ~1 000 °C a 3 700 °C", "Rochas sólidas que se deformam lentamente; parte fundida forma o magma", "Correntes de convecção movem as placas"],
    ["Energia geotérmica aproveita o calor que vem do interior", "Estudamos o manto pelas ondas dos terremotos (sismógrafos)", "Rochas vulcânicas trazem amostras do manto"]);
  add("nucleo_externo", ["Profundidade: ~2 900 a 5 100 km", "Ferro e níquel no estado líquido", "Temperatura: ~4 000 °C a 5 000 °C", "Seu movimento gera o campo magnético da Terra"],
    ["A bússola funciona por causa do campo magnético gerado aqui", "O campo magnético nos protege do vento solar"]);
  add("nucleo_interno", ["Profundidade: ~5 100 a 6 371 km (centro)", "Ferro e níquel sólidos por causa da enorme pressão", "Temperatura: ~5 400 °C, parecida com a superfície do Sol"],
    ["Ninguém nunca chegou lá: tudo o que sabemos vem das ondas sísmicas"]);
  add("hidrosfera", ["Cobre ~71% da superfície", "~97% da água é salgada (oceanos)", "Só ~2,5% é doce, e a maior parte está congelada"],
    ["Abastecimento de água, irrigação e pesca", "Usinas hidrelétricas", "Transporte por navios", "Poluição por esgoto e plástico"]);
  add("atmosfera", ["Espessura: ~10 000 km até sumir no espaço", "78% nitrogênio, 21% oxigênio, 1% outros gases", "Dividida em 5 camadas pela temperatura"],
    ["Aviões, balões, satélites", "Emissão de gases de efeito estufa e poluentes", "Veja o modelo Camadas da atmosfera para os detalhes"]);

  /* ---------------- SOL, TERRA E LUA ---------------- */
  add("sol", ["Estrela de tamanho médio", "Diâmetro: ~109 vezes o da Terra", "Superfície: ~5 500 °C; núcleo: ~15 milhões de °C", "Distância da Terra: ~150 milhões de km"],
    ["Energia solar (painéis fotovoltaicos e aquecedores)", "Sondas como a Parker Solar Probe estudam o Sol de perto"]);
  add("terra", ["Rotação: ~24 h (dia e noite)", "Translação: ~365 dias (ano)", "Eixo inclinado ~23,5° (estações do ano)", "Único planeta conhecido com vida"]);
  add("lua", ["Distância: ~384 000 km", "Diâmetro: ~1/4 do da Terra", "Volta à Terra em ~27 dias; ciclo das fases em ~29,5 dias", "Sem atmosfera: crateras ficam preservadas"],
    ["Apollo 11 (1969): primeiros humanos na Lua", "Programa Artemis planeja voltar com astronautas", "As marés usadas pela pesca e pela navegação dependem dela"]);

  /* ---------------- SISTEMA SOLAR ---------------- */
  add("mercurio", ["Mais próximo do Sol", "Dia muito quente (~430 °C) e noite muito fria (~ −180 °C)", "Quase sem atmosfera, cheio de crateras", "Ano: 88 dias"], ["Sondas Mariner 10, MESSENGER e BepiColombo"]);
  add("venus", ["Planeta mais quente: ~465 °C", "Atmosfera densa de CO₂: efeito estufa extremo", "Gira ao contrário dos outros planetas", "Brilha muito no céu (\"estrela-d'alva\")"], ["Sondas soviéticas Venera pousaram e resistiram poucos minutos"]);
  add("terra_s", ["3º planeta a partir do Sol", "Água líquida na superfície", "Atmosfera com oxigênio", "Um satélite natural: a Lua"], ["Milhares de satélites artificiais em órbita", "Estação Espacial Internacional"]);
  add("marte", ["\"Planeta vermelho\": solo rico em óxido de ferro", "Atmosfera fina de CO₂; média de ~ −60 °C", "Maior vulcão do Sistema Solar: Monte Olimpo", "Calotas de gelo nos polos"], ["Jipes-robôs Curiosity e Perseverance", "Helicóptero Ingenuity voou em Marte (2021)", "Planos de missões tripuladas"]);
  add("asteroides", ["Entre Marte e Júpiter", "Milhões de corpos rochosos", "Ceres, o maior, é um planeta-anão"], ["Missão DART (2022) desviou um asteroide de propósito, testando a defesa planetária", "Sondas trouxeram amostras de asteroides para a Terra"]);
  add("jupiter", ["Maior planeta: cabem ~1 300 Terras dentro", "Gigante gasoso (hidrogênio e hélio)", "Grande Mancha Vermelha: tempestade maior que a Terra", "Dezenas de luas, como Europa e Ganimedes"], ["Sondas Galileo e Juno", "Missões procuram oceanos sob o gelo da lua Europa"]);
  add("saturno", ["Anéis de gelo e rocha", "Gigante gasoso, menos denso que a água", "Lua Titã tem atmosfera e lagos de metano"], ["Sonda Cassini estudou Saturno por 13 anos", "Sonda Huygens pousou em Titã (2005)"]);
  add("urano", ["Gigante gelado", "Eixo tão inclinado que gira \"deitado\"", "Cor azul-esverdeada por causa do metano"], ["Só a Voyager 2 o visitou (1986)"]);
  add("netuno", ["Planeta mais distante do Sol", "Ventos mais rápidos do Sistema Solar (~2 000 km/h)", "Ano: ~165 anos terrestres"], ["Só a Voyager 2 o visitou (1989)"]);
  add("sol_s", ["Contém ~99,8% da massa do Sistema Solar", "Sua gravidade mantém os planetas em órbita"], ["Telescópios solares e sondas monitoram tempestades solares que afetam satélites e redes elétricas"]);

  /* ---------------- MICRORGANISMOS ---------------- */
  add("bacteria", ["Unicelular e procarionte (sem núcleo)", "Tamanho: ~1 a 5 micrômetros", "Pode ter flagelo, cápsula e plasmídeos"], ["Iogurte, queijos e vinagre", "Tratamento de esgoto", "Produção de insulina e de antibióticos", "Antibióticos tratam doenças bacterianas"]);
  add("virus", ["Não é formado por células", "Só se reproduz dentro de uma célula hospedeira", "Material genético protegido por uma cápsula de proteína"], ["Vacinas previnem doenças virais", "Higiene e máscaras reduzem a transmissão"]);
  add("fungo", ["Eucarionte, uni ou pluricelular", "Corpo formado por hifas", "Decompositor: se alimenta de matéria orgânica"], ["Fermento de pão e de bebidas", "Penicilina (primeiro antibiótico)", "Cogumelos comestíveis", "Cuidado com micoses e alimentos mofados"]);
  add("protozoario", ["Eucarionte unicelular", "Vive na água ou dentro de outros seres", "Pode se mover por cílios, flagelos ou pseudópodes"], ["Saneamento básico evita doenças como a giardíase e a amebíase", "Combate ao mosquito previne a malária"]);

  /* ---------------- NEURÔNIO ---------------- */
  add("dendritos", ["Ramificações curtas e numerosas", "Recebem sinais de outros neurônios"]);
  add("axonio", ["Prolongamento longo (pode passar de 1 metro)", "Conduz o impulso para longe do corpo celular"]);
  add("mielina", ["Camada isolante de gordura", "Faz o impulso viajar até ~120 m/s"], ["Doenças que atacam a mielina, como a esclerose múltipla, são estudadas pela medicina"]);
  add("terminal", ["Liberam neurotransmissores na sinapse", "Passam o sinal para outro neurônio, músculo ou glândula"], ["Álcool e outras drogas alteram as sinapses", "Muitos remédios agem nos neurotransmissores"]);

  /* ---------------- CIRCUITO ---------------- */
  add("pilha", ["Transforma energia química em elétrica", "Tem polo positivo (+) e negativo (−)", "Pilha comum: 1,5 V"], ["Pilhas e baterias usadas devem ir para pontos de coleta, não para o lixo comum"]);
  add("fio", ["Condutor de cobre", "Coberto por plástico isolante"], ["Fios desencapados causam choques e incêndios"]);
  add("interruptor", ["Abre ou fecha o circuito", "Aberto: a corrente para; fechado: a corrente passa"]);
  add("lampada", ["Transforma energia elétrica em luz (e calor)", "LED gasta muito menos que a incandescente"], ["Trocar lâmpadas por LED reduz a conta de luz"]);

  /* ---------------- ÁTOMO ---------------- */
  add("protons", ["Carga positiva", "Ficam no núcleo", "O número de prótons define o elemento"]);
  add("neutrons", ["Sem carga elétrica", "Ficam no núcleo, junto com os prótons"], ["Usinas nucleares usam a quebra de núcleos (fissão)"]);
  add("eletrons", ["Carga negativa", "Massa ~1 836 vezes menor que a do próton", "Ficam na eletrosfera"], ["A corrente elétrica é o movimento organizado de elétrons"]);
})();
