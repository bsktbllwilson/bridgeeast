import { NextResponse } from 'next/server'

import { isAdminEmail } from '@/lib/admin'
import { getSupabaseAdmin, hasSupabaseAdminEnv } from '@/lib/supabase-admin'

async function sendVerificationEmail(email: string, fullName: string, decision: 'verified' | 'rejected') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return { skipped: true, reason: 'Missing Supabase configuration.' }
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/send-verification-email`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, fullName, decision }),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.error || 'Edge Function email dispatch failed.')
  }

  return payload
}

export async function POST(request: Request) {
  try {
    const { adminEmail, profileId, decision } = await request.json()

    if (!isAdminEmail(adminEmail || '')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    if (!profileId || !['verified', 'rejected'].includes(decision)) {
      return NextResponse.json({ error: 'Invalid verification decision.' }, { status: 400 })
    }

    if (!hasSupabaseAdminEnv()) {
      return NextResponse.json({ error: 'Supabase admin configuration is missing.' }, { status: 503 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .eq('id', profileId)
      .single()

    if (profileError || !profile) {
      throw profileError || new Error('Profile not found.')
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        verification_status: decision,
        verification_reviewed_at: new Date().toISOString(),
      })
      .eq('id', profileId)

    if (updateError) {
      throw updateError
    }

    const emailResult = await sendVerificationEmail(profile.email, profile.full_name, decision)

    return NextResponse.json({ ok: true, emailResult })
  } catch (error) {
    console.error('Error updating verification decision:', error)
    return NextResponse.json({ error: 'Unable to update verification status.' }, { status: 500 })
  }
}