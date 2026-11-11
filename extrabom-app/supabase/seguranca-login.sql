-- EXTRABOM — Rodar UMA VEZ no SQL Editor (fecha o acesso publico).
-- Depois disto, so usuarios LOGADOS (Supabase Auth) leem/escrevem os dados.
drop policy if exists "extrabom leitura" on app_dados;
drop policy if exists "extrabom escrita" on app_dados;
drop policy if exists "extrabom atualizacao" on app_dados;
create policy "logado leitura" on app_dados for select to authenticated using (true);
create policy "logado escrita" on app_dados for insert to authenticated with check (true);
create policy "logado atualizacao" on app_dados for update to authenticated using (true) with check (true);
