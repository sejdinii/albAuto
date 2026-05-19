import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { Button } from '@/components/Button';
import { Icon, IconName } from '@/components/Icon';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PERMISSIONS: { i: IconName; t: string; s: string }[] = [
  { i: 'eye', t: 'Read your media', s: 'Photos, reels, captions — to build listings.' },
  { i: 'sync', t: 'Receive sync updates', s: 'Auto-mark sold when you delete the post.' },
  { i: 'lock', t: 'No DMs or followers', s: 'We never read messages or your audience data.' },
];

export function SocialPermissionsScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => nav.goBack()}>
            <Icon name="close" color={T.ink} size={22} />
          </Pressable>
          <View style={styles.brandRow}>
            <View style={[styles.brandTile, { backgroundColor: T.instagramMid }]}>
              <Icon name="instagram" color="#fff" size={18} />
            </View>
            <Text style={styles.arrow}>↔</Text>
            <View style={[styles.brandTile, { backgroundColor: T.gold }]}>
              <Icon name="car" color={T.ink} size={18} strokeWidth={2.2} />
            </View>
          </View>
          <View style={{ width: 22 }} />
        </View>
        <Text style={styles.title}>AlbAuto wants to access your Instagram business account</Text>
        <Text style={styles.sub}>
          We'll only read public car posts. You can disconnect anytime in Settings.
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {PERMISSIONS.map((p, i) => (
          <View
            key={p.i}
            style={[
              styles.permRow,
              {
                borderBottomWidth: i < PERMISSIONS.length - 1 ? StyleSheet.hairlineWidth : 0,
              },
            ]}
          >
            <View style={styles.permIcon}>
              <Icon name={p.i} color={T.ink} size={18} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>{p.t}</Text>
              <Text style={styles.permSub}>{p.s}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: 24 + insets.bottom }]}>
        <Button variant="primary" size="lg" onPress={() => nav.navigate('SocialImporting')}>
          Continue as @autobalkan.skopje
        </Button>
        <Button variant="ghost" size="md">Use a different account</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandTile: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: { fontSize: 10, color: T.muted, fontFamily: T.mono },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: T.ink,
    marginTop: 24,
    letterSpacing: -0.4,
    lineHeight: 26,
    fontFamily: T.font,
  },
  sub: { fontSize: 12, color: T.muted, marginTop: 8, lineHeight: 18, fontFamily: T.font },
  permRow: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderBottomColor: T.hairline,
  },
  permIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: T.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permTitle: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  permSub: { fontSize: 12, color: T.muted, marginTop: 3, lineHeight: 17, fontFamily: T.font },
  bottom: { paddingHorizontal: 20, paddingTop: 12, gap: 10 },
});
