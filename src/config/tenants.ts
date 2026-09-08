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
      //
    gaId: 'G-NXMFFR4G7Y',
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
        maps: 'https://www.google.com/maps/place/Forno+Paulista/@-5.06519,-42.787799,16z/data=!3m1!4b1!4m6!3m5!1s0x78e3a3c78345553:0xca9c7335cfd363!8m2!3d-5.06519!4d-42.787799!16s%2Fg%2F11d_z3_8p4?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        slug: 'dom_severino',
        nome: 'Unidade Dom Severino',
        urlCardapio: 'https://fornopaulista.tuigoapp.com.br/fornopaulistadomseverino/pedidos',
        whatsapp: '558688652928',
        maps: 'https://www.google.com/maps/place/Forno+Paulista+Pizzaria/@-5.0969228,-42.7630444,15z/data=!4m6!3m5!1s0x78e3b39808088ef:0x4fc0086c05a369e3!8m2!3d-5.070361!4d-42.7760345!16s%2Fg%2F11vkrgfqrm?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        slug: 'dirceu',
        nome: 'Unidade Dirceu',
        urlCardapio: 'https://fornopaulista.tuigoapp.com.br/fornopaulistadirceu/pedidos',
        whatsapp: '558681853000',
        maps: 'https://www.google.com/maps/place/Forno+Paulista+Dirceu/@-5.0969229,-42.7527661,17z/data=!3m1!4b1!4m6!3m5!1s0x78e313ecc7ae9af:0xd982bf46e1177564!8m2!3d-5.0969229!4d-42.7527661!16s%2Fg%2F11ty1c_8q2?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        slug: 'sul',
        nome: 'Unidade Sul',
        urlCardapio: 'https://fornopaulista.tuigoapp.com.br/fornopaulistasul/pedidos',
        whatsapp: '558695428466',
        maps: 'https://www.google.com/maps/place/Forno+Paulista/@-5.1136613,-42.8046655,17z/data=!3m1!4b1!4m6!3m5!1s0x78e3732bca4db47:0x4fa293f77b1cb6fd!8m2!3d-5.1136613!4d-42.8046655!16s%2Fg%2F11sddzqccg?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D',
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
