'use client'

import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { initPosthog } from '@/lib/analytics'

/**
 * Mounts Vercel Analytics, Speed Insights, and PostHog. Each is a no-op
 * until the corresponding env var / project setting is wired:
 * - Vercel Analytics + Speed Insights: auto when deployed on Vercel
 * - PostHog: requires NEXT_PUBLIC_POSTHOG_KEY (+ optional NEXT_PUBLIC_POSTHOG_HOST)
 */
export function AnalyticsProviders() {
  useEffect(() => {
    initPosthog()
  }, [])

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
