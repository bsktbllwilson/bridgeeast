'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type TargetLocale = 'en' | 'zh'

const chineseCharacterPattern = /[\u3400-\u9fff]/

function getTargetLocale(text: string): TargetLocale {
  return chineseCharacterPattern.test(text) ? 'en' : 'zh'
}

export function InlineTranslation({ text }: { text: string }) {
  const t = useTranslations('translate')
  const errorT = useTranslations('errors')
  const [translation, setTranslation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const targetLocale = getTargetLocale(text)

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError(errorT('translationEmpty'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, targetLocale }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || errorT('translationFailed'))
      }

      setTranslation(payload.translation)
    } catch (translateError) {
      setError(translateError instanceof Error ? translateError.message : errorT('translationFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3 space-y-3">
      <button
        type="button"
        onClick={handleTranslate}
        disabled={loading}
        className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-gray-600 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? t('translating') : targetLocale === 'en' ? t('toEnglish') : t('toChinese')}
      </button>

      {translation && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          <p className="mb-1 font-semibold uppercase tracking-[0.16em] text-gray-400">{t('translatedLabel')}</p>
          <p className="leading-relaxed text-gray-600">{translation}</p>
        </div>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  )
}