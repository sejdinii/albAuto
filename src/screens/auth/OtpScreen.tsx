import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function OtpScreen() {
  const nav = useNavigation<Nav>();
  const digits = ['7', '3', '4', '2', '', ''];
  return (
    <View style={styles.root}>
      <TopBar title="Verify number" leading="back" variant="white" onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Enter the 6-digit code we sent to your phone</Text>
        <Text style={styles.sub}>
          Sent to <Text style={styles.bold}>+389 70 234 567</Text>. <Text style={styles.bold}>Change</Text>
        </Text>
        <View style={styles.digitsRow}>
          {digits.map((d, i) => (
            <View
              key={i}
              style={[
                styles.digit,
                {
                  borderColor: i === 4 ? T.ink : T.hairline,
                  backgroundColor: d ? '#fff' : T.surfaceAlt,
                },
              ]}
            >
              <Text style={styles.digitText}>{d}</Text>
              {i === 4 && <View style={styles.cursor} />}
            </View>
          ))}
        </View>
        <Text style={styles.resend}>
          Didn't get it? <Text style={styles.bold}>Resend in 28s</Text>
        </Text>
        <View style={{ marginTop: 28 }}>
          <Button variant="primary" size="lg" onPress={() => nav.replace('Tabs', { screen: 'HomeTab' })}>
            Verify
          </Button>
        </View>
        <View style={styles.callout}>
          <View style={styles.calloutIcon}>
            <Icon name="chat" color={T.gold} size={18} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.calloutTitle}>SMS auto-fill on</Text>
            <Text style={styles.calloutSub}>We'll fill it in for you as soon as it arrives.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: T.ink, letterSpacing: -0.4, lineHeight: 26, fontFamily: T.font },
  sub: { fontSize: 13, color: T.muted, marginTop: 8, fontFamily: T.font },
  bold: { color: T.ink, fontWeight: '600', fontFamily: T.font },
  digitsRow: { marginTop: 28, flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  digit: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  digitText: { fontSize: 24, fontWeight: '800', color: T.ink, fontFamily: T.mono },
  cursor: { position: 'absolute', bottom: 12, width: 2, height: 26, backgroundColor: T.gold },
  resend: { textAlign: 'center', marginTop: 24, fontSize: 13, color: T.muted, fontFamily: T.font },
  callout: {
    marginTop: 14,
    padding: 12,
    backgroundColor: T.surfaceAlt,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  calloutIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutTitle: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  calloutSub: { fontSize: 11, color: T.muted, fontFamily: T.font },
});
