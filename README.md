# Painel Prova Paulista 2026

Painel interativo (HTML/CSS/JavaScript, sem dependências) com os resultados da Prova Paulista 2026 em Ciências, Biologia e Química, por turma e por aluno, nos 1º, 2º e 3º bimestres.

- **Aluno:** pizzas 3D por bimestre, evolução do aluno contra a média da turma e níveis de proficiência.
- **Descritores não atingidos:** por bimestre, com a ação sugerida e o link da aula do CMSP.
- **Turma por nível:** distribuição dos alunos por nível e lista de nomes.
- **Panorama:** média de todas as turmas e componentes.

Clique em qualquer painel para ampliar.

## Dados

Fonte: Escola Total / SEDUC-SP (painéis da Prova Paulista 2026), coletados em 03/10/2026. Níveis por faixa de acertos no componente: Abaixo do Básico < 25%, Básico 25–49%, Adequado 50–74%, Avançado ≥ 75% (critério de trabalho, não é nível oficial).

**Uso interno.** Os dados (nomes e resultados de alunos menores de idade, LGPD) **não ficam neste repositório**: estão no Supabase (projeto `painel-prova-paulista`, tabela `painel_dados`), com Row Level Security liberando a leitura só para `vilera@prof.educacao.sp.gov.br`.

## Acesso

Tela de login com e-mail institucional e senha (Supabase Auth). No primeiro acesso, ou se esquecer a senha, use "receber link no e-mail": o link chega no e-mail institucional e abre a tela para criar a senha.

## Deploy

Site estático (`index.html`) publicado no Vercel a cada push na branch `main`.

## Plano de recomposição

O painel "Plano de recomposição · Guias Priorizados" cruza, para cada turma e componente, os descritores da Prova Paulista com acerto da turma abaixo de 50% com as aprendizagens dos Guias Priorizados 2026 (Ciências AF, Biologia EM, Química EM). Mostra habilidade, objetos de conhecimento, estratégias e pré-requisitos; agrupa os alunos pelo nível do 3º bimestre; e monta um cronograma semanal até a prova de referência (SARESP 2026 para 6º–9º ano, Provão Paulista Seriado para o Ensino Médio). As informações dos Guias ficam no próprio HTML (não têm dados de alunos); os nomes continuam vindo do Supabase após o login.

## Aplicativo (PWA)

O painel pode ser instalado como aplicativo (Android, Chrome/Edge no computador e iPhone pelo Safari → Compartilhar → Adicionar à Tela de Início). Arquivos: `manifest.webmanifest`, `sw.js` e ícones. O service worker guarda apenas a estrutura do app; as respostas do Supabase (dados dos alunos) nunca são guardadas no aparelho.

## Planejamento de aulas

O painel "Planejamento de aulas" distribui as aulas do material digital do 4º bimestre pelo horário do professor (Tarde, Noite e Manhã/2ª DS), de 05/10 a 18/12/2026, pulando feriados e dias sem aula do calendário e sinalizando SARESP, Provão Paulista e semanas de recuperação. Mostra a semana, a sequência de cada turma (com "Não houve aula" para empurrar a sequência e "a turma está na aula nº") e gera o plano quinzenal no modelo da escola, para imprimir ou salvar em PDF. Os ajustes ficam na tabela `planejamento_ajustes` do Supabase, com acesso só do e-mail do professor.

## Atividade individual adaptada (PEI)

Na "Atividade individual" (6º ao 9º ano), o aluno com Plano Educacional Individualizado abre a versão adaptada pelo fluxo normal (turma + nome): nenhuma lista mostra quem tem PEI. As questões e os gabaritos ficam só no servidor (`api/_pei.js`), sem diagnóstico; a tela recebe apenas opções de acessibilidade: uma questão por vez, agenda visual, letra maior, leitura em voz alta, ditado de resposta, pausas curtas, glossário e retorno acolhedor. Há questões de ligar/completar e de colocar em ordem, com acerto parcial. Para incluir ou ajustar um aluno, edite `api/_pei.js` (perfil `P.*` + lista de questões). O Ensino Médio (2ª série) ainda não tem essa versão.

### Imagens das atividades adaptadas (Nano Banana)

As questões adaptadas têm uma ilustração (sem texto) gerada automaticamente pelo Nano Banana (API Gemini): na primeira vez que alguém abre a questão, a imagem é gerada, guardada na tabela `indiv_banco` (chave `img:<id>`) e daí em diante só é servida. Não precisa gerar nada à mão (a página `/atividade-individual/preparar/` tem um botão opcional para pré-gerar tudo). Usa a `GEMINI_API_KEY` da Vercel; o modelo pode ser trocado com `MODELO_IMAGEM` (padrão `gemini-nano-banana-2.1`; reserva `gemini-2.5-flash-image`). Se a geração falhar, a questão aparece sem imagem.

### Imagens das atividades PEI: banco livre (padrão)
As fotos vêm do Wikimedia Commons (licenças livres, com crédito do autor na legenda), buscadas automaticamente na primeira abertura e guardadas em `indiv_banco` (`img:<k>`). Não exige chave nem faturamento. Para usar o Nano Banana quando não houver foto, defina `IMAGENS_IA=1` (exige chave Gemini com faturamento).
