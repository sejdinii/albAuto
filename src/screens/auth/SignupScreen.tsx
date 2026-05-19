import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SignupScreen() {
  const nav = useNavigation<Nav>();
  return (
    <View style={styles.root}>
      <TopBar title="Create account" leading="back" variant="white" onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Let's set you up</Text>
        <Text style={styles.step}>Step 1 of 3 — your details</Text>
        <View style={styles.progressBg}>
          <View style={styles.progressFg} />
        </View>
        <View style={styles.form}>
          <Field label="Full name" value="Andrej Mitrev" icon="menu" />
          <Field label="Email" value="andrej.m@example.com" icon="mail" keyboardType="email-address" />
          <Field label="Phone" value="+389 70 234 567" icon="phone" keyboardType="phone-pad" />
          <Field label="Password" placeholder="Min 8 characters" icon="lock" focused secureTextEntry />
          <View style={styles.callout}>
            <Icon name="shield" color={T.goldDark} size={16} />
            <Text style={styles.calloutText}>
              We never share your number publicly. Buyers contact you through the in-app chat first.
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 18 }}>
          <Button variant="primary" size="lg" iconRight="chevR" onPress={() => nav.navigate('Otp')}>
            Continue
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: T.ink, letterSpacing: -0.4, fontFamily: T.font },
  step: { fontSize: 12, color: T.muted, marginTop: 4, fontFamily: T.font },
  progressBg: {
    height: 4,
    backgroundColor: T.hairline,
    borderRadius: 99,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFg: { width: '33%', height: '100%', backgroundColor: T.gold },
  form: { marginTop: 18, gap: 12 },
  callout: {
    marginTop: 4,
    padding: 10,
    backgroundColor: T.goldTint,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 8,
  },
  calloutText: { flex: 1, fontSize: 11, color: T.body, lineHeight: 16, fontFamily: T.font },
});
