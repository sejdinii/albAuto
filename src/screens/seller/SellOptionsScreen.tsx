import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Badge } from '@/components/Badge';
import { useSellDraft } from '@/lib/sellFlow';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TOP_FEATURES = [
  'Top of homescreen for 7 days',
  'Highlighted in all search results',
  'Up to 5× more views and chats',
  'Detailed analytics for the campaign',
];

export function SellOptionsScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { draft, set } = useSellDraft();

  return (
    <View style={styles.root}>
      <TopBar title="Choose an ad type" leading="close" variant="white" onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
        <Text style={styles.title}>How visible{'\n'}should it be?</Text>
        <Text style={styles.sub}>You can upgrade anytime from your seller dashboard.</Text>

        <Pressable
          onPress={() => set('tier', 'standard')}
          style={[
            styles.tier,
            { borderColor: draft.tier === 'standard' ? T.gold : T.hairline, borderWidth: 2 },
          ]}
        >
          {draft.tier === 'standard' && (
            <View style={styles.check}>
              <Icon name="check" color={T.ink} size={14} strokeWidth={3} />
            </View>
          )}
          <View style={styles.tierHeader}>
            <Text style={styles.tierTitle}>Standard</Text>
            <Text style={styles.tierPriceGreen}>Free</Text>
          </View>
          <Text style={styles.tierSub}>Active for 60 days, included in search results.</Text>
        </Pressable>

        <Pressable
          onPress={() => set('tier', 'premium')}
          style={[
            styles.tierDark,
            { borderColor: draft.tier === 'premium' ? T.gold : 'transparent', borderWidth: 2 },
          ]}
        >
          <View style={styles.bestBadge}>
            <Text style={styles.bestBadgeText}>BEST CHOICE</Text>
          </View>
          <View style={styles.tierHeader}>
            <Text style={[styles.tierTitle, { color: '#fff' }]}>Top Ad</Text>
            <Text style={styles.tierPriceGold}>€ 490 / 7 days</Text>
          </View>
          <Text style={[styles.tierSub, { color: 'rgba(255,255,255,0.6)' }]}>
            Maximum visibility, higher search rank, highlight badge.
          </Text>
          <View style={{ gap: 8, marginTop: 12 }}>
            {TOP_FEATURES.map((b) => (
              <View key={b} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="check" color={T.gold} size={14} strokeWidth={2.6} />
                <Text style={styles.feature}>{b}</Text>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 12 }}>
            <Badge color={T.gold} fg={T.ink} icon="bolt">Premium</Badge>
          </View>
        </Pressable>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <Button variant="primary" size="md" iconRight="chevR" onPress={() => nav.navigate('SellPublished')}>
          Publish ad
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '800', color: T.ink, letterSpacing: -0.3, fontFamily: T.font },
  sub: { fontSize: 13, color: T.muted, marginTop: 6, fontFamily: T.font },
  tier: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#fff',
    position: 'relative',
  },
  tierDark: {
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: T.ink,
    overflow: 'hidden',
    position: 'relative',
  },
  check: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 24,
    height: 24,
    borderRadius: 99,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  tierTitle: { fontSize: 16, fontWeight: '800', color: T.ink, fontFamily: T.font },
  tierPriceGreen: { fontSize: 13, fontWeight: '700', color: T.green, fontFamily: T.font },
  tierPriceGold: { fontSize: 13, fontWeight: '700', color: T.gold, fontFamily: T.mono },
  tierSub: { fontSize: 12, color: T.body, marginTop: 4, fontFamily: T.font },
  bestBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: T.gold,
    borderBottomLeftRadius: 8,
  },
  bestBadgeText: { color: T.ink, fontSize: 9, fontWeight: '800', letterSpacing: 0.5, fontFamily: T.font },
  feature: { fontSize: 12, color: '#fff', fontFamily: T.font },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
