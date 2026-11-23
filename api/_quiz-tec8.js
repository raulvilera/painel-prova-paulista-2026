/* Quiz de Tecnologia 8º ano (4º bimestre) · Grafos.
   Gabarito, comentários e metadados do relatório ficam só no servidor.
   Grava em public.em_respostas (mesmo formato do relatório do Ensino Médio), avaliacao = 'tec-8-grafos', um envio por aluno. */
const AV = 'tec-8-grafos';
const ESCOLA = 'E. E. PROFª WANDA MASCAGNI DE SÁ';
const TURMAS = ['8º Ano A', '8º Ano B'];
const VF = ['Verdadeira.', 'Falsa.'];

/* n, tema (agrupa no relatório), objeto, enunciado curto, alternativas, correta (letra) e comentário do gabarito */
const Q = [
  { n: 1, ae: 'Vértices e arestas', objeto: 'Ligações diretas de um vértice', enun: 'Com quem Joana trocou mensagens diretamente?',
    alts: ['Marina e Rafael.', 'Marina e Pedro.', 'Lucas e Rafael.', 'Lucas e Pedro.'], cor: 'D',
    com: 'Joana aparece em duas arestas: com Lucas e com Pedro. Só as arestas que tocam o vértice mostram as ligações diretas.' },
  { n: 2, ae: 'Caminhos', objeto: 'Ausência de aresta e intermediários', enun: 'Não há aresta entre Sofia e Gabriel. O que essa ausência indica?',
    alts: ['Não há troca direta, mas Luana ou Enzo podem intermediar.', 'Não existe nenhum caminho entre os dois estudantes.', 'Há troca direta porque ambos estão ligados a Luana e a Enzo.', 'Gabriel e Sofia não pertencem ao mesmo grafo.'], cor: 'A',
    com: 'Sem aresta, não há conexão direta. Mas existem os caminhos Gabriel → Luana → Sofia e Gabriel → Enzo → Sofia, então há intermediários.' },
  { n: 3, ae: 'Vértices e arestas', objeto: 'Representar uma tabela como grafo', enun: 'Como as conexões diretas entre terminais de ônibus devem ser representadas no grafo?',
    alts: ['Por arestas que conectem somente os pares de terminais com ligação registrada na tabela.', 'Por arestas que liguem exclusivamente os terminais da coluna de origem.', 'Por vértices que representem cada conexão registrada.', 'Por vértices que representem os terminais e as conexões entre eles.'], cor: 'A',
    com: 'Terminais são vértices e cada linha da tabela vira uma aresta entre dois terminais. Conexões não são vértices.' },
  { n: 4, ae: 'Vértices e arestas', objeto: 'Modelagem: elementos e relações', enun: 'Cada espaço da mostra é um vértice e uma aresta liga espaços com passagem direta. Verdadeira ou falsa?',
    alts: VF, cor: 'A', com: 'Verdadeira. É exatamente a modelagem padrão: elementos viram vértices e relações diretas viram arestas.' },
  { n: 5, ae: 'Caminhos', objeto: 'Percurso válido no grafo', enun: 'Mateus está no Palco Sol e quer chegar ao Palco Terra. Qual percurso ele pode fazer?',
    alts: ['Sol → Lua → Céu → Terra.', 'Sol → Lua → Mar → Terra.', 'Sol → Mar → Céu → Terra.', 'Sol → Terra → Céu → Lua.'], cor: 'A',
    com: 'Cada passo do percurso precisa ser uma aresta. Lua – Mar, Mar – Céu e Sol – Terra não existem, então só a opção A é válida.' },
  { n: 6, ae: 'Grafos direcionados e com pesos', objeto: 'Sentido da seta e peso', enun: 'A seta da Praça para a Escola tem o número 6. O que isso representa?',
    alts: ['Seis caixas foram transportadas da Praça para a Escola.', 'Seis caixas foram transportadas da Escola para a Praça.', 'A Praça tem conexão direta com seis pontos de coleta.', 'Existem seis caminhos diferentes entre a Praça e a Escola.'], cor: 'A',
    com: 'Em um grafo direcionado, a seta indica o sentido (da Praça para a Escola) e o peso indica a quantidade: 6 caixas.' },
  { n: 7, ae: 'Grau e peso', objeto: 'Comparar grau do vértice e peso da aresta', enun: 'Que conclusão se obtém comparando o grau dos vértices e o peso das arestas?',
    alts: ['Rafael tem o vértice de maior grau e participa da aresta de maior peso.', 'Clara tem o vértice de maior grau, mas a aresta de maior peso liga Beatriz e João.', 'Laura e Mateus têm os vértices de menor grau e formam a aresta de maior peso.', 'Beatriz e João têm os vértices de maior grau porque a aresta entre eles tem o maior peso.'], cor: 'B',
    com: 'Grau é o número de arestas do vértice: Clara tem 5, os demais têm 3. A maior aresta (peso 9) é Beatriz – João. Grau e peso são coisas diferentes.' },
  { n: 8, ae: 'Vértices e arestas', objeto: 'Grafo completo', enun: '“Cada perfil está conectado diretamente a todos os outros perfis.” Verdadeira ou falsa?',
    alts: VF, cor: 'A', com: 'Verdadeira. Com 4 vértices, todos os 6 pares possíveis estão ligados. Esse é um grafo completo.' },
  { n: 9, ae: 'Vértices e arestas', objeto: 'Modelar agrupamentos por tema', enun: 'Um vértice por oficina e arestas entre as que têm o mesmo tema (A, C e E). Verdadeira ou falsa?',
    alts: VF, cor: 'A', com: 'Verdadeira. Cada oficina é um vértice e o tema em comum define a aresta. A, C e E ficam ligadas entre si, e B e D formam outro grupo.' },
  { n: 10, ae: 'Caminhos', objeto: 'Caminho em rede social', enun: 'Qual caminho o vídeo de Camila pode ter percorrido até Ravi?',
    alts: ['Camila → Bia → Leo → Ravi.', 'Camila → Leo → Bia → Ravi.', 'Camila → Bia → Nina → Ravi.', 'Camila → Nina → Maya → Ravi.'], cor: 'C',
    com: 'Teste cada passo: Bia – Leo, Bia – Ravi e Maya – Ravi não são arestas. Já Camila – Bia, Bia – Nina e Nina – Ravi existem.' },
  { n: 11, ae: 'Vértices e arestas', objeto: 'Vizinhos de um vértice', enun: '“Maya está diretamente conectada a Lucas e Pedro.” Verdadeira ou falsa?',
    alts: VF, cor: 'B', com: 'Falsa. Maya se liga a Lucas, Enzo e Júlia. Não há aresta Maya – Pedro.' },
  { n: 12, ae: 'Vértices e arestas', objeto: 'Diferença entre vértice e aresta', enun: '“Bianca é um vértice e a ligação Bianca – Otávio é uma aresta.” Verdadeira ou falsa?',
    alts: VF, cor: 'A', com: 'Verdadeira. Pessoas são vértices e ligações entre elas são arestas.' },
  { n: 13, ae: 'Caminhos', objeto: 'Caminho não é conexão direta', enun: '“Rafaela e Diego possuem conexão direta porque existe um caminho passando por Bruno.” Verdadeira ou falsa?',
    alts: VF, cor: 'B', com: 'Falsa. Existe um caminho (Rafaela → Bruno → Diego), mas conexão direta exige uma aresta própria, e Rafaela – Diego não existe.' },
  { n: 14, ae: 'Grau e peso', objeto: 'Grau dos vértices e deslocamentos diretos (discursiva)', dis: true,
    enun: 'Compare o número de arestas ligadas à Praça e ao Parque e explique o que a diferença indica sobre deslocamentos diretos.',
    com: 'Resposta esperada: a Praça tem 3 arestas (Biblioteca, Parque e Escola) e o Parque tem 4 (Praça, Biblioteca, Escola e Museu). O Parque está ligado diretamente a mais locais, então oferece uma possibilidade a mais de deslocamento direto.' }
];
const OBJ = Q.filter(q => !q.dis);
const id = n => AV + '-' + String(n).padStart(2, '0');

/* Correção provisória da discursiva (o professor revisa no relatório): graus 3 e 4 + conclusão sobre o Parque */
function corrigeDiscursiva(txt) {
  const t = String(txt || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  if (t.replace(/\s/g, '').length < 15) return { nota: 0, comentario: 'Resposta em branco ou muito curta.' };
  const tres = /\b(3|tres)\b/.test(t), quatro = /\b(4|quatro)\b/.test(t);
  const conclusao = /parque/.test(t) && /(mais|maior)/.test(t);
  const pts = (tres ? 1 : 0) + (quatro ? 1 : 0) + (conclusao ? 1 : 0);
  const nota = pts >= 3 ? 1 : pts === 2 ? 0.67 : pts === 1 ? 0.33 : 0;
  const falta = [];
  if (!tres) falta.push('quantas arestas tem a Praça (3)');
  if (!quatro) falta.push('quantas arestas tem o Parque (4)');
  if (!conclusao) falta.push('que o Parque tem mais ligações diretas');
  return { nota, comentario: falta.length ? 'Faltou dizer ' + falta.join(', ') + '.' : 'Resposta completa: comparou os graus e tirou a conclusão.' };
}

const META = {};
Q.forEach(q => { META[id(q.n)] = { tipo: q.dis ? 'dis' : 'obj', av: AV, hab: '', ae: q.ae, objeto: q.objeto, n: q.n, enun: q.enun, cor: q.dis ? '' : q.cor, alts: q.alts || null, serie: '8', comp: 'Tecnologia' }; });

async function handler(req, res, SB, KEY) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store');
  const out = (c, v) => { res.statusCode = c; res.end(JSON.stringify(v)); };
  if (req.method !== 'POST') return out(405, { ok: false, erro: 'método não permitido' });
  if (!SB || !KEY) return out(500, { ok: false, erro: 'Banco não configurado.' });
  let d = req.body;
  if (!d || typeof d !== 'object') { try { d = JSON.parse(d || '{}'); } catch (e) { return out(400, { ok: false, erro: 'corpo inválido' }); } }
  const turma = String(d.turma || ''), nome = String(d.nome || '').trim().slice(0, 120), n = parseInt(d.chamada, 10);
  if (!TURMAS.includes(turma) || !nome || !(n >= 1 && n <= 60)) return out(400, { ok: false, erro: 'Escolha a turma e o seu nome.' });

  const resp = d.respostas || {};
  let acertos = 0;
  const itens = [], devolutiva = [];
  Q.forEach(q => {
    if (q.dis) {
      const texto = String(d.dissertativa || '').slice(0, 2000), c = corrigeDiscursiva(texto);
      itens.push({ id: id(q.n), tipo: 'dis', resp: texto, nota: c.nota, comentario: c.comentario + ' (correção automática provisória; revise)' });
      devolutiva.push({ n: q.n, dis: true, nota: c.nota, comentario: c.comentario, esperado: q.com });
      return;
    }
    const r = String(resp[q.n] || '').trim().toUpperCase().slice(0, 1), ok = !!r && r === q.cor;
    if (ok) acertos++;
    itens.push({ id: id(q.n), tipo: 'obj', resp: r, acerto: ok, correta: 'ABCDE'.indexOf(q.cor), alts: q.alts });
    devolutiva.push({ n: q.n, marcada: r, correta: q.cor, acertou: ok, comentario: q.com });
  });
  const notaObj = Math.round(acertos / OBJ.length * 100) / 10;
  const dis = itens.find(i => i.tipo === 'dis');
  const notaFinal = Math.round((acertos + dis.nota) / Q.length * 100) / 10;
  const envio = AV + '|' + turma + '|' + n;
  const H = { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' };
  try {
    const ja = await fetch(SB + '/rest/v1/em_respostas?select=criado&envio_id=eq.' + encodeURIComponent(envio), { headers: H });
    if (ja.ok && (await ja.json()).length) return out(409, { ok: false, jaEnviou: true, erro: 'Você já enviou este quiz. Se precisar refazer, peça ao professor para liberar um novo envio.' });
    const r = await fetch(SB + '/rest/v1/em_respostas?on_conflict=envio_id', {
      method: 'POST', headers: Object.assign({ Prefer: 'resolution=ignore-duplicates,return=minimal' }, H),
      body: JSON.stringify({ envio_id: envio, avaliacao: AV, turma_id: turma, turma, componente: 'Tecnologia', prova: 'Quiz de grafos (4º bimestre)',
        n, nome, ra: '', itens, acertos, total_obj: OBJ.length, nota_obj: notaObj, nota_final: notaFinal,
        status: 'objetivas corrigidas; discursiva com correção provisória' })
    });
    if (!r.ok) return out(502, { ok: false, erro: 'Não foi possível gravar agora (' + r.status + '). Tente de novo.' });
  } catch (e) { return out(502, { ok: false, erro: 'Falha de conexão com o banco. Tente de novo.' }); }
  return out(200, { ok: true, escola: ESCOLA, acertos, totalObj: OBJ.length, notaObj, notaFinal, devolutiva });
}

module.exports = { AV, META, handler };
