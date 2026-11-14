import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { clienteAdmin, carregarDados, salvarDados, enviarPush, pushConfigurado } from '../../../../lib/pushServer'

// Dispara um aviso. Admin pode avisar revendedor/admins; revendedor so pode
// avisar a equipe (novo pedido / Pix) em nome dele mesmo, ou testar o proprio aparelho.
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!url || !anon || !token) return NextResponse.json({ erro: 'Faca login novamente.' }, { status: 401 })
  const { data } = await createClient(url, anon).auth.getUser(token)
  const user: any = data?.user
  if (!user) return NextResponse.json({ erro: 'Sessao invalida.' }, { status: 401 })
  const b = await req.json().catch(() => ({}))
  const meta: any = user.user_metadata || {}
  const meuRole = meta.role === 'admin' ? 'admin' : 'revendedor'
  const meuRev = meta.revendedorId || ''
  let roles: string[] | undefined; let revendedorId: string | undefined
  if (b.tipo === 'teste') { roles = [meuRole]; revendedorId = meuRole === 'revendedor' ? meuRev : undefined }
  else if (b.alvo === 'admins') {
    if (meuRole === 'revendedor' && !['novo_pedido', 'pix'].includes(b.tipo)) return NextResponse.json({ erro: 'Sem permissao para este aviso.' }, { status: 403 })
    if (meuRole === 'revendedor' && b.revendedorId && b.revendedorId !== meuRev) return NextResponse.json({ erro: 'Sem permissao.' }, { status: 403 })
    roles = ['admin']
  } else if (b.alvo === 'revendedor') {
    if (meuRole !== 'admin' && meuRole !== 'revendedor') return NextResponse.json({ erro: 'Sem permissao.' }, { status: 403 })
    if (meuRole === 'revendedor' && b.revendedorId !== meuRev) return NextResponse.json({ erro: 'Sem permissao.' }, { status: 403 })
    roles = ['revendedor']; revendedorId = b.revendedorId || meuRev
  } else return NextResponse.json({ erro: 'Destino invalido.' }, { status: 400 })

  const admin = clienteAdmin()
  if (!admin) return NextResponse.json({ ok: false, configurado: false })
  const dados: any = await carregarDados(admin)
  if (!dados) return NextResponse.json({ ok: false, configurado: pushConfigurado() })
  const r = await enviarPush(dados, { roles, revendedorId, tipo: String(b.tipo || 'status'), titulo: String(b.titulo || 'EXTRABOM SORVETES'), corpo: String(b.corpo || ''), url: b.url })
  if (r.removidos.length) await salvarDados(admin, dados)
  return NextResponse.json({ ok: true, ...r })
}
