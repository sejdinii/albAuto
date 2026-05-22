import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { CarCardMedium } from '@/components/CarCards';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { fetchFavorites, ListingWithCover, toggleFavorite } from '@/lib/db';
import { Car } from '@/data/mock';
import { hasSupabaseConfig } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS: [string, boolean][] = [
  ['Cars', true],
  ['Searches', false],
  ['Compare', false],
];

export function FavoritesScreen() {
  const nav = useNavigation<Nav>();
  const { userId } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!hasSupabaseConfig || !userId) {
      setCars([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rows = await fetchFavorites(userId);
      setCars(rows.map(toCard));
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRemove = async (id: string) => {
    if (!userId) return;
    setCars((cs) => cs.filter((c) => c.id !== id));
    try {
      await toggleFavorite(userId, id, false);
    } catch {
      load();
    }
  };

  return (
    <View style={styles.root}>
      <TopBar
        title="Favorites"
        leading="none"
        variant="white"
        trailing={<Icon name="filter" color={T.ink} size={20} />}
      />
      <View style={styles.tabRow}>
        {TABS.map(([t, a], i) => (
          <Pressable
            key={t}
            onPress={() => {
              if (t === 'Searches') nav.navigate('SavedSearches');
              if (t === 'Compare') nav.navigate('Compare');
            }}
            style={[styles.tab, { backgroundColor: a ? T.ink : '#fff', borderWidth: a ? 0 : StyleSheet.hairlineWidth }]}
          >
            <Text style={[styles.tabText, { color: a ? '#fff' : T.body }]}>{t}</Text>
            <Text style={[styles.tabCount, { color: a ? T.gold : T.muted }]}>
              {i === 0 ? cars.length : '—'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 14 }}
        refreshControl={<RefreshControl refreshing={loading && cars.length > 0} onRefresh={load} />}
      >
        {!userId ? (
          <View style={styles.empty}>
            <Icon name="heart" color={T.muted} size={28} />
            <Text style={styles.emptyTitle}>Sign in to save cars</Text>
            <Text style={styles.emptySub}>Your saved cars sync across devices.</Text>
            <View style={{ marginTop: 14, alignSelf: 'stretch' }}>
              <Button variant="primary" size="md" onPress={() => nav.navigate('Welcome')}>Sign in</Button>
            </View>
          </View>
        ) : loading && cars.length === 0 ? (
          <View style={styles.empty}>
            <ActivityIndicator color={T.gold} />
          </View>
        ) : cars.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="heart" color={T.muted} size={28} />
            <Text style={styles.emptyTitle}>No saved cars yet</Text>
            <Text style={styles.emptySub}>Tap the heart on any listing to save it here.</Text>
          </View>
        ) : (
          <>
            <View style={styles.headRow}>
              <Text style={styles.headLabel}>{cars.length} saved car{cars.length === 1 ? '' : 's'}</Text>
              <View style={styles.sortRow}>
                <Text style={styles.sortText}>Sort: Recent</Text>
                <Icon name="chevD" size={11} color={T.ink} />
              </View>
            </View>
            <View style={styles.grid}>
              {cars.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => nav.navigate('CarDetail', { id: c.id })}
                  style={styles.cell}
                >
                  <CarCardMedium car={c} favorited onToggleFav={() => onRemove(c.id)} />
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function toCard(l: ListingWithCover): Car {
  return {
    id: l.id,
    make: l.make,
    model: l.model,
    trim: l.trim ?? '',
    subtitle: l.body ?? '',
    year: l.year,
    km: l.km ? `${l.km.toLocaleString()} km` : '—',
    price: l.price_eur ? `€ ${l.price_eur.toLocaleString()}` : '—',
    priceEur: l.price_eur ? `€ ${l.price_eur.toLocaleString()}` : '—',
    hue: l.hue ?? 30,
    label: l.id.slice(0, 2).toUpperCase(),
    photos: { cur: 1, total: l.photo_count || 1 },
    location: [l.city, l.country].filter(Boolean).join(', '),
  };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  tabRow: { paddingHorizontal: 16, paddingTop: 8, flexDirection: 'row', gap: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: { fontSize: 13, fontWeight: '700', fontFamily: T.font },
  tabCount: { fontSize: 11, fontFamily: T.mono },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  headLabel: {
    fontSize: 11,
    color: T.muted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: T.font,
  },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText: { fontSize: 12, color: T.ink, fontWeight: '600', fontFamily: T.font },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cell: { width: '48.5%' },
  empty: { paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center', gap: 6 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font, marginTop: 6 },
  emptySub: { fontSize: 12, color: T.muted, textAlign: 'center', fontFamily: T.font },
});
