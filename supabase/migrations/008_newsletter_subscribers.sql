-- Newsletter subscribers (Playbook subscribe card, footer signup, etc.).

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (email, source)
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email
  ON newsletter_subscribers (email);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anonymous visitors may subscribe.
CREATE POLICY newsletter_subscribers_public_insert
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(email) BETWEEN 3 AND 320
    AND source IS NOT NULL
    AND length(source) BETWEEN 1 AND 64
  );

-- Reads are restricted (admins query directly via service role).
