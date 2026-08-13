import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // logoUrl vem do config do tenant (CDN/Supabase Storage/etc).
    // Usamos <img> simples no hub, então nenhum domínio precisa ser liberado aqui.
    unoptimized: true,
  },
}

export default nextConfig
