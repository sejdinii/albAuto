import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { Icon } from '@/components/Icon';
import { CarCardListing } from '@/components/CarCards';
import { Button } from '@/components/Button';
import { activeCount, summarize, useBrowseFilters } from '@/lib/browse';
import { useAuth } from '@/lib/auth';
import { createSavedSearch, fetchListings, ListingWithCover } from '@/lib/db';
import { hasSupabaseConfig } from '@/lib/supabase';
import { Car, CARS } from '@/data/mock';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const QUICK_FILTER_KEYS = ['Price', 'Year', 'Body', 'Fuel'] as const;

export function ListingsScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { filters } = useBrowseFilters();
  const { userId } = useAuth();
  const [results, setResults] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [order, setOrder] = useState<'recent' | 'price_asc' | 'price_desc' | 'km_asc'>('recent');

  const load = useCallback(async () => {
    if (!hasSupabaseConfig) {
      setResults(CARS.map(toCar));
      setUsingMock(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rows = await fetchListings({
        country: filters.country,
        city: filters.city,
        make: filters.make,
        model: filters.model,
        yearMin: filters.yearMin,
        yearMax: filters.yearMax,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        body: filters.body,
        fuel: filters.fuel,
        query: filters.query,
        order,
      });
      if (rows.length > 0) {
        setResults(rows.map(rowToCar));
        setUsingMock(false);
      } else {
        setResults([]);
        setUsingMock(false);
      }
    } catch {
      setResults(CARS.map(toCar));
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, [filters, order]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onSaveSearch = async () => {
    if (!userId) {
      Alert.alert('Sign in', 'Sign in to save searches.');
      return;
    }
    const name = summarize(filters);
    try {
      await createSavedSearch(userId, name, filters);
      Alert.alert('Saved', `"${name}" added to Saved searches.`);
    } catch (err: any) {
      Alert.alert('Could not save', err?.message ?? String(err));
    }
  };

  const filterCount = activeCount(filters);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => nav.goBack()} hitSlop={10}>
            <Icon name="back" color={T.ink} size={22} />
          </Pressable>
          <Pressable onPress={() => nav.navigate('Search')} style={styles.searchChip}>
            <Icon name="search" color={T.muted} size={16} />
            <Text style={styles.queryText}>{summarize(filters)}</Text>
            {filters.country && (
              <Text style={styles.locText}>
                {[filters.city, filters.country].filter(Boolean).join(', ')}
              </Text>
            )}
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          <Pressable onPress={() => nav.navigate('Filters')} style={styles.filterMain}>
            <Icon name="filter" color="#fff" size={13} />
            <Text style={styles.filterMainText}>Filters</Text>
            {filterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{filterCount}</Text>
              </View>
            )}
          </Pressable>
          {QUICK_FILTER_KEYS.map((f) => (
            <Pressable key={f} onPress={() => nav.navigate('Filters')} style={styles.quick}>
              <Text style={styles.quickText}>{f}</Text>
              <Icon name="chevD" color={T.muted} size={11} />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.toolbar}>
        <Text style={styles.results}>
          {loading ? '…' : `${results.length} RESULT${results.length === 1 ? '' : 'S'}`}
          {filters.make ? ` · ${filters.make}` : ''}
          {filters.model ? ` ${filters.model}` : ''}
        </Text>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <Pressable onPress={() => setOrder(nextOrder(order))} style={styles.toolBtn}>
            <Icon name="sort" size={13} color={T.ink} />
            <Text style={styles.toolText}>{labelFor(order)}</Text>
          </Pressable>
          <Pressable onPress={onSaveSearch} style={styles.toolBtn}>
            <Icon name="star" size={13} color={T.ink} />
            <Text style={styles.toolText}>Save</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={loading && results.length > 0} onRefresh={load} />}
      >
        {loading && results.length === 0 ? (
          <View style={styles.empty}>
            <ActivityIndicator color={T.gold} />
          </View>
        ) : results.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="search" color={T.muted} size={28} />
            <Text style={styles.emptyTitle}>No matches</Text>
            <Text style={styles.emptySub}>Try removing some filters.</Text>
            <View style={{ marginTop: 14, alignSelf: 'stretch' }}>
              <Button variant="outline" size="md" onPress={() => nav.navigate('Filters')}>Adjust filters</Button>
            </View>
          </View>
        ) : (
          results.map((c, i) => (
            <Pressable key={c.id} onPress={() => nav.navigate('CarDetail', { id: c.id })}>
              <CarCardListing car={c} premium={i === 0 && !usingMock} />
            </Pressable>
          ))
        )}
        {usingMock && (
          <View style={styles.mockHint}>
            <Icon name="sparkles" color={T.goldDark} size={14} />
            <Text style={styles.mockHintText}>Showing sample data (no real listings match yet).</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function nextOrder(current: 'recent' | 'price_asc' | 'price_desc' | 'km_asc') {
  if (current === 'recent') return 'price_asc' as const;
  if (current === 'price_asc') return 'price_desc' as const;
  if (current === 'price_desc') return 'km_asc' as const;
  return 'recent' as const;
}

function labelFor(o: string) {
  if (o === 'price_asc') return 'Price ↑';
  if (o === 'price_desc') return 'Price ↓';
  if (o === 'km_asc') return 'Km ↑';
  return 'Recent';
}

function rowToCar(l: ListingWithCover): Car {
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

function toCar(c: Car): Car {
  return c;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  searchChip: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.surfaceAlt,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  queryText: { flex: 1, fontSize: 13, color: T.ink, fontWeight: '600', fontFamily: T.font },
  locText: { fontSize: 11, fontWeight: '700', color: T.muted, fontFamily: T.font },
  filterMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: T.ink,
  },
  filterMainText: { color: '#fff', fontSize: 12, fontWeight: '700', fontFamily: T.font },
  filterBadge: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 99,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  filterBadgeText: { color: T.ink, fontSize: 9, fontWeight: '800', fontFamily: T.font },
  quick: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
  },
  quickText: { fontSize: 12, fontWeight: '600', color: T.body, fontFamily: T.font },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  results: { fontSize: 12, color: T.muted, fontFamily: T.mono },
  toolBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  toolText: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  empty: { paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center', gap: 6 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font, marginTop: 6 },
  emptySub: { fontSize: 12, color: T.muted, textAlign: 'center', fontFamily: T.font },
  mockHint: {
    marginTop: 16,
    padding: 12,
    backgroundColor: T.goldTint,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  mockHintText: { flex: 1, fontSize: 11, color: T.body, fontFamily: T.font },
});
