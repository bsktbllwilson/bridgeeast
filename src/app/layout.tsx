import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { AnalyticsProviders } from '@/components/AnalyticsProviders'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://passtheplate.store'
const DEFAULT_TITLE =
  'Pass The Plate — The Marketplace for the $240B Asian F&B Transition'
const DEFAULT_DESCRIPTION =
  'Buy or sell Asian restaurants, cafés, and food businesses across the U.S. — vetted listings, bilingual partners, success-fee-only.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Pass The Plate',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: 'Pass The Plate',
  keywords: [
    'Asian restaurant for sale',
    'Asian F&B marketplace',
    'restaurant acquisition',
    'restaurant transition',
    'business broker',
    'SBA loan',
    'restaurant valuation',
  ],
  authors: [{ name: 'Pass The Plate' }],
  creator: 'Pass The Plate',
  publisher: 'Pass The Plate',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'Pass The Plate',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Pass The Plate — Asian F&B Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/api/og'],
    creator: '@passtheplate',
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
}

export const viewport: Viewport = {
  themeColor: '#FAF7EE',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Adobe Typekit — kit must allow passtheplate.store in its domain list */}
        <link rel="stylesheet" href="https://use.typekit.net/cub1hgl.css" />
      </head>
      <body className={`${playfair.variable} ${dmSans.variable} font-sans antialiased`}>
        {children}
        <AnalyticsProviders />
      </body>
    </html>
  )
}
