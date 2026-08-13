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
  logoUrl: string
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
    nome: '', // PREENCHER — nome exibido/interno do restaurante
    hosts: [
      // PREENCHER — ex: 'fornopaulista.wrmaxmarketing.com.br'
      // Adicione também o domínio da Vercel se quiser testar antes do DNS apontar:
      // 'forno-linkbio.vercel.app'
    ],
    campanha: '', // PREENCHER — vira utm_campaign. ex: 'influencers_2026'
    gaId: '', // PREENCHER — G-XXXXXXXXXX (vazio = GA4 não é injetado)
    logoUrl: '', // PREENCHER — URL absoluta do logo (PNG/SVG, fundo transparente)
    instagram: '', // PREENCHER — ex: 'https://instagram.com/...'
    linkEvento: undefined, // PREENCHER (opcional) — { label: 'Reserve seu lugar', url: 'https://...' }
    cores: {
      fundo: '#7B1113', // default provisório
      botao: '#FFFFFF', // default provisório
      textoBotao: '#B8860B', // default provisório
      destaque: '#D4AF37', // default provisório
    },
    unidades: [
      {
        slug: 'unidade_1', // PREENCHER — minúsculo, sem acento, underscore. vai pro utm_term
        nome: '', // PREENCHER — ex: 'Unidade Paulista'
        urlCardapio: '', // PREENCHER — URL do cardápio Anota AI
        whatsapp: '', // PREENCHER — 55DDDNÚMERO, só dígitos
        maps: '', // PREENCHER — link do Google Maps
      },
      {
        slug: 'unidade_2', // PREENCHER
        nome: '', // PREENCHER
        urlCardapio: '', // PREENCHER
        whatsapp: '', // PREENCHER
        maps: '', // PREENCHER
      },
      // Duplique o bloco acima para cada unidade adicional.
    ],
  },
  // Novos restaurantes = novo objeto Tenant aqui. Nada mais no código muda.
]

function normalizarHost(host: string): string {
  return host.trim().toLowerCase().split(':')[0]
}

export function getTenantByHost(host: string): Tenant | null {
  const alvo = normalizarHost(host)

  const encontrado = TENANTS.find((t) => t.hosts.some((h) => normalizarHost(h) === alvo))
  if (encontrado) return encontrado

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
