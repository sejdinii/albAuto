import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Badge } from '@/components/Badge';
import { CarPhoto } from '@/components/CarPhoto';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Item = {
  make: string;
  status: 'ready' | 'review' | 'duplicate';
  sub: string;
  hue: number;
  conf: number;
  src: string;
};

const ITEMS: Item[] = [
  { make: 'Audi RS6 Avant', status: 'ready', sub: 'Looks great · €123,600', hue: 240, conf: 96, src: 'IG' },
  { make: 'BMW M3 Comp.', status: 'ready', sub: 'Looks great · €121,300', hue: 30, conf: 94, src: 'IG' },
  { make: 'Mercedes G 63', status: 'review', sub: 'Missing price', hue: 340, conf: 71, src: 'FB' },
  { make: 'VW Golf R', status: 'review', sub: 'Mileage uncertain', hue: 280, conf: 65, src: 'IG' },
  { make: 'Range Rover SVR', status: 'duplicate', sub: 'Already published as #ALB-2014', hue: 150, conf: 99, src: 'IG' },
  { make: 'Tesla Model Y', status: 'ready', sub: 'Looks great · €50,000', hue: 0, conf: 92, src: 'IG' },
];

const TABS: [string, number, boolean][] = [
  ['All', 6, true],
  ['Ready', 3, false],
  ['Needs review', 2, false],
  ['Skipped', 1, false],
];

export function SocialImportedScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <TopBar
        title="Imported inventory"
        subtitle="6 of 84 ready · 2 need review"
        variant="white"
        onBack={() => nav.goBack()}
        trailing={<Icon name="sync" color={T.ink} size={20} />}
      />
      <View style={styles.tabRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {TABS.map(([t, n, a]) => (
            <View
              key={t}
              style={[
                styles.tab,
                {
                  backgroundColor: a ? T.ink : '#fff',
                  borderWidth: a ? 0 : StyleSheet.hairlineWidth,
                },
              ]}
            >
              <Text style={[styles.tabText, { color: a ? '#fff' : T.body }]}>{t}</Text>
              <Text style={[styles.tabCount, { color: a ? T.gold : T.muted }]}>{n}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
        {ITEMS.map((it, i) => (
          <View key={i} style={styles.itemCard}>
            <View style={styles.itemPhoto}>
              <CarPhoto hue={it.hue} height={60} />
              <View style={styles.srcBadge}>
                <Text style={styles.srcBadgeText}>{it.src}</Text>
              </View>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.itemMake}>{it.make}</Text>
              <Text style={styles.itemSub}>{it.sub}</Text>
              <View style={styles.itemMetaRow}>
                {it.status === 'ready' && <Badge color={T.greenSoft} fg={T.green} size="sm">Ready</Badge>}
                {it.status === 'review' && <Badge color={T.redSoft} fg={T.red} size="sm">Needs review</Badge>}
                {it.status === 'duplicate' && <Badge color={T.surfaceAlt} fg={T.body} size="sm">Duplicate</Badge>}
                <Text style={styles.aiConf}>AI {it.conf}%</Text>
              </View>
            </View>
            <View style={{ gap: 6, alignItems: 'flex-end' }}>
              {it.status === 'ready' && (
                <Pressable style={styles.itemActionGold}>
                  <Text style={styles.itemActionGoldText}>Publish</Text>
                </Pressable>
              )}
              {it.status === 'review' && (
                <Pressable onPress={() => nav.navigate('SocialReview')} style={styles.itemActionDark}>
                  <Text style={styles.itemActionDarkText}>Review</Text>
                </Pressable>
              )}
              {it.status === 'duplicate' && (
                <Pressable style={styles.itemActionGhost}>
                  <Text style={styles.itemActionGhostText}>Merge</Text>
                </Pressable>
              )}
              <Icon name="dots" color={T.muted} size={16} />
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <Button variant="primary" size="md" icon="bolt" onPress={() => nav.navigate('DealerDash')}>
          Publish all ready · 3
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  tabRow: { paddingHorizontal: 16, paddingVertical: 8 },
  tab: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 99,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tabText: { fontSize: 12, fontWeight: '700', fontFamily: T.font },
  tabCount: { fontSize: 10, fontFamily: T.mono },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemPhoto: { width: 60, height: 60, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  srcBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  srcBadgeText: { color: '#fff', fontSize: 8, fontWeight: '700', fontFamily: T.mono },
  itemMake: { fontSize: 13, fontWeight: '700', color: T.ink, lineHeight: 16, fontFamily: T.font },
  itemSub: { fontSize: 11, color: T.muted, marginTop: 2, fontFamily: T.font },
  itemMetaRow: { flexDirection: 'row', gap: 5, marginTop: 6, alignItems: 'center' },
  aiConf: { fontSize: 10, color: T.muted, fontFamily: T.mono },
  itemActionGold: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: T.gold,
  },
  itemActionGoldText: { fontSize: 11, fontWeight: '700', color: T.ink, fontFamily: T.font },
  itemActionDark: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: T.ink,
  },
  itemActionDarkText: { fontSize: 11, fontWeight: '700', color: '#fff', fontFamily: T.font },
  itemActionGhost: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
  },
  itemActionGhostText: { fontSize: 11, fontWeight: '700', color: T.body, fontFamily: T.font },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
