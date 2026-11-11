# GUIA RAPIDO — Criar conta de acesso (EXTRABOM)

## Revendedor novo
1. Supabase > Authentication > Users > Add user > Create new user:
   e-mail da pessoa + senha inicial, marcar "Auto Confirm User", Create.
2. Supabase > SQL Editor > abrir "Cracha Revendedor" (arquivo CRACHA-REVENDEDOR.sql):
   trocar COLOQUE-O-EMAIL-DO-REVENDEDOR pelo e-mail real e Run.
3. No app (Painel Admin > Revendedores), conferir o cadastro dele (preco/minimo).
4. WhatsApp para o revendedor: link do app + e-mail + senha inicial.
   Com "Lembrar de mim", ele so digita no primeiro acesso.

## Admin novo (raro! so confianca absoluta)
Mesmos passos, usando CRACHA-ADMIN.sql.

## Esqueci a senha de alguem
Supabase > Authentication > Users > clicar na pessoa > redefinir/reset password.

## Seguranca
- Conta de app NAO e conta de desenvolvedor: ninguem acessa Vercel/GitHub/Supabase
  so por ter login no app. Nunca convide revendedores nos "Team/Members" dessas plataformas.
