import { createSupabaseServerClient, hasSupabaseAuthEnv } from './supabase-server'

export interface CurrentProfile {
  id: string
  auth_user_id: string
  email: string
  full_name: string | null
  business_name: string | null
  role: 'buyer' | 'seller' | 'both'
  phone: string | null
  preferred_language: 'en' | 'zh' | 'ko' | 'vi'
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  proof_of_funds_status: 'none' | 'pending' | 'verified' | 'rejected'
  proof_of_funds_kind: 'bank_statement' | 'sba_pre_qual' | null
  membership_tier: 'first_bite' | 'chefs_table' | 'full_menu'
  membership_status: 'active' | 'past_due' | 'canceled'
  membership_current_period_end: string | null
  stripe_customer_id: string | null
}

export async function getCurrentUser() {
  if (!hasSupabaseAuthEnv()) return null
  try {
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) return null
    return data.user
  } catch (err) {
    console.error('getCurrentUser failed', err)
    return null
  }
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  if (!hasSupabaseAuthEnv()) return null
  try {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, auth_user_id, email, full_name, business_name, role, phone, preferred_language, verification_status, proof_of_funds_status, proof_of_funds_kind, membership_tier, membership_status, membership_current_period_end, stripe_customer_id'
      )
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('profile lookup failed', error)
      return null
    }
    return (data as CurrentProfile | null) ?? null
  } catch (err) {
    console.error('getCurrentProfile failed', err)
    return null
  }
}

export interface SessionHint {
  email: string
  full_name: string | null
  initial: string
  role: 'buyer' | 'seller' | 'both'
}

export function toSessionHint(profile: CurrentProfile | null, email?: string | null): SessionHint | null {
  if (!profile && !email) return null
  const resolvedEmail = profile?.email ?? email ?? ''
  if (!resolvedEmail) return null
  const initial = (profile?.full_name?.trim()?.[0] ?? resolvedEmail[0] ?? '?').toUpperCase()
  return {
    email: resolvedEmail,
    full_name: profile?.full_name ?? null,
    initial,
    role: profile?.role ?? 'buyer',
  }
}
