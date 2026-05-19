import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { useAuth } from '@/lib/auth';
import { createAppointment, fetchAppointmentsForBuyer, fetchListingDetail } from '@/lib/db';
import { hasSupabaseConfig } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'Appointment'>;

const TIMES = ['09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

export function AppointmentScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const insets = useSafeAreaInsets();
  const { session, userId } = useAuth();
  const [listing, setListing] = useState<{ id: string; make: string; model: string; year: number; city: string | null; hue: number } | null>(null);
  const [days, setDays] = useState(() => buildDays(new Date()));
  const [dayIdx, setDayIdx] = useState(2);
  const [time, setTime] = useState('11:00');
  const [kind, setKind] = useState<'test_drive' | 'inspection'>('test_drive');
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const listingId = route.params?.listingId;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (listingId && hasSupabaseConfig) {
        const row = await fetchListingDetail(listingId);
        setListing({
          id: row.id,
          make: row.make,
          model: row.model,
          year: row.year,
          city: row.city,
          hue: row.hue ?? 30,
        });
      } else {
        setListing(null);
      }
      if (userId && hasSupabaseConfig) {
        const rows = await fetchAppointmentsForBuyer(userId);
        setMine(rows);
      }
    } finally {
      setLoading(false);
    }
  }, [listingId, userId]);

  useEffect(() => { load(); }, [load]);

  const onConfirm = async () => {
    if (!session) {
      Alert.alert('Sign in', 'Sign in to book a viewing.');
      return;
    }
    if (!listing) {
      Alert.alert('Pick a car first', 'Open a listing detail and tap "Book viewing" to schedule.');
      return;
    }
    setBusy(true);
    try {
      const day = days[dayIdx];
      const [h, m] = time.split(':').map(Number);
      const start = new Date(day.date);
      start.setHours(h, m, 0, 0);
      await createAppointment(session.user.id, listing.id, start, kind);
      Alert.alert('Booked', `Your ${kind === 'test_drive' ? 'test drive' : 'inspection'} is requested for ${formatStart(start)}.`);
      nav.goBack();
    } catch (err: any) {
      Alert.alert('Could not book', err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={T.gold} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TopBar
        title="Book a viewing"
        subtitle={listing ? `${listing.year} ${listing.make} ${listing.model}` : 'No listing selected'}
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        {listing ? (
          <View style={styles.listingCard}>
            <View style={styles.listingPhoto}>
              <CarPhoto hue={listing.hue} height={50} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listingTitle}>{listing.year} {listing.make} {listing.model}</Text>
              <View style={styles.listingMeta}>
                <Icon name="pin" size={11} color={T.muted} />
                <Text style={styles.listingMetaText}>{listing.city ?? 'Location'}</Text>
              </View>
            </View>
            <Icon name="verified" color={T.gold} size={18} />
          </View>
        ) : (
          <View style={styles.noListing}>
            <Icon name="cal" color={T.muted} size={20} />
            <Text style={styles.noListingTitle}>No listing selected</Text>
            <Text style={styles.noListingSub}>
              Open a car detail screen and tap "Book viewing" to schedule against a real listing.
            </Text>
          </View>
        )}

        <View style={{ marginTop: 18 }}>
          <Text style={styles.section}>Pick a day</Text>
          <View style={styles.daysGrid}>
            {days.map((d, i) => {
              const sel = i === dayIdx;
              return (
                <Pressable
                  key={i}
                  onPress={() => setDayIdx(i)}
                  style={[
                    styles.dayCell,
                    {
                      backgroundColor: sel ? T.ink : '#fff',
                      borderWidth: sel ? 0 : StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <Text style={[styles.dayLabel, { color: sel ? 'rgba(255,255,255,0.6)' : T.muted }]}>{d.label}</Text>
                  <Text style={[styles.dayNum, { color: sel ? T.gold : T.ink }]}>{d.num}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={styles.section}>Pick a time</Text>
          <View style={styles.timesGrid}>
            {TIMES.map((t) => {
              const sel = time === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setTime(t)}
                  style={[
                    styles.timeCell,
                    { backgroundColor: sel ? T.gold : '#fff', borderWidth: sel ? 0 : StyleSheet.hairlineWidth },
                  ]}
                >
                  <Text style={[styles.timeText, { fontWeight: sel ? '800' : '600' }]}>{t}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={styles.section}>Type</Text>
          <View style={styles.typesGrid}>
            <Pressable onPress={() => setKind('test_drive')} style={[styles.typeCell, kind === 'test_drive' ? styles.typeCellSel : styles.typeCellOff]}>
              <Icon name="car" color={kind === 'test_drive' ? T.gold : T.body} size={20} />
              <Text style={[styles.typeTitle, { color: kind === 'test_drive' ? '#fff' : T.ink }]}>Test drive</Text>
              <Text style={[styles.typeSub, { color: kind === 'test_drive' ? 'rgba(255,255,255,0.6)' : T.muted }]}>30–45 min</Text>
            </Pressable>
            <Pressable onPress={() => setKind('inspection')} style={[styles.typeCell, kind === 'inspection' ? styles.typeCellSel : styles.typeCellOff]}>
              <Icon name="eye" color={kind === 'inspection' ? T.gold : T.body} size={20} />
              <Text style={[styles.typeTitle, { color: kind === 'inspection' ? '#fff' : T.ink }]}>Inspection only</Text>
              <Text style={[styles.typeSub, { color: kind === 'inspection' ? 'rgba(255,255,255,0.6)' : T.muted }]}>15–20 min</Text>
            </Pressable>
          </View>
        </View>

        {mine.length > 0 && (
          <View style={{ marginTop: 22 }}>
            <Text style={styles.section}>Your upcoming appointments</Text>
            {mine.map((a: any) => (
              <View key={a.id} style={styles.apptRow}>
                <View style={styles.apptIcon}>
                  <Icon name="cal" color={T.goldDark} size={16} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.apptTitle}>{a.listings?.make} {a.listings?.model}</Text>
                  <Text style={styles.apptSub}>{formatStart(new Date(a.start_at))} · {a.kind === 'test_drive' ? 'Test drive' : 'Inspection'}</Text>
                </View>
                <Text style={styles.apptStatus}>{a.status}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <View>
          <Text style={styles.bottomLabel}>{days[dayIdx].full.toUpperCase()} · {time}</Text>
          <Text style={styles.bottomTitle}>{kind === 'test_drive' ? 'Test drive · 30 min' : 'Inspection · 20 min'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Button variant="primary" size="md" onPress={onConfirm} disabled={busy || !listing}>
            {busy ? <ActivityIndicator color={T.ink} /> : 'Confirm'}
          </Button>
        </View>
      </View>
    </View>
  );
}

function buildDays(start: Date) {
  const out: { date: Date; label: string; num: number; full: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push({
      date: d,
      label: d.toLocaleDateString([], { weekday: 'short' }).toUpperCase(),
      num: d.getDate(),
      full: d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
    });
  }
  return out;
}

function formatStart(d: Date) {
  return d.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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
  noListing: {
    padding: 16,
    backgroundColor: T.surfaceAlt,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  noListingTitle: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  noListingSub: { fontSize: 11, color: T.muted, textAlign: 'center', fontFamily: T.font },
  section: { fontSize: 14, fontWeight: '800', color: T.ink, marginBottom: 10, fontFamily: T.font },
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
  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  timeCell: {
    width: '18%',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: T.hairline,
  },
  timeText: { fontSize: 12, fontFamily: T.mono, color: T.ink },
  typesGrid: { flexDirection: 'row', gap: 8 },
  typeCell: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderColor: T.hairline,
  },
  typeCellSel: { backgroundColor: T.ink },
  typeCellOff: { backgroundColor: '#fff', borderWidth: StyleSheet.hairlineWidth },
  typeTitle: { fontSize: 13, fontWeight: '800', marginTop: 6, fontFamily: T.font },
  typeSub: { fontSize: 10, marginTop: 2, fontFamily: T.font },
  apptRow: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  apptIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: T.goldTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apptTitle: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  apptSub: { fontSize: 11, color: T.muted, fontFamily: T.font, marginTop: 2 },
  apptStatus: { fontSize: 10, color: T.muted, fontFamily: T.mono, textTransform: 'uppercase', letterSpacing: 0.5 },
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
