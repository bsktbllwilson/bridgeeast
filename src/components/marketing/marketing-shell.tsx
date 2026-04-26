import { BuySellSplit } from './buy-sell-split'
import { FindYourNextBigDeal } from './find-your-next-big-deal'

// Wraps marketing/marketplace pages with the Buy/Sell split block and the
// "Find Your Next Big Deal" CTA banner before the global footer. Pages
// that shouldn't render those bottom blocks (e.g. /sign-in, /debug/*)
// should NOT use this shell.
export function MarketingShell({
  children,
  cta = true,
  split = true,
}: {
  children: React.ReactNode
  cta?: boolean
  split?: boolean
}) {
  return (
    <>
      {children}
      {cta ? <FindYourNextBigDeal /> : null}
      {split ? <BuySellSplit /> : null}
    </>
  )
}
