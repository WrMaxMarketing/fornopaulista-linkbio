import { NextResponse, type NextRequest } from 'next/server'
import { getTenantByHost, getUnidade, isAcao, type Unidade } from '@/config/tenants'
import { COOKIE_UTM, aplicarEmUrl, desserializar } from '@/lib/utm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

function montarDestino(
  unidade: Unidade,
  acao: 'pedido' | 'whatsapp' | 'localizacao',
  utm: Record<string, string>,
): string | null {
  if (acao === 'pedido') {
    const url = paraUrl(unidade.urlCardapio)
    if (!url) return null

    // Único ponto que repassa UTM: é o destino que tem GA4 e Pixel do cardápio.
    // A query própria do link (ex: `?f=msa`) é preservada.
    aplicarEmUrl(url, utm)

    return url.toString()
  }

  if (acao === 'whatsapp') {
    // wa.me descarta querystring — não adianta mandar UTM pra cá.
    const numero = unidade.whatsapp.replace(/\D/g, '')
    if (!numero) return null

    return `https://wa.me/${numero}?text=${encodeURIComponent('Oi! Quero fazer um pedido')}`
  }

  // localizacao: o Maps também ignora UTM, então o link vai como está no config.
  return paraUrl(unidade.maps)?.toString() ?? null
}

function paraUrl(valor: string): URL | null {
  if (!valor) return null
  try {
    const url = new URL(valor)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url
  } catch {
    return null
  }
}
