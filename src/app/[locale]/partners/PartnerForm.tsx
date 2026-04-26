'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

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
      {/* Row 1: Full Name | Job Title */}
      <div className="grid gap-5 md:grid-cols-2 md:gap-x-10">
        <FieldRow name="fullName" label="Full Name" type="text" />
        <FieldRow name="jobTitle" label="Job Title" type="text" />
      </div>

      {/* Row 2: Phone No. | Email */}
      <div className="grid gap-5 md:grid-cols-2 md:gap-x-10">
        <FieldRow name="phone" label="Phone No." type="tel" />
        <FieldRow name="email" label="Email" type="email" />
      </div>

      {/* Row 3: Company | Website */}
      <div className="grid gap-5 md:grid-cols-2 md:gap-x-10">
        <FieldRow name="company" label="Company" type="text" />
        <FieldRow name="website" label="Website" type="url" />
      </div>

      {/* Row 4: Address (full width) */}
      <FieldRow name="address" label="Address" type="text" wide />

      {/* Row 5: Specialty | Referral */}
      <div className="grid gap-5 md:grid-cols-2 md:gap-x-10">
        <FieldRow name="specialty" label="Specialty" type="text" />
        <FieldRow name="referral" label="Referral" type="text" />
      </div>

      {/* Row 6: Bio (full width textarea) */}
      <FieldRow name="bio" label="Bio" textarea wide />

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
  wide = false,
}: {
  name: string
  label: string
  type?: string
  textarea?: boolean
  wide?: boolean
}) {
  const labelClass = wide
    ? 'ptp-display w-20 shrink-0 text-sm font-bold leading-[2.75rem] text-ptp-ink'
    : 'ptp-display w-28 shrink-0 text-sm font-bold leading-[2.75rem] text-ptp-ink'

  return (
    <label className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <span className={labelClass}>{label}</span>
      {textarea ? (
        <textarea name={name} className="ptp-textarea" />
      ) : (
        <input name={name} type={type} className="ptp-input" />
      )}
    </label>
  )
}
