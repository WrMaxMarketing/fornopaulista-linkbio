# forno-linkbio

Hub link-in-bio multi-tenant que serve de intermediário rastreável entre o link do
influenciador e o cardápio digital (Anota AI).

```
link divulgado (com UTM montada à mão)
  → /?utm_source=...     middleware guarda a UTM no cookie
  → /                    hub: escolhe unidade e ação (evento no GA4 do hub)
  → /go/{acao}/{unidade} 302 pro destino REPASSANDO a mesma UTM
  → cardápio Anota AI / Tuigo   (GA4 + Pixel de lá fecham até a compra)
```

O rastreio é todo por **UTM + GA4**. O projeto não tem banco de dados.

> **O código nunca inventa UTM.** Ele não cria, não completa e não renomeia
> parâmetro nenhum. As UTMs são montadas na mão ao gerar cada link. Quem entra
> pelo link cru da bio chega sem UTM e sai sem UTM — é o lead orgânico.

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

Por tenant: `nome`, `hosts`, `gaId` (`G-XXXXXXXXXX`), `fotoUrl`, `logoUrl`,
`faviconUrl`, `instagram`, `linkEvento` (opcional) e as 4 cores.
Por unidade: `slug` (vira o parâmetro `unidade` dos eventos do GA4 — minúsculo,
sem acento, underscore), `nome`, `urlCardapio`, `whatsapp` (`55DDDNÚMERO`, só
dígitos) e `maps`.

`gaId` vazio = o GA4 não é injetado. Unidade com `urlCardapio`/`whatsapp`/`maps` vazio
devolve 404 naquela ação (proposital: melhor 404 que mandar o cliente pro lugar errado).

Restaurante novo = novo objeto em `TENANTS`. Nenhuma outra linha de código muda.

## Imagens

Ficam em `public/imagens/{slug do tenant}/` — veja o README de lá.
`hero.png` (foto do topo), `logo.png` (fundo transparente) e `favicon.png` (quadrado).

## Como a UTM atravessa o hub

1. A pessoa abre `https://{host}/?utm_source=...&utm_medium=...` (o link que você montou).
2. `src/middleware.ts` lê os parâmetros de rastreio e grava no cookie `utm` (30 dias).
   Uma visita nova **com** UTM sobrescreve a anterior (last click, igual ao GA4);
   uma visita **sem** UTM não apaga nada, então recarregar a página ou voltar do
   cardápio não perde a campanha.
3. O clique em **Seu Pedido** passa por `/go/pedido/{unidade}`, que lê o cookie e
   repassa os mesmos parâmetros pro link do cardápio.

Repassados (`src/lib/utm.ts`): `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, `utm_term`, `utm_id`, `fbclid`, `gclid`, `ttclid`.
Qualquer outro parâmetro da URL de entrada é ignorado.

A query que o `urlCardapio` já tiver é preservada — `?f=msa` continua lá, as `utm_*`
entram depois. Se o link do cardápio já vier com uma `utm_*` fixa, a da campanha vence.

**WhatsApp e Localização não recebem UTM**: `wa.me` e `maps.app.goo.gl` descartam
querystring. Pedido por WhatsApp não tem como ser atribuído por parâmetro de URL.

## Montando os links de divulgação

Não existe rota especial: é a URL do hub com os parâmetros que você escolher.
Uma convenção que funciona bem no relatório de Aquisição do GA4:

| parâmetro      | o que colocar            | exemplo      |
| -------------- | ------------------------ | ------------ |
| `utm_source`   | rede social              | `instagram`  |
| `utm_medium`   | tipo de tráfego          | `influencer` |
| `utm_campaign` | campanha ou evento       | `natal_2026` |
| `utm_content`  | quem divulgou            | `maria`      |
| `utm_term`     | onde foi postado         | `stories`    |

```
https://{host}/?utm_source=instagram&utm_medium=influencer&utm_campaign=natal_2026&utm_content=maria&utm_term=stories
```

O código não valida nem depende dessa convenção — use a que preferir, desde que
seja a mesma em todos os links, senão o relatório fica picado.

## Eventos no GA4 do hub

A UTM só aparece no destino. Pra saber o meio do funil — quantos dos que entraram
clicaram em qual unidade — o hub dispara evento próprio no clique
(`src/app/_components/LinkRastreado.tsx`):

| evento               | parâmetro |
| -------------------- | --------- |
| `clique_pedido`      | `unidade` |
| `clique_whatsapp`    | `unidade` |
| `clique_localizacao` | `unidade` |
| `clique_evento`      | —         |

Sem `gaId` preenchido o `gtag` não existe e os eventos viram no-op.
Pra `unidade` aparecer nos relatórios, registre como **dimensão personalizada**
(escopo de evento) em Admin → Definições personalizadas do GA4.

## Deploy na Vercel

1. Suba o repositório e importe na Vercel. Não há env var para cadastrar.
2. O host da request é o que decide o tenant. `hosts` já traz `'*.vercel.app'`,
   que cobre a URL de produção e as de preview.
3. Ao apontar o domínio próprio, **adicione ele em `hosts`** — host que não casa com
   nenhum tenant devolve **404** (`src/middleware.ts`).
4. Divulgue `https://{host}/?utm_...` com os parâmetros da campanha.

O cookie `utm` é setado **sem atributo `domain`** — o hub e `/go` precisam estar no
mesmo host, senão a campanha se perde no caminho. Ele também é `Secure`: em `http://`
puro o navegador ignora, então teste sempre em HTTPS.

## GA4

O `gtag` é injetado no `layout.tsx` com `strategy="afterInteractive"`. O **linker
cross-domain não é feito em código**: adicione o domínio do cardápio na lista de
domínios vinculados do painel do GA4. Sem isso as UTMs continuam chegando no cardápio,
mas a sessão quebra na virada de domínio e a compra vira uma sessão nova.

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run typecheck`
