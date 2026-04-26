import type { Metadata } from 'next'
import './globals.css'

import { Footer } from '@/components/marketing/footer'
import { Header } from '@/components/marketing/header'

export const metadata: Metadata = {
  title: 'Pass The Plate',
  description: 'Marketplace for Asian F&B business sales.',
  metadataBase: new URL('https://passtheplate.store'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/cub1hgl.css" />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
