import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { CarPhoto } from '@/components/CarPhoto';
import { useAuth } from '@/lib/auth';
import { fetchRecentViews, ListingWithCover } from '@/lib/db';
import { hasSupabaseConfig } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Row = { last_viewed: string; listing: ListingWithCover };

export function RecentScreen() {
  const nav = useNavigation<Nav>();
  const { userId } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!hasSupabaseConfig || !userId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await fetchRecentViews(userId);
      setRows(list);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const groups = groupByDay(rows);

  return (
    <View style={styles.root}>
      <TopBar
        title="Recently viewed"
        variant="white"
        onBack={() => nav.goBack()}
        trailing={<Text style={styles.clear}>Clear</Text>}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={loading && rows.length > 0} onRefresh={load} />}
      >
        {!userId ? (
          <View style={styles.empty}>
            <Icon name="history" color={T.muted} size={28} />
            <Text style={styles.emptyTitle}>Sign in to track views</Text>
            <Text style={styles.emptySub}>Your recently viewed cars sync across devices.</Text>
            <View style={{ marginTop: 14, alignSelf: 'stretch' }}>
              <Button variant="primary" size="md" onPress={() => nav.navigate('Welcome')}>Sign in</Button>
            </View>
          </View>
        ) : loading && rows.length === 0 ? (
          <View style={styles.empty}>
            <ActivityIndicator color={T.gold} />
          </View>
        ) : groups.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="history" color={T.muted} size={28} />
            <Text style={styles.emptyTitle}>No views yet</Text>
            <Text style={styles.emptySub}>Listings you look at will show up here.</Text>
          </View>
        ) : (
          groups.map(({ label, items }) => (
            <View key={label} style={{ marginBottom: 16 }}>
              <Text style={styles.groupLabel}>{label.toUpperCase()}</Text>
              <View style={{ gap: 8 }}>
                {items.map(({ listing: l }) => (
                  <Pressable
                    key={l.id}
                    onPress={() => nav.navigate('CarDetail', { id: l.id })}
                    style={styles.row}
                  >
                    <View style={styles.photo}>
                      {l.cover_url ? (
                        <Image source={{ uri: l.cover_url }} style={StyleSheet.absoluteFillObject} />
                      ) : (
                        <CarPhoto hue={l.hue ?? 30} height={56} />
                      )}
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.title}>{l.make} {l.model}</Text>
                      <Text style={styles.sub}>
                        {l.year}{l.km ? ` · ${l.km.toLocaleString()} km` : ''}
                      </Text>
                      <Text style={styles.price}>
                        {l.price_eur ? `€ ${l.price_eur.toLocaleString()}` : '—'}
                      </Text>
                    </View>
                    <Icon name="chevR" color={T.muted} size={14} />
                  </Pressable>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function groupByDay(rows: Row[]): { label: string; items: Row[] }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const buckets = { Today: [] as Row[], Yesterday: [] as Row[], 'This week': [] as Row[], Older: [] as Row[] };
  for (const r of rows) {
    const d = new Date(r.last_viewed);
    if (d >= today) buckets.Today.push(r);
    else if (d >= yesterday) buckets.Yesterday.push(r);
    else if (d >= sevenDaysAgo) buckets['This week'].push(r);
    else buckets.Older.push(r);
  }
  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  clear: { fontSize: 12, color: T.ink, fontWeight: '700', fontFamily: T.font },
  groupLabel: {
    fontSize: 10,
    color: T.muted,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: T.font,
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  photo: { width: 56, height: 56, borderRadius: 10, overflow: 'hidden' },
  title: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.font },
  sub: { fontSize: 11, color: T.muted, fontFamily: T.font },
  price: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.mono, marginTop: 3 },
  empty: { paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center', gap: 6 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font, marginTop: 6 },
  emptySub: { fontSize: 12, color: T.muted, textAlign: 'center', fontFamily: T.font },
});
