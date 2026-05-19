import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';

const DOWN_PAYMENTS = [10, 20, 30, 40];
const TERMS = [36, 48, 60, 72];
const RATES = [4.9, 5.9, 6.4, 7.5, 9.0];

export function FinancingScreen() {
  const nav = useNavigation();
  const carPrice = 121_300;
  const [downPct, setDownPct] = useState(20);
  const [termMonths, setTermMonths] = useState(60);
  const [rate, setRate] = useState(6.4);

  const calc = useMemo(() => {
    const down = (carPrice * downPct) / 100;
    const principal = carPrice - down;
    const r = rate / 100 / 12;
    const monthly = r === 0
      ? principal / termMonths
      : (principal * r) / (1 - Math.pow(1 + r, -termMonths));
    const totalPaid = monthly * termMonths;
    const interest = totalPaid - principal;
    return {
      down: Math.round(down),
      principal: Math.round(principal),
      monthly: Math.round(monthly),
      interest: Math.round(interest),
      total: Math.round(totalPaid + down),
    };
  }, [downPct, termMonths, rate, carPrice]);

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
            <Text style={styles.summaryPrice}>€ {carPrice.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.bigBox}>
          <Text style={styles.bigLabel}>Estimated monthly</Text>
          <Text style={styles.bigNumber}>€ {calc.monthly.toLocaleString()}</Text>
          <Text style={styles.bigSub}>
            {termMonths} months · {rate}% APR · €{calc.down.toLocaleString()} down
          </Text>
          <View style={styles.bigGrid}>
            {[
              ['Principal', `€${calc.principal.toLocaleString()}`],
              ['Interest', `€${calc.interest.toLocaleString()}`],
              ['Total', `€${calc.total.toLocaleString()}`],
            ].map(([k, v]) => (
              <View key={k}>
                <Text style={styles.bigKey}>{k.toUpperCase()}</Text>
                <Text style={styles.bigVal}>{v}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 18, gap: 18 }}>
          <Section label="Down payment" value={`${downPct}% · €${calc.down.toLocaleString()}`}>
            <Chips options={DOWN_PAYMENTS.map((p) => ({ id: p, label: `${p}%` }))} value={downPct} onPick={setDownPct} />
          </Section>
          <Section label="Loan term" value={`${termMonths} months`}>
            <Chips
              options={TERMS.map((t) => ({ id: t, label: `${t}mo` }))}
              value={termMonths}
              onPick={setTermMonths}
            />
          </Section>
          <Section label="Interest rate" value={`${rate}% APR`}>
            <Chips
              options={RATES.map((r) => ({ id: r, label: `${r}%` }))}
              value={rate}
              onPick={setRate}
            />
          </Section>
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

function Section({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <View>
      <View style={styles.head}>
        <Text style={styles.headLabel}>{label}</Text>
        <Text style={styles.headValue}>{value}</Text>
      </View>
      <View style={{ marginTop: 8 }}>{children}</View>
    </View>
  );
}

function Chips<T extends number>({
  options, value, onPick,
}: { options: { id: T; label: string }[]; value: T; onPick: (v: T) => void }) {
  return (
    <View style={styles.chipRow}>
      {options.map((o) => {
        const sel = o.id === value;
        return (
          <Pressable
            key={o.id}
            onPress={() => onPick(o.id)}
            style={[styles.chip, { backgroundColor: sel ? T.gold : T.surfaceAlt }]}
          >
            <Text style={[styles.chipText, { fontWeight: sel ? '700' : '600' }]}>{o.label}</Text>
          </Pressable>
        );
      })}
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
  bigBox: { marginTop: 16, padding: 18, backgroundColor: T.ink, borderRadius: 18 },
  bigLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono, letterSpacing: 1, textTransform: 'uppercase' },
  bigNumber: { fontSize: 40, fontWeight: '800', color: T.gold, fontFamily: T.mono, letterSpacing: -1.5, marginTop: 4 },
  bigSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 6, fontFamily: T.font },
  bigGrid: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between' },
  bigKey: { fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono, letterSpacing: 0.5 },
  bigVal: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: T.mono, marginTop: 2 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  headLabel: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  headValue: { fontSize: 14, fontWeight: '800', color: T.ink, fontFamily: T.mono },
  chipRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99 },
  chipText: { fontSize: 12, color: T.ink, fontFamily: T.font },
  fine: { fontSize: 10, color: T.muted, marginTop: 10, textAlign: 'center', lineHeight: 14, fontFamily: T.font },
});
