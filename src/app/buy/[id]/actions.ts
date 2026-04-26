'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { getCurrentProfile } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const inputSchema = z.object({
  listingId: z.string().uuid(),
  message: z.string().trim().min(10, 'Please write at least a sentence about your interest.'),
})

export type InquiryResult = { ok: true } | { ok: false; error: string }

export async function submitInquiry(formData: FormData): Promise<InquiryResult> {
  const parsed = inputSchema.safeParse({
    listingId: formData.get('listingId'),
    message: formData.get('message'),
  })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  }

  const profile = await getCurrentProfile()
  if (!profile) return { ok: false, error: 'You must be signed in to send an inquiry.' }
  if (!profile.proof_of_funds_verified) {
    return { ok: false, error: 'Your account must be verified before contacting sellers.' }
  }

  const { listingId, message } = parsed.data
  const supabase = createClient()

  // Insert under the buyer's auth (RLS: buyer can insert with buyer_id = auth.uid()).
  const { error: insertError } = await supabase
    .from('listing_inquiries')
    .insert({ listing_id: listingId, buyer_id: profile.id, message })
  if (insertError) {
    console.error('[submitInquiry] insert error', insertError)
    return { ok: false, error: 'Could not submit your inquiry. Try again.' }
  }

  // Bump inquiry_count via SECURITY DEFINER RPC.
  await supabase.rpc('increment_listing_inquiries', { p_id: listingId })

  // Send seller email (best-effort). Service role lets us read across profiles + listings.
  await sendSellerEmail({ listingId, buyerEmail: profile.email, message }).catch((err) => {
    console.error('[submitInquiry] email error', err)
  })

  revalidatePath(`/buy/${listingId}`)
  return { ok: true }
}

async function sendSellerEmail({
  listingId,
  buyerEmail,
  message,
}: {
  listingId: string
  buyerEmail: string | null
  message: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) return // no-op when Resend isn't configured

  const admin = createAdminClient()
  const { data: listing } = await admin
    .from('listings')
    .select('title, seller_id')
    .eq('id', listingId)
    .maybeSingle()
  if (!listing?.seller_id) return // unowned listing — skip

  const { data: seller } = await admin
    .from('profiles')
    .select('email, full_name')
    .eq('id', listing.seller_id)
    .maybeSingle()
  if (!seller?.email) return

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://passtheplate.store'

  await resend.emails.send({
    from,
    to: seller.email,
    replyTo: buyerEmail ?? undefined,
    subject: `New inquiry on your ${listing.title} listing`,
    text: [
      `Hi${seller.full_name ? ` ${seller.full_name}` : ''},`,
      ``,
      `A buyer just sent an inquiry on your "${listing.title}" listing on Pass The Plate.`,
      ``,
      `Their message:`,
      `${message}`,
      ``,
      `Reply directly to this email to reach the buyer, or view the inquiry in your dashboard:`,
      `${siteUrl}/sell/inquiries`,
      ``,
      `— Pass The Plate`,
    ].join('\n'),
  })
}
