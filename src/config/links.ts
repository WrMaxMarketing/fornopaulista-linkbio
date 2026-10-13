/**
 * Configuração dos links curtos /{unidade}/{canal}.
 *
 * Cada rota registra um evento server-side no GA4 (Measurement Protocol)
 * e redireciona para o cardápio da unidade no Tuigo com UTMs.
 *
 * Slugs curtos e amigáveis — o que vai no QR code impresso, no Google Ads
 * e no link do WhatsApp. O slug interno do tenant (hugo_napoleao, etc.) fica
 * escondido; aqui só importa o que o cliente digita/escaneia.
 */

import type { Tenant, Unidade } from './tenants'

/* ── Unidades ─────────────────────────────────────────────── */

/** Slug curto → slug interno do tenant */
export const UNIDADES_SLUG: Record<string, string> = {
  leste: 'hugo_napoleao',
  sul: 'sul',
  dirceu: 'dirceu',
  'dom-severino': 'dom_severino',
}

/** Label bonito pra dimensão personalizada no GA4 */
export const UNIDADES_LABEL: Record<string, string> = {
  leste: 'Leste',
  sul: 'Sul',
  dirceu: 'Dirceu',
  'dom-severino': 'Dom Severino',
}

export function isUnidadeSlug(valor: string): boolean {
  return valor in UNIDADES_SLUG
}

/* ── Canais ───────────────────────────────────────────────── */

export type Canal = 'google' | 'qr' | 'zap'

export const CANAIS: Canal[] = ['google', 'qr', 'zap']

/** Label bonito pra dimensão personalizada no GA4 */
export const CANAIS_LABEL: Record<Canal, string> = {
  google: 'Google',
  qr: 'QR Code',
  zap: 'WhatsApp',
}

/** UTMs fixas por canal — o que aparece no GA4 do Tuigo */
export const CANAIS_UTM: Record<Canal, Record<string, string>> = {
  google: {
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'forno_linkbio',
  },
  qr: {
    utm_source: 'qrcode',
    utm_medium: 'offline',
    utm_campaign: 'forno_linkbio',
  },
  zap: {
    utm_source: 'whatsapp',
    utm_medium: 'social',
    utm_campaign: 'forno_linkbio',
  },
}

export function isCanal(valor: string): valor is Canal {
  return (CANAIS as string[]).includes(valor)
}

/* ── Resolução ────────────────────────────────────────────── */

export function resolverUnidade(
  tenant: Tenant,
  slugCurto: string,
): Unidade | null {
  const slugInterno = UNIDADES_SLUG[slugCurto]
  if (!slugInterno) return null
  return tenant.unidades.find((u) => u.slug === slugInterno) ?? null
}
