'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  signInWithMagicLinkAction,
  signInWithPasswordAction,
  type AuthFormResult,
} from '@/lib/auth-actions'

interface Props {
  next: string | null
  initialError?: string | null
}

export function SignInForm({ next, initialError }: Props) {
  const t = useTranslations('pages.auth')
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<AuthFormResult | null>(
    initialError ? { ok: false, error: initialError } : null
  )

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    setResult(null)

    const fd = new FormData()
    fd.append('email', email)
    if (next) fd.append('next', next)

    if (mode === 'password') {
      fd.append('password', password)
      // signInWithPasswordAction redirects on success; on failure it returns.
      const r = await signInWithPasswordAction(undefined, fd)
      setPending(false)
      setResult(r)
    } else {
      fd.append('email', email)
      const r = await signInWithMagicLinkAction(undefined, fd)
      setPending(false)
      setResult(r)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="flex gap-2 p-1 bg-gray-100 rounded-full text-sm">
        <button
          type="button"
          onClick={() => setMode('password')}
          className={`flex-1 py-2 rounded-full font-medium transition-colors ${
            mode === 'password' ? 'bg-white shadow' : 'text-gray-600'
          }`}
        >
          {t('passwordTab')}
        </button>
        <button
          type="button"
          onClick={() => setMode('magic')}
          className={`flex-1 py-2 rounded-full font-medium transition-colors ${
            mode === 'magic' ? 'bg-white shadow' : 'text-gray-600'
          }`}
        >
          {t('magicTab')}
        </button>
      </div>

      <div>
        <label htmlFor="signin-email" className="block text-sm font-medium text-gray-800 mb-2">
          {t('emailLabel')}
        </label>
        <input
          id="signin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
        />
      </div>

      {mode === 'password' && (
        <div>
          <label
            htmlFor="signin-password"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            {t('passwordLabel')}
          </label>
          <input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
          />
        </div>
      )}

      {result?.error && <p className="text-sm text-red-700">{result.error}</p>}
      {result?.ok && result.message && (
        <p className="text-sm text-gray-800">{result.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
      >
        {pending
          ? mode === 'password'
            ? t('signInPending')
            : t('magicPending')
          : mode === 'password'
            ? t('signInButton')
            : t('magicSendButton')}
      </button>

      <button
        type="button"
        disabled
        title="Coming soon"
        className="w-full bg-white border border-gray-300 text-gray-500 px-6 py-3 rounded-md font-medium cursor-not-allowed"
      >
        {t('googleStub')}
      </button>
    </form>
  )
}
