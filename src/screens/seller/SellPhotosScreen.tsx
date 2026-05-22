import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useSellDraft } from '@/lib/sellFlow';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SellPhotosScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { draft, set } = useSellDraft();
  const slots = 8;

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Photo library access is required to pick photos.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: slots - draft.photos.length,
      quality: 0.8,
    });
    if (res.canceled) return;
    set('photos', [...draft.photos, ...res.assets.map((a) => ({ uri: a.uri }))]);
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Camera access is required.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (res.canceled) return;
    set('photos', [...draft.photos, ...res.assets.map((a) => ({ uri: a.uri }))]);
  };

  const remove = (i: number) => {
    set('photos', draft.photos.filter((_, idx) => idx !== i));
  };

  const makeCover = (i: number) => {
    if (i === 0) return;
    const next = [...draft.photos];
    const [picked] = next.splice(i, 1);
    next.unshift(picked);
    set('photos', next);
  };

  const filled = draft.photos.length;

  return (
    <View style={styles.root}>
      <TopBar
        title="Photos & video"
        subtitle="Step 5 of 7"
        leading="close"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={styles.progress}><View style={[styles.progressFill, { width: '60%' }]} /></View>
        <Text style={styles.title}>{filled >= 4 ? 'Looking sharp' : 'Add at least 4 photos'}</Text>
        <Text style={styles.sub}>Listings with 8+ photos get 3× more views.</Text>

        <View style={styles.grid}>
          {Array.from({ length: slots }).map((_, i) => {
            const photo = draft.photos[i];
            if (!photo) {
              return (
                <Pressable key={i} onPress={pickFromLibrary} style={[styles.slot, styles.slotEmpty]}>
                  <View style={styles.empty}>
                    <Icon name="plus" color={T.muted} size={18} />
                    <Text style={styles.emptyText}>{i + 1}</Text>
                  </View>
                </Pressable>
              );
            }
            return (
              <Pressable key={i} onPress={() => makeCover(i)} style={[styles.slot, styles.slotFilled]}>
                <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFillObject} />
                {i === 0 && (
                  <View style={styles.cover}>
                    <Text style={styles.coverText}>COVER</Text>
                  </View>
                )}
                <Pressable onPress={() => remove(i)} style={styles.del}>
                  <Icon name="close" color="#fff" size={11} strokeWidth={2.4} />
                </Pressable>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sourceRow}>
          <Pressable onPress={takePhoto} style={styles.sourceCell}>
            <Icon name="camera" color={T.ink} size={18} />
            <Text style={styles.sourceText}>Camera</Text>
          </Pressable>
          <Pressable onPress={pickFromLibrary} style={styles.sourceCell}>
            <Icon name="upload" color={T.ink} size={18} />
            <Text style={styles.sourceText}>From library</Text>
          </Pressable>
        </View>

        <View style={styles.hint}>
          <Icon name="sparkles" color={T.goldDark} size={16} />
          <Text style={styles.hintText}>
            Tap a photo to make it the cover. The cover shows first in search results.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <Button variant="primary" size="md" iconRight="chevR" onPress={() => nav.navigate('SellSummary')}>
          {filled === 0 ? 'Skip photos' : `Continue · ${filled} of ${slots}`}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  progress: { height: 4, backgroundColor: T.hairline, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: T.gold },
  title: { fontSize: 18, fontWeight: '800', color: T.ink, marginTop: 14, letterSpacing: -0.3, fontFamily: T.font },
  sub: { fontSize: 12, color: T.muted, marginTop: 4, fontFamily: T.font },
  grid: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { width: '31.5%', aspectRatio: 1, borderRadius: 10, overflow: 'hidden', position: 'relative' },
  slotFilled: { backgroundColor: '#000' },
  slotEmpty: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: T.hairline, backgroundColor: '#fff' },
  cover: { position: 'absolute', top: 4, left: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: T.gold },
  coverText: { color: T.ink, fontSize: 9, fontWeight: '800', fontFamily: T.font },
  del: { position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 99, backgroundColor: 'rgba(15,15,16,0.6)', alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  emptyText: { fontSize: 10, color: T.muted, fontWeight: '600', fontFamily: T.font },
  sourceRow: { marginTop: 12, flexDirection: 'row', gap: 10 },
  sourceCell: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sourceText: { fontSize: 12, fontWeight: '700', color: T.ink, fontFamily: T.font },
  hint: {
    marginTop: 16,
    padding: 12,
    backgroundColor: T.goldTint,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  hintText: { flex: 1, fontSize: 11, color: T.body, lineHeight: 15, fontFamily: T.font },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
