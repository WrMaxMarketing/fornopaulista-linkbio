'use client'

type Gtag = (comando: string, evento: string, params?: Record<string, unknown>) => void

/**
 * Evento no GA4 do hub. É o que mostra quantas pessoas que entraram
 * clicaram em cada unidade / cada ação — o meio do funil, que a UTM
 * sozinha não conta (ela só aparece no destino).
 *
 * `transport_type: 'beacon'` porque logo depois vem uma navegação de página
 * inteira: sem isso o browser cancela a requisição do evento.
 *
 * Sem gaId configurado o gtag não existe e a função vira no-op.
 */
export function eventoGa(nome: string, params: Record<string, string>): void {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  if (typeof gtag !== 'function') return

  gtag('event', nome, { ...params, transport_type: 'beacon' })
}
