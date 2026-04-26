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

-- ---------------------------------------------------------------------------
-- partners (12) — yellow-pages directory
-- All seeded as approved=true so they appear in the public partner list.
-- ---------------------------------------------------------------------------

insert into public.partners (
  full_name, job_title, company, email, phone, website, address,
  specialty, languages, bio, approved, featured
) values
(
  'Sarah Lin', 'Senior SBA Loan Officer', 'East Coast Capital Partners',
  'sarah.lin@eccpartners.com', '+1-212-555-0142', 'https://eccpartners.com',
  '230 Park Ave, Suite 1500, New York, NY 10169',
  'sba_lender', '{en,zh}',
  'Closes ~$45M in SBA 7(a) and 504 loans annually with a focus on first-generation immigrant operators in the F&B space. Native Mandarin speaker; comfortable underwriting deals where books are still being formalized.',
  true, true
),
(
  'Daniel Kim', 'Managing Partner', 'Kim & Park Immigration Law',
  'dkim@kimparklaw.com', '+1-212-555-0118', 'https://kimparklaw.com',
  '420 Lexington Ave, Suite 2200, New York, NY 10170',
  'immigration_attorney', '{en,ko}',
  '17 years of E-2, L-1, and EB-5 visa work, primarily for Korean restaurant owners moving operations to the US. AILA member; bilingual office staff handle intake in Korean.',
  true, true
),
(
  'Mei Wong', 'Principal Broker', 'Pacific Realty NYC',
  'mei@pacificrealtynyc.com', '+1-718-555-0193', 'https://pacificrealtynyc.com',
  '37-15 Main Street, Flushing, NY 11354',
  'bilingual_broker', '{en,zh}',
  'Specializes in restaurant and grocery commercial leases across Queens and Brooklyn. Average 12-15 closings per year; deep relationships with Chinatown landlords. Cantonese and Mandarin.',
  true, false
),
(
  'Tuan Nguyen', 'CPA, Tax Director', 'Nguyen CPA Group',
  'tuan@nguyencpa.com', '+1-718-555-0167', 'https://nguyencpa.com',
  '5403 8th Ave, Brooklyn, NY 11220',
  'accountant', '{en,vi}',
  '25+ years working with Vietnamese-owned restaurants in the tri-state area. QuickBooks ProAdvisor; handles cash-basis bookkeeping cleanups for sale-readiness.',
  true, false
),
(
  'Marcus Chen', 'Commercial Insurance Broker', 'Bay Insurance Brokers',
  'marcus.chen@bayinsbrokers.com', '+1-212-555-0184', 'https://bayinsbrokers.com',
  '11 Broadway, Suite 615, New York, NY 10004',
  'insurance', '{en,zh}',
  'GL, workers comp, liquor liability, and cyber for restaurant groups in NYC and Northern NJ. Direct appointments with Chubb, Hartford, and Liberty Mutual; can quote within 48 hours.',
  true, false
),
(
  'Jisoo Park', 'Immigration Attorney', 'Park Immigration LLP',
  'jisoo@parkimmigration.com', '+1-212-555-0156', 'https://parkimmigration.com',
  '1500 Broadway, Suite 1801, New York, NY 10036',
  'immigration_attorney', '{en,ko}',
  'Focused on E-2 treaty investor visas for Korean F&B founders, including spouses-of-investor work authorization. Has filed 200+ E-2 petitions with a 96% approval rate.',
  true, false
),
(
  'Linda Park', 'SBA Underwriter', 'Pacific National Bank',
  'lpark@pacnatbank.com', '+1-201-555-0173', 'https://pacnatbank.com',
  '88 Pine Street, 22nd Floor, New York, NY 10005',
  'sba_lender', '{en,ko}',
  'Underwrites SBA 7(a) loans up to $5M with a specialty in Korean BBQ and pojangmacha concepts. Average time-to-close 11 weeks. Will pre-screen deals at no cost.',
  true, false
),
(
  'Jenny Zhao', 'Founder, Restaurant Broker', 'NYC Restaurant Realty',
  'jenny@nycrestaurantrealty.com', '+1-917-555-0135', 'https://nycrestaurantrealty.com',
  '139 Centre Street, Suite 410, New York, NY 10013',
  'bilingual_broker', '{en,zh}',
  'Restaurant-only commercial brokerage covering Manhattan and Western Queens. Confidential listings only; works with both buyers and sellers but never the same deal. Mandarin native.',
  true, true
),
(
  'Diana Vu', 'Tax Accountant', 'Vu & Associates',
  'diana@vuassociates.com', '+1-714-555-0189', 'https://vuassociates.com',
  '9550 Bolsa Ave, Suite 200, Westminster, CA 92683',
  'accountant', '{en,vi}',
  'CA-licensed CPA serving Vietnamese F&B operators on the West Coast and remote tri-state clients. Focus on quality-of-earnings prep for restaurant sale transactions.',
  true, false
),
(
  'Robert Tran', 'Risk Advisor', 'Tran Risk Advisors',
  'robert@tranrisk.com', '+1-713-555-0148', 'https://tranrisk.com',
  '11231 Bellaire Blvd, Suite C, Houston, TX 77072',
  'insurance', '{en,vi}',
  'Multi-unit restaurant insurance programs (GL, property, workers comp, EPLI). Active in Houston, Dallas, NYC, and San Jose Vietnamese restaurant markets.',
  true, false
),
(
  'Steven Zhang', 'SBA Lending Director', 'Empire SBA Loans',
  'szhang@empiresba.com', '+1-212-555-0179', 'https://empiresba.com',
  '60 Wall Street, 14th Floor, New York, NY 10005',
  'sba_lender', '{en,zh}',
  'Direct SBA lender (preferred lender status) — keeps loans in-house rather than brokering out. Comfortable with $750K-$5M restaurant acquisition deals; 9-week average close.',
  true, false
),
(
  'Anna Huang', 'Immigration Counsel', 'Huang Immigration Group',
  'anna@huangimmigration.com', '+1-212-555-0162', 'https://huangimmigration.com',
  '370 Lexington Ave, Suite 808, New York, NY 10017',
  'immigration_attorney', '{en,zh}',
  'EB-5 regional center work and direct EB-5 for restaurant project sponsors, plus E-2 and L-1 for owner-operators. Mandarin and Cantonese in-house.',
  true, false
);

-- ---------------------------------------------------------------------------
-- playbook_posts (6) — one per spec'd category
-- ---------------------------------------------------------------------------

insert into public.playbook_posts (
  slug, title, excerpt, body_md, category, author_name, published, published_at
) values
(
  'nyc-launch-pad-asian-fb',
  'Why New York City Is the Best U.S. Launch Pad for Asian F&B Brands',
  'Density, diversity, and a built-in customer base make NYC the highest-leverage entry market for restaurants from Asia — but it''s also where the most brands die. Here''s how to weigh it.',
  E'## The case for NYC\n\nMore than 1.2M people of Asian descent live in the five boroughs, with concentrated communities in Flushing, Sunset Park, and Manhattan Chinatown that act as built-in proof-of-concept audiences. Demand for category-defining Asian F&B is high, food media coverage is dense, and the cost of a single brand-defining write-up (Eater, NYT, Infatuation) can fully change a brand''s national trajectory.\n\n## The case against\n\nNYC is also the most expensive build-out in the country. A 2,000 sq ft full-service restaurant in Manhattan now costs $850K–$1.4M to open from white box, and rent is non-negotiable above $80/sqft in most of the desirable corridors. Labor is tight and getting tighter.\n\n## How to think about it\n\nIf your goal is national brand recognition or US capital, NYC is non-optional. If your goal is steady cash flow, the suburbs of Houston, Atlanta, or LA County are usually a better first-unit choice. Most successful Asian F&B brands open in a secondary market first to prove unit economics, then enter NYC as their second or third location with the marketing benefit of an "from city X" story.',
  'market_entry',
  'Pass The Plate Editorial',
  true, now() - interval '21 days'
),
(
  'e2-vs-l1-visa-restaurant',
  'E-2 vs L-1: Choosing the Right Visa for Your U.S. Restaurant Move',
  'The two most common pathways for foreign restaurant owners moving operations to the US — what each requires, what they cost, and which one fits your situation.',
  E'## E-2 (Treaty Investor)\n\nAvailable to nationals of E-2 treaty countries (includes Japan, Korea, Taiwan, Thailand; not mainland China or Vietnam). Requires a substantial investment in a US business — usually $100K+ for a restaurant, though there is no statutory minimum. Renewable indefinitely in 2-year increments as long as the business remains operational.\n\n**Best for:** Founders from treaty countries who want to actively run the business, including spouses (who can apply for work authorization).\n\n## L-1A (Intracompany Transferee, Manager)\n\nRequires an existing business in your home country and a US affiliate (parent, subsidiary, or branch). You must have worked for the foreign entity in a managerial or executive role for at least 1 year in the preceding 3.\n\n**Best for:** Operators with an established multi-unit brand abroad who are opening a US flagship.\n\n## Cost / time\n\nE-2: $4K–$8K legal, 6–10 weeks at most consulates.\nL-1A: $6K–$12K legal, 8–14 weeks (premium processing available for $2,805 USCIS fee).\n\n## Common pitfall\n\nE-2 investors often under-invest because there''s no minimum. Consulates expect to see 60–80% of total project cost already deployed (lease signed, equipment ordered, etc.) before approving — not just sitting in a US bank account.',
  'visa_immigration',
  'Daniel Kim, Kim & Park Immigration Law',
  true, now() - interval '14 days'
),
(
  'legal-checklist-buying-restaurant',
  'Buying an Existing Restaurant: The Legal Checklist',
  'A 14-item due-diligence checklist your attorney should walk through before you sign an asset purchase agreement.',
  E'## Before LOI\n\n1. **Entity structure.** Is the seller an LLC, S-corp, or sole prop? This affects whether you''re buying assets or equity.\n2. **Lease assignability.** Pull the lease. Look for assignment clauses, landlord consent requirements, and any personal guarantee language.\n3. **Liquor license.** Is it transferable in your state? In NY, you''re looking at 90+ days for an SLA transfer.\n\n## During LOI / due diligence\n\n4. **3 years of tax returns + bank statements.** Reconcile against POS data.\n5. **Health department history.** All inspections from the past 3 years.\n6. **Pending litigation, judgments, or liens.** UCC search and county-level court records.\n7. **Employment classification.** 1099 vs W-2 cooks; tip credit compliance.\n8. **Vendor contracts.** Especially exclusive-supply or volume-commitment agreements.\n9. **Equipment leases.** What''s actually owned vs leased? Coke/Pepsi, ice machines, POS hardware are commonly leased.\n10. **Trademark and DBA filings.** Is the name actually registered, and to whom?\n\n## At close\n\n11. **Bulk sales notification.** Required in some states to notify creditors before an asset sale.\n12. **Sales tax clearance certificate.** Buyer is liable for unpaid seller sales tax in most states.\n13. **Workers comp / unemployment account transfer.** Or fresh registration.\n14. **Escrow holdback.** 5–10% of purchase price for 90–180 days to cover undisclosed liabilities.',
  'legal',
  'Pass The Plate Editorial',
  true, now() - interval '11 days'
),
(
  'sba-7a-loans-restaurant-acquisitions',
  'How SBA 7(a) Loans Work for Restaurant Acquisitions',
  'The most common financing path for buying an existing restaurant. Down payment requirements, what underwriters look for, and how to set yourself up to close in under 90 days.',
  E'## What it is\n\nSBA 7(a) is a partial loan guarantee program — the SBA backs 75–85% of a loan made by an approved private lender. For restaurant acquisitions the typical loan size is $250K–$5M with a 10-year amortization.\n\n## Down payment\n\nMinimum 10% buyer equity injection. Up to 5% of that can be a seller note (on standby for 24+ months) — meaning you can sometimes get into a $1M deal with $50K cash and a $50K seller note.\n\n## What underwriters look for\n\n- **DSCR ≥ 1.25x.** Trailing 12 months of cash flow must cover the proposed debt service with a 25% cushion.\n- **3 years of business tax returns + interim P&L** for the seller.\n- **Buyer industry experience.** First-time restaurant owners are doable but face additional scrutiny — having a GM or operating partner with 5+ years helps.\n- **Buyer credit ≥ 680** (most lenders want 700+).\n- **Liquidity post-close** of at least 2 months of operating expenses.\n\n## Timeline\n\nPrequalification: 1–2 weeks. Full underwriting + closing: 8–12 weeks once a fully-executed APA is in hand. Build this into your purchase agreement as a financing contingency.\n\n## Working with a Preferred Lender (PLP)\n\nPLP lenders can approve loans in-house without going to SBA for sign-off, cutting 2–4 weeks off close. Always ask whether your lender is PLP before applying.',
  'finance',
  'Sarah Lin, East Coast Capital Partners',
  true, now() - interval '7 days'
),
(
  'first-walkthrough-buying',
  'What to Look For (and Run From) on Your First Walkthrough',
  'A pragmatic field guide for the first time you tour a restaurant you''re considering buying. Where to point the flashlight, what questions force honest answers, and what should make you walk out.',
  E'## Before you walk in\n\nDrive by at the actual peak meal time on a Friday and a Sunday — not when the seller schedules the tour. Count covers, watch the door, and time the line.\n\n## Inside the dining room\n\n- Is it loud? Sustained noise is a leading indicator of revenue.\n- Look at the ceiling, the corners, and the bathrooms. These are the parts owners do not maintain when they''ve already mentally checked out.\n- Open the menu. Are there printed-on stickers covering old prices? How long since the last reprint?\n\n## In the kitchen\n\n- Open the walk-in. How organized? FIFO labels? Anything moldy?\n- Pull out the hood filters. Last cleaned when?\n- Lift the floor mats. What''s underneath tells you everything.\n- Check the dish pit drain. Slow drains in a restaurant kitchen mean unaddressed grease trap issues, which can be a $20K+ problem.\n\n## Questions that force honest answers\n\n- "Walk me through your last health inspection — what came up and how did you fix it?"\n- "Who are your top three vendors and how long have you been with them?"\n- "What''s your biggest comp/refund category and why?"\n- "If you could change one thing about the lease, what would it be?"\n\n## Walk out if\n\n- Books are "with my accountant" and not produceable within 48 hours.\n- The seller refuses to introduce you to the head chef privately.\n- The lease has fewer than 3 years remaining and the landlord won''t commit to renewal terms in writing before close.',
  'buying',
  'Jenny Zhao, NYC Restaurant Realty',
  true, now() - interval '5 days'
),
(
  'pricing-restaurant-sale',
  'Pricing Your Restaurant for Sale: A Seller''s Playbook',
  'The three valuation methods buyers actually use, what multiple to expect for your concept, and the four-quarter prep work that adds 20–40% to your final close price.',
  E'## How buyers value restaurants\n\n1. **SDE multiple (most common for owner-operator concepts under $2M revenue).** Seller''s Discretionary Earnings — net income + owner''s salary + add-backs. Typical multiple: 1.8x–3.0x.\n2. **EBITDA multiple (multi-unit or scaled concepts).** Earnings before interest, tax, depreciation, amortization. Typical multiple: 3.5x–5.5x for established Asian concepts in major metros.\n3. **Asset-based.** What the equipment + leasehold improvements + inventory + transferable intangibles are worth. Used as a floor, especially for distressed sales.\n\n## What lifts your multiple\n\n- **Documented systems.** Recipes, schedules, training materials in writing.\n- **A second-in-command.** A GM or chef who has been there 2+ years and is staying through transition.\n- **Diversified revenue.** No single channel (delivery, dine-in, catering) over 60% of top line.\n- **Lease length.** 5+ years remaining including options.\n- **Clean books.** Reconciled monthly, P&L matches tax returns, no large cash deposits unaccounted for.\n\n## What kills your multiple\n\n- Owner is the brand (concept dies if you leave).\n- Heavy cash sales without traceable deposit history.\n- Pending lawsuits, even minor.\n- Equipment near end of life.\n- Lease expires within 24 months with no renewal option.\n\n## The prep timeline\n\nStart 12 months before listing. Quarter 1: clean up books, document SOPs. Quarter 2: trim losing menu items, push profitability. Quarter 3: get a quality-of-earnings review from an outside CPA. Quarter 4: list with a broker who has closed 3+ deals in your category.',
  'selling',
  'Pass The Plate Editorial',
  true, now() - interval '2 days'
);
