import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';

const DAYS = [
  { d: 'Mon', n: 12, slots: 0 },
  { d: 'Tue', n: 13, slots: 3 },
  { d: 'Wed', n: 14, slots: 5, sel: true },
  { d: 'Thu', n: 15, slots: 2 },
  { d: 'Fri', n: 16, slots: 4 },
  { d: 'Sat', n: 17, slots: 6 },
  { d: 'Sun', n: 18, slots: 1 },
];

const TIMES = [
  { t: '09:30', avail: true },
  { t: '10:00', avail: false },
  { t: '10:30', avail: true },
  { t: '11:00', avail: true, sel: true },
  { t: '11:30', avail: false },
  { t: '14:00', avail: true },
  { t: '14:30', avail: true },
  { t: '15:00', avail: false },
];

export function AppointmentScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <TopBar
        title="Book a viewing"
        subtitle="BMW M3 Competition"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        <View style={styles.listingCard}>
          <View style={styles.listingPhoto}>
            <CarPhoto hue={30} height={50} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listingTitle}>BMW M3 Competition</Text>
            <View style={styles.listingMeta}>
              <Icon name="pin" size={11} color={T.muted} />
              <Text style={styles.listingMetaText}>AutoBalkan Skopje</Text>
            </View>
          </View>
          <Icon name="verified" color={T.gold} size={18} />
        </View>

        <View style={{ marginTop: 18 }}>
          <View style={styles.monthRow}>
            <Text style={styles.month}>May 2026</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={styles.monthNav}>
                <Icon name="back" color={T.ink} size={14} />
              </View>
              <View style={styles.monthNav}>
                <Icon name="chevR" color={T.ink} size={14} />
              </View>
            </View>
          </View>
          <View style={styles.daysGrid}>
            {DAYS.map((d, i) => (
              <View
                key={i}
                style={[
                  styles.dayCell,
                  {
                    backgroundColor: d.sel ? T.ink : '#fff',
                    borderWidth: d.sel ? 0 : StyleSheet.hairlineWidth,
                    opacity: d.slots === 0 ? 0.4 : 1,
                  },
                ]}
              >
                <Text style={[styles.dayLabel, { color: d.sel ? 'rgba(255,255,255,0.6)' : T.muted }]}>
                  {d.d.toUpperCase()}
                </Text>
                <Text style={[styles.dayNum, { color: d.sel ? T.gold : T.ink }]}>{d.n}</Text>
                <Text style={[styles.daySlots, { color: d.sel ? 'rgba(255,255,255,0.5)' : T.muted }]}>
                  {d.slots > 0 ? `${d.slots} free` : '—'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={styles.section}>Wed, May 14</Text>
          <View style={styles.timesGrid}>
            {TIMES.map((t, i) => (
              <View
                key={i}
                style={[
                  styles.timeCell,
                  {
                    backgroundColor: t.sel ? T.gold : '#fff',
                    borderWidth: t.sel ? 0 : StyleSheet.hairlineWidth,
                    opacity: t.avail ? 1 : 0.5,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.timeText,
                    {
                      fontWeight: t.sel ? '800' : '600',
                      textDecorationLine: t.avail ? 'none' : 'line-through',
                      color: t.avail ? T.ink : T.muted,
                    },
                  ]}
                >
                  {t.t}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={styles.section}>Type of viewing</Text>
          <View style={styles.typesGrid}>
            <View style={[styles.typeCell, { backgroundColor: T.ink }]}>
              <Icon name="car" color={T.gold} size={20} />
              <Text style={[styles.typeTitle, { color: '#fff' }]}>Test drive</Text>
              <Text style={[styles.typeSub, { color: 'rgba(255,255,255,0.6)' }]}>30–45 min</Text>
            </View>
            <View style={[styles.typeCell, { backgroundColor: '#fff', borderWidth: StyleSheet.hairlineWidth }]}>
              <Icon name="eye" color={T.body} size={20} />
              <Text style={[styles.typeTitle, { color: T.ink }]}>Inspection only</Text>
              <Text style={[styles.typeSub, { color: T.muted }]}>15–20 min</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <View>
          <Text style={styles.bottomLabel}>WED · 11:00</Text>
          <Text style={styles.bottomTitle}>Test drive · 30 min</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Button variant="primary" size="md">Confirm</Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  listingCard: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listingPhoto: { width: 50, height: 50, borderRadius: 10, overflow: 'hidden' },
  listingTitle: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.font },
  listingMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  listingMetaText: { fontSize: 11, color: T.muted, fontFamily: T.font },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  month: { fontSize: 14, fontWeight: '800', color: T.ink, fontFamily: T.font },
  monthNav: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysGrid: { flexDirection: 'row', gap: 6 },
  dayCell: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: T.hairline,
  },
  dayLabel: { fontSize: 9, fontFamily: T.mono, fontWeight: '700', letterSpacing: 0.5 },
  dayNum: { fontSize: 14, fontWeight: '800', fontFamily: T.mono, marginTop: 2 },
  daySlots: { fontSize: 8, fontFamily: T.mono, marginTop: 1 },
  section: { fontSize: 14, fontWeight: '800', color: T.ink, marginBottom: 10, fontFamily: T.font },
  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  timeCell: {
    width: '23.5%',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: T.hairline,
  },
  timeText: { fontSize: 12, fontFamily: T.mono },
  typesGrid: { flexDirection: 'row', gap: 8 },
  typeCell: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderColor: T.hairline,
  },
  typeTitle: { fontSize: 13, fontWeight: '800', marginTop: 6, fontFamily: T.font },
  typeSub: { fontSize: 10, marginTop: 2, fontFamily: T.font },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomLabel: { fontSize: 10, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5 },
  bottomTitle: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.font },
});
