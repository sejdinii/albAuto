import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Badge } from '@/components/Badge';
import { CarPhoto } from '@/components/CarPhoto';
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
  return (
    <View style={styles.root}>
      <TopBar title="Choose an ad type" leading="close" variant="white" onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
        <Text style={styles.title}>How visible{'\n'}should it be?</Text>
        <Text style={styles.sub}>You can upgrade anytime from your seller dashboard.</Text>

        <View style={styles.standard}>
          <View style={styles.check}>
            <Icon name="check" color={T.ink} size={14} strokeWidth={3} />
          </View>
          <View style={styles.tierHeader}>
            <Text style={styles.tierTitle}>Standard</Text>
            <Text style={styles.tierPriceGreen}>Free</Text>
          </View>
          <Text style={styles.tierSub}>Active for 60 days, included in search results.</Text>
        </View>

        <View style={styles.top}>
          <View style={styles.bestBadge}>
            <Text style={styles.bestBadgeText}>BEST CHOICE</Text>
          </View>
          <View style={styles.tierHeader}>
            <Text style={[styles.tierTitle, { color: '#fff' }]}>Top Ad</Text>
            <Text style={styles.tierPriceGold}>€ 49 / 7 days</Text>
          </View>
          <Text style={[styles.tierSub, { color: 'rgba(255,255,255,0.6)' }]}>
            Maximum visibility, higher search rank, highlight badge.
          </Text>
          <View style={styles.mini}>
            <View style={styles.miniPhoto}>
              <CarPhoto hue={30} height={42} />
            </View>
            <View style={{ flex: 1 }}>
              <Badge color={T.gold} fg={T.ink} icon="bolt">Premium</Badge>
              <Text style={styles.miniTitle}>2024 BMW M3 Competition</Text>
              <Text style={styles.miniPrice}>€ 121,300</Text>
            </View>
          </View>
          <View style={{ gap: 8, marginTop: 12 }}>
            {TOP_FEATURES.map((b) => (
              <View key={b} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="check" color={T.gold} size={14} strokeWidth={2.6} />
                <Text style={styles.feature}>{b}</Text>
              </View>
            ))}
          </View>
        </View>
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
  standard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: T.gold,
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
  top: {
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: T.ink,
    overflow: 'hidden',
    position: 'relative',
  },
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
  mini: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  miniPhoto: { width: 56, height: 42, borderRadius: 8, overflow: 'hidden' },
  miniTitle: { fontSize: 11, color: '#fff', fontWeight: '700', marginTop: 4, fontFamily: T.font },
  miniPrice: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono },
  feature: { fontSize: 12, color: '#fff', fontFamily: T.font },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
