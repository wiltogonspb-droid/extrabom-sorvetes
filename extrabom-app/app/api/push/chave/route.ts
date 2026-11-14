import { NextResponse } from 'next/server'
import { chavePublicaPush, pushConfigurado } from '../../../../lib/pushServer'
export const dynamic = 'force-dynamic'
export async function GET() {
  return NextResponse.json({ publicKey: chavePublicaPush(), ativo: pushConfigurado() })
}
