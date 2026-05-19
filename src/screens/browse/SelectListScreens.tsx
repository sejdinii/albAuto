import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { useBrowseFilters } from '@/lib/browse';
import { fetchCountryCounts, fetchCityCounts } from '@/lib/db';
import {
  BALKAN_COUNTRIES, CONTINENTS, EU_COUNTRIES,
  CITIES_BY_COUNTRY, COUNTRY_CODE_BY_NAME,
} from '@/data/mock';
import { hasSupabaseConfig } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type ListItem = { id: string; name: string; count?: number; flag?: string };

type Props = {
  title: string;
  subtitle?: string;
  allLabel?: string;
  items: ListItem[];
  selectedId?: string;
  showSearch?: boolean;
  onPick: (id: string | null) => void;
};

function SelectList({ title, subtitle, allLabel, items, selectedId, showSearch = true, onPick }: Props) {
  const nav = useNavigation<Nav>();
  return (
    <View style={styles.root}>
      <TopBar
        title={title}
        subtitle={subtitle}
        variant="white"
        onBack={() => nav.goBack()}
        trailing={
          showSearch ? (
            <Pressable onPress={() => nav.navigate('Search')}>
              <Icon name="search" color={T.ink} size={20} />
            </Pressable>
          ) : null
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {allLabel && (
          <Pressable
            onPress={() => onPick(null)}
            style={[styles.row, { backgroundColor: selectedId == null ? T.goldTint : 'transparent' }]}
          >
            <Text style={[styles.name, { fontWeight: '700' }]}>{allLabel}</Text>
            {selectedId == null && <Check />}
          </Pressable>
        )}
        {items.map((it) => {
          const sel = it.id === selectedId;
          return (
            <Pressable
              key={it.id}
              onPress={() => onPick(it.id)}
              style={[styles.row, { backgroundColor: sel ? T.goldTint : 'transparent' }]}
            >
              {it.flag && <Text style={styles.flag}>{it.flag}</Text>}
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { fontWeight: sel ? '700' : '500' }]}>{it.name}</Text>
                {it.count != null && (
                  <Text style={styles.count}>{it.count.toLocaleString()} listing{it.count === 1 ? '' : 's'}</Text>
                )}
              </View>
              {sel && <Check />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function Check() {
  return (
    <View style={styles.check}>
      <Icon name="check" color={T.ink} size={16} strokeWidth={2.6} />
    </View>
  );
}

// ============================================================
// BALKAN COUNTRIES
// ============================================================

export function BalkanCountriesScreen() {
  const nav = useNavigation<Nav>();
  const { filters, patch } = useBrowseFilters();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (hasSupabaseConfig) fetchCountryCounts().then(setCounts);
  }, []);

  const items: ListItem[] = BALKAN_COUNTRIES.map((c) => {
    const code = COUNTRY_CODE_BY_NAME[c.name] ?? c.name;
    return { id: code, name: c.name, count: counts[code] ?? c.count, flag: c.flag };
  });

  return (
    <SelectList
      title="Cars within Balkans"
      subtitle="Step 1 of 4 · Pick a country"
      allLabel="All in Balkan Countries"
      items={items}
      selectedId={filters.country}
      onPick={(id) => {
        patch({ marketplace: 'balkans', country: id ?? undefined, city: undefined });
        if (id) nav.navigate('BalkanCities');
        else nav.navigate('Makes');
      }}
    />
  );
}

// ============================================================
// CITIES (in Balkans / EU / etc.)
// ============================================================

export function BalkanCitiesScreen() {
  const nav = useNavigation<Nav>();
  const { filters, patch } = useBrowseFilters();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const country = filters.country ?? 'MK';
  const cities = CITIES_BY_COUNTRY[country] ?? [];
  const countryLabel =
    Object.entries(COUNTRY_CODE_BY_NAME).find(([, code]) => code === country)?.[0] ?? country;

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    setLoading(true);
    fetchCityCounts(country).then((c) => {
      setCounts(c);
      setLoading(false);
    });
  }, [country]);

  if (loading) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={T.gold} />
      </View>
    );
  }

  const items: ListItem[] = cities.map((c) => ({ id: c, name: c, count: counts[c] ?? 0 }));

  return (
    <SelectList
      title={`Cities in ${countryLabel}`}
      subtitle="Step 2 of 4 · Pick a city"
      allLabel="All cities"
      items={items}
      selectedId={filters.city}
      onPick={(id) => {
        patch({ city: id ?? undefined });
        nav.navigate('Makes');
      }}
    />
  );
}

// ============================================================
// CONTINENT (Import flow)
// ============================================================

export function ContinentScreen() {
  const nav = useNavigation<Nav>();
  const { patch } = useBrowseFilters();
  const items: ListItem[] = CONTINENTS.map((c) => ({ id: c.name, name: c.name, count: c.count }));
  return (
    <SelectList
      title="Cars for Import"
      subtitle="Step 1 of 5 · Pick a continent"
      allLabel="All continents"
      items={items}
      showSearch={false}
      onPick={(id) => {
        patch({ marketplace: 'import', continent: id ?? undefined, country: undefined, city: undefined });
        nav.navigate('EuCountries');
      }}
    />
  );
}

// ============================================================
// EU COUNTRIES (Import flow)
// ============================================================

export function EuCountriesScreen() {
  const nav = useNavigation<Nav>();
  const { filters, patch } = useBrowseFilters();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (hasSupabaseConfig) fetchCountryCounts().then(setCounts);
  }, []);

  const items: ListItem[] = EU_COUNTRIES.map((name) => {
    const code = COUNTRY_CODE_BY_NAME[name] ?? name;
    return { id: code, name, count: counts[code] };
  });

  return (
    <SelectList
      title="Cars within Europe"
      subtitle="Step 2 of 5 · Pick a country"
      allLabel="All in Europe"
      items={items}
      selectedId={filters.country}
      onPick={(id) => {
        patch({ country: id ?? undefined, city: undefined });
        nav.navigate('Makes');
      }}
    />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
  flag: { fontSize: 22, marginRight: 12 },
  name: { fontSize: 15, color: T.ink, fontFamily: T.font },
  count: { fontSize: 11, color: T.muted, fontFamily: T.mono, marginTop: 1 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 99,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
