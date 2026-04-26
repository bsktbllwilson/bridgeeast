-- Pass The Plate — initial schema
--
-- Tables: profiles, listings, listing_inquiries, partners, partner_inquiries,
--         playbook_posts, memberships, newsletter_subscribers
-- All tables have RLS enabled; see policies at the bottom.
-- partner_inquiries RLS isn't in the original spec — added by analogy with
-- listing_inquiries (sender insert/select, recipient select, admin all).

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto" with schema public;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- Touch updated_at on UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- True if the calling user has profile.role = 'admin'. SECURITY DEFINER so it
-- bypasses the profiles RLS policy that would otherwise hide other rows.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text,
  full_name text,
  role text not null default 'buyer'
    check (role in ('buyer','seller','partner','admin')),
  preferred_language text not null default 'en'
    check (preferred_language in ('en','zh','ko','vi')),
  phone text,
  proof_of_funds_verified boolean not null default false,
  proof_of_funds_verified_at timestamptz
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when a new auth.users row is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- listings
-- ---------------------------------------------------------------------------

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seller_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'draft'
    check (status in ('draft','pending_review','active','under_offer','sold','withdrawn')),
  title text not null,
  title_translations jsonb not null default '{}'::jsonb,
  description text,
  description_translations jsonb not null default '{}'::jsonb,
  industry text,
  cuisine text,
  city text,
  state text,
  neighborhood text,
  lat double precision,
  lng double precision,
  asking_price_cents bigint,
  annual_revenue_cents bigint,
  annual_profit_cents bigint,
  year_established int,
  staff_count int,
  square_footage int,
  includes_real_estate boolean not null default false,
  assets jsonb not null default '[]'::jsonb,
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  chowbus_verified boolean not null default false,
  view_count int not null default 0,
  inquiry_count int not null default 0
);

create index listings_status_idx on public.listings (status);
create index listings_seller_id_idx on public.listings (seller_id);
create index listings_city_idx on public.listings (city);
create index listings_cuisine_idx on public.listings (cuisine);
create index listings_industry_idx on public.listings (industry);

create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- listing_inquiries
-- ---------------------------------------------------------------------------

create table public.listing_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete set null,
  message text,
  status text not null default 'pending'
    check (status in ('pending','accepted','rejected'))
);

create index listing_inquiries_listing_id_idx on public.listing_inquiries (listing_id);
create index listing_inquiries_buyer_id_idx on public.listing_inquiries (buyer_id);

-- ---------------------------------------------------------------------------
-- partners
-- ---------------------------------------------------------------------------

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  job_title text,
  company text,
  email text,
  phone text,
  website text,
  address text,
  specialty text,
  languages text[] not null default '{}',
  bio text,
  referral_source text,
  approved boolean not null default false,
  featured boolean not null default false
);

create index partners_specialty_idx on public.partners (specialty);
create index partners_approved_idx on public.partners (approved);
create index partners_profile_id_idx on public.partners (profile_id);

create trigger partners_set_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- partner_inquiries
-- ---------------------------------------------------------------------------

create table public.partner_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  message text
);

create index partner_inquiries_partner_id_idx on public.partner_inquiries (partner_id);
create index partner_inquiries_sender_id_idx on public.partner_inquiries (sender_id);

-- ---------------------------------------------------------------------------
-- playbook_posts
-- ---------------------------------------------------------------------------

create table public.playbook_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text unique not null,
  title text not null,
  title_translations jsonb not null default '{}'::jsonb,
  excerpt text,
  body_md text,
  body_md_translations jsonb not null default '{}'::jsonb,
  category text
    check (category in ('buying','selling','legal','visa_immigration','market_entry','operations','finance')),
  cover_image_url text,
  author_name text,
  published boolean not null default false,
  published_at timestamptz
);

create index playbook_posts_category_idx on public.playbook_posts (category);
create index playbook_posts_published_idx on public.playbook_posts (published);

create trigger playbook_posts_set_updated_at
  before update on public.playbook_posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- memberships
-- ---------------------------------------------------------------------------

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  tier text not null default 'first_bite'
    check (tier in ('first_bite','chefs_table','full_menu')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  status text not null default 'active'
    check (status in ('active','past_due','canceled','trialing'))
);

create index memberships_stripe_customer_id_idx on public.memberships (stripe_customer_id);
create index memberships_stripe_subscription_id_idx on public.memberships (stripe_subscription_id);

create trigger memberships_set_updated_at
  before update on public.memberships
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------------

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text unique not null,
  source text
);

-- ===========================================================================
-- Row Level Security
-- ===========================================================================

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_inquiries enable row level security;
alter table public.partners enable row level security;
alter table public.partner_inquiries enable row level security;
alter table public.playbook_posts enable row level security;
alter table public.memberships enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- profiles
create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_admin_select_all"
  on public.profiles for select to authenticated
  using (public.is_admin());

-- listings
create policy "listings_public_select_active"
  on public.listings for select to anon, authenticated
  using (status = 'active');

create policy "listings_seller_select_own"
  on public.listings for select to authenticated
  using (auth.uid() = seller_id);

create policy "listings_seller_insert_own"
  on public.listings for insert to authenticated
  with check (auth.uid() = seller_id);

create policy "listings_seller_update_own"
  on public.listings for update to authenticated
  using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

create policy "listings_admin_all"
  on public.listings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- listing_inquiries
create policy "listing_inquiries_buyer_insert"
  on public.listing_inquiries for insert to authenticated
  with check (auth.uid() = buyer_id);

create policy "listing_inquiries_buyer_select"
  on public.listing_inquiries for select to authenticated
  using (auth.uid() = buyer_id);

create policy "listing_inquiries_seller_select"
  on public.listing_inquiries for select to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_inquiries.listing_id
        and l.seller_id = auth.uid()
    )
  );

create policy "listing_inquiries_admin_all"
  on public.listing_inquiries for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- partners
create policy "partners_public_select_approved"
  on public.partners for select to anon, authenticated
  using (approved = true);

create policy "partners_self_select"
  on public.partners for select to authenticated
  using (auth.uid() = profile_id);

create policy "partners_self_update"
  on public.partners for update to authenticated
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "partners_admin_all"
  on public.partners for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- partner_inquiries (not in original spec — analogous to listing_inquiries)
create policy "partner_inquiries_sender_insert"
  on public.partner_inquiries for insert to authenticated
  with check (auth.uid() = sender_id);

create policy "partner_inquiries_sender_select"
  on public.partner_inquiries for select to authenticated
  using (auth.uid() = sender_id);

create policy "partner_inquiries_partner_select"
  on public.partner_inquiries for select to authenticated
  using (
    exists (
      select 1 from public.partners p
      where p.id = partner_inquiries.partner_id
        and p.profile_id = auth.uid()
    )
  );

create policy "partner_inquiries_admin_all"
  on public.partner_inquiries for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- playbook_posts
create policy "playbook_posts_public_select_published"
  on public.playbook_posts for select to anon, authenticated
  using (published = true);

create policy "playbook_posts_admin_all"
  on public.playbook_posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- memberships
create policy "memberships_self_all"
  on public.memberships for all to authenticated
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "memberships_admin_all"
  on public.memberships for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- newsletter_subscribers
create policy "newsletter_subscribers_public_insert"
  on public.newsletter_subscribers for insert to anon, authenticated
  with check (true);

create policy "newsletter_subscribers_admin_select"
  on public.newsletter_subscribers for select to authenticated
  using (public.is_admin());
