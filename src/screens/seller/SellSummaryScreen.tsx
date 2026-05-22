import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { useSellDraft } from '@/lib/sellFlow';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SellSummaryScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { draft } = useSellDraft();

  const cover = draft.photos[0]?.uri;
  const summary: [string, string][] = [
    ['Make & Model', `${draft.make} · ${draft.model}`.trim()],
    ['Trim', draft.trim || '—'],
    ['Year', draft.year || '—'],
    ['Kilometers', draft.km ? `${Number(draft.km).toLocaleString()} km` : '—'],
    ['Body type', draft.body || '—'],
    ['Fuel', draft.fuel || '—'],
    ['Price', draft.price_eur ? `€ ${Number(draft.price_eur).toLocaleString()}` : '—'],
    ['Location', [draft.city, draft.country].filter(Boolean).join(', ') || '—'],
    ['Photos', `${draft.photos.length} photo${draft.photos.length === 1 ? '' : 's'}`],
  ];

  return (
    <View style={styles.root}>
      <TopBar
        title="Summary"
        subtitle="Step 6 of 7 · Review"
        leading="close"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text style={styles.title}>You're almost there!</Text>
        <Text style={styles.sub}>Check everything looks right before publishing.</Text>

        <View style={styles.previewCard}>
          {cover ? (
            <Image source={{ uri: cover }} style={styles.coverImg} />
          ) : (
            <CarPhoto hue={30} height={140} />
          )}
          <View style={{ padding: 12 }}>
            <Text style={styles.previewLabel}>PREVIEW</Text>
            <Text style={styles.previewTitle}>
              {[draft.year, draft.make, draft.model].filter(Boolean).join(' ') || 'Your car'}
            </Text>
            <Text style={styles.previewSub}>
              {[draft.km && `${Number(draft.km).toLocaleString()} km`, draft.body, draft.city].filter(Boolean).join(' · ')}
            </Text>
            <Text style={styles.previewPrice}>
              {draft.price_eur ? `€ ${Number(draft.price_eur).toLocaleString()}` : 'Price not set'}
            </Text>
          </View>
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryHead}>
            <Text style={styles.summaryHeadLabel}>LISTING SUMMARY</Text>
            <Text style={styles.summaryEdit} onPress={() => nav.navigate('SellForm')}>Edit ›</Text>
          </View>
          {summary.map(([k, v], i) => (
            <View
              key={k}
              style={[
                styles.summaryRow,
                { borderBottomWidth: i < summary.length - 1 ? StyleSheet.hairlineWidth : 0 },
              ]}
            >
              <Text style={styles.summaryKey}>{k}</Text>
              <Text style={styles.summaryVal}>{v}</Text>
            </View>
          ))}
        </View>

        {draft.description ? (
          <View style={{ marginTop: 14 }}>
            <Text style={styles.descTitle}>Description</Text>
            <View style={styles.descBox}>
              <Text style={styles.descText}>{draft.description}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.aiHint}>
            <Icon name="sparkles" color={T.goldDark} size={14} />
            <Text style={styles.aiHintText}>No description yet — buyers prefer listings with one.</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <Button variant="primary" size="md" iconRight="chevR" onPress={() => nav.navigate('SellOptions')}>
          Choose ad type
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '800', color: T.ink, letterSpacing: -0.4, fontFamily: T.font },
  sub: { fontSize: 13, color: T.muted, marginTop: 4, fontFamily: T.font },
  previewCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    overflow: 'hidden',
  },
  coverImg: { width: '100%', height: 140 },
  previewLabel: { fontSize: 11, color: T.muted, fontFamily: T.mono },
  previewTitle: { fontSize: 15, fontWeight: '800', color: T.ink, marginTop: 4, fontFamily: T.font },
  previewSub: { fontSize: 12, color: T.body, marginTop: 2, fontFamily: T.font },
  previewPrice: { fontSize: 17, fontWeight: '800', color: T.ink, fontFamily: T.mono, marginTop: 8 },
  summaryBox: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    overflow: 'hidden',
  },
  summaryHead: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: T.surfaceAlt,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
  summaryHeadLabel: { fontSize: 11, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5 },
  summaryEdit: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  summaryRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: T.hairline,
  },
  summaryKey: { fontSize: 12, color: T.muted, fontFamily: T.font },
  summaryVal: { fontSize: 13, fontWeight: '600', color: T.ink, fontFamily: T.font, maxWidth: '60%', textAlign: 'right' },
  descTitle: { fontSize: 13, fontWeight: '800', color: T.ink, marginBottom: 8, fontFamily: T.font },
  descBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    backgroundColor: '#fff',
  },
  descText: { fontSize: 12, color: T.body, lineHeight: 18, fontFamily: T.font },
  aiHint: {
    marginTop: 14,
    padding: 10,
    borderRadius: 10,
    backgroundColor: T.goldTint,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiHintText: { flex: 1, fontSize: 11, color: T.body, fontFamily: T.font },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
