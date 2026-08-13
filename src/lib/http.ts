import type { NextRequest } from 'next/server'

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 dias

/**
 * Opções dos cookies `ref` e `sid`.
 * SEM atributo `domain` de propósito: o cookie fica preso ao host exato,
 * então /i, o hub e /go precisam estar sempre no mesmo domínio.
 */
export const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: true,
  path: '/',
  maxAge: COOKIE_MAX_AGE,
} as const

/** Origem real por trás do proxy da Vercel (nunca confie só em req.url). */
export function origem(req: NextRequest): string {
  const host = req.headers.get('host') ?? req.nextUrl.host
  const proto =
    req.headers.get('x-forwarded-proto') ??
    (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https')
  return `${proto}://${host}`
}

/**
 * Normaliza o slug do influenciador antes de virar cookie e utm_content:
 * minúsculo, sem '@', sem caractere que quebre header HTTP ou query string.
 */
export function normalizarSlug(valor: string): string {
  let v = valor
  try {
    v = decodeURIComponent(valor)
  } catch {
    // valor com percent-encoding inválido: usa como veio
  }
  return v
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 60)
}
