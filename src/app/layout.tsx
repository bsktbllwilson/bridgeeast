import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
})

export const metadata: Metadata = {
  title: 'BridgeEast - Guide for Asian F&B U.S. Market Entry',
  description: 'Market intelligence, guides, and vetted partners for Asian food & beverage brands planning U.S. market entry. Free access to rent data, foot traffic analysis, and expert resources.',
  keywords: ['restaurant market entry', 'Asian food business', 'restaurant expansion', 'food & beverage', 'market data', 'restaurant guides', 'commercial real estate'],
  authors: [{ name: 'BridgeEast' }],
  creator: 'BridgeEast',
  publisher: 'BridgeEast',
  openGraph: {
    title: 'BridgeEast - Guide for Asian F&B U.S. Market Entry',
    description: 'Market intelligence, guides, and vetted partners for Asian food & beverage brands planning U.S. market entry.',
    type: 'website',
    locale: 'en_US',
    siteName: 'BridgeEast',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BridgeEast - Guide for Asian F&B U.S. Market Entry',
    description: 'Market intelligence, guides, and vetted partners for Asian food & beverage brands planning U.S. market entry.',
    creator: '@BridgeEast',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
