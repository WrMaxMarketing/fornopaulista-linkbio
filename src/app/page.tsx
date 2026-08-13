import { notFound } from 'next/navigation'
import { Acordeao } from './_components/Acordeao'
import { IconeInstagram } from './_components/icones'
import { getTenantAtual } from '@/lib/tenant'

export const dynamic = 'force-dynamic'

export default async function Hub() {
  const tenant = await getTenantAtual()
  if (!tenant) notFound()

  return (
    <main className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-4 px-5 pb-16 pt-10">
      {tenant.logoUrl ? (
        // <img> simples: sem otimização, sem domínio pra liberar, sem imagem pesada.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tenant.logoUrl}
          alt={tenant.nome || 'Logo'}
          width={180}
          className="h-auto w-[180px] object-contain"
        />
      ) : (
        <span className="text-xl font-bold text-[var(--cor-destaque)]">
          {tenant.nome || tenant.slug}
        </span>
      )}

      {tenant.instagram ? (
        <a
          href={tenant.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-12 w-12 items-center justify-center rounded-full text-[var(--cor-destaque)] outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--cor-destaque)]"
        >
          <IconeInstagram className="h-7 w-7" />
        </a>
      ) : null}

      {tenant.linkEvento ? (
        <a
          href={tenant.linkEvento.url}
          className="flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--cor-botao)] px-5 font-semibold tracking-wide text-[var(--cor-texto-botao)] outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--cor-destaque)]"
        >
          {tenant.linkEvento.label}
        </a>
      ) : null}

      {tenant.unidades.map((u) => (
        <Acordeao key={u.slug} nome={u.nome || u.slug} slug={u.slug} />
      ))}
    </main>
  )
}
