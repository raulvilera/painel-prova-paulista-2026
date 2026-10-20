/* Critérios de segurança para as imagens das atividades (adolescentes): nada que mostre ou sugira
   drogas/álcool/cigarro, discriminação racial ou de gênero, violência, armas, sangue, ferimentos, cadáveres,
   nudez ou conteúdo sexual explícito. Usado por validar-svg.js e montar-banco-indiv.js. */
const BLOQUEIO = /\b(droga|drogas|maconha|cocaina|crack|heroina|lsd|ecstasy|cigarro|cigarros|tabaco|fumar|fumando|cachimbo|bebida alcoolica|alcool|alcoolismo|cerveja|vinho|bebado|bebum|bêbado|racismo|racista|racial|raca|negro|negra|macaco|escravo|escravidao|nazista|suastica|arma|armas|pistola|revolver|fuzil|faca|facao|tiro|tiros|assassin|violencia|agressao|sangue|sangrando|ferida|ferido|cadaver|corpo morto|nu|nua|nus|sexo|sexual|pornografia|suicid)\b/i;
const ACHA_DESENHO_HUMANO = /<(circle|path)[^>]*fill="#?(8d6e63|6d4c41|a1887f|ffdbac|f1c27d|8d5524|c68642|5d4037)"/i;   /* só alerta: tons de pele podem indicar pessoas; revisar */
function textosDoSvg(s) { return [...String(s).matchAll(/>([^<>]+)</g)].map(m => m[1]); }
function bloqueado(s) {
  const t = textosDoSvg(s).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const m = BLOQUEIO.exec(t); return m ? 'termo proibido nas ilustrações: "' + m[0] + '"' : null;
}
module.exports = { BLOQUEIO, bloqueado, textosDoSvg };
