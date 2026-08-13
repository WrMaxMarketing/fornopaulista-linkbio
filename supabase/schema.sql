-- Rodar no SQL Editor do Supabase, uma vez por projeto.

create table tenants (
  slug text primary key,
  nome text not null,
  created_at timestamptz default now()
);

create table influenciadores (
  id uuid primary key default gen_random_uuid(),
  tenant_slug text not null references tenants(slug),
  slug text not null,              -- vira utm_content
  nome text,
  handle text,
  ativo boolean default true,
  created_at timestamptz default now(),
  unique (tenant_slug, slug)
);

create table eventos (
  id uuid primary key default gen_random_uuid(),
  tenant_slug text not null,
  tipo text not null check (tipo in ('entrada','saida')),
  influenciador_slug text,
  unidade_slug text,
  acao text,
  session_id text,
  user_agent text,
  ip_hash text,
  referer text,
  created_at timestamptz default now()
);

create index eventos_lookup on eventos (tenant_slug, tipo, created_at desc);
create index eventos_influ on eventos (tenant_slug, influenciador_slug, created_at desc);

alter table eventos enable row level security;
-- sem policy pública: escrita só via service_role no server
