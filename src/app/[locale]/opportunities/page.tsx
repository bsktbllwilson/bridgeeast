'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { OpportunityCard, type Zone } from '@/components/OpportunityCard'

type OpportunitiesResponse = {
  opportunities?: Zone[]
  error?: string
}

function parseZonesPayload(payload: unknown): Zone[] {
  if (Array.isArray(payload)) {
    return payload as Zone[]
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as OpportunitiesResponse).opportunities)) {
    return (payload as OpportunitiesResponse).opportunities as Zone[]
  }

  return []
}

export default function OpportunitiesPage() {
  const t = useTranslations('opportunities')
  const [businessType, setBusinessType] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [zones, setZones] = useState<Zone[]>([])
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setZones([])
    setError('')
    setStreaming(true)

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType,
          budgetMin: Number(budgetMin),
          budgetMax: Number(budgetMax),
        }),
      })

      const contentType = res.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        const payload = (await res.json()) as OpportunitiesResponse | Zone[]

        if (!res.ok) {
          throw new Error(
            (payload as OpportunitiesResponse).error || t('errorGeneric'),
          )
        }

        const parsedZones = parseZonesPayload(payload)

        if (!parsedZones.length) {
          throw new Error(t('errorNoResults'))
        }

        setZones(parsedZones)
        return
      }

      if (!res.body) {
        throw new Error(t('errorNoStream'))
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })

        try {
          const parsedZones = parseZonesPayload(JSON.parse(accumulated.trim()))
          if (parsedZones.length) {
            setZones(parsedZones)
          }
        } catch {
          // Ignore partial chunks until a complete JSON payload is available.
        }
      }

      if (!zones.length && accumulated.trim()) {
        const parsedZones = parseZonesPayload(JSON.parse(accumulated.trim()))
        if (!parsedZones.length) {
          throw new Error(t('errorNoResults'))
        }
        setZones(parsedZones)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'))
    } finally {
      setStreaming(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-2xl space-y-10">
          <div>
            <h1 className="heading-hero">{t('title')}</h1>
            <p className="text-lead mt-3">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('businessTypeLabel')}</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder={t('businessTypePlaceholder')}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t('budgetMinLabel')}</label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="5000"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t('budgetMaxLabel')}</label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="15000"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={streaming}
              className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
            >
              {streaming ? t('submitStreaming') : t('submitIdle')}
            </button>
          </form>

          {streaming && zones.length === 0 && (
            <div className="animate-pulse text-center text-sm text-gray-400">{t('analyzingHint')}</div>
          )}

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          {zones.length > 0 && (
            <div className="space-y-4">
              <h2 className="heading-subsection">{t('resultsTitle')}</h2>
              {zones.map((zone, i) => (
                <OpportunityCard key={`${zone.neighborhood}-${i}`} zone={zone} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}