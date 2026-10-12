const fs=require('fs');
const inp=JSON.parse(fs.readFileSync('entrada2-0.json','utf8'));
const keys=Object.keys(inp);
const T=[[1,2,0,3,2],[0,2,3,1,0],[3,0,2,1,2],[1,3,0,2,3],[1,1,0,0,1],[2,1,0,1,0],[1,3,3,0,0],[1,0,1,0,1],[1,1,2,3,3],[0,1,3,2,3]];
const out={};
keys.forEach((k,i)=>{const q=require('./w0/k'+i+'.js').map(x=>({...x}));
 // reposiciona a correta para o alvo, trocando
 const tg=[[1,2,0,3,2],[0,2,3,1,0],[2,0,3,1,2],[1,3,0,2,3],[3,0,2,1,2],[2,1,0,3,1],[1,3,2,0,3],[1,0,1,3,2],[1,2,3,0,3],[0,1,3,2,3]][i];
 q.slice(0,5).forEach((x,j)=>{const a=[...x.alts];const c=a[x.correta];const t=tg[j];[a[t],a[x.correta]]=[a[x.correta],a[t]];x.alts=a;x.correta=t;});
 out[k]=q;});
const REP=[["pois o Sol passaria a girar em torno da Terra todos os dias.", "pois o Sol passaria a girar em torno da Terra a cada dia."], ["A distância é sempre a mesma, por isso a noite deveria ocorrer na mesma hora em todo o planeta.", "A distância é constante, por isso a noite deveria ocorrer na mesma hora em todo o planeta."], ["elimina todas as doenças e garante", "elimina as doenças e garante"], ["A qualidade piora apenas após a indústria", "A qualidade piora só após a indústria"], ["posicioná-los em fila, para aumentar a força.", "posicioná-los em fila, para ganhar força."], ["A população tem sempre razão ao recusar medidas de saúde pública e vacinas obrigatórias.", "A população tem razão ao recusar medidas de saúde pública e vacinas obrigatórias."], ["A vacinação obrigatória nunca é eficaz, e é melhor deixar apenas as campanhas voluntárias.", "A vacinação obrigatória é ineficaz, e é melhor deixar as campanhas voluntárias."]];
for(const k of keys)out[k].forEach(x=>{if(x.alts)x.alts=x.alts.map(a=>REP.reduce((t,[f,r])=>t.split(f).join(r),a))});
require('./w0/patch.js').forEach(([a,b,c,t])=>{out[keys[a]][b].alts[c]=t});
fs.writeFileSync(__dirname+'/saida2-0.json',JSON.stringify(out,null,1),'utf8');
let bad=0;
for(const k of keys){const q=out[k];
 if(q.length!==10)bad++;
 let longest=0;
 q.forEach((x,i)=>{if(i<5){if(x.tipo!=='obj'||x.alts.length!==4||!(x.correta>=0&&x.correta<=3)){bad++;return}
  const L=x.alts.map(s=>s.length);const mx=Math.max(...L),mn=Math.min(...L);
  if(L[x.correta]===mx&&L.filter(l=>l===mx).length===1)longest++;
  if(mx/mn>1.3)console.log('  spread',k.slice(0,12),i,L.join(','));
 }else if(x.tipo!=='dis')bad++;
  const f=x.figura;if(f){if(f.tipo==='tabela'&&(f.linhas.length<2||f.linhas.some(l=>l.length!==f.colunas.length)||f.colunas.length>4||f.colunas.length<2))bad++;
  if(f.tipo==='barras'&&(f.itens.length<2||f.itens.length>6))bad++;
  if(f.tipo==='etapas'&&(f.etapas.length<3||f.etapas.length>6))bad++;}});
 const nf=q.filter(x=>!x.figura).length;
 console.log(k.slice(0,14),q.slice(0,5).map(x=>x.correta).join(''),'semfig',nf,'maislonga',longest);
 if(nf>3||longest>2)bad++;}
console.log('bad',bad);
