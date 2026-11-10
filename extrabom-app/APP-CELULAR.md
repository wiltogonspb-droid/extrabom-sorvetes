# EXTRABOM — Como virar APLICATIVO de celular

## Opção 1 — PWA instalável (a que já está pronta) ⭐
O sistema atual já é um PWA: depois de publicado no link permanente (Vercel),
cada revendedor abre o link no celular e toca em "Adicionar à tela inicial".
Aparece o ícone da EXTRABOM na tela do celular e abre em tela cheia, como app.
- Android e iPhone, sem loja, sem custo, atualização automática.
- É o caminho recomendado para começar (foi o previsto no briefing, item 14).

## Opção 2 — APK Android (arquivo instalável)
O mesmo sistema é embalado com Capacitor e gera um arquivo .apk.
O revendedor recebe o arquivo (ex.: pelo WhatsApp) e instala direto no Android.
- Só Android. iPhone não instala .apk.
- Precisa assinar o arquivo (chave da empresa) no Android Studio para gerar a versão final.

## Opção 3 — Lojas oficiais (Google Play / App Store)
Publicação nas lojas com o nome EXTRABOM SORVETES.
- Google Play: conta de desenvolvedor US$ 25 (pagamento único) + análise do Google.
- App Store (iPhone): conta Apple US$ 99/ano + análise da Apple (mais rigorosa).
- Dá mais "presença oficial", mas demora dias/semanas e tem custo — ideal como fase 2,
  depois que o sistema estiver validado com os revendedores.

## Recomendação
1) Publicar o link permanente (Vercel) → 2) revendedores instalam o PWA pelo link →
3) validar o uso real → 4) se quiser, publicar nas lojas com o mesmo sistema (Capacitor).
O sistema não precisa ser refeito: é o mesmo código nas três opções.
