'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

import { cn } from '@/lib/utils'

export function ListingGallery({
  cover,
  gallery,
  alt,
}: {
  cover: string | null
  gallery: string[]
  alt: string
}) {
  const slides = [cover, ...gallery].filter((u): u is string => !!u).map((src) => ({ src }))
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const [hero, ...rest] = slides
  if (!hero) {
    return <div className="aspect-[16/9] w-full rounded-2xl bg-brand-ink/10" aria-hidden="true" />
  }

  const heroSrc = hero.src
  const thumbs = rest.slice(0, 4)

  return (
    <>
      <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <button
          type="button"
          onClick={() => {
            setIndex(0)
            setOpen(true)
          }}
          className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-brand-ink/30"
          aria-label={`View photo of ${alt}`}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]"
            style={{ backgroundImage: `url('${heroSrc}')` }}
          />
        </button>

        {thumbs.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            {thumbs.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => {
                  setIndex(i + 1)
                  setOpen(true)
                }}
                className={cn(
                  'group relative aspect-[16/10] overflow-hidden rounded-2xl bg-brand-ink/30 md:aspect-[16/9]',
                  i === thumbs.length - 1 && slides.length > 5 && 'after:absolute after:inset-0',
                )}
                aria-label={`View photo ${i + 2} of ${alt}`}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ backgroundImage: `url('${s.src}')` }}
                />
                {i === thumbs.length - 1 && slides.length > 5 ? (
                  <span className="relative z-10 m-auto rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                    +{slides.length - 5} more
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        on={{ view: ({ index: i }) => setIndex(i) }}
      />
    </>
  )
}
