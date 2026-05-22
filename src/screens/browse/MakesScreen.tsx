import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { useBrowseFilters } from '@/lib/browse';
import { fetchMakeCounts } from '@/lib/db';
import { hasSupabaseConfig } from '@/lib/supabase';
import { MAKES } from '@/data/mock';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const POPULAR = ['BMW', 'Audi', 'Mercedes', 'VW', 'Toyota', 'Porsche', 'Tesla', 'Ford'];

export function MakesScreen() {
  const nav = useNavigation<Nav>();
  const { filters, patch } = useBrowseFilters();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (hasSupabaseConfig) fetchMakeCounts(filters.country).then(setCounts);
  }, [filters.country]);

  const pick = (make: string | null) => {
    patch({ make: make ?? undefined, model: undefined });
    if (make) nav.navigate('Models');
    else nav.navigate('Listings');
  };

  const allMakes = Array.from(new Set([...POPULAR, ...MAKES, ...Object.keys(counts)])).sort();
  const grouped: Record<string, string[]> = {};
  for (const m of allMakes) {
    const letter = m[0]?.toUpperCase() ?? '?';
    (grouped[letter] ??= []).push(m);
  }
  const letters = Object.keys(grouped).sort();

  const cityLabel = filters.city ?? filters.country ?? '';
  const title = cityLabel ? `Select Make in ${cityLabel}` : 'Select Make';

  return (
    <View style={styles.root}>
      <TopBar
        title={title}
        subtitle={filters.marketplace === 'import' ? 'Step 4 · Make' : 'Step 3 · Make'}
        variant="white"
        onBack={() => nav.goBack()}
        trailing={
          <Pressable onPress={() => nav.navigate('Search')}>
            <Icon name="search" color={T.ink} size={20} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.popular}>
          <Text style={styles.section}>Popular</Text>
          <View style={styles.grid4}>
            {POPULAR.map((b, i) => {
              const c = counts[b];
              return (
                <Pressable
                  key={b}
                  onPress={() => pick(b)}
                  style={[styles.tile, { backgroundColor: i === 0 ? T.ink : '#fff' }]}
                >
                  <Text style={[styles.tileText, { color: i === 0 ? T.gold : T.ink }]}>{b}</Text>
                  {c != null && c > 0 && (
                    <Text style={[styles.tileCount, { color: i === 0 ? T.gold : T.muted }]}>{c}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable onPress={() => pick(null)} style={styles.allRow}>
          <Text style={styles.allText}>Show all makes</Text>
          <Icon name="chevR" color={T.muted} size={14} />
        </Pressable>

        <Text style={[styles.section, { paddingHorizontal: 20, marginTop: 12 }]}>A–Z · All makes</Text>
        {letters.map((letter) => (
          <View key={letter}>
            <View style={styles.letterHead}>
              <Text style={styles.letter}>{letter}</Text>
            </View>
            {grouped[letter].map((n) => {
              const c = counts[n];
              return (
                <Pressable key={n} onPress={() => pick(n)} style={styles.makeRow}>
                  <View style={styles.makeIcon}>
                    <Text style={styles.makeLetter}>{n.charAt(0)}</Text>
                  </View>
                  <Text style={styles.makeName}>{n}</Text>
                  {c != null && c > 0 && <Text style={styles.makeCount}>{c}</Text>}
                  <Icon name="chevR" color={T.muted} size={14} />
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  popular: { padding: 16, paddingTop: 12 },
  section: {
    fontSize: 11,
    color: T.muted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    fontFamily: T.font,
  },
  grid4: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    width: '23.5%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tileText: { fontSize: 13, fontWeight: '800', letterSpacing: -0.2, fontFamily: T.font },
  tileCount: { fontSize: 10, fontFamily: T.mono },
  allRow: {
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: T.surfaceAlt,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allText: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  letterHead: { paddingHorizontal: 20, paddingVertical: 6, backgroundColor: T.surfaceAlt },
  letter: { fontSize: 11, fontWeight: '800', color: T.muted, fontFamily: T.mono },
  makeRow: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
  makeIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: T.surfaceAlt,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  makeLetter: { fontSize: 10, fontWeight: '800', fontFamily: T.font },
  makeName: { flex: 1, fontSize: 14, color: T.ink, fontWeight: '500', fontFamily: T.font },
  makeCount: { fontSize: 11, color: T.muted, fontFamily: T.mono, marginRight: 8 },
});
