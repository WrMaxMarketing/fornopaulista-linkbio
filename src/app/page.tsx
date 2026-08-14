import { notFound } from 'next/navigation'
import { ListaUnidades } from './_components/ListaUnidades'
import { PILL, PILL_TITULO } from './_components/Pill'
import { getTenantAtual } from '@/lib/tenant'

export const dynamic = 'force-dynamic'

export default async function Hub() {
  const tenant = await getTenantAtual()
  if (!tenant) notFound()

  const comFoto = Boolean(tenant.fotoUrl)

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col items-center pb-10">
      <header className="flex w-full flex-col items-center">
        {comFoto ? (
          // sangra a largura toda: nenhuma faixa do fundo aparece ao lado da foto
          <div className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tenant.fotoUrl}
              alt=""
              // max-h em svh: no celular a foto nunca empurra os botões pra fora da tela
              className="block max-h-[46svh] w-full object-cover object-center"
            />
            {/* rodapé da foto derretendo no fundo, como na referência */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-b from-transparent to-[var(--cor-fundo)]" />
          </div>
        ) : null}

        <div className={`flex flex-col items-center ${comFoto ? '-mt-[52px]' : 'pt-8'}`}>
          {tenant.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tenant.logoUrl}
              alt={tenant.nome}
              className="h-auto w-[150px] object-contain drop-shadow-sm"
            />
          ) : (
            <span className="py-4 text-2xl font-bold text-[var(--cor-destaque)]">{tenant.nome}</span>
          )}
        </div>
      </header>

      <main className="flex w-full flex-col gap-3 px-4">
        {tenant.linkEvento?.url ? (
          <a href={tenant.linkEvento.url} className={`${PILL} ${PILL_TITULO}`}>
            {tenant.linkEvento.label}
          </a>
        ) : null}

        <ListaUnidades unidades={tenant.unidades} logoUrl={tenant.logoUrl} />
      </main>
    </div>
  )
}
