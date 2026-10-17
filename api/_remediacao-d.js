/* 4ª leva: 7º ano (clima, biomas, geologia, saúde pública, vírus, bactérias, vacinas, saneamento) */
module.exports = (O, AS, OR, DI) => [
  ['7', 'Reconhecer o efeito estufa', [
    AS('O efeito estufa é natural e mantém a Terra aquecida.', ['Efeito estufa natural', 'Efeito estufa intensificado', 'Gases do efeito estufa'], ['Mantém a temperatura adequada à vida', 'Aumenta a temperatura além do normal', 'CO₂ e metano'], [0, 1, 2]),
    OR('Ordene o efeito estufa.', ['O Sol aquece a superfície', 'A Terra emite calor', 'Os gases retêm parte do calor', 'A temperatura do planeta se mantém']),
    O('Sem o efeito estufa natural, a Terra teria cerca de -18 °C em vez de 15 °C. O que isso mostra?', ['Que o efeito estufa é sempre prejudicial', 'Que o efeito estufa natural é necessário à vida', 'Que a Terra não tem atmosfera', 'Que o Sol aquece demais'], 1, 'O efeito natural é necessário; o problema é o excesso.'),
    DI('Diferencie efeito estufa natural de aquecimento global.', 'O natural é necessário à vida. O aquecimento global ocorre quando a ação humana (queima de combustíveis, desmatamento) aumenta os gases e retém mais calor.', ['natural é necessário', 'ação humana aumenta os gases', 'excesso aquece o planeta'])]],
  ['7', 'Relacionar os impactos das atividades humanas com as mudanças climáticas', [
    AS('Causas e efeitos.', ['Queima de combustíveis fósseis', 'Desmatamento', 'Aumento da temperatura'], ['Emite CO₂', 'Reduz a absorção de CO₂', 'Derrete geleiras e eleva os oceanos'], [0, 1, 2]),
    OR('Ordene a corrente de causas.', ['Mais carros e indústrias', 'Mais CO₂ na atmosfera', 'Mais calor retido', 'Eventos climáticos extremos']),
    O('Uma cidade litorânea sofre mais enchentes porque o nível do mar subiu. Qual a relação com o clima?', ['O derretimento de geleiras eleva o nível do mar', 'A Lua cresceu', 'A água do mar ficou mais pesada', 'Não há relação'], 0, 'O aquecimento derrete gelo e dilata a água.'),
    DI('Quem sofre mais com as mudanças climáticas e por quê?', 'Populações mais pobres e em áreas de risco (encostas, litoral, regiões secas) têm menos recursos para se proteger e se recuperar.', ['populações vulneráveis', 'áreas de risco', 'menos recursos'])]],
  ['7', 'Avaliar a qualidade do ar', [
    AS('Poluentes do ar.', ['Fumaça de queimadas', 'Gases de escapamento', 'Poeira'], ['Material particulado', 'Monóxido de carbono e NOx', 'Particulados que causam alergias'], [0, 1, 2]),
    OR('Ordene o efeito da poluição na saúde.', ['Poluentes são liberados no ar', 'São inalados', 'Irritam vias respiratórias', 'Surgem doenças respiratórias']),
    O('Em uma semana de queimadas, aumentaram os atendimentos por problemas respiratórios. Qual a relação?', ['Fumaça irrita os pulmões', 'Chuva demais', 'Frio', 'Falta de sol'], 0, 'A fumaça tem partículas que irritam o sistema respiratório.'),
    DI('Cite duas formas de melhorar a qualidade do ar na cidade.', 'Reduzir o uso de carros, usar transporte coletivo e bicicleta, plantar árvores, controlar emissões de indústrias.', ['primeira forma', 'segunda forma', 'relaciona à redução de poluentes'])]],
  ['7', 'Analisar os impactos das ações humanas nos biomas', [
    AS('Bioma e ameaça.', ['Amazônia', 'Cerrado', 'Mata Atlântica'], ['Desmatamento e queimadas', 'Expansão agrícola', 'Urbanização'], [0, 1, 2]),
    OR('Ordene o impacto do desmatamento.', ['Árvores são derrubadas', 'O solo fica exposto', 'Ocorre erosão', 'Animais perdem abrigo e a biodiversidade cai']),
    O('Pouca mata nativa sobrou na Mata Atlântica. Qual a principal causa?', ['Ocupação e urbanização', 'Falta de chuva', 'Excesso de animais', 'Terremotos'], 0, 'Concentra grande parte da população brasileira.'),
    DI('Escolha um bioma, cite uma ameaça e uma ação para preservá-lo.', 'Exemplo: Amazônia ameaçada por desmatamento; ação: fiscalização, áreas protegidas e uso sustentável.', ['bioma e ameaça corretos', 'ação de preservação', 'coerência'])]],
  ['7', 'Reconhecer fenômenos geológicos', [
    AS('Fenômenos.', ['Terremoto', 'Vulcanismo', 'Tsunami'], ['Tremor da crosta', 'Saída de magma', 'Onda gigante causada por abalo no mar'], [0, 1, 2]),
    OR('Ordene o que acontece em um tsunami.', ['Terremoto no fundo do mar', 'A água é deslocada', 'Ondas gigantes se formam', 'As ondas atingem o litoral']),
    O('Por que terremotos são frequentes no Japão?', ['Está no limite de placas tectônicas', 'Tem muita chuva', 'Fica no centro de uma placa', 'Tem muitos rios'], 0, 'Limites de placas concentram abalos.'),
    DI('Cite uma medida de proteção em áreas de terremoto.', 'Construções resistentes, planos de evacuação, alarmes e educação da população.', ['medida de proteção válida', 'explica o benefício', 'relaciona ao risco'])]],
  ['7', 'Diferenciar Unidades de Conservação', [
    AS('Tipos de UC.', ['Parque Nacional', 'Reserva Extrativista', 'Estação Ecológica'], ['Proteção integral; visita e pesquisa', 'Uso sustentável por populações tradicionais', 'Proteção integral; pesquisa'], [0, 1, 2]),
    AS('Ligue o grupo.', ['Proteção integral', 'Uso sustentável'], ['Preservar sem uso direto', 'Conservar permitindo uso'], [0, 1]),
    O('Uma comunidade extrai látex da seringueira em uma área protegida. Em qual tipo se enquadra?', ['Proteção integral', 'Uso sustentável', 'Nenhuma', 'Cidade'], 1, 'Reservas extrativistas permitem uso sustentável.'),
    DI('Por que existem dois grupos de Unidades de Conservação?', 'Alguns locais precisam de proteção total (espécies ameaçadas), e outros permitem o uso sustentável dos recursos por populações locais.', ['proteção integral para áreas sensíveis', 'uso sustentável permite atividades', 'equilibra conservação e uso'])]],
  ['7', 'Usar o conceito de saúde da OMS', [
    AS('Saúde é bem-estar físico, mental e social.', ['Físico', 'Mental', 'Social'], ['Corpo sem doenças', 'Emoções equilibradas', 'Convivência e direitos'], [0, 1, 2]),
    OR('Ordene o percurso de um atendimento no SUS.', ['Unidade Básica de Saúde', 'Encaminhamento para um especialista', 'Exames e tratamento', 'Acompanhamento']),
    O('O SUS é universal. O que isso significa?', ['Atende a todas as pessoas', 'Atende só quem paga', 'Atende só idosos', 'Atende só crianças'], 0, 'Universalidade: saúde é direito de todos.'),
    DI('Por que saúde não é só ausência de doença?', 'Saúde envolve bem-estar físico, mental e social: alimentação, moradia, saneamento, lazer e apoio.', ['bem-estar físico, mental e social', 'condições de vida', 'inclui prevenção'])]],
  ['7', 'Identificar características e replicação dos vírus', [
    AS('Vírus.', ['Cápsula (capsídeo)', 'Material genético', 'Hospedeiro'], ['Protege o vírus', 'DNA ou RNA', 'Célula que o vírus usa para se replicar'], [0, 1, 2]),
    OR('Ordene a replicação do vírus.', ['O vírus se liga à célula', 'Entra e libera o material genético', 'A célula copia o vírus', 'Novos vírus saem e infectam outras células']),
    O('Vírus não são considerados células. Por quê?', ['Não têm estrutura celular e só se replicam em hospedeiros', 'Têm núcleo e organelas', 'Fazem fotossíntese', 'Vivem sozinhos'], 0, 'Dependem de células hospedeiras.'),
    DI('Os vírus são seres vivos? Defenda sua resposta.', 'É debatido: não têm células e dependem de um hospedeiro para se replicar, mas têm material genético, evoluem e se reproduzem dentro de células. Por isso a posição comum é que ficam no limite entre o vivo e o não vivo.', ['não têm células', 'dependem do hospedeiro', 'argumenta a posição'])]],
  ['7', 'Explicar e diferenciar as principais doenças virais', [
    AS('Doenças virais.', ['Dengue', 'Gripe', 'HIV/Aids'], ['Transmitida pelo mosquito Aedes', 'Transmitida pelo ar', 'Transmissão sexual, sangue, vertical'], [0, 1, 2]),
    AS('Prevenção.', ['Dengue', 'Gripe', 'HIV'], ['Eliminar água parada', 'Vacina anual e higiene', 'Preservativo'], [0, 1, 2]),
    O('Antibiótico serve para tratar gripe?', ['Sim', 'Não, porque a gripe é causada por vírus', 'Só na criança', 'Só se tiver tosse'], 1, 'Antibióticos agem em bactérias.'),
    DI('Por que eliminar água parada ajuda a combater a dengue?', 'O mosquito Aedes aegypti põe ovos na água parada; sem criadouros, há menos mosquitos e menos transmissão.', ['mosquito se reproduz na água parada', 'sem criadouro menos mosquitos', 'menos transmissão'])]],
  ['7', 'Explicar a constituição geral e as principais características das bactérias', [
    AS('Bactérias.', ['Procarionte', 'Parede celular', 'Plasmídeo'], ['Sem núcleo organizado', 'Protege a bactéria', 'DNA extra'], [0, 1, 2]),
    OR('Ordene a divisão de uma bactéria.', ['Duplica o DNA', 'A célula cresce', 'Divide-se em duas', 'Formam-se duas bactérias iguais']),
    O('Bactéria se divide a cada 20 min. Quantas haverá em 1 hora a partir de uma?', ['3', '6', '8', '60'], 2, '20 min → 2; 40 min → 4; 60 min → 8.'),
    DI('Cite um benefício e um malefício das bactérias.', 'Benefício: iogurte e decomposição; malefício: doenças como a tuberculose.', ['benefício', 'malefício', 'exemplos corretos'])]],
  ['7', 'Investigar e comparar características de algumas doenças bacterianas', [
    AS('Doenças bacterianas.', ['Tuberculose', 'Cólera', 'Tétano'], ['Transmitida pelo ar', 'Água contaminada', 'Ferimentos com bactérias do solo'], [0, 1, 2]),
    AS('Prevenção.', ['Cólera', 'Tuberculose', 'Tétano'], ['Saneamento e água tratada', 'Vacina BCG e tratamento', 'Vacina e cuidado com feridas'], [0, 1, 2]),
    O('Um surto de diarreia aparece em bairro sem rede de esgoto. Qual doença bacteriana pode ser?', ['Cólera', 'Tétano', 'Tuberculose', 'Sarampo'], 0, 'Cólera: água e alimentos contaminados.'),
    DI('Por que não se deve tomar antibiótico sem orientação médica?', 'O uso errado pode selecionar bactérias resistentes e pode mascarar sintomas e causar efeitos colaterais.', ['pode gerar resistência', 'só serve para bactérias', 'efeitos colaterais'])]],
  ['7', 'Comparar e diferenciar as características de pandemia', [
    AS('Termos.', ['Surto', 'Epidemia', 'Pandemia'], ['Aumento de casos em local restrito', 'Aumento em uma região', 'Doença espalhada pelo mundo'], [0, 1, 2]),
    OR('Ordene da menor para a maior abrangência.', ['Surto', 'Epidemia', 'Pandemia']),
    O('Uma doença está sempre presente em uma região com casos constantes. Como se classifica?', ['Epidemia', 'Endemia', 'Pandemia', 'Surto'], 1, 'Endemia: presença constante.'),
    DI('Explique a diferença entre epidemia e pandemia.', 'Epidemia é o aumento de casos em uma região; pandemia é a epidemia que se espalha por vários continentes.', ['epidemia numa região', 'pandemia em vários continentes', 'diferença de abrangência'])]],
  ['7', 'Investigar e comparar, por meio de modelos, o processo de transmissão', [
    AS('Formas de transmissão.', ['Contato', 'Ar', 'Vetor'], ['Pele com pele ou objetos', 'Gotículas e aerossóis', 'Animal transmissor'], [0, 1, 2]),
    OR('Ordene a propagação de uma doença.', ['Uma pessoa infectada', 'Contato com outras', 'Muitas se infectam', 'Medidas reduzem a transmissão']),
    O('No modelo, quando mais pessoas se vacinam, o que acontece?', ['A doença circula menos', 'A doença circula mais', 'Nada', 'O vírus cresce'], 0, 'Imunidade coletiva.'),
    DI('Cite duas medidas para reduzir a transmissão de uma doença infecciosa.', 'Higienizar as mãos, vacinar, usar máscara quando indicado, isolar os doentes, ventilar ambientes.', ['primeira medida', 'segunda medida', 'relaciona à transmissão'])]],
  ['7', 'Explicar a importância do sistema imune', [
    AS('Defesas.', ['Pele', 'Glóbulos brancos', 'Anticorpos'], ['Barreira física', 'Combatem invasores', 'Neutralizam agentes específicos'], [0, 1, 2]),
    OR('Ordene a resposta imunológica.', ['Invasor entra no corpo', 'O sistema imune o reconhece', 'Anticorpos são produzidos', 'O invasor é eliminado']),
    O('Pessoas com HIV sem tratamento têm mais infecções. Por quê?', ['O vírus enfraquece o sistema imunológico', 'Têm mais anticorpos', 'Têm mais sangue', 'Têm pele fraca'], 0, 'O HIV ataca células de defesa.'),
    DI('Por que ter uma boa alimentação e dormir bem ajuda o sistema imune?', 'O corpo precisa de nutrientes e descanso para produzir células de defesa e se recuperar.', ['nutrientes', 'sono', 'produção de células de defesa'])]],
  ['7', 'Justificar a importância do sistema imune', [
    AS('Imunidade.', ['Natural', 'Vacinal', 'Memória imunológica'], ['Pelas defesas do corpo', 'Estimulada por vacina', 'Reconhece o agente mais rápido'], [0, 1, 2]),
    OR('Ordene a memória imunológica.', ['Primeiro contato com o agente', 'Células de memória se formam', 'Novo contato', 'Resposta mais rápida e forte']),
    O('Quem teve catapora raramente tem de novo. Por quê?', ['Células de memória', 'Sorte', 'Pele grossa', 'Falta de vírus'], 0, 'O corpo guarda a memória.'),
    DI('O que acontece com o corpo sem sistema imune funcionando?', 'Fica exposto a infecções graves, doenças oportunistas e não se recupera bem.', ['infecções frequentes', 'doenças oportunistas', 'dificuldade de recuperação'])]],
  ['7', 'Reconhecer a vacinação como ação de promoção', [
    AS('História das vacinas.', ['Edward Jenner', 'Oswaldo Cruz', 'Campanhas de vacinação'], ['Primeira vacina (varíola)', 'Combate à febre amarela e varíola no Brasil', 'Reduziram doenças como a poliomielite'], [0, 1, 2]),
    OR('Ordene a história.', ['Jenner testa a vacina da varíola', 'A vacinação se espalha pelo mundo', 'A OMS declara a varíola erradicada (1980)']),
    O('Uma doença erradicada por vacinação é:', ['Poliomielite no Brasil', 'Varíola no mundo', 'Dengue', 'Gripe'], 1, 'A varíola foi erradicada em 1980.'),
    DI('Por que a vacina protege a comunidade além do indivíduo?', 'Quando muitos se vacinam, a doença circula menos e protege quem não pode se vacinar (imunidade coletiva).', ['imunidade coletiva', 'menos circulação', 'protege os mais vulneráveis'])]],
  ['7', 'Investigar a fabricação e o desenvolvimento de vacinas', [
    AS('Tipos.', ['Vírus atenuado', 'Vírus inativado', 'RNA mensageiro'], ['Vivo, enfraquecido', 'Morto', 'Instrução para produzir a proteína'], [0, 1, 2]),
    OR('Ordene o desenvolvimento.', ['Pesquisa', 'Testes pré-clínicos', 'Testes clínicos em fases', 'Aprovação e produção']),
    O('Por que testes clínicos em fases são necessários?', ['Verificar segurança e eficácia', 'Divulgar', 'Ganhar tempo', 'Reduzir o preço'], 0, 'Garantem segurança e eficácia.'),
    DI('Por que uma vacina leva tempo para ser desenvolvida?', 'Precisa de pesquisa, testes de segurança e eficácia em fases, aprovação e produção em larga escala.', ['pesquisa', 'testes em fases', 'aprovação e produção'])]],
  ['7', 'Apresentar a importância do PNI', [
    AS('PNI.', ['PNI', 'Calendário vacinal', 'Zé Gotinha'], ['Programa Nacional de Imunizações', 'Doses por idade', 'Símbolo das campanhas'], [0, 1, 2]),
    OR('Ordene o acesso à vacina.', ['O PNI define o calendário', 'O SUS distribui as vacinas', 'A UBS aplica', 'A caderneta registra']),
    O('As vacinas do PNI são gratuitas para:', ['Todos', 'Só quem paga', 'Só adultos', 'Só crianças'], 0, 'Universal e gratuito.'),
    DI('Por que o PNI é importante?', 'Garante vacinas gratuitas e seguras a toda a população, reduz doenças e mortes e protege a comunidade.', ['gratuito e universal', 'reduz doenças', 'protege a comunidade'])]],
  ['7', 'Defender a vacinação', [
    AS('Argumentos.', ['Dados de eficácia', 'Imunidade coletiva', 'Notícia falsa'], ['Mostram a queda de doenças', 'Protege quem não pode se vacinar', 'Não tem fonte confiável'], [0, 1, 2]),
    OR('Ordene o argumento.', ['Afirmar que vacinas protegem', 'Apresentar dados', 'Citar fontes confiáveis', 'Concluir']),
    O('Uma mensagem diz que vacinas causam doenças graves, sem fonte. O que fazer?', ['Compartilhar', 'Checar em fontes confiáveis', 'Acreditar', 'Ignorar o médico'], 1, 'Checar antes de compartilhar.'),
    DI('Escreva dois argumentos para convencer um colega a se vacinar.', 'A vacina protege você e quem convive com você; reduz doenças e mortes comprovadamente; é segura e testada.', ['primeiro argumento', 'segundo argumento', 'baseado em evidências'])]],
  ['7', 'Comparar e associar programas de saúde pública', [
    AS('Saneamento.', ['Água tratada', 'Esgoto coletado', 'Coleta de lixo'], ['Evita doenças', 'Evita contaminação', 'Evita vetores'], [0, 1, 2]),
    OR('Ordene o ciclo do saneamento.', ['Captação', 'Tratamento', 'Distribuição', 'Coleta e tratamento do esgoto']),
    O('Onde há mais saneamento, ocorrem menos casos de diarreia. Por quê?', ['Menos contaminação', 'Mais calor', 'Mais sol', 'Mais chuva'], 0, 'Saneamento previne doenças.'),
    DI('Por que investir em saneamento é investir em saúde?', 'Água tratada e esgoto coletado evitam doenças e reduzem custos com internações.', ['evita doenças', 'água e esgoto', 'reduz custos'])]],
  ['7', 'Apresentar as características do saneamento básico', [
    AS('Componentes.', ['Abastecimento de água', 'Esgotamento sanitário', 'Drenagem'], ['Água potável', 'Coleta e tratamento do esgoto', 'Escoamento da chuva'], [0, 1, 2]),
    OR('Ordene a desigualdade.', ['Falta investimento', 'Bairros sem rede', 'Mais doenças', 'Menor qualidade de vida']),
    O('Por que o acesso ao saneamento é desigual?', ['Investimento menor em áreas pobres', 'Todos têm igual', 'O clima', 'Falta de chuva'], 0, 'Há desigualdade social.'),
    DI('Como a falta de saneamento afeta a vida em um bairro?', 'Aumenta doenças, contamina rios, alaga ruas e piora a qualidade de vida.', ['doenças', 'contaminação', 'qualidade de vida'])]],
  ['7', 'Investigar e comparar os índices', [
    AS('Indicadores.', ['Mortalidade infantil', 'Expectativa de vida', 'Cobertura vacinal'], ['Óbitos de crianças pequenas', 'Anos de vida esperados', 'Percentual vacinado'], [0, 1, 2]),
    OR('Ordene da pior para a melhor mortalidade infantil.', ['30 por mil', '15 por mil', '8 por mil', '3 por mil']),
    O('O município A tem mortalidade infantil de 25 por mil e o B de 8. Qual tem melhor saúde infantil?', ['A', 'B', 'Iguais', 'Não dá para saber'], 1, 'Menor mortalidade indica melhor saúde.'),
    DI('O que um indicador de saúde mostra e por que é útil?', 'Mostra a situação de saúde da população em números e orienta políticas públicas.', ['mede a saúde', 'compara populações', 'orienta políticas'])]]
];
