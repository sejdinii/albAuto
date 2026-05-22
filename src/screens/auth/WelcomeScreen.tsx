import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Icon } from '@/components/Icon';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function WelcomeScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const goToApp = () => nav.reset({ index: 0, routes: [{ name: 'Tabs', params: { screen: 'HomeTab' } }] });
  return (
    <View style={styles.root}>
      <Pressable
        onPress={goToApp}
        hitSlop={12}
        style={[styles.skip, { top: insets.top + 12 }]}
      >
        <Icon name="close" color="rgba(255,255,255,0.7)" size={20} strokeWidth={2.2} />
      </Pressable>
      <View style={styles.hero}>
        <Svg
          viewBox="0 0 400 240"
          preserveAspectRatio="xMidYMid meet"
          style={styles.heroCar}
          width="100%"
          height={240}
        >
          <Path
            d="M40 170 Q44 130 80 120 L150 100 Q200 86 250 92 L320 105 Q360 116 380 138 L395 150 Q400 165 392 175 L370 192 Q368 210 350 210 Q332 210 330 192 L130 192 Q128 210 110 210 Q92 210 90 192 L62 192 Q42 188 40 170 Z"
            fill="rgba(245,166,35,0.95)"
          />
          <Path
            d="M120 116 L170 100 Q200 92 240 96 L300 110 L322 140 L110 140 Z"
            fill="rgba(255,255,255,0.18)"
          />
        </Svg>
        <View style={[styles.logoWrap, { top: insets.top + 70 }]}>
          <Logo size={32} dark />
        </View>
      </View>
      <View style={styles.sheet}>
        <Text style={styles.title}>The Balkan car market,{'\n'}in your pocket.</Text>
        <Text style={styles.sub}>
          Buy and sell across Macedonia, Albania and Kosovo, or import from anywhere in Europe.
        </Text>
        <View style={styles.btns}>
          <Button variant="primary" size="lg" onPress={() => nav.navigate('Signup')}>
            Continue with email
          </Button>
          <Button variant="outline" size="lg" icon="apple" onPress={() => nav.navigate('Otp')}>
            Continue with Apple
          </Button>
          <Button variant="outline" size="lg" icon="google" onPress={() => nav.navigate('Otp')}>
            Continue with Google
          </Button>
        </View>
        <View style={styles.signinRow}>
          <Text style={styles.signinText}>Have an account? </Text>
          <Pressable onPress={() => nav.navigate('Login')}>
            <Text style={styles.signinLink}>Log in</Text>
          </Pressable>
        </View>
        <Pressable onPress={goToApp} style={styles.browseRow} hitSlop={6}>
          <Text style={styles.browseText}>Just browse for now →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F0F10' },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 440,
    backgroundColor: '#1A1410',
  },
  heroCar: { position: 'absolute', bottom: -10, left: 0, right: 0 },
  logoWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  sheet: {
    position: 'absolute',
    top: 380,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: T.ink,
    letterSpacing: -0.6,
    lineHeight: 30,
    fontFamily: T.font,
  },
  sub: {
    fontSize: 13,
    color: T.body,
    marginTop: 10,
    lineHeight: 20,
    fontFamily: T.font,
  },
  btns: { marginTop: 24, gap: 10 },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signinText: { fontSize: 12, color: T.muted, fontFamily: T.font },
  signinLink: {
    fontSize: 12,
    color: T.ink,
    fontWeight: '700',
    textDecorationLine: 'underline',
    fontFamily: T.font,
  },
  skip: {
    position: 'absolute',
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  browseRow: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 6,
  },
  browseText: {
    fontSize: 12,
    color: T.muted,
    fontWeight: '500',
    fontFamily: T.font,
  },
});
