import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FindYourNextBigDeal } from '@/components/FindYourNextBigDeal'
import { BuySellSplit } from '@/components/BuySellSplit'

export const metadata = {
  title: 'Who We Are — Pass The Plate',
  description:
    'Pass The Plate connects the next generation of operators with aging Asian F&B owners ready for transition. Mission, story, and team.',
}

const STATS = [
  { value: '$240B', label: 'Asian F&B economy in transition' },
  { value: '12K+', label: 'Asian-owned restaurants reaching transition age' },
  { value: '90+', label: 'Vetted partners across legal, finance, real estate' },
  { value: '0%', label: 'Upfront seller fees — success-only model' },
]

const TIMELINE = [
  {
    year: '2023',
    title: 'The hallway conversations',
    body: 'After watching family friends close decades-old restaurants for nothing, the founders started compiling a private list of operators looking to transition — and operators looking to take over.',
  },
  {
    year: '2024',
    title: 'Pass The Plate, v0',
    body: 'A 200-person Notion table grew into a private Slack, then a directory. The first matched deal closed in September with three partners coordinated across legal, immigration, and lender.',
  },
  {
    year: '2025',
    title: 'Public launch',
    body: 'We open the marketplace, partner directory, and Playbook to the public. Membership tiers fund the operations team while keeping listings free and transition fees success-only.',
  },
  {
    year: '2026',
    title: 'Coast to coast',
    body: 'Active deal flow across NYC, LA, the Bay Area, Houston, and Atlanta — with bilingual partner coverage in Mandarin, Cantonese, Korean, and Vietnamese.',
  },
]

const TEAM = [
  {
    name: 'Wilson Chen',
    role: 'Co-founder & CEO',
    bio: 'Grew up behind the line at his family’s restaurant in Flushing. Previously product at a fintech serving SMB owners.',
    gradient: 'linear-gradient(135deg,#FCE16E 0%,#D85A30 100%)',
  },
  {
    name: 'Mina Park',
    role: 'Co-founder & Head of Operator Network',
    bio: 'Spent six years building partner networks for an immigration law firm. Speaks Korean and runs the broker community.',
    gradient: 'linear-gradient(135deg,#1f2937 0%,#374151 100%)',
  },
  {
    name: 'Daniel Tran',
    role: 'Founding Engineer',
    bio: 'Ex–Stripe, ex–Toast. Building the marketplace, valuation tools, and the data we need to make a transition feel routine.',
    gradient: 'linear-gradient(135deg,#7c2d12 0%,#3b1f10 100%)',
  },
]

const PRESS = ['World Journal', 'The Korea Times', 'Eater', 'Restaurant Dive', 'Sing Tao Daily', 'Người Việt']

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />

      {/* Hero */}
      <section className="container pt-24 md:pt-32 pb-12 md:pb-16 text-center">
        <p className="text-sm md:text-base tracking-widest uppercase text-gray-600 mb-5">
          About Pass The Plate
        </p>
        <h1 className="font-display text-5xl md:text-7xl xl:text-[120px] font-bold leading-none">
          Who We Are
        </h1>
      </section>

      {/* Mission + Polaroid stack */}
      <section className="container pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="space-y-6 text-gray-800 text-base md:text-lg leading-relaxed">
            <p>
              The U.S. Asian food economy is worth roughly <strong>$240 billion</strong> — and a
              quiet generational transition is already underway. The founders who built it through
              the 80s and 90s are reaching retirement, and most of them have nowhere to go but a
              fragmented network of brokers, family WeChat groups, and offline word-of-mouth.
            </p>
            <p>
              Pass The Plate exists because those operators deserve better. Better visibility for
              the businesses they spent their lives building. Better access to qualified buyers,
              honest valuations, and bilingual professionals who actually understand a Sichuan
              hotpot lease or a banh mi shop’s cash-flow structure.
            </p>
            <p>
              We charge nothing to list, nothing to browse, and nothing until a deal closes. The
              membership tier is for the operators and search funds running multiple deals at once;
              the success fee at close keeps the lights on. Everything else — the Playbook, the
              partner directory, the community — is free, on purpose.
            </p>
          </div>

          {/* Polaroid stack (gradient placeholders until /public assets land) */}
          <div className="relative h-[480px] md:h-[560px]">
            <PolaroidPlaceholder
              label="Family table"
              gradient="linear-gradient(135deg,#FCE16E 0%,#FAF7EE 100%)"
              className="absolute top-0 left-4 md:left-12 -rotate-6 w-56 md:w-72 h-72 md:h-96"
            />
            <PolaroidPlaceholder
              label="The team"
              gradient="linear-gradient(135deg,#1f2937 0%,#374151 100%)"
              className="absolute top-20 right-0 rotate-3 w-56 md:w-72 h-72 md:h-96"
            />
            <PolaroidPlaceholder
              label="On location"
              gradient="linear-gradient(135deg,#D85A30 0%,#7C2D12 100%)"
              className="absolute bottom-0 left-1/4 -rotate-3 w-56 md:w-72 h-72 md:h-96"
            />
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-playbook-yellow">
        <div className="container py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl md:text-6xl font-bold leading-none mb-3">
                {s.value}
              </div>
              <p className="text-sm md:text-base text-gray-800">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story timeline */}
      <section className="container section">
        <h2 className="font-display text-4xl md:text-6xl font-bold text-center mb-14">
          Our Story
        </h2>
        <div className="max-w-4xl mx-auto space-y-10">
          {TIMELINE.map((m) => (
            <div
              key={m.year}
              className="grid grid-cols-[100px_1fr] md:grid-cols-[160px_1fr] gap-6 md:gap-10 border-b border-black/10 pb-8 last:border-b-0"
            >
              <div className="font-display text-3xl md:text-5xl font-bold text-accent">
                {m.year}
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold mb-2">{m.title}</h3>
                <p className="text-gray-700 leading-relaxed">{m.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-white border-y border-black/5">
        <div className="container py-16 md:py-24">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-center mb-14">
            The Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TEAM.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl bg-cream border border-black/5 overflow-hidden flex flex-col"
              >
                <div className="aspect-square w-full" style={{ background: t.gradient }} />
                <div className="p-7 flex-grow">
                  <h3 className="font-display text-2xl font-bold mb-1">{t.name}</h3>
                  <p className="text-sm font-medium text-accent mb-4">{t.role}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press strip */}
      <section className="container py-14">
        <p className="text-center text-xs md:text-sm uppercase tracking-widest text-gray-600 mb-6">
          As Featured In
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PRESS.map((name) => (
            <span
              key={name}
              className="font-display text-lg md:text-xl text-gray-700 opacity-70 hover:opacity-100 transition-opacity"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
      <Footer />
    </main>
  )
}

function PolaroidPlaceholder({
  label,
  gradient,
  className,
}: {
  label: string
  gradient: string
  className?: string
}) {
  return (
    <figure
      className={`relative bg-white p-3 rounded-md shadow-xl border border-black/5 flex flex-col ${
        className ?? ''
      }`}
    >
      <div className="flex-1" style={{ background: gradient }} />
      <figcaption className="pt-3 pb-1 text-center text-xs text-gray-700 font-display italic">
        {label}
      </figcaption>
    </figure>
  )
}
