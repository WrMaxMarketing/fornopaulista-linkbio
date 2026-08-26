import { NextResponse, type NextRequest } from 'next/server'
import { getTenantByHost } from '@/config/tenants'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/*
  Link curto pra bio/direct do Instagram. Manda a pessoa pro hub (/) já com as
  UTMs fixas na URL — o middleware lê esses params na chegada e carimba o cookie,
  então o clique no botão do cardápio sai com a mesma origem.

  A UTM precisa aparecer na URL final (e não só no cookie) porque o GA4 só
  atribui a sessão ao ler os utm_* da página de entrada.
*/

const UTM_DIRECT = {
  utm_source: 'instagram',
  utm_medium: 'organico',
  utm_term: 'direct',
} as const

export async function GET(req: NextRequest) {
  const host = req.headers.get('host') ?? ''

  const tenant = getTenantByHost(host)
  if (!tenant) return new NextResponse('Not Found', { status: 404 })

  /*
    O destino é o próprio host da request — assim a rota funciona igual em
    localhost, nos previews da Vercel e no domínio final, sem hardcode.
    A URL é montada por string (e não via `url.host = ...`) porque o setter de
    `host` mantém a porta antiga quando o valor novo não traz uma.
  */
  const proto = (req.headers.get('x-forwarded-proto') ?? req.nextUrl.protocol).split(',')[0]
  const destino = new URL(`${proto.replace(':', '')}://${host}/`)

  for (const [chave, valor] of Object.entries(UTM_DIRECT)) {
    destino.searchParams.set(chave, valor)
  }

  return NextResponse.redirect(destino, 302)
}
