import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Autocadastro do revendedor pelo link: ele cria a conta, mas nasce BLOQUEADO
// (em analise). A EXTRABOM aprova no Painel, define minimo/precos e ativa.
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !service) return NextResponse.json({ erro: 'Cadastro indisponivel no momento. Fale com a EXTRABOM.' }, { status: 500 })
  const b = await req.json().catch(() => ({}))
  const nome = String(b.nome || '').trim(), email = String(b.email || '').trim().toLowerCase(), senha = String(b.senha || '')
  const negocio = String(b.negocio || '').trim(), telefone = String(b.telefone || '').trim()
  const doc = String(b.doc || '').trim(), endereco = String(b.endereco || '').trim()
  if (!nome || !negocio || telefone.replace(/\D/g, '').length < 10 || !email.includes('@') || senha.length < 6)
    return NextResponse.json({ erro: 'Preencha nome, negocio, telefone valido, e-mail e senha de 6+ caracteres.' }, { status: 400 })

  const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } })
  const revendedorId = 'r' + Date.now()
  const { data, error } = await admin.auth.admin.createUser({ email, password: senha, email_confirm: true, user_metadata: { role: 'revendedor', revendedorId } })
  if (error) return NextResponse.json({ erro: 'Nao foi possivel cadastrar: ' + error.message }, { status: 400 })

  // cria o cadastro comercial (inativo = aguardando aprovacao) no estado compartilhado
  const { data: linha } = await admin.from('app_dados').select('dados').eq('id', 1).maybeSingle()
  const dados: any = linha?.dados || {}
  dados.revendedores = Array.isArray(dados.revendedores) ? dados.revendedores : []
  dados.revendedores.push({ id: revendedorId, nome, negocio, telefone, doc, endereco, login: email, ativo: false, pedidoMinimo: 0, pagamento: ['pix', 'na_entrega', 'na_retirada'], precos: {} })
  const { error: errSalvar } = await admin.from('app_dados').upsert({ id: 1, dados, atualizado_em: new Date().toISOString() })
  if (errSalvar) return NextResponse.json({ erro: 'Conta criada, mas falhou ao salvar o cadastro. Avise a EXTRABOM.' }, { status: 500 })
  return NextResponse.json({ ok: true, revendedorId, userId: data.user?.id })
}
