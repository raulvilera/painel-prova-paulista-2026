/* Uso: node tools/banco/validar-sim.js <arquivo.json>  — valida as 10 questões (7 obj + 3 dis) de uma série do Simulado */
const fs=require('fs'); const Q=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const er=[];
const ABS=/\b(sempre|nunca|apenas|somente|todos|todas|nenhum|nenhuma|exclusivamente|necessariamente)\b/i;
const sem=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
if(Q.length!==10) er.push('precisa de 10 questões'); let longest=0,pos=[0,0,0,0,0];
Q.forEach((q,i)=>{ const p='q'+(i+1)+': ';
  if((i<7)!==(q.tipo==='obj')) er.push(p+'ordem: 7 obj depois 3 dis');
  ['hab','saresp','grupo','bim','enunciado','comando'].forEach(c=>{ if(!q[c]) er.push(p+'falta '+c); });
  if(String(q.enunciado).length<260) er.push(p+'enunciado curto (<260): traga dados/contexto');
  if(q.img&&!/^<svg[\s\S]*<\/svg>\s*$/.test(q.img)) er.push(p+'img não é SVG válido');
  if(q.tipo==='obj'){ const a=q.alts||[]; if(a.length!==5) er.push(p+'precisa de 5 alternativas');
    if(!(q.correta>=0&&q.correta<=4)) er.push(p+'correta fora de 0–4'); else pos[q.correta]++;
    const L=a.map(x=>String(x).length); if(Math.max(...L)/Math.min(...L)>1.3) er.push(p+'tamanhos muito diferentes ('+Math.min(...L)+'–'+Math.max(...L)+')');
    if(L[q.correta]===Math.max(...L)) longest++;
    a.forEach((x,j)=>{ if(j!==q.correta&&ABS.test(sem(x))&&!ABS.test(sem(a[q.correta]))) er.push(p+'absoluto em distrator: '+x.slice(0,40)); });
    if(a.some(x=>/todas as anteriores|nenhuma das/i.test(x))) er.push(p+'"todas/nenhuma das"');
  } else { if(!q.ref||!(q.conceitos||[]).length) er.push(p+'dissertativa sem ref/conceitos'); }
});
if(longest>2) er.push('a correta é a mais longa em '+longest+' das 7 objetivas (máx. 2)');
if(Math.max(...pos)>2||pos.filter(x=>x>0).length<4) er.push('posições da correta mal distribuídas '+pos.join(','));
console.log(er.length?er.map(x=>'✗ '+x).join('\n'):'OK'); process.exit(er.length?1:0);
