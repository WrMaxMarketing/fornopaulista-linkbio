# forno-linkbio

Hub link-in-bio multi-tenant que serve de intermediário rastreável entre o link do
influenciador e o cardápio digital (Anota AI).

```
Instagram do influenciador
  → /i/{influenciador}   grava 'entrada', seta cookies ref+sid, 302 para /
  → /                    hub: escolhe unidade e ação
  → /go/{acao}/{unidade} grava 'saida', 302 para o destino com UTM injetada
  → cardápio Anota AI    (GA4 fecha o ciclo até a compra)
```

## Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind v4 · Supabase (supabase-js puro) · Vercel.
Sem ORM, sem lib de UI, sem localStorage/sessionStorage.

## Setup

1. `npm install`
2. Rode `supabase/schema.sql` no SQL Editor do Supabase.
3. Copie `.env.example` para `.env.local` e preencha:
   - `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` — **service_role**, só server. Nunca exponha no client.
   - `IP_SALT` — string aleatória longa; o IP nunca é gravado puro, só o sha256 com esse sal.
4. Preencha `src/config/tenants.ts` (é o único arquivo com dado variável — procure por `// PREENCHER`).
5. `npm run dev` → http://localhost:3000

Em `NODE_ENV=development` qualquer host cai no primeiro tenant, então localhost funciona
sem mexer em `hosts`.

## O que preencher em `src/config/tenants.ts`

Por tenant: `nome`, `hosts`, `campanha` (vira `utm_campaign`), `gaId` (`G-XXXXXXXXXX`),
`logoUrl`, `instagram`, `linkEvento` (opcional) e as 4 cores.
Por unidade: `slug` (vira `utm_term` — minúsculo, sem acento, underscore), `nome`,
`urlCardapio`, `whatsapp` (`55DDDNÚMERO`) e `maps`.

`gaId` vazio = o GA4 não é injetado. Unidade com `urlCardapio`/`whatsapp`/`maps` vazio
devolve 404 naquela ação (proposital: melhor 404 que mandar o cliente pro lugar errado).

Restaurante novo = novo objeto em `TENANTS`. Nenhuma outra linha de código muda.

## UTMs geradas em `/go/pedido/{unidade}`

| parâmetro      | valor                                    |
| -------------- | ---------------------------------------- |
| `utm_source`   | `instagram`                              |
| `utm_medium`   | `influencer`                             |
| `utm_campaign` | `tenant.campanha`                        |
| `utm_content`  | cookie `ref`, ou `organico` sem cookie   |
| `utm_term`     | `unidade.slug`                           |

A query que o `urlCardapio` já tiver é preservada (merge via `URL`/`URLSearchParams`).

## Deploy na Vercel

1. Suba o repositório e importe na Vercel.
2. Cadastre as 3 env vars em Production (e Preview, se for testar lá).
3. Aponte o domínio do tenant e adicione o host em `hosts`. Host que não estiver
   em nenhum tenant devolve **404**.
4. Divulgue `https://{host}/i/{influenciador}`.

Os cookies `ref` e `sid` são setados **sem atributo `domain`** — `/i`, o hub e `/go`
precisam estar no mesmo host, senão o `ref` se perde no caminho.

## GA4

O `gtag` é injetado no `layout.tsx` com `strategy="afterInteractive"`. O **linker
cross-domain não é feito em código**: adicione o domínio do cardápio na lista de
domínios vinculados do painel do GA4. Sem isso as UTMs continuam gravadas no Supabase,
mas a compra não é atribuída ao influenciador dentro do GA4.

## Bots e prefetch

`/i` e `/go` **não gravam evento** quando a request é prefetch (`purpose`, `sec-purpose`,
`x-middleware-prefetch`), preview de link ou crawler — o redirect acontece normalmente.
É o que impede o preview do WhatsApp/Instagram de inflar o relatório.

## Consultas úteis

```sql
-- cliques em cardápio por influenciador (últimos 30 dias)
select influenciador_slug, count(*) as saidas
from eventos
where tenant_slug = 'forno' and tipo = 'saida' and acao = 'pedido'
  and created_at > now() - interval '30 days'
group by 1 order by 2 desc;

-- funil entrada → saída
select tipo, count(*) from eventos
where tenant_slug = 'forno' group by 1;
```

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run typecheck`
