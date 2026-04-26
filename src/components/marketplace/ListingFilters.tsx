'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState, useTransition } from 'react'

import { filtersToSearchParams, parseFiltersFromSearchParams, parseSortFromSearchParams } from '@/lib/marketplace/filters'
import {
  BUSINESS_TYPES,
  CUISINE_TYPES,
  type BusinessType,
  type CuisineType,
  type ListingFilters as Filters,
  type ListingSort,
} from '@/lib/marketplace/types'

interface ListingFiltersProps {
  basePath: string
  totalResults: number
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

export function ListingFilters({ basePath, totalResults }: ListingFiltersProps) {
  const t = useTranslations('marketplace.filters')
  const cuisineT = useTranslations('marketplace.cuisines')
  const typeT = useTranslations('marketplace.businessTypes')
  const browseT = useTranslations('marketplace.browse')
  const router = useRouter()
  const params = useSearchParams()
  const [, startTransition] = useTransition()

  const initialFilters = useMemo(
    () => parseFiltersFromSearchParams(params ?? new URLSearchParams()),
    [params],
  )
  const initialSort = useMemo(
    () => parseSortFromSearchParams(params ?? new URLSearchParams()),
    [params],
  )

  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [sort, setSort] = useState<ListingSort>(initialSort)

  const pushFilters = useCallback(
    (next: Filters, nextSort: ListingSort) => {
      const search = filtersToSearchParams(next, nextSort)
      startTransition(() => {
        router.push(search.toString() ? `${basePath}?${search.toString()}` : basePath)
      })
    },
    [basePath, router],
  )

  const update = (next: Filters) => {
    setFilters(next)
    pushFilters(next, sort)
  }

  const updateSort = (nextSort: ListingSort) => {
    setSort(nextSort)
    pushFilters(filters, nextSort)
  }

  const toggleArrayValue = <T extends string>(key: keyof Filters, value: T) => {
    const current = (filters[key] as T[] | undefined) ?? []
    const next = current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value]
    update({ ...filters, [key]: next.length ? next : undefined })
  }

  const clearAll = () => update({})

  return (
    <aside className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">
          {browseT('resultsCount', { count: totalResults })}
        </p>
        <button onClick={clearAll} type="button" className="text-xs font-semibold text-accent hover:text-accent-dark">
          {t('clear')}
        </button>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          {browseT('sortBy')}
        </label>
        <select
          value={sort}
          onChange={(event) => updateSort(event.target.value as ListingSort)}
          className="w-full"
        >
          <option value="newest">{browseT('sortNewest')}</option>
          <option value="price_low">{browseT('sortPriceLow')}</option>
          <option value="price_high">{browseT('sortPriceHigh')}</option>
          <option value="revenue_high">{browseT('sortRevenueHigh')}</option>
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{t('cuisine')}</p>
        <div className="flex flex-wrap gap-2">
          {CUISINE_TYPES.map((cuisine) => {
            const active = (filters.cuisine_types ?? []).includes(cuisine)
            return (
              <button
                key={cuisine}
                type="button"
                onClick={() => toggleArrayValue<CuisineType>('cuisine_types', cuisine)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? 'border-accent bg-accent text-white'
                    : 'border-gray-300 text-gray-700 hover:border-accent hover:text-accent'
                }`}
              >
                {cuisineT(cuisine)}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{t('businessType')}</p>
        <div className="flex flex-wrap gap-2">
          {BUSINESS_TYPES.map((type) => {
            const active = (filters.business_types ?? []).includes(type)
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleArrayValue<BusinessType>('business_types', type)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? 'border-accent bg-accent text-white'
                    : 'border-gray-300 text-gray-700 hover:border-accent hover:text-accent'
                }`}
              >
                {typeT(type)}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          {t('state')}
        </label>
        <select
          value={(filters.states && filters.states[0]) ?? ''}
          onChange={(event) =>
            update({ ...filters, states: event.target.value ? [event.target.value] : undefined })
          }
          className="w-full"
        >
          <option value="">{t('anyState')}</option>
          {US_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          {t('priceRange')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={t('noMin')}
            value={filters.price_min ?? ''}
            onChange={(event) =>
              update({
                ...filters,
                price_min: event.target.value ? Number(event.target.value) : undefined,
              })
            }
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder={t('noMax')}
            value={filters.price_max ?? ''}
            onChange={(event) =>
              update({
                ...filters,
                price_max: event.target.value ? Number(event.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          {t('revenueMin')}
        </label>
        <input
          type="number"
          inputMode="numeric"
          placeholder={t('noMin')}
          value={filters.revenue_min ?? ''}
          onChange={(event) =>
            update({ ...filters, revenue_min: event.target.value ? Number(event.target.value) : undefined })
          }
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.visa_eb5 === true}
            onChange={(event) => update({ ...filters, visa_eb5: event.target.checked || undefined })}
          />
          {t('visaEb5')}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.visa_e2 === true}
            onChange={(event) => update({ ...filters, visa_e2: event.target.checked || undefined })}
          />
          {t('visaE2')}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.sba === true}
            onChange={(event) => update({ ...filters, sba: event.target.checked || undefined })}
          />
          {t('sba')}
        </label>
      </div>
    </aside>
  )
}
