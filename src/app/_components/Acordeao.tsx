'use client'

import { useId, useState } from 'react'
import { IconeChevron, IconePin, IconeSacola, IconeWhatsapp } from './icones'

/** Sem `justify-*` aqui: cada uso define o seu (ordem de classe não decide vencedor no Tailwind). */
const BOTAO =
  'flex min-h-12 w-full items-center gap-2 rounded-full bg-[var(--cor-botao)] px-5 font-semibold tracking-wide text-[var(--cor-texto-botao)] outline-offset-2 transition-transform focus-visible:outline-2 focus-visible:outline-[var(--cor-destaque)] active:scale-[0.99]'

export function Acordeao({ nome, slug }: { nome: string; slug: string }) {
  const [aberto, setAberto] = useState(false)
  const painelId = useId()

  return (
    <div className="w-full">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={painelId}
        onClick={() => setAberto((v) => !v)}
        className={`${BOTAO} justify-between`}
      >
        {/* espaçador para o nome ficar centralizado mesmo com o chevron à direita */}
        <span className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-center">{nome}</span>
        <IconeChevron
          className={`h-5 w-5 shrink-0 transition-transform duration-200 ${aberto ? 'rotate-180' : ''}`}
        />
      </button>

      <div id={painelId} className={aberto ? 'mt-2 flex flex-col gap-2 pb-2' : 'hidden'}>
        {/* <a href> puro: navegação de página inteira, o clique precisa chegar no servidor. */}
        <a href={`/go/pedido/${slug}`} className={`${BOTAO} justify-center`}>
          <IconeSacola className="h-5 w-5 shrink-0" />
          Seu Pedido
        </a>
        <a href={`/go/whatsapp/${slug}`} className={`${BOTAO} justify-center`}>
          <IconeWhatsapp className="h-5 w-5 shrink-0" />
          WhatsApp
        </a>
        <a href={`/go/localizacao/${slug}`} className={`${BOTAO} justify-center`}>
          <IconePin className="h-5 w-5 shrink-0" />
          Localização
        </a>
      </div>
    </div>
  )
}
