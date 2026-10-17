/* Foto automática (Wikipédia/Commons) para as questões dos demais alunos, ligada ao ENUNCIADO por palavras-chave.
   Sem IA e sem custo: só a tabela abaixo. A foto é baixada na 1ª vez que alguém abre a questão e fica guardada no banco.
   Limites para não pesar: no máximo MAX fotos por atividade, nenhuma foto repetida na mesma atividade, e só quando há correspondência. */
const crypto = require('crypto');
const MAX = 8;
const chaveImg = p => crypto.createHash('sha1').update(String(p)).digest('hex').slice(0, 12);
const R = (re, spec, alt) => ({ re: new RegExp('\\b(?:' + re + ')'), spec, alt, k: chaveImg(spec) });
const REGRAS = [
  
  // astronomia
  
  R('eclipse solar', 'en:Solar eclipse|en:Eclipse', 'Eclipse solar'), R('eclipse lunar', 'en:Lunar eclipse|en:Eclipse', 'Eclipse lunar'), R('eclips', 'en:Eclipse|en:Solar eclipse', 'Eclipse'),
  R('fases? da lua|lua (nova|cheia|crescente|minguante)', 'en:Lunar phase', 'Fases da Lua'),
  R('estac(ao|oes) do ano|inclinac(ao)? do eixo|solsticio|equinocio', 'en:Season|en:Axial tilt', 'Estações do ano'),
  R('rotacao|dia e noite', 'en:Earth\'s rotation|en:Day', 'Rotação da Terra'), R('translacao|orbita da terra', 'en:Earth\'s orbit|en:Orbit', 'Órbita da Terra'),
  
  R('ciclo de vida das estrelas|nebulosa|supernova|anã', 'en:Nebula|en:Supernova', 'Nebulosa'), 
  R('constelac', 'en:Constellation|en:Orion (constellation)', 'Constelação'), 
  
  R('sistema solar|corpos celestes|asteroide|cometa', 'en:Solar System', 'Sistema Solar'),
  
  // terra e ambiente
  R('vulca', 'en:Volcano|en:Mount Etna', 'Vulcão'), R('terremoto|sismo|abalo sismico', 'en:Earthquake|en:Seismometer', 'Terremoto'), R('tsunami', 'en:Tsunami|en:2011 Tōhoku earthquake and tsunami', 'Tsunami'),
  R('placas? tectonica|deriva continental|wegener', 'en:Plate tectonics|en:Continental drift', 'Placas tectônicas'), R('fossil', 'en:Fossil|en:Trilobite', 'Fóssil'),
  R('erosao|voco(roca)', 'en:Soil erosion|en:Erosion', 'Erosão'), 
  
  
  R('poluicao do ar|qualidade do ar|poluicao atmosferica', 'en:Air pollution|en:Smog', 'Poluição do ar'),
  
  
  R('poluicao da agua|qualidade da agua|rio poluido', 'en:Water pollution', 'Poluição da água'),
  R('lixo|residuos? solido|reciclagem|coleta seletiva', 'en:Recycling|en:Waste', 'Reciclagem'),
  
  // biologia
  R('microscopio', 'en:Optical microscope|en:Microscope', 'Microscópio'), R('mitose', 'en:Mitosis', 'Mitose'), R('meiose', 'en:Meiosis', 'Meiose'),
  R('organelas?|celula vegetal|celula animal|cloroplasto|mitocondria', 'en:Cell (biology)|en:Plant cell', 'Célula'), R('celulas?\\b', 'en:Cell (biology)', 'Célula'),
  R('dna\\b|acido desoxirribonucleico', 'en:DNA', 'DNA'), R('mendel|hereditariedade|dominante|recessiv', 'en:Gregor Mendel|en:Pea', 'Gregor Mendel'), R('biotecnologia|transgenic|engenharia genetica', 'en:Genetic engineering|en:Biotechnology', 'Biotecnologia'),
  R('especiacao|isolamento reprodutivo', 'en:Speciation|en:Darwin\'s finches', 'Especiação'), 
  R('bacteria', 'en:Bacteria|en:Escherichia coli', 'Bactérias'), R('virus|viral', 'en:Virus|en:Coronavirus', 'Vírus'), 
  R('vacin|imunizacao', 'en:Vaccine|en:Vaccination', 'Vacinação'), 
  R('pandemia|epidemia|endemia|surto', 'en:Pandemic|en:Epidemic', 'Pandemia'), 
  R('flor|polinizac|polen', 'en:Flower|en:Pollination', 'Flor'), 
  R('olhos?\\b|visao|retina|cristalino', 'en:Human eye', 'Olho humano'),
  R('olfato|paladar|quimiorreceptor', 'en:Olfaction|en:Taste', 'Olfato e paladar'), R('audicao|ouvido|equilibrio', 'en:Ear|en:Hearing', 'Ouvido'),
  R('ossos?\\b|esqueleto|esqueletic', 'en:Human skeleton|en:Bone', 'Esqueleto humano'), 
  R('sistema respiratorio|pulmao|pulmoes|inspiracao|diafragma', 'en:Respiratory system|en:Lung', 'Sistema respiratório'), R('sistema digestorio|digestao|estomago|intestino', 'en:Human digestive system', 'Sistema digestório'), 
  
  // física e química
  
  
  
  // energia e eletricidade
  R('hidreletric|usina hidro', 'en:Hydroelectricity|en:Itaipu Dam', 'Usina hidrelétrica'), R('energia solar|fotovoltaic|placa solar', 'en:Solar power|en:Photovoltaics', 'Energia solar'), R('eolic|aerogerador', 'en:Wind power', 'Energia eólica'),
  
  
  R('lei de ohm|resistencia eletrica|tensao eletrica|corrente eletrica', 'en:Electric current|en:Ohm\'s law', 'Corrente elétrica'),
  R('serie|paralelo', 'en:Series and parallel circuits', 'Circuitos em série e em paralelo'), 
  
  
  
];
/* curadoria manual: questões em que a foto não combina com o enunciado (impressão digital do enunciado) */
const RECUSADAS = new Set(["8c3c695d","53b9533a","d350f0d9","24623ac5","8e6f486b","4eb2f137","48ad0f7a","eaa0e835","d229bfda","a0213046","8ff04414","3c90d781","8e1134d3","8df5ddc4","67d9cc21","2b4d2778","fd989f8c","abb02dfa","abd24d94","9bf183cf","cb0e7a80","0e34c960","21923ab6","649ef375","ee0754cd","ddbc849d","8a9e314d","8eeab044","92e5caae","68dcf768","0507da5e","a62056e0"]);
const impressao = q => crypto.createHash('sha1').update(q.enunciado).digest('hex').slice(0, 8);
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const POR_K = {}; REGRAS.forEach(r => { POR_K[r.k] = r; });
const candidatos = k => POR_K[k] ? POR_K[k].spec.split('|') : null;

/* itens: [{ q, desc }] na ordem da atividade -> devolve cópias das questões com q.ilus onde houver foto adequada */
function aplicar(itens) {
  const usadas = new Set(); let n = 0;
  return itens.map(it => {
    const q = it.q; if (n >= MAX || q.ilus || RECUSADAS.has(impressao(q))) return it;
    // curadoria: o assunto precisa ser o centro da questão (citado no comando, ou ao menos 2 vezes no enunciado); o mais citado vence
    const en = norm(q.enunciado), cm = norm(q.comando || ''); let r = null, rn = 0;
    REGRAS.forEach(x => { if (usadas.has(x.k)) return; const g = new RegExp(x.re.source, 'g'), c = (en.match(g) || []).length + 3 * (cm.match(g) || []).length; if (c >= 2 && c > rn) { r = x; rn = c; } });
    if (!r) return it;
    usadas.add(r.k); n++;
    return Object.assign({}, it, { q: Object.assign({}, q, { ilus: { spec: r.spec, alt: r.alt, k: r.k }, imgOpc: true }) });
  });
}
module.exports = { aplicar, candidatos };
