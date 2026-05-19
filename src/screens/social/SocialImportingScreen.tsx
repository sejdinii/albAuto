import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/lib/auth';
import { extractFromCaption } from '@/lib/db';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SAMPLE = `2024 BMW M3 Competition, only 4,200 km, M xDrive, Brooklyn Grey, full warranty. EU Specs. Asking €121,300. Located in Skopje. DM for test drive 🔥 #bmw #m3`;

export function SocialImportingScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { dealer, session, ensureDealer } = useAuth();
  const [caption, setCaption] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!session) {
      Alert.alert('Sign in', 'Sign in first to use AI extraction.');
      return;
    }
    if (caption.trim().length < 10) {
      Alert.alert('Paste a caption', 'Paste the post caption (10+ chars) so the AI has something to read.');
      return;
    }
    setBusy(true);
    try {
      const d = dealer ?? (await ensureDealer(session.user.user_metadata?.name ?? 'Dealer'));
      await extractFromCaption({
        dealerId: d.id,
        caption: caption.trim(),
        photoUrl: photoUrl.trim() || undefined,
        source: 'instagram',
      });
      nav.navigate('SocialImported');
    } catch (err: any) {
      Alert.alert('Extraction failed', err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <TopBar
        title="Import a post"
        subtitle="Paste a caption — AI does the rest"
        leading="close"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Post caption</Text>
        <TextInput
          style={styles.area}
          placeholder="Paste the Instagram or Facebook caption here…"
          placeholderTextColor={T.muted}
          multiline
          value={caption}
          onChangeText={setCaption}
        />
        <Pressable onPress={() => setCaption(SAMPLE)} style={styles.sampleBtn}>
          <Icon name="sparkles" color={T.goldDark} size={14} />
          <Text style={styles.sampleText}>Use a sample caption</Text>
        </Pressable>

        <Text style={[styles.label, { marginTop: 16 }]}>Photo URL (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://…"
          placeholderTextColor={T.muted}
          autoCapitalize="none"
          autoCorrect={false}
          value={photoUrl}
          onChangeText={setPhotoUrl}
        />
        <Text style={styles.hint}>Sending a photo lets Claude read the year on the dashboard / number plate.</Text>

        <View style={styles.note}>
          <Icon name="sparkles" color={T.goldDark} size={18} />
          <Text style={styles.noteText}>
            <Text style={styles.noteBold}>Tip:</Text> The fuller the caption, the better. Include
            mileage, price, year, location.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <Button variant="primary" size="lg" iconRight="sparkles" onPress={run} disabled={busy}>
          {busy ? <ActivityIndicator color={T.ink} /> : 'Extract with AI'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  label: {
    fontSize: 12,
    color: T.body,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 6,
    fontFamily: T.font,
  },
  area: {
    minHeight: 140,
    borderWidth: 1.5,
    borderColor: T.hairline,
    borderRadius: 14,
    padding: 14,
    fontFamily: T.font,
    fontSize: 14,
    color: T.ink,
    textAlignVertical: 'top',
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: T.hairline,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontFamily: T.font,
    fontSize: 14,
    color: T.ink,
  },
  hint: { marginTop: 6, fontSize: 11, color: T.muted, fontFamily: T.font },
  sampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: T.goldTint,
    borderRadius: 8,
  },
  sampleText: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  note: {
    marginTop: 16,
    padding: 12,
    backgroundColor: T.goldTint,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  noteText: { flex: 1, fontSize: 12, color: T.body, lineHeight: 17, fontFamily: T.font },
  noteBold: { fontWeight: '700', color: T.ink },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
