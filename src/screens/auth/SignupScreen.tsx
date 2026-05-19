import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/lib/auth';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SignupScreen() {
  const nav = useNavigation<Nav>();
  const { signUpWithPassword } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || password.length < 8) {
      Alert.alert('Missing info', 'Enter an email and a password (min 8 chars).');
      return;
    }
    setBusy(true);
    try {
      await signUpWithPassword({ email: email.trim(), password, name, phone });
      Alert.alert('Check your inbox', 'We sent you a confirmation link.', [
        { text: 'OK', onPress: () => nav.navigate('Login') },
      ]);
    } catch (err: any) {
      Alert.alert('Could not sign up', err?.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <TopBar title="Create account" leading="back" variant="white" onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Let's set you up</Text>
        <Text style={styles.step}>Step 1 of 3 — your details</Text>
        <View style={styles.progressBg}>
          <View style={styles.progressFg} />
        </View>
        <View style={styles.form}>
          <Field label="Full name" value={name} onChangeText={setName} placeholder="Andrej Mitrev" icon="menu" />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            icon="mail"
            keyboardType="email-address"
          />
          <Field
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="+389 70 ..."
            icon="phone"
            keyboardType="phone-pad"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Min 8 characters"
            icon="lock"
            secureTextEntry
          />
          <View style={styles.callout}>
            <Icon name="shield" color={T.goldDark} size={16} />
            <Text style={styles.calloutText}>
              We never share your number publicly. Buyers contact you through the in-app chat first.
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 18 }}>
          <Button variant="primary" size="lg" iconRight="chevR" onPress={onSubmit} disabled={busy}>
            {busy ? <ActivityIndicator color={T.ink} /> : 'Continue'}
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
