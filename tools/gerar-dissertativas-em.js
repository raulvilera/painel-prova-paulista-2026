const fs=require('fs');const w={};global.window=w;
const R=require('path').join(__dirname,'..')+'/';
eval(fs.readFileSync(R+'simulado/ensino-medio/questoes.js','utf8'));
const D=require(__dirname+'/descritores-em.js');
const out={};
for(const k in w.AVALIACOES_EM){
  w.AVALIACOES_EM[k].questoes.filter(q=>q.tipo==='dis').forEach(q=>{
    const c=D[q.id]; if(!c) throw new Error('sem critérios '+q.id);
    const L=[];
    L.push('ENUNCIADO: '+q.enunciado);
    if(q.tabela){L.push('TABELA: '+q.tabela.colunas.join(' | '));q.tabela.linhas.forEach(l=>L.push('  '+l.join(' | ')));}
    if(q.alts&&q.alts.length){L.push('ITENS DE APOIO: '+q.alts.join(' / '));}
    L.push('COMANDO: '+q.comando);
    L.push('FONTE DOS CRITÉRIOS: '+c.fonte);
    if(c.ae)L.push('ALVO DE APRENDIZAGEM: '+c.ae);
    if(c.habilidades.length)L.push('HABILIDADES:\n'+c.habilidades.map(h=>'- '+h.codigo+': '+h.texto).join('\n'));
    if(c.descritores.length)L.push('DESCRITORES (o aluno deve ter atingido o que pedem):\n'+c.descritores.map((d,i)=>(i+1)+'. '+d).join('\n'));
    if(c.objetos&&c.objetos.length)L.push('OBJETOS DE CONHECIMENTO ('+(c.tipo==='provao'?'Mapa do Provão Paulista':'complemento')+'):\n'+c.objetos.map(d=>'- '+d).join('\n'));
    out[q.id]={ id:q.id, contexto:L.join('\n'), descritores:c.descritores.concat(c.objetos||[]).length };
  });
}
const src='/* GERADO a partir de simulado/ensino-medio/questoes.js + descritores oficiais do Guia do Currículo Priorizado.\n   Contexto de cada dissertativa enviado ao Apps Script para a correção por IA. Arquivo com _ não vira rota na Vercel. */\nmodule.exports = '+JSON.stringify(Object.fromEntries(Object.entries(out).map(([k,v])=>[k,v.contexto])),null,1)+';\n';
fs.writeFileSync(R+'api/_dissertativas-em.js',src);
console.log(Object.keys(out).length,'questões',src.length,'bytes');
console.log(out['qui-3-provao-13'].contexto.slice(0,900));
