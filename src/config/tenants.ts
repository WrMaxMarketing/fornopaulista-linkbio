/**
 * Arquivo ÚNICO com todos os dados variáveis do projeto.
 * Tudo que estiver marcado com `// PREENCHER` precisa ser trocado por dado real
 * antes de ir pro ar. Nada aqui é inventado.
 */

export type Acao = 'pedido' | 'whatsapp' | 'localizacao'

export const ACOES: Acao[] = ['pedido', 'whatsapp', 'localizacao']

export function isAcao(valor: string): valor is Acao {
  return (ACOES as string[]).includes(valor)
}

export type Unidade = {
  /** usado em utm_term. minúsculo, sem acento, underscore */
  slug: string
  nome: string
  /** URL do cardápio Anota AI (pode já ter query string — o merge é feito com URLSearchParams) */
  urlCardapio: string
  /** formato 55DDDNÚMERO, só dígitos */
  whatsapp: string
  /** link do Google Maps */
  maps: string
}

export type Tenant = {
  slug: string
  nome: string
  /** hosts que resolvem para este tenant (sem porta, minúsculo) */
  hosts: string[]
  /** vira utm_campaign */
  campanha: string
  /** G-XXXXXXXXXX — deixe vazio para não injetar o GA4 */
  gaId: string
  /** foto do topo (hero). Vertical, ~9:10. Vazio = hub abre direto no logo */
  fotoUrl: string
  /** logo em PNG/SVG com fundo transparente — fica sobreposto ao rodapé da foto */
  logoUrl: string
  /** favicon quadrado (a logo recortada em fundo branco). Vazio = cai no logoUrl */
  faviconUrl: string
  instagram: string
  linkEvento?: { label: string; url: string }
  cores: {
    fundo: string
    botao: string
    textoBotao: string
    destaque: string
  }
  unidades: Unidade[]
}

export const TENANTS: Tenant[] = [
  {
    slug: 'forno',
    nome: 'Forno Paulista', // nome lido do logo na referência — ajuste se for outro
    // O host da request decide o tenant. Sem o domínio aqui, o middleware devolve 404.
    // '*.vercel.app' cobre a URL de produção e as de preview, que mudam a cada deploy.
    // PREENCHER — acrescente o domínio próprio quando ele existir. ex: 'fornopaulista.com.br'
    hosts: ['localhost',
      '127.0.0.1',
      '*.vercel.app',
      'fornopaulista.wrmaxmarketing.com.br',],
    campanha: 'camp_teste', // PREENCHER — vira utm_campaign. ex: 'influencers_2026'
    gaId: '', // PREENCHER — G-XXXXXXXXXX (vazio = GA4 não é injetado)
    fotoUrl: '/imagens/forno/hero.png', // foto vertical do topo
    logoUrl: '/imagens/forno/logo.png', // logo PNG com fundo transparente
    faviconUrl: '/imagens/forno/favicon.png', // a logo em 512x512 sobre fundo branco
    instagram: 'https://instagram.com/exemplo', // PREENCHER — ex: 'https://instagram.com/...'
    // Some do hub enquanto a url estiver vazia.
    // vai direto pro WhatsApp de eventos (não passa pelo /go, então não entra no rastreio)
    linkEvento: { label: 'Marque Seu Evento', url: 'https://wa.me/558698194974' },
    cores: {
      // Amostradas da referência: fundo #7C180B, texto dos botões no mesmo tom.
      fundo: '#7B1113',
      botao: '#FFFFFF',
      textoBotao: '#7B1113', // na referência o texto é vinho, não dourado
      destaque: '#D4AF37', // usado no foco do teclado e no fallback sem logo
    },
    unidades: [
      // Nomes lidos da referência. Confirme os slugs antes de divulgar:
      // eles viram utm_term e não devem mudar depois que o link estiver no ar.
      {
        slug: 'hugo_napoleao',
        nome: 'Unidade Hugo Napoleão',
        urlCardapio: 'https://fornopaulista.tuigoapp.com.br/fornopaulistaleste/pedidos',
        whatsapp: '5586995709028',
        maps: 'https://maps.app.goo.gl/ULCJ1BwbcY5JpVh86',
      },
      {
        slug: 'dom_severino',
        nome: 'Unidade Dom Severino',
        urlCardapio: 'https://pedido.anota.ai/loja/forno-paulista-pizzaria-dom-severino-1',
        whatsapp: '558688652928',
        maps: 'https://maps.app.goo.gl/3Uw6vJfbenHqwrxB7',
      },
      {
        slug: 'dirceu',
        nome: 'Unidade Dirceu',
        urlCardapio: 'https://pedido.anota.ai/loja/forno-paulista-dirceu-4',
        whatsapp: '558681853000',
        maps: 'https://maps.app.goo.gl/GcuenyDuRwcSFLRQ6',
      },
      {
        slug: 'sul',
        nome: 'Unidade Sul',
        // o ?f=msa do link original é preservado: o redirect só acrescenta as utm_*
        urlCardapio: 'https://pedido.anota.ai/loja/forno-paulista-sul?f=msa',
        whatsapp: '558695428466',
        maps: 'https://maps.app.goo.gl/aeuYFQM3SX1TRvdV7',
      },
    ],
  },
  // Novos restaurantes = novo objeto Tenant aqui. Nada mais no código muda.
]

function normalizarHost(host: string): string {
  return host.trim().toLowerCase().split(':')[0]
}

/** Curinga: '*.vercel.app' casa com qualquer subdomínio de vercel.app. */
function casaCuringa(padrao: string, alvo: string): boolean {
  const p = normalizarHost(padrao)
  return p.startsWith('*.') && alvo.endsWith(p.slice(1))
}

export function getTenantByHost(host: string): Tenant | null {
  const alvo = normalizarHost(host)

  // Host exato sempre ganha do curinga de outro tenant.
  const exato = TENANTS.find((t) => t.hosts.some((h) => normalizarHost(h) === alvo))
  if (exato) return exato

  const curinga = TENANTS.find((t) => t.hosts.some((h) => casaCuringa(h, alvo)))
  if (curinga) return curinga

  // Em desenvolvimento, qualquer host cai no primeiro tenant (localhost, IP da rede, etc).
  if (process.env.NODE_ENV === 'development') return TENANTS[0] ?? null

  return null
}

export function getTenantBySlug(slug: string): Tenant | null {
  return TENANTS.find((t) => t.slug === slug) ?? null
}

export function getUnidade(tenant: Tenant, slug: string): Unidade | null {
  return tenant.unidades.find((u) => u.slug === slug) ?? null
}
