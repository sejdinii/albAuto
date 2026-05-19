import { supabase } from './supabase';

export type Listing = {
  id: string;
  seller_id: string;
  dealer_id: string | null;
  status: 'draft' | 'active' | 'paused' | 'sold';
  tier: 'standard' | 'premium';
  make: string;
  model: string;
  trim: string | null;
  year: number;
  km: number | null;
  body: string | null;
  fuel: string | null;
  hp: number | null;
  transmission: string | null;
  drive: string | null;
  price_eur: number | null;
  price_aed: number | null;
  currency: string;
  city: string | null;
  country: string | null;
  hue: number;
  description: string | null;
  features: string[];
  view_count: number;
  source: string;
  source_url: string | null;
  created_at: string;
  published_at: string | null;
};

export type ListingPhoto = {
  id: string;
  listing_id: string;
  url: string;
  position: number;
  is_cover: boolean;
};

export type ListingWithCover = Listing & { cover_url: string | null; photo_count: number };

export type Dealer = {
  id: string;
  owner_id: string;
  name: string;
  handle: string | null;
  city: string | null;
  country: string | null;
  verified: boolean;
  plan: string;
};

export type SocialAccount = {
  id: string;
  dealer_id: string;
  provider: 'instagram' | 'facebook';
  handle: string;
  status: string;
  last_synced_at: string | null;
};

export type ImportJob = {
  id: string;
  dealer_id: string;
  source: 'instagram' | 'facebook' | null;
  source_url: string | null;
  caption: string | null;
  status:
    | 'queued'
    | 'fetching'
    | 'extracting'
    | 'ready'
    | 'review'
    | 'duplicate'
    | 'published'
    | 'skipped'
    | 'failed';
  ai_confidence: number | null;
  ai_extraction: AIExtraction | null;
  listing_id: string | null;
  error: string | null;
  created_at: string;
};

export type AIExtraction = {
  make: string | null;
  model: string | null;
  trim: string | null;
  year: number | null;
  km: number | null;
  price_eur: number | null;
  body: string | null;
  fuel: string | null;
  city: string | null;
  description: string | null;
  confidence: number;
  notes: string[];
};

// ============================================================
// LISTINGS
// ============================================================

export type ListingFilter = {
  country?: string;
  city?: string;
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  body?: string[];
  fuel?: string[];
  query?: string;
  limit?: number;
  order?: 'recent' | 'price_asc' | 'price_desc' | 'km_asc';
};

export async function fetchListings(opts?: ListingFilter) {
  let q = supabase
    .from('listings')
    .select('*, listing_photos(url, position, is_cover)')
    .eq('status', 'active');

  if (opts?.country)   q = q.eq('country', opts.country);
  if (opts?.city)      q = q.eq('city', opts.city);
  if (opts?.make)      q = q.eq('make', opts.make);
  if (opts?.model)     q = q.eq('model', opts.model);
  if (opts?.yearMin)   q = q.gte('year', opts.yearMin);
  if (opts?.yearMax)   q = q.lte('year', opts.yearMax);
  if (opts?.priceMin)  q = q.gte('price_eur', opts.priceMin);
  if (opts?.priceMax)  q = q.lte('price_eur', opts.priceMax);
  if (opts?.body?.length) q = q.in('body', opts.body);
  if (opts?.fuel?.length) q = q.in('fuel', opts.fuel);
  if (opts?.query) {
    const pattern = `%${opts.query.replace(/[\\%_]/g, (m) => '\\' + m)}%`;
    q = q.or(`make.ilike.${pattern},model.ilike.${pattern},trim.ilike.${pattern},description.ilike.${pattern}`);
  }

  switch (opts?.order ?? 'recent') {
    case 'recent':     q = q.order('published_at', { ascending: false }); break;
    case 'price_asc':  q = q.order('price_eur', { ascending: true, nullsFirst: false }); break;
    case 'price_desc': q = q.order('price_eur', { ascending: false, nullsFirst: false }); break;
    case 'km_asc':     q = q.order('km', { ascending: true, nullsFirst: false }); break;
  }
  if (opts?.limit) q = q.limit(opts.limit);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(withCover);
}

export async function countListings(opts?: ListingFilter): Promise<number> {
  let q = supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');
  if (opts?.country) q = q.eq('country', opts.country);
  if (opts?.city)    q = q.eq('city', opts.city);
  if (opts?.make)    q = q.eq('make', opts.make);
  if (opts?.model)   q = q.eq('model', opts.model);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}

export async function fetchCountryCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('listing_counts_by_country').select('country, count');
  if (error) return {};
  return Object.fromEntries((data ?? []).map((r: any) => [r.country, r.count]));
}

export async function fetchCityCounts(country: string): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('listing_counts_by_city')
    .select('city, count')
    .eq('country', country);
  if (error) return {};
  return Object.fromEntries((data ?? []).map((r: any) => [r.city, r.count]));
}

export async function fetchMakeCounts(country?: string): Promise<Record<string, number>> {
  let q = supabase.from('listing_counts_by_make').select('make, count');
  if (country) q = q.eq('country', country);
  const { data, error } = await q;
  if (error) return {};
  // Sum across countries when no filter
  const out: Record<string, number> = {};
  for (const r of (data ?? []) as any[]) {
    out[r.make] = (out[r.make] ?? 0) + r.count;
  }
  return out;
}

export async function fetchModelCounts(make: string, country?: string): Promise<Record<string, number>> {
  let q = supabase.from('listing_counts_by_model').select('model, count').eq('make', make);
  if (country) q = q.eq('country', country);
  const { data, error } = await q;
  if (error) return {};
  const out: Record<string, number> = {};
  for (const r of (data ?? []) as any[]) {
    out[r.model] = (out[r.model] ?? 0) + r.count;
  }
  return out;
}

export async function fetchListing(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_photos(url, position, is_cover), profiles!seller_id(name, verified)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

function withCover(row: Listing & { listing_photos?: { url: string; is_cover: boolean }[] }): ListingWithCover {
  const photos = row.listing_photos ?? [];
  const cover = photos.find((p) => p.is_cover) ?? photos[0];
  return { ...row, cover_url: cover?.url ?? null, photo_count: photos.length };
}

// ============================================================
// FAVORITES
// ============================================================

export async function fetchFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('listing_id, listings!inner(*, listing_photos(url, position, is_cover))')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map((row) =>
    withCover(row.listings as unknown as Listing & { listing_photos: { url: string; is_cover: boolean }[] }),
  );
}

export async function toggleFavorite(userId: string, listingId: string, on: boolean) {
  if (on) {
    const { error } = await supabase.from('favorites').insert({ user_id: userId, listing_id: listingId });
    if (error && error.code !== '23505') throw error;
  } else {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);
    if (error) throw error;
  }
}

// ============================================================
// DEALER + SOCIAL
// ============================================================

export async function getOrCreateDealer(ownerId: string, name: string): Promise<Dealer> {
  const { data: existing } = await supabase
    .from('dealers')
    .select('*')
    .eq('owner_id', ownerId)
    .maybeSingle();
  if (existing) return existing as Dealer;
  const { data, error } = await supabase
    .from('dealers')
    .insert({ owner_id: ownerId, name })
    .select('*')
    .single();
  if (error) throw error;
  return data as Dealer;
}

export async function fetchSocialAccounts(dealerId: string): Promise<SocialAccount[]> {
  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('dealer_id', dealerId);
  if (error) throw error;
  return data ?? [];
}

export async function connectSocialAccount(
  dealerId: string,
  provider: 'instagram' | 'facebook',
  handle: string,
) {
  const { data, error } = await supabase
    .from('social_accounts')
    .upsert(
      { dealer_id: dealerId, provider, handle, status: 'connected', last_synced_at: new Date().toISOString() },
      { onConflict: 'dealer_id,provider' },
    )
    .select('*')
    .single();
  if (error) throw error;
  return data as SocialAccount;
}

// ============================================================
// IMPORT JOBS
// ============================================================

export async function fetchImportJobs(dealerId: string): Promise<ImportJob[]> {
  const { data, error } = await supabase
    .from('import_jobs')
    .select('*')
    .eq('dealer_id', dealerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ImportJob[];
}

export async function extractFromCaption(args: {
  dealerId: string;
  caption: string;
  url?: string;
  photoUrl?: string;
  source?: 'instagram' | 'facebook' | 'manual';
}) {
  const session = (await supabase.auth.getSession()).data.session;
  if (!session) throw new Error('not signed in');
  const res = await supabase.functions.invoke('extract-listing', {
    body: {
      dealer_id: args.dealerId,
      caption: args.caption,
      url: args.url,
      photo_url: args.photoUrl,
      source: args.source ?? 'manual',
    },
  });
  if (res.error) throw res.error;
  return res.data as { job: ImportJob; extraction: AIExtraction };
}

export async function publishImportJob(jobId: string, sellerId: string, dealerId: string) {
  const { data: job, error: jobErr } = await supabase
    .from('import_jobs')
    .select('*')
    .eq('id', jobId)
    .single();
  if (jobErr) throw jobErr;
  const e = (job.ai_extraction as AIExtraction | null) ?? null;
  if (!e || !e.make || !e.model || !e.year) {
    throw new Error('extraction is missing required fields (make/model/year)');
  }
  const { data: listing, error: lErr } = await supabase
    .from('listings')
    .insert({
      seller_id: sellerId,
      dealer_id: dealerId,
      status: 'active',
      tier: 'standard',
      make: e.make,
      model: e.model,
      trim: e.trim,
      year: e.year,
      km: e.km,
      body: e.body,
      fuel: e.fuel,
      price_eur: e.price_eur,
      city: e.city,
      description: e.description,
      hue: pickHue(e.make + e.model),
      source: job.source ?? 'manual',
      source_url: job.source_url,
      published_at: new Date().toISOString(),
    })
    .select('*')
    .single();
  if (lErr) throw lErr;

  await supabase
    .from('import_jobs')
    .update({ status: 'published', listing_id: listing.id })
    .eq('id', jobId);
  return listing as Listing;
}

export async function skipImportJob(jobId: string) {
  const { error } = await supabase
    .from('import_jobs')
    .update({ status: 'skipped' })
    .eq('id', jobId);
  if (error) throw error;
}

function pickHue(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

// ============================================================
// RECENT VIEWS
// ============================================================

export async function recordView(userId: string, listingId: string) {
  await supabase
    .from('recent_views')
    .upsert(
      { user_id: userId, listing_id: listingId, last_viewed: new Date().toISOString() },
      { onConflict: 'user_id,listing_id' },
    );
}

export async function fetchRecentViews(userId: string) {
  const { data, error } = await supabase
    .from('recent_views')
    .select('last_viewed, listings!inner(*, listing_photos(url, position, is_cover))')
    .eq('user_id', userId)
    .order('last_viewed', { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    last_viewed: row.last_viewed as string,
    listing: withCover(row.listings),
  }));
}

// ============================================================
// SAVED SEARCHES
// ============================================================

export type SavedSearch = {
  id: string;
  user_id: string;
  name: string;
  filters: Record<string, any>;
  alerts: boolean;
  created_at: string;
};

export async function fetchSavedSearches(userId: string): Promise<SavedSearch[]> {
  const { data, error } = await supabase
    .from('saved_searches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as SavedSearch[];
}

export async function createSavedSearch(userId: string, name: string, filters: Record<string, any>) {
  const { data, error } = await supabase
    .from('saved_searches')
    .insert({ user_id: userId, name, filters, alerts: true })
    .select('*')
    .single();
  if (error) throw error;
  return data as SavedSearch;
}

export async function deleteSavedSearch(id: string) {
  const { error } = await supabase.from('saved_searches').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleSavedSearchAlerts(id: string, alerts: boolean) {
  const { error } = await supabase.from('saved_searches').update({ alerts }).eq('id', id);
  if (error) throw error;
}

// ============================================================
// APPOINTMENTS
// ============================================================

export type Appointment = {
  id: string;
  buyer_id: string;
  listing_id: string;
  start_at: string;
  kind: 'test_drive' | 'inspection';
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
  created_at: string;
};

export async function createAppointment(
  buyerId: string,
  listingId: string,
  startAt: Date,
  kind: 'test_drive' | 'inspection',
) {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      buyer_id: buyerId,
      listing_id: listingId,
      start_at: startAt.toISOString(),
      kind,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as Appointment;
}

export async function fetchAppointmentsForBuyer(buyerId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, listings(make, model, year, city, country)')
    .eq('buyer_id', buyerId)
    .order('start_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ============================================================
// CHAT
// ============================================================

export type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  body: string | null;
  kind: 'text' | 'offer' | 'image';
  meta: Record<string, any> | null;
  created_at: string;
};

export type ChatRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string | null;
  last_message: string | null;
  last_at: string | null;
  created_at: string;
};

export async function getOrCreateChat(buyerId: string, sellerId: string, listingId: string | null) {
  // Try to find an existing chat first
  let q = supabase
    .from('chats')
    .select('*')
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId);
  if (listingId) q = q.eq('listing_id', listingId);
  else q = q.is('listing_id', null);
  const { data: existing } = await q.maybeSingle();
  if (existing) return existing as ChatRow;

  const { data, error } = await supabase
    .from('chats')
    .insert({ buyer_id: buyerId, seller_id: sellerId, listing_id: listingId })
    .select('*')
    .single();
  if (error) throw error;
  return data as ChatRow;
}

export async function fetchChats(userId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select(`
      *,
      listings(make, model, year, hue, city),
      buyer:profiles!buyer_id(name, avatar_url, verified),
      seller:profiles!seller_id(name, avatar_url, verified)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('last_at', { ascending: false, nullsFirst: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMessages(chatId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function sendMessage(chatId: string, senderId: string, body: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ chat_id: chatId, sender_id: senderId, body, kind: 'text' })
    .select('*')
    .single();
  if (error) throw error;

  // Update chat's last message
  await supabase
    .from('chats')
    .update({ last_message: body, last_at: new Date().toISOString() })
    .eq('id', chatId);

  return data as Message;
}

export function subscribeToMessages(chatId: string, onMessage: (m: Message) => void) {
  const channel = supabase
    .channel(`messages:${chatId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
      (payload) => onMessage(payload.new as Message),
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

// ============================================================
// MANUAL LISTING CREATE
// ============================================================

export type NewListing = {
  make: string;
  model: string;
  trim?: string;
  year: number;
  km?: number | null;
  body?: string | null;
  fuel?: string | null;
  price_eur?: number | null;
  city?: string | null;
  country?: string | null;
  description?: string | null;
  tier?: 'standard' | 'premium';
};

export async function createListing(sellerId: string, draft: NewListing): Promise<Listing> {
  const hue = pickHue(`${draft.make}${draft.model}`);
  const { data, error } = await supabase
    .from('listings')
    .insert({
      seller_id: sellerId,
      status: 'active',
      tier: draft.tier ?? 'standard',
      make: draft.make,
      model: draft.model,
      trim: draft.trim ?? null,
      year: draft.year,
      km: draft.km ?? null,
      body: draft.body ?? null,
      fuel: draft.fuel ?? null,
      price_eur: draft.price_eur ?? null,
      city: draft.city ?? null,
      country: draft.country ?? null,
      description: draft.description ?? null,
      hue,
      source: 'manual',
      published_at: new Date().toISOString(),
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as Listing;
}

export async function attachPhotosToListing(
  listingId: string,
  photos: { storagePath: string; url: string }[],
) {
  if (photos.length === 0) return;
  const rows = photos.map((p, i) => ({
    listing_id: listingId,
    url: p.url,
    storage_path: p.storagePath,
    position: i,
    is_cover: i === 0,
  }));
  const { error } = await supabase.from('listing_photos').insert(rows);
  if (error) throw error;
}

// ============================================================
// LISTING DETAIL
// ============================================================

export async function fetchListingDetail(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_photos(url, position, is_cover), profiles!seller_id(name, verified)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Listing & {
    listing_photos: { url: string; position: number; is_cover: boolean }[];
    profiles: { name: string | null; verified: string | null } | null;
  };
}
