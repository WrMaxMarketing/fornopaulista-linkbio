import { NextResponse, type NextRequest } from 'next/server'
import { getTenantByHost } from '@/config/tenants'
import {
  isUnidadeSlug,
  isCanal,
  resolverUnidade,
  UNIDADES_LABEL,
  CANAIS_LABEL,
  CANAIS_UTM,
} from '@/config/links'
import { aplicarEmUrl } from '@/lib/utm'
import { enviarEventoGA4 } from '@/lib/ga-mp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/*
  Link curto: /{unidade}/{canal}
  Exemplo:    /leste/google   /sul/qr   /dirceu/zap   /dom-severino/google

  1. Registra evento `clique_link_curto` no GA4 via Measurement Protocol
     com dimensões personalizadas: unidade, canal
  2. Redireciona para o cardápio da unidade no Tuigo com as UTMs do canal

  O utm_term leva o slug da unidade pra filtrar no GA4 por unidade.
*/

type Ctx = { params: Promise<{ unidade: string; canal: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  const { unidade: unidadeSlug, canal: canalSlug } = await ctx.params

  /* ── Validação ──────────────────────────────────────────── */

  if (!isUnidadeSlug(unidadeSlug) || !isCanal(canalSlug)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const tenant = getTenantByHost(req.headers.get('host') ?? '')
  if (!tenant) return new NextResponse('Not Found', { status: 404 })

  const unidade = resolverUnidade(tenant, unidadeSlug)
  if (!unidade) return new NextResponse('Not Found', { status: 404 })

  /* ── UTMs do canal + unidade ────────────────────────────── */

  const utm: Record<string, string> = {
    ...CANAIS_UTM[canalSlug],
    utm_term: unidadeSlug, // filtra por unidade no GA4
  }

  /* ── Destino: cardápio no Tuigo ─────────────────────────── */

  const destino = new URL(unidade.urlCardapio)
  aplicarEmUrl(destino, utm)

  /* ── Evento GA4 (fire-and-forget) ───────────────────────── */

  if (tenant.gaId) {
    // Não espera a promise — o redirect sai imediato
    enviarEventoGA4(tenant.gaId, 'clique_link_curto', {
      unidade: UNIDADES_LABEL[unidadeSlug] ?? unidadeSlug,
      canal: CANAIS_LABEL[canalSlug] ?? canalSlug,
      unidade_slug: unidadeSlug,
      canal_slug: canalSlug,
      link: `/${unidadeSlug}/${canalSlug}`,
    }).catch(() => {
      // Já logado dentro de enviarEventoGA4
    })
  }

  return NextResponse.redirect(destino.toString(), 302)
}
