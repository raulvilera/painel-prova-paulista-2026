-- Imagens das atividades adaptadas (PEI), geradas com Nano Banana (API Gemini) e guardadas em base64.
-- Rode no SQL Editor do Supabase "oxohpnappygkmwjyowvq". RLS ligado e SEM políticas: só a função da Vercel (chave de serviço) acessa.
create table if not exists public.indiv_imagens (
  k text primary key,
  mime text not null default 'image/png',
  dados text not null,
  criado timestamptz not null default now()
);
alter table public.indiv_imagens enable row level security;
