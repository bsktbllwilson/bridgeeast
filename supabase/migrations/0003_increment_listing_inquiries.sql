-- Atomic single-row increment for listings.inquiry_count, callable by
-- buyers (anon RLS would otherwise block UPDATEs to listings they don't
-- own). Same pattern as 0002_increment_listing_views.

create or replace function public.increment_listing_inquiries(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.listings
  set inquiry_count = inquiry_count + 1
  where id = p_id;
$$;

revoke all on function public.increment_listing_inquiries(uuid) from public;
grant execute on function public.increment_listing_inquiries(uuid) to authenticated;
