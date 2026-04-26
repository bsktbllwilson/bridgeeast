'use client'

import { useEffect, useState } from 'react'

import { Card, CardBody } from '@/components/ui/card'
import { Container } from '@/components/ui/container'

type Testimonial = {
  quote: string
  name: string
  role: string
  city: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'We listed in Mandarin on a Sunday and had three serious buyers reach out by Friday. None of them spoke English first. None of them would have found us anywhere else.',
    name: 'Mei Chen',
    role: 'Owner, two dim sum restaurants',
    city: 'San Gabriel, CA',
  },
  {
    quote:
      'The buyer Pass The Plate sent had SBA pre-qualification in hand at the first meeting. We closed in 11 weeks — half what I budgeted.',
    name: 'David Park',
    role: 'Founder, Korean BBQ chain',
    city: 'Flushing, NY',
  },
  {
    quote:
      'I&rsquo;d been trying to sell my pho restaurant for two years on the generic broker sites. Pass The Plate found a Vietnamese-speaking buyer in 6 weeks who actually wanted to keep the staff.',
    name: 'Linh Nguyen',
    role: 'Owner-operator, pho counter',
    city: 'Westminster, CA',
  },
  {
    quote:
      'The listing analyst caught two add-backs my own accountant missed and bumped my SDE multiple by half a turn. That paid for the whole engagement many times over.',
    name: 'Steven Wong',
    role: 'Operator, three-unit ramen group',
    city: 'New York, NY',
  },
]

const ROTATE_MS = 7000
const VISIBLE = 2

export function Testimonials() {
  const pages = Math.ceil(TESTIMONIALS.length / VISIBLE)
  const [pageIndex, setPageIndex] = useState(0)

  useEffect(() => {
    if (pages <= 1) return
    const id = window.setInterval(() => {
      setPageIndex((i) => (i + 1) % pages)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [pages])

  const start = pageIndex * VISIBLE
  const visible = TESTIMONIALS.slice(start, start + VISIBLE)

  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <Container>
        <h2 className="text-center font-display text-3xl text-brand-ink md:text-4xl">
          Trusted by 100+ Sellers
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {visible.map((t) => (
            <Card key={t.name}>
              <CardBody className="space-y-6 p-8">
                <blockquote className="font-display text-2xl italic leading-snug text-brand-ink">
                  &ldquo;
                  <span dangerouslySetInnerHTML={{ __html: t.quote }} />
                  &rdquo;
                </blockquote>
                <footer>
                  <div className="font-display text-lg text-brand-ink">{t.name}</div>
                  <div className="text-sm text-brand-muted">
                    {t.role} · {t.city}
                  </div>
                </footer>
              </CardBody>
            </Card>
          ))}
        </div>

        {pages > 1 ? (
          <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Testimonials">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === pageIndex}
                aria-label={`Show testimonials page ${i + 1}`}
                onClick={() => setPageIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === pageIndex ? 'w-8 bg-brand-ink' : 'w-2 bg-brand-ink/25'
                }`}
              />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
