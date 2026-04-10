ALTER TABLE listings
ADD COLUMN IF NOT EXISTS image_url TEXT;

UPDATE listings
SET image_url = CASE
  WHEN category ILIKE '%cafe%' THEN 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80'
  WHEN category ILIKE '%bakery%' THEN 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80'
  WHEN category ILIKE '%retail%' THEN 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80'
  WHEN category ILIKE '%wellness%' THEN 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80'
  ELSE 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80'
END
WHERE image_url IS NULL;