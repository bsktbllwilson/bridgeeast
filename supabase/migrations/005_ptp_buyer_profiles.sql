-- Pass The Plate: buyer profiles. Each row is 1-to-1 with a `profiles` row.
-- Used to populate the vetted buyer demand board sellers see when listing.

CREATE TABLE IF NOT EXISTS ptp_buyer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,

  -- Public-facing anonymized handle shown on the demand board (e.g. "Buyer #4729").
  display_handle TEXT NOT NULL UNIQUE,

  buyer_type TEXT NOT NULL
    CHECK (buyer_type IN ('operator', 'search_fund', 'eb5_e2', 'sba', 'family_office', 'other')),

  budget_min NUMERIC(12, 2),
  budget_max NUMERIC(12, 2),

  target_cuisines TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  target_business_types TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  target_states TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  target_cities TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],

  notes TEXT,
  notes_zh TEXT,

  -- Whether this anonymized profile shows up on the public demand board.
  is_visible BOOLEAN NOT NULL DEFAULT true,

  -- Independent verification track (separate from seller verification).
  verification_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  verification_submitted_at TIMESTAMP WITH TIME ZONE,
  verification_reviewed_at TIMESTAMP WITH TIME ZONE,
  proof_of_funds_path TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ptp_buyers_visible ON ptp_buyer_profiles(is_visible);
CREATE INDEX IF NOT EXISTS idx_ptp_buyers_type ON ptp_buyer_profiles(buyer_type);
CREATE INDEX IF NOT EXISTS idx_ptp_buyers_verification ON ptp_buyer_profiles(verification_status);

CREATE TRIGGER update_ptp_buyer_profiles_updated_at BEFORE UPDATE ON ptp_buyer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
