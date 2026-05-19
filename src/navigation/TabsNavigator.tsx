import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { Icon, IconName } from '@/components/Icon';
import { TabsParamList, RootStackParamList } from '@/navigation/types';

import { HomeScreen } from '@/screens/home/HomeScreen';
import { FavoritesScreen } from '@/screens/fav/FavoritesScreen';
import { SellTypeScreen } from '@/screens/seller/SellTypeScreen';
import { ChatListScreen } from '@/screens/chat/ChatListScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<TabsParamList>();

type TabDef = { name: keyof TabsParamList; icon: IconName; label: string };
const TABS: TabDef[] = [
  { name: 'HomeTab', icon: 'home', label: 'Home' },
  { name: 'FavoritesTab', icon: 'heart', label: 'Saved' },
  { name: 'SellTab', icon: 'plus', label: 'Sell' },
  { name: 'ChatsTab', icon: 'chat', label: 'Chats' },
  { name: 'MenuTab', icon: 'menu', label: 'Menu' },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {TABS.map((t, i) => {
        const isCenter = t.name === 'SellTab';
        const isActive = state.index === i;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: state.routes[i].key, canPreventDefault: true });
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(t.name);
          }
        };
        if (isCenter) {
          return (
            <Pressable key={t.name} onPress={onPress} style={styles.tabBox}>
              <View style={[styles.sellBtn, shadow.goldGlow]}>
                <Icon name="plus" color={T.ink} size={24} strokeWidth={2.4} />
              </View>
              <Text style={styles.sellLabel}>{t.label}</Text>
            </Pressable>
          );
        }
        const badge = t.name === 'ChatsTab' ? 2 : 0;
        return (
          <Pressable key={t.name} onPress={onPress} style={styles.tabBox}>
            <View>
              <Icon
                name={t.icon}
                color={isActive ? T.ink : T.muted}
                fill={isActive && t.name === 'FavoritesTab'}
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

export function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="FavoritesTab" component={FavoritesScreen} />
      <Tab.Screen name="SellTab" component={SellTypeScreen} />
      <Tab.Screen name="ChatsTab" component={ChatListScreen} />
      <Tab.Screen name="MenuTab" component={ProfileScreen} />
    </Tab.Navigator>
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
  tabBox: { alignItems: 'center', minWidth: 56, gap: 4 },
  sellBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
  },
  sellLabel: { fontFamily: T.font, fontSize: 10, fontWeight: '600', color: T.ink, marginTop: -2 },
  label: { fontFamily: T.font, fontSize: 10 },
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
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700', fontFamily: T.font },
});

export type RootNav = NativeStackNavigationProp<RootStackParamList>;
export function useRootNav(): RootNav {
  return useNavigation<RootNav>();
}
