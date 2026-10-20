/* Junta tools/banco/saida-*.json, valida (figura e trava anti-resposta) e gera api/_banco-indiv.js */
const fs=require('fs'),path=require('path');
const CAT=require('../api/_catalogo-indiv.js'), I=require('../api/individual.js');
const out={};let sem=0,cort=0,tot=0,erros=[];
fs.readdirSync(__dirname+'/banco').filter(f=>/^saida2-\d+\.json$/.test(f)).forEach(f=>{
 const o=JSON.parse(fs.readFileSync(path.join(__dirname,'banco',f),'utf8'));
 Object.keys(o).forEach(k=>{ if(!CAT[k]){erros.push('chave '+k);return;}
  const Q=o[k], obj=Q.filter(q=>q.tipo==='obj'), dis=Q.filter(q=>q.tipo==='dis');
  if(obj.length!==5||dis.length!==5){erros.push(k+' '+obj.length+'/'+dis.length);return;}
  const L=s=>String(s||'').replace(/^\s*[A-Da-d][\)\.]\s+/,'').trim();
  const R=Q.map(q=>{ const b={tipo:q.tipo,enunciado:String(q.enunciado),comando:String(q.comando||''),figura:I.limpaFigura(q.figura)}; if(q.semImg)b.semImg=true;
   if(q.tipo==='obj'){b.alts=q.alts.slice(0,4).map(L);b.correta=Number(q.correta);b.explicacao=String(q.explicacao||'');if(b.alts.length!==4||!(b.correta>=0&&b.correta<=3))throw new Error('obj '+k);}
   else{b.ref=String(q.ref||'');b.conceitos=(q.conceitos||[]).map(String).slice(0,4);}
   tot++; if(!b.figura)sem++; else if(!q.manter&&I.entregaResposta(b)){b.figura=null;cort++;sem++;}
   return b;});
  out[k]=R;});});
// ilustrações (SVG) feitas pelos agentes em tools/banco/svg/resultado-*.json: só entram as que passam na validação
let svgs=0; fs.readdirSync(__dirname+'/banco/svg').filter(f=>/^resultado-\d+\.json$/.test(f)).forEach(f=>{
 const R=JSON.parse(fs.readFileSync(path.join(__dirname,'banco/svg',f),'utf8'));
 Object.keys(R).forEach(k=>{ if(!out[k]) return; (R[k]||[]).forEach((svg,i)=>{ const q=out[k][i]; if(!q||svg==null) return;
  const s=String(svg).trim(); if(!/^<svg[\s\S]*<\/svg>$/.test(s)||!/viewBox="0 0 \d+ \d+"/.test(s)||/<\s*(script|foreignObject|image|use|iframe|style)\b|\son[a-z]+\s*=|href\s*=|xlink:|https?:\/\//i.test(s)||s.length>9000) return;
  const textos=[...s.matchAll(/>([^<>]+)</g)].map(m=>m[1].trim()).filter(Boolean); if(!textos.length) return;
  if(I.entregaResposta(Object.assign({},q,{figura:{tipo:'svg',titulo:'',textos}}))) return;
  q.svg=s; svgs++; }); }); });
console.log('ilustrações SVG aplicadas:',svgs);
fs.writeFileSync(__dirname+'/../api/_banco-indiv.js','/* GERADO por tools/montar-banco-indiv.js */\nmodule.exports='+JSON.stringify(out)+';\n');
console.log('chaves',Object.keys(out).length,'questões',tot,'sem figura',sem,'cortadas',cort,'erros',erros);
