# Supabase Setup Guide

This guide walks you through setting up Supabase for BridgeEast.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier available)
2. Create a new project:
   - **Name:** BridgeEast (or your choice)
   - **Database Password:** Generate a strong password (save this!)
   - **Region:** Choose closest to you or US-East-1 (default)
3. Wait for the project to initialize (~2 minutes)

## Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
   - **Service Role Key** → (keep this secret, for admin operations only)

## Step 3: Initialize the Database

1. In Supabase, go to the **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run**

You should see: "Success. No rows returned"

## Step 4: Seed Sample Data

1. In the **SQL Editor**, create another new query
2. Copy and paste the contents of `supabase/seed.sql`
3. Click **Run**

You should see entries created for neighborhoods, partners, and guides.

## Step 5: Verify the Tables

1. Go to **Table Editor** in the left sidebar
2. You should see:
   - `neighborhoods` (5 rows)
   - `partners` (8 rows)
   - `guides` (6 rows)
   - `waitlist` (0 rows, will populate when users sign up)

Click into each table to verify data.

## Step 6: Enable Row Level Security (RLS)

For production safety:

1. Go to **Authentication** → **Policies**
2. For each table (`neighborhoods`, `guides`, `partners`, `waitlist`):
   - Enable RLS
   - Add a policy: SELECT → Authenticated users
   - For `waitlist`: Allow INSERT for all users with their own email

This prevents public database access while allowing your app to read data.

## Step 7: Test Your Connection

In your terminal:

```bash
# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials to .env.local

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:3000/data` — you should see the neighborhood rent chart populated.

## Troubleshooting

### "Connection refused" error
- Check your `NEXT_PUBLIC_SUPABASE_URL` is correct (no trailing slash)
- Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **Anon Key**, not the Service Role Key

### Tables are empty
- Re-run `supabase/seed.sql` in the SQL Editor
- Or manually insert sample records

### CORS errors
- Supabase automatically allows `localhost:3000` during development
- For production, add your domain to **Settings** → **API** → **Authorized URLs**

## Managing Data

### Adding Partners
1. Go to **Table Editor** → `partners`
2. Click **Insert Row**
3. Fill in fields (name, firm, category, specialty, languages array, email, website, verified checkbox)

### Updating Guides
1. Go to **Table Editor** → `guides`
2. Click the row to edit
3. Update content and republish

### Viewing Waitlist Signups
1. Go to **Table Editor** → `waitlist`
2. All signups appear here with timestamp

## Production Considerations

Before deploying to production:

1. **Enable RLS** on all tables (see Step 6)
2. **Backup your database**: Supabase → **Settings** → **Backups**
3. **Review Rate Limits**: Supabase free tier has limits; upgrade if needed
4. **Monitor Costs**: Check **Usage** dashboard regularly
5. **Set up Authentication** if building admin features (beyond waitlist)

For questions, see [Supabase Docs](https://supabase.com/docs).
