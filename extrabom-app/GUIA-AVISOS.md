# 🔔 Avisos no celular (EXTRABOM)

## Como cada pessoa ativa
1. Entrar no app **pelo celular** dela e abrir:
   - Equipe: Painel → **Avisos no celular**
   - Revendedor: **Perfil → Avisos no celular**
2. Tocar em **ATIVAR AVISOS NESTE CELULAR** e permitir.
3. Marcar/desmarcar os tipos de aviso daquele aparelho.
4. Tocar em **Testar aviso**.

Cada celular tem suas próprias preferências. Quem não quer aviso de freezer, desmarca só "Freezer" no aparelho dele.

## Avisos disponíveis
- Admin/equipe: novo pedido, novo cadastro em análise, Pix para conferir, freezer vencendo, freezer atrasado, estoque baixo.
- Revendedor: andamento do pedido, pronto/saiu para entrega, Pix confirmado, lembrete de reposição, promoções.
- O relógio dos freezers roda **todo dia às 7h** (Vercel Cron, arquivo `vercel.json`) e também avisa na hora se o Painel estiver aberto. Não repete o mesmo aviso: atrasado repete no máximo 1x por dia.

## Passo único na Vercel (para apitar com o app FECHADO)
Vercel → projeto → Settings → Environment Variables (Production), adicionar:

- `VAPID_PRIVATE_KEY` — chave privada fornecida pela EXTRABOM na implantação (NUNCA coloque no GitHub nem compartilhe)
- `VAPID_SUBJECT` = `mailto:extrabom@gmail.com`
- A variável secreta do relógio diário: nome formado por CRON + _SECRET (valor fornecido na implantação)

Depois: **Redeploy**. Sem isso, os avisos funcionam com o app aberto, mas não com ele fechado.

## iPhone
O iPhone só aceita esse aviso pelo **app instalado**: Compartilhar → Adicionar à Tela de Início → abrir pelo ícone → ativar os avisos.

## Limites honestos
- Celular desligado/sem internet recebe quando voltar (o aviso fica guardado ~24h).
- Modo silencioso/Não Perturbe do aparelho é respeitado.
- Se a pessoa desinstalar o app ou limpar o navegador, precisa ativar de novo.
