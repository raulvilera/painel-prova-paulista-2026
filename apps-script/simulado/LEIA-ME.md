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
