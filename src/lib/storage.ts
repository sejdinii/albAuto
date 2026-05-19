import { supabase } from './supabase';

const BUCKET = 'listing-photos';

// Upload an image picked by expo-image-picker. Takes the local URI,
// fetches it as a Blob, uploads to Supabase Storage under
// `<userId>/<random>.<ext>`, and returns the public URL + storage path.
export async function uploadListingPhoto(userId: string, localUri: string) {
  const ext = guessExt(localUri);
  const filename = `${cryptoRandom()}.${ext}`;
  const path = `${userId}/${filename}`;

  const res = await fetch(localUri);
  const blob = await res.blob();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: blob.type || `image/${ext}`, upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { storagePath: path, url: data.publicUrl };
}

function guessExt(uri: string): string {
  const m = uri.match(/\.(\w{3,4})(?:\?|$)/);
  const ext = (m?.[1] ?? 'jpg').toLowerCase();
  return ext === 'jpeg' ? 'jpg' : ext;
}

function cryptoRandom(): string {
  // Avoid pulling crypto polyfills; this is plenty for filenames.
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
