-- Já aplicado no Supabase "oxohpnappygkmwjyowvq" (migração atividade_individual). Guardado aqui só como registro.
-- Tabelas indiv_plano, indiv_banco e indiv_respostas, com RLS ligado e SEM políticas: só a função da Vercel (chave de serviço) acessa.
-- Vercel: SUPABASE_URL=https://oxohpnappygkmwjyowvq.supabase.co, SUPABASE_SERVICE_KEY, GEMINI_API_KEY.

-- aula30_resultados (migração aula30_resultados): id, criado, turma, nome, minutos, blocos jsonb [{k,tema,desc,hab,niv,obj,conf}]. RLS ligado, sem políticas.
