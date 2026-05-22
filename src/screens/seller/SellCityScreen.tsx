import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { useSellDraft } from '@/lib/sellFlow';
import { CITIES_BY_COUNTRY, COUNTRY_CODE_BY_NAME } from '@/data/mock';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SellCityScreen() {
  const nav = useNavigation<Nav>();
  const { draft, set } = useSellDraft();

  const cities = CITIES_BY_COUNTRY[draft.country] ?? [];
  const countryName =
    Object.entries(COUNTRY_CODE_BY_NAME).find(([, code]) => code === draft.country)?.[0] ?? draft.country;

  const pick = (city: string) => {
    set('city', city);
    nav.navigate('SellForm');
  };

  return (
    <View style={styles.root}>
      <TopBar
        title="Select a City"
        subtitle={`In ${countryName}`}
        leading="close"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {cities.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No cities listed</Text>
            <Text style={styles.emptySub}>Go back and pick a country first.</Text>
          </View>
        ) : (
          cities.map((c) => {
            const sel = draft.city === c;
            return (
              <Pressable
                key={c}
                onPress={() => pick(c)}
                style={[styles.row, { backgroundColor: sel ? T.goldTint : 'transparent' }]}
              >
                <Text style={[styles.name, { fontWeight: sel ? '700' : '500' }]}>{c}</Text>
                {sel && (
                  <View style={styles.check}>
                    <Icon name="check" color={T.ink} size={16} strokeWidth={2.6} />
                  </View>
                )}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
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
  name: { flex: 1, fontSize: 15, color: T.ink, fontFamily: T.font },
  check: {
    width: 26,
    height: 26,
    borderRadius: 99,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center', gap: 6 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font },
  emptySub: { fontSize: 12, color: T.muted, textAlign: 'center', fontFamily: T.font },
});
