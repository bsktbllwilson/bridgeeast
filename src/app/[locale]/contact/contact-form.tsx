'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { submitContactMessage } from './actions'

const TOPICS = ['Buying', 'Selling', 'Membership', 'Partnership', 'Press', 'Other'] as const

export function ContactForm() {
  const t = useTranslations('pages.contactPage')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState<string>('Buying')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    const result = await submitContactMessage({ name, email, topic, message })
    if (!result.ok) {
      setStatus('error')
      setError(result.error ?? 'Something went wrong.')
      return
    }
    setStatus('success')
    setName('')
    setEmail('')
    setMessage('')
    setTopic('Buying')
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10">
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
          {t('formSuccessHeading')}
        </h3>
        <p className="text-gray-700">
          We read every note and reply within one business day. If it’s urgent, email
          {' '}<a className="text-accent underline" href="mailto:hello@passtheplate.store">hello@passtheplate.store</a>{' '}
          directly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-medium text-gray-700 underline hover:text-black"
        >
          {t('formAnother')}
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 space-y-5"
    >
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-800 mb-2">
          {t('formName')}
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === 'submitting'}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-800 mb-2">
          {t('formEmail')}
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'submitting'}
        />
      </div>
      <div>
        <label htmlFor="contact-topic" className="block text-sm font-medium text-gray-800 mb-2">
          {t('formTopic')}
        </label>
        <select
          id="contact-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={status === 'submitting'}
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-800 mb-2">
          {t('formMessage')}
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={status === 'submitting'}
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
      >
        {status === 'submitting' ? t('formPending') : t('formSubmit')}
      </button>
    </form>
  )
}
