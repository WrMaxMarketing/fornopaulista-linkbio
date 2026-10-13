/**
 * GA4 Measurement Protocol — envio server-side de eventos.
 *
 * Usado pelas rotas de link curto pra registrar o clique ANTES do redirect.
 * O envio roda dentro de waitUntil na rota — a Vercel mantém a função
 * viva até o fetch terminar, sem atrasar o redirect pro usuário.
 *
 * Docs: https://developers.google.com/analytics/devguides/collection/protocol/ga4
 *
 * Requer:
 *   - GA_API_SECRET no env (criar em GA4 → Admin → Data Streams → Measurement Protocol)
 */

const MP_URL = 'https://www.google-analytics.com/mp/collect'

type EventParams = Record<string, string | number>

/**
 * Dispara um evento no GA4 via Measurement Protocol.
 *
 * `clientId` é obrigatório — usamos um UUID efêmero porque cada clique
 * no link curto é uma visita anônima (não tem cookie GA4 ainda).
 *
 * A chamada nunca lança: erros são logados e engolidos.
 */
export async function enviarEventoGA4(
  measurementId: string,
  eventName: string,
  params: EventParams,
): Promise<void> {
  const apiSecret = process.env.GA_API_SECRET
  if (!apiSecret) {
    console.warn('[ga-mp] GA_API_SECRET não configurado — evento ignorado')
    return
  }

  const clientId = crypto.randomUUID()

  const body = {
    client_id: clientId,
    events: [
      {
        name: eventName,
        params: {
          ...params,
          // engagement_time_msec e session_id são necessários pro evento
          // aparecer nos relatórios em tempo real do GA4
          engagement_time_msec: 100,
          session_id: Date.now().toString(),
        },
      },
    ],
  }

  try {
    const url = `${MP_URL}?measurement_id=${measurementId}&api_secret=${apiSecret}`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000), // 5s — waitUntil garante que a função não morre
    })

    if (!res.ok) {
      console.error(`[ga-mp] resposta ${res.status} do Measurement Protocol`)
    }
  } catch (err) {
    // Falha silenciosa — o redirect é mais importante que o evento
    console.error('[ga-mp] falha ao enviar evento:', err)
  }
}
