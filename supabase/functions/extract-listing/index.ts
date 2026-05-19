// Supabase Edge Function: extract a car listing from a social post URL/caption.
// Calls Claude API with the caption (and optional photo URL) and returns
// structured fields {make, model, year, km, price_eur, ...}.
//
// Deploy:
//   supabase functions deploy extract-listing
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

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

const EXTRACTION_PROMPT = `You are an extraction tool that reads a car listing post (caption text and optionally a photo) and returns structured JSON.

Return ONLY valid JSON, no prose. Schema:
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
  "confidence": number,  // 0-100 overall
  "notes": string[]      // any caveats e.g. "price not stated"
}

Rules:
- Convert mileage to km (1 mile = 1.609 km), strip units, return integer.
- Convert prices to EUR integer. If not in EUR, convert at a rough rate (USD/AED ~0.92x to EUR, GBP 1.17x). Note the source currency in "notes".
- If a field is uncertain, return null and add a note explaining why.
- Confidence reflects how sure you are overall (0=guessing, 100=explicit).
- Description: 1-2 sentence summary suitable for a marketplace listing, rewritten from the caption.`;

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

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) return json({ error: 'ANTHROPIC_API_KEY not set' }, 500);

  const supa = supabaseFromReq(req);
  if (!supa) return json({ error: 'unauthorized' }, 401);

  // Create the queued job row
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

  // Call Claude
  let extraction: Extraction;
  try {
    extraction = await extractWithClaude(apiKey, body.caption ?? '', body.photo_url);
  } catch (err) {
    await supa
      .from('import_jobs')
      .update({ status: 'failed', error: String(err) })
      .eq('id', job.id);
    return json({ error: `extraction failed: ${err}` }, 502);
  }

  // Decide ready vs review
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

async function extractWithClaude(apiKey: string, caption: string, photoUrl?: string): Promise<Extraction> {
  type Block = { type: 'text'; text: string } | { type: 'image'; source: { type: 'url'; url: string } };
  const content: Block[] = [];
  if (photoUrl) content.push({ type: 'image', source: { type: 'url', url: photoUrl } });
  content.push({
    type: 'text',
    text: `Caption:\n"""${caption}"""\n\nReturn the JSON now.`,
  });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: EXTRACTION_PROMPT,
      messages: [{ role: 'user', content }],
    }),
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text: string = data?.content?.[0]?.text ?? '';

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
