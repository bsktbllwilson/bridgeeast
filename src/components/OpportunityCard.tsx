type Zone = {
  neighborhood: string
  whyMatch: string
  avgRent: string
  confidence: number
}

const colors = ['border-emerald-400', 'border-blue-400', 'border-violet-400']
const badges = ['Top Pick', 'Strong Fit', 'Worth Considering']

export function OpportunityCard({ zone, index }: { zone: Zone; index: number }) {
  const colorClass = colors[index] || colors[colors.length - 1]
  const badgeLabel = badges[index] || badges[badges.length - 1]

  return (
    <div className={`space-y-3 rounded-xl border-l-4 ${colorClass} bg-white p-6 shadow-md`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">{zone.neighborhood}</h2>
        <span className="text-sm font-medium text-gray-500">{badgeLabel}</span>
      </div>

      <p className="text-sm leading-relaxed text-gray-600">{zone.whyMatch}</p>

      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Avg Rent</p>
          <p className="text-sm font-semibold text-gray-800">{zone.avgRent}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-gray-400">Match Score</p>
          <p className="text-sm font-semibold text-emerald-600">{zone.confidence}/10</p>
        </div>
      </div>
    </div>
  )
}

export type { Zone }