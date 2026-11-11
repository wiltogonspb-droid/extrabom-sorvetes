import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cria login de acesso (admin ou revendedor) SEM sair do Painel.
// Seguranca: so quem esta logado como ADMIN consegue chamar esta rota.
// A chave secreta (service_role) fica SO no servidor da Vercel — nunca no navegador.
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anon) return NextResponse.json({ erro: 'Supabase nao configurado.' }, { status: 500 })
  if (!service) return NextResponse.json({ erro: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY na Vercel (chave secreta).' }, { status: 500 })

  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return NextResponse.json({ erro: 'Faca login como administrador.' }, { status: 401 })
  const cliente = createClient(url, anon)
  const { data: quem, error: errAuth } = await cliente.auth.getUser(token)
  if (errAuth || !quem?.user) return NextResponse.json({ erro: 'Sessao invalida. Entre de novo.' }, { status: 401 })
  if ((quem.user.user_metadata as any)?.role !== 'admin')
    return NextResponse.json({ erro: 'Somente o administrador pode criar acessos.' }, { status: 403 })

  const { email, senha, role, revendedorId } = await req.json().catch(() => ({}))
  if (!email || !senha || String(senha).length < 6) return NextResponse.json({ erro: 'Informe e-mail e uma senha de pelo menos 6 caracteres.' }, { status: 400 })
  if (!['admin', 'revendedor'].includes(role)) return NextResponse.json({ erro: 'Tipo de acesso invalido.' }, { status: 400 })

  const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } })
  const meta: any = { role }
  if (role === 'revendedor') meta.revendedorId = revendedorId || 'r1'
  const { data, error } = await admin.auth.admin.createUser({ email: String(email).trim().toLowerCase(), password: String(senha), email_confirm: true, user_metadata: meta })
  if (error) return NextResponse.json({ erro: 'Nao foi possivel criar: ' + error.message }, { status: 400 })
  return NextResponse.json({ ok: true, id: data.user?.id, email, role })
}
