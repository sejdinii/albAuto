import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SLOTS = [
  { filled: true, primary: true },
  { filled: true },
  { filled: true },
  { filled: true },
  { filled: false },
  { filled: false },
  { filled: false },
  { filled: false },
];

export function SellPhotosScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <TopBar
        title="Photos & video"
        subtitle="Step 4 of 5"
        leading="close"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={styles.progress}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.title}>Add at least 4 photos</Text>
        <Text style={styles.sub}>Listings with 8+ photos get 3× more views.</Text>
        <View style={styles.grid}>
          {SLOTS.map((s, i) => (
            <View key={i} style={[styles.slot, s.filled ? styles.slotFilled : styles.slotEmpty]}>
              {s.filled ? (
                <>
                  <CarPhoto hue={30} height={'100%' as any} dark />
                  {s.primary && (
                    <View style={styles.cover}>
                      <Text style={styles.coverText}>COVER</Text>
                    </View>
                  )}
                  <View style={styles.del}>
                    <Icon name="close" color="#fff" size={11} strokeWidth={2.4} />
                  </View>
                </>
              ) : (
                <View style={styles.empty}>
                  <Icon name="plus" color={T.muted} size={18} />
                  <Text style={styles.emptyText}>{i + 1}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        <View style={styles.videoCard}>
          <View style={styles.videoIcon}>
            <Icon name="play" color={T.gold} size={16} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.videoTitle}>Add a 30s walkaround video</Text>
            <Text style={styles.videoSub}>Optional · 2× more chat responses</Text>
          </View>
          <Icon name="chevR" color={T.muted} size={16} />
        </View>
        <View style={styles.sourceRow}>
          {(['Camera', 'From library', 'IG'] as const).map((label, i) => {
            const icon = i === 0 ? 'camera' : i === 1 ? 'upload' : 'instagram';
            return (
              <View key={label} style={styles.sourceCell}>
                <Icon name={icon} color={T.ink} size={18} />
                <Text style={styles.sourceText}>{label}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <Button variant="primary" size="md" iconRight="chevR" onPress={() => nav.navigate('SellSummary')}>
          Continue · 4 of 8
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  progress: { height: 4, backgroundColor: T.hairline, borderRadius: 99, overflow: 'hidden' },
  progressFill: { width: '80%', height: '100%', backgroundColor: T.gold },
  title: { fontSize: 18, fontWeight: '800', color: T.ink, marginTop: 14, letterSpacing: -0.3, fontFamily: T.font },
  sub: { fontSize: 12, color: T.muted, marginTop: 4, fontFamily: T.font },
  grid: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  slotFilled: { backgroundColor: '#000' },
  slotEmpty: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: T.hairline, backgroundColor: '#fff' },
  cover: {
    position: 'absolute',
    top: 4,
    left: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: T.gold,
  },
  coverText: { color: T.ink, fontSize: 9, fontWeight: '800', fontFamily: T.font },
  del: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 99,
    backgroundColor: 'rgba(15,15,16,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  emptyText: { fontSize: 10, color: T.muted, fontWeight: '600', fontFamily: T.font },
  videoCard: {
    marginTop: 18,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  videoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  videoSub: { fontSize: 11, color: T.muted, marginTop: 2, fontFamily: T.font },
  sourceRow: { marginTop: 12, flexDirection: 'row', gap: 10 },
  sourceCell: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sourceText: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
