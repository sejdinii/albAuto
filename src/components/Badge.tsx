import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { T } from '@/theme/tokens';
import { Icon, IconName } from './Icon';

type Props = {
  children: React.ReactNode;
  color?: string;
  fg?: string;
  icon?: IconName;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
};

export function Badge({ children, color = T.gold, fg = T.ink, icon, size = 'md', style }: Props) {
  const fontSize = size === 'sm' ? 10 : 11;
  const py = size === 'sm' ? 3 : 4;
  return (
    <View style={[styles.row, { backgroundColor: color, paddingVertical: py }, style]}>
      {icon && <Icon name={icon} size={11} color={fg} strokeWidth={2.4} />}
      <Text style={[styles.text, { color: fg, fontSize }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: T.font,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
