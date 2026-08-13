/** SVGs inline. Nenhuma biblioteca de ícones. */

type Props = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export function IconeInstagram({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconeChevron({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function IconeSacola({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

export function IconeWhatsapp({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 20.5 4.8 16A8 8 0 1 1 8 19.2l-4.5 1.3Z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.4 1-1v-.7l-1.8-.8-.8.9a5.6 5.6 0 0 1-2.3-2.3l.9-.8-.8-1.8H10c-.6 0-1 .4-1 1Z" />
    </svg>
  )
}

export function IconePin({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}
