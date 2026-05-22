import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { useSellDraft } from '@/lib/sellFlow';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const BALKAN_COUNTRY_OPTS = [
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'XK', name: 'Kosovo', flag: '🇽🇰' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
];

export function SellCountryScreen() {
  const nav = useNavigation<Nav>();
  const { draft, set } = useSellDraft();

  const pick = (code: string) => {
    set('country', code);
    set('city', '');
    nav.navigate('SellCity');
  };

  return (
    <View style={styles.root}>
      <TopBar
        title="Select a Country"
        subtitle="Where should we place your ad?"
        leading="close"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {BALKAN_COUNTRY_OPTS.map((c) => {
          const sel = draft.country === c.code;
          return (
            <Pressable
              key={c.code}
              onPress={() => pick(c.code)}
              style={[styles.row, { backgroundColor: sel ? T.goldTint : 'transparent' }]}
            >
              <Text style={styles.flag}>{c.flag}</Text>
              <Text style={[styles.name, { fontWeight: sel ? '700' : '500' }]}>{c.name}</Text>
              {sel && (
                <View style={styles.check}>
                  <Icon name="check" color={T.ink} size={16} strokeWidth={2.6} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
  flag: { fontSize: 24, marginRight: 14 },
  name: { flex: 1, fontSize: 16, color: T.ink, fontFamily: T.font },
  check: {
    width: 26,
    height: 26,
    borderRadius: 99,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
