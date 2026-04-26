'use client'

import { useState } from 'react'
import { submitProofOfFundsAction } from './actions'

type Kind = 'bank_statement' | 'sba_pre_qual'

export function VerifyForm({ initialKind = 'bank_statement' as Kind }) {
  const [kind, setKind] = useState<Kind>(initialKind)
  const [file, setFile] = useState<File | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError('Attach a PDF or image.')
      return
    }
    setPending(true)
    setError(null)
    const fd = new FormData()
    fd.append('kind', kind)
    fd.append('file', file)
    const r = await submitProofOfFundsAction(fd)
    setPending(false)
    if (!r.ok) {
      setError(r.error ?? 'Something went wrong.')
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 text-center">
        <div className="font-display text-2xl font-bold mb-3">Submitted for review</div>
        <p className="text-gray-700">
          Thanks — our team manually reviews proof-of-funds within 1–2 business days. You’ll get
          an email when your buyer status flips to verified.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-3">
          What are you uploading?
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <KindCard
            active={kind === 'bank_statement'}
            onClick={() => setKind('bank_statement')}
            title="Bank statement"
            sub="Recent statement or asset summary showing available capital."
          />
          <KindCard
            active={kind === 'sba_pre_qual'}
            onClick={() => setKind('sba_pre_qual')}
            title="SBA pre-qual letter"
            sub="Pre-qualification letter from your SBA lender."
          />
        </div>
      </div>

      <div>
        <label htmlFor="pof-file" className="block text-sm font-medium text-gray-800 mb-2">
          File (PDF, PNG, JPG · 10 MB max)
        </label>
        <input
          id="pof-file"
          type="file"
          accept="application/pdf,image/png,image/jpeg,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={pending}
          className="!py-2 !file:mr-3 !file:rounded-md !file:border-0 !file:bg-black !file:text-white !file:px-4 !file:py-2 !file:text-sm hover:!file:bg-gray-900"
        />
        {file && (
          <p className="text-xs text-gray-600 mt-2">
            Selected: {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={pending || !file}
        className="w-full bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
      >
        {pending ? 'Uploading…' : 'Submit for Review →'}
      </button>

      <p className="text-xs text-gray-600">
        Your document is uploaded to a private bucket. Only Pass The Plate admins can view it
        during the review.
      </p>
    </form>
  )
}

function KindCard({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean
  onClick: () => void
  title: string
  sub: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border-2 p-4 transition-colors ${
        active ? 'border-black bg-playbook-yellow' : 'border-gray-200 hover:border-gray-400'
      }`}
    >
      <div className="font-display font-bold mb-1">{title}</div>
      <div className="text-xs text-gray-700 leading-snug">{sub}</div>
    </button>
  )
}
