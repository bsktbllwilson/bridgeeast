export interface Faq {
  id: string
  question: string
  answer: string
  /** Used to surface a focused subset on /contact, etc. */
  audience: 'general' | 'membership' | 'partner' | 'seller'
}

export const FAQS: Faq[] = [
  {
    id: 'whats-included',
    audience: 'membership',
    question: "What's included in my Pass The Plate plan?",
    answer:
      "Every plan unlocks the Pass The Plate marketplace, full Playbook access, and our partner directory. Paid tiers add deeper listing/contact limits, complimentary valuations, and time with an advisor — see the membership page for the side-by-side breakdown.",
  },
  {
    id: 'change-plan',
    audience: 'membership',
    question: 'How can I upgrade, downgrade, or cancel my subscription?',
    answer:
      'Manage your plan from the billing portal in your account settings — upgrades take effect immediately, downgrades and cancellations apply at the end of the current billing period. We don’t charge cancellation fees.',
  },
  {
    id: 'sales-support',
    audience: 'general',
    question: 'How can I get in touch with the sales support team?',
    answer:
      "Email hello@passtheplate.store or use the form on /contact. We respond within one business day, and Chef’s Table and Full Menu members can book time directly with their advisor.",
  },
  {
    id: 'tutorials',
    audience: 'general',
    question: 'Where can I find live tutorials and documentation?',
    answer:
      'The Playbook hosts our written guides on buying, selling, visas, and operations. Members get invited to monthly walkthroughs — recordings are posted in your account dashboard the day after each session.',
  },
  {
    id: 'troubleshoot',
    audience: 'general',
    question: 'How do I troubleshoot my account? I’m having issues logging in.',
    answer:
      'Try the magic-link sign-in from /sign-in first — it works even if you forgot your password. If you’re still locked out, email support@passtheplate.store with the email on your account and we’ll get you back in within a few hours.',
  },
  {
    id: 'optimize',
    audience: 'general',
    question: 'How do I optimize my account so I get the right resources?',
    answer:
      'Fill out your buyer or seller profile fully, set your target geographies and price range, and save searches. The more we know, the better we can route opportunities, partner intros, and Playbook recommendations to you.',
  },
  {
    id: 'data-use',
    audience: 'general',
    question: 'Where will my information be used?',
    answer:
      'Account data stays inside Pass The Plate to power matching, messaging, and your dashboard. We never sell contact info, and inquiries you send to a partner or seller are only shared with that recipient.',
  },
  {
    id: 'who-benefits',
    audience: 'general',
    question: 'Who can benefit from a Pass The Plate plan?',
    answer:
      'Operators looking to acquire an Asian F&B business, owners planning a transition or sale, and the lenders, attorneys, and brokers who serve them. If you touch the Asian restaurant economy, the directory and Playbook are built for you.',
  },
  {
    id: 'disable-renewal',
    audience: 'membership',
    question: 'Can I disable monthly renewal?',
    answer:
      'Yes — toggle auto-renew off from your billing settings. You’ll keep access until the end of the period you already paid for, then revert to the free First Bite tier with no penalty.',
  },
  {
    id: 'find-broker',
    audience: 'partner',
    question: 'I’d like a personal broker — how do I find one that fits?',
    answer:
      'Browse /partners, filter by specialty and language, and message the broker directly. Chef’s Table and Full Menu members get a curated short-list and a warm intro from our team within 48 hours.',
  },
  {
    id: 'list-process',
    audience: 'seller',
    question: 'What is the listing process like? How much will I need to pay?',
    answer:
      'Listing is free. Submit your business through /sellers, our team verifies the financials, then we publish to qualified buyers. You only pay a success fee at close — nothing upfront, no monthly fees to stay listed.',
  },
  {
    id: 'buy-process',
    audience: 'seller',
    question: 'What is the buying process like? Are there any additional fees?',
    answer:
      'Browse listings, submit an LOI through the platform, complete diligence with the seller and our partner advisors, then close with the attorney of your choice. Buyers pay no platform fees — the success fee is on the seller side at close.',
  },
]

export function getFaqsForContact(): Faq[] {
  const order = [
    'whats-included',
    'who-benefits',
    'list-process',
    'buy-process',
    'find-broker',
    'sales-support',
  ]
  return order
    .map((id) => FAQS.find((f) => f.id === id))
    .filter((f): f is Faq => Boolean(f))
}
