import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SocialReviewScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <TopBar
        title="Review listing"
        subtitle="3 of 6 to review"
        variant="white"
        onBack={() => nav.goBack()}
        trailing={<Icon name="close" color={T.ink} size={20} />}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
        <View style={styles.source}>
          <View style={styles.sourcePhoto}>
            <CarPhoto hue={280} height={70} dark />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={styles.sourceHead}>
              <Icon name="instagram" color={T.ink} size={12} />
              <Text style={styles.sourceHandle}>@autobalkan.skopje</Text>
              <Text style={styles.sourceTime}>· 2d ago</Text>
            </View>
            <Text style={styles.sourceCaption} numberOfLines={2}>
              "Golf R 2024, full pack, daddy car. Garage kept 🔥 DM for price #vw #golfr"
            </Text>
          </View>
        </View>
        <Text style={styles.section}>Auto-filled · review and edit</Text>
        <View style={{ gap: 10 }}>
          <AIField label="Make & Model" value="VW · Golf R" conf={98} />
          <AIField label="Year" value="2024" conf={91} />
          <AIField label="Trim" value="Performance Pack" conf={84} />
          <AIField label="Price" value="" error="Couldn't read price from caption" suggest="€ 38,000 — based on 12 similar listings" />
          <AIField label="Mileage (km)" value="8,600" conf={62} warning="Low confidence — please verify" />
          <AIField label="City" value="Skopje, MK" conf={99} />
        </View>
        <View style={styles.aiHint}>
          <Icon name="sparkles" color={T.goldDark} size={18} />
          <Text style={styles.aiHintText}>
            <Text style={styles.aiHintBold}>AI-suggested description.</Text> Tap to use or rewrite from your caption.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <View style={{ flex: 1 }}>
          <Button variant="outline" size="md" onPress={() => nav.goBack()}>Skip</Button>
        </View>
        <View style={{ flex: 1.6 }}>
          <Button variant="primary" size="md" iconRight="chevR" onPress={() => nav.goBack()}>
            Approve & next
          </Button>
        </View>
      </View>
    </View>
  );
}

function AIField({
  label,
  value,
  conf,
  error,
  warning,
  suggest,
}: {
  label: string;
  value: string;
  conf?: number;
  error?: string;
  warning?: string;
  suggest?: string;
}) {
  return (
    <View>
      <View style={styles.aiHead}>
        <Text style={styles.aiLabel}>{label}</Text>
        {conf && (
          <Text style={[styles.aiConf, { color: conf > 80 ? T.green : T.gold }]}>AI {conf}%</Text>
        )}
      </View>
      <View
        style={[
          styles.aiBox,
          { borderColor: error ? T.red : warning ? T.gold : T.hairline },
        ]}
      >
        {!value && <Icon name="sparkles" color={T.gold} size={14} />}
        <Text style={[styles.aiValue, { color: value ? T.ink : T.muted }]}>{value || 'Not detected'}</Text>
        {(error || warning) && (
          <Icon name="questionmark" color={error ? T.red : T.gold} size={16} />
        )}
      </View>
      {error && <Text style={styles.aiError}>{error}</Text>}
      {suggest && (
        <View style={styles.aiSuggest}>
          <Icon name="sparkles" color={T.goldDark} size={11} />
          <Text style={styles.aiSuggestText}>{suggest}</Text>
          <Text style={styles.aiSuggestUse}>Use</Text>
        </View>
      )}
      {warning && <Text style={styles.aiWarn}>{warning}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  source: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    marginBottom: 14,
  },
  sourcePhoto: { width: 70, height: 70, borderRadius: 10, overflow: 'hidden' },
  sourceHead: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sourceHandle: { fontSize: 11, fontWeight: '700', color: T.ink, fontFamily: T.font },
  sourceTime: { fontSize: 10, color: T.muted, fontFamily: T.mono },
  sourceCaption: { fontSize: 12, color: T.body, marginTop: 4, lineHeight: 17, fontFamily: T.font },
  section: {
    fontSize: 11,
    color: T.muted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: T.font,
  },
  aiHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  aiLabel: {
    fontSize: 11,
    color: T.body,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    fontFamily: T.font,
  },
  aiConf: { fontSize: 10, fontFamily: T.mono, fontWeight: '700' },
  aiBox: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiValue: { flex: 1, fontSize: 14, fontWeight: '600', fontFamily: T.font },
  aiError: { fontSize: 10, color: T.red, marginTop: 4, fontWeight: '600', fontFamily: T.font },
  aiWarn: { fontSize: 10, color: T.goldDark, marginTop: 4, fontWeight: '600', fontFamily: T.font },
  aiSuggest: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: T.surfaceAlt,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiSuggestText: { flex: 1, fontSize: 11, color: T.body, fontFamily: T.font },
  aiSuggestUse: { color: T.ink, fontWeight: '700', fontSize: 11, fontFamily: T.font },
  aiHint: {
    marginTop: 14,
    padding: 12,
    backgroundColor: T.goldTint,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
  },
  aiHintText: { flex: 1, fontSize: 12, color: T.body, lineHeight: 17, fontFamily: T.font },
  aiHintBold: { fontWeight: '700', color: T.ink },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
});
