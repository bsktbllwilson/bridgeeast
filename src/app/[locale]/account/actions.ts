'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient, hasSupabaseAuthEnv } from '@/lib/supabase-server'

export interface AccountResult {
  ok: boolean
  error?: string
  message?: string
}

const VALID_LANGS = new Set(['en', 'zh', 'ko', 'vi'])

export async function updateProfileAction(formData: FormData): Promise<AccountResult> {
  if (!hasSupabaseAuthEnv()) return { ok: false, error: 'Auth is not configured.' }

  const fullName = String(formData.get('full_name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const preferredLanguage = String(formData.get('preferred_language') ?? 'en')

  if (fullName.length > 200) return { ok: false, error: 'Name is too long.' }
  if (phone.length > 50) return { ok: false, error: 'Phone is too long.' }
  if (!VALID_LANGS.has(preferredLanguage)) {
    return { ok: false, error: 'Pick a supported language.' }
  }

  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName || null,
      phone: phone || null,
      preferred_language: preferredLanguage,
    })
    .eq('auth_user_id', user.id)

  if (error) {
    console.error('account: profile update failed', error)
    return { ok: false, error: 'Could not save profile.' }
  }

  revalidatePath('/account', 'page')
  return { ok: true, message: 'Saved.' }
}

export async function changePasswordAction(formData: FormData): Promise<AccountResult> {
  if (!hasSupabaseAuthEnv()) return { ok: false, error: 'Auth is not configured.' }

  const password = String(formData.get('password') ?? '')
  if (password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' }
  }

  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    console.error('account: password update failed', error)
    return { ok: false, error: error.message }
  }
  return { ok: true, message: 'Password updated.' }
}

export async function openBillingPortalAction(): Promise<AccountResult> {
  // Stripe wiring lands in a separate change. For now we return a friendly
  // not-configured response so the UI can show a helpful message.
  return {
    ok: false,
    error:
      'Billing portal is not connected yet. Email hello@passtheplate.store to update your plan.',
  }
}
