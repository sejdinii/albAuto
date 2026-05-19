import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { CARS, Car } from '@/data/mock';

const GROUPS: { label: string; cars: Car[] }[] = [
  { label: 'Today', cars: [CARS[0], CARS[3]] },
  { label: 'Yesterday', cars: [CARS[1], CARS[2], CARS[5]] },
  { label: 'This week', cars: [CARS[4], CARS[6], CARS[7]] },
];

export function RecentScreen() {
  const nav = useNavigation();
  return (
    <View style={styles.root}>
      <TopBar
        title="Recently viewed"
        variant="white"
        onBack={() => nav.goBack()}
        trailing={<Text style={styles.clear}>Clear</Text>}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {GROUPS.map((g, gi) => (
          <View key={g.label} style={{ marginBottom: 16 }}>
            <Text style={styles.groupLabel}>{g.label.toUpperCase()}</Text>
            <View style={{ gap: 8 }}>
              {g.cars.map((c, i) => (
                <View key={c.id} style={styles.row}>
                  <View style={styles.photo}>
                    <CarPhoto hue={c.hue} height={56} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.title}>{c.make} {c.model}</Text>
                    <Text style={styles.sub}>{c.year} · {c.km}</Text>
                    <Text style={styles.price}>{c.priceEur}</Text>
                  </View>
                  {gi === 0 && i === 0 && (
                    <View style={styles.drop}>
                      <Text style={styles.dropText}>↓ €2,600</Text>
                    </View>
                  )}
                  <Icon name="heart" color={T.muted} size={18} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
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
  drop: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, backgroundColor: T.green },
  dropText: { color: '#fff', fontSize: 9, fontWeight: '800', fontFamily: T.font },
});
