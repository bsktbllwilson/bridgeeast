import { NextResponse } from 'next/server'

import { getSupabaseAdmin } from '@/lib/supabase-admin'

const VERIFICATION_BUCKET = 'verification-documents'

async function uploadVerificationFile(profileId: string, label: string, file: File) {
  const supabaseAdmin = getSupabaseAdmin()
  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
  const path = `${profileId}/${label}-${Date.now()}-${crypto.randomUUID()}.${extension}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabaseAdmin.storage
    .from(VERIFICATION_BUCKET)
    .upload(path, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
    })

  if (error) {
    throw error
  }

  return path
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const profileId = formData.get('profileId')?.toString()
    const governmentId = formData.get('governmentId')
    const ownershipProof = formData.get('ownershipProof')
    const businessLicense = formData.get('businessLicense')

    if (!profileId || !(governmentId instanceof File) || !(ownershipProof instanceof File)) {
      return NextResponse.json(
        { error: 'Profile ID, government ID, and proof of ownership are required.' },
        { status: 400 },
      )
    }

    const governmentIdPath = await uploadVerificationFile(profileId, 'government-id', governmentId)
    const ownershipDocumentPath = await uploadVerificationFile(profileId, 'ownership-proof', ownershipProof)
    const businessLicensePath = businessLicense instanceof File && businessLicense.size > 0
      ? await uploadVerificationFile(profileId, 'business-license', businessLicense)
      : null

    const supabaseAdmin = getSupabaseAdmin()
    const updates: Record<string, string | null> = {
      government_id_path: governmentIdPath,
      ownership_document_path: ownershipDocumentPath,
      verification_status: 'pending',
      verification_submitted_at: new Date().toISOString(),
    }

    if (businessLicensePath) {
      updates.business_license_path = businessLicensePath
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', profileId)

    if (error) {
      throw error
    }

    return NextResponse.json({ ok: true, verification_status: 'pending' })
  } catch (error) {
    console.error('Error uploading verification documents:', error)

    return NextResponse.json(
      { error: 'Unable to submit verification documents right now.' },
      { status: 500 },
    )
  }
}