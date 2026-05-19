import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { T } from '@/theme/tokens';
import { Icon, IconName } from './Icon';

type Variant = 'primary' | 'dark' | 'outline' | 'soft' | 'ghost' | 'green' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  full?: boolean;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const variantStyles: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: T.gold, fg: T.ink },
  dark: { bg: T.ink, fg: '#fff' },
  outline: { bg: 'transparent', fg: T.ink, border: T.ink },
  soft: { bg: T.goldTint, fg: T.ink },
  ghost: { bg: 'transparent', fg: T.ink },
  green: { bg: T.green, fg: '#fff' },
  danger: { bg: T.red, fg: '#fff' },
};

const heights: Record<Size, number> = { sm: 36, md: 48, lg: 54 };

export function Button({ children, variant = 'primary', size = 'md', icon, iconRight, full = true, color, onPress, disabled, style }: Props) {
  const s = variantStyles[variant];
  const h = heights[size];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          height: h,
          backgroundColor: color ?? s.bg,
          borderWidth: s.border ? 1.5 : 0,
          borderColor: s.border,
          width: full ? '100%' : undefined,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={18} color={s.fg} strokeWidth={2.2} />}
      <Text style={[styles.label, { color: s.fg }]}>{children}</Text>
      {iconRight && <Icon name={iconRight} size={18} color={s.fg} strokeWidth={2.2} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  label: {
    fontFamily: T.font,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
