'use client'

import { useState } from 'react'
import { requestPasswordResetAction, type AuthFormResult } from '@/lib/auth-actions'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<AuthFormResult | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    setResult(null)
    const fd = new FormData()
    fd.append('email', email)
    const r = await requestPasswordResetAction(undefined, fd)
    setPending(false)
    setResult(r)
  }

  if (result?.ok) {
    return (
      <div className="text-center">
        <div className="font-display text-2xl font-bold mb-3">Check your inbox</div>
        <p className="text-gray-700">{result.message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-800 mb-2">
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
        />
      </div>
      {result?.error && <p className="text-sm text-red-700">{result.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send Reset Link →'}
      </button>
    </form>
  )
}
