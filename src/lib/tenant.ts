import { headers } from 'next/headers'
import type { CSSProperties } from 'react'
import { getTenantByHost, getTenantBySlug, type Tenant } from '@/config/tenants'

/**
 * Tenant da request atual: usa o header injetado pelo middleware
 * e cai no host como fallback (útil em not-found e em render fora do matcher).
 */
export async function getTenantAtual(): Promise<Tenant | null> {
  const h = await headers()
  const slug = h.get('x-tenant-slug')
  if (slug) {
    const porSlug = getTenantBySlug(slug)
    if (porSlug) return porSlug
  }
  return getTenantByHost(h.get('host') ?? '')
}

/** Cores do tenant viram CSS custom properties — nenhum hex hardcoded no JSX. */
export function coresComoCssVars(tenant: Tenant): CSSProperties {
  return {
    '--cor-fundo': tenant.cores.fundo,
    '--cor-botao': tenant.cores.botao,
    '--cor-texto-botao': tenant.cores.textoBotao,
    '--cor-destaque': tenant.cores.destaque,
  } as CSSProperties
}
