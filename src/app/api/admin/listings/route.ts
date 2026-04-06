import { NextResponse } from 'next/server'

import { isAdminEmail } from '@/lib/admin'
import { getSupabaseAdmin, hasSupabaseAdminEnv } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const { adminEmail, listingId, action, reason } = await request.json()

    if (!isAdminEmail(adminEmail || '')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    if (!listingId || !['flag', 'remove', 'restore'].includes(action)) {
      return NextResponse.json({ error: 'Invalid moderation action.' }, { status: 400 })
    }

    if (!hasSupabaseAdminEnv()) {
      return NextResponse.json({ error: 'Supabase admin configuration is missing.' }, { status: 503 })
    }

    const updates = action === 'flag'
      ? { is_flagged: true, flag_reason: reason || 'Flagged by admin.' }
      : action === 'remove'
        ? { moderation_status: 'removed', is_flagged: true, flag_reason: reason || 'Removed by admin.' }
        : { moderation_status: 'active', is_flagged: false, flag_reason: null }

    const { error } = await getSupabaseAdmin()
      .from('listings')
      .update(updates)
      .eq('id', listingId)

    if (error) {
      throw error
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error updating listing moderation:', error)
    return NextResponse.json({ error: 'Unable to update listing moderation.' }, { status: 500 })
  }
}