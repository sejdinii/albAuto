import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon, IconName } from '@/components/Icon';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Activity = { t: string; s: string; state: 'ok' | 'skip' | 'sync' };
const ACTIVITY: Activity[] = [
  { t: 'Parsed caption — found "BMW M3 Competition"', s: '2s ago', state: 'ok' },
  { t: 'Extracted price "120 000 €" from photo', s: '4s ago', state: 'ok' },
  { t: 'Detected mileage from EXIF + image OCR', s: '6s ago', state: 'ok' },
  { t: 'Skipped — post has no car detected', s: '12s ago', state: 'skip' },
  { t: 'Connected Instagram @autobalkan.skopje', s: '1m ago', state: 'sync' },
];

function iconFor(s: Activity['state']): IconName {
  return s === 'ok' ? 'check' : s === 'skip' ? 'close' : 'sync';
}

function colorFor(s: Activity['state']): string {
  return s === 'ok' ? T.green : s === 'skip' ? T.muted : T.gold;
}

export function SocialImportingScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <TopBar
        title="Importing posts"
        subtitle="Hang tight, this takes a sec"
        leading="close"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={styles.progressBox}>
          <View style={styles.progressHead}>
            <Text style={styles.progressLabel}>PROGRESS</Text>
            <Text style={styles.progressCount}>34 / 84</Text>
          </View>
          <View style={styles.bar}>
            <View style={styles.barFill} />
          </View>
          <Text style={styles.statusText}>
            <Text style={{ color: T.gold }}>● </Text>
            Analyzing photo of 2023 Audi RS6 Avant…
          </Text>
        </View>
        <Text style={styles.section}>Activity</Text>
        <View style={{ gap: 8 }}>
          {ACTIVITY.map((a, i) => (
            <View key={i} style={styles.activityRow}>
              <Icon name={iconFor(a.state)} color={colorFor(a.state)} size={16} strokeWidth={2.4} />
              <Text style={styles.activityText}>{a.t}</Text>
              <Text style={styles.activityTime}>{a.s}</Text>
            </View>
          ))}
        </View>
        <View style={styles.hint}>
          <Icon name="sparkles" color={T.goldDark} size={18} />
          <Text style={styles.hintText}>
            <Text style={styles.hintBold}>You can leave this screen.</Text> We'll keep syncing in the background.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }]}>
        <Button variant="ghost" size="md" onPress={() => nav.navigate('SocialImported')}>
          Run in background
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  progressBox: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: T.ink,
  },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  progressLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: T.mono, letterSpacing: 0.5 },
  progressCount: { fontSize: 11, color: T.gold, fontFamily: T.mono, fontWeight: '700' },
  bar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 99,
    marginTop: 10,
    overflow: 'hidden',
  },
  barFill: { width: '40%', height: '100%', backgroundColor: T.gold, borderRadius: 99 },
  statusText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 10, fontFamily: T.mono },
  section: {
    marginTop: 16,
    fontSize: 11,
    color: T.muted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    fontFamily: T.font,
  },
  activityRow: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityText: { flex: 1, fontSize: 12, color: T.body, fontFamily: T.font },
  activityTime: { fontSize: 11, color: T.muted, fontFamily: T.mono },
  hint: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: T.goldTint,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  hintText: { flex: 1, fontSize: 12, color: T.body, fontFamily: T.font },
  hintBold: { fontWeight: '700', color: T.ink },
  bottom: { paddingHorizontal: 16, paddingTop: 12 },
});
