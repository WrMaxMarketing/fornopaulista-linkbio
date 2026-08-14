/**
 * Rastreio por UTM, repassada de ponta a ponta.
 *
 * O código NUNCA inventa, completa ou renomeia UTM. As UTMs são montadas à mão
 * na hora de gerar o link de cada influenciador/campanha. O papel do hub é só
 * guardar o que chegou e devolver igual no link do cardápio, pra que o GA4 e o
 * Pixel do Anota AI / Tuigo atribuam a compra à mesma origem.
 *
 * Entrou sem UTM (link cru da bio) = sai sem UTM. Isso é o lead orgânico,
 * e o GA4 já classifica sozinho como direct/organic.
 */

/** Tudo que é repassado. Qualquer outro parâmetro da entrada é ignorado. */
export const PARAMS_RASTREIO = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  // click ids das plataformas — o Pixel/GA4 do destino sabe ler
  'fbclid',
  'gclid',
  'ttclid',
] as const

export const COOKIE_UTM = 'utm'

/** Tira caractere de controle e limita tamanho. O encode fica com URLSearchParams. */
function limparValor(valor: string): string {
  let saida = ''

  for (const ch of valor.trim()) {
    const cp = ch.codePointAt(0) ?? 0
    if (cp >= 0x20 && cp !== 0x7f) saida += ch
  }

  return saida.slice(0, 150)
}

/** Só os params de rastreio que vieram preenchidos. */
export function lerParams(sp: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {}

  for (const chave of PARAMS_RASTREIO) {
    const valor = limparValor(sp.get(chave) ?? '')
    if (valor) out[chave] = valor
  }

  return out
}

export function temParams(p: Record<string, string>): boolean {
  return Object.keys(p).length > 0
}

/** Vira querystring pra caber no cookie. */
export function serializar(p: Record<string, string>): string {
  return new URLSearchParams(p).toString()
}

/**
 * O Next grava o Set-Cookie com percent-encoding (`=` vira `%3D`, `&` vira `%26`),
 * mas `cookies.get()` devolve o valor exatamente como veio no header, sem decodificar.
 * Por isso tenta cru primeiro e decodificado depois — funciona nos dois casos.
 */
export function desserializar(valor: string): Record<string, string> {
  if (!valor) return {}

  const cru = lerParams(new URLSearchParams(valor))
  if (temParams(cru)) return cru

  try {
    return lerParams(new URLSearchParams(decodeURIComponent(valor)))
  } catch {
    // percent-encoding inválido: trata como cookie sem UTM
    return {}
  }
}

/**
 * Aplica os params no destino. `set` (não `append`) porque, se o link do
 * cardápio já trouxer uma utm padrão, a da campanha tem que vencer.
 * Qualquer outra query do destino (ex: `?f=msa`) é preservada.
 */
export function aplicarEmUrl(url: URL, p: Record<string, string>): void {
  for (const [chave, valor] of Object.entries(p)) {
    url.searchParams.set(chave, valor)
  }
}
