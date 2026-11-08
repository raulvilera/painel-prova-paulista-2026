/* Login do aluno em todas as atividades: RA + dígito + senha.
   POST /api/aluno-login  { acao: "entrar", ra, digito, senha }           -> { ok, token, nome, turma }
   POST /api/aluno-login  { acao: "trocar", token, senha_atual, senha_nova } -> { ok }
   Senha padrão: variável ALUNO_SENHA_PADRAO (na Vercel). Quem cadastrou senha própria usa só a própria.
   Após 5 erros seguidos, o RA fica bloqueado por 15 minutos. */
const crypto = require('crypto');
const { rest, sha } = require('./_aluno-sessao.js');

const PADRAO = process.env.ALUNO_SENHA_PADRAO || '';
const MAX_ERROS = 5, BLOQUEIO_MIN = 15, SESSAO_H = 12;

const normRa = v => String(v || '').replace(/\D/g, '');
const normDig = v => String(v || '').trim().toUpperCase().slice(0, 2);

function hashSenha(senha, salt) {
  return crypto.scryptSync(String(senha), salt, 32).toString('hex');
}
function iguais(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

async function conferirSenha(ra, dig, senha) {
  const rows = await rest('aluno_senha?ra=eq.' + ra + '&digito=eq.' + encodeURIComponent(dig) + '&select=senha_hash,senha_salt');
  if (rows.length) return iguais(hashSenha(senha, rows[0].senha_salt), rows[0].senha_hash);
  if (!PADRAO) return false;   // sem senha padrão configurada, ninguém entra sem senha própria
  return iguais(senha, PADRAO);
}

async function existeAluno(ra, dig) {
  const rows = await rest('alunos?ra=eq.' + ra + '&digito_ra=eq.' + encodeURIComponent(dig) + '&select=nome,turma');
  return rows[0] || null;
}

async function logar(ra, dig, resultado) {
  await rest('aluno_acesso_log', { method: 'POST', body: { ra, digito: dig, resultado }, prefer: 'return=minimal' }).catch(() => {});
}

module.exports = async function alunoLogin(req, res) {
  res.setHeader('Cache-Control', 'no-store'); res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const out = (c, v) => res.status(c).json(v);
  try {
    if (req.method !== 'POST') return out(405, { ok: false, erro: 'Use POST.' });
    if (!PADRAO) return out(500, { ok: false, erro: 'Senha padrão não configurada na Vercel (ALUNO_SENHA_PADRAO).' });
    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    if (b.acao === 'entrar') {
      const ra = normRa(b.ra), dig = normDig(b.digito), senha = String(b.senha || '');
      if (!ra || !dig || !senha) return out(400, { ok: false, erro: 'Informe RA, dígito e senha.' });
      const trava = await rest('aluno_tentativa?ra=eq.' + ra + '&digito=eq.' + encodeURIComponent(dig) + '&select=erros,bloqueado_ate');
      if (trava[0] && trava[0].bloqueado_ate && new Date(trava[0].bloqueado_ate) > new Date())
        return out(429, { ok: false, erro: 'Muitas tentativas. Tente de novo em alguns minutos.' });
      const aluno = await existeAluno(ra, dig);
      const senhaOk = aluno ? await conferirSenha(ra, dig, senha) : false;
      if (!aluno || !senhaOk) {
        const erros = (trava[0] ? trava[0].erros : 0) + 1;
        const bloq = erros >= MAX_ERROS ? new Date(Date.now() + BLOQUEIO_MIN * 60000).toISOString() : null;
        await rest('aluno_tentativa?on_conflict=ra,digito', { method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal',
          body: { ra, digito: dig, erros: bloq ? 0 : erros, bloqueado_ate: bloq } }).catch(() => {});
        await logar(ra, dig, 'falha');
        return out(401, { ok: false, erro: 'RA, dígito ou senha incorretos.' });
      }
      await rest('aluno_tentativa?ra=eq.' + ra + '&digito=eq.' + encodeURIComponent(dig), { method: 'DELETE', prefer: 'return=minimal' }).catch(() => {});
      const token = crypto.randomBytes(32).toString('base64url');
      await rest('aluno_sessao', { method: 'POST', prefer: 'return=minimal',
        body: { token_hash: sha(token), ra, digito: dig, expira_em: new Date(Date.now() + SESSAO_H * 3600000).toISOString() } });
      await logar(ra, dig, 'ok');
      return out(200, { ok: true, token, nome: aluno.nome, turma: aluno.turma });
    }

    if (b.acao === 'trocar') {
      const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
      const token = b.token || (m && m[1]);
      if (!token) return out(401, { ok: false, erro: 'Entre primeiro.' });
      const s = await rest('aluno_sessao?token_hash=eq.' + sha(token) + '&select=ra,digito,expira_em');
      if (!s.length || new Date(s[0].expira_em) < new Date()) return out(401, { ok: false, erro: 'Sessão expirada. Entre de novo.' });
      const { ra, digito: dig } = s[0];
      const nova = String(b.senha_nova || '');
      if (nova.length < 6) return out(400, { ok: false, erro: 'A nova senha precisa ter pelo menos 6 caracteres.' });
      if (!(await conferirSenha(ra, dig, String(b.senha_atual || '')))) return out(401, { ok: false, erro: 'Senha atual incorreta.' });
      const salt = crypto.randomBytes(16).toString('hex');
      await rest('aluno_senha?on_conflict=ra,digito', { method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal',
        body: { ra, digito: dig, senha_hash: hashSenha(nova, salt), senha_salt: salt, atualizado_em: new Date().toISOString() } });
      return out(200, { ok: true });
    }

    return out(400, { ok: false, erro: 'Ação inválida.' });
  } catch (e) {
    return out(500, { ok: false, erro: 'Falha no login: ' + e.message });
  }
};
