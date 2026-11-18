/* O Supabase (PostgREST) entrega no máximo 1000 linhas por consulta: o que passar disso é cortado sem aviso.
   paginar(fn) recebe a função de acesso ao banco de uma API e devolve outra igual, mas que nas leituras (GET)
   busca de 1000 em 1000 até acabar — sem teto. Consultas com limit de até 1000 continuam numa chamada só,
   e gravações (POST, PATCH, DELETE…) passam direto, sem mudança. */
const PAGINA = 1000;

module.exports = function paginar(fn) {
  return async function rest(path, opt) {
    const metodo = String((opt && opt.method) || 'GET').toUpperCase();
    if (metodo !== 'GET' || /^rpc\//.test(path)) return fn(path, opt);
    const lim = /[?&]limit=(\d+)/.exec(path), max = lim ? +lim[1] : Infinity;
    if (max <= PAGINA) return fn(path, opt);
    const ini = +((/[?&]offset=(\d+)/.exec(path) || [])[1] || 0);
    const base = path.replace(/([?&])(limit|offset)=\d+/g, '$1').replace(/&{2,}/g, '&').replace(/\?&/, '?').replace(/[?&]$/, '');
    const sep = base.includes('?') ? '&' : '?', out = [];
    for (let off = 0; off < max; off += PAGINA) {
      const n = Math.min(PAGINA, max - off), pg = await fn(base + sep + 'limit=' + n + '&offset=' + (ini + off), opt);
      if (!Array.isArray(pg)) return off ? out : pg;
      out.push(...pg);
      if (pg.length < n) break;
    }
    return out;
  };
};
