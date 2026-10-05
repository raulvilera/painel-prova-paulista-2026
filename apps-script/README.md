# Apps Script (Google) do Painel Prova Paulista 2026

Cópias de referência do código que roda no Google Apps Script. Esta pasta não é publicada no site (`.vercelignore`).

- `simulado/` — Simulado SARESP 2026 · Ciências: link único, uma aba de respostas por turma e correção das dissertativas pela IA (Gemini). Planilha "Revisão Saresp". A chave da IA fica em Propriedades do script (`GEMINI_API_KEY`), nunca no código.
  - O arquivo `Alunos.gs` (nomes e RAs dos alunos) NÃO fica no repositório, por conter dados de menores. Ele está só no projeto do Apps Script.
- `atividade-imagens/` — Atividade com imagens das aulas (botão no planejamento do painel).

Para atualizar o Apps Script: copie o arquivo para o editor e publique em Implantar → Gerenciar implantações → Nova versão.
