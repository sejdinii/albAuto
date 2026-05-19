import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';

const ITEMS = [
  { title: 'BMW M3', sub: 'Skopje · €20k–130k · 2018+', count: 14, freq: 'Daily', new: 3, hue: 30 },
  { title: 'Range Rover Sport', sub: 'All Balkans · Petrol/Hybrid', count: 7, freq: 'Weekly', new: 0, hue: 150 },
  { title: 'EV under €40,000', sub: 'Europe import · 2022+', count: 42, freq: 'Daily', new: 8, hue: 200 },
];

export function SavedSearchesScreen() {
  const nav = useNavigation();
  return (
    <View style={styles.root}>
      <TopBar
        title="Saved searches"
        variant="white"
        onBack={() => nav.goBack()}
        trailing={<Icon name="plus" color={T.ink} size={20} />}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {ITEMS.map((s, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.photo}>
              <CarPhoto hue={s.hue} height={56} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{s.title}</Text>
                {s.new > 0 && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>+{s.new} NEW</Text>
                  </View>
                )}
              </View>
              <Text style={styles.sub}>{s.sub}</Text>
              <Text style={styles.meta}>{s.count} matches · alerts {s.freq}</Text>
            </View>
            <View style={styles.actions}>
              <View style={styles.actionBtn}>
                <Icon name="bell" color={T.ink} size={14} />
              </View>
              <View style={styles.actionBtn}>
                <Icon name="trash" color={T.body} size={14} />
              </View>
            </View>
          </View>
        ))}
        <View style={styles.add}>
          <Icon name="plus" color={T.muted} size={20} />
          <Text style={styles.addTitle}>Create a new alert</Text>
          <Text style={styles.addSub}>Get notified when matching cars are posted</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photo: { width: 56, height: 56, borderRadius: 12, overflow: 'hidden' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 14, fontWeight: '800', color: T.ink, letterSpacing: -0.2, fontFamily: T.font },
  newBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: T.gold },
  newBadgeText: { color: T.ink, fontSize: 9, fontWeight: '800', fontFamily: T.font },
  sub: { fontSize: 11, color: T.muted, marginTop: 2, fontFamily: T.font },
  meta: { fontSize: 11, color: T.body, marginTop: 6, fontFamily: T.mono },
  actions: { gap: 6 },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: T.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: T.hairline,
    alignItems: 'center',
    marginTop: 4,
  },
  addTitle: { fontSize: 12, color: T.body, fontWeight: '600', marginTop: 4, fontFamily: T.font },
  addSub: { fontSize: 11, color: T.muted, marginTop: 2, fontFamily: T.font },
});
