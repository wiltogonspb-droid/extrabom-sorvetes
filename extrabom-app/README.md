# EXTRABOM SORVETES — Área do Revendedor + Painel Administrativo

Sistema funcional (Next.js + React, PWA instalável) com os dois ambientes conectados ao mesmo banco de dados.

## Como testar (demonstração)
1. Abra o app (preview ao vivo).
2. **Revendedor Demo** → Início → Catálogo (12 sabores 1L + picolés) → monte o carrinho → observe a trava do pedido mínimo (Carlos Silva: R$ 150) → Finalizar (entrega/retirada + Pix/entrega/retirada) → Confirmar → **Aguardando aprovação**.
3. Saia → **Painel Admin** → Central de Pedidos → **Aprovar** → atualize status até Pronto → Expedição → confirmar entrega. Financeiro: confirme o Pix separadamente.
4. Volte como revendedor → Pedidos → veja a linha do tempo atualizada → **Pedir novamente** (preços atuais).
5. No Admin, altere preço individual/minimo de um revendedor e confira no app; pedidos antigos não mudam (snapshot).

## Estrutura
- `app/` + `components/System.tsx` — telas do revendedor (10) e painel (10 módulos)
- `lib/data.ts` — entidades, regras (preço individual, mínimo, estoque físico−reservado, status)
- `ARQUITETURA.md` — arquitetura, fluxo e fases
- `supabase/schema.sql` — schema PostgreSQL + RLS para produção
- `public/logo.png` — logo oficial enviada (sem recriação) • `public/manifest.webmanifest` — PWA

## Produção (próximo passo, requer contas da empresa)
Criar projeto Supabase, aplicar `supabase/schema.sql`, trocar a camada local em `lib/data.ts` por Supabase (Auth/Realtime/Storage), hospedar o Next.js (ex.: Vercel), configurar domínio e WhatsApp Business Platform. Nenhuma integração externa está ativa nesta demonstração.
