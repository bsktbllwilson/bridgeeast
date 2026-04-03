# BridgeEast Copilot Instructions

BridgeEast is a Next.js 14 full-stack web app helping Asian F&B brands navigate NYC expansion.

## Project Essentials

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Key Libraries:** Recharts (charts), Playfair Display + DM Sans (fonts)
- **Design Accent:** #D85A30 (terracotta)

## Core Features

1. **Market Data Dashboard** — Interactive charts with rent benchmarks, foot traffic, neighborhood metrics
2. **Curated Guides** — Phase-based playbooks (visa, permits, lease, hiring, sourcing, localization)
3. **Partner Directory** — Vetted specialists filterable by category and language
4. **Waitlist Form** — Email capture with brand name, origin country, target opening date

## Key Directories

- `src/app/` — All pages and routes
- `src/components/` — Reusable components (Header, Footer)
- `src/lib/` — Utilities (Supabase client)
- `supabase/migrations/` — Database schema SQL
- `supabase/seed.sql` — Sample data

## Important Files

- `README.md` — Full setup and deployment guide
- `SUPABASE_SETUP.md` — Step-by-step Supabase initialization
- `.env.example` — Environment template
- `package.json` — Scripts: `dev`, `build`, `start`, `lint`

## Development Workflow

1. **Local development:** `npm run dev` → http://localhost:3000
2. **Build for production:** `npm run build`
3. **Linting:** `npm run lint`

## Database

Tables: `neighborhoods`, `partners`, `guides`, `waitlist`

To initialize:
1. Copy `.env.example` to `.env.local`
2. Add Supabase credentials
3. Run SQL migrations in Supabase dashboard
4. Run seed data

See `SUPABASE_SETUP.md` for detailed instructions.

## Design System

- **Primary Color:** #D85A30 (accent)
- **Typography:** Playfair Display (headings) + DM Sans (body)
- **Components:** `.btn-primary`, `.btn-secondary`, `.section`, `.container`
- **Aesthetic:** Editorial, clean, minimal (premium publication style)

## Common Tasks

**Add a new page:**
- Create file in `src/app/[route]/page.tsx`
- Import Header/Footer for consistency

**Update styles:**
- Modify `src/app/globals.css` for global rules
- Use `tailwind.config.ts` for theme variables
- Inline classes with Tailwind in components

**Add a guide:**
- Insert row in Supabase `guides` table
- Update guide content in `src/app/guides/[slug]/page.tsx`

**Add a partner:**
- Insert row in Supabase `partners` table with category, languages array, verified flag

## Deployment

- **Vercel (recommended):** Connect GitHub repo, set env vars, deploy
- **Self-hosted:** `npm run build && npm start`

Ensure environment variables are set in production.

## Support

Refer to `README.md` and `SUPABASE_SETUP.md` for detailed guidance.
