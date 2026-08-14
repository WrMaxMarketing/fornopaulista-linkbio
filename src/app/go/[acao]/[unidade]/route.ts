import { NextResponse, type NextRequest } from 'next/server'
import { getTenantByHost, getUnidade, isAcao } from '@/config/tenants'
import { montarDestino } from '@/lib/destino'
import { COOKIE_UTM, desserializar } from '@/lib/utm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/*
  Fallback dos links já publicados. O hub agora põe o destino final direto no
  href — quem chega aqui veio de um link antigo. A URL de saída é montada pela
  MESMA função do hub (@/lib/destino), então os dois caminhos coincidem.
*/

type Ctx = { params: Promise<{ acao: string; unidade: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  const { acao, unidade: unidadeSlug } = await ctx.params

  const tenant = getTenantByHost(req.headers.get('host') ?? '')
  if (!tenant) return new NextResponse('Not Found', { status: 404 })

  if (!isAcao(acao)) return new NextResponse('Not Found', { status: 404 })

  const unidade = getUnidade(tenant, unidadeSlug)
  if (!unidade) return new NextResponse('Not Found', { status: 404 })

  /*
    A UTM que o middleware guardou na entrada. Vazio = a pessoa entrou pelo
    link cru da bio, e o destino recebe a URL limpa. Nada é inventado aqui.
  */
  const utm = desserializar(req.cookies.get(COOKIE_UTM)?.value ?? '')

  const destino = montarDestino(unidade, acao, utm)
  if (!destino) {
    // urlCardapio / whatsapp / maps ainda com placeholder vazio no config.
    console.error(`[go] destino não configurado: ${tenant.slug}/${unidade.slug}/${acao}`)
    return new NextResponse('Not Found', { status: 404 })
  }

  return NextResponse.redirect(destino, 302)
}
