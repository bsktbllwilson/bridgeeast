import { PtpFooter } from '@/components/ptp/PtpFooter'
import { PtpHeader } from '@/components/ptp/PtpHeader'

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="ptp-shell">
      <PtpHeader />
      <main>{children}</main>
      <PtpFooter />
    </div>
  )
}
