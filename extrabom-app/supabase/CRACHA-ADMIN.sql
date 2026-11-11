-- ==========================================================
-- CRACHA: ADMIN  (CUIDADO: so para voce ou funcionario de
-- extrema confianca! Quem recebe isto ve o Painel inteiro)
-- 1) Antes: Authentication > Users > Add user (e-mail + senha, Auto Confirm)
-- 2) Troque o e-mail abaixo pelo e-mail da pessoa
-- 3) Clique em RUN
-- ==========================================================
update auth.users set raw_user_meta_data = coalesce(raw_user_meta_data,'{}'::jsonb) || '{"role":"admin"}'::jsonb where email = 'COLOQUE-O-EMAIL-DO-ADMIN';
