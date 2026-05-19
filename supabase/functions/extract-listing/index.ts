// Supabase Edge Function: extract a car listing from a social post caption.
// Calls Groq (free tier, OpenAI-compatible API) with Llama 3.3 70B and
// returns structured fields {make, model, year, km, price_eur, ...}.
//
// Deploy:
//   supabase functions deploy extract-listing
//   supabase secrets set GROQ_API_KEY=gsk_...
//
// Get a free key at https://console.groq.com (no payment method needed).

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

type ExtractRequest = {
  url?: string;
  caption?: string;
  photo_url?: string;
  dealer_id: string;
  source?: 'instagram' | 'facebook' | 'manual';
};

type Extraction = {
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

const EXTRACTION_PROMPT = `You are an extraction tool that reads a car listing caption from Instagram or Facebook and returns structured JSON.

Return ONLY valid JSON (no markdown, no prose). Schema:
{
  "make": string | null,
  "model": string | null,
  "trim": string | null,
  "year": number | null,
  "km": number | null,
  "price_eur": number | null,
  "body": "sedan"|"suv"|"wagon"|"coupe"|"pickup"|"hatch"|"convertible"|"van"|null,
  "fuel": "petrol"|"diesel"|"hybrid"|"electric"|"lpg"|null,
  "city": string | null,
  "description": string | null,
  "confidence": number,
  "notes": string[]
}

Rules:
- Convert mileage to km integer (1 mile = 1.609 km). Strip units.
- Convert prices to EUR integer. Approx rates: USD/AED ~0.92 to EUR, GBP ~1.17. Note source currency in "notes".
- If a field is uncertain, use null and explain in "notes".
- Confidence: 0-100 overall (0=guessing, 100=explicit in caption).
- Description: 1-2 sentence marketplace blurb derived from the caption.
- Common car nicknames: M3 Comp = BMW M3 Competition. C-Class AMG = Mercedes C-Class AMG. RS6 Avant = Audi RS6 Avant.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'POST only' }, 405);
  }

  let body: ExtractRequest;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid JSON' }, 400);
  }
  if (!body.dealer_id) return json({ error: 'dealer_id required' }, 400);
  if (!body.caption && !body.url) return json({ error: 'caption or url required' }, 400);

  const apiKey = Deno.env.get('GROQ_API_KEY');
  if (!apiKey) return json({ error: 'GROQ_API_KEY not set' }, 500);

  const supa = supabaseFromReq(req);
  if (!supa) return json({ error: 'unauthorized' }, 401);

  const { data: job, error: jobErr } = await supa
    .from('import_jobs')
    .insert({
      dealer_id: body.dealer_id,
      source: body.source ?? 'manual',
      source_url: body.url ?? null,
      caption: body.caption ?? null,
      status: 'extracting',
    })
    .select('id')
    .single();
  if (jobErr) return json({ error: jobErr.message }, 500);

  let extraction: Extraction;
  try {
    extraction = await extractWithGroq(apiKey, body.caption ?? '');
  } catch (err) {
    await supa
      .from('import_jobs')
      .update({ status: 'failed', error: String(err) })
      .eq('id', job.id);
    return json({ error: `extraction failed: ${err}` }, 502);
  }

  const needsReview =
    extraction.confidence < 80 ||
    extraction.make == null ||
    extraction.model == null ||
    extraction.price_eur == null;

  const { data: updated, error: upErr } = await supa
    .from('import_jobs')
    .update({
      status: needsReview ? 'review' : 'ready',
      ai_confidence: extraction.confidence,
      ai_extraction: extraction,
    })
    .eq('id', job.id)
    .select('*')
    .single();
  if (upErr) return json({ error: upErr.message }, 500);

  return json({ job: updated, extraction });
});

async function extractWithGroq(apiKey: string, caption: string): Promise<Extraction> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 800,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: `Caption:\n"""${caption}"""\n\nReturn the JSON now.` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`groq ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? '';

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('no JSON in response');
  return JSON.parse(match[0]) as Extraction;
}

function supabaseFromReq(req: Request) {
  const auth = req.headers.get('Authorization');
  if (!auth) return null;
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: auth } } },
  );
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders },
  });
}
