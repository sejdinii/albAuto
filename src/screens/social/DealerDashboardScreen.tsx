import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/theme/tokens';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { CARS } from '@/data/mock';

export function DealerDashboardScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerRow}>
          <View style={styles.dealerAvatar}>
            <Text style={styles.dealerAvatarText}>AB</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.dealerName}>AutoBalkan Skopje</Text>
              <Icon name="verified" color={T.gold} size={14} />
            </View>
            <Text style={styles.dealerMeta}>Dealer dashboard · Pro plan</Text>
          </View>
          <Icon name="cog" color={T.body} size={20} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={styles.statsGrid}>
          <StatCard label="Active listings" value="42" delta="+4" color={T.ink} positive />
          <StatCard label="Views this week" value="12,840" delta="+18%" color={T.gold} positive />
          <StatCard label="New chats" value="86" delta="+22" color={T.green} positive />
          <StatCard label="Avg. response" value="14m" delta="-3m" color={T.blue} positive />
        </View>
        <View style={styles.syncCard}>
          <View style={styles.syncHead}>
            <View style={styles.syncTitleRow}>
              <Icon name="sync" color={T.gold} size={16} />
              <Text style={styles.syncTitle}>Social sync</Text>
            </View>
            <Text style={styles.syncLive}>● LIVE</Text>
          </View>
          <Text style={styles.syncSub}>Last synced 4 minutes ago · 2 awaiting review</Text>
          <View style={styles.syncRow}>
            <View style={styles.syncCell}>
              <Text style={styles.syncCellLabel}>INSTAGRAM</Text>
              <Text style={styles.syncCellValue}>@autobalkan.skopje</Text>
            </View>
            <View style={styles.syncCell}>
              <Text style={styles.syncCellLabel}>FACEBOOK</Text>
              <Text style={styles.syncCellValue}>AutoBalkan</Text>
            </View>
          </View>
        </View>
        <View style={styles.chartCard}>
          <View style={styles.chartHead}>
            <Text style={styles.chartTitle}>Views · last 14 days</Text>
            <Text style={styles.chartSub}>Per listing avg</Text>
          </View>
          <Svg viewBox="0 0 320 100" width="100%" height={90} style={{ marginTop: 10 }}>
            <Defs>
              <LinearGradient id="chartg" x1="0" x2="0" y1="0" y2="1">
                <Stop offset="0" stopColor={T.gold} />
                <Stop offset="1" stopColor={T.gold} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Path
              d="M0 80 L20 70 L40 65 L60 50 L80 60 L100 40 L120 45 L140 30 L160 35 L180 25 L200 20 L220 30 L240 15 L260 22 L280 10 L300 18 L320 12 L320 100 L0 100 Z"
              fill="url(#chartg)"
              opacity={0.25}
            />
            <Path
              d="M0 80 L20 70 L40 65 L60 50 L80 60 L100 40 L120 45 L140 30 L160 35 L180 25 L200 20 L220 30 L240 15 L260 22 L280 10 L300 18 L320 12"
              fill="none"
              stroke={T.gold}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          </Svg>
          <View style={styles.chartAxis}>
            <Text style={styles.chartAxisText}>Apr 25</Text>
            <Text style={styles.chartAxisText}>May 2</Text>
            <Text style={styles.chartAxisText}>May 9</Text>
          </View>
        </View>
        <View style={{ marginTop: 14 }}>
          <Text style={styles.topTitle}>Top listings this week</Text>
          {CARS.slice(0, 3).map((c, i) => (
            <Pressable key={c.id} style={styles.topRow}>
              <Text style={styles.topRank}>{i + 1}</Text>
              <View style={styles.topPhoto}>
                <CarPhoto hue={c.hue} height={48} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.topName}>{c.make} {c.model}</Text>
                <Text style={styles.topMeta}>{[1248, 892, 640][i]} views · {[18, 12, 9][i]} chats</Text>
              </View>
              <Text style={styles.topDelta}>+{[42, 28, 12][i]}%</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, delta, color, positive }: { label: string; value: string; delta: string; color: string; positive?: boolean }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statDelta, { color: positive ? T.green : T.red }]}>{delta}</Text>
      <View style={[styles.statBubble, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
    paddingHorizontal: 16,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  dealerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealerAvatarText: { color: T.gold, fontSize: 14, fontWeight: '800', fontFamily: T.font },
  dealerName: { fontSize: 15, fontWeight: '800', color: T.ink, fontFamily: T.font },
  dealerMeta: { fontSize: 11, color: T.muted, fontFamily: T.font },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: {
    width: '48.5%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    overflow: 'hidden',
  },
  statLabel: { fontSize: 10, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5 },
  statValue: { fontSize: 22, fontWeight: '800', color: T.ink, fontFamily: T.mono, letterSpacing: -0.5, marginTop: 4 },
  statDelta: { fontSize: 11, fontWeight: '700', fontFamily: T.mono, marginTop: 2 },
  statBubble: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 99,
    opacity: 0.06,
  },
  syncCard: { marginTop: 14, padding: 14, borderRadius: 14, backgroundColor: T.ink },
  syncHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  syncTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  syncTitle: { fontSize: 13, fontWeight: '800', color: '#fff', fontFamily: T.font },
  syncLive: { fontSize: 11, color: T.gold, fontFamily: T.mono },
  syncSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontFamily: T.font },
  syncRow: { marginTop: 12, flexDirection: 'row', gap: 6 },
  syncCell: { flex: 1, padding: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)' },
  syncCellLabel: { fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono },
  syncCellValue: { fontSize: 13, color: '#fff', fontWeight: '700', marginTop: 2, fontFamily: T.font },
  chartCard: {
    marginTop: 14,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
  },
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  chartTitle: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.font },
  chartSub: { fontSize: 11, color: T.muted, fontFamily: T.font },
  chartAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  chartAxisText: { fontSize: 10, color: T.muted, fontFamily: T.mono },
  topTitle: { fontSize: 13, fontWeight: '800', color: T.ink, marginBottom: 8, fontFamily: T.font },
  topRow: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topRank: { fontSize: 11, fontWeight: '800', color: T.muted, fontFamily: T.mono, width: 14 },
  topPhoto: { width: 48, height: 48, borderRadius: 8, overflow: 'hidden' },
  topName: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  topMeta: { fontSize: 10, color: T.muted, fontFamily: T.mono, marginTop: 1 },
  topDelta: { fontSize: 11, fontFamily: T.mono, color: T.green, fontWeight: '700' },
});
