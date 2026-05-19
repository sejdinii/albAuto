import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { useAuth } from '@/lib/auth';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function LoginScreen() {
  const nav = useNavigation<Nav>();
  const { signInWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      await signInWithPassword(email.trim(), password);
      nav.reset({ index: 0, routes: [{ name: 'Tabs', params: { screen: 'HomeTab' } }] });
    } catch (err: any) {
      Alert.alert('Could not sign in', err?.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <TopBar title="Log in" leading="back" variant="white" onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to continue browsing.</Text>
        <View style={styles.form}>
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            icon="mail"
            keyboardType="email-address"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            icon="lock"
            secureTextEntry
          />
          <View style={styles.forgotRow}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button variant="primary" size="lg" onPress={onSubmit} disabled={busy}>
            {busy ? <ActivityIndicator color={T.ink} /> : 'Log in'}
          </Button>
        </View>
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.line} />
        </View>
        <View style={{ gap: 10 }}>
          <Button variant="outline" size="md" icon="apple">Continue with Apple</Button>
          <Button variant="outline" size="md" icon="google">Continue with Google</Button>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.sub}>New here? </Text>
          <Pressable onPress={() => nav.navigate('Signup')}>
            <Text style={styles.bold}>Create an account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: T.ink,
    letterSpacing: -0.4,
    lineHeight: 28,
    fontFamily: T.font,
  },
  sub: { fontSize: 13, color: T.muted, marginTop: 6, fontFamily: T.font },
  form: { marginTop: 24, gap: 12 },
  forgotRow: { alignItems: 'flex-end' },
  forgot: { fontSize: 12, color: T.ink, fontWeight: '600', fontFamily: T.font },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: T.hairline },
  or: { fontSize: 11, color: T.muted, letterSpacing: 1, fontFamily: T.font },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  bold: { fontSize: 12, color: T.ink, fontWeight: '700', fontFamily: T.font, marginTop: 6 },
});
