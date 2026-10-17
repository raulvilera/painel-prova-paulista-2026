/* Fotos por TEMA: toda questão do banco pertence a um tema (a habilidade que ela avalia); cada tema tem até 4 artigos da Wikipédia
   escolhidos à mão, em ordem. A foto da questão é uma delas, sem repetir dentro da mesma atividade, para a imagem sempre combinar com o conteúdo estudado. */
const T = [];
const t = (re, ...specs) => T.push({ re: new RegExp(re), specs });
// --- Terra e Universo
t('lanterna e a laranja|gira, roda|rotacao terrestre', 'en:Earth\'s rotation|en:Day', 'en:Sunrise|en:Sunset', 'en:Night|en:Terminator (solar)', 'en:Earth|en:Globe');
t('quem puxa tudo|gravidade', 'en:Free fall|en:Gravity', 'en:Isaac Newton', 'en:Orbit|en:Gravity', 'en:Galileo Galilei');
t('quem fica no meio|eclips', 'en:Solar eclipse', 'en:Lunar eclipse', 'en:Total solar eclipse|en:Eclipse', 'en:Annular solar eclipse|en:Eclipse');
t('lua no palito|lua que nao vira|fases da lua|movimentos da lua', 'en:Lunar phase', 'en:Moon', 'en:Tide|en:Moon', 'en:Full moon|en:Moon');
t('terra inclinada|globo inclinado|estacoes', 'en:Season|en:Axial tilt', 'en:Solstice', 'en:Equinox', 'en:Axial tilt');
t('linha do tempo no barbante|formacao e transformacao da terra', 'en:History of Earth|en:Geological time scale', 'en:Formation and evolution of the Solar System', 'en:Age of Earth', 'en:Hadean');
t('geocentric|heliocentric', 'en:Geocentric model', 'en:Heliocentrism', 'en:Nicolaus Copernicus', 'en:Galileo Galilei');
t('planetas rochosos', 'en:Terrestrial planet|en:Mars', 'en:Gas giant|en:Jupiter', 'en:Mercury (planet)', 'en:Venus');
t('ciclo de vida das estrelas', 'en:Stellar evolution|en:Star', 'en:Nebula', 'en:Supernova', 'en:Red giant');
t('observacao do ceu|planetario|constelac', 'en:Constellation', 'en:Southern Cross', 'en:Milky Way', 'en:Telescope');
t('vida fora', 'en:Extraterrestrial life|en:Mars', 'en:Exoplanet', 'en:International Space Station', 'en:Astrobiology');
t('exploracao espacial', 'en:Space exploration|en:Apollo 11', 'en:International Space Station', 'en:Hubble Space Telescope', 'en:Space Shuttle');
t('detetives do ceu|corpos celestes|origem do sistema solar|sistema solar', 'en:Solar System', 'en:Comet', 'en:Asteroid belt|en:Asteroid', 'en:Planet');
t('rochas', 'en:Rock (geology)|en:Granite', 'en:Sedimentary rock', 'en:Igneous rock|en:Basalt', 'en:Metamorphic rock|en:Marble');
t('fossil|camadas do tempo', 'en:Fossil|en:Trilobite', 'en:Fossilization|en:Fossil', 'en:Ammonoidea|en:Ammonite', 'en:Archaeopteryx');
t('terra no pote|esferas', 'en:Geosphere|en:Earth', 'en:Atmosphere of Earth', 'en:Hydrosphere', 'en:Biosphere');
t('gelo que viaja|estados fisicos', 'en:State of matter', 'en:Ice', 'en:Steam|en:Water vapor', 'en:Phase transition|en:Melting');
t('erosao|solo', 'en:Soil erosion', 'en:Soil|en:Soil horizon', 'en:Deforestation', 'en:Soil conservation');
t('wegener|placas tectonicas', 'en:Plate tectonics', 'en:Continental drift', 'en:Alfred Wegener', 'en:Pangaea');
t('terremoto na bandeja|vulcan|geologic', 'en:Volcano|en:Mount Etna', 'en:Earthquake', 'en:Tsunami', 'en:Seismometer');
t('ar em 100|composicao da atmosfera', 'en:Atmosphere of Earth', 'en:Ozone layer', 'en:Air pollution', 'en:Nitrogen');
t('pega-poeira|qualidade do ar|filtro do ar|poluicao atmosferica', 'en:Air pollution', 'en:Smog', 'en:Particulates', 'en:Respiratory system');
t('estufa|aquecimento global|corrente de causas|mudancas climaticas', 'en:Greenhouse effect', 'en:Global warming', 'en:Climate change', 'en:Carbon dioxide');
t('miniestacao|previsao do tempo', 'en:Weather station', 'en:Weather forecasting', 'en:Barometer', 'en:Anemometer');
t('correntes no copo|circulacao', 'en:Ocean current', 'en:Atmospheric circulation', 'en:Gulf Stream', 'en:Trade winds');
// --- Vida
t('celula no saquinho|teoria celular|componentes celulares', 'en:Cell (biology)', 'en:Cell membrane', 'en:Cell nucleus', 'en:Cytoplasm');
t('envoltorio|procariont', 'en:Prokaryote', 'en:Eukaryote', 'en:Bacteria', 'en:Cell nucleus');
t('lupa de gota|microscopio', 'en:Optical microscope', 'en:Robert Hooke', 'en:Antonie van Leeuwenhoek', 'en:Microscope');
t('duas celulas|organelas', 'en:Plant cell', 'en:Animal cell|en:Cell (biology)', 'en:Mitochondrion', 'en:Chloroplast');
t('mesa dos microrganismos|microrganismo|balao do fermento', 'en:Microorganism', 'en:Fungus', 'en:Yeast', 'en:Protozoa');
t('zoom no corpo|niveis de organizacao|organizacao dos orgaos', 'en:Organ system|en:Organ (biology)', 'en:Tissue (biology)', 'en:Human body', 'en:Cell (biology)');
t('alavanca|maquinas simples', 'en:Lever', 'en:Simple machine', 'en:Pulley', 'en:Inclined plane');
t('aquario de papel|ecossistemas aquaticos', 'en:Aquatic ecosystem', 'en:Coral reef', 'en:Plankton', 'en:Freshwater ecosystem');
t('tripe|sustentabilidade', 'en:Sustainability', 'en:Sustainable development', 'en:Renewable energy', 'en:Recycling');
t('chave dos bichos|invertebrados', 'en:Vertebrate', 'en:Invertebrate', 'en:Mammal', 'en:Arthropod');
t('mapa das ameacas|biomas', 'en:Biome', 'en:Amazon rainforest', 'en:Cerrado', 'en:Caatinga');
t('parque ou reserva|unidades de conservacao', 'en:Protected area', 'en:National park', 'en:Iguazu National Park', 'en:Biodiversity');
t('pulmao de garrafa|respiratorio', 'en:Respiratory system', 'en:Lung', 'en:Thoracic diaphragm', 'en:Pulmonary alveolus');
t('viagem do lanche|digestorio', 'en:Human digestive system', 'en:Stomach', 'en:Small intestine', 'en:Digestion');
t('ists|mito ou verdade', 'en:Sexually transmitted infection', 'en:HIV/AIDS', 'en:Condom', 'en:Human papillomavirus');
t('flor por dentro|reproducao das plantas', 'en:Flower', 'en:Pollination', 'en:Plant reproduction', 'en:Seed');
t('prato com funcao|nutrientes', 'en:Nutrient', 'en:Healthy diet', 'en:Food pyramid', 'en:Vitamin');
t('copias ou misturas|assexuada', 'en:Asexual reproduction', 'en:Sexual reproduction', 'en:Mitosis', 'en:Meiosis');
t('metodos contraceptivos|quadro dos metodos', 'en:Birth control', 'en:Condom', 'en:Intrauterine device', 'en:Combined oral contraceptive pill');
t('jogo dos bicos|evolucao biologica', 'en:Darwin\'s finches', 'en:Natural selection', 'en:Charles Darwin', 'en:Evolution');
t('parecidos, mas nem tanto|convergente', 'en:Convergent evolution', 'en:Divergent evolution', 'en:Homology (biology)', 'en:Analogy');
t('rio que separou|especiacao', 'en:Speciation', 'en:Allopatric speciation', 'en:Reproductive isolation', 'en:Darwin\'s finches');
t('escada do dna|dna', 'en:DNA', 'en:Nucleotide', 'en:Chromosome', 'en:Gene');
t('divide e conquista|mitose', 'en:Mitosis', 'en:Meiosis', 'en:Cell division', 'en:Chromosome');
t('moeda genetica|hereditariedade|mendel', 'en:Gregor Mendel', 'en:Punnett square', 'en:Pea', 'en:Heredity');
t('tribunal da biotecnologia|biotecnologia', 'en:Biotechnology', 'en:Genetic engineering', 'en:Genetically modified organism', 'en:CRISPR');
t('teia em perigo|biodiversidade', 'en:Biodiversity', 'en:Food web', 'en:Extinction', 'en:Deforestation');
// --- Física e Química
t('mistura ou substancia|substancias, misturas', 'en:Mixture', 'en:Chemical substance', 'en:Chemical reaction', 'en:Solution (chemistry)');
t('a massa sumiu|leis ponderais', 'en:Antoine Lavoisier', 'en:Conservation of mass', 'en:Chemical reaction', 'en:Combustion');
t('linha do tempo do atomo|modelos atomicos', 'en:Atom', 'en:Bohr model', 'en:John Dalton', 'en:Ernest Rutherford');
t('onda na corda|ondas', 'en:Wave', 'en:Electromagnetic radiation', 'en:Sound', 'en:Light');
t('danca das particulas', 'en:State of matter', 'en:Particle', 'en:Atom', 'en:Molecule');
t('radiacao', 'en:Ionizing radiation', 'en:Radiography', 'en:Radiation therapy', 'en:Nuclear medicine');
// --- Ambiente
t('da torneira ao rio|tratamento de agua|saneamento', 'en:Water treatment', 'en:Sanitation', 'en:Sewage treatment', 'en:Drinking water');
t('auditoria do lixo|residuos', 'en:Recycling', 'en:Waste management', 'en:Landfill', 'en:Composting');
t('quanto planeta eu uso|pegada', 'en:Ecological footprint', 'en:Carbon footprint', 'en:Natural resource', 'en:Sustainability');
t('escola consciente|consumo consciente', 'en:Sustainable consumption|en:Sustainability', 'en:Recycling', 'en:Renewable energy', 'en:Energy conservation');
t('investigando o rio|poluicao da agua', 'en:Water pollution', 'en:Eutrophication', 'en:Sewage', 'en:Water quality');
// --- 4º bimestre: corpo humano
t('sistema nervoso central|sistema nervoso periferico|sistema nervoso', 'en:Nervous system', 'en:Human brain', 'en:Spinal cord', 'en:Neuron');
t('neuronio', 'en:Neuron', 'en:Synapse', 'en:Axon', 'en:Dendrite');
t('visao|olho humano', 'en:Human eye', 'en:Retina', 'en:Color vision', 'en:Pupil');
t('olfato|paladar', 'en:Olfaction', 'en:Taste', 'en:Tongue', 'en:Chemoreceptor');
t('tato', 'en:Somatosensory system', 'en:Human skin', 'en:Mechanoreceptor', 'en:Braille');
t('audicao', 'en:Ear', 'en:Hearing', 'en:Cochlea', 'en:Vestibular system');
t('esqueletico', 'en:Human skeleton', 'en:Bone', 'en:Joint', 'en:Calcium');
t('muscular', 'en:Muscle', 'en:Skeletal muscle', 'en:Smooth muscle', 'en:Cardiac muscle');
t('mao bionica', 'en:Prosthesis', 'en:Bionics', 'en:Prosthetic arm|en:Prosthesis', 'en:Accessibility');
// drogas: só imagens do cérebro e do sistema nervoso (nunca seringas, embalagens ou o uso da droga em si)
t('drogas', 'en:Human brain', 'en:Neuron', 'en:Nervous system', 'en:Adolescence');
// --- 4º bimestre: saúde
t('^saude|saude$', 'en:Health', 'en:Public health', 'en:World Health Organization', 'en:Healthcare');
t('doencas causadas por virus', 'en:Dengue fever', 'en:Influenza', 'en:Measles', 'en:Aedes aegypti');
t('virus', 'en:Virus', 'en:Coronavirus', 'en:Bacteriophage', 'en:Viral replication');
t('doencas causadas por bacterias', 'en:Tuberculosis', 'en:Cholera', 'en:Tetanus', 'en:Whooping cough');
t('bacterias', 'en:Bacteria', 'en:Escherichia coli', 'en:Antibiotic', 'en:Bacterial cell structure');
t('como as pandemias|pandemia', 'en:Pandemic', 'en:Epidemic', 'en:COVID-19 pandemic', 'en:Epidemiology');
t('sistema imune', 'en:Immune system', 'en:White blood cell', 'en:Antibody', 'en:Lymphocyte');
t('vacinas|fabricacao de vacinas|importancia da vacina|pni', 'en:Vaccine', 'en:Vaccination', 'en:Edward Jenner', 'en:Immunization');
t('indicadores de saude', 'en:Life expectancy', 'en:Infant mortality', 'en:Human Development Index', 'en:Public health');
// --- 4º bimestre: energia
t('energia no cotidiano', 'en:Energy', 'en:Kinetic energy', 'en:Thermal energy', 'en:Electricity');
t('transformacao de energia', 'en:Energy transformation|en:Conservation of energy', 'en:Hydroelectricity', 'en:Power station', 'en:Kinetic energy');
t('energias renovaveis', 'en:Wind power', 'en:Solar power', 'en:Hydroelectricity', 'en:Biofuel');
t('fontes de energia', 'en:Renewable energy', 'en:Fossil fuel', 'en:Solar power', 'en:Hydroelectricity');
t('corrente alternada', 'en:Alternating current', 'en:Direct current', 'en:Electric generator', 'en:Transformer');
t('corrente eletrica', 'en:Electric current', 'en:Ohm\'s law', 'en:Voltage', 'en:Electrical resistance');
t('condutores', 'en:Electrical conductor', 'en:Insulator (electricity)', 'en:Copper', 'en:Electrical wiring');
t('distribuicao de energia', 'en:Electric power transmission', 'en:Transmission tower', 'en:Itaipu Dam', 'en:Electrical grid');
t('serie e circuito em paralelo|serie e em paralelo', 'en:Series and parallel circuits', 'en:Resistor', 'en:Kirchhoff\'s circuit laws', 'en:Electrical network');
t('circuito', 'en:Electronic circuit|en:Electrical network', 'en:Resistor', 'en:Switch', 'en:Battery (electricity)');
t('cuidados em relacao a eletricidade', 'en:Electrical injury', 'en:Electric shock', 'en:Circuit breaker', 'en:Electrical safety');
t('desenvolvimento sustentavel', 'en:Sustainable development', 'en:Sustainability', 'en:Renewable energy', 'en:Recycling');
t('aparelhos eletronicos|economia de eletricidade', 'en:Home appliance', 'en:Electricity meter', 'en:Energy conservation', 'en:LED lamp');
module.exports = T;
