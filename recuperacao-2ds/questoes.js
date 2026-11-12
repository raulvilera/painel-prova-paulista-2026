/* Recuperação semestral · Biologia · 2ª Série A (Desenvolvimento de Sistemas) · E.E. Profª Wanda Mascagni de Sá
   Base: Plano de aula 23/11 a 30/11 (Plano de Recuperação do 2º semestre) — AE6, AE7 (3º bim.) e AE8 (4º bim.).
   Arquivo PÚBLICO: só enunciados e alternativas. O gabarito e os critérios das dissertativas ficam em api/_recuperacao-2ds-gabarito.js.
   Usado pela página (window.REC2DS) e pelo servidor (require). */
(function (dados) {
  if (typeof module !== 'undefined' && module.exports) module.exports = dados; else window.REC2DS = dados;
})({
  id: 'bio-2-recuperacao',
  titulo: 'Recuperação Semestral de Biologia',
  turmaId: '2a-manha',
  turmaRotulo: '2ª Série A Manhã (Des. Sistemas)',
  turmaBanco: '2ª Série A (DS)',
  componente: 'Biologia',
  prova: 'Recuperação semestral (2º semestre)',
  blocos: [
    { titulo: 'Do DNA à proteína', ae: 'AE7', questoes: [1, 2, 6] },
    { titulo: 'Clonagem, edição de DNA e vacinas', ae: 'AE6', questoes: [3, 4, 7] },
    { titulo: 'Sistema endócrino, contracepção, IST e dependência química', ae: 'AE8', questoes: [5, 8, 9, 10] }
  ],
  questoes: [
    /* ======================= OBJETIVAS ======================= */
    {
      n: 1, id: 'bio-2-recuperacao-01',
      foto: { unsplash: 'djo3iNJpaOE', src: 'https://images.unsplash.com/photo-1638271522560-a247d127deb8?ixlib=rb-4.1.0&fit=max&w=900&q=75', autor: 'Anirudh', perfil: 'lanirudhreddy', legenda: 'Representação em 3D de hemácias (glóbulos vermelhos) normais, com forma de disco.' }, tipo: 'obj', ae: 'AE7', hab: 'EM13CNT301',
      objeto: 'Tradução, código genético e mutação (anemia falciforme)',
      texto: '<p>A anemia falciforme é uma das doenças hereditárias mais comuns no Brasil e faz parte do Teste do Pezinho oferecido pelo SUS. Nas pessoas afetadas, as hemácias assumem forma de foice quando há pouco oxigênio, o que dificulta a circulação e provoca crises de dor. A alteração está no gene da cadeia beta da hemoglobina. O quadro compara o mesmo trecho desse gene em uma pessoa sem a doença e em uma pessoa com anemia falciforme.</p>',
      figura: '<table class="tab"><thead><tr><th></th><th>Trecho da fita molde do DNA</th><th>Códon no RNAm</th><th>Aminoácido na posição 6</th></tr></thead><tbody><tr><td>Hemoglobina normal (HbA)</td><td>C T C</td><td>G A G</td><td>Ácido glutâmico</td></tr><tr><td>Hemoglobina S (HbS)</td><td>C A C</td><td>G U G</td><td>Valina</td></tr></tbody></table><p class="fonte">Quadro elaborado para fins didáticos.</p>',
      comando: 'A comparação entre as duas situações permite concluir que a anemia falciforme resulta de',
      alts: [
        'uma alteração no RNA transportador, que passa a carregar valina no lugar de ácido glutâmico, embora o DNA permaneça igual.',
        'uma substituição de base no DNA, que altera um códon do RNAm e leva à incorporação de valina no lugar de ácido glutâmico durante a tradução.',
        'uma mutação silenciosa, pois, como o código genético é degenerado, a proteína não muda e a doença depende apenas do ambiente.',
        'um bloqueio da transcrição do gene, que impede a produção de RNAm e, portanto, de qualquer hemoglobina.',
        'o surgimento de um códon de parada no RNAm, que interrompe a tradução e produz uma hemoglobina mais curta.'
      ]
    },
    {
      n: 2, id: 'bio-2-recuperacao-02',
      foto: { unsplash: 'RS0-h_pyByk', src: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.1.0&fit=max&w=900&q=75', autor: 'Roberto Sorin', perfil: 'roberto_sorin', legenda: 'Comprimidos de antibióticos em embalagens.' }, tipo: 'obj', ae: 'AE7', hab: 'EM13CNT301',
      objeto: 'Replicação, transcrição e tradução (antibióticos e ribossomos)',
      texto: '<p>O uso de antibióticos sem prescrição favorece a seleção de bactérias resistentes, e por isso a venda desses medicamentos no Brasil exige retenção da receita. Antibióticos como a tetraciclina e a estreptomicina atuam ligando-se aos ribossomos bacterianos, que têm estrutura diferente dos ribossomos do citoplasma das células humanas. O esquema representa o fluxo da informação genética em uma célula.</p>',
      figura: '<svg viewBox="0 0 560 150" role="img" aria-label="Esquema: DNA se duplica pelo processo I; DNA forma RNA pelo processo II; RNA forma proteína pelo processo III"><defs><marker id="s2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#1d4e89"/></marker></defs><rect x="20" y="60" width="110" height="48" rx="10" fill="#e8f0fa" stroke="#1d4e89" stroke-width="2"/><text x="75" y="90" text-anchor="middle" font-size="20" font-weight="700" fill="#1d4e89">DNA</text><rect x="225" y="60" width="110" height="48" rx="10" fill="#fdf2e3" stroke="#b9770e" stroke-width="2"/><text x="280" y="90" text-anchor="middle" font-size="20" font-weight="700" fill="#b9770e">RNA</text><rect x="430" y="60" width="115" height="48" rx="10" fill="#e6f5ec" stroke="#1b7f4b" stroke-width="2"/><text x="487" y="90" text-anchor="middle" font-size="20" font-weight="700" fill="#1b7f4b">Proteína</text><path d="M50,58 C40,10 110,10 100,58" fill="none" stroke="#1d4e89" stroke-width="2.5" marker-end="url(#s2)"/><text x="75" y="22" text-anchor="middle" font-size="18" font-weight="700">I</text><line x1="132" y1="84" x2="221" y2="84" stroke="#1d4e89" stroke-width="2.5" marker-end="url(#s2)"/><text x="176" y="74" text-anchor="middle" font-size="18" font-weight="700">II</text><line x1="337" y1="84" x2="426" y2="84" stroke="#1d4e89" stroke-width="2.5" marker-end="url(#s2)"/><text x="381" y="74" text-anchor="middle" font-size="18" font-weight="700">III</text></svg>',
      comando: 'Considerando o local de ação desses antibióticos, o processo diretamente inibido e a justificativa para sua ação ser mais intensa nas bactérias do que nas células humanas são:',
      alts: [
        'I, a replicação, pois o ribossomo é a estrutura que copia o DNA antes da divisão da bactéria.',
        'II, a transcrição, pois o ribossomo bacteriano produz o RNAm a partir do DNA no interior do núcleo.',
        'III, a tradução, que nas bactérias ocorre dentro do núcleo, local onde o antibiótico se acumula.',
        'III, a tradução, pois o ribossomo lê os códons do RNAm e une os aminoácidos trazidos pelos RNAt, e a diferença entre ribossomos bacterianos e humanos torna a ação seletiva.',
        'II, a transcrição, pois sem ribossomos funcionais a bactéria deixa de formar o RNA, embora continue produzindo proteínas.'
      ]
    },
    {
      n: 3, id: 'bio-2-recuperacao-03',
      foto: { unsplash: 'GHOiyov2TSQ', src: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?ixlib=rb-4.1.0&fit=max&w=900&q=75', autor: 'Sam Carter', perfil: 'samdc', legenda: 'Ovelha em uma pastagem (imagem ilustrativa).' }, tipo: 'obj', ae: 'AE6', hab: 'EM13CNT304',
      objeto: 'Clonagem reprodutiva (transferência nuclear)',
      texto: '<p>Em 1996, no Instituto Roslin (Escócia), nasceu a ovelha Dolly, primeiro mamífero clonado a partir de uma célula adulta. A técnica utilizada, a transferência nuclear, está esquematizada a seguir. A partir dela, a clonagem passou a ser usada em pesquisas com animais, mas a clonagem reprodutiva de seres humanos é proibida em diversos países, incluindo o Brasil.</p>',
      figura: '<svg viewBox="0 0 640 190" role="img" aria-label="Esquema da clonagem da ovelha Dolly: núcleo de célula da glândula mamária da ovelha A é colocado no óvulo sem núcleo da ovelha B; o embrião é implantado no útero da ovelha C, que dá à luz Dolly"><defs><marker id="s3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#333"/></marker></defs><g font-size="13" text-anchor="middle"><rect x="6" y="10" width="198" height="58" rx="10" fill="#e8f0fa" stroke="#1d4e89"/><text x="105" y="34" font-weight="700">Ovelha A</text><text x="105" y="54">célula da glândula mamária</text><rect x="6" y="118" width="198" height="58" rx="10" fill="#fdf2e3" stroke="#b9770e"/><text x="105" y="142" font-weight="700">Ovelha B</text><text x="105" y="162">óvulo (núcleo retirado)</text><circle cx="300" cy="90" r="36" fill="#fff" stroke="#555" stroke-width="2"/><circle cx="300" cy="90" r="12" fill="#1d4e89"/><text x="300" y="146">núcleo de A +</text><text x="300" y="162">citoplasma de B</text><rect x="392" y="61" width="140" height="58" rx="10" fill="#e6f5ec" stroke="#1b7f4b"/><text x="462" y="85" font-weight="700">Ovelha C</text><text x="462" y="105">barriga de aluguel</text><rect x="554" y="61" width="80" height="58" rx="10" fill="#fff" stroke="#333" stroke-width="2"/><text x="594" y="95" font-weight="700">Dolly</text></g><line x1="206" y1="45" x2="266" y2="76" stroke="#333" stroke-width="2" marker-end="url(#s3)"/><line x1="206" y1="145" x2="266" y2="106" stroke="#333" stroke-width="2" marker-end="url(#s3)"/><line x1="338" y1="90" x2="388" y2="90" stroke="#333" stroke-width="2" marker-end="url(#s3)"/><line x1="534" y1="90" x2="550" y2="90" stroke="#333" stroke-width="2" marker-end="url(#s3)"/></svg>',
      comando: 'Com base no esquema e nos conhecimentos sobre a localização do material genético na célula, conclui-se que Dolly',
      alts: [
        'tinha DNA nuclear idêntico ao da ovelha A, mas seu DNA mitocondrial era herdado da ovelha B, que forneceu o citoplasma do óvulo.',
        'era geneticamente idêntica à ovelha C, pois foi no útero dela que o embrião se desenvolveu e recebeu nutrientes.',
        'resultou da fecundação do óvulo da ovelha B por um espermatozoide, sendo a ovelha A apenas doadora de nutrientes.',
        'tinha metade dos genes da ovelha A e metade da ovelha B, como ocorre em qualquer reprodução sexuada.',
        'era idêntica à ovelha A em todas as características, já que fatores ambientais não interferem no fenótipo de um clone.'
      ]
    },
    {
      n: 4, id: 'bio-2-recuperacao-04',
      foto: { unsplash: 'cM1aU42FnRg', src: 'https://images.unsplash.com/photo-1611694449252-02453c27856a?ixlib=rb-4.1.0&fit=max&w=900&q=75', autor: 'Mufid Majnun', perfil: 'mufidpwt', legenda: 'Profissional de saúde preparando uma dose de vacina.' }, tipo: 'obj', ae: 'AE6', hab: 'EM13CNT304',
      objeto: 'Vacinas de RNA mensageiro e desinformação',
      texto: '<p>Durante a pandemia de covid-19, circulou nas redes sociais a mensagem: <em>“As vacinas de RNA mensageiro modificam o DNA de quem é vacinado”</em>. Essas vacinas contêm uma molécula de RNAm sintético, envolvida em uma cápsula de lipídios, com a informação para produzir a proteína S (espícula) do coronavírus. A molécula atua no citoplasma das células e é degradada em poucos dias.</p>',
      comando: 'Uma explicação cientificamente adequada para desmentir a mensagem, considerando o funcionamento dessas vacinas, é que o RNAm',
      alts: [
        'é transcrito em DNA no núcleo, mas essa alteração atinge apenas as células do braço, onde a vacina é aplicada.',
        'carrega o vírus atenuado, que se multiplica em pequena quantidade sem conseguir alcançar o núcleo da célula.',
        'contém anticorpos prontos contra o vírus, que agem imediatamente e por isso dispensam a participação do DNA.',
        'é replicado indefinidamente pela célula, garantindo a produção permanente da proteína do vírus sem mexer no DNA.',
        'é traduzido pelos ribossomos em uma proteína do vírus, que estimula a produção de anticorpos e células de memória, sem ser incorporado ao DNA, pois não entra no núcleo e é degradado em pouco tempo.'
      ]
    },
    {
      n: 5, id: 'bio-2-recuperacao-05',
      foto: { unsplash: '0jE8ynV4mis', src: 'https://images.unsplash.com/photo-1606206591513-adbfbdd7a177?ixlib=rb-4.1.0&fit=max&w=900&q=75', autor: 'Testalize.me', perfil: 'testalizeme', legenda: 'Tubos com amostras de sangue em um laboratório de análises.' }, tipo: 'obj', ae: 'AE8', hab: 'EM13CNT207',
      objeto: 'IST: sífilis, testagem e prevenção',
      texto: '<p>Boletins epidemiológicos do Ministério da Saúde vêm registrando, na última década, crescimento dos casos de sífilis adquirida, com grande participação de jovens. Em uma ação de testagem rápida gratuita em uma Unidade Básica de Saúde, foram obtidos os dados abaixo.</p>',
      figura: '<table class="tab"><thead><tr><th>Faixa etária</th><th>Testes realizados</th><th>Testes reagentes (positivos)</th><th>Reagentes que não tinham nenhum sintoma</th></tr></thead><tbody><tr><td>15 a 19 anos</td><td>400</td><td>12</td><td>9</td></tr><tr><td>20 a 29 anos</td><td>600</td><td>27</td><td>18</td></tr><tr><td>30 a 39 anos</td><td>500</td><td>10</td><td>6</td></tr></tbody></table><p class="fonte">Valores ilustrativos, elaborados para fins didáticos.</p>',
      comando: 'A conclusão compatível com os dados e com os conhecimentos sobre as infecções sexualmente transmissíveis é:',
      alts: [
        'Pessoas sem sintomas não transmitem a sífilis, por isso a testagem deve ser feita apenas por quem apresenta feridas.',
        'Como a maioria dos casos não tinha sintomas, a sífilis se cura sozinha e o tratamento só é necessário nas fases avançadas.',
        'A maior parte dos casos positivos foi encontrada em pessoas sem sintomas, o que mostra a importância da testagem mesmo sem sinais aparentes, e o uso do preservativo reduz o risco de transmissão.',
        'A faixa de 15 a 19 anos não precisa de ações de prevenção, pois teve o menor número de testes reagentes.',
        'O uso de contraceptivos hormonais e a vacinação contra a sífilis, oferecida pelo SUS, dispensam o preservativo nas relações sexuais.'
      ]
    },

    /* ======================= DISSERTATIVAS ======================= */
    {
      n: 6, id: 'bio-2-recuperacao-06',
      foto: { unsplash: '-qycBqByWIY', src: 'https://images.unsplash.com/photo-1637929476734-bd7f5f78e40a?ixlib=rb-4.1.0&fit=max&w=900&q=75', autor: 'Warren Umoh', perfil: 'warrenumoh', legenda: 'Representação da dupla-hélice do DNA.' }, tipo: 'dis', ae: 'AE7', hab: 'EM13CNT301',
      objeto: 'Transcrição e tradução: do gene ao polipeptídio',
      texto: '<p>Na área de Desenvolvimento de Sistemas, um programa transforma um código-fonte em instruções que a máquina executa. De forma comparável, a célula “converte” a sequência de bases do DNA em uma sequência de aminoácidos. Considere o trecho da <strong>fita molde</strong> de um gene e o quadro com parte do código genético.</p>',
      figura: '<p class="seq">Fita molde do DNA: 3’ – T A C &nbsp; G G A &nbsp; T T C &nbsp; C A T &nbsp; A T C – 5’</p><table class="tab"><thead><tr><th>Códon (RNAm)</th><th>AUG</th><th>CCU</th><th>AAG</th><th>GUA</th><th>UAG</th><th>GGA</th><th>UUC</th><th>CAU</th></tr></thead><tbody><tr><td>Significado</td><td>Metionina (início)</td><td>Prolina</td><td>Lisina</td><td>Valina</td><td>Parada</td><td>Glicina</td><td>Fenilalanina</td><td>Histidina</td></tr></tbody></table>',
      comando: '<ol type="a"><li>Escreva a sequência do RNAm transcrito a partir dessa fita molde.</li><li>Indique a sequência de aminoácidos formada e explique por que o último códon não corresponde a um aminoácido.</li><li>Cite onde ocorrem a transcrição e a tradução em uma célula eucariótica e a função do RNA transportador (RNAt).</li></ol>',
      linhas: 8
    },
    {
      n: 7, id: 'bio-2-recuperacao-07',
      foto: { unsplash: 'RlOAwXt2fEA', src: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?ixlib=rb-4.1.0&fit=max&w=900&q=75', autor: 'Julia Koblitz', perfil: 'jkoblitz', legenda: 'Pesquisadora manipulando amostras com uma pipeta em laboratório.' }, tipo: 'dis', ae: 'AE6', hab: 'EM13CNT304',
      objeto: 'Edição genética (CRISPR): ética, lei e sociedade',
      texto: '<p>Em 2018, um pesquisador chinês anunciou o nascimento de gêmeas cujos embriões haviam sido editados com a técnica CRISPR-Cas9 para tentar torná-las resistentes ao HIV. O caso foi condenado pela comunidade científica internacional, e o pesquisador foi condenado à prisão em seu país. Já a edição de células somáticas (que não passam aos descendentes) vem sendo testada no tratamento de doenças como a anemia falciforme. No Brasil, a Lei de Biossegurança (Lei nº 11.105/2005) proíbe a engenharia genética em célula germinativa, zigoto e embrião humanos.</p>',
      comando: '<ol type="a"><li>Diferencie a edição genética de células somáticas da edição de embriões quanto à transmissão das alterações às próximas gerações.</li><li>Apresente <strong>um argumento ético</strong> e <strong>um argumento legal ou social</strong> que justifiquem a reação da comunidade científica ao caso de 2018.</li><li>Proponha uma condição que deveria ser respeitada para que uma terapia com edição de DNA seja usada de forma responsável.</li></ol>',
      linhas: 8
    },
    {
      n: 8, id: 'bio-2-recuperacao-08',
      foto: { unsplash: 'lYR44OXwMA4', src: 'https://images.unsplash.com/photo-1576063513230-e65b5ed1a3a0?ixlib=rb-4.1.0&fit=max&w=900&q=75', autor: 'Reproductive Health Supplies Coalition', perfil: 'rhsupplies', legenda: 'Diferentes métodos contraceptivos, entre eles pílulas e preservativo.' }, tipo: 'dis', ae: 'AE8', hab: 'EM13CNT207',
      objeto: 'Sistema endócrino, ciclo ovariano e contraceptivos hormonais',
      texto: '<p>O SUS oferece gratuitamente diferentes métodos contraceptivos, entre eles a pílula combinada (com estrogênio e progesterona sintéticos), a injeção trimestral e o preservativo. Em uma roda de conversa, um estudante comentou: <em>“Se a pílula é hormônio, ela age igual ao preservativo: impede tudo, até as infecções”.</em> O ciclo ovariano é controlado pelo hipotálamo e pela hipófise, que liberam hormônios (como FSH e LH) responsáveis pelo amadurecimento do folículo e pela ovulação.</p>',
      comando: '<ol type="a"><li>Explique como os hormônios da pílula combinada interferem na liberação de FSH e LH pela hipófise e por que isso impede a ovulação.</li><li>Corrija a afirmação do estudante, explicando a diferença entre o modo de ação da pílula e o do preservativo.</li><li>Justifique por que os profissionais de saúde recomendam a “dupla proteção”.</li></ol>',
      linhas: 8
    },
    {
      n: 9, id: 'bio-2-recuperacao-09',
      foto: { unsplash: 'uN8TV9Pw2ik', src: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?ixlib=rb-4.1.0&fit=max&w=900&q=75', autor: 'CDC', perfil: 'cdc', legenda: 'Profissional de saúde fazendo curativo no local da aplicação de uma vacina.' }, tipo: 'dis', ae: 'AE8', hab: 'EM13CNT207',
      objeto: 'HPV: vacinação, câncer e prevenção combinada',
      texto: '<p>O papilomavírus humano (HPV) é transmitido principalmente por via sexual e está associado a vários tipos de câncer, como o de colo do útero, o de pênis e o de garganta. O Ministério da Saúde oferece a vacina contra o HPV gratuitamente para meninas e meninos de 9 a 14 anos, em dose única, mas a cobertura vacinal ainda está abaixo da meta em muitos municípios. A escola decidiu fazer uma campanha sobre o tema, sem expor a vida de nenhum estudante.</p>',
      comando: '<ol type="a"><li>Explique por que a vacina é indicada antes do início da vida sexual e como ela protege o organismo.</li><li>Explique por que, mesmo vacinada, uma pessoa deve continuar usando preservativo e fazendo os exames preventivos.</li><li>Sugira <strong>duas ações</strong> da campanha escolar para aumentar a vacinação e a prevenção, respeitando a privacidade dos estudantes.</li></ol>',
      linhas: 8
    },
    {
      n: 10, id: 'bio-2-recuperacao-10',
      foto: { unsplash: 'XLhDvfz0sUM', src: 'https://images.unsplash.com/photo-1579165466991-467135ad3110?ixlib=rb-4.1.0&fit=max&w=900&q=75', autor: 'CDC', perfil: 'cdc', legenda: 'Técnica de laboratório analisando cigarros eletrônicos.' }, tipo: 'dis', ae: 'AE8', hab: 'EM13CNT207',
      objeto: 'Dependência química (nicotina e cigarro eletrônico) e vulnerabilidades das juventudes',
      texto: '<p>No Brasil, a Anvisa proíbe a fabricação, a importação e a venda de cigarros eletrônicos (“vapes”), decisão reafirmada em 2024. Mesmo assim, eles são vendidos ilegalmente e se tornaram populares entre adolescentes, com sabores doces e aparência de pen drive. Muitos desses dispositivos contêm altas concentrações de nicotina, substância que age no sistema nervoso central e estimula a liberação de dopamina, neurotransmissor ligado à sensação de prazer e recompensa.</p>',
      comando: '<ol type="a"><li>Explique como a ação da nicotina no sistema nervoso pode levar à dependência química.</li><li>Identifique <strong>dois fatores</strong> que tornam os jovens mais vulneráveis ao uso do cigarro eletrônico.</li><li>Explique por que a dependência química é tratada como um problema de saúde pública e proponha <strong>uma ação</strong> de prevenção ou de promoção da saúde para a comunidade escolar.</li></ol>',
      linhas: 8
    }
  ]
});
