'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function WaitlistPage() {
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
        throw new Error(result.error || 'Failed to join waitlist')
      }

      const successMessage = result.message || 'Successfully joined the waitlist.'
      setStatus({ type: 'success', message: successMessage })
      setSubmitted(true)
      setFormData({ email: '', brandName: '', country: '', targetDate: '' })

      if (response.status === 201) {
        setStatus({ type: 'success', message: 'Just added! Check your email for next steps.' })
      }

      if (result.message?.toLowerCase().includes('already')) {
        setStatus({ type: 'info', message: result.message })
      }
    } catch (error: any) {
      console.error('Error submitting form:', error)
      setStatus({ type: 'error', message: error.message || 'Failed to join waitlist. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="container section pt-16 md:pt-24 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6 text-gray-950">
          Join the <span className="text-accent">BridgeEast</span> Waitlist
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
          Get early access to market reports, our partner network, and expert guides tailored to your brand&apos;s needs.
        </p>

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
            <h2 className="text-3xl font-serif font-bold text-green-900 mb-4">Welcome to BridgeEast!</h2>
            <p className="text-green-800 text-lg mb-6 leading-relaxed max-w-xl mx-auto">
              We&apos;ve received your info and will be in touch within 48 hours with your access link and initial resources.
            </p>
            <p className="text-sm text-green-700 mb-8 font-medium">
              Check your email for a welcome message from our team.
            </p>

            <a
              href={stripeProductUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block btn-primary"
            >
              Upgrade Early Access →
            </a>

            <p className="text-xs text-green-600 mt-6">
              Limited early adopter pricing available for waitlist members
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card bg-white p-8 md:p-12 border-2 border-gray-200">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Email Address <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="founder@yourbrand.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 hover:border-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Brand Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Shanghai Kitchen, Golden Dragon"
                  className="w-full px-4 py-3 border-2 border-gray-300 hover:border-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Country of Origin <span className="text-accent">*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 hover:border-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all rounded-lg bg-white"
                >
                  <option value="">Select your country...</option>
                  <option value="China">China</option>
                  <option value="Japan">Japan</option>
                  <option value="Korea">Korea</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Thailand">Thailand</option>
                  <option value="India">India</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Hong Kong">Hong Kong</option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Target Opening Date
                </label>
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
                {loading ? 'Joining...' : 'Join the Waitlist'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                We respect your privacy. No spam, ever. See our{' '}
                <a href="#" className="text-accent hover:underline font-medium">
                  privacy policy
                </a>
              </p>
            </div>
          </form>
        )}
      </section>

      {/* Info Sections */}
      <section className="bg-gray-50 section">
        <div className="container">
          <h2 className="section-title mb-12 text-center">What You&apos;ll Get</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: 'Market Data',
                description: 'Neighborhood rent benchmarks, foot traffic analysis, and competitor insights.',
              },
              {
                icon: '📚',
                title: 'Expert Guides',
                description: 'Step-by-step playbooks for visas, permits, leasing, hiring, and brand localization.',
              },
              {
                icon: '🤝',
                title: 'Partner Network',
                description: 'Direct access to vetted brokers, attorneys, distributors, and marketing specialists.',
              },
            ].map((item, idx) => (
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
        <h2 className="section-title mb-12">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {[
            {
              q: 'When will I get access?',
              a: 'We send access links within 48 hours of signup. Early signups get priority onboarding and exclusive first-partner sessions.',
            },
            {
              q: 'Is there a cost?',
              a: 'BridgeEast is completely free. Our partners pay to be featured, so you always have access to the full platform at no cost.',
            },
            {
              q: 'Can I share my access with my team?',
              a: 'Yes! Once you join, you can add team members and collaborators. We recommend including your co-founders and key advisors.',
            },
            {
              q: 'Do I have to be opening soon?',
              a: 'No. Whether you&apos;re in the planning phase or launching within 6 months, BridgeEast has resources for you. We serve founders at every stage.',
            },
            {
              q: 'What if my cuisine type isn\'t covered?',
              a: 'Our guides and data focus on food & beverage in general, with specific depth on Asian cuisines. If you need specialized guidance, our partner network can help.',
            },
          ].map((faq, idx) => (
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
