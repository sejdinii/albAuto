import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/theme/tokens';
import { Icon, IconName } from '@/components/Icon';

type Suggest = { icon: IconName; text: string; sub: string };

const SUGGESTIONS: Suggest[] = [
  { icon: 'search', text: 'BMW M3 Competition', sub: 'Skopje · 14 listings' },
  { icon: 'search', text: 'BMW M3 G80', sub: 'All Balkans · 22 listings' },
  { icon: 'sparkles', text: 'BMW M3 under €80,000', sub: 'Smart suggestion · 8 listings' },
  { icon: 'car', text: 'BMW M4', sub: 'Similar model · 19 listings' },
];

const RECENT = ['Range Rover SVR', 'Tesla Model Y < €50k', 'Skopje 2023+'];

export function SearchScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Pressable onPress={() => nav.goBack()} hitSlop={10}>
          <Icon name="back" color={T.ink} size={22} />
        </Pressable>
        <View style={styles.search}>
          <Icon name="search" color={T.muted} size={18} />
          <Text style={styles.query}>bmw m3</Text>
          <View style={styles.cursor} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <Text style={styles.section}>Suggestions</Text>
        {SUGGESTIONS.map((s, i) => (
          <Pressable key={i} style={styles.row}>
            <Icon name={s.icon} color={s.icon === 'sparkles' ? T.gold : T.muted} size={18} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{s.text}</Text>
              <Text style={styles.rowSub}>{s.sub}</Text>
            </View>
            <Icon name="chevR" color={T.muted} size={14} />
          </Pressable>
        ))}
        <Text style={[styles.section, { marginTop: 16 }]}>Recent</Text>
        {RECENT.map((r, i) => (
          <Pressable key={i} style={styles.row}>
            <Icon name="history" color={T.muted} size={18} />
            <Text style={[styles.rowTitle, { flex: 1, color: T.body }]}>{r}</Text>
            <Icon name="close" color={T.muted} size={14} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  search: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.surfaceAlt,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  query: { fontSize: 14, color: T.ink, fontWeight: '600', fontFamily: T.font },
  cursor: { backgroundColor: T.gold, width: 2, height: 16, marginLeft: -7 },
  section: {
    fontSize: 11,
    color: T.muted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 6,
    fontFamily: T.font,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
  rowTitle: { fontSize: 14, color: T.ink, fontWeight: '600', fontFamily: T.font },
  rowSub: { fontSize: 11, color: T.muted, marginTop: 1, fontFamily: T.font },
});
