/* Foto automática (Wikipédia/Commons) para as questões dos demais alunos, ligada ao ENUNCIADO por palavras-chave.
   Sem IA e sem custo: só a tabela abaixo. A foto é baixada na 1ª vez que alguém abre a questão e fica guardada no banco.
   Limites para não pesar: no máximo MAX fotos por atividade, nenhuma foto repetida na mesma atividade, e só quando há correspondência. */
const crypto = require('crypto');
const MAX = 8;
const chaveImg = p => crypto.createHash('sha1').update(String(p)).digest('hex').slice(0, 12);
const R = (re, spec, alt) => ({ re: new RegExp('\\b(?:' + re + ')'), spec, alt, k: chaveImg(spec) });
const REGRAS = [
  R('mao bionica|protese|acessibilidade', 'en:Prosthesis|en:Bionics', 'Prótese'),
  // astronomia
  R('eclipse solar', 'en:Solar eclipse|en:Eclipse', 'Eclipse solar'), R('eclipse lunar', 'en:Lunar eclipse|en:Eclipse', 'Eclipse lunar'), R('eclips', 'en:Eclipse|en:Solar eclipse', 'Eclipse'),
  R('fases? da lua|lua (nova|cheia|crescente|minguante)', 'en:Lunar phase', 'Fases da Lua'),
  R('estac(ao|oes) do ano|inclinac(ao)? do eixo|solsticio|equinocio', 'en:Season|en:Axial tilt', 'Estações do ano'),
  R('rotacao|dia e noite', 'en:Earth\'s rotation|en:Day', 'Rotação da Terra'), R('translacao|orbita da terra', 'en:Earth\'s orbit|en:Orbit', 'Órbita da Terra'),
  R('geocentri|heliocentri|copernico|galileu', 'en:Heliocentrism|en:Nicolaus Copernicus', 'Modelo heliocêntrico'),
  R('ciclo de vida das estrelas|nebulosa|supernova|anã', 'en:Nebula|en:Supernova', 'Nebulosa'), R('estrela', 'en:Star|en:Sun', 'Estrela'),
  R('constelac', 'en:Constellation|en:Orion (constellation)', 'Constelação'), R('telescop', 'en:Telescope|en:Galileo Galilei', 'Telescópio'),
  R('exploracao espacial|foguete|satelite|astronauta', 'en:Space exploration|en:Apollo 11', 'Exploração espacial'), R('vida fora da terra|extraterrestre|exoplaneta', 'en:Extraterrestrial life|en:Mars', 'Vida fora da Terra'),
  R('planetas? (rochoso|gasoso)|marte|jupiter|saturno|venus|mercurio', 'en:Terrestrial planet|en:Mars', 'Planetas'), R('sistema solar|corpos celestes|asteroide|cometa', 'en:Solar System', 'Sistema Solar'),
  R('big bang|origem do universo', 'en:Big Bang|en:Universe', 'Universo'), R('gravidade|queda livre', 'en:Free fall|en:Galileo Galilei', 'Queda livre'),
  // terra e ambiente
  R('vulca', 'en:Volcano|en:Mount Etna', 'Vulcão'), R('terremoto|sismo|abalo sismico', 'en:Earthquake|en:Seismometer', 'Terremoto'), R('tsunami', 'en:Tsunami|en:2011 Tōhoku earthquake and tsunami', 'Tsunami'),
  R('placas? tectonica|deriva continental|wegener', 'en:Plate tectonics|en:Continental drift', 'Placas tectônicas'), R('fossil', 'en:Fossil|en:Trilobite', 'Fóssil'),
  R('erosao|voco(roca)', 'en:Soil erosion|en:Erosion', 'Erosão'), R('rochas?\\b|magmatic|sedimentar|metamorfic', 'en:Rock (geology)|en:Granite', 'Rochas'), R('solo\\b|horizonte', 'en:Soil|en:Soil horizon', 'Solo'),
  R('efeito estufa', 'en:Greenhouse effect', 'Efeito estufa'), R('aquecimento global|mudancas? climatica', 'en:Global warming|en:Climate change', 'Aquecimento global'),
  R('atmosfera|camada de ozonio', 'en:Atmosphere of Earth', 'Atmosfera da Terra'), R('hidrosfera|ciclo da agua|evaporac', 'en:Water cycle', 'Ciclo da água'),
  R('estados? fisicos?|mudancas? de estado|fusao|ebulicao', 'en:State of matter|en:Phase transition', 'Estados da matéria'), R('poluicao do ar|qualidade do ar|poluicao atmosferica', 'en:Air pollution|en:Smog', 'Poluição do ar'),
  R('previsao do tempo|meteorolog|pluviometro|termometro|anemometro', 'en:Weather forecasting|en:Weather station', 'Estação meteorológica'), R('correntes? (oceanica|maritima)|circulacao atmosferica', 'en:Ocean current|en:Atmospheric circulation', 'Correntes oceânicas'),
  R('bioma|amazonia|cerrado|mata atlantica|caatinga|pantanal', 'en:Biome|en:Amazon rainforest', 'Bioma'), R('unidades? de conservacao|parque nacional|reserva', 'en:Protected area|en:Iguazu National Park', 'Parque nacional'),
  R('ecossistemas? aquatico|recife|manguezal', 'en:Aquatic ecosystem|en:Coral reef', 'Ecossistema aquático'), R('poluicao da agua|qualidade da agua|rio poluido', 'en:Water pollution', 'Poluição da água'),
  R('tratamento de agua|esgoto|saneamento', 'en:Sanitation|en:Water treatment', 'Saneamento'), R('lixo|residuos? solido|reciclagem|coleta seletiva', 'en:Recycling|en:Waste', 'Reciclagem'),
  R('pegada ecologica', 'en:Ecological footprint', 'Pegada ecológica'), R('biodiversidade|extincao', 'en:Biodiversity', 'Biodiversidade'), R('sustentabilidade|consumo consciente', 'en:Sustainability|en:Sustainable development', 'Sustentabilidade'),
  // biologia
  R('microscopio', 'en:Optical microscope|en:Microscope', 'Microscópio'), R('procarionte|eucarionte', 'en:Prokaryote|en:Eukaryote', 'Células procariontes e eucariontes'), R('mitose', 'en:Mitosis', 'Mitose'), R('meiose', 'en:Meiosis', 'Meiose'),
  R('organelas?|celula vegetal|celula animal|cloroplasto|mitocondria', 'en:Cell (biology)|en:Plant cell', 'Célula'), R('celulas?\\b', 'en:Cell (biology)', 'Célula'),
  R('dna\\b|acido desoxirribonucleico', 'en:DNA', 'DNA'), R('mendel|hereditariedade|dominante|recessiv', 'en:Gregor Mendel|en:Pea', 'Gregor Mendel'), R('biotecnologia|transgenic|engenharia genetica', 'en:Genetic engineering|en:Biotechnology', 'Biotecnologia'),
  R('especiacao|isolamento reprodutivo', 'en:Speciation|en:Darwin\'s finches', 'Especiação'), R('evolucao|selecao natural|darwin|ancestral', 'en:Natural selection|en:Charles Darwin', 'Evolução'),
  R('bacteria', 'en:Bacteria|en:Escherichia coli', 'Bactérias'), R('virus|viral', 'en:Virus|en:Coronavirus', 'Vírus'), R('fungo|levedura|fermento', 'en:Fungus|en:Yeast', 'Fungos'), R('protozoario|ameba', 'en:Protozoa|en:Amoeba', 'Protozoários'), R('microrganismo|microbio', 'en:Microorganism', 'Microrganismos'),
  R('vertebrado|invertebrado', 'en:Vertebrate|en:Invertebrate', 'Animais'), R('vacin|imunizacao', 'en:Vaccine|en:Vaccination', 'Vacinação'), R('sistema imun|imunitario|anticorpo|defesa do corpo', 'en:Immune system|en:White blood cell', 'Sistema imune'),
  R('pandemia|epidemia|endemia|surto', 'en:Pandemic|en:Epidemic', 'Pandemia'), R('hiv|aids|sifilis|hpv|ists?\\b', 'en:HIV/AIDS|en:Condom', 'Prevenção'), R('contracepti|preservativo|camisinha', 'en:Birth control|en:Condom', 'Métodos contraceptivos'),
  R('reproducao assexuada|reproducao sexuada|gametas|fecundacao', 'en:Sexual reproduction|en:Asexual reproduction', 'Reprodução'), R('flor|polinizac|polen', 'en:Flower|en:Pollination', 'Flor'), R('fotossintese|cloro[fp]ila', 'en:Photosynthesis|en:Chloroplast', 'Fotossíntese'),
  R('neuronio|sinapse|impulso nervoso', 'en:Neuron|en:Nervous system', 'Neurônio'), R('sistema nervoso|encefalo|cerebro|medula', 'en:Nervous system|en:Human brain', 'Sistema nervoso'), R('olhos?\\b|visao|retina|cristalino', 'en:Human eye', 'Olho humano'),
  R('olfato|paladar|quimiorreceptor', 'en:Olfaction|en:Taste', 'Olfato e paladar'), R('tato\\b|pele|receptores? tatei', 'en:Human skin|en:Somatosensory system', 'Pele'), R('audicao|ouvido|equilibrio', 'en:Ear|en:Hearing', 'Ouvido'),
  R('ossos?\\b|esqueleto|esqueletic', 'en:Human skeleton|en:Bone', 'Esqueleto humano'), R('musculo|muscular', 'en:Muscle|en:Skeletal muscle', 'Músculos'), R('droga|psicoativ|alcool|tabagismo|cigarro', 'en:Psychoactive drug|en:Substance abuse', 'Drogas'),
  R('sistema respiratorio|pulmao|pulmoes|inspiracao|diafragma', 'en:Respiratory system|en:Lung', 'Sistema respiratório'), R('sistema digestorio|digestao|estomago|intestino', 'en:Human digestive system', 'Sistema digestório'), R('nutriente|proteina|carboidrato|vitamina|alimentacao saudavel', 'en:Nutrient|en:Healthy diet', 'Nutrientes'),
  R('tecidos?|orgaos?|sistemas do corpo|niveis de organizacao', 'en:Organ system|en:Tissue (biology)', 'Órgãos e sistemas'),
  // física e química
  R('atomo|modelo atomico|dalton|thomson|rutherford|bohr', 'en:Atom|en:Bohr model', 'Modelo atômico'), R('ondas?\\b|frequencia|comprimento de onda|eletromagnetic', 'en:Wave|en:Electromagnetic radiation', 'Ondas'), R('radiacao', 'en:Ionizing radiation|en:Radiography', 'Radiação'),
  R('lavoisier|leis? ponderais?|conservacao das massas|reacao quimica', 'en:Antoine Lavoisier|en:Chemical reaction', 'Reação química'), R('mistura|substancia|transformacao (fisica|quimica)', 'en:Mixture|en:Chemical substance', 'Misturas'),
  R('alavanca|maquinas? simples|roldana|plano inclinado', 'en:Lever|en:Simple machine', 'Máquina simples'),
  // energia e eletricidade
  R('hidreletric|usina hidro', 'en:Hydroelectricity|en:Itaipu Dam', 'Usina hidrelétrica'), R('energia solar|fotovoltaic|placa solar', 'en:Solar power|en:Photovoltaics', 'Energia solar'), R('eolic|aerogerador', 'en:Wind power', 'Energia eólica'),
  R('nuclear|usina nuclear', 'en:Nuclear power', 'Energia nuclear'), R('combustiveis? fosseis?|petroleo|carvao', 'en:Fossil fuel|en:Petroleum', 'Combustíveis fósseis'), R('renovavel|biomassa|etanol', 'en:Renewable energy|en:Biofuel', 'Energia renovável'),
  R('cargas? eletrica|eletrizacao|eletricidade estatica', 'en:Static electricity', 'Eletricidade estática'), R('magnet|imas?\\b', 'en:Magnet|en:Magnetism', 'Ímã'),
  R('corrente alternada|corrente continua', 'en:Alternating current|en:Direct current', 'Corrente alternada e contínua'), R('lei de ohm|resistencia eletrica|tensao eletrica|corrente eletrica', 'en:Electric current|en:Ohm\'s law', 'Corrente elétrica'),
  R('condutor|isolante', 'en:Electrical conductor|en:Insulator (electricity)', 'Condutores e isolantes'), R('serie|paralelo', 'en:Series and parallel circuits', 'Circuitos em série e em paralelo'), R('circuitos?\\b', 'en:Electrical network|en:Electronic circuit', 'Circuito elétrico'),
  R('distribuicao de energia|transmissao|rede eletrica|matriz energetica|usina', 'en:Electric power transmission|en:Transmission tower', 'Transmissão de energia'), R('choque eletrico|seguranca eletrica|fio desencapado', 'en:Electrical injury|en:Electric shock', 'Segurança com eletricidade'),
  R('conta de luz|kwh|bandeira tarifaria|selo (procel|de eficiencia)|eficiencia energetica|economia de energia', 'en:Energy conservation|en:Electricity meter', 'Economia de energia'), R('eletrodomestic|aparelhos? eletr|potencia eletrica', 'en:Home appliance|en:Electric power', 'Eletrodomésticos'),
  R('transformacao de energia|conservacao da energia|energia cinetica|energia potencial', 'en:Conservation of energy|en:Kinetic energy', 'Transformação de energia'),
];
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const POR_K = {}; REGRAS.forEach(r => { POR_K[r.k] = r; });
const candidatos = k => POR_K[k] ? POR_K[k].spec.split('|') : null;

/* itens: [{ q, desc }] na ordem da atividade -> devolve cópias das questões com q.ilus onde houver foto adequada */
function aplicar(itens) {
  const usadas = new Set(); let n = 0;
  return itens.map(it => {
    const q = it.q; if (n >= MAX || q.ilus) return it;
    const acha = txt => { let b = null, bn = 0;   // vence o assunto mais citado no enunciado (empate: a regra mais específica, que vem antes)
      REGRAS.forEach(r => { if (usadas.has(r.k)) return; const c = (txt.match(new RegExp(r.re.source, 'g')) || []).length; if (c > bn) { b = r; bn = c; } }); return b; };
    const r = acha(norm(q.enunciado + ' ' + (q.comando || ''))) || acha(norm(it.desc));   // 1º o enunciado; se ele não citar um assunto, o tema da habilidade que a questão avalia
    if (!r) return it;
    usadas.add(r.k); n++;
    return Object.assign({}, it, { q: Object.assign({}, q, { ilus: { spec: r.spec, alt: r.alt, k: r.k }, imgOpc: true }) });
  });
}
module.exports = { aplicar, candidatos };
