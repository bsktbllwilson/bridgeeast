import { Lock } from 'lucide-react'
import Link from 'next/link'

import { type AppLocale } from '@/i18n/locales'
import { formatCurrency, formatNumber } from '@/lib/marketplace/format'
import { redactFinancials } from '@/lib/marketplace/nda'
import { type BusinessListing } from '@/lib/marketplace/types'

interface FinancialsPanelProps {
  listing: BusinessListing
  locale: AppLocale
  unlocked: boolean
  ndaCtaHref: string
  labels: {
    askingPrice: string
    grossRevenue: string
    cashFlow: string
    monthlyRent: string
    leaseRemaining: string
    monthsShort: string
    sqft: string
    employeesFt: string
    employeesPt: string
    notProvided: string
    ndaLockedTitle: string
    ndaLockedBody: string
    ndaCta: string
  }
}

export function FinancialsPanel({ listing, locale, unlocked, ndaCtaHref, labels }: FinancialsPanelProps) {
  if (!unlocked) {
    const redacted = redactFinancials(listing)
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-amber-100 p-3">
            <Lock className="h-5 w-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-950">{labels.ndaLockedTitle}</h3>
            <p className="mt-1 text-sm text-gray-700">{labels.ndaLockedBody}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <RedactedRow label={labels.askingPrice} value={redacted.priceRange} />
              <RedactedRow label={labels.grossRevenue} value={redacted.revenueRange} />
            </div>

            <Link href={ndaCtaHref} className="btn-primary mt-5 inline-block">
              {labels.ndaCta}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FinancialCell label={labels.askingPrice} value={formatCurrency(listing.asking_price, locale)} />
        <FinancialCell label={labels.grossRevenue} value={formatCurrency(listing.gross_revenue_annual, locale)} />
        <FinancialCell label={labels.cashFlow} value={formatCurrency(listing.cash_flow_annual, locale)} />
        <FinancialCell label={labels.monthlyRent} value={formatCurrency(listing.monthly_rent, locale)} />
        <FinancialCell
          label={labels.leaseRemaining}
          value={
            listing.lease_remaining_months != null
              ? `${formatNumber(listing.lease_remaining_months, locale)} ${labels.monthsShort}`
              : labels.notProvided
          }
        />
        <FinancialCell
          label={labels.sqft}
          value={listing.sqft != null ? formatNumber(listing.sqft, locale) : labels.notProvided}
        />
        <FinancialCell
          label={labels.employeesFt}
          value={listing.employees_ft != null ? formatNumber(listing.employees_ft, locale) : labels.notProvided}
        />
        <FinancialCell
          label={labels.employeesPt}
          value={listing.employees_pt != null ? formatNumber(listing.employees_pt, locale) : labels.notProvided}
        />
      </div>
    </div>
  )
}

function FinancialCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-950">{value}</p>
    </div>
  )
}

function RedactedRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-gray-700">{value}</p>
    </div>
  )
}
