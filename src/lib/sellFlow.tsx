import React, { createContext, useContext, useMemo, useState } from 'react';

export type SellDraft = {
  marketplace: 'balkans' | 'import';
  make: string;
  model: string;
  trim: string;
  year: string; // string so the text input is happy; coerce on publish
  km: string;
  body: string;
  fuel: string;
  price_eur: string;
  city: string;
  country: string;
  description: string;
  photos: { uri: string; storagePath?: string; remoteUrl?: string }[];
  tier: 'standard' | 'premium';
};

const initial: SellDraft = {
  marketplace: 'balkans',
  make: '',
  model: '',
  trim: '',
  year: '',
  km: '',
  body: '',
  fuel: '',
  price_eur: '',
  city: '',
  country: 'MK',
  description: '',
  photos: [],
  tier: 'standard',
};

type Ctx = {
  draft: SellDraft;
  set: <K extends keyof SellDraft>(key: K, value: SellDraft[K]) => void;
  patch: (p: Partial<SellDraft>) => void;
  reset: () => void;
};

const C = createContext<Ctx | null>(null);

export function SellFlowProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<SellDraft>(initial);
  const value = useMemo<Ctx>(
    () => ({
      draft,
      set: (key, value) => setDraft((d) => ({ ...d, [key]: value })),
      patch: (p) => setDraft((d) => ({ ...d, ...p })),
      reset: () => setDraft(initial),
    }),
    [draft],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useSellDraft() {
  const v = useContext(C);
  if (!v) throw new Error('useSellDraft must be used inside <SellFlowProvider>');
  return v;
}

// ============================================================
// Picker option lists
// ============================================================
export const BODY_TYPES = ['sedan', 'suv', 'wagon', 'coupe', 'pickup', 'hatch', 'convertible', 'van'] as const;
export const FUEL_TYPES = ['petrol', 'diesel', 'hybrid', 'electric', 'lpg'] as const;
export const COUNTRIES = [
  { code: 'MK', name: 'North Macedonia', cities: ['Skopje', 'Bitola', 'Kumanovo', 'Prilep', 'Tetovo', 'Ohrid'] },
  { code: 'AL', name: 'Albania', cities: ['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan'] },
  { code: 'XK', name: 'Kosovo', cities: ['Pristina', 'Prizren', 'Mitrovica', 'Peja', 'Gjakova'] },
];
