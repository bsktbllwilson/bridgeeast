import { NextResponse, type NextRequest } from 'next/server'
import type Stripe from 'stripe'

import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe, tierForPriceId, type Tier } from '@/lib/stripe'

// Stripe needs the raw body to verify the signature.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = req.headers.get('stripe-signature')
  if (!secret || !signature) {
    return new NextResponse('Webhook not configured', { status: 503 })
  }

  const stripe = getStripe()
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed', err)
    return new NextResponse('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripe, event.data.object)
        break
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChanged(event.data.object)
        break
      default:
        // Ignore other events for now.
        break
    }
  } catch (err) {
    console.error(`[stripe/webhook] handler error for ${event.type}`, err)
    // Returning 500 will make Stripe retry — desired here.
    return new NextResponse('Handler error', { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// --------------------------------------------------------------------------
// Handlers
// --------------------------------------------------------------------------

async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  const profileId = (session.metadata?.profile_id ?? session.client_reference_id) || null
  if (!profileId) {
    console.warn('[stripe/webhook] checkout.session.completed without profile_id', session.id)
    return
  }
  if (typeof session.subscription !== 'string') {
    console.warn('[stripe/webhook] checkout.session.completed without subscription', session.id)
    return
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription)
  await upsertMembership(profileId, subscription, (session.metadata?.tier ?? null) as Tier | null)
}

async function handleSubscriptionChanged(subscription: Stripe.Subscription) {
  const profileId = (subscription.metadata?.profile_id as string | undefined) ?? null
  if (!profileId) {
    console.warn('[stripe/webhook] subscription event without profile_id', subscription.id)
    return
  }
  await upsertMembership(
    profileId,
    subscription,
    (subscription.metadata?.tier ?? null) as Tier | null,
  )
}

// --------------------------------------------------------------------------
// DB upsert
// --------------------------------------------------------------------------

const VALID_STATUSES = ['active', 'past_due', 'canceled', 'trialing'] as const
type MembershipStatus = (typeof VALID_STATUSES)[number]

function mapStatus(s: Stripe.Subscription.Status): MembershipStatus {
  switch (s) {
    case 'active':
    case 'trialing':
    case 'past_due':
    case 'canceled':
      return s
    case 'incomplete':
    case 'incomplete_expired':
    case 'unpaid':
    case 'paused':
      return 'past_due'
    default:
      return 'past_due'
  }
}

async function upsertMembership(
  profileId: string,
  subscription: Stripe.Subscription,
  tierFromMetadata: Tier | null,
) {
  const item = subscription.items.data[0]
  const tier = tierFromMetadata ?? tierForPriceId(item?.price.id) ?? 'chefs_table'

  // Stripe SDK 22 moved current_period_end off the Subscription onto each
  // subscription item. Read from the first item; for our single-item
  // subscriptions this is equivalent.
  const periodEndUnix = item?.current_period_end ?? null
  const periodEnd = periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null

  const customerId =
    typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id

  const admin = createAdminClient()
  const { error } = await admin.from('memberships').upsert(
    {
      profile_id: profileId,
      tier,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      current_period_end: periodEnd,
      status: mapStatus(subscription.status),
    },
    { onConflict: 'profile_id' },
  )
  if (error) throw error
}
