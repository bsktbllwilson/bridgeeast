-- Pass The Plate: saved searches + alert preferences.

CREATE TABLE IF NOT EXISTS ptp_saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,

  -- Serialized filter state (cuisine_type[], business_type[], states[], cities[],
  -- price_min, price_max, revenue_min, visa_eb5, visa_e2, sba_prequalified, etc).
  filter_json JSONB NOT NULL DEFAULT '{}'::jsonb,

  alert_frequency TEXT NOT NULL DEFAULT 'instant'
    CHECK (alert_frequency IN ('instant', 'daily', 'weekly', 'none')),

  last_alerted_at TIMESTAMP WITH TIME ZONE,
  last_match_count INT NOT NULL DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ptp_saved_searches_profile ON ptp_saved_searches(profile_id);
CREATE INDEX IF NOT EXISTS idx_ptp_saved_searches_alert_frequency ON ptp_saved_searches(alert_frequency)
  WHERE alert_frequency <> 'none';

CREATE TRIGGER update_ptp_saved_searches_updated_at BEFORE UPDATE ON ptp_saved_searches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
