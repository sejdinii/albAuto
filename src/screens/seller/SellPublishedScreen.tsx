import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SellPublishedScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: 80 + insets.top, paddingBottom: 24 + insets.bottom }]}>
      <View style={styles.center}>
        <View style={[styles.badge, shadow.goldGlow]}>
          <Icon name="check" color={T.ink} size={42} strokeWidth={3} />
        </View>
        <Text style={styles.title}>Your ad is live!</Text>
        <Text style={styles.sub}>
          We've published it to the Albania marketplace. You'll get a notification when buyers reach out.
        </Text>
        <View style={styles.previewCard}>
          <View style={styles.previewPhoto}>
            <CarPhoto hue={30} height={60} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewTitle}>BMW M3 Competition</Text>
            <Text style={styles.previewSub}>Live · ID #ALB-228714</Text>
            <Text style={styles.previewPrice}>€ 121,300</Text>
          </View>
          <View style={styles.active}>
            <Text style={styles.activeText}>ACTIVE</Text>
          </View>
        </View>
      </View>
      <View style={styles.btns}>
        <Button
          variant="primary"
          size="lg"
          icon="eye"
          onPress={() => {
            nav.navigate('Tabs', { screen: 'HomeTab' });
            nav.navigate('CarDetail');
          }}
        >
          View my listing
        </Button>
        <Button variant="outline" size="lg" icon="bolt" onPress={() => nav.navigate('SellOptions')}>
          Boost for more views
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bg,
    paddingHorizontal: 24,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 99,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: T.ink,
    marginTop: 22,
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: T.font,
  },
  sub: { fontSize: 13, color: T.muted, marginTop: 8, textAlign: 'center', lineHeight: 20, fontFamily: T.font },
  previewCard: {
    marginTop: 24,
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  previewPhoto: { width: 60, height: 60, borderRadius: 10, overflow: 'hidden' },
  previewTitle: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.font },
  previewSub: { fontSize: 11, color: T.muted, fontFamily: T.font },
  previewPrice: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.mono, marginTop: 2 },
  active: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: T.greenSoft },
  activeText: { color: T.green, fontSize: 10, fontWeight: '800', fontFamily: T.font },
  btns: { gap: 10 },
});
