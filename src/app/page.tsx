import { BuySellSplit } from '@/components/marketing/buy-sell-split'
import { FindYourNextBigDeal } from '@/components/marketing/find-your-next-big-deal'
import { Hero } from '@/components/marketing/hero'
import { LogosStrip } from '@/components/marketing/logos-strip'
import { StatsBand } from '@/components/marketing/stats-band'
import { TrendingHotspots } from '@/components/marketing/trending-hotspots'
import { ValueProps } from '@/components/marketing/value-props'

export default function Home() {
  return (
    <>
      <Hero />
      <TrendingHotspots />
      <ValueProps />
      <BuySellSplit />
      <StatsBand />
      <LogosStrip />
      <FindYourNextBigDeal />
    </>
  )
}
