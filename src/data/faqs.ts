// First-draft answers — edit freely as the product evolves. Used by
// /membership and (eventually) /faq.

export type Faq = { q: string; a: string }

export const FAQS: Faq[] = [
  {
    q: "What's included in my Pass The Plate plan?",
    a: 'Every plan unlocks browsing of vetted Asian F&B listings, partner directory access, and the playbook library. Paid tiers add higher listing/contact limits, complimentary valuations, and one-on-one advisor time. See the comparison above for the exact numbers per tier.',
  },
  {
    q: 'How can I upgrade, downgrade, or cancel my subscription?',
    a: 'From your account settings, click Membership → Manage. Upgrades take effect immediately and are prorated. Downgrades and cancellations apply at the end of your current billing cycle — no fees, no questions.',
  },
  {
    q: 'How can I get in touch with a sales support team?',
    a: 'Email hello@passtheplate.store and a real human will reply within one business day. Chef’s Table and Full Menu members can also book directly with their advisor from the dashboard.',
  },
  {
    q: 'Where can I find my live tutorials and documentations?',
    a: 'The Resources tab in your dashboard hosts the latest video walkthroughs, deal-prep checklists, and SBA guides. Resources are kept current — bookmark the page rather than downloading PDFs.',
  },
  {
    q: 'How to troubleshoot my account? I am having issues logging in.',
    a: 'Use the "Forgot password" link on the sign-in page to reset by email. If your magic link isn’t arriving, check your spam folder and confirm the email matches the one you signed up with. Still stuck? Email hello@passtheplate.store with your account email.',
  },
  {
    q: 'How do I optimize my account so that I get access to the right resources?',
    a: 'Set your buyer or seller profile completely (preferred languages, target cuisines, target metros, budget). The marketplace, partner suggestions, and weekly digest all use those signals — a thorough profile dramatically improves matches.',
  },
  {
    q: 'Where will my information be used?',
    a: 'Profile, financial, and identity information are used only to verify members, match buyers and sellers, and run the marketplace. We do not sell or share personal data. See our Privacy Policy for the full breakdown.',
  },
  {
    q: 'Who can benefit from the Pass The Plate plan?',
    a: 'Operators planning a U.S. expansion, search funds running multiple deals, family-business buyers, brokers serving Asian-language clients, and sellers ready to transition. If you’re anywhere in the Asian F&B ecosystem, there’s a tier for you.',
  },
  {
    q: 'Can I disable monthly renewal?',
    a: 'Yes. Cancel any time from Membership → Manage and your plan will continue through the end of the current billing period, then drop to the free First Bite tier. We never auto-charge a canceled plan.',
  },
  {
    q: 'I’d like a personal broker, how can I find one that fits my needs?',
    a: 'Browse the Address Book filtered by language, specialty, and city. Every broker listed has been pre-screened. If you’d like a hand-picked introduction, Chef’s Table and Full Menu members can request one from their advisor.',
  },
  {
    q: 'What is listing my business process like? How much will I need to pay?',
    a: 'Listing is free and takes about 10 minutes. We charge a 3–5% success fee only when your business sells through the platform — no upfront listing fees, no monthly seller charges, no exclusivity required.',
  },
  {
    q: 'What is buying a business process like? Are there any additional fees?',
    a: 'Browse, save, and inquire on listings free. Once you verify proof of funds (also free), seller contacts unlock and you can begin diligence. Pass The Plate doesn’t charge buyers a transaction fee — your only costs are your own legal, financing, and diligence vendors.',
  },
]
