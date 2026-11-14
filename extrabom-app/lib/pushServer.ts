import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'
import { PUSH_CHAVE_PUBLICA } from './data'

// Servidor de notificacoes push (app fechado). So roda na Vercel.
// Chave publica pode ir no codigo; a PRIVADA fica so na variavel secreta da Vercel.
export function pushConfigurado() {
  return !!(process.env.VAPID_PRIVATE_KEY && (process.env.NEXT_PUBLIC_SUPABASE_URL) && process.env.SUPABASE_SERVICE_ROLE_KEY)
}
export function chavePublicaPush() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || PUSH_CHAVE_PUBLICA
}
function configurar() {
  if (!process.env.VAPID_PRIVATE_KEY) return false
  try {
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:extrabom@gmail.com', chavePublicaPush(), process.env.VAPID_PRIVATE_KEY)
    return true
  } catch (e) { return false }
}
export function clienteAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !service) return null
  return createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } })
}
export async function carregarDados(admin: any) {
  const { data } = await admin.from('app_dados').select('dados').eq('id', 1).maybeSingle()
  return data?.dados || null
}
export async function salvarDados(admin: any, dados: any) {
  await admin.from('app_dados').upsert({ id: 1, dados, atualizado_em: new Date().toISOString() })
}

// Envia para as inscricoes que combinam com o alvo e respeitam a preferencia do tipo.
// Retorna quantos enviou e remove inscricoes mortas (aparelho desinstalado etc).
export async function enviarPush(dados: any, alvo: { roles?: string[]; revendedorId?: string; tipo: string; titulo: string; corpo: string; url?: string }) {
  const subs: any[] = Array.isArray(dados?.pushSubs) ? dados.pushSubs : []
  const destino = subs.filter((sSub: any) => {
    if (alvo.roles && !alvo.roles.includes(sSub.role)) return false
    if (alvo.revendedorId && sSub.revendedorId !== alvo.revendedorId) return false
    if (alvo.tipo !== 'teste' && sSub.prefs && sSub.prefs[alvo.tipo] === false) return false
    return true
  })
  if (!destino.length) return { configurado: pushConfigurado(), enviados: 0, removidos: [] as string[], destino: 0 }
  if (!configurar()) return { configurado: false, enviados: 0, removidos: [] as string[], destino: destino.length }
  const payload = JSON.stringify({ title: alvo.titulo, body: alvo.corpo, icon: '/logo.png', badge: '/logo.png', url: alvo.url || '/', tag: 'extrabom-' + alvo.tipo + '-' + Date.now() })
  let enviados = 0; const removidos: string[] = []
  for (const item of destino) {
    try { await webpush.sendNotification(item.subscription, payload, { TTL: 86400 }); enviados++ }
    catch (e: any) {
      const cod = e?.statusCode
      if (cod === 404 || cod === 410) { removidos.push(item.id); if (Array.isArray(dados.pushSubs)) dados.pushSubs = dados.pushSubs.filter((x: any) => x.id !== item.id) }
    }
  }
  return { configurado: true, enviados, removidos, destino: destino.length }
}
