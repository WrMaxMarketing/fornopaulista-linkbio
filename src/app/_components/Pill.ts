/**
 * Classes compartilhadas dos pills brancos do hub.
 * Medidas tiradas da referência: altura 48px, raio 14px, texto serifado centralizado,
 * ícone/chevron posicionados em absolute para não deslocar o centro do texto.
 */
export const PILL =
  'relative flex min-h-[48px] w-full items-center justify-center rounded-[var(--radius-pill)] bg-[var(--cor-botao)] px-12 text-center leading-tight text-[var(--cor-texto-botao)] outline-offset-2 transition-transform duration-150 ease-out active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-[var(--cor-destaque)]'

/** Rótulos das ações: menores e em peso normal. */
export const PILL_TEXTO = 'text-[15px]'

/** Cabeçalho da unidade e link de evento: maiores e em negrito. */
export const PILL_TITULO = 'text-[17px] font-bold'

/** Ícone à esquerda / chevron à direita. */
export const PILL_ICONE_ESQ = 'absolute left-4 h-[22px] w-[22px]'
export const PILL_ICONE_DIR = 'absolute right-4 h-[22px] w-[22px]'

/**
 * Logo no lugar do ícone (linha "Seu Pedido"). Caixa maior que a dos ícones
 * porque o PNG da logo tem margem transparente em volta da arte.
 */
export const PILL_LOGO_ESQ = 'absolute left-3 h-[30px] w-[30px] object-contain'
