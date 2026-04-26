import 'server-only'

import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'

export type Profile = Tables<'profiles'>

export async function getCurrentUser(): Promise<User | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) return null
  return data
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')
  return user
}
