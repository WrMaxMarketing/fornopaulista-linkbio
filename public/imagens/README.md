# Imagens do hub

Uma subpasta por `slug` de tenant (o mesmo `slug` que está em `src/config/tenants.ts`).

```
public/imagens/
  forno/
    hero.png   <- foto do topo. Vertical, ~4:5. Hoje: 1122x1402
    logo.png   <- logo com fundo transparente (PNG RGBA). Hoje: 1200x1200
```

Tudo que está em `public/` é servido na raiz do site, então o caminho usado
em `tenants.ts` é sem o `public`:

```ts
fotoUrl: '/imagens/forno/hero.png',
logoUrl: '/imagens/forno/logo.png',
```

Trocar a imagem = sobrescrever o arquivo mantendo o mesmo nome. Se mudar o nome,
ajuste o caminho no `tenants.ts` junto.

Deixar `fotoUrl` vazio faz o hub abrir direto no logo, sem a foto do topo.
