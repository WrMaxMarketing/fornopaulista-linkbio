import { NextResponse, type NextRequest } from 'next/server'
import { getTenantByHost } from '@/config/tenants'
import { COOKIE_OPTS } from '@/lib/http'
import { COOKIE_UTM, lerParams, serializar, temParams } from '@/lib/utm'

export const config = {
  // Ignora /_next, favicon e assets estáticos.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff|woff2|ttf)$).*)',
  ],
}

export function middleware(req: NextRequest) {
  const tenant = getTenantByHost(req.headers.get('host') ?? '')

  // Host desconhecido: rewrite para uma rota inexistente => not-found.tsx com HTTP 404.
  if (!tenant) {
    return NextResponse.rewrite(new URL('/_host-desconhecido', req.url))
  }

  const headers = new Headers(req.headers)
  headers.set('x-tenant-slug', tenant.slug)

  /*
    Qualquer entrada com utm_* carimba o cookie, que sobrevive até o clique
    no botão do cardápio. Uma visita NOVA com utm_* sobrescreve a anterior:
    vale a última origem que trouxe a pessoa (last click, igual ao GA4).
    Sem utm_* na URL o cookie fica como está — recarregar a página ou voltar
    do cardápio não apaga a campanha.
  */
  const params = lerParams(req.nextUrl.searchParams)
  const temNovos = temParams(params)

  /*
    O cookie setado na response só volta a ser legível na PRÓXIMA request.
    Na primeira visita com utm_* — justamente a do influenciador — o Server
    Component leria cookie vazio e montaria href sem UTM. Por isso a UTM
    também viaja num header do request, que o render enxerga na hora.
  */
  if (temNovos) {
    headers.set('x-utm', serializar(params))
  } else {
    const doCookie = req.cookies.get(COOKIE_UTM)?.value
    if (doCookie) headers.set('x-utm', doCookie)
  }

  const res = NextResponse.next({ request: { headers } })
  if (temNovos) res.cookies.set(COOKIE_UTM, serializar(params), COOKIE_OPTS)

  return res
}
