# EXTRABOM SORVETES — Arquitetura do Sistema

## Visão
PWA instalável (Android/iPhone) para revendedores + Painel Administrativo web, compartilhando o mesmo banco de dados. Pedido nasce no app → aprovação manual na EXTRABOM → separação/produção → conferência → pronto → entrega/retirada, com situação financeira separada da situação do pedido.

## Stack (produção)
- Front-end/PWA: Next.js + React (este repositório), instalável via manifest
- Banco/Auth/Realtime/Storage: Supabase (PostgreSQL, Auth, Realtime, Storage) — schema pronto em `supabase/schema.sql`
- Hospedagem: compatível com Next.js (ex.: Vercel)
- Notificações: in-app agora; WhatsApp Business Platform preparada como canal secundário (o pedido oficial permanece no sistema)

## Ambientes
1. **Área do Revendedor (mobile-first):** Login, Início, Catálogo, Detalhe do Produto, Carrinho (com trava de pedido mínimo), Finalização (entrega/retirada + Pix/entrega/retirada), Pedido Enviado, Acompanhamento (linha do tempo), Histórico (Pedir Novamente), Perfil.
2. **Painel EXTRABOM (desktop + responsivo):** Dashboard, Central de Pedidos, Revendedores, Produtos & Preços, Estoque, Produção, Expedição, Financeiro, Relatórios, Usuários & Permissões.

## Regras implementadas
- Preço individual por revendedor com **snapshot no pedido** (mudança futura não altera pedidos antigos)
- Pedido mínimo individual com barra de progresso e bloqueio de finalização
- Aprovação manual obrigatória (`AGUARDANDO APROVAÇÃO` ≠ aprovado)
- Estoque: `disponível = físico − reservado`; reserva na criação, baixa na separação, liberação em recusa/cancelamento
- Financeiro separado: forma (Pix/entrega/retirada) × situação (pendente/aguardando confirmação/pago/parcial/estornado); comprovante Pix não confirma automaticamente
- Fluxo de status com transições e motivo obrigatório em recusa/cancelamento; retirada não passa por "saiu para entrega"
- Cadastro de revendedor feito pela empresa (sem cadastro livre); acesso por convite/WhatsApp; revendedor vê só os próprios dados (RLS no Supabase)

## Banco (entidades)
revendedores, usuarios, produtos, categorias, precos_individuais, pedidos, itens_pedido, estoque, movimentacoes_estoque, reservas_estoque, ordens_producao, entregas, pagamentos, notificacoes, auditoria.

## Fases
1 Fundação (banco/login/revendedores/produtos/preços/mínimo) → 2 Pedidos → 3 Operação (estoque/produção/entrega/financeiro/notificações) → 4 Testes/lançamento/treinamento → 5 Extrabom Inteligente (reposição inteligente, pedido rápido, alertas, fidelidade, promoções).

## Estado desta entrega
Sistema funcional ponta a ponta neste ambiente com banco local persistente (localStorage), claramente identificado como demonstração onde há dados fictícios. Não há integração Supabase/WhatsApp ativa sem credenciais da empresa — o schema e os pontos de troca estão prontos; nenhuma integração externa é simulada como real.
