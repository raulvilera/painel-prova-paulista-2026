/* Frontend do módulo Ensino Médio. O banco público é fornecido por questoes.js; o gabarito permanece no servidor. */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const refs = {
    configuracao: $('configuracao'),
    form: $('form-configuracao'),
    turma: $('turma'),
    componente: $('componente'),
    prova: $('prova'),
    nome: $('nome'),
    resumo: $('resumo-avaliacao'),
    iniciar: $('iniciar'),
    mudar: $('mudar'),
    provaSecao: $('secao-prova'),
    tituloProva: $('titulo-prova'),
    subtituloProva: $('subtitulo-prova'),
    duracaoProva: $('duracao-prova'),
    progresso: $('progresso'),
    revisao: $('revisao'),
    questoes: $('questoes'),
    enviar: $('enviar'),
    mensagem: $('mensagem'),
    resultado: $('resultado'),
    resultadoConteudo: $('resultado-conteudo'),
    baixar: $('baixar'),
    imprimir: $('imprimir')
  };

  const COMPONENTES = {
    biologia: { label: 'Biologia', sigla: 'bio' },
    quimica: { label: 'Química', sigla: 'qui' }
  };
  const PROVAS = {
    paulista: { label: 'Prova Paulista (4º bimestre)' },
    provao: { label: 'Provão Paulista' }
  };
  const TURMAS = [
    { value: '2a-manha', label: '2ª Série A Manhã (Des. Sistemas)', serie: '2', componentes: ['biologia'] },
    { value: '2c-noite', label: '2ª Série C Noite', serie: '2', componentes: ['biologia', 'quimica'] },
    { value: '3f-noite', label: '3ª Série F Noite', serie: '3', componentes: ['biologia', 'quimica'] }
  ];

  const state = {
    assessment: null,
    questions: [],
    objectiveQuestions: [],
    dissertativeQuestions: [],
    objectiveAnswers: [],
    dissertativeAnswers: [],
    started: false,
    submitting: false,
    submitted: false,
    submittedAt: null,
    result: null
  };

  function text(node, value) {
    node.textContent = value == null ? '' : String(value);
    return node;
  }

  function element(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) text(node, value);
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function normalize(value) {
    return String(value == null ? '' : value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  function safeUrl(value) {
    try {
      const parsed = new URL(String(value || ''), window.location.href);
      return /^https?:$/.test(parsed.protocol) ? parsed.href : '';
    } catch (error) {
      return '';
    }
  }

  function publicBank() {
    return window.AVALIACOES_EM && typeof window.AVALIACOES_EM === 'object'
      ? window.AVALIACOES_EM
      : {};
  }

  function assessmentId() {
    const turma = TURMAS.find((item) => item.value === refs.turma.value);
    const componente = COMPONENTES[refs.componente.value];
    const prova = PROVAS[refs.prova.value];
    if (!turma || !componente || !prova) return '';
    return componente.sigla + '-' + turma.serie + '-' + (refs.prova.value === 'paulista' ? 'paulista' : 'provao');
  }

  function selectedAssessment() {
    const id = assessmentId();
    if (!id) return null;
    const bank = publicBank();
    const assessment = bank[id];
    if (!assessment || typeof assessment !== 'object') return null;
    return assessment;
  }

  function validateAssessment(assessment) {
    if (!assessment || !Array.isArray(assessment.questoes)) {
      return 'O banco desta avaliação não está disponível nesta página.';
    }
    const objectives = assessment.questoes.filter((question) => question && question.tipo === 'obj');
    const dissertatives = assessment.questoes.filter((question) => question && question.tipo === 'dis');
    if (objectives.length !== 12 || dissertatives.length !== 2) {
      return 'Esta avaliação ainda não está pronta para iniciar. Tente novamente mais tarde.';
    }
    if (objectives.some((question) => !Array.isArray(question.alts) || question.alts.length !== 5)) {
      return 'Esta avaliação ainda não está pronta para iniciar. Tente novamente mais tarde.';
    }
    return '';
  }

  function option(select, value, label) {
    const node = document.createElement('option');
    node.value = value;
    text(node, label);
    select.appendChild(node);
  }

  function fillSelect(select, placeholder, options, disabled) {
    clear(select);
    option(select, '', placeholder);
    options.forEach((item) => option(select, item.value, item.label));
    select.disabled = !!disabled;
  }

  function populateTurmas() {
    fillSelect(refs.turma, 'Selecione a turma', TURMAS, false);
  }

  function populateComponentes() {
    const turma = TURMAS.find((item) => item.value === refs.turma.value);
    const options = turma ? turma.componentes.map((key) => ({ value: key, label: COMPONENTES[key].label })) : [];
    fillSelect(refs.componente, turma ? 'Selecione o componente' : 'Escolha a turma primeiro', options, !turma);
  }

  function populateProvas() {
    const turma = TURMAS.find((item) => item.value === refs.turma.value);
    const options = turma && turma.serie === '2'
      ? [
          { value: 'paulista', label: PROVAS.paulista.label },
          { value: 'provao', label: PROVAS.provao.label }
        ]
      : turma
        ? [{ value: 'provao', label: PROVAS.provao.label }]
        : [];
    fillSelect(refs.prova, turma ? 'Selecione a prova-alvo' : 'Escolha o componente primeiro', options, !turma || !refs.componente.value);
  }

  function renderSource(parent, assessment) {
    const source = safeUrl(assessment && assessment.fonteUrl);
    if (!source) return;
    const line = element('p', 'fonte');
    const label = element('span', null, 'Fonte: Guia Priorizado de ' + (COMPONENTES[refs.componente.value] || {}).label);
    const link = element('a', null, ' abrir documento');
    link.href = source;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    line.append(label, link);
    parent.appendChild(line);
  }

  function renderSummary() {
    clear(refs.resumo);
    const assessment = selectedAssessment();
    state.assessment = assessment;
    if (!assessment) {
      refs.iniciar.disabled = true;
      refs.iniciar.hidden = false;
      const chosen = refs.turma.value && refs.componente.value && refs.prova.value;
      text(refs.resumo, chosen ? 'A avaliação escolhida não está disponível neste banco.' : 'Selecione turma, componente e prova para ver a duração sugerida e a fonte do Guia.');
      refs.resumo.className = 'resumo-avaliacao' + (chosen ? ' resumo-erro' : '');
      return;
    }

    const invalidReason = validateAssessment(assessment);
    const box = element('div');
    const title = element('p', 'resumo-titulo', assessment.titulo || PROVAS[refs.prova.value].label);
    const duration = Number(assessment.duracaoMin);
    const detail = element('p', 'resumo-detalhe', '12 objetivas + 2 dissertativas · duração sugerida: ' + (Number.isFinite(duration) && duration > 0 ? duration + ' minutos' : 'não informada'));
    box.append(title, detail);
    renderSource(box, assessment);
    if (invalidReason) {
      const problem = element('p', 'resumo-erro', invalidReason);
      box.appendChild(problem);
    }
    refs.resumo.appendChild(box);
    refs.resumo.className = 'resumo-avaliacao' + (invalidReason ? ' resumo-erro' : '');
    refs.iniciar.disabled = !!invalidReason;
  }

  function onTurmaChange() {
    populateComponentes();
    clear(refs.prova);
    option(refs.prova, '', 'Escolha o componente primeiro');
    refs.prova.disabled = true;
    renderSummary();
  }

  function onComponenteChange() {
    const turma = TURMAS.find((item) => item.value === refs.turma.value);
    const options = turma && refs.componente.value
      ? (turma.serie === '2'
        ? [
            { value: 'paulista', label: PROVAS.paulista.label },
            { value: 'provao', label: PROVAS.provao.label }
          ]
        : [{ value: 'provao', label: PROVAS.provao.label }])
      : [];
    fillSelect(refs.prova, refs.componente.value ? 'Selecione a prova-alvo' : 'Escolha o componente primeiro', options, !refs.componente.value);
    renderSummary();
  }

  function onProvaChange() {
    renderSummary();
  }

  function applyUrlPreselection() {
    const params = new URLSearchParams(window.location.search);
    const serie = String(params.get('serie') || '').trim();
    const componente = normalize(params.get('componente'));
    if (!['2', '3'].includes(serie)) return;
    const componenteValido = Object.prototype.hasOwnProperty.call(COMPONENTES, componente);
    const turma = TURMAS.find((item) => item.serie === serie && (!componenteValido || item.componentes.includes(componente)));
    if (!turma) return;
    refs.turma.value = turma.value;
    onTurmaChange();
    if (componenteValido) {
      refs.componente.value = componente;
      onComponenteChange();
    }
  }

  function renderQuestionHeader(article, number, kind) {
    const header = element('div', 'questao-cabecalho');
    const numberNode = element('span', 'numero-questao', 'Questão ' + number);
    const kindNode = element('span', 'tag-questao', kind === 'obj' ? 'Objetiva' : 'Dissertativa');
    header.append(numberNode, kindNode);
    article.appendChild(header);
  }

  function renderTable(tableData) {
    if (!tableData || !Array.isArray(tableData.colunas) || !Array.isArray(tableData.linhas)) return null;
    const wrapper = element('div', 'tabela-rolagem');
    const table = document.createElement('table');
    const caption = element('caption', null, 'Dados apresentados na questão');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    tableData.colunas.forEach((column) => {
      const th = element('th', null, column);
      th.scope = 'col';
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    const tbody = document.createElement('tbody');
    tableData.linhas.forEach((row) => {
      const tr = document.createElement('tr');
      (Array.isArray(row) ? row : []).forEach((cell) => tr.appendChild(element('td', null, cell)));
      tbody.appendChild(tr);
    });
    table.append(caption, thead, tbody);
    wrapper.appendChild(table);
    return wrapper;
  }

  function alternativeText(question, index) {
    if (!question || !Array.isArray(question.alts) || !Number.isInteger(index) || index < 0 || index >= question.alts.length) return '';
    return String(question.alts[index] == null ? '' : question.alts[index]);
  }

  function renderObjectiveChoices(article, question, objectiveIndex) {
    const fieldset = element('fieldset', 'alternativas');
    const legend = element('legend', null, 'Escolha uma alternativa para a questão ' + (objectiveIndex + 1));
    fieldset.appendChild(legend);
    const list = element('div', 'lista-alternativas');
    const name = 'q' + objectiveIndex;
    question.alts.forEach((answer, answerIndex) => {
      const choice = element('div', 'alternativa');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = name;
      input.id = name + '-alt' + answerIndex;
      input.value = String(answerIndex);
      input.required = true;
      input.addEventListener('change', function () {
        state.objectiveAnswers[objectiveIndex] = answerIndex;
        input.closest('.questao')?.classList.remove('questao-invalida');
        updateProgress();
      });
      const label = document.createElement('label');
      label.htmlFor = input.id;
      const letter = element('span', 'letra-alternativa', String.fromCharCode(65 + answerIndex) + ')');
      const answerText = element('span', 'texto-alternativa', answer);
      label.append(letter, answerText);
      choice.append(input, label);
      list.appendChild(choice);
    });
    fieldset.appendChild(list);
    article.appendChild(fieldset);
  }

  function renderDissertativeAnswer(article, question, dissertativeIndex) {
    const label = element('label', 'rotulo-dissertativa', 'Resposta da questão ' + (state.questions.indexOf(question) + 1));
    const textarea = document.createElement('textarea');
    textarea.id = 'resposta-q' + (12 + dissertativeIndex);
    textarea.name = 'q' + (12 + dissertativeIndex);
    textarea.maxLength = 3000;
    textarea.required = true;
    textarea.rows = 7;
    textarea.placeholder = 'Escreva sua resposta com suas palavras (até 3000 caracteres).';
    textarea.addEventListener('input', function () {
      state.dissertativeAnswers[dissertativeIndex] = textarea.value;
      article.classList.remove('questao-invalida');
      updateProgress();
    });
    label.htmlFor = textarea.id;
    article.append(label, textarea);
  }

  function renderQuestions() {
    clear(refs.questoes);
    state.objectiveQuestions = state.questions.filter((question) => question.tipo === 'obj');
    state.dissertativeQuestions = state.questions.filter((question) => question.tipo === 'dis');
    let objectiveIndex = 0;
    let dissertativeIndex = 0;
    state.questions.forEach((question, questionIndex) => {
      const article = element('article', 'questao');
      article.id = 'q' + questionIndex;
      renderQuestionHeader(article, questionIndex + 1, question.tipo);
      article.appendChild(element('p', 'enunciado', question.enunciado));
      const table = renderTable(question.tabela);
      if (table) article.appendChild(table);
      if (question.comando) article.appendChild(element('p', 'comando', question.comando));
      if (question.tipo === 'obj') {
        renderObjectiveChoices(article, question, objectiveIndex);
        objectiveIndex += 1;
      } else {
        renderDissertativeAnswer(article, question, dissertativeIndex);
        dissertativeIndex += 1;
      }
      refs.questoes.appendChild(article);
    });
  }

  function countObjectiveAnswers() {
    return state.objectiveAnswers.filter((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 4).length;
  }

  function countDissertativeAnswers() {
    return state.dissertativeAnswers.filter((answer) => typeof answer === 'string' && answer.trim().length > 0).length;
  }

  function updateProgress() {
    if (!state.started) return;
    const objectiveCount = countObjectiveAnswers();
    const dissertativeCount = countDissertativeAnswers();
    text(refs.progresso, 'Respondidas: ' + (objectiveCount + dissertativeCount) + '/14 · objetivas: ' + objectiveCount + '/12 · dissertativas: ' + dissertativeCount + '/2');
    clear(refs.revisao);
    const missingObjectives = state.objectiveAnswers.map((answer, index) => answer == null ? index : -1).filter((index) => index >= 0);
    const missingDissertatives = state.dissertativeAnswers.map((answer, index) => !String(answer || '').trim() ? index : -1).filter((index) => index >= 0);
    if (!missingObjectives.length && !missingDissertatives.length) {
      refs.revisao.className = 'revisao revisao-ok';
      text(refs.revisao, 'Revisão: todas as questões estão respondidas.');
      return;
    }
    refs.revisao.className = 'revisao revisao-pendente';
    refs.revisao.appendChild(element('strong', null, 'Revisão dos não respondidos:'));
    const list = document.createElement('ul');
    missingObjectives.forEach((index) => {
      const item = document.createElement('li');
      const link = element('a', null, 'Questão ' + (state.questions.indexOf(state.objectiveQuestions[index]) + 1) + ' (objetiva)');
      link.href = '#q' + state.questions.indexOf(state.objectiveQuestions[index]);
      item.appendChild(link);
      list.appendChild(item);
    });
    missingDissertatives.forEach((index) => {
      const item = document.createElement('li');
      const link = element('a', null, 'Questão ' + (state.questions.indexOf(state.dissertativeQuestions[index]) + 1) + ' (dissertativa)');
      link.href = '#q' + state.questions.indexOf(state.dissertativeQuestions[index]);
      item.appendChild(link);
      list.appendChild(item);
    });
    refs.revisao.appendChild(list);
  }

  function showMessage(message, kind) {
    refs.mensagem.hidden = false;
    refs.mensagem.className = 'mensagem ' + (kind || 'informacao');
    text(refs.mensagem, message);
  }

  function hideMessage() {
    refs.mensagem.hidden = true;
    refs.mensagem.className = 'mensagem';
    text(refs.mensagem, '');
  }

  function firstMissingQuestion() {
    const objectiveIndex = state.objectiveAnswers.findIndex((answer) => answer == null);
    if (objectiveIndex >= 0) return state.questions.indexOf(state.objectiveQuestions[objectiveIndex]);
    const dissertativeIndex = state.dissertativeAnswers.findIndex((answer) => !String(answer || '').trim());
    if (dissertativeIndex >= 0) return state.questions.indexOf(state.dissertativeQuestions[dissertativeIndex]);
    return -1;
  }

  function validateAnswers() {
    const objectiveMissing = state.objectiveAnswers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 4);
    if (objectiveMissing) {
      showMessage('Responda as 12 questões objetivas antes de enviar. Use a revisão para localizar as pendentes.', 'erro');
      const index = firstMissingQuestion();
      const target = index >= 0 ? document.getElementById('q' + index) : null;
      target?.classList.add('questao-invalida');
      target?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      target?.querySelector('input, textarea')?.focus();
      return false;
    }
    const dissertativeMissing = state.dissertativeAnswers.some((answer) => !String(answer || '').trim());
    if (dissertativeMissing) {
      showMessage('Responda as 2 questões dissertativas antes de enviar. Elas serão guardadas para correção manual.', 'erro');
      const index = firstMissingQuestion();
      const target = index >= 0 ? document.getElementById('q' + index) : null;
      target?.classList.add('questao-invalida');
      target?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      target?.querySelector('textarea')?.focus();
      return false;
    }
    return true;
  }

  function lockInputs(locked) {
    refs.questoes.querySelectorAll('input, textarea').forEach((input) => { input.disabled = locked; });
    refs.nome.disabled = locked;
  }

  function submitPayload() {
    return {
      avaliacao: String(state.assessment.id || assessmentId()),
      respostas: state.objectiveAnswers.map((answer) => Number(answer))
    };
  }

  async function sendAnswers() {
    if (state.submitting || state.submitted || !validateAnswers()) return;
    showMessage('Você está prestes a enviar somente as 12 alternativas para correção. Nome e respostas dissertativas não serão enviados; as dissertativas ficarão apenas no comprovante.', 'informacao');
    const confirmed = typeof window.confirm === 'function'
      ? window.confirm('Confirmar envio das 12 objetivas? A correção ocorre agora; o módulo não registra automaticamente na planilha.')
      : true;
    if (!confirmed) {
      showMessage('Envio cancelado. Suas respostas continuam nesta tela.', 'informacao');
      return;
    }

    state.submitting = true;
    refs.enviar.disabled = true;
    refs.enviar.textContent = 'Enviando e corrigindo…';
    lockInputs(true);
    showMessage('Enviando as objetivas e aguardando a correção…', 'informacao');

    try {
      const response = await fetch('/api/corrigir-em', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(submitPayload())
      });
      if (response && response.ok === false) throw new Error('O servidor recusou o envio (' + response.status + ').');
      const data = await response.json();
      if (!data || data.ok !== true) throw new Error(data && (data.erro || data.mensagem) ? String(data.erro || data.mensagem) : 'A correção não foi concluída.');
      if (data.avaliacao !== state.assessment.id || !Array.isArray(data.devolutiva) || data.devolutiva.length !== 12 || !Number.isFinite(data.notaObjetiva)) throw new Error('Devolutiva incompleta. Tente novamente.');
      state.result = data;
      state.submitted = true;
      state.submittedAt = new Date();
      state.submitting = false;
      refs.enviar.disabled = true;
      refs.enviar.textContent = 'Respostas enviadas';
      lockInputs(true);
      renderResult();
      showMessage('Envio concluído. A nota abaixo é somente das objetivas; as dissertativas aguardam correção manual.', 'sucesso');
      refs.resultado.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      state.submitting = false;
      refs.enviar.disabled = false;
      refs.enviar.textContent = 'Tentar enviar novamente';
      lockInputs(false);
      showMessage('Não foi possível enviar: ' + (error && error.message ? String(error.message) : 'verifique a conexão.') + ' Suas respostas continuam nesta tela; tente novamente.', 'erro');
    }
  }

  function formatNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) : '—';
  }

  function formatDate(date) {
    try {
      return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'short' }).format(date);
    } catch (error) {
      return date.toLocaleString('pt-BR');
    }
  }

  function alternativeLabel(question, index) {
    if (!Number.isInteger(index) || index < 0 || index >= 5) return 'Não informada';
    return String.fromCharCode(65 + index) + ') ' + alternativeText(question, index);
  }

  function definitionList(items) {
    const dl = document.createElement('dl');
    items.forEach((item) => {
      dl.appendChild(element('dt', null, item[0]));
      dl.appendChild(element('dd', null, item[1]));
    });
    return dl;
  }

  function buildFeedbackItem(item, index) {
    const question = state.objectiveQuestions.find((candidate) => String(candidate.id) === String(item && item.id)) || state.objectiveQuestions[index];
    const feedback = element('article', 'feedback-item ' + (item && item.acertou ? 'feedback-acerto' : 'feedback-erro'));
    const number = state.questions.indexOf(question) + 1 || index + 1;
    feedback.appendChild(element('h4', null, 'Questão ' + number + (item && item.acertou ? ' · correta' : ' · revisar')));
    const answerIndex = item && Number.isInteger(item.resposta) ? item.resposta : state.objectiveAnswers[index];
    const correctIndex = item && Number.isInteger(item.correta) ? item.correta : null;
    feedback.appendChild(definitionList([
      ['Alternativa escolhida', alternativeLabel(question, answerIndex)],
      ['Alternativa correta', alternativeLabel(question, correctIndex)]
    ]));
    feedback.appendChild(element('p', 'justificativa', 'Justificativa: ' + String(item && item.justificativa || 'Não informada.')));
    if (item && item.objeto) feedback.appendChild(element('p', 'metadado-resultado', 'Objeto: ' + String(item.objeto)));
    if (item && item.referencia) feedback.appendChild(element('p', 'metadado-resultado', 'Referência: ' + String(item.referencia)));
    return feedback;
  }

  function buildReceipt() {
    const turma = TURMAS.find((item) => item.value === refs.turma.value);
    const componente = COMPONENTES[refs.componente.value];
    const prova = PROVAS[refs.prova.value];
    const data = state.submittedAt || new Date();
    const receipt = element('section', 'comprovante', '');
    receipt.appendChild(element('h3', null, 'Comprovante do treino'));
    receipt.appendChild(definitionList([
      ['Nome', refs.nome.value.trim() || 'Não informado'],
      ['Turma', turma ? turma.label : 'Não informada'],
      ['Componente', componente ? componente.label : 'Não informado'],
      ['Prova-alvo', prova ? prova.label : 'Não informada'],
      ['Data do envio', formatDate(data)]
    ]));
    receipt.appendChild(element('h4', null, 'Respostas objetivas'));
    const objectiveList = document.createElement('ol');
    state.objectiveAnswers.forEach((answer, index) => {
      objectiveList.appendChild(element('li', null, 'Questão ' + (index + 1) + ': ' + alternativeLabel(state.objectiveQuestions[index], answer)));
    });
    receipt.appendChild(objectiveList);
    receipt.appendChild(element('h4', null, 'Respostas dissertativas'));
    const dissertativeList = document.createElement('ol');
    state.dissertativeAnswers.forEach((answer, index) => {
      const li = element('li', 'resposta-dissertativa', 'Questão ' + (state.questions.indexOf(state.dissertativeQuestions[index]) + 1) + ':');
      li.appendChild(element('p', 'texto-resposta', answer));
      dissertativeList.appendChild(li);
    });
    receipt.appendChild(dissertativeList);
    receipt.appendChild(element('p', 'aviso-manual', 'As dissertativas estão guardadas neste comprovante para correção manual do professor; não receberam nota automática.'));
    receipt.appendChild(element('p', 'aviso-manual', 'Este comprovante não representa registro na planilha.'));
    return receipt;
  }

  function renderResult() {
    const data = state.result || {};
    clear(refs.resultadoConteudo);
    const nota = Number.isFinite(Number(data.notaObjetiva)) ? formatNumber(data.notaObjetiva) + ' / 10' : 'indisponível';
    const summary = element('div', 'resumo-resultado');
    summary.appendChild(element('p', 'nota-grande', 'Nota das objetivas: ' + nota));
    summary.appendChild(element('p', null, 'Acertos: ' + String(data.acertos == null ? '—' : data.acertos) + ' de ' + String(data.total == null ? 12 : data.total) + '. A nota não combina as dissertativas.'));
    if (data.mensagem) summary.appendChild(element('p', 'texto-suave', data.mensagem));
    refs.resultadoConteudo.appendChild(summary);

    const feedbackSection = element('section', 'devolutiva');
    feedbackSection.appendChild(element('h3', null, 'Devolutiva por questão'));
    const feedback = Array.isArray(data.devolutiva) ? data.devolutiva : [];
    if (!feedback.length) {
      feedbackSection.appendChild(element('p', 'texto-suave', 'A devolutiva detalhada não foi disponibilizada pelo servidor.'));
    } else {
      feedback.forEach((item, index) => feedbackSection.appendChild(buildFeedbackItem(item || {}, index)));
    }
    refs.resultadoConteudo.appendChild(feedbackSection);
    refs.resultadoConteudo.appendChild(buildReceipt());
    refs.resultado.hidden = false;
  }

  function downloadReceipt() {
    if (!state.submitted || !state.result) return;
    const turma = TURMAS.find((item) => item.value === refs.turma.value);
    const componente = COMPONENTES[refs.componente.value];
    const prova = PROVAS[refs.prova.value];
    const payload = {
      tipo: 'comprovante-treino-ensino-medio',
      avaliacao: String(state.assessment.id || assessmentId()),
      nome: refs.nome.value.trim(),
      turma: turma ? turma.label : '',
      componente: componente ? componente.label : '',
      prova: prova ? prova.label : '',
      data: (state.submittedAt || new Date()).toISOString(),
      respostasObjetivas: state.objectiveAnswers.map((answer, index) => ({ questao: index + 1, resposta: answer, alternativa: alternativeLabel(state.objectiveQuestions[index], answer) })),
      respostasDissertativas: state.dissertativeAnswers.map((answer, index) => ({ questao: state.questions.indexOf(state.dissertativeQuestions[index]) + 1, resposta: answer })),
      resultado: {
        acertos: state.result.acertos,
        total: state.result.total,
        notaObjetiva: state.result.notaObjetiva,
        mensagem: state.result.mensagem || '',
        devolutiva: Array.isArray(state.result.devolutiva) ? state.result.devolutiva : []
      },
      aviso: 'Este arquivo é um comprovante de treino e não representa registro automático na planilha.'
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'comprovante-ensino-medio-' + String(state.assessment.id || assessmentId()) + '.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function hasAnswers() {
    return state.objectiveAnswers.some((answer) => answer != null) || state.dissertativeAnswers.some((answer) => String(answer || '').trim().length > 0);
  }

  function resetTraining() {
    state.assessment = selectedAssessment();
    state.questions = [];
    state.objectiveQuestions = [];
    state.dissertativeQuestions = [];
    state.objectiveAnswers = [];
    state.dissertativeAnswers = [];
    state.started = false;
    state.submitting = false;
    state.submitted = false;
    state.submittedAt = null;
    state.result = null;
    refs.turma.disabled = false;
    refs.componente.disabled = false;
    refs.prova.disabled = false;
    refs.nome.disabled = false;
    refs.iniciar.hidden = false;
    refs.mudar.hidden = true;
    refs.iniciar.textContent = 'Iniciar treino';
    refs.provaSecao.hidden = true;
    refs.resultado.hidden = true;
    clear(refs.questoes);
    clear(refs.resultadoConteudo);
    hideMessage();
    renderSummary();
  }

  function changeAssessment() {
    if (hasAnswers() || state.submitted) {
      const confirmed = typeof window.confirm === 'function'
        ? window.confirm('Há respostas nesta avaliação. Mudar de avaliação apagará as respostas desta tela. Deseja continuar?')
        : true;
      if (!confirmed) return;
    }
    resetTraining();
  }

  function startTraining(event) {
    event.preventDefault();
    const assessment = selectedAssessment();
    const invalidReason = validateAssessment(assessment);
    if (invalidReason) {
      showMessage(invalidReason, 'erro');
      return;
    }
    state.assessment = assessment;
    state.questions = assessment.questoes.slice();
    state.objectiveAnswers = state.questions.filter((question) => question.tipo === 'obj').map(() => null);
    state.dissertativeAnswers = state.questions.filter((question) => question.tipo === 'dis').map(() => '');
    state.started = true;
    state.submitting = false;
    state.submitted = false;
    state.result = null;
    state.submittedAt = null;
    const turma = TURMAS.find((item) => item.value === refs.turma.value);
    const componente = COMPONENTES[refs.componente.value];
    const prova = PROVAS[refs.prova.value];
    text(refs.tituloProva, assessment.titulo || prova.label);
    text(refs.subtituloProva, (turma ? turma.label : '') + ' · ' + (componente ? componente.label : '') + ' · ' + prova.label);
    const duration = Number(assessment.duracaoMin);
    text(refs.duracaoProva, 'Duração sugerida: ' + (Number.isFinite(duration) && duration > 0 ? duration + ' min' : 'não informada'));
    renderQuestions();
    updateProgress();
    refs.turma.disabled = true;
    refs.componente.disabled = true;
    refs.prova.disabled = true;
    refs.iniciar.hidden = true;
    refs.mudar.hidden = false;
    refs.provaSecao.hidden = false;
    refs.resultado.hidden = true;
    hideMessage();
    refs.provaSecao.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }

  refs.turma.addEventListener('change', onTurmaChange);
  refs.componente.addEventListener('change', onComponenteChange);
  refs.prova.addEventListener('change', onProvaChange);
  refs.form.addEventListener('submit', startTraining);
  refs.enviar.addEventListener('click', sendAnswers);
  refs.mudar.addEventListener('click', changeAssessment);
  refs.baixar.addEventListener('click', downloadReceipt);
  refs.imprimir.addEventListener('click', function () { window.print(); });

  window.addEventListener('beforeunload', function (event) {
    if (state.started && hasAnswers() && !state.submitted) {
      event.preventDefault();
      event.returnValue = '';
    }
  });

  populateTurmas();
  applyUrlPreselection();
  renderSummary();
})();
