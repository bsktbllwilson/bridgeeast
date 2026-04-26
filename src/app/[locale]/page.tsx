import { SiteHeader } from '@/components/landing/SiteHeader'
import { Hero } from '@/components/landing/Hero'
import { TrendingHotspots } from '@/components/landing/TrendingHotspots'
import { OurPlatesAreFull } from '@/components/landing/OurPlatesAreFull'
import { BuySellSplit } from '@/components/landing/BuySellSplit'
import { StatsBand } from '@/components/landing/StatsBand'
import { PartnerLogos } from '@/components/landing/PartnerLogos'
import { Subscribe } from '@/components/landing/Subscribe'
import { SiteFooter } from '@/components/landing/SiteFooter'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <SiteHeader />
      <Hero />
      <TrendingHotspots />
      <OurPlatesAreFull />
      <BuySellSplit />
      <StatsBand />
      <PartnerLogos />
      <Subscribe />
      <SiteFooter />
    </main>
  )
}
