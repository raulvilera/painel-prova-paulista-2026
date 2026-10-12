exports.o=(enunciado,comando,figura,alts,correta,explicacao)=>({tipo:'obj',enunciado,comando,figura,alts,correta,explicacao});
exports.d=(enunciado,comando,figura,ref,conceitos)=>({tipo:'dis',enunciado,comando,figura,ref,conceitos});
exports.tb=(titulo,colunas,linhas)=>({tipo:'tabela',titulo,colunas,linhas});
exports.br=(titulo,unidade,itens)=>({tipo:'barras',titulo,unidade,itens:itens.map(([rotulo,valor])=>({rotulo,valor}))});
exports.et=(titulo,etapas)=>({tipo:'etapas',titulo,etapas});
