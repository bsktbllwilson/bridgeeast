'use client'

import { Plus, Minus } from 'lucide-react'
import { useState } from 'react'

const FAQS: { q: string; a: string }[] = [
  {
    q: "What’s included in my Pass The Plate plan?",
    a: 'Each plan unlocks a different level of marketplace access — from browsing listings on the free First Bite tier to a dedicated advisor on The Full Menu. Compare features in the cards above.',
  },
  {
    q: 'How can I upgrade, downgrade, or cancel my subscription?',
    a: 'You can change or cancel your plan anytime from your account settings. Changes take effect at the start of the next billing cycle.',
  },
  {
    q: 'How can I get in touch with a sales support team?',
    a: 'Email hello@pass-the-plate.store or use the "Get In Touch" form below. Chef’s Table and Full Menu members get priority response times.',
  },
  {
    q: 'Where can I find my live tutorials and documentations?',
    a: 'After signing in, your Tutorials & Docs hub lives in your member dashboard. The full Playbook library is open to all members.',
  },
  {
    q: 'How to troubleshoot my account? I am having issues logging in.',
    a: 'Try resetting your password from the login screen. If you’re still stuck, email support and we’ll get you back in within one business day.',
  },
  {
    q: 'How do I optimize my account so that I get access to the right resources?',
    a: 'Complete your buyer or seller profile in full — budget range, target cuisines, geos, and visa needs — so we can surface the right listings, partners, and playbooks.',
  },
  {
    q: 'Where will my information be used?',
    a: 'Your contact info is shared only with verified counterparties after a signed NDA. We never sell your data and never expose financials publicly.',
  },
  {
    q: 'Who can benefit from the Pass The Plate plan?',
    a: 'Asian F&B operators looking to sell, founders looking to buy or expand, immigrant entrepreneurs on EB-5/E-2/L-1 paths, and SBA-backed buyers.',
  },
  {
    q: 'Can I disable monthly renewal?',
    a: 'Yes — toggle auto-renew off in your billing settings. You’ll keep access until the end of the current period.',
  },
  {
    q: "I’d like a personal broker, how can I find one that fits my needs?",
    a: 'Full Menu members get a dedicated advisor matched to your cuisine, geo, and visa profile. Chef’s Table includes 60 minutes/month of advisor time.',
  },
  {
    q: 'What is listing my business process like? How much will I need to pay?',
    a: 'Listing is free — list your business in 10 minutes from any device in EN/ZH/KO/VI. We charge a 3–5% success fee only when your deal closes.',
  },
  {
    q: 'What is buying a business process like? Are there any additional fees?',
    a: 'Browsing and inquiring is free. NDA-gated financials require a signed acceptance. Optional services (valuations, due diligence, advisor time) follow your plan tier.',
  },
]

export function MembershipFAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <ul className="space-y-3">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index
        return (
          <li key={faq.q} className="rounded-full bg-white">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium text-ptp-ink transition ${
                isOpen ? 'rounded-t-3xl rounded-b-none' : 'rounded-full'
              }`}
            >
              <span>{faq.q}</span>
              {isOpen ? (
                <Minus className="h-4 w-4 shrink-0 text-ptp-ink/60" />
              ) : (
                <Plus className="h-4 w-4 shrink-0 text-ptp-ink/60" />
              )}
            </button>
            {isOpen && (
              <div className="rounded-b-3xl bg-white px-6 pb-5 text-sm leading-relaxed text-ptp-ink/70">
                {faq.a}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
