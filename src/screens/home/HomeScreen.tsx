import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow, hueGradient } from '@/theme/tokens';
import { Logo } from '@/components/Logo';
import { Icon } from '@/components/Icon';
import { CarCardSmall } from '@/components/CarCards';
import { CARS, Car } from '@/data/mock';
import { fetchListings, ListingWithCover } from '@/lib/db';
import { hasSupabaseConfig } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

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

export function HomeScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [cars, setCars] = useState<Car[]>(CARS);
  const [refreshing, setRefreshing] = useState(false);
  const [usingMock, setUsingMock] = useState(true);

  const load = useCallback(async () => {
    if (!hasSupabaseConfig) return;
    setRefreshing(true);
    try {
      const rows = await fetchListings({ limit: 12 });
      if (rows.length > 0) {
        setCars(rows.map(toCard));
        setUsingMock(false);
      } else {
        setCars(CARS);
        setUsingMock(true);
      }
    } catch {
      setCars(CARS);
      setUsingMock(true);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      >
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <Logo size={22} />
          <View style={styles.headerActions}>
            <Pressable onPress={() => nav.navigate('Notifications')} style={styles.iconBtn}>
              <Icon name="bell" color={T.ink} size={18} />
              <View style={styles.dot} />
            </Pressable>
            <Pressable onPress={() => nav.navigate('Tabs', { screen: 'MenuTab' })} style={styles.avatar}>
              <Text style={styles.avatarText}>AM</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={() => nav.navigate('Search')} style={styles.searchWrap}>
          <View style={[styles.search, shadow.card]}>
            <Icon name="search" color={T.muted} size={20} />
            <Text style={styles.searchPlaceholder}>Search make, model or VIN…</Text>
            <View style={styles.filterMini}>
              <Icon name="filter" color={T.ink} size={15} />
            </View>
          </View>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Where to?</Text>
          <View style={styles.heroGrid}>
            <Pressable onPress={() => nav.navigate('BalkanCountries')} style={{ flex: 1 }}>
              <CategoryCard title="Cars within Balkans" sub="2,872 listings" hue={30} primary />
            </Pressable>
            <Pressable onPress={() => nav.navigate('Continent')} style={{ flex: 1 }}>
              <CategoryCard title="Cars for Import" sub="13,610 worldwide" hue={210} />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>{usingMock ? 'Sample inventory' : 'For you'}</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 10, paddingRight: 16 }}>
              {cars.slice(0, 6).map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => nav.navigate('CarDetail', { id: c.id })}
                  style={{ width: 140 }}
                >
                  <CarCardSmall car={c} />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={[styles.section, { paddingHorizontal: 16 }]}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>{usingMock ? 'Sample listings' : 'New listings'}</Text>
            <View style={styles.allCities}>
              <Text style={styles.allCitiesText}>All cities</Text>
              <Icon name="chevD" size={12} color={T.muted} />
            </View>
          </View>
          <View style={styles.grid3}>
            {cars.slice(0, 6).map((c) => (
              <Pressable
                key={c.id}
                onPress={() => nav.navigate('CarDetail', { id: c.id })}
                style={styles.gridCell}
              >
                <CarCardSmall car={c} />
              </Pressable>
            ))}
          </View>
        </View>

        {usingMock && hasSupabaseConfig && (
          <View style={styles.mockHint}>
            <Icon name="sparkles" color={T.goldDark} size={14} />
            <Text style={styles.mockHintText}>
              Showing samples. Publish a listing (Sell tab or dealer import) and it appears here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function CategoryCard({ title, sub, hue, primary }: { title: string; sub: string; hue: number; primary?: boolean }) {
  const [from, to] = hueGradient(hue);
  const gid = `cat-${hue}-${primary ? 'p' : 'l'}`;
  return (
    <View
      style={[
        styles.cat,
        {
          backgroundColor: primary ? T.ink : '#fff',
          borderWidth: primary ? 0 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      {!primary && (
        <Svg style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={from} />
              <Stop offset="1" stopColor={to} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gid})`} />
        </Svg>
      )}
      <Svg viewBox="0 0 200 100" style={styles.catCar} width={140} height={70}>
        <Path
          d="M20 70 Q22 55 38 50 L70 42 Q90 36 110 38 L140 42 Q160 46 170 56 L185 60 Q190 62 188 70 L182 78 L168 78 Q166 86 158 86 Q150 86 148 78 L60 78 Q58 86 50 86 Q42 86 40 78 L28 78 Q18 76 20 70 Z"
          fill={primary ? T.gold : 'rgba(15,15,16,0.85)'}
        />
      </Svg>
      <Text style={[styles.catSub, { color: primary ? 'rgba(255,255,255,0.6)' : 'rgba(15,15,16,0.6)' }]}>{sub}</Text>
      <View style={styles.catFoot}>
        <Text style={[styles.catTitle, { color: primary ? '#fff' : T.ink }]}>{title}</Text>
        <View style={[styles.catArrow, { backgroundColor: primary ? T.gold : T.ink }]}>
          <Icon name="chevR" color={primary ? T.ink : '#fff'} size={16} strokeWidth={2.4} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 99,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: T.red,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 99,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 13, fontWeight: '700', fontFamily: T.font },
  searchWrap: { paddingHorizontal: 16, marginTop: 14 },
  search: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchPlaceholder: { flex: 1, fontSize: 14, color: T.muted, fontFamily: T.font },
  filterMini: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: T.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { paddingTop: 18, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: T.ink,
    letterSpacing: -0.2,
    fontFamily: T.font,
    marginBottom: 10,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  seeAll: { fontSize: 12, color: T.muted, fontWeight: '600', fontFamily: T.font, marginBottom: 10 },
  allCities: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  allCitiesText: { fontSize: 12, color: T.muted, fontWeight: '600', fontFamily: T.font },
  heroGrid: { flexDirection: 'row', gap: 10 },
  grid3: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCell: { width: '31.5%' },
  cat: {
    aspectRatio: 1,
    borderRadius: 18,
    position: 'relative',
    overflow: 'hidden',
    padding: 14,
    borderColor: T.hairline,
    justifyContent: 'space-between',
  },
  catCar: { position: 'absolute', bottom: -10, right: -20, opacity: 0.95 },
  catSub: {
    fontSize: 9,
    fontFamily: T.mono,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  catFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  catTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 18,
    fontFamily: T.font,
    maxWidth: '70%',
  },
  catArrow: {
    width: 32,
    height: 32,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockHint: {
    margin: 16,
    padding: 12,
    backgroundColor: T.goldTint,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  mockHintText: { flex: 1, fontSize: 11, color: T.body, lineHeight: 15, fontFamily: T.font },
});
