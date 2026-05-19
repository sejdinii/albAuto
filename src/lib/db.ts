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

export async function fetchListings(opts?: { limit?: number; make?: string }) {
  let q = supabase
    .from('listings')
    .select('*, listing_photos(url, position, is_cover)')
    .eq('status', 'active')
    .order('published_at', { ascending: false });
  if (opts?.limit) q = q.limit(opts.limit);
  if (opts?.make) q = q.eq('make', opts.make);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(withCover);
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
