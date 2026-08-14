/** SVGs inline. Nenhuma biblioteca de ícones. Todos herdam a cor via currentColor. */

type Props = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export function IconeChevron({ className }: Props) {
  return (
    <svg {...base} className={className} strokeWidth={1.8}>
      <polyline points="6 9.5 12 15.5 18 9.5" />
    </svg>
  )
}

/**
 * Balão do WhatsApp preenchido com o fone vazado — o desenho da marca.
 * O fone é vazado na cor do pill (`--cor-botao`), então funciona em qualquer tema.
 */
export function IconeWhatsapp({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M12 2.1a9.7 9.7 0 0 0-8.3 14.7l-1.5 5.1 5.3-1.4A9.7 9.7 0 1 0 12 2.1Z"
      />
      <path
        fill="var(--cor-botao, #ffffff)"
        d="M9.05 7.05c-.2-.45-.4-.46-.6-.47h-.5c-.18 0-.46.06-.7.33-.24.26-.92.9-.92 2.18 0 1.29.94 2.53 1.07 2.7.13.18 1.82 2.9 4.48 3.96 2.22.87 2.67.7 3.15.66.48-.05 1.55-.63 1.77-1.24.22-.61.22-1.14.15-1.25-.06-.1-.24-.17-.5-.3-.27-.13-1.56-.77-1.8-.86-.24-.09-.42-.13-.6.13-.17.26-.68.86-.83 1.04-.16.17-.31.2-.57.07-.27-.14-1.11-.41-2.12-1.31-.78-.7-1.31-1.56-1.47-1.82-.15-.26-.01-.4.12-.53.12-.12.26-.31.4-.46.13-.16.17-.27.26-.45.09-.17.04-.33-.02-.46-.07-.13-.58-1.42-.81-1.94Z"
      />
    </svg>
  )
}

/** Pin de mapa preenchido, com o furo do centro vazado. */
export function IconePin({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.2a7.4 7.4 0 0 0-7.4 7.4c0 2.4 1.3 4.9 2.8 6.9a26 26 0 0 0 4.1 4.3c.3.2.7.2 1 0a26 26 0 0 0 4.1-4.3c1.5-2 2.8-4.5 2.8-6.9A7.4 7.4 0 0 0 12 2.2Zm0 10.2a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Z"
      />
    </svg>
  )
}
