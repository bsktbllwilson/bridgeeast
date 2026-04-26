import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
