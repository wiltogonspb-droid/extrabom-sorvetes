# PUBLICAR A EXTRABOM NA INTERNET (link permanente, gratuito)

## Opção rápida — Vercel (hospedagem do app) ~5 min
1. Crie conta gratuita em https://vercel.com (pode entrar com Google/GitHub).
2. Instale o Git no PC ou suba este projeto para um repositório no GitHub.
3. Na Vercel: "Add New → Project" → importe o repositório desta pasta → Deploy.
4. Pronto: a Vercel gera um link fixo (ex.: extrabom-sorvetes.vercel.app) que funciona 24h.
5. Depois, em Settings → Domains, dá pra ligar um domínio próprio (ex.: app.suaempresa.com.br).

## Banco de dados real — Supabase (gratuito)
1. Crie conta em https://supabase.com e um novo projeto.
2. Em SQL Editor, cole e rode o conteúdo de `supabase/schema.sql` (já está neste projeto).
3. Em Project Settings → API, copie URL e anon key.
4. Na Vercel, adicione as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.
5. Avise o desenvolvedor/IA para trocar a camada local (`lib/data.ts`) pelo Supabase
   (Auth, Realtime, Storage) — as telas e regras não mudam.

## O que NÃO fazer
- Não mande o link trycloudflare/sandbox pros revendedores: ele é temporário de teste.
- Não compartilhe senhas/chaves secretas (service_role) com ninguém.
