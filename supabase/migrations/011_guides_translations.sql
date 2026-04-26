-- Per-locale title + content for guides (matches the pattern used by
-- ptp_business_listings).

ALTER TABLE guides
  ADD COLUMN IF NOT EXISTS title_zh TEXT,
  ADD COLUMN IF NOT EXISTS title_ko TEXT,
  ADD COLUMN IF NOT EXISTS title_vi TEXT,
  ADD COLUMN IF NOT EXISTS content_zh TEXT,
  ADD COLUMN IF NOT EXISTS content_ko TEXT,
  ADD COLUMN IF NOT EXISTS content_vi TEXT;
