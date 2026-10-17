/* 5ª leva: 8º ano (Lua, plantas, saúde, reprodução, energia e eletricidade) */
module.exports = (O, AS, OR, DI) => [
  ['8', 'Relacionar os movimentos da Lua', [
    AS('A Lua gira em torno da Terra.', ['Translação da Lua', 'Rotação da Lua', 'Face oculta'], ['Cerca de 27 dias ao redor da Terra', 'Gira sobre si no mesmo tempo da translação', 'Parte que nunca vemos da Terra'], [0, 1, 2]),
    OR('Ordene as fases da Lua a partir da cheia.', ['Lua cheia', 'Quarto minguante', 'Lua nova', 'Quarto crescente']),
    O('Vemos sempre a mesma face da Lua. Por quê?', ['Rotação e translação têm a mesma duração', 'A Lua não gira', 'A Terra não gira', 'O Sol ilumina só um lado'], 0, 'Rotação sincronizada com a translação.'),
    DI('A Lua tem um lado escuro que nunca vemos? Explique.', 'Não há lado permanentemente escuro: a face oculta recebe luz do Sol; apenas nunca está voltada para a Terra.', ['a face oculta recebe luz', 'rotação sincronizada', 'só não é vista da Terra'])]],
  ['8', 'Comparar os processos reprodutivos das plantas', [
    AS('Partes da flor.', ['Estame', 'Pistilo', 'Pétalas'], ['Produz pólen', 'Contém o ovário e os óvulos', 'Atraem polinizadores'], [0, 1, 2]),
    OR('Ordene a reprodução de uma planta com flor.', ['Polinização', 'Fecundação', 'Formação do fruto e das sementes', 'Germinação']),
    O('A batata gera novas plantas por brotos do caule. Que tipo de reprodução é?', ['Sexuada', 'Assexuada', 'Por sementes', 'Por esporos'], 1, 'Propagação vegetativa é assexuada.'),
    DI('Qual a importância dos polinizadores para a reprodução das plantas?', 'Transportam o pólen entre flores, permitindo a fecundação e a formação de frutos e sementes.', ['transportam o pólen', 'permitem fecundação', 'formam frutos e sementes'])]],
  ['8', 'Identificar variáveis meteorológicas', [
    AS('Instrumentos.', ['Termômetro', 'Barômetro', 'Pluviômetro'], ['Temperatura', 'Pressão atmosférica', 'Chuva'], [0, 1, 2]),
    AS('Instrumentos II.', ['Anemômetro', 'Higrômetro', 'Previsão do tempo'], ['Velocidade do vento', 'Umidade do ar', 'Combina vários dados'], [0, 1, 2]),
    O('A pressão atmosférica cai rapidamente e o céu fica escuro. O que provavelmente vem?', ['Tempo instável e chuva', 'Tempo seco', 'Neve no verão', 'Nada'], 0, 'Queda de pressão costuma preceder tempestades.'),
    DI('Por que a previsão do tempo é importante?', 'Ajuda a planejar atividades, proteger a agricultura e evitar desastres como enchentes.', ['planejamento', 'agricultura', 'prevenção de desastres'])]],
  ['8', 'Associar os efeitos da poluição atmosférica', [
    AS('Poluentes e efeitos.', ['Material particulado', 'Monóxido de carbono', 'Ozônio'], ['Irrita vias aéreas', 'Reduz o oxigênio no sangue', 'Irrita olhos e pulmões'], [0, 1, 2]),
    OR('Ordene o efeito do ar poluído.', ['Poluentes no ar', 'Inalados', 'Inflamam as vias respiratórias', 'Asma e bronquite se agravam']),
    O('Em dias de ar muito poluído, crianças e idosos devem...', ['Evitar atividades ao ar livre', 'Correr ao ar livre', 'Ignorar', 'Ficar na rua'], 0, 'São mais vulneráveis.'),
    DI('Cite duas atitudes para reduzir a poluição do ar.', 'Usar transporte coletivo, bicicleta, não queimar lixo, manter veículos regulados.', ['primeira atitude', 'segunda atitude', 'relaciona a menos poluentes'])]],
  ['8', 'Reconhecer a função dos nutrientes', [
    AS('Nutrientes.', ['Carboidratos', 'Proteínas', 'Vitaminas'], ['Fornecem energia', 'Constroem e reparam tecidos', 'Regulam funções'], [0, 1, 2]),
    AS('Alimentos.', ['Arroz', 'Feijão', 'Laranja'], ['Carboidrato', 'Proteína', 'Vitamina C'], [0, 1, 2]),
    O('Uma criança em crescimento precisa de mais...', ['Proteínas e cálcio', 'Só doces', 'Só gordura', 'Nenhum nutriente'], 0, 'Para construir tecidos e ossos.'),
    DI('Por que a água é considerada um nutriente essencial?', 'Participa de todas as reações, transporta substâncias e regula a temperatura do corpo.', ['participa de reações', 'transporta', 'regula a temperatura'])]],
  ['8', 'Comparar os diferentes tipos de reprodução', [
    AS('Tipos.', ['Assexuada', 'Sexuada', 'Variabilidade'], ['Um genitor; descendentes iguais', 'Dois genitores; descendentes diferentes', 'Vantagem da reprodução sexuada'], [0, 1, 2]),
    OR('Ordene a reprodução sexuada.', ['Formação dos gametas', 'Fecundação', 'Zigoto', 'Desenvolvimento do embrião']),
    O('Em ambiente estável, qual a vantagem da reprodução assexuada?', ['Rapidez e muitos descendentes', 'Maior variabilidade', 'Mais genitores', 'Menos descendentes'], 0, 'Rápida e eficiente.'),
    DI('Por que a reprodução sexuada favorece a sobrevivência da espécie?', 'Gera variabilidade genética, com indivíduos diferentes; alguns resistem melhor a doenças e mudanças.', ['gera variabilidade', 'adaptação a mudanças', 'resistência a doenças'])]],
  ['8', 'Diferenciar métodos contraceptivos', [
    AS('Métodos.', ['Preservativo', 'Pílula', 'DIU'], ['Evita gravidez e protege contra ISTs', 'Hormonal; só evita a gravidez', 'Colocado no útero'], [0, 1, 2]),
    OR('Ordene o uso do preservativo masculino.', ['Verificar a validade', 'Abrir com cuidado', 'Colocar antes da relação', 'Descartar após o uso']),
    O('Qual método é o único que protege contra gravidez e ISTs?', ['Pílula', 'Preservativo', 'DIU', 'Tabelinha'], 1, 'Preservativo.'),
    DI('Por que não basta um só método para se prevenir de gravidez e de ISTs?', 'Porque a maioria dos métodos evita só a gravidez; o preservativo protege de ambos, e o uso combinado aumenta a proteção.', ['maioria só evita gravidez', 'preservativo protege dos dois', 'orientação médica'])]],
  ['8', 'Diferenciar os movimentos da Terra', [
    AS('Movimentos.', ['Rotação', 'Translação', 'Precessão'], ['24 horas; dia e noite', 'Um ano; estações', 'Oscilação lenta do eixo, milhares de anos'], [0, 1, 2]),
    OR('Ordene do mais curto ao mais longo.', ['Rotação (24 h)', 'Translação (365 dias)', 'Precessão (cerca de 26 mil anos)']),
    O('Qual movimento da Terra explica o dia e a noite?', ['Rotação', 'Translação', 'Precessão', 'Nutação'], 0, 'Rotação.'),
    DI('Diferencie rotação de translação.', 'Rotação é o giro da Terra em torno do próprio eixo (24 h); translação é o movimento em volta do Sol (1 ano).', ['rotação em torno do eixo', 'translação em volta do Sol', 'tempos diferentes'])]],
  ['8', 'Compreender o conceito de energia', [
    AS('Formas de energia.', ['Cinética', 'Térmica', 'Elétrica'], ['Do movimento', 'Do calor', 'Das cargas em movimento'], [0, 1, 2]),
    AS('Onde está a energia.', ['Ventilador ligado', 'Aquecedor', 'Lâmpada acesa'], ['Cinética', 'Térmica', 'Luminosa'], [0, 1, 2]),
    O('Um carro em movimento tem:', ['Energia cinética', 'Só potencial', 'Nenhuma', 'Só térmica'], 0, 'Energia do movimento.'),
    DI('Dê dois exemplos de energia no cotidiano.', 'Elétrica no chuveiro, luminosa na lâmpada, térmica no fogão, cinética na bicicleta.', ['exemplo 1', 'exemplo 2', 'forma correta de energia'])]],
  ['8', 'Diferenciar fontes renováveis e não renováveis', [
    AS('Fontes.', ['Solar', 'Eólica', 'Petróleo'], ['Renovável', 'Renovável', 'Não renovável'], [0, 1, 2]),
    OR('Ordene da fonte mais poluente à menos poluente.', ['Carvão mineral', 'Petróleo', 'Gás natural', 'Solar']),
    O('O Brasil tem muita energia hidrelétrica. Por quê?', ['Muitos rios', 'Poucos rios', 'Muito petróleo', 'Pouco vento'], 0, 'Grande disponibilidade de rios.'),
    DI('Por que é preciso uma transição para fontes renováveis?', 'Fósseis são finitos e poluem; as renováveis reduzem emissões e são inesgotáveis.', ['fósseis finitos e poluentes', 'renováveis limpas', 'redução de impacto'])]],
  ['8', 'Discutir como a energia se transforma', [
    AS('Transformação.', ['Lâmpada', 'Liquidificador', 'Painel solar'], ['Elétrica → luminosa', 'Elétrica → cinética', 'Luminosa → elétrica'], [0, 1, 2]),
    OR('Ordene a transformação de energia em uma hidrelétrica.', ['Água no alto (potencial)', 'Cai (cinética)', 'Gira a turbina', 'Gerador produz eletricidade']),
    O('Em uma lâmpada, parte da energia elétrica vira calor. O que isso mostra?', ['A energia se perde', 'A energia se conserva, mas parte vira calor', 'A lâmpada cria energia', 'Nada'], 1, 'Conservação da energia.'),
    DI('Explique o princípio da conservação da energia com um exemplo.', 'A energia não se cria nem se destrói, apenas se transforma; ex.: queda de água → energia elétrica.', ['não se cria nem se destrói', 'transforma-se', 'exemplo'])]],
  ['8', 'Compreender a importância das energias renováveis', [
    AS('Prós e contras.', ['Solar', 'Eólica', 'Hidrelétrica'], ['Depende do sol', 'Depende do vento e causa ruído', 'Alaga grandes áreas'], [0, 1, 2]),
    OR('Ordene a energia eólica.', ['O vento gira as pás', 'O gerador produz eletricidade', 'A energia é distribuída']),
    O('Qual vantagem comum às renováveis?', ['Não se esgotam', 'São sempre baratas', 'Funcionam em qualquer lugar', 'Não têm impacto'], 0, 'Recurso inesgotável.'),
    DI('Escolha uma fonte renovável e dê uma vantagem e uma limitação.', 'Solar: limpa, mas depende do sol e da área; eólica: limpa, depende do vento.', ['fonte', 'vantagem', 'limitação'])]],
  ['8', 'Explicar a corrente elétrica', [
    AS('Grandezas.', ['Tensão (V)', 'Corrente (A)', 'Resistência (Ω)'], ['Volts', 'Ampères', 'Ohms'], [0, 1, 2]),
    OR('Ordene as etapas para calcular I = V/R.', ['Identificar V e R', 'Dividir V por R', 'Obter I em A']),
    O('Um resistor de 10 Ω está sob 20 V. Qual a corrente? (V = R · I)', ['0,5 A', '2 A', '200 A', '30 A'], 1, '20/10 = 2 A.'),
    DI('O que acontece com a corrente se a resistência aumenta e a tensão não muda?', 'A corrente diminui, pois I = V/R.', ['I = V/R', 'corrente diminui', 'resistência maior'])]],
  ['8', 'Analisar corrente alternada', [
    AS('Tipos de corrente.', ['Contínua', 'Alternada', 'Gerador'], ['Pilha e bateria', 'Tomada da casa', 'Converte movimento em eletricidade'], [0, 1, 2]),
    OR('Ordene o caminho da energia.', ['Usina', 'Transformador elevador', 'Linhas de transmissão', 'Transformador abaixador', 'Casa']),
    O('Por que se usa alta tensão nas linhas de transmissão?', ['Reduz perdas de energia', 'Aumenta o custo', 'Evita o gerador', 'Não faz diferença'], 0, 'Menor corrente, menos perdas.'),
    DI('Diferencie corrente contínua de corrente alternada.', 'Na contínua, o sentido é sempre o mesmo (pilha); na alternada, o sentido muda periodicamente (tomada).', ['contínua sentido constante', 'alternada inverte o sentido', 'exemplos'])]],
  ['8', 'Explicar e exemplificar materiais condutores', [
    AS('Materiais.', ['Cobre', 'Borracha', 'Água com sal'], ['Condutor', 'Isolante', 'Conduz íons'], [0, 1, 2]),
    AS('Aplicações.', ['Fio', 'Capa do fio', 'Luva de eletricista'], ['Cobre', 'Plástico', 'Borracha'], [0, 1, 2]),
    O('Por que os fios têm capa plástica?', ['Isolar e evitar choques', 'Enfeitar', 'Conduzir', 'Esfriar'], 0, 'O plástico isola.'),
    DI('O que diferencia um condutor de um isolante?', 'No condutor, os elétrons se movem com facilidade; no isolante, não.', ['elétrons livres', 'isolante dificulta', 'exemplos'])]],
  ['8', 'Apresentar a matriz energética', [
    AS('Matriz.', ['Matriz energética', 'Matriz elétrica', 'Hidrelétrica'], ['Todas as fontes de energia', 'Fontes da eletricidade', 'Principal fonte elétrica do Brasil'], [0, 1, 2]),
    OR('Ordene o percurso da energia.', ['Geração na usina', 'Transmissão', 'Distribuição', 'Consumo']),
    O('A matriz elétrica brasileira é mais renovável que a mundial. Por quê?', ['Muitas hidrelétricas', 'Muito carvão', 'Pouco vento', 'Só nuclear'], 0, 'Forte presença de hidrelétricas.'),
    DI('Por que diversificar a matriz energética é importante?', 'Evita depender de uma fonte só, dá segurança e reduz impactos.', ['reduz dependência', 'segurança', 'menos impacto'])]],
  ['8', 'Apresentar os principais componentes de um circuito', [
    AS('Componentes.', ['Fonte', 'Condutor', 'Interruptor'], ['Fornece energia', 'Leva a corrente', 'Abre e fecha o circuito'], [0, 1, 2]),
    OR('Ordene o acendimento de uma lâmpada.', ['Ligar a fonte', 'Fechar o interruptor', 'Corrente passa', 'A lâmpada acende']),
    O('Se o interruptor está aberto, a lâmpada...', ['Apaga', 'Acende mais', 'Esquenta', 'Explode'], 0, 'O circuito fica aberto.'),
    DI('Por que um circuito precisa estar fechado?', 'Porque a corrente só circula em um caminho completo, da fonte e de volta a ela.', ['caminho completo', 'corrente circula', 'aberto não funciona'])]],
  ['8', 'Aplicar as leis de Kirchhoff', [
    AS('Circuitos.', ['Série', 'Paralelo', 'Resistência equivalente'], ['Mesma corrente', 'Mesma tensão', 'Soma em série'], [0, 1, 2]),
    O('Duas resistências de 4 Ω e 6 Ω em série. Qual a equivalente?', ['2,4 Ω', '10 Ω', '24 Ω', '5 Ω'], 1, 'Soma: 10 Ω.'),
    O('Em um circuito em paralelo de 12 V, com resistores de 6 Ω e 12 Ω, qual a corrente no de 6 Ω?', ['2 A', '1 A', '0,5 A', '6 A'], 0, '12/6 = 2 A.'),
    DI('Em casa, as lâmpadas são ligadas em série ou paralelo? Justifique.', 'Em paralelo: cada lâmpada recebe a mesma tensão e funciona independentemente.', ['em paralelo', 'mesma tensão', 'independência'])]],
  ['8', 'Conscientizar sobre os perigos da eletricidade', [
    AS('Cuidados.', ['Mão molhada', 'Fio descascado', 'Sobrecarga'], ['Risco de choque', 'Risco de choque e incêndio', 'Superaquece'], [0, 1, 2]),
    OR('Ordene o que fazer diante de um choque.', ['Desligar a chave geral', 'Afastar a vítima com material isolante', 'Chamar o socorro', 'Primeiros socorros']),
    O('Por que não ligar muitos aparelhos em uma tomada com benjamim?', ['Sobrecarga e incêndio', 'Economiza', 'Aumenta a luz', 'Não tem risco'], 0, 'Risco de superaquecimento.'),
    DI('Cite duas boas práticas de segurança elétrica.', 'Não mexer em aparelhos ligados, manter fios íntegros, evitar sobrecarga, usar aterramento.', ['prática 1', 'prática 2', 'relaciona a risco'])]],
  ['8', 'Compreender a função dos componentes de um circuito elétrico por meio de simulação', [
    AS('Simulação.', ['Bateria', 'Resistor', 'Chave'], ['Fornece tensão', 'Limita a corrente', 'Liga e desliga'], [0, 1, 2]),
    OR('Ordene o experimento no simulador.', ['Montar o circuito', 'Fechar a chave', 'Observar a lâmpada', 'Alterar a tensão e comparar']),
    O('No simulador, aumentar a tensão fez a lâmpada brilhar mais. Por quê?', ['A corrente aumentou', 'A resistência aumentou', 'A chave quebrou', 'A lâmpada é maior'], 0, 'V maior, I maior.'),
    DI('O que a simulação ajuda a entender?', 'Permite testar situações com segurança, ver como tensão e resistência alteram a corrente.', ['teste seguro', 'relaciona V, R e I', 'visualização'])]],
  ['8', 'Compreender a função dos componentes e comparar circuitos', [
    AS('Circuitos.', ['Série', 'Paralelo', 'Misto'], ['Um só caminho', 'Vários caminhos', 'Combina os dois'], [0, 1, 2]),
    OR('Ordene o que acontece se uma lâmpada queima em série.', ['A lâmpada queima', 'O circuito abre', 'A corrente para', 'Todas apagam']),
    O('Em paralelo, se uma lâmpada queima:', ['As outras continuam acesas', 'Todas apagam', 'Todas brilham mais', 'Nenhuma muda'], 0, 'Cada ramo é independente.'),
    DI('Compare a ligação em série e em paralelo.', 'Em série há um só caminho e a corrente é a mesma; em paralelo há ramos e a tensão é a mesma.', ['série: um caminho', 'paralelo: ramos', 'diferença correta'])]],
  ['8', 'Explicar corrente, tensão e potência elétrica', [
    AS('Potência.', ['Potência', 'Energia', 'Chuveiro'], ['Watt (W)', 'kWh', 'Alta potência'], [0, 1, 2]),
    O('Um aparelho de 100 V consome 2 A. Qual a potência? (P = V · I)', ['50 W', '102 W', '200 W', '20 W'], 2, '100 · 2 = 200 W.'),
    O('Qual aparelho costuma consumir mais energia?', ['Chuveiro elétrico', 'Lâmpada LED', 'Carregador', 'Relógio'], 0, 'Alta potência.'),
    DI('Por que o chuveiro elétrico pesa na conta de luz?', 'Tem potência alta e é usado por tempo considerável; energia = potência × tempo.', ['potência alta', 'tempo de uso', 'energia = P × t'])]],
  ['8', 'Avaliar o gasto mensal de eletrodomésticos', [
    AS('Cálculo.', ['Energia (kWh)', 'Potência (kW)', 'Selo A'], ['Potência × tempo', 'Potência em quilowatts', 'Mais eficiente'], [0, 1, 2]),
    O('Um ferro de 1 kW é usado 2 h por dia durante 10 dias. Quantos kWh?', ['2', '10', '20', '200'], 2, '1·2·10 = 20 kWh.'),
    O('Com R$ 0,80 por kWh, quanto custam 20 kWh?', ['R$ 8,00', 'R$ 16,00', 'R$ 20,00', 'R$ 0,80'], 1, '20 × 0,80 = R$ 16,00.'),
    DI('Por que escolher aparelhos com selo A de eficiência?', 'Consomem menos energia para o mesmo serviço, o que reduz a conta e o impacto ambiental.', ['consomem menos', 'reduz a conta', 'menor impacto'])]],
  ['8', 'Interpretar uma conta de luz', [
    AS('Conta.', ['kWh', 'Bandeira vermelha', 'Impostos'], ['Consumo', 'Tarifa mais cara', 'Valores cobrados na conta'], [0, 1, 2]),
    OR('Ordene as bandeiras da mais barata para a mais cara.', ['Verde', 'Amarela', 'Vermelha 1', 'Vermelha 2']),
    O('Por que a bandeira vermelha encarece a conta?', ['Gera-se energia com usinas mais caras', 'O sol está mais forte', 'O consumo caiu', 'Há feriado'], 0, 'Usinas térmicas são mais caras.'),
    DI('Cite duas práticas para economizar energia em casa.', 'Apagar luzes, usar lâmpadas LED, tomar banhos curtos, desligar aparelhos em standby.', ['prática 1', 'prática 2', 'efeito na conta'])]],
  ['8', 'Analisar o consumo de energia elétrica de uma residência', [
    AS('Consumo.', ['Geladeira', 'Chuveiro', 'TV'], ['Liga o dia todo', 'Alta potência por pouco tempo', 'Uso moderado'], [0, 1, 2]),
    OR('Ordene dos maiores aos menores consumidores típicos.', ['Chuveiro elétrico', 'Ar-condicionado', 'Geladeira', 'Lâmpada LED']),
    O('Substituir lâmpadas incandescentes por LED...', ['Reduz o consumo', 'Aumenta o consumo', 'Não muda', 'Não acende'], 0, 'LED é mais eficiente.'),
    DI('Como um simulador ajuda a economizar energia?', 'Mostra quais aparelhos mais consomem e permite testar mudanças de hábito antes de aplicá-las.', ['identifica os maiores consumos', 'testa mudanças', 'ajuda a decidir'])]],
  ['8', 'Discutir o papel de consumidores, governos e empresas', [
    AS('Papéis.', ['Consumidor', 'Governo', 'Empresa'], ['Consome com consciência', 'Cria leis e incentivos', 'Produz com menor impacto'], [0, 1, 2]),
    OR('Ordene a cadeia da mudança.', ['Informação', 'Conscientização', 'Mudança de hábito', 'Menor impacto']),
    O('Quem pode criar leis para reduzir a poluição?', ['Governo', 'Só o consumidor', 'Só a escola', 'Ninguém'], 0, 'Governos legislam.'),
    DI('O que cada grupo pode fazer por uma sociedade sustentável?', 'Consumidores reduzem e reaproveitam; empresas produzem com menos impacto; governos legislam e fiscalizam.', ['consumidores', 'empresas', 'governos'])]]
];
