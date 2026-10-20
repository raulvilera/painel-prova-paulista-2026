/* Confere os desenhos (resultado-N.json = { "<chave>": [svg|null x10] }) antes de entrarem no banco.
   Regras: SVG autocontido e seguro (sem script, sem on*, sem foreignObject, sem links externos), com viewBox, texto em português legível e
   sem entregar a resposta (mesma trava das figuras). Uso: node tools/banco/svg/validar-svg.js  (sem argumento: todos os resultado-*.json) */
const fs = require('fs'), path = require('path');
const I = require('../../../api/individual.js');
const dir = __dirname, arqs = process.argv[2] ? [process.argv[2]] : fs.readdirSync(dir).filter(f => /^resultado-\d+\.json$/.test(f)).map(f => path.join(dir, f));
const BANCO = {}; fs.readdirSync(path.join(dir, '..')).filter(f => /^saida2-\d+\.json$/.test(f)).forEach(f => Object.assign(BANCO, JSON.parse(fs.readFileSync(path.join(dir, '..', f), 'utf8'))));
const { bloqueado } = require('./bloqueios.js');
const PROIBIDO = /<\s*(script|foreignObject|image|use|iframe|style)\b|\son[a-z]+\s*=|href\s*=|xlink:|javascript:|https?:\/\//i;
let ruins = 0, ok = 0, vazias = 0;
arqs.forEach(a => {
  const R = JSON.parse(fs.readFileSync(a, 'utf8'));
  Object.keys(R).forEach(k => {
    const qs = BANCO[k]; if (!qs) { console.log('✗ chave desconhecida', k); ruins++; return; }
    (R[k] || []).forEach((svg, i) => {
      const p = path.basename(a) + ' ' + k.slice(0, 30) + ' q' + (i + 1) + ': ';
      if (svg == null) { vazias++; return; }
      const s = String(svg).trim(), erros = [];
      if (!/^<svg[\s\S]*<\/svg>$/.test(s)) erros.push('não é um <svg> completo');
      if (!/viewBox="0 0 \d+ \d+"/.test(s)) erros.push('falta viewBox');
      if (PROIBIDO.test(s)) erros.push('conteúdo não permitido (script/on*/foreignObject/link externo)');
      if (s.length > 9000) erros.push('muito grande (' + s.length + ' caracteres; máx. 9000)');
      const bl = bloqueado(s); if (bl) erros.push(bl);
      const textos = [...s.matchAll(/>([^<>]+)</g)].map(m => m[1].trim()).filter(Boolean);
      if (!textos.length) erros.push('sem nenhum rótulo em texto');
      const q = qs[i]; if (q) {
        const f = { tipo: 'svg', titulo: '', textos };
        if (I.entregaResposta(Object.assign({}, q, { figura: f }))) erros.push('o desenho entrega a resposta ou repete uma alternativa');
      }
      if (erros.length) { ruins++; console.log('✗ ' + p + erros.join('; ')); } else ok++;
    });
  });
});
console.log('OK: ' + ok + ' desenhos válidos, ' + vazias + ' questões sem desenho, ' + ruins + ' com problema');
process.exit(ruins ? 1 : 0);
