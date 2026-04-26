'use client'

import posthog from 'posthog-js'

let posthogReady = false

export function initPosthog() {
  if (typeof window === 'undefined') return
  if (posthogReady) return
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
  if (!key) return
  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
    persistence: 'localStorage+cookie',
  })
  posthogReady = true
}

function safeCapture(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!posthogReady) return
  try {
    posthog.capture(event, properties)
  } catch (err) {
    console.warn('posthog capture failed', err)
  }
}

export function identifyUser(distinctId: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!posthogReady) return
  try {
    posthog.identify(distinctId, properties)
  } catch (err) {
    console.warn('posthog identify failed', err)
  }
}

export function resetIdentity() {
  if (typeof window === 'undefined') return
  if (!posthogReady) return
  posthog.reset()
}

// ---- Named events tracked across the product ----

export function trackListingView(props: { listingId: string; cuisine?: string; city?: string }) {
  safeCapture('listing_view', props)
}

export function trackListingInquiry(props: { listingId: string; sellerProfileId?: string }) {
  safeCapture('listing_inquiry', props)
}

export function trackSignup(props: { role: 'buyer' | 'seller' | 'both'; method: 'password' | 'magic' | 'oauth' }) {
  safeCapture('signup', props)
}

export function trackMembershipStarted(props: { tier: 'first_bite' | 'chefs_table' | 'full_menu' }) {
  safeCapture('membership_started', props)
}

export function trackValuationCompleted(props: { listingId?: string; askingPrice?: number }) {
  safeCapture('valuation_completed', props)
}

export function trackPartnerApplicationSubmitted(props: { specialty: string }) {
  safeCapture('partner_application_submitted', props)
}
