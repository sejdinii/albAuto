import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon, IconName } from '@/components/Icon';
import { Badge } from '@/components/Badge';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STEPS = [
  { n: 1, t: 'You post a car on Instagram', s: 'Carousel, reel, or single photo with caption.' },
  { n: 2, t: 'AI reads photo + caption', s: 'Detects make, model, year, mileage, price.' },
  { n: 3, t: 'Listing appears for review', s: 'You approve or edit before it goes live.' },
];

export function SocialConnectScreen() {
  const nav = useNavigation<Nav>();
  return (
    <View style={styles.root}>
      <TopBar
        title="Auto-import"
        variant="white"
        onBack={() => nav.goBack()}
        trailing={<Icon name="questionmark" color={T.ink} size={20} />}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={styles.hero}>
          <View style={{ position: 'relative' }}>
            <Badge color={T.gold} fg={T.ink} icon="sparkles">DEALER</Badge>
            <Text style={styles.heroTitle}>Connect once.{'\n'}Inventory flows in.</Text>
            <Text style={styles.heroSub}>
              We turn your Instagram and Facebook posts into ready-to-publish listings — photos, price, model, the works.
            </Text>
          </View>
        </View>
        <Text style={styles.section}>Connect an account</Text>
        <View style={{ gap: 10 }}>
          <Pressable onPress={() => nav.navigate('SocialPermissions')}>
            <ProviderCard kind="instagram" handle="@autobalkan.skopje" status="connected" posts={84} />
          </Pressable>
          <Pressable onPress={() => nav.navigate('SocialPermissions')}>
            <ProviderCard kind="facebook" handle="AutoBalkan Skopje" status="reconnect" posts={42} />
          </Pressable>
          <View style={styles.addCard}>
            <Icon name="plus" color={T.muted} size={18} />
            <Text style={styles.addText}>Add another business account</Text>
          </View>
        </View>
        <Text style={styles.section}>How it works</Text>
        {STEPS.map((s) => (
          <View key={s.n} style={styles.stepCard}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{s.n}</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>{s.t}</Text>
              <Text style={styles.stepSub}>{s.s}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function ProviderCard({
  kind,
  handle,
  status,
  posts,
}: {
  kind: 'instagram' | 'facebook';
  handle: string;
  status: 'connected' | 'reconnect' | 'new';
  posts: number;
}) {
  const isIG = kind === 'instagram';
  const connected = status === 'connected';
  const reconnect = status === 'reconnect';
  return (
    <View style={styles.providerCard}>
      <View style={[styles.providerLogo, { backgroundColor: isIG ? T.instagramMid : T.facebook }]}>
        <Icon name={kind as IconName} color="#fff" size={22} strokeWidth={2} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.providerHandle}>{handle}</Text>
        <View style={styles.providerMeta}>
          {connected && (
            <>
              <View style={[styles.dot, { backgroundColor: T.green }]} />
              <Text style={[styles.providerStatus, { color: T.green }]}>Synced</Text>
            </>
          )}
          {reconnect && (
            <>
              <View style={[styles.dot, { backgroundColor: T.red }]} />
              <Text style={[styles.providerStatus, { color: T.red }]}>Re-auth needed</Text>
            </>
          )}
          <Text style={styles.providerPosts}>· {posts} posts</Text>
        </View>
      </View>
      <View
        style={[
          styles.providerBtn,
          {
            backgroundColor: reconnect ? T.gold : connected ? T.surfaceAlt : T.ink,
          },
        ]}
      >
        <Text
          style={[
            styles.providerBtnText,
            { color: connected || reconnect ? T.ink : '#fff' },
          ]}
        >
          {connected ? 'Manage' : reconnect ? 'Reconnect' : 'Connect'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  hero: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: T.ink,
    overflow: 'hidden',
    position: 'relative',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginTop: 12,
    letterSpacing: -0.4,
    lineHeight: 26,
    fontFamily: T.font,
  },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8, lineHeight: 17, fontFamily: T.font },
  section: {
    marginTop: 20,
    fontSize: 11,
    color: T.muted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    fontFamily: T.font,
  },
  providerCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerHandle: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  providerMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 99 },
  providerStatus: { fontSize: 11, fontWeight: '700', fontFamily: T.font },
  providerPosts: { fontSize: 11, color: T.muted, fontFamily: T.mono },
  providerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
  },
  providerBtnText: { fontSize: 12, fontWeight: '700', fontFamily: T.font },
  addCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addText: { flex: 1, fontSize: 13, color: T.body, fontWeight: '600', fontFamily: T.font },
  stepCard: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 99,
    backgroundColor: T.goldTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: T.goldDark, fontWeight: '800', fontSize: 13, fontFamily: T.mono },
  stepTitle: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  stepSub: { fontSize: 11, color: T.muted, marginTop: 2, fontFamily: T.font },
});
