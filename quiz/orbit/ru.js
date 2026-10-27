/* Orbit Quiz em russo, só para a aluna ZLATA EVGENIEVNA SAFOROVA (8º Ano A): perguntas do 8º ano, textos da tela e ranking.
   Os demais alunos não são afetados: tudo só liga quando o nome selecionado for o dela. */
(function () {
  const ALVO = /ZLATA\s+EVGENIEVNA/i;
  const ligado = () => { try { const s = window.__game && window.__game.getState(); if (s && s.student) return ALVO.test(s.student); } catch (e) {} const sel = document.getElementById('student-select'); return !!(sel && ALVO.test(sel.value || '')); };
  window.__orbitRuLigado = ligado;

  /* conceito -> { q: pergunta, c: resposta certa, e: [3 erradas, na mesma ordem do banco], x: explicação } */
  window.__orbitRU = {
    'Pulmões': { q: 'Какой главный обмен происходит в лёгких?', c: 'Кислород поступает в кровь, а углекислый газ выходит', e: ['Углекислый газ поступает в кровь', 'Вода переходит в воздух', 'Кровь попадает в воздух'], x: 'Это называется газообменом, и он происходит в альвеолах.' },
    'Estômago': { q: 'Что желудок смешивает с пищей?', c: 'Желудочный сок', e: ['Желчь', 'Только слюну', 'Кровь'], x: 'Желудочный сок кислый и начинает переваривание белков.' },
    'Intestino delgado': { q: 'Где происходит большая часть всасывания питательных веществ?', c: 'В тонком кишечнике', e: ['В пищеводе', 'В толстом кишечнике', 'Во рту'], x: 'Питательные вещества попадают в кровь через стенки тонкого кишечника.' },
    'Polinização': { q: 'Что такое опыление?', c: 'Перенос пыльцы на женскую часть цветка', e: ['Образование плода без цветка', 'Листопад', 'Поглощение воды корнем'], x: 'Оно может происходить с помощью ветра, воды или животных, например пчёл.' },
    'Reprodução assexuada': { q: 'При бесполом размножении потомки…', c: 'генетически идентичны исходной особи', e: ['происходят от двух разных родителей', 'всегда имеют новые признаки', 'зависят от гамет'], x: 'Одна особь даёт свои копии, как при посадке черенка растения.' },
    'Eclipse lunar': { q: 'При лунном затмении в каком порядке расположены небесные тела?', c: 'Солнце, Земля и Луна', e: ['Солнце, Луна и Земля', 'Земля, Солнце и Луна', 'Луна, Солнце и Земля'], x: 'Тень Земли закрывает Луну.' },
    'Marés': { q: 'Какое небесное тело — главная причина приливов и отливов?', c: 'Луна', e: ['Марс', 'Ветры', 'Ядро Земли'], x: 'Гравитационное притяжение Луны заставляет уровень моря подниматься и опускаться.' },
    'Inclinação do eixo': { q: 'Что вызывает смену времён года?', c: 'Наклон оси Земли и её обращение вокруг Солнца', e: ['Только расстояние от Земли до Солнца', 'Фазы Луны', 'Изменение размера Солнца'], x: 'Ось наклонена на 23,5°, поэтому в течение года каждое полушарие получает больше или меньше света.' },
    'Pluviômetro': { q: 'Что измеряет дождемер?', c: 'Количество осадков', e: ['Скорость ветра', 'Температуру', 'Давление воздуха'], x: 'Он измеряет в миллиметрах дождь, выпавший в данном месте.' },
    'Anemômetro': { q: 'Какой прибор измеряет скорость ветра?', c: 'Анемометр', e: ['Дождемер', 'Термометр', 'Барометр'], x: 'Его используют на метеорологических станциях.' },
    'Aquecimento global': { q: 'Какова главная причина глобального потепления?', c: 'Рост количества парниковых газов', e: ['Рост озонового слоя', 'Уменьшение яркости Солнца', 'Кислотные дожди'], x: 'Сжигание ископаемого топлива и вырубка лесов усиливают парниковый эффект.' },
    'Combustível fóssil': { q: 'Что из этого — ископаемое топливо?', c: 'Нефть', e: ['Этанол', 'Ветер', 'Солнечная энергия'], x: 'Нефть, уголь и природный газ образовались из остатков живых организмов и не являются возобновляемыми.' },
    'Energia eólica': { q: 'Какой источник энергии использует ветер?', c: 'Ветровая', e: ['Гидроэлектрическая', 'Тепловая', 'Атомная'], x: 'Ветер вращает лопасти ветрогенераторов; это возобновляемый источник.' },
    'Usina hidrelétrica': { q: 'На гидроэлектростанции энергия берётся…', c: 'из движения воды в водохранилище', e: ['от сжигания угля', 'от деления урана', 'от солнечного света'], x: 'Движущаяся вода вращает турбины, которые вырабатывают электричество.' },
    'Condutor elétrico': { q: 'Какой материал хорошо проводит электричество?', c: 'Медь', e: ['Резина', 'Пластик', 'Сухое дерево'], x: 'Медь легко пропускает ток, поэтому из неё делают провода.' },
    'Isolante elétrico': { q: 'Почему провода покрывают пластиком?', c: 'Потому что пластик — изолятор и предотвращает удары током', e: ['Потому что пластик лучше проводит ток', 'Чтобы провод стал тяжелее', 'Чтобы провод нагревался'], x: 'Изоляторы затрудняют прохождение тока.' },
    'Circuito elétrico': { q: 'Чтобы лампа загорелась, цепь должна быть…', c: 'замкнутой', e: ['разомкнутой', 'без источника', 'без проводов'], x: 'Ток течёт только по замкнутому пути.' }
  };

  /* textos fixos da tela (comparação exata, sem diferenciar maiúsculas) e com números (regex) */
  const D = {
    'SALA AO VIVO': 'КЛАСС В ПРЯМОМ ЭФИРЕ', 'MISSÃO 01 · EXPLORAÇÃO DO CONHECIMENTO': 'МИССИЯ 01 · ИССЛЕДОВАНИЕ ЗНАНИЙ', 'Decole rumo': 'Взлетай', 'ao conhecimento.': 'к знаниям.',
    'Um quiz ao vivo para investigar, pensar e conquistar novos pontos em equipe.': 'Живая викторина: исследуй, думай и зарабатывай новые очки вместе с командой.',
    'Entrar na missão': 'Начать миссию', 'Como funciona': 'Как это работает', 'PERGUNTAS': 'ВОПРОСОВ', 'POR RODADA': 'НА РАУНД', 'PONTOS BASE': 'БАЗОВЫХ ОЧКОВ',
    'ESTAÇÃO DE APRENDIZAGEM': 'УЧЕБНАЯ СТАНЦИЯ', 'Observe.': 'Наблюдай.', 'Pense. Responda.': 'Думай. Отвечай.', 'TURMA CONECTADA · CIÊNCIAS': 'КЛАСС ПОДКЛЮЧЁН · НАУКИ', 'UMA NOVA FORMA DE APRENDER CIÊNCIAS': 'НОВЫЙ СПОСОБ ИЗУЧАТЬ НАУКИ',
    'ENTRADA DA TURMA': 'ВХОД В КЛАСС', 'IDENTIFICAÇÃO DO EXPLORADOR': 'ИДЕНТИФИКАЦИЯ ИССЛЕДОВАТЕЛЯ', 'Pronto para': 'Готова', 'começar?': 'начать?',
    'Selecione seu nome para sincronizar sua pontuação com a sala do professor.': 'Выбери своё имя, чтобы синхронизировать очки с классом учителя.',
    'Conexão segura com a turma': 'Безопасное подключение к классу', 'PORTAL DE ENTRADA': 'ПОРТАЛ ВХОДА', 'Sua turma': 'Твой класс', 'Selecione sua turma...': 'Выбери свой класс...',
    'Seu nome': 'Твоё имя', 'Selecione seu nome...': 'Выбери своё имя...', 'Dupla de investigação': 'Пара-исследователи', 'Você descobrirá seu parceiro ao entrar': 'Ты узнаешь партнёра при входе',
    'Começar missão': 'Начать миссию', 'Não achou seu nome? Ele já pode estar no jogo; avise o professor.': 'Не нашла своё имя? Возможно, оно уже в игре — скажи учителю.',
    '← Voltar para apresentação': '← Назад к началу', 'CIÊNCIAS': 'НАУКИ', 'AO VIVO': 'В ПРЯМОМ ЭФИРЕ', 'Carregando nomes…': 'Загрузка имён…',
    'RESPOSTA INDIVIDUAL': 'ИНДИВИДУАЛЬНЫЙ ОТВЕТ', 'SEUS PONTOS': 'ТВОИ ОЧКИ', 'TEMPO': 'ВРЕМЯ', 'PAUSADO': 'ПАУЗА', 'EM DUPLA COM': 'В ПАРЕ С', 'pontuação da dupla': 'очки пары', 'ROTA DA TURMA': 'МАРШРУТ КЛАССА',
    'Escolha uma alternativa': 'Выбери вариант ответа', 'Uma resposta por pergunta · sem voltar.': 'Один ответ на вопрос · назад нельзя.', 'Revise a explicação antes de avançar.': 'Прочитай объяснение, прежде чем идти дальше.',
    'Próxima pergunta': 'Следующий вопрос', 'Leitura certeira.': 'Точное попадание!', 'O tempo acabou.': 'Время вышло.', 'A investigação continua.': 'Исследование продолжается.',
    'RELATÓRIO DA MISSÃO': 'ОТЧЁТ О МИССИИ', 'MISSÃO CONCLUÍDA · 01': 'МИССИЯ ВЫПОЛНЕНА · 01', 'Você deixou': 'Ты оставила', 'sua marca.': 'свой след.', 'RESULTADO DA RODADA': 'РЕЗУЛЬТАТ РАУНДА',
    'PONTUAÇÃO FINAL': 'ИТОГОВЫЕ ОЧКИ', 'pontos': 'очков', 'acertos': 'правильных', 'precisão': 'точность', 'combo': 'комбо', 'Órbita excelente.': 'Отличная орбита.', 'Boa trajetória.': 'Хорошая траектория.',
    'Toda missão ensina algo novo.': 'Каждая миссия учит чему-то новому.', 'Seu raciocínio está ganhando velocidade.': 'Твоё мышление набирает скорость.', 'Na próxima rodada, você já decola mais preparado.': 'В следующем раунде ты взлетишь уже подготовленнее.',
    'Jogar novamente': 'Играть снова', 'NÍVEL': 'УРОВЕНЬ', 'Voltar ao início': 'Вернуться в начало', 'ORBIT QUIZ · CIÊNCIAS': 'ORBIT QUIZ · НАУКИ',
    'Abrir ou fechar o ranking completo': 'Открыть или закрыть полный рейтинг', 'Responda para entrar no ranking': 'Ответь, чтобы попасть в рейтинг'
  };
  const DL = {}; Object.keys(D).forEach(k => { DL[k.toLowerCase()] = D[k]; });
  const R = [
    [/^PERGUNTA\s+(\d+)\s*\/\s*(\d+)$/i, 'ВОПРОС $1 / $2'], [/^PERGUNTA\s+(\d+)$/i, 'ВОПРОС $1'], [/^NÍVEL\s+(\d+)$/i, 'УРОВЕНЬ $1'], [/^(\d)º ANO ([A-Z])$/i, '$1 КЛАСС $2'], [/^(\d+)s$/, '$1 с'],
    [/^(\d+) respostas corretas até aqui$/i, 'правильных ответов: $1'], [/^Cada resposta é uma nova órbita de aprendizagem\. Veja como foi seu voo, (.+)\.$/, 'Каждый ответ — новая орбита обучения. Вот как прошёл твой полёт, $1.'],
    [/^DUPLA:\s*(.+)$/i, 'ПАРА: $1'], [/^Você está em (\d+)º de (\d+)(.*)$/, 'Ты на $1-м месте из $2$3'], [/^(.*) acertos$/, '$1 правильных'], [/^([\d.,]+) pts$/i, '$1 очк.']
  ];
  const trad = t => {
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(t); const k = m[2]; if (!k) return t;
    const d = DL[k.toLowerCase()]; if (d) return m[1] + d + m[3];
    for (const [re, rep] of R) if (re.test(k)) return m[1] + k.replace(re, rep) + m[3];
    return t;
  };
  let busy = false;
  function aplicar() {
    if (busy || !ligado()) return; busy = true;
    try {
      document.documentElement.lang = 'ru';
      for (const raiz of [document.getElementById('ui'), document.getElementById('placar')]) {
        if (!raiz) continue;
        const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT); let n;
        while ((n = w.nextNode())) { const v = trad(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
        raiz.querySelectorAll('option').forEach(o => { const v = trad(o.textContent); if (v !== o.textContent) { const val = o.value; o.textContent = v; o.value = val; } });
      }
    } finally { busy = false; }
  }
  new MutationObserver(aplicar).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('change', aplicar, true);
  setInterval(aplicar, 700);
})();
