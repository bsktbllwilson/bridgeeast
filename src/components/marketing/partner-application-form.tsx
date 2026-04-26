'use client'

import { useState, useTransition } from 'react'

import { submitPartnerApplication, type ApplyResult } from '@/app/partners/apply/actions'
import { Button } from '@/components/ui/button'

const SPECIALTIES = [
  { value: 'sba_lender', label: 'SBA Lender' },
  { value: 'immigration_attorney', label: 'Immigration Attorney' },
  { value: 'bilingual_broker', label: 'Bilingual Broker' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' },
] as const

const inputClass =
  'h-12 w-full rounded-full border border-brand-border bg-brand-cream/40 px-5 text-base text-brand-ink placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-ink/15'

const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-brand-muted'

export function PartnerApplicationForm() {
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ApplyResult | null>(null)

  function onSubmit(formData: FormData) {
    setResult(null)
    startTransition(async () => {
      const r = await submitPartnerApplication(formData)
      setResult(r)
    })
  }

  if (result?.ok) {
    return (
      <div className="space-y-4 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-2xl text-white">
          ✓
        </span>
        <h2 className="font-display text-3xl text-brand-ink md:text-4xl">
          Thanks — application received
        </h2>
        <p className="text-brand-muted">We&rsquo;ll review and reach out within 3 business days.</p>
      </div>
    )
  }

  return (
    <form action={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full Name" name="full_name" required />
        <Field label="Job Title" name="job_title" />
        <Field label="Phone No." name="phone" type="tel" />
        <Field label="Email" name="email" type="email" required />
        <Field label="Company" name="company" />
        <Field label="Website" name="website" type="url" placeholder="example.com" />
      </div>

      <Field label="Address" name="address" />

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="specialty" className={labelClass}>
            Specialty <span className="text-brand-orange">*</span>
          </label>
          <select
            id="specialty"
            name="specialty"
            required
            defaultValue=""
            className={`${inputClass} appearance-none pr-10`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '14px 14px',
            }}
          >
            <option value="" disabled>
              Select one…
            </option>
            {SPECIALTIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <Field label="Referral" name="referral_source" placeholder="How did you hear about us?" />
      </div>

      <div>
        <label htmlFor="bio" className={labelClass}>
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={6}
          placeholder="A few sentences about your practice, the clients you serve, and the languages you speak."
          className="w-full rounded-2xl border border-brand-border bg-brand-cream/40 p-4 text-base text-brand-ink placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-ink/15"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        arrow={!pending}
        disabled={pending}
        className="w-full"
      >
        {pending ? 'Submitting…' : 'Submit Application'}
      </Button>

      {result && !result.ok ? (
        <p role="alert" className="text-sm text-brand-orange">
          {result.error}
        </p>
      ) : null}
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} {required ? <span className="text-brand-orange">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )
}
