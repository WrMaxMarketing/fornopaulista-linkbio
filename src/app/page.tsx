import { notFound } from 'next/navigation'
import { LinkRastreado } from './_components/LinkRastreado'
import { ListaUnidades, type ItemUnidade } from './_components/ListaUnidades'
import { PILL, PILL_TITULO } from './_components/Pill'
import { montarDestino, montarLinkEvento } from '@/lib/destino'
import { getTenantAtual } from '@/lib/tenant'
import { getUtmAtual } from '@/lib/utm-server'

export const dynamic = 'force-dynamic'

export default async function Hub() {
  const tenant = await getTenantAtual()
  if (!tenant) notFound()

  /*
    Os destinos finais são montados AQUI, no servidor, e entram direto no href.
    O gtag só decora o link com `_gl` (o que mantém a mesma sessão do GA4 no
    cardápio) quando o href já aponta pro domínio de saída — um href `/go/...`
    é do mesmo domínio, não é decorado, e o 302 não carrega o `_gl`.
  */
  const utm = await getUtmAtual()

  const unidades: ItemUnidade[] = tenant.unidades.map((u) => ({
    slug: u.slug,
    nome: u.nome || u.slug,
    hrefPedido: montarDestino(u, 'pedido', utm),
    hrefWhatsapp: montarDestino(u, 'whatsapp', utm),
    hrefLocalizacao: montarDestino(u, 'localizacao', utm),
  }))

  const hrefEvento = tenant.linkEvento?.url ? montarLinkEvento(tenant.linkEvento.url, utm) : null

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
        {hrefEvento && tenant.linkEvento ? (
          <LinkRastreado
            href={hrefEvento}
            className={`${PILL} ${PILL_TITULO}`}
            evento="clique_evento"
          >
            {tenant.linkEvento.label}
          </LinkRastreado>
        ) : null}

        <ListaUnidades unidades={unidades} logoUrl={tenant.logoUrl} />
      </main>
    </div>
  )
}
