import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { BALKAN_COUNTRIES, MK_CITIES, CONTINENTS, EU_COUNTRIES } from '@/data/mock';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Item = { name: string; count?: number; flag?: string };

type Props = {
  title: string;
  subtitle?: string;
  allLabel?: string;
  items: (Item | string)[];
  selectedIdx?: number;
  showSearch?: boolean;
  nextRoute: keyof RootStackParamList;
};

function SelectList({ title, subtitle, allLabel, items, selectedIdx = 0, showSearch = true, nextRoute }: Props) {
  const nav = useNavigation<Nav>();
  return (
    <View style={styles.root}>
      <TopBar
        title={title}
        subtitle={subtitle}
        variant="white"
        onBack={() => nav.goBack()}
        trailing={
          showSearch ? (
            <Pressable onPress={() => nav.navigate('Search')}>
              <Icon name="search" color={T.ink} size={20} />
            </Pressable>
          ) : null
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {allLabel && (
          <Pressable
            onPress={() => nav.navigate(nextRoute as never)}
            style={[
              styles.row,
              { backgroundColor: selectedIdx === -1 ? T.goldTint : 'transparent' },
            ]}
          >
            <Text style={[styles.name, { fontWeight: '700' }]}>{allLabel}</Text>
            {selectedIdx === -1 && <Check />}
          </Pressable>
        )}
        {items.map((raw, i) => {
          const it = typeof raw === 'string' ? { name: raw } : raw;
          const sel = i === selectedIdx;
          return (
            <Pressable
              key={i}
              onPress={() => nav.navigate(nextRoute as never)}
              style={[styles.row, { backgroundColor: sel ? T.goldTint : 'transparent' }]}
            >
              {it.flag && <Text style={styles.flag}>{it.flag}</Text>}
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { fontWeight: sel ? '700' : '500' }]}>{it.name}</Text>
                {it.count != null && (
                  <Text style={styles.count}>{it.count.toLocaleString()} listings</Text>
                )}
              </View>
              {sel && <Check />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function Check() {
  return (
    <View style={styles.check}>
      <Icon name="check" color={T.ink} size={16} strokeWidth={2.6} />
    </View>
  );
}

export function BalkanCountriesScreen() {
  return (
    <SelectList
      title="Cars within Balkans"
      subtitle="Step 1 of 5 · Pick a country"
      allLabel="All in Balkan Countries"
      items={BALKAN_COUNTRIES}
      selectedIdx={-1}
      nextRoute="BalkanCities"
    />
  );
}

export function BalkanCitiesScreen() {
  return (
    <SelectList
      title="Cities in North Macedonia"
      subtitle="Step 2 of 5 · Pick a city"
      allLabel="All cities"
      items={MK_CITIES.map((c, i) => ({ name: c, count: 100 + i * 37 }))}
      selectedIdx={0}
      nextRoute="Makes"
    />
  );
}

export function ContinentScreen() {
  return (
    <SelectList
      title="Cars for Import"
      subtitle="Step 1 of 6 · Pick a continent"
      allLabel="All continents"
      items={CONTINENTS}
      selectedIdx={-1}
      showSearch={false}
      nextRoute="EuCountries"
    />
  );
}

export function EuCountriesScreen() {
  return (
    <SelectList
      title="Cars within Europe"
      subtitle="Step 2 of 6 · Pick a country"
      allLabel="All in Europe"
      items={EU_COUNTRIES.slice(0, 9).map((n, i) => ({ name: n, count: 200 + i * 91 }))}
      selectedIdx={5}
      nextRoute="Makes"
    />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
  flag: { fontSize: 22, marginRight: 12 },
  name: { fontSize: 15, color: T.ink, fontFamily: T.font },
  count: { fontSize: 11, color: T.muted, fontFamily: T.mono, marginTop: 1 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 99,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
