# BridgeEast

A full-stack web platform helping Asian F&B brands navigate their first NYC location. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Overview

**BridgeEast** is a comprehensive platform featuring:

1. **Market Data Dashboard** — Neighborhood-level rent benchmarks, foot traffic indicators, and competitive analysis
2. **Curated Guides** — Step-by-step playbooks for visa strategy, permits, leasing, hiring, sourcing, and brand localization
3. **Partner Directory** — Pre-vetted specialists (real estate brokers, immigration attorneys, ingredient distributors, PR/localization agencies, accountants)

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, custom design system with accent color `#D85A30` (terracotta)
- **Database:** Supabase (PostgreSQL)
- **Fonts:** Playfair Display (headings), DM Sans (body)
- **Charts:** Recharts

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase project (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bridgeeast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add:
   - `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anon key

4. **Initialize the database**
   
   In Supabase:
   - Open the SQL editor
   - Run `supabase/migrations/001_initial_schema.sql` to create tables
   - Run `supabase/seed.sql` to seed sample data

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bridgeeast/
├── src/
│   ├── app/
│   │   ├── (pages)       # All main routes
│   │   ├── globals.css   # Global styles
│   │   └── layout.tsx    # Root layout
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── lib/
│       └── supabase.ts   # Supabase client
├── supabase/
│   ├── migrations/       # Database schema
│   └── seed.sql         # Sample data
├── public/              # Static assets
├── .env.example         # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Pages & Routes

- `/` — Landing page with hero, stats, three pillars, data preview, partners grid, waitlist CTA
- `/data` — Interactive market data dashboard with rent chart and neighborhood metrics
- `/guides` — Guide library with category filtering
- `/guides/[slug]` — Individual guide detail pages
- `/partners` — Searchable partner directory with category and language filters
- `/waitlist` — Email capture form for early access

## Database Schema

### neighborhoods
```sql
- id (UUID)
- name (TEXT)
- avg_rent_sqft (NUMERIC)
- foot_traffic_score (INT 0-100)
- asian_dining_score (INT 0-100)
- competitor_count (INT)
- created_at, updated_at (TIMESTAMP)
```

### partners
```sql
- id (UUID)
- name, firm, category (TEXT)
- specialty (TEXT)
- languages (TEXT[])
- email, website (TEXT)
- verified (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### guides
```sql
- id (UUID)
- title, slug (TEXT)
- category, phase (TEXT)
- content (TEXT)
- published (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### waitlist
```sql
- id (UUID)
- email (TEXT)
- brand_name, origin_country (TEXT)
- target_open_date (DATE)
- created_at, updated_at (TIMESTAMP)
```

## Design System

### Colors
- **Primary/Accent:** `#D85A30` (terracotta/coral)
- **Dark Accent:** `#B84620`
- **Light Accent:** `#E87A50`
- **Background:** White
- **Text:** Dark gray/charcoal

### Typography
- **Headings:** Playfair Display (serif) — bold
- **Body:** DM Sans (sans-serif) — regular/medium

### Components
- `.btn-primary` — Accent background with white text
- `.btn-secondary` — Bordered with accent text
- `.btn-outline` — Bordered with dark text
- `.section` — Vertical spacing (py-16 md:py-24)
- `.section-title` — Large serif heading (4xl–5xl)
- `.container` — Max-width wrapper with padding

## API Routes (Future)

To extend with API functionality:

```
/api/waitlist/subscribe  — POST to add email to waitlist
/api/partners            — GET/POST partner data
/api/guides              — GET guide content
/api/admin/auth          — Protected admin authentication
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
npm run build
npm start
```

### Self-Hosted

1. Build the project: `npm run build`
2. Set environment variables
3. Run: `npm start`

## Customization

### Changing the Accent Color

1. Update `tailwind.config.ts`:
   ```ts
   colors: {
     accent: '#YOUR_NEW_COLOR',
   }
   ```

2. Update CSS variables in `src/app/globals.css` for consistency

### Adding New Guides

1. Add entry to `guides` table via Supabase
2. Add content structure to `src/app/guides/[slug]/page.tsx`
3. Guides are dynamically loaded from the database

### Managing Partners

1. Add/edit partners in Supabase `partners` table directly, or
2. Build an admin panel (`/admin`) with protected routes using Supabase Auth

## Development Notes

- Static/dynamic content balance: Landing page and routes are statically rendered; guides, partners, and neighborhoods should fetch from Supabase
- For production, consider caching strategies (ISR) for frequently accessed data
- Waitlist form currently logs to console; connect to email service (Resend, SendGrid) for production

## License

MIT

## Support

For support, partnership inquiries, or to report bugs, contact the team at [your-email@bridgeeast.io]

---

**Built with ❤️ for Asian F&B founders bringing their brands to NYC.**
