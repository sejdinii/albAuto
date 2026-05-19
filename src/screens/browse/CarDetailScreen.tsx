import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { Badge } from '@/components/Badge';
import { CARS } from '@/data/mock';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SPECS: [string, string][] = [
  ['Trim', 'Competition'],
  ['Horsepower', '510 HP'],
  ['Interior', 'Black Merino'],
  ['Exterior', 'Brooklyn Grey'],
  ['Body', 'Sedan'],
  ['Transmission', '8-spd Auto'],
  ['Fuel', 'Petrol'],
  ['Drive', 'M xDrive'],
];

export function CarDetailScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const car = CARS[0];
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 340 }}>
          <CarPhoto hue={car.hue} height={340} dark count="2 / 11" />
          <Pressable
            onPress={() => nav.goBack()}
            style={[styles.iconOverlay, { top: insets.top + 6, left: 16 }]}
          >
            <Icon name="back" color="#fff" size={20} strokeWidth={2.2} />
          </Pressable>
          <View style={[styles.overlayRow, { top: insets.top + 6, right: 16 }]}>
            <View style={styles.iconOverlay}>
              <Icon name="share" color="#fff" size={18} />
            </View>
            <View style={styles.iconOverlay}>
              <Icon name="heart" color="#fff" size={18} />
            </View>
          </View>
          <View style={[styles.premiumBadge, { top: insets.top + 60 }]}>
            <Badge color="#0F0F10" fg={T.gold} icon="bolt">Premium</Badge>
          </View>
        </View>
        <View style={styles.sheet}>
          <View>
            <Text style={styles.crumb}>BMW · M3 · COMPETITION</Text>
            <Text style={styles.title}>2024 · 4,200 km</Text>
          </View>
          <View style={styles.priceBox}>
            <View>
              <Text style={styles.priceLabel}>PRICE</Text>
              <Text style={styles.priceGold}>AED 479,900</Text>
              <Text style={styles.priceEur}>≈ € 121,300 EUR</Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeText}>↓ 10K SINCE MON</Text>
            </View>
          </View>
          <View style={styles.badgesRow}>
            <Badge color={T.greenSoft} fg={T.green} icon="check">Warranty</Badge>
            <Badge color={T.greenSoft} fg={T.green} icon="check">Service contract</Badge>
            <Badge color={T.blueSoft} fg={T.blue} icon="badge">Inspected</Badge>
            <Badge color={T.surfaceAlt} fg={T.body}>GCC Specs</Badge>
          </View>
          <View style={styles.locRow}>
            <Icon name="pin" color={T.muted} size={14} />
            <Text style={styles.locText}>Skopje · North Macedonia</Text>
            <Text style={styles.posted}>Posted 3 days ago</Text>
          </View>
          <Text style={styles.section}>Overview</Text>
          <View style={styles.specGrid}>
            {SPECS.map(([k, v], i) => (
              <View key={k} style={[styles.specCell, { borderRightWidth: i % 2 === 0 ? StyleSheet.hairlineWidth : 0, borderBottomWidth: i < 6 ? StyleSheet.hairlineWidth : 0 }]}>
                <Text style={styles.specKey}>{k}</Text>
                <Text style={styles.specVal}>{v}</Text>
              </View>
            ))}
          </View>
          <View style={styles.seller}>
            <View style={styles.sellerBadge}>
              <Text style={styles.sellerInit}>AM</Text>
              <View style={styles.sellerVerified}>
                <Icon name="verified" color={T.gold} size={16} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sellerName}>AutoBalkan Skopje</Text>
              <Text style={styles.sellerSub}>Verified dealer · 4.9 ★ (218)</Text>
            </View>
            <Text style={styles.sellerView}>View →</Text>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.cta, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <Pressable style={styles.callBtn}>
          <Icon name="phone" color={T.ink} size={16} strokeWidth={2.2} />
          <Text style={styles.callBtnText}>Call</Text>
        </Pressable>
        <Pressable style={styles.waBtn}>
          <Icon name="whatsapp" color="#fff" size={16} />
          <Text style={styles.waBtnText}>WhatsApp</Text>
        </Pressable>
        <Pressable onPress={() => nav.navigate('ChatDetail')} style={styles.chatBtn}>
          <Icon name="chat" color={T.gold} size={20} strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  iconOverlay: {
    width: 38,
    height: 38,
    borderRadius: 99,
    backgroundColor: 'rgba(15,15,16,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  overlayRow: { position: 'absolute', flexDirection: 'row', gap: 8 },
  premiumBadge: { position: 'absolute', left: 16 },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -22,
    padding: 20,
  },
  crumb: {
    fontSize: 11,
    color: T.muted,
    fontFamily: T.mono,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: { fontSize: 22, fontWeight: '800', color: T.ink, marginTop: 4, letterSpacing: -0.4, fontFamily: T.font },
  priceBox: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: T.ink,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: { fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: T.mono, letterSpacing: 1 },
  priceGold: { fontSize: 24, fontWeight: '800', color: T.gold, fontFamily: T.mono, letterSpacing: -0.4 },
  priceEur: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: T.mono },
  priceBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, backgroundColor: T.greenSoft },
  priceBadgeText: { color: T.green, fontSize: 10, fontWeight: '800', letterSpacing: 0.4, fontFamily: T.font },
  badgesRow: { flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap' },
  locRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 6 },
  locText: { fontSize: 12, color: T.body, fontFamily: T.font },
  posted: { marginLeft: 'auto', fontSize: 11, color: T.muted, fontFamily: T.font },
  section: { fontSize: 13, fontWeight: '800', color: T.ink, marginTop: 16, marginBottom: 10, fontFamily: T.font },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
  },
  specCell: {
    width: '50%',
    padding: 10,
    borderRightColor: T.hairline,
    borderBottomColor: T.hairline,
    backgroundColor: '#fff',
  },
  specKey: {
    fontSize: 10,
    color: T.muted,
    fontFamily: T.mono,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  specVal: { fontSize: 13, fontWeight: '700', color: T.ink, marginTop: 2, fontFamily: T.font },
  seller: {
    marginTop: 16,
    padding: 12,
    backgroundColor: T.surfaceAlt,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sellerInit: { color: T.gold, fontWeight: '800', fontSize: 14, fontFamily: T.font },
  sellerVerified: { position: 'absolute', bottom: -2, right: -2 },
  sellerName: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  sellerSub: { fontSize: 11, color: T.muted, fontFamily: T.font },
  sellerView: { fontSize: 12, color: T.ink, fontWeight: '700', fontFamily: T.font },
  cta: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  callBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: T.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  callBtnText: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font },
  waBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: T.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  waBtnText: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: T.font },
  chatBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
