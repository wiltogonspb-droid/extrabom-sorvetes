-- EXTRABOM SORVETES — Schema PostgreSQL/Supabase (produção)
-- Aplicar no Supabase SQL Editor. RLS garante isolamento por revendedor.
create table if not exists categorias(id uuid primary key default gen_random_uuid(), nome text not null);
create table if not exists revendedores(id uuid primary key default gen_random_uuid(), auth_user_id uuid references auth.users, nome text not null, negocio text, telefone text not null, doc text, endereco text, ativo boolean default true, pedido_minimo numeric(10,2) default 0, pagamentos_habilitados text[] default '{pix,na_entrega,na_retirada}', criado_em timestamptz default now());
create table if not exists usuarios(id uuid primary key default gen_random_uuid(), auth_user_id uuid references auth.users, nome text, perfil text check(perfil in ('administrador','comercial','producao','expedicao','financeiro')), revendedor_id uuid references revendedores);
create table if not exists produtos(id uuid primary key default gen_random_uuid(), categoria_id uuid references categorias, nome text not null, descricao text, embalagem text, foto_url text, preco_padrao numeric(10,2) not null, ativo boolean default true, disponibilidade text default 'disponivel');
create table if not exists precos_individuais(revendedor_id uuid references revendedores, produto_id uuid references produtos, preco numeric(10,2) not null, primary key(revendedor_id,produto_id));
create table if not exists pedidos(id uuid primary key default gen_random_uuid(), numero text unique not null, revendedor_id uuid references revendedores not null, total numeric(10,2) not null, recebimento text, endereco text, pagamento text, pag_situacao text default 'pendente', status text default 'aguardando_aprovacao', motivo text, criado_em timestamptz default now());
create table if not exists itens_pedido(id uuid primary key default gen_random_uuid(), pedido_id uuid references pedidos on delete cascade, produto_id uuid references produtos, nome_snapshot text, preco_unitario_snapshot numeric(10,2), quantidade int not null);
create table if not exists estoque(produto_id uuid primary key references produtos, fisico int default 0, reservado int default 0);
create table if not exists movimentacoes_estoque(id uuid primary key default gen_random_uuid(), produto_id uuid references produtos, tipo text, qtd int, motivo text, em timestamptz default now());
create table if not exists reservas_estoque(id uuid primary key default gen_random_uuid(), pedido_id uuid references pedidos, produto_id uuid references produtos, qtd int, expira_em timestamptz, ativa boolean default true);
create table if not exists ordens_producao(id uuid primary key default gen_random_uuid(), produto_id uuid references produtos, qtd_necessaria int, status text default 'pendente', pedido_id uuid references pedidos);
create table if not exists entregas(id uuid primary key default gen_random_uuid(), pedido_id uuid references pedidos, responsavel text, confirmado_em timestamptz);
create table if not exists pagamentos(id uuid primary key default gen_random_uuid(), pedido_id uuid references pedidos, forma text, situacao text default 'pendente', valor numeric(10,2), comprovante_url text, confirmado_por text, em timestamptz default now());
create table if not exists notificacoes(id uuid primary key default gen_random_uuid(), revendedor_id uuid references revendedores, texto text, lida boolean default false, em timestamptz default now());
create table if not exists auditoria(id uuid primary key default gen_random_uuid(), usuario text, acao text, detalhes jsonb, em timestamptz default now());
alter table revendedores enable row level security; alter table pedidos enable row level security; alter table precos_individuais enable row level security;
-- Exemplo: revendedor só lê os próprios pedidos/preços (completar por perfil no go-live)
create policy "revendedor ve proprios pedidos" on pedidos for select using (revendedor_id in (select id from revendedores where auth_user_id = auth.uid()));
create policy "revendedor ve proprios precos" on precos_individuais for select using (revendedor_id in (select id from revendedores where auth_user_id = auth.uid()));
