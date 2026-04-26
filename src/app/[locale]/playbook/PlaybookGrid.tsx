'use client'

import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'

import { ptpRoute } from '@/lib/ptp/nav'
import {
  PLAYBOOK_CATEGORY_LABELS,
  PLAYBOOK_CATEGORY_TAG,
  PLAYBOOKS,
  type Playbook,
  type PlaybookCategory,
} from '@/lib/ptp/playbooks'

const FILTERS: PlaybookCategory[] = [
  'all',
  'buying',
  'selling',
  'legal',
  'visa',
  'market-entry',
  'operations',
  'finance',
]

export function PlaybookGrid({ locale }: { locale: string }) {
  const [active, setActive] = useState<PlaybookCategory>('all')

  const filtered = useMemo(() => {
    if (active === 'all') return PLAYBOOKS
    return PLAYBOOKS.filter(
      (playbook) =>
        playbook.category === active || playbook.secondaryCategory === active,
    )
  }, [active])

  return (
    <section className="ptp-section">
      <div className="ptp-container">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={active === filter ? 'ptp-pill-active' : 'ptp-pill'}
            >
              {PLAYBOOK_CATEGORY_LABELS[filter]}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filtered.slice(0, 3).map((playbook) => (
            <PlaybookCard key={playbook.slug} playbook={playbook} locale={locale} />
          ))}

          {filtered.length > 0 && (
            <article className="ptp-card-yellow flex flex-col justify-between">
              <div>
                <h3 className="ptp-display text-2xl text-ptp-ink md:text-3xl">
                  Subscribe For
                  <br />
                  Weekly Guides
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ptp-ink/70">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
                </p>
              </div>
              <SubscribeForm />
            </article>
          )}

          {filtered.slice(3).map((playbook) => (
            <PlaybookCard key={playbook.slug} playbook={playbook} locale={locale} />
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between text-sm font-medium text-ptp-ink/70">
          <button type="button" className="inline-flex items-center gap-2 transition hover:text-ptp-ink">
            <ArrowLeft className="h-4 w-4" />
            Previous Page
          </button>
          <button type="button" className="inline-flex items-center gap-2 transition hover:text-ptp-ink">
            Next Page
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

function PlaybookCard({ playbook, locale }: { playbook: Playbook; locale: string }) {
  return (
    <article className="ptp-card flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={playbook.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="ptp-tag-yellow">{PLAYBOOK_CATEGORY_TAG[playbook.category]}</span>
          {playbook.secondaryCategory && (
            <span className="ptp-tag-yellow">
              {PLAYBOOK_CATEGORY_TAG[playbook.secondaryCategory]}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="ptp-display text-2xl leading-tight text-ptp-ink">{playbook.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ptp-ink/70">{playbook.excerpt}</p>
        <Link
          href={ptpRoute(`/playbook/${playbook.slug}`, locale)}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ptp-ink transition hover:text-ptp-orange"
        >
          Read Guide
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}

function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <form
      className="mt-6 flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        if (!email) return
        // TODO: wire to /api/ptp/playbook-subscribe
        setSubmitted(true)
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email Address"
        className="w-full rounded-full bg-white px-5 py-3 text-sm text-ptp-ink placeholder:text-ptp-ink/40 focus:outline-none focus:ring-2 focus:ring-ptp-ink/20"
        aria-label="Email address"
        required
      />
      <button type="submit" className="ptp-btn-dark w-full justify-center text-sm">
        {submitted ? 'Subscribed' : 'Subscribe'}
      </button>
    </form>
  )
}
