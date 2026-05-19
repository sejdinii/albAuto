import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, hueGradient } from '@/theme/tokens';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { fetchChats } from '@/lib/db';
import { hasSupabaseConfig } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type ChatRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string | null;
  last_message: string | null;
  last_at: string | null;
  listings: { make: string; model: string; year: number; hue: number; city: string | null } | null;
  buyer: { name: string | null; verified: string | null } | null;
  seller: { name: string | null; verified: string | null } | null;
};

const TABS: [string, 'all' | 'buying' | 'selling' | 'unread'][] = [
  ['All', 'all'],
  ['Buying', 'buying'],
  ['Selling', 'selling'],
  ['Unread', 'unread'],
];

export function ChatListScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const [chats, setChats] = useState<ChatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'buying' | 'selling' | 'unread'>('all');

  const load = useCallback(async () => {
    if (!hasSupabaseConfig || !userId) {
      setChats([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rows = (await fetchChats(userId)) as unknown as ChatRow[];
      setChats(rows);
    } catch {
      setChats([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = chats.filter((c) => {
    if (tab === 'all') return true;
    if (tab === 'buying') return c.buyer_id === userId;
    if (tab === 'selling') return c.seller_id === userId;
    if (tab === 'unread') return false; // we don't track read state yet
    return true;
  });

  return (
    <View style={styles.root}>
      <View style={[styles.gold, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Chats</Text>
          <Icon name="search" color={T.ink} size={20} />
        </View>
        <View style={styles.tabsRow}>
          {TABS.map(([n, id]) => {
            const a = tab === id;
            return (
              <Pressable
                key={id}
                onPress={() => setTab(id)}
                style={[styles.tab, { borderBottomColor: a ? T.ink : 'transparent', opacity: a ? 1 : 0.6 }]}
              >
                <Text style={[styles.tabText, { fontWeight: a ? '800' : '600' }]}>{n}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={loading && chats.length > 0} onRefresh={load} />}
      >
        <View style={styles.safety}>
          <Icon name="shield" color={T.goldDark} size={16} />
          <Text style={styles.safetyText}>
            Always chat through AlbAuto — never share bank details or move payments off-platform.
          </Text>
        </View>

        {!userId ? (
          <View style={styles.empty}>
            <Icon name="chat" color={T.muted} size={28} />
            <Text style={styles.emptyTitle}>Sign in to chat</Text>
            <Text style={styles.emptySub}>Your messages live across devices once you're signed in.</Text>
            <View style={{ marginTop: 14, alignSelf: 'stretch' }}>
              <Button variant="primary" size="md" onPress={() => nav.navigate('Welcome')}>Sign in</Button>
            </View>
          </View>
        ) : loading && chats.length === 0 ? (
          <View style={styles.empty}>
            <ActivityIndicator color={T.gold} />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="chat" color={T.muted} size={28} />
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptySub}>
              Open a listing and tap "Chat" to start a conversation.
            </Text>
          </View>
        ) : (
          filtered.map((c) => <Row key={c.id} chat={c} userId={userId} onPress={() => nav.navigate('ChatDetail', { chatId: c.id } as never)} />)
        )}
      </ScrollView>
    </View>
  );
}

function Row({ chat, userId, onPress }: { chat: ChatRow; userId: string | null; onPress: () => void }) {
  const isBuyer = chat.buyer_id === userId;
  const other = isBuyer ? chat.seller : chat.buyer;
  const name = other?.name ?? 'User';
  const init = (name[0] ?? 'U').toUpperCase();
  const listingLabel = chat.listings
    ? `${chat.listings.make} ${chat.listings.model}`
    : '';
  const [from] = hueGradient(chat.listings?.hue ?? 30);

  return (
    <Pressable onPress={onPress} style={styles.chatRow}>
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, { backgroundColor: from }]}>
          <Text style={styles.avatarText}>{init}</Text>
        </View>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.chatHead}>
          <Text style={styles.chatName} numberOfLines={1}>{name}</Text>
          <Text style={styles.chatDate}>{formatDate(chat.last_at)}</Text>
        </View>
        <Text style={styles.chatPreview} numberOfLines={1}>
          {chat.last_message ?? (listingLabel ? `Started about ${listingLabel}` : 'No messages yet')}
        </Text>
      </View>
    </Pressable>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  gold: { backgroundColor: T.gold },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: T.ink, letterSpacing: -0.3, fontFamily: T.font },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 3 },
  tabText: { fontSize: 13, color: T.ink, fontFamily: T.font },
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
  empty: { paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center', gap: 6 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font, marginTop: 6 },
  emptySub: { fontSize: 12, color: T.muted, textAlign: 'center', fontFamily: T.font },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
    gap: 12,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: '800', fontFamily: T.font },
  chatHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  chatName: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font },
  chatDate: { fontSize: 11, color: T.muted, fontFamily: T.mono },
  chatPreview: { fontSize: 12, color: T.muted, marginTop: 2, fontFamily: T.font },
});
