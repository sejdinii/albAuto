import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '@/theme/tokens';

type Props = { size?: number; dark?: boolean };

export function Logo({ size = 22, dark = false }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.mark, { width: size, height: size, borderRadius: size * 0.3 }]}>
        <View style={[styles.markInner, { width: size * 0.55, height: size * 0.22, borderRadius: size * 0.06 }]} />
      </View>
      <Text style={[styles.word, { fontSize: size * 0.85, color: dark ? '#fff' : T.ink }]}>AlbAuto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mark: {
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markInner: {
    backgroundColor: T.ink,
  },
  word: {
    fontFamily: T.font,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
