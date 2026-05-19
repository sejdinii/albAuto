import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/theme/tokens';
import { Button } from '@/components/Button';
import { useBrowseFilters, BrowseFilters } from '@/lib/browse';
import { countListings } from '@/lib/db';

const YEAR_OPTIONS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const BODY_OPTIONS: { id: string; label: string }[] = [
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV' },
  { id: 'wagon', label: 'Wagon' },
  { id: 'coupe', label: 'Coupé' },
  { id: 'pickup', label: 'Pickup' },
  { id: 'hatch', label: 'Hatch' },
];
const FUEL_OPTIONS: { id: string; label: string }[] = [
  { id: 'petrol', label: 'Petrol' },
  { id: 'diesel', label: 'Diesel' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'electric', label: 'Electric' },
  { id: 'lpg', label: 'LPG' },
];
const PRICE_RANGES: { id: string; label: string; min?: number; max?: number }[] = [
  { id: 'lt20', label: 'Under €20k', max: 20000 },
  { id: '20-50', label: '€20k–50k', min: 20000, max: 50000 },
  { id: '50-100', label: '€50k–100k', min: 50000, max: 100000 },
  { id: '100-200', label: '€100k–200k', min: 100000, max: 200000 },
  { id: 'gt200', label: 'Over €200k', min: 200000 },
];

export function FiltersScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const { filters, patch, reset, resetTo } = useBrowseFilters();

  // Local draft so user can hit "Reset" without nuking until apply
  const [draft, setDraft] = useState<BrowseFilters>(filters);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    countListings({
      country: draft.country,
      city: draft.city,
      make: draft.make,
      model: draft.model,
      yearMin: draft.yearMin,
      yearMax: draft.yearMax,
      priceMin: draft.priceMin,
      priceMax: draft.priceMax,
      body: draft.body,
      fuel: draft.fuel,
      query: draft.query,
    }).then((n) => alive && setCount(n)).catch(() => alive && setCount(null));
    return () => { alive = false; };
  }, [draft]);

  const toggle = (key: 'body' | 'fuel', value: string) => {
    setDraft((d) => {
      const cur = (d[key] ?? []) as string[];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...d, [key]: next.length ? next : undefined };
    });
  };

  const apply = () => {
    resetTo(draft);
    nav.goBack();
  };

  const wipe = () => {
    setDraft({
      marketplace: filters.marketplace,
      country: filters.country,
      city: filters.city,
      make: filters.make,
      model: filters.model,
    });
  };

  return (
    <View style={styles.root}>
      <Pressable style={styles.scrim} onPress={() => nav.goBack()} />
      <View style={[styles.sheet, { paddingBottom: 20 + insets.bottom }]}>
        <View style={styles.grabber} />
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <Pressable onPress={wipe}><Text style={styles.reset}>Reset</Text></Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Row label="Price range" value={priceLabel(draft)}>
            <View style={styles.chipRow}>
              {PRICE_RANGES.map((r) => {
                const sel = draft.priceMin === r.min && draft.priceMax === r.max;
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => setDraft((d) => ({ ...d, priceMin: sel ? undefined : r.min, priceMax: sel ? undefined : r.max }))}
                    style={[styles.chip, { backgroundColor: sel ? T.gold : T.surfaceAlt }]}
                  >
                    <Text style={[styles.chipText, { fontWeight: sel ? '700' : '600' }]}>{r.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Row>

          <Row label="Year" value={yearLabel(draft)}>
            <View style={styles.chipRow}>
              {YEAR_OPTIONS.map((y) => {
                const sel = draft.yearMin != null && draft.yearMax == null
                  ? y === draft.yearMin
                  : draft.yearMin != null && y >= draft.yearMin && (draft.yearMax == null || y <= draft.yearMax);
                return (
                  <Pressable
                    key={y}
                    onPress={() => setDraft((d) => {
                      // toggle a "from this year onwards" filter
                      if (d.yearMin === y && d.yearMax == null) return { ...d, yearMin: undefined };
                      return { ...d, yearMin: y, yearMax: undefined };
                    })}
                    style={[styles.chip, { backgroundColor: sel ? T.gold : T.surfaceAlt }]}
                  >
                    <Text style={[styles.chipText, { fontWeight: sel ? '700' : '600' }]}>{y}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Row>

          <Row label="Body type" value={selectedLabel(draft.body, BODY_OPTIONS.length)}>
            <View style={styles.gridBody}>
              {BODY_OPTIONS.map((b) => {
                const sel = (draft.body ?? []).includes(b.id);
                return (
                  <Pressable
                    key={b.id}
                    onPress={() => toggle('body', b.id)}
                    style={[
                      styles.bodyCell,
                      {
                        backgroundColor: sel ? T.ink : '#fff',
                        borderWidth: sel ? 0 : StyleSheet.hairlineWidth,
                      },
                    ]}
                  >
                    <Text style={[styles.bodyText, { color: sel ? '#fff' : T.body }]}>{b.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Row>

          <Row label="Fuel" value={selectedLabel(draft.fuel, FUEL_OPTIONS.length)}>
            <View style={styles.chipRow}>
              {FUEL_OPTIONS.map((f) => {
                const sel = (draft.fuel ?? []).includes(f.id);
                return (
                  <Pressable
                    key={f.id}
                    onPress={() => toggle('fuel', f.id)}
                    style={[styles.chip, { backgroundColor: sel ? T.gold : T.surfaceAlt }]}
                  >
                    <Text style={[styles.chipText, { fontWeight: sel ? '700' : '600' }]}>{f.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Row>
        </ScrollView>
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <Button variant="outline" size="md" onPress={() => nav.goBack()}>Cancel</Button>
          </View>
          <View style={{ flex: 1.4 }}>
            <Button variant="primary" size="md" onPress={apply}>
              {count == null ? 'Apply' : `Show ${count} car${count === 1 ? '' : 's'}`}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

function Row({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 16 }}>
      <View style={styles.filterHead}>
        <Text style={styles.filterLabel}>{label}</Text>
        <Text style={styles.filterValue}>{value}</Text>
      </View>
      {children}
    </View>
  );
}

function priceLabel(d: BrowseFilters): string {
  if (d.priceMin == null && d.priceMax == null) return 'Any';
  const lo = d.priceMin != null ? `€${(d.priceMin / 1000).toFixed(0)}k` : '€0';
  const hi = d.priceMax != null ? `€${(d.priceMax / 1000).toFixed(0)}k` : 'no cap';
  return `${lo} – ${hi}`;
}

function yearLabel(d: BrowseFilters): string {
  if (d.yearMin == null && d.yearMax == null) return 'Any';
  return `${d.yearMin ?? 'any'} – ${d.yearMax ?? 'today'}`;
}

function selectedLabel(arr: string[] | undefined, total: number): string {
  if (!arr || arr.length === 0) return 'Any';
  if (arr.length === total) return 'Any';
  return `${arr.length} selected`;
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,15,16,0.3)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  grabber: {
    width: 36,
    height: 4,
    backgroundColor: T.hairline,
    borderRadius: 99,
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 18, fontWeight: '800', color: T.ink, fontFamily: T.font },
  reset: { fontSize: 13, color: T.body, fontWeight: '600', fontFamily: T.font },
  filterHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  filterLabel: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.font },
  filterValue: { fontSize: 12, color: T.body, fontFamily: T.mono },
  chipRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99 },
  chipText: { fontSize: 12, color: T.ink, fontFamily: T.font },
  gridBody: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bodyCell: {
    width: '31.5%',
    paddingVertical: 12,
    borderRadius: 10,
    borderColor: T.hairline,
    alignItems: 'center',
  },
  bodyText: { fontSize: 12, fontWeight: '700', fontFamily: T.font },
  footer: { flexDirection: 'row', gap: 10, marginTop: 20 },
});
