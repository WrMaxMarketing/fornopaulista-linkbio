import type { Metadata } from 'next'
import Script from 'next/script'
import { coresComoCssVars, getTenantAtual } from '@/lib/tenant'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantAtual()
  return {
    title: tenant?.nome || 'Link in bio',
    description: tenant?.nome ? `Peça no ${tenant.nome}` : undefined,
    robots: { index: false, follow: false },
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getTenantAtual()

  return (
    <html lang="pt-BR">
      <body
        style={tenant ? coresComoCssVars(tenant) : undefined}
        className="min-h-dvh bg-[var(--cor-fundo,#111111)] text-[var(--cor-botao,#ffffff)]"
      >
        {children}

        {tenant?.gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${tenant.gaId}`}
              strategy="afterInteractive"
            />
            {/* Sem linker no código: o cross-domain com o cardápio é configurado no painel do GA4. */}
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${tenant.gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  )
}
