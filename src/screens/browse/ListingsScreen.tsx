import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { Icon } from '@/components/Icon';
import { CarCardListing } from '@/components/CarCards';
import { CARS } from '@/data/mock';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const QUICK_FILTERS = ['Trim', 'Price', 'Year', 'Specs'];

export function ListingsScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => nav.goBack()} hitSlop={10}>
            <Icon name="back" color={T.ink} size={22} />
          </Pressable>
          <View style={styles.searchChip}>
            <Icon name="search" color={T.muted} size={16} />
            <Text style={styles.queryText}>BMW M3</Text>
            <Text style={styles.locText}>Skopje, MK</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          <Pressable onPress={() => nav.navigate('Filters')} style={styles.filterMain}>
            <Icon name="filter" color="#fff" size={13} />
            <Text style={styles.filterMainText}>Filters</Text>
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>3</Text>
            </View>
          </Pressable>
          {QUICK_FILTERS.map((f) => (
            <View key={f} style={styles.quick}>
              <Text style={styles.quickText}>{f}</Text>
              <Icon name="chevD" color={T.muted} size={11} />
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.toolbar}>
        <Text style={styles.results}>14 RESULTS · BMW M3</Text>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <View style={styles.toolBtn}>
            <Icon name="sort" size={13} color={T.ink} />
            <Text style={styles.toolText}>Sort</Text>
          </View>
          <View style={styles.toolBtn}>
            <Icon name="star" size={13} color={T.ink} />
            <Text style={styles.toolText}>Save</Text>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Pressable onPress={() => nav.navigate('CarDetail')}>
          <CarCardListing car={CARS[0]} premium />
        </Pressable>
        <Pressable onPress={() => nav.navigate('CarDetail')}>
          <CarCardListing car={CARS[3]} />
        </Pressable>
        <Pressable onPress={() => nav.navigate('CarDetail')}>
          <CarCardListing car={CARS[5]} />
        </Pressable>
      </ScrollView>
    </View>
  );
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
    width: 16,
    height: 16,
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
});
