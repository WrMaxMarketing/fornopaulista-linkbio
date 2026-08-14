export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 dias

/**
 * Opções do cookie `utm`.
 * SEM atributo `domain` de propósito: o cookie fica preso ao host exato,
 * então o hub e /go precisam estar sempre no mesmo domínio.
 */
export const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: true,
  path: '/',
  maxAge: COOKIE_MAX_AGE,
} as const
