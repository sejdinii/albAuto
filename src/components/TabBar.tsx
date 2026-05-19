import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, shadow } from '@/theme/tokens';
import { Icon, IconName } from './Icon';

export type TabId = 'home' | 'favorites' | 'sell' | 'chats' | 'menu';

type Props = {
  active?: TabId;
  chatBadge?: number;
  onPress?: (id: TabId) => void;
};

const tabs: { id: TabId; icon: IconName; label: string }[] = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'favorites', icon: 'heart', label: 'Saved' },
  { id: 'sell', icon: 'plus', label: 'Sell' },
  { id: 'chats', icon: 'chat', label: 'Chats' },
  { id: 'menu', icon: 'menu', label: 'Menu' },
];

export function TabBar({ active = 'home', chatBadge = 2, onPress }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {tabs.map((t) => {
        const isCenter = t.id === 'sell';
        const isActive = t.id === active;
        if (isCenter) {
          return (
            <Pressable key={t.id} onPress={() => onPress?.(t.id)} style={styles.tabBox}>
              <View style={[styles.sellBtn, shadow.goldGlow]}>
                <Icon name="plus" color={T.ink} size={24} strokeWidth={2.4} />
              </View>
              <Text style={styles.sellLabel}>{t.label}</Text>
            </Pressable>
          );
        }
        const badge = t.id === 'chats' ? chatBadge : 0;
        return (
          <Pressable key={t.id} onPress={() => onPress?.(t.id)} style={styles.tabBox}>
            <View>
              <Icon
                name={t.icon}
                color={isActive ? T.ink : T.muted}
                fill={isActive && t.id === 'favorites'}
                strokeWidth={isActive ? 2.2 : 1.8}
                size={22}
              />
              {badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, { color: isActive ? T.ink : T.muted, fontWeight: isActive ? '700' : '500' }]}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingTop: 8,
  },
  tabBox: {
    alignItems: 'center',
    minWidth: 56,
    gap: 4,
  },
  sellBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
  },
  sellLabel: {
    fontFamily: T.font,
    fontSize: 10,
    fontWeight: '600',
    color: T.ink,
    marginTop: -2,
  },
  label: {
    fontFamily: T.font,
    fontSize: 10,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 99,
    backgroundColor: T.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: T.font,
  },
});
