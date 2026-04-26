-- Pass The Plate: business-for-sale listings (layered alongside BridgeEast `listings`).
-- Sellers list operating Asian F&B businesses for sale; buyers browse and inquire.

CREATE TABLE IF NOT EXISTS ptp_business_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Bilingual headline / description (EN required, others optional).
  title TEXT NOT NULL,
  title_zh TEXT,
  title_ko TEXT,
  title_vi TEXT,
  description TEXT NOT NULL,
  description_zh TEXT,
  description_ko TEXT,
  description_vi TEXT,

  -- Categorization.
  cuisine_type TEXT NOT NULL,           -- chinese | korean | japanese | vietnamese | thai | filipino | malaysian | pan_asian | other
  business_type TEXT NOT NULL,          -- restaurant | coffee_shop | bubble_tea | bakery | izakaya | ghost_kitchen | grocery | other

  -- Location.
  city TEXT NOT NULL,
  neighborhood TEXT,
  state TEXT NOT NULL,
  zip_code TEXT,

  -- Financials (NDA-gated on the client).
  asking_price NUMERIC(12, 2),
  gross_revenue_annual NUMERIC(12, 2),
  cash_flow_annual NUMERIC(12, 2),       -- aka SDE
  monthly_rent NUMERIC(10, 2),
  lease_remaining_months INT,
  lease_renewal_options TEXT,
  sqft INT,
  employees_ft INT,
  employees_pt INT,

  -- Equipment + storyline.
  equipment_included TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  reason_for_sale TEXT,
  reason_for_sale_zh TEXT,
  seller_notes TEXT,
  seller_notes_zh TEXT,

  -- Buyer-eligibility flags.
  visa_eligible_eb5 BOOLEAN NOT NULL DEFAULT false,
  visa_eligible_e2 BOOLEAN NOT NULL DEFAULT false,
  sba_prequalified BOOLEAN NOT NULL DEFAULT false,

  cover_image_url TEXT,

  -- Lifecycle.
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_review', 'active', 'under_contract', 'sold', 'removed')),
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  flag_reason TEXT,
  published_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ptp_listing_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES ptp_business_listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ptp_listings_profile ON ptp_business_listings(profile_id);
CREATE INDEX IF NOT EXISTS idx_ptp_listings_status ON ptp_business_listings(status);
CREATE INDEX IF NOT EXISTS idx_ptp_listings_cuisine ON ptp_business_listings(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_ptp_listings_business_type ON ptp_business_listings(business_type);
CREATE INDEX IF NOT EXISTS idx_ptp_listings_city ON ptp_business_listings(city);
CREATE INDEX IF NOT EXISTS idx_ptp_listings_state ON ptp_business_listings(state);
CREATE INDEX IF NOT EXISTS idx_ptp_listings_asking_price ON ptp_business_listings(asking_price);
CREATE INDEX IF NOT EXISTS idx_ptp_listings_visa_eb5 ON ptp_business_listings(visa_eligible_eb5);
CREATE INDEX IF NOT EXISTS idx_ptp_listings_visa_e2 ON ptp_business_listings(visa_eligible_e2);
CREATE INDEX IF NOT EXISTS idx_ptp_listing_photos_listing ON ptp_listing_photos(listing_id, sort_order);

CREATE TRIGGER update_ptp_business_listings_updated_at BEFORE UPDATE ON ptp_business_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Private bucket for raw business photos. Approved photos can be served via signed URLs.
INSERT INTO storage.buckets (id, name, public)
VALUES ('ptp-listing-photos', 'ptp-listing-photos', false)
ON CONFLICT (id) DO NOTHING;
