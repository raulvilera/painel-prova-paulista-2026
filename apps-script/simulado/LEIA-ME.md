# Simulado SARESP 2026 · Ciências — atualização (abas por turma + correção por IA)

Arquivos do projeto Apps Script (vinculado à planilha "Revisão Saresp"):
- `Código.gs` → cole **Codigo.gs** (NOVO)
- `Simulado` (HTML) → cole **Simulado.html** (NOVO)
- `appsscript.json` → cole **appsscript.json** (NOVO: permissão para chamar a IA)
- `Dados` → **Dados.gs** (sem mudança)
- `Alunos` → **Alunos.gs** (sem mudança: nomes de cada turma iguais aos da plataforma)

## 1. Chave da IA (Gemini) — fica fora do código
Configurações do projeto (engrenagem) → **Propriedades do script** → Adicionar propriedade:
- Propriedade: `GEMINI_API_KEY`
- Valor: a sua chave criada em https://aistudio.google.com/apikey
Salve. Não cole a chave no código nem em documentos compartilhados.

## 2. Preparar e testar
1. Rode **prepararPlanilha** (autorize). Cria a aba `Alunos_Simulado` e uma aba de respostas por turma:
   `Respostas · 6º Ano A`, `Respostas · 6º Ano C`, `Respostas · 6º Ano A (Lydia)` … `Respostas · 9º Ano B`.
2. Rode **testarIA**. O registro deve mostrar algo como `{"nota":0.8,"comentario":"..."}`.
   (As abas antigas "SARESP 2026 · 6º Ano" etc., se existirem, podem ser apagadas.)

## 3. Publicar a nova versão (o link continua o mesmo)
Implantar → **Gerenciar implantações** → lápis → Versão: **Nova versão** → Implantar.

## Como fica cada aba de turma
- Linha 2: gabarito das objetivas e a resposta esperada das dissertativas.
- Q1–Q7: azul = certa, vermelho = errada.
- Q8–Q10: resposta do aluno, **nota da IA (0 a 1)** e **comentário**; nota azul ≥ 0,7, amarela 0,4–0,6, vermelha ≤ 0,3.
- Acertos objetivas, nota das dissertativas (0–3) e **nota final (0–10)**.
- Se a IA falhar (chave ausente, limite de uso), a linha fica "pendente": rode **corrigirPendentes** (ou crie um acionador de hora em hora para ela).
- Você pode alterar qualquer nota da IA direto na planilha.

---

# Ensino Médio · registro online na planilha

A página `/ensino-medio/` agora registra na planilha. Quem corrige as 12 objetivas continua sendo a função da Vercel (`api/corrigir-em.js`, que guarda o gabarito); depois de corrigir, ela chama este Apps Script com uma senha e ele grava uma linha.

Arquivos: `EnsinoMedio.gs` (NOVO) e `Codigo.gs` (mudou só 1 linha no `doPost`).

## 1. No Apps Script
1. Crie o arquivo **EnsinoMedio** (tipo Script) e cole o conteúdo de `EnsinoMedio.gs`.
2. Atualize `Código.gs` com o `Codigo.gs` deste repositório.
3. Configurações do projeto → **Propriedades do script** → adicione `EM_SEGREDO` com uma senha longa e aleatória (não reutilize outra senha).
4. Implantar → **Gerenciar implantações** → lápis → Versão: **Nova versão** → Implantar. O endereço `/exec` continua o mesmo.

## 2. Na Vercel (projeto **painel-prova-paulista-2026**, onde fica a pasta `api/`)
Settings → Environment Variables (marque Production):
- `EM_APPS_SCRIPT_URL` = o endereço `/exec` do passo 1 (é o mesmo usado na constante `API` de `simulado/index.html`)
- `EM_SEGREDO` = a MESMA senha do passo 1

Depois faça um novo deploy (Deployments → ⋯ → Redeploy) para as variáveis valerem.

## 3. Como fica na planilha
- Uma aba por avaliação: `EM · bio-2-paulista`, `EM · bio-2-provao`, `EM · qui-3-provao` etc., criada sozinha no primeiro envio.
- Linha 2: gabarito. Q1–Q12: azul = certa, vermelho = errada.
- Colunas de acertos e **nota das objetivas (0–10)**.
- Q13 e Q14: texto do aluno e uma coluna **nota (professor, 0–1)** em branco, para a correção manual (a planilha só aceita valores de 0 a 1).
- **Nota final (0–10)**: calculada sozinha quando você preenche as notas das duas dissertativas. As 14 questões valem igual: `(acertos + nota Q13 + nota Q14) ÷ 14 × 10`, com uma casa decimal. Enquanto faltar alguma nota, a célula fica vazia. Se quiser outro peso, é só editar a fórmula na coluna X (ou pedir para ajustar `emFormulaFinal_` em `EnsinoMedio.gs`).
- Se o mesmo envio for repetido (ex.: "Tentar registrar novamente"), a planilha não duplica a linha.

## 4. Se algo falhar
- Sem as variáveis na Vercel, a página continua corrigindo e mostra "Tentar registrar novamente" + o comprovante para o aluno entregar.
- `EM_SEGREDO` diferente nos dois lados → o Apps Script responde "não autorizado" e nada é gravado.
