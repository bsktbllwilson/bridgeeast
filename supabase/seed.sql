-- Pass The Plate — seed data
--
-- Run via `supabase db reset --linked` (which truncates + re-applies
-- migrations + this seed) or `psql -f supabase/seed.sql` for ad-hoc.
-- Listings have seller_id = NULL because we don't have seed auth users;
-- create real auth.users + profiles to attach ownership.

-- ---------------------------------------------------------------------------
-- listings (9)
-- ---------------------------------------------------------------------------

insert into public.listings (
  status, title, description, industry, cuisine, city, state, neighborhood,
  lat, lng, asking_price_cents, annual_revenue_cents, annual_profit_cents,
  year_established, staff_count, square_footage, cover_image_url
) values
(
  'active', 'Grandma''s Noods',
  'Family-run hand-pulled noodle shop on Main Street in Flushing, in continuous operation since 2008. The kitchen turns out scratch-made wheat noodles every morning using a recipe passed down three generations, and the dining room seats 38 with steady weekend lines and a strong delivery business through ChowBus and DoorDash.

Lease has 6 years remaining at $7,200/month with a 3% annual escalator. All FOH/BOH equipment included; full set of books available under NDA. Owners are retiring and prefer a buyer who will keep the staff (most have been here 5+ years) and the menu intact for at least 12 months.',
  'restaurant', 'chinese', 'Flushing', 'NY', 'Flushing, Queens',
  40.7674, -73.8331, 85000000, 120000000, 25000000,
  2008, 18, 1800, '/images/brand/noodles.jpeg'
),
(
  'active', 'Bao Bao Town',
  'High-volume Vietnamese small-plates concept in the heart of Manhattan Chinatown, with a hybrid bao + bun cha + pho menu that pulls strong lunch and dinner covers from Wall Street and NYU traffic. Featured in NYT Cooking and Eater NY twice in the past 18 months. 80-seat dining room plus an 18-seat sidewalk patio (DOT-permitted).

Asking price reflects fully built-out kitchen with hood, walk-in, and a recently replaced espresso/boba bar. Liquor license is included and transferable. Current ownership is relocating internationally; willing to stay 90 days post-close for transition. Books reviewed by Marcum LLP.',
  'restaurant', 'vietnamese', 'New York', 'NY', 'Chinatown, Manhattan',
  40.7158, -73.9970, 140000000, 185000000, 39000000,
  2014, 22, 2400, '/images/brand/dumplings.JPG'
),
(
  'active', '1800-Dumplings',
  'Dumpling-focused fast-casual on Broadway in Elmhurst, opened 2017. Concept is built around an open dumpling-making station visible from the dining room — a strong differentiator on social, with 47K followers across IG and TikTok. Roughly 65% of revenue is delivery/pickup; 35% dine-in across 32 seats.

Includes a full commissary kitchen lease across the street that supplies a second (closed) location and could support a wholesale arm. Owner will train new operators on dough/filling SOPs and will share supplier relationships in Sunset Park. POS is Toast; Quickbooks Online available for buyer review.',
  'restaurant', 'chinese', 'Elmhurst', 'NY', 'Elmhurst, Queens',
  40.7373, -73.8825, 67500000, 92000000, 18500000,
  2017, 12, 1400, '/images/brand/dumplings.JPG'
),
(
  'active', 'Yum Cha Matcha',
  'Specialty matcha and Japanese pastry cafe in a high-foot-traffic corner of Long Island City, opened 2020 and profitable in year two. Concept blends a tightly curated matcha drink menu (sourced direct from a Uji producer) with daily-baked mochi donuts, dorayaki, and seasonal milk bread. Strong Instagram presence (61K followers) drives weekend lines around the block.

850 sq ft with seating for 14 plus a 4-seat window bar. Lease has 4 years remaining at $5,800/month NNN. All equipment is under 3 years old. Excellent fit for a buyer looking for a turnkey operation with documented systems and a built-in social audience.',
  'bakery', 'japanese', 'Long Island City', 'NY', 'Long Island City, Queens',
  40.7447, -73.9485, 48000000, 62000000, 13500000,
  2020, 7, 850, '/images/brand/dessert.JPG'
),
(
  'active', 'Hello Chef',
  'Established Chinese catering operation on the Lower East Side serving corporate accounts (Goldman, BlackRock, two Big Four firms) plus a 28-seat retail dining room used primarily as a tasting space. Catering revenue accounts for 72% of top line and is contracted on a recurring monthly basis with 8 of the top 10 clients.

3,200 sq ft total: full production kitchen, three walk-ins, a six-vehicle delivery setup (vans included), and front-of-house. Corporate sales contact + chef-owner will support a 6-month transition. Strong opportunity for a buyer with B2B sales experience to expand into Brooklyn and Jersey City.',
  'catering', 'chinese', 'New York', 'NY', 'Lower East Side, Manhattan',
  40.7150, -73.9843, 185000000, 240000000, 52000000,
  2011, 28, 3200, '/images/brand/chef.JPG'
),
(
  'active', 'Night Market Hawker',
  'Pan-Asian street food concept in the Industry City food hall in Sunset Park. The menu rotates 8 weekly specials drawn from Taiwanese, Malaysian, and Thai night-market traditions, anchored by 4 staples (popcorn chicken, char kway teow, Thai basil, mango sticky rice). Weekend covers regularly exceed 350.

Stall comes with a 5-year sub-license from Industry City management at favorable terms ($4,400/month all-in, including utilities and shared dishwashing). Includes wok station, two flat-tops, prep tables, and a small back-of-house storage unit. Excellent first acquisition for an operator without the capital for a standalone build-out.',
  'restaurant', 'pan_asian', 'Brooklyn', 'NY', 'Sunset Park, Brooklyn',
  40.6457, -74.0107, 72000000, 89000000, 17500000,
  2019, 15, 1100, '/images/brand/dinner_table.jpeg'
),
(
  'active', 'Lotus Cocktail Lounge',
  'Late-night cocktail lounge in South Williamsburg with a tightly edited Pan-Asian small-plates menu (yakitori, dim sum, crudo). Bar program is the draw: 22-seat marble bar, original cocktail list developed by a James Beard semifinalist, and a curated baijiu / shochu / sake selection that has been written up in Punch and Imbibe.

2,800 sq ft, full liquor license (transferable), late-hours permit through 4am Thurs–Sat. Lease has 8 years remaining at $19,500/month. Equipment, branding, IP, and social handles all included. Owners are exiting hospitality entirely; price reflects a slight discount on multiple to move quickly.',
  'restaurant', 'pan_asian', 'Brooklyn', 'NY', 'Williamsburg, Brooklyn',
  40.7081, -73.9571, 260000000, 210000000, 41000000,
  2016, 24, 2800, '/images/brand/girsl.JPG'
),
(
  'active', 'Ramen-ya',
  'Tonkotsu-focused ramen shop in Midtown East serving the lunch and dinner office crowd. 16-hour daily pork bone broth, in-house noodle production using a Yamato machine, and a tight 6-bowl menu with 3 seasonal specials. Average ticket $24 dine-in, $19 delivery; strong Resy and Beli ratings.

1,900 sq ft, 42 seats including a chef''s counter facing the noodle station. Lease has 5 years + a 5-year option at $14,200/month. Ideal for an operator with one existing concept who wants to add a Midtown footprint with proven unit economics. Books, recipes, and supplier list shared post-NDA.',
  'restaurant', 'japanese', 'New York', 'NY', 'Midtown East, Manhattan',
  40.7549, -73.9707, 110000000, 155000000, 31000000,
  2013, 16, 1900, '/images/brand/noodles.jpeg'
),
(
  'active', 'Family Table',
  'Family-run Vietnamese restaurant on 8th Avenue in Sunset Park, opened 2009. Menu centers on pho, banh mi, vermicelli bowls, and a daily clay-pot special. Strong delivery business via the Vietnamese-language Cho.us app in addition to the major delivery platforms; a substantial cash regular customer base from the surrounding neighborhood.

1,300 sq ft, 36 seats. Lease has 3 years remaining at $4,900/month with a strong renewal option. Owner is retiring and prefers a buyer who will keep the staff (3 cooks have been here 10+ years). Suitable for an owner-operator looking for a stable, neighborhood-anchored business with low overhead.',
  'restaurant', 'vietnamese', 'Brooklyn', 'NY', 'Sunset Park, Brooklyn',
  40.6457, -74.0107, 58000000, 74000000, 16000000,
  2009, 10, 1300, '/images/brand/IMG_2672.JPG'
);
