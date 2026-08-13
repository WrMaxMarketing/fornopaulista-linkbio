import { NextResponse, type NextRequest } from 'next/server'
import { getTenantByHost } from '@/config/tenants'
import { COOKIE_OPTS, normalizarSlug, origem } from '@/lib/http'
import { dadosDaRequest, isBotOrPrefetch, registrarEvento } from '@/lib/tracking'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ influenciador: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  const { influenciador } = await ctx.params

  const tenant = getTenantByHost(req.headers.get('host') ?? '')
  if (!tenant) return new NextResponse('Not Found', { status: 404 })

  const slug = normalizarSlug(influenciador)

  // Influenciador inexistente ou ativo=false NÃO bloqueia o cliente:
  // o slug é gravado como veio e a jornada segue igual.
  const sessionId = req.cookies.get('sid')?.value ?? crypto.randomUUID()

  // 302 (temporário) — nunca 301, senão o navegador cacheia e o /i deixa de rodar.
  const res = NextResponse.redirect(new URL('/', origem(req)), 302)
  res.cookies.set('ref', slug, COOKIE_OPTS)
  res.cookies.set('sid', sessionId, COOKIE_OPTS)

  if (!isBotOrPrefetch(req)) {
    await registrarEvento({
      tenant_slug: tenant.slug,
      tipo: 'entrada',
      influenciador_slug: slug || null,
      session_id: sessionId,
      ...dadosDaRequest(req),
    })
  }

  return res
}
