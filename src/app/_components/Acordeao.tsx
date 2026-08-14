'use client'

import { useId } from 'react'
import { IconeChevron, IconePin, IconeWhatsapp } from './icones'
import { LinkRastreado } from './LinkRastreado'
import {
  PILL,
  PILL_ICONE_DIR,
  PILL_ICONE_ESQ,
  PILL_LOGO_ESQ,
  PILL_TEXTO,
  PILL_TITULO,
} from './Pill'

type Props = {
  nome: string
  slug: string
  /** logo do tenant — entra no lugar do ícone em "Seu Pedido" */
  logoUrl: string
  /** quem manda no aberto/fechado é a lista: só um acordeão fica aberto por vez */
  aberto: boolean
  onToggle: () => void
}

export function Acordeao({ nome, slug, logoUrl, aberto, onToggle }: Props) {
  const painelId = useId()

  return (
    <div className="w-full">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={painelId}
        onClick={onToggle}
        className={`${PILL} ${PILL_TITULO}`}
      >
        {nome}
        <IconeChevron
          className={`${PILL_ICONE_DIR} transition-transform duration-300 ease-out motion-reduce:transition-none ${aberto ? 'rotate-180' : ''}`}
        />
      </button>

      {/*
        Truque do grid 0fr -> 1fr: anima a altura sem precisar medir o conteúdo em JS.
        `inert` tira os links do foco do teclado enquanto o painel está fechado.
      */}
      <div
        id={painelId}
        inert={!aberto}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div
          className={`flex flex-col gap-2 overflow-hidden transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            aberto ? 'translate-y-0 pt-2 opacity-100' : '-translate-y-1 opacity-0'
          }`}
        >
          {/* navegação de página inteira: o clique precisa chegar no servidor,
              que é quem lê o cookie da UTM e monta o destino. */}
          <LinkRastreado
            href={`/go/pedido/${slug}`}
            className={`${PILL} ${PILL_TEXTO}`}
            evento="clique_pedido"
            params={{ unidade: slug }}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className={PILL_LOGO_ESQ} />
            ) : null}
            Seu Pedido
          </LinkRastreado>
          <LinkRastreado
            href={`/go/whatsapp/${slug}`}
            className={`${PILL} ${PILL_TEXTO}`}
            evento="clique_whatsapp"
            params={{ unidade: slug }}
          >
            <IconeWhatsapp className={`${PILL_ICONE_ESQ} text-whatsapp`} />
            WhatsApp
          </LinkRastreado>
          <LinkRastreado
            href={`/go/localizacao/${slug}`}
            className={`${PILL} ${PILL_TEXTO}`}
            evento="clique_localizacao"
            params={{ unidade: slug }}
          >
            <IconePin className={PILL_ICONE_ESQ} />
            Localização
          </LinkRastreado>
        </div>
      </div>
    </div>
  )
}
