import { NextResponse, type NextRequest } from 'next/server'
import { getTenantByHost } from '@/config/tenants'

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

  return NextResponse.next({ request: { headers } })
}
