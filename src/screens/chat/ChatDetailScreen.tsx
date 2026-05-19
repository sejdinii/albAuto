import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T, hueGradient } from '@/theme/tokens';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';

const QUICK = ['Make an offer', 'Schedule visit', 'Send VIN', 'Verified', 'Location'];

export function ChatDetailScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const [from] = hueGradient(30);
  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => nav.goBack()} hitSlop={10}>
            <Icon name="back" color={T.ink} size={22} />
          </Pressable>
          <View style={[styles.avatar, { backgroundColor: from }]}>
            <Text style={styles.avatarText}>AM</Text>
            <View style={styles.verified}>
              <Icon name="verified" color={T.gold} size={14} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>Andrej M.</Text>
              <Icon name="verified" color={T.gold} size={13} />
            </View>
            <Text style={styles.status}>● Online · usually replies in 10m</Text>
          </View>
          <Icon name="phone" color={T.ink} size={20} />
          <View style={{ width: 8 }} />
          <Icon name="dots" color={T.ink} size={20} />
        </View>
        <View style={styles.pinned}>
          <View style={styles.pinnedPhoto}>
            <CarPhoto hue={30} height={44} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pinnedTitle}>2024 BMW M3 Competition</Text>
            <Text style={styles.pinnedPrice}>€ 121,300 · Skopje</Text>
          </View>
          <Icon name="chevR" color={T.muted} size={14} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.messages}>
        <DateChip text="Today" />
        <Bubble side="them">Hey, is the M3 still available?</Bubble>
        <Bubble side="them">Saw it on your Instagram too.</Bubble>
        <Bubble side="me">Yes! Still here. When would you like to see it?</Bubble>
        <ImageBubble hue={30} />
        <Bubble side="them">Looks great. Would you take 115k?</Bubble>
        <View style={styles.offerCard}>
          <Text style={styles.offerLabel}>● Offer · valid 24h</Text>
          <Text style={styles.offerAmount}>€ 115,000</Text>
          <Text style={styles.offerSub}>5% below your asking price</Text>
          <View style={styles.offerActions}>
            <Pressable style={styles.offerAccept}>
              <Text style={styles.offerAcceptText}>Accept</Text>
            </Pressable>
            <Pressable style={styles.offerCounter}>
              <Text style={styles.offerCounterText}>Counter</Text>
            </Pressable>
            <Pressable style={styles.offerPass}>
              <Text style={styles.offerPassText}>Pass</Text>
            </Pressable>
          </View>
        </View>
        <Bubble side="me">I can do 118k. Test drive tomorrow at 11?</Bubble>
        <TypingBubble />
      </ScrollView>
      <View style={[styles.composerWrap, { paddingBottom: 8 + insets.bottom }]}>
        <View style={styles.composerRow}>
          <Icon name="plus" color={T.ink} size={20} strokeWidth={2.2} />
          <View style={styles.input}>
            <Text style={styles.inputPlaceholder}>Message…</Text>
            <Icon name="attach" color={T.muted} size={16} />
          </View>
          <View style={styles.sendBtn}>
            <Icon name="send" color={T.ink} size={16} strokeWidth={2.4} />
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingHorizontal: 12 }}>
          {QUICK.map((q) => (
            <View key={q} style={styles.quickPill}>
              <Text style={styles.quickText}>{q}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function DateChip({ text }: { text: string }) {
  return (
    <View style={styles.dateChip}>
      <Text style={styles.dateChipText}>{text}</Text>
    </View>
  );
}

function Bubble({ side, children }: { side: 'me' | 'them'; children: React.ReactNode }) {
  const me = side === 'me';
  return (
    <View
      style={[
        styles.bubble,
        me ? styles.bubbleMe : styles.bubbleThem,
      ]}
    >
      <Text style={[styles.bubbleText, { color: me ? '#fff' : T.ink }]}>{children}</Text>
      <Text style={[styles.bubbleMeta, { color: me ? 'rgba(255,255,255,0.4)' : T.muted, textAlign: me ? 'right' : 'left' }]}>
        {me ? '14:28 · ✓✓' : '14:26'}
      </Text>
    </View>
  );
}

function ImageBubble({ hue }: { hue: number }) {
  return (
    <View style={[styles.bubble, styles.bubbleMe, { padding: 4, borderRadius: 14, width: 200 }]}>
      <View style={{ borderRadius: 10, overflow: 'hidden' }}>
        <CarPhoto hue={hue} height={130} radius={10} />
      </View>
      <Text style={styles.imgMeta}>14:28 · ✓✓ read</Text>
    </View>
  );
}

function TypingBubble() {
  return (
    <View style={[styles.bubble, styles.bubbleThem, { paddingHorizontal: 14, paddingVertical: 12 }]}>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.typingDot} />
        ))}
      </View>
    </View>
  );
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
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: { color: '#fff', fontSize: 13, fontWeight: '800', fontFamily: T.font },
  verified: { position: 'absolute', bottom: -1, right: -1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
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
  pinnedPhoto: { width: 44, height: 44, borderRadius: 8, overflow: 'hidden' },
  pinnedTitle: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  pinnedPrice: { fontSize: 11, color: T.muted, fontFamily: T.mono },
  messages: { padding: 14, gap: 8 },
  dateChip: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: T.surfaceAlt,
  },
  dateChipText: { fontSize: 10, color: T.muted, fontFamily: T.mono, fontWeight: '700', letterSpacing: 0.5 },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
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
  imgMeta: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono, paddingHorizontal: 4, paddingTop: 4 },
  typingDot: { width: 6, height: 6, borderRadius: 99, backgroundColor: T.muted, opacity: 0.6 },
  offerCard: {
    alignSelf: 'flex-start',
    maxWidth: '88%',
    padding: 12,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  offerLabel: {
    fontSize: 10,
    color: T.muted,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: T.font,
  },
  offerAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: T.ink,
    fontFamily: T.mono,
    marginTop: 4,
  },
  offerSub: { fontSize: 11, color: T.muted, marginTop: 2, fontFamily: T.font },
  offerActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  offerAccept: {
    flex: 1,
    paddingVertical: 7,
    backgroundColor: T.gold,
    borderRadius: 8,
    alignItems: 'center',
  },
  offerAcceptText: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  offerCounter: {
    flex: 1,
    paddingVertical: 7,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: T.ink,
    alignItems: 'center',
  },
  offerCounterText: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  offerPass: { flex: 0.5, paddingVertical: 7, alignItems: 'center' },
  offerPassText: { fontSize: 12, fontWeight: '700', color: T.body, fontFamily: T.font },
  composerWrap: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingTop: 8,
  },
  composerRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 38,
    borderRadius: 99,
    backgroundColor: T.surfaceAlt,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputPlaceholder: { flex: 1, fontSize: 13, color: T.muted, fontFamily: T.font },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 99,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: T.surfaceAlt,
  },
  quickText: { fontSize: 11, color: T.body, fontWeight: '600', fontFamily: T.font },
});
