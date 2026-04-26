'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { isLocale, type Locale } from '@/lib/locales'

const emailSchema = z.string().trim().toLowerCase().email()

export type NewsletterResult = { ok: true } | { ok: false; error: string }

export async function subscribeNewsletter(
  source: string,
  formData: FormData,
): Promise<NewsletterResult> {
  const parsed = emailSchema.safeParse(formData.get('email'))
  if (!parsed.success) {
    return { ok: false, error: 'Please enter a valid email.' }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: parsed.data, source })

  // Postgres unique_violation — already subscribed; treat as success.
  if (error && error.code !== '23505') {
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

export async function setLocaleCookie(locale: Locale): Promise<void> {
  if (!isLocale(locale)) return

  cookies().set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  revalidatePath('/', 'layout')
}
