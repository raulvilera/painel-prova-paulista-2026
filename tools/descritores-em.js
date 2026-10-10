/* Descritores oficiais (Guia do Currículo Priorizado – Ensino Médio, SEE-SP) usados como CRITÉRIO da correção por IA.
   Prova Paulista: Matriz da Prova Paulista (AE + habilidade + descritores).
   Provão Paulista: Mapa do Provão (objetos de conhecimento da série; o Guia não traz verbos de habilidade para o Provão). */

const FONTE_BIO = 'Guia do Currículo Priorizado · Ensino Médio · Biologia (SEE-SP, 2026)';
const FONTE_QUI = 'Guia do Currículo Priorizado · Ensino Médio · Química (SEE-SP, 2026)';

/* ---------- Biologia · 2ª série · Prova Paulista (4º bimestre) ---------- */
const BIO2_AE8 = {
  tipo: 'paulista', fonte: FONTE_BIO,
  ae: 'AE8 - Analisar a relação entre os sistemas endócrino e reprodutor, considerando o uso de contraceptivos hormonais, a dependência química como problema de saúde pública e as vulnerabilidades às quais as juventudes estão expostas.',
  habilidades: [{ codigo: 'EM13CNT207', texto: 'Identificar e analisar vulnerabilidades vinculadas aos desafios contemporâneos aos quais as juventudes estão expostas, considerando as dimensões física, psicoemocional e social, a fim de desenvolver e divulgar ações de prevenção e de promoção da saúde e do bem-estar.' }],
  descritores: [
    'Reconhecer as principais Infecções Sexualmente Transmissíveis (IST).',
    'Reconhecer os impactos das drogas no sistema nervoso.',
    'Analisar a relação entre sistema endócrino e o ciclo ovariano.',
    'Analisar a relação entre sistema reprodutor, fecundação e métodos contraceptivos.',
    'Relacionar o tabagismo aos impactos na saúde individual e coletiva.'
  ]
};
const BIO2_AE9 = {
  tipo: 'paulista', fonte: FONTE_BIO,
  ae: 'AE9 - Propor ações de prevenção e promoção da saúde com base nas necessidades locais, analisando os impactos da alimentação, do acesso aos serviços de saúde e do saneamento ambiental sobre a obesidade, a desnutrição, o diabetes tipo 2 e as protozooses (giardíase e amebíase).',
  habilidades: [{ codigo: 'EM13CNT310', texto: 'Investigar e analisar os efeitos de programas de infraestrutura e demais serviços básicos (saneamento, energia elétrica, transporte, telecomunicações, cobertura vacinal, atendimento primário à saúde e produção de alimentos, entre outros) e identificar necessidades locais e/ou regionais em relação a esses serviços, a fim de avaliar e/ou promover ações que contribuam para a melhoria na qualidade de vida e nas condições de saúde da população.' }],
  descritores: [
    'Reconhecer a importância da higiene e cuidados ao armazenar alimentos.',
    'Identificar causas, sintomas e medidas de prevenção de protozooses (giardíase e amebíase).',
    'Relacionar obesidade, desnutrição e diabetes tipo 2 com hábitos alimentares.'
  ]
};

/* ---------- Química · 2ª série · Prova Paulista (4º bimestre) ---------- */
const QUI2_AE8 = {
  tipo: 'paulista', fonte: FONTE_QUI,
  ae: 'AE8 - Realizar previsões qualitativas e quantitativas sobre o funcionamento de pilhas e baterias, com base na análise dos processos de transformação e condução de energia envolvidos, propondo ações que visem a sustentabilidade.',
  habilidades: [
    { codigo: 'EM13CNT107', texto: 'Realizar previsões qualitativas e quantitativas sobre o funcionamento de geradores, motores elétricos e seus componentes, bobinas, transformadores, pilhas, baterias e dispositivos eletrônicos, com base na análise dos processos de transformação e condução de energia envolvidos – com ou sem o uso de dispositivos e aplicativos digitais –, para propor ações que visem a sustentabilidade.' },
    { codigo: 'EM13CNT308', texto: 'Analisar o funcionamento de equipamentos elétricos e/ou eletrônicos, redes de informática e sistemas de automação para compreender as tecnologias contemporâneas e avaliar seus impactos sociais, culturais e ambientais.', fonte: 'BNCC (o Guia cita só o código)' }
  ],
  descritores: [
    'Identificar os componentes e o funcionamento básico de pilhas e baterias, considerando os processos de oxidação e redução envolvidos.',
    'Reconhecer a conversão de energia química em energia elétrica nesses sistemas.',
    'Identificar ações que visem a sustentabilidade, considerando o uso, descarte e impactos ambientais de pilhas e baterias.',
    'Analisar o funcionamento de pilhas e baterias com base nas semirreações e no fluxo de elétrons.',
    'Relacionar diferenças de potencial, materiais dos eletrodos e condições do sistema ao desempenho de pilhas e baterias.',
    'Associar a reatividade dos elementos químicos à condutividade elétrica de soluções.',
    'Avaliar o desempenho e a eficiência de diferentes sistemas eletroquímicos em contextos práticos.',
    'Avaliar qualitativamente e quantitativamente o funcionamento de pilhas e baterias, com base em dados e equações apropriadas.'
  ]
};
const QUI2_ELETROLISE = [
  'Transformações químicas e energia elétrica.',
  'Reações de oxirredução e números de oxidação. Agentes oxidantes e redutores.',
  'Potenciais-padrão de redução.',
  'Transformação química e consumo de energia elétrica: eletrólise.'
];

/* ---------- Provão: objetos de conhecimento do Mapa, por série ---------- */
const BIO2_MOLECULAR = [
  'Estrutura molecular do DNA e do RNA; tipos de RNA e suas funções; replicação do DNA e transcrição gênica.',
  'Código genético e síntese proteica (tradução).',
  'Mundo tecnológico, biotecnologia e biologia forense: melhoramento genético; produção de DNA recombinante; clonagem de plantas e animais; organismos transgênicos; terapia gênica; teste de DNA na identificação de pessoas; descoberta de genomas; uso de células-tronco; CRISPR- edição do DNA; técnica de reação em cadeia da polimerase (PCR); análise forense.'
];
const BIO_SAUDE_COLETIVA = [
  'Fisiologia humana básica: Compreensão dos principais sistemas do corpo humano e sua relação com a saúde; interpretação de situações-problema, envolvendo os sistemas digestório, circulatório, respiratório; uso de drogas e o impacto no sistema nervoso; sistema endócrito e sua atuação na regulação hormonal e reprodução.',
  'Alimentos e nutrição; segurança alimentar; ação das substâncias psicoativas (drogas) no sistema nervoso.',
  'Concepção de saúde; higiene; SUS; saneamento básico; conceitos de endemia, pandemia e epidemia; tipos de imunidade natural e artificial; vacina e soro terapêutico.',
  'Doenças humanas causadas por fungos e protozoários (amebíase, malária, doença de Chagas e leishmaniose): formas de transmissão, etiologia, prevenção, profilaxia e fatores sociais que favorecem sua disseminação.'
];
const BIO3_ECOLOGIA = [
  'Principais conceitos de Ecologia (população, comunidade, ecossistema, biosfera, hábitat e nicho ecológico); cadeias, teias alimentares e níveis tróficos; fluxo energético nas teias alimentares; conceito de produtividade.',
  'Pirâmides ecológicas.',
  'Ciclos biogeoquímicos: água, oxigênio, carbono e nitrogênio.',
  'Fatores que regulam o tamanho das populações: análise interpretativa, situações problema e estudos de caso que envolvam recursos, predadores, clima, relações ecológicas, entre outros.',
  'Principais ameaças antrópicas nos Ecossistemas terrestres e aquáticos, mudanças climáticas e seus efeitos.',
  'Poluição ambiental e os impactos da intervenção humana: do ar, da água, do solo, sonora e visual.',
  'Alternativas energéticas e soluções contra as ameaças ao equilíbrio dos ecossistemas.'
];
const BIO_INVESTIGACAO = [
  'Método científico.',
  'Procedimentos sistemáticos de investigação (elaboração de hipóteses, experimentação e simulação, construção e apresentação de conclusões).'
];
const QUI2_ENERGIA_TERMICA = [
  'Transformações químicas e energia térmica.',
  'Calor de reação: reação exotérmica e endotérmica.',
  'Conceito de entalpia e Lei de Hess.',
  'Equações termoquímicas.',
  'Gases do efeito estufa.'
];
const QUI2_ENERGIA_ELETRICA = [
  'Transformações químicas e energia elétrica.',
  'Reações de oxirredução e números de oxidação. Agentes oxidantes e redutores.',
  'Potenciais-padrão de redução.',
  'Transformação química e produção de energia elétrica: pilha.',
  'Transformação química e consumo de energia elétrica: eletrólise.'
];
const QUI3_AGUA = [
  'Principais características e propriedades de ácidos, bases, sais e óxidos.',
  'Indicadores, condutibilidade elétrica, reação com metais, reação de neutralização.',
  'Atmosfera terrestre: composição e características.',
  'Óxidos e a chuva ácida.',
  'Gases do efeito estufa.',
  'Ocorrência e Importância da água para a vida.',
  'Tratamento de água.',
  'Soluções aquosas: conceito e classificação.',
  'Solubilidade e concentrações (porcentagem, ppm, g/L, mol/L, mol/kg, conversões de unidades).',
  'Operações envolvendo soluções (diluições e misturas de soluções com ou sem reação química).'
];
const QUI3_CARBONO = [
  'As características gerais dos compostos orgânicos.',
  'Elementos químicos constituintes, fórmulas moleculares e estruturais, cadeias carbônicas.',
  'Principais radicais funcionais e funções orgânicas.',
  'Propriedades físicas dos compostos orgânicos.',
  'Carvão, petróleo e gás natural: origem, ocorrência e composição; destilação fracionada; combustão; implicações ambientais do uso de combustíveis fósseis.',
  'Macromoléculas naturais e sintéticas.',
  'Noção de monômeros e polímeros.'
];
const provao = (fonte, serie, objetos) => ({ tipo: 'provao', fonte: fonte + ' · Mapa Provão Paulista, ' + serie + 'ª série', habilidades: [], descritores: [], objetos });

/* id da questão dissertativa → critérios */
module.exports = {
  'bio-2-paulista-13': BIO2_AE8,
  'bio-2-paulista-14': BIO2_AE9,
  'qui-2-paulista-13': QUI2_AE8,
  'qui-2-paulista-14': Object.assign({}, QUI2_AE8, { objetos: QUI2_ELETROLISE }),
  'bio-2-provao-13': provao(FONTE_BIO, 2, BIO2_MOLECULAR),
  'bio-2-provao-14': provao(FONTE_BIO, 2, BIO_SAUDE_COLETIVA),
  'qui-2-provao-13': provao(FONTE_QUI, 2, QUI2_ENERGIA_TERMICA),
  'qui-2-provao-14': provao(FONTE_QUI, 2, QUI2_ENERGIA_ELETRICA),
  'bio-3-provao-13': provao(FONTE_BIO, 3, BIO3_ECOLOGIA.concat(BIO_INVESTIGACAO)),
  'bio-3-provao-14': provao(FONTE_BIO, 3, BIO2_MOLECULAR.concat(BIO_INVESTIGACAO)),
  'qui-3-provao-13': provao(FONTE_QUI, 3, QUI3_AGUA),
  'qui-3-provao-14': provao(FONTE_QUI, 3, QUI3_CARBONO)
};
