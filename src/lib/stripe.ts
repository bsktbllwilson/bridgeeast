import 'server-only'

import Stripe from 'stripe'

let cached: Stripe | null = null

// Lazy-init so a missing key doesn't crash the build / unrelated routes.
// Call sites should check via `isStripeConfigured()` first when they
// want to gracefully degrade.
export function getStripe(): Stripe {
  if (cached) return cached
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  cached = new Stripe(key, { typescript: true })
  return cached
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

export type Tier = 'first_bite' | 'chefs_table' | 'full_menu'

const TIER_TO_PRICE_ENV: Record<Exclude<Tier, 'first_bite'>, string> = {
  chefs_table: 'STRIPE_PRICE_CHEFS_TABLE',
  full_menu: 'STRIPE_PRICE_FULL_MENU',
}

export function priceIdForTier(tier: Exclude<Tier, 'first_bite'>): string | null {
  const envKey = TIER_TO_PRICE_ENV[tier]
  return process.env[envKey] || null
}

export function tierForPriceId(priceId: string | null | undefined): Tier | null {
  if (!priceId) return null
  if (priceId === process.env.STRIPE_PRICE_CHEFS_TABLE) return 'chefs_table'
  if (priceId === process.env.STRIPE_PRICE_FULL_MENU) return 'full_menu'
  return null
}
