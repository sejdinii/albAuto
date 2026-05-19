import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T, hueGradient } from '@/theme/tokens';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/lib/auth';
import { fetchMessages, getOrCreateChat, Message, sendMessage, subscribeToMessages } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';

type Rt = RouteProp<RootStackParamList, 'ChatDetail'>;

type ChatMeta = {
  id: string;
  otherName: string;
  otherInit: string;
  listingLabel: string | null;
  listingHue: number;
  listingPrice: number | null;
  listingCity: string | null;
};

export function ChatDetailScreen() {
  const nav = useNavigation();
  const route = useRoute<Rt>();
  const insets = useSafeAreaInsets();
  const { session, userId } = useAuth();
  const [meta, setMeta] = useState<ChatMeta | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  const chatId = (route.params as any)?.chatId as string | undefined;
  const sellerId = (route.params as any)?.sellerId as string | undefined;
  const listingId = (route.params as any)?.listingId as string | undefined;

  const init = useCallback(async () => {
    if (!session) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let resolvedId = chatId;
      if (!resolvedId && sellerId) {
        const chat = await getOrCreateChat(userId!, sellerId, listingId ?? null);
        resolvedId = chat.id;
      }
      if (!resolvedId) {
        setLoading(false);
        return;
      }
      // Load chat metadata
      const { data: chatRow } = await supabase
        .from('chats')
        .select(`
          id, buyer_id, seller_id, listing_id,
          listings(make, model, year, hue, price_eur, city),
          buyer:profiles!buyer_id(name),
          seller:profiles!seller_id(name)
        `)
        .eq('id', resolvedId)
        .single();
      if (chatRow) {
        const c = chatRow as any;
        const isBuyer = c.buyer_id === userId;
        const otherName = (isBuyer ? c.seller?.name : c.buyer?.name) ?? 'User';
        const label = c.listings ? `${c.listings.year} ${c.listings.make} ${c.listings.model}` : null;
        setMeta({
          id: c.id,
          otherName,
          otherInit: (otherName[0] ?? 'U').toUpperCase(),
          listingLabel: label,
          listingHue: c.listings?.hue ?? 30,
          listingPrice: c.listings?.price_eur ?? null,
          listingCity: c.listings?.city ?? null,
        });
      }
      const msgs = await fetchMessages(resolvedId);
      setMessages(msgs);
    } finally {
      setLoading(false);
    }
  }, [session, userId, chatId, sellerId, listingId]);

  useEffect(() => { init(); }, [init]);

  // Subscribe to new messages in realtime
  useEffect(() => {
    if (!meta?.id) return;
    const unsub = subscribeToMessages(meta.id, (m) => {
      setMessages((cur) => (cur.find((c) => c.id === m.id) ? cur : [...cur, m]));
    });
    return unsub;
  }, [meta?.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length]);

  const onSend = async () => {
    const body = draft.trim();
    if (!body || !meta || !userId) return;
    setSending(true);
    setDraft('');
    try {
      const m = await sendMessage(meta.id, userId, body);
      setMessages((cur) => (cur.find((c) => c.id === m.id) ? cur : [...cur, m]));
    } finally {
      setSending(false);
    }
  };

  if (!session) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center', padding: 20 }]}>
        <Icon name="chat" color={T.muted} size={28} />
        <Text style={styles.emptyTitle}>Sign in to chat</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={T.gold} />
      </View>
    );
  }

  if (!meta) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center', padding: 20 }]}>
        <Icon name="chat" color={T.muted} size={28} />
        <Text style={styles.emptyTitle}>Chat not found</Text>
        <Text style={styles.emptySub}>Open a listing and tap "Chat" to start a conversation.</Text>
      </View>
    );
  }

  const [from] = hueGradient(meta.listingHue);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => nav.goBack()} hitSlop={10}>
            <Icon name="back" color={T.ink} size={22} />
          </Pressable>
          <View style={[styles.avatar, { backgroundColor: from }]}>
            <Text style={styles.avatarText}>{meta.otherInit}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{meta.otherName}</Text>
            <Text style={styles.status}>● Online · usually replies in 10m</Text>
          </View>
          <Icon name="phone" color={T.ink} size={20} />
          <View style={{ width: 8 }} />
          <Icon name="dots" color={T.ink} size={20} />
        </View>
        {meta.listingLabel && (
          <View style={styles.pinned}>
            <View style={[styles.pinnedPhoto, { backgroundColor: from }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pinnedTitle}>{meta.listingLabel}</Text>
              <Text style={styles.pinnedPrice}>
                {meta.listingPrice ? `€ ${meta.listingPrice.toLocaleString()}` : 'No price'}
                {meta.listingCity ? ` · ${meta.listingCity}` : ''}
              </Text>
            </View>
            <Icon name="chevR" color={T.muted} size={14} />
          </View>
        )}
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.messages}>
        {messages.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Say hi</Text>
            <Text style={styles.emptySub}>Be polite and avoid sharing bank details here.</Text>
          </View>
        ) : (
          messages.map((m) => <Bubble key={m.id} message={m} me={m.sender_id === userId} />)
        )}
      </ScrollView>

      <View style={[styles.composerWrap, { paddingBottom: 8 + insets.bottom }]}>
        <View style={styles.composerRow}>
          <Icon name="plus" color={T.ink} size={20} strokeWidth={2.2} />
          <View style={styles.input}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Message…"
              placeholderTextColor={T.muted}
              style={styles.inputText}
              multiline
            />
            <Icon name="attach" color={T.muted} size={16} />
          </View>
          <Pressable onPress={onSend} disabled={sending || !draft.trim()} style={styles.sendBtn}>
            {sending ? (
              <ActivityIndicator color={T.ink} size="small" />
            ) : (
              <Icon name="send" color={T.ink} size={16} strokeWidth={2.4} />
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ message, me }: { message: Message; me: boolean }) {
  return (
    <View style={[styles.bubble, me ? styles.bubbleMe : styles.bubbleThem]}>
      <Text style={[styles.bubbleText, { color: me ? '#fff' : T.ink }]}>{message.body}</Text>
      <Text
        style={[
          styles.bubbleMeta,
          { color: me ? 'rgba(255,255,255,0.4)' : T.muted, textAlign: me ? 'right' : 'left' },
        ]}
      >
        {formatTime(message.created_at)} {me ? '✓✓' : ''}
      </Text>
    </View>
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
  headerRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: { width: 38, height: 38, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 13, fontWeight: '800', fontFamily: T.font },
  name: { fontSize: 14, fontWeight: '800', color: T.ink, fontFamily: T.font },
  status: { fontSize: 11, color: T.green, fontWeight: '600', fontFamily: T.font },
  pinned: {
    padding: 8,
    marginHorizontal: 12,
    marginBottom: 10,
    marginTop: 4,
    backgroundColor: T.surfaceAlt,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pinnedPhoto: { width: 44, height: 44, borderRadius: 8 },
  pinnedTitle: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  pinnedPrice: { fontSize: 11, color: T.muted, fontFamily: T.mono },
  messages: { padding: 14, gap: 8, flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingTop: 60 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font },
  emptySub: { fontSize: 12, color: T.muted, textAlign: 'center', paddingHorizontal: 30, fontFamily: T.font },
  bubble: { maxWidth: '78%', paddingHorizontal: 12, paddingVertical: 8 },
  bubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: T.ink,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  bubbleText: { fontSize: 13, lineHeight: 18, fontFamily: T.font },
  bubbleMeta: { fontSize: 10, fontFamily: T.mono, marginTop: 4 },
  composerWrap: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingTop: 8,
  },
  composerRow: { paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1,
    minHeight: 38,
    borderRadius: 19,
    backgroundColor: T.surfaceAlt,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    fontSize: 13,
    color: T.ink,
    fontFamily: T.font,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendBtn: { width: 38, height: 38, borderRadius: 99, backgroundColor: T.gold, alignItems: 'center', justifyContent: 'center' },
});
