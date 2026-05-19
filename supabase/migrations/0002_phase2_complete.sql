-- Phase 2 round 2: saved searches, recent views, appointments.
-- Idempotent: safe to re-run.

-- ============================================================
-- SAVED SEARCHES
-- ============================================================

create table if not exists public.saved_searches (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  filters     jsonb not null default '{}'::jsonb,
  alerts      boolean default true,
  created_at  timestamptz not null default now()
);

create index if not exists saved_searches_user_idx on public.saved_searches(user_id);

alter table public.saved_searches enable row level security;

do $$ begin
  create policy "users manage own saved searches"
    on public.saved_searches for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- ============================================================
-- RECENT VIEWS
-- ============================================================

create table if not exists public.recent_views (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  last_viewed timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create index if not exists recent_views_recent_idx on public.recent_views(user_id, last_viewed desc);

alter table public.recent_views enable row level security;

do $$ begin
  create policy "users see own recents"
    on public.recent_views for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "users manage own recents"
    on public.recent_views for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- ============================================================
-- APPOINTMENTS
-- ============================================================

create table if not exists public.appointments (
  id          uuid primary key default gen_random_uuid(),
  buyer_id    uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  start_at    timestamptz not null,
  kind        text not null default 'test_drive',
  status      text not null default 'pending',
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists appointments_buyer_idx on public.appointments(buyer_id);
create index if not exists appointments_listing_idx on public.appointments(listing_id);

alter table public.appointments enable row level security;

do $$ begin
  create policy "buyers manage own appointments"
    on public.appointments for all using (auth.uid() = buyer_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "sellers see appointments for own listings"
    on public.appointments for select
    using (listing_id in (select id from public.listings where seller_id = auth.uid()));
exception when duplicate_object then null; end $$;

-- ============================================================
-- HELPER VIEWS for browse counts (cheap reads, no RLS needed
-- because they aggregate over public listings only)
-- ============================================================

create or replace view public.listing_counts_by_country as
  select country, count(*)::int as count
  from public.listings
  where status = 'active' and country is not null
  group by country;

create or replace view public.listing_counts_by_city as
  select country, city, count(*)::int as count
  from public.listings
  where status = 'active' and city is not null
  group by country, city;

create or replace view public.listing_counts_by_make as
  select country, make, count(*)::int as count
  from public.listings
  where status = 'active'
  group by country, make;

create or replace view public.listing_counts_by_model as
  select country, make, model, count(*)::int as count
  from public.listings
  where status = 'active'
  group by country, make, model;

-- ============================================================
-- REALTIME: enable for messages so chat updates live
-- ============================================================

do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; when others then null; end $$;
