import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect } from 'react-native-svg';

import { T, shadow } from '@/theme/tokens';
import { Button } from '@/components/Button';

const BARS = [4, 8, 10, 18, 22, 28, 34, 30, 28, 22, 18, 12, 10, 8, 7, 8, 10, 12, 14, 10, 8, 6, 5, 4, 3, 3, 2, 2];

export function FiltersScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <Pressable style={styles.scrim} onPress={() => nav.goBack()} />
      <View style={[styles.sheet, { paddingBottom: 20 + insets.bottom }]}>
        <View style={styles.grabber} />
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <Text style={styles.reset}>Reset</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FilterRow label="Price range" value="€20k – €130k">
            <View style={styles.priceWrap}>
              <Svg viewBox="0 0 280 40" width="100%" height={50}>
                {BARS.map((h, i) => {
                  const sel = i > 4 && i < 22;
                  return (
                    <Rect
                      key={i}
                      x={i * 10 + 2}
                      y={40 - h}
                      width={6}
                      height={h}
                      rx={1}
                      fill={sel ? T.gold : T.hairline}
                    />
                  );
                })}
              </Svg>
              <View style={styles.priceTrack} />
              <View style={styles.priceFill} />
              <View style={[styles.knob, { left: '18%' }]} />
              <View style={[styles.knob, { right: '20%' }]} />
            </View>
          </FilterRow>
          <FilterRow label="Year" value="2018 – 2026">
            <View style={styles.chipWrap}>
              {[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y, i) => (
                <View
                  key={y}
                  style={[
                    styles.chip,
                    { backgroundColor: i >= 3 ? T.gold : T.surfaceAlt },
                  ]}
                >
                  <Text style={[styles.chipText, { fontWeight: i >= 3 ? '700' : '600' }]}>{y}</Text>
                </View>
              ))}
            </View>
          </FilterRow>
          <FilterRow label="Body type" value="3 selected">
            <View style={styles.gridBody}>
              {(['Sedan', 'SUV', 'Wagon', 'Coupé', 'Pickup', 'Hatch'] as const).map((n, i) => {
                const sel = i < 3;
                return (
                  <View
                    key={n}
                    style={[
                      styles.bodyCell,
                      {
                        backgroundColor: sel ? T.ink : '#fff',
                        borderWidth: sel ? 0 : StyleSheet.hairlineWidth,
                      },
                    ]}
                  >
                    <Text style={[styles.bodyText, { color: sel ? '#fff' : T.body }]}>{n}</Text>
                  </View>
                );
              })}
            </View>
          </FilterRow>
          <FilterRow label="Fuel" value="Petrol, Hybrid">
            <View style={styles.chipWrap}>
              {(['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'] as const).map((n, i) => {
                const sel = i === 0 || i === 2;
                return (
                  <View
                    key={n}
                    style={[styles.chip, { backgroundColor: sel ? T.gold : T.surfaceAlt }]}
                  >
                    <Text style={[styles.chipText, { fontWeight: sel ? '700' : '600' }]}>{n}</Text>
                  </View>
                );
              })}
            </View>
          </FilterRow>
        </ScrollView>
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <Button variant="outline" size="md">Save search</Button>
          </View>
          <View style={{ flex: 1.4 }}>
            <Button variant="primary" size="md" onPress={() => nav.goBack()}>
              Show 142 cars
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

function FilterRow({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 16 }}>
      <View style={styles.filterHead}>
        <Text style={styles.filterLabel}>{label}</Text>
        <Text style={styles.filterValue}>{value}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,15,16,0.3)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  grabber: {
    width: 36,
    height: 4,
    backgroundColor: T.hairline,
    borderRadius: 99,
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: '800', color: T.ink, fontFamily: T.font },
  reset: { fontSize: 13, color: T.body, fontWeight: '600', fontFamily: T.font },
  filterHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  filterLabel: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.font },
  filterValue: { fontSize: 12, color: T.body, fontFamily: T.mono },
  priceWrap: { height: 60, position: 'relative' },
  priceTrack: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: T.hairline,
    borderRadius: 99,
  },
  priceFill: {
    position: 'absolute',
    top: 50,
    height: 4,
    left: '20%',
    right: '22%',
    backgroundColor: T.gold,
    borderRadius: 99,
  },
  knob: {
    position: 'absolute',
    top: 44,
    width: 18,
    height: 18,
    borderRadius: 99,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: T.gold,
    ...shadow.elev,
  },
  chipWrap: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99 },
  chipText: { fontSize: 12, color: T.ink, fontFamily: T.font },
  gridBody: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bodyCell: {
    width: '31.5%',
    paddingVertical: 12,
    borderRadius: 10,
    borderColor: T.hairline,
    alignItems: 'center',
  },
  bodyText: { fontSize: 12, fontWeight: '700', fontFamily: T.font },
  footer: { flexDirection: 'row', gap: 10, marginTop: 20 },
});
