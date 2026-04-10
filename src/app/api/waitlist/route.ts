import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, brandName, country, targetDate } = await request.json()

    // Validate required fields
    if (!email || !brandName || !country) {
      return NextResponse.json(
        { error: 'Email, brand name, and country are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Email address is invalid' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || supabaseKey.includes('your-anon-key')) {
      // Fallback: simulate successful submission for development
      console.log('Waitlist submission (development mode):', { email, brandName, country, targetDate })
      return NextResponse.json(
        { message: 'Successfully added to waitlist (development mode)', data: { email, brandName, country, targetDate } },
        { status: 201 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email: email.trim().toLowerCase(),
          brand_name: brandName.trim(),
          origin_country: country,
          target_open_date: targetDate ? `${targetDate}-01` : null,
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)

      if (error.code === '23505' || error.message?.includes('duplicate')) {
        return NextResponse.json(
          { message: 'You are already on the waitlist.', data: null },
          { status: 200 }
        )
      }

      return NextResponse.json(
        { error: error.message || 'Failed to save to database' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Successfully added to waitlist', data },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}