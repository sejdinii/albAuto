import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, hueGradient } from '@/theme/tokens';
import { Icon } from '@/components/Icon';
import { CHATS, Chat } from '@/data/mock';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS: [string, boolean, number?][] = [
  ['All', true],
  ['Buying', false],
  ['Selling', false],
  ['Unread', false, 2],
];

export function ChatListScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View style={[styles.gold, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Chats</Text>
          <Icon name="search" color={T.ink} size={20} />
        </View>
        <View style={styles.tabsRow}>
          {TABS.map(([n, a, b], i) => (
            <View
              key={i}
              style={[
                styles.tab,
                { borderBottomColor: a ? T.ink : 'transparent', opacity: a ? 1 : 0.6 },
              ]}
            >
              <Text style={[styles.tabText, { fontWeight: a ? '800' : '600' }]}>{n}</Text>
              {b ? (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{b}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.safety}>
          <Icon name="shield" color={T.goldDark} size={16} />
          <Text style={styles.safetyText}>
            Always chat through AlbAuto — never share bank details or move payments off-platform.
          </Text>
        </View>
        <View style={styles.unreadHead}>
          <Text style={styles.unreadHeadText}>2 NEW MESSAGES</Text>
        </View>
        {CHATS.map((c, i) => (
          <Pressable
            key={i}
            onPress={() => nav.navigate('ChatDetail', { name: c.name })}
          >
            <ChatRow chat={c} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function ChatRow({ chat }: { chat: Chat }) {
  const vColor =
    chat.verified === 'gold'
      ? T.gold
      : chat.verified === 'blue'
      ? T.blue
      : chat.verified === 'green'
      ? T.green
      : null;
  const [from] = hueGradient(chat.hue);
  return (
    <View style={styles.row}>
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, { backgroundColor: from }]}>
          <Text style={styles.avatarText}>{chat.init}</Text>
        </View>
        {vColor && (
          <View style={styles.verified}>
            <Icon name="verified" color={vColor} size={18} />
          </View>
        )}
        {chat.unread && <View style={styles.unreadDot} />}
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.rowHead}>
          <Text
            style={[
              styles.rowName,
              { fontWeight: chat.unread ? '800' : '600', color: chat.unread ? T.goldDark : T.ink },
            ]}
            numberOfLines={1}
          >
            {chat.name}
          </Text>
          <Text
            style={[
              styles.rowDate,
              { color: chat.unread ? T.ink : T.muted, fontWeight: chat.unread ? '700' : '500' },
            ]}
          >
            {chat.date}
          </Text>
        </View>
        <Text
          style={[
            styles.rowPreview,
            { color: chat.unread ? T.ink : T.muted, fontWeight: chat.unread ? '500' : '400' },
          ]}
          numberOfLines={1}
        >
          {chat.preview}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  gold: { backgroundColor: T.gold, paddingBottom: 0 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: T.ink, letterSpacing: -0.3, fontFamily: T.font },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderBottomWidth: 3,
  },
  tabText: { fontSize: 13, color: T.ink, fontFamily: T.font },
  tabBadge: {
    width: 16,
    height: 16,
    borderRadius: 99,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: { color: T.gold, fontSize: 10, fontWeight: '800', fontFamily: T.font },
  safety: {
    margin: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: T.surfaceAlt,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  safetyText: { flex: 1, fontSize: 11, color: T.body, lineHeight: 15, fontFamily: T.font },
  unreadHead: { paddingHorizontal: 16, paddingBottom: 6 },
  unreadHeadText: {
    backgroundColor: T.gold,
    color: T.ink,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    fontFamily: T.font,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
    gap: 12,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: '800', fontFamily: T.font },
  verified: { position: 'absolute', bottom: -2, right: -2 },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 99,
    backgroundColor: T.green,
    borderWidth: 2,
    borderColor: '#fff',
  },
  rowHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  rowName: { fontSize: 14, fontFamily: T.font },
  rowDate: { fontSize: 11, fontFamily: T.mono },
  rowPreview: { fontSize: 12, marginTop: 2, fontFamily: T.font },
});
