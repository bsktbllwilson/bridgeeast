export type PtpRoute = {
  href: string
  label: string
}

export function ptpRoute(path: string, locale: string) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${cleanPath}`
}

export function ptpHome(locale: string) {
  return `/${locale}`
}

export const ptpPrimaryNav: PtpRoute[] = [
  { href: '/buy', label: 'Buy Business' },
  { href: '/sell', label: 'Sell Business' },
  { href: '/playbook', label: 'Playbooks' },
  { href: '/who-we-are', label: 'Who We Are' },
]

export const ptpFooterColumns: { heading?: string; links: PtpRoute[] }[] = [
  {
    links: [
      { href: '/buy', label: 'Buy A Business' },
      { href: '/sell', label: 'Sell A Business' },
      { href: '/heatmap', label: 'Listing Heatmap' },
    ],
  },
  {
    links: [
      { href: '/playbook', label: 'Guides & Playbooks' },
      { href: '/data', label: 'Market Data' },
      { href: '/address-book', label: 'Address Book' },
      { href: '/tools', label: 'Tools & Calculator' },
    ],
  },
  {
    links: [
      { href: '/who-we-are', label: 'Who We Are' },
      { href: '/membership', label: 'Become A Member' },
      { href: '/partners', label: 'Become A Partner' },
      { href: '/faqs', label: 'FAQs' },
    ],
  },
]
