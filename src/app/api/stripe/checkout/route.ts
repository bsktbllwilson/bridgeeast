import { NextResponse, type NextRequest } from 'next/server'

import { getCurrentUser } from '@/lib/auth'
import { getStripe, isStripeConfigured, priceIdForTier, type Tier } from '@/lib/stripe'

const PAID_TIERS: Tier[] = ['chefs_table', 'full_menu']

function isPaidTier(value: unknown): value is Exclude<Tier, 'first_bite'> {
  return typeof value === 'string' && (PAID_TIERS as string[]).includes(value)
}

export async function POST(req: NextRequest) {
  // Form posts come through with content-type application/x-www-form-urlencoded.
  // Handle both that and JSON for flexibility.
  let tier: unknown
  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = (await req.json().catch(() => ({}))) as { tier?: string }
    tier = body.tier
  } else {
    const form = await req.formData()
    tier = form.get('tier')
  }

  if (!isPaidTier(tier)) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin
  const user = await getCurrentUser()
  if (!user) {
    const next = `/membership?tier=${tier}`
    return NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(next)}`, siteUrl), {
      status: 303,
    })
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Payments are not configured. Set STRIPE_SECRET_KEY in env.' },
      { status: 503 },
    )
  }

  const priceId = priceIdForTier(tier)
  if (!priceId) {
    return NextResponse.json(
      { error: `No Stripe price configured for tier "${tier}".` },
      { status: 503 },
    )
  }

  const stripe = getStripe()

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email ?? undefined,
      // Stash these so the webhook can identify the buyer + tier without
      // re-deriving them from the price ID.
      client_reference_id: user.id,
      metadata: { profile_id: user.id, tier },
      subscription_data: { metadata: { profile_id: user.id, tier } },
      success_url: `${siteUrl}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/membership`,
      allow_promotion_codes: true,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a session URL.' }, { status: 502 })
    }

    return NextResponse.redirect(session.url, { status: 303 })
  } catch (err) {
    console.error('[stripe/checkout] error', err)
    return NextResponse.json({ error: 'Could not start checkout.' }, { status: 502 })
  }
}
