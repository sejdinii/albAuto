import React, { createContext, useContext, useMemo, useState } from 'react';

export type BrowseFilters = {
  marketplace?: 'balkans' | 'import';
  country?: string;
  city?: string;
  continent?: string;
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  body?: string[];
  fuel?: string[];
  query?: string;
};

type Ctx = {
  filters: BrowseFilters;
  set: <K extends keyof BrowseFilters>(key: K, value: BrowseFilters[K]) => void;
  patch: (p: Partial<BrowseFilters>) => void;
  reset: () => void;
  resetTo: (next: BrowseFilters) => void;
};

const C = createContext<Ctx | null>(null);

export function BrowseProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<BrowseFilters>({});
  const value = useMemo<Ctx>(
    () => ({
      filters,
      set: (key, value) => setFilters((f) => ({ ...f, [key]: value })),
      patch: (p) => setFilters((f) => ({ ...f, ...p })),
      reset: () => setFilters({}),
      resetTo: (next) => setFilters(next),
    }),
    [filters],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useBrowseFilters() {
  const v = useContext(C);
  if (!v) throw new Error('useBrowseFilters must be used inside <BrowseProvider>');
  return v;
}

// Count summary describing the active filters for UI labels.
export function summarize(f: BrowseFilters): string {
  const parts: string[] = [];
  if (f.country) parts.push(f.country);
  if (f.city) parts.push(f.city);
  if (f.make) parts.push(f.make);
  if (f.model) parts.push(f.model);
  return parts.join(' · ') || 'All cars';
}

export function activeCount(f: BrowseFilters): number {
  let n = 0;
  if (f.yearMin || f.yearMax) n++;
  if (f.priceMin || f.priceMax) n++;
  if (f.body && f.body.length) n++;
  if (f.fuel && f.fuel.length) n++;
  return n;
}
