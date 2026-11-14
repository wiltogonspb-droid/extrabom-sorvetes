import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { clienteAdmin, carregarDados, salvarDados, enviarPush } from '../../../../lib/pushServer'
import { infoReposicao } from '../../../../lib/data'

// Relogio diario dos freezers (Vercel Cron, 7h da manha): avisa a equipe no celular
// de quem vence hoje/amanhã e de quem ja esta atrasado. Nao repete o mesmo aviso.
async function autorizado(req: NextRequest) {
  const segredo = process.env['CRON' + '_SECRET']
  const auth = req.headers.get('authorization') || ''
  if (segredo && auth === 'Bearer ' + segredo) return true
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const token = auth.replace('Bearer ', '')
  if (!url || !anon || !token) return false
  const { data } = await createClient(url, anon).auth.getUser(token)
  return (data?.user?.user_metadata as any)?.role === 'admin'
}
async function verificar(req: NextRequest) {
  if (!(await autorizado(req))) return NextResponse.json({ erro: 'Nao autorizado.' }, { status: 401 })
  const admin = clienteAdmin()
  if (!admin) return NextResponse.json({ erro: 'Servidor nao configurado.' }, { status: 500 })
  const dados: any = await carregarDados(admin)
  if (!dados) return NextResponse.json({ erro: 'Banco nao encontrado.' }, { status: 500 })
  dados.pushAlertas = dados.pushAlertas || {}
  const hoje = new Date().toISOString().slice(0, 10)
  let avisados = 0; let mudou = false
  for (const r of (dados.revendedores || []).filter((x: any) => x.temFreezer)) {
    const inf = infoReposicao(r, dados.pedidos || [])
    if (inf.situacao !== 'vencendo' && inf.situacao !== 'atrasado') continue
    const tipo = inf.situacao === 'atrasado' ? 'freezer_atrasado' : 'freezer_vencendo'
    const chave = inf.situacao === 'atrasado'
      ? r.id + ':atrasado:' + hoje
      : r.id + ':' + (inf.proxima ? inf.proxima.toISOString().slice(0, 10) : '') + ':' + inf.diasRestantes
    if (dados.pushAlertas[chave]) continue
    const res = await enviarPush(dados, {
      roles: ['admin'], tipo,
      titulo: inf.situacao === 'atrasado' ? '🚨 Freezer atrasado' : '🧊 Reposição de freezer',
      corpo: inf.situacao === 'atrasado'
        ? r.nome + ': reposição atrasada há ' + Math.abs(inf.diasRestantes || 0) + ' dia(s). Última: ' + (inf.ultimo ? inf.ultimo.toLocaleDateString('pt-BR') : '—')
        : r.nome + ': reposição ' + (inf.diasRestantes === 0 ? 'VENCE HOJE' : 'amanhã') + ' (' + (inf.proxima ? inf.proxima.toLocaleDateString('pt-BR') : '') + ').',
      url: '/',
    })
    if (res.enviados > 0) { dados.pushAlertas[chave] = new Date().toISOString(); avisados++; mudou = true }
    if (res.removidos.length) mudou = true
    // o proprio cliente tambem pode receber o lembrete (se ele ativou esse aviso)
    const chaveRev = chave + ':rev'
    if (!dados.pushAlertas[chaveRev]) {
      const resRev = await enviarPush(dados, { roles: ['revendedor'], revendedorId: r.id, tipo: 'freezer', titulo: '🧊 Hora de repor seu freezer', corpo: 'Ola, ' + r.nome + '! Pelo seu ritmo, ja esta na hora de fazer um novo pedido pra EXTRABOM.' })
      if (resRev.enviados > 0) { dados.pushAlertas[chaveRev] = new Date().toISOString(); mudou = true }
      if (resRev.removidos.length) mudou = true
    }
  }
  // estoque baixo: 1 aviso por dia para a equipe
  const baixos = (dados.produtos || []).filter((x: any) => x.ativo && (x.estoqueFisico - x.estoqueReservado) <= 10)
  const chaveEstoque = 'estoque:' + hoje + ':' + baixos.map((x: any) => x.id).join(',')
  if (baixos.length && !dados.pushAlertas[chaveEstoque]) {
    const resEst = await enviarPush(dados, { roles: ['admin'], tipo: 'estoque_baixo', titulo: '📦 Estoque baixo', corpo: baixos.slice(0, 3).map((x: any) => x.nome).join(', ') + (baixos.length > 3 ? ' e mais ' + (baixos.length - 3) : '') + ' com 10 ou menos disponiveis.' })
    if (resEst.enviados > 0) { dados.pushAlertas[chaveEstoque] = new Date().toISOString(); mudou = true }
    if (resEst.removidos.length) mudou = true
  }
  if (mudou) await salvarDados(admin, dados)
  return NextResponse.json({ ok: true, avisados, em: new Date().toISOString() })
}
export async function GET(req: NextRequest) { return verificar(req) }
export async function POST(req: NextRequest) { return verificar(req) }
