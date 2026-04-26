'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient, hasSupabaseAuthEnv } from '@/lib/supabase-server'

export interface AuthFormResult {
  ok: boolean
  error?: string
  message?: string
}

const VALID_ROLES = new Set(['buyer', 'seller', 'both'])

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function buildCallbackUrl(next: string | null): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://passtheplate.store'
  const search = next ? `?next=${encodeURIComponent(next)}` : ''
  return `${base}/auth/callback${search}`
}

function safeNext(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return null
  if (!value.startsWith('/') || value.startsWith('//')) return null
  return value
}

export async function signInWithPasswordAction(
  _prev: AuthFormResult | undefined,
  formData: FormData
): Promise<AuthFormResult> {
  if (!hasSupabaseAuthEnv()) return { ok: false, error: 'Auth is not configured.' }

  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = safeNext(formData.get('next'))

  if (!isEmail(email)) return { ok: false, error: 'Enter a valid email.' }
  if (password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' }

  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { ok: false, error: 'Invalid email or password.' }
  }
  redirect(next ?? '/account')
}

export async function signInWithMagicLinkAction(
  _prev: AuthFormResult | undefined,
  formData: FormData
): Promise<AuthFormResult> {
  if (!hasSupabaseAuthEnv()) return { ok: false, error: 'Auth is not configured.' }

  const email = String(formData.get('email') ?? '').trim()
  const next = safeNext(formData.get('next'))
  if (!isEmail(email)) return { ok: false, error: 'Enter a valid email.' }

  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: buildCallbackUrl(next) },
  })
  if (error) {
    console.error('magic link send failed', error)
    return { ok: false, error: "Couldn't send the magic link. Try again." }
  }
  return { ok: true, message: 'Check your inbox for a sign-in link.' }
}

export async function signUpAction(
  _prev: AuthFormResult | undefined,
  formData: FormData
): Promise<AuthFormResult> {
  if (!hasSupabaseAuthEnv()) return { ok: false, error: 'Auth is not configured.' }

  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const role = String(formData.get('role') ?? 'buyer')
  const fullName = String(formData.get('full_name') ?? '').trim()
  const next = safeNext(formData.get('next'))

  if (!isEmail(email)) return { ok: false, error: 'Enter a valid email.' }
  if (password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' }
  if (!VALID_ROLES.has(role)) return { ok: false, error: 'Pick what brings you here.' }

  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: buildCallbackUrl(next),
      data: {
        role,
        full_name: fullName || null,
      },
    },
  })
  if (error) {
    return { ok: false, error: error.message }
  }
  return {
    ok: true,
    message: 'Check your email to confirm your account.',
  }
}

export async function requestPasswordResetAction(
  _prev: AuthFormResult | undefined,
  formData: FormData
): Promise<AuthFormResult> {
  if (!hasSupabaseAuthEnv()) return { ok: false, error: 'Auth is not configured.' }

  const email = String(formData.get('email') ?? '').trim()
  if (!isEmail(email)) return { ok: false, error: 'Enter a valid email.' }

  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: buildCallbackUrl('/account'),
  })
  if (error) {
    console.error('password reset failed', error)
    return { ok: false, error: "Couldn't send the reset link. Try again." }
  }
  return {
    ok: true,
    message: "If that email is in our system, we've sent a reset link.",
  }
}

export async function signOutAction(): Promise<void> {
  if (!hasSupabaseAuthEnv()) {
    redirect('/')
  }
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
