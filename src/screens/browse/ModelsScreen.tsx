import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { BMW_MODELS } from '@/data/mock';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ModelsScreen() {
  const nav = useNavigation<Nav>();
  const items = BMW_MODELS.slice(0, 13).map((m, i) => ({ name: m, count: 5 + i * 3 }));
  const selectedIdx = 7;
  return (
    <View style={styles.root}>
      <TopBar
        title="Select model"
        subtitle="BMW · Step 4 of 5"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Pressable
          onPress={() => nav.navigate('Listings')}
          style={[styles.row, { backgroundColor: 'transparent' }]}
        >
          <Text style={[styles.name, { fontWeight: '700' }]}>All BMW models</Text>
        </Pressable>
        {items.map((it, i) => {
          const sel = i === selectedIdx;
          return (
            <Pressable
              key={i}
              onPress={() => nav.navigate('Listings')}
              style={[styles.row, { backgroundColor: sel ? T.goldTint : 'transparent' }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { fontWeight: sel ? '700' : '500' }]}>{it.name}</Text>
                <Text style={styles.count}>{it.count} listings</Text>
              </View>
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
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
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
