# Atividade com imagens da aula: configuração (uma vez só)

A planilha de respostas já foi criada no seu Drive:
**Respostas – Atividades com imagens (Painel PP 2026)**
https://docs.google.com/spreadsheets/d/1o0K_KU_WY6yb-aFnUs6pOyMfBV5rvWxCQMaZ66yUjZo/edit

1. Abra a planilha e vá em **Extensões → Apps Script**.
2. No editor, apague o conteúdo de `Código.gs` e cole o arquivo **Codigo.gs**.
3. Clique em **+ → HTML**, dê o nome **Atividade** (sem .html) e cole o arquivo **Atividade.html**.
4. Clique na engrenagem **Configurações do projeto** e marque *Mostrar o arquivo de manifesto "appsscript.json"*. Volte ao editor, abra `appsscript.json` e cole o arquivo **appsscript.json** (ele ativa o serviço Drive API e o app da Web).
5. Escolha a função **configurar** no topo e clique em **Executar**. Autorize com a conta @prof.educacao.sp.gov.br.
   No **Registro de execução** aparece o **TOKEN**. Copie.
6. Clique em **Implantar → Nova implantação → Tipo: App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   Clique em **Implantar** e copie a **URL do app da Web** (termina em `/exec`).
7. No painel: **Planejamento → Sequência da turma → 🖼️ atividade com imagens** (em qualquer aula) → *Conexão com a planilha de respostas* → cole a URL e o token → **Salvar e testar**.

## Como usar
- **Buscar imagens dos slides**: o script converte o .pptx da aula em Google Apresentações (só na primeira vez, até 1 min), separa as imagens de cada slide e o texto que as acompanha. Logotipos e fundos repetidos são descartados.
- O painel monta 7 objetivas (associar a imagem à informação correta; os distratores são informações de outras imagens da mesma aula) e 3 dissertativas, nos grupos de Bloom do prompt. Revise e edite os textos, troque imagens, marque a correta.
- **Publicar**: gera o link para o Classroom. O aluno escolhe Turma → Nome e o Nº de chamada aparece sozinho.
- As respostas caem na aba `R_<ID>` da planilha: azul = objetiva certa, vermelho = errada, e a coluna de acertos.
- **Copiar prompt**: copia o prompt unificado já preenchido com a aula, a habilidade, os textos das imagens e a lista de alunos (nº + nome) das turmas marcadas, para colar no chat do Claude se quiser uma versão mais elaborada.

## Observações
- Ao publicar com "Qualquer pessoa", quem tiver o link vê a lista de nomes da turma escolhida (como no formato do prompt). Compartilhe o link só no Classroom/grupo da turma.
- Decks com mais de 100 MB não convertem; nesses casos use o botão "Copiar prompt".
- Se mudar o código depois, use **Implantar → Gerenciar implantações → editar → Nova versão** para manter a mesma URL.
