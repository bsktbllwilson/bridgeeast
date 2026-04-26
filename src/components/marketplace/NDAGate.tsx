'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ShieldCheck } from 'lucide-react'

import { NDA_BODY_EN } from '@/lib/marketplace/nda'

interface NDAGateProps {
  listingId: string
  onSigned?: (fullName: string) => void | Promise<void>
}

export function NDAGate({ listingId, onSigned }: NDAGateProps) {
  const t = useTranslations('marketplace.nda')
  const [fullName, setFullName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!agreed || fullName.trim().length < 2) return
    setSubmitting(true)
    try {
      await onSigned?.(fullName.trim())
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-accent/10 p-3 text-accent">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-950">{t('title')}</h2>
          <p className="mt-1 text-sm text-gray-600">{t('intro')}</p>
        </div>
      </div>

      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-4 font-sans text-sm leading-relaxed text-gray-700">
        {NDA_BODY_EN}
      </pre>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">{t('fullName')}</label>
        <input
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
          autoComplete="name"
          data-listing-id={listingId}
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-gray-700">
        <input
          type="checkbox"
          className="mt-1"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
        />
        <span>{t('agree')}</span>
      </label>

      <button
        type="submit"
        disabled={submitting || !agreed || fullName.trim().length < 2}
        className="btn-primary w-full text-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {t('submit')}
      </button>
    </form>
  )
}
