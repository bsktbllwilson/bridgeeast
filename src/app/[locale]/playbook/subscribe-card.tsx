'use client'

import { useState } from 'react'
import { hasSupabaseEnv, supabase } from '@/lib/supabase'

export function SubscribeCard() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Enter a valid email.')
      return
    }
    setStatus('submitting')
    setMessage(null)
    try {
      if (!hasSupabaseEnv) {
        setStatus('success')
        setMessage("You're on the list. We'll send the next guide your way.")
        setEmail('')
        return
      }
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, source: 'playbook_subscribe' })

      if (error && !error.message.toLowerCase().includes('duplicate')) {
        throw error
      }

      setStatus('success')
      setMessage("You're on the list. We'll send the next guide your way.")
      setEmail('')
    } catch (err) {
      console.error('newsletter subscribe failed', err)
      setStatus('error')
      setMessage('Something went wrong. Try again in a minute.')
    }
  }

  return (
    <div className="rounded-2xl bg-playbook-yellow p-8 md:p-10 flex flex-col justify-center min-h-[420px]">
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-3 leading-tight">
        Subscribe For Weekly Guides
      </h3>
      <p className="text-gray-800 mb-6">
        Tactics, checklists, and operator playbooks for Asian F&B teams expanding in the U.S. — once a
        week, no spam.
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="you@restaurant.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full !bg-white"
          disabled={status === 'submitting'}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
        >
          {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-sm ${
            status === 'error' ? 'text-red-700' : 'text-gray-800'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
