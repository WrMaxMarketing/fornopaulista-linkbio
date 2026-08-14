'use client'

import type { ReactNode } from 'react'
import { eventoGa } from './ga'

type Props = {
  href: string
  className?: string
  /** nome do evento no GA4 */
  evento: string
  /** parâmetros do evento (viram dimensões personalizadas no painel) */
  params?: Record<string, string>
  children: ReactNode
}

/**
 * <a> normal que dispara um evento no GA4 antes de sair.
 * Continua sendo navegação de página inteira — nada de preventDefault,
 * pra não depender de JS pra levar a pessoa ao destino.
 */
export function LinkRastreado({ href, className, evento, params, children }: Props) {
  return (
    <a href={href} className={className} onClick={() => eventoGa(evento, params ?? {})}>
      {children}
    </a>
  )
}
