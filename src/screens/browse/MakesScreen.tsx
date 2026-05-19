import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const POPULAR = ['BMW', 'Audi', 'MB', 'VW', 'Toyota', 'Porsche', 'Tesla', 'Ford'];
const A_MAKES = ['Abarth', 'Acura', 'AITO', 'Al Damani', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Aurus'];

export function MakesScreen() {
  const nav = useNavigation<Nav>();
  return (
    <View style={styles.root}>
      <TopBar
        title="Select make"
        subtitle="Step 3 of 5"
        variant="white"
        onBack={() => nav.goBack()}
        trailing={<Icon name="search" color={T.ink} size={20} />}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.popular}>
          <Text style={styles.section}>Popular</Text>
          <View style={styles.grid4}>
            {POPULAR.map((b, i) => (
              <Pressable
                key={b}
                onPress={() => nav.navigate('Models')}
                style={[
                  styles.tile,
                  { backgroundColor: i === 0 ? T.ink : '#fff' },
                ]}
              >
                <Text style={[styles.tileText, { color: i === 0 ? T.gold : T.ink }]}>{b}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Text style={[styles.section, { paddingHorizontal: 20, marginTop: 12 }]}>A–Z · All makes</Text>
        <View style={styles.letterHead}>
          <Text style={styles.letter}>A</Text>
        </View>
        {A_MAKES.map((n) => (
          <Pressable key={n} onPress={() => nav.navigate('Models')} style={styles.makeRow}>
            <View style={styles.makeIcon}>
              <Text style={styles.makeLetter}>{n.charAt(0)}</Text>
            </View>
            <Text style={styles.makeName}>{n}</Text>
            <Icon name="chevR" color={T.muted} size={14} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  popular: { padding: 16, paddingTop: 12 },
  section: {
    fontSize: 11,
    color: T.muted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    fontFamily: T.font,
  },
  grid4: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    width: '23.5%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: { fontSize: 13, fontWeight: '800', letterSpacing: -0.2, fontFamily: T.font },
  letterHead: { paddingHorizontal: 20, paddingVertical: 6, backgroundColor: T.surfaceAlt },
  letter: { fontSize: 11, fontWeight: '800', color: T.muted, fontFamily: T.mono },
  makeRow: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
  makeIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: T.surfaceAlt,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  makeLetter: { fontSize: 10, fontWeight: '800', fontFamily: T.font },
  makeName: { flex: 1, fontSize: 14, color: T.ink, fontWeight: '500', fontFamily: T.font },
});
