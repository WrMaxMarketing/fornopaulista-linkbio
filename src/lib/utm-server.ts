import { headers } from 'next/headers'
import { desserializar } from './utm'

/**
 * A UTM da request atual, do jeito que o middleware entregou: da URL quando a
 * visita trouxe utm_*, do cookie quando não trouxe. Sem header = entrada limpa,
 * e o hub não inventa nada.
 */
export async function getUtmAtual(): Promise<Record<string, string>> {
  const h = await headers()
  return desserializar(h.get('x-utm') ?? '')
}
