import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { clienteAdmin, carregarDados, salvarDados } from '../../../../lib/pushServer'

// O aparelho logado registra aqui que quer receber avisos (com as preferencias dele).
async function quemChamou(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return null
  const { data } = await createClient(url, anon).auth.getUser(token)
  return data?.user || null
}
export async function POST(req: NextRequest) {
  const user: any = await quemChamou(req)
  if (!user) return NextResponse.json({ erro: 'Faca login novamente.' }, { status: 401 })
  const admin = clienteAdmin()
  if (!admin) return NextResponse.json({ erro: 'Servidor de avisos nao configurado.' }, { status: 500 })
  const b = await req.json().catch(() => ({}))
  if (!b.subscription?.endpoint) return NextResponse.json({ erro: 'Aparelho nao forneceu a inscricao.' }, { status: 400 })
  const dados: any = await carregarDados(admin)
  if (!dados) return NextResponse.json({ erro: 'Banco nao encontrado.' }, { status: 500 })
  dados.pushSubs = Array.isArray(dados.pushSubs) ? dados.pushSubs : []
  const meta: any = user.user_metadata || {}
  const role = meta.role === 'admin' ? 'admin' : 'revendedor'
  const existente = dados.pushSubs.find((x: any) => x.subscription?.endpoint === b.subscription.endpoint)
  const registro = {
    id: existente?.id || ('push' + Date.now()),
    role, revendedorId: role === 'revendedor' ? (meta.revendedorId || '') : undefined,
    email: user.email, subscription: b.subscription,
    prefs: b.prefs || {}, aparelho: String(b.aparelho || '').slice(0, 180),
    criadoEm: existente?.criadoEm || new Date().toISOString(),
  }
  if (existente) Object.assign(existente, registro); else dados.pushSubs.push(registro)
  await salvarDados(admin, dados)
  return NextResponse.json({ ok: true, id: registro.id })
}
export async function DELETE(req: NextRequest) {
  const user: any = await quemChamou(req)
  if (!user) return NextResponse.json({ erro: 'Faca login novamente.' }, { status: 401 })
  const admin = clienteAdmin()
  if (!admin) return NextResponse.json({ erro: 'Servidor de avisos nao configurado.' }, { status: 500 })
  const b = await req.json().catch(() => ({}))
  const dados: any = await carregarDados(admin)
  if (dados && Array.isArray(dados.pushSubs)) {
    dados.pushSubs = dados.pushSubs.filter((x: any) => x.subscription?.endpoint !== b.endpoint)
    await salvarDados(admin, dados)
  }
  return NextResponse.json({ ok: true })
}
