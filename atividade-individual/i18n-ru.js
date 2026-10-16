/* Interface em russo (só para quem recebe atividade em russo). Traduz textos fixos e mensagens da página;
   as questões já chegam em russo do servidor. */
(function(){
  const D = {
    'Ciências · Ensino Fundamental':'Естествознание · Основная школа',
    'Minha atividade de Ciências':'Моё задание по естествознанию',
    'Simulado SARESP · Ciências':'Пробный SARESP · Естествознание',
    'Escolha a sua turma e o seu nome para abrir as questões preparadas para você.':'Выбери класс и имя, чтобы открыть вопросы, подготовленные для тебя.',
    'Turma':'Класс','Nome':'Имя','Selecione':'Выбери','Selecione o seu nome':'Выбери своё имя','Escolha a turma primeiro':'Сначала выбери класс',
    'Carregando…':'Загрузка…','Carregando nomes…':'Загрузка имён…','Escolha…':'Выбери…',
    '⏸ Hora de uma pausa':'⏸ Время сделать перерыв','Respire fundo e beba um pouco de água. Quando estiver pronto, continue.':'Глубоко вдохни и выпей воды. Когда будешь готова, продолжай.','Continuar':'Продолжить',
    '← Voltar':'← Назад','Próxima →':'Дальше →','Enviar respostas':'Отправить ответы','Enviando e corrigindo…':'Отправка и проверка…','Respostas enviadas ✓':'Ответы отправлены ✓',
    'Preparando as suas questões… na primeira vez pode levar até 1 minuto.':'Готовим твои вопросы… в первый раз это может занять до 1 минуты.',
    'Ainda não há atividade para você. Fale com o professor.':'Для тебя пока нет задания. Поговори с учителем.',
    'Estamos preparando suas questões. Tente de novo em 1 minuto.':'Мы готовим твои вопросы. Попробуй ещё раз через 1 минуту.',
    'Sem atividade por enquanto.':'Пока нет задания.',
    'O que vamos estudar:':'Что мы будем изучать:','📖 Glossário (palavras importantes)':'📖 Словарь (важные слова)',
    'Objetiva':'Тест','Dissertativa':'Развёрнутый ответ','Ligar / completar':'Соедини / дополни','Colocar em ordem':'Расставь по порядку','Desafio':'Вызов','Questão':'Вопрос',
    '🖼️ Carregando a imagem…':'🖼️ Загрузка изображения…','⚠️ Imagem indisponível':'⚠️ Изображение недоступно',
    '🔊 Ouvir a questão':'🔊 Прослушать вопрос','🎤 Falar a resposta':'🎤 Сказать ответ','⏹ Parar de gravar':'⏹ Остановить запись','↩ Desfazer':'↩ Отменить','Recomeçar':'Начать заново',
    'Fale no microfone ou escreva aqui.':'Говори в микрофон или пиши здесь.','Escreva sua resposta com as suas palavras.':'Напиши ответ своими словами (можно по-русски).',
    'Escolha a sua turma e o seu nome.':'Выбери класс и имя.',
    '⭐ Obrigado por responder! Sua resposta foi registrada.':'⭐ Спасибо за ответ! Твой ответ записан.',
    '✓ Muito bem! ':'✓ Молодец! ','✓ Certo! ':'✓ Верно! ','Quase! A resposta certa é a ':'Почти! Правильный ответ — ','✗ A correta é a ':'✗ Правильный ответ — ',
    'A ordem certa é: ':'Правильный порядок: ','Quase! A ordem certa é: ':'Почти! Правильный порядок: ','Veja o certo: ':'Вот правильно: ','Certo: ':'Правильно: ',
    ' A correção das dissertativas ficou pendente.':' Проверка развёрнутых ответов ещё не завершена.',
    'sem conexão. Verifique a internet e tente de novo':'нет соединения. Проверь интернет и попробуй снова',
    'Não foi possível enviar: ':'Не удалось отправить: ','Não foi possível abrir a atividade: ':'Не удалось открыть задание: ','Não foi possível carregar os nomes: ':'Не удалось загрузить имена: ','Não foi possível carregar as turmas: ':'Не удалось загрузить классы: ',
    'Tente de novo.':'Попробуй ещё раз.','Identificação do aluno':'Данные ученика',
    'espaço em branco':'пропуск','Opção ':'Вариант ','Opções: ':'Варианты: ',
  };
  const RX = [
    [/Você tem (\d+) questões/g, 'У тебя $1 вопросов'],
    [/Questão (\d+) de (\d+)/g, 'Вопрос $1 из $2'],
    [/Questão (\d+)/g, 'Вопрос $1'],
    [/Alternativas da questão (\d+)/g, 'Варианты ответа на вопрос $1'],
    [/Resposta da questão (\d+)/g, 'Ответ на вопрос $1'],
    [/, estas questões foram preparadas para você · (\d+) questões/g, ', эти вопросы подготовлены для тебя · $1 вопросов'],
    [/ · sem pressa, não há limite de tempo/g, ' · без спешки, времени достаточно'],
    [/Nota da IA: ([\d,]+) de 1/g, 'Оценка ИИ: $1 из 1'],
    [/Você acertou (\d+) de (\d+)\./g, 'Ты ответила правильно на $1 из $2.'],
    [/Acertos: (\d+) de (\d+)\./g, 'Верно: $1 из $2.'],
    [/(^|\. | · )(\d+)º /g, '$1$2-й '],
    [/Parabéns, ([^!]+)! Você terminou a atividade e suas respostas foram registradas\. Você acertou (\d+) de (\d+) questões de marcar, ligar ou ordenar\./g, 'Поздравляем, $1! Ты закончила задание, твои ответы записаны. Правильно в вопросах с выбором, соединением и порядком: $2 из $3.'],
    [/Pronto, ([^!]+)! Suas respostas foram registradas\. Objetivas: (\d+) de (\d+) corretas\./g, 'Готово, $1! Твои ответы записаны. Тесты: правильно $2 из $3.'],
    [/ Nota: ([\d,]+)\./g, ' Оценка: $1.'],
    [/Ainda dá tempo! Você não respondeu a questão ([\d, ]+)\. Quer enviar assim mesmo\?/g, 'Ещё есть время! Ты не ответила на вопрос: $1. Всё равно отправить?'],
    [/Faltam as questões ([\d, ]+)\. Enviar mesmo assim\?/g, 'Не отвечены вопросы: $1. Всё равно отправить?'],
  ];
  const KEYS = Object.keys(D).sort((a, b) => b.length - a.length);
  function t(s){
    if (!s || !/[A-Za-zÀ-ú]/.test(s)) return s;
    let r = s;
    for (const [re, to] of RX) r = r.replace(re, to);
    for (const k of KEYS) if (r.indexOf(k) >= 0) r = r.split(k).join(D[k]);
    return r;
  }
  function node(n){
    if (n.nodeType === 3) {
      const p = n.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return;
      if (p.nodeName === 'OPTION' && !p.hasAttribute('value')) return;   // nomes e turmas: o texto é o valor enviado ao servidor
      const v = t(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; return;
    }
    if (n.nodeType !== 1) return;
    ['placeholder', 'aria-label', 'title'].forEach(a => { if (n.hasAttribute && n.hasAttribute(a)) { const v = t(n.getAttribute(a)); if (v !== n.getAttribute(a)) n.setAttribute(a, v); } });
    n.childNodes.forEach(node);
  }
  let obs = null;
  window.RU = {
    t,
    ativar(){
      if (obs) return; document.documentElement.lang = 'ru';
      document.title = t(document.title);
      obs = new MutationObserver(ms => ms.forEach(m => { if (m.type === 'characterData') node(m.target); else if (m.type === 'attributes') node(m.target); else m.addedNodes.forEach(node); }));
      node(document.body);
      obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'aria-label', 'title'] });
    },
  };
})();
