'use server'

import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { createSupabaseServerClient, hasSupabaseAuthEnv } from '@/lib/supabase-server'
import { hasSupabaseAdminEnv } from '@/lib/supabase-admin'

const ALLOWED_KINDS = new Set(['bank_statement', 'sba_pre_qual'])
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
])

export interface VerifyResult {
  ok: boolean
  error?: string
}

export async function submitProofOfFundsAction(formData: FormData): Promise<VerifyResult> {
  if (!hasSupabaseAuthEnv()) return { ok: false, error: 'Auth is not configured.' }

  const file = formData.get('file')
  const kind = String(formData.get('kind') ?? '')

  if (!ALLOWED_KINDS.has(kind)) return { ok: false, error: 'Pick a document type.' }
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Attach a PDF or image.' }
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: 'File must be 10 MB or smaller.' }
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return { ok: false, error: 'Use a PDF, PNG, JPG, or WEBP.' }
  }

  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in to upload proof of funds.' }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('auth_user_id', user.id)
    .maybeSingle()
  if (profileError || !profile) {
    console.error('verify: profile lookup failed', profileError)
    return { ok: false, error: 'Profile not found. Try signing out and back in.' }
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const path = `${user.id}/${kind}-${Date.now()}.${ext}`
  const bytes = new Uint8Array(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from('proof_of_funds')
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    })
  if (uploadError) {
    console.error('verify: upload failed', uploadError)
    return { ok: false, error: 'Upload failed. Try again.' }
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      proof_of_funds_path: path,
      proof_of_funds_kind: kind,
      proof_of_funds_status: 'pending',
      proof_of_funds_submitted_at: new Date().toISOString(),
    })
    .eq('auth_user_id', user.id)
  if (updateError) {
    console.error('verify: profile update failed', updateError)
    return { ok: false, error: 'Saved file, but profile update failed. Contact support.' }
  }

  // Best-effort admin notification.
  const resendKey = process.env.RESEND_API_KEY
  const adminTo = process.env.ADMIN_NOTIFICATIONS_EMAIL
  if (resendKey && adminTo) {
    try {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Pass The Plate <hello@passtheplate.store>',
        to: adminTo,
        subject: `[Verify] Proof of funds submitted by ${profile.email}`,
        text: `User: ${profile.full_name ?? '(no name)'} <${profile.email}>\nDocument type: ${kind}\nStorage path: proof_of_funds/${path}\n\nReview in Supabase, then flip profiles.proof_of_funds_status to 'verified' or 'rejected'.`,
      })
    } catch (err) {
      console.error('verify: admin email failed (non-fatal)', err)
    }
  }

  // Optional: also let admin client write a verification audit later. For v1 we
  // only need the profile flip + admin email.
  if (!hasSupabaseAdminEnv()) {
    console.warn('verify: admin env not set — relying on user RLS only.')
  }

  revalidatePath('/account', 'page')
  revalidatePath('/verify', 'page')

  return { ok: true }
}
