-- Pass The Plate: NDA acceptance + inquiry/messaging tables.
-- Flow: buyer hits "Inquire" -> accepts NDA -> ptp_nda_acceptances row written ->
-- financials unlocked on listing detail -> ptp_inquiry_threads opens between buyer and seller.

CREATE TABLE IF NOT EXISTS ptp_nda_acceptances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES ptp_business_listings(id) ON DELETE CASCADE,
  buyer_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nda_version TEXT NOT NULL DEFAULT 'v1',
  signed_full_name TEXT NOT NULL,
  signed_ip TEXT,
  signed_user_agent TEXT,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (listing_id, buyer_profile_id)
);

CREATE TABLE IF NOT EXISTS ptp_inquiry_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES ptp_business_listings(id) ON DELETE CASCADE,
  buyer_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'archived', 'closed')),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (listing_id, buyer_profile_id)
);

CREATE TABLE IF NOT EXISTS ptp_inquiry_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES ptp_inquiry_threads(id) ON DELETE CASCADE,
  sender_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('buyer', 'seller', 'admin')),
  body TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ptp_nda_listing_buyer ON ptp_nda_acceptances(listing_id, buyer_profile_id);
CREATE INDEX IF NOT EXISTS idx_ptp_threads_listing ON ptp_inquiry_threads(listing_id);
CREATE INDEX IF NOT EXISTS idx_ptp_threads_buyer ON ptp_inquiry_threads(buyer_profile_id);
CREATE INDEX IF NOT EXISTS idx_ptp_threads_seller ON ptp_inquiry_threads(seller_profile_id);
CREATE INDEX IF NOT EXISTS idx_ptp_messages_thread ON ptp_inquiry_messages(thread_id, sent_at);

CREATE TRIGGER update_ptp_inquiry_threads_updated_at BEFORE UPDATE ON ptp_inquiry_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Bump thread.last_message_at whenever a new message lands.
CREATE OR REPLACE FUNCTION ptp_touch_thread_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ptp_inquiry_threads
    SET last_message_at = NEW.sent_at,
        updated_at = NEW.sent_at
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ptp_inquiry_message_touch_thread
  AFTER INSERT ON ptp_inquiry_messages
  FOR EACH ROW EXECUTE FUNCTION ptp_touch_thread_on_message();
