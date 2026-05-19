import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { CarPhoto } from '@/components/CarPhoto';
import { useAuth } from '@/lib/auth';
import { fetchFavorites, ListingWithCover } from '@/lib/db';
import { hasSupabaseConfig } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CompareScreen() {
  const nav = useNavigation<Nav>();
  const { userId } = useAuth();
  const [cars, setCars] = useState<ListingWithCover[]>([]);
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
      setCars(rows.slice(0, 2));
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={T.gold} />
      </View>
    );
  }

  if (cars.length < 2) {
    return (
      <View style={styles.root}>
        <TopBar title="Compare" subtitle={`${cars.length} of 4 selected`} variant="white" onBack={() => nav.goBack()} />
        <View style={styles.empty}>
          <Icon name="scale" color={T.muted} size={28} />
          <Text style={styles.emptyTitle}>Need at least 2 saved cars</Text>
          <Text style={styles.emptySub}>
            Tap the heart on listings you want to compare, then come back here.
          </Text>
          <View style={{ marginTop: 14, alignSelf: 'stretch' }}>
            <Button variant="primary" size="md" onPress={() => nav.navigate('Tabs', { screen: 'FavoritesTab' })}>
              See saved cars
            </Button>
          </View>
        </View>
      </View>
    );
  }

  const [a, b] = cars;
  const specs = buildSpecs(a, b);

  return (
    <View style={styles.root}>
      <TopBar title="Compare" subtitle={`${cars.length} of 4 selected`} variant="white" onBack={() => nav.goBack()} trailing={<Icon name="plus" color={T.ink} size={20} />} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={styles.headerCards}>
          {[a, b].map((c) => (
            <View key={c.id} style={styles.headerCard}>
              <CarPhoto hue={c.hue ?? 30} height={90} />
              <View style={{ padding: 8 }}>
                <Text style={styles.headerYear}>{c.year}</Text>
                <Text style={styles.headerTitle}>{c.make} {c.model}</Text>
                <Text style={styles.headerTrim}>{c.trim ?? ''}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.specBox}>
          {specs.map(({ label, vals, winner }, i) => (
            <View key={label} style={[styles.specRow, { borderTopWidth: i > 0 ? StyleSheet.hairlineWidth : 0 }]}>
              <View style={styles.specLabelCell}>
                <Text style={styles.specLabel}>{label}</Text>
              </View>
              {vals.map((v, j) => (
                <View
                  key={j}
                  style={[
                    styles.specCell,
                    {
                      backgroundColor: winner === j ? T.goldTint : 'transparent',
                      borderRightWidth: j === 0 ? StyleSheet.hairlineWidth : 0,
                    },
                  ]}
                >
                  <Text style={[styles.specVal, { fontWeight: winner === j ? '800' : '600' }]}>{v}</Text>
                  {winner === j && <Icon name="check" color={T.goldDark} size={12} strokeWidth={3} />}
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.aiBox}>
          <Icon name="sparkles" color={T.goldDark} size={18} />
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>Heads up</Text>
            <Text style={styles.aiBody}>
              Comparing only your two most recently saved cars. Adjust your favorites to pick different ones.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function buildSpecs(a: ListingWithCover, b: ListingWithCover) {
  type Row = { label: string; vals: [string, string]; winner: number | null };
  const out: Row[] = [
    {
      label: 'Price',
      vals: [fmtPrice(a.price_eur), fmtPrice(b.price_eur)],
      winner: compareLow(a.price_eur, b.price_eur),
    },
    {
      label: 'Year',
      vals: [String(a.year), String(b.year)],
      winner: compareHigh(a.year, b.year),
    },
    {
      label: 'Mileage',
      vals: [fmtKm(a.km), fmtKm(b.km)],
      winner: compareLow(a.km, b.km),
    },
    { label: 'Body', vals: [a.body ?? '—', b.body ?? '—'], winner: null },
    { label: 'Fuel', vals: [a.fuel ?? '—', b.fuel ?? '—'], winner: null },
    { label: 'Location', vals: [a.city ?? '—', b.city ?? '—'], winner: null },
  ];
  return out;
}

function compareLow(av: number | null, bv: number | null): number | null {
  if (av == null && bv == null) return null;
  if (av == null) return 1;
  if (bv == null) return 0;
  if (av === bv) return null;
  return av < bv ? 0 : 1;
}
function compareHigh(av: number, bv: number): number | null {
  if (av === bv) return null;
  return av > bv ? 0 : 1;
}
function fmtPrice(n: number | null) { return n ? `€ ${n.toLocaleString()}` : '—'; }
function fmtKm(n: number | null) { return n ? `${n.toLocaleString()} km` : '—'; }

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  empty: { padding: 30, alignItems: 'center', gap: 6 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font, marginTop: 6 },
  emptySub: { fontSize: 12, color: T.muted, textAlign: 'center', fontFamily: T.font },
  headerCards: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  headerCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
  },
  headerYear: { fontSize: 11, color: T.muted, fontFamily: T.mono },
  headerTitle: { fontSize: 12, fontWeight: '800', color: T.ink, lineHeight: 14, marginTop: 2, fontFamily: T.font },
  headerTrim: { fontSize: 10, color: T.body, fontFamily: T.font },
  specBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    overflow: 'hidden',
  },
  specRow: { flexDirection: 'row', borderTopColor: T.hairline },
  specLabelCell: {
    width: 90,
    padding: 10,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: T.hairline,
  },
  specLabel: { fontSize: 11, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5, textTransform: 'uppercase' },
  specCell: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRightColor: T.hairline,
  },
  specVal: { fontSize: 13, color: T.ink, fontFamily: T.font },
  aiBox: {
    marginTop: 14,
    padding: 14,
    backgroundColor: T.goldTint,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 10,
  },
  aiTitle: { fontSize: 12, fontWeight: '800', color: T.ink, fontFamily: T.font },
  aiBody: { fontSize: 11, color: T.body, marginTop: 4, lineHeight: 16, fontFamily: T.font },
});
