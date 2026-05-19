import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { CARS } from '@/data/mock';

const SPECS: [string, [string, string], number | null][] = [
  ['Price', ['AED 479,900', 'AED 489,000'], 0],
  ['Year', ['2024', '2023'], 0],
  ['Mileage', ['4,200 km', '18,800 km'], 0],
  ['HP', ['510 HP', '630 HP'], 1],
  ['0–100 km/h', ['3.5 s', '3.4 s'], 1],
  ['Body', ['Sedan', 'Wagon'], null],
  ['Drive', ['M xDrive', 'Quattro'], null],
  ['Warranty', ['Yes', 'No'], 0],
];

export function CompareScreen() {
  const nav = useNavigation();
  const cars = [CARS[0], CARS[1]];
  return (
    <View style={styles.root}>
      <TopBar
        title="Compare"
        subtitle="2 of 4 selected"
        variant="white"
        onBack={() => nav.goBack()}
        trailing={<Icon name="plus" color={T.ink} size={20} />}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={styles.headerCards}>
          {cars.map((c) => (
            <View key={c.id} style={styles.headerCard}>
              <CarPhoto hue={c.hue} height={90} />
              <View style={{ padding: 8 }}>
                <Text style={styles.headerYear}>{c.year}</Text>
                <Text style={styles.headerTitle}>{c.make} {c.model}</Text>
                <Text style={styles.headerTrim}>{c.trim}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.specBox}>
          {SPECS.map(([label, vals, winner], i) => (
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
            <Text style={styles.aiTitle}>AI summary</Text>
            <Text style={styles.aiBody}>
              The M3 is newer with lower mileage and includes warranty. The RS6 has 120 more HP and wagon practicality, but is 8 months older with 4× the mileage.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
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
