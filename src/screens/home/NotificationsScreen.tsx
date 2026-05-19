import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon, IconName } from '@/components/Icon';

type Item = { icon: IconName; color: string; title: string; body: string; time: string };

const ITEMS: Item[] = [
  { icon: 'tag', color: T.green, title: 'Price dropped on BMW M3', body: 'AED 489,900 → 479,900 · saved €2,600', time: 'now' },
  { icon: 'chat', color: T.gold, title: 'Andrej M. sent you an offer', body: '78,000 € for the Range Rover Sport', time: '2m' },
  { icon: 'sparkles', color: T.gold, title: '3 new matches for your saved search', body: 'Audi RS6, mileage < 30 000 km', time: '1h' },
  { icon: 'eye', color: T.blue, title: 'Your ad was viewed 248 times today', body: '2024 Porsche 911 Carrera S', time: '3h' },
  { icon: 'shield', color: T.body, title: 'Verification complete', body: 'You can now post Premium ads', time: 'Yesterday' },
];

const CHIPS = ['All', 'Listings', 'Chats', 'Price drops', 'System'];

export function NotificationsScreen() {
  const nav = useNavigation();
  return (
    <View style={styles.root}>
      <TopBar
        title="Notifications"
        variant="white"
        onBack={() => nav.goBack()}
        trailing={<Text style={styles.markRead}>Mark read</Text>}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.chipRow}>
          {CHIPS.map((c, i) => (
            <View
              key={c}
              style={[
                styles.chip,
                {
                  backgroundColor: i === 0 ? T.ink : 'transparent',
                  borderWidth: i === 0 ? 0 : StyleSheet.hairlineWidth,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: i === 0 ? '#fff' : T.body }]}>{c}</Text>
            </View>
          ))}
        </View>
        {ITEMS.map((it, i) => (
          <Pressable key={i} style={styles.row}>
            <View style={[styles.icon, { backgroundColor: it.color + '20' }]}>
              <Icon name={it.icon} color={it.color} size={18} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{it.title}</Text>
              <Text style={styles.body}>{it.body}</Text>
            </View>
            <Text style={styles.time}>{it.time}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  markRead: { fontSize: 13, color: T.ink, fontWeight: '600', fontFamily: T.font },
  chipRow: { flexDirection: 'row', gap: 8, padding: 16, paddingTop: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderColor: T.hairline },
  chipText: { fontSize: 12, fontWeight: '700', fontFamily: T.font },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
    alignItems: 'flex-start',
  },
  icon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 13, fontWeight: '700', color: T.ink, lineHeight: 17, fontFamily: T.font },
  body: { fontSize: 12, color: T.body, marginTop: 3, lineHeight: 17, fontFamily: T.font },
  time: { fontSize: 11, color: T.muted, fontFamily: T.mono },
});
