-- Seed neighborhoods data
INSERT INTO neighborhoods (name, avg_rent_sqft, foot_traffic_score, asian_dining_score, competitor_count) VALUES
('Soho', 55.00, 85, 90, 12),
('East Village', 42.50, 78, 75, 8),
('Sunset Park', 25.00, 65, 70, 5),
('Flushing', 28.50, 88, 92, 15),
('Midtown Manhattan', 72.50, 95, 60, 20);

-- Seed partners data
INSERT INTO partners (name, firm, category, specialty, languages, email, website, verified) VALUES
('Sarah Chen', 'Chen Real Estate Partners', 'Real Estate', 'Restaurant site selection & lease negotiation', ARRAY['English', 'Mandarin', 'Cantonese'], 'sarah@chenrealestate.com', 'chenrealestate.com', true),
('David Liu', 'Liu Restaurant Group', 'Real Estate', 'F&B real estate, build-out consulting', ARRAY['English', 'Mandarin'], 'david@liurg.com', 'liurg.com', true),
('Angela Wong', 'Wong & Associates Immigration Law', 'Legal', 'E-2 visa, business immigration', ARRAY['English', 'Mandarin', 'Cantonese', 'Vietnamese'], 'angela@wonglaw.com', 'wonglaw.com', true),
('Marcus Johnson', 'Johnson Immigration Counsel', 'Legal', 'Visa & corporate law for restaurants', ARRAY['English', 'Spanish'], 'marcus@johnsonlaw.com', 'johnsonlaw.com', true),
('Tommy Lin', 'Jade Supply Company', 'Distribution', 'Specialty Asian ingredients, import logistics', ARRAY['English', 'Mandarin', 'Cantonese'], 'tommy@jadesupply.com', 'jadesupply.com', true),
('Vincent Park', 'Park Brothers Supplies', 'Distribution', 'Korean ingredients, restaurant equipment', ARRAY['English', 'Korean'], 'vincent@parkbrothers.com', 'parkbrothers.com', true),
('Lisa Chen', 'Chen PR & Brand Strategy', 'Marketing', 'Brand launch, food media relations', ARRAY['English', 'Mandarin'], 'lisa@chenpr.com', 'chenpr.com', true),
('Michael Kumar', 'Kumar Accounting & Tax', 'Finance', 'Restaurant accounting, tax optimization', ARRAY['English', 'Hindi', 'Tamil'], 'michael@kumaraccounting.com', 'kumaraccounting.com', true);

-- Seed guides data (simplified; full content would be loaded separately)
INSERT INTO guides (title, slug, category, phase, content, published) VALUES
('Entity Setup & Visa Strategy', 'entity-visa-setup', 'Visa & Legal', 'Pre-Launch', '<h2>Choose Your Business Entity</h2>
<p>The first critical decision is selecting the right business structure. For F&B in NYC, founders typically choose between an LLC or C-Corporation.</p>

<h3>Limited Liability Company (LLC)</h3>
<p>Best for: Most first-time F&B operators. LLCs provide liability protection, flexible taxation, and simpler administration. Filing costs are ~$125 in NY State. You can elect to be taxed as an S-Corp for potential tax savings.</p>

<h3>C-Corporation</h3>
<p>Best for: Founders planning VC funding or future acquisitions. More expensive and complex, but aligns with investor expectations.</p>

<h2>Visa Pathways for Foreign Founders</h2>
<p>As a foreign founder, you have several options to legally operate in the US:</p>

<h3>E-2 Treaty Investor Visa</h3>
<p>Ideal for restaurant operators. Requires substantial investment (~$200K–$500K) and proof of control. Processing: 2–4 months. No green card path, renewable every 2 years.</p>

<h3>L-1A Intracompany Transferee (for parent company)</h3>
<p>Option if you have an established business abroad. Requires 1+ year management experience. Potential green card path.</p>

<h3>EB-5 Immigrant Investor Visa</h3>
<p>For substantial investment ($1.05M–$1.35M depending on region). Long timeline (4+ years) but leads to permanent residency.</p>

<h2>Next Steps</h2>
<ol>
<li>Register your LLC with NY State Department of State</li>
<li>Obtain an EIN from the IRS</li>
<li>Consult immigration attorney for visa strategy</li>
<li>Open business bank account with EIN</li>
</ol>', true),
('NYC Health Department Permits', 'health-permits', 'Permits & Licensing', 'Pre-Launch', '<h2>Food Service Establishment Permit</h2>
<p>The NYC Department of Health and Mental Hygiene (DOHMH) requires all food service establishments to obtain a permit before opening.</p>

<h3>Application Process</h3>
<ol>
<li>Complete online application through DOHMH portal</li>
<li>Submit floor plan and equipment specifications</li>
<li>Pass pre-operational inspection</li>
<li>Pay application fee ($315)</li>
<li>Receive permit approval</li>
</ol>

<h3>Timeline</h3>
<p>Processing typically takes 4-6 weeks. Plan for this in your pre-launch timeline.</p>

<h3>Common Pitfalls</h3>
<ul>
<li>Incomplete floor plans</li>
<li>Inadequate ventilation systems</li>
<li>Non-compliant equipment specifications</li>
</ul>

<h2>Additional Permits</h2>
<p>Depending on your concept, you may also need:</p>
<ul>
<li>Sidewalk cafe permit</li>
<li>Alcohol license (if serving alcohol)</li>
<li>Entertainment license (if live music)</li>
</ul>', true),
('Lease Negotiation Playbook for F&B', 'lease-negotiation', 'Real Estate', 'Pre-Launch', '<h2>Understanding Commercial Leases</h2>
<p>Commercial leases are complex and long-term commitments. Understanding key terms is crucial for restaurant success.</p>

<h3>Key Lease Terms</h3>
<ul>
<li><strong>Base Rent:</strong> Fixed monthly payment</li>
<li><strong>Additional Rent:</strong> Percentage of gross sales (typically 5-10%)</li>
<li><strong>Term Length:</strong> Usually 5-10 years with renewal options</li>
<li><strong>Build-out Allowance:</strong> Landlord contribution to renovations</li>
</ul>

<h3>Negotiation Strategies</h3>
<h4>Free Rent Period</h4>
<p>Negotiate 1-3 months free rent for build-out and soft opening.</p>

<h4>Percentage Rent Cap</h4>
<p>Cap additional rent at a reasonable percentage to protect against over-performance.</p>

<h4>Expansion Rights</h4>
<p>Secure right of first refusal for adjacent spaces.</p>

<h2>Due Diligence Checklist</h2>
<ul>
<li>Verify square footage measurements</li>
<li>Check utility capacity and costs</li>
<li>Review existing tenant sales data</li>
<li>Assess neighborhood foot traffic patterns</li>
</ul>', true),
('Hiring & NYC Labor Law Compliance', 'hiring-labor', 'Operations', 'Launch', '<h2>NYC Labor Laws Overview</h2>
<p>New York City has some of the most employee-friendly labor laws in the US. Understanding and complying with these regulations is essential.</p>

<h3>Minimum Wage</h3>
<p>As of 2026, NYC minimum wage is $18.50/hour for large employers (over $1M in sales). Tipped workers receive $12.50/hour plus tips.</p>

<h3>Scheduling Requirements</h3>
<ul>
<li>Advance notice of schedules (10-14 days)</li>
<li>Predictable scheduling rights</li>
<li>Premium pay for schedule changes</li>
</ul>

<h3>Paid Sick Leave</h3>
<p>NYC requires 5-10 days of paid sick leave annually, depending on business size.</p>

<h2>Hiring Process</h2>
<h3>Job Descriptions</h3>
<p>Create detailed job descriptions including:</p>
<ul>
<li>Responsibilities and duties</li>
<li>Required skills and experience</li>
<li>Physical requirements</li>
<li>Work hours and schedule</li>
</ul>

<h3>Interviewing</h3>
<p>Use structured interviews and assess:</p>
<ul>
<li>Food service experience</li>
<li>Customer service skills</li>
<li>Reliability and work ethic</li>
<li>Cultural fit</li>
</ul>', true),
('Specialty Ingredient Sourcing in NYC', 'ingredient-sourcing', 'Operations', 'Launch', '<h2>NYC Food Distribution Landscape</h2>
<p>New York City has a robust network of food distributors and specialty suppliers serving the restaurant industry.</p>

<h3>Major Distributors</h3>
<ul>
<li><strong>Sysco:</strong> Full-service distribution, broad product range</li>
<li><strong>US Foods:</strong> Restaurant-focused, competitive pricing</li>
<li><strong>Gordon Food Service:</strong> Regional coverage, specialty items</li>
</ul>

<h3>Specialty Asian Suppliers</h3>
<ul>
<li><strong>Katagiri & Co:</strong> Japanese ingredients, wholesale pricing</li>
<li><strong>Asia Market Corporation:</strong> Pan-Asian specialty items</li>
<li><strong>Famous Foods:</strong> Chinese ingredients, bulk orders</li>
</ul>

<h2>Import Considerations</h2>
<h3>Customs and Duties</h3>
<p>When importing specialty ingredients:</p>
<ul>
<li>Register with US Customs and Border Protection</li>
<li>Understand duty rates (often 0-5% for food items)</li>
<li>Consider FDA import requirements</li>
</ul>

<h3>Lead Times</h3>
<p>Plan for 2-4 weeks for international shipments. Maintain buffer inventory for critical ingredients.</p>

<h2>Local Sourcing</h2>
<p>Leverage NYC''s diverse food ecosystem:</p>
<ul>
<li>Union Square Greenmarket for local produce</li>
<li>Specialty butcher shops for proteins</li>
<li>Artisanal suppliers for unique ingredients</li>
</ul>', true),
('Brand Name Localization Strategy', 'localization', 'Marketing', 'Pre-Launch', '<h2>Understanding Cultural Context</h2>
<p>Successful brand localization requires understanding both your home market and the NYC context.</p>

<h3>Brand Name Considerations</h3>
<ul>
<li><strong>Pronunciation:</strong> Ensure name is easy for English speakers</li>
<li><strong>Meaning:</strong> Consider cultural connotations</li>
<li><strong>Domain Availability:</strong> Check .com and social media handles</li>
</ul>

<h3>Translation vs. Transcreation</h3>
<p>Simple translation may not capture brand essence. Consider transcreation for marketing materials.</p>

<h2>Menu Localization</h2>
<h3>Dish Names</h3>
<p>Balance authenticity with accessibility:</p>
<ul>
<li>Keep traditional names with English explanations</li>
<li>Use descriptive names for unfamiliar dishes</li>
<li>Consider portion sizes and pricing expectations</li>
</ul>

<h3>Ingredient Communication</h3>
<p>Educate customers about specialty ingredients through:</p>
<ul>
<li>Menu descriptions</li>
<li>Table tents and signage</li>
<li>Server training</li>
</ul>

<h2>Visual Identity</h2>
<h3>Color Psychology</h3>
<p>Colors carry different meanings across cultures. Research NYC audience preferences.</p>

<h3>Typography</h3>
<p>Ensure fonts are legible and culturally appropriate.</p>

<h2>Marketing Messaging</h2>
<h3>Storytelling</h3>
<p>Craft narratives that resonate with NYC audiences while honoring your heritage.</p>

<h3>Social Media Strategy</h3>
<p>Adapt content for Instagram, TikTok, and local platforms.</p>', true);
