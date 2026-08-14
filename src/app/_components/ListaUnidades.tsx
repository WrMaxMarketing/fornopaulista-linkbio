'use client'

import { useState } from 'react'
import { Acordeao } from './Acordeao'

/**
 * Os hrefs chegam PRONTOS do servidor (destino final, não `/go/...`), porque
 * é o gtag que precisa enxergar o domínio de saída no href pra decorar com `_gl`.
 * `null` = destino ainda sem valor no config; o botão some.
 */
export type ItemUnidade = {
  slug: string
  nome: string
  hrefPedido: string | null
  hrefWhatsapp: string | null
  hrefLocalizacao: string | null
}

/**
 * Guarda qual unidade está aberta. Um acordeão por vez: abrir a segunda
 * fecha a primeira; clicar na que já está aberta fecha ela.
 */
export function ListaUnidades({
  unidades,
  logoUrl,
}: {
  unidades: ItemUnidade[]
  logoUrl: string
}) {
  const [abertoSlug, setAbertoSlug] = useState<string | null>(null)

  return (
    <>
      {unidades.map((u) => (
        <Acordeao
          key={u.slug}
          unidade={u}
          logoUrl={logoUrl}
          aberto={abertoSlug === u.slug}
          onToggle={() => setAbertoSlug((atual) => (atual === u.slug ? null : u.slug))}
        />
      ))}
    </>
  )
}
