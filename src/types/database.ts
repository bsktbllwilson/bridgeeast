// Hand-written to match the shape of `supabase gen types typescript`.
// Regenerate with `pnpm gen:types` after applying schema changes — that
// command writes over this file with the canonical version pulled from
// the linked Supabase project.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // supabase-js uses this to pick the typed PostgREST overload set.
  // Keep in sync with whatever `supabase gen types` emits for your project.
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string | null
          full_name: string | null
          role: 'buyer' | 'seller' | 'partner' | 'admin'
          preferred_language: 'en' | 'zh' | 'ko' | 'vi'
          phone: string | null
          proof_of_funds_verified: boolean
          proof_of_funds_verified_at: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email?: string | null
          full_name?: string | null
          role?: 'buyer' | 'seller' | 'partner' | 'admin'
          preferred_language?: 'en' | 'zh' | 'ko' | 'vi'
          phone?: string | null
          proof_of_funds_verified?: boolean
          proof_of_funds_verified_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string | null
          full_name?: string | null
          role?: 'buyer' | 'seller' | 'partner' | 'admin'
          preferred_language?: 'en' | 'zh' | 'ko' | 'vi'
          phone?: string | null
          proof_of_funds_verified?: boolean
          proof_of_funds_verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      listings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          seller_id: string | null
          status: 'draft' | 'pending_review' | 'active' | 'under_offer' | 'sold' | 'withdrawn'
          title: string
          title_translations: Json
          description: string | null
          description_translations: Json
          industry: string | null
          cuisine: string | null
          city: string | null
          state: string | null
          neighborhood: string | null
          lat: number | null
          lng: number | null
          asking_price_cents: number | null
          annual_revenue_cents: number | null
          annual_profit_cents: number | null
          year_established: number | null
          staff_count: number | null
          square_footage: number | null
          includes_real_estate: boolean
          assets: Json
          cover_image_url: string | null
          gallery_urls: string[]
          chowbus_verified: boolean
          view_count: number
          inquiry_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          seller_id?: string | null
          status?: 'draft' | 'pending_review' | 'active' | 'under_offer' | 'sold' | 'withdrawn'
          title: string
          title_translations?: Json
          description?: string | null
          description_translations?: Json
          industry?: string | null
          cuisine?: string | null
          city?: string | null
          state?: string | null
          neighborhood?: string | null
          lat?: number | null
          lng?: number | null
          asking_price_cents?: number | null
          annual_revenue_cents?: number | null
          annual_profit_cents?: number | null
          year_established?: number | null
          staff_count?: number | null
          square_footage?: number | null
          includes_real_estate?: boolean
          assets?: Json
          cover_image_url?: string | null
          gallery_urls?: string[]
          chowbus_verified?: boolean
          view_count?: number
          inquiry_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          seller_id?: string | null
          status?: 'draft' | 'pending_review' | 'active' | 'under_offer' | 'sold' | 'withdrawn'
          title?: string
          title_translations?: Json
          description?: string | null
          description_translations?: Json
          industry?: string | null
          cuisine?: string | null
          city?: string | null
          state?: string | null
          neighborhood?: string | null
          lat?: number | null
          lng?: number | null
          asking_price_cents?: number | null
          annual_revenue_cents?: number | null
          annual_profit_cents?: number | null
          year_established?: number | null
          staff_count?: number | null
          square_footage?: number | null
          includes_real_estate?: boolean
          assets?: Json
          cover_image_url?: string | null
          gallery_urls?: string[]
          chowbus_verified?: boolean
          view_count?: number
          inquiry_count?: number
        }
        Relationships: [
          {
            foreignKeyName: 'listings_seller_id_fkey'
            columns: ['seller_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      listing_inquiries: {
        Row: {
          id: string
          created_at: string
          listing_id: string
          buyer_id: string | null
          message: string | null
          status: 'pending' | 'accepted' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          listing_id: string
          buyer_id?: string | null
          message?: string | null
          status?: 'pending' | 'accepted' | 'rejected'
        }
        Update: {
          id?: string
          created_at?: string
          listing_id?: string
          buyer_id?: string | null
          message?: string | null
          status?: 'pending' | 'accepted' | 'rejected'
        }
        Relationships: [
          {
            foreignKeyName: 'listing_inquiries_listing_id_fkey'
            columns: ['listing_id']
            isOneToOne: false
            referencedRelation: 'listings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'listing_inquiries_buyer_id_fkey'
            columns: ['buyer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      partners: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          profile_id: string | null
          full_name: string
          job_title: string | null
          company: string | null
          email: string | null
          phone: string | null
          website: string | null
          address: string | null
          specialty: string | null
          languages: string[]
          bio: string | null
          referral_source: string | null
          approved: boolean
          featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          profile_id?: string | null
          full_name: string
          job_title?: string | null
          company?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          address?: string | null
          specialty?: string | null
          languages?: string[]
          bio?: string | null
          referral_source?: string | null
          approved?: boolean
          featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          profile_id?: string | null
          full_name?: string
          job_title?: string | null
          company?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          address?: string | null
          specialty?: string | null
          languages?: string[]
          bio?: string | null
          referral_source?: string | null
          approved?: boolean
          featured?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'partners_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      partner_inquiries: {
        Row: {
          id: string
          created_at: string
          partner_id: string
          sender_id: string | null
          message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          partner_id: string
          sender_id?: string | null
          message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          partner_id?: string
          sender_id?: string | null
          message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'partner_inquiries_partner_id_fkey'
            columns: ['partner_id']
            isOneToOne: false
            referencedRelation: 'partners'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'partner_inquiries_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      playbook_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          slug: string
          title: string
          title_translations: Json
          excerpt: string | null
          body_md: string | null
          body_md_translations: Json
          category:
            | 'buying'
            | 'selling'
            | 'legal'
            | 'visa_immigration'
            | 'market_entry'
            | 'operations'
            | 'finance'
            | null
          cover_image_url: string | null
          author_name: string | null
          published: boolean
          published_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          slug: string
          title: string
          title_translations?: Json
          excerpt?: string | null
          body_md?: string | null
          body_md_translations?: Json
          category?:
            | 'buying'
            | 'selling'
            | 'legal'
            | 'visa_immigration'
            | 'market_entry'
            | 'operations'
            | 'finance'
            | null
          cover_image_url?: string | null
          author_name?: string | null
          published?: boolean
          published_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          slug?: string
          title?: string
          title_translations?: Json
          excerpt?: string | null
          body_md?: string | null
          body_md_translations?: Json
          category?:
            | 'buying'
            | 'selling'
            | 'legal'
            | 'visa_immigration'
            | 'market_entry'
            | 'operations'
            | 'finance'
            | null
          cover_image_url?: string | null
          author_name?: string | null
          published?: boolean
          published_at?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          profile_id: string
          tier: 'first_bite' | 'chefs_table' | 'full_menu'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_end: string | null
          status: 'active' | 'past_due' | 'canceled' | 'trialing'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          profile_id: string
          tier?: 'first_bite' | 'chefs_table' | 'full_menu'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          status?: 'active' | 'past_due' | 'canceled' | 'trialing'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          profile_id?: string
          tier?: 'first_bite' | 'chefs_table' | 'full_menu'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          status?: 'active' | 'past_due' | 'canceled' | 'trialing'
        }
        Relationships: [
          {
            foreignKeyName: 'memberships_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          id: string
          created_at: string
          email: string
          source: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          source?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ---------------------------------------------------------------------------
// Helper aliases (mirror what supabase gen types emits)
// ---------------------------------------------------------------------------

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row']

export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update']
