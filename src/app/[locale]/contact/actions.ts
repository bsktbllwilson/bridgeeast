'use server'

import { Resend } from 'resend'
import { getSupabaseAdmin, hasSupabaseAdminEnv } from '@/lib/supabase-admin'

const TOPICS = ['Buying', 'Selling', 'Membership', 'Partnership', 'Press', 'Other'] as const
type Topic = (typeof TOPICS)[number]

export interface ContactSubmission {
  name: string
  email: string
  topic: string
  message: string
}

export interface ContactResult {
  ok: boolean
  error?: string
}

function isTopic(value: string): value is Topic {
  return (TOPICS as readonly string[]).includes(value)
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function submitContactMessage(input: ContactSubmission): Promise<ContactResult> {
  const name = input.name?.trim() ?? ''
  const email = input.email?.trim() ?? ''
  const topic = input.topic?.trim() ?? ''
  const message = input.message?.trim() ?? ''

  if (name.length < 2 || name.length > 200) {
    return { ok: false, error: 'Please enter your name.' }
  }
  if (!isValidEmail(email) || email.length > 320) {
    return { ok: false, error: 'Please enter a valid email.' }
  }
  if (!isTopic(topic)) {
    return { ok: false, error: 'Please choose a topic.' }
  }
  if (message.length < 10 || message.length > 5000) {
    return { ok: false, error: 'Message must be 10–5000 characters.' }
  }

  if (hasSupabaseAdminEnv()) {
    try {
      const admin = getSupabaseAdmin()
      const { error } = await admin
        .from('contact_messages')
        .insert({ name, email, topic, message })
      if (error) {
        console.error('contact_messages insert failed', error)
        return { ok: false, error: 'Could not save your message. Please try again.' }
      }
    } catch (err) {
      console.error('contact admin client error', err)
      return { ok: false, error: 'Could not save your message. Please try again.' }
    }
  } else {
    console.warn('Supabase admin env missing — contact submission not persisted.')
  }

  const resendKey = process.env.RESEND_API_KEY
  const adminTo = process.env.ADMIN_NOTIFICATIONS_EMAIL
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'Pass The Plate <hello@passtheplate.store>'

  if (resendKey && adminTo) {
    try {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: fromAddress,
        to: adminTo,
        replyTo: email,
        subject: `[Contact · ${topic}] ${name}`,
        text: `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`,
      })
    } catch (err) {
      console.error('contact admin email failed (non-fatal)', err)
    }
  } else {
    console.warn('RESEND_API_KEY or ADMIN_NOTIFICATIONS_EMAIL missing — admin email skipped.')
  }

  return { ok: true }
}
