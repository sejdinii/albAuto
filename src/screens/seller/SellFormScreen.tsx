import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Field, SelectField } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SellFormScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <TopBar
        title="Place an ad"
        subtitle="Step 3 of 5 · Details"
        leading="close"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={styles.progress}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.crumb}>MOTORS  ›  CARS  ›  TIRANA, AL</Text>
        <Text style={styles.title}>Tell us about your car</Text>
        <View style={{ marginTop: 18, gap: 12 }}>
          <Field label="City *" value="Tirana" icon="pin" rightLabel="Edit" />
          <SelectField label="Make & Model *" value="BMW · M3" />
          <SelectField label="Trim *" value="Competition" />
          <SelectField label="Regional specs *" value="EU Specs" />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <SelectField label="Year *" value="2024" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Mileage (km) *" value="4,200" keyboardType="numeric" />
            </View>
          </View>
          <SelectField label="Body type" value="Sedan" />
          <View style={styles.callout}>
            <Icon name="sparkles" color={T.goldDark} size={18} />
            <View style={{ flex: 1 }}>
              <Text style={styles.calloutText}>
                <Text style={styles.calloutBold}>Got an Instagram post? </Text>
                Paste a link and we'll fill the form for you.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <View style={{ flex: 1 }}>
          <Button variant="outline" size="md">Save draft</Button>
        </View>
        <View style={{ flex: 1.6 }}>
          <Button variant="primary" size="md" iconRight="chevR" onPress={() => nav.navigate('SellPhotos')}>
            Next: photos
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  progress: {
    height: 4,
    backgroundColor: T.hairline,
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: { width: '60%', height: '100%', backgroundColor: T.gold },
  crumb: {
    fontSize: 11,
    color: T.muted,
    fontFamily: T.mono,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  title: { fontSize: 22, fontWeight: '800', color: T.ink, marginTop: 8, letterSpacing: -0.4, fontFamily: T.font },
  callout: {
    marginTop: 4,
    padding: 12,
    backgroundColor: T.goldTint,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
  },
  calloutText: { flex: 1, fontSize: 12, color: T.body, lineHeight: 17, fontFamily: T.font },
  calloutBold: { fontWeight: '700', color: T.ink },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
});
