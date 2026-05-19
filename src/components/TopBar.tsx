import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/theme/tokens';
import { Icon } from './Icon';

type Variant = 'plain' | 'gold' | 'white';
type Leading = 'back' | 'close' | 'none';

type Props = {
  title?: string;
  subtitle?: string;
  variant?: Variant;
  leading?: Leading;
  trailing?: React.ReactNode;
  onBack?: () => void;
};

export function TopBar({ title, subtitle, variant = 'plain', leading = 'back', trailing, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const isGold = variant === 'gold';
  const isWhite = variant === 'white';
  const bg = isGold ? T.gold : isWhite ? '#fff' : 'transparent';
  const fg = T.ink;
  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: bg,
          paddingTop: Math.max(insets.top, 12),
          borderBottomWidth: isWhite ? StyleSheet.hairlineWidth : 0,
        },
      ]}
    >
      <View style={styles.row}>
        {leading === 'none' ? (
          <View style={styles.leadSpacer} />
        ) : (
          <Pressable onPress={onBack} style={styles.iconBtn} hitSlop={8}>
            <Icon name={leading === 'close' ? 'close' : 'back'} color={fg} size={22} strokeWidth={2} />
          </Pressable>
        )}
        <View style={styles.center}>
          {title && <Text style={[styles.title, { color: fg }]} numberOfLines={1}>{title}</Text>}
          {subtitle && (
            <Text style={[styles.subtitle, { color: isGold ? 'rgba(15,15,16,0.65)' : T.muted }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.trailing}>{trailing}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 12,
    paddingHorizontal: 8,
    borderBottomColor: T.hairline,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadSpacer: { width: 16 },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: T.font,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: T.font,
    fontSize: 12,
    marginTop: 2,
  },
  trailing: {
    minWidth: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
  },
});
