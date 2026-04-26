-- Auth integration: extend `profiles`, auto-create on signup, proof-of-funds storage.

-- Make seller-specific columns nullable so buyers can have minimal profiles.
ALTER TABLE profiles ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN business_name DROP NOT NULL;

-- Link profiles to auth.users.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE
    REFERENCES auth.users(id) ON DELETE CASCADE;

-- Buyer/seller dimensions, contact + locale prefs.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'buyer'
    CHECK (role IN ('buyer', 'seller', 'both')),
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS preferred_language TEXT NOT NULL DEFAULT 'en'
    CHECK (preferred_language IN ('en', 'zh', 'ko', 'vi'));

-- Proof-of-funds tracking (admin-reviewed for v1).
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS proof_of_funds_path TEXT,
  ADD COLUMN IF NOT EXISTS proof_of_funds_kind TEXT
    CHECK (proof_of_funds_kind IN ('bank_statement', 'sba_pre_qual', NULL)),
  ADD COLUMN IF NOT EXISTS proof_of_funds_status TEXT NOT NULL DEFAULT 'none'
    CHECK (proof_of_funds_status IN ('none', 'pending', 'verified', 'rejected')),
  ADD COLUMN IF NOT EXISTS proof_of_funds_submitted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS proof_of_funds_reviewed_at TIMESTAMP WITH TIME ZONE;

-- Stripe + membership (Stripe wiring lives outside this migration).
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS membership_tier TEXT NOT NULL DEFAULT 'first_bite'
    CHECK (membership_tier IN ('first_bite', 'chefs_table', 'full_menu')),
  ADD COLUMN IF NOT EXISTS membership_status TEXT NOT NULL DEFAULT 'active'
    CHECK (membership_status IN ('active', 'past_due', 'canceled')),
  ADD COLUMN IF NOT EXISTS membership_current_period_end TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON profiles (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_proof_of_funds_status
  ON profiles (proof_of_funds_status);

-- Auto-create a profile row when a new auth.users row is inserted.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
  desired_role TEXT;
  desired_lang TEXT;
BEGIN
  desired_role := COALESCE(NEW.raw_user_meta_data->>'role', 'buyer');
  IF desired_role NOT IN ('buyer', 'seller', 'both') THEN
    desired_role := 'buyer';
  END IF;

  desired_lang := COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en');
  IF desired_lang NOT IN ('en', 'zh', 'ko', 'vi') THEN
    desired_lang := 'en';
  END IF;

  INSERT INTO public.profiles (auth_user_id, email, role, preferred_language, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    desired_role,
    desired_lang,
    NULLIF(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (auth_user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- RLS on profiles.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_self_select ON profiles;
CREATE POLICY profiles_self_select ON profiles
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS profiles_self_update ON profiles;
CREATE POLICY profiles_self_update ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Public read of seller profiles (only the columns the marketplace needs are
-- exposed via the marketplace queries; columns like proof_of_funds_path are
-- not selected from anon-context queries).
DROP POLICY IF EXISTS profiles_public_read_sellers ON profiles;
CREATE POLICY profiles_public_read_sellers ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (role IN ('seller', 'both') AND verification_status = 'verified');

-- Proof-of-funds storage bucket (private; signed URLs only).
INSERT INTO storage.buckets (id, name, public)
VALUES ('proof_of_funds', 'proof_of_funds', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket RLS: each user can only manage objects under their own auth.uid()
-- as the first path segment (e.g. "<uid>/<filename>.pdf").
DROP POLICY IF EXISTS proof_of_funds_owner_insert ON storage.objects;
CREATE POLICY proof_of_funds_owner_insert ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'proof_of_funds'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS proof_of_funds_owner_read ON storage.objects;
CREATE POLICY proof_of_funds_owner_read ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'proof_of_funds'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS proof_of_funds_owner_update ON storage.objects;
CREATE POLICY proof_of_funds_owner_update ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'proof_of_funds'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
