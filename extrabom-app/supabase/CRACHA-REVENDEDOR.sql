-- ==========================================================
-- CRACHA: REVENDEDOR  (use para cada revendedor novo)
-- 1) Antes: Authentication > Users > Add user (e-mail + senha, Auto Confirm)
-- 2) Troque o e-mail abaixo pelo e-mail do revendedor
-- 3) Clique em RUN
-- O "r1" liga ele ao cadastro dele (precos/minimo). r1, r2, r3...
-- conforme a ordem em Revendedores no Painel. Na duvida, pergunte a IA.
-- ==========================================================
update auth.users set raw_user_meta_data = coalesce(raw_user_meta_data,'{}'::jsonb) || '{"role":"revendedor","revendedorId":"r1"}'::jsonb where email = 'COLOQUE-O-EMAIL-DO-REVENDEDOR';
