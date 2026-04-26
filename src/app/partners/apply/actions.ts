'use server'

import { z } from 'zod'

import { createAdminClient } from '@/lib/supabase/admin'

// Empty form fields come through as "". Coerce them to undefined so
// .optional() works without requiring a special "" branch on every field.
const emptyToUndefined = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
  z.string().trim().optional(),
)

const SPECIALTIES = [
  'sba_lender',
  'immigration_attorney',
  'bilingual_broker',
  'accountant',
  'insurance',
  'other',
] as const

const schema = z.object({
  full_name: z.string().trim().min(1, 'Required').max(120),
  job_title: emptyToUndefined.pipe(z.string().max(120).optional()),
  phone: emptyToUndefined.pipe(z.string().max(40).optional()),
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(254),
  company: emptyToUndefined.pipe(z.string().max(160).optional()),
  website: z.preprocess((v) => {
    if (typeof v !== 'string' || v.trim() === '') return undefined
    const t = v.trim()
    return /^https?:\/\//i.test(t) ? t : `https://${t}`
  }, z.string().url('Enter a valid URL').max(300).optional()),
  address: emptyToUndefined.pipe(z.string().max(300).optional()),
  specialty: z.enum(SPECIALTIES, { errorMap: () => ({ message: 'Pick a specialty' }) }),
  referral_source: emptyToUndefined.pipe(z.string().max(300).optional()),
  bio: emptyToUndefined.pipe(z.string().max(2000).optional()),
})

export type ApplyResult = { ok: true } | { ok: false; error: string }

export async function submitPartnerApplication(formData: FormData): Promise<ApplyResult> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    const field = first?.path[0] ? `${String(first.path[0])}: ` : ''
    return { ok: false, error: `${field}${first?.message ?? 'Invalid form data.'}` }
  }
  const data = parsed.data

  // Use the service-role client because partners has no public INSERT
  // policy (only admins/self can write). Applications come from anon
  // visitors so we accept and store with approved=false; an admin
  // promotes to approved=true via the dashboard later.
  const admin = createAdminClient()
  const { error } = await admin.from('partners').insert({
    full_name: data.full_name,
    job_title: data.job_title ?? null,
    company: data.company ?? null,
    email: data.email,
    phone: data.phone ?? null,
    website: data.website ?? null,
    address: data.address ?? null,
    specialty: data.specialty,
    bio: data.bio ?? null,
    referral_source: data.referral_source ?? null,
    approved: false,
    featured: false,
  })

  if (error) {
    console.error('[partners/apply] insert error', error)
    return { ok: false, error: 'Could not submit your application. Try again.' }
  }

  // Best-effort admin notification.
  await notifyAdmin(data).catch((err) => console.error('[partners/apply] email error', err))

  return { ok: true }
}

async function notifyAdmin(data: z.infer<typeof schema>) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const adminEmail = process.env.ADMIN_NOTIFICATIONS_EMAIL
  if (!apiKey || !from || !adminEmail) return

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  const lines = [
    `Name:       ${data.full_name}`,
    `Email:      ${data.email}`,
    data.phone ? `Phone:      ${data.phone}` : null,
    data.company ? `Company:    ${data.company}` : null,
    data.job_title ? `Title:      ${data.job_title}` : null,
    data.website ? `Website:    ${data.website}` : null,
    data.address ? `Address:    ${data.address}` : null,
    `Specialty:  ${data.specialty}`,
    data.referral_source ? `Referral:   ${data.referral_source}` : null,
    '',
    data.bio ? `Bio:\n${data.bio}` : null,
  ].filter((l): l is string => l !== null)

  await resend.emails.send({
    from,
    to: adminEmail,
    replyTo: data.email,
    subject: `New partner application: ${data.full_name}`,
    text: `A new partner application just came in.\n\n${lines.join('\n')}\n\nReview at https://${process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '') ?? 'passtheplate.store'}/admin/partners\n`,
  })
}
