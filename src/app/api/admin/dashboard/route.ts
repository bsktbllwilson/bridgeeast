import { NextResponse } from 'next/server'

import { isAdminEmail } from '@/lib/admin'
import { sampleListings, sampleProfiles } from '@/lib/marketplace'
import { hasSupabaseAdminEnv, getSupabaseAdmin } from '@/lib/supabase-admin'

const VERIFICATION_BUCKET = 'verification-documents'

async function createSignedUrl(path: string | null | undefined) {
  if (!path) {
    return null
  }

  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin.storage
    .from(VERIFICATION_BUCKET)
    .createSignedUrl(path, 60 * 60)

  if (error) {
    console.error('Unable to create signed URL:', error)
    return null
  }

  return data.signedUrl
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const adminEmail = searchParams.get('adminEmail') || ''

  if (!isAdminEmail(adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  if (!hasSupabaseAdminEnv()) {
    const pendingProfiles = sampleProfiles
      .filter((profile) => profile.verification_status === 'pending')
      .map((profile) => ({
        ...profile,
        governmentIdUrl: null,
        ownershipDocumentUrl: null,
        businessLicenseUrl: null,
      }))

    return NextResponse.json({
      pendingProfiles,
      moderationQueue: sampleListings,
      mocked: true,
    })
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()

    const [{ data: pendingProfilesData, error: pendingError }, { data: listingsData, error: listingsError }] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('id, email, full_name, business_name, verification_status, government_id_path, ownership_document_path, business_license_path, verification_submitted_at')
        .eq('verification_status', 'pending')
        .order('verification_submitted_at', { ascending: true }),
      supabaseAdmin
        .from('listings')
        .select('id, profile_id, title, category, city, description, moderation_status, is_flagged, flag_reason, created_at, profiles(id, full_name, business_name, verification_status)')
        .order('created_at', { ascending: false })
        .limit(50),
    ])

    if (pendingError) {
      throw pendingError
    }

    if (listingsError) {
      throw listingsError
    }

    const pendingProfiles = await Promise.all(
      (pendingProfilesData || []).map(async (profile) => ({
        ...profile,
        governmentIdUrl: await createSignedUrl(profile.government_id_path),
        ownershipDocumentUrl: await createSignedUrl(profile.ownership_document_path),
        businessLicenseUrl: await createSignedUrl(profile.business_license_path),
      })),
    )

    const moderationQueue = (listingsData || []).map((listing) => ({
      ...listing,
      profiles: Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles,
    }))

    return NextResponse.json({ pendingProfiles, moderationQueue, mocked: false })
  } catch (error) {
    console.error('Error loading admin dashboard:', error)
    return NextResponse.json({ error: 'Unable to load admin dashboard.' }, { status: 500 })
  }
}