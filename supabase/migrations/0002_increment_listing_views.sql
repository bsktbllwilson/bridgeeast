-- Atomic single-row increment for listings.view_count.
-- SECURITY DEFINER so anon callers can bump the counter without granting
-- broader UPDATE rights on listings via RLS.

create or replace function public.increment_listing_views(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.listings
  set view_count = view_count + 1
  where id = p_id;
$$;

revoke all on function public.increment_listing_views(uuid) from public;
grant execute on function public.increment_listing_views(uuid) to anon, authenticated;
