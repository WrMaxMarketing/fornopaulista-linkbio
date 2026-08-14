import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // As imagens são servidas de public/. Usamos <img> simples no hub,
    // então nenhum domínio precisa ser liberado aqui.
    unoptimized: true,
  },
}

export default nextConfig
