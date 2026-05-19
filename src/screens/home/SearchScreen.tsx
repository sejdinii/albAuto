import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { Icon, IconName } from '@/components/Icon';
import { useBrowseFilters } from '@/lib/browse';
import { fetchListings, ListingWithCover } from '@/lib/db';
import { hasSupabaseConfig } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const HOT: { icon: IconName; text: string; query: string }[] = [
  { icon: 'sparkles', text: 'Most popular', query: '' },
  { icon: 'flame', text: 'Premium ads', query: '' },
  { icon: 'flame', text: 'BMW M3', query: 'BMW M3' },
  { icon: 'flame', text: 'Audi RS6', query: 'Audi RS6' },
  { icon: 'flame', text: 'Tesla Model Y', query: 'Tesla Model Y' },
];

export function SearchScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { resetTo } = useBrowseFilters();
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<ListingWithCover[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    const t = setTimeout(async () => {
      if (q.trim().length < 2) {
        setHits([]);
        return;
      }
      setLoading(true);
      try {
        const rows = await fetchListings({ query: q.trim(), limit: 20 });
        setHits(rows);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const showSuggestions = q.trim().length < 2;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Pressable onPress={() => nav.goBack()} hitSlop={10}>
          <Icon name="back" color={T.ink} size={22} />
        </Pressable>
        <View style={styles.search}>
          <Icon name="search" color={T.muted} size={18} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search make, model…"
            placeholderTextColor={T.muted}
            style={styles.input}
            autoFocus
          />
          {q.length > 0 && (
            <Pressable onPress={() => setQ('')}>
              <Icon name="close" color={T.muted} size={14} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {showSuggestions ? (
          <>
            <Text style={styles.section}>Popular</Text>
            {HOT.map((s, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  resetTo({ query: s.query || undefined });
                  nav.navigate('Listings');
                }}
                style={styles.row}
              >
                <Icon name={s.icon} color={s.icon === 'sparkles' ? T.gold : T.muted} size={18} />
                <Text style={[styles.rowTitle, { flex: 1 }]}>{s.text}</Text>
                <Icon name="chevR" color={T.muted} size={14} />
              </Pressable>
            ))}
          </>
        ) : (
          <>
            {loading ? (
              <View style={{ paddingVertical: 30 }}>
                <ActivityIndicator color={T.gold} />
              </View>
            ) : hits.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No matches</Text>
                <Text style={styles.emptySub}>Try a different make or model.</Text>
              </View>
            ) : (
              <>
                <Text style={styles.section}>{hits.length} result{hits.length === 1 ? '' : 's'}</Text>
                {hits.map((l) => (
                  <Pressable
                    key={l.id}
                    onPress={() => nav.navigate('CarDetail', { id: l.id })}
                    style={styles.hitRow}
                  >
                    <Icon name="car" color={T.muted} size={18} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>
                        {l.year} {l.make} {l.model}
                        {l.trim ? ` ${l.trim}` : ''}
                      </Text>
                      <Text style={styles.rowSub}>
                        {[l.km && `${l.km.toLocaleString()} km`, l.city, l.country].filter(Boolean).join(' · ')}
                      </Text>
                    </View>
                    <Text style={styles.price}>
                      {l.price_eur ? `€ ${l.price_eur.toLocaleString()}` : '—'}
                    </Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => {
                    resetTo({ query: q.trim() });
                    nav.navigate('Listings');
                  }}
                  style={styles.viewAll}
                >
                  <Text style={styles.viewAllText}>See all results in browse view</Text>
                  <Icon name="chevR" color={T.ink} size={14} />
                </Pressable>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  search: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.surfaceAlt,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: { flex: 1, fontSize: 14, color: T.ink, fontWeight: '600', fontFamily: T.font, padding: 0 },
  section: {
    fontSize: 11,
    color: T.muted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 6,
    fontFamily: T.font,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
  rowTitle: { fontSize: 14, color: T.ink, fontWeight: '600', fontFamily: T.font },
  rowSub: { fontSize: 11, color: T.muted, marginTop: 1, fontFamily: T.font },
  hitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
  price: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.mono },
  empty: { paddingVertical: 30, alignItems: 'center', gap: 4 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font },
  emptySub: { fontSize: 12, color: T.muted, fontFamily: T.font },
  viewAll: {
    marginTop: 14,
    padding: 14,
    backgroundColor: T.surfaceAlt,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
});
