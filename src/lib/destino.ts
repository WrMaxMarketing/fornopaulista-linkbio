/**
 * Montagem do destino final de cada botão.
 *
 * Mora aqui, e não dentro de /go, porque DOIS lugares precisam produzir a
 * URL idêntica: o Server Component (que põe o destino direto no href, pro
 * gtag conseguir decorar o link com `_gl` e não quebrar a sessão em duas)
 * e a rota /go, que continua existindo pros links já publicados.
 */

import type { Acao, Unidade } from '@/config/tenants'
import { aplicarEmUrl } from './utm'

/** Assunto da conversa, já no fim da frase. */
const ASSUNTOS = {
  pedido: 'fazer um pedido',
  evento: 'informações sobre eventos',
} as const

type Assunto = keyof typeof ASSUNTOS

/** `null` = o config ainda está com placeholder vazio; o botão não é renderizado. */
export function montarDestino(
  unidade: Unidade,
  acao: Acao,
  utm: Record<string, string>,
): string | null {
  if (acao === 'pedido') {
    const url = paraUrl(unidade.urlCardapio)
    if (!url) return null

    // Único ponto que repassa UTM: é o destino que tem GA4 e Pixel do cardápio.
    // A query própria do link (ex: `?f=msa`) é preservada.
    aplicarEmUrl(url, utm)

    return url.toString()
  }

  if (acao === 'whatsapp') {
    return linkWhatsapp(unidade.whatsapp, utm, 'pedido')
  }

  // localizacao: o Maps também ignora UTM, então o link vai como está no config.
  return paraUrl(unidade.maps)?.toString() ?? null
}

/**
 * O wa.me descarta querystring, então a identificação da campanha não cabe em
 * UTM: ela vai NO TEXTO da mensagem, que é o que o atendente lê.
 */
export function linkWhatsapp(
  numeroBruto: string,
  utm: Record<string, string>,
  assunto: Assunto,
): string | null {
  const numero = numeroBruto.replace(/\D/g, '')
  if (!numero) return null

  return `https://wa.me/${numero}?text=${encodeURIComponent(texto(utm, assunto))}`
}

/**
 * Link de evento do config. Se for wa.me, ganha o mesmo texto com o
 * influenciador; qualquer outro destino vai exatamente como está.
 */
export function montarLinkEvento(url: string, utm: Record<string, string>): string | null {
  const alvo = paraUrl(url)
  if (!alvo) return null

  if (alvo.hostname !== 'wa.me') return alvo.toString()

  return linkWhatsapp(alvo.pathname, utm, 'evento')
}

function texto(utm: Record<string, string>, assunto: Assunto): string {
  const influenciador = utm.utm_content

  return influenciador
    ? `Oi! Vim pelo @${influenciador} e quero ${ASSUNTOS[assunto]}`
    : `Oi! Quero ${ASSUNTOS[assunto]}`
}

function paraUrl(valor: string): URL | null {
  if (!valor) return null
  try {
    const url = new URL(valor)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url
  } catch {
    return null
  }
}
