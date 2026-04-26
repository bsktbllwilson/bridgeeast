'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

const FIELDS_LEFT = [
  { name: 'fullName', label: 'Full Name', type: 'text' },
  { name: 'phone', label: 'Phone No.', type: 'tel' },
  { name: 'company', label: 'Company', type: 'text' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'specialty', label: 'Specialty', type: 'text' },
] as const

const FIELDS_RIGHT = [
  { name: 'jobTitle', label: 'Job Title', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'website', label: 'Website', type: 'url' },
  { name: 'referral', label: 'Referral', type: 'text' },
] as const

export function PartnerForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // TODO: POST to /api/ptp/partners
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mt-10 rounded-3xl bg-ptp-cream p-10 text-center">
        <h2 className="ptp-h3">Application received</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ptp-ink/70">
          Thanks for applying. Our team reviews new partner applications weekly and will be in touch
          if there’s a fit.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      <div className="grid gap-5 md:grid-cols-2 md:gap-x-10">
        <div className="space-y-5">
          {FIELDS_LEFT.map((field) => (
            <FieldRow key={field.name} {...field} />
          ))}
        </div>
        <div className="space-y-5">
          {FIELDS_RIGHT.map((field) => (
            <FieldRow key={field.name} {...field} />
          ))}
        </div>
      </div>

      <FieldRow name="bio" label="Bio" textarea />

      <div className="pt-4">
        <button type="submit" className="ptp-btn-primary w-full justify-center">
          Submit Application
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}

function FieldRow({
  name,
  label,
  type = 'text',
  textarea = false,
}: {
  name: string
  label: string
  type?: string
  textarea?: boolean
}) {
  return (
    <label className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <span className="ptp-display w-28 shrink-0 text-sm font-bold leading-[2.75rem] text-ptp-ink">
        {label}
      </span>
      {textarea ? (
        <textarea name={name} className="ptp-textarea" />
      ) : (
        <input name={name} type={type} className="ptp-input" />
      )}
    </label>
  )
}
