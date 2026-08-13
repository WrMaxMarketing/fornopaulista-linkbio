import { NextResponse, type NextRequest } from 'next/server'
import { getTenantByHost, getUnidade, isAcao, type Tenant, type Unidade } from '@/config/tenants'
import { normalizarSlug } from '@/lib/http'
import { dadosDaRequest, isBotOrPrefetch, registrarEvento } from '@/lib/tracking'

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

  const ref = normalizarSlug(req.cookies.get('ref')?.value ?? '') || null
  const sessionId = req.cookies.get('sid')?.value ?? null

  const destino = montarDestino(tenant, unidade, acao, ref)
  if (!destino) {
    // urlCardapio / whatsapp / maps ainda com placeholder vazio no config.
    console.error(`[go] destino não configurado: ${tenant.slug}/${unidade.slug}/${acao}`)
    return new NextResponse('Not Found', { status: 404 })
  }

  if (!isBotOrPrefetch(req)) {
    await registrarEvento({
      tenant_slug: tenant.slug,
      tipo: 'saida',
      influenciador_slug: ref,
      unidade_slug: unidade.slug,
      acao,
      session_id: sessionId,
      ...dadosDaRequest(req),
    })
  }

  return NextResponse.redirect(destino, 302)
}

function montarDestino(
  tenant: Tenant,
  unidade: Unidade,
  acao: 'pedido' | 'whatsapp' | 'localizacao',
  ref: string | null,
): string | null {
  if (acao === 'pedido') {
    const url = paraUrl(unidade.urlCardapio)
    if (!url) return null

    // Merge correto: preserva a query que o cardápio já tiver.
    url.searchParams.set('utm_source', 'instagram')
    url.searchParams.set('utm_medium', 'influencer')
    url.searchParams.set('utm_campaign', tenant.campanha)
    url.searchParams.set('utm_content', ref ?? 'organico')
    url.searchParams.set('utm_term', unidade.slug)

    return url.toString()
  }

  if (acao === 'whatsapp') {
    const numero = unidade.whatsapp.replace(/\D/g, '')
    if (!numero) return null

    const texto = ref
      ? `Oi! Vim pelo @${ref} e quero fazer um pedido`
      : 'Oi! Quero fazer um pedido'

    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
  }

  // localizacao: sem nenhum parâmetro adicional
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
