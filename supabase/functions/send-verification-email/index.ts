import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const resendApiKey = Deno.env.get('RESEND_API_KEY')
const sender = Deno.env.get('VERIFICATION_EMAIL_FROM') || 'BridgeEast <noreply@bridgeeast.com>'

serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { email, fullName, decision } = await request.json()

  if (!email || !decision) {
    return Response.json({ error: 'Missing email or decision.' }, { status: 400 })
  }

  const subject = decision === 'verified'
    ? 'Your BridgeEast seller profile is now verified'
    : 'Your BridgeEast verification request needs updates'

  const html = decision === 'verified'
    ? `<p>Hi ${fullName || 'there'},</p><p>Your seller profile has been approved and now carries the verified badge on BridgeEast.</p><p>You can continue publishing listings with the new verification mark visible to buyers and partners.</p>`
    : `<p>Hi ${fullName || 'there'},</p><p>Your seller verification request was reviewed, but we could not approve it in its current form.</p><p>Please return to your seller profile, review your uploaded documents, and submit a new verification request.</p>`

  if (!resendApiKey) {
    return Response.json({ delivered: false, skipped: true, reason: 'Missing RESEND_API_KEY.' })
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: sender,
      to: [email],
      subject,
      html,
    }),
  })

  const payload = await resendResponse.json()

  if (!resendResponse.ok) {
    return Response.json({ delivered: false, error: payload }, { status: 500 })
  }

  return Response.json({ delivered: true, payload })
})