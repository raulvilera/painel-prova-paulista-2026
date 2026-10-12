# Como escrever as 10 questões de cada chave (Ciências, Ensino Fundamental, SEDUC-SP / SARESP)

Para CADA chave do arquivo de entrada: 10 questões para o ano em `serie`. As 5 primeiras OBJETIVAS, as 5 últimas DISSERTATIVAS.
Progressão: obj 1–2 e dis 1–2 = reconhecer/identificar; obj 3–4 e dis 3 = aplicar/relacionar; obj 5 e dis 4–5 = analisar/justificar.

## Contextualização (obrigatório)
- Todo enunciado parte de uma SITUAÇÃO CONCRETA e específica (2 a 4 linhas, com dados, nomes, lugares, observações): cozinha de casa, feira, horta da escola, quintal, rio ou córrego da cidade, notícia local, jogo/esporte, experimento de laboratório, UBS, trânsito, clima, etc. Use personagens (ex.: "Marina, aluna do 7º ano…"), medidas, fatos plausíveis do cotidiano paulista.
- O conceito é APLICADO à situação; não pergunte definição solta ("O que é X?", "Qual é a função de Y?" sem contexto).
- O comando pede que o aluno interprete/decida a partir da situação ("Com base nos dados…", "O que explica o resultado observado por…").
- Nada fora do contexto do descritor; cientificamente correto; linguagem simples da idade.

## Alternativas (obrigatório: a resposta NÃO pode ser evidente)
- 4 alternativas com MESMA estrutura gramatical e TAMANHO parecido (diferença máxima de ~20% de caracteres). A correta NÃO pode ser a mais longa nem a mais detalhada; varie qual é a mais longa.
- Todas plausíveis; distratores = erros conceituais reais e comuns dos alunos (confundir causa e efeito, generalizar demais, trocar conceitos próximos, ideia do senso comum), escritos com o mesmo vocabulário técnico da correta.
- Proibido: "todas as anteriores", "nenhuma", absolutos (sempre, nunca, apenas, somente, todos, nenhum) em distratores quando a correta não os usa; distrator absurdo ou engraçado; a correta ser a única que repete palavras do enunciado.
- Distribua a posição da correta (0,1,2,3) de forma equilibrada entre as 5 objetivas.
- Sem letras (A, B…) dentro das alternativas.
- `explicacao`: 1–2 frases dizendo por que a correta está certa e (se couber) qual erro os distratores representam.

## Dissertativas
- Também parte de situação concreta; pedir "explique", "justifique", "compare" com base na situação. `ref` = resposta esperada completa e curta; `conceitos` = 2–4 ideias-chave.

## Figura (infográfico) — em pelo menos 7 das 10 questões
Um dos formatos: {"tipo":"tabela","titulo":"..","colunas":[2 a 4],"linhas":[2 a 6 linhas, mesmo nº de colunas]} | {"tipo":"barras","titulo":"..","unidade":"..","itens":[{"rotulo":"..","valor":N>=0}, 2 a 6]} | {"tipo":"etapas","titulo":"..","etapas":[3 a 6]}.
A figura traz SÓ dados/observações/sequência da situação do enunciado; NUNCA a resposta, o conceito pedido, conclusão, nem palavras da alternativa correta/ref/conceitos. Rótulos neutros e curtos. Dados fictícios: título começa com "Dados do experimento" ou "Registro de …". Use `null` só quando a figura entregaria a resposta.

## Formato de saída
obj: {"tipo":"obj","enunciado":"..","comando":"..","figura":F|null,"alts":["","","",""],"correta":0-3,"explicacao":".."}
dis: {"tipo":"dis","enunciado":"..","comando":"..","figura":F|null,"ref":"..","conceitos":[".."]}
Arquivo de saída = {chave: [10 questões]} em JSON UTF-8, com exatamente as chaves da entrada. Escreva em lotes (scripts que acumulam) e valide com node ao final: 5 obj + 5 dis por chave, 4 alts, correta 0–3, e a correta não é a alternativa mais longa em mais de 2 das 5 objetivas.
