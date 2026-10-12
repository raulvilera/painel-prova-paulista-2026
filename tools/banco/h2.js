const T=(titulo,colunas,linhas)=>({tipo:"tabela",titulo,colunas,linhas});
const B=(titulo,unidade,it)=>({tipo:"barras",titulo,unidade,itens:it.map(([rotulo,valor])=>({rotulo,valor}))});
const E=(titulo,etapas)=>({tipo:"etapas",titulo,etapas});
const O=(enunciado,figura,alts,correta,explicacao,comando="Assinale a alternativa correta.")=>({tipo:"obj",enunciado,comando,figura,alts,correta,explicacao});
const D=(enunciado,figura,ref,conceitos,comando="Responda com suas palavras.")=>({tipo:"dis",enunciado,comando,figura,ref,conceitos});
module.exports={T,B,E,O,D};
