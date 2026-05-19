import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon, IconName } from '@/components/Icon';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { connectSocialAccount, fetchSocialAccounts, SocialAccount } from '@/lib/db';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STEPS = [
  { n: 1, t: 'You post a car on Instagram', s: 'Carousel, reel, or single photo with caption.' },
  { n: 2, t: 'AI reads photo + caption', s: 'Detects make, model, year, mileage, price.' },
  { n: 3, t: 'Listing appears for review', s: 'You approve or edit before it goes live.' },
];

export function SocialConnectScreen() {
  const nav = useNavigation<Nav>();
  const { session, dealer, ensureDealer } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState<'instagram' | 'facebook' | null>(null);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const name = session.user.user_metadata?.name ?? session.user.email ?? 'Dealer';
      const d = dealer ?? (await ensureDealer(name));
      const accts = await fetchSocialAccounts(d.id);
      setAccounts(accts);
    } catch (err: any) {
      Alert.alert('Could not load accounts', err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [session, dealer, ensureDealer]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleConnect = async (provider: 'instagram' | 'facebook') => {
    if (!session) {
      Alert.alert('Sign in', 'Sign in to connect a social account.');
      return;
    }
    // Real OAuth comes next; for now we ask for a handle and store it.
    const handle = await prompt(`Enter your ${provider} handle (e.g. @yourdealership)`);
    if (!handle) return;
    setConnecting(provider);
    try {
      const d = dealer ?? (await ensureDealer(session.user.user_metadata?.name ?? 'Dealer'));
      await connectSocialAccount(d.id, provider, handle.startsWith('@') ? handle : '@' + handle);
      await load();
    } catch (err: any) {
      Alert.alert('Connect failed', err?.message ?? String(err));
    } finally {
      setConnecting(null);
    }
  };

  const ig = accounts.find((a) => a.provider === 'instagram');
  const fb = accounts.find((a) => a.provider === 'facebook');

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
        {loading ? (
          <ActivityIndicator color={T.gold} />
        ) : (
          <View style={{ gap: 10 }}>
            <Pressable onPress={() => handleConnect('instagram')} disabled={connecting === 'instagram'}>
              <ProviderCard
                kind="instagram"
                handle={ig?.handle ?? 'Instagram'}
                status={ig ? 'connected' : 'new'}
                busy={connecting === 'instagram'}
              />
            </Pressable>
            <Pressable onPress={() => handleConnect('facebook')} disabled={connecting === 'facebook'}>
              <ProviderCard
                kind="facebook"
                handle={fb?.handle ?? 'Facebook'}
                status={fb ? 'connected' : 'new'}
                busy={connecting === 'facebook'}
              />
            </Pressable>
          </View>
        )}

        {accounts.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Button variant="dark" size="lg" icon="sparkles" onPress={() => nav.navigate('SocialImporting')}>
              Import a post
            </Button>
          </View>
        )}

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
  busy,
}: {
  kind: 'instagram' | 'facebook';
  handle: string;
  status: 'connected' | 'reconnect' | 'new';
  busy?: boolean;
}) {
  const isIG = kind === 'instagram';
  const connected = status === 'connected';
  return (
    <View style={styles.providerCard}>
      <View style={[styles.providerLogo, { backgroundColor: isIG ? T.instagramMid : T.facebook }]}>
        <Icon name={kind as IconName} color="#fff" size={22} strokeWidth={2} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.providerHandle}>{handle}</Text>
        <View style={styles.providerMeta}>
          {connected ? (
            <>
              <View style={[styles.dot, { backgroundColor: T.green }]} />
              <Text style={[styles.providerStatus, { color: T.green }]}>Connected</Text>
            </>
          ) : (
            <Text style={styles.providerStatus}>Tap to connect</Text>
          )}
        </View>
      </View>
      {busy ? (
        <ActivityIndicator color={T.ink} />
      ) : (
        <View
          style={[
            styles.providerBtn,
            { backgroundColor: connected ? T.surfaceAlt : T.ink },
          ]}
        >
          <Text style={[styles.providerBtnText, { color: connected ? T.ink : '#fff' }]}>
            {connected ? 'Manage' : 'Connect'}
          </Text>
        </View>
      )}
    </View>
  );
}

// Tiny cross-platform prompt (Alert.prompt is iOS-only).
function prompt(_msg: string): Promise<string | null> {
  // Until we add a proper input modal, ask via a JS prompt where supported,
  // and return a placeholder otherwise. Replace this with a modal screen later.
  if (typeof globalThis.prompt === 'function') {
    return Promise.resolve(globalThis.prompt(_msg));
  }
  return Promise.resolve('autobalkan.skopje');
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
  providerLogo: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  providerHandle: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  providerMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 99 },
  providerStatus: { fontSize: 11, fontWeight: '700', fontFamily: T.font, color: T.muted },
  providerBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99 },
  providerBtnText: { fontSize: 12, fontWeight: '700', fontFamily: T.font },
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
