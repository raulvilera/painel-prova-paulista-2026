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

### Imagens das atividades PEI
Cada questão adaptada tem uma lista de artigos da Wikipédia (em `api/_pei.js`, mapa `IMGS`); o servidor usa a imagem de abertura do primeiro artigo com foto de licença livre (Commons), guarda em `indiv_banco` (`img:<k>`) e mostra o crédito do autor. Sem chave nem cota. Para trocar a foto de uma questão, altere os títulos da lista.

### Simulado SARESP adaptado (PEI, Fundamental)
`api/_pei-sim.js` tem o Simulado adaptado de cada aluno com PEI (mesmas habilidades do Simulado da série, formatos e acessibilidade do PEI). Na página do Simulado, ao escolher o nome, o servidor responde só "adaptada: sim/não" (`/api/individual?acao=adaptada&modo=simulado`); quem tem versão é levado a `/atividade-individual/?modo=simulado`. As respostas ficam em `indiv_respostas` com status "… · simulado adaptado". O projeto do Simulado precisa do rewrite `/api/individual` (já em `simulado/vercel.json`).


## 8º Ano A: lista oficial e aluna em russo
- `api/_roster.js`: lista oficial (nº e nome) do 8º A, usada no menu de nomes da atividade individual; `simulado/index.html` tem a mesma lista (`R8A`).
- Zlata: `api/_pei-ru.js` (atividade e Simulado em russo, cada questão com espelho em português `pt`), `atividade-individual/i18n-ru.js` (interface em russo). A IA corrige pelo espelho em português e o professor recebe a resposta traduzida + original em russo.
- Simulado: o Apps Script (`apps-script/simulado/ARQUIVO-UNICO.gs`) também precisa da lista nova (reimplantar; se existir a aba `Alunos_Simulado`, atualizá-la).

## Missão SARESP 3D (simulador)

Pasta `missao-saresp/`, aberta pelo botão "🧊 Missão SARESP 3D" do menu de atividades. Simulador 3D de Ciências (6º ao 9º ano) no mesmo padrão do Microvida 3D, voltado à preparação para o SARESP e à recuperação do 2º semestre, com base no Guia do Currículo Priorizado 2026 e no Mapa SARESP da escola.

- **Explorar:** 10 modelos 3D (Sol-Terra-Lua, camadas da Terra, célula animal, célula vegetal, microrganismos, níveis de organização, neurônio, circuito elétrico, Sistema Solar, modelo atômico).
- **Simular:** fases da Lua e eclipses, estações do ano, movimento aparente do Sol e sombras, efeito estufa, seleção natural, consumo de energia, biomas brasileiros, classifique a célula.
- **Trilha SARESP:** AEs/habilidades por ano, descritores "De olho no SARESP", % de acerto da escola e atalhos para modelos, simulações, quiz e os simuladores externos.
- **Quiz:** Simulado SARESP (12 questões) e Recuperação (3º e 4º bimestres), com as faixas de desempenho do painel.
- **XP e patentes** (Recruta, Explorador, Cientista, Mentor), salvos só no aparelho. Nenhum dado de aluno é enviado.

- **Turma e aluno:** ao abrir, o aluno escolhe a turma (6º A a 9º B) e o nome numa lista (nomes vindos de `/api/atividade-quimica`, só nº e nome). A lateral passa a mostrar, em abas verticais, os temas do ano da turma em dois grupos: SARESP e Recuperação semestral, cada um com atalhos para os modelos, simulações, simuladores externos e o quiz do tema.
- **Resultados:** cada quiz (por tema, Simulado SARESP, Recuperação) e o Desafio são gravados pela função `missao3d_registrar` do Supabase (tabela `missao3d_resultado`, RLS sem políticas: só o servidor lê). A função só aceita alunos que existem na turma escolhida.
- **Relatório do professor:** `/resultados/missao-saresp/` (login do painel), lido por `GET /api/quiz?missao3d=1`. Mostra, por turma, quem fez, notas, faixas, aproveitamento por tema e quem ainda não fez nada; exporta CSV.

- **Links por turma:** `/missao-saresp/turmas/` lista um link por turma (`/missao-saresp/?turma=7A`), com o conteúdo a estudar (SARESP e Recuperação), link direto de cada tema (`&tema=7-AE10`), mensagem pronta para WhatsApp/Classroom, QR Code e versão para imprimir. No link da turma, a turma já vem escolhida e o aluno só seleciona o nome.

- **Painel do professor:** `/missao-saresp/professor/` (login do painel), via `GET /api/quiz?missao3dplano=1`. Cruza o **Simulado SARESP** de cada aluno (planilha do Apps Script) com os temas da Missão (`api/_missao3d.js`: cada questão do simulado → tema da trilha): temas mais frágeis da turma com os simuladores de cada um, plano individual (🔴 errou no Simulado, 🟠 recuperação, ✅ já fez o quiz do tema com nota ≥ 7), Simulado questão por questão, "Copiar plano" para enviar ao aluno e CSV.
- **Meu relatório (aluno):** botão 📊 no simulador. Pede o login da plataforma (RA + dígito + senha, `aluno-acesso.js`) só nessa hora e lê `GET /api/individual?acao=missao3d`: nota e faixa no Simulado, questão por questão, plano de estudo com botões "Estudar" e histórico na Missão. Os temas do plano ganham ⭐ na lateral.

- **Modo sequência (padrão no link da turma):** cada tema do ano que tem simulador vira uma etapa (simulação ou modelo 3D no palco e, no painel, as questões do tema logo abaixo), na ordem SARESP → Recuperação, terminando no Simulado SARESP. A lateral mostra as etapas com ✓; o progresso fica salvo no aparelho. Abas e listas ficam ocultas. `&livre=1` abre o simulador completo.

Links úteis: `/missao-saresp/?ano=8` (trilha do 8º ano) e `/missao-saresp/?aba=quiz&ano=6` (simulado do 6º ano). Ao alterar os arquivos, troque o `?v=` em `missao-saresp/index.html`.
