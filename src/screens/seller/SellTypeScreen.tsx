import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, hueGradient } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { useSellDraft } from '@/lib/sellFlow';
import { useAuth } from '@/lib/auth';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SellTypeScreen() {
  const nav = useNavigation<Nav>();
  const { session } = useAuth();
  const { set, reset } = useSellDraft();

  const pick = (marketplace: 'balkans' | 'import') => {
    if (!session) {
      nav.navigate('Welcome');
      return;
    }
    reset();
    set('marketplace', marketplace);
    nav.navigate('SellForm');
  };

  return (
    <View style={styles.root}>
      <TopBar
        title="Place an ad"
        subtitle="Step 1 of 5 · Where"
        leading="close"
        variant="white"
        onBack={() => nav.navigate('Tabs', { screen: 'HomeTab' })}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={styles.title}>Where should we{'\n'}place your ad?</Text>
        <Text style={styles.sub}>Pick the marketplace your car belongs to. You can edit later.</Text>
        {!session && (
          <View style={styles.signInHint}>
            <Icon name="lock" color={T.goldDark} size={14} />
            <Text style={styles.signInHintText}>You'll need to sign in before publishing.</Text>
          </View>
        )}
        <View style={{ gap: 12, marginTop: 22 }}>
          <Pressable onPress={() => pick('balkans')}>
            <BigTypeCard title="Cars within Balkans" sub="For buyers in Macedonia, Albania, Kosovo" hue={30} primary stat="2,872 active sellers" badge="MOST COMMON" />
          </Pressable>
          <Pressable onPress={() => pick('import')}>
            <BigTypeCard title="Cars for Import" sub="Selling from abroad to Balkan buyers" hue={210} stat="610 active sellers" />
          </Pressable>
        </View>
        <Pressable onPress={() => nav.navigate('SocialConnect')} style={styles.dealerCard}>
          <Icon name="sparkles" color={T.gold} size={18} />
          <View style={{ flex: 1 }}>
            <Text style={styles.dealerTitle}>Dealership?</Text>
            <Text style={styles.dealerSub}>
              Connect Instagram or Facebook and we'll auto-create listings from your posts.
            </Text>
            <Text style={styles.dealerCta}>Set up dealer mode →</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function BigTypeCard({
  title,
  sub,
  hue,
  primary,
  stat,
  badge,
}: {
  title: string;
  sub: string;
  hue: number;
  primary?: boolean;
  stat: string;
  badge?: string;
}) {
  const [, to] = hueGradient(hue);
  return (
    <View style={[styles.bigCard, { backgroundColor: primary ? T.ink : '#fff', borderWidth: primary ? 0 : StyleSheet.hairlineWidth }]}>
      <Svg viewBox="0 0 200 100" style={styles.bigCar} width={160} height={80}>
        <Path
          d="M20 70 Q22 55 38 50 L70 42 Q90 36 110 38 L140 42 Q160 46 170 56 L185 60 Q190 62 188 70 L182 78 L168 78 Q166 86 158 86 Q150 86 148 78 L60 78 Q58 86 50 86 Q42 86 40 78 L28 78 Q18 76 20 70 Z"
          fill={primary ? T.gold : to}
        />
      </Svg>
      <View>
        {badge && (
          <View style={styles.bigBadge}>
            <Text style={styles.bigBadgeText}>{badge}</Text>
          </View>
        )}
        <Text style={[styles.bigTitle, { color: primary ? '#fff' : T.ink }]}>{title}</Text>
        <Text style={[styles.bigSub, { color: primary ? 'rgba(255,255,255,0.7)' : T.body }]}>{sub}</Text>
        <Text style={[styles.bigStat, { color: primary ? 'rgba(255,255,255,0.5)' : T.muted }]}>{stat}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '800', color: T.ink, letterSpacing: -0.3, lineHeight: 24, fontFamily: T.font },
  sub: { fontSize: 13, color: T.muted, marginTop: 6, fontFamily: T.font },
  signInHint: {
    marginTop: 12,
    padding: 10,
    backgroundColor: T.goldTint,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signInHintText: { flex: 1, fontSize: 12, color: T.body, fontFamily: T.font },
  bigCard: {
    borderRadius: 18,
    padding: 16,
    minHeight: 120,
    overflow: 'hidden',
    position: 'relative',
    borderColor: T.hairline,
  },
  bigCar: { position: 'absolute', bottom: -8, right: -18, opacity: 0.55 },
  bigBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: T.gold,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bigBadgeText: { color: T.ink, fontSize: 9, fontWeight: '800', letterSpacing: 0.5, fontFamily: T.font },
  bigTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3, fontFamily: T.font },
  bigSub: { fontSize: 12, marginTop: 4, maxWidth: '80%', lineHeight: 17, fontFamily: T.font },
  bigStat: { fontSize: 10, fontFamily: T.mono, letterSpacing: 1, marginTop: 12, textTransform: 'uppercase' },
  dealerCard: {
    marginTop: 18,
    padding: 14,
    backgroundColor: T.surfaceAlt,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 10,
  },
  dealerTitle: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  dealerSub: { fontSize: 11, color: T.body, marginTop: 2, lineHeight: 15, fontFamily: T.font },
  dealerCta: { fontSize: 12, color: T.ink, fontWeight: '700', marginTop: 6, fontFamily: T.font },
});
