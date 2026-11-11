-- EXTRABOM — Rodar UMA VEZ no SQL Editor do Supabase.
-- Cria a tabela de sincronização do aplicativo (estado compartilhado entre
-- app do revendedor e painel administrativo, em tempo real).
-- As 15 tabelas normalizadas (schema.sql) continuam sendo a base oficial;
-- esta tabela faz a ponte de sincronização da primeira versão em produção.
create table if not exists app_dados(
  id int primary key,
  dados jsonb not null,
  atualizado_em timestamptz default now()
);
alter table app_dados enable row level security;
create policy "extrabom leitura" on app_dados for select using (true);
create policy "extrabom escrita" on app_dados for insert with check (true);
create policy "extrabom atualizacao" on app_dados for update using (true) with check (true);
