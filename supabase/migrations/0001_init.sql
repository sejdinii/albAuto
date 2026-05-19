-- AlbAuto initial schema
-- Run this in Supabase SQL Editor (Database -> SQL Editor -> New query)

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role        as enum ('buyer', 'seller', 'dealer', 'admin');
create type listing_status   as enum ('draft', 'active', 'paused', 'sold');
create type ad_tier          as enum ('standard', 'premium');
create type verified_kind    as enum ('gold', 'blue', 'green');
create type social_provider  as enum ('instagram', 'facebook');
create type import_status    as enum ('queued', 'fetching', 'extracting', 'ready', 'review', 'duplicate', 'published', 'skipped', 'failed');
create type fuel_kind        as enum ('petrol', 'diesel', 'hybrid', 'electric', 'lpg');
create type body_kind        as enum ('sedan', 'suv', 'wagon', 'coupe', 'pickup', 'hatch', 'convertible', 'van');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  name         text,
  phone        text,
  city         text,
  country      text default 'MK',
  avatar_url   text,
  role         user_role not null default 'buyer',
  verified     verified_kind,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by anyone"
  on public.profiles for select using (true);

create policy "users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, phone)
  values (new.id, new.raw_user_meta_data->>'name', new.phone);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- DEALERS
-- ============================================================

create table public.dealers (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  handle          text unique,
  city            text,
  country         text default 'MK',
  verified        boolean default false,
  plan            text default 'free',
  created_at      timestamptz not null default now()
);

alter table public.dealers enable row level security;

create policy "dealers are readable by anyone"
  on public.dealers for select using (true);

create policy "users manage own dealer"
  on public.dealers for all using (auth.uid() = owner_id);

-- ============================================================
-- SOCIAL ACCOUNTS
-- ============================================================

create table public.social_accounts (
  id             uuid primary key default gen_random_uuid(),
  dealer_id      uuid not null references public.dealers(id) on delete cascade,
  provider       social_provider not null,
  handle         text not null,
  external_id    text,
  access_token   text,
  refresh_token  text,
  expires_at     timestamptz,
  status         text default 'connected',
  last_synced_at timestamptz,
  created_at     timestamptz not null default now(),
  unique(dealer_id, provider)
);

alter table public.social_accounts enable row level security;

create policy "dealers see own social accounts"
  on public.social_accounts for select
  using (dealer_id in (select id from public.dealers where owner_id = auth.uid()));

create policy "dealers manage own social accounts"
  on public.social_accounts for all
  using (dealer_id in (select id from public.dealers where owner_id = auth.uid()));

-- ============================================================
-- LISTINGS
-- ============================================================

create table public.listings (
  id              uuid primary key default gen_random_uuid(),
  seller_id       uuid not null references public.profiles(id) on delete cascade,
  dealer_id       uuid references public.dealers(id) on delete set null,
  status          listing_status not null default 'draft',
  tier            ad_tier not null default 'standard',
  -- vehicle
  make            text not null,
  model           text not null,
  trim            text,
  year            int not null,
  km              int,
  body            body_kind,
  fuel            fuel_kind,
  hp              int,
  transmission    text,
  drive           text,
  -- pricing
  price_eur       int,
  price_aed       int,
  currency        text default 'EUR',
  -- location
  city            text,
  country         text,
  -- presentation
  hue             int default 30,
  description     text,
  features        text[] default '{}',
  -- meta
  view_count      int default 0,
  source          text default 'manual',
  source_url      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  published_at    timestamptz
);

create index listings_status_idx        on public.listings(status);
create index listings_seller_idx        on public.listings(seller_id);
create index listings_dealer_idx        on public.listings(dealer_id);
create index listings_make_model_idx    on public.listings(make, model);
create index listings_country_city_idx  on public.listings(country, city);
create index listings_published_at_idx  on public.listings(published_at desc);

alter table public.listings enable row level security;

create policy "active listings are readable by anyone"
  on public.listings for select
  using (status = 'active' or seller_id = auth.uid());

create policy "users insert own listings"
  on public.listings for insert
  with check (auth.uid() = seller_id);

create policy "users update own listings"
  on public.listings for update
  using (auth.uid() = seller_id);

create policy "users delete own listings"
  on public.listings for delete
  using (auth.uid() = seller_id);

-- ============================================================
-- LISTING PHOTOS
-- ============================================================

create table public.listing_photos (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  url         text not null,
  storage_path text,
  position    int not null default 0,
  is_cover    boolean default false,
  created_at  timestamptz not null default now()
);

create index listing_photos_listing_idx on public.listing_photos(listing_id);

alter table public.listing_photos enable row level security;

create policy "photos readable by anyone"
  on public.listing_photos for select using (true);

create policy "users manage own listing photos"
  on public.listing_photos for all
  using (listing_id in (select id from public.listings where seller_id = auth.uid()));

-- ============================================================
-- FAVORITES
-- ============================================================

create table public.favorites (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, listing_id)
);

alter table public.favorites enable row level security;

create policy "users see own favorites"
  on public.favorites for select using (auth.uid() = user_id);
create policy "users manage own favorites"
  on public.favorites for all using (auth.uid() = user_id);

-- ============================================================
-- IMPORT JOBS  (social auto-import)
-- ============================================================

create table public.import_jobs (
  id                 uuid primary key default gen_random_uuid(),
  dealer_id          uuid not null references public.dealers(id) on delete cascade,
  social_account_id  uuid references public.social_accounts(id) on delete set null,
  source             social_provider,
  source_url         text,
  source_id          text,
  caption            text,
  raw_photos         jsonb default '[]'::jsonb,
  status             import_status not null default 'queued',
  ai_confidence      int,
  ai_extraction      jsonb,
  duplicate_of       uuid references public.listings(id) on delete set null,
  listing_id         uuid references public.listings(id) on delete set null,
  error              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index import_jobs_dealer_idx on public.import_jobs(dealer_id, status);
create index import_jobs_status_idx on public.import_jobs(status);

alter table public.import_jobs enable row level security;

create policy "dealers see own jobs"
  on public.import_jobs for select
  using (dealer_id in (select id from public.dealers where owner_id = auth.uid()));

create policy "dealers manage own jobs"
  on public.import_jobs for all
  using (dealer_id in (select id from public.dealers where owner_id = auth.uid()));

-- ============================================================
-- CHATS  (placeholder for future Realtime use)
-- ============================================================

create table public.chats (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid references public.listings(id) on delete set null,
  buyer_id     uuid not null references public.profiles(id) on delete cascade,
  seller_id    uuid not null references public.profiles(id) on delete cascade,
  last_message text,
  last_at      timestamptz,
  created_at   timestamptz not null default now()
);

create unique index chats_unique_pair_listing
  on public.chats(buyer_id, seller_id, listing_id);

create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  chat_id    uuid not null references public.chats(id) on delete cascade,
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  body       text,
  kind       text default 'text',
  meta       jsonb,
  created_at timestamptz not null default now()
);

create index messages_chat_idx on public.messages(chat_id, created_at);

alter table public.chats enable row level security;
alter table public.messages enable row level security;

create policy "chat parties see chat"
  on public.chats for select
  using (auth.uid() in (buyer_id, seller_id));

create policy "buyers create chats"
  on public.chats for insert
  with check (auth.uid() = buyer_id);

create policy "chat parties see messages"
  on public.messages for select
  using (chat_id in (select id from public.chats where auth.uid() in (buyer_id, seller_id)));

create policy "chat parties send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and chat_id in (select id from public.chats where auth.uid() in (buyer_id, seller_id))
  );

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('listing-photos', 'listing-photos', true),
  ('avatars',        'avatars',        true)
on conflict (id) do nothing;

create policy "anyone can view listing photos"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

create policy "auth users can upload listing photos"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-photos'
    and auth.role() = 'authenticated'
  );

create policy "owners can delete own listing photos"
  on storage.objects for delete
  using (bucket_id = 'listing-photos' and auth.uid()::text = (storage.foldername(name))[1]);
