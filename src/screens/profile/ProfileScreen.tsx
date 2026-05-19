import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T } from '@/theme/tokens';
import { Icon, IconName } from '@/components/Icon';
import { useAuth } from '@/lib/auth';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProfileScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { session, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    nav.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  const userName = session?.user.user_metadata?.name ?? session?.user.email ?? 'Guest';
  const userInit = (userName[0] ?? 'G').toUpperCase();
  const userMeta = session
    ? `Signed in as ${session.user.email}`
    : 'Not signed in — tap Sign in below';
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.gold, { paddingTop: Math.max(insets.top, 16) }]}>
          <View style={styles.headerRow}>
            <Icon name="back" color={T.ink} size={22} />
            <Text style={styles.headerTitle}>Account</Text>
            <Icon name="cog" color={T.ink} size={20} />
          </View>
          <View style={styles.userRow}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInit}>{userInit}</Text>
              {session && (
                <View style={styles.userVerified}>
                  <Icon name="verified" color={T.gold} size={22} />
                </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userMeta}>{userMeta}</Text>
              {session && (
                <View style={styles.verifiedBadge}>
                  <Icon name="verified" color={T.gold} size={10} />
                  <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.quickRow}>
          <Pressable onPress={() => nav.navigate('DealerDash')} style={{ flex: 1 }}>
            <QuickAction icon="doc" title="My ads" sub="5 active · 2 sold" dark />
          </Pressable>
          <Pressable onPress={() => nav.navigate('SavedSearches')} style={{ flex: 1 }}>
            <QuickAction icon="bell" title="My searches" sub="3 alerts · 11 new" />
          </Pressable>
        </View>
        <View style={styles.menuWrap}>
          <Group title="Account">
            <MenuItem icon="menu" label="Profile" sub="Photo, bio, public info" />
            <MenuItem icon="cog" label="Settings" />
            <MenuItem icon="bell" label="Notifications" detail="3" />
            <MenuItem icon="shield" label="Security" sub="Password, 2-step verify" last />
          </Group>
          <Group title="Marketplace">
            <MenuItem icon="cal" label="My appointments" onPress={() => nav.navigate('Appointment')} />
            <MenuItem icon="scale" label="Compare cars" detail="2" onPress={() => nav.navigate('Compare')} />
            <MenuItem icon="history" label="Recently viewed" onPress={() => nav.navigate('Recent')} />
            <MenuItem icon="gauge" label="Financing calculator" onPress={() => nav.navigate('Financing')} last />
          </Group>
          <Group title="Dealer tools">
            <MenuItem icon="building" label="Switch to dealer mode" badge="NEW" onPress={() => nav.navigate('DealerDash')} />
            <MenuItem icon="instagram" label="Connect Instagram" onPress={() => nav.navigate('SocialConnect')} />
            <MenuItem icon="analytics" label="Listing analytics" onPress={() => nav.navigate('DealerDash')} last />
          </Group>
          <Group title="Support">
            <MenuItem icon="questionmark" label="Help & FAQ" />
            <MenuItem icon="doc" label="Terms & privacy" last />
          </Group>
          {session ? (
            <Pressable
              onPress={() => Alert.alert('Sign out?', 'You can sign back in anytime.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign out', style: 'destructive', onPress: handleSignOut },
              ])}
              style={styles.signOut}
            >
              <Icon name="close" color={T.red} size={18} />
              <Text style={styles.signOutText}>Sign out</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => nav.navigate('Welcome')} style={styles.signIn}>
              <Icon name="lock" color={T.ink} size={18} />
              <Text style={styles.signInText}>Sign in</Text>
            </Pressable>
          )}
          <View style={styles.city}>
            <Icon name="pin" color={T.gold} size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cityLabel}>BROWSING IN</Text>
              <Text style={styles.cityName}>All cities</Text>
            </View>
            <Icon name="chevR" color={T.muted} size={16} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function QuickAction({ icon, title, sub, dark }: { icon: IconName; title: string; sub: string; dark?: boolean }) {
  return (
    <View style={[styles.quick, { backgroundColor: dark ? T.ink : '#fff', borderWidth: dark ? 0 : StyleSheet.hairlineWidth }]}>
      <View style={[styles.quickIcon, { backgroundColor: dark ? T.gold : T.goldTint }]}>
        <Icon name={icon} color={dark ? T.ink : T.goldDark} size={18} strokeWidth={2} />
      </View>
      <Text style={[styles.quickTitle, { color: dark ? '#fff' : T.ink }]}>{title}</Text>
      <Text style={[styles.quickSub, { color: dark ? 'rgba(255,255,255,0.6)' : T.muted }]}>{sub}</Text>
    </View>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  sub,
  detail,
  badge,
  onPress,
  last,
}: {
  icon: IconName;
  label: string;
  sub?: string;
  detail?: string;
  badge?: string;
  onPress?: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.menuRow,
        { borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth },
      ]}
    >
      <View style={styles.menuIconWrap}>
        <Icon name={icon} color={T.goldDark} size={16} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.menuLabel}>{label}</Text>
          {badge && (
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>{badge}</Text>
            </View>
          )}
        </View>
        {sub && <Text style={styles.menuSub}>{sub}</Text>}
      </View>
      {detail && (
        <View style={styles.menuDetail}>
          <Text style={styles.menuDetailText}>{detail}</Text>
        </View>
      )}
      <Icon name="chevR" color={T.muted} size={14} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  gold: { backgroundColor: T.gold, paddingBottom: 24 },
  headerRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800', color: T.ink, fontFamily: T.font },
  userRow: { paddingHorizontal: 16, paddingTop: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  userInit: { color: T.gold, fontSize: 22, fontWeight: '800', fontFamily: T.font },
  userVerified: { position: 'absolute', bottom: -4, right: -4 },
  userName: { fontSize: 17, fontWeight: '800', color: T.ink, letterSpacing: -0.3, fontFamily: T.font },
  userMeta: { fontSize: 11, color: 'rgba(15,15,16,0.65)', fontFamily: T.font },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: T.ink,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  verifiedBadgeText: { color: T.gold, fontSize: 10, fontWeight: '800', letterSpacing: 0.4, fontFamily: T.font },
  quickRow: { paddingHorizontal: 16, flexDirection: 'row', gap: 8, marginTop: -14 },
  quick: { padding: 14, borderRadius: 14, borderColor: T.hairline, overflow: 'hidden' },
  quickIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: { fontSize: 14, fontWeight: '800', marginTop: 10, letterSpacing: -0.2, fontFamily: T.font },
  quickSub: { fontSize: 11, marginTop: 2, fontFamily: T.font },
  menuWrap: { padding: 16, paddingTop: 14 },
  groupTitle: {
    fontSize: 10,
    color: T.muted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
    paddingHorizontal: 4,
    fontFamily: T.font,
  },
  group: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomColor: T.hairline,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: T.goldTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  menuSub: { fontSize: 11, color: T.muted, marginTop: 1, fontFamily: T.font },
  menuBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: T.gold,
  },
  menuBadgeText: { color: T.ink, fontSize: 9, fontWeight: '800', fontFamily: T.font },
  menuDetail: {
    backgroundColor: T.surfaceAlt,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  menuDetailText: { fontSize: 11, color: T.ink, fontWeight: '700', fontFamily: T.mono },
  city: {
    marginTop: 14,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cityLabel: { fontSize: 11, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5 },
  cityName: { fontSize: 14, fontWeight: '700', color: T.ink, marginTop: 2, fontFamily: T.font },
  signOut: {
    marginTop: 4,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  signOutText: { fontSize: 13, fontWeight: '700', color: T.red, fontFamily: T.font },
  signIn: {
    marginTop: 4,
    padding: 14,
    backgroundColor: T.ink,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  signInText: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: T.font },
});
