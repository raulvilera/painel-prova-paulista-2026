-- Atividade individual (Ensino Fundamental). Rode no SQL Editor do Supabase da plataforma.
-- O aluno NÃO acessa estas tabelas diretamente: só a função da Vercel (chave de serviço). O professor logado lê/grava.
create table if not exists indiv_plano (
  turma text not null,
  nome text not null,
  itens jsonb not null default '[]',      -- [{k, niv, t:"gap"|"b4"}]
  resumo text,                            -- só professor
  atualizado timestamptz default now(),
  primary key (turma, nome)
);
create table if not exists indiv_banco (
  k text primary key,
  questoes jsonb not null,                -- 5 objetivas + 5 dissertativas, com gabarito
  liberada boolean not null default false,
  gerado_em timestamptz default now()
);
create table if not exists indiv_respostas (
  id bigserial primary key,
  criado timestamptz default now(),
  turma text not null,
  nome text not null,
  itens jsonb not null,                   -- cada questão: chave, resposta, acerto/nota, comentário
  acertos int, total_obj int, nota numeric, status text
);
alter table indiv_plano enable row level security;
alter table indiv_banco enable row level security;
alter table indiv_respostas enable row level security;
drop policy if exists prof_plano on indiv_plano;
drop policy if exists prof_banco on indiv_banco;
drop policy if exists prof_resp on indiv_respostas;
create policy prof_plano on indiv_plano for all to authenticated using (true) with check (true);
create policy prof_banco on indiv_banco for all to authenticated using (true) with check (true);
create policy prof_resp on indiv_respostas for select to authenticated using (true);
