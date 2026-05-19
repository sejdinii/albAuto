import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { CarPhoto } from '@/components/CarPhoto';
import { useAuth } from '@/lib/auth';
import { deleteSavedSearch, fetchSavedSearches, SavedSearch, toggleSavedSearchAlerts } from '@/lib/db';
import { useBrowseFilters } from '@/lib/browse';
import { hasSupabaseConfig } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SavedSearchesScreen() {
  const nav = useNavigation<Nav>();
  const { userId } = useAuth();
  const { resetTo } = useBrowseFilters();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!hasSupabaseConfig || !userId) {
      setSearches([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await fetchSavedSearches(userId);
      setSearches(list);
    } catch {
      setSearches([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRun = (s: SavedSearch) => {
    resetTo(s.filters);
    nav.navigate('Listings');
  };

  const onDelete = (s: SavedSearch) => {
    Alert.alert(
      'Delete saved search?',
      `"${s.name}" will be removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSavedSearch(s.id);
              setSearches((cur) => cur.filter((x) => x.id !== s.id));
            } catch (err: any) {
              Alert.alert('Could not delete', err?.message ?? String(err));
            }
          },
        },
      ],
    );
  };

  const onToggleAlerts = async (s: SavedSearch) => {
    const next = !s.alerts;
    setSearches((cur) => cur.map((x) => (x.id === s.id ? { ...x, alerts: next } : x)));
    try {
      await toggleSavedSearchAlerts(s.id, next);
    } catch {
      // revert
      setSearches((cur) => cur.map((x) => (x.id === s.id ? { ...x, alerts: !next } : x)));
    }
  };

  return (
    <View style={styles.root}>
      <TopBar
        title="Saved searches"
        variant="white"
        onBack={() => nav.goBack()}
        trailing={
          <Pressable onPress={() => nav.navigate('Tabs', { screen: 'HomeTab' })}>
            <Icon name="plus" color={T.ink} size={20} />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={loading && searches.length > 0} onRefresh={load} />}
      >
        {!userId ? (
          <View style={styles.empty}>
            <Icon name="bell" color={T.muted} size={28} />
            <Text style={styles.emptyTitle}>Sign in to save searches</Text>
            <Text style={styles.emptySub}>Get notified when matching cars appear.</Text>
            <View style={{ marginTop: 14, alignSelf: 'stretch' }}>
              <Button variant="primary" size="md" onPress={() => nav.navigate('Welcome')}>Sign in</Button>
            </View>
          </View>
        ) : loading && searches.length === 0 ? (
          <View style={styles.empty}>
            <ActivityIndicator color={T.gold} />
          </View>
        ) : searches.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="bell" color={T.muted} size={28} />
            <Text style={styles.emptyTitle}>No saved searches yet</Text>
            <Text style={styles.emptySub}>
              In the Listings screen, tap "Save" to save your current filters.
            </Text>
          </View>
        ) : (
          searches.map((s) => (
            <Pressable key={s.id} onPress={() => onRun(s)} style={styles.card}>
              <View style={styles.photo}>
                <CarPhoto hue={hueFromName(s.name)} height={56} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.title} numberOfLines={1}>{s.name || 'Saved search'}</Text>
                <Text style={styles.sub} numberOfLines={1}>{describeFilters(s.filters)}</Text>
                <Text style={styles.meta}>
                  Alerts {s.alerts ? 'on' : 'off'}
                </Text>
              </View>
              <View style={styles.actions}>
                <Pressable onPress={() => onToggleAlerts(s)} style={[styles.actionBtn, s.alerts && { backgroundColor: T.goldTint }]}>
                  <Icon name="bell" color={s.alerts ? T.goldDark : T.muted} size={14} />
                </Pressable>
                <Pressable onPress={() => onDelete(s)} style={styles.actionBtn}>
                  <Icon name="trash" color={T.body} size={14} />
                </Pressable>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function describeFilters(f: Record<string, any>): string {
  const parts: string[] = [];
  if (f.country) parts.push(f.country);
  if (f.city) parts.push(f.city);
  if (f.make) parts.push(f.make);
  if (f.model) parts.push(f.model);
  if (f.yearMin) parts.push(`${f.yearMin}+`);
  if (f.priceMin || f.priceMax) {
    const lo = f.priceMin ? `€${(f.priceMin / 1000).toFixed(0)}k` : '€0';
    const hi = f.priceMax ? `€${(f.priceMax / 1000).toFixed(0)}k` : '∞';
    parts.push(`${lo}–${hi}`);
  }
  if (f.query) parts.push(`"${f.query}"`);
  return parts.join(' · ') || 'All cars';
}

function hueFromName(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photo: { width: 56, height: 56, borderRadius: 12, overflow: 'hidden' },
  title: { fontSize: 14, fontWeight: '800', color: T.ink, letterSpacing: -0.2, fontFamily: T.font },
  sub: { fontSize: 11, color: T.muted, marginTop: 2, fontFamily: T.font },
  meta: { fontSize: 11, color: T.body, marginTop: 6, fontFamily: T.mono },
  actions: { gap: 6 },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: T.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center', gap: 6 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font, marginTop: 6 },
  emptySub: { fontSize: 12, color: T.muted, textAlign: 'center', fontFamily: T.font },
});
