'use client'

import { useState } from 'react'
import { Acordeao } from './Acordeao'

type Item = { slug: string; nome: string }

/**
 * Guarda qual unidade está aberta. Um acordeão por vez: abrir a segunda
 * fecha a primeira; clicar na que já está aberta fecha ela.
 */
export function ListaUnidades({ unidades, logoUrl }: { unidades: Item[]; logoUrl: string }) {
  const [abertoSlug, setAbertoSlug] = useState<string | null>(null)

  return (
    <>
      {unidades.map((u) => (
        <Acordeao
          key={u.slug}
          nome={u.nome || u.slug}
          slug={u.slug}
          logoUrl={logoUrl}
          aberto={abertoSlug === u.slug}
          onToggle={() => setAbertoSlug((atual) => (atual === u.slug ? null : u.slug))}
        />
      ))}
    </>
  )
}
