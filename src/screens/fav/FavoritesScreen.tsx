import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { CarCardMedium } from '@/components/CarCards';
import { CARS } from '@/data/mock';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS: [string, number, boolean][] = [
  ['Cars', 9, true],
  ['Searches', 3, false],
  ['Compare', 2, false],
];

export function FavoritesScreen() {
  const nav = useNavigation<Nav>();
  return (
    <View style={styles.root}>
      <TopBar
        title="Saved"
        leading="none"
        variant="white"
        trailing={<Icon name="filter" color={T.ink} size={20} />}
      />
      <View style={styles.tabRow}>
        {TABS.map(([t, n, a]) => (
          <Pressable
            key={t}
            onPress={() => {
              if (t === 'Searches') nav.navigate('SavedSearches');
              if (t === 'Compare') nav.navigate('Compare');
            }}
            style={[
              styles.tab,
              {
                backgroundColor: a ? T.ink : '#fff',
                borderWidth: a ? 0 : StyleSheet.hairlineWidth,
              },
            ]}
          >
            <Text style={[styles.tabText, { color: a ? '#fff' : T.body }]}>{t}</Text>
            <Text style={[styles.tabCount, { color: a ? T.gold : T.muted }]}>{n}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 14 }}>
        <View style={styles.headRow}>
          <Text style={styles.headLabel}>9 saved cars</Text>
          <View style={styles.sortRow}>
            <Text style={styles.sortText}>Sort: Recent</Text>
            <Icon name="chevD" size={11} color={T.ink} />
          </View>
        </View>
        <View style={styles.grid}>
          {CARS.slice(0, 6).map((c) => (
            <Pressable
              key={c.id}
              onPress={() => nav.navigate('CarDetail', { id: c.id })}
              style={styles.cell}
            >
              <CarCardMedium car={c} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
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
});
