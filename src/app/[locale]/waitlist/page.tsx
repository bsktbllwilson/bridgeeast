'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

type FaqItem = { q: string; a: string }
type WhatYoullGetItem = { icon: string; title: string; description: string }

export default function WaitlistPage() {
  const t = useTranslations('waitlist')
  const faqItems = t.raw('faq') as FaqItem[]
  const whatYoullGetItems = t.raw('whatYoullGet') as WhatYoullGetItem[]
  const countryKeys = ['China','Japan','Korea','Vietnam','Thailand','India','Philippines','Indonesia','Singapore','Hong Kong','Taiwan','Malaysia','Other'] as const
  const [formData, setFormData] = useState({
    email: '',
    brandName: '',
    country: '',
    targetDate: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const stripeProductUrl =
    process.env.NEXT_PUBLIC_STRIPE_TEST_PRODUCT_URL ||
    'https://buy.stripe.com/test_12345' // replace with your real test product checkout link

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          brandName: formData.brandName,
          country: formData.country,
          targetDate: formData.targetDate,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('statusErrorDefault'))
      }

      const successMessage = result.message || t('statusSuccessDefault')
      setStatus({ type: 'success', message: successMessage })
      setSubmitted(true)
      setFormData({ email: '', brandName: '', country: '', targetDate: '' })

      if (response.status === 201) {
        setStatus({ type: 'success', message: t('statusJustAdded') })
      }

      if (result.message?.toLowerCase().includes('already')) {
        setStatus({ type: 'info', message: result.message })
      }
    } catch (error: any) {
      console.error('Error submitting form:', error)
      setStatus({ type: 'error', message: error.message || t('statusErrorDefault') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="container section pt-16 md:pt-24 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6 text-gray-950">
          {t('heroTitlePrefix')} <span className="text-accent">{t('heroBrand')}</span> {t('heroTitleSuffix')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">{t('heroSubtitle')}</p>

        {status && (
          <div
            className={`mb-8 p-4 rounded-lg border-l-4 ${
              status.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-700'
                : status.type === 'error'
                ? 'bg-red-50 border-red-500 text-red-700'
                : 'bg-blue-50 border-blue-500 text-blue-700'
            }`}
          >
            <p className="font-medium">{status.message}</p>
          </div>
        )}

        {submitted ? (
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-12 text-center">
            <div className="text-6xl mb-6">✓</div>
            <h2 className="text-3xl font-serif font-bold text-green-900 mb-4">{t('successTitle')}</h2>
            <p className="text-green-800 text-lg mb-6 leading-relaxed max-w-xl mx-auto">{t('successBody')}</p>
            <p className="text-sm text-green-700 mb-8 font-medium">{t('successCheckEmail')}</p>

            <a
              href={stripeProductUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block btn-primary"
            >
              {t('successUpgradeButton')}
            </a>

            <p className="text-xs text-green-600 mt-6">{t('successUpgradeNote')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card bg-white p-8 md:p-12 border-2 border-gray-200">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  {t('emailLabel')} <span className="text-accent">{t('required')}</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t('emailPlaceholder')}
                  className="w-full px-4 py-3 border-2 border-gray-300 hover:border-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  {t('brandLabel')} <span className="text-accent">{t('required')}</span>
                </label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  required
                  placeholder={t('brandPlaceholder')}
                  className="w-full px-4 py-3 border-2 border-gray-300 hover:border-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  {t('countryLabel')} <span className="text-accent">{t('required')}</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 hover:border-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all rounded-lg bg-white"
                >
                  <option value="">{t('countryPlaceholder')}</option>
                  {countryKeys.map((key) => (
                    <option key={key} value={key}>{t(`countries.${key}` as never)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">{t('targetDateLabel')}</label>
                <input
                  type="month"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 hover:border-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent"
              >
                {loading ? t('submitLoading') : t('submitIdle')}
              </button>

              <p className="text-xs text-gray-500 text-center">
                {t('privacyNotice')}{' '}
                <a href="#" className="text-accent hover:underline font-medium">
                  {t('privacyLink')}
                </a>
              </p>
            </div>
          </form>
        )}
      </section>

      {/* What You'll Get */}
      <section className="bg-gray-50 section">
        <div className="container">
          <h2 className="section-title mb-12 text-center">{t('whatYoullGetTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {whatYoullGetItems.map((item, idx) => (
              <div key={idx} className="card bg-white p-8 border-2 border-gray-200">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-serif font-bold mb-3 text-gray-950">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container section max-w-3xl">
        <h2 className="section-title mb-12">{t('faqTitle')}</h2>
        <div className="space-y-8">
          {faqItems.map((faq, idx) => (
            <div key={idx} className="py-6 border-b border-gray-200 last:border-0">
              <h3 className="text-lg font-serif font-bold text-gray-950 mb-3">{faq.q}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
