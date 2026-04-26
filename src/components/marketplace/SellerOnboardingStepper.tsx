'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import {
  BUSINESS_TYPES,
  CUISINE_TYPES,
  type BusinessType,
  type CuisineType,
} from '@/lib/marketplace/types'

const STEPS = ['basics', 'location', 'financials', 'story', 'eligibility', 'review'] as const
type StepId = (typeof STEPS)[number]

interface FormState {
  title: string
  title_zh: string
  description: string
  description_zh: string
  cuisine_type: CuisineType | ''
  business_type: BusinessType | ''
  city: string
  neighborhood: string
  state: string
  zip_code: string
  asking_price: string
  gross_revenue_annual: string
  cash_flow_annual: string
  monthly_rent: string
  lease_remaining_months: string
  lease_renewal_options: string
  sqft: string
  employees_ft: string
  employees_pt: string
  equipment: string
  reason_for_sale: string
  seller_notes: string
  visa_eligible_eb5: boolean
  visa_eligible_e2: boolean
  sba_prequalified: boolean
}

const EMPTY_STATE: FormState = {
  title: '',
  title_zh: '',
  description: '',
  description_zh: '',
  cuisine_type: '',
  business_type: '',
  city: '',
  neighborhood: '',
  state: '',
  zip_code: '',
  asking_price: '',
  gross_revenue_annual: '',
  cash_flow_annual: '',
  monthly_rent: '',
  lease_remaining_months: '',
  lease_renewal_options: '',
  sqft: '',
  employees_ft: '',
  employees_pt: '',
  equipment: '',
  reason_for_sale: '',
  seller_notes: '',
  visa_eligible_eb5: false,
  visa_eligible_e2: false,
  sba_prequalified: false,
}

export function SellerOnboardingStepper() {
  const stepT = useTranslations('marketplace.newListing.steps')
  const fieldT = useTranslations('marketplace.newListing.fields')
  const labelT = useTranslations('marketplace.newListing')
  const cuisineT = useTranslations('marketplace.cuisines')
  const typeT = useTranslations('marketplace.businessTypes')
  const filterT = useTranslations('marketplace.filters')

  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState<FormState>(EMPTY_STATE)
  const [submitted, setSubmitted] = useState<'draft' | 'review' | null>(null)

  const stepId: StepId = STEPS[stepIndex]
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const next = () => setStepIndex((index) => Math.min(index + 1, STEPS.length - 1))
  const back = () => setStepIndex((index) => Math.max(index - 1, 0))

  const submit = (mode: 'draft' | 'review') => {
    // Wiring to /api/ptp/listings happens in a follow-up; for now we surface the submitted state.
    setSubmitted(mode)
  }

  return (
    <div className="space-y-8">
      <ol className="flex flex-wrap gap-2 text-sm">
        {STEPS.map((id, index) => (
          <li
            key={id}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${
              index === stepIndex
                ? 'border-accent bg-accent text-white'
                : index < stepIndex
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-gray-300 text-gray-600'
            }`}
          >
            <span className="text-xs font-bold">{index + 1}</span>
            <span className="font-semibold">{stepT(id)}</span>
          </li>
        ))}
      </ol>

      {submitted ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
          <p className="text-lg font-bold">
            {submitted === 'review' ? 'Submitted for review.' : 'Saved as draft.'}
          </p>
          <p className="mt-2 text-sm">
            Once the API is wired, this draft will be persisted to <code>ptp_business_listings</code>.
          </p>
        </div>
      ) : (
        <div className="card p-6">
          {stepId === 'basics' && (
            <div className="space-y-4">
              <Field label={fieldT('titleEn')}>
                <input value={form.title} onChange={(event) => update('title', event.target.value)} required />
              </Field>
              <Field label={fieldT('titleZh')}>
                <input value={form.title_zh} onChange={(event) => update('title_zh', event.target.value)} />
              </Field>
              <Field label={fieldT('descriptionEn')}>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => update('description', event.target.value)}
                  required
                />
              </Field>
              <Field label={fieldT('descriptionZh')}>
                <textarea
                  rows={4}
                  value={form.description_zh}
                  onChange={(event) => update('description_zh', event.target.value)}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={filterT('cuisine')}>
                  <select
                    value={form.cuisine_type}
                    onChange={(event) => update('cuisine_type', event.target.value as CuisineType)}
                  >
                    <option value="">{filterT('anyCuisine')}</option>
                    {CUISINE_TYPES.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisineT(cuisine)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={filterT('businessType')}>
                  <select
                    value={form.business_type}
                    onChange={(event) => update('business_type', event.target.value as BusinessType)}
                  >
                    <option value="">{filterT('anyType')}</option>
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {typeT(type)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {stepId === 'location' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City"><input value={form.city} onChange={(event) => update('city', event.target.value)} required /></Field>
              <Field label="Neighborhood"><input value={form.neighborhood} onChange={(event) => update('neighborhood', event.target.value)} /></Field>
              <Field label="State"><input value={form.state} onChange={(event) => update('state', event.target.value.toUpperCase())} maxLength={2} required /></Field>
              <Field label="ZIP"><input value={form.zip_code} onChange={(event) => update('zip_code', event.target.value)} /></Field>
            </div>
          )}

          {stepId === 'financials' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={fieldT('askingPrice')}>
                <input type="number" inputMode="numeric" value={form.asking_price} onChange={(event) => update('asking_price', event.target.value)} />
              </Field>
              <Field label={fieldT('grossRevenue')}>
                <input type="number" inputMode="numeric" value={form.gross_revenue_annual} onChange={(event) => update('gross_revenue_annual', event.target.value)} />
              </Field>
              <Field label={fieldT('cashFlow')}>
                <input type="number" inputMode="numeric" value={form.cash_flow_annual} onChange={(event) => update('cash_flow_annual', event.target.value)} />
              </Field>
              <Field label={fieldT('monthlyRent')}>
                <input type="number" inputMode="numeric" value={form.monthly_rent} onChange={(event) => update('monthly_rent', event.target.value)} />
              </Field>
              <Field label={fieldT('leaseRemaining')}>
                <input type="number" inputMode="numeric" value={form.lease_remaining_months} onChange={(event) => update('lease_remaining_months', event.target.value)} />
              </Field>
              <Field label={fieldT('renewalOptions')}>
                <input value={form.lease_renewal_options} onChange={(event) => update('lease_renewal_options', event.target.value)} />
              </Field>
              <Field label={fieldT('sqft')}>
                <input type="number" inputMode="numeric" value={form.sqft} onChange={(event) => update('sqft', event.target.value)} />
              </Field>
              <Field label={fieldT('employeesFt')}>
                <input type="number" inputMode="numeric" value={form.employees_ft} onChange={(event) => update('employees_ft', event.target.value)} />
              </Field>
              <Field label={fieldT('employeesPt')}>
                <input type="number" inputMode="numeric" value={form.employees_pt} onChange={(event) => update('employees_pt', event.target.value)} />
              </Field>
            </div>
          )}

          {stepId === 'story' && (
            <div className="space-y-4">
              <Field label={fieldT('equipment')}>
                <textarea rows={4} value={form.equipment} onChange={(event) => update('equipment', event.target.value)} />
              </Field>
              <Field label={fieldT('reasonForSale')}>
                <textarea rows={3} value={form.reason_for_sale} onChange={(event) => update('reason_for_sale', event.target.value)} />
              </Field>
              <Field label={fieldT('sellerNotes')}>
                <textarea rows={4} value={form.seller_notes} onChange={(event) => update('seller_notes', event.target.value)} />
              </Field>
            </div>
          )}

          {stepId === 'eligibility' && (
            <div className="space-y-3 text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.visa_eligible_eb5}
                  onChange={(event) => update('visa_eligible_eb5', event.target.checked)}
                />
                {fieldT('visaEb5')}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.visa_eligible_e2}
                  onChange={(event) => update('visa_eligible_e2', event.target.checked)}
                />
                {fieldT('visaE2')}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.sba_prequalified}
                  onChange={(event) => update('sba_prequalified', event.target.checked)}
                />
                {fieldT('sba')}
              </label>
            </div>
          )}

          {stepId === 'review' && (
            <div className="space-y-3 text-sm text-gray-700">
              <p className="text-base font-semibold text-gray-900">{form.title || fieldT('titleEn')}</p>
              <p>{form.description || fieldT('descriptionEn')}</p>
              <p>
                {form.city}, {form.state}
              </p>
              <p>
                Asking: {form.asking_price || '—'} · Revenue: {form.gross_revenue_annual || '—'} · Cash flow:{' '}
                {form.cash_flow_annual || '—'}
              </p>
              <div className="flex flex-wrap gap-2">
                {form.visa_eligible_eb5 && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{fieldT('visaEb5')}</span>}
                {form.visa_eligible_e2 && <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">{fieldT('visaE2')}</span>}
                {form.sba_prequalified && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{fieldT('sba')}</span>}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={back} disabled={stepIndex === 0} className="btn-outline disabled:opacity-50">
              {labelT('back')}
            </button>

            {stepId === 'review' ? (
              <div className="flex gap-3">
                <button type="button" onClick={() => submit('draft')} className="btn-outline">
                  {fieldT('saveDraft')}
                </button>
                <button type="button" onClick={() => submit('review')} className="btn-primary">
                  {fieldT('publishNow')}
                </button>
              </div>
            ) : (
              <button type="button" onClick={next} className="btn-primary">
                {labelT('next')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold text-gray-700">{label}</span>
      {children}
    </label>
  )
}
