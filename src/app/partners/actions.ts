'use server'

import { z } from 'zod'

import { getCurrentProfile } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  partnerId: z.string().uuid(),
  subject: z.string().trim().min(1, 'Subject is required').max(160),
  message: z.string().trim().min(10, 'Please write at least a sentence.').max(4000),
  senderName: z.string().trim().min(1, 'Name is required').max(120),
  senderEmail: z.string().trim().toLowerCase().email('Enter a valid email').max(254),
})

export type SendMessageResult = { ok: true } | { ok: false; error: string }

export async function sendPartnerMessage(formData: FormData): Promise<SendMessageResult> {
  const parsed = schema.safeParse({
    partnerId: formData.get('partnerId'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    senderName: formData.get('senderName'),
    senderEmail: formData.get('senderEmail'),
  })
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { ok: false, error: first?.message ?? 'Invalid input.' }
  }
  const data = parsed.data

  const profile = await getCurrentProfile()

  // Use the admin client because partner_inquiries RLS requires
  // sender_id = auth.uid() on insert. Public messages should still
  // work, so we go through service role and stamp sender_id only when
  // the visitor is signed in.
  const admin = createAdminClient()
  const { error } = await admin.from('partner_inquiries').insert({
    partner_id: data.partnerId,
    sender_id: profile?.id ?? null,
    message: `Subject: ${data.subject}\nFrom: ${data.senderName} <${data.senderEmail}>\n\n${data.message}`,
  })
  if (error) {
    console.error('[sendPartnerMessage] insert error', error)
    return { ok: false, error: 'Could not send your message. Try again.' }
  }

  await emailPartner(data).catch((err) => console.error('[sendPartnerMessage] email error', err))

  return { ok: true }
}

async function emailPartner(data: z.infer<typeof schema>) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) return

  const admin = createAdminClient()
  const { data: partner } = await admin
    .from('partners')
    .select('email, full_name')
    .eq('id', data.partnerId)
    .maybeSingle()
  if (!partner?.email) return

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  await resend.emails.send({
    from,
    to: partner.email,
    replyTo: data.senderEmail,
    subject: `[Pass The Plate] ${data.subject}`,
    text: [
      `Hi${partner.full_name ? ` ${partner.full_name}` : ''},`,
      ``,
      `${data.senderName} reached out via your Pass The Plate listing:`,
      ``,
      data.message,
      ``,
      `Reply directly to this email to reach ${data.senderName} at ${data.senderEmail}.`,
      ``,
      `— Pass The Plate`,
    ].join('\n'),
  })
}
