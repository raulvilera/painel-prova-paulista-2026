/* 6ª leva: 9º ano (evolução, genética, matéria, ambiente, radiações, astronomia) */
module.exports = (O, AS, OR, DI) => [
  ['9', 'Relacionar evidências fósseis', [
    AS('Evidências.', ['Fósseis', 'Anatomia comparada', 'DNA semelhante'], ['Restos de seres do passado', 'Estruturas parecidas entre espécies', 'Indica parentesco'], [0, 1, 2]),
    OR('Ordene as camadas de rochas, da mais antiga à mais recente.', ['Camada mais profunda', 'Camada intermediária', 'Camada superior']),
    O('Fósseis de peixes com membros parecidos com patas (Tiktaalik) indicam:', ['Transição entre peixes e anfíbios', 'Que peixes nunca mudaram', 'Que anfíbios vieram das aves', 'Nada'], 0, 'Forma de transição.'),
    DI('Como os fósseis sustentam a ideia de ancestralidade comum?', 'Mostram formas intermediárias e mudanças graduais ao longo do tempo, sugerindo que espécies atuais descendem de ancestrais comuns.', ['formas de transição', 'mudanças graduais', 'ancestral comum'])]],
  ['9', 'Analisar a aplicação da genética e da biotecnologia', [
    AS('Aplicações.', ['Transgênicos', 'Terapia gênica', 'Clonagem'], ['Plantas com genes modificados', 'Corrigir genes defeituosos', 'Cópia genética de um organismo'], [0, 1, 2]),
    OR('Ordene a produção de insulina por bactérias.', ['Isolar o gene humano da insulina', 'Inserir em bactérias', 'Bactérias se multiplicam', 'Insulina é extraída']),
    O('Um debate ético sobre alterar genes de embriões se refere a:', ['Respeito, segurança e desigualdade', 'Receita de bolo', 'Clima', 'Futebol'], 0, 'Há questões éticas.'),
    DI('Cite um benefício e um risco da biotecnologia.', 'Benefício: medicamentos e alimentos mais produtivos; risco: impactos ambientais, ética e acesso desigual.', ['benefício', 'risco', 'argumento'])]],
  ['9', 'Relacionar a organização dos átomos', [
    AS('Estados.', ['Sólido', 'Líquido', 'Gasoso'], ['Partículas muito próximas e organizadas', 'Próximas e deslizam', 'Muito afastadas e livres'], [0, 1, 2]),
    OR('Ordene da menor para a maior agitação das partículas.', ['Sólido', 'Líquido', 'Gasoso']),
    O('Ao aquecer um sólido, as partículas...', ['Se agitam mais', 'Param', 'Somem', 'Ficam iguais'], 0, 'Mais energia, mais agitação.'),
    DI('Por que um gás ocupa todo o recipiente?', 'Porque as partículas estão afastadas e se movimentam livremente, espalhando-se pelo espaço disponível.', ['partículas afastadas', 'movimento livre', 'ocupa todo o espaço'])]],
  ['9', 'Analisar evidências da ocorrência de evolução convergente', [
    AS('Evolução.', ['Convergente', 'Divergente', 'Homologia'], ['Estruturas parecidas em grupos distantes', 'Ancestral comum gera formas diferentes', 'Origem comum'], [0, 1, 2]),
    AS('Exemplos.', ['Asa de morcego e de ave', 'Braço humano e nadadeira de baleia', 'Golfinho e tubarão'], ['Analogia', 'Homologia', 'Convergência'], [0, 1, 2]),
    O('Golfinhos (mamíferos) e tubarões (peixes) têm corpo parecido. Isso ocorre porque:', ['Vivem em ambiente semelhante', 'São parentes próximos', 'Têm o mesmo ancestral recente', 'Nenhum motivo'], 0, 'Pressões semelhantes.'),
    DI('Diferencie estruturas homólogas de análogas.', 'Homólogas têm a mesma origem evolutiva, mesmo com funções diferentes; análogas têm funções parecidas, mas origens diferentes.', ['homólogas = mesma origem', 'análogas = mesma função', 'exemplo'])]],
  ['9', 'Reconhecer a função, composição e estrutura do DNA', [
    AS('DNA.', ['DNA', 'Nucleotídeo', 'Gene'], ['Molécula da hereditariedade', 'Unidade formada por açúcar, fosfato e base', 'Trecho que codifica uma característica'], [0, 1, 2]),
    AS('Bases.', ['A', 'T', 'C'], ['Pareia com T', 'Pareia com A', 'Pareia com G'], [0, 1, 2]),
    O('Se uma fita de DNA tem a sequência ATCG, a fita complementar é:', ['TAGC', 'ATCG', 'CGAT', 'UAGC'], 0, 'A-T, T-A, C-G, G-C.'),
    DI('Por que o DNA é chamado de molécula da hereditariedade?', 'Guarda as informações genéticas e é copiado e passado de pais para filhos.', ['guarda informação genética', 'é copiado', 'passa aos descendentes'])]],
  ['9', 'Relacionar a gestão e reciclagem', [
    AS('Destinação.', ['Aterro sanitário', 'Reciclagem', 'Compostagem'], ['Disposição controlada', 'Reaproveita materiais', 'Transforma orgânicos em adubo'], [0, 1, 2]),
    OR('Ordene da melhor prática para a menos desejada.', ['Reduzir', 'Reutilizar', 'Reciclar', 'Aterrar']),
    O('Que resíduo vai na compostagem?', ['Cascas de frutas', 'Vidro', 'Plástico', 'Metal'], 0, 'Orgânicos.'),
    DI('O que é o ciclo de vida de um produto?', 'É o caminho do produto desde a extração das matérias-primas, produção, uso até o descarte ou a reciclagem.', ['extração', 'produção e uso', 'descarte ou reciclagem'])]],
  ['9', 'Aplicar os mecanismos da hereditariedade', [
    AS('Termos.', ['Alelo dominante', 'Alelo recessivo', 'Heterozigoto'], ['Se manifesta com um alelo', 'Só com dois alelos', 'Aa'], [0, 1, 2]),
    O('Cruzamento Aa × Aa. Qual a probabilidade de aa?', ['25%', '50%', '75%', '100%'], 0, '1/4.'),
    O('Cruzamento Aa × Aa. A é dominante. Qual a proporção fenotípica?', ['3 dominantes : 1 recessivo', '1 : 1', 'Todos dominantes', '1 : 3'], 0, '3:1.'),
    DI('Explique por que dois pais de olhos castanhos podem ter um filho de olhos azuis.', 'Se os dois forem heterozigotos (Aa) para o gene, podem passar o alelo recessivo e o filho ser aa, de olhos azuis.', ['pais heterozigotos', 'alelo recessivo', 'combinação aa'])]],
  ['9', 'Analisar os impactos das ações humanas sobre a biodiversidade', [
    AS('Ameaças.', ['Desmatamento', 'Caça ilegal', 'Espécies invasoras'], ['Perde-se o habitat', 'Reduz populações', 'Competem com nativas'], [0, 1, 2]),
    OR('Ordene o efeito em cadeia.', ['Desmatamento', 'Perda de habitat', 'Queda da população', 'Risco de extinção']),
    O('Fragmentos de mata isolados afetam animais porque:', ['Reduzem o espaço e o alimento', 'Aumentam o espaço', 'Não afetam', 'Atraem mais espécies'], 0, 'Fragmentação isola populações.'),
    DI('Por que a perda de uma espécie afeta todo o ecossistema?', 'As espécies se relacionam em cadeias alimentares; a perda pode desequilibrar a cadeia.', ['relações ecológicas', 'cadeia alimentar', 'desequilíbrio'])]],
  ['9', 'Reconhecer o conceito de pegada ecológica', [
    AS('Pegada.', ['Pegada ecológica', 'Biocapacidade', 'Consumo excessivo'], ['Área necessária para sustentar um estilo de vida', 'O que a Terra regenera', 'Aumenta a pegada'], [0, 1, 2]),
    OR('Ordene da menor para a maior pegada.', ['Andar a pé', 'Ônibus', 'Carro', 'Avião']),
    O('Se todos vivessem como um país rico, seriam necessários vários planetas. Isso indica:', ['Consumo acima da capacidade da Terra', 'Que sobra recurso', 'Que a Terra cresce', 'Nada'], 0, 'Passa da biocapacidade.'),
    DI('Cite duas atitudes para reduzir a sua pegada ecológica.', 'Reduzir o consumo, reaproveitar, economizar água e energia, usar transporte sustentável.', ['atitude 1', 'atitude 2', 'efeito'])]],
  ['9', 'Identificar iniciativas para enfrentar problemas ambientais', [
    AS('Iniciativas.', ['Coleta seletiva', 'Horta escolar', 'Captação de chuva'], ['Reduz resíduos', 'Produz alimento local', 'Reaproveita água'], [0, 1, 2]),
    OR('Ordene um projeto na escola.', ['Diagnosticar o problema', 'Planejar a ação', 'Executar', 'Avaliar os resultados']),
    O('Consumo consciente significa:', ['Comprar apenas o necessário', 'Comprar mais', 'Descartar rápido', 'Ignorar o impacto'], 0, 'Evita desperdício.'),
    DI('Proponha uma iniciativa sustentável para a sua escola.', 'Exemplo: coleta seletiva com reaproveitamento do papel e compostagem do lanche.', ['iniciativa viável', 'benefício ambiental', 'passos'])]],
  ['9', 'Analisar os efeitos e aplicações das radiações', [
    AS('Radiação.', ['Raios X', 'Radioterapia', 'Radiação UV'], ['Exames de imagem', 'Trata tumores', 'Pode causar câncer de pele'], [0, 1, 2]),
    OR('Ordene da menor para a maior energia.', ['Rádio', 'Luz visível', 'Ultravioleta', 'Raios X']),
    O('Por que se usa protetor solar?', ['Reduzir os efeitos da radiação UV', 'Ficar mais quente', 'Atrair sol', 'Nada'], 0, 'UV danifica a pele.'),
    DI('Cite um uso benéfico e um risco das radiações ionizantes.', 'Benefício: diagnóstico e tratamento de câncer; risco: danos ao DNA e doenças com exposição excessiva.', ['benefício', 'risco', 'cuidado'])]],
  ['9', 'Relacionar práticas humanas às fontes de poluição da água', [
    AS('Fontes.', ['Esgoto doméstico', 'Agrotóxicos', 'Lixo'], ['Matéria orgânica', 'Contaminação química', 'Resíduos sólidos'], [0, 1, 2]),
    OR('Ordene o caminho da poluição.', ['Descarte irregular', 'Chuva carrega para o rio', 'Rio contaminado', 'Vida aquática prejudicada']),
    O('Peixes mortos após lançamento de esgoto no rio indicam:', ['Falta de oxigênio', 'Excesso de oxigênio', 'Clima', 'Nada'], 0, 'Decomposição consome o oxigênio.'),
    DI('Cite duas ações para manter a água dos rios limpa.', 'Não jogar lixo, tratar esgoto, preservar matas ciliares, reduzir agrotóxicos.', ['ação 1', 'ação 2', 'efeito'])]],
  ['9', 'Comparar a transição do geocentrismo ao heliocentrismo', [
    AS('Modelos.', ['Geocentrismo', 'Heliocentrismo', 'Galileu'], ['Terra no centro', 'Sol no centro', 'Observou luas de Júpiter com telescópio'], [0, 1, 2]),
    OR('Ordene.', ['Ptolomeu (geocentrismo)', 'Copérnico (heliocentrismo)', 'Galileu (observações)', 'Kepler (órbitas elípticas)']),
    O('As luas de Júpiter observadas por Galileu mostraram que:', ['Nem tudo gira em torno da Terra', 'A Terra é o centro de tudo', 'Júpiter é estrela', 'Nada'], 0, 'Evidência contra o geocentrismo.'),
    DI('Por que a ciência mudou do geocentrismo para o heliocentrismo?', 'Novas observações e cálculos explicavam melhor os movimentos dos planetas; a ciência muda conforme evidências.', ['novas evidências', 'melhor explicação', 'ciência se revê'])]],
  ['9', 'Explicar hipóteses sobre a origem do Universo', [
    AS('Origem.', ['Big Bang', 'Nebulosa solar', 'Planetesimais'], ['Origem do Universo', 'Nuvem que formou o Sol', 'Corpos que originaram planetas'], [0, 1, 2]),
    OR('Ordene.', ['Big Bang', 'Formação de galáxias', 'Formação do Sol', 'Formação dos planetas']),
    O('O Big Bang ocorreu há cerca de:', ['13,8 bilhões de anos', '4,6 bilhões de anos', '1 milhão de anos', '100 anos'], 0, 'Idade do Universo.'),
    DI('Que evidência apoia o Big Bang?', 'A expansão do Universo (afastamento das galáxias) e a radiação cósmica de fundo.', ['expansão', 'radiação cósmica de fundo', 'evidências'])]],
  ['9', 'Compreender as características dos planetas rochosos', [
    AS('Planetas.', ['Mercúrio', 'Vênus', 'Marte'], ['Mais próximo do Sol', 'Efeito estufa intenso', 'Planeta vermelho'], [0, 1, 2]),
    OR('Ordene pela distância ao Sol.', ['Mercúrio', 'Vênus', 'Terra', 'Marte']),
    O('Por que a Terra tem água líquida e Vênus não?', ['Distância e atmosfera diferentes', 'Mesmo ambiente', 'Vênus é gasoso', 'Terra é estrela'], 0, 'Temperatura e atmosfera.'),
    DI('Cite duas características dos planetas rochosos.', 'Superfície sólida, menores, mais densos, próximos do Sol, poucos satélites.', ['característica 1', 'característica 2', 'comparação'])]],
  ['9', 'Explicar as principais etapas do ciclo de vida de uma estrela', [
    AS('Ciclo.', ['Nebulosa', 'Gigante vermelha', 'Anã branca'], ['Nuvem de gás e poeira', 'Fase de expansão', 'Núcleo remanescente'], [0, 1, 2]),
    OR('Ordene o ciclo do Sol.', ['Nebulosa', 'Protoestrela', 'Estrela da sequência principal', 'Gigante vermelha', 'Anã branca']),
    O('Estrelas muito massivas terminam como:', ['Supernova', 'Planeta', 'Nuvem', 'Lua'], 0, 'Explodem.'),
    DI('Por que as estrelas nascem e morrem?', 'Nascem da gravidade em nebulosas; brilham pela fusão nuclear e morrem quando o combustível acaba.', ['gravidade em nebulosa', 'fusão nuclear', 'fim do combustível'])]],
  ['9', 'Reconhecer constelações como convenções culturais', [
    AS('Observação.', ['Constelação', 'Telescópio', 'Cruzeiro do Sul'], ['Desenho feito com estrelas', 'Amplia a observação', 'Constelação do hemisfério Sul'], [0, 1, 2]),
    OR('Ordene.', ['Olho nu', 'Luneta de Galileu', 'Telescópio refletor', 'Telescópios espaciais']),
    O('Povos diferentes veem constelações diferentes porque:', ['São convenções culturais', 'As estrelas mudam', 'A Terra para', 'Nada'], 0, 'Dependem da cultura.'),
    DI('Por que constelações variam de cultura para cultura?', 'São imagens que cada povo imaginou ligando estrelas, de acordo com sua cultura.', ['convenção cultural', 'ligam estrelas', 'diferentes povos'])]],
  ['9', 'Valorizar a relevância das constelações', [
    AS('Povos originários.', ['Ema', 'Calendário', 'Chuva'], ['Constelação indígena', 'Orienta plantio e colheita', 'Anunciada pelo céu'], [0, 1, 2]),
    OR('Ordene o uso do céu.', ['Observar', 'Registrar', 'Prever as estações', 'Planejar plantio e pesca']),
    O('Para muitos povos indígenas, o céu serve para:', ['Orientar plantio, pesca e rituais', 'Nada', 'Só enfeite', 'Só ciência'], 0, 'Conhecimento prático.'),
    DI('Por que o conhecimento astronômico dos povos originários deve ser valorizado?', 'É saber acumulado, usado para calendários, agricultura e cultura, e faz parte da história da ciência.', ['saber acumulado', 'uso prático', 'valor cultural'])]],
  ['9', 'Comparar conhecimentos sobre a observação do céu', [
    AS('Planetário.', ['Planetário virtual', 'Hora e local', 'Constelação'], ['Simula o céu', 'Muda o céu visto', 'Padrão de estrelas'], [0, 1, 2]),
    OR('Ordene.', ['Escolher local e data', 'Ver o céu simulado', 'Identificar constelações', 'Comparar com o céu real']),
    O('O céu muda ao longo do ano por causa:', ['Da translação da Terra', 'Da Lua', 'De nuvens', 'Do vento'], 0, 'A Terra se move em torno do Sol.'),
    DI('Que vantagem tem usar um planetário virtual?', 'Simula o céu em qualquer data e lugar, sem depender do clima ou da luz da cidade.', ['qualquer data e lugar', 'independe do clima', 'aprendizado'])]],
  ['9', 'Discutir a viabilidade da vida e da sobrevivência humana', [
    AS('Condições.', ['Água líquida', 'Atmosfera', 'Temperatura'], ['Necessária à vida', 'Protege e fornece oxigênio', 'Não pode ser extrema'], [0, 1, 2]),
    OR('Ordene o que seria preciso para viver em Marte.', ['Chegar com segurança', 'Obter oxigênio e água', 'Proteger de radiação e frio', 'Produzir alimento']),
    O('Por que é difícil viver em Marte?', ['Atmosfera fina, frio e radiação', 'Muito oxigênio', 'Muita chuva', 'Gravidade igual'], 0, 'Condições hostis.'),
    DI('A humanidade deveria priorizar viver fora da Terra? Argumente.', 'Resposta pessoal fundamentada: explorar o espaço traz conhecimento, mas cuidar da Terra é prioridade porque é o único planeta habitável conhecido.', ['argumento claro', 'considera dificuldades', 'cita a Terra'])]],
  ['9', 'Traçar o histórico e a situação atual da exploração espacial', [
    AS('Marcos.', ['Sputnik', 'Apollo 11', 'Telescópio James Webb'], ['Primeiro satélite (1957)', 'Primeira vez na Lua (1969)', 'Observatório espacial atual'], [0, 1, 2]),
    OR('Ordene.', ['Sputnik (1957)', 'Gagarin (1961)', 'Apollo 11 (1969)', 'Estação Espacial (1998)']),
    O('Qual tecnologia do cotidiano veio da exploração espacial?', ['GPS e satélites de comunicação', 'Pão', 'Bicicleta', 'Lápis'], 0, 'Satélites.'),
    DI('Cite dois benefícios da exploração espacial.', 'Previsão do tempo, comunicação, GPS, novos materiais e conhecimento científico.', ['benefício 1', 'benefício 2', 'aplicação'])]]
];
