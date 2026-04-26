'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { type AppLocale } from '@/i18n/locales'
import { formatRelative } from '@/lib/marketplace/format'
import { type InquiryMessage } from '@/lib/marketplace/types'

interface InquiryThreadProps {
  initialMessages: InquiryMessage[]
  currentRole: 'buyer' | 'seller'
  locale: AppLocale
  onSend?: (body: string) => Promise<InquiryMessage> | InquiryMessage
}

export function InquiryThread({ initialMessages, currentRole, locale, onSend }: InquiryThreadProps) {
  const t = useTranslations('marketplace.inbox')
  const [messages, setMessages] = useState<InquiryMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    setSending(true)
    try {
      const created = await onSend?.(trimmed)
      if (created) {
        setMessages((prev) => [...prev, created])
      } else {
        // Optimistic local append when not wired to a backend yet.
        setMessages((prev) => [
          ...prev,
          {
            id: `local-${Date.now()}`,
            thread_id: prev[0]?.thread_id ?? 'local',
            sender_profile_id: 'local',
            sender_role: currentRole,
            body: trimmed,
            read_at: null,
            sent_at: new Date().toISOString(),
          },
        ])
      }
      setDraft('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            {t('empty')}
          </p>
        ) : (
          messages.map((message) => {
            const fromMe = message.sender_role === currentRole
            return (
              <div
                key={message.id}
                className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    fromMe ? 'bg-accent text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.body}</p>
                  <p
                    className={`mt-2 text-xs ${
                      fromMe ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {message.sender_role === 'buyer' ? t('buyerSide') : t('sellerSide')} ·{' '}
                    {formatRelative(message.sent_at, locale)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t('messagePlaceholder')}
          className="flex-1"
        />
        <button type="submit" disabled={sending || !draft.trim()} className="btn-primary disabled:opacity-50">
          {t('send')}
        </button>
      </form>
    </div>
  )
}
