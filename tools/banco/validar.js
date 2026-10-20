/* Uso: node tools/banco/validar.js tools/banco/saida2-N.json   — confere o formato e as regras de qualidade das 10 questões de cada chave */
const fs=require('fs'); const I=require('../../api/individual.js');
const f=process.argv[2]; const o=JSON.parse(fs.readFileSync(f,'utf8')); let n=0;
const ABS=/\b(sempre|nunca|apenas|somente|so|todos|todas|nenhum|nenhuma|exclusivamente|unico|unica)\b/i;
const sem=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
Object.keys(o).forEach(k=>{
  const Q=o[k], er=[], ob=Q.filter(q=>q.tipo==='obj'), di=Q.filter(q=>q.tipo==='dis');
  if(Q.length!==10||ob.length!==5||di.length!==5||Q.slice(0,5).some(q=>q.tipo!=='obj')) er.push('precisa de 5 obj seguidas de 5 dis');
  let longest=0, pos=[0,0,0,0], comFig=0;
  Q.forEach((q,i)=>{
    const p='q'+(i+1)+': ';
    if(!q.enunciado||String(q.enunciado).length<170) er.push(p+'enunciado curto (<170 caracteres): contextualize com dados');
    if(!q.comando) er.push(p+'sem comando');
    const fig=I.limpaFigura(q.figura);
    if(q.figura&&!fig) er.push(p+'figura inválida (tabela 2–4 colunas e 2–6 linhas, mesma largura; barras 2–6 itens; etapas 3–6)');
    if(fig){ if(I.entregaResposta(Object.assign({},q,{figura:fig}))) er.push(p+'figura repete a resposta/alternativa (será descartada): troque rótulos/valores'); else comFig++; }
    if(!fig&&/\b(tabela|quadro|gr[aá]fico|registro|figura|dados a seguir|abaixo)\b/i.test(sem(q.enunciado+' '+q.comando).replace(/abaixo do basico/g,''))) er.push(p+'cita tabela/quadro/gráfico/registro mas não tem figura válida');
    if(q.tipo==='obj'){
      const a=q.alts||[]; if(a.length!==4) er.push(p+'precisa de 4 alternativas'); 
      if(!(q.correta>=0&&q.correta<=3)) er.push(p+'correta fora de 0–3'); else pos[q.correta]++;
      const L=a.map(x=>String(x).length), mx=Math.max(...L), mn=Math.min(...L);
      if(mx/mn>1.3) er.push(p+'alternativas com tamanhos muito diferentes ('+mn+'–'+mx+')');
      if(L[q.correta]===mx) longest++;
      if(a.some(x=>/^\s*[A-Da-d][\)\.]\s/.test(x))) er.push(p+'letra dentro da alternativa');
      if(a.some(x=>/todas as anteriores|nenhuma das/i.test(x))) er.push(p+'"todas/nenhuma das"');
      a.forEach((x,j)=>{ if(j!==q.correta&&ABS.test(sem(x))&&!ABS.test(sem(a[q.correta]))) er.push(p+'absoluto em distrator ("'+x.slice(0,40)+'…")'); });
      if(!q.explicacao) er.push(p+'sem explicação');
    } else { if(!q.ref||!(q.conceitos||[]).length) er.push(p+'dissertativa sem ref/conceitos'); }
  });
  if(longest>2) er.push('a correta é a mais longa em '+longest+' das 5 objetivas (máx. 2)');
  if(Math.max(...pos)>2||pos.filter(x=>x>0).length<3) er.push('posições da correta mal distribuídas '+pos.join(','));
  if(comFig<7) er.push('só '+comFig+' figuras válidas (mínimo 7 de 10)');
  if(er.length){ n++; console.log('✗ '+k.slice(0,70)+'\n   '+er.join('\n   ')); }
});
console.log(n?('\n'+n+' chave(s) com problemas'):'OK — '+Object.keys(o).length+' chaves válidas');
process.exit(n?1:0);
