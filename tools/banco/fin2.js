const fs=require('fs');
const inp=JSON.parse(fs.readFileSync('entrada-2.json','utf8'));
const keys=Object.keys(inp);
const all=[...require('./p2a.js'),...require('./p2b.js')];
const out={};keys.forEach((k,i)=>out[k]=all[i]);
fs.writeFileSync('saida-2.json',JSON.stringify(out,null,1),'utf8');
let bad=0;
for(const k of keys){const q=out[k];
 if(q.length!==10)bad++;
 q.forEach((x,i)=>{if(i<5){if(x.tipo!=='obj'||x.alts.length!==4||!(x.correta>=0&&x.correta<=3))bad++}else if(x.tipo!=='dis')bad++;
  const f=x.figura;if(f){if(f.tipo==='tabela'&&(f.linhas.length<2||f.linhas.some(l=>l.length!==f.colunas.length)||f.colunas.length>4))bad++;
  if(f.tipo==='barras'&&(f.itens.length<2||f.itens.length>6))bad++;
  if(f.tipo==='etapas'&&(f.etapas.length<3||f.etapas.length>6))bad++;}});
 if(q.filter(x=>!x.figura).length>2)bad++;
 console.log(k,q.slice(0,5).map(x=>x.correta).join(''),q.filter(x=>!x.figura).length);}
console.log('bad',bad);
