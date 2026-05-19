import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { CarPhoto } from '@/components/CarPhoto';

export function FinancingScreen() {
  const nav = useNavigation();
  return (
    <View style={styles.root}>
      <TopBar
        title="Financing"
        subtitle="Estimate your monthly payment"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={styles.summary}>
          <View style={styles.summaryPhoto}>
            <CarPhoto hue={30} height={50} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>BMW M3 Competition</Text>
            <Text style={styles.summarySub}>2024 · 4,200 km</Text>
            <Text style={styles.summaryPrice}>€ 121,300</Text>
          </View>
        </View>

        <View style={styles.bigBox}>
          <Text style={styles.bigLabel}>Estimated monthly</Text>
          <Text style={styles.bigNumber}>€ 1,847</Text>
          <Text style={styles.bigSub}>60 months · 6.4% APR · €24,260 down</Text>
          <View style={styles.bigGrid}>
            {[['Principal', '€97,040'], ['Interest', '€13,580'], ['Total', '€110,620']].map(([k, v]) => (
              <View key={k}>
                <Text style={styles.bigKey}>{k.toUpperCase()}</Text>
                <Text style={styles.bigVal}>{v}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 18, gap: 18 }}>
          <Slider label="Down payment" value="€ 24,260" caption="20% of car price" pct={20} />
          <Slider label="Loan term" value="60 months" caption="5 years" pct={60} />
          <Slider label="Interest rate" value="6.4% APR" caption="Tap to apply for pre-approval" pct={32} />
        </View>
        <View style={{ marginTop: 18 }}>
          <Button variant="primary" size="md" iconRight="chevR">Get pre-approved · 60s</Button>
        </View>
        <Text style={styles.fine}>
          Estimates only. Actual rates from partner banks: NLB, ProCredit, OTP.
        </Text>
      </ScrollView>
    </View>
  );
}

function Slider({ label, value, caption, pct }: { label: string; value: string; caption: string; pct: number }) {
  return (
    <View>
      <View style={styles.sliderHead}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{value}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
        <View style={[styles.knob, { left: `${pct}%`, marginLeft: -10 }, shadow.elev]} />
      </View>
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  summary: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryPhoto: { width: 60, height: 50, borderRadius: 10, overflow: 'hidden' },
  summaryTitle: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.font },
  summarySub: { fontSize: 11, color: T.muted, fontFamily: T.font },
  summaryPrice: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.mono, marginTop: 4 },
  bigBox: {
    marginTop: 16,
    padding: 18,
    backgroundColor: T.ink,
    borderRadius: 18,
  },
  bigLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono, letterSpacing: 1, textTransform: 'uppercase' },
  bigNumber: { fontSize: 40, fontWeight: '800', color: T.gold, fontFamily: T.mono, letterSpacing: -1.5, marginTop: 4 },
  bigSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 6, fontFamily: T.font },
  bigGrid: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between' },
  bigKey: { fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono, letterSpacing: 0.5 },
  bigVal: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: T.mono, marginTop: 2 },
  sliderHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  sliderLabel: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  sliderValue: { fontSize: 14, fontWeight: '800', color: T.ink, fontFamily: T.mono },
  track: {
    height: 8,
    marginTop: 8,
    backgroundColor: T.hairline,
    borderRadius: 99,
    position: 'relative',
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: T.gold, borderRadius: 99 },
  knob: {
    position: 'absolute',
    top: -6,
    width: 20,
    height: 20,
    borderRadius: 99,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: T.gold,
  },
  caption: { fontSize: 11, color: T.muted, marginTop: 8, fontFamily: T.font },
  fine: { fontSize: 10, color: T.muted, marginTop: 10, textAlign: 'center', lineHeight: 14, fontFamily: T.font },
});
