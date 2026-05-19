import React from 'react';
import { View, Text, StyleSheet, DimensionValue } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { T, hueGradient } from '@/theme/tokens';

type Props = {
  hue?: number;
  label?: string;
  width?: DimensionValue;
  height?: number;
  radius?: number;
  dark?: boolean;
  badge?: React.ReactNode;
  count?: string | null;
};

export function CarPhoto({ hue = 30, label, width = '100%', height = 160, radius = 0, dark = false, badge, count }: Props) {
  const [from, to] = hueGradient(hue, dark);
  const gid = `g-${hue}-${dark ? 'd' : 'l'}`;
  return (
    <View style={[styles.frame, { width, height, borderRadius: radius }]}>
      <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gid})`} />
      </Svg>
      <View style={[styles.horizon, { top: '62%' }]} />
      <View pointerEvents="none" style={styles.carBox}>
        <Svg width="85%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">
          <Path
            d="M20 70 Q22 55 38 50 L70 42 Q90 36 110 38 L140 42 Q160 46 170 56 L185 60 Q190 62 188 70 L182 78 L168 78 Q166 86 158 86 Q150 86 148 78 L60 78 Q58 86 50 86 Q42 86 40 78 L28 78 Q18 76 20 70 Z"
            fill="rgba(15,15,16,0.85)"
          />
          <Path d="M55 50 L82 44 Q98 42 118 44 L142 50 L150 60 L48 60 Z" fill="rgba(255,255,255,0.15)" />
        </Svg>
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
      {badge}
      {count && (
        <View style={styles.countWrap}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  },
  horizon: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  carBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '8%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '55%',
  },
  label: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontFamily: T.mono,
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  countWrap: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  countText: {
    color: '#fff',
    fontFamily: T.mono,
    fontSize: 10,
  },
});
