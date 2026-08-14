# forno-linkbio

Hub link-in-bio multi-tenant que serve de intermediário rastreável entre o link do
influenciador e o cardápio digital (Anota AI).

```
Instagram do influenciador
  → /i/{influenciador}   seta cookies ref+sid, 302 para /
  → /                    hub: escolhe unidade e ação
  → /go/{acao}/{unidade} 302 para o destino com UTM injetada
  → cardápio Anota AI    (GA4 fecha o ciclo até a compra)
```

O rastreio é todo por **UTM + GA4**. O projeto não tem banco de dados.

## Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind v4 · Vercel.
Sem ORM, sem banco, sem lib de UI, sem localStorage/sessionStorage.

## Setup

1. `npm install`
2. Preencha `src/config/tenants.ts` (é o único arquivo com dado variável — procure por `// PREENCHER`).
3. `npm run dev` → http://localhost:3000

Não há env vars: o `.env.example` está vazio de propósito.
Em `NODE_ENV=development` qualquer host cai no primeiro tenant, então localhost funciona
sem mexer em `hosts`.

## O que preencher em `src/config/tenants.ts`

Por tenant: `nome`, `hosts`, `campanha` (vira `utm_campaign`), `gaId` (`G-XXXXXXXXXX`),
`fotoUrl`, `logoUrl`, `faviconUrl`, `instagram`, `linkEvento` (opcional) e as 4 cores.
Por unidade: `slug` (vira `utm_term` — minúsculo, sem acento, underscore), `nome`,
`urlCardapio`, `whatsapp` (`55DDDNÚMERO`, só dígitos) e `maps`.

`gaId` vazio = o GA4 não é injetado. Unidade com `urlCardapio`/`whatsapp`/`maps` vazio
devolve 404 naquela ação (proposital: melhor 404 que mandar o cliente pro lugar errado).

Restaurante novo = novo objeto em `TENANTS`. Nenhuma outra linha de código muda.

## Imagens

Ficam em `public/imagens/{slug do tenant}/` — veja o README de lá.
`hero.png` (foto do topo), `logo.png` (fundo transparente) e `favicon.png` (quadrado).

## UTMs geradas em `/go/pedido/{unidade}`

| parâmetro      | valor                                    |
| -------------- | ---------------------------------------- |
| `utm_source`   | `instagram`                              |
| `utm_medium`   | `influencer`                             |
| `utm_campaign` | `tenant.campanha`                        |
| `utm_content`  | cookie `ref`, ou `organico` sem cookie   |
| `utm_term`     | `unidade.slug`                           |

A query que o `urlCardapio` já tiver é preservada (merge via `URL`/`URLSearchParams`).

Em `/go/whatsapp/{unidade}` o `ref` não vira UTM (o `wa.me` descarta querystring):
ele entra no **texto** da mensagem — `Oi! Vim pelo @fulano e quero fazer um pedido`.
Em `/go/localizacao/{unidade}` o link do Maps vai limpo, sem parâmetro nenhum.

## Deploy na Vercel

1. Suba o repositório e importe na Vercel. Não há env var para cadastrar.
2. O host da request é o que decide o tenant. `hosts` já traz `'*.vercel.app'`,
   que cobre a URL de produção e as de preview.
3. Ao apontar o domínio próprio, **adicione ele em `hosts`** — host que não casa com
   nenhum tenant devolve **404** (`src/middleware.ts`).
4. Divulgue `https://{host}/i/{influenciador}`.

Os cookies `ref` e `sid` são setados **sem atributo `domain`** — `/i`, o hub e `/go`
precisam estar no mesmo host, senão o `ref` se perde no caminho.

## GA4

O `gtag` é injetado no `layout.tsx` com `strategy="afterInteractive"`. O **linker
cross-domain não é feito em código**: adicione o domínio do cardápio na lista de
domínios vinculados do painel do GA4. Sem isso as UTMs continuam chegando no cardápio,
mas a compra não é atribuída ao influenciador dentro do GA4.

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run typecheck`
