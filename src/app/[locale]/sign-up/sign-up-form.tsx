'use client'

import { useState } from 'react'
import { signUpAction, type AuthFormResult } from '@/lib/auth-actions'

interface Props {
  next: string | null
}

export function SignUpForm({ next }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<AuthFormResult | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    setResult(null)

    const fd = new FormData()
    fd.append('email', email)
    fd.append('password', password)
    fd.append('full_name', fullName)
    fd.append('role', role)
    if (next) fd.append('next', next)

    const r = await signUpAction(undefined, fd)
    setPending(false)
    setResult(r)
  }

  if (result?.ok) {
    return (
      <div className="text-center">
        <div className="font-display text-2xl font-bold mb-3">Check your inbox</div>
        <p className="text-gray-700">{result.message}</p>
        <p className="text-sm text-gray-600 mt-6">
          Sent to <span className="font-medium">{email}</span>. The confirmation link
          will sign you in and bring you back here.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">I want to…</label>
        <div className="grid grid-cols-2 gap-3">
          <RoleCard
            active={role === 'buyer'}
            onClick={() => setRole('buyer')}
            label="Buy a business"
            sub="Browse listings, save searches, send inquiries."
          />
          <RoleCard
            active={role === 'seller'}
            onClick={() => setRole('seller')}
            label="Sell a business"
            sub="List my operating business in front of buyers."
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-name" className="block text-sm font-medium text-gray-800 mb-2">
          Your name <span className="text-gray-500">(optional)</span>
        </label>
        <input
          id="signup-name"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={pending}
        />
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-800 mb-2">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-800 mb-2">
          Password <span className="text-gray-500">(8+ characters)</span>
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={pending}
        />
      </div>

      {result?.error && <p className="text-sm text-red-700">{result.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
      >
        {pending ? 'Creating account…' : 'Create Account →'}
      </button>

      <button
        type="button"
        disabled
        title="Coming soon"
        className="w-full bg-white border border-gray-300 text-gray-500 px-6 py-3 rounded-md font-medium cursor-not-allowed"
      >
        Continue with Google (coming soon)
      </button>

      <p className="text-xs text-gray-600 text-center pt-2">
        By creating an account you agree to our terms and privacy policy.
      </p>
    </form>
  )
}

function RoleCard({
  active,
  onClick,
  label,
  sub,
}: {
  active: boolean
  onClick: () => void
  label: string
  sub: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border-2 p-4 transition-colors ${
        active
          ? 'border-black bg-playbook-yellow'
          : 'border-gray-200 bg-white hover:border-gray-400'
      }`}
    >
      <div className="font-display font-bold mb-1">{label}</div>
      <div className="text-xs text-gray-700 leading-snug">{sub}</div>
    </button>
  )
}
