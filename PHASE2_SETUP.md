# Phase 2 setup — Supabase + Dealer auto-import

This adds real auth, a real database, and the AI-powered dealer auto-import flow (paste a caption → Claude extracts make/model/year/price → review → publish).

## 1. Create a Supabase project (5 min)

1. Go to https://supabase.com → **New project** (free tier is fine).
2. Pick a name and password. Region: closest to you (Frankfurt for Balkans).
3. Wait ~1 min for it to provision.
4. In the dashboard, go to **Project Settings → API** and copy:
   - **Project URL** (`https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ…`)

## 2. Apply the database schema

In Supabase dashboard → **SQL Editor** → **New query** → paste the contents of `supabase/migrations/0001_init.sql` → **Run**.

You should see tables appear under **Table Editor**: `profiles`, `dealers`, `social_accounts`, `listings`, `listing_photos`, `favorites`, `import_jobs`, `chats`, `messages`.

## 3. Get a Groq API key for AI extraction (free tier)

1. Go to https://console.groq.com → sign up (Google login works, no payment method needed).
2. **API Keys** → **Create API Key** → copy the `gsk_…` key.

Groq's free tier gives you generous rate limits and runs Llama 3.3 70B — fast and good enough for caption extraction.

In Supabase dashboard → **Project Settings → Edge Functions → Secrets** → add:
- Name: `GROQ_API_KEY`
- Value: your `gsk_...` key

## 4. Deploy the Edge Function

Install the Supabase CLI (one-time): https://supabase.com/docs/guides/local-development/cli/getting-started

```bash
# in the albAuto folder
supabase login
supabase link --project-ref YOUR_PROJECT_REF   # the xxxxx from your URL
supabase functions deploy extract-listing
```

If you don't want to install the CLI, you can paste the function code into the **Edge Functions** UI in the dashboard instead.

## 5. Wire the env into the app

Create `.env` in the project root (same folder as `package.json`):

```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 6. Install the new packages

```bash
npm install
```

This pulls in `@supabase/supabase-js`, `react-native-url-polyfill`, and `expo-image-picker`.

## 7. Start the app fresh

```bash
npx expo start -c
```

The `-c` clears Metro's cache so the new env vars are picked up.

## Try it end-to-end

1. **Sign up**: Welcome → Continue with email → fill out the form → check inbox for verification (or disable email confirmation in Supabase → **Authentication → Providers → Email → Confirm email = off** for dev).
2. **Log in**: Welcome → Have an account? Log in → use the email + password you signed up with.
3. **Connect a social account**: Menu tab → Connect Instagram → enter any handle (real OAuth comes in the next phase).
4. **Import a post**: From the connected screen, tap "Import a post" → paste a caption (or use the sample) → tap "Extract with AI".
5. **Review and publish**: You're taken to the inventory queue. Items with low AI confidence go into "Needs review"; others go straight to "Ready" with a Publish button.
6. **See it live**: Pull-to-refresh on the Home tab — your new listing shows up alongside the samples.

## What's still mocked

- **Real Instagram OAuth + API fetch**: For now you paste captions manually. Real IG OAuth requires a Meta Developer App with Instagram Graph API access (their approval flow is ~1 week).
- **Image upload**: The publish flow doesn't yet upload photos to Storage. Next iteration.
- **Phone OTP**: Sign-up is email/password for now. Phone OTP via Supabase needs Twilio setup.

## Common issues

- **"EXPO_PUBLIC_SUPABASE_URL is not set"** in console → restart with `npx expo start -c`. Env vars only load at boot.
- **"Failed to fetch" or 401** when extracting → confirm `GROQ_API_KEY` is set in Supabase secrets, and the function was deployed (`supabase functions list`).
- **"new row violates row-level security"** → you're not signed in. Sign up first.
- **Email confirmations** are on by default. Either click the link in your inbox or turn confirmations off in **Authentication → Providers → Email** for dev.
