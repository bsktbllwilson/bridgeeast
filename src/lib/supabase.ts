import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey)

const missingSupabaseEnvClient = new Proxy(
	{},
	{
		get() {
			throw new Error('Missing Supabase client environment variables.')
		},
	},
)

export const supabase = hasSupabaseEnv
	? createClient(supabaseUrl, supabaseAnonKey)
	: (missingSupabaseEnvClient as ReturnType<typeof createClient>)
