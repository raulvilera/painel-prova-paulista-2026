/* E-mail institucional de um aluno, lido na pasta do Drive "Dados das Turmas" no momento da consulta.
   GET /api/email-aluno?nome=…  — exige o login do professor. Não grava nada e não guarda cache.
   Variáveis da Vercel:
     GOOGLE_SA_EMAIL   e-mail da conta de serviço
     GOOGLE_SA_KEY     chave privada da conta de serviço (PEM, com \n)
     DRIVE_FOLDER_ID   id da pasta "Dados das Turmas" (18GVHv-zv8c6-y-NbTb9t7FeZ8KDf39ZQ)
   A pasta precisa estar compartilhada com GOOGLE_SA_EMAIL (somente leitura). */
const crypto = require('crypto');
const XLSX = require('xlsx');

const LOGIN_URL = process.env.PAINEL_SUPABASE_URL || 'https://ykrjfjepnqeoqlgupsbe.supabase.co';
const LOGIN_KEY = process.env.PAINEL_SUPABASE_KEY || 'sb_publishable_FbMU5x7WBpxzHmmVzOfh2g_0M1xxAh5';

async function professor(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (!m) return false;
  const r = await fetch(LOGIN_URL + '/auth/v1/user', { headers: { apikey: LOGIN_KEY, Authorization: 'Bearer ' + m[1] } });
  return r.ok;
}

const b64u = b => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

async function tokenGoogle() {
  const email = process.env.GOOGLE_SA_EMAIL || '', chave = (process.env.GOOGLE_SA_KEY || '').replace(/\\n/g, '\n');
  if (!email || !chave) throw new Error('Drive não configurado na Vercel (GOOGLE_SA_EMAIL / GOOGLE_SA_KEY).');
  const agora = Math.floor(Date.now() / 1000);
  const cab = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const corpo = b64u(JSON.stringify({ iss: email, scope: 'https://www.googleapis.com/auth/drive.readonly', aud: 'https://oauth2.googleapis.com/token', iat: agora, exp: agora + 3000 }));
  const assinatura = crypto.createSign('RSA-SHA256').update(cab + '.' + corpo).sign(chave);
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: cab + '.' + corpo + '.' + b64u(assinatura) })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new Error('Não foi possível autenticar no Drive.');
  return j.access_token;
}

const semAcento = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();

async function arquivosDaPasta(tok, pasta) {
  const q = "'" + pasta + "' in parents and trashed = false";
  const r = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=200&fields=files(id,name,mimeType)&q=' + encodeURIComponent(q), { headers: { Authorization: 'Bearer ' + tok } });
  if (!r.ok) throw new Error('Não foi possível listar a pasta no Drive (HTTP ' + r.status + ').');
  return ((await r.json()).files || []);
}

async function baixar(tok, id) {
  const r = await fetch('https://www.googleapis.com/drive/v3/files/' + id + '?alt=media', { headers: { Authorization: 'Bearer ' + tok } });
  if (!r.ok) throw new Error('Não foi possível abrir um arquivo da pasta (HTTP ' + r.status + ').');
  return Buffer.from(await r.arrayBuffer());
}

/* Lê a planilha e devolve [{ nome, email }] usando a linha de cabeçalho que tem "Nome" e "e-mail". */
function alunosDaPlanilha(buf) {
  const wb = XLSX.read(buf, { type: 'buffer' }), saida = [];
  wb.SheetNames.forEach(nomeAba => {
    const linhas = XLSX.utils.sheet_to_json(wb.Sheets[nomeAba], { header: 1, defval: '', raw: false });
    let cNome = -1, cMail = -1, ini = -1;
    for (let i = 0; i < Math.min(linhas.length, 20) && ini < 0; i++) {
      const cel = (linhas[i] || []).map(c => semAcento(c));
      const n = cel.findIndex(c => /^NOME/.test(c)), m = cel.findIndex(c => /MAIL/.test(c));
      if (n >= 0 && m >= 0) { cNome = n; cMail = m; ini = i; }
    }
    if (ini < 0) return;
    for (let i = ini + 1; i < linhas.length; i++) {
      const nome = String((linhas[i] || [])[cNome] || '').trim(), email = String((linhas[i] || [])[cMail] || '').trim();
      if (nome && /@/.test(email)) saida.push({ nome: semAcento(nome), email: email.toLowerCase(), aba: nomeAba });
    }
  });
  return saida;
}

module.exports = async function emailAluno(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const out = (c, v) => res.status(c).json(v);
  try {
    if (req.method !== 'GET') return out(405, { ok: false, erro: 'Use GET.' });
    if (!(await professor(req))) return out(401, { ok: false, erro: 'Entre primeiro no painel com o seu login de professor.' });
    const nome = semAcento((req.query && req.query.nome) || '');
    if (!nome) return out(400, { ok: false, erro: 'Informe o nome do aluno.' });
    const pasta = process.env.DRIVE_FOLDER_ID || '';
    if (!pasta) return out(500, { ok: false, erro: 'Pasta do Drive não configurada na Vercel (DRIVE_FOLDER_ID).' });
    const tok = await tokenGoogle();
    const arquivos = (await arquivosDaPasta(tok, pasta)).filter(a => /\.(xlt|xls|xlsx)$/i.test(a.name) || /spreadsheet|excel/i.test(a.mimeType || ''));
    const achados = [];
    for (const a of arquivos) {
      const lista = alunosDaPlanilha(await baixar(tok, a.id));
      lista.filter(x => x.nome === nome).forEach(x => achados.push({ email: x.email, arquivo: a.name }));
    }
    if (!achados.length) return out(200, { ok: true, encontrado: false, erro: 'E-mail não encontrado nas listas da pasta.' });
    const emails = [...new Set(achados.map(x => x.email))];
    if (emails.length > 1) return out(200, { ok: true, encontrado: true, ambiguo: true, emails, arquivos: [...new Set(achados.map(x => x.arquivo))] });
    return out(200, { ok: true, encontrado: true, email: emails[0], arquivo: achados[0].arquivo });
  } catch (e) {
    return out(502, { ok: false, erro: String(e && e.message || 'Falha ao consultar a pasta.') });
  }
};
