import { createHash } from 'node:crypto'
import { getSupabase } from '@/lib/supabase'

const BOT_UA = /bot|crawler|spider|facebookexternalhit|whatsapp|preview|slackbot|telegrambot|bingpreview|headless/i

/**
 * Prefetch do navegador/Next, link preview de app de mensagem e crawler.
 * Quando true: NÃO grava evento, mas o redirect continua normalmente.
 */
export function isBotOrPrefetch(req: Request): boolean {
  const h = req.headers

  if (h.get('purpose')?.toLowerCase() === 'prefetch') return true
  if (h.get('sec-purpose')?.toLowerCase().includes('prefetch')) return true
  if (h.get('x-middleware-prefetch')) return true
  if (h.get('x-purpose')?.toLowerCase() === 'preview') return true

  const ua = h.get('user-agent') ?? ''
  if (!ua) return true // sem user-agent = quase sempre robô
  if (BOT_UA.test(ua)) return true

  return false
}

/** sha256 de ip + IP_SALT. Nunca gravamos IP puro. */
export function hashIp(ip: string): string {
  return createHash('sha256')
    .update(`${ip}${process.env.IP_SALT ?? ''}`)
    .digest('hex')
}

/** IP real do visitante: primeiro item de x-forwarded-for. */
export function getIp(req: Request): string | null {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const primeiro = xff.split(',')[0]?.trim()
    if (primeiro) return primeiro
  }
  return req.headers.get('x-real-ip')?.trim() || null
}

export type Evento = {
  tenant_slug: string
  tipo: 'entrada' | 'saida'
  influenciador_slug?: string | null
  unidade_slug?: string | null
  acao?: string | null
  session_id?: string | null
  user_agent?: string | null
  ip_hash?: string | null
  referer?: string | null
}

/**
 * Grava o evento. É awaited (senão o serverless mata a função antes do insert),
 * mas nunca propaga erro: falha de banco não pode bloquear o redirect do cliente.
 */
export async function registrarEvento(evento: Evento): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  try {
    const { error } = await supabase.from('eventos').insert(evento)
    if (error) console.error('[tracking] insert falhou:', error.message)
  } catch (err) {
    console.error('[tracking] insert lançou:', err)
  }
}

/** Monta o payload comum a partir da request. */
export function dadosDaRequest(req: Request) {
  const ip = getIp(req)
  return {
    user_agent: req.headers.get('user-agent'),
    ip_hash: ip ? hashIp(ip) : null,
    referer: req.headers.get('referer'),
  }
}
